// @ts-check

export const WORKSPACE_SCHEMA_VERSION = 1;
export const WORKSPACE_STORAGE_KEY = 'physmath.research.workspaces.v1';
export const WORKSPACE_APPLICATION = 'PhysMath Knowledge Tree';
export const MAX_WORKSPACE_IMPORT_BYTES = 2_000_000;

const LIMITS = Object.freeze({
  workspaces: 50,
  nodes: 500,
  notes: 100_000,
  bridgeCards: 200,
  bridgeMarkdown: 100_000,
  negativeResults: 500,
  resultText: 20_000,
  title: 160,
  id: 128,
});
const VALID_RESULT_STATUSES = new Set(['observed', 'inconclusive', 'falsified']);
const ID_PATTERN = /^[a-z0-9][a-z0-9._:-]{0,127}$/iu;

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @param {number} limit */
function boundedText(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

/** @param {unknown} value */
function normalizedDate(value, fallback) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
    ? new Date(value).toISOString()
    : fallback;
}

/** @param {unknown} value */
function normalizedId(value) {
  const candidate = boundedText(value, LIMITS.id);
  return ID_PATTERN.test(candidate) ? candidate : '';
}

/** @param {unknown} values @param {Set<string>} validNodeIds */
function normalizedNodeIds(values, validNodeIds) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => validNodeIds.has(value)))]
    .slice(0, LIMITS.nodes);
}

/** @param {unknown} value */
function requireRecord(value, message) {
  if (!isRecord(value)) throw new Error(message);
  return value;
}

/** @param {unknown} value @param {string} message */
function requireArray(value, message) {
  if (!Array.isArray(value)) throw new Error(message);
  return value;
}

/** @param {unknown} input @param {Set<string>} validNodeIds @param {string} now */
function normalizeBridgeCard(input, validNodeIds, now) {
  const card = isRecord(input) ? input : {};
  const id = normalizedId(card.id);
  if (!id) return null;
  const createdAt = normalizedDate(card.created_at, now);
  return {
    id,
    title: boundedText(card.title, LIMITS.title) || 'Untitled bridge draft',
    markdown: boundedText(card.markdown, LIMITS.bridgeMarkdown),
    node_ids: normalizedNodeIds(card.node_ids, validNodeIds),
    created_at: createdAt,
    updated_at: normalizedDate(card.updated_at, createdAt),
  };
}

/** @param {unknown} input @param {Set<string>} validNodeIds @param {string} now */
function normalizeNegativeResult(input, validNodeIds, now) {
  const result = isRecord(input) ? input : {};
  const id = normalizedId(result.id);
  if (!id) return null;
  const status = typeof result.status === 'string' && VALID_RESULT_STATUSES.has(result.status)
    ? result.status
    : 'observed';
  const createdAt = normalizedDate(result.created_at, now);
  return {
    id,
    title: boundedText(result.title, LIMITS.title) || 'Untitled negative result',
    status,
    node_ids: normalizedNodeIds(result.node_ids, validNodeIds),
    observation: boundedText(result.observation, LIMITS.resultText),
    challenged_mechanism: boundedText(result.challenged_mechanism, LIMITS.resultText),
    next_test: boundedText(result.next_test, LIMITS.resultText),
    created_at: createdAt,
    updated_at: normalizedDate(result.updated_at, createdAt),
  };
}

/**
 * Create one empty research workspace.
 * @param {{id:string,title?:string,now?:string}} options
 */
export function createWorkspace({ id, title = 'Research workspace', now = new Date().toISOString() }) {
  const normalized = normalizedId(id);
  if (!normalized) throw new Error('Workspace ID must be a stable, bounded identifier');
  const timestamp = normalizedDate(now, new Date().toISOString());
  return {
    id: normalized,
    title: boundedText(title, LIMITS.title) || 'Research workspace',
    node_ids: [],
    notes: '',
    bridge_cards: [],
    negative_results: [],
    created_at: timestamp,
    updated_at: timestamp,
  };
}

/**
 * Create a library with one initial workspace.
 * @param {{workspaceId?:string,title?:string,now?:string}} [options]
 */
export function createWorkspaceLibrary(options = {}) {
  const now = normalizedDate(options.now, new Date().toISOString());
  const workspace = createWorkspace({
    id: options.workspaceId ?? 'workspace.default',
    title: options.title ?? 'Research workspace',
    now,
  });
  return {
    schema_version: WORKSPACE_SCHEMA_VERSION,
    active_workspace_id: workspace.id,
    workspaces: [workspace],
    updated_at: now,
  };
}

/**
 * Normalize one workspace while discarding references to unknown graph nodes.
 * @param {unknown} input
 * @param {Set<string>} validNodeIds
 * @param {string} [now]
 */
export function normalizeWorkspace(input, validNodeIds, now = new Date().toISOString()) {
  const workspace = isRecord(input) ? input : {};
  const id = normalizedId(workspace.id);
  if (!id) return null;
  const timestamp = normalizedDate(now, new Date().toISOString());
  const createdAt = normalizedDate(workspace.created_at, timestamp);
  const bridgeCards = Array.isArray(workspace.bridge_cards)
    ? workspace.bridge_cards
      .map((card) => normalizeBridgeCard(card, validNodeIds, timestamp))
      .filter(Boolean)
      .slice(0, LIMITS.bridgeCards)
    : [];
  const negativeResults = Array.isArray(workspace.negative_results)
    ? workspace.negative_results
      .map((result) => normalizeNegativeResult(result, validNodeIds, timestamp))
      .filter(Boolean)
      .slice(0, LIMITS.negativeResults)
    : [];
  return {
    id,
    title: boundedText(workspace.title, LIMITS.title) || 'Research workspace',
    node_ids: normalizedNodeIds(workspace.node_ids, validNodeIds),
    notes: typeof workspace.notes === 'string' ? workspace.notes.slice(0, LIMITS.notes) : '',
    bridge_cards: uniqueById(bridgeCards),
    negative_results: uniqueById(negativeResults),
    created_at: createdAt,
    updated_at: normalizedDate(workspace.updated_at, createdAt),
  };
}

/** @template {{id:string}} T @param {T[]} items */
function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/**
 * Normalize a complete local workspace library.
 * @param {unknown} input
 * @param {Set<string>} validNodeIds
 * @param {{now?:string,fallbackWorkspaceId?:string}} [options]
 */
export function normalizeWorkspaceLibrary(input, validNodeIds, options = {}) {
  const now = normalizedDate(options.now, new Date().toISOString());
  if (!isRecord(input) || input.schema_version !== WORKSPACE_SCHEMA_VERSION || !Array.isArray(input.workspaces)) {
    return createWorkspaceLibrary({ workspaceId: options.fallbackWorkspaceId ?? 'workspace.default', now });
  }
  const workspaces = uniqueById(input.workspaces
    .map((workspace) => normalizeWorkspace(workspace, validNodeIds, now))
    .filter(Boolean))
    .slice(0, LIMITS.workspaces);
  if (workspaces.length === 0) {
    return createWorkspaceLibrary({ workspaceId: options.fallbackWorkspaceId ?? 'workspace.default', now });
  }
  const requestedActive = normalizedId(input.active_workspace_id);
  const activeWorkspaceId = workspaces.some((workspace) => workspace.id === requestedActive)
    ? requestedActive
    : workspaces[0].id;
  return {
    schema_version: WORKSPACE_SCHEMA_VERSION,
    active_workspace_id: activeWorkspaceId,
    workspaces,
    updated_at: normalizedDate(input.updated_at, now),
  };
}

/** @param {Storage} storage @param {Set<string>} validNodeIds */
export function loadWorkspaceLibrary(storage, validNodeIds) {
  try {
    const raw = storage.getItem(WORKSPACE_STORAGE_KEY);
    return raw ? normalizeWorkspaceLibrary(JSON.parse(raw), validNodeIds) : createWorkspaceLibrary();
  } catch {
    return createWorkspaceLibrary();
  }
}

/** @param {Storage} storage @param {unknown} library @param {Set<string>} validNodeIds */
export function saveWorkspaceLibrary(storage, library, validNodeIds) {
  const normalized = normalizeWorkspaceLibrary(library, validNodeIds);
  normalized.updated_at = new Date().toISOString();
  try {
    storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return normalized;
  }
}

/** @param {unknown} library @param {Set<string>} validNodeIds @param {string} [now] */
export function exportWorkspaceLibrary(library, validNodeIds, now = new Date().toISOString()) {
  const normalized = normalizeWorkspaceLibrary(library, validNodeIds, { now });
  return JSON.stringify({
    application: WORKSPACE_APPLICATION,
    schema_version: WORKSPACE_SCHEMA_VERSION,
    exported_at: normalizedDate(now, new Date().toISOString()),
    library: normalized,
  }, null, 2);
}

/** @param {{size:number,type?:string,name?:string}} file */
export function validateWorkspaceFile(file) {
  if (!file || !Number.isFinite(file.size) || file.size < 0) throw new Error('Invalid workspace file');
  if (file.size > MAX_WORKSPACE_IMPORT_BYTES) throw new Error('Workspace import exceeds the size limit');
  const name = String(file.name ?? '').trim().toLowerCase();
  if (name && !name.endsWith('.json')) throw new Error('Workspace import filename must end in .json');
  const type = String(file.type ?? '').split(';', 1)[0].trim().toLowerCase();
  const compatible = new Set(['', 'application/json', 'text/json', 'application/octet-stream', 'text/plain']);
  if (!compatible.has(type) && !type.endsWith('+json')) throw new Error('Workspace import must use a JSON-compatible media type');
  return true;
}

/** @param {string} text @param {Set<string>} validNodeIds @param {string} [now] */
export function importWorkspaceLibrary(text, validNodeIds, now = new Date().toISOString()) {
  if (typeof text !== 'string') throw new Error('Workspace import must be text');
  if (new TextEncoder().encode(text).length > MAX_WORKSPACE_IMPORT_BYTES) {
    throw new Error('Workspace import exceeds the size limit');
  }
  const parsed = requireRecord(JSON.parse(text), 'Workspace import must contain a JSON object');
  if (parsed.application !== WORKSPACE_APPLICATION) throw new Error('Workspace export belongs to another application');
  if (parsed.schema_version !== WORKSPACE_SCHEMA_VERSION) throw new Error('Unsupported workspace export schema version');
  const rawLibrary = requireRecord(parsed.library, 'Workspace export library must be an object');
  if (rawLibrary.schema_version !== WORKSPACE_SCHEMA_VERSION) throw new Error('Unsupported workspace library schema version');
  const rawWorkspaces = requireArray(rawLibrary.workspaces, 'Workspace library workspaces must be an array');
  if (rawWorkspaces.length > LIMITS.workspaces) throw new Error('Workspace import contains too many workspaces');
  const usableWorkspaces = rawWorkspaces
    .map((workspace) => normalizeWorkspace(workspace, validNodeIds, now))
    .filter(Boolean);
  if (usableWorkspaces.length === 0) throw new Error('Workspace import contains no usable workspaces');
  return normalizeWorkspaceLibrary({ ...rawLibrary, workspaces: usableWorkspaces }, validNodeIds, { now });
}

/**
 * Merge two normalized libraries. Newer workspace timestamps win per ID; unique
 * workspaces are preserved. The incoming active workspace is used when present.
 * @param {unknown} current
 * @param {unknown} incoming
 * @param {Set<string>} validNodeIds
 * @param {string} [now]
 */
export function mergeWorkspaceLibraries(current, incoming, validNodeIds, now = new Date().toISOString()) {
  const local = normalizeWorkspaceLibrary(current, validNodeIds, { now });
  const imported = normalizeWorkspaceLibrary(incoming, validNodeIds, { now });
  const byId = new Map(local.workspaces.map((workspace) => [workspace.id, workspace]));
  for (const workspace of imported.workspaces) {
    const existing = byId.get(workspace.id);
    if (!existing || Date.parse(workspace.updated_at) >= Date.parse(existing.updated_at)) byId.set(workspace.id, workspace);
  }
  const workspaces = [...byId.values()]
    .sort((left, right) => Date.parse(right.updated_at) - Date.parse(left.updated_at) || left.id.localeCompare(right.id))
    .slice(0, LIMITS.workspaces);
  const requestedActive = imported.active_workspace_id;
  return {
    schema_version: WORKSPACE_SCHEMA_VERSION,
    // Normalization guarantees that the imported active ID belongs to an
    // imported workspace, and the merge always preserves that workspace.
    active_workspace_id: requestedActive,
    workspaces,
    updated_at: normalizedDate(now, new Date().toISOString()),
  };
}

/** @param {Set<string>|string[]} left @param {Set<string>|string[]} right */
export function compareNodeSets(left, right) {
  const leftSet = left instanceof Set ? left : new Set(left);
  const rightSet = right instanceof Set ? right : new Set(right);
  return {
    left_only: [...leftSet].filter((id) => !rightSet.has(id)).sort(),
    shared: [...leftSet].filter((id) => rightSet.has(id)).sort(),
    right_only: [...rightSet].filter((id) => !leftSet.has(id)).sort(),
    union: [...new Set([...leftSet, ...rightSet])].sort(),
  };
}

/** @param {unknown} workspace @param {Set<string>} validNodeIds @param {string} [now] */
export function touchWorkspace(workspace, validNodeIds, now = new Date().toISOString()) {
  const normalized = normalizeWorkspace(workspace, validNodeIds, now);
  if (!normalized) throw new Error('Cannot update an invalid workspace');
  normalized.updated_at = normalizedDate(now, new Date().toISOString());
  return normalized;
}
