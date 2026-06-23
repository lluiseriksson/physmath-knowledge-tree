import assert from 'node:assert/strict';
import { once } from 'node:events';
import fs, { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import {
  createStaticServer,
  handleStaticRequest,
  isPublicRequestPath,
  parsePort,
  resolveBoundPort,
  resolveRequestPath,
  startStaticServer,
} from '../scripts/serve.mjs';

function mockResponse() {
  const result = { status: 0, headers: {}, body: '' };
  return {
    result,
    response: {
      writeHead(status, headers) { result.status = status; result.headers = headers; },
      end(body = '') { result.body = String(body); },
    },
  };
}

function requestRaw(port, path, method = 'GET') {
  return new Promise((resolveRequest, reject) => {
    const request = httpRequest({ host: '127.0.0.1', port, path, method }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolveRequest({
        status: response.statusCode,
        headers: response.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      }));
    });
    request.on('error', reject);
    request.end();
  });
}

test('request resolution and handler status branches remain explicit', (context) => {
  const root = mkdtempSync(join(tmpdir(), 'physmath-handler-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'assets'));
  mkdirSync(join(root, 'docs'));
  mkdirSync(join(root, 'learning.html'));
  writeFileSync(join(root, 'index.html'), 'index');
  writeFileSync(join(root, 'LICENSE'), 'license');
  writeFileSync(join(root, '.nojekyll'), '');
  writeFileSync(join(root, 'package.json'), '{}');
  writeFileSync(join(root, 'assets', 'app.js'), 'app');

  assert.equal(resolveRequestPath(root), join(root, 'index.html'));
  assert.equal(resolveRequestPath(root, ''), join(root, 'index.html'));
  assert.equal(resolveRequestPath(root, '/docs/'), join(root, 'docs', 'index.html'));
  assert.equal(isPublicRequestPath(''), true);
  assert.throws(() => isPublicRequestPath('/bad%00name'), URIError);
  assert.equal(resolveRequestPath(root, '/%2e%2e%2fsecret'), null);
  assert.throws(() => resolveRequestPath(root, '/bad%00name'), URIError);
  assert.throws(() => resolveRequestPath(root, '/%5c..%5csecret'), URIError);

  let mocked = mockResponse();
  handleStaticRequest(root, { method: 'POST', url: '/' }, mocked.response);
  assert.equal(mocked.result.status, 405);
  assert.equal(mocked.result.headers.Allow, 'GET, HEAD');

  mocked = mockResponse();
  handleStaticRequest(root, { method: 'HEAD', url: '/%2e%2e%2fsecret' }, mocked.response);
  assert.equal(mocked.result.status, 403);
  assert.equal(mocked.result.body, 'Forbidden');

  mocked = mockResponse();
  handleStaticRequest(root, { method: 'HEAD', url: '/package.json' }, mocked.response);
  assert.equal(mocked.result.status, 404);
  assert.equal(mocked.result.body, 'Not found');

  mocked = mockResponse();
  handleStaticRequest(root, { method: 'HEAD', url: '/missing.txt' }, mocked.response);
  assert.equal(mocked.result.status, 404);

  mocked = mockResponse();
  handleStaticRequest(root, { method: 'HEAD', url: '/assets/missing.js' }, mocked.response);
  assert.equal(mocked.result.status, 404);
  assert.equal(mocked.result.body, 'Not found');

  mocked = mockResponse();
  handleStaticRequest(root, { method: 'HEAD', url: '/learning.html' }, mocked.response);
  assert.equal(mocked.result.status, 404);

  mocked = mockResponse();
  handleStaticRequest(root, { method: 'HEAD', url: '/index.html' }, mocked.response);
  assert.equal(mocked.result.status, 200);
  assert.equal(mocked.result.body, '');

  mocked = mockResponse();
  handleStaticRequest(root, { method: 'HEAD' }, mocked.response);
  assert.equal(mocked.result.status, 200);

  mocked = mockResponse();
  handleStaticRequest(root, { url: '/%E0%A4%A' }, mocked.response);
  assert.equal(mocked.result.status, 400);
  assert.equal(mocked.result.body, 'Bad request');

  const outside = join(root, '..', 'outside-handler');
  mkdirSync(outside);
  context.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(join(outside, 'secret.txt'), 'secret');
  symlinkSync(outside, join(root, 'assets', 'escape'), process.platform === 'win32' ? 'junction' : 'dir');
  mocked = mockResponse();
  handleStaticRequest(root, { method: 'HEAD', url: '/assets/escape/secret.txt' }, mocked.response);
  assert.equal(mocked.result.status, 403);
});

test('real server covers GET streaming, MIME fallback and safe 500 conversion', async (context) => {
  const root = mkdtempSync(join(tmpdir(), 'physmath-server-stream-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, 'index.html'), 'index');
  writeFileSync(join(root, 'LICENSE'), 'license');
  writeFileSync(join(root, '.nojekyll'), '');

  const server = createStaticServer(root);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => server.close());
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  const page = await requestRaw(address.port, '/index.html');
  assert.equal(page.status, 200);
  assert.equal(page.body, 'index');
  assert.match(page.headers['content-type'], /^text\/html/);
  const license = await requestRaw(address.port, '/LICENSE');
  assert.equal(license.headers['content-type'], 'application/octet-stream');
  const noJekyll = await requestRaw(address.port, '/.nojekyll');
  assert.match(noJekyll.headers['content-type'], /^text\/plain/);

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
  context.after(() => {
    fs.statSync = originalStatSync;
    console.error = originalConsoleError;
    syncBuiltinESMExports();
  });
  const failed = await requestRaw(address.port, '/index.html');
  assert.equal(failed.status, 500);
  assert.equal(failed.body, 'Internal server error');
  assert.equal(logged, true);
});

test('server port helpers cover defaults, errors, bound addresses and startup reporting', async (context) => {
  assert.equal(parsePort(undefined), 4173);
  assert.equal(parsePort(''), 4173);
  assert.equal(parsePort('0'), 0);
  assert.equal(parsePort(0), 0);
  assert.throws(() => parsePort('-1'), /Invalid PORT/);
  assert.throws(() => parsePort('1.5'), /Invalid PORT/);
  assert.throws(() => parsePort('65536'), /Invalid PORT/);
  assert.equal(resolveBoundPort({ address: '127.0.0.1', family: 'IPv4', port: 1234 }, 80), 1234);
  assert.equal(resolveBoundPort(null, 80), 80);
  assert.equal(resolveBoundPort('/tmp/socket', 80), 80);

  const root = mkdtempSync(join(tmpdir(), 'physmath-start-server-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, 'index.html'), 'index');
  const messages = [];
  const server = startStaticServer(root, 0, (message) => messages.push(message));
  await once(server, 'listening');
  context.after(() => server.close());
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  assert.deepEqual(messages, [`PhysMath Knowledge Tree: http://127.0.0.1:${address.port}`]);

  const defaultServer = createStaticServer();
  defaultServer.close();
});
