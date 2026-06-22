import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [sourcePath, requestedId] = process.argv.slice(2);
if (!sourcePath) {
  throw new Error('Usage: node scripts/register-curation-source.mjs <source-path> [source-id]');
}
if (!existsSync(sourcePath)) throw new Error(`Source does not exist: ${sourcePath}`);

const bytes = readFileSync(sourcePath);
const extension = extname(sourcePath).toLowerCase();
const stem = (requestedId || basename(sourcePath, extension))
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');
if (!stem) throw new Error('Could not derive a valid source id');

const mediaTypes = new Map([
  ['.txt', 'text/plain'],
  ['.md', 'text/markdown'],
  ['.png', 'image/png'],
]);
const mediaType = mediaTypes.get(extension) || 'application/octet-stream';
const source = {
  filename: basename(sourcePath),
  media_type: mediaType,
  sha256: createHash('sha256').update(bytes).digest('hex'),
  bytes: bytes.length,
};

if (mediaType.startsWith('text/')) {
  const text = bytes.toString('utf8');
  source.lines = text.length === 0 ? 1 : text.split(/\r?\n/).length;
}
if (mediaType === 'image/png') {
  const signature = bytes.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a' || bytes.length < 24) throw new Error('Invalid PNG header');
  source.width = bytes.readUInt32BE(16);
  source.height = bytes.readUInt32BE(20);
}

const record = {
  id: `curation.${stem}`,
  schema_version: '1.0.0',
  processed: new Date().toISOString().slice(0, 10),
  status: 'draft',
  source,
  retention: 'retain-original',
  summary: 'Draft record. Decompose the source into atomic promoted, quarantined and discarded decisions.',
  promoted: [],
  quarantined: [],
  discarded: [],
  verification_queue: [],
};

const recordsDir = join(root, 'curation/records');
mkdirSync(recordsDir, { recursive: true });
const output = join(recordsDir, `${stem.replaceAll('_', '-')}.json`);
if (existsSync(output)) throw new Error(`Record already exists: ${output}`);
writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`);
console.log(`Created draft curation record: ${output}`);
console.log('The source file was not copied. Add the new path to curation/index.json after review.');
