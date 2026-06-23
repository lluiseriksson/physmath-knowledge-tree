import { compareText } from './text.js';

const DEFAULT_ENTITY_BASE = 'https://lluiseriksson.github.io/physmath-knowledge-tree/id/';
const VOCAB = 'https://lluiseriksson.github.io/physmath-knowledge-tree/vocab#';

/** @param {string} base */
function normalizeEntityBase(base) {
  const url = new URL(base || DEFAULT_ENTITY_BASE);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('JSON-LD entity base must use HTTP or HTTPS');
  url.search = '';
  url.hash = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.toString();
}

/** @param {string} id @param {string} base */
export function entityIri(id, base = DEFAULT_ENTITY_BASE) {
  if (typeof id !== 'string' || !id.trim()) throw new Error('JSON-LD entity IDs must be non-empty strings');
  return new URL(encodeURIComponent(id.trim()), normalizeEntityBase(base)).toString();
}

/** @param {Array<Record<string, any>>|undefined} references */
function exportReferences(references = []) {
  return [...references]
    .sort((left, right) => compareText(left.url ?? '', right.url ?? '')
      || compareText(left.label ?? '', right.label ?? '')
      || compareText(left.scope ?? '', right.scope ?? '')
      || compareText(left.type ?? '', right.type ?? ''))
    .map((reference) => ({
      '@type': 'schema:CreativeWork',
      name: reference.label,
      url: reference.url,
      referenceType: reference.type,
      referenceScope: reference.scope,
    }));
}

/** @param {Record<string, any>} node @param {string} base */
function exportNode(node, base) {
  const item = {
    '@id': entityIri(node.id, base),
    '@type': `pm:${node.kind === 'problem' ? 'Problem' : node.kind === 'bridge' ? 'Bridge' : 'Domain'}`,
    stableId: node.id,
    name: node.title,
    description: node.summary,
    kind: node.kind,
    confidence: node.confidence,
    keywords: [...(node.tags ?? [])].sort(compareText),
    questions: [...(node.questions ?? [])].sort(compareText),
    leanImports: [...(node.lean?.imports ?? [])].sort(compareText),
    leanDeclarations: [...(node.lean?.declarations ?? [])].sort(compareText),
    leanTargets: [...(node.lean?.targets ?? [])].sort(compareText),
    citation: exportReferences(node.references),
  };
  if (node.status !== undefined) item.status = node.status;
  return item;
}

/** @param {Record<string, any>} edge @param {string} base */
function exportEdge(edge, base) {
  const item = {
    '@id': entityIri(edge.id, base),
    '@type': 'pm:KnowledgeEdge',
    stableId: edge.id,
    source: entityIri(edge.source, base),
    target: entityIri(edge.target, base),
    relation: edge.relation,
    confidence: edge.confidence,
    mechanism: edge.mechanism,
    citation: exportReferences(edge.references),
  };
  if (edge.notes !== undefined) item.notes = edge.notes;
  return item;
}

/** @param {Record<string, any>} move @param {string} base */
function exportMove(move, base) {
  return {
    '@id': entityIri(move.id, base),
    '@type': 'pm:ResearchMove',
    stableId: move.id,
    name: move.title,
    description: move.description,
    goodFor: [...(move.good_for ?? [])].sort(compareText),
    output: move.output,
    risks: [...(move.risks ?? [])].sort(compareText),
    leanTest: move.lean_test,
  };
}

/** @param {Record<string, any>} collection @param {string} base */
function exportCollection(collection, base) {
  return {
    '@id': entityIri(collection.id, base),
    '@type': 'pm:Collection',
    stableId: collection.id,
    name: collection.title,
    description: collection.description,
    members: [...(collection.nodes ?? [])].sort(compareText).map((id) => entityIri(id, base)),
  };
}

/**
 * Build a deterministic JSON-LD projection of canonical graph data.
 * @param {{index:Record<string,any>,packageVersion:string,nodes:Array<Record<string,any>>,edges:Array<Record<string,any>>,moves?:Array<Record<string,any>>,collections?:Array<Record<string,any>>,entityBase?:string}} input
 */
export function buildJsonLd({
  index,
  packageVersion,
  nodes,
  edges,
  moves = [],
  collections = [],
  entityBase = DEFAULT_ENTITY_BASE,
}) {
  if (!index || typeof index !== 'object' || Array.isArray(index)) throw new Error('JSON-LD export requires a graph index object');
  if (typeof packageVersion !== 'string' || !packageVersion.trim()) throw new Error('JSON-LD export requires an application version');
  if (typeof index.application_version !== 'string' || !index.application_version.trim()) {
    throw new Error('JSON-LD export requires graph application-version metadata');
  }
  if (index.application_version !== packageVersion) {
    throw new Error(`JSON-LD application-version mismatch: ${index.application_version} != ${packageVersion}`);
  }
  if (typeof index.schema_version !== 'string' || !index.schema_version.trim()) throw new Error('JSON-LD export requires a graph schema version');
  if (!Array.isArray(nodes) || !Array.isArray(edges) || !Array.isArray(moves) || !Array.isArray(collections)) {
    throw new Error('JSON-LD export inputs must be arrays');
  }
  const base = normalizeEntityBase(entityBase);
  const nodeIds = new Set();
  for (const node of nodes) {
    if (nodeIds.has(node.id)) throw new Error(`Duplicate node ID in JSON-LD export: ${node.id}`);
    nodeIds.add(node.id);
  }
  const entityIds = new Set(nodeIds);
  for (const item of [...edges, ...moves, ...collections]) {
    if (entityIds.has(item.id)) throw new Error(`Duplicate entity ID in JSON-LD export: ${item.id}`);
    entityIds.add(item.id);
  }
  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      throw new Error(`JSON-LD edge ${edge.id} references an unknown endpoint`);
    }
  }
  for (const collection of collections) {
    for (const id of collection.nodes ?? []) {
      if (!nodeIds.has(id)) throw new Error(`JSON-LD collection ${collection.id} references unknown node ${id}`);
    }
  }

  const graph = [
    ...nodes.map((node) => exportNode(node, base)),
    ...edges.map((edge) => exportEdge(edge, base)),
    ...moves.map((move) => exportMove(move, base)),
    ...collections.map((collection) => exportCollection(collection, base)),
  ].sort((left, right) => compareText(left['@id'], right['@id']));

  return {
    '@context': {
      '@version': 1.1,
      pm: VOCAB,
      schema: 'https://schema.org/',
      name: 'schema:name',
      description: 'schema:description',
      url: { '@id': 'schema:url', '@type': '@id' },
      citation: { '@id': 'schema:citation', '@container': '@set' },
      keywords: { '@id': 'schema:keywords', '@container': '@set' },
      source: { '@id': 'pm:source', '@type': '@id' },
      target: { '@id': 'pm:target', '@type': '@id' },
      members: { '@id': 'pm:member', '@type': '@id', '@container': '@set' },
      stableId: 'pm:stableId',
      kind: 'pm:kind',
      confidence: 'pm:confidence',
      status: 'pm:status',
      relation: 'pm:relation',
      mechanism: 'pm:mechanism',
      notes: 'pm:notes',
      questions: { '@id': 'pm:question', '@container': '@set' },
      leanImports: { '@id': 'pm:leanImport', '@container': '@set' },
      leanDeclarations: { '@id': 'pm:leanDeclaration', '@container': '@set' },
      leanTargets: { '@id': 'pm:leanTarget', '@container': '@set' },
      referenceType: 'pm:referenceType',
      referenceScope: 'pm:referenceScope',
      goodFor: { '@id': 'pm:goodFor', '@container': '@set' },
      output: 'pm:output',
      risks: { '@id': 'pm:risk', '@container': '@set' },
      leanTest: 'pm:leanTest',
      schemaVersion: 'pm:schemaVersion',
      applicationVersion: 'pm:applicationVersion',
      dateCreated: { '@id': 'schema:dateCreated', '@type': 'schema:Date' },
      dateModified: { '@id': 'schema:dateModified', '@type': 'schema:Date' },
    },
    '@id': new URL('../graph/', base).toString(),
    '@type': 'pm:KnowledgeGraph',
    name: index.name,
    description: index.purpose,
    schemaVersion: index.schema_version,
    applicationVersion: packageVersion,
    dateCreated: index.created,
    dateModified: index.updated,
    '@graph': graph,
  };
}

export { DEFAULT_ENTITY_BASE };
