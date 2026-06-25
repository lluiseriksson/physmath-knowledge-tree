import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));

function browserCandidates() {
  const configured = [process.env.CHROMIUM_PATH, process.env.BROWSER_BIN].filter(Boolean);
  if (process.platform === 'win32') return [
    ...configured,
    join(process.env.PROGRAMFILES || '', 'Google/Chrome/Application/chrome.exe'),
    join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
    'chrome.exe', 'msedge.exe',
  ];
  if (process.platform === 'darwin') return [
    ...configured,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'google-chrome', 'chromium',
  ];
  return [
    ...configured,
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser',
  ];
}
function findBrowser() {
  for (const candidate of browserCandidates()) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0) return candidate;
  }
  throw new Error('No Chromium-family browser found. Set BROWSER_BIN or CHROMIUM_PATH.');
}
function moduleWrapper(source) {
  const names = [...source.matchAll(/^export\s+(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/gmu)].map((match) => match[1]);
  const body = source.replace(/^import[\s\S]*?;\n/gmu, '').replace(/^export\s+/gmu, '');
  return `(() => {\n${body}\nObject.assign(globalThis, { ${names.join(', ')} });\n})();`;
}
function appSource(source) {
  let output = source;
  while (/^import\s/u.test(output)) output = output.replace(/^import[\s\S]*?;\n/u, '');
  return output;
}

const browser = findBrowser();
const port = 9450;
const profile = mkdtempSync(join(tmpdir(), 'physmath-dossier-browser-'));
const chrome = spawn(browser, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-networking',
  '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let browserError = '';
chrome.stderr.on('data', (chunk) => { browserError += chunk; });

async function waitJson(path, attempts = 120) {
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

const now = '2026-06-25T15:00:00.000Z';
const index = { name: 'PhysMath Knowledge Tree', schema_version: '0.6.0', application_version: '2.6.0', updated: '2026-06-25', root_nodes: ['domain.logic'], confidence_levels: ['formal', 'literature', 'heuristic', 'speculative'] };
const nodes = [
  { id: 'domain.logic', kind: 'domain', title: 'Logic', summary: 'Formal foundations', confidence: 'literature', tags: ['logic'], questions: [], lean: { imports: ['Mathlib'], declarations: ['Prop'], targets: ['Model a finite proposition.'] }, references: [] },
  { id: 'problem.alpha', kind: 'problem', title: 'Problem Alpha', summary: 'Open target', confidence: 'heuristic', tags: ['alpha'], questions: [], lean: { imports: ['Mathlib.Data.Finset.Basic'], declarations: ['Finset'], targets: ['Formalize a finite toy model.'] }, references: [] },
  { id: 'problem.beta', kind: 'problem', title: 'Problem Beta', summary: 'Outside scope', confidence: 'speculative', tags: [], questions: [], lean: { imports: [], declarations: [], targets: [] }, references: [] },
];
const edges = [
  { id: 'edge.logic.alpha', source: 'domain.logic', target: 'problem.alpha', relation: 'suggests', confidence: 'heuristic', mechanism: 'Finite encodings expose the obstruction.', references: [] },
  { id: 'edge.alpha.beta', source: 'problem.alpha', target: 'problem.beta', relation: 'suggests', confidence: 'speculative', mechanism: 'Outside edge.', references: [] },
];
const moves = [];
const collections = [];
const registry = {
  schema_version: '1.0.0', graph_schema_version: '0.6.0', references: [
    { url: 'https://example.org/book', label: 'Logic Book', type: 'book', scopes: ['claim'], used_by: ['node:domain.logic'] },
    { url: 'https://example.org/paper', label: 'Alpha Paper', type: 'paper', scopes: ['claim'], used_by: ['edge:edge.logic.alpha'] },
  ],
};
const workspaceLibrary = {
  schema_version: 1, active_workspace_id: 'workspace.dossier-smoke', updated_at: now,
  workspaces: [{
    id: 'workspace.dossier-smoke', title: 'Dossier smoke campaign', node_ids: ['domain.logic', 'problem.alpha'],
    notes: 'Preserve the invariant while transferring the finite encoding.',
    bridge_cards: [{ id: 'card.smoke', title: 'Finite bridge', markdown: '## Falsifier\nA parity counterexample destroys the transfer.', node_ids: ['domain.logic', 'problem.alpha'], created_at: now, updated_at: now }],
    negative_results: [{ id: 'negative.smoke', title: 'Parity loss', status: 'observed', node_ids: ['problem.alpha'], observation: 'The first encoding loses parity.', challenged_mechanism: 'Parity preservation', next_test: 'Repeat with an even carrier.', created_at: now, updated_at: now }],
    created_at: now, updated_at: now,
  }],
};
const evidenceLedger = {
  schema_version: 1, updated_at: now, reviews: [
    { url: 'https://example.org/book', status: 'verified', source_class: 'secondary', identifier: null, checked_at: now, notes: '', updated_at: now },
    { url: 'https://example.org/paper', status: 'needs-follow-up', source_class: 'primary', identifier: null, checked_at: now, notes: 'Confirm theorem numbering.', updated_at: now },
  ],
};
const leanLedger = {
  schema_version: 1, updated_at: now, records: [
    ['domain.logic', 'import', 'Mathlib'], ['domain.logic', 'declaration', 'Prop'],
    ['problem.alpha', 'import', 'Mathlib.Data.Finset.Basic'], ['problem.alpha', 'declaration', 'Finset'],
  ].map(([nodeId, type, value]) => ({ item_id: JSON.stringify([nodeId, type, value]), status: 'verified', checked_at: now, toolchain: 'v4.31.0', replacement: '', notes: '', updated_at: now })),
};

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
  const consoleErrors = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    if (message.method === 'Runtime.consoleAPICalled' && ['error', 'assert'].includes(message.params.type)) consoleErrors.push(message.params);
    if (message.id && pending.has(message.id)) {
      const promise = pending.get(message.id); pending.delete(message.id);
      if (message.error) promise.reject(new Error(JSON.stringify(message.error)));
      else promise.resolve(message.result);
    }
  });
  function send(method, params = {}) {
    const id = ++nextId; socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  }
  async function evaluate(expression) {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    return response.result.value;
  }

  await send('Page.enable'); await send('Runtime.enable');
  const frameTree = await send('Page.getFrameTree');
  let html = readFileSync(join(repositoryRoot, 'dossiers.html'), 'utf8');
  html = html.replace(/<script\b[^>]*src="\.\/src\/dossier-app\.js"[^>]*><\/script>/iu, '');
  await send('Page.setDocumentContent', { frameId: frameTree.frameTree.frame.id, html });

  await evaluate(`(() => {
    const values = new Map([
      ['physmath.research.workspaces.v1', ${JSON.stringify(JSON.stringify(workspaceLibrary))}],
      ['physmath.evidence.reviews.v1', ${JSON.stringify(JSON.stringify(evidenceLedger))}],
      ['physmath.lean.target.audit.v1', ${JSON.stringify(JSON.stringify(leanLedger))}],
    ]);
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: (key) => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    }});
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { subtle: {
      digest: async (_algorithm, bytes) => {
        let hash = 2166136261;
        for (const byte of new Uint8Array(bytes)) { hash ^= byte; hash = Math.imul(hash, 16777619); }
        const output = new Uint8Array(32);
        for (let index = 0; index < output.length; index += 1) { hash = Math.imul(hash ^ index, 16777619); output[index] = hash >>> ((index % 4) * 8); }
        return output.buffer;
      },
    }}});
    const index = ${JSON.stringify(index)};
    const nodes = ${JSON.stringify(nodes)};
    const edges = ${JSON.stringify(edges)};
    const moves = ${JSON.stringify(moves)};
    const collections = ${JSON.stringify(collections)};
    const registry = ${JSON.stringify(registry)};
    window.fetch = async (path) => ({ ok: true, status: 200, json: async () =>
      String(path).endsWith('index.json') ? index : String(path).includes('nodes/core.json') ? nodes :
      String(path).endsWith('edges.json') ? edges : String(path).includes('research_moves') ? moves :
      String(path).includes('collections.json') ? collections : registry });
  })()`);

  for (const file of ['workspace.js', 'evidence-review.js', 'change-review.js', 'lean-target-audit.js', 'research-dossier.js']) {
    await evaluate(moduleWrapper(readFileSync(join(repositoryRoot, 'src/lib', file), 'utf8')));
  }
  await evaluate(`(() => {\n${appSource(readFileSync(join(repositoryRoot, 'src/dossier-app.js'), 'utf8'))}\n})()`);

  let ready = false;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    ready = await evaluate("document.querySelector('#dossier-center')?.hidden === false");
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  if (!ready) {
    const debug = await evaluate(`({ loading: document.querySelector('#loading')?.textContent, classes: document.querySelector('#loading')?.className })`);
    throw new Error(`Research dossier not ready: ${JSON.stringify(debug)}; exceptions: ${JSON.stringify(exceptions)}`);
  }

  const initial = await evaluate(`({
    workspace: document.querySelector('#workspace')?.value,
    nodes: document.querySelector('#stat-nodes')?.textContent,
    references: document.querySelector('#stat-references')?.textContent,
    lean: document.querySelector('#stat-lean')?.textContent,
    gates: document.querySelectorAll('.gate-card').length,
    actions: document.querySelectorAll('.action-card').length,
    overall: document.querySelector('#overall-status')?.textContent,
    fingerprint: document.querySelector('#fingerprint')?.textContent,
    exportEnabled: !document.querySelector('#export-json')?.disabled,
  })`);
  assert.equal(initial.workspace, 'workspace.dossier-smoke');
  assert.equal(initial.nodes, '2');
  assert.equal(initial.references, '2');
  assert.equal(initial.lean, '6');
  assert.equal(initial.gates, 6);
  assert.ok(initial.actions >= 2);
  assert.equal(initial.overall, 'Attention');
  assert.match(initial.fingerprint, /^[a-f0-9]{64}$/u);
  assert.equal(initial.exportEnabled, true);

  const translated = await evaluate(`(async () => {
    document.querySelector('#language').value = 'es';
    document.querySelector('#language').dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#refresh').click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    return {
      overall: document.querySelector('#overall-status').textContent,
      title: document.querySelector('#hero-title').textContent,
      refresh: document.querySelector('#refresh-state').textContent,
      sourceLinks: document.querySelectorAll('.source-links a').length,
    };
  })()`);
  assert.equal(translated.overall, 'Atención');
  assert.equal(translated.title, 'Un alcance, una traza de evidencia y una entrega de formalización');
  assert.equal(translated.refresh, 'Libros locales actualizados');
  assert.equal(translated.sourceLinks, 4);
  assert.deepEqual(exceptions, []);
  assert.deepEqual(consoleErrors, []);
  console.log('Research Dossier Center Chromium smoke passed.');
  await send('Browser.close').catch(() => {});
} finally {
  try { socket?.close(); } catch { /* Already closed. */ }
  await stopBrowser();
  await removeProfile();
}
