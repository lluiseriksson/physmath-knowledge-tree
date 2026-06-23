import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createStaticServer, isPublicRequestPath } from '../scripts/serve.mjs';

test('public request policy mirrors the deployed static surface', () => {
  assert.equal(isPublicRequestPath(), true);
  assert.equal(isPublicRequestPath(''), true);
  assert.equal(isPublicRequestPath('/'), true);
  assert.equal(isPublicRequestPath('/index.html?topic=x'), true);
  assert.equal(isPublicRequestPath('/LICENSE'), true);
  assert.equal(isPublicRequestPath('/.nojekyll'), true);
  assert.equal(isPublicRequestPath('/_headers'), true);
  assert.equal(isPublicRequestPath('/build-manifest.json'), true);
  assert.equal(isPublicRequestPath('/assets/icons/icon.svg'), true);
  assert.equal(isPublicRequestPath('/src/lib/graph.js'), true);
  assert.equal(isPublicRequestPath('/graph/index.json'), true);
  assert.equal(isPublicRequestPath('/docs/USE_CASES.md'), true);
  assert.equal(isPublicRequestPath('/curation/REPORT.md'), true);
  assert.equal(isPublicRequestPath('/package.json'), false);
  assert.equal(isPublicRequestPath('/scripts/serve.mjs'), false);
  assert.equal(isPublicRequestPath('/tests/server.test.mjs'), false);
  assert.equal(isPublicRequestPath('/assets/.secret'), false);
  assert.equal(isPublicRequestPath('/.git/config'), false);
  assert.equal(isPublicRequestPath('/unknown.txt'), false);
  assert.throws(() => isPublicRequestPath('/bad%00name'), URIError);
  assert.throws(() => isPublicRequestPath('/%5c..%5csecret'), URIError);
});

test('static server denies existing repository internals while retaining public files and normal 404s', async (context) => {
  const root = mkdtempSync(join(tmpdir(), 'physmath-public-surface-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ['assets', 'assets/private', 'docs', 'scripts', 'tests', '.git']) {
    mkdirSync(join(root, directory), { recursive: true });
  }
  writeFileSync(join(root, 'index.html'), 'public index');
  writeFileSync(join(root, 'LICENSE'), 'public license');
  writeFileSync(join(root, 'assets', 'app.js'), 'public asset');
  writeFileSync(join(root, 'assets', 'private', 'visible.css'), 'nested public asset');
  writeFileSync(join(root, 'docs', 'guide.md'), '# Guide');
  writeFileSync(join(root, 'docs', 'graph.jsonld'), '{"@context":{}}');
  writeFileSync(join(root, 'sitemap.xml'), '<urlset/>');
  writeFileSync(join(root, 'package.json'), '{"private":true}');
  writeFileSync(join(root, 'scripts', 'serve.mjs'), 'private script');
  writeFileSync(join(root, 'tests', 'secret.test.mjs'), 'private test');
  writeFileSync(join(root, '.git', 'config'), 'private git config');

  const server = createStaticServer(root);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => server.close());
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const origin = `http://127.0.0.1:${address.port}`;

  for (const path of ['/', '/LICENSE', '/assets/app.js', '/assets/private/visible.css', '/docs/guide.md', '/docs/graph.jsonld', '/sitemap.xml']) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get('origin-agent-cluster'), '?1');
    assert.equal(response.headers.get('x-permitted-cross-domain-policies'), 'none');
    if (path.endsWith('.md')) assert.match(response.headers.get('content-type') ?? '', /^text\/markdown/);
    if (path.endsWith('.xml')) assert.match(response.headers.get('content-type') ?? '', /^application\/xml/);
    if (path.endsWith('.jsonld')) assert.match(response.headers.get('content-type') ?? '', /^application\/ld\+json/);
  }

  for (const path of ['/package.json', '/scripts/serve.mjs', '/tests/secret.test.mjs', '/.git/config']) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 404, path);
    assert.equal(await response.text(), 'Not found');
  }

  const missing = await fetch(`${origin}/not-created.txt`);
  assert.equal(missing.status, 404);
  assert.equal(await missing.text(), 'Not found');
});
