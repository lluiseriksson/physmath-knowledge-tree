// @ts-check
import {
  CONFIDENCE_LEVELS,
  DEFAULT_MAX_ROUTE_STATES,
  planResearchRoute,
  summarizeRouteEvidence,
} from './route-planner.js';
import { compareText } from './text.js';

export const ROUTE_BUNDLE_APPLICATION = 'PhysMath Knowledge Tree';
export const ROUTE_BUNDLE_KIND = 'evidence-route-bundle';
export const ROUTE_BUNDLE_SCHEMA_VERSION = 1;

/** @param {unknown} value */
function isRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** Deterministic JSON serialization with recursively sorted object keys. @param {unknown} value */
export function stableStringify(value) {
  const visit = (item) => {
    if (item === null || typeof item === 'string' || typeof item === 'boolean') return item;
    if (typeof item === 'number') {
      if (!Number.isFinite(item)) throw new Error('Route bundle cannot encode non-finite numbers');
      return item;
    }
    if (Array.isArray(item)) return item.map(visit);
    if (!isRecord(item)) throw new Error('Route bundle contains a non-JSON value');
    const result = {};
    for (const key of Object.keys(item).sort()) {
      const nested = item[key];
      if (nested === undefined) continue;
      result[key] = visit(nested);
    }
    return result;
  };
  return JSON.stringify(visit(value));
}

/** @param {string} text */
export async function sha256Hex(text) {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle) throw new Error('Web Crypto SHA-256 is unavailable');
  const digest = await cryptoApi.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** @param {Array<Record<string, any>>} nodes @param {Array<Record<string, any>>} edges */
export function canonicalRouteGraph(nodes, edges) {
  if (!Array.isArray(nodes) || !Array.isArray(edges)) throw new Error('Route bundle graph inputs must be arrays');
  return {
    nodes: nodes.map((node) => ({ id: node.id })).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      relation: edge.relation ?? null,
      confidence: edge.confidence,
      mechanism: edge.mechanism ?? null,
      references: Array.isArray(edge.references)
        ? edge.references.map((reference) => ({
          label: reference.label ?? null,
          url: reference.url ?? null,
          type: reference.type ?? null,
          scope: reference.scope ?? null,
        })).sort((left, right) => compareText(stableStringify(left), stableStringify(right)))
        : [],
    })).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  };
}

/** @param {Array<Record<string, any>>} nodes @param {Array<Record<string, any>>} edges */
export async function computeRouteGraphSha256(nodes, edges) {
  return sha256Hex(stableStringify(canonicalRouteGraph(nodes, edges)));
}

/** @param {Record<string, any>} options */
function canonicalRequestOptions(options = {}) {
  const allowed = options.allowedConfidence === undefined
    ? [...CONFIDENCE_LEVELS]
    : [...options.allowedConfidence].map(String);
  return {
    policy: options.policy === undefined ? 'strongest' : String(options.policy),
    directed: options.directed === true,
    allowed_confidence: [...new Set(allowed)].sort((left, right) =>
      CONFIDENCE_LEVELS.indexOf(left) - CONFIDENCE_LEVELS.indexOf(right)),
    max_edges: options.maxEdges === undefined ? null : Number(options.maxEdges),
    max_states: options.maxStates === undefined ? DEFAULT_MAX_ROUTE_STATES : Number(options.maxStates),
  };
}

/** @param {Record<string, any>} request */
function plannerOptions(request) {
  return {
    policy: request.policy,
    directed: request.directed,
    allowedConfidence: request.allowed_confidence,
    maxEdges: request.max_edges === null ? undefined : request.max_edges,
    maxStates: request.max_states,
  };
}

/** @param {Record<string, any>} bundle */
function payloadWithoutIntegrity(bundle) {
  const { integrity: _integrity, ...payload } = bundle;
  return payload;
}

/**
 * Create a portable, tamper-evident route bundle tied to canonical graph content.
 * @param {{index:Record<string,any>,nodes:Array<Record<string,any>>,edges:Array<Record<string,any>>,source:string,target:string,options?:Record<string,any>,createdAt?:string}} input
 */
export async function createRouteBundle({
  index,
  nodes,
  edges,
  source,
  target,
  options = {},
  createdAt = new Date().toISOString(),
}) {
  if (!isRecord(index)) throw new Error('Route bundle requires a graph index object');
  if (typeof index.application_version !== 'string' || !index.application_version) {
    throw new Error('Route bundle requires graph application-version metadata');
  }
  if (typeof index.schema_version !== 'string' || !index.schema_version) {
    throw new Error('Route bundle requires graph schema-version metadata');
  }
  if (typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt))) {
    throw new Error('Route bundle createdAt must be an ISO-compatible date');
  }
  const requestOptions = canonicalRequestOptions(options);
  const route = planResearchRoute(nodes, edges, source, target, plannerOptions(requestOptions));
  if (!route) throw new Error('No route satisfies the requested route constraints');
  const evidence = summarizeRouteEvidence(route, edges);
  const graphSha256 = await computeRouteGraphSha256(nodes, edges);
  const payload = {
    application: ROUTE_BUNDLE_APPLICATION,
    kind: ROUTE_BUNDLE_KIND,
    schema_version: ROUTE_BUNDLE_SCHEMA_VERSION,
    created_at: new Date(createdAt).toISOString(),
    graph: {
      application_version: index.application_version,
      schema_version: index.schema_version,
      sha256: graphSha256,
    },
    request: {
      source,
      target,
      ...requestOptions,
    },
    route,
    evidence,
  };
  return {
    ...payload,
    integrity: {
      algorithm: 'SHA-256',
      payload_sha256: await sha256Hex(stableStringify(payload)),
    },
  };
}

/**
 * Verify bundle integrity and recalculate its route against canonical graph data.
 * @param {unknown} input
 * @param {{index:Record<string,any>,nodes:Array<Record<string,any>>,edges:Array<Record<string,any>>}} canonical
 */
export async function verifyRouteBundle(input, canonical) {
  if (!isRecord(input)) throw new Error('Route bundle must be a JSON object');
  const bundle = input;
  if (bundle.application !== ROUTE_BUNDLE_APPLICATION || bundle.kind !== ROUTE_BUNDLE_KIND) {
    throw new Error('Not a PhysMath evidence-route bundle');
  }
  if (bundle.schema_version !== ROUTE_BUNDLE_SCHEMA_VERSION) throw new Error('Unsupported route-bundle schema version');
  if (!isRecord(bundle.graph) || !isRecord(bundle.request) || !isRecord(bundle.route) || !isRecord(bundle.integrity)) {
    throw new Error('Route bundle is structurally incomplete');
  }
  if (bundle.integrity.algorithm !== 'SHA-256' || !/^[a-f0-9]{64}$/u.test(String(bundle.integrity.payload_sha256))) {
    throw new Error('Route bundle integrity metadata is invalid');
  }
  const expectedPayloadSha = await sha256Hex(stableStringify(payloadWithoutIntegrity(bundle)));
  if (bundle.integrity.payload_sha256 !== expectedPayloadSha) throw new Error('Route bundle payload SHA-256 mismatch');

  const { index, nodes, edges } = canonical;
  const graphSha = await computeRouteGraphSha256(nodes, edges);
  if (bundle.graph.sha256 !== graphSha) throw new Error('Route bundle graph SHA-256 does not match the canonical graph');
  if (bundle.graph.application_version !== index.application_version) throw new Error('Route bundle application version does not match');
  if (bundle.graph.schema_version !== index.schema_version) throw new Error('Route bundle graph schema version does not match');

  const recomputedRoute = planResearchRoute(
    nodes,
    edges,
    String(bundle.request.source),
    String(bundle.request.target),
    plannerOptions(bundle.request),
  );
  if (!recomputedRoute) throw new Error('Canonical graph no longer provides the bundled route');
  if (stableStringify(bundle.route) !== stableStringify(recomputedRoute)) {
    throw new Error('Route bundle result does not match canonical recalculation');
  }
  const recomputedEvidence = summarizeRouteEvidence(recomputedRoute, edges);
  if (stableStringify(bundle.evidence) !== stableStringify(recomputedEvidence)) {
    throw new Error('Route bundle evidence summary does not match canonical recalculation');
  }
  return {
    valid: true,
    payload_sha256: expectedPayloadSha,
    graph_sha256: graphSha,
    route: recomputedRoute,
    evidence: recomputedEvidence,
  };
}
