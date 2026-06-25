import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CHANGE_REVIEW_APPLICATION,
  CHANGE_REVIEW_STORAGE_KEY,
  DECISION_STATUSES,
  ENTITY_TYPES,
  MAX_CHANGE_DECISIONS,
  MAX_CHANGE_IMPORT_BYTES,
  REVIEW_SCHEMA_VERSION,
  RISK_LEVELS,
  SNAPSHOT_SCHEMA_VERSION,
  buildChangeReviewBundle,
  buildChangeWorklist,
  canonicalStringify,
  changeReviewBundleMarkdown,
  createDecisionLedger,
  createGraphSnapshot,
  diffGraphSnapshots,
  exportGraphSnapshot,
  fingerprintGraph,
  importChangeReviewBundle,
  importChangeReviewFile,
  importGraphSnapshot,
  loadChangeReviewState,
  mergeDecisionLedgers,
  normalizeDecisionLedger,
  normalizeGraphData,
  normalizeGraphSnapshot,
  removeDecision,
  saveChangeReviewState,
  sha256Hex,
  summarizeChangeSet,
  summarizeDecisions,
  upsertDecision,
  validateChangeReviewFile,
} from '../src/lib/change-review.js';

const now = '2026-06-24T12:00:00.000Z';
const later = '2026-06-25T12:00:00.000Z';

function index(overrides = {}) {
  return {
    schema_version: '0.6.0',
    application_version: '2.6.0',
    name: 'PhysMath Knowledge Tree',
    root_nodes: ['domain.alpha'],
    confidence_levels: ['formal', 'literature', 'heuristic', 'speculative'],
    ...overrides,
  };
}

function reference(url, scope = 'claim') {
  return { label: url.split('/').at(-1), url, type: 'paper', scope };
}

function baselineData() {
  return {
    index: index(),
    nodes: [
      {
        id: 'domain.alpha', kind: 'domain', title: 'Alpha', summary: 'Old alpha summary', confidence: 'heuristic',
        tags: ['alpha'], questions: ['Old question'],
        lean: { imports: ['Mathlib'], declarations: ['OldDecl'], targets: ['Old target'] },
        references: [reference('https://example.org/claim', 'claim'), reference('https://example.org/context', 'context')],
      },
      {
        id: 'domain.beta', kind: 'domain', title: 'Beta', summary: 'Beta summary', confidence: 'literature',
        tags: ['beta'], questions: ['Beta question'], lean: { imports: ['Mathlib'], declarations: ['BetaDecl'], targets: ['Beta target'] },
        references: [reference('https://example.org/beta', 'claim')],
      },
      {
        id: 'problem.removed', kind: 'problem', title: 'Removed problem', summary: 'Will be removed', confidence: 'literature',
        tags: [], questions: [], lean: { imports: [], declarations: [], targets: [] }, references: [reference('https://example.org/removed')],
      },
    ],
    edges: [
      {
        id: 'edge.alpha.beta', source: 'domain.alpha', target: 'domain.beta', relation: 'uses', confidence: 'literature',
        mechanism: 'Old transfer mechanism',
        references: [reference('https://example.org/edge-claim', 'claim'), reference('https://example.org/edge-context', 'context')],
      },
      {
        id: 'edge.beta.removed', source: 'domain.beta', target: 'problem.removed', relation: 'suggests', confidence: 'heuristic',
        mechanism: 'Removed edge', references: [reference('https://example.org/edge-removed', 'context')],
      },
    ],
    research_moves: [
      {
        id: 'move.alpha', title: 'Move alpha', description: 'Old move description', good_for: ['domain.alpha'],
        output: 'Old output', risks: ['Old risk'], lean_test: 'Old test',
      },
      { id: 'move.removed', title: 'Removed move', description: 'Removed', good_for: ['domain.beta'], output: 'Old', risks: [], lean_test: 'Old' },
    ],
    collections: [
      { id: 'collection.alpha', title: 'Alpha collection', description: 'Old collection', nodes: ['domain.alpha', 'domain.beta'] },
      { id: 'collection.removed', title: 'Removed collection', description: 'Removed', nodes: ['domain.beta'] },
    ],
  };
}

function currentData() {
  return {
    index: index({ schema_version: '0.7.0', application_version: '2.7.0', root_nodes: ['domain.alpha', 'domain.beta'] }),
    nodes: [
      {
        id: 'domain.alpha', kind: 'domain', title: 'Alpha revised', summary: 'New alpha summary', confidence: 'literature',
        tags: ['alpha', 'revised'], questions: ['New question'],
        lean: { imports: ['Mathlib.Algebra.Group.Basic'], declarations: ['NewDecl'], targets: ['New target'] },
        references: [reference('https://example.org/context', 'context')],
      },
      {
        id: 'domain.beta', kind: 'domain', title: 'Beta', summary: 'Beta summary', confidence: 'literature',
        tags: ['beta'], questions: ['Beta question'], lean: { imports: ['Mathlib'], declarations: ['BetaDecl'], targets: ['Beta target'] },
        references: [reference('https://example.org/beta', 'claim')],
      },
      {
        id: 'problem.added', kind: 'problem', title: 'Added problem', summary: 'New target', confidence: 'speculative',
        tags: ['new'], questions: ['What next?'], lean: { imports: [], declarations: [], targets: [] },
        references: [reference('https://example.org/added', 'context')],
      },
    ],
    edges: [
      {
        id: 'edge.alpha.beta', source: 'domain.alpha', target: 'problem.added', relation: 'transfersVia', confidence: 'formal',
        mechanism: 'New transfer mechanism',
        references: [reference('https://example.org/edge-context', 'context')],
      },
      {
        id: 'edge.beta.added', source: 'domain.beta', target: 'problem.added', relation: 'suggests', confidence: 'speculative',
        mechanism: 'Added edge', references: [reference('https://example.org/edge-added', 'context')],
      },
    ],
    research_moves: [
      {
        id: 'move.alpha', title: 'Move alpha', description: 'New move description', good_for: ['domain.alpha', 'problem.added'],
        output: 'New output', risks: ['New risk'], lean_test: 'New test',
      },
      {
        id: 'move.added', title: 'Added move', description: 'New move', good_for: ['problem.added'], output: 'Output', risks: [], lean_test: 'Test',
      },
      { id: 'move.untitled', description: '', good_for: ['problem.added'], output: '', risks: [], lean_test: '' },
    ],
    collections: [
      { id: 'collection.alpha', title: 'Alpha collection', description: 'New collection', nodes: ['domain.alpha', 'problem.added'] },
      { id: 'collection.added', title: 'Added collection', description: 'New collection', nodes: ['problem.added'] },
    ],
  };
}

function storage(initial = null, options = {}) {
  const values = new Map(initial === null ? [] : [[CHANGE_REVIEW_STORAGE_KEY, initial]]);
  return {
    getItem(key) {
      if (options.failGet) throw new Error('blocked');
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (options.failSet) throw new Error('quota');
      values.set(key, String(value));
    },
    value(key = CHANGE_REVIEW_STORAGE_KEY) { return values.get(key); },
  };
}

async function snapshots() {
  return {
    baseline: await createGraphSnapshot(baselineData(), now),
    current: await createGraphSnapshot(currentData(), later),
  };
}

test('constants and canonical helpers are deterministic', async () => {
  assert.equal(CHANGE_REVIEW_APPLICATION, 'PhysMath Knowledge Tree');
  assert.equal(SNAPSHOT_SCHEMA_VERSION, 1);
  assert.equal(REVIEW_SCHEMA_VERSION, 1);
  assert.equal(MAX_CHANGE_IMPORT_BYTES, 8_000_000);
  assert.equal(MAX_CHANGE_DECISIONS, 20_000);
  assert.deepEqual([...DECISION_STATUSES], ['pending', 'accepted', 'needs-work', 'rejected']);
  assert.deepEqual([...RISK_LEVELS], ['critical', 'high', 'medium', 'low', 'info']);
  assert.deepEqual([...ENTITY_TYPES], ['metadata', 'node', 'edge', 'research_move', 'collection']);
  assert.equal(canonicalStringify({ z: 1, a: [{ y: 2, x: 1 }, null] }), '{"a":[{"x":1,"y":2},null],"z":1}');
  assert.equal(await sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  await assert.rejects(() => sha256Hex(3), /must be text/);
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
  await assert.rejects(() => sha256Hex('abc'), /unavailable/);
  if (descriptor) Object.defineProperty(globalThis, 'crypto', descriptor);
});

test('graph normalization enforces stable, internally closed canonical data', () => {
  const normalized = normalizeGraphData({ ...baselineData(), nodes: [...baselineData().nodes].reverse(), moves: baselineData().research_moves, research_moves: undefined });
  assert.deepEqual(normalized.nodes.map(({ id }) => id), ['domain.alpha', 'domain.beta', 'problem.removed']);
  assert.equal(normalized.research_moves[0].id, 'move.alpha');
  assert.throws(() => normalizeGraphData(null), /must be an object/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), index: null }), /index must be an object/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), index: index({ schema_version: '' }) }), /schema_version/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), index: index({ application_version: '' }) }), /application_version/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), index: { ...index(), extra: 1n } }), /JSON-compatible/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), nodes: null }), /nodes must be an array/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), nodes: [null] }), /nodes\[0\]/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), nodes: [{ id: 'Bad ID' }] }), /stable lowercase/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), nodes: [baselineData().nodes[0], baselineData().nodes[0]] }), /Duplicate nodes ID/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), edges: [{ ...baselineData().edges[0], target: 'missing.node' }] }), /missing node/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), collections: [{ ...baselineData().collections[0], nodes: null }] }), /nodes must be an array/);
  assert.throws(() => normalizeGraphData({ ...baselineData(), collections: [{ ...baselineData().collections[0], nodes: ['missing.node'] }] }), /missing node/);
  const circular = { id: 'domain.circular' }; circular.self = circular;
  assert.throws(() => normalizeGraphData({ ...baselineData(), nodes: [circular] }), /JSON-compatible/);
  const disappears = { id: 'domain.disappears', toJSON() { return undefined; } };
  assert.throws(() => normalizeGraphData({ ...baselineData(), nodes: [disappears] }), /JSON-compatible/);
});

test('snapshots export, import and fingerprint canonical graph state', async () => {
  const data = baselineData();
  const reversed = { ...data, nodes: [...data.nodes].reverse(), edges: [...data.edges].reverse() };
  const first = await createGraphSnapshot(data, now);
  const second = await createGraphSnapshot(reversed, later);
  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(await fingerprintGraph(first.graph), first.fingerprint);
  assert.equal((await normalizeGraphSnapshot(first)).fingerprint, first.fingerprint);
  assert.equal((await normalizeGraphSnapshot(first, { verifyFingerprint: false })).fingerprint, first.fingerprint);
  const exported = await exportGraphSnapshot(first);
  assert.equal((await importGraphSnapshot(exported)).fingerprint, first.fingerprint);
  await assert.rejects(() => createGraphSnapshot(data, 'bad'), /captured_at/);
  await assert.rejects(() => normalizeGraphSnapshot(null), /must be an object/);
  await assert.rejects(() => normalizeGraphSnapshot({ ...first, application: 'Other' }), /another application/);
  await assert.rejects(() => normalizeGraphSnapshot({ ...first, schema_version: 2 }), /Unsupported/);
  await assert.rejects(() => normalizeGraphSnapshot({ ...first, captured_at: 'bad' }), /captured_at/);
  await assert.rejects(() => normalizeGraphSnapshot({ ...first, fingerprint: 'bad' }), /lowercase SHA-256/);
  await assert.rejects(() => normalizeGraphSnapshot({ ...first, fingerprint: '0'.repeat(64) }), /does not match/);
  await assert.rejects(() => importGraphSnapshot(null), /must be text/);
  await assert.rejects(() => importGraphSnapshot('x'.repeat(MAX_CHANGE_IMPORT_BYTES + 1)), /size limit/);
  await assert.rejects(() => importGraphSnapshot('{bad'), SyntaxError);
});

test('change-review file validation is bounded and JSON-only', () => {
  assert.equal(validateChangeReviewFile({ size: 0, type: 'application/json', name: 'baseline.json' }), true);
  assert.equal(validateChangeReviewFile({ size: 1, type: 'application/vnd.example+json' }), true);
  assert.equal(validateChangeReviewFile({ size: 1, type: 'text/plain' }), true);
  assert.throws(() => validateChangeReviewFile(null), /Invalid/);
  assert.throws(() => validateChangeReviewFile({ size: -1 }), /Invalid/);
  assert.throws(() => validateChangeReviewFile({ size: Infinity }), /Invalid/);
  assert.throws(() => validateChangeReviewFile({ size: MAX_CHANGE_IMPORT_BYTES + 1 }), /size limit/);
  assert.throws(() => validateChangeReviewFile({ size: 1, name: 'baseline.txt' }), /end in \.json/);
  assert.throws(() => validateChangeReviewFile({ size: 1, type: 'image/png' }), /JSON-compatible/);
});

test('diffs expose high-risk promotions, semantic rewrites and removals', async () => {
  const { baseline, current } = await snapshots();
  const changes = diffGraphSnapshots(baseline, current);
  const summary = summarizeChangeSet(changes);
  assert.ok(changes.length >= 10);
  assert.ok(summary.by_risk.critical >= 3);
  assert.ok(summary.by_change_type.added >= 3);
  assert.ok(summary.by_change_type.removed >= 2);
  assert.equal(summary.confidence_promotions, 2);
  assert.ok(summary.reference_losses >= 2);
  assert.equal(changes[0].risk, 'critical');
  const alpha = changes.find(({ key }) => key === 'node:domain.alpha:modified');
  assert.equal(alpha.risk, 'critical');
  assert.ok(alpha.flags.includes('confidence-promotion'));
  assert.ok(alpha.flags.includes('source-bearing-reference-loss'));
  assert.ok(alpha.flags.includes('lean-target-change'));
  const edge = changes.find(({ key }) => key === 'edge:edge.alpha.beta:modified');
  assert.ok(edge.flags.includes('edge-semantics-change'));
  const removedNode = changes.find(({ key }) => key === 'node:problem.removed:removed');
  assert.equal(removedNode.risk, 'critical');
  const addedEdge = changes.find(({ key }) => key === 'edge:edge.beta.added:added');
  assert.equal(addedEdge.risk, 'medium');
  const metadata = changes.find(({ entity_type }) => entity_type === 'metadata');
  assert.ok(metadata.flags.includes('graph-contract-change'));
  assert.throws(() => diffGraphSnapshots(null, current), /needs two snapshots/);
  assert.throws(() => diffGraphSnapshots({ ...baseline, fingerprint: 'bad' }, current), /lowercase SHA-256/);
  assert.throws(() => summarizeChangeSet(null), /needs an array/);
});

test('classification covers downgrades, vocabulary changes and reference additions', async () => {
  const base = baselineData();
  const downgraded = structuredClone(base);
  downgraded.nodes[0].confidence = 'speculative';
  downgraded.nodes[0].references.push(reference('https://example.org/new', 'formalization'));
  downgraded.edges[0].references = [reference('https://example.org/edge-claim', 'claim')];
  downgraded.research_moves[0].title = 'Move alpha renamed';
  downgraded.collections[0].title = 'Collection renamed';
  downgraded.index.purpose = 'Updated purpose';
  const a = await createGraphSnapshot(base, now);
  const b = await createGraphSnapshot(downgraded, later);
  const changes = diffGraphSnapshots(a, b);
  const node = changes.find(({ entity_id }) => entity_id === 'domain.alpha');
  assert.ok(node.flags.includes('confidence-downgrade'));
  assert.ok(node.flags.includes('reference-addition-or-edit'));
  assert.equal(node.risk, 'high');
  assert.ok(changes.find(({ entity_id }) => entity_id === 'edge.alpha.beta').flags.includes('reference-loss'));
  const weirdBase = structuredClone(base);
  weirdBase.nodes[0].confidence = 'old-vocabulary';
  const weird = structuredClone(weirdBase);
  weird.nodes[0].confidence = 'new-vocabulary';
  const weirdChange = diffGraphSnapshots(
    await createGraphSnapshot(weirdBase, now),
    await createGraphSnapshot(weird, later),
  ).find(({ entity_id }) => entity_id === 'domain.alpha');
  assert.ok(weirdChange.flags.includes('confidence-vocabulary-change'));
  const oddRefs = structuredClone(base);
  oddRefs.nodes[0].references = null;
  const oddRefsAfter = structuredClone(base);
  oddRefsAfter.nodes[0].references = [{ scope: 'claim' }, {}];
  const oddChanges = diffGraphSnapshots(
    await createGraphSnapshot(oddRefs, now),
    await createGraphSnapshot(oddRefsAfter, later),
  );
  assert.ok(oddChanges.find(({ entity_id }) => entity_id === 'domain.alpha'));

  const fakeBase = { fingerprint: 'a'.repeat(64), graph: { index: 1, nodes: [], edges: [], research_moves: [], collections: [] } };
  const fakeCurrent = { fingerprint: 'b'.repeat(64), graph: { index: { value: 2 }, nodes: [], edges: [], research_moves: [], collections: [] } };
  assert.equal(diffGraphSnapshots(fakeBase, fakeCurrent)[0].fields[0].path, '$');
  const fakeRemoved = { fingerprint: 'c'.repeat(64), graph: { index: { removed: 1 }, nodes: [], edges: [], research_moves: [], collections: [] } };
  const fakeAfter = { fingerprint: 'd'.repeat(64), graph: { index: {}, nodes: [], edges: [], research_moves: [], collections: [] } };
  assert.equal(diffGraphSnapshots(fakeRemoved, fakeAfter)[0].fields[0].after, null);

  const identical = diffGraphSnapshots(a, await createGraphSnapshot(base, later));
  assert.deepEqual(identical, []);
});

test('decision ledgers normalize, merge and mutate only current change keys', async () => {
  const { baseline, current } = await snapshots();
  const changes = diffGraphSnapshots(baseline, current);
  const keys = new Set(changes.map(({ key }) => key));
  const key = changes[0].key;
  assert.deepEqual(createDecisionLedger(baseline.fingerprint, current.fingerprint, now).decisions, []);
  assert.throws(() => createDecisionLedger('bad', current.fingerprint, now), /baseline fingerprint/);
  assert.throws(() => createDecisionLedger(baseline.fingerprint, current.fingerprint, 'bad'), /updated_at/);
  const raw = {
    schema_version: 1,
    baseline_fingerprint: baseline.fingerprint,
    current_fingerprint: current.fingerprint,
    updated_at: 'bad',
    decisions: [
      { key, status: 'accepted', notes: 'old', updated_at: now },
      { key, status: 'needs-work', notes: ' newest ', updated_at: later },
      { key: changes[1].key, status: 'invalid', notes: 'fallback time', updated_at: 'bad' },
      { key: 'unknown', status: 'rejected', notes: 'drop', updated_at: later },
      null,
    ],
  };
  const normalized = normalizeDecisionLedger(raw, keys, baseline.fingerprint, current.fingerprint, now);
  assert.equal(normalized.updated_at, now);
  assert.equal(normalized.decisions.length, 2);
  assert.equal(normalized.decisions.find(({ key: value }) => value === key).status, 'needs-work');
  assert.equal(normalized.decisions.find(({ key: value }) => value === key).notes, 'newest');
  assert.equal(normalized.decisions.find(({ key: value }) => value === changes[1].key).updated_at, now);
  assert.deepEqual(normalizeDecisionLedger(null, keys, baseline.fingerprint, current.fingerprint, now).decisions, []);
  assert.deepEqual(normalizeDecisionLedger({ ...raw, schema_version: 2 }, keys, baseline.fingerprint, current.fingerprint, now).decisions, []);
  assert.deepEqual(normalizeDecisionLedger({ ...raw, decisions: null }, keys, baseline.fingerprint, current.fingerprint, now).decisions, []);
  assert.deepEqual(normalizeDecisionLedger({ ...raw, baseline_fingerprint: current.fingerprint }, keys, baseline.fingerprint, current.fingerprint, now).decisions, []);

  let ledger = upsertDecision(normalized, { key, status: 'accepted', notes: 'ok' }, keys, baseline.fingerprint, current.fingerprint, later);
  assert.equal(ledger.decisions[0].status, 'accepted');
  ledger = upsertDecision(ledger, { key, status: 'invalid', notes: 'x'.repeat(13_000) }, keys, baseline.fingerprint, current.fingerprint, later);
  assert.equal(ledger.decisions[0].status, 'pending');
  assert.equal(ledger.decisions[0].notes.length, 12_000);
  assert.throws(() => upsertDecision(ledger, null, keys, baseline.fingerprint, current.fingerprint, later), /not present/);
  assert.throws(() => upsertDecision(ledger, { key: 'unknown' }, keys, baseline.fingerprint, current.fingerprint, later), /not present/);
  assert.equal(removeDecision(ledger, key, keys, baseline.fingerprint, current.fingerprint, later).decisions.length, 1);
  assert.throws(() => removeDecision(ledger, key, keys, baseline.fingerprint, current.fingerprint, 'bad'), /updated_at/);

  const left = upsertDecision(createDecisionLedger(baseline.fingerprint, current.fingerprint, now), { key, status: 'accepted', notes: 'left' }, keys, baseline.fingerprint, current.fingerprint, later);
  const right = upsertDecision(createDecisionLedger(baseline.fingerprint, current.fingerprint, now), { key, status: 'rejected', notes: 'right' }, keys, baseline.fingerprint, current.fingerprint, now);
  assert.equal(mergeDecisionLedgers(left, right, keys, baseline.fingerprint, current.fingerprint, later).decisions[0].notes, 'left');
  assert.equal(mergeDecisionLedgers(right, left, keys, baseline.fingerprint, current.fingerprint, later).decisions[0].notes, 'left');
});

test('browser storage state survives denial, stale fingerprints and valid reloads', async () => {
  const { baseline, current } = await snapshots();
  const changes = diffGraphSnapshots(baseline, current);
  const keys = new Set(changes.map(({ key }) => key));
  const ledger = upsertDecision(createDecisionLedger(baseline.fingerprint, current.fingerprint, now), {
    key: changes[0].key, status: 'accepted', notes: 'reviewed',
  }, keys, baseline.fingerprint, current.fingerprint, later);
  const store = storage();
  const saved = await saveChangeReviewState(store, baseline, ledger, current);
  assert.equal(saved.baseline.fingerprint, baseline.fingerprint);
  assert.equal(JSON.parse(store.value()).ledger.decisions.length, 1);
  const loaded = await loadChangeReviewState(store, current);
  assert.equal(loaded.baseline.fingerprint, baseline.fingerprint);
  assert.equal(loaded.ledger.decisions[0].status, 'accepted');
  assert.deepEqual(await loadChangeReviewState(storage(), current), { baseline: null, ledger: null });
  assert.deepEqual(await loadChangeReviewState(storage('{bad'), current), { baseline: null, ledger: null });
  assert.deepEqual(await loadChangeReviewState(storage(null, { failGet: true }), current), { baseline: null, ledger: null });
  assert.deepEqual(await loadChangeReviewState(storage(JSON.stringify({ schema_version: 2 })), current), { baseline: null, ledger: null });
  assert.deepEqual(await loadChangeReviewState(storage(JSON.stringify({ schema_version: 1 })), current), { baseline: null, ledger: null });
  const stale = JSON.parse(store.value()); stale.ledger.current_fingerprint = baseline.fingerprint;
  const staleLoaded = await loadChangeReviewState(storage(JSON.stringify(stale)), current);
  assert.equal(staleLoaded.ledger.decisions.length, 0);
  assert.equal((await saveChangeReviewState(storage(null, { failSet: true }), baseline, ledger, current)).ledger.decisions.length, 1);
});

test('change worklists filter, rank and summarize decisions deterministically', async () => {
  const { baseline, current } = await snapshots();
  const changes = diffGraphSnapshots(baseline, current);
  const keys = new Set(changes.map(({ key }) => key));
  let ledger = createDecisionLedger(baseline.fingerprint, current.fingerprint, now);
  ledger = upsertDecision(ledger, { key: changes[0].key, status: 'accepted', notes: 'critical accepted' }, keys, baseline.fingerprint, current.fingerprint, later);
  ledger = upsertDecision(ledger, { key: changes.at(-1).key, status: 'needs-work', notes: 'low follow-up' }, keys, baseline.fingerprint, current.fingerprint, later);
  const all = buildChangeWorklist(changes, ledger);
  assert.equal(all.length, changes.length);
  assert.equal(buildChangeWorklist(changes, null, { risk: 'all', entity: 'all', changeType: 'all', status: 'all' }).length, changes.length);
  assert.equal(all[0].change.risk, 'critical');
  assert.equal(buildChangeWorklist(changes, ledger, { risk: 'critical' }).every(({ change }) => change.risk === 'critical'), true);
  assert.equal(buildChangeWorklist(changes, ledger, { entity: 'edge' }).every(({ change }) => change.entity_type === 'edge'), true);
  assert.equal(buildChangeWorklist(changes, ledger, { changeType: 'added' }).every(({ change }) => change.change_type === 'added'), true);
  assert.equal(buildChangeWorklist(changes, ledger, { status: 'accepted' }).length, 1);
  assert.equal(buildChangeWorklist(changes, ledger, { query: 'critical accepted' }).length, 1);
  assert.equal(buildChangeWorklist(changes, ledger, { limit: 0 }).length, 0);
  assert.equal(buildChangeWorklist(changes, ledger, { limit: 2 }).length, 2);
  assert.equal(buildChangeWorklist(changes, ledger, { sort: 'entity' })[0].change.entity_type, 'collection');
  assert.equal(buildChangeWorklist(changes, ledger, { sort: 'status' })[0].decision.status, 'pending');
  assert.throws(() => buildChangeWorklist(null, ledger), /needs an array/);
  assert.throws(() => buildChangeWorklist(changes, ledger, null), /options must be an object/);
  assert.throws(() => buildChangeWorklist(changes, ledger, { sort: 'bad' }), /Unknown/);
  assert.throws(() => buildChangeWorklist(changes, ledger, { limit: -1 }), /non-negative/);
  assert.throws(() => buildChangeWorklist(changes, ledger, { limit: 1.5 }), /non-negative/);
  const summary = summarizeDecisions(changes, ledger);
  assert.equal(summary.total, changes.length);
  assert.equal(summarizeDecisions(changes, null).by_status.pending, changes.length);
  assert.equal(summary.reviewed, 2);
  assert.equal(summary.by_status.accepted, 1);
  assert.equal(summary.by_status['needs-work'], 1);
});

test('portable bundles preserve bounded review decisions and reproducible baselines', async () => {
  const { baseline, current } = await snapshots();
  const changes = diffGraphSnapshots(baseline, current);
  const keys = new Set(changes.map(({ key }) => key));
  const selected = [changes[0].key, changes.find(({ fields }) => fields.length === 0).key];
  let ledger = createDecisionLedger(baseline.fingerprint, current.fingerprint, now);
  ledger = upsertDecision(ledger, { key: selected[0], status: 'needs-work', notes: 'Explain the promotion.' }, keys, baseline.fingerprint, current.fingerprint, later);
  const bundle = buildChangeReviewBundle(baseline, current, changes, ledger, selected, later);
  assert.equal(buildChangeReviewBundle(baseline, current, changes, null, [selected[1]], later).changes[0].decision, null);
  assert.equal(bundle.change_count, 2);
  assert.equal(bundle.changes[0].decision.status, 'needs-work');
  assert.equal(bundle.changes[1].decision, null);
  const markdown = changeReviewBundleMarkdown(bundle);
  assert.match(markdown, /Canonical Change Review Packet/);
  assert.match(markdown, /Explain the promotion/);
  assert.match(markdown, /Changed fields/);
  assert.throws(() => buildChangeReviewBundle(baseline, current, changes, ledger, null, later), /must be an array/);
  assert.throws(() => buildChangeReviewBundle(baseline, current, changes, ledger, ['unknown'], later), /at least one/);
  assert.throws(() => buildChangeReviewBundle(baseline, current, changes, ledger, selected, 'bad'), /bundle date/);

  const imported = await importChangeReviewBundle(bundle, current);
  assert.equal(imported.baseline.fingerprint, baseline.fingerprint);
  assert.equal(imported.ledger.decisions[0].notes, 'Explain the promotion.');
  assert.equal((await importChangeReviewFile(JSON.stringify(bundle), current)).kind, 'bundle');
  assert.equal((await importChangeReviewFile(await exportGraphSnapshot(baseline), current)).kind, 'snapshot');
  await assert.rejects(() => importChangeReviewBundle(null, current), /must be an object/);
  await assert.rejects(() => importChangeReviewBundle({ ...bundle, application: 'Other' }, current), /another application/);
  await assert.rejects(() => importChangeReviewBundle({ ...bundle, schema_version: 2 }, current), /Unsupported/);
  await assert.rejects(() => importChangeReviewBundle({ ...bundle, kind: 'other' }, current), /Unsupported/);
  await assert.rejects(() => importChangeReviewBundle({ ...bundle, current_fingerprint: 'bad' }, current), /fingerprint/);
  await assert.rejects(() => importChangeReviewBundle({ ...bundle, current_fingerprint: baseline.fingerprint }, current), /different current graph/);
  const noChanges = { ...bundle, changes: null, exported_at: 'bad' };
  assert.equal((await importChangeReviewBundle(noChanges, current)).ledger.decisions.length, 0);
  await assert.rejects(() => importChangeReviewFile(null, current), /must be text/);
  await assert.rejects(() => importChangeReviewFile('x'.repeat(MAX_CHANGE_IMPORT_BYTES + 1), current), /size limit/);
});
