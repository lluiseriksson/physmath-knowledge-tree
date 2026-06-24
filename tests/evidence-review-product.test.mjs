import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../evidence.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/evidence-app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/evidence.css', import.meta.url), 'utf8');

function ids(source) {
  return [...source.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]);
}

test('evidence review page is CSP-safe, accessible and local-first', () => {
  assert.match(html, /http-equiv="Content-Security-Policy"/u);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/iu);
  assert.doesNotMatch(html, /<style\b|\sstyle="/iu);
  assert.match(html, /<main id="evidence-center"/u);
  assert.match(html, /class="skip-link"/u);
  assert.match(html, /id="search"[^>]*aria-label="Search references"/u);
  assert.match(html, /id="review-dialog"/u);
  assert.match(html, /id="ledger-file"[^>]*accept="application\/json,\.json"/u);
  assert.equal(new Set(ids(html)).size, ids(html).length);
});

test('evidence product reads canonical files without remote runtime services', () => {
  assert.match(app, /\.\/graph\/reference-registry\.json/u);
  assert.match(app, /\.\/graph\/nodes\/core\.json/u);
  assert.match(app, /\.\/graph\/edges\.json/u);
  assert.match(app, /loadReviewLedger/u);
  assert.match(app, /buildReviewPacket/u);
  assert.match(app, /mergeReviewLedgers/u);
  assert.doesNotMatch(app, /innerHTML|insertAdjacentHTML|eval\(/u);
  assert.doesNotMatch(app, /https?:\/\//u);
});

test('evidence product is bilingual, responsive and reduced-motion aware', () => {
  assert.match(app, /const STRINGS = \{/u);
  assert.match(app, /\ben: \{/u);
  assert.match(app, /\bes: \{/u);
  assert.match(app, /Revisión de evidencia/u);
  assert.match(css, /@media \(max-width: 720px\)/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(css, /html\[data-theme="dark"\]/u);
});
