import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  buildWaypointRoute,
  evaluateEvidence,
  evaluateLeanInterfaces,
  evaluateRepository,
  evaluateRouteScenario,
  evaluateSearchCases,
  hasSourceBearingReference,
  scoreControlledCriteria,
} from '../scripts/lib/evaluation.mjs';

const read = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

const sampleNodes = [
  {
    id: 'a', title: 'Alpha', confidence: 'literature', references: [{ scope: 'claim' }],
    lean: { imports: ['Mathlib'], targets: ['prove alpha'], declarations: ['Alpha'] },
  },
  {
    id: 'b', title: 'Beta', confidence: 'formal', references: [{ scope: 'formalization' }],
    lean: { imports: ['Mathlib'], targets: ['prove beta'], declarations: [] },
  },
  {
    id: 'c', title: 'Gamma', confidence: 'heuristic', references: [{ scope: 'context' }],
    lean: { imports: ['Mathlib'], targets: ['test gamma'], declarations: [] },
  },
];
const sampleEdges = [
  {
    id: 'ab', source: 'a', target: 'b', confidence: 'literature',
    references: [{ scope: 'claim' }],
  },
  {
    id: 'bc', source: 'b', target: 'c', confidence: 'heuristic',
    references: [{ scope: 'context' }],
  },
];

const sampleScenario = {
  id: 'route.sample', title: 'Sample route', research_question: 'Can Alpha reach Gamma?',
  waypoints: ['a', 'b'], directed: true, maximum_edges: 1,
  permitted_confidence: ['literature'], expected_terminal: 'b',
};

const sampleRubric = {
  scope: 'test scope', exclusions: ['external evidence'],
  criteria: [
    { id: 'graph_integrity', title: 'Graph', weight: 20 },
    { id: 'evidence_traceability', title: 'Evidence', weight: 25 },
    { id: 'reproducible_retrieval', title: 'Retrieval', weight: 20 },
    { id: 'formalization_interfaces', title: 'Lean', weight: 15 },
    { id: 'automation_and_documentation', title: 'Automation', weight: 20 },
  ],
};

test('reference scopes distinguish source-bearing claims from context', () => {
  assert.equal(hasSourceBearingReference(sampleNodes[0]), true);
  assert.equal(hasSourceBearingReference(sampleNodes[2]), false);
  assert.equal(hasSourceBearingReference({}), false);
});

test('waypoint routes concatenate deterministic shortest-path segments', () => {
  assert.deepEqual(buildWaypointRoute(sampleNodes, sampleEdges, ['a', 'b', 'c'], true), {
    nodes: ['a', 'b', 'c'], edges: ['ab', 'bc'],
  });
  assert.equal(buildWaypointRoute(sampleNodes, sampleEdges, ['a'], true), null);
  assert.equal(buildWaypointRoute(sampleNodes, sampleEdges, ['c', 'a'], true), null);
});

test('search evaluation reports ranks and empty-suite metrics', () => {
  const result = evaluateSearchCases(sampleNodes, [
    { id: 'alpha', query: 'Alpha', expected_node: 'a' },
    { id: 'missing', query: 'unknown', expected_node: 'c' },
  ]);
  assert.equal(result.total, 2);
  assert.equal(result.cases[0].rank, 1);
  assert.equal(result.cases[1].rank, null);
  assert.equal(result.passed, false);
  assert.deepEqual(evaluateSearchCases(sampleNodes, []), {
    total: 0,
    top_1_accuracy: 0,
    recall_at_3: 0,
    mean_reciprocal_rank: 0,
    passed: true,
    cases: [],
  });
});

test('route evaluation exposes unreachable and evidence-gate failures', () => {
  const passed = evaluateRouteScenario(sampleNodes, sampleEdges, sampleScenario);
  assert.equal(passed.passed, true);
  assert.deepEqual(passed.route?.edges, ['ab']);

  const failed = evaluateRouteScenario(sampleNodes, sampleEdges, {
    ...sampleScenario,
    id: 'route.failed', waypoints: ['a', 'c'], maximum_edges: 1,
    permitted_confidence: ['formal'], expected_terminal: 'b',
  });
  assert.equal(failed.passed, false);
  assert.deepEqual(failed.disallowed_edges, ['ab', 'bc']);
  assert.equal(failed.checks.within_edge_budget, false);
  assert.equal(failed.checks.expected_terminal, false);

  const unreachable = evaluateRouteScenario(sampleNodes, sampleEdges, {
    ...sampleScenario, id: 'route.unreachable', waypoints: ['c', 'a'],
  });
  assert.deepEqual(unreachable, {
    id: 'route.unreachable', title: 'Sample route', passed: false,
    failure: 'unreachable', route: null,
  });
});

test('evidence and Lean interface metrics are explicit', () => {
  const evidence = evaluateEvidence(sampleNodes, sampleEdges);
  assert.equal(evidence.passed, true);
  assert.equal(evidence.source_bearing_node_total, 2);
  assert.equal(evidence.source_bearing_edge_total, 1);

  const lean = evaluateLeanInterfaces(sampleNodes);
  assert.equal(lean.passed, true);
  assert.equal(lean.nodes_with_named_declarations, 1);

  assert.equal(evaluateEvidence([...sampleNodes, { id: 'd', confidence: 'literature' }], sampleEdges).passed, false);
  assert.equal(evaluateLeanInterfaces([...sampleNodes, { id: 'd', lean: {} }]).passed, false);
});

test('controlled scoring awards only passing repository-owned criteria', () => {
  const score = scoreControlledCriteria(sampleRubric, {
    graph_integrity: true,
    evidence_traceability: true,
    reproducible_retrieval: false,
    formalization_interfaces: true,
    automation_and_documentation: false,
  });
  assert.equal(score.score, 60);
  assert.equal(score.maximum, 100);
  assert.equal(score.criteria[2].earned, 0);
});

test('canonical evaluation reaches the committed repository-controlled score', async () => {
  const [index, nodes, edges, scenarios, rubric] = await Promise.all([
    read('graph/index.json'), read('graph/nodes/core.json'), read('graph/edges.json'),
    read('evaluation/scenarios.json'), read('evaluation/quality-rubric.json'),
  ]);
  assert.equal(index.schema_version, '0.6.0');
  const result = evaluateRepository({
    nodes, edges, scenarios, rubric, repositoryChecks: [true, true, true, true],
  });
  assert.equal(result.passed, true);
  assert.equal(result.controlled_quality.score, 100);
  assert.equal(result.search.top_1_accuracy, 1);
  assert.equal(result.routes.passed_count, scenarios.route_scenarios.length);
});

test('repository evaluation detects malformed graph and missing automation checks', () => {
  const scenarios = { search_cases: [], route_scenarios: [] };
  const result = evaluateRepository({
    nodes: [sampleNodes[0], sampleNodes[0]],
    edges: [{ ...sampleEdges[0], target: 'missing' }],
    scenarios,
    rubric: sampleRubric,
    repositoryChecks: [true, false],
  });
  assert.equal(result.graph_integrity.passed, false);
  assert.equal(result.controlled_quality.score < 100, true);
  assert.equal(result.passed, false);
});
