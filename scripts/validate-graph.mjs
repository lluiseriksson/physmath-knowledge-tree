import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const fail = (message) => { throw new Error(message); };
const ensure = (condition, message) => { if (!condition) fail(message); };

const index = readJson('graph/index.json');
for (const path of [...Object.values(index.canonical_files), ...Object.values(index.schemas)]) {
  ensure(typeof path === 'string' && path.length > 0, 'Invalid canonical/schema path');
  ensure(existsSync(join(root, path)), `Missing declared graph file: ${path}`);
}
const nodes = readJson(index.canonical_files.nodes);
const edges = readJson(index.canonical_files.edges);
const moves = readJson(index.canonical_files.research_moves);
const collections = readJson(index.canonical_files.collections);

for (const schemaPath of Object.values(index.schemas)) readJson(schemaPath);

const nodeIds = new Set();
const edgeIds = new Set();
const moveIds = new Set();
const collectionIds = new Set();
const kinds = new Set(['domain', 'bridge', 'problem']);
const confidences = new Set(['formal', 'literature', 'heuristic', 'speculative']);
const relations = new Set(['depends_on', 'generalizes', 'specializes', 'analogy', 'dual', 'formalizes_as', 'transfers_via', 'obstructs', 'suggests', 'tests', 'uses', 'bridge']);

for (const node of nodes) {
  ensure(/^((domain|bridge|problem)\.)[a-z0-9_\.]+$/.test(node.id), `Invalid node id: ${node.id}`);
  ensure(!nodeIds.has(node.id), `Duplicate node id: ${node.id}`);
  ensure(kinds.has(node.kind), `${node.id}: invalid kind ${node.kind}`);
  ensure(confidences.has(node.confidence), `${node.id}: invalid confidence ${node.confidence}`);
  ensure(node.id.startsWith(`${node.kind}.`), `${node.id}: id prefix does not match kind`);
  ensure(typeof node.title === 'string' && node.title.trim().length >= 3, `${node.id}: missing title`);
  ensure(typeof node.summary === 'string' && node.summary.trim().length >= 20, `${node.id}: summary is too short`);
  ensure(Array.isArray(node.tags) && node.tags.length >= 2, `${node.id}: needs at least two tags`);
  ensure(new Set(node.tags).size === node.tags.length, `${node.id}: duplicate tags`);
  ensure(Array.isArray(node.questions) && node.questions.length >= 1, `${node.id}: needs at least one live question`);
  ensure(node.lean && Array.isArray(node.lean.imports) && Array.isArray(node.lean.declarations) && Array.isArray(node.lean.targets), `${node.id}: invalid Lean metadata`);
  ensure(node.lean.targets.length >= 1, `${node.id}: needs a Lean target`);
  if (node.kind === 'problem') ensure(['solved', 'unsolved'].includes(node.status), `${node.id}: problem status required`);
  else ensure(node.status === undefined, `${node.id}: status is only valid for problems`);
  if (node.references) {
    for (const reference of node.references) {
      ensure(typeof reference.label === 'string' && reference.label.trim(), `${node.id}: reference label required`);
      ensure(/^https:\/\//.test(reference.url), `${node.id}: references must use HTTPS`);
      ensure(['official', 'paper', 'book', 'documentation', 'survey'].includes(reference.type), `${node.id}: invalid reference type`);
    }
  }
  nodeIds.add(node.id);
}

const degree = new Map(nodes.map((node) => [node.id, 0]));
const semanticEdges = new Set();
for (const edge of edges) {
  ensure(/^edge\.[a-z0-9_\.]+$/.test(edge.id), `Invalid edge id: ${edge.id}`);
  ensure(!edgeIds.has(edge.id), `Duplicate edge id: ${edge.id}`);
  ensure(nodeIds.has(edge.source), `${edge.id}: missing source ${edge.source}`);
  ensure(nodeIds.has(edge.target), `${edge.id}: missing target ${edge.target}`);
  ensure(edge.source !== edge.target, `${edge.id}: self-edge`);
  ensure(relations.has(edge.relation), `${edge.id}: invalid relation ${edge.relation}`);
  ensure(confidences.has(edge.confidence), `${edge.id}: invalid confidence ${edge.confidence}`);
  ensure(typeof edge.mechanism === 'string' && edge.mechanism.trim().length >= 20, `${edge.id}: mechanism is too short`);
  const semanticKey = `${edge.source}|${edge.relation}|${edge.target}`;
  ensure(!semanticEdges.has(semanticKey), `${edge.id}: duplicate source/relation/target claim`);
  semanticEdges.add(semanticKey);
  if (edge.confidence === 'speculative') ensure(typeof edge.notes === 'string' && /falsif/i.test(edge.notes), `${edge.id}: speculative edges need a falsifier note`);
  degree.set(edge.source, degree.get(edge.source) + 1);
  degree.set(edge.target, degree.get(edge.target) + 1);
  edgeIds.add(edge.id);
}

for (const [nodeId, count] of degree) ensure(count > 0, `${nodeId}: isolated node`);

for (const move of moves) {
  ensure(/^move\.[a-z0-9_\.]+$/.test(move.id), `Invalid move id: ${move.id}`);
  ensure(!moveIds.has(move.id), `Duplicate move id: ${move.id}`);
  ensure(typeof move.title === 'string' && move.title.trim().length >= 2, `${move.id}: title required`);
  ensure(typeof move.description === 'string' && move.description.length >= 20, `${move.id}: description is too short`);
  ensure(Array.isArray(move.good_for) && move.good_for.length >= 1, `${move.id}: good_for required`);
  for (const nodeId of move.good_for) ensure(nodeIds.has(nodeId), `${move.id}: unknown good_for node ${nodeId}`);
  ensure(typeof move.output === 'string' && move.output.trim().length >= 8, `${move.id}: output required`);
  ensure(Array.isArray(move.risks) && move.risks.length >= 1, `${move.id}: risks required`);
  ensure(typeof move.lean_test === 'string' && move.lean_test.length >= 12, `${move.id}: Lean test required`);
  moveIds.add(move.id);
}

for (const collection of collections) {
  ensure(/^collection\.[a-z0-9_\.]+$/.test(collection.id), `Invalid collection id: ${collection.id}`);
  ensure(!collectionIds.has(collection.id), `Duplicate collection id: ${collection.id}`);
  ensure(typeof collection.title === 'string' && collection.title.trim().length >= 2, `${collection.id}: title required`);
  ensure(typeof collection.description === 'string' && collection.description.trim().length >= 12, `${collection.id}: description required`);
  ensure(Array.isArray(collection.nodes) && collection.nodes.length >= 2, `${collection.id}: needs at least two nodes`);
  ensure(new Set(collection.nodes).size === collection.nodes.length, `${collection.id}: duplicate nodes`);
  for (const nodeId of collection.nodes) ensure(nodeIds.has(nodeId), `${collection.id}: unknown node ${nodeId}`);
  collectionIds.add(collection.id);
}

for (const rootNode of index.root_nodes) ensure(nodeIds.has(rootNode), `Unknown root node: ${rootNode}`);
for (const entrypoint of index.agent_entrypoints) {
  ensure(typeof entrypoint === 'string' && entrypoint.length > 0, 'Invalid agent entrypoint');
  ensure(existsSync(join(root, entrypoint)), `Missing agent entrypoint: ${entrypoint}`);
}

const byKind = Object.fromEntries([...kinds].sort().map((kind) => [kind, nodes.filter((node) => node.kind === kind).length]));
const byConfidence = Object.fromEntries([...confidences].sort().map((confidence) => [confidence, nodes.filter((node) => node.confidence === confidence).length]).filter(([, count]) => count > 0));
ensure(index.stats.nodes === nodes.length, 'index.stats.nodes is stale');
ensure(index.stats.edges === edges.length, 'index.stats.edges is stale');
ensure(index.stats.research_moves === moves.length, 'index.stats.research_moves is stale');
ensure(index.stats.collections === collections.length, 'index.stats.collections is stale');
ensure(JSON.stringify(index.stats.by_kind) === JSON.stringify(byKind), 'index.stats.by_kind is stale');
ensure(JSON.stringify(index.stats.by_confidence) === JSON.stringify(byConfidence), 'index.stats.by_confidence is stale');

console.log(`Validated canonical graph: ${nodes.length} nodes, ${edges.length} edges, ${moves.length} research moves, ${collections.length} collections.`);
