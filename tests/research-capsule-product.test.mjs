import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('research capsule page is CSP-safe, local-first and accessible', () => {
  const html = read('capsules.html');
  assert.match(html, /Content-Security-Policy/);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/i);
  assert.doesNotMatch(html, /\sstyle=["']/i);
  assert.match(html, /id="capsule-center"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /id="dossier-file"[^>]*aria-label=/);
  assert.match(html, /id="run-file"[^>]*aria-label=/);
  assert.match(html, /id="capsule-file"[^>]*aria-label=/);
  assert.match(html, /src="\.\/src\/capsule-app\.js"/);
  const app = read('src/capsule-app.js');
  assert.match(app, /Ignoring invalid local run ledger/);
  assert.match(app, /embeddedLedger/);
  assert.match(app, /JSON-compatible media type/);
});

test('capsule product exposes deterministic build, verify and boundary documentation', () => {
  const model = read('src/lib/research-capsule.js');
  const build = read('scripts/build-research-capsule.mjs');
  const verify = read('scripts/verify-research-capsule.mjs');
  const docs = read('docs/RESEARCH_CAPSULE_CENTER.md');
  assert.match(model, /RESEARCH_CAPSULE_KIND = 'reproducible-research-capsule'/);
  assert.match(model, /content_fingerprint/);
  assert.match(build, /--dossier-file/);
  assert.match(build, /--run-file/);
  assert.match(verify, /Artifact SHA-256 mismatch/);
  assert.match(verify, /symbolic link/);
  assert.match(docs, /not a proof/i);
  assert.match(docs, /capsule:verify/);
});
