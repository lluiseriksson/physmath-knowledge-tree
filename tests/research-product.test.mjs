import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('research UI exposes evidence-aware route controls and canonical JSON-LD export', () => {
  const html = read('index.html');
  const app = read('src/research-app.js');
  for (const id of ['path-policy', 'path-evidence', 'export-jsonld']) {
    assert.match(html, new RegExp(`id="${id}"`, 'u'));
  }
  for (const key of [
    'path.policy.shortest', 'path.policy.balanced', 'path.policy.strongest',
    'path.evidence.all', 'path.evidence.sourced', 'path.evidence.formal', 'export.jsonld',
  ]) {
    assert.match(html, new RegExp(`data-i18n="${key.replaceAll('.', '\\.') }"`, 'u'));
  }
  assert.match(app, /planResearchRoute\(/u);
  assert.match(app, /summarizeRouteEvidence\(/u);
  assert.match(app, /buildJsonLd\(/u);
  assert.doesNotMatch(app, /shortestPath\(/u);
});

test('application metadata and offline module closure include new research capabilities', () => {
  const pkg = JSON.parse(read('package.json'));
  const index = JSON.parse(read('graph/index.json'));
  const serviceWorker = read('sw.js');
  assert.equal(index.application_version, pkg.version);
  assert.equal(pkg.scripts['route:plan'], 'node scripts/plan-route.mjs');
  assert.equal(pkg.scripts['export:jsonld'], 'node scripts/export-jsonld.mjs');
  assert.match(serviceWorker, /\.\/src\/lib\/route-planner\.js/u);
  assert.match(serviceWorker, /\.\/src\/lib\/jsonld\.js/u);
});
