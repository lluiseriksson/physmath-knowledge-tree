import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const base = 'integrations/yang-mills/';
const decls = read(base + 'data/declarations.json').declarations;
const frontier = read(base + 'data/hypothesis-frontier.json').obligations;
const roadmap = read(base + 'data/commit-roadmap.json').commits;
const scenarios = read(base + 'evaluation/scenarios.json');

test('next theorem is the raw Hsharp geometric M3 adapter', () => {
  const next = roadmap.find(x => x.status === 'next');
  assert.equal(next.declarations[0], 'decl.planned-raw-hsharp-geometric-m3');
  assert.match(next.title, /geometric M3/);
});

test('verified and planned declarations cannot be confused', () => {
  assert.ok(decls.some(x => x.name.endsWith('singleScaleUVDecay_of_cmp116RawSource_hsharp') && x.status === 'verified'));
  assert.ok(decls.some(x => x.name.endsWith('lattice_mass_gap_of_cmp116RawSource_hsharp_geometric') && x.status === 'planned'));
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
