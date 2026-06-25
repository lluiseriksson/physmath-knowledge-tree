import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
function candidates() {
  const configured = [process.env.CHROMIUM_PATH, process.env.BROWSER_BIN].filter(Boolean);
  if (process.platform === 'win32') return [...configured,
    join(process.env.PROGRAMFILES || '', 'Google/Chrome/Application/chrome.exe'),
    join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
    'chrome.exe', 'msedge.exe'];
  if (process.platform === 'darwin') return [...configured,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium', 'google-chrome', 'chromium'];
  return [...configured, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
    '/usr/bin/chromium-browser', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
}
function findBrowser() {
  for (const candidate of candidates()) if (spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0) return candidate;
  throw new Error('No Chromium-family browser found. Set BROWSER_BIN or CHROMIUM_PATH.');
}
function stripImports(source) { let output = source; while (/^import\s/u.test(output)) output = output.replace(/^import[\s\S]*?;\n/u, ''); return output; }
function stripExports(source) { return source.replace(/^export\s+/gmu, ''); }

const browser = findBrowser();
const port = 9448;
const profile = mkdtempSync(join(tmpdir(), 'physmath-run-ledger-browser-'));
const chrome = spawn(browser, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-networking',
  '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let browserError = '';
chrome.stderr.on('data', (chunk) => { browserError += chunk; });
async function waitJson(path, attempts = 100) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try { const response = await fetch(`http://127.0.0.1:${port}${path}`); if (response.ok) return response.json(); } catch { /* Starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Chromium DevTools endpoint did not start.\n${browserError}`);
}
async function stopBrowser() {
  if (chrome.exitCode !== null || chrome.signalCode !== null) return;
  chrome.kill('SIGKILL');
  await new Promise((resolve) => { const timer = setTimeout(resolve, 2000); chrome.once('exit', () => { clearTimeout(timer); resolve(); }); });
}
async function removeProfile() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { rmSync(profile, { recursive: true, force: true }); return; }
    catch (error) { if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(error?.code)) throw error; await new Promise((resolve) => setTimeout(resolve, 100)); }
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
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let nextId = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    if (message.id && pending.has(message.id)) {
      const promise = pending.get(message.id); pending.delete(message.id);
      message.error ? promise.reject(new Error(JSON.stringify(message.error))) : promise.resolve(message.result);
    }
  });
  function send(method, params = {}) { const id = ++nextId; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => pending.set(id, { resolve, reject })); }
  async function evaluate(expression) { const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text); return response.result.value; }

  await send('Page.enable'); await send('Runtime.enable');
  const frame = (await send('Page.getFrameTree')).frameTree.frame.id;
  let html = readFileSync(join(root, 'runs.html'), 'utf8');
  html = html.replace(/<script\b[^>]*src="\.\/src\/run-ledger-app\.js"[^>]*><\/script>/iu, '');
  await send('Page.setDocumentContent', { frameId: frame, html });
  await evaluate(`(() => {
    const values = new Map();
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: (key) => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    }});
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { subtle: {
      digest: async () => new Uint8Array(32).fill(7).buffer,
    }}});
    const nodes = [
      { id: 'domain.alpha', title: 'Alpha domain' },
      { id: 'problem.beta', title: 'Beta problem' },
    ];
    window.fetch = async () => ({ ok: true, status: 200, json: async () => nodes });
  })()`);
  const model = stripExports(readFileSync(join(root, 'src/lib/run-ledger.js'), 'utf8'));
  const app = stripImports(readFileSync(join(root, 'src/run-ledger-app.js'), 'utf8'));
  await evaluate(`(() => {\n${model}\n${app}\n})()`);

  let ready = false;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    ready = await evaluate("document.querySelector('#run-center')?.hidden === false");
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  assert.equal(ready, true, `Run center ready; exceptions: ${JSON.stringify(exceptions)}`);
  assert.equal(await evaluate("document.querySelector('#stat-total').textContent"), '0');

  const saved = await evaluate(`(async () => {
    document.querySelector('#new-run').click();
    document.querySelector('#run-id').value = 'run.browser';
    document.querySelector('#run-name').value = 'Browser verification';
    document.querySelector('#run-kind').value = 'browser';
    document.querySelector('#run-status').value = 'passed';
    document.querySelector('#run-command').value = 'node\\n--test';
    document.querySelector('#run-artifacts').value = 'output | artifacts/report.json | ${'a'.repeat(64)} | 42 | application/json';
    document.querySelector('#run-nodes').options[0].selected = true;
    document.querySelector('#fingerprint-run').click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    document.querySelector('.run-card .secondary-button').click();
    document.querySelector('#verify-run').click();
    await new Promise((resolve) => setTimeout(resolve, 40));
    return {
      total: document.querySelector('#stat-total').textContent,
      passed: document.querySelector('#stat-passed').textContent,
      fingerprinted: document.querySelector('#stat-fingerprinted').textContent,
      reproducible: document.querySelector('#stat-reproducible').textContent,
      toast: document.querySelector('.toast')?.textContent,
      stored: Boolean(localStorage.getItem('physmath.research.runs.v1')),
    };
  })()`);
  assert.deepEqual(saved, { total: '1', passed: '1', fingerprinted: '1', reproducible: '1', toast: 'Fingerprint verified', stored: true });

  const bulk = await evaluate(`(async () => {
    document.querySelector('#detail-dialog').close();
    document.querySelector('#select-visible').click();
    document.querySelector('#mark-inconclusive').click();
    document.querySelector('#language').value = 'es';
    document.querySelector('#language').dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      inconclusive: document.querySelector('#stat-inconclusive').textContent,
      fingerprinted: document.querySelector('#stat-fingerprinted').textContent,
      title: document.querySelector('#hero-title').textContent,
    };
  })()`);
  assert.deepEqual(bulk, { inconclusive: '1', fingerprinted: '0', title: 'Registra lo que realmente se ejecutó' });
  assert.deepEqual(exceptions, []);
  console.log('Reproducible Run Ledger Chromium smoke passed.');
  await send('Browser.close').catch(() => {});
} finally {
  try { socket?.close(); } catch { /* Already closed. */ }
  await stopBrowser();
  await removeProfile();
}
