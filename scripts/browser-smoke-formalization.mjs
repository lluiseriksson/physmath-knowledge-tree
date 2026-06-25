import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const nodes = [
  {
    id: 'domain.logic', kind: 'domain', title: 'Logic', confidence: 'literature',
    lean: {
      imports: ['Mathlib'],
      declarations: ['Prop', 'Sort'],
      targets: ['Check a finite logical equivalence.'],
    },
  },
  {
    id: 'domain.category', kind: 'domain', title: 'Category theory', confidence: 'formal',
    lean: {
      imports: ['Mathlib.CategoryTheory.Category.Basic'],
      declarations: ['CategoryTheory.Category'],
      targets: ['Audit a functorial bridge.'],
    },
  },
  {
    id: 'problem.alpha', kind: 'problem', title: 'Problem Alpha', confidence: 'heuristic',
    lean: {
      imports: ['Mathlib'],
      declarations: [],
      targets: ['Locate a bounded formal statement.'],
    },
  },
];

const browser = findBrowser();
const port = 9447;
const profile = mkdtempSync(join(tmpdir(), 'physmath-lean-audit-browser-'));
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
  let html = readFileSync(join(repositoryRoot, 'formalization.html'), 'utf8');
  html = html.replace(/<script\b[^>]*src="\.\/src\/formalization-app\.js"[^>]*><\/script>/iu, '');
  await send('Page.setDocumentContent', { frameId: frameTree.frameTree.frame.id, html });

  await evaluate(`(() => {
    const values = new Map();
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: (key) => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
      clear: () => values.clear(),
    }});
    const nodes = ${JSON.stringify(nodes)};
    window.fetch = async () => ({ ok: true, status: 200, json: async () => nodes });
  })()`);

  const model = stripExports(readFileSync(join(repositoryRoot, 'src/lib/lean-target-audit.js'), 'utf8'));
  const app = stripImports(readFileSync(join(repositoryRoot, 'src/formalization-app.js'), 'utf8'));
  await evaluate(`(() => {\n${model}\n${app}\n})()`);

  let ready = false;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    ready = await evaluate("document.querySelector('#lean-audit-center')?.hidden === false");
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  if (!ready) {
    const debug = await evaluate(`({
      text: document.querySelector('#loading')?.textContent,
      classes: document.querySelector('#loading')?.className,
      center: document.querySelector('#lean-audit-center')?.hidden,
    })`);
    throw new Error(`Lean target audit not ready: ${JSON.stringify(debug)}; exceptions: ${JSON.stringify(exceptions)}`);
  }

  const initial = await evaluate(`({
    total: document.querySelector('#stat-total')?.textContent,
    declarations: document.querySelector('#stat-declarations')?.textContent,
    imports: document.querySelector('#stat-imports')?.textContent,
    visible: document.querySelectorAll('.audit-card').length,
    loadError: document.querySelector('#loading')?.classList.contains('load-error'),
  })`);
  assert.deepEqual(initial, { total: '9', declarations: '3', imports: '3', visible: 9, loadError: false });

  const result = await evaluate(`(async () => {
    document.querySelector('.audit-card .secondary-button').click();
    document.querySelector('#audit-status').value = 'renamed';
    document.querySelector('#audit-checked').value = '2026-06-25';
    document.querySelector('#audit-toolchain').value = 'leanprover/lean4:v4.31.0';
    document.querySelector('#audit-replacement').value = 'CategoryTheory.Category';
    document.querySelector('#audit-notes').value = 'Checked with a bounded #check probe.';
    document.querySelector('#save-audit').click();
    await new Promise((resolve) => setTimeout(resolve, 25));

    document.querySelector('#type-filter').value = 'declaration';
    document.querySelector('#type-filter').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#select-visible').click();
    document.querySelector('#probe-toolchain').value = 'leanprover/lean4:v4.31.0';
    document.querySelector('#preview-probe').click();
    await new Promise((resolve) => setTimeout(resolve, 25));

    const probe = document.querySelector('#probe-output').value;
    document.querySelector('#probe-dialog').close();
    document.querySelector('#language').value = 'es';
    document.querySelector('#language').dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 40));
    return {
      reviewed: document.querySelector('#stat-reviewed').textContent,
      renamed: document.querySelectorAll('.badge.status-renamed').length,
      selected: document.querySelector('#selected-count').textContent,
      visible: document.querySelectorAll('.audit-card').length,
      stored: Boolean(localStorage.getItem('physmath.lean.target.audit.v1')),
      title: document.querySelector('#hero-title').textContent,
      probeHasCheck: probe.includes('#check'),
      probeHasBoundary: probe.includes('does not validate the surrounding mathematical claim'),
      toolchain: probe.includes('leanprover/lean4:v4.31.0'),
    };
  })()`);
  assert.deepEqual(result, {
    reviewed: '1', renamed: 1, selected: '3', visible: 9, stored: true,
    title: 'Comprueba que imports y declaraciones candidatas siguen existiendo',
    probeHasCheck: true, probeHasBoundary: true, toolchain: true,
  });
  assert.deepEqual(exceptions, []);
  console.log('Lean Target Audit Center Chromium smoke passed.');
  await send('Browser.close').catch(() => {});
} finally {
  try { socket?.close(); } catch { /* Already closed. */ }
  await stopBrowser();
  await removeProfile();
}
