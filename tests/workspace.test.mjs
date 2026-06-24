import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_WORKSPACE_IMPORT_BYTES,
  WORKSPACE_APPLICATION,
  WORKSPACE_SCHEMA_VERSION,
  WORKSPACE_STORAGE_KEY,
  compareNodeSets,
  createWorkspace,
  createWorkspaceLibrary,
  exportWorkspaceLibrary,
  importWorkspaceLibrary,
  loadWorkspaceLibrary,
  mergeWorkspaceLibraries,
  normalizeWorkspace,
  normalizeWorkspaceLibrary,
  saveWorkspaceLibrary,
  touchWorkspace,
  validateWorkspaceFile,
} from '../src/lib/workspace.js';

const now = '2026-06-24T12:00:00.000Z';
const later = '2026-06-24T13:00:00.000Z';
const validIds = new Set(['node.a', 'node.b', 'node.c', 'node.d']);

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    value(key) { return values.get(key); },
  };
}

test('workspace creation produces a bounded, timestamped canonical record', () => {
  assert.deepEqual(createWorkspace({ id: 'workspace.alpha', title: ' Alpha ', now }), {
    id: 'workspace.alpha',
    title: 'Alpha',
    node_ids: [],
    notes: '',
    bridge_cards: [],
    negative_results: [],
    created_at: now,
    updated_at: now,
  });
  assert.throws(() => createWorkspace({ id: '../bad', now }), /Workspace ID/);

  const library = createWorkspaceLibrary({ workspaceId: 'workspace.seed', title: 'Seed', now });
  assert.equal(library.schema_version, WORKSPACE_SCHEMA_VERSION);
  assert.equal(library.active_workspace_id, 'workspace.seed');
  assert.equal(library.workspaces[0].title, 'Seed');
});

test('normalization removes unknown graph IDs and sanitizes nested research records', () => {
  const normalized = normalizeWorkspace({
    id: 'workspace.alpha',
    title: '  Investigation  ',
    node_ids: ['node.a', 'missing', 'node.a', 'node.b'],
    notes: 'notes',
    bridge_cards: [
      {
        id: 'card.one', title: ' Draft ', markdown: '# Claim', node_ids: ['node.c', 'missing'],
        created_at: now, updated_at: later,
      },
      { id: 'card.one', title: 'duplicate' },
      { id: '../bad' },
    ],
    negative_results: [
      {
        id: 'result.one', title: 'Counterexample', status: 'falsified', node_ids: ['node.a'],
        observation: 'Fails on n = 2', challenged_mechanism: 'Functorial transfer', next_test: 'Check n = 3',
        created_at: now, updated_at: later,
      },
      { id: 'result.two', status: 'unknown' },
    ],
    created_at: now,
    updated_at: later,
  }, validIds, now);

  assert.equal(normalized.title, 'Investigation');
  assert.deepEqual(normalized.node_ids, ['node.a', 'node.b']);
  assert.equal(normalized.bridge_cards.length, 1);
  assert.deepEqual(normalized.bridge_cards[0].node_ids, ['node.c']);
  assert.equal(normalized.negative_results[0].status, 'falsified');
  assert.equal(normalized.negative_results[1].status, 'observed');
  assert.equal(normalizeWorkspace({ id: 'bad/id' }, validIds, now), null);
});

test('library normalization repairs active selection and falls back safely', () => {
  const normalized = normalizeWorkspaceLibrary({
    schema_version: 1,
    active_workspace_id: 'missing',
    workspaces: [
      { id: 'workspace.one', title: 'One', updated_at: now },
      { id: 'workspace.one', title: 'Duplicate', updated_at: later },
      { id: 'workspace.two', title: 'Two', updated_at: later },
    ],
    updated_at: later,
  }, validIds, { now });
  assert.deepEqual(normalized.workspaces.map(({ id }) => id), ['workspace.one', 'workspace.two']);
  assert.equal(normalized.active_workspace_id, 'workspace.one');

  const fallback = normalizeWorkspaceLibrary(null, validIds, { now, fallbackWorkspaceId: 'workspace.fallback' });
  assert.equal(fallback.active_workspace_id, 'workspace.fallback');
});

test('storage loading is resilient and saving preserves a canonical payload', () => {
  const library = createWorkspaceLibrary({ workspaceId: 'workspace.one', now });
  const storage = memoryStorage();
  const saved = saveWorkspaceLibrary(storage, library, validIds);
  assert.equal(JSON.parse(storage.value(WORKSPACE_STORAGE_KEY)).active_workspace_id, 'workspace.one');
  assert.equal(loadWorkspaceLibrary(storage, validIds).active_workspace_id, 'workspace.one');
  assert.equal(saved.schema_version, 1);

  const corrupt = memoryStorage({ [WORKSPACE_STORAGE_KEY]: '{bad json' });
  assert.equal(loadWorkspaceLibrary(corrupt, validIds).workspaces.length, 1);
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(loadWorkspaceLibrary(blocked, validIds).workspaces.length, 1);
  assert.equal(saveWorkspaceLibrary(blocked, library, validIds).workspaces.length, 1);
});

test('portable export/import validates ownership, schema, size and graph IDs', () => {
  const library = createWorkspaceLibrary({ workspaceId: 'workspace.one', now });
  library.workspaces[0].node_ids = ['node.a', 'missing'];
  const text = exportWorkspaceLibrary(library, validIds, now);
  const parsed = JSON.parse(text);
  assert.equal(parsed.application, WORKSPACE_APPLICATION);
  assert.equal(parsed.exported_at, now);
  assert.deepEqual(parsed.library.workspaces[0].node_ids, ['node.a']);
  assert.deepEqual(importWorkspaceLibrary(text, validIds, later).workspaces[0].node_ids, ['node.a']);

  assert.throws(() => importWorkspaceLibrary('[]', validIds, now), /JSON object/);
  assert.throws(() => importWorkspaceLibrary(JSON.stringify({
    application: 'Other', schema_version: 1, library: { schema_version: 1, workspaces: [] },
  }), validIds, now), /another application/);
  assert.throws(() => importWorkspaceLibrary(JSON.stringify({
    application: WORKSPACE_APPLICATION, schema_version: 2, library: {},
  }), validIds, now), /Unsupported workspace export/);
  assert.throws(() => importWorkspaceLibrary(JSON.stringify({
    application: WORKSPACE_APPLICATION,
    schema_version: 1,
    library: { schema_version: 1, active_workspace_id: 'bad', workspaces: [{ id: '../bad' }] },
  }), validIds, now), /no usable workspaces/);
  assert.throws(() => importWorkspaceLibrary('x'.repeat(MAX_WORKSPACE_IMPORT_BYTES + 1), validIds, now), /size limit/);
});

test('file validation accepts JSON-compatible inputs and rejects unsafe metadata', () => {
  assert.equal(validateWorkspaceFile({ size: 100, name: 'workspaces.json', type: 'application/json' }), true);
  assert.equal(validateWorkspaceFile({ size: 0, name: '', type: '' }), true);
  assert.throws(() => validateWorkspaceFile({ size: -1 }), /Invalid/);
  assert.throws(() => validateWorkspaceFile({ size: MAX_WORKSPACE_IMPORT_BYTES + 1 }), /size limit/);
  assert.throws(() => validateWorkspaceFile({ size: 1, name: 'notes.txt', type: 'text/plain' }), /filename/);
  assert.throws(() => validateWorkspaceFile({ size: 1, name: 'x.json', type: 'image/png' }), /media type/);
});

test('library merge uses newer records, preserves unique workspaces and incoming focus', () => {
  const current = createWorkspaceLibrary({ workspaceId: 'workspace.shared', title: 'Old', now });
  current.workspaces.push(createWorkspace({ id: 'workspace.local', title: 'Local', now }));
  const incoming = createWorkspaceLibrary({ workspaceId: 'workspace.shared', title: 'New', now: later });
  incoming.workspaces.push(createWorkspace({ id: 'workspace.remote', title: 'Remote', now: later }));
  incoming.active_workspace_id = 'workspace.remote';

  const merged = mergeWorkspaceLibraries(current, incoming, validIds, later);
  assert.equal(merged.workspaces.find(({ id }) => id === 'workspace.shared').title, 'New');
  assert.deepEqual(new Set(merged.workspaces.map(({ id }) => id)), new Set([
    'workspace.shared', 'workspace.local', 'workspace.remote',
  ]));
  assert.equal(merged.active_workspace_id, 'workspace.remote');
});

test('set comparison and workspace touching are deterministic', () => {
  assert.deepEqual(compareNodeSets(new Set(['node.c', 'node.a']), ['node.b', 'node.c']), {
    left_only: ['node.a'],
    shared: ['node.c'],
    right_only: ['node.b'],
    union: ['node.a', 'node.b', 'node.c'],
  });
  const touched = touchWorkspace({ id: 'workspace.one', title: 'One', updated_at: now }, validIds, later);
  assert.equal(touched.updated_at, later);
  assert.throws(() => touchWorkspace({ id: '../bad' }, validIds, later), /invalid workspace/);
});

test('normalization and import edge cases remain bounded and explicit', () => {
  const defaultTitle = createWorkspace({ id: 'workspace.empty-title', title: '', now });
  assert.equal(defaultTitle.title, 'Research workspace');
  assert.equal(normalizeWorkspace(null, validIds, now), null);

  const sparse = normalizeWorkspace({
    id: 'workspace.sparse',
    title: '',
    bridge_cards: [null, { id: 'card.untitled' }],
    negative_results: [null],
  }, validIds, now);
  assert.equal(sparse.title, 'Research workspace');
  assert.equal(sparse.bridge_cards.length, 1);
  assert.equal(sparse.bridge_cards[0].title, 'Untitled bridge draft');
  assert.equal(sparse.negative_results.length, 0);

  assert.equal(normalizeWorkspaceLibrary(null, validIds, { now }).active_workspace_id, 'workspace.default');
  assert.equal(normalizeWorkspaceLibrary({
    schema_version: 1, active_workspace_id: '', workspaces: [],
  }, validIds, { now }).active_workspace_id, 'workspace.default');
  assert.equal(loadWorkspaceLibrary(memoryStorage(), validIds).workspaces.length, 1);
  assert.equal(validateWorkspaceFile({ size: 0 }), true);

  assert.throws(() => importWorkspaceLibrary(null, validIds, now), /must be text/);
  assert.throws(() => importWorkspaceLibrary(JSON.stringify({
    application: WORKSPACE_APPLICATION,
    schema_version: 1,
    library: { schema_version: 2, workspaces: [] },
  }), validIds, now), /library schema version/);
  assert.throws(() => importWorkspaceLibrary(JSON.stringify({
    application: WORKSPACE_APPLICATION,
    schema_version: 1,
    library: { schema_version: 1, workspaces: null },
  }), validIds, now), /workspaces must be an array/);
  assert.throws(() => importWorkspaceLibrary(JSON.stringify({
    application: WORKSPACE_APPLICATION,
    schema_version: 1,
    library: {
      schema_version: 1,
      workspaces: Array.from({ length: 51 }, (_, index) => ({ id: `workspace.${index}` })),
    },
  }), validIds, now), /too many workspaces/);

  assert.deepEqual(compareNodeSets(['node.a'], new Set(['node.a', 'node.d'])), {
    left_only: [], shared: ['node.a'], right_only: ['node.d'], union: ['node.a', 'node.d'],
  });
});
