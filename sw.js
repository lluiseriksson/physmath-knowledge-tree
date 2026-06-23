const APP_VERSION = '2.6.0';
const CACHE_PREFIX = 'physmath-knowledge-tree-';
const CACHE_REVISION = 'source-2026-06-23.3';
const CACHE_NAMESPACE = `${CACHE_PREFIX}${APP_VERSION}-${CACHE_REVISION}`;
const SHELL_CACHE = `${CACHE_NAMESPACE}-shell`;
const RUNTIME_CACHE = `${CACHE_NAMESPACE}-runtime`;
const CURRENT_CACHES = new Set([SHELL_CACHE, RUNTIME_CACHE]);
const MAX_RUNTIME_ENTRIES = 64;
const CACHEABLE_EXTENSIONS = new Set([
  '.css', '.html', '.js', '.json', '.jsonld', '.md', '.mjs', '.png', '.svg', '.webmanifest', '.xml',
]);
const SHELL = [
  './',
  './index.html',
  './learning.html',
  './offline.html',
  './404.html',
  './manifest.webmanifest',
  './src/research.css',
  './src/research-app.js',
  './src/lib/research-graph.js',
  './src/lib/research-i18n.js',
  './src/lib/route-planner.js',
  './src/lib/route-bundle.js',
  './src/lib/jsonld.js',
  './src/styles.css',
  './src/error.css',
  './src/app.js',
  './src/data/topics.js',
  './src/lib/dom.js',
  './src/lib/graph.js',
  './src/lib/i18n.js',
  './src/lib/search.js',
  './src/lib/storage.js',
  './src/lib/text.js',
  './src/lib/types.js',
  './src/lib/url-state.js',
  './graph/index.json',
  './graph/knowledge-graph.jsonld',
  './graph/audit.json',
  './graph/reference-registry.json',
  './graph/nodes/core.json',
  './graph/edges.json',
  './graph/research_moves.json',
  './graph/collections.json',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && !CURRENT_CACHES.has(key))
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

function fallbackFor(url) {
  if (url.pathname.endsWith('/learning.html')) return './learning.html';
  if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) return './index.html';
  return './offline.html';
}

function canonicalCacheRequest(request) {
  const url = new URL(request.url);
  url.search = '';
  url.hash = '';
  return new Request(url.toString(), {
    method: 'GET',
    credentials: 'same-origin',
    redirect: 'follow',
  });
}

function isCacheableRequest(request) {
  if (request.headers?.has?.('range')) return false;
  if (request.mode === 'navigate') return true;
  const pathname = new URL(request.url).pathname;
  const dot = pathname.lastIndexOf('.');
  return dot >= 0 && CACHEABLE_EXTENSIONS.has(pathname.slice(dot).toLowerCase());
}

function isCacheableResponse(response) {
  return response.status === 200
    && (response.type === 'basic' || response.type === 'default')
    && !response.redirected;
}

async function trimRuntimeCache(cache) {
  const keys = await cache.keys();
  const overflow = keys.length - MAX_RUNTIME_ENTRIES;
  if (overflow <= 0) return;
  await Promise.all(keys.slice(0, overflow).map((key) => cache.delete(key)));
}

async function updateRuntimeCache(request, response) {
  if (!isCacheableRequest(request) || !isCacheableResponse(response)) return;
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const key = canonicalCacheRequest(request);
    await cache.delete(key);
    await cache.put(key, response.clone());
    await trimRuntimeCache(cache);
  } catch (error) {
    console.warn('Runtime cache update failed; returning the network response.', error);
  }
}

async function networkAndCache(request) {
  const response = await fetch(request);
  await updateRuntimeCache(request, response);
  return response;
}

async function cachedResponse(request) {
  const key = canonicalCacheRequest(request);
  const runtime = await caches.open(RUNTIME_CACHE);
  const refreshed = await runtime.match(key, { ignoreSearch: true });
  if (refreshed) return refreshed;
  const shell = await caches.open(SHELL_CACHE);
  return await shell.match(key, { ignoreSearch: true });
}

async function shellFallback(path) {
  const shell = await caches.open(SHELL_CACHE);
  return await shell.match(path, { ignoreSearch: true });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!isCacheableRequest(request)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      networkAndCache(request).catch(async () =>
        await cachedResponse(request)
          || await shellFallback(fallbackFor(url))),
    );
    return;
  }

  const networkPromise = networkAndCache(request);
  event.waitUntil(networkPromise.catch(() => undefined));
  event.respondWith((async () =>
    await cachedResponse(request) || await networkPromise
  )());
});
