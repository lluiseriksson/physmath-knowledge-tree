// @ts-check

export const LEAN_AUDIT_APPLICATION = 'PhysMath Knowledge Tree';
export const LEAN_AUDIT_SCHEMA_VERSION = 1;
export const LEAN_AUDIT_STORAGE_KEY = 'physmath.lean.target.audit.v1';
export const MAX_LEAN_AUDIT_IMPORT_BYTES = 8_000_000;
export const MAX_LEAN_AUDIT_RECORDS = 20_000;

export const LEAN_AUDIT_STATUSES = Object.freeze([
  'unreviewed',
  'verified',
  'missing',
  'renamed',
  'blocked',
]);

export const LEAN_ITEM_TYPES = Object.freeze([
  'import',
  'declaration',
  'target',
]);

const STATUS_SET = new Set(LEAN_AUDIT_STATUSES);
const ITEM_TYPE_SET = new Set(LEAN_ITEM_TYPES);
const NODE_ID_PATTERN = /^[a-z0-9][a-z0-9._-]{0,239}$/u;
const LEAN_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_']*(?:\.[A-Za-z_][A-Za-z0-9_']*)*$/u;
const TYPE_RANK = new Map(['declaration', 'import', 'target'].map((value, index) => [value, index]));
const STATUS_RANK = new Map(LEAN_AUDIT_STATUSES.map((value, index) => [value, index]));

/** Deterministic UTF-16 code-unit ordering, independent of host locale. */
function compareText(left, right) {
  return Number(left > right) - Number(left < right);
}

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
function requireNodeId(value, label) {
  if (typeof value !== 'string' || value !== value.trim() || !NODE_ID_PATTERN.test(value)) {
    throw new Error(`${label} must be a stable lowercase node ID`);
  }
  return value;
}

/** @param {unknown} input @param {string} label @param {number} maximum */
function normalizeStringArray(input, label, maximum) {
  if (input === undefined || input === null) return [];
  if (!Array.isArray(input)) throw new Error(`${label} must be an array`);
  const values = [];
  const seen = new Set();
  for (const [index, candidate] of input.entries()) {
    if (typeof candidate !== 'string') throw new Error(`${label}[${index}] must be text`);
    const value = candidate.trim().slice(0, maximum);
    if (!value) throw new Error(`${label}[${index}] must not be empty`);
    if (!seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  }
  return values.sort((left, right) => compareText(left, right));
}

/** Stable, collision-free item key encoded as canonical JSON text. */
export function leanAuditItemId(nodeId, itemType, value) {
  requireNodeId(nodeId, 'Lean audit node ID');
  if (!ITEM_TYPE_SET.has(itemType)) throw new Error(`Unknown Lean item type: ${itemType}`);
  const normalizedValue = boundedText(value, itemType === 'target' ? 12_000 : 500);
  if (!normalizedValue) throw new Error('Lean audit item value must not be empty');
  return JSON.stringify([nodeId, itemType, normalizedValue]);
}

/** Conservative ASCII Lean module/declaration syntax accepted by generated probes. */
export function isProbeSafeLeanName(value) {
  return typeof value === 'string' && value === value.trim() && LEAN_NAME_PATTERN.test(value);
}

/**
 * Normalize canonical graph nodes into a deterministic Lean audit catalog.
 * @param {unknown} input
 */
export function normalizeLeanCatalog(input) {
  if (!Array.isArray(input)) throw new Error('Lean audit catalog input must be an array of graph nodes');
  const nodeIds = new Set();
  const nodes = input.map((candidate, index) => {
    if (!isRecord(candidate)) throw new Error(`Graph node ${index} must be an object`);
    const id = requireNodeId(candidate.id, `Graph node ${index} ID`);
    if (nodeIds.has(id)) throw new Error(`Duplicate graph node ID: ${id}`);
    nodeIds.add(id);
    const title = boundedText(candidate.title, 600);
    if (!title) throw new Error(`Graph node ${id} needs a title`);
    const kind = boundedText(candidate.kind, 64) || 'unknown';
    const confidence = boundedText(candidate.confidence, 64) || 'unknown';
    const lean = candidate.lean === undefined || candidate.lean === null ? {} : candidate.lean;
    if (!isRecord(lean)) throw new Error(`Graph node ${id} lean metadata must be an object`);
    return {
      id,
      title,
      kind,
      confidence,
      imports: normalizeStringArray(lean.imports, `Graph node ${id} lean.imports`, 500),
      declarations: normalizeStringArray(lean.declarations, `Graph node ${id} lean.declarations`, 500),
      targets: normalizeStringArray(lean.targets, `Graph node ${id} lean.targets`, 12_000),
    };
  }).sort((left, right) => compareText(left.id, right.id));

  const reuseCounts = new Map();
  for (const node of nodes) {
    for (const [itemType, values] of [
      ['import', node.imports],
      ['declaration', node.declarations],
      ['target', node.targets],
    ]) {
      for (const value of values) {
        const key = `${itemType}\0${value}`;
        reuseCounts.set(key, (reuseCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const items = [];
  for (const node of nodes) {
    for (const [itemType, values] of [
      ['import', node.imports],
      ['declaration', node.declarations],
      ['target', node.targets],
    ]) {
      for (const value of values) {
        items.push({
          id: leanAuditItemId(node.id, itemType, value),
          node_id: node.id,
          node_title: node.title,
          node_kind: node.kind,
          node_confidence: node.confidence,
          item_type: itemType,
          value,
          probe_safe: itemType !== 'target' && isProbeSafeLeanName(value),
          reuse_count: reuseCounts.get(`${itemType}\0${value}`),
          node_imports: [...node.imports],
          node_declarations: [...node.declarations],
        });
      }
    }
  }
  items.sort((left, right) => TYPE_RANK.get(left.item_type) - TYPE_RANK.get(right.item_type)
    || compareText(left.node_title, right.node_title)
    || compareText(left.node_id, right.node_id)
    || compareText(left.value, right.value));

  return {
    nodes,
    items,
    stats: {
      nodes: nodes.length,
      items: items.length,
      imports: items.filter(({ item_type: type }) => type === 'import').length,
      declarations: items.filter(({ item_type: type }) => type === 'declaration').length,
      targets: items.filter(({ item_type: type }) => type === 'target').length,
      unique_imports: new Set(items.filter(({ item_type: type }) => type === 'import').map(({ value }) => value)).size,
      unique_declarations: new Set(items.filter(({ item_type: type }) => type === 'declaration').map(({ value }) => value)).size,
      probe_unsafe: items.filter(({ item_type: type, probe_safe: safe }) => type !== 'target' && !safe).length,
    },
  };
}

/** @param {string} [now] */
export function createLeanAuditLedger(now = new Date().toISOString()) {
  return {
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    updated_at: requireDate(now, 'Lean audit ledger updated_at'),
    records: [],
  };
}

/** @param {unknown} input @param {Set<string>} validItemIds @param {string} now */
function normalizeLeanAuditRecord(input, validItemIds, now) {
  if (!isRecord(input)) return null;
  const itemId = typeof input.item_id === 'string' ? input.item_id : '';
  if (!validItemIds.has(itemId)) return null;
  const status = boundedText(input.status, 32).toLowerCase();
  return {
    item_id: itemId,
    status: STATUS_SET.has(status) ? status : 'unreviewed',
    checked_at: optionalDate(input.checked_at),
    toolchain: boundedText(input.toolchain, 300),
    replacement: boundedText(input.replacement, 500),
    notes: boundedText(input.notes, 12_000),
    updated_at: optionalDate(input.updated_at) ?? now,
  };
}

/**
 * Sanitize a local audit ledger against the current catalog.
 * @param {unknown} input
 * @param {Set<string>} validItemIds
 * @param {string} [now]
 */
export function normalizeLeanAuditLedger(input, validItemIds, now = new Date().toISOString()) {
  const fallback = createLeanAuditLedger(now);
  if (!isRecord(input) || input.schema_version !== LEAN_AUDIT_SCHEMA_VERSION || !Array.isArray(input.records)) {
    return fallback;
  }
  const records = new Map();
  for (const raw of input.records.slice(0, MAX_LEAN_AUDIT_RECORDS)) {
    const record = normalizeLeanAuditRecord(raw, validItemIds, now);
    if (!record) continue;
    const previous = records.get(record.item_id);
    if (!previous || Date.parse(record.updated_at) >= Date.parse(previous.updated_at)) records.set(record.item_id, record);
  }
  return {
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    updated_at: optionalDate(input.updated_at) ?? now,
    records: [...records.values()].sort((left, right) => compareText(left.item_id, right.item_id)),
  };
}

/** @param {Storage} storage @param {Set<string>} validItemIds */
export function loadLeanAuditLedger(storage, validItemIds) {
  try {
    const raw = storage.getItem(LEAN_AUDIT_STORAGE_KEY);
    return raw ? normalizeLeanAuditLedger(JSON.parse(raw), validItemIds) : createLeanAuditLedger();
  } catch {
    return createLeanAuditLedger();
  }
}

/** @param {Storage} storage @param {unknown} ledger @param {Set<string>} validItemIds @param {string} [now] */
export function saveLeanAuditLedger(storage, ledger, validItemIds, now = new Date().toISOString()) {
  const normalized = normalizeLeanAuditLedger(ledger, validItemIds, now);
  const next = { ...normalized, updated_at: requireDate(now, 'Lean audit ledger updated_at') };
  try {
    storage.setItem(LEAN_AUDIT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage denial, private mode and quota exhaustion must not break the audit UI.
  }
  return next;
}

/** @param {unknown} ledger @param {Set<string>} validItemIds @param {string} [now] */
export function exportLeanAuditLedger(ledger, validItemIds, now = new Date().toISOString()) {
  const exportedAt = requireDate(now, 'Lean audit export date');
  return JSON.stringify({
    application: LEAN_AUDIT_APPLICATION,
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    exported_at: exportedAt,
    ledger: normalizeLeanAuditLedger(ledger, validItemIds, exportedAt),
  }, null, 2);
}

/** @param {{size:number,type?:string,name?:string}} file */
export function validateLeanAuditFile(file) {
  if (!file || typeof file.size !== 'number' || !Number.isFinite(file.size) || file.size < 0) {
    throw new Error('Invalid Lean audit file');
  }
  if (file.size > MAX_LEAN_AUDIT_IMPORT_BYTES) throw new Error('Lean audit import exceeds the size limit');
  const name = boundedText(file.name, 500);
  if (name && !name.toLowerCase().endsWith('.json')) throw new Error('Lean audit filename must end in .json');
  const type = boundedText(file.type, 200).split(';', 1)[0].toLowerCase();
  const compatible = new Set(['application/json', 'text/json', 'application/octet-stream', 'text/plain']);
  if (type && !compatible.has(type) && !type.endsWith('+json')) {
    throw new Error('Lean audit import must use a JSON-compatible media type');
  }
  return true;
}

/** @param {unknown} parsed */
function extractImportedLedger(parsed) {
  if (!isRecord(parsed)) throw new Error('Lean audit import must contain a JSON object');
  if (!Object.hasOwn(parsed, 'ledger')) return parsed;
  if (parsed.application !== LEAN_AUDIT_APPLICATION) throw new Error('Lean audit export belongs to another application');
  if (parsed.schema_version !== LEAN_AUDIT_SCHEMA_VERSION) throw new Error('Unsupported Lean audit export schema version');
  if (!isRecord(parsed.ledger)) throw new Error('Lean audit export ledger must be an object');
  return parsed.ledger;
}

/** @param {string} text @param {Set<string>} validItemIds @param {string} [now] */
export function importLeanAuditLedger(text, validItemIds, now = new Date().toISOString()) {
  if (typeof text !== 'string') throw new Error('Lean audit import must be text');
  if (new TextEncoder().encode(text).length > MAX_LEAN_AUDIT_IMPORT_BYTES) {
    throw new Error('Lean audit import exceeds the size limit');
  }
  const raw = extractImportedLedger(JSON.parse(text));
  if (!isRecord(raw) || raw.schema_version !== LEAN_AUDIT_SCHEMA_VERSION || !Array.isArray(raw.records)) {
    throw new Error('Unsupported Lean audit ledger schema');
  }
  const referenced = raw.records
    .map((record) => isRecord(record) && typeof record.item_id === 'string' ? record.item_id : '')
    .filter(Boolean);
  if (referenced.length > 0 && !referenced.some((itemId) => validItemIds.has(itemId))) {
    throw new Error('Lean audit import does not contain items from this catalog');
  }
  return normalizeLeanAuditLedger(raw, validItemIds, now);
}

/** @param {unknown} current @param {unknown} incoming @param {Set<string>} validItemIds @param {string} [now] */
export function mergeLeanAuditLedgers(current, incoming, validItemIds, now = new Date().toISOString()) {
  const left = normalizeLeanAuditLedger(current, validItemIds, now);
  const right = normalizeLeanAuditLedger(incoming, validItemIds, now);
  const records = new Map(left.records.map((record) => [record.item_id, record]));
  for (const record of right.records) {
    const previous = records.get(record.item_id);
    if (!previous || Date.parse(record.updated_at) >= Date.parse(previous.updated_at)) records.set(record.item_id, record);
  }
  return normalizeLeanAuditLedger({
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    updated_at: now,
    records: [...records.values()],
  }, validItemIds, now);
}

/** @param {unknown} ledger @param {unknown} record @param {Set<string>} validItemIds @param {string} [now] */
export function upsertLeanAuditRecord(ledger, record, validItemIds, now = new Date().toISOString()) {
  const normalizedLedger = normalizeLeanAuditLedger(ledger, validItemIds, now);
  const normalizedRecord = normalizeLeanAuditRecord({
    ...(isRecord(record) ? record : {}),
    updated_at: now,
  }, validItemIds, now);
  if (!normalizedRecord) throw new Error('Lean audit item is not present in the current catalog');
  const records = normalizedLedger.records.filter(({ item_id: itemId }) => itemId !== normalizedRecord.item_id);
  records.push(normalizedRecord);
  return normalizeLeanAuditLedger({
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    updated_at: now,
    records,
  }, validItemIds, now);
}

/** @param {unknown} ledger @param {string} itemId @param {Set<string>} validItemIds @param {string} [now] */
export function removeLeanAuditRecord(ledger, itemId, validItemIds, now = new Date().toISOString()) {
  const normalized = normalizeLeanAuditLedger(ledger, validItemIds, now);
  return {
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    updated_at: requireDate(now, 'Lean audit ledger updated_at'),
    records: normalized.records.filter((record) => record.item_id !== itemId),
  };
}

/** @param {unknown} value */
function normalizeSearch(value) {
  return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/**
 * Combine catalog items and local records into a deterministic worklist.
 * @param {ReturnType<typeof normalizeLeanCatalog>} catalog
 * @param {unknown} ledger
 */
export function buildLeanAuditWorklist(catalog, ledger) {
  if (!isRecord(catalog) || !Array.isArray(catalog.items)) throw new Error('Lean audit catalog is invalid');
  const validItemIds = new Set(catalog.items.map(({ id }) => id));
  const normalizedLedger = normalizeLeanAuditLedger(ledger, validItemIds);
  const recordById = new Map(normalizedLedger.records.map((record) => [record.item_id, record]));
  return catalog.items.map((item) => {
    const record = recordById.get(item.id) ?? null;
    const status = record?.status ?? 'unreviewed';
    const statusWeight = { missing: 100, renamed: 85, blocked: 70, unreviewed: 40, verified: 0 }[status];
    const typeWeight = { declaration: 25, import: 15, target: 5 }[item.item_type];
    const confidenceWeight = item.node_confidence === 'formal' ? 12 : item.node_confidence === 'literature' ? 5 : 0;
    const kindWeight = item.node_kind === 'problem' ? 10 : item.node_kind === 'bridge' ? 4 : 0;
    const safetyWeight = item.item_type !== 'target' && !item.probe_safe ? 25 : 0;
    return {
      ...item,
      record,
      status,
      checked_at: record?.checked_at ?? null,
      toolchain: record?.toolchain ?? '',
      replacement: record?.replacement ?? '',
      notes: record?.notes ?? '',
      replacement_probe_safe: Boolean(record?.replacement) && isProbeSafeLeanName(record.replacement),
      priority_score: statusWeight + typeWeight + confidenceWeight + kindWeight
        + Math.min(20, Math.max(0, item.reuse_count - 1) * 3) + safetyWeight,
    };
  }).sort((left, right) => right.priority_score - left.priority_score
    || compareText(left.node_title, right.node_title)
    || TYPE_RANK.get(left.item_type) - TYPE_RANK.get(right.item_type)
    || compareText(left.value, right.value));
}

/**
 * Filter and sort a Lean audit worklist.
 * @param {ReturnType<typeof buildLeanAuditWorklist>} items
 * @param {{search?:unknown,status?:unknown,itemType?:unknown,nodeKind?:unknown,confidence?:unknown,sort?:unknown}} [filters]
 */
export function filterLeanAuditWorklist(items, filters = {}) {
  if (!Array.isArray(items)) throw new Error('Lean audit worklist must be an array');
  const search = normalizeSearch(filters.search);
  const status = boundedText(filters.status, 32);
  const itemType = boundedText(filters.itemType, 32);
  const nodeKind = boundedText(filters.nodeKind, 64);
  const confidence = boundedText(filters.confidence, 64);
  const filtered = items.filter((item) => {
    if (status && status !== 'all' && item.status !== status) return false;
    if (itemType && itemType !== 'all' && item.item_type !== itemType) return false;
    if (nodeKind && nodeKind !== 'all' && item.node_kind !== nodeKind) return false;
    if (confidence && confidence !== 'all' && item.node_confidence !== confidence) return false;
    if (!search) return true;
    return normalizeSearch([
      item.node_id,
      item.node_title,
      item.item_type,
      item.value,
      item.status,
      item.replacement,
      item.notes,
      item.toolchain,
    ].join(' ')).includes(search);
  });
  const sort = boundedText(filters.sort, 32) || 'priority';
  const comparators = {
    priority: (left, right) => right.priority_score - left.priority_score
      || compareText(left.node_title, right.node_title)
      || compareText(left.value, right.value),
    node: (left, right) => compareText(left.node_title, right.node_title)
      || TYPE_RANK.get(left.item_type) - TYPE_RANK.get(right.item_type)
      || compareText(left.value, right.value),
    status: (left, right) => STATUS_RANK.get(left.status) - STATUS_RANK.get(right.status)
      || right.priority_score - left.priority_score
      || compareText(left.value, right.value),
    value: (left, right) => compareText(left.value, right.value)
      || compareText(left.node_title, right.node_title),
  };
  if (!Object.hasOwn(comparators, sort)) throw new Error(`Unknown Lean audit sort: ${sort}`);
  return [...filtered].sort(comparators[sort]);
}

/** @param {ReturnType<typeof buildLeanAuditWorklist>} items */
export function summarizeLeanAudit(items) {
  if (!Array.isArray(items)) throw new Error('Lean audit summary input must be an array');
  const byStatus = Object.fromEntries(LEAN_AUDIT_STATUSES.map((status) => [status, 0]));
  const byType = Object.fromEntries(LEAN_ITEM_TYPES.map((type) => [type, 0]));
  for (const item of items) {
    if (Object.hasOwn(byStatus, item.status)) byStatus[item.status] += 1;
    if (Object.hasOwn(byType, item.item_type)) byType[item.item_type] += 1;
  }
  return {
    total: items.length,
    reviewed: items.length - byStatus.unreviewed,
    open: byStatus.unreviewed + byStatus.missing + byStatus.renamed + byStatus.blocked,
    by_status: byStatus,
    by_type: byType,
    probe_unsafe: items.filter((item) => item.item_type !== 'target' && !item.probe_safe).length,
    with_replacement: items.filter((item) => item.replacement).length,
  };
}

/** @param {string} value */
function leanComment(value) {
  return String(value).replaceAll('-/', '- /').replaceAll('\r', ' ').replaceAll('\n', ' ');
}

/** @param {unknown} selectedItemIds @param {Set<string>} validItemIds */
function normalizeSelection(selectedItemIds, validItemIds) {
  if (selectedItemIds === undefined || selectedItemIds === null) return new Set(validItemIds);
  if (!Array.isArray(selectedItemIds) && !(selectedItemIds instanceof Set)) {
    throw new Error('Lean probe selection must be an array or Set');
  }
  const selected = new Set();
  for (const itemId of selectedItemIds) if (typeof itemId === 'string' && validItemIds.has(itemId)) selected.add(itemId);
  if (selected.size === 0) throw new Error('Lean probe selection is empty');
  return selected;
}

/** @param {any} item @param {Map<string, any>} recordById */
function effectiveLeanName(item, recordById) {
  const record = recordById.get(item.id);
  if (record?.status === 'renamed' && isProbeSafeLeanName(record.replacement)) return record.replacement;
  return item.value;
}

/**
 * Generate a deterministic Lean source file for selected canonical audit items.
 * The file is a probe only; successful compilation does not verify the graph claim.
 * @param {ReturnType<typeof normalizeLeanCatalog>} catalog
 * @param {unknown} selectedItemIds
 * @param {unknown} ledger
 * @param {{toolchain?:unknown,generatedAt?:unknown}} [options]
 */
export function buildLeanProbe(catalog, selectedItemIds, ledger, options = {}) {
  if (!isRecord(catalog) || !Array.isArray(catalog.items) || !Array.isArray(catalog.nodes)) {
    throw new Error('Lean probe catalog is invalid');
  }
  const validItemIds = new Set(catalog.items.map(({ id }) => id));
  const selected = normalizeSelection(selectedItemIds, validItemIds);
  const normalizedLedger = normalizeLeanAuditLedger(ledger, validItemIds);
  const recordById = new Map(normalizedLedger.records.map((record) => [record.item_id, record]));
  const itemById = new Map(catalog.items.map((item) => [item.id, item]));
  const selectedItems = [...selected].map((itemId) => itemById.get(itemId)).filter(Boolean);
  const selectedNodes = new Set(selectedItems.map(({ node_id: nodeId }) => nodeId));

  const requiredImportItems = catalog.items.filter((item) => item.item_type === 'import'
    && (selected.has(item.id) || selectedNodes.has(item.node_id)));
  const activeImports = [];
  const importNotes = [];
  for (const item of requiredImportItems) {
    const record = recordById.get(item.id);
    if (record?.status === 'blocked') {
      importNotes.push(`-- Blocked import candidate: ${leanComment(item.value)}`);
      continue;
    }
    const value = effectiveLeanName(item, recordById);
    if (!isProbeSafeLeanName(value)) {
      importNotes.push(`-- Probe-unsafe import candidate: ${leanComment(value)}`);
      continue;
    }
    activeImports.push(value);
  }
  if (activeImports.length === 0) activeImports.push('Mathlib');
  const imports = [...new Set(activeImports)].sort();

  const toolchain = boundedText(options.toolchain, 300);
  const generatedAt = options.generatedAt === undefined || options.generatedAt === null || options.generatedAt === ''
    ? ''
    : requireDate(options.generatedAt, 'Lean probe generated_at');
  const lines = [
    '/-',
    'Generated by PhysMath Knowledge Tree Lean Target Audit.',
    'This file checks that selected imports and declaration names resolve.',
    'Compilation does not validate the surrounding mathematical claim.',
  ];
  if (toolchain) lines.push(`Toolchain note: ${leanComment(toolchain)}`);
  if (generatedAt) lines.push(`Generated at: ${generatedAt}`);
  lines.push('-/', '', ...imports.map((value) => `import ${value}`));
  if (importNotes.length > 0) lines.push('', ...[...new Set(importNotes)].sort());
  lines.push('', 'set_option autoImplicit false', '');

  const nodeById = new Map(catalog.nodes.map((node) => [node.id, node]));
  for (const nodeId of [...selectedNodes].sort()) {
    const node = nodeById.get(nodeId);
    const nodeItems = selectedItems.filter((item) => item.node_id === nodeId);
    lines.push(`-- Node: ${leanComment(node.title)} (${nodeId})`);
    const selectedImports = nodeItems.filter(({ item_type: type }) => type === 'import');
    for (const item of selectedImports) {
      const record = recordById.get(item.id);
      lines.push(`-- Import audit [${record?.status ?? 'unreviewed'}]: ${leanComment(item.value)}`);
    }
    const declarations = nodeItems.filter(({ item_type: type }) => type === 'declaration');
    for (const item of declarations) {
      const record = recordById.get(item.id);
      if (record?.status === 'blocked') {
        lines.push(`-- Blocked declaration candidate: ${leanComment(item.value)}`);
        continue;
      }
      if (record?.status === 'renamed') {
        if (isProbeSafeLeanName(record.replacement)) {
          lines.push(`-- Renamed from: ${leanComment(item.value)}`);
          lines.push(`#check ${record.replacement}`);
        } else {
          lines.push(`-- Renamed candidate lacks a probe-safe replacement: ${leanComment(item.value)}`);
        }
        continue;
      }
      if (item.probe_safe) lines.push(`#check ${item.value}`);
      else lines.push(`-- Probe-unsafe declaration candidate: ${leanComment(item.value)}`);
    }
    const targets = nodeItems.filter(({ item_type: type }) => type === 'target');
    for (const item of targets) {
      const record = recordById.get(item.id);
      lines.push(`-- Target [${record?.status ?? 'unreviewed'}]: ${leanComment(item.value)}`);
    }
    lines.push('');
  }
  return `${lines.join('\n').replace(/\n{3,}/gu, '\n\n').trimEnd()}\n`;
}

/**
 * Build a portable audit packet containing selected items, local records and a probe.
 * @param {ReturnType<typeof normalizeLeanCatalog>} catalog
 * @param {unknown} selectedItemIds
 * @param {unknown} ledger
 * @param {{toolchain?:unknown,generatedAt?:unknown}} [options]
 */
export function buildLeanAuditPacket(catalog, selectedItemIds, ledger, options = {}) {
  const validItemIds = new Set(catalog.items.map(({ id }) => id));
  const selected = normalizeSelection(selectedItemIds, validItemIds);
  const normalizedLedger = normalizeLeanAuditLedger(ledger, validItemIds);
  const selectedItems = catalog.items.filter((item) => selected.has(item.id));
  const selectedRecords = normalizedLedger.records.filter((record) => selected.has(record.item_id));
  const generatedAt = options.generatedAt === undefined || options.generatedAt === null || options.generatedAt === ''
    ? new Date().toISOString()
    : requireDate(options.generatedAt, 'Lean audit packet generated_at');
  const selectedCatalog = { ...catalog, items: selectedItems };
  const worklist = buildLeanAuditWorklist(selectedCatalog, {
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    updated_at: normalizedLedger.updated_at,
    records: selectedRecords,
  });
  return {
    application: LEAN_AUDIT_APPLICATION,
    schema_version: LEAN_AUDIT_SCHEMA_VERSION,
    generated_at: generatedAt,
    toolchain: boundedText(options.toolchain, 300),
    summary: summarizeLeanAudit(worklist),
    catalog_stats: { ...catalog.stats },
    items: selectedItems,
    records: selectedRecords,
    probe: buildLeanProbe(catalog, [...selected], normalizedLedger, {
      toolchain: options.toolchain,
      generatedAt,
    }),
  };
}

/** @param {unknown} value */
function markdownCell(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

/** @param {ReturnType<typeof buildLeanAuditPacket>} packet */
export function exportLeanAuditPacketMarkdown(packet) {
  if (!isRecord(packet) || !Array.isArray(packet.items) || !isRecord(packet.summary) || typeof packet.probe !== 'string') {
    throw new Error('Lean audit packet is invalid');
  }
  const recordById = new Map((Array.isArray(packet.records) ? packet.records : []).map((record) => [record.item_id, record]));
  const lines = [
    '# Lean Target Audit Packet',
    '',
    `- Generated: ${markdownCell(packet.generated_at)}`,
    `- Toolchain note: ${markdownCell(packet.toolchain || 'not recorded')}`,
    `- Selected items: ${packet.items.length}`,
    `- Verified: ${packet.summary.by_status?.verified ?? 0}`,
    `- Missing: ${packet.summary.by_status?.missing ?? 0}`,
    `- Renamed: ${packet.summary.by_status?.renamed ?? 0}`,
    `- Blocked: ${packet.summary.by_status?.blocked ?? 0}`,
    '',
    '> This packet audits names and imports only. It does not certify mathematical claims.',
    '',
    '| Node | Type | Candidate | Status | Replacement |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const item of packet.items) {
    const record = recordById.get(item.id);
    lines.push(`| ${markdownCell(item.node_id)} | ${markdownCell(item.item_type)} | ${markdownCell(item.value)} | ${markdownCell(record?.status ?? 'unreviewed')} | ${markdownCell(record?.replacement ?? '')} |`);
  }
  lines.push('', '## Generated Lean probe', '', '```lean', packet.probe.trimEnd(), '```', '');
  return lines.join('\n');
}
