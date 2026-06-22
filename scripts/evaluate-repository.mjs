import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateRepository } from './lib/evaluation.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const check = process.argv.includes('--check');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const index = readJson('graph/index.json');
const nodes = readJson(index.canonical_files.nodes);
const edges = readJson(index.canonical_files.edges);
const scenarios = readJson('evaluation/scenarios.json');
const rubric = readJson('evaluation/quality-rubric.json');
const packageJson = readJson('package.json');
const nodeById = new Map(nodes.map((node) => [node.id, node]));
const edgeById = new Map(edges.map((edge) => [edge.id, edge]));

const requiredDocs = [
  'docs/STATEMENT_OF_NEED.md',
  'docs/RELATED_WORK.md',
  'docs/REFERENCE_POLICY.md',
  'docs/USER_EVALUATION_PROTOCOL.md',
  'docs/REPRODUCIBILITY.md',
  'docs/BROWSER_TESTING.md',
  'docs/LIMITATIONS.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CODE_OF_CONDUCT.md',
];
const requiredScripts = [
  'check',
  'test:coverage',
  'test:e2e',
  'evaluate',
  'validate:evaluation',
  'usecase',
  'usecase:list',
];
const repositoryChecks = [
  requiredDocs.every((path) => existsSync(join(root, path))),
  requiredScripts.every((name) => typeof packageJson.scripts?.[name] === 'string'),
  existsSync(join(root, 'graph/reference-registry.json')),
  existsSync(join(root, 'lake-manifest.json')),
];
const evaluation = evaluateRepository({ nodes, edges, scenarios, rubric, repositoryChecks });
const results = {
  schema_version: '1.0.0',
  application_version: packageJson.version,
  graph_schema_version: index.schema_version,
  ...evaluation,
};

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function renderEvaluation() {
  return [
    '# Automated repository evaluation',
    '',
    'This report is generated deterministically from canonical graph data and committed scenarios. It evaluates retrieval, route reproducibility, traceability and repository-controlled quality; it does not evaluate scientific novelty or prove exploratory mechanisms.',
    '',
    '## Summary',
    '',
    `- Controlled quality score: **${results.controlled_quality.score}/${results.controlled_quality.maximum}**.`,
    `- Search top-1 accuracy: **${percent(results.search.top_1_accuracy)}** (${results.search.total} cases).`,
    `- Search recall@3: **${percent(results.search.recall_at_3)}**.`,
    `- Mean reciprocal rank: **${results.search.mean_reciprocal_rank.toFixed(4)}**.`,
    `- Route scenarios passing: **${results.routes.passed_count}/${results.routes.total}**.`,
    `- Nodes with references: **${results.evidence.nodes_with_references}/${results.evidence.node_total}**.`,
    `- Edges with references: **${results.evidence.edges_with_references}/${results.evidence.edge_total}**.`,
    `- Formal/literature node claim coverage: **${results.evidence.source_bearing_nodes_with_claim_or_formalization}/${results.evidence.source_bearing_node_total}**.`,
    `- Formal/literature edge claim coverage: **${results.evidence.source_bearing_edges_with_claim_or_formalization}/${results.evidence.source_bearing_edge_total}**.`,
    `- Nodes with bounded Lean targets: **${results.lean.nodes_with_bounded_targets}/${results.lean.node_total}**.`,
    '',
    '## Search regressions',
    '',
    '| Case | Query | Expected | Rank | Pass |',
    '| --- | --- | --- | ---: | :---: |',
    ...results.search.cases.map((item) =>
      `| \`${item.id}\` | ${item.query} | \`${item.expected_node}\` | ${item.rank ?? '—'} | ${item.passed ? 'yes' : 'no'} |`),
    '',
    '## Route regressions',
    '',
    '| Scenario | Edges | Evidence gate | References | Terminal | Pass |',
    '| --- | ---: | :---: | :---: | :---: | :---: |',
    ...results.routes.scenarios.map((item) => {
      if (!item.route) return `| \`${item.id}\` | — | no | no | no | no |`;
      return `| \`${item.id}\` | ${item.route.edges.length} | ${item.checks.permitted_evidence_only ? 'yes' : 'no'} | ${item.checks.all_edges_referenced ? 'yes' : 'no'} | ${item.checks.expected_terminal ? 'yes' : 'no'} | ${item.passed ? 'yes' : 'no'} |`;
    }),
    '',
    '## Interpretation',
    '',
    'Passing scenarios are regression fixtures: they show that the declared route is still retrievable under the stated direction, evidence and length constraints. They do not establish that the terminal research problem is solved or that the route is novel.',
    '',
  ].join('\n');
}

function renderUseCases() {
  const lines = [
    '# Reproducible research-route cases',
    '',
    'Each case is defined in `evaluation/scenarios.json` and reconstructed with deterministic shortest-path search. Run `npm run usecase -- <scenario-id>` to reproduce one route.',
    '',
  ];
  for (const scenario of results.routes.scenarios) {
    lines.push(`## ${scenario.title}`, '', `**Scenario:** \`${scenario.id}\``, '', scenario.research_question, '');
    if (!scenario.route) {
      lines.push('No route was found.', '');
      continue;
    }
    lines.push('| Step | Type | Identifier | Evidence | Reference scope |', '| ---: | --- | --- | --- | --- |');
    scenario.route.nodes.forEach((nodeId, index) => {
      const node = nodeById.get(nodeId);
      const scopes = [...new Set((node?.references ?? []).map((reference) => reference.scope))].sort().join(', ');
      lines.push(`| ${index + 1} | node | \`${nodeId}\` | ${node?.confidence ?? 'unknown'} | ${scopes || 'none'} |`);
      const edgeId = scenario.route.edges[index];
      if (!edgeId) return;
      const edge = edgeById.get(edgeId);
      const edgeScopes = [...new Set((edge?.references ?? []).map((reference) => reference.scope))].sort().join(', ');
      lines.push(`| ${index + 1}→${index + 2} | edge | \`${edgeId}\` | ${edge?.confidence ?? 'unknown'} | ${edgeScopes || 'none'} |`);
    });
    lines.push('', '**Bounded next target**', '', nodeById.get(scenario.route.nodes.at(-1))?.lean?.targets?.[0] ?? 'Not recorded.', '', '**Boundary**', '', 'This route is a reproducible navigation result. Its evidence labels and source scopes must be preserved when interpreting or extending it.', '');
  }
  return lines.join('\n');
}

function renderScorecard() {
  const score = results.controlled_quality;
  return [
    '# Repository-controlled quality scorecard',
    '',
    `**Score: ${score.score}/${score.maximum}.**`,
    '',
    `Scope: **${score.scope}**. This score is designed to reach 100 only when all deterministic criteria controlled by the repository pass. It is not a publication probability or a scientific-validity score.`,
    '',
    '| Criterion | Weight | Earned | Pass |',
    '| --- | ---: | ---: | :---: |',
    ...score.criteria.map((criterion) =>
      `| ${criterion.title} | ${criterion.weight} | ${criterion.earned} | ${criterion.passed ? 'yes' : 'no'} |`),
    '',
    '## Explicit exclusions',
    '',
    ...score.exclusions.map((item) => `- ${item}.`),
    '',
    'These exclusions require external review, empirical use or new scientific results and are intentionally not converted into repository points.',
    '',
  ].join('\n');
}

const outputs = new Map([
  ['evaluation/results.json', `${JSON.stringify(results, null, 2)}\n`],
  ['docs/EVALUATION.md', `${renderEvaluation()}\n`],
  ['docs/USE_CASES.md', `${renderUseCases()}\n`],
  ['docs/QUALITY_SCORECARD.md', `${renderScorecard()}\n`],
]);

if (check) {
  for (const [path, content] of outputs) {
    if (readFileSync(join(root, path), 'utf8') !== content) {
      throw new Error(`${path} is stale; run npm run evaluate`);
    }
  }
  console.log(`Validated evaluation: ${results.controlled_quality.score}/${results.controlled_quality.maximum}.`);
} else {
  for (const [path, content] of outputs) writeFileSync(join(root, path), content);
  console.log(`Wrote evaluation artifacts: ${results.controlled_quality.score}/${results.controlled_quality.maximum}.`);
}
