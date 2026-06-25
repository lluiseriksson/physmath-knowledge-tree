import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
function browserCandidates() {
  const configured = [process.env.CHROMIUM_PATH, process.env.BROWSER_BIN].filter(Boolean);
  if (process.platform === 'win32') return [...configured, join(process.env.PROGRAMFILES || '', 'Google/Chrome/Application/chrome.exe'), join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft/Edge/Application/msedge.exe'), 'chrome.exe', 'msedge.exe'];
  if (process.platform === 'darwin') return [...configured, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', 'google-chrome', 'chromium'];
  return [...configured, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
}
function findBrowser() {
  for (const candidate of browserCandidates()) if (spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0) return candidate;
  throw new Error('No Chromium-family browser found. Set BROWSER_BIN or CHROMIUM_PATH.');
}
function stripImports(source) { return source.replace(/^import[\s\S]*?;\n/gmu, ''); }
function stripExports(source) { return source.replace(/^export\s+/gmu, ''); }

const port = 9448;
const profile = mkdtempSync(join(tmpdir(), 'physmath-capsule-browser-'));
const browser = spawn(findBrowser(), ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let browserError = '';
browser.stderr.on('data', (chunk) => { browserError += chunk; });
async function waitJson(path, attempts = 100) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try { const response = await fetch(`http://127.0.0.1:${port}${path}`); if (response.ok) return response.json(); } catch { /* Starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Chromium DevTools endpoint did not start.\n${browserError}`);
}
async function stopBrowser() {
  if (browser.exitCode !== null || browser.signalCode !== null) return;
  browser.kill('SIGKILL');
  await new Promise((resolve) => { const timeout = setTimeout(resolve, 2000); browser.once('exit', () => { clearTimeout(timeout); resolve(); }); });
}
async function removeProfile() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { rmSync(profile, { recursive: true, force: true }); return; }
    catch (error) { if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(error?.code)) throw error; await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  try { rmSync(profile, { recursive: true, force: true }); }
  catch (error) { if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(error?.code)) throw error; console.warn(`Could not remove temporary Chromium profile ${profile}: ${error.message}`); }
}

const nodes = [{ id: 'domain.alpha', title: 'Alpha' }, { id: 'problem.beta', title: 'Beta' }];
const dossier = {
  application: 'PhysMath Knowledge Tree', schema_version: 1, kind: 'integrated-research-dossier', generated_at: '2026-06-25T12:00:00.000Z',
  graph: { name: 'PhysMath Knowledge Tree', schema_version: '0.6.0', application_version: '2.6.0', updated: '2026-06-25' },
  workspace: { id: 'workspace.alpha', title: 'Alpha campaign', notes: 'Mechanism', node_ids: ['domain.alpha', 'problem.beta'], bridge_cards: [], negative_results: [], created_at: '2026-06-25T12:00:00.000Z', updated_at: '2026-06-25T12:00:00.000Z' },
  scope: { node_count: 2, edge_count: 1, nodes: [{ id: 'domain.alpha', title: 'Alpha' }, { id: 'problem.beta', title: 'Beta' }], edges: [{ id: 'edge.alpha.beta', source: 'domain.alpha', target: 'problem.beta' }] },
  evidence: { reference_count: 0, claim_reference_count: 0, reviewed: 0, by_status: {}, references: [] }, lean: { item_count: 0, probe_item_count: 0, reviewed: 0, by_status: {}, items: [] },
  changes: { available: false, baseline_fingerprint: null, current_fingerprint: null, change_count: 0, governed_change_count: 0, by_status: {}, items: [] },
  readiness: { overall: 'ready', gates: [], action_count: 0, actions: [] }, content_fingerprint: 'a'.repeat(64),
};
const ledger = { application: 'PhysMath Knowledge Tree', schema_version: 1, updated_at: '2026-06-25T12:00:00.000Z', runs: [{
  id: 'run.alpha', title: 'Alpha calculation', kind: 'node', status: 'passed', node_ids: ['domain.alpha', 'problem.beta'], command: ['node', 'calc.mjs'], cwd: '', environment: {},
  provenance: { git_commit: 'b'.repeat(40), toolchain: 'node-22', platform: 'linux' }, started_at: '2026-06-25T11:59:59.000Z', completed_at: '2026-06-25T12:00:00.000Z', duration_ms: 1000, exit_code: 0, signal: '', timed_out: false,
  artifacts: [{ role: 'output', path: 'artifacts/alpha.json', sha256: 'c'.repeat(64), bytes: 42, media_type: 'application/json' }], notes: '', fingerprint: 'd'.repeat(64), created_at: '2026-06-25T12:00:00.000Z', updated_at: '2026-06-25T12:00:00.000Z',
}] };

const stubs = `
const verifyResearchDossier = async (value) => JSON.parse(JSON.stringify(value));
const importResearchDossier = async (text) => verifyResearchDossier(JSON.parse(text));
const normalizeRunLedger = (value) => JSON.parse(JSON.stringify(value ?? { application: 'PhysMath Knowledge Tree', schema_version: 1, updated_at: new Date().toISOString(), runs: [] }));
const mergeRunLedgers = (left, right) => ({ ...left, runs: [...new Map([...left.runs, ...right.runs].map((run) => [run.id, run])).values()] });
const parseRunImport = (text) => normalizeRunLedger(JSON.parse(text));
const verifyRunFingerprint = async (run) => Boolean(run.fingerprint);
const canonicalStringify = (value) => JSON.stringify(value, Object.keys(value).sort());
const sha256Hex = async (text) => { let hash = 2166136261; for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619); return (hash >>> 0).toString(16).padStart(8, '0').repeat(8); };
`;

let socket;
try {
  const targets = await waitJson('/json/list');
  const target = targets.find(({ type }) => type === 'page');
  assert.ok(target?.webSocketDebuggerUrl, 'Chromium page target');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let nextId = 0; const pending = new Map(); const exceptions = [];
  socket.addEventListener('message', (event) => { const message = JSON.parse(event.data); if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails); if (message.id && pending.has(message.id)) { const promise = pending.get(message.id); pending.delete(message.id); message.error ? promise.reject(new Error(JSON.stringify(message.error))) : promise.resolve(message.result); } });
  function send(method, params = {}) { const id = ++nextId; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => pending.set(id, { resolve, reject })); }
  async function evaluate(expression) { const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text); return response.result.value; }
  await send('Page.enable'); await send('Runtime.enable'); const frameTree = await send('Page.getFrameTree');
  let html = readFileSync(join(root, 'capsules.html'), 'utf8').replace(/<script\b[^>]*src="\.\/src\/capsule-app\.js"[^>]*><\/script>/iu, '');
  await send('Page.setDocumentContent', { frameId: frameTree.frameTree.frame.id, html });
  await evaluate(`(() => {
    const values = new Map([['physmath.research.runs.v1', ${JSON.stringify(JSON.stringify(ledger))}]]);
    Object.defineProperty(window, 'localStorage', { configurable: true, value: { getItem: (key) => values.has(key) ? values.get(key) : null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) }});
    window.fetch = async () => ({ ok: true, status: 200, json: async () => ${JSON.stringify(nodes)} });
    window.__downloads = [];
    URL.createObjectURL = (blob) => { window.__lastDownloadBlob = blob; return 'blob:capsule-test'; };
    URL.revokeObjectURL = () => {};
    HTMLAnchorElement.prototype.click = function click() { window.__downloads.push({ download: this.download, href: this.href }); };
  })()`);
  const model = stripExports(stripImports(readFileSync(join(root, 'src/lib/research-capsule.js'), 'utf8')));
  const app = stripImports(readFileSync(join(root, 'src/capsule-app.js'), 'utf8'));
  await evaluate(`(() => { ${stubs}\n${model}\n${app} })()`);
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt += 1) { ready = await evaluate("document.querySelector('#capsule-center')?.hidden === false"); if (ready) break; await new Promise((resolve) => setTimeout(resolve, 25)); }
  assert.equal(ready, true, `Capsule page ready; exceptions: ${JSON.stringify(exceptions)}`);
  const result = await evaluate(`(async () => {
    const input = document.querySelector('#dossier-file'); const transfer = new DataTransfer(); transfer.items.add(new File([${JSON.stringify(JSON.stringify(dossier))}], 'dossier.json', { type: 'application/json' })); input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    document.querySelector('#build-capsule').click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    document.querySelector('#export-json').click();
    const capsuleText = await window.__lastDownloadBlob.text();
    document.querySelector('#language').value = 'es'; document.querySelector('#language').dispatchEvent(new Event('change', { bubbles: true })); await new Promise((resolve) => setTimeout(resolve, 30));
    const capsuleInput = document.querySelector('#capsule-file');
    const capsuleTransfer = new DataTransfer();
    capsuleTransfer.items.add(new File([capsuleText], 'capsule.json', { type: 'application/json' }));
    capsuleInput.files = capsuleTransfer.files;
    capsuleInput.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      scope: document.querySelector('#stat-scope').textContent,
      selected: document.querySelector('#stat-selected').textContent,
      passed: document.querySelector('#stat-passed').textContent,
      gates: document.querySelectorAll('.gate-card').length,
      readiness: document.querySelector('#readiness-badge').textContent,
      title: document.querySelector('#hero-title').textContent,
      runs: document.querySelectorAll('.capsule-run').length,
      downloads: window.__downloads.map(({ download }) => download),
      verified: document.querySelector('#input-status').textContent,
    };
  })()`);
  assert.deepEqual(result, {
    scope: '2', selected: '1', passed: '1', gates: 7, readiness: 'lista',
    title: 'Une intención, ejecución y artefactos en una entrega verificable', runs: 1,
    downloads: ['physmath-research-capsule.json'], verified: 'Huella de la cápsula verificada.',
  });
  assert.deepEqual(exceptions, []);
  console.log('Research Capsule Center Chromium smoke passed.');
  await send('Browser.close').catch(() => {});
} finally {
  try { socket?.close(); } catch { /* Already closed. */ }
  await stopBrowser();
  await removeProfile();
}
