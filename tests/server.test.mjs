import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import fs from 'node:fs';
import { request as httpRequest } from 'node:http';
import { spawn } from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  createStaticServer,
  handleStaticRequest,
  parsePort,
  resolveBoundPort,
  resolveRequestPath,
  startStaticServer,
} from '../scripts/serve.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

test('request paths stay inside the configured root', () => {
  assert.equal(resolveRequestPath(root, '/'), resolve(root, 'index.html'));
  assert.equal(resolveRequestPath(root, ''), resolve(root, 'index.html'));
  assert.equal(resolveRequestPath(root), resolve(root, 'index.html'));
  assert.equal(resolveRequestPath(root, '/learning.html?view=list'), resolve(root, 'learning.html'));
  assert.equal(resolveRequestPath(root, '/%2e%2e%2fsecret.txt'), null);
  assert.equal(resolveRequestPath(root, '/%2e%2e%2fphysmath-final-evil/file'), null);
  assert.throws(() => resolveRequestPath(root, '/%E0%A4%A'), URIError);
});

test('static server returns content, security headers and safe method handling', async (context) => {
  const server = createStaticServer(root);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => server.close());
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const origin = `http://127.0.0.1:${address.port}`;

  const page = await fetch(`${origin}/index.html`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type') ?? '', /^text\/html/);
  assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
  assert.match(page.headers.get('content-security-policy') ?? '', /object-src 'none'/);
  assert.match(page.headers.get('content-security-policy') ?? '', /frame-ancestors 'none'/);
  assert.equal(page.headers.get('cross-origin-resource-policy'), 'same-origin');
  assert.equal(page.headers.get('x-frame-options'), 'DENY');
  assert.match(await page.text(), /PhysMath Knowledge Tree/);

  const head = await fetch(`${origin}/learning.html`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');

  const post = await fetch(`${origin}/`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');

  const missing = await fetch(`${origin}/missing-file`);
  assert.equal(missing.status, 404);

  const binaryFallback = await fetch(`${origin}/LICENSE`);
  assert.equal(binaryFallback.status, 200);
  assert.equal(binaryFallback.headers.get('content-type'), 'application/octet-stream');
});


test('request handler applies defaults and bound-port resolution is explicit', () => {
  const result = { status: 0, headers: {}, body: '' };
  const response = {
    writeHead(status, headers) {
      result.status = status;
      result.headers = headers;
    },
    end(body = '') {
      result.body = String(body);
    },
  };
  handleStaticRequest(resolve(root, 'missing-static-root'), {}, response);
  assert.equal(result.status, 404);
  assert.equal(result.body, 'Not found');

  assert.equal(resolveBoundPort({ address: '127.0.0.1', family: 'IPv4', port: 1234 }, 80), 1234);
  assert.equal(resolveBoundPort(null, 80), 80);
  assert.equal(resolveBoundPort('/tmp/socket', 80), 80);
});


function requestRaw(port, path, method = 'GET') {
  return new Promise((resolveRequest, reject) => {
    const request = httpRequest({ host: '127.0.0.1', port, path, method }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolveRequest({
        body: Buffer.concat(chunks).toString('utf8'),
        headers: response.headers,
        status: response.statusCode,
      }));
    });
    request.on('error', reject);
    request.end();
  });
}

test('static server rejects traversal and malformed request URLs', async (context) => {
  const server = createStaticServer(root);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => server.close());
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  const forbidden = await requestRaw(address.port, '/%2e%2e%2fsecret.txt');
  assert.equal(forbidden.status, 403);
  assert.equal(forbidden.body, 'Forbidden');

  const malformed = await requestRaw(address.port, '/%E0%A4%A');
  assert.equal(malformed.status, 400);
  assert.equal(malformed.body, 'Bad request');
});

test('static server converts unexpected synchronous failures into safe 500 responses', async (context) => {
  const originalStatSync = fs.statSync;
  const originalConsoleError = console.error;
  let calls = 0;
  let logged = false;
  fs.statSync = (...args) => {
    calls += 1;
    if (calls === 2) throw new Error('simulated stat failure');
    return originalStatSync(...args);
  };
  console.error = () => { logged = true; };
  syncBuiltinESMExports();

  const server = createStaticServer(root);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => server.close());
  context.after(() => {
    fs.statSync = originalStatSync;
    console.error = originalConsoleError;
    syncBuiltinESMExports();
  });
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  const failed = await requestRaw(address.port, '/index.html');
  assert.equal(failed.status, 500);
  assert.equal(failed.body, 'Internal server error');
  assert.equal(logged, true);
});



test('static server CLI helpers validate ports and report the actual bound port', async (context) => {
  assert.equal(parsePort(undefined), 4173);
  assert.equal(parsePort(''), 4173);
  assert.equal(parsePort('0'), 0);
  assert.equal(parsePort(0), 0);
  assert.throws(() => parsePort('-1'), /Invalid PORT/);
  assert.throws(() => parsePort('1.5'), /Invalid PORT/);
  assert.throws(() => parsePort('65536'), /Invalid PORT/);

  const messages = [];
  const server = startStaticServer(root, 0, (message) => messages.push(message));
  await once(server, 'listening');
  context.after(() => server.close());
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  assert.deepEqual(messages, [`PhysMath Knowledge Tree: http://127.0.0.1:${address.port}`]);

  const invalid = spawn(process.execPath, ['scripts/serve-cli.mjs', root], {
    cwd: root,
    env: { ...process.env, PORT: '-1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let invalidError = '';
  invalid.stderr.setEncoding('utf8');
  invalid.stderr.on('data', (chunk) => { invalidError += chunk; });
  const [invalidCode] = await once(invalid, 'exit');
  assert.notEqual(invalidCode, 0);
  assert.match(invalidError, /Invalid PORT/);

  const cli = spawn(process.execPath, ['scripts/serve-cli.mjs'], {
    cwd: root,
    env: { ...process.env, PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  cli.stdout.setEncoding('utf8');
  let cliOutput = '';
  await new Promise((resolveOutput, reject) => {
    const timeout = setTimeout(() => reject(new Error('CLI server did not report its port')), 5000);
    cli.stdout.on('data', (chunk) => {
      cliOutput += chunk;
      if (/http:\/\/127\.0\.0\.1:\d+/.test(cliOutput)) {
        clearTimeout(timeout);
        resolveOutput();
      }
    });
    cli.once('error', reject);
    cli.once('exit', (code) => {
      if (!/http:\/\/127\.0\.0\.1:\d+/.test(cliOutput)) {
        clearTimeout(timeout);
        reject(new Error(`CLI server exited early with ${code}`));
      }
    });
  });
  cli.kill();
  await once(cli, 'exit');
  assert.match(cliOutput, /PhysMath Knowledge Tree: http:\/\/127\.0\.0\.1:\d+/);
});
