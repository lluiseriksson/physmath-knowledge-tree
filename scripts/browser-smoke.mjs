import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startStaticServer } from './serve.mjs';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const staticRoot = resolve(projectRoot, process.argv[2] || 'dist');
if (!existsSync(staticRoot)) throw new Error(`Browser test root does not exist: ${staticRoot}`);

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

function browserCandidates() {
  const configured = process.env.BROWSER_BIN ? [process.env.BROWSER_BIN] : [];
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
  for (const candidate of browserCandidates().filter(Boolean)) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0) {
      return {
        executable: candidate,
        version: `${probe.stdout || probe.stderr}`.trim(),
      };
    }
  }
  throw new Error('No Chromium-family browser found. Set BROWSER_BIN to a Chrome, Chromium or Edge executable.');
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    socket.addEventListener('message', (event) => this.#handleMessage(event));
    socket.addEventListener('close', () => this.#rejectPending(new Error('Browser debugging socket closed')));
  }

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolveOpen, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timed out opening browser debugging socket')), 10000);
      socket.addEventListener('open', () => {
        clearTimeout(timeout);
        resolveOpen();
      }, { once: true });
      socket.addEventListener('error', () => {
        clearTimeout(timeout);
        reject(new Error('Failed to open browser debugging socket'));
      }, { once: true });
    });
    return new CdpClient(socket);
  }

  #handleMessage(event) {
    const message = JSON.parse(String(event.data));
    if (message.id) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
      else pending.resolve(message.result);
      return;
    }
    const listeners = this.listeners.get(message.method) ?? [];
    for (const listener of listeners) listener(message.params);
  }

  #rejectPending(error) {
    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
    return () => this.listeners.set(method, listeners.filter((item) => item !== listener));
  }

  once(method, timeoutMilliseconds = 10000) {
    return new Promise((resolveEvent, reject) => {
      const timeout = setTimeout(() => {
        unsubscribe();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMilliseconds);
      const unsubscribe = this.on(method, (params) => {
        clearTimeout(timeout);
        unsubscribe();
        resolveEvent(params);
      });
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolveCommand, reject) => {
      this.pending.set(id, { method, resolve: resolveCommand, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

async function waitForDebuggingPort(profile, browserProcess, stderr, timeoutMilliseconds = 15000) {
  const portFile = join(profile, 'DevToolsActivePort');
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    if (browserProcess.exitCode !== null) {
      throw new Error(`Browser exited before debugging was ready.\n${stderr.value}`);
    }
    if (existsSync(portFile)) {
      const [port] = (await readFile(portFile, 'utf8')).trim().split(/\r?\n/);
      if (/^\d+$/u.test(port)) return Number(port);
    }
    await delay(50);
  }
  throw new Error(`Timed out waiting for browser debugging port.\n${stderr.value}`);
}

async function findPageTarget(port) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // Chromium may publish the port before the JSON endpoint is ready.
    }
    await delay(50);
  }
  throw new Error('Timed out finding the browser page target');
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  if (result.exceptionDetails) {
    const description = result.exceptionDetails.exception?.description ?? result.exceptionDetails.text;
    throw new Error(`Browser evaluation failed: ${description}`);
  }
  return result.result.value;
}

async function waitForExpression(client, expression, label, timeoutMilliseconds = 10000) {
  const deadline = Date.now() + timeoutMilliseconds;
  let lastError = '';
  while (Date.now() < deadline) {
    try {
      if (await evaluate(client, expression)) return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await delay(50);
  }
  throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError}` : ''}`);
}

async function navigate(client, url) {
  const loaded = client.once('Page.loadEventFired', 15000);
  const result = await client.send('Page.navigate', { url });
  if (result.errorText) throw new Error(`Navigation failed: ${result.errorText}`);
  await loaded;
  await waitForExpression(client, "document.readyState === 'complete'", `document load for ${url}`);
}

async function removeBrowserProfile(profile) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      await rm(profile, { recursive: true, force: true });
      return;
    } catch (error) {
      const code = error?.code;
      if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(code) || attempt === 6) {
        console.warn(`Could not remove temporary browser profile ${profile}: ${error.message}`);
        return;
      }
      await delay(150 * attempt);
    }
  }
}

async function assertRuntimeAccessibility(client, label) {
  const issues = await evaluate(client, `(() => {
    const issues = [];
    const ids = new Map();
    for (const element of document.querySelectorAll('[id]')) {
      ids.set(element.id, (ids.get(element.id) ?? 0) + 1);
    }
    for (const [id, count] of ids) {
      if (count > 1) issues.push(\`duplicate id #\${id} (\${count})\`);
    }

    const labelledByText = (element) => (element.getAttribute('aria-labelledby') ?? '')
      .split(/\\s+/u)
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
    const associatedLabelText = (element) => [...(element.labels ?? [])]
      .map((labelElement) => labelElement.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
    const accessibleName = (element) => (
      element.getAttribute('aria-label')?.trim()
      || labelledByText(element)
      || associatedLabelText(element)
      || (element.matches('input[type="submit"], input[type="button"]') ? element.value.trim() : '')
      || element.textContent?.trim()
      || element.getAttribute('title')?.trim()
      || ''
    );

    for (const element of document.querySelectorAll(
      'button, [role="button"], a[href], input:not([type="hidden"]), select, textarea'
    )) {
      if (!accessibleName(element)) {
        issues.push(\`missing accessible name: \${element.tagName.toLowerCase()}#\${element.id}\`);
      }
    }
    for (const element of document.querySelectorAll('[role="button"]')) {
      if (!element.matches('button, a[href], input, select, textarea') && !element.hasAttribute('tabindex')) {
        issues.push(\`custom button is not keyboard focusable: #\${element.id}\`);
      }
    }
    for (const image of document.querySelectorAll('img')) {
      if (!image.hasAttribute('alt')) issues.push(\`image missing alt: \${image.src}\`);
    }
    if (!document.documentElement.lang) issues.push('document language is missing');
    if (document.querySelectorAll('main').length !== 1) issues.push('document must have exactly one main landmark');
    if (document.querySelectorAll('h1').length !== 1) issues.push('document must have exactly one h1');
    return issues;
  })()`);
  assert.deepEqual(issues, [], `${label} runtime accessibility issues:\n${issues.join('\n')}`);
}

async function runOfflineScenario(client, origin, closeServer) {
  await waitForExpression(
    client,
    "navigator.serviceWorker && navigator.serviceWorker.ready.then(() => true)",
    'service worker readiness',
    15000,
  );
  if (!(await evaluate(client, 'Boolean(navigator.serviceWorker.controller)'))) {
    await navigate(client, `${origin}/learning.html?e2e-controlled=1`);
  }
  await waitForExpression(
    client,
    'Boolean(navigator.serviceWorker.controller)',
    'service worker control',
    15000,
  );

  await closeServer();
  await navigate(client, `${origin}/e2e-offline-fallback`);
  await waitForExpression(
    client,
    "/offline|sin conexión/i.test(document.querySelector('h1')?.textContent ?? '')",
    'offline fallback page',
  );
  return {
    controlled: true,
    heading: await evaluate(client, "document.querySelector('h1').textContent"),
  };
}

async function runResearchScenario(client, origin) {
  await navigate(client, `${origin}/index.html`);
  await waitForExpression(
    client,
    "!document.querySelector('#app-shell').hidden && document.querySelectorAll('.graph-node').length === 58",
    'research graph initialization',
    15000,
  );

  const initial = await evaluate(client, `(() => ({
    nodes: document.querySelectorAll('.graph-node').length,
    edges: document.querySelectorAll('.graph-edge').length,
    loadingHidden: document.querySelector('#loading').hidden,
    shellHidden: document.querySelector('#app-shell').hidden,
    summary: document.querySelector('#visible-summary').textContent,
  }))()`);
  assert.deepEqual(initial.nodes, 58);
  assert.deepEqual(initial.edges, 112);
  assert.equal(initial.loadingHidden, true);
  assert.equal(initial.shellHidden, false);

  await evaluate(client, `(() => {
    const input = document.querySelector('#search');
    input.value = 'Riemann';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await waitForExpression(client, "document.querySelectorAll('.search-result').length > 0", 'research search results');
  const searchTitle = await evaluate(client, "document.querySelector('.search-result strong').textContent");
  assert.match(searchTitle, /Riemann/i);

  await evaluate(client, "document.querySelector('.search-result').click()");
  await waitForExpression(client, "document.querySelector('#details').classList.contains('open')", 'research node details');
  const detailTitle = await evaluate(client, "document.querySelector('#detail-title').textContent");
  assert.match(detailTitle, /Riemann/i);
  assert.match(await evaluate(client, 'location.search'), /node=problem\.riemann_hypothesis/);

  await evaluate(client, "document.querySelector('#list-view-button').click()");
  await waitForExpression(
    client,
    "!document.querySelector('#list-view').hidden && document.querySelectorAll('.node-list-card').length === 58",
    'research list view',
  );
  assert.match(await evaluate(client, 'location.search'), /view=list/);

  await evaluate(client, `(() => {
    const language = document.querySelector('#language');
    language.value = 'es';
    language.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await waitForExpression(client, "document.documentElement.lang === 'es'", 'Spanish research interface');

  await evaluate(client, `(() => {
    const source = document.querySelector('#path-source');
    const target = document.querySelector('#path-target');
    source.value = 'domain.number_theory';
    target.value = 'problem.riemann_hypothesis';
    document.querySelector('#find-path').click();
  })()`);
  await waitForExpression(client, "document.querySelectorAll('#path-result ol li').length >= 2", 'research path result');
  const pathNodes = await evaluate(client, "document.querySelectorAll('#path-result ol li').length");
  assert.ok(pathNodes >= 2);
  await assertRuntimeAccessibility(client, 'research application');

  return {
    nodes: initial.nodes,
    edges: initial.edges,
    search: searchTitle,
    detail: detailTitle,
    path_nodes: pathNodes,
    language: await evaluate(client, 'document.documentElement.lang'),
  };
}

async function runLearningScenario(client, origin) {
  await navigate(client, `${origin}/learning.html`);
  await waitForExpression(
    client,
    "document.querySelectorAll('.graph-node').length === 90",
    'learning graph initialization',
    15000,
  );
  const graphNodes = await evaluate(client, "document.querySelectorAll('.graph-node').length");
  assert.equal(graphNodes, 90);

  await evaluate(client, `(() => {
    const language = document.querySelector('#language');
    language.value = 'es';
    language.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await waitForExpression(client, "document.documentElement.lang === 'es'", 'Spanish learning interface');

  await evaluate(client, "document.querySelector('#list-view-button').click()");
  await waitForExpression(
    client,
    "!document.querySelector('#list').hidden && document.querySelectorAll('.topic-card').length === 90",
    'learning list view',
  );
  const listCards = await evaluate(client, "document.querySelectorAll('.topic-card').length");
  assert.equal(listCards, 90);

  await evaluate(client, `(() => {
    const input = document.querySelector('#search');
    input.value = 'relatividad general';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await waitForExpression(client, "document.querySelectorAll('#search-results .result').length > 0", 'learning search results');
  const searchTitle = await evaluate(client, "document.querySelector('#search-results .result strong').textContent");
  assert.match(searchTitle, /relatividad general/i);

  await evaluate(client, "document.querySelector('#search-results .result').click()");
  await waitForExpression(client, "document.querySelector('#details').classList.contains('open')", 'learning topic details');
  const detailTitle = await evaluate(client, "document.querySelector('#detail-title').textContent");
  assert.match(detailTitle, /relatividad general/i);

  await evaluate(client, "document.querySelector('.status-selector button[data-status=\"mastered\"]').click()");
  await waitForExpression(client, `(() => {
    const raw = localStorage.getItem('physmath-knowledge-tree:progress:v1');
    return raw && JSON.parse(raw).statuses['general-relativity'] === 'mastered';
  })()`, 'persisted learning progress');

  const persisted = await evaluate(client, `(() => {
    const raw = localStorage.getItem('physmath-knowledge-tree:progress:v1');
    return JSON.parse(raw).statuses['general-relativity'];
  })()`);
  assert.equal(persisted, 'mastered');
  await assertRuntimeAccessibility(client, 'learning application');

  return {
    graph_nodes: graphNodes,
    list_cards: listCards,
    search: searchTitle,
    detail: detailTitle,
    persisted_status: persisted,
    language: await evaluate(client, 'document.documentElement.lang'),
  };
}

const browser = findBrowser();
const profile = await mkdtemp(join(tmpdir(), 'physmath-browser-'));
const stderr = { value: '' };
const server = startStaticServer(staticRoot, 0, () => {});
await once(server, 'listening');
const address = server.address();
if (!address || typeof address !== 'object') throw new Error('Static server did not bind a TCP port');
const origin = `http://127.0.0.1:${address.port}`;
let serverOpen = true;
async function closeServer() {
  if (!serverOpen) return;
  await new Promise((resolveClose, rejectClose) => {
    server.close((error) => {
      if (error) rejectClose(error);
      else {
        serverOpen = false;
        resolveClose();
      }
    });
  });
}

const browserProcess = spawn(browser.executable, [
  '--headless=new',
  '--disable-background-networking',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-gpu',
  '--disable-gpu-sandbox',
  '--disable-software-rasterizer',
  '--disable-sync',
  '--metrics-recording-only',
  '--no-first-run',
  '--no-sandbox',
  '--remote-allow-origins=*',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
browserProcess.stderr.setEncoding('utf8');
browserProcess.stderr.on('data', (chunk) => {
  stderr.value = `${stderr.value}${chunk}`.slice(-12000);
});

let client;
try {
  const debuggingPort = await waitForDebuggingPort(profile, browserProcess, stderr);
  const target = (await findPageTarget(debuggingPort)).replace('ws://localhost:', 'ws://127.0.0.1:');
  try {
    client = await CdpClient.connect(target);
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : String(error)}\n${stderr.value}`);
  }
  await Promise.all([
    client.send('Page.enable'),
    client.send('Runtime.enable'),
    client.send('Log.enable'),
    client.send('Network.enable'),
  ]);
  const browserInfo = await client.send('Browser.getVersion');
  const browserVersion = browserInfo.product || browser.version;

  const failures = [];
  client.on('Runtime.exceptionThrown', ({ exceptionDetails }) => {
    failures.push(`Uncaught exception: ${exceptionDetails.exception?.description ?? exceptionDetails.text}`);
  });
  client.on('Runtime.consoleAPICalled', ({ type, args }) => {
    if (type === 'error' || type === 'assert') {
      failures.push(`Console ${type}: ${args.map((item) => item.value ?? item.description).join(' ')}`);
    }
  });
  client.on('Log.entryAdded', ({ entry }) => {
    if (entry.level === 'error') failures.push(`Browser log error: ${entry.text}`);
  });
  client.on('Network.responseReceived', ({ response }) => {
    if (response.url.startsWith(origin) && response.status >= 400) {
      failures.push(`HTTP ${response.status}: ${response.url}`);
    }
  });

  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `try {
      localStorage.clear();
      localStorage.setItem(
        'physmath-knowledge-tree:preferences:v1',
        JSON.stringify({ onboardingSeen: 'true' })
      );
    } catch {}`,
  });

  const research = await runResearchScenario(client, origin);
  const learning = await runLearningScenario(client, origin);
  const offline = await runOfflineScenario(client, origin, closeServer);
  if (failures.length > 0) throw new Error(failures.join('\n'));

  console.log(`Browser smoke passed with ${browserVersion}.`);
  console.log(JSON.stringify({
    browser: browserVersion,
    static_root: basename(staticRoot),
    research,
    learning,
    offline,
  }, null, 2));
} finally {
  client?.close();
  if (browserProcess.exitCode === null) browserProcess.kill();
  await Promise.race([
    once(browserProcess, 'exit'),
    delay(2000).then(() => {
      if (browserProcess.exitCode === null) browserProcess.kill('SIGKILL');
    }),
  ]).catch(() => {});
  await closeServer().catch(() => {});
  await removeBrowserProfile(profile);
}
