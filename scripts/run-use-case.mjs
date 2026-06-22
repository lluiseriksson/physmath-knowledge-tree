import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateRouteScenario } from './lib/evaluation.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const index = readJson('graph/index.json');
const nodes = readJson(index.canonical_files.nodes);
const edges = readJson(index.canonical_files.edges);
const scenarios = readJson('evaluation/scenarios.json').route_scenarios;
const argument = process.argv[2];

if (argument === '--list' || !argument) {
  console.log(scenarios.map((scenario) => `${scenario.id}\t${scenario.title}`).join('\n'));
  process.exit(argument ? 0 : 1);
}

const definition = scenarios.find((scenario) => scenario.id === argument);
if (!definition) throw new Error(`Unknown scenario: ${argument}`);
const result = evaluateRouteScenario(nodes, edges, definition);
if (!result.passed || !result.route) throw new Error(`Scenario failed: ${argument}`);
const nodeById = new Map(nodes.map((node) => [node.id, node]));
const edgeById = new Map(edges.map((edge) => [edge.id, edge]));

console.log(`# ${result.title}\n`);
console.log(`${result.research_question}\n`);
result.route.nodes.forEach((nodeId, index) => {
  const node = nodeById.get(nodeId);
  console.log(`${index + 1}. ${node?.title ?? nodeId} [${node?.confidence ?? 'unknown'}] — ${nodeId}`);
  const edgeId = result.route.edges[index];
  if (!edgeId) return;
  const edge = edgeById.get(edgeId);
  console.log(`   ↳ ${edge?.mechanism ?? edgeId} [${edge?.confidence ?? 'unknown'}; ${edgeId}]`);
});
