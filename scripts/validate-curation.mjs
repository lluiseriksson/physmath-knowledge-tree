import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const fail = (message) => { throw new Error(message); };
const ensure = (condition, message) => { if (!condition) fail(message); };

const index = readJson('curation/index.json');
ensure(index.schema_version === '1.2.0', 'Unsupported curation index schema version');
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
const decisionIds = new Set();
const statuses = new Set(['draft', 'curated', 'reviewed']);
const retentionValues = new Set(['retain-original', 'delete-after-user-review', 'deleted-after-review']);
const classifications = new Set(['formal', 'literature', 'heuristic', 'speculative']);
const destinationTypes = new Set(['graph_node', 'graph_edge', 'research_move', 'document']);
const mediaTypes = new Set(['text/plain', 'text/markdown', 'image/png']);

function validateRange(range, recordId, totalLines) {
  ensure(Number.isInteger(range.start_line) && range.start_line >= 1, `${recordId}: invalid start_line`);
  ensure(Number.isInteger(range.end_line) && range.end_line >= range.start_line, `${recordId}: invalid end_line`);
  ensure(Number.isInteger(totalLines) && range.end_line <= totalLines, `${recordId}: source range exceeds line count`);
}

function validateRegion(region, recordId, width, height) {
  for (const key of ['x', 'y', 'width', 'height']) ensure(Number.isInteger(region[key]), `${recordId}: image region ${key} must be an integer`);
  ensure(region.x >= 0 && region.y >= 0, `${recordId}: image region origin must be nonnegative`);
  ensure(region.width >= 1 && region.height >= 1, `${recordId}: image region dimensions must be positive`);
  ensure(region.x + region.width <= width, `${recordId}: image region exceeds source width`);
  ensure(region.y + region.height <= height, `${recordId}: image region exceeds source height`);
  ensure(typeof region.label === 'string' && region.label.length >= 3, `${recordId}: image region label required`);
  if (region.caption !== undefined) ensure(typeof region.caption === 'string' && region.caption.length >= 8, `${recordId}: invalid image-region caption`);
  if (region.alt_text !== undefined) ensure(typeof region.alt_text === 'string' && region.alt_text.length >= 8, `${recordId}: invalid image-region alt text`);
  if (region.transformations !== undefined) {
    ensure(Array.isArray(region.transformations), `${recordId}: image-region transformations must be an array`);
    for (const value of region.transformations) ensure(typeof value === 'string' && value.length >= 2, `${recordId}: invalid transformation`);
  }
}

function validateDestination(destination, recordId) {
  ensure(destinationTypes.has(destination.type), `${recordId}: invalid destination type`);
  ensure(typeof destination.value === 'string' && destination.value.length > 1, `${recordId}: invalid destination value`);
  if (destination.type === 'graph_node') ensure(nodeIds.has(destination.value), `${recordId}: missing graph node ${destination.value}`);
  if (destination.type === 'graph_edge') ensure(edgeIds.has(destination.value), `${recordId}: missing graph edge ${destination.value}`);
  if (destination.type === 'research_move') ensure(moveIds.has(destination.value), `${recordId}: missing research move ${destination.value}`);
  if (destination.type === 'document') ensure(existsSync(join(root, destination.value)), `${recordId}: missing document ${destination.value}`);
}

function validateDecision(decision, record, bucket) {
  const recordId = record.id;
  ensure(/^[a-z0-9_\.]+$/.test(decision.id), `${recordId}: invalid decision id ${decision.id}`);
  ensure(!decisionIds.has(decision.id), `${recordId}: duplicate decision id ${decision.id}`);
  decisionIds.add(decision.id);
  ensure(typeof decision.title === 'string' && decision.title.length >= 3, `${recordId}: decision title required`);
  ensure(classifications.has(decision.classification), `${recordId}: invalid classification`);
  if (bucket === 'quarantined') ensure(['heuristic', 'speculative'].includes(decision.classification), `${recordId}: quarantine item must be heuristic or speculative`);
  ensure(typeof decision.rationale === 'string' && decision.rationale.length >= 12, `${recordId}: rationale required`);
  ensure(Array.isArray(decision.destinations), `${recordId}: destinations must be an array`);
  for (const destination of decision.destinations) validateDestination(destination, recordId);

  const ranges = decision.source_ranges ?? [];
  const regions = decision.source_regions ?? [];
  ensure(Array.isArray(ranges) && Array.isArray(regions), `${recordId}: source anchors must be arrays`);
  ensure(ranges.length + regions.length > 0, `${recordId}: each decision needs a text range or image region`);
  if (record.source.media_type.startsWith('text/')) {
    ensure(ranges.length > 0, `${recordId}: text decisions need source_ranges`);
    ensure(regions.length === 0, `${recordId}: text decisions cannot use source_regions`);
    for (const range of ranges) validateRange(range, recordId, record.source.lines);
  } else if (record.source.media_type === 'image/png') {
    ensure(regions.length > 0, `${recordId}: PNG decisions need source_regions`);
    ensure(ranges.length === 0, `${recordId}: PNG decisions cannot use source_ranges`);
    for (const region of regions) validateRegion(region, recordId, record.source.width, record.source.height);
  }
}

for (const path of index.records) {
  ensure(/^curation\/records\/[a-z0-9_-]+\.json$/.test(path), `Invalid curation record path: ${path}`);
  ensure(existsSync(join(root, path)), `Missing curation record: ${path}`);
  const record = readJson(path);
  ensure(/^curation\.[a-z0-9_]+$/.test(record.id), `${path}: invalid record id`);
  ensure(!recordIds.has(record.id), `${path}: duplicate record id`);
  ensure(record.schema_version === '1.2.0', `${record.id}: unsupported schema version`);
  ensure(/^\d{4}-\d{2}-\d{2}$/.test(record.processed), `${record.id}: invalid processed date`);
  ensure(statuses.has(record.status), `${record.id}: invalid status`);
  ensure(record.review && ['pending', 'approved', 'changes_requested'].includes(record.review.status), `${record.id}: invalid review state`);
  if (record.review.status === 'approved') {
    ensure(record.status === 'reviewed', `${record.id}: approved review requires reviewed record status`);
    ensure(typeof record.review.reviewer === 'string' && record.review.reviewer.length >= 2, `${record.id}: approved review needs a reviewer`);
    ensure(/^\d{4}-\d{2}-\d{2}$/.test(record.review.reviewed_at ?? ''), `${record.id}: approved review needs a review date`);
  }
  if (record.status === 'reviewed') ensure(record.review.status === 'approved', `${record.id}: reviewed status requires approved review`);
  ensure(retentionValues.has(record.retention), `${record.id}: invalid retention`);
  ensure(record.source && typeof record.source.filename === 'string', `${record.id}: source metadata required`);
  ensure(mediaTypes.has(record.source.media_type), `${record.id}: unsupported media type`);
  ensure(/^[a-f0-9]{64}$/.test(record.source.sha256), `${record.id}: invalid SHA-256`);
  ensure(!sourceHashes.has(record.source.sha256), `${record.id}: duplicate source hash`);
  ensure(Number.isInteger(record.source.bytes) && record.source.bytes >= 0, `${record.id}: invalid byte count`);
  if (record.source.media_type.startsWith('text/')) {
    ensure(Number.isInteger(record.source.lines) && record.source.lines >= 1, `${record.id}: text source line count required`);
    ensure(record.source.width === undefined && record.source.height === undefined, `${record.id}: text source cannot carry image dimensions`);
  } else {
    ensure(Number.isInteger(record.source.width) && record.source.width >= 1, `${record.id}: image width required`);
    ensure(Number.isInteger(record.source.height) && record.source.height >= 1, `${record.id}: image height required`);
    ensure(record.source.lines === undefined, `${record.id}: image source cannot carry line count`);
  }
  if (record.retention === 'deleted-after-review') ensure(record.review.status === 'approved', `${record.id}: deleted-after-review requires approved review`);
  ensure(typeof record.summary === 'string' && record.summary.length >= 20, `${record.id}: summary required`);
  ensure(Array.isArray(record.promoted), `${record.id}: promoted array required`);
  ensure(Array.isArray(record.quarantined), `${record.id}: quarantined array required`);
  ensure(Array.isArray(record.discarded), `${record.id}: discarded array required`);
  ensure(Array.isArray(record.verification_queue), `${record.id}: verification_queue required`);
  for (const decision of record.promoted) validateDecision(decision, record, 'promoted');
  for (const decision of record.quarantined) validateDecision(decision, record, 'quarantined');
  for (const item of record.discarded) {
    ensure(typeof item.category === 'string' && item.category.length >= 3, `${record.id}: discarded category required`);
    ensure(typeof item.reason === 'string' && item.reason.length >= 12, `${record.id}: discarded reason required`);
  }
  for (const item of record.verification_queue) {
    ensure(/^[a-z0-9_\.]+$/.test(item.id), `${record.id}: invalid verification id`);
    ensure(typeof item.request === 'string' && item.request.length >= 12, `${record.id}: verification request required`);
    ensure(typeof item.reason === 'string' && item.reason.length >= 12, `${record.id}: verification reason required`);
    if (item.status !== undefined) ensure(['pending', 'verified', 'rejected'].includes(item.status), `${record.id}: invalid verification status`);
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

console.log(`Validated ${recordIds.size} curation record(s), ${sourceHashes.size} unique source hash(es), ${decisionIds.size} atomic decisions.`);
