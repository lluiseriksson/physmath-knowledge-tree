import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import {
  importProgress,
  validateProgressFile,
} from '../src/lib/storage.js';
import { normalizeText, searchTopics } from '../src/lib/search.js';
import { readUrlState, writeUrlState } from '../src/lib/url-state.js';
import {
  createStaticServer,
  isPathInside,
  resolveRequestPath,
} from '../scripts/serve.mjs';

const validIds = new Set(['arithmetic', 'vectors']);
const validProgress = {
  schemaVersion: 1,
  statuses: { arithmetic: 'mastered', removed: 'learning' },
  favorites: ['vectors', 'removed'],
  updatedAt: '2026-06-23T00:00:00.000Z',
};

function topic(id, title = 'Same') {
  return {
    id,
    title: { en: title, es: title },
    summary: { en: 'plain needle', es: 'plain needle' },
    concepts: { en: [], es: [] },
    keywords: [],
    area: 'area',
    domain: 'math',
    level: 'foundation',
    prerequisites: [],
    estimatedHours: 1,
  };
}

test('progress imports reject unrelated or structurally corrupt JSON before sanitizing', () => {
  const wrapped = JSON.stringify({
    application: 'PhysMath Knowledge Tree',
    schemaVersion: 1,
    progress: validProgress,
  });
  assert.deepEqual(importProgress(wrapped, validIds).statuses, { arithmetic: 'mastered' });
  assert.deepEqual(importProgress(JSON.stringify(validProgress), validIds).favorites, ['vectors']);

  assert.throws(() => importProgress('[]', validIds), /JSON object/);
  assert.throws(() => importProgress('{}', validIds), /schema version/);
  assert.throws(() => importProgress(JSON.stringify({
    application: 'Other App', schemaVersion: 1, progress: validProgress,
  }), validIds), /another application/);
  assert.throws(() => importProgress(JSON.stringify({
    application: 'PhysMath Knowledge Tree', schemaVersion: 2, progress: validProgress,
  }), validIds), /export schema version/);
  assert.throws(() => importProgress(JSON.stringify({
    application: 'PhysMath Knowledge Tree', schemaVersion: 1, progress: null,
  }), validIds), /payload/);
  assert.throws(() => importProgress(JSON.stringify({ ...validProgress, statuses: [] }), validIds), /statuses/);
  assert.throws(() => importProgress(JSON.stringify({ ...validProgress, favorites: 'vectors' }), validIds), /favorites/);
  assert.throws(() => importProgress(JSON.stringify({
    ...validProgress, statuses: { arithmetic: 'corrupt' },
  }), validIds), /invalid status/);
  assert.throws(() => importProgress(JSON.stringify({
    ...validProgress, statuses: { arithmetic: 7 },
  }), validIds), /invalid status/);
  assert.throws(() => importProgress(JSON.stringify({
    ...validProgress, favorites: [7],
  }), validIds), /topic IDs/);
  assert.throws(() => importProgress(JSON.stringify({
    ...validProgress, updatedAt: 'not-a-date',
  }), validIds), /updatedAt/);
  assert.throws(() => importProgress(JSON.stringify({
    ...validProgress, updatedAt: 7,
  }), validIds), /updatedAt/);
  assert.ok(Date.parse(importProgress(JSON.stringify({
    schemaVersion: 1, statuses: {}, favorites: [],
  }), validIds).updatedAt));
});

test('progress file checks require a JSON extension and compatible media type when present', () => {
  assert.equal(validateProgressFile({ size: 0 }), true);
  assert.equal(validateProgressFile({ size: 10, name: 'progress.json' }), true);
  assert.equal(validateProgressFile({ size: 10, name: 'progress.json', type: 'application/json; charset=utf-8' }), true);
  assert.equal(validateProgressFile({ size: 10, type: 'application/ld+json' }), true);
  assert.equal(validateProgressFile({ size: 10, name: 'progress.json', type: 'text/json' }), true);
  assert.equal(validateProgressFile({ size: 10, name: 'progress.json', type: 'text/plain' }), true);
  assert.equal(validateProgressFile({ size: 10, name: 'progress.json', type: 'application/octet-stream' }), true);
  assert.throws(() => validateProgressFile({ size: 10, name: 'progress.txt', type: 'application/json' }), /filename/);
  assert.throws(() => validateProgressFile({ size: 10, name: 'progress.json', type: 'image/png' }), /compatible media type/);
});

test('learning search is locale-independent, compatibility-normalized and limit-safe', () => {
  assert.equal(normalizeText('I İ ﬁ'), 'i i fi');
  assert.equal(normalizeText(null), '');
  assert.deepEqual(searchTopics([], '   ', 'en'), []);

  const sameA = topic('a');
  const sameZ = topic('z');
  assert.deepEqual(searchTopics([sameA, sameZ], 'needle', 'en').map((entry) => entry.topic.id), ['a', 'z']);
  assert.deepEqual(searchTopics([sameZ, sameA], 'needle', 'en').map((entry) => entry.topic.id), ['a', 'z']);
  assert.deepEqual(searchTopics([topic('duplicate'), topic('duplicate')], 'needle', 'en').length, 2);

  const exact = topic('exact', 'Needle');
  const prefix = topic('prefix', 'Needle theory');
  const infix = topic('infix', 'Advanced needle theory');
  const alternate = topic('alternate', 'Unrelated');
  alternate.title.es = 'Aguja';
  alternate.summary = { en: 'plain', es: 'plain' };
  const concept = topic('concept', 'Unrelated concept');
  concept.summary = { en: 'plain', es: 'plain' };
  concept.concepts.en = ['needle'];
  const missing = topic('missing', 'Absent');
  missing.summary = { en: 'plain', es: 'plain' };

  const ranked = searchTopics([missing, infix, concept, alternate, prefix, exact], 'needle', 'en');
  assert.equal(ranked[0].topic.id, 'exact');
  assert.ok(ranked.some((entry) => entry.topic.id === 'prefix'));
  assert.ok(ranked.some((entry) => entry.topic.id === 'infix'));
  assert.ok(ranked.some((entry) => entry.topic.id === 'concept'));
  assert.equal(ranked.some((entry) => entry.topic.id === 'missing'), false);
  assert.equal(searchTopics([alternate], 'aguja', 'es')[0].topic.id, 'alternate');
  assert.deepEqual(searchTopics([sameA, sameZ], 'needle', 'en', -1), []);
  assert.equal(searchTopics([sameA, sameZ], 'needle', 'en', 1.9).length, 1);
});

test('URL state never keeps focus without a valid topic and preserves unrelated URL data', () => {
  assert.deepEqual(readUrlState(new URL('https://example.test/app?focus=path&view=list')), {
    topic: null, focus: null, view: 'list',
  });
  assert.deepEqual(readUrlState(new URL('https://example.test/app?topic=%20vectors%20&focus=path&view=invalid')), {
    topic: 'vectors', focus: 'path', view: 'graph',
  });
  assert.deepEqual(readUrlState(new URL('https://example.test/app?topic=x&focus=invalid')), {
    topic: 'x', focus: null, view: 'graph',
  });

  const calls = [];
  const historyApi = {
    pushState(...args) { calls.push(['push', ...args]); },
    replaceState(...args) { calls.push(['replace', ...args]); },
  };
  const cleared = writeUrlState(
    { topic: null, focus: 'path', view: 'graph' },
    'replace',
    'https://example.test/app?utm=1&topic=old&focus=path&view=list#section',
    historyApi,
  );
  assert.equal(cleared.toString(), 'https://example.test/app?utm=1#section');
  assert.equal(calls[0][0], 'replace');

  const pushed = writeUrlState(
    { topic: ' vectors ', focus: 'neighborhood', view: 'list' },
    'push',
    cleared,
    historyApi,
  );
  assert.equal(pushed.searchParams.get('topic'), 'vectors');
  assert.equal(pushed.searchParams.get('focus'), 'neighborhood');
  assert.equal(pushed.searchParams.get('view'), 'list');
  assert.equal(calls[1][0], 'push');

  const invalidFocus = writeUrlState(
    { topic: 'vectors', focus: 'invalid', view: 'graph' },
    'unexpected-mode',
    pushed,
    historyApi,
  );
  assert.equal(invalidFocus.searchParams.has('focus'), false);
  assert.equal(calls[2][0], 'replace');

  const previousWindow = globalThis.window;
  const previousHistory = globalThis.history;
  globalThis.window = { location: { href: 'https://example.test/app?topic=vectors&focus=path' } };
  globalThis.history = historyApi;
  try {
    assert.deepEqual(readUrlState(), { topic: 'vectors', focus: 'path', view: 'graph' });
    const defaultWrite = writeUrlState({ topic: '', focus: null, view: 'graph' });
    assert.equal(defaultWrite.searchParams.has('topic'), false);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousHistory === undefined) delete globalThis.history;
    else globalThis.history = previousHistory;
  }
});

test('static path checks distinguish descendants from prefix lookalikes and reject ambiguous separators', () => {
  const root = resolve('/tmp', 'physmath-root');
  assert.equal(isPathInside(root, join(root, 'index.html')), true);
  assert.equal(isPathInside(root, root), false);
  assert.equal(isPathInside(root, resolve(root, '..')), false);
  assert.equal(isPathInside(root, join(root, '..prefix')), true);
  assert.equal(resolveRequestPath(root, '/..prefix'), join(root, '..prefix'));
  assert.throws(() => resolveRequestPath(root, '/%5c..%5csecret.txt'), URIError);
  assert.throws(() => resolveRequestPath(root, '/bad%00name'), URIError);
});

test('static server rejects a symlink or junction that resolves outside its root', async (context) => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-server-hardening-'));
  const root = join(temporary, 'root');
  const outside = join(temporary, 'outside');
  mkdirSync(root);
  mkdirSync(outside);
  writeFileSync(join(root, 'index.html'), 'inside');
  mkdirSync(join(root, 'directory'));
  writeFileSync(join(outside, 'secret.txt'), 'outside');
  symlinkSync(outside, join(root, 'escape'), process.platform === 'win32' ? 'junction' : 'dir');
  context.after(() => rmSync(temporary, { recursive: true, force: true }));

  const server = createStaticServer(root);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => server.close());
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  const response = await fetch(`http://127.0.0.1:${address.port}/escape/secret.txt`);
  assert.equal(response.status, 403);
  assert.equal(await response.text(), 'Forbidden');

  const directory = await fetch(`http://127.0.0.1:${address.port}/directory`);
  assert.equal(directory.status, 404);
  assert.equal(await directory.text(), 'Not found');

  const inside = await fetch(`http://127.0.0.1:${address.port}/index.html`);
  assert.equal(inside.status, 200);
  assert.equal(await inside.text(), 'inside');
});
