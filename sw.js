const APP_VERSION = '2.5.0';
const CACHE_PREFIX = 'physmath-knowledge-tree-';
const CACHE = `${CACHE_PREFIX}${APP_VERSION}`;
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
  './src/styles.css',
  './src/error.css',
  './src/app.js',
  './src/data/topics.js',
  './src/lib/dom.js',
  './src/lib/graph.js',
  './src/lib/i18n.js',
  './src/lib/search.js',
  './src/lib/storage.js',
  './src/lib/types.js',
  './src/lib/url-state.js',
  './graph/index.json',
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
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function fallbackFor(url) {
  if (url.pathname.endsWith('/learning.html')) return './learning.html';
  if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) return './index.html';
  return './offline.html';
}

async function networkAndCache(request) {
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      networkAndCache(request).catch(async () =>
        await caches.match(request, { ignoreSearch: true })
          || await caches.match(fallbackFor(url))),
    );
    return;
  }

  const networkPromise = networkAndCache(request);
  event.waitUntil(networkPromise.catch(() => undefined));
  event.respondWith((async () =>
    await caches.match(request, { ignoreSearch: true }) || await networkPromise
  )());
});
