import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  CONFIDENCE_LEVELS,
  ROUTE_POLICIES,
  RoutePriorityQueue,
  planResearchRoute,
  summarizeRouteEvidence,
} from '../src/lib/route-planner.js';
import {
  ROUTE_USAGE,
  executeRoutePlan,
  formatRouteComparisonMarkdown,
  formatRouteMarkdown,
  parseRouteArguments,
} from '../scripts/plan-route.mjs';

const nodes = [
  { id: 'a', title: 'A' },
  { id: 'b', title: 'B' },
  { id: 'c', title: 'C' },
  { id: 'd', title: 'D' },
  { id: 'e', title: 'E' },
];
const edges = [
  { id: 'ab-spec', source: 'a', target: 'b', confidence: 'speculative', relation: 'tests', mechanism: 'speculative shortcut', references: [] },
  { id: 'bd-formal', source: 'b', target: 'd', confidence: 'formal', relation: 'proves', mechanism: 'checked step', references: [{ label: 'Lean', url: 'https://example.test/lean', scope: 'formalization' }] },
  { id: 'ac-lit', source: 'a', target: 'c', confidence: 'literature', relation: 'uses', mechanism: 'first sourced step', references: [{ label: 'Paper', url: 'https://example.test/paper', scope: 'claim' }] },
  { id: 'ce-lit', source: 'c', target: 'e', confidence: 'literature', relation: 'uses', mechanism: 'second sourced step', references: [{ label: 'Paper', url: 'https://example.test/paper', scope: 'claim' }] },
  { id: 'ed-lit', source: 'e', target: 'd', confidence: 'literature', relation: 'supports', mechanism: 'third sourced step', references: [{ label: 'Context', url: 'https://example.test/context', scope: 'context' }] },
  { id: 'ad-heur', source: 'a', target: 'd', confidence: 'heuristic', relation: 'suggests', mechanism: 'one-hop heuristic', references: [{ label: 'Note', url: 'https://example.test/note', scope: 'context' }] },
  { id: 'invalid-source', source: 'missing', target: 'd', confidence: 'formal' },
  { id: 'invalid-target', source: 'a', target: 'missing', confidence: 'formal' },
];



test('route priority queue selects the lower-priority right child during heap repair', () => {
  const queue = new RoutePriorityQueue((left, right) => left - right);
  for (const value of [1, 4, 2, 5, 6, 3]) queue.push(value);
  assert.deepEqual([queue.pop(), queue.pop(), queue.pop(), queue.pop(), queue.pop(), queue.pop()], [1, 2, 3, 4, 5, 6]);
  assert.equal(queue.size, 0);
});

test('route policies expose deterministic evidence trade-offs', () => {
  assert.deepEqual(CONFIDENCE_LEVELS, ['formal', 'literature', 'heuristic', 'speculative']);
  assert.deepEqual(ROUTE_POLICIES, ['shortest', 'balanced', 'strongest']);

  const shortest = planResearchRoute(nodes, edges, 'a', 'd', { policy: 'shortest', directed: true });
  assert.deepEqual(shortest?.edges, ['ad-heur']);
  assert.equal(shortest?.score.weakest_confidence, 'heuristic');

  const balanced = planResearchRoute(nodes, edges, 'a', 'd', { policy: 'balanced', directed: true });
  assert.deepEqual(balanced?.edges, ['ad-heur']);
  assert.equal(balanced?.score.total_risk, 3);

  const strongest = planResearchRoute(nodes, edges, 'a', 'd', { policy: 'strongest', directed: true });
  assert.deepEqual(strongest?.edges, ['ac-lit', 'ce-lit', 'ed-lit']);
  assert.deepEqual(strongest?.score, {
    policy: 'strongest', hops: 3, max_risk: 1, total_risk: 3, weakest_confidence: 'literature',
  });

  assert.throws(
    () => planResearchRoute(nodes, edges, 'a', 'd', { policy: 'unknown', directed: true }),
    /Unknown route policy/,
  );
});

test('route constraints handle evidence gates, direction, limits and invalid endpoints', () => {
  assert.deepEqual(
    planResearchRoute(nodes, edges, 'a', 'd', {
      directed: true, allowedConfidence: ['formal', 'literature'],
    })?.edges,
    ['ac-lit', 'ce-lit', 'ed-lit'],
  );
  assert.equal(planResearchRoute(nodes, edges, 'd', 'a', { directed: true }), null);
  assert.deepEqual(planResearchRoute(nodes, edges, 'd', 'a')?.nodes, ['d', 'e', 'c', 'a']);
  assert.deepEqual(planResearchRoute(nodes, edges, 'a', 'a')?.score, {
    policy: 'strongest', hops: 0, max_risk: 0, total_risk: 0, weakest_confidence: null,
  });
  assert.equal(planResearchRoute(nodes, edges, 'missing', 'a'), null);
  assert.equal(planResearchRoute(nodes, edges, 'a', 'missing'), null);
  assert.equal(planResearchRoute(nodes, edges, 'a', 'd', { maxEdges: 0 }), null);
  assert.throws(
    () => planResearchRoute(nodes, edges, 'a', 'd', { allowedConfidence: 'formal' }),
    /allowedConfidence must be an array/,
  );
  assert.throws(
    () => planResearchRoute(nodes, edges, 'a', 'd', { allowedConfidence: ['formal', 'magic'] }),
    /Unknown route confidence/,
  );
  assert.throws(() => planResearchRoute(nodes, edges, 'a', 'd', { maxEdges: Number.NaN }), /maxEdges/);
  assert.throws(() => planResearchRoute(nodes, edges, 'a', 'd', { maxEdges: 1.9 }), /maxEdges/);
  assert.throws(() => planResearchRoute(nodes, edges, 'a', 'd', { maxEdges: -2 }), /maxEdges/);
  assert.deepEqual(planResearchRoute(nodes, edges, 'a', 'd', { maxEdges: 1_000_000 })?.edges, ['ac-lit', 'ce-lit', 'ed-lit']);
});

test('equal-score routes use node and edge IDs as stable tie-breakers', () => {
  const tieNodes = [{ id: 'a' }, { id: 'x' }, { id: 'd' }];
  const tieEdges = [
    { id: 'z-edge', source: 'a', target: 'x', confidence: 'formal' },
    { id: 'a-edge', source: 'a', target: 'x', confidence: 'formal' },
    { id: 'x-d', source: 'x', target: 'd', confidence: 'formal' },
  ];
  const route = planResearchRoute(tieNodes, tieEdges, 'a', 'd', { directed: true, policy: 'shortest' });
  assert.deepEqual(route?.edges, ['a-edge', 'x-d']);
  assert.equal(route?.score.weakest_confidence, 'formal');
});


test('route planning keeps non-dominated risk labels whose ordering changes after a weak edge', () => {
  const fixtureNodes = ['s', 'a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'x', 't']
    .map((id) => ({ id }));
  const fixtureEdges = [
    { id: 's-a1', source: 's', target: 'a1', confidence: 'literature' },
    { id: 'a1-a2', source: 'a1', target: 'a2', confidence: 'literature' },
    { id: 'a2-a3', source: 'a2', target: 'a3', confidence: 'literature' },
    { id: 'a3-x', source: 'a3', target: 'x', confidence: 'literature' },
    { id: 's-b1', source: 's', target: 'b1', confidence: 'heuristic' },
    { id: 'b1-b2', source: 'b1', target: 'b2', confidence: 'formal' },
    { id: 'b2-b3', source: 'b2', target: 'b3', confidence: 'formal' },
    { id: 'b3-x', source: 'b3', target: 'x', confidence: 'formal' },
    { id: 'x-t', source: 'x', target: 't', confidence: 'speculative' },
  ];
  const route = planResearchRoute(fixtureNodes, fixtureEdges, 's', 't', {
    directed: true,
    policy: 'strongest',
  });
  assert.deepEqual(route?.nodes, ['s', 'b1', 'b2', 'b3', 'x', 't']);
  assert.deepEqual(route?.edges, ['s-b1', 'b1-b2', 'b2-b3', 'b3-x', 'x-t']);
  assert.equal(route?.score.total_risk, 10);
});

test('route evidence summaries retain missing, unknown and source-scope detail', () => {
  assert.equal(summarizeRouteEvidence(null, edges), null);
  assert.deepEqual(summarizeRouteEvidence({ edges: [] }, edges), {
    total_edges: 0,
    by_confidence: { formal: 0, literature: 0, heuristic: 0, speculative: 0 },
    unknown_confidence: 0,
    weakest_confidence: null,
    references: 0,
    source_bearing_references: 0,
    unreferenced_edges: [],
    missing_edges: [],
  });
  const summary = summarizeRouteEvidence({ edges: ['bd-formal', 'ab-spec', 'unknown', 'missing'] }, [
    ...edges,
    { id: 'unknown', source: 'a', target: 'b', confidence: 'experimental', references: 'invalid' },
  ]);
  assert.deepEqual(summary?.by_confidence, { formal: 1, literature: 0, heuristic: 0, speculative: 1 });
  assert.equal(summary?.unknown_confidence, 1);
  assert.equal(summary?.weakest_confidence, null);
  assert.equal(summary?.references, 1);
  assert.equal(summary?.source_bearing_references, 1);
  assert.deepEqual(summary?.unreferenced_edges, ['ab-spec', 'unknown']);
  assert.deepEqual(summary?.missing_edges, ['missing']);
});



test('route planner validates malformed graph records and state limits', () => {
  assert.throws(() => planResearchRoute({}, [], 'a', 'b'), /inputs must be arrays/);
  assert.throws(() => planResearchRoute([], [], 'a', 'b', null), /options must be an object/);
  assert.throws(() => planResearchRoute([], [], 'a', 'b', []), /options must be an object/);
  assert.throws(() => planResearchRoute([{ id: '' }], [], '', ''), /non-empty IDs/);
  assert.throws(() => planResearchRoute([{ id: 'a' }, { id: 'a' }], [], 'a', 'a'), /Duplicate route node/);
  assert.throws(() => planResearchRoute([{ id: 'a' }, { id: 'b' }], [{ id: '', source: 'a', target: 'b', confidence: 'formal' }], 'a', 'b'), /non-empty IDs/);
  assert.throws(() => planResearchRoute([{ id: 'a' }, { id: 'b' }], [
    { id: 'edge', source: 'a', target: 'b', confidence: 'formal' },
    { id: 'edge', source: 'a', target: 'b', confidence: 'formal' },
  ], 'a', 'b'), /Duplicate route edge/);
  assert.throws(() => planResearchRoute(nodes, edges, 'a', 'd', { maxStates: 1 }), /state limit/);
  assert.throws(() => planResearchRoute(nodes, edges, 'a', 'd', { maxStates: 0 }), /positive integer/);
  assert.throws(() => planResearchRoute(nodes, edges, 'a', 'd', { maxStates: 1.5 }), /positive integer/);
});


test('Pareto labels prune cycles while retaining evidence trade-offs', () => {
  const fixtureNodes = ['s', 'a1', 'a2', 'a3', 'b', 'x', 't'].map((id) => ({ id }));
  const fixtureEdges = [
    { id: 's-a1', source: 's', target: 'a1', confidence: 'literature' },
    { id: 'a1-a2', source: 'a1', target: 'a2', confidence: 'literature' },
    { id: 'a2-a3', source: 'a2', target: 'a3', confidence: 'literature' },
    { id: 'a3-x', source: 'a3', target: 'x', confidence: 'literature' },
    { id: 's-b', source: 's', target: 'b', confidence: 'heuristic' },
    { id: 'b-x', source: 'b', target: 'x', confidence: 'formal' },
    { id: 'x-s-cycle', source: 'x', target: 's', confidence: 'formal' },
    { id: 'x-t', source: 'x', target: 't', confidence: 'speculative' },
  ];
  const route = planResearchRoute(fixtureNodes, fixtureEdges, 's', 't', {
    directed: true,
    policy: 'strongest',
    maxStates: 50,
  });
  assert.deepEqual(route?.edges, ['s-b', 'b-x', 'x-t']);
  assert.equal(route?.score.total_risk, 10);
  assert.equal(route?.nodes.length, new Set(route?.nodes).size);
});

test('stale Pareto labels and exhausted edge budgets are skipped deterministically', () => {
  const fixtureNodes = ['s', 'p1', 'p2', 'x', 't'].map((id) => ({ id }));
  const fixtureEdges = [
    { id: 's-p1', source: 's', target: 'p1', confidence: 'formal' },
    { id: 'p1-x', source: 'p1', target: 'x', confidence: 'heuristic' },
    { id: 's-p2', source: 's', target: 'p2', confidence: 'literature' },
    { id: 'p2-x', source: 'p2', target: 'x', confidence: 'formal' },
  ];
  assert.equal(planResearchRoute(fixtureNodes, fixtureEdges, 's', 't', {
    directed: true,
    policy: 'strongest',
  }), null);
  assert.equal(planResearchRoute(fixtureNodes, fixtureEdges, 's', 't', {
    directed: true,
    policy: 'shortest',
    maxEdges: 1,
  }), null);
});

test('equal-priority frontier states exercise deterministic heap ordering', () => {
  const frontierNodes = ['s', 'a', 'b', 'c', 't'].map((id) => ({ id }));
  const frontierEdges = [
    { id: 's-c', source: 's', target: 'c', confidence: 'formal' },
    { id: 's-b', source: 's', target: 'b', confidence: 'formal' },
    { id: 's-a', source: 's', target: 'a', confidence: 'formal' },
    { id: 'a-t', source: 'a', target: 't', confidence: 'formal' },
    { id: 'b-t', source: 'b', target: 't', confidence: 'formal' },
    { id: 'c-t', source: 'c', target: 't', confidence: 'formal' },
  ];
  assert.deepEqual(
    planResearchRoute(frontierNodes, frontierEdges, 's', 't', { directed: true, policy: 'shortest' })?.edges,
    ['s-a', 'a-t'],
  );
});

test('CLI argument parsing accepts positional and named forms and rejects ambiguity', () => {
  assert.equal(parseRouteArguments(['--help']).help, true);
  const parsed = parseRouteArguments([
    'a', 'd', '--policy=balanced', '--compare', '--allow', 'formal, literature', '--directed',
    '--max-edges', '4', '--format=json', '--nodes', './nodes.json', '--edges=./edges.json',
    '--output', './route.md',
  ]);
  assert.equal(parsed.source, 'a');
  assert.equal(parsed.target, 'd');
  assert.equal(parsed.policy, 'balanced');
  assert.equal(parsed.compare, true);
  assert.deepEqual(parsed.allowedConfidence, ['formal', 'literature']);
  assert.equal(parsed.directed, true);
  assert.equal(parsed.maxEdges, 4);
  assert.equal(parsed.format, 'json');
  assert.match(parsed.nodesPath, /nodes\.json$/);
  assert.match(parsed.edgesPath, /edges\.json$/);
  assert.match(parsed.outputPath, /route\.md$/);

  assert.equal(parseRouteArguments(['--from=a', '--to=d']).source, 'a');
  assert.throws(() => parseRouteArguments(['a', 'd', 'extra']), /Unexpected positional/);
  assert.throws(() => parseRouteArguments(['--policy']), /Missing value/);
  assert.throws(() => parseRouteArguments(['--wat', 'x']), /Unknown option/);
  assert.throws(() => parseRouteArguments(['a', 'd', '--policy', 'fast']), /Unknown route policy/);
  assert.throws(() => parseRouteArguments(['a', 'd', '--format', 'xml']), /Unknown output format/);
  assert.throws(() => parseRouteArguments(['a', 'd', '--allow', 'formal,magic']), /Unknown confidence/);
  assert.throws(() => parseRouteArguments(['a', 'd', '--max-edges', '-1']), /non-negative integer/);
  assert.throws(() => parseRouteArguments(['a', 'd', '--max-edges', '1.5']), /non-negative integer/);
});

test('CLI execution emits stable Markdown and JSON and supports output files', (context) => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-route-cli-'));
  context.after(() => rmSync(temporary, { recursive: true, force: true }));
  const nodesPath = join(temporary, 'nodes.json');
  const edgesPath = join(temporary, 'edges.json');
  const outputPath = join(temporary, 'route.md');
  writeFileSync(nodesPath, JSON.stringify(nodes));
  writeFileSync(edgesPath, JSON.stringify(edges));

  assert.deepEqual(executeRoutePlan(parseRouteArguments(['--help'])), { exitCode: 0, output: ROUTE_USAGE });
  assert.equal(executeRoutePlan(parseRouteArguments([])).exitCode, 2);

  const markdownOptions = parseRouteArguments([
    'a', 'd', '--nodes', nodesPath, '--edges', edgesPath, '--output', outputPath,
  ]);
  const markdown = executeRoutePlan(markdownOptions);
  assert.equal(markdown.exitCode, 0);
  assert.match(markdown.output, /Evidence-aware research route/);
  assert.match(markdown.output, /graph-derived navigation aid/);
  assert.match(readFileSync(outputPath, 'utf8'), /first sourced step/);
  assert.equal((markdown.output.match(/example\.test\/paper/g) ?? []).length, 1);

  const json = executeRoutePlan(parseRouteArguments([
    'a', 'd', '--nodes', nodesPath, '--edges', edgesPath, '--format', 'json', '--policy', 'shortest',
  ]));
  const jsonPayload = JSON.parse(json.output);
  assert.equal(jsonPayload.route.edges[0], 'ad-heur');
  assert.deepEqual(jsonPayload.constraints.allowed_confidence, [...CONFIDENCE_LEVELS]);
  assert.equal(jsonPayload.constraints.directed, false);


  const comparison = executeRoutePlan(parseRouteArguments([
    'a', 'd', '--compare', '--nodes', nodesPath, '--edges', edgesPath, '--format', 'json',
  ]));
  const comparisonPayload = JSON.parse(comparison.output);
  assert.deepEqual(comparisonPayload.routes.shortest.route.edges, ['ad-heur']);
  assert.deepEqual(comparisonPayload.routes.strongest.route.edges, ['ac-lit', 'ce-lit', 'ed-lit']);
  assert.match(formatRouteComparisonMarkdown(nodes, edges, comparisonPayload.routes), /## strongest/);

  const unreachable = executeRoutePlan(parseRouteArguments([
    'd', 'a', '--directed', '--nodes', nodesPath, '--edges', edgesPath,
  ]));
  assert.equal(unreachable.exitCode, 3);
  assert.match(unreachable.output, /No route found/);

  writeFileSync(nodesPath, '{}');
  assert.throws(() => executeRoutePlan(parseRouteArguments([
    'a', 'd', '--nodes', nodesPath, '--edges', edgesPath,
  ])), /JSON arrays/);
});

test('Markdown formatter degrades visibly when metadata is incomplete', () => {
  const route = {
    nodes: ['missing-node', 'd'],
    edges: ['missing-edge'],
    score: { policy: 'strongest', hops: 1 },
  };
  const markdown = formatRouteMarkdown(nodes, edges, route, {
    weakest_confidence: null, references: 0, source_bearing_references: 0,
  });
  assert.match(markdown, /missing-node/);
  assert.match(markdown, /Missing edge metadata/);
  const comparison = formatRouteComparisonMarkdown(nodes, edges, {
    shortest: { route, evidence: { weakest_confidence: null, references: 0, source_bearing_references: 0 } },
    balanced: null,
    strongest: null,
  });
  assert.match(comparison, /No route satisfies/);
});
