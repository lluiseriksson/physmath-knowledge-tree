import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { validateImmutableEvidence } from '../scripts/immutable-evidence.mjs';

const path = 'integrations/research-radar/evidence/example/report.json';
const bytes = Buffer.from('{\r\n  "unscored": true\r\n}\r\n');
const sha256 = createHash('sha256').update(bytes).digest('hex');

test('immutable evidence preserves the original CRLF bytes', () => {
  assert.equal(validateImmutableEvidence([{ path, sha256 }], () => bytes).get(path), sha256);
});

test('normalizing a pinned report is an integrity failure', () => {
  assert.throws(() => validateImmutableEvidence([{ path, sha256 }],
    () => Buffer.from(bytes.toString().replaceAll('\r\n', '\n'))), /hash mismatch/);
});

test('format exception cannot escape evidence or accept duplicate receipts', () => {
  assert.throws(() => validateImmutableEvidence([{ path: '../report.json', sha256 }], () => bytes), /Invalid/);
  assert.throws(() => validateImmutableEvidence([{ path, sha256 }, { path, sha256 }], () => bytes), /Invalid/);
});

test('a matching digest cannot exempt malformed JSON', () => {
  const invalid = Buffer.from('not JSON');
  const digest = createHash('sha256').update(invalid).digest('hex');
  assert.throws(() => validateImmutableEvidence([{ path, sha256: digest }], () => invalid), SyntaxError);
});

test('a matching digest cannot exempt invalid UTF-8 inside a JSON string', () => {
  const invalid = Buffer.concat([Buffer.from('{"value":"'), Buffer.from([0xff]), Buffer.from('"}')]);
  const digest = createHash('sha256').update(invalid).digest('hex');
  assert.throws(() => validateImmutableEvidence([{ path, sha256: digest }], () => invalid), TypeError);
});
