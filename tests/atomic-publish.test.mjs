import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { defaultBackupPath, publishDirectoryAtomically } from '../scripts/lib/atomic-publish.mjs';

function fixture(context, name) {
  const root = mkdtempSync(join(tmpdir(), `physmath-${name}-`));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  return {
    root,
    staging: join(root, 'staging'),
    target: join(root, 'dist'),
    backup: join(root, 'backup'),
  };
}

function directory(path, value) {
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, 'value.txt'), value);
}

test('atomic publication installs a new artifact and replaces an old one', (context) => {
  const first = fixture(context, 'atomic-new');
  directory(first.staging, 'new');
  assert.deepEqual(
    publishDirectoryAtomically(first.staging, first.target, { backupPath: first.backup }),
    { target: first.target, replaced: false },
  );
  assert.equal(readFileSync(join(first.target, 'value.txt'), 'utf8'), 'new');
  assert.equal(existsSync(first.staging), false);

  const secondStaging = join(first.root, 'staging-2');
  directory(secondStaging, 'newer');
  directory(first.backup, 'stale');
  assert.deepEqual(
    publishDirectoryAtomically(secondStaging, first.target, { backupPath: first.backup }),
    { target: first.target, replaced: true },
  );
  assert.equal(readFileSync(join(first.target, 'value.txt'), 'utf8'), 'newer');
  assert.equal(existsSync(first.backup), false);
  assert.match(defaultBackupPath(first.target, 42), /\.dist-backup-42$/u);
});

test('atomic publication validates paths and missing staging directories', (context) => {
  const item = fixture(context, 'atomic-invalid');
  assert.throws(() => publishDirectoryAtomically(item.staging, item.target), /Missing staged artifact/);
  directory(item.staging, 'new');
  assert.throws(() => publishDirectoryAtomically(item.staging, item.staging), /must be distinct/);
  assert.throws(() => publishDirectoryAtomically(item.staging, item.target, { backupPath: item.staging }), /must be distinct/);
  assert.throws(() => publishDirectoryAtomically(item.staging, item.target, { backupPath: item.target }), /must be distinct/);
});

test('a failed publish restores the previous artifact', (context) => {
  const item = fixture(context, 'atomic-restore');
  directory(item.staging, 'new');
  directory(item.target, 'old');
  const rename = (from, to) => {
    if (from === item.staging && to === item.target) throw new Error('publish failed');
    renameSync(from, to);
  };
  assert.throws(
    () => publishDirectoryAtomically(item.staging, item.target, {
      backupPath: item.backup,
      exists: existsSync,
      rename,
      remove: (path) => rmSync(path, { recursive: true, force: true }),
    }),
    /publish failed/,
  );
  assert.equal(readFileSync(join(item.target, 'value.txt'), 'utf8'), 'old');
  assert.equal(existsSync(item.backup), false);
  assert.equal(existsSync(item.staging), true);
});

test('publish and restore failures are reported together', () => {
  const present = new Set(['staging', 'target']);
  const rename = (from, to) => {
    if (from === 'target' && to === 'backup') {
      present.delete('target');
      present.add('backup');
      return;
    }
    if (from === 'staging' && to === 'target') throw new Error('publish failed');
    if (from === 'backup' && to === 'target') throw new Error('restore failed');
  };
  assert.throws(
    () => publishDirectoryAtomically('staging', 'target', {
      backupPath: 'backup',
      exists: (path) => present.has(path),
      rename,
      remove: (path) => present.delete(path),
    }),
    (error) => error instanceof AggregateError
      && /restore the prior artifact/u.test(error.message)
      && error.errors.length === 2,
  );
});
