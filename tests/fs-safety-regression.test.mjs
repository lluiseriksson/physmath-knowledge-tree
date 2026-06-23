import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import {
  assertTreeHasNoSymlinks,
  isPathInside,
  resolveRealPathInside,
  walkRegularFiles,
} from '../scripts/lib/fs-safety.mjs';

test('filesystem safety helpers reject roots, parents and escaping links', (context) => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-fs-safety-'));
  context.after(() => rmSync(temporary, { recursive: true, force: true }));
  const root = join(temporary, 'root');
  const outside = join(temporary, 'outside');
  mkdirSync(join(root, 'nested'), { recursive: true });
  mkdirSync(outside);
  writeFileSync(join(root, 'file.txt'), 'one');
  writeFileSync(join(root, 'nested', 'two.txt'), 'two');
  writeFileSync(join(outside, 'secret.txt'), 'secret');

  assert.equal(isPathInside(root, root), false);
  assert.equal(isPathInside(root, resolve(root, '..')), false);
  assert.equal(isPathInside(root, join(root, '..prefix')), true);
  assert.equal(isPathInside(root, join(root, 'file.txt')), true);
  assert.equal(resolveRealPathInside(root, join(root, 'file.txt')), join(root, 'file.txt'));

  const link = join(root, 'escape');
  symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(resolveRealPathInside(root, link), null);
  assert.throws(() => assertTreeHasNoSymlinks(root), /Symbolic links are not allowed/);
  assert.throws(() => walkRegularFiles(root), /Symbolic link found/);
});

test('filesystem walkers accept regular files and produce deterministic recursive output', (context) => {
  const root = mkdtempSync(join(tmpdir(), 'physmath-fs-walk-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'b'));
  writeFileSync(join(root, 'z.txt'), 'z');
  writeFileSync(join(root, 'b', 'a.txt'), 'a');

  assert.doesNotThrow(() => assertTreeHasNoSymlinks(join(root, 'z.txt')));
  assert.doesNotThrow(() => assertTreeHasNoSymlinks(root, 'fixture'));
  assert.deepEqual(walkRegularFiles(join(root, 'z.txt')), [join(root, 'z.txt')]);
  assert.deepEqual(walkRegularFiles(root), [join(root, 'b', 'a.txt'), join(root, 'z.txt')]);
});
