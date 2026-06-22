import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createEmptyProgress,
  exportProgress,
  importProgress,
  loadProgress,
  MAX_IMPORT_BYTES,
  sanitizeProgress,
  saveProgress,
  STORAGE_KEY,
  validateProgressFile,
} from '../src/lib/storage.js';

class MemoryStorage {
  map = new Map();
  getItem(key) { return this.map.get(key) ?? null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

const ids = new Set(['arithmetic', 'vectors']);

test('sanitization drops unknown topics and statuses', () => {
  const progress = sanitizeProgress({
    statuses: { arithmetic: 'mastered', ghost: 'mastered', vectors: 'invalid' },
    favorites: ['vectors', 'ghost', 'vectors'],
    updatedAt: '2026-01-01T00:00:00Z',
  }, ids);
  assert.deepEqual(progress.statuses, { arithmetic: 'mastered' });
  assert.deepEqual(progress.favorites, ['vectors']);
});

test('save/load round trip works with a storage adapter', () => {
  const storage = new MemoryStorage();
  const progress = createEmptyProgress();
  progress.statuses.arithmetic = 'learning';
  saveProgress(progress, storage);
  assert.ok(storage.getItem(STORAGE_KEY));
  assert.equal(loadProgress(ids, storage).statuses.arithmetic, 'learning');
});

test('save remains usable when storage is blocked', () => {
  const blocked = { setItem() { throw new Error('blocked'); } };
  const progress = createEmptyProgress();
  progress.favorites = ['vectors'];
  assert.deepEqual(saveProgress(progress, blocked).favorites, ['vectors']);
});

test('export/import accepts wrapped and bare data', () => {
  const progress = createEmptyProgress();
  progress.favorites = ['vectors'];
  assert.deepEqual(importProgress(exportProgress(progress), ids).favorites, ['vectors']);
  assert.equal(importProgress(JSON.stringify(progress), ids).schemaVersion, 1);
});

test('oversized or non-JSON imports are rejected', () => {
  assert.throws(() => importProgress('x'.repeat(MAX_IMPORT_BYTES + 1), ids), /size limit/);
  assert.throws(() => validateProgressFile({ size: 12, type: 'text/plain', name: 'progress.txt' }), /JSON/);
  assert.throws(() => validateProgressFile({ size: Number.NaN, name: 'progress.json' }), /Invalid/);
  assert.throws(() => importProgress(/** @type {any} */ (null), ids), /text/);
  assert.throws(() => validateProgressFile({ size: MAX_IMPORT_BYTES + 1, type: 'application/json', name: 'progress.json' }), /size limit/);
  assert.equal(validateProgressFile({ size: 12, type: 'application/json', name: 'progress.json' }), true);
});

test('malformed storage falls back safely', () => {
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, '{bad');
  assert.equal(loadProgress(ids, storage).schemaVersion, 1);
});
