import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../changes.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/change-review-app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/change-review.css', import.meta.url), 'utf8');
const docs = readFileSync(new URL('../docs/CANONICAL_CHANGE_REVIEW.md', import.meta.url), 'utf8');

function ids(source) {
  return [...source.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]);
}

test('canonical change review page is CSP-safe, accessible and local-first', () => {
  assert.match(html, /http-equiv="Content-Security-Policy"/u);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/iu);
  assert.doesNotMatch(html, /<style\b|\sstyle="/iu);
  assert.match(html, /<main id="change-center"/u);
  assert.match(html, /class="skip-link"/u);
  assert.match(html, /id="search"[^>]*aria-label="Search canonical changes"/u);
  assert.match(html, /id="decision-dialog"/u);
  assert.match(html, /id="baseline-file"[^>]*accept="application\/json,\.json"/u);
  assert.equal(new Set(ids(html)).size, ids(html).length);
});

test('change reviewer reads canonical files and never invokes remote mutation services', () => {
  for (const path of [
    './graph/index.json', './graph/nodes/core.json', './graph/edges.json',
    './graph/research_moves.json', './graph/collections.json',
  ]) assert.match(app, new RegExp(path.replaceAll('.', '\\.')));
  assert.match(app, /createGraphSnapshot/u);
  assert.match(app, /diffGraphSnapshots/u);
  assert.match(app, /buildChangeReviewBundle/u);
  assert.match(app, /loadChangeReviewState/u);
  assert.doesNotMatch(app, /innerHTML|insertAdjacentHTML|eval\(/u);
  assert.doesNotMatch(app, /https?:\/\//u);
  assert.doesNotMatch(app, /fetch\([^)]*method\s*:/u);
});

test('change reviewer is bilingual, responsive and explicit about its boundary', () => {
  assert.match(app, /const STRINGS = \{/u);
  assert.match(app, /\ben: \{/u);
  assert.match(app, /\bes: \{/u);
  assert.match(app, /Revisión de cambios canónicos/u);
  assert.match(css, /@media \(max-width: 720px\)/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(css, /html\[data-theme="dark"\]/u);
  assert.match(docs, /never writes `graph\/\*\.json`/u);
  assert.match(docs, /risk flag is a governance signal, not a scientific verdict/u);
});
