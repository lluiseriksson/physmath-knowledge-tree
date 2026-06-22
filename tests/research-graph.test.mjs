import test from 'node:test';
import assert from 'node:assert/strict';
import {
  connectedNeighborhood,
  createResearchLayout,
  inducedSubgraph,
  normalizeText,
  searchNodes,
  shortestPath,
} from '../src/lib/research-graph.js';

const nodes = [
  { id: 'domain.a', kind: 'domain', title: 'Ánalysis', summary: 'limits', tags: ['calculus'], questions: [] },
  { id: 'bridge.b', kind: 'bridge', title: 'Spectral bridge', summary: 'operators and spectra', tags: ['spectral'], questions: [] },
  { id: 'problem.c', kind: 'problem', title: 'Open problem', summary: 'hard question', tags: ['open'], questions: [] },
  { id: 'domain.d', kind: 'domain', title: 'Detached', summary: 'other', tags: ['other'], questions: [] },
];
const edges = [
  { id: 'edge.ab', source: 'domain.a', target: 'bridge.b' },
  { id: 'edge.bc', source: 'bridge.b', target: 'problem.c' },
];

test('normalizeText removes accents and punctuation', () => {
  assert.equal(normalizeText('Ánalysis / PDE'), 'analysis pde');
});

test('searchNodes ranks title and tag matches', () => {
  assert.equal(searchNodes(nodes, 'spectral')[0].node.id, 'bridge.b');
  assert.equal(searchNodes(nodes, 'analysis')[0].node.id, 'domain.a');
  assert.deepEqual(searchNodes(nodes, 'missing'), []);
});

test('shortestPath supports undirected and directed traversal', () => {
  assert.deepEqual(shortestPath(nodes, edges, 'domain.a', 'problem.c'), {
    nodes: ['domain.a', 'bridge.b', 'problem.c'],
    edges: ['edge.ab', 'edge.bc'],
  });
  assert.equal(shortestPath(nodes, edges, 'problem.c', 'domain.a', true), null);
  assert.deepEqual(shortestPath(nodes, edges, 'problem.c', 'domain.a', false)?.nodes, ['problem.c', 'bridge.b', 'domain.a']);
});

test('neighborhood and induced subgraph preserve only selected nodes', () => {
  const neighborhood = connectedNeighborhood(nodes, edges, 'bridge.b', 1);
  assert.deepEqual([...neighborhood].sort(), ['bridge.b', 'domain.a', 'problem.c']);
  const graph = inducedSubgraph(nodes, edges, new Set(['domain.a', 'bridge.b']));
  assert.deepEqual(graph.nodes.map((node) => node.id), ['domain.a', 'bridge.b']);
  assert.deepEqual(graph.edges.map((edge) => edge.id), ['edge.ab']);
});

test('layout is deterministic and finite', () => {
  const first = createResearchLayout(nodes, edges, { iterations: 20 });
  const second = createResearchLayout(nodes, edges, { iterations: 20 });
  assert.deepEqual(first.positions.get('domain.a'), second.positions.get('domain.a'));
  for (const point of first.positions.values()) {
    assert.ok(Number.isFinite(point.x));
    assert.ok(Number.isFinite(point.y));
  }
});


test('layout handles coincident node positions without non-finite forces', () => {
  const coincident = [
    { id: 'same', kind: 'domain', title: 'First' },
    { id: 'same', kind: 'domain', title: 'Second' },
  ];
  const layout = createResearchLayout(coincident, [], { iterations: 1 });
  const point = layout.positions.get('same');
  assert.ok(point);
  assert.ok(Number.isFinite(point.x));
  assert.ok(Number.isFinite(point.y));
});
