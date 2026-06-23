import assert from 'node:assert/strict';
import { syncBuiltinESMExports } from 'node:module';
import fs from 'node:fs';
import test from 'node:test';
import { createLayout, getRecommendedTopics } from '../src/lib/graph.js';
import { createResearchLayout, searchNodes, shortestPath } from '../src/lib/research-graph.js';
import { importProgress } from '../src/lib/storage.js';
import { compareNormalizedText, compareText, normalizeText } from '../src/lib/text.js';
import {
  readResearchUrlState,
  writeResearchUrlState,
} from '../src/lib/url-state.js';
import { t, translateDocument } from '../src/lib/research-i18n.js';
import { translate } from '../src/lib/i18n.js';
import { assertTreeHasNoSymlinks, walkRegularFiles } from '../scripts/lib/fs-safety.mjs';

function learningTopic(id, title, prerequisites = []) {
  return {
    id,
    title: { en: title, es: title },
    domain: 'math',
    area: 'analysis',
    level: 'foundation',
    prerequisites,
    estimatedHours: 1,
    summary: { en: 'needle', es: 'aguja' },
    concepts: { en: [], es: [] },
    keywords: [],
  };
}

test('shared text helpers are compatibility-normalized and locale-independent', () => {
  assert.equal(normalizeText('I İ ﬁ — Álgebra'), 'i i fi algebra');
  assert.equal(normalizeText(null), '');
  assert.equal(compareText('a', 'b'), -1);
  assert.equal(compareText('b', 'a'), 1);
  assert.equal(compareText('a', 'a'), 0);
  assert.equal(compareText(null, ''), 0);
  assert.equal(compareText('', null), 0);
  assert.equal(compareNormalizedText('Álgebra', 'algebra'), 1);
  assert.equal(compareNormalizedText('alpha', 'beta'), -1);
});

test('graph/search/path ordering never calls localeCompare and uses stable ID ties', () => {
  const original = String.prototype.localeCompare;
  String.prototype.localeCompare = () => { throw new Error('localeCompare must not be used'); };
  try {
    const topics = [
      learningTopic('root', 'Root'),
      learningTopic('z', 'Same', ['root']),
      learningTopic('a', 'Same', ['root']),
    ];
    const layout = createLayout(topics);
    assert.equal(layout.positions.get('a').order, 0);
    assert.deepEqual(
      getRecommendedTopics(topics, { root: 'mastered' }).map((topic) => topic.id),
      ['a', 'z'],
    );

    const nodes = [
      { id: 'z', kind: 'domain', title: 'Same', summary: 'needle', tags: [], questions: [] },
      { id: 'a', kind: 'domain', title: 'Same', summary: 'needle', tags: [], questions: [] },
      { id: 'target', kind: 'problem', title: 'Target', summary: '', tags: [], questions: [] },
    ];
    assert.deepEqual(searchNodes(nodes, 'needle').map((entry) => entry.node.id), ['a', 'z']);
    assert.deepEqual(shortestPath(nodes, [
      { id: 'z-edge', source: 'z', target: 'target' },
      { id: 'a-edge', source: 'a', target: 'target' },
      { id: 'root-z', source: 'a', target: 'z' },
    ], 'a', 'target', true), { nodes: ['a', 'target'], edges: ['a-edge'] });
    const researchLayout = createResearchLayout(nodes, [], { iterations: 0, width: 500, height: 400 });
    assert.equal(researchLayout.positions.size, 3);
  } finally {
    String.prototype.localeCompare = original;
  }
});

test('research URL state is canonical, preserves unrelated data and avoids duplicate pushes', () => {
  assert.deepEqual(readResearchUrlState(new URL('https://example.test/app?collection=%20c%20&node=%20n%20&view=list')), {
    collection: 'c', node: 'n', view: 'list', route: null,
  });
  assert.deepEqual(readResearchUrlState(new URL('https://example.test/app?view=unknown')), {
    collection: null, node: null, view: 'graph', route: null,
  });
  assert.deepEqual(readResearchUrlState(new URL(
    'https://example.test/app?from=a&to=b&policy=strongest&evidence=sourced&directed=1',
  )), {
    collection: null,
    node: null,
    view: 'graph',
    route: { source: 'a', target: 'b', policy: 'strongest', evidence: 'sourced', directed: true },
  });
  assert.equal(readResearchUrlState(new URL('https://example.test/app?from=a&to=a')).route, null);
  assert.deepEqual(readResearchUrlState(new URL(
    'https://example.test/app?from=a&to=b&policy=unknown&evidence=unknown',
  )).route, {
    source: 'a', target: 'b', policy: 'shortest', evidence: 'all', directed: false,
  });

  const calls = [];
  const historyApi = {
    pushState(...args) { calls.push(['push', ...args]); },
    replaceState(...args) { calls.push(['replace', ...args]); },
  };
  const first = writeResearchUrlState(
    { collection: ' c ', node: ' n ', view: 'list' },
    'push',
    'https://example.test/app?utm=campaign#graph',
    historyApi,
  );
  assert.equal(first.toString(), 'https://example.test/app?utm=campaign&collection=c&node=n&view=list#graph');
  assert.equal(calls[0][0], 'push');

  const routed = writeResearchUrlState({
    collection: 'c',
    node: 'n',
    view: 'list',
    route: { source: 'a', target: 'b', policy: 'strongest', evidence: 'sourced', directed: true },
  }, 'push', first, historyApi);
  assert.equal(
    routed.toString(),
    'https://example.test/app?utm=campaign&collection=c&node=n&view=list&from=a&to=b&policy=strongest&evidence=sourced&directed=1#graph',
  );
  assert.equal(calls[1][0], 'push');

  const defaults = writeResearchUrlState({
    collection: 'c',
    node: 'n',
    view: 'list',
    route: { source: 'a', target: 'b', policy: 'shortest', evidence: 'all', directed: false },
  }, 'replace', routed, historyApi);
  assert.equal(defaults.searchParams.get('from'), 'a');
  assert.equal(defaults.searchParams.get('to'), 'b');
  assert.equal(defaults.searchParams.has('policy'), false);
  assert.equal(defaults.searchParams.has('evidence'), false);
  assert.equal(defaults.searchParams.has('directed'), false);

  const duplicate = writeResearchUrlState(
    { collection: 'c', node: 'n', view: 'list' },
    'push', first, historyApi,
  );
  assert.equal(duplicate.href, first.href);
  assert.equal(calls[3][0], 'replace');

  const cleared = writeResearchUrlState(
    { collection: '', node: null, view: 'graph' },
    'replace', first, historyApi,
  );
  assert.equal(cleared.toString(), 'https://example.test/app?utm=campaign#graph');

  const previousWindow = globalThis.window;
  const previousHistory = globalThis.history;
  globalThis.window = { location: { href: first.href } };
  globalThis.history = historyApi;
  try {
    assert.deepEqual(readResearchUrlState(), { collection: 'c', node: 'n', view: 'list', route: null });
    assert.equal(writeResearchUrlState({ collection: null, node: null, view: 'graph' }).searchParams.get('utm'), 'campaign');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousHistory === undefined) delete globalThis.history;
    else globalThis.history = previousHistory;
  }
});

test('valid imports cannot silently erase progress when every topic ID is foreign', () => {
  const validIds = new Set(['arithmetic', 'vectors']);
  assert.throws(() => importProgress(JSON.stringify({
    schemaVersion: 1,
    statuses: { removed: 'mastered' },
    favorites: ['legacy'],
  }), validIds), /does not contain any topic IDs/);
  const imported = importProgress(JSON.stringify({
    schemaVersion: 1,
    statuses: { removed: 'mastered', arithmetic: 'learning' },
    favorites: ['legacy', 'vectors'],
  }), validIds);
  assert.equal(imported.schemaVersion, 1);
  assert.deepEqual(imported.statuses, { arithmetic: 'learning' });
  assert.deepEqual(imported.favorites, ['vectors']);
  assert.ok(Number.isFinite(Date.parse(imported.updatedAt)));
});

test('research translations update text, placeholders and accessible names', () => {
  const textNode = { dataset: { i18n: 'search.title' }, textContent: '' };
  const placeholderNode = {
    dataset: { i18nPlaceholder: 'search.placeholder' },
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
  };
  const ariaNode = {
    dataset: { i18nAria: 'search.label' },
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
  };
  const root = {
    nodeType: 9,
    documentElement: { lang: '' },
    querySelectorAll(selector) {
      if (selector === '[data-i18n]') return [textNode];
      if (selector === '[data-i18n-placeholder]') return [placeholderNode];
      if (selector === '[data-i18n-aria]') return [ariaNode];
      return [];
    },
  };
  translateDocument('es', root);
  assert.equal(root.documentElement.lang, 'es');
  assert.equal(textNode.textContent, 'Buscar un nodo');
  assert.equal(placeholderNode.attributes.placeholder, 'Buscar títulos, etiquetas, preguntas…');
  assert.equal(ariaNode.attributes['aria-label'], 'Buscar nodos de investigación');
  assert.equal(ariaNode.attributes.title, 'Buscar nodos de investigación');
  assert.equal(t('es', 'app.heading'), 'Grafo de investigación de PhysMath Knowledge Tree');
  assert.equal(translate('es', 'filters.close'), 'Cerrar filtros');
  assert.equal(t('invalid', 'missing.key'), 'missing.key');
});

test('filesystem guards reject non-regular entries without platform-specific fixtures', { concurrency: false }, () => {
  const original = fs.lstatSync;
  fs.lstatSync = () => ({
    isSymbolicLink: () => false,
    isDirectory: () => false,
    isFile: () => false,
  });
  syncBuiltinESMExports();
  try {
    assert.throws(() => assertTreeHasNoSymlinks('/virtual', 'virtual'), /Unsupported filesystem entry/);
    assert.throws(() => walkRegularFiles('/virtual'), /Unsupported filesystem entry/);
  } finally {
    fs.lstatSync = original;
    syncBuiltinESMExports();
  }
});
