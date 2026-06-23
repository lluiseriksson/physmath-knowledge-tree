import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function loadWorker({ response, putError } = {}) {
  const source = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  const opened = [];
  const puts = [];
  const warnings = [];
  const listeners = {};
  const networkResponse = response ?? {
    status: 200,
    type: 'basic',
    clone() { return { cloned: true }; },
  };
  const context = {
    URL,
    console: { warn: (...args) => warnings.push(args) },
    fetch: async () => networkResponse,
    caches: {
      open: async (name) => {
        opened.push(name);
        return {
          addAll: async () => {},
          put: async (...args) => {
            puts.push(args);
            if (putError) throw putError;
          },
        };
      },
      keys: async () => [],
      delete: async () => true,
      match: async () => undefined,
    },
    self: {
      location: { origin: 'https://example.test' },
      clients: { claim: async () => {} },
      skipWaiting: async () => {},
      addEventListener: (name, listener) => { listeners[name] = listener; },
    },
  };
  vm.runInNewContext(source, context, { filename: 'sw.js' });
  return { context, listeners, networkResponse, opened, puts, warnings };
}

test('service-worker cache identity invalidates same-version stale caches', async () => {
  const worker = loadWorker();
  const returned = await worker.context.networkAndCache({ url: '/asset.js' });
  assert.equal(returned, worker.networkResponse);
  assert.deepEqual(worker.opened, ['physmath-knowledge-tree-2.6.0-source-2026-06-23.2']);
  assert.equal(worker.puts.length, 1);
  assert.equal(worker.context.fallbackFor(new URL('https://example.test/learning.html')), './learning.html');
  assert.equal(worker.context.fallbackFor(new URL('https://example.test/unknown')), './offline.html');
});

test('partial or opaque responses are never admitted to the runtime cache', async () => {
  for (const response of [
    { status: 206, type: 'basic', clone() { return this; } },
    { status: 200, type: 'opaque', clone() { return this; } },
  ]) {
    const worker = loadWorker({ response });
    assert.equal(await worker.context.networkAndCache({}), response);
    assert.deepEqual(worker.opened, []);
    assert.deepEqual(worker.puts, []);
  }
});

test('cache-write failures preserve successful network responses', async () => {
  const error = new Error('quota');
  const worker = loadWorker({ putError: error });
  assert.equal(await worker.context.networkAndCache({}), worker.networkResponse);
  assert.equal(worker.warnings.length, 1);
  assert.equal(worker.warnings[0][1], error);
});
