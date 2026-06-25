import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildResearchCapsule,
  capsuleArtifactPlan,
  importResearchCapsule,
  researchCapsuleMarkdown,
  verifyResearchCapsule,
} from '../src/lib/research-capsule.js';
import {
  canonicalStringify,
  createEmptyRunLedger,
  sha256Hex,
  upsertRun,
  withRunFingerprint,
} from '../src/lib/run-ledger.js';

const NOW = '2026-06-25T12:00:00.000Z';
const validNodeIds = new Set(['domain.alpha', 'problem.beta', 'domain.extra']);

async function dossier(overall = 'ready') {
  const base = {
    application: 'PhysMath Knowledge Tree',
    schema_version: 1,
    kind: 'integrated-research-dossier',
    generated_at: NOW,
    graph: { name: 'PhysMath Knowledge Tree', schema_version: '0.6.0', application_version: '2.6.0', updated: '2026-06-25' },
    workspace: {
      id: 'workspace.alpha', title: 'Alpha campaign', notes: 'Test the mechanism.', node_ids: ['domain.alpha', 'problem.beta'],
      bridge_cards: [], negative_results: [], created_at: NOW, updated_at: NOW,
    },
    scope: {
      node_count: 2, edge_count: 1,
      nodes: [
        { id: 'domain.alpha', title: 'Alpha', summary: 'Source' },
        { id: 'problem.beta', title: 'Beta', summary: 'Target' },
      ],
      edges: [{ id: 'edge.alpha.beta', source: 'domain.alpha', target: 'problem.beta' }],
    },
    evidence: { reference_count: 0, claim_reference_count: 0, reviewed: 0, by_status: {}, references: [] },
    lean: { item_count: 0, probe_item_count: 0, reviewed: 0, by_status: {}, items: [] },
    changes: { available: false, baseline_fingerprint: null, current_fingerprint: null, change_count: 0, governed_change_count: 0, by_status: {}, items: [] },
    readiness: { overall, gates: [], action_count: 0, actions: [] },
  };
  const core = {
    graph: base.graph, workspace: base.workspace, scope: base.scope,
    evidence: base.evidence, lean: base.lean, changes: base.changes, readiness: base.readiness,
  };
  return { ...base, content_fingerprint: await sha256Hex(canonicalStringify(core)) };
}

async function refingerprintDossier(value) {
  const copy = structuredClone(value);
  const core = {
    graph: copy.graph, workspace: copy.workspace, scope: copy.scope,
    evidence: copy.evidence, lean: copy.lean, changes: copy.changes, readiness: copy.readiness,
  };
  copy.content_fingerprint = await sha256Hex(canonicalStringify(core));
  return copy;
}

async function passedRun(id = 'run.alpha', nodeIds = ['domain.alpha', 'problem.beta']) {
  return withRunFingerprint({
    id,
    title: `Run ${id}`,
    kind: 'node',
    status: 'passed',
    node_ids: nodeIds,
    command: ['node', '-e', 'console.log("ok")'],
    cwd: '',
    environment: {},
    provenance: {
      git_commit: 'a'.repeat(40), package_version: '2.6.0', toolchain: 'node-22',
      platform: 'linux', arch: 'x64', node_version: 'v22.0.0',
    },
    started_at: '2026-06-25T11:59:59.000Z',
    completed_at: NOW,
    duration_ms: 1000,
    exit_code: 0,
    signal: '',
    timed_out: false,
    artifacts: [{ role: 'output', path: `artifacts/${id}.json`, sha256: 'b'.repeat(64), bytes: 42, media_type: 'application/json' }],
    notes: '',
    created_at: NOW,
    updated_at: NOW,
  }, validNodeIds, NOW);
}

async function ledgerWith(...runs) {
  let ledger = createEmptyRunLedger(NOW);
  for (const run of runs) ledger = upsertRun(ledger, run, validNodeIds, NOW);
  return ledger;
}

test('builds and verifies a ready capsule deterministically', async () => {
  const sourceDossier = await dossier('ready');
  const ledger = await ledgerWith(await passedRun());
  const first = await buildResearchCapsule({ dossier: sourceDossier, runLedger: ledger, validNodeIds, generatedAt: NOW });
  const second = await buildResearchCapsule({ dossier: sourceDossier, runLedger: ledger, validNodeIds, generatedAt: '2026-06-25T13:00:00.000Z' });
  assert.equal(first.readiness.overall, 'ready');
  assert.equal(first.execution.selected_run_count, 1);
  assert.equal(first.execution.covered_node_count, 2);
  assert.equal(first.content_fingerprint, second.content_fingerprint);
  assert.deepEqual(await verifyResearchCapsule(first), first);
  assert.deepEqual(capsuleArtifactPlan(first), [{
    run_id: 'run.alpha', role: 'output', path: 'artifacts/run.alpha.json', sha256: 'b'.repeat(64), bytes: 42, media_type: 'application/json',
  }]);
});

test('classifies missing, invalid, failed and unlinked runs without hiding them', async () => {
  const valid = await passedRun('run.valid', ['domain.alpha']);
  const missing = { ...(await passedRun('run.missing', ['problem.beta'])), fingerprint: null };
  const invalid = { ...(await passedRun('run.invalid', ['domain.alpha'])), title: 'Tampered after fingerprint' };
  const failed = { ...(await passedRun('run.failed', ['problem.beta'])), status: 'failed', exit_code: 2 };
  const unlinked = await passedRun('run.unlinked', ['domain.extra']);
  const ledger = await ledgerWith(valid, missing, invalid, failed, unlinked);
  const capsule = await buildResearchCapsule({
    dossier: await dossier('attention'), runLedger: ledger, validNodeIds,
    selectedRunIds: ['run.valid', 'run.missing', 'run.invalid', 'run.failed', 'run.unlinked'], generatedAt: NOW,
  });
  assert.equal(capsule.readiness.overall, 'blocked');
  assert.equal(capsule.execution.selected_run_count, 5);
  assert.equal(capsule.readiness.gates.find(({ id }) => id === 'fingerprints').state, 'blocked');
  assert.equal(capsule.readiness.gates.find(({ id }) => id === 'outcome').state, 'blocked');
  assert.equal(capsule.readiness.gates.find(({ id }) => id === 'runs').state, 'attention');
  assert.ok(capsule.readiness.actions.some(({ target }) => target === 'run.invalid'));
  assert.ok(capsule.readiness.actions.some(({ target }) => target === 'run.failed'));
  assert.ok(capsule.readiness.actions.some(({ target }) => target === 'run.unlinked'));
});

test('detects incomplete and variant artifact metadata', async () => {
  const left = await passedRun('run.left', ['domain.alpha']);
  const right = await passedRun('run.right', ['problem.beta']);
  left.artifacts[0].path = 'artifacts/shared.json';
  left.artifacts[0].sha256 = 'c'.repeat(64);
  right.artifacts[0].path = 'artifacts/shared.json';
  right.artifacts[0].sha256 = 'd'.repeat(64);
  const incomplete = { ...(await passedRun('run.incomplete', ['domain.alpha'])), artifacts: [{ role: 'output', path: 'artifacts/missing.json', sha256: null, bytes: null, media_type: '' }], fingerprint: null };
  const capsule = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(left, right, incomplete), validNodeIds, generatedAt: NOW });
  assert.equal(capsule.readiness.gates.find(({ id }) => id === 'artifacts').state, 'attention');
  assert.equal(capsule.verification.artifact_variants.length, 1);
  assert.ok(capsule.readiness.actions.some(({ target }) => target === 'artifacts/shared.json'));
});

test('verifies an explicit subset without depending on omitted ledger runs', async () => {
  const selected = await passedRun('run.selected', ['domain.alpha']);
  const omitted = await passedRun('run.omitted', ['problem.beta']);
  const capsule = await buildResearchCapsule({
    dossier: await dossier(),
    runLedger: await ledgerWith(selected, omitted),
    validNodeIds,
    selectedRunIds: ['run.selected'],
    generatedAt: NOW,
  });
  assert.equal(capsule.execution.relevant_run_count, 1);
  assert.deepEqual(await verifyResearchCapsule(capsule), capsule);
});

test('rejects unknown selected run IDs and capsule tampering', async () => {
  const sourceDossier = await dossier();
  const ledger = await ledgerWith(await passedRun());
  await assert.rejects(
    buildResearchCapsule({ dossier: sourceDossier, runLedger: ledger, validNodeIds, selectedRunIds: ['run.unknown'], generatedAt: NOW }),
    /Unknown selected run IDs/,
  );
  const capsule = await buildResearchCapsule({ dossier: sourceDossier, runLedger: ledger, validNodeIds, generatedAt: NOW });
  const tampered = structuredClone(capsule);
  tampered.execution.runs[0].run.title = 'Changed';
  await assert.rejects(verifyResearchCapsule(tampered), /fingerprint (?:verification )?mismatch/);
  await assert.rejects(importResearchCapsule(JSON.stringify(tampered)), /fingerprint (?:verification )?mismatch/);
});

test('exports readable markdown and enforces import bounds', async () => {
  const capsule = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(await passedRun()), validNodeIds, generatedAt: NOW });
  const markdown = researchCapsuleMarkdown(capsule);
  assert.match(markdown, /Research capsule: Alpha campaign/);
  assert.match(markdown, /Run run\.alpha/);
  assert.match(markdown, /Capsule fingerprint/);
  await assert.rejects(importResearchCapsule('x'.repeat(20_000_001)), /size limit/);
  assert.throws(() => researchCapsuleMarkdown({}), /needs a research capsule/);
});


test('covers empty selection, blocked dossier and empty scope gates', async () => {
  const blocked = await dossier('blocked');
  const ledger = await ledgerWith(await passedRun());
  const noRuns = await buildResearchCapsule({ dossier: blocked, runLedger: ledger, validNodeIds, selectedRunIds: [], generatedAt: NOW, title: 42 });
  assert.equal(noRuns.readiness.overall, 'blocked');
  assert.equal(noRuns.readiness.gates.find(({ id }) => id === 'dossier').state, 'blocked');
  assert.equal(noRuns.readiness.gates.find(({ id }) => id === 'runs').state, 'blocked');
  assert.equal(noRuns.readiness.gates.find(({ id }) => id === 'fingerprints').state, 'not-applicable');
  assert.equal(noRuns.readiness.gates.find(({ id }) => id === 'outcome').state, 'not-applicable');
  assert.equal(noRuns.readiness.gates.find(({ id }) => id === 'provenance').state, 'not-applicable');
  assert.match(researchCapsuleMarkdown(noRuns), /No runs selected/);

  const empty = await dossier('ready');
  empty.workspace.node_ids = [];
  empty.scope = { node_count: 0, edge_count: 0, nodes: [], edges: [] };
  const emptyScope = await buildResearchCapsule({ dossier: await refingerprintDossier(empty), runLedger: ledger, validNodeIds, selectedRunIds: [], generatedAt: NOW });
  assert.equal(emptyScope.readiness.gates.find(({ id }) => id === 'coverage').state, 'not-applicable');
});

test('flags planned runs, partial coverage and missing provenance', async () => {
  const planned = {
    ...(await passedRun('run.planned', ['domain.alpha'])),
    status: 'planned', started_at: null, completed_at: null, duration_ms: null, exit_code: null,
    artifacts: [], provenance: {}, command: [], fingerprint: null,
  };
  const capsule = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(planned), validNodeIds, generatedAt: NOW });
  assert.equal(capsule.readiness.overall, 'attention');
  assert.equal(capsule.readiness.gates.find(({ id }) => id === 'artifacts').state, 'attention');
  assert.equal(capsule.readiness.gates.find(({ id }) => id === 'outcome').state, 'attention');
  assert.equal(capsule.readiness.gates.find(({ id }) => id === 'coverage').state, 'attention');
  assert.equal(capsule.readiness.gates.find(({ id }) => id === 'provenance').state, 'attention');
  assert.match(researchCapsuleMarkdown(capsule), /No artifacts recorded/);
  assert.match(researchCapsuleMarkdown(capsule), /_not recorded_/);
});

test('reports missing-hash variants and sorts multiple artifact paths', async () => {
  const one = await passedRun('run.one', ['domain.alpha']);
  const two = await passedRun('run.two', ['problem.beta']);
  const three = await passedRun('run.three', ['domain.alpha']);
  const four = await passedRun('run.four', ['problem.beta']);
  one.artifacts = [{ role: 'output', path: 'z/shared.json', sha256: null, bytes: null, media_type: '' }]; one.fingerprint = null;
  two.artifacts = [{ role: 'output', path: 'z/shared.json', sha256: 'e'.repeat(64), bytes: 2, media_type: '' }]; two.fingerprint = null;
  three.artifacts = [{ role: 'output', path: 'a/other.json', sha256: 'f'.repeat(64), bytes: 3, media_type: '' }, { role: 'log', path: 'b/log.txt', sha256: '1'.repeat(64), bytes: 4, media_type: 'text/plain' }]; three.fingerprint = null;
  four.artifacts = [{ role: 'output', path: 'a/other.json', sha256: '0'.repeat(64), bytes: 3, media_type: '' }]; four.fingerprint = null;
  const capsule = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(one, two, three, four), validNodeIds, generatedAt: NOW });
  assert.equal(capsule.verification.artifact_variants.some((entry) => entry.variants.some(({ sha256 }) => sha256 === null)), true);
  assert.deepEqual(capsuleArtifactPlan(capsule).map(({ path }) => path), ['a/other.json', 'a/other.json', 'b/log.txt', 'z/shared.json', 'z/shared.json']);
  const markdown = researchCapsuleMarkdown(capsule);
  assert.match(markdown, /missing SHA-256/);
  assert.match(markdown, /\(2 bytes\)/);
});

test('exercises defensive validation paths', async () => {
  await assert.rejects(buildResearchCapsule(null), /must be an object/);
  await assert.rejects(buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(), validNodeIds: [] }), /validNodeIds must be a Set/);
  for (const selectedRunIds of [null, 'run.alpha', {}]) {
    await assert.rejects(
      buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(), validNodeIds, selectedRunIds }),
      /selectedRunIds must be an iterable/,
    );
  }
  await assert.rejects(buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(), validNodeIds, generatedAt: 'not-a-date' }), /ISO-compatible date/);
  const malformedScope = await dossier(); malformedScope.scope.nodes = [null]; malformedScope.scope.node_count = 1;
  await assert.rejects(buildResearchCapsule({ dossier: await refingerprintDossier(malformedScope), runLedger: await ledgerWith(), validNodeIds, generatedAt: NOW }), /scope node 0 needs an ID/);

  const capsule = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(await passedRun()), validNodeIds, generatedAt: NOW });
  for (const [field, value, pattern] of [
    ['application', 'Other', /another application/], ['schema_version', 2, /schema version/], ['kind', 'other', /kind/],
    ['generated_at', 'bad', /ISO-compatible date/], ['content_fingerprint', 'x', /fingerprint is invalid/],
  ]) {
    const bad = structuredClone(capsule); bad[field] = value; await assert.rejects(verifyResearchCapsule(bad), pattern);
  }
  const tooMany = structuredClone(capsule); tooMany.execution.runs = Array.from({ length: 129 }, () => structuredClone(capsule.execution.runs[0]));
  await assert.rejects(verifyResearchCapsule(tooMany), /exceeds 128 runs/);
  const badScope = structuredClone(capsule); badScope.dossier.scope.nodes = [null];
  badScope.dossier = await refingerprintDossier(badScope.dossier);
  await assert.rejects(verifyResearchCapsule(badScope), /scope node 0 needs an ID/);

  const missingRun = structuredClone(capsule); missingRun.execution.runs[0].run = null;
  await assert.rejects(verifyResearchCapsule(missingRun), /manifest must be an object/);
  const badIds = structuredClone(capsule); badIds.execution.runs[0].relevant_node_ids = null;
  await assert.rejects(verifyResearchCapsule(badIds), /must be an array/);
  const linkage = structuredClone(capsule); linkage.execution.runs[0].relevant_node_ids = [];
  await assert.rejects(verifyResearchCapsule(linkage), /scope linkage mismatch/);
  const linkedFlag = structuredClone(capsule); linkedFlag.execution.runs[0].scope_linked = false;
  await assert.rejects(verifyResearchCapsule(linkedFlag), /scope_linked mismatch/);
  const artifactFlag = structuredClone(capsule); artifactFlag.execution.runs[0].artifact_complete = false;
  await assert.rejects(verifyResearchCapsule(artifactFlag), /artifact completeness mismatch/);
  const fingerprintFlag = structuredClone(capsule); fingerprintFlag.execution.runs[0].fingerprint_present = false;
  await assert.rejects(verifyResearchCapsule(fingerprintFlag), /fingerprint verification mismatch/);
  const noVerification = structuredClone(capsule); noVerification.verification = null;
  await assert.rejects(verifyResearchCapsule(noVerification), /verification must be an object/);
  const noReadiness = structuredClone(capsule); noReadiness.readiness = null;
  await assert.rejects(verifyResearchCapsule(noReadiness), /readiness must be an object/);

  await assert.rejects(importResearchCapsule(42), /must be text/);
  await assert.rejects(importResearchCapsule('{'), /JSON|Expected property|Unexpected end/);
  assert.throws(() => capsuleArtifactPlan(null), /must be an object/);
  assert.throws(() => capsuleArtifactPlan({ execution: { runs: null } }), /must be an array/);
});

test('exports markdown fallbacks for missing labels, empty actions and false flags', async () => {
  const run = { ...(await passedRun('run.fallback', ['domain.alpha'])), command: [], artifacts: [], fingerprint: null, provenance: {} };
  const source = await dossier(); source.scope.nodes[0].title = null;
  const capsule = await buildResearchCapsule({ dossier: await refingerprintDossier(source), runLedger: await ledgerWith(run), validNodeIds, generatedAt: NOW });
  capsule.readiness.actions = [];
  const markdown = researchCapsuleMarkdown(capsule);
  assert.match(markdown, /domain\.alpha/);
  assert.match(markdown, /Scope linked: yes/);
  assert.match(markdown, /Fingerprint verified: no/);
  assert.match(markdown, /Artifacts complete: no/);
  assert.match(markdown, /No open capsule actions/);
});

test('covers remaining deterministic branches and limits', async () => {
  const custom = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(await passedRun()), validNodeIds, title: 'Custom capsule' });
  assert.equal(custom.title, 'Custom capsule');

  const manyRuns = [];
  for (let index = 0; index < 129; index += 1) manyRuns.push(await passedRun(`run.bulk.${index}`, ['domain.alpha']));
  await assert.rejects(buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(...manyRuns), validNodeIds, generatedAt: NOW }), /exceeds 128 runs/);

  const left = await passedRun('run.variant.left', ['domain.alpha']);
  const right = await passedRun('run.variant.right', ['problem.beta']);
  left.artifacts[0] = { role: 'output', path: 'artifacts/variant.json', sha256: '2'.repeat(64), bytes: 5, media_type: '' };
  right.artifacts[0] = { role: 'output', path: 'artifacts/variant.json', sha256: '3'.repeat(64), bytes: 5, media_type: '' };
  left.fingerprint = null; right.fingerprint = null;
  const variants = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(left, right), validNodeIds, generatedAt: NOW });
  assert.equal(variants.readiness.gates.find(({ id }) => id === 'artifacts').state, 'attention');
  assert.match(variants.readiness.gates.find(({ id }) => id === 'artifacts').detail, /multiple content hashes/);

  const timeout = { ...(await passedRun('run.timeout', ['domain.alpha'])), status: 'failed', timed_out: true, exit_code: null };
  const timed = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(timeout), validNodeIds, generatedAt: NOW });
  assert.ok(timed.readiness.actions.some(({ title, detail }) => /timed-out/.test(title) && /unknown/.test(detail)));
  assert.match(researchCapsuleMarkdown(await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(await passedRun('run.unlinked.md', ['domain.extra'])), validNodeIds, selectedRunIds: ['run.unlinked.md'], generatedAt: NOW })), /Scope linked: no/);
});

test('covers final verification and markdown defensive branches', async () => {
  const capsule = await buildResearchCapsule({ dossier: await dossier(), runLedger: await ledgerWith(await passedRun()), validNodeIds, generatedAt: NOW });
  const nullDigest = structuredClone(capsule); nullDigest.content_fingerprint = null;
  await assert.rejects(verifyResearchCapsule(nullDigest), /fingerprint is invalid/);

  const noNodeIds = structuredClone(capsule); noNodeIds.execution.runs[0].run.node_ids = null; noNodeIds.execution.runs[0].relevant_node_ids = [];
  await assert.rejects(verifyResearchCapsule(noNodeIds), /fingerprint verification mismatch|node_ids|scope_linked mismatch/);

  const titleTamper = structuredClone(capsule); titleTamper.title = 'Different title';
  await assert.rejects(verifyResearchCapsule(titleTamper), /Research capsule fingerprint mismatch/);

  const internallyInconsistent = structuredClone(capsule);
  internallyInconsistent.execution.passed = 99;
  const inconsistentCore = {
    title: internallyInconsistent.title,
    dossier: internallyInconsistent.dossier,
    execution: internallyInconsistent.execution,
    verification: internallyInconsistent.verification,
    readiness: internallyInconsistent.readiness,
  };
  internallyInconsistent.content_fingerprint = await sha256Hex(canonicalStringify(inconsistentCore));
  await assert.rejects(verifyResearchCapsule(internallyInconsistent), /derived summary mismatch/);

  const markdownCapsule = structuredClone(capsule);
  markdownCapsule.readiness.gates[0].label = null;
  markdownCapsule.dossier.scope.nodes[0].title = null;
  const markdown = researchCapsuleMarkdown(markdownCapsule);
  assert.match(markdown, /domain\.alpha/);
});
