// @ts-check
import { compareText } from './text.js';

/** Evidence classes ordered from strongest to weakest. */
export const CONFIDENCE_LEVELS = Object.freeze([
  'formal',
  'literature',
  'heuristic',
  'speculative',
]);

/** Supported deterministic route objectives. */
export const ROUTE_POLICIES = Object.freeze([
  'shortest',
  'balanced',
  'strongest',
]);

export const DEFAULT_MAX_ROUTE_STATES = 50_000;

const RISK_BY_CONFIDENCE = new Map([
  ['formal', 0],
  ['literature', 1],
  ['heuristic', 3],
  ['speculative', 7],
]);

/** @param {number[]} left @param {number[]} right */
function compareNumberVectors(left, right) {
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      result = left[index] - right[index];
      break;
    }
  }
  return result;
}

/** @param {string} confidence */
function confidenceRisk(confidence) {
  return RISK_BY_CONFIDENCE.get(confidence) ?? 99;
}

/** @param {number} risk */
function confidenceForRisk(risk) {
  return CONFIDENCE_LEVELS.find((confidence) => confidenceRisk(confidence) === risk) ?? null;
}

/** @param {unknown} policy */
function normalizePolicy(policy) {
  if (policy === undefined) return 'strongest';
  const normalized = String(policy);
  if (!ROUTE_POLICIES.includes(normalized)) throw new Error(`Unknown route policy: ${normalized}`);
  return normalized;
}

/** @param {unknown} allowed */
function normalizeAllowedConfidence(allowed) {
  if (allowed === undefined) return new Set(CONFIDENCE_LEVELS);
  if (!Array.isArray(allowed)) throw new Error('allowedConfidence must be an array');
  const normalized = allowed.map(String);
  const unknown = normalized.filter((value) => !CONFIDENCE_LEVELS.includes(value));
  if (unknown.length > 0) throw new Error(`Unknown route confidence: ${unknown.join(',')}`);
  return new Set(normalized);
}

/** @param {unknown} value @param {number} fallback @param {string} label @param {boolean} [positive] */
function normalizeIntegerLimit(value, fallback, label, positive = false) {
  if (value === undefined) return fallback;
  const numeric = Number(value);
  const minimum = positive ? 1 : 0;
  if (!Number.isInteger(numeric) || numeric < minimum) {
    throw new Error(`${label} must be a ${positive ? 'positive' : 'non-negative'} integer`);
  }
  return numeric;
}

/** @param {{hops:number,maxRisk:number,totalRisk:number}} state @param {string} policy */
function scoreVector(state, policy) {
  if (policy === 'shortest') return [state.hops, state.maxRisk, state.totalRisk];
  if (policy === 'balanced') return [state.totalRisk + state.hops, state.maxRisk, state.hops];
  return [state.maxRisk, state.totalRisk, state.hops];
}

/** @param {any} left @param {any} right @param {string} policy */
function compareStates(left, right, policy) {
  return compareNumberVectors(scoreVector(left, policy), scoreVector(right, policy))
    || compareText(left.signature, right.signature);
}

/**
 * Return true when `left` is no worse in every monotone route metric.
 * Cycles never improve hops, maximum risk or total risk, so Pareto dominance at
 * the same endpoint is sufficient and avoids exponential visited-set labels.
 * @param {any} left
 * @param {any} right
 */
function dominates(left, right) {
  if (left.hops > right.hops || left.maxRisk > right.maxRisk || left.totalRisk > right.totalRisk) {
    return false;
  }
  const strictlyBetter = left.hops < right.hops
    || left.maxRisk < right.maxRisk
    || left.totalRisk < right.totalRisk
    || left.nodes.length < right.nodes.length;
  return strictlyBetter || compareText(left.signature, right.signature) <= 0;
}

export class RoutePriorityQueue {
  /** @param {(left:any,right:any)=>number} compare */
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  get size() { return this.items.length; }

  /** @param {any} value */
  push(value) {
    this.items.push(value);
    let index = this.items.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.items[parent], value) <= 0) break;
      this.items[index] = this.items[parent];
      index = parent;
    }
    this.items[index] = value;
  }

  pop() {
    const first = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        if (left >= this.items.length) break;
        let child = left;
        if (right < this.items.length && this.compare(this.items[right], this.items[left]) < 0) child = right;
        if (this.compare(last, this.items[child]) <= 0) break;
        this.items[index] = this.items[child];
        index = child;
      }
      this.items[index] = last;
    }
    return first;
  }
}

/**
 * Plan a deterministic route through evidence-labelled research edges.
 *
 * Policies:
 * - `shortest`: minimize hops, then prefer stronger evidence.
 * - `balanced`: minimize cumulative evidence risk plus hops.
 * - `strongest`: minimize the weakest edge first, then cumulative risk and hops.
 *
 * @param {Array<{id:string}>} nodes
 * @param {Array<{id:string,source:string,target:string,confidence:string}>} edges
 * @param {string} source
 * @param {string} target
 * @param {{policy?:string,directed?:boolean,allowedConfidence?:string[],maxEdges?:number,maxStates?:number}} [options]
 * @returns {{nodes:string[],edges:string[],score:{policy:string,hops:number,max_risk:number,total_risk:number,weakest_confidence:string|null}}|null}
 */
export function planResearchRoute(nodes, edges, source, target, options = {}) {
  if (!Array.isArray(nodes) || !Array.isArray(edges)) throw new Error('Route planner inputs must be arrays');
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new Error('Route planner options must be an object');
  const nodeIds = new Set();
  for (const node of nodes) {
    if (!node || typeof node.id !== 'string' || !node.id) throw new Error('Route planner nodes need non-empty IDs');
    if (nodeIds.has(node.id)) throw new Error(`Duplicate route node ID: ${node.id}`);
    nodeIds.add(node.id);
  }
  if (!nodeIds.has(source) || !nodeIds.has(target)) return null;

  const policy = normalizePolicy(options.policy);
  if (source === target) {
    return {
      nodes: [source],
      edges: [],
      score: { policy, hops: 0, max_risk: 0, total_risk: 0, weakest_confidence: null },
    };
  }

  const directed = options.directed === true;
  const allowed = normalizeAllowedConfidence(options.allowedConfidence);
  const simplePathLimit = Math.max(0, nodeIds.size - 1);
  const maxEdges = Math.min(
    normalizeIntegerLimit(options.maxEdges, simplePathLimit, 'maxEdges'),
    simplePathLimit,
  );
  const maxStates = normalizeIntegerLimit(
    options.maxStates,
    DEFAULT_MAX_ROUTE_STATES,
    'maxStates',
    true,
  );
  if (maxEdges === 0 || allowed.size === 0) return null;

  /** @type {Map<string, Array<{next:string,edge:string,risk:number}>>} */
  const adjacency = new Map([...nodeIds].map((id) => [id, []]));
  const edgeIds = new Set();
  for (const edge of edges) {
    if (!edge || typeof edge.id !== 'string' || !edge.id) throw new Error('Route planner edges need non-empty IDs');
    if (edgeIds.has(edge.id)) throw new Error(`Duplicate route edge ID: ${edge.id}`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target) || !allowed.has(edge.confidence)) continue;
    const risk = confidenceRisk(edge.confidence);
    adjacency.get(edge.source)?.push({ next: edge.target, edge: edge.id, risk });
    if (!directed) adjacency.get(edge.target)?.push({ next: edge.source, edge: edge.id, risk });
  }
  for (const neighbors of adjacency.values()) {
    neighbors.sort((left, right) => compareText(left.next, right.next) || compareText(left.edge, right.edge));
  }

  const initial = {
    node: source,
    nodes: [source],
    edges: [],
    hops: 0,
    maxRisk: 0,
    totalRisk: 0,
    signature: source,
  };
  const queue = new RoutePriorityQueue((left, right) => compareStates(left, right, policy));
  queue.push(initial);
  /** @type {Map<string, any[]>} */
  const labels = new Map([[source, [initial]]]);
  let expandedStates = 0;

  while (queue.size > 0) {
    const current = queue.pop();
    // A label may have been dominated after it entered the heap.
    if (!labels.get(current.node).includes(current)) continue;
    expandedStates += 1;
    if (expandedStates > maxStates) throw new Error(`Route search exceeded the ${maxStates} state limit`);
    if (current.node === target) {
      return {
        nodes: current.nodes,
        edges: current.edges,
        score: {
          policy,
          hops: current.hops,
          max_risk: current.maxRisk,
          total_risk: current.totalRisk,
          weakest_confidence: confidenceForRisk(current.maxRisk),
        },
      };
    }
    if (current.hops >= maxEdges) continue;

    for (const neighbor of adjacency.get(current.node)) {
      const next = {
        node: neighbor.next,
        nodes: [...current.nodes, neighbor.next],
        edges: [...current.edges, neighbor.edge],
        hops: current.hops + 1,
        maxRisk: Math.max(current.maxRisk, neighbor.risk),
        totalRisk: current.totalRisk + neighbor.risk,
        signature: `${current.signature}\0${neighbor.edge}\0${neighbor.next}`,
      };
      const nodeLabels = labels.get(next.node) ?? [];
      if (nodeLabels.some((label) => dominates(label, next))) continue;
      labels.set(next.node, nodeLabels.filter((label) => !dominates(next, label)).concat(next));
      queue.push(next);
    }
  }

  return null;
}

/**
 * Summarize the evidence carried by a route without promoting any claim.
 * @param {{edges:string[]}|null} route
 * @param {Array<{id:string,confidence:string,references?:Array<{scope?:string}>}>} edges
 */
export function summarizeRouteEvidence(route, edges) {
  if (!route) return null;
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  const byConfidence = Object.fromEntries(CONFIDENCE_LEVELS.map((confidence) => [confidence, 0]));
  let unknownConfidence = 0;
  let resolvedEdges = 0;
  let weakestRisk = 0;
  let references = 0;
  let sourceBearingReferences = 0;
  const unreferencedEdges = [];
  const missingEdges = [];

  for (const id of route.edges) {
    const edge = edgeById.get(id);
    if (!edge) {
      missingEdges.push(id);
      continue;
    }
    resolvedEdges += 1;
    if (Object.hasOwn(byConfidence, edge.confidence)) byConfidence[edge.confidence] += 1;
    else unknownConfidence += 1;
    weakestRisk = Math.max(weakestRisk, confidenceRisk(edge.confidence));
    const edgeReferences = Array.isArray(edge.references) ? edge.references : [];
    references += edgeReferences.length;
    sourceBearingReferences += edgeReferences.filter((reference) =>
      reference.scope === 'claim' || reference.scope === 'formalization').length;
    if (edgeReferences.length === 0) unreferencedEdges.push(id);
  }

  return {
    total_edges: route.edges.length,
    by_confidence: byConfidence,
    unknown_confidence: unknownConfidence,
    weakest_confidence: resolvedEdges > 0 ? confidenceForRisk(weakestRisk) : null,
    references,
    source_bearing_references: sourceBearingReferences,
    unreferenced_edges: unreferencedEdges,
    missing_edges: missingEdges,
  };
}
