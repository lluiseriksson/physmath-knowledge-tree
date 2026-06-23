// @ts-check
/** @typedef {import('./types.js').AppProgress} AppProgress */
/** @typedef {import('./types.js').ProgressStatus} ProgressStatus */

export const STORAGE_KEY = 'physmath-knowledge-tree:progress:v1';
export const PREFERENCE_KEY = 'physmath-knowledge-tree:preferences:v1';
export const MAX_IMPORT_BYTES = 1_000_000;
const APPLICATION_NAME = 'PhysMath Knowledge Tree';
const PROGRESS_SCHEMA_VERSION = 1;
const VALID_STATUSES = new Set(['not-started', 'learning', 'mastered']);

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** @returns {AppProgress} */
export function createEmptyProgress() {
  return { schemaVersion: 1, statuses: {}, favorites: [], updatedAt: new Date().toISOString() };
}

/** @param {unknown} input @param {Set<string>} validIds @returns {AppProgress} */
export function sanitizeProgress(input, validIds) {
  const empty = createEmptyProgress();
  if (!isRecord(input)) return empty;
  const rawStatuses = isRecord(input.statuses) ? input.statuses : {};
  const statuses = {};
  for (const [id, status] of Object.entries(rawStatuses)) {
    if (validIds.has(id) && VALID_STATUSES.has(String(status))) {
      statuses[id] = /** @type {ProgressStatus} */ (status);
    }
  }
  const favorites = Array.isArray(input.favorites)
    ? input.favorites.filter((id) => typeof id === 'string' && validIds.has(id))
    : [];
  const updatedAt = typeof input.updatedAt === 'string' && !Number.isNaN(Date.parse(input.updatedAt))
    ? input.updatedAt
    : empty.updatedAt;
  return { schemaVersion: 1, statuses, favorites: [...new Set(favorites)], updatedAt };
}

/** @param {Set<string>} validIds @param {Storage} [storage] */
export function loadProgress(validIds, storage = localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? sanitizeProgress(JSON.parse(raw), validIds) : createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
}

/** @param {AppProgress} progress @param {Storage} [storage] */
export function saveProgress(progress, storage = localStorage) {
  const next = { ...progress, updatedAt: new Date().toISOString() };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode, storage policy or quota exhaustion must not break the app.
  }
  return next;
}

/** @param {AppProgress} progress */
export function exportProgress(progress) {
  return JSON.stringify({
    application: APPLICATION_NAME,
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
  }, null, 2);
}

/** @param {unknown} parsed @returns {Record<string, unknown>} */
function extractImportedProgress(parsed) {
  if (!isRecord(parsed)) throw new Error('Progress import must contain a JSON object');
  if (!Object.hasOwn(parsed, 'progress')) return parsed;
  if (parsed.application !== APPLICATION_NAME) throw new Error('Progress export belongs to another application');
  if (parsed.schemaVersion !== PROGRESS_SCHEMA_VERSION) throw new Error('Unsupported progress export schema version');
  if (!isRecord(parsed.progress)) throw new Error('Progress export payload must be an object');
  return parsed.progress;
}

/** @param {Record<string, unknown>} payload */
function validateImportedProgress(payload) {
  if (payload.schemaVersion !== PROGRESS_SCHEMA_VERSION) throw new Error('Unsupported progress schema version');
  if (!isRecord(payload.statuses)) throw new Error('Progress statuses must be an object');
  if (!Array.isArray(payload.favorites)) throw new Error('Progress favorites must be an array');
  for (const status of Object.values(payload.statuses)) {
    if (typeof status !== 'string' || !VALID_STATUSES.has(status)) throw new Error('Progress contains an invalid status');
  }
  if (payload.favorites.some((id) => typeof id !== 'string')) throw new Error('Progress favorites must contain topic IDs');
  if (Object.hasOwn(payload, 'updatedAt')
      && (typeof payload.updatedAt !== 'string' || Number.isNaN(Date.parse(payload.updatedAt)))) {
    throw new Error('Progress updatedAt must be an ISO-compatible date');
  }
}

/** @param {Record<string, unknown>} payload */
function importedTopicIds(payload) {
  return new Set([
    ...Object.keys(/** @type {Record<string, unknown>} */ (payload.statuses)),
    .../** @type {string[]} */ (payload.favorites),
  ]);
}

/** @param {string} text @param {Set<string>} validIds */
export function importProgress(text, validIds) {
  if (typeof text !== 'string') throw new Error('Progress import must be text');
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error('Progress import exceeds the size limit');
  const payload = extractImportedProgress(JSON.parse(text));
  validateImportedProgress(payload);
  const referencedIds = importedTopicIds(payload);
  if (referencedIds.size > 0 && ![...referencedIds].some((id) => validIds.has(id))) {
    throw new Error('Progress import does not contain any topic IDs from this catalog');
  }
  return sanitizeProgress(payload, validIds);
}

/** @param {{size:number,type?:string,name?:string}} file */
export function validateProgressFile(file) {
  if (!file || typeof file.size !== 'number' || !Number.isFinite(file.size) || file.size < 0) throw new Error('Invalid progress file');
  if (file.size > MAX_IMPORT_BYTES) throw new Error('Progress import exceeds the size limit');
  const type = (file.type ?? '').split(';', 1)[0].trim().toLowerCase();
  const name = (file.name ?? '').trim();
  if (name && !name.toLowerCase().endsWith('.json')) throw new Error('Progress import filename must end in .json');
  const compatibleTypes = new Set(['application/json', 'text/json', 'application/octet-stream', 'text/plain']);
  if (type && !compatibleTypes.has(type) && !type.endsWith('+json')) {
    throw new Error('Progress import must use a JSON-compatible media type');
  }
  return true;
}

export function loadPreference(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFERENCE_KEY);
    const preferences = raw ? JSON.parse(raw) : {};
    return typeof preferences?.[key] === 'string' ? preferences[key] : fallback;
  } catch {
    return fallback;
  }
}

export function savePreference(key, value) {
  try {
    const raw = localStorage.getItem(PREFERENCE_KEY);
    const preferences = raw ? JSON.parse(raw) : {};
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify({ ...preferences, [key]: value }));
  } catch {
    // Preferences are optional and never block core functionality.
  }
}
