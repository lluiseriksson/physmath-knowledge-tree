import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const origin = 'https://example.test';
const shellBlock = source.match(/const SHELL = \[([\s\S]*?)\];/u)?.[1];
const expectedShellEntries = Function(`"use strict"; return [${shellBlock}];`)().length;

function absoluteUrl(input) {
  if (typeof input === 'string') return new URL(input, `${origin}/app/`).toString();
  return input.url;
}

class MemoryCache {
  entries = new Map();

  async addAll(items) {
    for (const item of items) {
      this.entries.set(absoluteUrl(item), new Response(`shell:${item}`, { status: 200 }));
    }
  }

  async put(request, response) {
    this.entries.set(absoluteUrl(request), response);
  }

  async match(request, options = {}) {
    const requested = new URL(absoluteUrl(request));
    for (const [key, response] of this.entries) {
      const candidate = new URL(key);
      if (candidate.origin !== requested.origin || candidate.pathname !== requested.pathname) continue;
      if (!options.ignoreSearch && candidate.search !== requested.search) continue;
      return response.clone();
    }
    return undefined;
  }

  async keys() {
    return [...this.entries.keys()].map((url) => new Request(url));
  }

  async delete(request) {
    return this.entries.delete(absoluteUrl(request));
  }
}

function createHarness(fetchImpl = async (request) => new Response(`network:${request.url}`, { status: 200 })) {
  const handlers = new Map();
  const stores = new Map();
  let skipped = 0;
  let claimed = 0;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new MemoryCache());
      return stores.get(name);
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(request, options) {
      for (const cache of stores.values()) {
        const response = await cache.match(request, options);
        if (response) return response;
      }
      return undefined;
    },
  };
  const self = {
    location: { origin },
    addEventListener(type, handler) { handlers.set(type, handler); },
    async skipWaiting() { skipped += 1; },
    clients: { async claim() { claimed += 1; } },
  };
  vm.runInNewContext(source, {
    self,
    caches,
    fetch: fetchImpl,
    URL,
    Request,
    Response,
    Set,
    Promise,
    console,
  });

  async function dispatchLifecycle(type) {
    let work;
    handlers.get(type)({ waitUntil(promise) { work = promise; } });
    await work;
  }

  async function dispatchFetch(request) {
    let responsePromise;
    const background = [];
    handlers.get('fetch')({
      request,
      respondWith(promise) { responsePromise = Promise.resolve(promise); },
      waitUntil(promise) { background.push(Promise.resolve(promise)); },
    });
    const response = responsePromise ? await responsePromise : null;
    await Promise.all(background);
    return response;
  }

  return {
    caches,
    stores,
    dispatchLifecycle,
    dispatchFetch,
    get skipped() { return skipped; },
    get claimed() { return claimed; },
  };
}

test('service worker partitions shell/runtime caches and removes only stale owned caches', async () => {
  const harness = createHarness();
  await harness.dispatchLifecycle('install');
  assert.equal(harness.skipped, 1);
  const shellName = (await harness.caches.keys()).find((name) => name.endsWith('-shell'));
  assert.ok(shellName);
  assert.equal((await harness.stores.get(shellName).keys()).length, expectedShellEntries);

  const runtimeName = shellName.replace(/-shell$/u, '-runtime');
  await harness.caches.open(runtimeName);
  await harness.caches.open('physmath-knowledge-tree-1.0.0');
  await harness.caches.open('physmath-knowledge-tree-2.6.0-runtime');
  await harness.caches.open('unrelated-cache');
  await harness.dispatchLifecycle('activate');
  const remaining = await harness.caches.keys();
  assert.equal(remaining.includes('physmath-knowledge-tree-1.0.0'), false);
  assert.equal(remaining.includes('physmath-knowledge-tree-2.6.0-runtime'), false);
  assert.equal(remaining.includes(runtimeName), true);
  assert.equal(remaining.includes('unrelated-cache'), true);
  assert.equal(harness.claimed, 1);
});

test('runtime cache canonicalizes query variants, rejects unsafe responses and stays bounded', async () => {
  let offline = false;
  let responseFactory = (request) => new Response(`network:${request.url}`, { status: 200 });
  const harness = createHarness(async (request) => {
    if (offline) throw new Error('offline');
    return responseFactory(request);
  });
  await harness.dispatchLifecycle('install');

  const first = await harness.dispatchFetch({
    url: `${origin}/graph/index.json?topic=one`, method: 'GET', mode: 'cors',
  });
  assert.match(await first.text(), /topic=one/);
  const runtimeName = (await harness.caches.keys()).find((name) => name.endsWith('-runtime'));
  assert.ok(runtimeName);
  assert.deepEqual(
    (await harness.stores.get(runtimeName).keys()).map((request) => request.url),
    [`${origin}/graph/index.json`],
  );

  offline = true;
  const cached = await harness.dispatchFetch({
    url: `${origin}/graph/index.json?topic=two`, method: 'GET', mode: 'cors',
  });
  assert.match(await cached.text(), /topic=one/);
  offline = false;

  responseFactory = () => ({ ok: true, status: 200, type: 'opaque' });
  await harness.dispatchFetch({ url: `${origin}/src/opaque.js`, method: 'GET', mode: 'cors' });
  responseFactory = () => ({ ok: true, status: 200, type: 'opaqueredirect' });
  await harness.dispatchFetch({ url: `${origin}/src/redirect.js`, method: 'GET', mode: 'cors' });
  responseFactory = () => ({ ok: true, status: 206, type: 'basic' });
  await harness.dispatchFetch({ url: `${origin}/src/partial.js`, method: 'GET', mode: 'cors' });
  responseFactory = () => ({ ok: false, status: 500, type: 'basic' });
  await harness.dispatchFetch({ url: `${origin}/src/failure.js`, method: 'GET', mode: 'cors' });
  responseFactory = (request) => new Response(`network:${request.url}`, { status: 200 });
  await harness.dispatchFetch({ url: `${origin}/notes.txt`, method: 'GET', mode: 'cors' });
  assert.equal((await harness.stores.get(runtimeName).keys()).length, 1);

  for (let index = 0; index < 70; index += 1) {
    await harness.dispatchFetch({
      url: `${origin}/graph/runtime-${index}.json?state=${index}`, method: 'GET', mode: 'cors',
    });
  }
  const runtimeKeys = (await harness.stores.get(runtimeName).keys()).map((request) => request.url);
  assert.equal(runtimeKeys.length, 64);
  assert.equal(runtimeKeys.some((url) => url.endsWith('/runtime-0.json')), false);
  assert.equal(runtimeKeys.some((url) => url.endsWith('/runtime-69.json')), true);
});

test('navigation uses network-first canonical caching and shell fallbacks while ignoring unsafe requests', async () => {
  let offline = false;
  const harness = createHarness(async (request) => {
    if (offline) throw new Error('offline');
    return new Response(`page:${request.url}`, { status: 200 });
  });
  await harness.dispatchLifecycle('install');

  const online = await harness.dispatchFetch({
    url: `${origin}/index.html?topic=a`, method: 'GET', mode: 'navigate',
  });
  assert.match(await online.text(), /topic=a/);
  offline = true;
  const canonical = await harness.dispatchFetch({
    url: `${origin}/index.html?topic=b`, method: 'GET', mode: 'navigate',
  });
  assert.match(await canonical.text(), /topic=a/);

  offline = false;
  const refreshedShellPath = await harness.dispatchFetch({
    url: `${origin}/app/index.html?topic=runtime`, method: 'GET', mode: 'navigate',
  });
  assert.match(await refreshedShellPath.text(), /topic=runtime/);
  offline = true;
  const runtimePreferred = await harness.dispatchFetch({
    url: `${origin}/app/index.html?topic=offline`, method: 'GET', mode: 'navigate',
  });
  assert.match(await runtimePreferred.text(), /topic=runtime/);

  const learning = await harness.dispatchFetch({
    url: `${origin}/app/learning.html?view=list`, method: 'GET', mode: 'navigate',
  });
  assert.match(await learning.text(), /shell:\.\/learning\.html/);
  const workbench = await harness.dispatchFetch({
    url: `${origin}/app/workbench.html?workspace=local`, method: 'GET', mode: 'navigate',
  });
  assert.match(await workbench.text(), /shell:\.\/workbench\.html/);
  const evidence = await harness.dispatchFetch({
    url: `${origin}/app/evidence.html?status=unreviewed`, method: 'GET', mode: 'navigate',
  });
  assert.match(await evidence.text(), /shell:\.\/evidence\.html/);
  const changes = await harness.dispatchFetch({
    url: `${origin}/app/changes.html?risk=critical`, method: 'GET', mode: 'navigate',
  });
  assert.match(await changes.text(), /shell:\.\/changes\.html/);
  const rootPage = await harness.dispatchFetch({
    url: `${origin}/app/`, method: 'GET', mode: 'navigate',
  });
  assert.match(await rootPage.text(), /shell:\.\//);
  const fallback = await harness.dispatchFetch({
    url: `${origin}/app/unknown`, method: 'GET', mode: 'navigate',
  });
  assert.match(await fallback.text(), /shell:\.\/offline\.html/);

  assert.equal(await harness.dispatchFetch({
    url: 'https://other.test/x.js', method: 'GET', mode: 'cors',
  }), null);
  assert.equal(await harness.dispatchFetch({
    url: `${origin}/api`, method: 'POST', mode: 'cors',
  }), null);
});

test('range requests are never persisted in the runtime cache', async () => {
  const harness = createHarness(async (request) => new Response(`full:${request.url}`, { status: 200 }));
  await harness.dispatchLifecycle('install');
  const response = await harness.dispatchFetch(new Request(`${origin}/graph/index.json`, {
    headers: { Range: 'bytes=0-10' },
  }));
  assert.match(await response.text(), /full:/);
  const runtimeName = (await harness.caches.keys()).find((name) => name.endsWith('-runtime'));
  assert.equal(runtimeName, undefined);
});
