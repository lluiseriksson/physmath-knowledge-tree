import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeProgress } from '../src/lib/storage.js';

const ids = new Set(['a', 'b', 'c']);
const current = {
  schemaVersion: 1,
  statuses: { a: 'mastered', b: 'learning' },
  favorites: ['a'],
  updatedAt: '2026-06-20T00:00:00.000Z',
};
const incoming = {
  schemaVersion: 1,
  statuses: { a: 'learning', b: 'mastered', c: 'learning', ghost: 'mastered' },
  favorites: ['b', 'ghost'],
  updatedAt: '2026-06-23T00:00:00.000Z',
};

test('default progress merge keeps furthest state and unions valid favorites', () => {
  const merged = mergeProgress(current, incoming, ids);
  assert.deepEqual(merged.statuses, { a: 'mastered', b: 'mastered', c: 'learning' });
  assert.deepEqual(merged.favorites, ['a', 'b']);
  assert.equal(merged.updatedAt, incoming.updatedAt);
});

test('explicit incoming and current policies are supported', () => {
  const imported = mergeProgress(current, incoming, ids, { statusPolicy: 'incoming', favoritePolicy: 'incoming' });
  assert.deepEqual(imported.statuses, { a: 'learning', b: 'mastered', c: 'learning' });
  assert.deepEqual(imported.favorites, ['b']);

  const local = mergeProgress(current, incoming, ids, { statusPolicy: 'current', favoritePolicy: 'current' });
  assert.deepEqual(local.statuses, { a: 'mastered', b: 'learning' });
  assert.deepEqual(local.favorites, ['a']);
});

test('merge sanitizes malformed inputs and validates policy names', () => {
  const merged = mergeProgress(null, { statuses: {}, favorites: [], updatedAt: 'bad' }, ids);
  assert.deepEqual(merged.statuses, {});
  assert.deepEqual(merged.favorites, []);
  assert.ok(Number.isFinite(Date.parse(merged.updatedAt)));
  assert.throws(() => mergeProgress(current, incoming, ids, { statusPolicy: /** @type {any} */ ('bad') }), /status merge policy/);
  assert.throws(() => mergeProgress(current, incoming, ids, { favoritePolicy: /** @type {any} */ ('bad') }), /favorite merge policy/);
});
