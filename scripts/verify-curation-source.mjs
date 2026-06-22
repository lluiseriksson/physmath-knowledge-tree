import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compareSourceMetadata, inspectSource } from './lib/curation.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
if (args.length < 1 || args.length > 2) {
  throw new Error('Usage: node scripts/verify-curation-source.mjs [record-id-or-path] <source-path>');
}

const [recordSelector, sourcePath] = args.length === 2 ? args : [null, args[0]];
if (!existsSync(sourcePath)) throw new Error(`Source does not exist: ${sourcePath}`);

const actual = inspectSource(sourcePath, readFileSync(sourcePath));
const index = JSON.parse(readFileSync(join(root, 'curation/index.json'), 'utf8'));
const records = index.records.map((recordPath) => ({
  recordPath,
  record: JSON.parse(readFileSync(join(root, recordPath), 'utf8')),
}));

let selected;
if (recordSelector) {
  selected = records.find(({ recordPath, record }) => recordPath === recordSelector || record.id === recordSelector);
} else {
  const hashMatches = records.filter(({ record }) => record.source.sha256 === actual.sha256);
  if (hashMatches.length > 1) throw new Error(`Multiple curation records match SHA-256 ${actual.sha256}`);
  selected = hashMatches[0] ?? records.find(({ record }) => record.source.filename === actual.filename);
}

if (!selected) {
  throw new Error(recordSelector
    ? `Curation record not found: ${recordSelector}`
    : `No curation record matches ${actual.filename} (${actual.sha256})`);
}

const differences = compareSourceMetadata(selected.record.source, actual);
if (differences.length) {
  throw new Error(`Source verification failed for ${selected.record.id}:\n${differences.join('\n')}`);
}
console.log(`Verified source against ${selected.record.id}: ${actual.sha256}`);
