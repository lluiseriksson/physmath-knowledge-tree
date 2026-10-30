import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const base = 'integrations/yang-mills/';
const decls = read(base + 'data/declarations.json').declarations;
const frontier = read(base + 'data/hypothesis-frontier.json').obligations;
const roadmap = read(base + 'data/commit-roadmap.json').commits;
const scenarios = read(base + 'evaluation/scenarios.json');

test('next move audits a physical obligation without duplicating existing adapters', () => {
  const next = roadmap.find(x => x.status === 'next');
  assert.deepEqual(next.declarations, []);
  assert.match(next.conclusion, /physical remainder identity or uniform estimate/);
  for (const id of next.consumes) assert.equal(decls.find(d => d.id === id).status, 'verified');
});

test('verified and planned declarations cannot be confused', () => {
  assert.ok(decls.some(x => x.name.endsWith('singleScaleUVDecay_of_cmp116RawSource_hsharp') && x.status === 'verified'));
  assert.ok(decls.some(x => x.name.endsWith('lattice_mass_gap_of_cmp116RawSource_hsharp_geometric') && x.status === 'historical-unreconciled' && !x.verified_at));
  const state = read(base + 'data/repository-state.json');
  const record = read(base + 'data/verification-2026-10-30.json');
  assert.equal(record.current_ci.head, state.snapshot.head);
  for (const source of record.declarations) {
    const declaration = decls.find(x => x.name === source.name);
    assert.equal(declaration.verified_at, record.current_ci.head);
    assert.equal(declaration.source_blob, source.blob);
    assert.match(declaration.verification_mode, /no independent local replay/);
  }
});

test('support roles are explicitly separated', () => {
  const o = frontier.find(x => x.id === 'obl.support-localization');
  assert.deepEqual(o.support_roles, ['spectator','fluctuation','physical-active','Omega','skeleton','full-target']);
});

test('uniform constants have the correct quantifier order', () => {
  const o = frontier.find(x => x.id === 'obl.uniform-constants');
  assert.match(o.lean_shape, /^exists constants, forall/);
});

test('evaluation suite is exactly 100 points', () => {
  assert.equal(scenarios.scenarios.reduce((n, x) => n + x.score, 0), 100);
  assert.equal(scenarios.passing_score, 100);
});
