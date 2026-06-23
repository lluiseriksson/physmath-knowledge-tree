/** Pure graph helpers used by the research explorer and its tests. */
import { compareNormalizedText, compareText, normalizeText } from './text.js';
export { normalizeText } from './text.js';

/** @template {{id: string}} T @param {T[]} items */
export function indexById(items) {
  return new Map(items.map((item) => [item.id, item]));
}

/**
 * Rank canonical graph nodes against a free-text query.
 * Exact title/id matches outrank prefix matches, tags and long-form content.
 * @param {Array<Record<string, any>>} nodes
 * @param {string} query
 * @param {number} [limit]
 */
export function searchNodes(nodes, query, limit = 12) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return nodes
    .map((node) => {
      const title = normalizeText(node.title);
      const id = normalizeText(node.id);
      const tags = normalizeText((node.tags ?? []).join(' '));
      const summary = normalizeText(node.summary);
      const questions = normalizeText((node.questions ?? []).join(' '));
      const haystack = `${title} ${id} ${tags} ${summary} ${questions}`;
      if (!terms.every((term) => haystack.includes(term))) return null;

      let score = 0;
      if (title === normalizedQuery || id === normalizedQuery) score += 120;
      if (title.startsWith(normalizedQuery)) score += 70;
      if (id.startsWith(normalizedQuery)) score += 55;
      if (title.includes(normalizedQuery)) score += 42;
      if (tags.includes(normalizedQuery)) score += 30;
      if (id.includes(normalizedQuery)) score += 24;
      if (summary.includes(normalizedQuery)) score += 12;
      for (const term of terms) {
        if (title.split(' ').includes(term)) score += 10;
        if (tags.split(' ').includes(term)) score += 7;
      }
      return { node, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score
      || compareNormalizedText(a.node.title, b.node.title)
      || compareText(a.node.id, b.node.id))
    .slice(0, Math.max(0, limit));
}

/**
 * Breadth-first shortest path through graph edges.
 * @param {Array<{id:string}>} nodes
 * @param {Array<{id:string,source:string,target:string}>} edges
 * @param {string} source
 * @param {string} target
 * @param {boolean} [directed]
 * @returns {{nodes:string[], edges:string[]}|null}
 */
export function shortestPath(nodes, edges, source, target, directed = false) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  if (!nodeIds.has(source) || !nodeIds.has(target)) return null;
  if (source === target) return { nodes: [source], edges: [] };

  /** @type {Map<string, Array<{next:string, edge:string}>>} */
  const adjacency = new Map([...nodeIds].map((id) => [id, []]));
  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue;
    adjacency.get(edge.source)?.push({ next: edge.target, edge: edge.id });
    if (!directed) adjacency.get(edge.target)?.push({ next: edge.source, edge: edge.id });
  }

  const queue = [source];
  const visited = new Set([source]);
  /** @type {Map<string, {node:string, edge:string}>} */
  const previous = new Map();

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    const neighbors = [...adjacency.get(current)].sort((a, b) =>
      compareText(a.next, b.next) || compareText(a.edge, b.edge),
    );
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.next)) continue;
      visited.add(neighbor.next);
      previous.set(neighbor.next, { node: current, edge: neighbor.edge });
      if (neighbor.next === target) {
        const pathNodes = [target];
        const pathEdges = [];
        let step = target;
        while (step !== source) {
          const link = previous.get(step);
          pathEdges.push(link.edge);
          pathNodes.push(link.node);
          step = link.node;
        }
        return { nodes: pathNodes.reverse(), edges: pathEdges.reverse() };
      }
      queue.push(neighbor.next);
    }
  }
  return null;
}

/**
 * Return a radius-limited undirected neighborhood around one or more seeds.
 * @param {Array<{id:string}>} nodes
 * @param {Array<{source:string,target:string}>} edges
 * @param {string|string[]} seeds
 * @param {number} [radius]
 */
export function connectedNeighborhood(nodes, edges, seeds, radius = 1) {
  const valid = new Set(nodes.map((node) => node.id));
  const starting = (Array.isArray(seeds) ? seeds : [seeds]).filter((id) => valid.has(id));
  const included = new Set(starting);
  let frontier = new Set(starting);

  for (let depth = 0; depth < radius; depth += 1) {
    const next = new Set();
    for (const edge of edges) {
      if (frontier.has(edge.source) && valid.has(edge.target) && !included.has(edge.target)) next.add(edge.target);
      if (frontier.has(edge.target) && valid.has(edge.source) && !included.has(edge.source)) next.add(edge.source);
    }
    for (const id of next) included.add(id);
    frontier = next;
    if (frontier.size === 0) break;
  }
  return included;
}

/**
 * Select the induced subgraph for a set of node IDs.
 * @param {Array<Record<string, any>>} nodes
 * @param {Array<Record<string, any>>} edges
 * @param {Set<string>|string[]} nodeIds
 */
export function inducedSubgraph(nodes, edges, nodeIds) {
  const ids = nodeIds instanceof Set ? nodeIds : new Set(nodeIds);
  return {
    nodes: nodes.filter((node) => ids.has(node.id)),
    edges: edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target)),
  };
}

/** @param {string} value */
function hashUnit(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

/**
 * Deterministic, small-graph force layout with semantic x-axis anchors.
 * The function is intentionally dependency-free so the Pages app works offline.
 * @param {Array<{id:string,kind:string,title:string}>} nodes
 * @param {Array<{source:string,target:string}>} edges
 * @param {{width?:number,height?:number,iterations?:number}} [options]
 */
export function createResearchLayout(nodes, edges, options = {}) {
  const width = options.width ?? 1440;
  const height = options.height ?? Math.max(920, Math.ceil(nodes.length / 10) * 330);
  const iterations = options.iterations ?? 190;
  const nodeIndex = indexById(nodes);
  const anchors = { domain: width * 0.27, bridge: width * 0.58, problem: width * 0.84 };
  const positions = new Map();
  const velocities = new Map();

  const kindGroups = new Map();
  for (const node of nodes) {
    if (!kindGroups.has(node.kind)) kindGroups.set(node.kind, []);
    kindGroups.get(node.kind).push(node);
  }
  for (const group of kindGroups.values()) group.sort((a, b) => compareNormalizedText(a.title, b.title) || compareText(a.id, b.id));

  for (const [kind, group] of kindGroups) {
    const anchor = anchors[kind] ?? width / 2;
    group.forEach((node, index) => {
      const fraction = (index + 1) / (group.length + 1);
      positions.set(node.id, {
        x: anchor + (hashUnit(`${node.id}:x`) - 0.5) * 190,
        y: 70 + fraction * (height - 140) + (hashUnit(`${node.id}:y`) - 0.5) * 70,
      });
      velocities.set(node.id, { x: 0, y: 0 });
    });
  }

  const validEdges = edges.filter((edge) => nodeIndex.has(edge.source) && nodeIndex.has(edge.target));
  const ids = nodes.map((node) => node.id);
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const cooling = 1 - iteration / iterations;
    const forces = new Map(ids.map((id) => [id, { x: 0, y: 0 }]));

    // Pairwise repulsion: adequate for the canonical graph's modest size.
    for (let first = 0; first < ids.length; first += 1) {
      const a = positions.get(ids[first]);
      for (let second = first + 1; second < ids.length; second += 1) {
        const b = positions.get(ids[second]);
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < 4) {
          dx = hashUnit(`${ids[first]}:${ids[second]}`) - 0.5;
          dy = hashUnit(`${ids[second]}:${ids[first]}`) - 0.5;
          distanceSquared = Math.max(1, dx * dx + dy * dy);
        }
        const distance = Math.sqrt(distanceSquared);
        const strength = Math.min(7.5, 5200 / distanceSquared);
        const fx = (dx / distance) * strength;
        const fy = (dy / distance) * strength;
        forces.get(ids[first]).x += fx;
        forces.get(ids[first]).y += fy;
        forces.get(ids[second]).x -= fx;
        forces.get(ids[second]).y -= fy;
      }
    }

    // Edge springs.
    for (const edge of validEdges) {
      const source = positions.get(edge.source);
      const target = positions.get(edge.target);
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const ideal = 175;
      const strength = (distance - ideal) * 0.012;
      const fx = (dx / distance) * strength;
      const fy = (dy / distance) * strength;
      forces.get(edge.source).x += fx;
      forces.get(edge.source).y += fy;
      forces.get(edge.target).x -= fx;
      forces.get(edge.target).y -= fy;
    }

    // Semantic anchors and gentle centering.
    for (const node of nodes) {
      const point = positions.get(node.id);
      const anchor = anchors[node.kind] ?? width / 2;
      const force = forces.get(node.id);
      force.x += (anchor - point.x) * 0.018;
      force.y += (height / 2 - point.y) * 0.0015;
    }

    for (const id of ids) {
      const velocity = velocities.get(id);
      const force = forces.get(id);
      velocity.x = (velocity.x + force.x * cooling) * 0.72;
      velocity.y = (velocity.y + force.y * cooling) * 0.72;
      const point = positions.get(id);
      point.x = Math.min(width - 90, Math.max(90, point.x + velocity.x));
      point.y = Math.min(height - 58, Math.max(58, point.y + velocity.y));
    }
  }

  return { positions, width, height };
}
