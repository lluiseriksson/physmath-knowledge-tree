import { createHash } from 'node:crypto';

export function validateImmutableEvidence(records, readBytes) {
  const allowed = new Map();
  for (const record of records) {
    if (!/^integrations\/research-radar\/evidence\/[a-zA-Z0-9_./-]+\.json$/.test(record.path)
      || record.path.split('/').includes('..') || allowed.has(record.path)
      || !/^[a-f0-9]{64}$/.test(record.sha256)) {
      throw new Error('Invalid immutable-evidence receipt');
    }
    const bytes = readBytes(record.path);
    if (createHash('sha256').update(bytes).digest('hex') !== record.sha256) {
      throw new Error(`Immutable-evidence hash mismatch: ${record.path}`);
    }
    JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    allowed.set(record.path, record.sha256);
  }
  return allowed;
}
