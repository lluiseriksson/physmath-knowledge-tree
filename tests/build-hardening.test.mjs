import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  assertTreeHasNoSymlinks,
  isPathInside,
  resolveRealPathInside,
  walkRegularFiles,
} from '../scripts/lib/fs-safety.mjs';
import { GENERATED_TOP_LEVEL, validateRepositorySymlinks } from '../scripts/check-symlinks.mjs';

test('filesystem safety helpers reject symlinks and return a deterministic closed file set', (context) => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-build-hardening-'));
  const root = join(temporary, 'root');
  const outside = join(temporary, 'outside');
  mkdirSync(join(root, 'nested'), { recursive: true });
  mkdirSync(outside);
  writeFileSync(join(root, 'z.txt'), 'z');
  writeFileSync(join(root, 'nested', 'a.txt'), 'a');
  writeFileSync(join(outside, 'secret.txt'), 'secret');
  context.after(() => rmSync(temporary, { recursive: true, force: true }));

  assert.doesNotThrow(() => assertTreeHasNoSymlinks(root));
  assert.doesNotThrow(() => assertTreeHasNoSymlinks(root, 'fixture'));
  assert.deepEqual(
    walkRegularFiles(root).map((path) => path.slice(root.length + 1).replaceAll('\\', '/')),
    ['nested/a.txt', 'z.txt'],
  );
  assert.equal(resolveRealPathInside(root, join(root, 'z.txt')), realpathSync(join(root, 'z.txt')));
  assert.equal(isPathInside(root, join(root, 'nested')), true);

  const link = join(root, 'escape');
  symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => assertTreeHasNoSymlinks(root, 'fixture'), /fixture\/escape/);
  assert.throws(() => walkRegularFiles(root), /Symbolic link/);
  assert.equal(resolveRealPathInside(root, join(link, 'secret.txt')), null);

  const repository = join(temporary, 'repository');
  mkdirSync(join(repository, 'source'), { recursive: true });
  writeFileSync(join(repository, 'source', 'file.txt'), 'source');
  symlinkSync(outside, join(repository, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(GENERATED_TOP_LEVEL.has('node_modules'), true);
  assert.equal(validateRepositorySymlinks(repository), 1);
  symlinkSync(outside, join(repository, 'escape'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => validateRepositorySymlinks(repository), /escape/);
});


test('repository preflight ignores generated roots but rejects source-tree links', (context) => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-repository-preflight-'));
  const root = join(temporary, 'repo');
  const outside = join(temporary, 'outside');
  mkdirSync(join(root, 'src'), { recursive: true });
  mkdirSync(join(root, 'node_modules'), { recursive: true });
  mkdirSync(outside);
  writeFileSync(join(root, 'src', 'safe.js'), 'export {};\n');
  context.after(() => rmSync(temporary, { recursive: true, force: true }));

  const ignoredLink = join(root, 'node_modules', 'package-link');
  symlinkSync(outside, ignoredLink, process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(validateRepositorySymlinks(root), 1);

  const sourceLink = join(root, 'src', 'escape');
  symlinkSync(outside, sourceLink, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => validateRepositorySymlinks(root), /src\/escape/);
});
