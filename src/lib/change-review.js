// @ts-check

export const CHANGE_REVIEW_APPLICATION = 'PhysMath Knowledge Tree';
export const SNAPSHOT_SCHEMA_VERSION = 1;
export const REVIEW_SCHEMA_VERSION = 1;
export const CHANGE_REVIEW_STORAGE_KEY = 'physmath.change.review.v1';
export const MAX_CHANGE_IMPORT_BYTES = 8_000_000;
export const MAX_CHANGE_DECISIONS = 20_000;

export const DECISION_STATUSES = Object.freeze([
  'pending',
  'accepted',
  'needs-work',
  'rejected',
]);

export const RISK_LEVELS = Object.freeze([
  'critical',
  'high',
  'medium',
  'low',
  'info',
]);

export const ENTITY_TYPES = Object.freeze([
  'metadata',
  'node',
  'edge',
  'research_move',
  'collection',
]);

const DECISION_STATUS_SET = new Set(DECISION_STATUSES);
const RISK_SET = new Set(RISK_LEVELS);
const ENTITY_TYPE_SET = new Set(ENTITY_TYPES);
const CHANGE_TYPE_SET = new Set(['added', 'removed', 'modified']);
const FINGERPRINT_PATTERN = /^[0-9a-f]{64}$/u;
const ID_PATTERN = /^[a-z0-9][a-z0-9._-]{0,239}$/u;
const CONFIDENCE_RANK = Object.freeze({ speculative: 1, heuristic: 2, literature: 3, formal: 4 });
const RISK_RANK = new Map(RISK_LEVELS.map((risk, index) => [risk, index]));
const STATUS_RANK = new Map(DECISION_STATUSES.map((status, index) => [status, index]));

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @param {number} maximum */
function boundedText(value, maximum) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

/** @param {unknown} value @param {string} label */
function requireDate(value, label) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} must be an ISO-compatible date`);
  }
  return value;
}

/** @param {unknown} value */
function optionalDate(value) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return null;
  return value;
}

/** @param {unknown} value @param {string} label */
function requireFingerprint(value, label) {
  if (typeof value !== 'string' || !FINGERPRINT_PATTERN.test(value)) {
    throw new Error(`${label} must be a lowercase SHA-256 fingerprint`);
  }
  return value;
}

/** @param {unknown} value @param {string} label */
function requireIdentifier(value, label) {
  if (typeof value !== 'string' || value !== value.trim() || !ID_PATTERN.test(value)) {
    throw new Error(`${label} must be a stable lowercase identifier`);
  }
  return value;
}

/** @param {unknown} value @param {string} label */
function cloneJson(value, label) {
  try {
    const text = JSON.stringify(value);
    if (text === undefined) throw new Error('undefined');
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} must contain JSON-compatible data`);
  }
}

/** @param {unknown} value */
function canonicalValue(value) {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (!isRecord(value)) return value;
  const output = {};
  for (const key of Object.keys(value).sort()) output[key] = canonicalValue(value[key]);
  return output;
}

/** Deterministic JSON stringification with recursively sorted object keys. */
export function canonicalStringify(value) {
  return JSON.stringify(canonicalValue(value));
}

/** @param {string} text */
export async function sha256Hex(text) {
  if (typeof text !== 'string') throw new Error('SHA-256 input must be text');
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SHA-256 is unavailable');
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** @param {unknown} input @param {string} label */
function normalizeEntityArray(input, label) {
  if (!Array.isArray(input)) throw new Error(`${label} must be an array`);
  const seen = new Set();
  const normalized = input.map((candidate, index) => {
    if (!isRecord(candidate)) throw new Error(`${label}[${index}] must be an object`);
    const entity = cloneJson(candidate, `${label}[${index}]`);
    const id = requireIdentifier(entity.id, `${label}[${index}].id`);
    if (seen.has(id)) throw new Error(`Duplicate ${label} ID: ${id}`);
    seen.add(id);
    return entity;
  });
  return normalized.sort((left, right) => left.id.localeCompare(right.id));
}

/** @param {unknown} input */
function normalizeIndex(input) {
  if (!isRecord(input)) throw new Error('Graph index must be an object');
  const cloned = cloneJson(input, 'Graph index');
  if (typeof cloned.schema_version !== 'string' || !cloned.schema_version) {
    throw new Error('Graph index needs schema_version');
  }
  if (typeof cloned.application_version !== 'string' || !cloned.application_version) {
    throw new Error('Graph index needs application_version');
  }
  return cloned;
}

/**
 * Normalize the four canonical graph collections plus discovery metadata.
 * @param {unknown} input
 */
export function normalizeGraphData(input) {
  if (!isRecord(input)) throw new Error('Graph data must be an object');
  const index = normalizeIndex(input.index);
  const nodes = normalizeEntityArray(input.nodes, 'nodes');
  const edges = normalizeEntityArray(input.edges, 'edges');
  const researchMoves = normalizeEntityArray(input.research_moves ?? input.moves, 'research_moves');
  const collections = normalizeEntityArray(input.collections, 'collections');
  const nodeIds = new Set(nodes.map(({ id }) => id));
  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      throw new Error(`Edge ${edge.id} references a missing node`);
    }
  }
  for (const collection of collections) {
    if (!Array.isArray(collection.nodes)) throw new Error(`Collection ${collection.id} nodes must be an array`);
    if (collection.nodes.some((id) => typeof id !== 'string' || !nodeIds.has(id))) {
      throw new Error(`Collection ${collection.id} references a missing node`);
    }
  }
  return { index, nodes, edges, research_moves: researchMoves, collections };
}

/** @param {ReturnType<typeof normalizeGraphData>} graph */
export async function fingerprintGraph(graph) {
  return sha256Hex(canonicalStringify(graph));
}

/** @param {unknown} input @param {string} [capturedAt] */
export async function createGraphSnapshot(input, capturedAt = new Date().toISOString()) {
  const graph = normalizeGraphData(input);
  return {
    application: CHANGE_REVIEW_APPLICATION,
    schema_version: SNAPSHOT_SCHEMA_VERSION,
    captured_at: requireDate(capturedAt, 'Snapshot captured_at'),
    fingerprint: await fingerprintGraph(graph),
    graph,
  };
}

/** @param {unknown} input @param {{verifyFingerprint?:boolean}} [options] */
export async function normalizeGraphSnapshot(input, options = {}) {
  if (!isRecord(input)) throw new Error('Graph snapshot must be an object');
  if (input.application !== CHANGE_REVIEW_APPLICATION) throw new Error('Graph snapshot belongs to another application');
  if (input.schema_version !== SNAPSHOT_SCHEMA_VERSION) throw new Error('Unsupported graph snapshot schema version');
  const capturedAt = requireDate(input.captured_at, 'Snapshot captured_at');
  const graph = normalizeGraphData(input.graph);
  const fingerprint = requireFingerprint(input.fingerprint, 'Snapshot fingerprint');
  if (options.verifyFingerprint !== false) {
    const expected = await fingerprintGraph(graph);
    if (fingerprint !== expected) throw new Error('Graph snapshot fingerprint does not match its canonical data');
  }
  return {
    application: CHANGE_REVIEW_APPLICATION,
    schema_version: SNAPSHOT_SCHEMA_VERSION,
    captured_at: capturedAt,
    fingerprint,
    graph,
  };
}

/** @param {unknown} snapshot */
export async function exportGraphSnapshot(snapshot) {
  return `${JSON.stringify(await normalizeGraphSnapshot(snapshot), null, 2)}\n`;
}

/** @param {unknown} text */
export async function importGraphSnapshot(text) {
  if (typeof text !== 'string') throw new Error('Graph snapshot import must be text');
  if (new TextEncoder().encode(text).length > MAX_CHANGE_IMPORT_BYTES) throw new Error('Graph snapshot import exceeds the size limit');
  return normalizeGraphSnapshot(JSON.parse(text));
}

/** @param {{size:number,type?:string,name?:string}} file */
export function validateChangeReviewFile(file) {
  if (!file || typeof file.size !== 'number' || !Number.isFinite(file.size) || file.size < 0) {
    throw new Error('Invalid change-review file');
  }
  if (file.size > MAX_CHANGE_IMPORT_BYTES) throw new Error('Change-review import exceeds the size limit');
  const name = boundedText(file.name, 500);
  if (name && !name.toLowerCase().endsWith('.json')) throw new Error('Change-review filename must end in .json');
  const type = boundedText(file.type, 200).split(';', 1)[0].toLowerCase();
  const compatible = new Set(['application/json', 'text/json', 'application/octet-stream', 'text/plain']);
  if (type && !compatible.has(type) && !type.endsWith('+json')) {
    throw new Error('Change-review import must use a JSON-compatible media type');
  }
  return true;
}

/** @param {unknown} left @param {unknown} right */
function equalJson(left, right) {
  return canonicalStringify(left) === canonicalStringify(right);
}

/** @param {unknown} before @param {unknown} after @param {string} [path] @param {Array<any>} [output] */
function fieldDifferences(before, after, path = '', output = []) {
  if (equalJson(before, after)) return output;
  if (isRecord(before) && isRecord(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
    for (const key of keys) fieldDifferences(before[key], after[key], path ? `${path}.${key}` : key, output);
    return output;
  }
  output.push({ path: path || '$', before: cloneJson(before ?? null, 'Difference before value'), after: cloneJson(after ?? null, 'Difference after value') });
  return output;
}

/** @param {unknown} value */
function sourceBearingReferences(value) {
  if (!Array.isArray(value)) return new Set();
  return new Set(value
    .filter((reference) => isRecord(reference) && ['claim', 'formalization'].includes(reference.scope))
    .map((reference) => `${reference.url ?? ''}\0${reference.scope}`));
}

/** @param {unknown} value */
function referenceUrls(value) {
  if (!Array.isArray(value)) return new Set();
  return new Set(value.filter(isRecord).map((reference) => String(reference.url ?? '')));
}

/** @param {string} current @param {string} candidate */
function strongerRisk(current, candidate) {
  return RISK_RANK.get(candidate) < RISK_RANK.get(current) ? candidate : current;
}

/** @param {string} entityType @param {string} changeType @param {Array<any>} fields @param {any} before @param {any} after */
function classifyChange(entityType, changeType, fields, before, after) {
  let risk = 'info';
  const flags = [];
  if (changeType === 'removed') {
    risk = entityType === 'node' ? 'critical' : entityType === 'edge' ? 'high' : 'medium';
    flags.push('canonical-removal');
    return { risk, flags };
  }
  if (changeType === 'added') {
    risk = entityType === 'edge' ? 'medium' : 'low';
    flags.push('canonical-addition');
    return { risk, flags };
  }
  for (const field of fields) {
    const path = field.path;
    if (path === 'confidence') {
      const beforeRank = CONFIDENCE_RANK[String(field.before)] ?? 0;
      const afterRank = CONFIDENCE_RANK[String(field.after)] ?? 0;
      if (afterRank > beforeRank) {
        risk = strongerRisk(risk, 'critical');
        flags.push('confidence-promotion');
      } else if (afterRank < beforeRank) {
        risk = strongerRisk(risk, 'high');
        flags.push('confidence-downgrade');
      } else {
        risk = strongerRisk(risk, 'high');
        flags.push('confidence-vocabulary-change');
      }
    } else if (entityType === 'edge' && ['source', 'target', 'relation'].includes(path)) {
      risk = strongerRisk(risk, 'critical');
      flags.push('edge-semantics-change');
    } else if (path === 'references') {
      const beforeSources = sourceBearingReferences(field.before);
      const afterSources = sourceBearingReferences(field.after);
      const removedSourceBearing = [...beforeSources].some((value) => !afterSources.has(value));
      const beforeUrls = referenceUrls(field.before);
      const afterUrls = referenceUrls(field.after);
      const removedUrl = [...beforeUrls].some((value) => !afterUrls.has(value));
      if (removedSourceBearing) {
        risk = strongerRisk(risk, 'critical');
        flags.push('source-bearing-reference-loss');
      } else if (removedUrl) {
        risk = strongerRisk(risk, 'high');
        flags.push('reference-loss');
      } else {
        risk = strongerRisk(risk, 'low');
        flags.push('reference-addition-or-edit');
      }
    } else if (path.startsWith('lean')) {
      risk = strongerRisk(risk, 'high');
      flags.push('lean-target-change');
    } else if (entityType === 'metadata' && ['schema_version', 'root_nodes', 'confidence_levels'].includes(path)) {
      risk = strongerRisk(risk, 'high');
      flags.push('graph-contract-change');
    } else if (entityType === 'collection' && path === 'nodes') {
      risk = strongerRisk(risk, 'medium');
      flags.push('collection-membership-change');
    } else if (['summary', 'mechanism', 'description', 'output', 'risks', 'lean_test', 'questions', 'good_for'].includes(path)) {
      risk = strongerRisk(risk, 'medium');
    } else {
      risk = strongerRisk(risk, 'low');
    }
  }
  return { risk, flags: [...new Set(flags)].sort() };
}

/** @param {string} entityType @param {any} entity */
function entityTitle(_entityType, entity) {
  return boundedText(entity.title, 500) || boundedText(entity.mechanism, 500) || boundedText(entity.id, 240);
}

/** @param {string} entityType @param {Array<any>} baseline @param {Array<any>} current */
function diffEntityCollection(entityType, baseline, current) {
  const beforeById = new Map(baseline.map((entity) => [entity.id, entity]));
  const afterById = new Map(current.map((entity) => [entity.id, entity]));
  const ids = [...new Set([...beforeById.keys(), ...afterById.keys()])].sort();
  const changes = [];
  for (const id of ids) {
    const before = beforeById.get(id);
    const after = afterById.get(id);
    const changeType = before ? after ? 'modified' : 'removed' : 'added';
    if (changeType === 'modified' && equalJson(before, after)) continue;
    const fields = changeType === 'modified' ? fieldDifferences(before, after) : [];
    const classification = classifyChange(entityType, changeType, fields, before, after);
    changes.push({
      key: `${entityType}:${id}:${changeType}`,
      entity_type: entityType,
      entity_id: id,
      change_type: changeType,
      risk: classification.risk,
      flags: classification.flags,
      title: entityTitle(entityType, after ?? before),
      fields,
      before: before ?? null,
      after: after ?? null,
    });
  }
  return changes;
}

/** @param {any} baseline @param {any} current */
export function diffGraphSnapshots(baseline, current) {
  if (!isRecord(baseline) || !isRecord(current)) throw new Error('Graph snapshot diff needs two snapshots');
  requireFingerprint(baseline.fingerprint, 'Baseline fingerprint');
  requireFingerprint(current.fingerprint, 'Current fingerprint');
  const metadataFields = fieldDifferences(baseline.graph.index, current.graph.index);
  const changes = [];
  if (metadataFields.length > 0) {
    const classification = classifyChange('metadata', 'modified', metadataFields, baseline.graph.index, current.graph.index);
    changes.push({
      key: 'metadata:graph-index:modified', entity_type: 'metadata', entity_id: 'graph-index',
      change_type: 'modified', risk: classification.risk, flags: classification.flags,
      title: 'Graph discovery metadata', fields: metadataFields,
      before: baseline.graph.index, after: current.graph.index,
    });
  }
  changes.push(...diffEntityCollection('node', baseline.graph.nodes, current.graph.nodes));
  changes.push(...diffEntityCollection('edge', baseline.graph.edges, current.graph.edges));
  changes.push(...diffEntityCollection('research_move', baseline.graph.research_moves, current.graph.research_moves));
  changes.push(...diffEntityCollection('collection', baseline.graph.collections, current.graph.collections));
  return changes.sort((left, right) =>
    RISK_RANK.get(left.risk) - RISK_RANK.get(right.risk)
      || left.entity_type.localeCompare(right.entity_type)
      || left.entity_id.localeCompare(right.entity_id));
}

/** @param {Array<any>} changes */
export function summarizeChangeSet(changes) {
  if (!Array.isArray(changes)) throw new Error('Change summary needs an array');
  const byRisk = Object.fromEntries(RISK_LEVELS.map((risk) => [risk, 0]));
  const byType = Object.fromEntries(['added', 'removed', 'modified'].map((type) => [type, 0]));
  const byEntity = Object.fromEntries(ENTITY_TYPES.map((type) => [type, 0]));
  let confidencePromotions = 0;
  let referenceLosses = 0;
  for (const change of changes) {
    if (RISK_SET.has(change.risk)) byRisk[change.risk] += 1;
    if (CHANGE_TYPE_SET.has(change.change_type)) byType[change.change_type] += 1;
    if (ENTITY_TYPE_SET.has(change.entity_type)) byEntity[change.entity_type] += 1;
    if (change.flags?.includes('confidence-promotion')) confidencePromotions += 1;
    if (change.flags?.some((flag) => flag.includes('reference-loss'))) referenceLosses += 1;
  }
  return {
    total: changes.length,
    by_risk: byRisk,
    by_change_type: byType,
    by_entity: byEntity,
    confidence_promotions: confidencePromotions,
    reference_losses: referenceLosses,
  };
}

/** @param {string} baselineFingerprint @param {string} currentFingerprint @param {string} [now] */
export function createDecisionLedger(baselineFingerprint, currentFingerprint, now = new Date().toISOString()) {
  return {
    schema_version: REVIEW_SCHEMA_VERSION,
    baseline_fingerprint: requireFingerprint(baselineFingerprint, 'Decision baseline fingerprint'),
    current_fingerprint: requireFingerprint(currentFingerprint, 'Decision current fingerprint'),
    updated_at: requireDate(now, 'Decision ledger updated_at'),
    decisions: [],
  };
}

/** @param {unknown} input @param {Set<string>} validKeys @param {string} baselineFingerprint @param {string} currentFingerprint @param {string} [now] */
export function normalizeDecisionLedger(input, validKeys, baselineFingerprint, currentFingerprint, now = new Date().toISOString()) {
  const fallback = createDecisionLedger(baselineFingerprint, currentFingerprint, now);
  if (!isRecord(input) || input.schema_version !== REVIEW_SCHEMA_VERSION || !Array.isArray(input.decisions)) return fallback;
  if (input.baseline_fingerprint !== baselineFingerprint || input.current_fingerprint !== currentFingerprint) return fallback;
  const byKey = new Map();
  for (const candidate of input.decisions.slice(0, MAX_CHANGE_DECISIONS)) {
    if (!isRecord(candidate) || typeof candidate.key !== 'string' || !validKeys.has(candidate.key)) continue;
    const status = boundedText(candidate.status, 32).toLowerCase();
    const decision = {
      key: candidate.key,
      status: DECISION_STATUS_SET.has(status) ? status : 'pending',
      notes: boundedText(candidate.notes, 12_000),
      updated_at: optionalDate(candidate.updated_at) ?? now,
    };
    const previous = byKey.get(decision.key);
    if (!previous || Date.parse(decision.updated_at) >= Date.parse(previous.updated_at)) byKey.set(decision.key, decision);
  }
  return {
    schema_version: REVIEW_SCHEMA_VERSION,
    baseline_fingerprint: baselineFingerprint,
    current_fingerprint: currentFingerprint,
    updated_at: optionalDate(input.updated_at) ?? now,
    decisions: [...byKey.values()].sort((left, right) => left.key.localeCompare(right.key)),
  };
}

/** @param {unknown} ledger @param {unknown} decision @param {Set<string>} validKeys @param {string} baselineFingerprint @param {string} currentFingerprint @param {string} [now] */
export function upsertDecision(ledger, decision, validKeys, baselineFingerprint, currentFingerprint, now = new Date().toISOString()) {
  if (!isRecord(decision) || typeof decision.key !== 'string' || !validKeys.has(decision.key)) {
    throw new Error('Decision key is not present in the current change set');
  }
  const current = normalizeDecisionLedger(ledger, validKeys, baselineFingerprint, currentFingerprint, now);
  const nextDecision = {
    key: decision.key,
    status: DECISION_STATUS_SET.has(decision.status) ? decision.status : 'pending',
    notes: boundedText(decision.notes, 12_000),
    updated_at: requireDate(now, 'Decision updated_at'),
  };
  return normalizeDecisionLedger({
    ...current,
    updated_at: now,
    decisions: [...current.decisions.filter(({ key }) => key !== nextDecision.key), nextDecision],
  }, validKeys, baselineFingerprint, currentFingerprint, now);
}

/** @param {unknown} ledger @param {string} key @param {Set<string>} validKeys @param {string} baselineFingerprint @param {string} currentFingerprint @param {string} [now] */
export function removeDecision(ledger, key, validKeys, baselineFingerprint, currentFingerprint, now = new Date().toISOString()) {
  const current = normalizeDecisionLedger(ledger, validKeys, baselineFingerprint, currentFingerprint, now);
  return { ...current, updated_at: requireDate(now, 'Decision ledger updated_at'), decisions: current.decisions.filter((decision) => decision.key !== key) };
}

/** @param {unknown} left @param {unknown} right @param {Set<string>} validKeys @param {string} baselineFingerprint @param {string} currentFingerprint @param {string} [now] */
export function mergeDecisionLedgers(left, right, validKeys, baselineFingerprint, currentFingerprint, now = new Date().toISOString()) {
  const a = normalizeDecisionLedger(left, validKeys, baselineFingerprint, currentFingerprint, now);
  const b = normalizeDecisionLedger(right, validKeys, baselineFingerprint, currentFingerprint, now);
  return normalizeDecisionLedger({ ...a, updated_at: now, decisions: [...a.decisions, ...b.decisions] }, validKeys, baselineFingerprint, currentFingerprint, now);
}

/** @param {Storage} storage @param {any} currentSnapshot */
export async function loadChangeReviewState(storage, currentSnapshot) {
  try {
    const raw = storage.getItem(CHANGE_REVIEW_STORAGE_KEY);
    if (!raw) return { baseline: null, ledger: null };
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schema_version !== REVIEW_SCHEMA_VERSION || !parsed.baseline) return { baseline: null, ledger: null };
    const baseline = await normalizeGraphSnapshot(parsed.baseline);
    const changes = diffGraphSnapshots(baseline, currentSnapshot);
    const keys = new Set(changes.map(({ key }) => key));
    const ledger = normalizeDecisionLedger(parsed.ledger, keys, baseline.fingerprint, currentSnapshot.fingerprint);
    return { baseline, ledger };
  } catch {
    return { baseline: null, ledger: null };
  }
}

/** @param {Storage} storage @param {any} baseline @param {any} ledger @param {any} currentSnapshot */
export async function saveChangeReviewState(storage, baseline, ledger, currentSnapshot) {
  const normalizedBaseline = await normalizeGraphSnapshot(baseline);
  const changes = diffGraphSnapshots(normalizedBaseline, currentSnapshot);
  const keys = new Set(changes.map(({ key }) => key));
  const normalizedLedger = normalizeDecisionLedger(ledger, keys, normalizedBaseline.fingerprint, currentSnapshot.fingerprint);
  const state = { schema_version: REVIEW_SCHEMA_VERSION, baseline: normalizedBaseline, ledger: normalizedLedger };
  try { storage.setItem(CHANGE_REVIEW_STORAGE_KEY, JSON.stringify(state)); } catch { /* Storage is optional. */ }
  return state;
}

/** @param {Array<any>} changes @param {unknown} ledger @param {{query?:string,risk?:string,entity?:string,changeType?:string,status?:string,sort?:string,limit?:number}} [options] */
export function buildChangeWorklist(changes, ledger, options = {}) {
  if (!Array.isArray(changes)) throw new Error('Change worklist needs an array');
  if (!isRecord(options)) throw new Error('Change worklist options must be an object');
  const sort = options.sort ?? 'risk';
  if (!['risk', 'entity', 'status'].includes(sort)) throw new Error(`Unknown change worklist sort: ${sort}`);
  const limit = options.limit === undefined ? changes.length : Number(options.limit);
  if (!Number.isInteger(limit) || limit < 0) throw new Error('Change worklist limit must be a non-negative integer');
  const decisions = new Map((ledger?.decisions ?? []).map((decision) => [decision.key, decision]));
  const query = boundedText(options.query, 500).toLowerCase();
  const items = changes.map((change) => {
    const decision = decisions.get(change.key) ?? { key: change.key, status: 'pending', notes: '', updated_at: null };
    return { change, decision };
  }).filter(({ change, decision }) => {
    if (options.risk && options.risk !== 'all' && change.risk !== options.risk) return false;
    if (options.entity && options.entity !== 'all' && change.entity_type !== options.entity) return false;
    if (options.changeType && options.changeType !== 'all' && change.change_type !== options.changeType) return false;
    if (options.status && options.status !== 'all' && decision.status !== options.status) return false;
    if (!query) return true;
    const haystack = canonicalStringify({ change, decision }).toLowerCase();
    return query.split(/\s+/u).filter(Boolean).every((term) => haystack.includes(term));
  });
  items.sort((left, right) => {
    if (sort === 'entity') return left.change.entity_type.localeCompare(right.change.entity_type)
      || left.change.entity_id.localeCompare(right.change.entity_id);
    if (sort === 'status') return STATUS_RANK.get(left.decision.status) - STATUS_RANK.get(right.decision.status)
      || RISK_RANK.get(left.change.risk) - RISK_RANK.get(right.change.risk)
      || left.change.key.localeCompare(right.change.key);
    return RISK_RANK.get(left.change.risk) - RISK_RANK.get(right.change.risk)
      || left.change.entity_type.localeCompare(right.change.entity_type)
      || left.change.entity_id.localeCompare(right.change.entity_id);
  });
  return items.slice(0, limit);
}

/** @param {Array<any>} changes @param {unknown} ledger */
export function summarizeDecisions(changes, ledger) {
  const byStatus = Object.fromEntries(DECISION_STATUSES.map((status) => [status, 0]));
  const decisions = new Map((ledger?.decisions ?? []).map((decision) => [decision.key, decision]));
  for (const change of changes) byStatus[decisions.get(change.key)?.status ?? 'pending'] += 1;
  return { total: changes.length, reviewed: changes.length - byStatus.pending, by_status: byStatus };
}

/** @param {any} baseline @param {any} current @param {Array<any>} changes @param {unknown} ledger @param {string[]} selectedKeys @param {string} [now] */
export function buildChangeReviewBundle(baseline, current, changes, ledger, selectedKeys, now = new Date().toISOString()) {
  if (!Array.isArray(selectedKeys)) throw new Error('Selected change keys must be an array');
  const selected = new Set(selectedKeys);
  const chosen = changes.filter(({ key }) => selected.has(key));
  if (chosen.length === 0) throw new Error('Change review bundle needs at least one current change');
  const decisions = new Map((ledger?.decisions ?? []).map((decision) => [decision.key, decision]));
  return {
    application: CHANGE_REVIEW_APPLICATION,
    schema_version: REVIEW_SCHEMA_VERSION,
    kind: 'canonical-change-review-bundle',
    exported_at: requireDate(now, 'Change review bundle date'),
    baseline_snapshot: baseline,
    current_fingerprint: current.fingerprint,
    change_count: chosen.length,
    changes: chosen.map((change) => ({
      key: change.key,
      entity_type: change.entity_type,
      entity_id: change.entity_id,
      change_type: change.change_type,
      risk: change.risk,
      flags: change.flags,
      title: change.title,
      fields: change.fields,
      decision: decisions.get(change.key) ?? null,
    })),
  };
}

/** @param {ReturnType<typeof buildChangeReviewBundle>} bundle */
export function changeReviewBundleMarkdown(bundle) {
  const lines = [
    '# Canonical Change Review Packet',
    '',
    `- Baseline fingerprint: \`${bundle.baseline_snapshot.fingerprint}\``,
    `- Current fingerprint: \`${bundle.current_fingerprint}\``,
    `- Exported: ${bundle.exported_at}`,
    `- Changes: ${bundle.change_count}`,
    '',
  ];
  for (const change of bundle.changes) {
    lines.push(`## ${change.title}`, '');
    lines.push(`- Key: \`${change.key}\``);
    lines.push(`- Entity: ${change.entity_type} / \`${change.entity_id}\``);
    lines.push(`- Change: ${change.change_type}`);
    lines.push(`- Risk: ${change.risk}`);
    lines.push(`- Decision: ${change.decision?.status ?? 'pending'}`);
    if (change.flags.length) lines.push(`- Flags: ${change.flags.join(', ')}`);
    if (change.decision?.notes) lines.push('', change.decision.notes);
    if (change.fields.length) {
      lines.push('', '### Changed fields', '');
      for (const field of change.fields) lines.push(`- \`${field.path}\``);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

/** @param {unknown} bundle @param {any} currentSnapshot */
export async function importChangeReviewBundle(bundle, currentSnapshot) {
  if (!isRecord(bundle)) throw new Error('Change review bundle must be an object');
  if (bundle.application !== CHANGE_REVIEW_APPLICATION) throw new Error('Change review bundle belongs to another application');
  if (bundle.schema_version !== REVIEW_SCHEMA_VERSION || bundle.kind !== 'canonical-change-review-bundle') {
    throw new Error('Unsupported change review bundle');
  }
  const baseline = await normalizeGraphSnapshot(bundle.baseline_snapshot);
  const currentFingerprint = requireFingerprint(bundle.current_fingerprint, 'Bundle current fingerprint');
  if (currentFingerprint !== currentSnapshot.fingerprint) throw new Error('Change review bundle targets a different current graph');
  const changes = diffGraphSnapshots(baseline, currentSnapshot);
  const keys = new Set(changes.map(({ key }) => key));
  const rawDecisions = Array.isArray(bundle.changes)
    ? bundle.changes.filter(isRecord).map((change) => change.decision).filter(isRecord)
    : [];
  const ledger = normalizeDecisionLedger({
    schema_version: REVIEW_SCHEMA_VERSION,
    baseline_fingerprint: baseline.fingerprint,
    current_fingerprint: currentSnapshot.fingerprint,
    updated_at: optionalDate(bundle.exported_at) ?? new Date().toISOString(),
    decisions: rawDecisions,
  }, keys, baseline.fingerprint, currentSnapshot.fingerprint);
  return { baseline, changes, ledger };
}

/** @param {unknown} text @param {any} currentSnapshot */
export async function importChangeReviewFile(text, currentSnapshot) {
  if (typeof text !== 'string') throw new Error('Change-review import must be text');
  if (new TextEncoder().encode(text).length > MAX_CHANGE_IMPORT_BYTES) throw new Error('Change-review import exceeds the size limit');
  const parsed = JSON.parse(text);
  if (isRecord(parsed) && parsed.kind === 'canonical-change-review-bundle') {
    return { kind: 'bundle', ...(await importChangeReviewBundle(parsed, currentSnapshot)) };
  }
  return { kind: 'snapshot', baseline: await normalizeGraphSnapshot(parsed), changes: null, ledger: null };
}
