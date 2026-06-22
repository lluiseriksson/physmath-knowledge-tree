import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

test('canonical graph counts and endpoints are consistent', async () => {
  const [index, nodes, edges, moves, collections] = await Promise.all([
    read('graph/index.json'), read('graph/nodes/core.json'), read('graph/edges.json'),
    read('graph/research_moves.json'), read('graph/collections.json'),
  ]);
  const ids = new Set(nodes.map((node) => node.id));
  assert.equal(ids.size, nodes.length);
  assert.equal(index.stats.nodes, nodes.length);
  assert.equal(index.stats.edges, edges.length);
  assert.equal(index.stats.research_moves, moves.length);
  assert.equal(index.stats.collections, collections.length);
  for (const edge of edges) {
    assert.ok(ids.has(edge.source), `${edge.id} source`);
    assert.ok(ids.has(edge.target), `${edge.id} target`);
  }
  for (const collection of collections) {
    for (const id of collection.nodes) assert.ok(ids.has(id), `${collection.id}: ${id}`);
  }
});

test('every problem has status, a question and a formalization target', async () => {
  const nodes = await read('graph/nodes/core.json');
  for (const node of nodes.filter((item) => item.kind === 'problem')) {
    assert.match(node.status, /^(solved|unsolved)$/);
    assert.ok(node.questions.length > 0);
    assert.ok(node.lean.targets.length > 0);
    assert.ok(node.references?.some((reference) => ['claim', 'formalization'].includes(reference.scope)));
  }
});


test('every graph item has scoped references and source-bearing claims are directly supported', async () => {
  const [nodes, edges, registry] = await Promise.all([
    read('graph/nodes/core.json'), read('graph/edges.json'), read('graph/reference-registry.json'),
  ]);
  const allowedScopes = new Set(['claim', 'context', 'formalization']);
  for (const item of [...nodes, ...edges]) {
    assert.ok(item.references?.length > 0, `${item.id} has references`);
    for (const reference of item.references) assert.ok(allowedScopes.has(reference.scope), `${item.id}: ${reference.scope}`);
    if (['formal', 'literature'].includes(item.confidence)) {
      assert.ok(item.references.some((reference) => ['claim', 'formalization'].includes(reference.scope)), item.id);
    }
  }
  assert.ok(registry.references.length > 0);
  assert.equal(new Set(registry.references.map((reference) => reference.url)).size, registry.references.length);
});
