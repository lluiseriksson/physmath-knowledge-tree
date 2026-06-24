// @ts-check

export const REVIEW_SCHEMA_VERSION = 1;
export const REVIEW_APPLICATION = 'PhysMath Knowledge Tree';
export const REVIEW_STORAGE_KEY = 'physmath.evidence.reviews.v1';
export const MAX_REVIEW_IMPORT_BYTES = 2_000_000;
export const MAX_REVIEW_RECORDS = 10_000;

export const REVIEW_STATUSES = Object.freeze([
  'unreviewed',
  'verified',
  'needs-follow-up',
  'superseded',
]);

export const SOURCE_CLASSES = Object.freeze([
  'unknown',
  'primary',
  'secondary',
  'official',
]);

export const IDENTIFIER_KINDS = Object.freeze([
  'doi',
  'arxiv',
  'isbn',
  'other',
]);

const REFERENCE_SCOPES = new Set(['claim', 'context', 'formalization']);
const STATUS_SET = new Set(REVIEW_STATUSES);
const SOURCE_CLASS_SET = new Set(SOURCE_CLASSES);
const IDENTIFIER_KIND_SET = new Set(IDENTIFIER_KINDS);
const TYPE_PATTERN = /^[a-z][a-z0-9._-]{0,63}$/u;
const USAGE_PATTERN = /^(?:node|edge):[a-z0-9._-]+$/u;

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @param {number} maximum */
function boundedText(value, maximum) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

/** @param {unknown} value */
function optionalDate(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return null;
  return value;
}

/** @param {unknown} value @param {string} label */
function requireDate(value, label) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} must be an ISO-compatible date`);
  }
  return value;
}

/** @param {unknown} value @param {string} label */
function requireHttpUrl(value, label) {
  if (typeof value !== 'string' || value !== value.trim() || !value) {
    throw new Error(`${label} must be a normalized URL`);
  }
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute URL`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error(`${label} must use HTTP(S) without credentials`);
  }
  return value;
}

/** @param {unknown} input */
function normalizeIdentifier(input) {
  if (!isRecord(input)) return null;
  const kind = boundedText(input.kind, 32).toLowerCase();
  const value = boundedText(input.value, 500);
  if (!kind || !value || !IDENTIFIER_KIND_SET.has(kind)) return null;
  return { kind, value };
}

/**
 * Validate and normalize the generated URL-level reference registry.
 * @param {unknown} input
 */
export function normalizeReferenceRegistry(input) {
  if (!isRecord(input)) throw new Error('Reference registry must be an object');
  if (!Array.isArray(input.references)) throw new Error('Reference registry references must be an array');
  const seen = new Set();
  const references = input.references.map((candidate, index) => {
    if (!isRecord(candidate)) throw new Error(`Reference ${index} must be an object`);
    const url = requireHttpUrl(candidate.url, `Reference ${index} URL`);
    if (seen.has(url)) throw new Error(`Duplicate reference URL: ${url}`);
    seen.add(url);
    const label = boundedText(candidate.label, 600);
    if (!label) throw new Error(`Reference ${index} needs a label`);
    const type = boundedText(candidate.type, 64).toLowerCase();
    if (!TYPE_PATTERN.test(type)) throw new Error(`Reference ${index} has an invalid type`);
    if (!Array.isArray(candidate.scopes) || candidate.scopes.length === 0) {
      throw new Error(`Reference ${index} needs at least one scope`);
    }
    const scopes = [...new Set(candidate.scopes.map((scope) => boundedText(scope, 32).toLowerCase()))].sort();
    if (scopes.some((scope) => !REFERENCE_SCOPES.has(scope))) {
      throw new Error(`Reference ${index} has an invalid scope`);
    }
    if (!Array.isArray(candidate.used_by)) throw new Error(`Reference ${index} used_by must be an array`);
    const usedBy = [...new Set(candidate.used_by.map((value) => boundedText(value, 240)))].sort();
    if (usedBy.some((value) => !USAGE_PATTERN.test(value))) {
      throw new Error(`Reference ${index} has an invalid usage target`);
    }
    return { url, label, type, scopes, used_by: usedBy };
  });
  return {
    schema_version: boundedText(input.schema_version, 64),
    graph_schema_version: boundedText(input.graph_schema_version, 64),
    references,
  };
}

/**
 * Infer a portable publication identifier from well-known URL shapes.
 * The result is a suggestion only; it never changes canonical evidence.
 * @param {string} value
 */
export function inferPublicationIdentifier(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  const path = decodeURIComponent(url.pathname).replace(/\/+$/u, '');
  if (host === 'doi.org' || host === 'dx.doi.org') {
    const doi = path.replace(/^\/+/, '');
    return doi ? { kind: 'doi', value: doi } : null;
  }
  if (host === 'arxiv.org' || host === 'www.arxiv.org') {
    const match = /^\/(?:abs|pdf)\/(.+?)(?:\.pdf)?$/u.exec(path);
    return match?.[1] ? { kind: 'arxiv', value: match[1] } : null;
  }
  const embeddedDoi = /\/(10\.\d{4,9}\/.+)$/u.exec(path)?.[1];
  return embeddedDoi ? { kind: 'doi', value: embeddedDoi } : null;
}

/** @param {string} now */
export function createReviewLedger(now = new Date().toISOString()) {
  return {
    schema_version: REVIEW_SCHEMA_VERSION,
    updated_at: requireDate(now, 'Review ledger updated_at'),
    reviews: [],
  };
}

/** @param {unknown} input @param {Set<string>} validUrls @param {string} now */
function normalizeReview(input, validUrls, now) {
  if (!isRecord(input)) return null;
  const url = typeof input.url === 'string' ? input.url : '';
  if (!validUrls.has(url)) return null;
  const status = boundedText(input.status, 32).toLowerCase();
  const sourceClass = boundedText(input.source_class, 32).toLowerCase();
  return {
    url,
    status: STATUS_SET.has(status) ? status : 'unreviewed',
    source_class: SOURCE_CLASS_SET.has(sourceClass) ? sourceClass : 'unknown',
    identifier: normalizeIdentifier(input.identifier),
    checked_at: optionalDate(input.checked_at),
    notes: boundedText(input.notes, 12_000),
    updated_at: optionalDate(input.updated_at) ?? now,
  };
}

/**
 * Sanitize a local review ledger against the current canonical registry.
 * Unknown URLs are discarded rather than reattached to another source.
 * @param {unknown} input
 * @param {Set<string>} validUrls
 * @param {string} [now]
 */
export function normalizeReviewLedger(input, validUrls, now = new Date().toISOString()) {
  const fallback = createReviewLedger(now);
  if (!isRecord(input) || input.schema_version !== REVIEW_SCHEMA_VERSION || !Array.isArray(input.reviews)) {
    return fallback;
  }
  const byUrl = new Map();
  for (const raw of input.reviews.slice(0, MAX_REVIEW_RECORDS)) {
    const review = normalizeReview(raw, validUrls, now);
    if (!review) continue;
    const previous = byUrl.get(review.url);
    if (!previous || Date.parse(review.updated_at) >= Date.parse(previous.updated_at)) byUrl.set(review.url, review);
  }
  return {
    schema_version: REVIEW_SCHEMA_VERSION,
    updated_at: optionalDate(input.updated_at) ?? now,
    reviews: [...byUrl.values()].sort((left, right) => left.url.localeCompare(right.url)),
  };
}

/** @param {Storage} storage @param {Set<string>} validUrls */
export function loadReviewLedger(storage, validUrls) {
  try {
    const raw = storage.getItem(REVIEW_STORAGE_KEY);
    return raw ? normalizeReviewLedger(JSON.parse(raw), validUrls) : createReviewLedger();
  } catch {
    return createReviewLedger();
  }
}

/** @param {Storage} storage @param {unknown} ledger @param {Set<string>} validUrls @param {string} [now] */
export function saveReviewLedger(storage, ledger, validUrls, now = new Date().toISOString()) {
  const normalized = normalizeReviewLedger(ledger, validUrls, now);
  const next = { ...normalized, updated_at: requireDate(now, 'Review ledger updated_at') };
  try {
    storage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage policy, private mode and quota failures must not break review work.
  }
  return next;
}

/** @param {unknown} ledger @param {Set<string>} validUrls @param {string} [now] */
export function exportReviewLedger(ledger, validUrls, now = new Date().toISOString()) {
  const exportedAt = requireDate(now, 'Review export date');
  return JSON.stringify({
    application: REVIEW_APPLICATION,
    schema_version: REVIEW_SCHEMA_VERSION,
    exported_at: exportedAt,
    ledger: normalizeReviewLedger(ledger, validUrls, exportedAt),
  }, null, 2);
}

/** @param {{size:number,type?:string,name?:string}} file */
export function validateReviewFile(file) {
  if (!file || typeof file.size !== 'number' || !Number.isFinite(file.size) || file.size < 0) {
    throw new Error('Invalid review file');
  }
  if (file.size > MAX_REVIEW_IMPORT_BYTES) throw new Error('Review import exceeds the size limit');
  const type = (file.type ?? '').split(';', 1)[0].trim().toLowerCase();
  const name = (file.name ?? '').trim();
  if (name && !name.toLowerCase().endsWith('.json')) throw new Error('Review import filename must end in .json');
  const compatible = new Set(['application/json', 'text/json', 'application/octet-stream', 'text/plain']);
  if (type && !compatible.has(type) && !type.endsWith('+json')) {
    throw new Error('Review import must use a JSON-compatible media type');
  }
  return true;
}

/** @param {unknown} parsed */
function extractImportedLedger(parsed) {
  if (!isRecord(parsed)) throw new Error('Review import must contain a JSON object');
  if (!Object.hasOwn(parsed, 'ledger')) return parsed;
  if (parsed.application !== REVIEW_APPLICATION) throw new Error('Review export belongs to another application');
  if (parsed.schema_version !== REVIEW_SCHEMA_VERSION) throw new Error('Unsupported review export schema version');
  if (!isRecord(parsed.ledger)) throw new Error('Review export ledger must be an object');
  return parsed.ledger;
}

/** @param {string} text @param {Set<string>} validUrls @param {string} [now] */
export function importReviewLedger(text, validUrls, now = new Date().toISOString()) {
  if (typeof text !== 'string') throw new Error('Review import must be text');
  if (new TextEncoder().encode(text).length > MAX_REVIEW_IMPORT_BYTES) {
    throw new Error('Review import exceeds the size limit');
  }
  const raw = extractImportedLedger(JSON.parse(text));
  if (!isRecord(raw) || raw.schema_version !== REVIEW_SCHEMA_VERSION || !Array.isArray(raw.reviews)) {
    throw new Error('Unsupported review ledger schema');
  }
  const referenced = raw.reviews
    .map((review) => isRecord(review) && typeof review.url === 'string' ? review.url : '')
    .filter(Boolean);
  if (referenced.length > 0 && !referenced.some((url) => validUrls.has(url))) {
    throw new Error('Review import does not contain references from this registry');
  }
  return normalizeReviewLedger(raw, validUrls, now);
}

/** @param {unknown} current @param {unknown} incoming @param {Set<string>} validUrls @param {string} [now] */
export function mergeReviewLedgers(current, incoming, validUrls, now = new Date().toISOString()) {
  const left = normalizeReviewLedger(current, validUrls, now);
  const right = normalizeReviewLedger(incoming, validUrls, now);
  const merged = new Map(left.reviews.map((review) => [review.url, review]));
  for (const review of right.reviews) {
    const previous = merged.get(review.url);
    if (!previous || Date.parse(review.updated_at) >= Date.parse(previous.updated_at)) merged.set(review.url, review);
  }
  return normalizeReviewLedger({
    schema_version: REVIEW_SCHEMA_VERSION,
    updated_at: now,
    reviews: [...merged.values()],
  }, validUrls, now);
}

/** @param {unknown} ledger @param {unknown} record @param {Set<string>} validUrls @param {string} [now] */
export function upsertReview(ledger, record, validUrls, now = new Date().toISOString()) {
  const normalizedLedger = normalizeReviewLedger(ledger, validUrls, now);
  const normalizedRecord = normalizeReview({
    ...(isRecord(record) ? record : {}),
    updated_at: now,
  }, validUrls, now);
  if (!normalizedRecord) throw new Error('Review URL is not present in the canonical registry');
  const reviews = normalizedLedger.reviews.filter(({ url }) => url !== normalizedRecord.url);
  reviews.push(normalizedRecord);
  return normalizeReviewLedger({
    schema_version: REVIEW_SCHEMA_VERSION,
    updated_at: now,
    reviews,
  }, validUrls, now);
}

/** @param {unknown} ledger @param {string} url @param {Set<string>} validUrls @param {string} [now] */
export function removeReview(ledger, url, validUrls, now = new Date().toISOString()) {
  const normalized = normalizeReviewLedger(ledger, validUrls, now);
  return {
    schema_version: REVIEW_SCHEMA_VERSION,
    updated_at: requireDate(now, 'Review ledger updated_at'),
    reviews: normalized.reviews.filter((review) => review.url !== url),
  };
}

/** @param {unknown} value */
function normalizeSearch(value) {
  return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/** @param {ReturnType<typeof normalizeReferenceRegistry>['references'][number]} reference @param {any} review */
function makeWorkItem(reference, review) {
  const inferredIdentifier = inferPublicationIdentifier(reference.url);
  const nodeUsage = reference.used_by.filter((value) => value.startsWith('node:')).length;
  const edgeUsage = reference.used_by.length - nodeUsage;
  const status = review?.status ?? 'unreviewed';
  const sourceClass = review?.source_class ?? 'unknown';
  const identifier = review?.identifier ?? null;
  const claimBearing = reference.scopes.includes('claim');
  const formalizationBearing = reference.scopes.includes('formalization');
  const contextOnly = reference.scopes.length === 1 && reference.scopes[0] === 'context';
  const identifierMissing = ['paper', 'book', 'survey'].includes(reference.type)
    && !identifier && !inferredIdentifier;
  const statusWeight = {
    'needs-follow-up': 80,
    unreviewed: 40,
    superseded: 12,
    verified: 0,
  }[status];
  const scopeWeight = (formalizationBearing ? 20 : 0) + (claimBearing ? 14 : 0) + (contextOnly ? 2 : 0);
  const priorityScore = statusWeight + scopeWeight + Math.min(50, reference.used_by.length * 2)
    + (identifierMissing ? 4 : 0) + (sourceClass === 'unknown' ? 3 : 0);
  return {
    reference,
    review: review ?? null,
    status,
    source_class: sourceClass,
    identifier,
    checked_at: review?.checked_at ?? null,
    notes: review?.notes ?? '',
    updated_at: review?.updated_at ?? null,
    inferred_identifier: inferredIdentifier,
    identifier_missing: identifierMissing,
    usage_count: reference.used_by.length,
    node_usage: nodeUsage,
    edge_usage: edgeUsage,
    claim_bearing: claimBearing,
    formalization_bearing: formalizationBearing,
    context_only: contextOnly,
    priority_score: priorityScore,
  };
}

/**
 * Build a deterministic, filterable review queue without changing canonical data.
 * @param {unknown} registry
 * @param {unknown} ledger
 * @param {{query?:string,status?:string,scope?:string,type?:string,usage?:string,sort?:string,limit?:number}} [options]
 */
export function buildEvidenceWorklist(registry, ledger, options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new Error('Worklist options must be an object');
  const normalizedRegistry = normalizeReferenceRegistry(registry);
  const validUrls = new Set(normalizedRegistry.references.map(({ url }) => url));
  const normalizedLedger = normalizeReviewLedger(ledger, validUrls);
  const reviewByUrl = new Map(normalizedLedger.reviews.map((review) => [review.url, review]));
  const query = normalizeSearch(options.query);
  const status = options.status ?? 'all';
  const scope = options.scope ?? 'all';
  const type = options.type ?? 'all';
  const usage = options.usage ?? 'all';
  const sort = options.sort ?? 'priority';
  const allowedSorts = new Set(['priority', 'usage', 'label', 'status', 'updated']);
  if (!allowedSorts.has(sort)) throw new Error(`Unknown evidence worklist sort: ${sort}`);
  const limit = options.limit === undefined ? Number.POSITIVE_INFINITY : Number(options.limit);
  if ((!Number.isInteger(limit) && limit !== Number.POSITIVE_INFINITY) || limit < 0) {
    throw new Error('Evidence worklist limit must be a non-negative integer');
  }

  const items = normalizedRegistry.references
    .map((reference) => makeWorkItem(reference, reviewByUrl.get(reference.url)))
    .filter((item) => status === 'all' || item.status === status)
    .filter((item) => scope === 'all' || item.reference.scopes.includes(scope))
    .filter((item) => type === 'all' || item.reference.type === type)
    .filter((item) => usage === 'all'
      || (usage === 'node' && item.node_usage > 0)
      || (usage === 'edge' && item.edge_usage > 0)
      || (usage === 'mixed' && item.node_usage > 0 && item.edge_usage > 0))
    .filter((item) => {
      if (!query) return true;
      const haystack = normalizeSearch([
        item.reference.label,
        item.reference.url,
        item.reference.type,
        ...item.reference.scopes,
        ...item.reference.used_by,
        item.status,
        item.source_class,
        item.identifier?.kind,
        item.identifier?.value,
        item.inferred_identifier?.kind,
        item.inferred_identifier?.value,
        item.notes,
      ].filter(Boolean).join(' '));
      return query.split(/\s+/u).every((term) => haystack.includes(term));
    });

  const statusRank = new Map(REVIEW_STATUSES.map((value, index) => [value, index]));
  items.sort((left, right) => {
    if (sort === 'usage') return right.usage_count - left.usage_count || left.reference.label.localeCompare(right.reference.label);
    if (sort === 'label') return left.reference.label.localeCompare(right.reference.label) || left.reference.url.localeCompare(right.reference.url);
    if (sort === 'status') return statusRank.get(left.status) - statusRank.get(right.status) || right.priority_score - left.priority_score || left.reference.label.localeCompare(right.reference.label);
    if (sort === 'updated') return (Date.parse(right.updated_at ?? '') || 0) - (Date.parse(left.updated_at ?? '') || 0) || left.reference.label.localeCompare(right.reference.label);
    return right.priority_score - left.priority_score || right.usage_count - left.usage_count || left.reference.label.localeCompare(right.reference.label);
  });
  return items.slice(0, limit);
}

/** @param {unknown} registry @param {unknown} ledger */
export function summarizeEvidenceReviews(registry, ledger) {
  const items = buildEvidenceWorklist(registry, ledger);
  const byStatus = Object.fromEntries(REVIEW_STATUSES.map((status) => [status, 0]));
  for (const item of items) byStatus[item.status] += 1;
  return {
    total: items.length,
    reviewed: items.length - byStatus.unreviewed,
    by_status: byStatus,
    claim_bearing: items.filter(({ claim_bearing }) => claim_bearing).length,
    formalization_bearing: items.filter(({ formalization_bearing }) => formalization_bearing).length,
    high_impact_unreviewed: items.filter((item) => item.status === 'unreviewed' && item.usage_count >= 5).length,
    recognized_identifiers: items.filter((item) => item.identifier || item.inferred_identifier).length,
    source_types: [...new Set(items.map((item) => item.reference.type))].sort(),
  };
}

/**
 * Export a bounded handoff containing selected canonical references and local review state.
 * @param {unknown} registry
 * @param {unknown} ledger
 * @param {Iterable<string>} selectedUrls
 * @param {string} [now]
 */
export function buildReviewPacket(registry, ledger, selectedUrls, now = new Date().toISOString()) {
  const generatedAt = requireDate(now, 'Review packet date');
  const normalizedRegistry = normalizeReferenceRegistry(registry);
  const validUrls = new Set(normalizedRegistry.references.map(({ url }) => url));
  const selected = new Set([...selectedUrls].filter((url) => validUrls.has(url)));
  if (selected.size === 0) throw new Error('Review packet needs at least one canonical reference');
  const normalizedLedger = normalizeReviewLedger(ledger, validUrls, generatedAt);
  const reviewByUrl = new Map(normalizedLedger.reviews.map((review) => [review.url, review]));
  const references = normalizedRegistry.references
    .filter(({ url }) => selected.has(url))
    .map((reference) => makeWorkItem(reference, reviewByUrl.get(reference.url)))
    .sort((left, right) => left.reference.url.localeCompare(right.reference.url))
    .map((item) => ({
      reference: item.reference,
      review: item.review,
      inferred_identifier: item.inferred_identifier,
      priority_score: item.priority_score,
    }));
  return {
    application: REVIEW_APPLICATION,
    schema_version: REVIEW_SCHEMA_VERSION,
    generated_at: generatedAt,
    registry_schema_version: normalizedRegistry.schema_version,
    graph_schema_version: normalizedRegistry.graph_schema_version,
    reference_count: references.length,
    references,
  };
}
