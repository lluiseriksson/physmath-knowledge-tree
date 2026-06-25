// @ts-check

export const RUN_LEDGER_APPLICATION = 'PhysMath Knowledge Tree';
export const RUN_LEDGER_SCHEMA_VERSION = 1;
export const RUN_MANIFEST_KIND = 'reproducible-research-run';
export const RUN_PACKET_KIND = 'research-run-packet';
export const RUN_STATUSES = Object.freeze(['planned', 'running', 'passed', 'failed', 'inconclusive', 'cancelled']);
export const RUN_KINDS = Object.freeze(['lean', 'node', 'python', 'shell', 'browser', 'simulation', 'symbolic', 'manual']);
export const ARTIFACT_ROLES = Object.freeze(['input', 'output', 'log', 'report']);
export const MAX_RUN_IMPORT_BYTES = 2_000_000;
export const MAX_RUNS = 500;

const STATUS_SET = new Set(RUN_STATUSES);
const KIND_SET = new Set(RUN_KINDS);
const ROLE_SET = new Set(ARTIFACT_ROLES);
const ID_PATTERN = /^[a-z0-9][a-z0-9._:-]{0,127}$/u;
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const SENSITIVE_ENV_PATTERN = /(?:authorization|cookie|credential|password|secret|token|api[_-]?key)/iu;

/** @param {unknown} value @returns {value is Record<string, any>} */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @param {number} limit */
function boundedText(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

/** @param {unknown} value @param {string} label */
function requireRecord(value, label) {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

/** @param {unknown} value @param {string} label */
function requireArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value;
}

/** @param {unknown} value @param {string} label */
function requireDate(value, label) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new Error(`${label} must be an ISO-compatible date`);
  return new Date(value).toISOString();
}

/** @param {unknown} value @param {string} label */
function requireId(value, label) {
  const id = boundedText(value, 128);
  if (!ID_PATTERN.test(id)) throw new Error(`${label} must match ${ID_PATTERN}`);
  return id;
}

/** @param {unknown} value @param {string} label */
function normalizeRelativePath(value, label) {
  const path = boundedText(value, 1000).replaceAll('\\', '/');
  const segments = path.split('/');
  if (!path || path.startsWith('/') || /^[a-z]:\//iu.test(path)
      || segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new Error(`${label} must be a normalized relative path`);
  }
  return path;
}

/** @param {unknown} value @param {string} label */
function normalizeOptionalDate(value, label) {
  if (value === null || value === undefined || value === '') return null;
  return requireDate(value, label);
}

/** @param {unknown} value @param {string} label */
function normalizeOptionalInteger(value, label) {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < -255 || numeric > 255) throw new Error(`${label} must be an integer between -255 and 255`);
  return numeric;
}

/** @param {unknown} raw @param {number} position */
function normalizeArtifact(raw, position) {
  const artifact = requireRecord(raw, `Run artifact ${position}`);
  const role = boundedText(artifact.role, 32);
  if (!ROLE_SET.has(role)) throw new Error(`Run artifact ${position} has an unknown role`);
  const path = normalizeRelativePath(artifact.path, `Run artifact ${position} path`);
  const sha256 = artifact.sha256 === null || artifact.sha256 === undefined || artifact.sha256 === ''
    ? null
    : boundedText(artifact.sha256, 64).toLowerCase();
  if (sha256 !== null && !SHA256_PATTERN.test(sha256)) throw new Error(`Run artifact ${position} has an invalid SHA-256`);
  const bytes = artifact.bytes === null || artifact.bytes === undefined || artifact.bytes === ''
    ? null
    : Number(artifact.bytes);
  if (bytes !== null && (!Number.isSafeInteger(bytes) || bytes < 0)) throw new Error(`Run artifact ${position} bytes must be a non-negative integer`);
  return {
    role,
    path,
    sha256,
    bytes,
    media_type: boundedText(artifact.media_type, 200),
  };
}

/** @param {unknown} value */
function normalizeCommand(value) {
  const command = requireArray(value, 'Run command');
  if (command.length > 128) throw new Error('Run command exceeds 128 arguments');
  return command.map((argument, position) => {
    if (typeof argument !== 'string') throw new Error(`Run command argument ${position} must be text`);
    const text = argument.slice(0, 4000);
    if (!text) throw new Error(`Run command argument ${position} must not be empty`);
    return text;
  });
}

/** @param {unknown} value */
function normalizeEnvironment(value) {
  if (value === undefined || value === null) return {};
  const environment = requireRecord(value, 'Run environment');
  const output = {};
  const entries = Object.entries(environment);
  if (entries.length > 64) throw new Error('Run environment exceeds 64 entries');
  for (const [rawKey, rawValue] of entries) {
    const key = boundedText(rawKey, 80);
    if (!/^[A-Za-z_][A-Za-z0-9_.-]{0,79}$/u.test(key)) throw new Error(`Run environment key is invalid: ${rawKey}`);
    if (SENSITIVE_ENV_PATTERN.test(key)) continue;
    if (typeof rawValue !== 'string') throw new Error(`Run environment value must be text: ${key}`);
    output[key] = rawValue.slice(0, 2000);
  }
  return Object.fromEntries(Object.entries(output).sort(([left], [right]) => left.localeCompare(right)));
}

/** @param {unknown} value */
function normalizeProvenance(value) {
  if (value === undefined || value === null) return {};
  const provenance = requireRecord(value, 'Run provenance');
  const allowed = ['git_commit', 'package_version', 'toolchain', 'platform', 'arch', 'node_version'];
  return Object.fromEntries(allowed
    .map((key) => [key, boundedText(provenance[key], 500)])
    .filter(([, item]) => item));
}

/** @param {unknown} raw @param {Set<string>} validNodeIds @param {string} now */
export function normalizeRun(raw, validNodeIds, now = new Date().toISOString()) {
  const run = requireRecord(raw, 'Run');
  if (!(validNodeIds instanceof Set)) throw new Error('validNodeIds must be a Set');
  const normalizedNow = requireDate(now, 'Run normalization time');
  const id = requireId(run.id, 'Run ID');
  const title = boundedText(run.title, 300);
  if (!title) throw new Error('Run title is required');
  const kind = boundedText(run.kind, 32);
  if (!KIND_SET.has(kind)) throw new Error(`Unknown run kind: ${kind}`);
  const status = boundedText(run.status, 32);
  if (!STATUS_SET.has(status)) throw new Error(`Unknown run status: ${status}`);
  const nodeIds = [...new Set(requireArray(run.node_ids ?? [], 'Run node_ids')
    .filter((nodeId) => typeof nodeId === 'string' && validNodeIds.has(nodeId)))].sort();
  const command = normalizeCommand(run.command ?? []);
  const artifacts = requireArray(run.artifacts ?? [], 'Run artifacts').map(normalizeArtifact);
  if (artifacts.length > 256) throw new Error('Run artifacts exceed 256 records');
  const artifactKeys = new Set();
  for (const artifact of artifacts) {
    const key = `${artifact.role}\0${artifact.path}`;
    if (artifactKeys.has(key)) throw new Error(`Duplicate run artifact: ${artifact.role}:${artifact.path}`);
    artifactKeys.add(key);
  }
  const startedAt = normalizeOptionalDate(run.started_at, 'Run started_at');
  const completedAt = normalizeOptionalDate(run.completed_at, 'Run completed_at');
  if (startedAt && completedAt && Date.parse(completedAt) < Date.parse(startedAt)) {
    throw new Error('Run completed_at cannot precede started_at');
  }
  const duration = run.duration_ms === null || run.duration_ms === undefined || run.duration_ms === ''
    ? (startedAt && completedAt ? Date.parse(completedAt) - Date.parse(startedAt) : null)
    : Number(run.duration_ms);
  if (duration !== null && (!Number.isSafeInteger(duration) || duration < 0)) throw new Error('Run duration_ms must be a non-negative integer');
  const fingerprint = run.fingerprint === null || run.fingerprint === undefined || run.fingerprint === ''
    ? null
    : boundedText(run.fingerprint, 64).toLowerCase();
  if (fingerprint !== null && !SHA256_PATTERN.test(fingerprint)) throw new Error('Run fingerprint must be a SHA-256 hex digest');
  const createdAt = normalizeOptionalDate(run.created_at, 'Run created_at') ?? normalizedNow;
  const updatedAt = normalizeOptionalDate(run.updated_at, 'Run updated_at') ?? normalizedNow;
  return {
    id,
    title,
    kind,
    status,
    node_ids: nodeIds,
    command,
    cwd: run.cwd ? normalizeRelativePath(run.cwd, 'Run cwd') : '',
    environment: normalizeEnvironment(run.environment),
    provenance: normalizeProvenance(run.provenance),
    started_at: startedAt,
    completed_at: completedAt,
    duration_ms: duration,
    exit_code: normalizeOptionalInteger(run.exit_code, 'Run exit_code'),
    signal: boundedText(run.signal, 100),
    timed_out: run.timed_out === true,
    artifacts,
    notes: boundedText(run.notes, 20_000),
    fingerprint,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

/** @param {string} [now] */
export function createEmptyRunLedger(now = new Date().toISOString()) {
  return {
    application: RUN_LEDGER_APPLICATION,
    schema_version: RUN_LEDGER_SCHEMA_VERSION,
    updated_at: requireDate(now, 'Run ledger time'),
    runs: [],
  };
}

/** @param {unknown} input @param {Set<string>} validNodeIds @param {string} [now] */
export function normalizeRunLedger(input, validNodeIds, now = new Date().toISOString()) {
  const normalizedNow = requireDate(now, 'Run ledger normalization time');
  if (input === null || input === undefined) return createEmptyRunLedger(normalizedNow);
  const ledger = requireRecord(input, 'Run ledger');
  if (ledger.application !== RUN_LEDGER_APPLICATION) throw new Error('Run ledger belongs to another application');
  if (ledger.schema_version !== RUN_LEDGER_SCHEMA_VERSION) throw new Error('Unsupported run ledger schema version');
  const rawRuns = requireArray(ledger.runs, 'Run ledger runs');
  if (rawRuns.length > MAX_RUNS) throw new Error(`Run ledger exceeds ${MAX_RUNS} runs`);
  const byId = new Map();
  for (const rawRun of rawRuns) {
    const run = normalizeRun(rawRun, validNodeIds, normalizedNow);
    const previous = byId.get(run.id);
    if (!previous || Date.parse(run.updated_at) >= Date.parse(previous.updated_at)) byId.set(run.id, run);
  }
  return {
    application: RUN_LEDGER_APPLICATION,
    schema_version: RUN_LEDGER_SCHEMA_VERSION,
    updated_at: normalizeOptionalDate(ledger.updated_at, 'Run ledger updated_at') ?? normalizedNow,
    runs: [...byId.values()].sort((left, right) => left.id.localeCompare(right.id)),
  };
}

/** @param {unknown} current @param {unknown} incoming @param {Set<string>} validNodeIds @param {string} [now] */
export function mergeRunLedgers(current, incoming, validNodeIds, now = new Date().toISOString()) {
  const normalizedNow = requireDate(now, 'Run ledger merge time');
  const left = normalizeRunLedger(current, validNodeIds, normalizedNow);
  const right = normalizeRunLedger(incoming, validNodeIds, normalizedNow);
  return normalizeRunLedger({
    application: RUN_LEDGER_APPLICATION,
    schema_version: RUN_LEDGER_SCHEMA_VERSION,
    updated_at: normalizedNow,
    runs: [...left.runs, ...right.runs],
  }, validNodeIds, normalizedNow);
}

/** @param {unknown} ledger @param {unknown} run @param {Set<string>} validNodeIds @param {string} [now] */
export function upsertRun(ledger, run, validNodeIds, now = new Date().toISOString()) {
  const normalizedNow = requireDate(now, 'Run upsert time');
  const current = normalizeRunLedger(ledger, validNodeIds, normalizedNow);
  const next = normalizeRun({ ...requireRecord(run, 'Run'), updated_at: normalizedNow }, validNodeIds, normalizedNow);
  return normalizeRunLedger({
    ...current,
    updated_at: normalizedNow,
    runs: [...current.runs.filter(({ id }) => id !== next.id), next],
  }, validNodeIds, normalizedNow);
}

/** @param {unknown} ledger @param {unknown} runId @param {Set<string>} validNodeIds @param {string} [now] */
export function removeRun(ledger, runId, validNodeIds, now = new Date().toISOString()) {
  const normalizedNow = requireDate(now, 'Run removal time');
  const current = normalizeRunLedger(ledger, validNodeIds, normalizedNow);
  const id = requireId(runId, 'Run ID');
  return { ...current, updated_at: normalizedNow, runs: current.runs.filter((run) => run.id !== id) };
}

/** @param {unknown} ledger @param {Set<string>} validNodeIds @param {string} [now] */
export function summarizeRunLedger(ledger, validNodeIds, now = new Date().toISOString()) {
  const normalized = normalizeRunLedger(ledger, validNodeIds, now);
  const byStatus = Object.fromEntries(RUN_STATUSES.map((status) => [status, 0]));
  const byKind = Object.fromEntries(RUN_KINDS.map((kind) => [kind, 0]));
  let fingerprinted = 0;
  let artifactComplete = 0;
  let reproducible = 0;
  for (const run of normalized.runs) {
    byStatus[run.status] += 1;
    byKind[run.kind] += 1;
    if (run.fingerprint) fingerprinted += 1;
    const complete = run.artifacts.length > 0 && run.artifacts.every(({ sha256, bytes }) => sha256 && bytes !== null);
    if (complete) artifactComplete += 1;
    if (run.command.length > 0 && run.fingerprint && complete) reproducible += 1;
  }
  return { total: normalized.runs.length, by_status: byStatus, by_kind: byKind, fingerprinted, artifact_complete: artifactComplete, reproducible };
}

/** @param {Array<any>} runs @param {{query?:unknown,status?:unknown,kind?:unknown,nodeId?:unknown,sort?:unknown}} [filters] */
export function filterRuns(runs, filters = {}) {
  const query = boundedText(filters.query, 500).toLocaleLowerCase('en');
  const status = boundedText(filters.status, 32);
  const kind = boundedText(filters.kind, 32);
  const nodeId = boundedText(filters.nodeId, 200);
  const sort = boundedText(filters.sort, 32) || 'updated-desc';
  const filtered = runs.filter((run) => {
    if (status && status !== 'all' && run.status !== status) return false;
    if (kind && kind !== 'all' && run.kind !== kind) return false;
    if (nodeId && nodeId !== 'all' && !run.node_ids.includes(nodeId)) return false;
    if (!query) return true;
    const haystack = [run.id, run.title, run.kind, run.status, run.notes, run.command.join(' '), run.node_ids.join(' '), run.artifacts.map(({ path }) => path).join(' ')]
      .join(' ').toLocaleLowerCase('en');
    return haystack.includes(query);
  });
  const compare = sort === 'title'
    ? (left, right) => left.title.localeCompare(right.title) || left.id.localeCompare(right.id)
    : sort === 'started-desc'
      ? (left, right) => Date.parse(right.started_at ?? '1970-01-01') - Date.parse(left.started_at ?? '1970-01-01') || left.id.localeCompare(right.id)
      : (left, right) => Date.parse(right.updated_at) - Date.parse(left.updated_at) || left.id.localeCompare(right.id);
  return filtered.sort(compare);
}

/** @param {unknown} value */
function sortJson(value) {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortJson(value[key])]));
}

/** @param {unknown} value */
export function canonicalStringify(value) {
  return JSON.stringify(sortJson(value));
}

/** @param {string} text */
export async function sha256Hex(text) {
  if (!globalThis.crypto?.subtle) throw new Error('Web Crypto SHA-256 is unavailable');
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

/** @param {any} run */
function fingerprintCore(run) {
  const { fingerprint: _fingerprint, ...core } = run;
  return core;
}

/** @param {unknown} run @param {Set<string>} validNodeIds @param {string} [now] */
export async function withRunFingerprint(run, validNodeIds, now = new Date().toISOString()) {
  const normalized = normalizeRun(run, validNodeIds, now);
  return { ...normalized, fingerprint: await sha256Hex(canonicalStringify(fingerprintCore(normalized))) };
}

/** @param {unknown} run @param {Set<string>} validNodeIds @param {string} [now] */
export async function verifyRunFingerprint(run, validNodeIds, now = new Date().toISOString()) {
  const normalized = normalizeRun(run, validNodeIds, now);
  if (!normalized.fingerprint) return false;
  return normalized.fingerprint === await sha256Hex(canonicalStringify(fingerprintCore(normalized)));
}

/** @param {unknown} payload @param {Set<string>} validNodeIds @param {string} [now] */
export function importRunPayload(payload, validNodeIds, now = new Date().toISOString()) {
  const normalizedNow = requireDate(now, 'Run import time');
  const input = requireRecord(payload, 'Run import payload');
  if (input.kind === RUN_MANIFEST_KIND) {
    if (input.schema_version !== RUN_LEDGER_SCHEMA_VERSION) throw new Error('Unsupported run manifest schema version');
    const run = normalizeRun(input.run, validNodeIds, normalizedNow);
    return normalizeRunLedger({ application: RUN_LEDGER_APPLICATION, schema_version: RUN_LEDGER_SCHEMA_VERSION, updated_at: normalizedNow, runs: [run] }, validNodeIds, normalizedNow);
  }
  return normalizeRunLedger(input, validNodeIds, normalizedNow);
}

/** @param {string} text @param {Set<string>} validNodeIds @param {string} [now] */
export function parseRunImport(text, validNodeIds, now = new Date().toISOString()) {
  if (typeof text !== 'string') throw new Error('Run import must be text');
  if (new TextEncoder().encode(text).length > MAX_RUN_IMPORT_BYTES) throw new Error('Run import exceeds the size limit');
  return importRunPayload(JSON.parse(text), validNodeIds, now);
}

/** @param {{size:number,type?:string,name?:string}} file */
export function validateRunFile(file) {
  if (!file || typeof file.size !== 'number' || !Number.isFinite(file.size) || file.size < 0) throw new Error('Invalid run import file');
  if (file.size > MAX_RUN_IMPORT_BYTES) throw new Error('Run import exceeds the size limit');
  const name = boundedText(file.name, 500);
  if (name && !name.toLocaleLowerCase('en').endsWith('.json')) throw new Error('Run import filename must end in .json');
  const type = boundedText(file.type, 200).split(';', 1)[0].toLocaleLowerCase('en');
  const compatible = new Set(['application/json', 'text/json', 'application/octet-stream', 'text/plain']);
  if (type && !compatible.has(type) && !type.endsWith('+json')) throw new Error('Run import must use a JSON-compatible media type');
  return true;
}

/** @param {unknown} ledger @param {Iterable<string>} selectedIds @param {Set<string>} validNodeIds @param {string} [now] */
export async function buildRunPacket(ledger, selectedIds, validNodeIds, now = new Date().toISOString()) {
  const generatedAt = requireDate(now, 'Run packet time');
  const normalized = normalizeRunLedger(ledger, validNodeIds, generatedAt);
  const selected = new Set([...selectedIds].map(String));
  const runs = normalized.runs.filter(({ id }) => selected.has(id));
  const core = {
    application: RUN_LEDGER_APPLICATION,
    kind: RUN_PACKET_KIND,
    schema_version: RUN_LEDGER_SCHEMA_VERSION,
    generated_at: generatedAt,
    runs,
  };
  return { ...core, fingerprint: await sha256Hex(canonicalStringify(core)) };
}
