import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { resolve } from 'node:path';
import test from 'node:test';
import { createStaticServer, resolveRequestPath } from '../scripts/serve.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

test('request paths stay inside the configured root', () => {
  assert.equal(resolveRequestPath(root, '/'), resolve(root, 'index.html'));
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
});
