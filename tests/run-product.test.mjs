import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../runs.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/run-ledger-app.js', import.meta.url), 'utf8');
const cli = readFileSync(new URL('../scripts/record-research-run.mjs', import.meta.url), 'utf8');

test('run ledger page is local-only, CSP-bound and accessible by structure', () => {
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /<main\b[^>]*id="run-center"/u);
  assert.match(html, /class="skip-link"/u);
  assert.match(html, /id="search"[^>]*aria-label="Search runs"/u);
  assert.match(html, /id="run-form"/u);
  assert.match(html, /id="export-packet"/u);
  assert.doesNotMatch(html, /<script[^>]+https?:/iu);
  assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"[^>]+https?:/iu);
  assert.doesNotMatch(html, /\sstyle=/iu);
});

test('browser surface never executes commands or mutates canonical graph data', () => {
  assert.doesNotMatch(app, /child_process|\bspawn\s*\(|\bexec\s*\(/u);
  assert.doesNotMatch(app, /innerHTML/u);
  assert.match(app, /loadJson\('\.\/graph\/nodes\/core\.json'\)/u);
  assert.match(app, /localStorage\.setItem\(STORAGE_KEY/u);
  assert.doesNotMatch(app, /fetch\([^)]*method\s*:/u);
});

test('CLI executes argument vectors without a shell and rejects sensitive environment names', () => {
  assert.match(cli, /shell:\s*false/u);
  assert.match(cli, /Sensitive environment key cannot be recorded/u);
  assert.match(cli, /traverses a symbolic link/u);
  assert.match(cli, /timeout-ms must be an integer/u);
  assert.match(cli, /Run manifest written/u);
});
