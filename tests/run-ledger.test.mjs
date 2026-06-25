import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ARTIFACT_ROLES,
  buildRunPacket,
  canonicalStringify,
  createEmptyRunLedger,
  filterRuns,
  importRunPayload,
  MAX_RUN_IMPORT_BYTES,
  MAX_RUNS,
  mergeRunLedgers,
  normalizeRun,
  normalizeRunLedger,
  parseRunImport,
  removeRun,
  RUN_KINDS,
  RUN_LEDGER_APPLICATION,
  RUN_LEDGER_SCHEMA_VERSION,
  RUN_MANIFEST_KIND,
  RUN_STATUSES,
  sha256Hex,
  summarizeRunLedger,
  upsertRun,
  validateRunFile,
  verifyRunFingerprint,
  withRunFingerprint,
} from '../src/lib/run-ledger.js';

const NOW = '2026-06-25T12:00:00.000Z';
const LATER = '2026-06-25T13:00:00.000Z';
const VALID = new Set(['domain.alpha', 'problem.beta']);
const HASH = 'a'.repeat(64);

function run(overrides = {}) {
  return {
    id: 'run.alpha',
    title: 'Alpha verification',
    kind: 'node',
    status: 'passed',
    node_ids: ['domain.alpha', 'unknown', 'domain.alpha'],
    command: ['node', '-e', 'console.log("ok")'],
    cwd: 'experiments/alpha',
    environment: { ZETA: 'z', ALPHA: 'a', API_TOKEN: 'redacted' },
    provenance: { git_commit: 'abc123', package_version: '2.6.0', extra: 'ignored' },
    started_at: NOW,
    completed_at: LATER,
    exit_code: 0,
    signal: '',
    timed_out: false,
    artifacts: [{ role: 'output', path: 'artifacts/result.json', sha256: HASH, bytes: 12, media_type: 'application/json' }],
    notes: 'Reproduced.',
    created_at: NOW,
    updated_at: LATER,
    ...overrides,
  };
}

function ledger(runs = [run()], updatedAt = LATER) {
  return { application: RUN_LEDGER_APPLICATION, schema_version: RUN_LEDGER_SCHEMA_VERSION, updated_at: updatedAt, runs };
}

test('exports bounded vocabularies and creates an empty ledger', () => {
  assert.deepEqual(RUN_STATUSES, ['planned', 'running', 'passed', 'failed', 'inconclusive', 'cancelled']);
  assert.deepEqual(RUN_KINDS, ['lean', 'node', 'python', 'shell', 'browser', 'simulation', 'symbolic', 'manual']);
  assert.deepEqual(ARTIFACT_ROLES, ['input', 'output', 'log', 'report']);
  assert.deepEqual(createEmptyRunLedger(NOW), {
    application: RUN_LEDGER_APPLICATION, schema_version: 1, updated_at: NOW, runs: [],
  });
  assert.throws(() => createEmptyRunLedger('bad'), /ISO-compatible/);
});

test('normalizes a complete run and drops unknown nodes and sensitive environment keys', () => {
  const value = normalizeRun(run(), VALID, NOW);
  assert.deepEqual(value.node_ids, ['domain.alpha']);
  assert.deepEqual(value.environment, { ALPHA: 'a', ZETA: 'z' });
  assert.deepEqual(value.provenance, { git_commit: 'abc123', package_version: '2.6.0' });
  assert.equal(value.duration_ms, 3_600_000);
  assert.equal(value.fingerprint, null);
});

test('normalizes optional values and explicit duration, fingerprint and exit code', () => {
  const value = normalizeRun(run({
    cwd: '', environment: null, provenance: null, started_at: '', completed_at: null,
    duration_ms: 0, exit_code: '', fingerprint: HASH.toUpperCase(), artifacts: [], command: [],
    created_at: '', updated_at: undefined,
  }), VALID, NOW);
  assert.equal(value.cwd, '');
  assert.deepEqual(value.environment, {});
  assert.deepEqual(value.provenance, {});
  assert.equal(value.started_at, null);
  assert.equal(value.completed_at, null);
  assert.equal(value.duration_ms, 0);
  assert.equal(value.exit_code, null);
  assert.equal(value.fingerprint, HASH);
  assert.equal(value.created_at, NOW);
  assert.equal(value.updated_at, NOW);
});

test('rejects malformed run roots, IDs, titles, kinds, statuses and node arrays', () => {
  assert.throws(() => normalizeRun(null, VALID, NOW), /must be an object/);
  assert.throws(() => normalizeRun(run(), [], NOW), /validNodeIds must be a Set/);
  assert.throws(() => normalizeRun(run(), VALID, 'bad'), /ISO-compatible/);
  assert.throws(() => normalizeRun(run({ id: '../bad' }), VALID, NOW), /Run ID must match/);
  assert.throws(() => normalizeRun(run({ title: '   ' }), VALID, NOW), /title is required/);
  assert.throws(() => normalizeRun(run({ kind: 'unknown' }), VALID, NOW), /Unknown run kind/);
  assert.throws(() => normalizeRun(run({ status: 'unknown' }), VALID, NOW), /Unknown run status/);
  assert.throws(() => normalizeRun(run({ node_ids: {} }), VALID, NOW), /node_ids must be an array/);
});

test('uses empty defaults for optional node, command and artifact arrays', () => {
  const value = normalizeRun(run({ node_ids: undefined, command: undefined, artifacts: undefined, duration_ms: undefined, exit_code: undefined }), VALID, NOW);
  assert.deepEqual(value.node_ids, []);
  assert.deepEqual(value.command, []);
  assert.deepEqual(value.artifacts, []);
  assert.equal(value.duration_ms, 3_600_000);
  assert.equal(value.exit_code, null);
  const noTiming = normalizeRun(run({ started_at: null, completed_at: null, duration_ms: undefined }), VALID, NOW);
  assert.equal(noTiming.duration_ms, null);
});

test('rejects malformed commands', () => {
  assert.throws(() => normalizeRun(run({ command: {} }), VALID, NOW), /command must be an array/);
  assert.throws(() => normalizeRun(run({ command: Array(129).fill('x') }), VALID, NOW), /exceeds 128/);
  assert.throws(() => normalizeRun(run({ command: [7] }), VALID, NOW), /must be text/);
  assert.throws(() => normalizeRun(run({ command: [''] }), VALID, NOW), /must not be empty/);
});

test('rejects malformed artifacts and duplicate artifact identities', () => {
  assert.throws(() => normalizeRun(run({ artifacts: {} }), VALID, NOW), /artifacts must be an array/);
  assert.throws(() => normalizeRun(run({ artifacts: [null] }), VALID, NOW), /artifact 0 must be an object/i);
  assert.throws(() => normalizeRun(run({ artifacts: [{ role: 'bad', path: 'x' }] }), VALID, NOW), /unknown role/);
  for (const path of ['', '/abs', 'C:/abs', 'a//b', 'a/../b', 'a/./b']) {
    assert.throws(() => normalizeRun(run({ artifacts: [{ role: 'output', path }] }), VALID, NOW), /normalized relative path/);
  }
  assert.throws(() => normalizeRun(run({ artifacts: [{ role: 'output', path: 'x', sha256: 'bad' }] }), VALID, NOW), /invalid SHA-256/);
  assert.throws(() => normalizeRun(run({ artifacts: [{ role: 'output', path: 'x', bytes: -1 }] }), VALID, NOW), /non-negative integer/);
  assert.throws(() => normalizeRun(run({ artifacts: Array.from({ length: 257 }, (_, i) => ({ role: 'output', path: `x/${i}` })) }), VALID, NOW), /exceed 256/);
  assert.throws(() => normalizeRun(run({ artifacts: [{ role: 'output', path: 'x' }, { role: 'output', path: 'x' }] }), VALID, NOW), /Duplicate run artifact/);
});

test('rejects malformed dates, durations, fingerprints, exits and paths', () => {
  assert.throws(() => normalizeRun(run({ started_at: 'bad' }), VALID, NOW), /started_at must be/);
  assert.throws(() => normalizeRun(run({ completed_at: 'bad' }), VALID, NOW), /completed_at must be/);
  assert.throws(() => normalizeRun(run({ started_at: LATER, completed_at: NOW }), VALID, NOW), /cannot precede/);
  assert.throws(() => normalizeRun(run({ duration_ms: -1 }), VALID, NOW), /duration_ms/);
  assert.throws(() => normalizeRun(run({ duration_ms: 1.5 }), VALID, NOW), /duration_ms/);
  assert.throws(() => normalizeRun(run({ fingerprint: 'bad' }), VALID, NOW), /fingerprint/);
  assert.throws(() => normalizeRun(run({ exit_code: 256 }), VALID, NOW), /between -255 and 255/);
  assert.throws(() => normalizeRun(run({ cwd: '../outside' }), VALID, NOW), /normalized relative path/);
  assert.throws(() => normalizeRun(run({ created_at: 'bad' }), VALID, NOW), /created_at/);
  assert.throws(() => normalizeRun(run({ updated_at: 'bad' }), VALID, NOW), /updated_at/);
});

test('rejects malformed environments and provenance', () => {
  assert.throws(() => normalizeRun(run({ environment: [] }), VALID, NOW), /environment must be an object/);
  assert.throws(() => normalizeRun(run({ environment: Object.fromEntries(Array.from({ length: 65 }, (_, i) => [`K${i}`, 'x'])) }), VALID, NOW), /exceeds 64/);
  assert.throws(() => normalizeRun(run({ environment: { 'bad key': 'x' } }), VALID, NOW), /key is invalid/);
  assert.throws(() => normalizeRun(run({ environment: { GOOD: 7 } }), VALID, NOW), /value must be text/);
  assert.throws(() => normalizeRun(run({ provenance: [] }), VALID, NOW), /provenance must be an object/);
});

test('normalizes ledgers, handles null and keeps the newest duplicate', () => {
  assert.deepEqual(normalizeRunLedger(null, VALID, NOW), createEmptyRunLedger(NOW));
  const older = run({ title: 'Old', updated_at: NOW });
  const newer = run({ title: 'New', updated_at: LATER });
  const value = normalizeRunLedger(ledger([newer, older]), VALID, NOW);
  assert.equal(value.runs.length, 1);
  assert.equal(value.runs[0].title, 'New');
  assert.equal(value.updated_at, LATER);
  const missingDate = normalizeRunLedger({ ...ledger([]), updated_at: '' }, VALID, NOW);
  assert.equal(missingDate.updated_at, NOW);
});

test('rejects malformed ledgers and excessive run counts', () => {
  assert.throws(() => normalizeRunLedger([], VALID, NOW), /must be an object/);
  assert.throws(() => normalizeRunLedger({ ...ledger(), application: 'Other' }, VALID, NOW), /another application/);
  assert.throws(() => normalizeRunLedger({ ...ledger(), schema_version: 2 }, VALID, NOW), /Unsupported/);
  assert.throws(() => normalizeRunLedger({ ...ledger(), runs: {} }, VALID, NOW), /runs must be an array/);
  assert.throws(() => normalizeRunLedger(ledger(Array(MAX_RUNS + 1).fill(run())), VALID, NOW), /exceeds 500/);
  assert.throws(() => normalizeRunLedger(ledger(), VALID, 'bad'), /ISO-compatible/);
});

test('merges, upserts and removes runs deterministically', () => {
  const left = ledger([run({ title: 'Old', updated_at: NOW })], NOW);
  const right = ledger([run({ title: 'New', updated_at: LATER }), run({ id: 'run.beta', title: 'Beta' })], LATER);
  const merged = mergeRunLedgers(left, right, VALID, LATER);
  assert.deepEqual(merged.runs.map(({ id, title }) => [id, title]), [['run.alpha', 'New'], ['run.beta', 'Beta']]);
  const updated = upsertRun(merged, run({ id: 'run.beta', title: 'Beta revised' }), VALID, NOW);
  assert.equal(updated.runs.find(({ id }) => id === 'run.beta').title, 'Beta revised');
  const removed = removeRun(updated, 'run.alpha', VALID, LATER);
  assert.deepEqual(removed.runs.map(({ id }) => id), ['run.beta']);
  assert.throws(() => mergeRunLedgers(left, right, VALID, 'bad'), /ISO-compatible/);
  assert.throws(() => upsertRun(left, null, VALID, NOW), /Run must be an object/);
  assert.throws(() => removeRun(left, '../bad', VALID, NOW), /Run ID must match/);
});

test('summarizes status, kind, fingerprints and artifact completeness', () => {
  const complete = run({ fingerprint: HASH });
  const empty = run({ id: 'run.beta', title: 'Beta', kind: 'manual', status: 'failed', command: [], artifacts: [], fingerprint: null });
  const summary = summarizeRunLedger(ledger([complete, empty]), VALID, NOW);
  assert.equal(summary.total, 2);
  assert.equal(summary.by_status.passed, 1);
  assert.equal(summary.by_status.failed, 1);
  assert.equal(summary.by_kind.node, 1);
  assert.equal(summary.by_kind.manual, 1);
  assert.equal(summary.fingerprinted, 1);
  assert.equal(summary.artifact_complete, 1);
  assert.equal(summary.reproducible, 1);
});

test('filters by status, kind, node and query with all sort modes', () => {
  const runs = normalizeRunLedger(ledger([
    run({ id: 'run.a', title: 'Zulu', status: 'failed', updated_at: NOW, started_at: NOW }),
    run({ id: 'run.b', title: 'Alpha', kind: 'lean', node_ids: ['problem.beta'], notes: 'needle', updated_at: LATER, started_at: LATER }),
  ]), VALID, NOW).runs;
  assert.deepEqual(filterRuns(runs, { status: 'failed' }).map(({ id }) => id), ['run.a']);
  assert.deepEqual(filterRuns(runs, { status: 'all', kind: 'lean' }).map(({ id }) => id), ['run.b']);
  assert.deepEqual(filterRuns(runs, { kind: 'all', nodeId: 'problem.beta' }).map(({ id }) => id), ['run.b']);
  assert.deepEqual(filterRuns(runs, { nodeId: 'all', query: 'needle' }).map(({ id }) => id), ['run.b']);
  assert.deepEqual(filterRuns(runs, { query: 'not-found' }), []);
  assert.deepEqual(filterRuns(runs, { sort: 'title' }).map(({ id }) => id), ['run.b', 'run.a']);
  assert.deepEqual(filterRuns(runs, { sort: 'started-desc' }).map(({ id }) => id), ['run.b', 'run.a']);
  assert.deepEqual(filterRuns(runs).map(({ id }) => id), ['run.b', 'run.a']);
  const ties = [
    { ...runs[0], id: 'run.z', title: 'Same', started_at: null, updated_at: NOW },
    { ...runs[1], id: 'run.y', title: 'Same', started_at: null, updated_at: NOW },
  ];
  assert.deepEqual(filterRuns(ties, { sort: 'title' }).map(({ id }) => id), ['run.y', 'run.z']);
  assert.deepEqual(filterRuns(ties, { sort: 'started-desc' }).map(({ id }) => id), ['run.y', 'run.z']);
  assert.deepEqual(filterRuns(ties).map(({ id }) => id), ['run.y', 'run.z']);
});

test('canonical JSON is key sorted while preserving array order', () => {
  assert.equal(canonicalStringify({ z: 1, a: [{ b: 2, a: 1 }] }), '{"a":[{"a":1,"b":2}],"z":1}');
  assert.equal(canonicalStringify(null), 'null');
});

test('hashes, attaches and verifies fingerprints', async () => {
  const digest = await sha256Hex('abc');
  assert.equal(digest, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  const signed = await withRunFingerprint(run({ fingerprint: null }), VALID, NOW);
  assert.equal(await verifyRunFingerprint(signed, VALID, NOW), true);
  assert.equal(await verifyRunFingerprint({ ...signed, notes: 'tampered' }, VALID, NOW), false);
  assert.equal(await verifyRunFingerprint(run({ fingerprint: null }), VALID, NOW), false);
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
  await assert.rejects(() => sha256Hex('x'), /unavailable/);
  Object.defineProperty(globalThis, 'crypto', descriptor);
});

test('imports manifest and ledger payloads and rejects incompatible manifests', () => {
  const manifest = { kind: RUN_MANIFEST_KIND, schema_version: 1, run: run() };
  assert.deepEqual(importRunPayload(manifest, VALID, NOW).runs.map(({ id }) => id), ['run.alpha']);
  assert.deepEqual(importRunPayload(ledger(), VALID, NOW).runs.map(({ id }) => id), ['run.alpha']);
  assert.throws(() => importRunPayload({ ...manifest, schema_version: 2 }, VALID, NOW), /Unsupported run manifest/);
  assert.throws(() => importRunPayload(null, VALID, NOW), /must be an object/);
});

test('parses bounded JSON imports', () => {
  assert.equal(parseRunImport(JSON.stringify(ledger()), VALID, NOW).runs.length, 1);
  assert.throws(() => parseRunImport(null, VALID, NOW), /must be text/);
  assert.throws(() => parseRunImport('x'.repeat(MAX_RUN_IMPORT_BYTES + 1), VALID, NOW), /size limit/);
  assert.throws(() => parseRunImport('{', VALID, NOW), SyntaxError);
});

test('validates run import file metadata', () => {
  assert.equal(validateRunFile({ size: 10, name: 'runs.JSON', type: 'application/ld+json; charset=utf-8' }), true);
  assert.equal(validateRunFile({ size: 0 }), true);
  assert.throws(() => validateRunFile(null), /Invalid/);
  assert.throws(() => validateRunFile({ size: Number.NaN }), /Invalid/);
  assert.throws(() => validateRunFile({ size: MAX_RUN_IMPORT_BYTES + 1 }), /size limit/);
  assert.throws(() => validateRunFile({ size: 1, name: 'runs.txt' }), /filename/);
  assert.throws(() => validateRunFile({ size: 1, type: 'image/png' }), /JSON-compatible/);
});

test('builds a selected fingerprinted run packet', async () => {
  const packet = await buildRunPacket(ledger([run(), run({ id: 'run.beta', title: 'Beta' })]), ['run.beta', 'missing'], VALID, NOW);
  assert.equal(packet.kind, 'research-run-packet');
  assert.deepEqual(packet.runs.map(({ id }) => id), ['run.beta']);
  assert.match(packet.fingerprint, /^[a-f0-9]{64}$/u);
  await assert.rejects(() => buildRunPacket(ledger(), [], VALID, 'bad'), /ISO-compatible/);
});
