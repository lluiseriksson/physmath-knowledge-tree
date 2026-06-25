import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  canonicalStringify,
  createDecisionLedger,
  createGraphSnapshot,
  normalizeGraphData,
} from '../src/lib/change-review.js';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));

function browserCandidates() {
  const configured = [process.env.CHROMIUM_PATH, process.env.BROWSER_BIN].filter(Boolean);
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
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
    '/usr/bin/chromium-browser', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser',
  ];
}

function findBrowser() {
  for (const candidate of browserCandidates()) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0) return candidate;
  }
  throw new Error('No Chromium-family browser found. Set BROWSER_BIN or CHROMIUM_PATH.');
}

function stripImports(source) {
  let output = source;
  while (/^import\s/u.test(output)) output = output.replace(/^import[\s\S]*?;\n/u, '');
  return output;
}
function stripExports(source) { return source.replace(/^export\s+/gmu, ''); }

const index = {
  schema_version: '0.6.0', application_version: '2.6.0', name: 'PhysMath Knowledge Tree',
  root_nodes: ['domain.alpha'], confidence_levels: ['formal', 'literature', 'heuristic', 'speculative'],
};
const baselineData = {
  index,
  nodes: [
    { id: 'domain.alpha', kind: 'domain', title: 'Alpha', summary: 'Old', confidence: 'heuristic', tags: [], questions: [], lean: { imports: [], declarations: [], targets: [] }, references: [{ label: 'Paper', url: 'https://example.org/paper', type: 'paper', scope: 'claim' }] },
    { id: 'problem.beta', kind: 'problem', title: 'Beta', summary: 'Target', confidence: 'literature', tags: [], questions: [], lean: { imports: [], declarations: [], targets: [] }, references: [{ label: 'Book', url: 'https://example.org/book', type: 'book', scope: 'claim' }] },
  ],
  edges: [{ id: 'edge.alpha.beta', source: 'domain.alpha', target: 'problem.beta', relation: 'suggests', confidence: 'heuristic', mechanism: 'Old mechanism', references: [{ label: 'Paper', url: 'https://example.org/paper', type: 'paper', scope: 'claim' }] }],
  research_moves: [{ id: 'move.alpha', title: 'Move', description: 'Old', good_for: ['problem.beta'], output: 'Old', risks: [], lean_test: 'Old' }],
  collections: [{ id: 'collection.alpha', title: 'Collection', description: 'Old', nodes: ['domain.alpha', 'problem.beta'] }],
};
const currentData = {
  index: { ...index, application_version: '2.7.0' },
  nodes: [
    { id: 'domain.alpha', kind: 'domain', title: 'Alpha revised', summary: 'New', confidence: 'literature', tags: ['revised'], questions: [], lean: { imports: [], declarations: [], targets: [] }, references: [] },
    { id: 'problem.beta', kind: 'problem', title: 'Beta', summary: 'Target', confidence: 'literature', tags: [], questions: [], lean: { imports: [], declarations: [], targets: [] }, references: [{ label: 'Book', url: 'https://example.org/book', type: 'book', scope: 'claim' }] },
    { id: 'problem.gamma', kind: 'problem', title: 'Gamma', summary: 'Added', confidence: 'speculative', tags: [], questions: [], lean: { imports: [], declarations: [], targets: [] }, references: [] },
  ],
  edges: [
    { id: 'edge.alpha.beta', source: 'domain.alpha', target: 'problem.gamma', relation: 'transfersVia', confidence: 'formal', mechanism: 'New mechanism', references: [] },
    { id: 'edge.beta.gamma', source: 'problem.beta', target: 'problem.gamma', relation: 'suggests', confidence: 'speculative', mechanism: 'Added edge', references: [] },
  ],
  research_moves: [{ id: 'move.alpha', title: 'Move', description: 'New', good_for: ['problem.gamma'], output: 'New', risks: ['Check'], lean_test: 'New' }],
  collections: [{ id: 'collection.alpha', title: 'Collection', description: 'New', nodes: ['domain.alpha', 'problem.gamma'] }],
};
const baseline = await createGraphSnapshot(baselineData, '2026-06-20T12:00:00.000Z');
const current = await createGraphSnapshot(currentData, '2026-06-24T12:00:00.000Z');
const storedState = {
  schema_version: 1,
  baseline,
  ledger: createDecisionLedger(baseline.fingerprint, current.fingerprint, '2026-06-24T12:00:00.000Z'),
};
const digestFixtures = Object.fromEntries([
  [canonicalStringify(normalizeGraphData(baselineData)), baseline.fingerprint],
  [canonicalStringify(normalizeGraphData(currentData)), current.fingerprint],
]);

const browser = findBrowser();
const port = 9446;
const profile = mkdtempSync(join(tmpdir(), 'physmath-change-review-browser-'));
const chrome = spawn(browser, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run',
  '--no-default-browser-check', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let browserError = '';
chrome.stderr.on('data', (chunk) => { browserError += chunk; });

async function waitJson(path, attempts = 100) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}${path}`);
      if (response.ok) return response.json();
    } catch { /* Browser is starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Chromium DevTools endpoint did not start.\n${browserError}`);
}
async function stopBrowser() {
  if (chrome.exitCode !== null || chrome.signalCode !== null) return;
  chrome.kill('SIGKILL');
  await new Promise((resolve) => {
    const timeout = setTimeout(resolve, 2000);
    chrome.once('exit', () => { clearTimeout(timeout); resolve(); });
  });
}
async function removeProfile() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { rmSync(profile, { recursive: true, force: true }); return; }
    catch (error) {
      if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(error?.code)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  try { rmSync(profile, { recursive: true, force: true }); }
  catch (error) {
    if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(error?.code)) throw error;
    console.warn(`Could not remove temporary Chromium profile ${profile}: ${error.message}`);
  }
}

let socket;
try {
  const targets = await waitJson('/json/list');
  const target = targets.find(({ type }) => type === 'page');
  assert.ok(target?.webSocketDebuggerUrl, 'Chromium page target');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
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
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  }
  async function evaluate(expression) {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    return response.result.value;
  }

  await send('Page.enable');
  await send('Runtime.enable');
  const frameTree = await send('Page.getFrameTree');
  let html = readFileSync(join(repositoryRoot, 'changes.html'), 'utf8');
  html = html.replace(/<script\b[^>]*src="\.\/src\/change-review-app\.js"[^>]*><\/script>/iu, '');
  await send('Page.setDocumentContent', { frameId: frameTree.frameTree.frame.id, html });

  await evaluate(`(() => {
    const values = new Map([['physmath.change.review.v1', ${JSON.stringify(JSON.stringify(storedState))}]]);
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: (key) => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    }});
    const digests = ${JSON.stringify(digestFixtures)};
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { subtle: {
      digest: async (_algorithm, bytes) => {
        const text = new TextDecoder().decode(bytes);
        const hex = digests[text];
        if (!hex) throw new Error('Unexpected SHA-256 fixture input');
        return Uint8Array.from(hex.match(/../g), (pair) => Number.parseInt(pair, 16)).buffer;
      },
    }}});
    const index = ${JSON.stringify(currentData.index)};
    const nodes = ${JSON.stringify(currentData.nodes)};
    const edges = ${JSON.stringify(currentData.edges)};
    const moves = ${JSON.stringify(currentData.research_moves)};
    const collections = ${JSON.stringify(currentData.collections)};
    window.fetch = async (path) => ({ ok: true, status: 200, json: async () =>
      String(path).endsWith('index.json') ? index : String(path).includes('nodes/core.json') ? nodes :
      String(path).endsWith('edges.json') ? edges : String(path).includes('research_moves') ? moves : collections });
  })()`);
  const model = stripExports(readFileSync(join(repositoryRoot, 'src/lib/change-review.js'), 'utf8'));
  const app = stripImports(readFileSync(join(repositoryRoot, 'src/change-review-app.js'), 'utf8'));
  await evaluate(`(() => {\n${model}\n${app}\n})()`);

  let ready = false;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    ready = await evaluate("document.querySelector('#change-center')?.hidden === false");
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  if (!ready) {
    const debug = await evaluate(`({
      text: document.querySelector('#loading')?.textContent,
      html: document.querySelector('#loading')?.innerHTML,
      classes: document.querySelector('#loading')?.className,
      center: document.querySelector('#change-center')?.hidden,
    })`);
    throw new Error(`Change review not ready: ${JSON.stringify(debug)}; exceptions: ${JSON.stringify(exceptions)}`);
  }

  const initial = await evaluate(`({
    total: document.querySelector('#stat-total')?.textContent,
    critical: document.querySelector('#stat-critical')?.textContent,
    visible: document.querySelectorAll('.change-card').length,
    baseline: document.querySelector('#baseline-status')?.textContent,
    error: document.querySelector('#loading')?.classList.contains('load-error'),
  })`);
  assert.ok(Number(initial.total) >= 5);
  assert.ok(Number(initial.critical) >= 2);
  assert.equal(initial.visible, Number(initial.total));
  assert.match(initial.baseline, /Baseline/);
  assert.equal(initial.error, false);

  const result = await evaluate(`(async () => {
    document.querySelector('.change-card .secondary-button').click();
    document.querySelector('#decision-status').value = 'accepted';
    document.querySelector('#decision-notes').value = 'Reviewed against the proposed graph patch.';
    document.querySelector('#save-decision').click();
    await new Promise((resolve) => setTimeout(resolve, 25));
    document.querySelector('#select-visible').click();
    document.querySelector('#mark-needs-work').click();
    await new Promise((resolve) => setTimeout(resolve, 25));
    document.querySelector('#risk-filter').value = 'critical';
    document.querySelector('#risk-filter').dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#language').value = 'es';
    document.querySelector('#language').dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 40));
    return {
      reviewed: document.querySelector('#stat-reviewed').textContent,
      selected: document.querySelector('#selected-count').textContent,
      visible: document.querySelectorAll('.change-card').length,
      stored: Boolean(localStorage.getItem('physmath.change.review.v1')),
      title: document.querySelector('#hero-title').textContent,
      firstStatus: document.querySelector('.change-card .badge.status-needs-work')?.textContent,
    };
  })()`);
  assert.equal(Number(result.reviewed), Number(initial.total));
  assert.equal(Number(result.selected), Number(initial.total));
  assert.ok(result.visible >= 2);
  assert.equal(result.stored, true);
  assert.equal(result.title, 'Detecta deriva arriesgada antes de hacerla canónica');
  assert.equal(result.firstStatus, 'Requiere trabajo');
  assert.deepEqual(exceptions, []);
  console.log('Canonical Change Review Center Chromium smoke passed.');
  await send('Browser.close').catch(() => {});
} finally {
  try { socket?.close(); } catch { /* Already closed. */ }
  await stopBrowser();
  await removeProfile();
}
