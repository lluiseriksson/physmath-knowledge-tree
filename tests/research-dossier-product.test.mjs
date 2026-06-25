import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../dossiers.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/dossier-app.js', import.meta.url), 'utf8');
const model = readFileSync(new URL('../src/lib/research-dossier.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/dossier.css', import.meta.url), 'utf8');
const smoke = readFileSync(new URL('../scripts/browser-smoke-dossiers.mjs', import.meta.url), 'utf8');
const cli = readFileSync(new URL('../scripts/build-research-dossier.mjs', import.meta.url), 'utf8');
const docs = readFileSync(new URL('../docs/RESEARCH_DOSSIER_CENTER.md', import.meta.url), 'utf8');

test('dossier page is CSP-safe, accessible and exposes the complete integrated handoff', () => {
  assert.match(html, /http-equiv="Content-Security-Policy"/u);
  assert.match(html, /class="skip-link" href="#dossier-center"/u);
  assert.match(html, /<main id="dossier-center"/u);
  assert.match(html, /id="workspace"/u);
  assert.match(html, /id="gate-grid"/u);
  assert.match(html, /id="action-list"/u);
  assert.match(html, /id="export-json"/u);
  assert.match(html, /id="export-markdown"/u);
  assert.match(html, /id="copy-fingerprint"/u);
  assert.match(html, /src="\.\/src\/dossier-app\.js"/u);
  assert.match(html, /href="\.\/src\/dossier\.css"/u);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/iu);
  assert.doesNotMatch(html, /<style\b|\sstyle=/iu);
});

test('integrated app reads the four source ledgers and never writes their storage keys', () => {
  assert.match(app, /loadWorkspaceLibrary/u);
  assert.match(app, /loadReviewLedger/u);
  assert.match(app, /loadChangeReviewState/u);
  assert.match(app, /loadLeanAuditLedger/u);
  assert.match(app, /buildResearchDossier/u);
  assert.doesNotMatch(app, /saveWorkspaceLibrary|saveReviewLedger|saveChangeReviewState|saveLeanAuditLedger/u);
  assert.match(app, /content_fingerprint/u);
  assert.match(app, /researchDossierMarkdown/u);
});

test('model keeps readiness separate from canonical truth and fingerprints the complete scoped content', () => {
  assert.match(model, /It does not promote graph confidence/u);
  assert.match(model, /content_fingerprint/u);
  assert.match(model, /canonicalStringify\(fingerprintCore/u);
  assert.match(model, /fingerprint mismatch/u);
  assert.match(model, /source-bearing references/u);
  assert.match(model, /import\/declaration candidates/u);
  assert.match(model, /high\/critical/u);
});

test('responsive styles and focused Chromium smoke include reliability hardening', () => {
  assert.match(css, /@media \(max-width: 1360px\)/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(css, /\.overall-status\.blocked/u);
  assert.match(smoke, /for \(let attempt = 0; attempt < 60/u);
  assert.match(smoke, /Could not remove temporary Chromium profile/u);
  assert.match(smoke, /Research Dossier Center Chromium smoke passed/u);
});

test('CLI documents the robust npm separator and remains read-only', () => {
  assert.match(cli, /npm run dossier:build -- -- --workspace-file/u);
  assert.match(cli, /never\\nchanges graph data/u);
  assert.match(cli, /--generated-at/u);
  assert.match(cli, /SHA-256 content fingerprint/u);
});

test('documentation states gate semantics, fingerprint scope and non-promotion boundary', () => {
  assert.match(docs, /six bounded gates/u);
  assert.match(docs, /same content generates the same fingerprint/u);
  assert.match(docs, /never writes them/u);
  assert.match(docs, /promote a graph confidence level/u);
  assert.match(docs, /npm run dossier:build -- -- --workspace-file/u);
});
