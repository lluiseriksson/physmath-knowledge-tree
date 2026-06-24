import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const filesRoot = repositoryRoot;
function browserCandidates() {
  const configured = [process.env.CHROMIUM_PATH, process.env.BROWSER_BIN].filter(Boolean);
  if (process.platform === 'win32') {
    return [
      ...configured,
      join(process.env.PROGRAMFILES || '', 'Google/Chrome/Application/chrome.exe'),
      join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
      'chrome.exe',
      'msedge.exe',
    ];
  }
  if (process.platform === 'darwin') {
    return [
      ...configured,
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      'google-chrome',
      'chromium',
    ];
  }
  return [
    ...configured,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ];
}

function findBrowser() {
  for (const candidate of browserCandidates()) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0) return candidate;
  }
  throw new Error('No Chromium-family browser found. Set BROWSER_BIN or CHROMIUM_PATH to a Chrome, Chromium or Edge executable.');
}

const chromium = findBrowser();
const port = 9444;
const profile = mkdtempSync(join(tmpdir(), 'physmath-workbench-browser-'));
const chrome = spawn(chromium, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--disable-background-networking', '--disable-component-update', '--disable-sync',
  '--no-first-run', '--no-default-browser-check', `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let chromeError = '';
chrome.stderr.on('data', (chunk) => { chromeError += chunk; });

async function waitJson(path, attempts = 100) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}${path}`);
      if (response.ok) return response.json();
    } catch { /* Browser is still starting. */ }
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error(`Chromium DevTools endpoint did not start.\n${chromeError}`);
}

async function stopBrowser() {
  if (chrome.exitCode !== null || chrome.signalCode !== null) return;
  chrome.kill('SIGKILL');
  await new Promise((resolveStop) => {
    const timeout = setTimeout(resolveStop, 2000);
    chrome.once('exit', () => {
      clearTimeout(timeout);
      resolveStop();
    });
  });
}

async function removeProfile() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      rmSync(profile, { recursive: true, force: true });
      return;
    } catch (error) {
      if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(error?.code)) throw error;
      await new Promise((resolveWait) => setTimeout(resolveWait, 100));
    }
  }
  rmSync(profile, { recursive: true, force: true });
}

function stripImports(source) {
  let output = source;
  while (/^import\s/u.test(output)) output = output.replace(/^import[\s\S]*?;\n/u, '');
  return output;
}

function stripExports(source) {
  return source.replace(/^export\s+/gmu, '');
}

function fixtureData() {
  return {
    nodes: [
      { id: 'domain.logic', kind: 'domain', title: 'Logic', summary: 'Foundations and proof', tags: ['logic'], questions: ['What is formal?'] },
      { id: 'bridge.types', kind: 'bridge', title: 'Type-theoretic bridge', summary: 'Transfers structure', tags: ['types'], questions: ['What is preserved?'] },
      { id: 'problem.alpha', kind: 'problem', title: 'Problem Alpha', summary: 'First open target', tags: ['alpha'], questions: ['Can it be reduced?'] },
      { id: 'problem.beta', kind: 'problem', title: 'Problem Beta', summary: 'Second open target', tags: ['beta'], questions: ['Can it be compared?'] },
    ],
    edges: [
      { id: 'edge.logic.types', source: 'domain.logic', target: 'bridge.types', confidence: 'formal', references: [{ label: 'Ref' }] },
      { id: 'edge.types.alpha', source: 'bridge.types', target: 'problem.alpha', confidence: 'literature', references: [{ label: 'Ref' }] },
      { id: 'edge.types.beta', source: 'bridge.types', target: 'problem.beta', confidence: 'heuristic', references: [] },
    ],
  };
}

const dependencyStubs = `
const compareText = (a, b) => String(a).localeCompare(String(b));
const compareNormalizedText = (a, b) => String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
const indexById = (items) => new Map(items.map((item) => [item.id, item]));
function searchNodes(nodes, query, limit = 10) {
  const normalized = query.toLowerCase();
  return nodes.filter((node) => JSON.stringify(node).toLowerCase().includes(normalized)).slice(0, limit).map((node) => ({ node, score: 1 }));
}
function connectedNeighborhood(nodes, edges, seed, radius = 1) {
  const valid = new Set(nodes.map(({ id }) => id));
  const included = new Set(valid.has(seed) ? [seed] : []);
  let frontier = new Set(included);
  for (let depth = 0; depth < radius; depth += 1) {
    const next = new Set();
    for (const edge of edges) {
      if (frontier.has(edge.source) && valid.has(edge.target)) next.add(edge.target);
      if (frontier.has(edge.target) && valid.has(edge.source)) next.add(edge.source);
    }
    for (const id of next) included.add(id);
    frontier = next;
  }
  return included;
}
const CONFIDENCE_LEVELS = ['formal', 'literature', 'heuristic', 'speculative'];
function planResearchRoute(nodes, edges, source, target, options = {}) {
  const allowed = new Set(options.allowedConfidence ?? CONFIDENCE_LEVELS);
  const queue = [[source, [source], []]];
  const seen = new Set([source]);
  while (queue.length) {
    const [current, path, used] = queue.shift();
    if (current === target) return { nodes: path, edges: used, score: { policy: options.policy ?? 'shortest' } };
    for (const edge of edges) {
      if (!allowed.has(edge.confidence)) continue;
      const candidates = [];
      if (edge.source === current) candidates.push(edge.target);
      if (!options.directed && edge.target === current) candidates.push(edge.source);
      for (const next of candidates) if (!seen.has(next)) {
        seen.add(next);
        queue.push([next, [...path, next], [...used, edge.id]]);
      }
    }
  }
  return null;
}
function summarizeRouteEvidence(route, edges) {
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  const risks = { formal: 0, literature: 1, heuristic: 2, speculative: 3 };
  let weakest = null;
  let maximum = -1;
  let references = 0;
  for (const id of route.edges) {
    const edge = edgeById.get(id);
    if (!edge) continue;
    references += edge.references?.length ?? 0;
    if (risks[edge.confidence] > maximum) { maximum = risks[edge.confidence]; weakest = edge.confidence; }
  }
  return { weakest_confidence: weakest, references };
}
`;

let socket;
try {
  const targets = await waitJson('/json/list');
  const target = targets.find(({ type }) => type === 'page');
  assert.ok(target?.webSocketDebuggerUrl, 'Chromium page target');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener('open', resolveOpen, { once: true });
    socket.addEventListener('error', rejectOpen, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    if (message.id && pending.has(message.id)) {
      const promise = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) promise.reject(new Error(JSON.stringify(message.error)));
      else promise.resolve(message.result);
    }
  });
  function send(method, params = {}) {
    const id = ++nextId;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall }));
  }
  async function evaluate(expression) {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    return response.result.value;
  }

  await send('Page.enable');
  await send('Runtime.enable');
  const frameTree = await send('Page.getFrameTree');
  const frameId = frameTree.frameTree.frame.id;
  let html = readFileSync(join(filesRoot, 'workbench.html'), 'utf8');
  html = html.replace(/<script\b[^>]*src="\.\/src\/workbench-app\.js"[^>]*><\/script>/iu, '');
  await send('Page.setDocumentContent', { frameId, html });

  const data = fixtureData();
  const prelude = `
    (() => {
      const values = new Map();
      Object.defineProperty(window, 'localStorage', { configurable: true, value: {
        getItem: (key) => values.has(key) ? values.get(key) : null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
        clear: () => values.clear(),
      }});
      const nodes = ${JSON.stringify(data.nodes)};
      const edges = ${JSON.stringify(data.edges)};
      window.fetch = async (path) => ({
        ok: true,
        status: 200,
        json: async () => String(path).includes('nodes/core.json') ? nodes : edges,
      });
    })();
  `;
  await evaluate(prelude);
  const workspaceSource = stripExports(readFileSync(join(filesRoot, 'src/lib/workspace.js'), 'utf8'));
  const appSource = stripImports(readFileSync(join(filesRoot, 'src/workbench-app.js'), 'utf8'));
  await evaluate(`(() => {\n${dependencyStubs}\n${workspaceSource}\n${appSource}\n})()`);

  let ready = false;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    ready = await evaluate("document.querySelector('#workbench')?.hidden === false");
    if (ready) break;
    await new Promise((resolveWait) => setTimeout(resolveWait, 25));
  }
  assert.equal(ready, true, `Workbench ready; exceptions: ${JSON.stringify(exceptions)}`);

  const initial = await evaluate(`({
    title: document.querySelector('#active-title')?.textContent,
    nodeOptions: document.querySelector('#route-source')?.options.length,
    loadError: document.querySelector('#loading')?.classList.contains('load-error'),
  })`);
  assert.deepEqual(initial, { title: 'Research workspace', nodeOptions: 4, loadError: false });

  const interaction = await evaluate(`(async () => {
    const search = document.querySelector('#node-search');
    search.value = 'Logic';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.search-result button')?.click();
    document.querySelector('#neighborhood-left').value = 'problem.alpha';
    document.querySelector('#neighborhood-right').value = 'problem.beta';
    document.querySelector('#compare-neighborhoods').click();
    document.querySelector('#route-source').value = 'problem.alpha';
    document.querySelector('#route-target').value = 'problem.beta';
    document.querySelector('#compare-routes').click();
    document.querySelector('#negative-name').value = 'Finite obstruction';
    document.querySelector('#negative-observation').value = 'The transfer fails on the finite test.';
    document.querySelector('#save-negative').click();
    await new Promise((resolveWait) => setTimeout(resolveWait, 25));
    return {
      selectedNodes: document.querySelector('#stat-nodes').textContent,
      negativeResults: document.querySelector('#stat-results').textContent,
      neighborhoodColumns: document.querySelectorAll('#neighborhood-result .comparison-column').length,
      routeCards: document.querySelectorAll('#route-result .route-card').length,
      stored: Boolean(localStorage.getItem('physmath.research.workspaces.v1')),
      negativeCards: document.querySelectorAll('#negative-list .record-card').length,
    };
  })()`);
  assert.deepEqual(interaction, {
    selectedNodes: '1', negativeResults: '1', neighborhoodColumns: 3,
    routeCards: 2, stored: true, negativeCards: 1,
  });
  assert.deepEqual(exceptions, []);
  console.log('Research Workbench Chromium smoke test passed.');
  await send('Browser.close').catch(() => {});
} finally {
  try { socket?.close(); } catch { /* Already closed. */ }
  await stopBrowser();
  await removeProfile();
}
