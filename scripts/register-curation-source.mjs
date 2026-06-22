import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { inspectSource, normalizeSourceId } from './lib/curation.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const [sourcePath, requestedId] = process.argv.slice(2);
if (!sourcePath) {
  throw new Error('Usage: node scripts/register-curation-source.mjs <source-path> [source-id]');
}
if (!existsSync(sourcePath)) throw new Error(`Source does not exist: ${sourcePath}`);

const bytes = readFileSync(sourcePath);
const extension = extname(sourcePath).toLowerCase();
const stem = normalizeSourceId(requestedId || basename(sourcePath, extension));
if (!stem) throw new Error('Could not derive a valid source id');
const source = inspectSource(sourcePath, bytes);

const record = {
  id: `curation.${stem}`,
  schema_version: '1.2.0',
  processed: new Date().toISOString().slice(0, 10),
  status: 'draft',
  review: { status: 'pending' },
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
