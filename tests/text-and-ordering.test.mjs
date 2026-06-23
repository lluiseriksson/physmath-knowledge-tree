import test from 'node:test';
import assert from 'node:assert/strict';
import { compareNormalizedText, compareText, normalizeText } from '../src/lib/text.js';
import { searchTopics } from '../src/lib/search.js';
import { createLayout, getRecommendedTopics } from '../src/lib/graph.js';
import { createResearchLayout, searchNodes, shortestPath } from '../src/lib/research-graph.js';

const topic = (id, title, summary, overrides = {}) => ({
  id,
  title: { en: title, es: title },
  summary: { en: summary, es: summary },
  concepts: { en: [], es: [] },
  keywords: [],
  area: 'physics',
  domain: 'physics',
  level: 'foundation',
  prerequisites: [],
  estimatedHours: 1,
  ...overrides,
});

test('shared text normalization preserves mathematical search intent', () => {
  assert.equal(normalizeText('Álgebra ℏω + ψ(x) ≤ ∞'), 'algebra hbar omega psi x less equal infinity');
  assert.equal(normalizeText('∂φ/∂t and ∇²'), 'partial phi partial t and nabla 2');
  assert.equal(normalizeText(null), '');
  assert.equal(compareText('a', 'b'), -1);
  assert.equal(compareText('b', 'a'), 1);
  assert.equal(compareText('a', 'a'), 0);
  assert.equal(compareText(null, undefined), 0);
  assert.equal(compareText(null, 'a'), -1);
  assert.equal(compareText('a', undefined), 1);
  assert.equal(compareNormalizedText('beta', 'alpha'), 1);
  assert.equal(compareNormalizedText('Álgebra', 'algebra'), 1);
});

test('learning and research search accept glyphs and spelled-out symbol names', () => {
  const topics = [
    topic('wavefunction', 'Wavefunction ψ', 'Quantum state amplitude'),
    topic('action', 'Action', 'Contains ℏ in quantum phases'),
  ];
  assert.equal(searchTopics(topics, 'psi', 'en')[0]?.topic.id, 'wavefunction');
  assert.equal(searchTopics(topics, 'ψ', 'en')[0]?.topic.id, 'wavefunction');
  assert.equal(searchTopics(topics, 'hbar', 'en')[0]?.topic.id, 'action');

  const nodes = [
    { id: 'domain.wave', title: 'Wave ψ', summary: 'Amplitude', tags: [] },
    { id: 'domain.action', title: 'Action', summary: 'Measured in ℏ', tags: [] },
  ];
  assert.equal(searchNodes(nodes, 'psi')[0]?.node.id, 'domain.wave');
  assert.equal(searchNodes(nodes, 'ℏ')[0]?.node.id, 'domain.action');
});

test('core graph ordering remains deterministic without localeCompare', () => {
  const original = String.prototype.localeCompare;
  String.prototype.localeCompare = () => { throw new Error('localeCompare must not be used'); };
  try {
    const topics = [
      topic('root', 'Root', 'Root'),
      topic('zeta', 'Ζeta', 'Greek', { prerequisites: ['root'], area: 'b' }),
      topic('alpha', 'Alpha', 'Latin', { prerequisites: ['root'], area: 'a' }),
    ];
    const layout = createLayout(topics, { margin: 10, horizontalGap: 10, verticalGap: 10 });
    assert.equal(layout.positions.get('alpha')?.order, 0);
    assert.deepEqual(getRecommendedTopics(topics, { root: 'mastered' }, 3).map(({ id }) => id), ['alpha', 'zeta']);

    const nodes = [
      { id: 'root', kind: 'domain', title: 'Root', summary: '', tags: [] },
      { id: 'zeta', kind: 'bridge', title: 'Ζeta', summary: 'same', tags: [] },
      { id: 'alpha', kind: 'bridge', title: 'Alpha', summary: 'same', tags: [] },
    ];
    const edges = [
      { id: 'z-edge', source: 'root', target: 'zeta' },
      { id: 'a-edge', source: 'root', target: 'alpha' },
    ];
    assert.deepEqual(shortestPath(nodes, edges, 'root', 'alpha', true)?.nodes, ['root', 'alpha']);
    assert.deepEqual(searchNodes(nodes.slice(1), 'same').map(({ node }) => node.id), ['alpha', 'zeta']);
    assert.equal(createResearchLayout(nodes, edges, { width: 500, height: 400, iterations: 1 }).positions.size, 3);
  } finally {
    String.prototype.localeCompare = original;
  }
});
