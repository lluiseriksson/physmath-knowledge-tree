import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  compareSourceMetadata,
  inspectPng,
  inspectSource,
  normalizeSourceId,
} from '../scripts/lib/curation.mjs';

test('curation source IDs are stable and filesystem-safe', () => {
  assert.equal(normalizeSourceId('Ideas 3 (8).TXT'), 'ideas_3_8_txt');
  assert.equal(normalizeSourceId('  Física / Matemática  '), 'f_sica_matem_tica');
});
test('text source inspection records hash, bytes and lines', () => {
  const metadata = inspectSource('/tmp/notes.txt', Buffer.from('one\ntwo\n', 'utf8'));
  assert.equal(metadata.media_type, 'text/plain');
  assert.equal(metadata.bytes, 8);
  assert.equal(metadata.lines, 2);
  assert.match(metadata.sha256, /^[a-f0-9]{64}$/);
});

test('PNG source inspection records trustworthy dimensions', () => {
  const bytes = readFileSync(new URL('../assets/icons/icon-192.png', import.meta.url));
  const metadata = inspectSource('/tmp/diagram.png', bytes);
  assert.equal(metadata.media_type, 'image/png');
  assert.equal(metadata.width, 192);
  assert.equal(metadata.height, 192);
  assert.deepEqual(inspectPng(bytes), { width: 192, height: 192 });
});

test('invalid PNGs and unsupported source formats are rejected', () => {
  assert.throws(() => inspectPng(Buffer.from('not a png')), /Invalid PNG/);
  const fakePng = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(fakePng);
  assert.throws(() => inspectPng(fakePng), /IHDR/);
  assert.throws(() => inspectSource('/tmp/source.pdf', Buffer.from('pdf')), /Unsupported/);
  assert.throws(() => inspectSource('/tmp/source.txt', Buffer.from([0xc3, 0x28])), /UTF-8/);
});

test('source metadata comparison reports only changed fields', () => {
  const expected = { media_type: 'text/plain', sha256: 'a', bytes: 3, lines: 2 };
  const actual = { media_type: 'text/plain', sha256: 'b', bytes: 3, lines: 2 };
  assert.deepEqual(compareSourceMetadata(expected, actual), ['sha256: expected a, got b']);
});

test('PNG dimensions and text line accounting reject or count boundary cases', () => {
  const png = readFileSync(new URL('../assets/icons/icon-192.png', import.meta.url));
  const zeroWidth = Buffer.from(png);
  zeroWidth.writeUInt32BE(0, 16);
  assert.throws(() => inspectPng(zeroWidth), /positive/);

  const zeroHeight = Buffer.from(png);
  zeroHeight.writeUInt32BE(0, 20);
  assert.throws(() => inspectPng(zeroHeight), /positive/);

  assert.equal(inspectSource('empty.txt', Buffer.from('')).lines, 1);
  assert.equal(inspectSource('single.txt', Buffer.from('one line')).lines, 1);
  assert.equal(inspectSource('trailing.md', Buffer.from('one\n')).lines, 1);
  assert.equal(inspectSource('two.md', Buffer.from('one\ntwo')).lines, 2);
  assert.throws(() => inspectSource('source', Buffer.from('x')), /\(none\)/);
});
