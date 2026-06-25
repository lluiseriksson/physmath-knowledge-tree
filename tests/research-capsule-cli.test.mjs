import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  canonicalStringify,
  sha256Hex,
  withRunFingerprint,
} from '../src/lib/run-ledger.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const NOW = '2026-06-25T12:00:00.000Z';
const SCOPE_NODE_IDS = ['domain.analysis', 'problem.navier_stokes'];

function run(script, args = []) {
  return spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: 'utf8' });
}

async function dossier() {
  const base = {
    application: 'PhysMath Knowledge Tree',
    schema_version: 1,
    kind: 'integrated-research-dossier',
    generated_at: NOW,
    graph: { name: 'PhysMath Knowledge Tree', schema_version: '0.6.0', application_version: '2.6.0', updated: '2026-06-25' },
    workspace: {
      id: 'workspace.alpha', title: 'Alpha campaign', notes: 'Mechanism and discriminating test.',
      node_ids: SCOPE_NODE_IDS, bridge_cards: [], negative_results: [],
      created_at: NOW, updated_at: NOW,
    },
    scope: {
      node_count: 2, edge_count: 1,
      nodes: [{ id: SCOPE_NODE_IDS[0], title: 'Analysis' }, { id: SCOPE_NODE_IDS[1], title: 'Navier-Stokes' }],
      edges: [{ id: 'edge.analysis.navier_stokes', source: SCOPE_NODE_IDS[0], target: SCOPE_NODE_IDS[1] }],
    },
    evidence: { reference_count: 0, claim_reference_count: 0, reviewed: 0, by_status: {}, references: [] },
    lean: { item_count: 0, probe_item_count: 0, reviewed: 0, by_status: {}, items: [] },
    changes: { available: false, baseline_fingerprint: null, current_fingerprint: null, change_count: 0, governed_change_count: 0, by_status: {}, items: [] },
    readiness: { overall: 'ready', gates: [], action_count: 0, actions: [] },
  };
  const core = {
    graph: base.graph, workspace: base.workspace, scope: base.scope,
    evidence: base.evidence, lean: base.lean, changes: base.changes, readiness: base.readiness,
  };
  return { ...base, content_fingerprint: await sha256Hex(canonicalStringify(core)) };
}

test('research capsule CLIs expose bounded help without side effects', () => {
  const build = run('scripts/build-research-capsule.mjs', ['--help']);
  assert.equal(build.status, 0, build.stderr);
  assert.match(build.stdout, /--dossier-file/);
  assert.match(build.stdout, /--run-file/);
  const verify = run('scripts/verify-research-capsule.mjs', ['--help']);
  assert.equal(verify.status, 0, verify.stderr);
  assert.match(verify.stdout, /--capsule-file/);
  assert.match(verify.stdout, /--metadata-only/);
});

test('capsule CLI builds, verifies and detects artifact drift', async () => {
  const directory = mkdtempSync(join(root, '.capsule-cli-test-'));
  try {
    const rel = (path) => relative(root, path).replaceAll('\\', '/');
    const artifactPath = join(directory, 'artifact.txt');
    const artifactBytes = Buffer.from('verified artifact\n');
    writeFileSync(artifactPath, artifactBytes);
    const runManifest = await withRunFingerprint({
      id: 'run.alpha', title: 'Alpha calculation', kind: 'node', status: 'passed',
      node_ids: SCOPE_NODE_IDS, command: ['node', '-e', 'console.log("ok")'], cwd: '', environment: {},
      provenance: { git_commit: 'a'.repeat(40), package_version: '2.6.0', toolchain: 'node-22', platform: 'linux', arch: 'x64', node_version: 'v22.0.0' },
      started_at: '2026-06-25T11:59:59.000Z', completed_at: NOW, duration_ms: 1000,
      exit_code: 0, signal: '', timed_out: false,
      artifacts: [{
        role: 'output', path: rel(artifactPath),
        sha256: createHash('sha256').update(artifactBytes).digest('hex'), bytes: artifactBytes.length,
        media_type: 'text/plain',
      }],
      notes: '', created_at: NOW, updated_at: NOW,
    }, new Set(SCOPE_NODE_IDS), NOW);
    const ledger = { application: 'PhysMath Knowledge Tree', schema_version: 1, updated_at: NOW, runs: [runManifest] };
    const dossierPath = join(directory, 'dossier.json');
    const runsPath = join(directory, 'runs.json');
    const capsulePath = join(directory, 'capsule.json');
    const markdownPath = join(directory, 'capsule.md');
    writeFileSync(dossierPath, `${JSON.stringify(await dossier(), null, 2)}\n`);
    writeFileSync(runsPath, `${JSON.stringify(ledger, null, 2)}\n`);

    const build = run('scripts/build-research-capsule.mjs', [
      '--dossier-file', rel(dossierPath), '--run-file', rel(runsPath),
      '--output', rel(capsulePath), '--markdown', rel(markdownPath), '--generated-at', NOW,
    ]);
    assert.equal(build.status, 0, build.stderr);
    assert.ok(existsSync(capsulePath));
    assert.match(readFileSync(markdownPath, 'utf8'), /Alpha calculation/);

    const verify = run('scripts/verify-research-capsule.mjs', ['--capsule-file', rel(capsulePath), '--artifact-root', '.']);
    assert.equal(verify.status, 0, verify.stderr);
    assert.match(verify.stdout, /Artifacts verified: 1/);

    writeFileSync(artifactPath, 'drifted artifact\n');
    const drift = run('scripts/verify-research-capsule.mjs', ['--capsule-file', rel(capsulePath), '--artifact-root', '.']);
    assert.notEqual(drift.status, 0);
    assert.match(drift.stderr, /byte-count mismatch|SHA-256 mismatch/);
    const metadata = run('scripts/verify-research-capsule.mjs', ['--capsule-file', rel(capsulePath), '--metadata-only']);
    assert.equal(metadata.status, 0, metadata.stderr);

    const escape = run('scripts/verify-research-capsule.mjs', ['--capsule-file', `../${basename(capsulePath)}`, '--metadata-only']);
    assert.notEqual(escape.status, 0);
    assert.match(escape.stderr, /escapes/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
