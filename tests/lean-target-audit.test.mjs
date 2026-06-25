import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LEAN_AUDIT_APPLICATION,
  LEAN_AUDIT_SCHEMA_VERSION,
  LEAN_AUDIT_STORAGE_KEY,
  MAX_LEAN_AUDIT_IMPORT_BYTES,
  LEAN_AUDIT_STATUSES,
  LEAN_ITEM_TYPES,
  leanAuditItemId,
  isProbeSafeLeanName,
  normalizeLeanCatalog,
  createLeanAuditLedger,
  normalizeLeanAuditLedger,
  loadLeanAuditLedger,
  saveLeanAuditLedger,
  exportLeanAuditLedger,
  validateLeanAuditFile,
  importLeanAuditLedger,
  mergeLeanAuditLedgers,
  upsertLeanAuditRecord,
  removeLeanAuditRecord,
  buildLeanAuditWorklist,
  filterLeanAuditWorklist,
  summarizeLeanAudit,
  buildLeanProbe,
  buildLeanAuditPacket,
  exportLeanAuditPacketMarkdown,
} from '../src/lib/lean-target-audit.js';

const NOW = '2026-06-25T10:00:00.000Z';
const LATER = '2026-06-25T11:00:00.000Z';

function fixtureNodes() {
  return [
    {
      id: 'domain.alpha', title: 'Álpha domain', kind: 'domain', confidence: 'literature',
      lean: {
        imports: ['Mathlib', 'Mathlib', 'Mathlib.Alpha'],
        declarations: ['Foo.Bar', 'Foo.Bar'],
        targets: ['Prove a finite statement.'],
      },
    },
    {
      id: 'problem.beta', title: 'Beta problem', kind: 'problem', confidence: 'formal',
      lean: {
        imports: ['Bad import', 'Mathlib.Alpha'],
        declarations: ['Baz', 'bad name'],
        targets: ['Test a boundary -/ case.\nThen compare.'],
      },
    },
    { id: 'bridge.gamma', title: 'Gamma bridge', kind: 'bridge', confidence: 'heuristic', lean: { targets: ['Bridge target'] } },
  ];
}

function catalogFixture() {
  return normalizeLeanCatalog(fixtureNodes());
}

function idFor(catalog, nodeId, type, value) {
  return catalog.items.find((item) => item.node_id === nodeId && item.item_type === type && item.value === value).id;
}

test('catalog normalization is deterministic, deduplicated and exposes safe probe metadata', () => {
  const catalog = catalogFixture();
  assert.deepEqual(catalog.nodes.map(({ id }) => id), ['bridge.gamma', 'domain.alpha', 'problem.beta']);
  assert.deepEqual(catalog.stats, {
    nodes: 3, items: 10, imports: 4, declarations: 3, targets: 3,
    unique_imports: 3, unique_declarations: 3, probe_unsafe: 2,
  });
  assert.equal(catalog.items.filter(({ value }) => value === 'Mathlib.Alpha').length, 2);
  assert.equal(catalog.items.find(({ value }) => value === 'Mathlib.Alpha').reuse_count, 2);
  assert.equal(catalog.items.find(({ value }) => value === 'Bad import').probe_safe, false);
  assert.equal(catalog.items.find(({ value }) => value === 'bad name').probe_safe, false);
  assert.equal(catalog.items.find(({ item_type: type }) => type === 'target').probe_safe, false);
  assert.equal(isProbeSafeLeanName('CategoryTheory.Functor'), true);
  assert.equal(isProbeSafeLeanName("Finset.sum_pow'"), true);
  assert.equal(isProbeSafeLeanName('bad name'), false);
  assert.equal(isProbeSafeLeanName(' Foo'), false);
  assert.equal(isProbeSafeLeanName(null), false);
  const id = leanAuditItemId('domain.alpha', 'declaration', 'Foo.Bar');
  assert.deepEqual(JSON.parse(id), ['domain.alpha', 'declaration', 'Foo.Bar']);
  assert.deepEqual(LEAN_AUDIT_STATUSES, ['unreviewed', 'verified', 'missing', 'renamed', 'blocked']);
  assert.deepEqual(LEAN_ITEM_TYPES, ['import', 'declaration', 'target']);
  const deterministic = normalizeLeanCatalog([{
    id: 'domain.order', title: 'Order', lean: { imports: ['Ångstrom', 'Zulu', 'Alpha'] },
  }]);
  assert.deepEqual(deterministic.nodes[0].imports, ['Alpha', 'Zulu', 'Ångstrom']);
});

test('catalog and item validation reject malformed canonical metadata', () => {
  assert.throws(() => normalizeLeanCatalog({}), /must be an array/u);
  assert.throws(() => normalizeLeanCatalog([null]), /must be an object/u);
  assert.throws(() => normalizeLeanCatalog([{ id: 'Bad ID', title: 'X' }]), /stable lowercase/u);
  assert.throws(() => normalizeLeanCatalog([{ id: 'domain.x', title: ' ' }]), /needs a title/u);
  assert.throws(() => normalizeLeanCatalog([{ id: 'domain.x', title: 'X' }, { id: 'domain.x', title: 'Y' }]), /Duplicate/u);
  assert.throws(() => normalizeLeanCatalog([{ id: 'domain.x', title: 'X', lean: [] }]), /must be an object/u);
  assert.throws(() => normalizeLeanCatalog([{ id: 'domain.x', title: 'X', lean: { imports: 'Mathlib' } }]), /must be an array/u);
  assert.throws(() => normalizeLeanCatalog([{ id: 'domain.x', title: 'X', lean: { declarations: [3] } }]), /must be text/u);
  assert.throws(() => normalizeLeanCatalog([{ id: 'domain.x', title: 'X', lean: { targets: [' '] } }]), /must not be empty/u);
  assert.throws(() => leanAuditItemId('Bad', 'import', 'Mathlib'), /stable lowercase/u);
  assert.throws(() => leanAuditItemId('domain.x', 'other', 'Mathlib'), /Unknown Lean item type/u);
  assert.throws(() => leanAuditItemId('domain.x', 'import', ' '), /must not be empty/u);
});

test('ledger normalization keeps newest valid records and sanitizes bounded fields', () => {
  const catalog = catalogFixture();
  const valid = new Set(catalog.items.map(({ id }) => id));
  const itemId = idFor(catalog, 'domain.alpha', 'declaration', 'Foo.Bar');
  const otherId = idFor(catalog, 'problem.beta', 'declaration', 'Baz');
  const ledger = normalizeLeanAuditLedger({
    schema_version: 1,
    updated_at: 'bad date',
    records: [
      { item_id: itemId, status: 'invalid', checked_at: 'bad', toolchain: 4, replacement: null, notes: 3, updated_at: NOW },
      { item_id: itemId, status: 'verified', checked_at: NOW, toolchain: '  lean-v1  ', replacement: ' Old ', notes: ' ok ', updated_at: LATER },
      { item_id: otherId, status: 'renamed', replacement: 'New.Baz', updated_at: NOW },
      { item_id: 'unknown', status: 'verified', updated_at: NOW },
      { item_id: 3, status: 'verified' },
      null,
    ],
  }, valid, NOW);
  assert.equal(ledger.updated_at, NOW);
  assert.equal(ledger.records.length, 2);
  assert.deepEqual(ledger.records.find(({ item_id: id }) => id === itemId), {
    item_id: itemId, status: 'verified', checked_at: NOW, toolchain: 'lean-v1',
    replacement: 'Old', notes: 'ok', updated_at: LATER,
  });
  assert.equal(ledger.records.find(({ item_id: id }) => id === otherId).status, 'renamed');
  assert.deepEqual(normalizeLeanAuditLedger(null, valid, NOW), createLeanAuditLedger(NOW));
  assert.deepEqual(normalizeLeanAuditLedger({ schema_version: 2, records: [] }, valid, NOW), createLeanAuditLedger(NOW));
  assert.throws(() => createLeanAuditLedger('bad'), /ISO-compatible/u);
});

test('storage load and save remain usable under malformed data and storage failures', () => {
  const catalog = catalogFixture();
  const valid = new Set(catalog.items.map(({ id }) => id));
  const itemId = catalog.items[0].id;
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
  assert.equal(loadLeanAuditLedger(storage, valid).records.length, 0);
  const saved = saveLeanAuditLedger(storage, {
    schema_version: 1, updated_at: NOW,
    records: [{ item_id: itemId, status: 'verified', updated_at: NOW }],
  }, valid, LATER);
  assert.equal(saved.updated_at, LATER);
  assert.equal(JSON.parse(values.get(LEAN_AUDIT_STORAGE_KEY)).records[0].status, 'verified');
  assert.equal(loadLeanAuditLedger(storage, valid).records[0].status, 'verified');
  const brokenRead = { getItem() { throw new Error('blocked'); } };
  assert.equal(loadLeanAuditLedger(brokenRead, valid).records.length, 0);
  const brokenWrite = { setItem() { throw new Error('quota'); } };
  assert.doesNotThrow(() => saveLeanAuditLedger(brokenWrite, saved, valid, LATER));
  assert.throws(() => saveLeanAuditLedger(storage, saved, valid, 'bad'), /ISO-compatible/u);
});

test('ledger import, export and file gates preserve application and schema identity', () => {
  const catalog = catalogFixture();
  const valid = new Set(catalog.items.map(({ id }) => id));
  const itemId = catalog.items[0].id;
  const ledger = upsertLeanAuditRecord(createLeanAuditLedger(NOW), {
    item_id: itemId, status: 'missing', notes: 'not found', checked_at: NOW,
  }, valid, NOW);
  const exported = exportLeanAuditLedger(ledger, valid, LATER);
  const parsed = JSON.parse(exported);
  assert.equal(parsed.application, LEAN_AUDIT_APPLICATION);
  assert.equal(parsed.schema_version, LEAN_AUDIT_SCHEMA_VERSION);
  assert.equal(importLeanAuditLedger(exported, valid, LATER).records[0].status, 'missing');
  assert.equal(importLeanAuditLedger(JSON.stringify(ledger), valid, LATER).records[0].status, 'missing');
  const mixedRaw = { schema_version: 1, updated_at: NOW, records: [null, { item_id: itemId, status: 'verified' }] };
  assert.equal(importLeanAuditLedger(JSON.stringify(mixedRaw), valid, LATER).records[0].status, 'verified');
  assert.equal(validateLeanAuditFile({ size: 4, name: 'audit.json', type: 'application/json;charset=utf-8' }), true);
  assert.equal(validateLeanAuditFile({ size: 4, name: '', type: 'application/vnd.test+json' }), true);
  assert.throws(() => validateLeanAuditFile(null), /Invalid/u);
  assert.throws(() => validateLeanAuditFile({ size: -1 }), /Invalid/u);
  assert.throws(() => validateLeanAuditFile({ size: MAX_LEAN_AUDIT_IMPORT_BYTES + 1 }), /size limit/u);
  assert.throws(() => validateLeanAuditFile({ size: 2, name: 'audit.txt' }), /end in .json/u);
  assert.throws(() => validateLeanAuditFile({ size: 2, type: 'text/html' }), /JSON-compatible/u);
  assert.throws(() => importLeanAuditLedger(4, valid), /must be text/u);
  assert.throws(() => importLeanAuditLedger('x'.repeat(MAX_LEAN_AUDIT_IMPORT_BYTES + 1), valid), /size limit/u);
  assert.throws(() => importLeanAuditLedger('[]', valid), /JSON object/u);
  assert.throws(() => importLeanAuditLedger(JSON.stringify({ application: 'Other', schema_version: 1, ledger }), valid), /another application/u);
  assert.throws(() => importLeanAuditLedger(JSON.stringify({ application: LEAN_AUDIT_APPLICATION, schema_version: 2, ledger }), valid), /Unsupported/u);
  assert.throws(() => importLeanAuditLedger(JSON.stringify({ application: LEAN_AUDIT_APPLICATION, schema_version: 1, ledger: [] }), valid), /must be an object/u);
  assert.throws(() => importLeanAuditLedger(JSON.stringify({ schema_version: 2, records: [] }), valid), /Unsupported/u);
  assert.throws(() => importLeanAuditLedger(JSON.stringify({ schema_version: 1, records: [{ item_id: 'unknown' }] }), valid), /does not contain items/u);
  assert.throws(() => exportLeanAuditLedger(ledger, valid, 'bad'), /ISO-compatible/u);
});

test('merge, upsert and removal use explicit newest-record semantics', () => {
  const catalog = catalogFixture();
  const valid = new Set(catalog.items.map(({ id }) => id));
  const itemId = catalog.items[0].id;
  const left = upsertLeanAuditRecord(createLeanAuditLedger(NOW), { item_id: itemId, status: 'missing' }, valid, NOW);
  const older = upsertLeanAuditRecord(createLeanAuditLedger(NOW), { item_id: itemId, status: 'verified' }, valid, '2026-06-25T09:00:00.000Z');
  const newer = upsertLeanAuditRecord(createLeanAuditLedger(NOW), { item_id: itemId, status: 'renamed', replacement: 'New.Name' }, valid, LATER);
  assert.equal(mergeLeanAuditLedgers(left, older, valid, LATER).records[0].status, 'missing');
  assert.equal(mergeLeanAuditLedgers(left, newer, valid, LATER).records[0].status, 'renamed');
  assert.equal(removeLeanAuditRecord(newer, itemId, valid, LATER).records.length, 0);
  assert.throws(() => upsertLeanAuditRecord(left, { item_id: 'unknown' }, valid, NOW), /not present/u);
  assert.throws(() => upsertLeanAuditRecord(left, null, valid, NOW), /not present/u);
  assert.throws(() => removeLeanAuditRecord(left, itemId, valid, 'bad'), /ISO-compatible/u);
});

test('worklist priority, filtering and summaries expose unresolved declaration risk', () => {
  const catalog = catalogFixture();
  const valid = new Set(catalog.items.map(({ id }) => id));
  const missing = idFor(catalog, 'problem.beta', 'declaration', 'Baz');
  const renamed = idFor(catalog, 'domain.alpha', 'declaration', 'Foo.Bar');
  const blocked = idFor(catalog, 'problem.beta', 'import', 'Bad import');
  let ledger = createLeanAuditLedger(NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: missing, status: 'missing', notes: 'unknown constant' }, valid, NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: renamed, status: 'renamed', replacement: 'Foo.NewBar', toolchain: 'v4.31' }, valid, NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: blocked, status: 'blocked' }, valid, NOW);
  const worklist = buildLeanAuditWorklist(catalog, ledger);
  assert.equal(worklist[0].status, 'missing');
  assert.equal(worklist.find(({ id }) => id === renamed).replacement_probe_safe, true);
  assert.equal(worklist.find(({ value }) => value === 'Bad import').probe_safe, false);
  const summary = summarizeLeanAudit(worklist);
  assert.equal(summary.total, 10);
  assert.equal(summary.reviewed, 3);
  assert.equal(summary.by_status.missing, 1);
  assert.equal(summary.by_status.renamed, 1);
  assert.equal(summary.by_status.blocked, 1);
  assert.equal(summary.by_type.declaration, 3);
  assert.equal(summary.by_type.target, 3);
  assert.equal(summary.probe_unsafe, 2);
  assert.equal(summary.with_replacement, 1);
  assert.equal(filterLeanAuditWorklist(worklist, { search: 'alpha', status: 'renamed' }).length, 1);
  assert.equal(filterLeanAuditWorklist(worklist, { itemType: 'declaration', nodeKind: 'problem', confidence: 'formal' }).length, 2);
  assert.equal(filterLeanAuditWorklist(worklist, { confidence: 'literature' }).length, 4);
  assert.equal(filterLeanAuditWorklist(worklist, { status: 'all', itemType: 'all', nodeKind: 'all', confidence: 'all', sort: 'node' }).length, 10);
  assert.equal(filterLeanAuditWorklist(worklist, { sort: 'status' }).length, 10);
  assert.equal(filterLeanAuditWorklist(worklist, { sort: 'value' }).length, 10);
  const synthetic = [
    { priority_score: 1, node_title: 'Same', value: 'b', item_type: 'declaration', status: 'verified', node_kind: 'domain', node_confidence: 'formal', replacement: '', notes: '', toolchain: '' },
    { priority_score: 1, node_title: 'Same', value: 'a', item_type: 'declaration', status: 'verified', node_kind: 'domain', node_confidence: 'formal', replacement: '', notes: '', toolchain: '' },
    { priority_score: 2, node_title: 'Other', value: 'a', item_type: 'import', status: 'missing', node_kind: 'problem', node_confidence: 'literature', replacement: '', notes: '', toolchain: '' },
    { priority_score: 1, node_title: 'Zed', value: 'a', item_type: 'target', status: 'verified', node_kind: 'bridge', node_confidence: 'heuristic', replacement: '', notes: '', toolchain: '' },
  ];
  assert.deepEqual(filterLeanAuditWorklist(synthetic, { sort: 'priority' }).map(({ node_title: title, value }) => `${title}:${value}`), ['Other:a', 'Same:a', 'Same:b', 'Zed:a']);
  assert.deepEqual(filterLeanAuditWorklist(synthetic, { sort: 'node' }).map(({ node_title: title, value }) => `${title}:${value}`), ['Other:a', 'Same:a', 'Same:b', 'Zed:a']);
  assert.deepEqual(filterLeanAuditWorklist(synthetic, { sort: 'status' }).map(({ status, value }) => `${status}:${value}`), ['verified:a', 'verified:a', 'verified:b', 'missing:a']);
  assert.deepEqual(filterLeanAuditWorklist(synthetic, { sort: 'value' }).map(({ node_title: title, value }) => `${value}:${title}`), ['a:Other', 'a:Same', 'a:Zed', 'b:Same']);
  const tiedCatalog = {
    items: [
      { id: 'a', node_id: 'domain.a', node_title: 'Same', node_kind: 'domain', node_confidence: 'unknown', item_type: 'declaration', value: 'B', probe_safe: true, reuse_count: 1, node_imports: [], node_declarations: [] },
      { id: 'b', node_id: 'problem.b', node_title: 'Same', node_kind: 'problem', node_confidence: 'unknown', item_type: 'import', value: 'A', probe_safe: true, reuse_count: 1, node_imports: [], node_declarations: [] },
      { id: 'c', node_id: 'domain.c', node_title: 'Able', node_kind: 'domain', node_confidence: 'unknown', item_type: 'declaration', value: 'C', probe_safe: true, reuse_count: 1, node_imports: [], node_declarations: [] },
      { id: 'd', node_id: 'domain.d', node_title: 'Same', node_kind: 'domain', node_confidence: 'unknown', item_type: 'declaration', value: 'A', probe_safe: true, reuse_count: 1, node_imports: [], node_declarations: [] },
    ],
  };
  assert.deepEqual(buildLeanAuditWorklist(tiedCatalog, createLeanAuditLedger(NOW)).map(({ id }) => id), ['c', 'd', 'a', 'b']);
  assert.throws(() => filterLeanAuditWorklist({}, {}), /must be an array/u);
  assert.throws(() => filterLeanAuditWorklist(worklist, { sort: 'bad' }), /Unknown/u);
  assert.throws(() => buildLeanAuditWorklist({}, ledger), /catalog is invalid/u);
  assert.throws(() => summarizeLeanAudit({}), /must be an array/u);
});

test('probe generation handles renames, blocked and unsafe candidates without overstating verification', () => {
  const catalog = catalogFixture();
  const valid = new Set(catalog.items.map(({ id }) => id));
  const foo = idFor(catalog, 'domain.alpha', 'declaration', 'Foo.Bar');
  const baz = idFor(catalog, 'problem.beta', 'declaration', 'Baz');
  const unsafeDecl = idFor(catalog, 'problem.beta', 'declaration', 'bad name');
  const badImport = idFor(catalog, 'problem.beta', 'import', 'Bad import');
  const betaMathlib = idFor(catalog, 'problem.beta', 'import', 'Mathlib.Alpha');
  const alphaMathlib = idFor(catalog, 'domain.alpha', 'import', 'Mathlib');
  const target = idFor(catalog, 'problem.beta', 'target', 'Test a boundary -/ case.\nThen compare.');
  let ledger = createLeanAuditLedger(NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: foo, status: 'renamed', replacement: 'Foo.NewBar' }, valid, NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: baz, status: 'blocked' }, valid, NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: badImport, status: 'renamed', replacement: 'still bad' }, valid, NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: betaMathlib, status: 'renamed', replacement: 'Mathlib.NewAlpha' }, valid, NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: alphaMathlib, status: 'blocked' }, valid, NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: unsafeDecl, status: 'renamed', replacement: 'still bad' }, valid, NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: target, status: 'verified' }, valid, NOW);
  const probe = buildLeanProbe(catalog, [foo, baz, unsafeDecl, badImport, betaMathlib, alphaMathlib, target], ledger, {
    toolchain: 'leanprover/lean4:v4.31.0', generatedAt: NOW,
  });
  assert.match(probe, /import Mathlib\.Alpha/u);
  assert.match(probe, /import Mathlib\.NewAlpha/u);
  assert.doesNotMatch(probe, /^import Bad import$/mu);
  assert.match(probe, /Blocked import candidate/u);
  assert.match(probe, /#check Foo\.NewBar/u);
  assert.match(probe, /Renamed from: Foo\.Bar/u);
  assert.match(probe, /Blocked declaration candidate: Baz/u);
  assert.match(probe, /lacks a probe-safe replacement: bad name/u);
  assert.match(probe, /Target \[verified\]: Test a boundary - \/ case\. Then compare\./u);
  assert.match(probe, /Compilation does not validate/u);
  assert.throws(() => buildLeanProbe({}, [foo], ledger), /catalog is invalid/u);
  assert.throws(() => buildLeanProbe(catalog, 'bad', ledger), /array or Set/u);
  assert.throws(() => buildLeanProbe(catalog, [], ledger), /selection is empty/u);
  assert.throws(() => buildLeanProbe(catalog, [foo], ledger, { generatedAt: 'bad' }), /ISO-compatible/u);
});

test('probe falls back to Mathlib and includes selected import and target audit comments', () => {
  const catalog = normalizeLeanCatalog([{ id: 'domain.empty', title: 'Empty', kind: 'domain', confidence: 'literature', lean: { targets: ['Do it'] } }]);
  const probe = buildLeanProbe(catalog, undefined, createLeanAuditLedger(NOW));
  assert.match(probe, /^import Mathlib$/mu);
  assert.match(probe, /Target \[unreviewed\]: Do it/u);
  const withUnsafe = normalizeLeanCatalog([{ id: 'domain.bad', title: 'Bad', lean: { imports: ['bad import'], declarations: ['bad decl'] } }]);
  const unsafeProbe = buildLeanProbe(withUnsafe, new Set(withUnsafe.items.map(({ id }) => id)), createLeanAuditLedger(NOW));
  assert.match(unsafeProbe, /Probe-unsafe import candidate/u);
  assert.match(unsafeProbe, /Probe-unsafe declaration candidate/u);
  assert.match(unsafeProbe, /^import Mathlib$/mu);
});

test('portable packets include exact selected records and render Markdown safely', () => {
  const catalog = catalogFixture();
  const valid = new Set(catalog.items.map(({ id }) => id));
  const foo = idFor(catalog, 'domain.alpha', 'declaration', 'Foo.Bar');
  let ledger = createLeanAuditLedger(NOW);
  ledger = upsertLeanAuditRecord(ledger, { item_id: foo, status: 'verified', notes: 'A | B' }, valid, NOW);
  const packet = buildLeanAuditPacket(catalog, [foo], ledger, { toolchain: 'v4.31.0', generatedAt: LATER });
  assert.equal(packet.items.length, 1);
  assert.equal(packet.records.length, 1);
  assert.equal(packet.summary.by_status.verified, 1);
  assert.match(packet.probe, /#check Foo\.Bar/u);
  const markdown = exportLeanAuditPacketMarkdown(packet);
  assert.match(markdown, /# Lean Target Audit Packet/u);
  assert.match(markdown, /\| domain\.alpha \| declaration \| Foo\.Bar \| verified \|/u);
  assert.match(markdown, /```lean/u);
  const defaultPacket = buildLeanAuditPacket(catalog, [foo], ledger);
  assert.equal(Number.isNaN(Date.parse(defaultPacket.generated_at)), false);
  const sparseMarkdown = exportLeanAuditPacketMarkdown({
    items: [{ id: 'unrecorded', node_id: null, item_type: null, value: 'A|B' }],
    summary: {}, records: null, probe: '\n', generated_at: null, toolchain: '',
  });
  assert.match(sparseMarkdown, /Toolchain note: not recorded/u);
  assert.match(sparseMarkdown, /A\\\|B/u);
  assert.match(sparseMarkdown, /unreviewed/u);
  assert.throws(() => buildLeanAuditPacket(catalog, [], ledger), /selection is empty/u);
  assert.throws(() => buildLeanAuditPacket(catalog, [foo], ledger, { generatedAt: 'bad' }), /ISO-compatible/u);
  assert.throws(() => exportLeanAuditPacketMarkdown(null), /packet is invalid/u);
});

test('a fully annotated current-scale ledger remains round-trip portable under the size gate', () => {
  const nodes = Array.from({ length: 180 }, (_, index) => ({
    id: `domain.bulk${index}`,
    title: `Bulk node ${index}`,
    kind: 'domain',
    confidence: 'literature',
    lean: { targets: [`Bounded target ${index}`] },
  }));
  const catalog = normalizeLeanCatalog(nodes);
  const valid = new Set(catalog.items.map(({ id }) => id));
  const ledger = {
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    updated_at: NOW,
    records: catalog.items.map(({ id }) => ({
      item_id: id,
      status: 'blocked',
      checked_at: NOW,
      toolchain: 'leanprover/lean4:v4.31.0',
      replacement: '',
      notes: 'x'.repeat(12_000),
      updated_at: NOW,
    })),
  };
  const exported = exportLeanAuditLedger(ledger, valid, NOW);
  assert.ok(new TextEncoder().encode(exported).length < MAX_LEAN_AUDIT_IMPORT_BYTES);
  assert.equal(importLeanAuditLedger(exported, valid, LATER).records.length, 180);
});
