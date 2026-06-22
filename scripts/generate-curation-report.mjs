import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const check = process.argv.includes('--check');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const index = readJson('curation/index.json');
const records = index.records.map((path) => ({ path, ...readJson(path) }));

function anchorCount(record) {
  return [...record.promoted, ...record.quarantined].reduce((total, decision) =>
    total + (decision.source_ranges?.length ?? 0) + (decision.source_regions?.length ?? 0), 0);
}

function openQueue(record) {
  return record.verification_queue.filter((item) => !['verified', 'rejected'].includes(item.status));
}

const openRequests = records.reduce((sum, record) => sum + openQueue(record).length, 0);
const pendingReviews = records.filter((record) => record.review.status !== 'approved').length;
const lines = [
  '# Curation ledger report',
  '',
  'Generated deterministically from `curation/index.json` and the indexed records.',
  '',
  `- Records: **${records.length}**`,
  `- Promoted decisions: **${records.reduce((sum, record) => sum + record.promoted.length, 0)}**`,
  `- Quarantined decisions: **${records.reduce((sum, record) => sum + record.quarantined.length, 0)}**`,
  `- Open verification requests: **${openRequests}**`,
  `- Pending user reviews: **${pendingReviews}**`,
  '',
  '| Record | Source | Status | Review | Retention | Promoted | Quarantined | Anchors | Open verification |',
  '| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |',
];
for (const record of records) {
  lines.push(`| \`${record.id}\` | \`${record.source.filename}\` | ${record.status} | ${record.review.status} | ${record.retention} | ${record.promoted.length} | ${record.quarantined.length} | ${anchorCount(record)} | ${openQueue(record).length} |`);
}
lines.push('', '## Deletion gate', '');
for (const record of records) {
  const dispositioned = record.promoted.length + record.quarantined.length + record.discarded.length > 0;
  const unresolved = openQueue(record).length;
  let state = 'not ready';
  if (record.retention === 'retain-original') state = 'retain original by policy';
  else if (record.review.status !== 'approved') state = 'awaiting explicit user review';
  else if (!dispositioned) state = 'review approved, but no curation decisions are recorded';
  else if (unresolved) state = `review approved, but ${unresolved} source-verification request(s) remain open`;
  else state = 'deletion-safe by reviewed ledger state';
  lines.push(`- **${record.source.filename}:** ${state}. SHA-256 \`${record.source.sha256}\`.`);
}
lines.push('', '## Open verification queue', '');
const queued = records.flatMap((record) => openQueue(record).map((item) => ({ record: record.id, ...item })));
if (!queued.length) lines.push('No open source-verification requests.');
else for (const item of queued) lines.push(`- \`${item.record}/${item.id}\`: ${item.request} — ${item.reason}`);
lines.push('');

const output = `${lines.join('\n')}\n`;
const path = join(root, 'curation/REPORT.md');
if (check) {
  const current = readFileSync(path, 'utf8');
  if (current !== output) throw new Error('curation/REPORT.md is stale; run npm run curation:report');
  console.log('Validated generated curation report.');
} else {
  writeFileSync(path, output);
  console.log('Wrote curation/REPORT.md');
}
