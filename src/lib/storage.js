// @ts-check
/** @typedef {import('./types.js').AppProgress} AppProgress */
/** @typedef {import('./types.js').ProgressStatus} ProgressStatus */

export const STORAGE_KEY = 'physmath-knowledge-tree:progress:v1';
export const PREFERENCE_KEY = 'physmath-knowledge-tree:preferences:v1';
export const MAX_IMPORT_BYTES = 1_000_000;

/** @returns {AppProgress} */
export function createEmptyProgress() {
  return { schemaVersion: 1, statuses: {}, favorites: [], updatedAt: new Date().toISOString() };
}

/** @param {unknown} input @param {Set<string>} validIds @returns {AppProgress} */
export function sanitizeProgress(input, validIds) {
  const empty = createEmptyProgress();
  if (!input || typeof input !== 'object') return empty;
  const candidate = /** @type {Record<string, unknown>} */ (input);
  const rawStatuses = candidate.statuses && typeof candidate.statuses === 'object'
    ? /** @type {Record<string, unknown>} */ (candidate.statuses)
    : {};
  const statuses = {};
  for (const [id, status] of Object.entries(rawStatuses)) {
    if (validIds.has(id) && ['not-started', 'learning', 'mastered'].includes(String(status))) {
      statuses[id] = /** @type {ProgressStatus} */ (status);
    }
  }
  const favorites = Array.isArray(candidate.favorites)
    ? candidate.favorites.filter((id) => typeof id === 'string' && validIds.has(id))
    : [];
  const updatedAt = typeof candidate.updatedAt === 'string' && !Number.isNaN(Date.parse(candidate.updatedAt))
    ? candidate.updatedAt
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
    application: 'PhysMath Knowledge Tree',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    progress,
  }, null, 2);
}

/** @param {string} text @param {Set<string>} validIds */
export function importProgress(text, validIds) {
  if (typeof text !== 'string') throw new Error('Progress import must be text');
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error('Progress import exceeds the size limit');
  const parsed = JSON.parse(text);
  const payload = parsed && typeof parsed === 'object' && 'progress' in parsed ? parsed.progress : parsed;
  return sanitizeProgress(payload, validIds);
}

/** @param {{size:number,type?:string,name?:string}} file */
export function validateProgressFile(file) {
  if (!file || typeof file.size !== 'number' || !Number.isFinite(file.size) || file.size < 0) throw new Error('Invalid progress file');
  if (file.size > MAX_IMPORT_BYTES) throw new Error('Progress import exceeds the size limit');
  const type = file.type ?? '';
  const name = file.name ?? '';
  if (type && type !== 'application/json' && !name.toLowerCase().endsWith('.json')) throw new Error('Progress import must be JSON');
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
