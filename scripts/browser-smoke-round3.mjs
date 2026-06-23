import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createStaticServer } from './serve.mjs';

const root = resolve(process.argv[2] ?? 'dist');
function shellCacheEntryCount(workerSource) {
  const shellBlock = workerSource.match(/const SHELL = \[([\s\S]*?)\];/u)?.[1];
  if (!shellBlock) throw new Error('Unable to find service-worker shell cache list.');
  return [...shellBlock.matchAll(/'[^']+'/gu)].length;
}
const expectedShellCount = shellCacheEntryCount(readFileSync(join(root, 'sw.js'), 'utf8'));
function browserCandidates() {
  const configured = process.env.BROWSER_BIN ? [process.env.BROWSER_BIN] : [];
  if (process.platform === 'win32') {
    return [
      ...configured,
      join(process.env.PROGRAMFILES || '', 'Google/Chrome/Application/chrome.exe'),
      join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
      'chrome.exe', 'msedge.exe',
    ];
  }
  if (process.platform === 'darwin') {
    return [
      ...configured,
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      'google-chrome', 'chromium',
    ];
  }
  return [
    ...configured,
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium', '/usr/bin/chromium-browser',
    'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser',
  ];
}
function findBrowser() {
  for (const candidate of browserCandidates().filter(Boolean)) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0) return candidate;
  }
  throw new Error('No Chromium-family browser found. Set BROWSER_BIN.');
}
const browserBin = findBrowser();
const profile = mkdtempSync(join(tmpdir(), 'physmath-r3-browser-'));
const server = createStaticServer(root);
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const address = server.address();
assert.ok(address && typeof address === 'object');
const origin = `http://127.0.0.1:${address.port}`;

const browser = spawn(browserBin, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-proxy-server', '--proxy-bypass-list=*',
  '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--remote-allow-origins=*',
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let stderr = '';
browser.stderr.setEncoding('utf8');
const websocketUrl = await new Promise((resolveUrl, reject) => {
  const timeout = setTimeout(() => reject(new Error(`Chromium did not expose DevTools. ${stderr}`)), 10000);
  browser.stderr.on('data', (chunk) => {
    stderr += chunk;
    const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/u);
    if (match) {
      clearTimeout(timeout);
      resolveUrl(match[1]);
    }
  });
  browser.once('error', reject);
  browser.once('exit', (code) => reject(new Error(`Chromium exited before DevTools with ${code}. ${stderr}`)));
});

class Cdp {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.opened = new Promise((resolveOpen, reject) => {
      this.socket.addEventListener('open', resolveOpen, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) {
        for (const listener of this.listeners.get(message.method) ?? []) listener(message.params ?? {});
        return;
      }
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
      else pending.resolve(message.result ?? {});
    });
  }
  async send(method, params = {}, sessionId) {
    await this.opened;
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolveCommand, rejectCommand) => {
      this.pending.set(id, { resolve: resolveCommand, reject: rejectCommand, method });
      this.socket.send(JSON.stringify(payload));
    });
  }
  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }
  close() { this.socket.close(); }
}

const cdp = new Cdp(websocketUrl);
const version = await cdp.send('Browser.getVersion');
const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
await cdp.send('Page.enable', {}, sessionId);
await cdp.send('Runtime.enable', {}, sessionId);
await cdp.send('Network.enable', {}, sessionId);
await cdp.send('Log.enable', {}, sessionId);
const diagnostics = [];
cdp.on('Runtime.exceptionThrown', (event) => diagnostics.push({ type: 'exception', event }));
cdp.on('Runtime.consoleAPICalled', (event) => diagnostics.push({ type: 'console', event }));
cdp.on('Log.entryAdded', (event) => diagnostics.push({ type: 'log', event }));
cdp.on('Network.loadingFailed', (event) => diagnostics.push({ type: 'network', event }));

async function evaluate(expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression, awaitPromise: true, returnByValue: true, userGesture: true,
  }, sessionId);
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime evaluation failed');
  }
  return result.result.value;
}

async function waitFor(expression, label, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    try {
      last = await evaluate(expression);
      if (last) return last;
    } catch (error) {
      last = String(error);
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error(`Timed out waiting for ${label}: ${JSON.stringify(last)}`);
}

async function navigate(url) {
  await cdp.send('Page.navigate', { url }, sessionId);
  await waitFor('document.readyState === "complete"', `load ${url}`);
}

try {
  console.log('step: navigate');
  await navigate(`${origin}/index.html?utm=campaign&node=domain.analysis&view=list&from=domain.number_theory&to=problem.riemann_hypothesis&policy=shortest&evidence=all&directed=0#graph`);
  try {
    await waitFor('document.querySelector("#app-shell")?.hidden === false', 'research app initialization');
  } catch (error) {
    console.error(JSON.stringify(diagnostics, null, 2));
    console.error(await evaluate('document.documentElement.outerHTML.slice(0, 3000)'));
    throw error;
  }

  const initial = await evaluate(`({
    href: location.href,
    searchLabel: document.querySelector('#search').getAttribute('aria-label'),
    listPressed: document.querySelector('#list-view-button').getAttribute('aria-pressed'),
    detailsOpen: document.querySelector('#details').classList.contains('open'),
    routePolicy: document.querySelector('#path-policy').value,
    evidenceGate: document.querySelector('#path-evidence').value,
  })`);
  assert.match(initial.href, /utm=campaign/u);
  assert.match(initial.href, /node=domain\.analysis/u);
  const initialUrl = new URL(initial.href);
  assert.equal(initialUrl.searchParams.get('from'), 'domain.number_theory');
  assert.equal(initialUrl.searchParams.get('to'), 'problem.riemann_hypothesis');
  assert.equal(initialUrl.searchParams.has('policy'), false);
  assert.equal(initialUrl.searchParams.has('evidence'), false);
  assert.equal(initialUrl.searchParams.has('directed'), false);
  assert.equal(initial.searchLabel, 'Search research nodes');
  assert.equal(initial.listPressed, 'true');
  assert.equal(initial.detailsOpen, true);
  assert.equal(initial.routePolicy, 'shortest');
  assert.equal(initial.evidenceGate, 'all');

  console.log('step: route');
  await evaluate(`(() => {
    const set = (selector, value) => {
      const element = document.querySelector(selector);
      element.value = value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    set('#path-source', 'domain.number_theory');
    set('#path-target', 'problem.riemann_hypothesis');
    set('#path-policy', 'strongest');
    set('#path-evidence', 'sourced');
    document.querySelector('#path-directed').checked = true;
    document.querySelector('#find-path').click();
    return true;
  })()`);
  await waitFor(`document.querySelectorAll('#path-result ol li').length === 2`, 'evidence-aware route');
  const route = await evaluate(`({
    text: document.querySelector('#path-result').textContent,
    highlightedEdges: document.querySelectorAll('#edge-layer .highlighted').length,
    highlightedNodes: document.querySelectorAll('#node-layer .highlighted').length,
    href: location.href,
  })`);
  assert.match(route.text, /Strongest available evidence/u);
  assert.match(route.text, /Literature/u);
  assert.match(route.text, /2 references/u);
  assert.equal(route.highlightedEdges, 1);
  assert.equal(route.highlightedNodes, 2);
  const routeUrl = new URL(route.href);
  assert.equal(routeUrl.searchParams.get('from'), 'domain.number_theory');
  assert.equal(routeUrl.searchParams.get('to'), 'problem.riemann_hypothesis');
  assert.equal(routeUrl.searchParams.get('policy'), 'strongest');
  assert.equal(routeUrl.searchParams.get('evidence'), 'sourced');
  assert.equal(routeUrl.searchParams.get('directed'), '1');
  assert.equal(routeUrl.searchParams.get('utm'), 'campaign');
  assert.equal(routeUrl.hash, '#graph');

  console.log('step: jsonld');
  const jsonld = await evaluate(`(async () => {
    window.__downloadBlob = null;
    window.__downloadName = null;
    URL.createObjectURL = (blob) => { window.__downloadBlob = blob; return 'blob:fixture'; };
    URL.revokeObjectURL = () => {};
    HTMLAnchorElement.prototype.click = function click() { window.__downloadName = this.download; };
    document.querySelector('#export-jsonld').click();
    const text = await window.__downloadBlob.text();
    const payload = JSON.parse(text);
    return {
      name: window.__downloadName,
      type: window.__downloadBlob.type,
      graphLength: payload['@graph'].length,
      applicationVersion: payload.applicationVersion,
      schemaVersion: payload.schemaVersion,
    };
  })()`);
  assert.equal(jsonld.name, 'physmath-knowledge-graph.jsonld');
  assert.match(jsonld.type, /^application\/ld\+json/u);
  assert.equal(jsonld.graphLength, 201);
  assert.equal(jsonld.applicationVersion, '2.6.0');
  assert.equal(jsonld.schemaVersion, '0.6.0');

  console.log('step: surface');
  const surface = await evaluate(`(async () => {
    const paths = ['/package.json', '/scripts/serve.mjs', '/LICENSE', '/src/lib/jsonld.js', '/missing-r3'];
    const result = {};
    for (const path of paths) {
      const response = await fetch(path);
      result[path] = { status: response.status, type: response.headers.get('content-type') };
    }
    return result;
  })()`);
  assert.equal(surface['/package.json'].status, 404);
  assert.equal(surface['/scripts/serve.mjs'].status, 404);
  assert.equal(surface['/LICENSE'].status, 200);
  assert.equal(surface['/src/lib/jsonld.js'].status, 200);
  assert.match(surface['/src/lib/jsonld.js'].type, /^text\/javascript/u);
  assert.equal(surface['/missing-r3'].status, 404);
  // The 404 responses above are intentional public-surface assertions. Chromium
  // reports them through Log.entryAdded, so discard only those completed checks.
  diagnostics.length = 0;

  console.log('step: language');
  await evaluate(`(() => {
    const select = document.querySelector('#language');
    select.value = 'es';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  await waitFor(`document.querySelector('#search').getAttribute('aria-label') === 'Buscar nodos de investigación'`, 'Spanish accessible label');
  assert.equal(await evaluate('document.documentElement.lang'), 'es');
  assert.equal(await evaluate(`document.querySelector('[data-i18n="path.title"]').textContent`), 'Ruta sensible a la evidencia');

  console.log('step: history');
  await evaluate(`document.querySelector('#close-details').click()`);
  await waitFor(`!new URL(location.href).searchParams.has('node')`, 'details close history state');
  const closedUrl = await evaluate('location.href');
  assert.match(closedUrl, /utm=campaign/u);
  assert.match(closedUrl, /#graph$/u);
  await evaluate('history.back(); true');
  await waitFor(`new URL(location.href).searchParams.get('node') === 'domain.analysis' && document.querySelector('#details').classList.contains('open')`, 'popstate dossier restore');

  const fatalDiagnostics = diagnostics.filter(({ type, event }) =>
    type === 'exception'
    || (type === 'console' && ['error', 'assert'].includes(event.type))
    || (type === 'log' && event.entry?.level === 'error'));
  assert.deepEqual(fatalDiagnostics, [], `Browser diagnostics:
${JSON.stringify(fatalDiagnostics, null, 2)}`);

  console.log('step: service worker');
  await waitFor('navigator.serviceWorker.controller !== null', 'service-worker control', 15000);
  const cacheState = await evaluate(`(async () => {
    await fetch('./index.html?node=cache-test&utm=cache');
    await new Promise((resolve) => setTimeout(resolve, 300));
    const manifest = await fetch('./build-manifest.json').then((response) => response.json());
    const names = await caches.keys();
    const shell = names.find((name) => name.endsWith('-shell'));
    const runtime = names.find((name) => name.endsWith('-runtime'));
    const runtimeRequests = runtime ? await (await caches.open(runtime)).keys() : [];
    const shellRequests = shell ? await (await caches.open(shell)).keys() : [];
    return {
      shell,
      runtime,
      revision: manifest.pwa_cache_revision,
      shellCount: shellRequests.length,
      queryKeys: runtimeRequests.filter((request) => new URL(request.url).search).map((request) => request.url),
    };
  })()`);
  assert.ok(cacheState.shell.includes(cacheState.revision));
  assert.ok(cacheState.runtime.includes(cacheState.revision));
  assert.equal(cacheState.shellCount, expectedShellCount);
  assert.deepEqual(cacheState.queryKeys, []);

  console.log('step: offline');
  await new Promise((resolveClose) => server.close(resolveClose));
  await navigate(`${origin}/not-cached/r3-offline-check`);
  await waitFor(`document.title === 'Offline · PhysMath Knowledge Tree'`, 'offline fallback', 15000);
  assert.equal(await evaluate('document.querySelector("h1").textContent'), 'Offline');

  console.log(`Browser ${version.product}`);
  console.log('Evidence-aware route UI, canonical JSON-LD, closed public surface, URL history, bilingual ARIA, content-addressed cache and offline fallback passed.');
} finally {
  if (server.listening) {
    server.closeAllConnections?.();
    server.close();
  }
  cdp.close();
  if (browser.exitCode === null && browser.signalCode === null) {
    browser.kill('SIGKILL');
    await Promise.race([once(browser, 'exit'), new Promise((resolveExit) => setTimeout(resolveExit, 2000))]);
  }
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch {}
}
