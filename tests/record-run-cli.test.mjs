import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../scripts/record-research-run.mjs', import.meta.url));

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'physmath-run-cli-'));
  mkdirSync(join(root, 'graph/nodes'), { recursive: true });
  writeFileSync(join(root, 'graph/nodes/core.json'), `${JSON.stringify([{ id: 'domain.alpha' }, { id: 'problem.beta' }])}\n`);
  writeFileSync(join(root, 'package.json'), '{"name":"fixture","version":"9.9.9","type":"module"}\n');
  writeFileSync(join(root, 'lean-toolchain'), 'leanprover/lean4:v4.31.0\n');
  writeFileSync(join(root, 'input.txt'), 'input');
  return root;
}

function runCli(root, args, env = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
}

test('prints help and supports the robust npm separator form', () => {
  const result = runCli(fixture(), ['--', '--help']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /npm run run:record -- -- --id/);
  assert.match(result.stdout, /shell:false/);
});

test('writes a dry-run planned manifest without logs', () => {
  const root = fixture();
  const result = runCli(root, [
    '--', '--id', 'run.plan', '--title', 'Plan', '--kind', 'lean', '--node', 'domain.alpha',
    '--dry-run', '--manifest', 'manifests/plan.json', '--', 'lake', 'build',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(readFileSync(join(root, 'manifests/plan.json'), 'utf8'));
  assert.equal(payload.run.status, 'planned');
  assert.deepEqual(payload.run.command, ['lake', 'build']);
  assert.equal(payload.run.started_at, null);
  assert.match(payload.run.fingerprint, /^[a-f0-9]{64}$/u);
});

test('executes without a shell and hashes inputs, outputs and logs', () => {
  const root = fixture();
  const source = "require('node:fs').writeFileSync('result.txt','result'); console.log('done')";
  const result = runCli(root, [
    '--id', 'run.success', '--title', 'Success', '--kind', 'node', '--node', 'problem.beta',
    '--artifact-in', 'input.txt', '--artifact-out', 'result.txt', '--env', 'SAFE_VALUE',
    '--manifest', 'manifests/success.json', '--logs-dir', 'logs/success', '--',
    process.execPath, '-e', source,
  ], { SAFE_VALUE: 'visible' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /done/);
  const payload = JSON.parse(readFileSync(join(root, 'manifests/success.json'), 'utf8'));
  assert.equal(payload.run.status, 'passed');
  assert.equal(payload.run.exit_code, 0);
  assert.deepEqual(payload.run.environment, { SAFE_VALUE: 'visible' });
  assert.equal(payload.run.provenance.package_version, '9.9.9');
  assert.equal(payload.run.provenance.toolchain, 'leanprover/lean4:v4.31.0');
  const output = payload.run.artifacts.find(({ path }) => path === 'result.txt');
  assert.equal(output.sha256, createHash('sha256').update('result').digest('hex'));
  assert.equal(output.bytes, 6);
  assert.equal(payload.run.artifacts.filter(({ role }) => role === 'log').length, 2);
});

test('records failures and propagates or suppresses the exit code explicitly', () => {
  const root = fixture();
  const failed = runCli(root, [
    '--id', 'run.failure', '--title', 'Failure', '--kind', 'node', '--manifest', 'failure.json',
    '--logs-dir', 'logs/failure', '--', process.execPath, '-e', 'process.exit(3)',
  ]);
  assert.equal(failed.status, 3);
  assert.equal(JSON.parse(readFileSync(join(root, 'failure.json'), 'utf8')).run.status, 'failed');

  const suppressed = runCli(root, [
    '--id', 'run.suppressed', '--title', 'Suppressed', '--kind', 'node', '--no-propagate',
    '--manifest', 'suppressed.json', '--logs-dir', 'logs/suppressed', '--',
    process.execPath, '-e', 'process.exit(4)',
  ]);
  assert.equal(suppressed.status, 0, suppressed.stderr);
  assert.equal(JSON.parse(readFileSync(join(root, 'suppressed.json'), 'utf8')).run.exit_code, 4);
});

test('bounds timed-out commands and records timeout provenance', () => {
  const root = fixture();
  const result = runCli(root, [
    '--id', 'run.timeout', '--title', 'Timeout', '--kind', 'node', '--no-propagate',
    '--timeout-ms', '50', '--manifest', 'timeout.json', '--logs-dir', 'logs/timeout', '--',
    process.execPath, '-e', 'setTimeout(() => {}, 5000)',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(readFileSync(join(root, 'timeout.json'), 'utf8'));
  assert.equal(payload.run.status, 'failed');
  assert.equal(payload.run.timed_out, true);
  assert.equal(payload.run.exit_code, null);
  assert.match(payload.run.signal, /SIGTERM|SIGKILL/u);
});

test('rejects unsafe options, unknown nodes and accidental overwrites', () => {
  const root = fixture();
  for (const [args, pattern] of [
    [['--title', 'Missing ID', '--dry-run'], /--id is required/],
    [['--id', 'run.x', '--title', 'X', '--node', 'unknown', '--dry-run'], /Unknown canonical node/],
    [['--id', 'run.x', '--title', 'X', '--env', 'API_TOKEN', '--dry-run'], /Sensitive environment/],
    [['--id', 'run.x', '--title', 'X', '--cwd', '../outside', '--dry-run'], /repository-relative/],
    [['--id', 'run.x', '--title', 'X', '--artifact-in', 'missing.txt', '--dry-run'], /Missing input artifact/],
    [['--id', 'run.x', '--title', 'X', '--timeout-ms', '0', '--dry-run'], /timeout-ms/],
    [['--id', 'run.x', '--title', 'X', '--unknown'], /Unknown option/],
  ]) {
    const result = runCli(root, args);
    assert.equal(result.status, 1);
    assert.match(result.stderr, pattern);
  }
  const first = runCli(root, ['--id', 'run.same', '--title', 'Same', '--dry-run', '--manifest', 'same.json']);
  assert.equal(first.status, 0, first.stderr);
  const second = runCli(root, ['--id', 'run.same', '--title', 'Same', '--dry-run', '--manifest', 'same.json']);
  assert.equal(second.status, 1);
  assert.match(second.stderr, /already exists/);
});
