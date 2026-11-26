import assert from 'node:assert/strict';
import test from 'node:test';
import { pickFirstVisit } from '../src/lib/first-visit.js';

test('first visit: English when in doubt', () => {
  assert.equal(pickFirstVisit(['es-ES', 'en'], 'Europe/Madrid'), 'es');
  assert.equal(pickFirstVisit(['es-ES', 'en'], 'Europe/Stockholm'), 'en');
  assert.equal(pickFirstVisit(['en-US', 'es'], 'Europe/Madrid'), 'en');
  assert.equal(pickFirstVisit([], 'Europe/Madrid'), 'en');
});
