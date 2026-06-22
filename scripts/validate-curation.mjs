import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const fail = (message) => { throw new Error(message); };
const ensure = (condition, message) => { if (!condition) fail(message); };

const index = readJson('curation/index.json');
ensure(index.schema_version === '1.0.0', 'Unsupported curation schema version');
ensure(Array.isArray(index.records) && index.records.length > 0, 'curation/index.json needs records');
ensure(new Set(index.records).size === index.records.length, 'Duplicate curation record paths');
ensure(existsSync(join(root, 'curation/record.schema.json')), 'Missing curation record schema');
readJson('curation/record.schema.json');

const nodes = readJson('graph/nodes/core.json');
const edges = readJson('graph/edges.json');
const moves = readJson('graph/research_moves.json');
const nodeIds = new Set(nodes.map((item) => item.id));
const edgeIds = new Set(edges.map((item) => item.id));
const moveIds = new Set(moves.map((item) => item.id));
const recordIds = new Set();
const sourceHashes = new Set();
const statuses = new Set(['draft', 'curated', 'reviewed']);
const retentionValues = new Set(['retain-original', 'delete-after-user-review', 'deleted-after-review']);
const classifications = new Set(['formal', 'literature', 'heuristic', 'speculative']);
const destinationTypes = new Set(['graph_node', 'graph_edge', 'research_move', 'document']);

function validateRange(range, recordId, totalLines) {
  ensure(Number.isInteger(range.start_line) && range.start_line >= 1, `${recordId}: invalid start_line`);
  ensure(Number.isInteger(range.end_line) && range.end_line >= range.start_line, `${recordId}: invalid end_line`);
  if (totalLines) ensure(range.end_line <= totalLines, `${recordId}: source range exceeds line count`);
}

function validateDestination(destination, recordId) {
  ensure(destinationTypes.has(destination.type), `${recordId}: invalid destination type`);
  ensure(typeof destination.value === 'string' && destination.value.length > 1, `${recordId}: invalid destination value`);
  if (destination.type === 'graph_node') ensure(nodeIds.has(destination.value), `${recordId}: missing graph node ${destination.value}`);
  if (destination.type === 'graph_edge') ensure(edgeIds.has(destination.value), `${recordId}: missing graph edge ${destination.value}`);
  if (destination.type === 'research_move') ensure(moveIds.has(destination.value), `${recordId}: missing research move ${destination.value}`);
  if (destination.type === 'document') ensure(existsSync(join(root, destination.value)), `${recordId}: missing document ${destination.value}`);
}

function validateDecision(decision, recordId, totalLines, bucket) {
  ensure(/^[a-z0-9_\.]+$/.test(decision.id), `${recordId}: invalid decision id ${decision.id}`);
  ensure(typeof decision.title === 'string' && decision.title.length >= 3, `${recordId}: decision title required`);
  ensure(classifications.has(decision.classification), `${recordId}: invalid classification`);
  if (bucket === 'quarantined') ensure(['heuristic', 'speculative'].includes(decision.classification), `${recordId}: quarantine item must be heuristic or speculative`);
  ensure(typeof decision.rationale === 'string' && decision.rationale.length >= 12, `${recordId}: rationale required`);
  ensure(Array.isArray(decision.source_ranges) && decision.source_ranges.length > 0, `${recordId}: source ranges required`);
  for (const range of decision.source_ranges) validateRange(range, recordId, totalLines);
  ensure(Array.isArray(decision.destinations), `${recordId}: destinations must be an array`);
  for (const destination of decision.destinations) validateDestination(destination, recordId);
}

for (const path of index.records) {
  ensure(/^curation\/records\/[a-z0-9_-]+\.json$/.test(path), `Invalid curation record path: ${path}`);
  ensure(existsSync(join(root, path)), `Missing curation record: ${path}`);
  const record = readJson(path);
  ensure(/^curation\.[a-z0-9_]+$/.test(record.id), `${path}: invalid record id`);
  ensure(!recordIds.has(record.id), `${path}: duplicate record id`);
  ensure(record.schema_version === '1.0.0', `${record.id}: unsupported schema version`);
  ensure(/^\d{4}-\d{2}-\d{2}$/.test(record.processed), `${record.id}: invalid processed date`);
  ensure(statuses.has(record.status), `${record.id}: invalid status`);
  ensure(retentionValues.has(record.retention), `${record.id}: invalid retention`);
  ensure(record.source && typeof record.source.filename === 'string', `${record.id}: source metadata required`);
  ensure(/^[a-f0-9]{64}$/.test(record.source.sha256), `${record.id}: invalid SHA-256`);
  ensure(!sourceHashes.has(record.source.sha256), `${record.id}: duplicate source hash`);
  ensure(Number.isInteger(record.source.bytes) && record.source.bytes >= 0, `${record.id}: invalid byte count`);
  ensure(typeof record.summary === 'string' && record.summary.length >= 20, `${record.id}: summary required`);
  ensure(Array.isArray(record.promoted), `${record.id}: promoted array required`);
  ensure(Array.isArray(record.quarantined), `${record.id}: quarantined array required`);
  ensure(Array.isArray(record.discarded), `${record.id}: discarded array required`);
  ensure(Array.isArray(record.verification_queue), `${record.id}: verification_queue required`);
  for (const decision of record.promoted) validateDecision(decision, record.id, record.source.lines, 'promoted');
  for (const decision of record.quarantined) validateDecision(decision, record.id, record.source.lines, 'quarantined');
  for (const item of record.discarded) {
    ensure(typeof item.category === 'string' && item.category.length >= 3, `${record.id}: discarded category required`);
    ensure(typeof item.reason === 'string' && item.reason.length >= 12, `${record.id}: discarded reason required`);
  }
  for (const item of record.verification_queue) {
    ensure(/^[a-z0-9_\.]+$/.test(item.id), `${record.id}: invalid verification id`);
    ensure(typeof item.request === 'string' && item.request.length >= 12, `${record.id}: verification request required`);
    ensure(typeof item.reason === 'string' && item.reason.length >= 12, `${record.id}: verification reason required`);
  }
  recordIds.add(record.id);
  sourceHashes.add(record.source.sha256);
}

const inbox = join(root, 'curation/inbox');
for (const name of readdirSync(inbox)) {
  if (name === '.gitkeep') continue;
  ensure(false, `Raw source staged in tracked curation/inbox: ${name}`);
}

const unindexed = readdirSync(join(root, 'curation/records'))
  .filter((name) => extname(name) === '.json')
  .map((name) => `curation/records/${basename(name)}`)
  .filter((path) => !index.records.includes(path));
ensure(unindexed.length === 0, `Unindexed curation records: ${unindexed.join(', ')}`);

console.log(`Validated ${recordIds.size} curation record(s), ${sourceHashes.size} unique source hash(es).`);
