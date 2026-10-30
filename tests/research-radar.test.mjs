import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { searchResearchRadar, validateResearchRadar } from '../scripts/lib/research-radar.mjs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const registry = read('../integrations/research-radar/registry.json');
const catalogue = read('../integrations/research-radar/catalogue/openai-math-2026-10-26.json');
const inventory = read('../integrations/research-radar/repository-inventory.json');
const nodes = read('../graph/nodes/core.json').map((node) => node.id);

test('radar snapshots reconcile source scopes, graph anchors and catalogue counts', () => {
  assert.deepEqual(validateResearchRadar(registry, catalogue, inventory, nodes), {
    sources: 96, candidates: 18, families: 373, manuscripts: 721, repositories: 29,
  });
  assert.equal(catalogue.withdrawal_notices.titles.length, 3);
});

test('radar rejects unreviewed scores, broken provenance and evidence promotion', () => {
  const scored = structuredClone(registry);
  scored.candidates[0].paper_score = 8;
  assert.throws(() => validateResearchRadar(scored, catalogue, inventory, nodes), /paper score/);
  const dangling = structuredClone(registry);
  dangling.candidates[0].source_ids.push('missing-source');
  assert.throws(() => validateResearchRadar(dangling, catalogue, inventory, nodes), /unresolved source/);
  const promoted = structuredClone(registry);
  promoted.source_cards[0].evidence = 'formal';
  assert.throws(() => validateResearchRadar(promoted, catalogue, inventory, nodes), /cannot certify a proof/);
});

test('radar rejects unpinned metadata and private repository exposure', () => {
  const unpinned = structuredClone(catalogue);
  unpinned.records[0].manuscripts[0].url = 'https://github.com/openai/math/blob/main/preprints/paper.pdf';
  assert.throws(() => validateResearchRadar(registry, unpinned, inventory, nodes), /Unpinned/);
  const privateInventory = structuredClone(inventory);
  privateInventory.repositories[0].visibility = 'private';
  assert.throws(() => validateResearchRadar(registry, catalogue, privateInventory, nodes), /private repository/);
});

test('search returns catalogue scope and keeps unreproduced claims unverified', () => {
  const results = searchResearchRadar(registry, catalogue, 'hyperbolicity');
  assert.ok(results.length >= 2);
  const manuscripts = results.filter((item) => item.family);
  assert.ok(manuscripts.length >= 2);
  assert.ok(manuscripts.every((item) => item.reading_status === 'catalogued' && item.validity === 'not_audited'));
  const sourceCards = results.filter((item) => !item.family);
  assert.ok(sourceCards.some((item) => item.reading_status === 'selected_sections_read'));
  assert.deepEqual(searchResearchRadar(registry, catalogue, '  '), []);
});


test('new frontier snapshot preserves historical catalogue and unaudited status', () => {
  const previous = read('../integrations/research-radar/catalogue/openai-math-2026-10-24.json');
  assert.equal(previous.reported_manuscripts, 719);
  const paths = (snapshot) => snapshot.records.flatMap((family) => family.manuscripts)
    .map((paper) => paper.url.split('/preprints/')[1]);
  const repair = (path) => path === 'Sharp-integral-fillings-in-CAT(0'
    ? 'Sharp-integral-fillings-in-CAT(0)-spaces-September-23-2026/paper.pdf' : path;
  const oldPaths = new Set(paths(previous).map(repair));
  const currentPaths = new Set(paths(catalogue));
  assert.ok([...oldPaths].every((path) => currentPaths.has(path)));
  assert.equal([...currentPaths].filter((path) => !oldPaths.has(path)).length, 2);
  assert.ok(catalogue.records.some((family) => family.family === '378'));
  assert.ok(catalogue.records.flatMap((family) => family.manuscripts)
    .every((paper) => paper.validity === 'not_audited'));
});
