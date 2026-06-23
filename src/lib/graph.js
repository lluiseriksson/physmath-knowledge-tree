// @ts-check
import { compareText } from './text.js';
/** @typedef {import('./types.js').Topic} Topic */
/** @typedef {import('./types.js').ProgressStatus} ProgressStatus */
/** @typedef {import('./types.js').GraphPoint} GraphPoint */

export const NODE_WIDTH = 218;
export const NODE_HEIGHT = 68;

/** @param {Topic[]} topics */
export function indexTopics(topics) {
  return new Map(topics.map((topic) => [topic.id, topic]));
}

/** @param {Topic[]} topics @returns {Topic[]} */
export function topologicalSort(topics) {
  const byId = indexTopics(topics);
  const indegree = new Map(topics.map((topic) => [topic.id, 0]));
  const children = new Map(topics.map((topic) => [topic.id, []]));

  for (const topic of topics) {
    for (const prerequisite of topic.prerequisites) {
      const childIds = children.get(prerequisite);
      if (!byId.has(prerequisite) || !childIds) {
        throw new Error(`Topic "${topic.id}" references missing prerequisite "${prerequisite}".`);
      }
      indegree.set(topic.id, /** @type {number} */ (indegree.get(topic.id)) + 1);
      childIds.push(topic.id);
    }
  }

  const sourceOrder = new Map(topics.map((topic, index) => [topic.id, index]));
  const queue = topics.filter((topic) => indegree.get(topic.id) === 0);
  const sorted = [];

  while (queue.length > 0) {
    queue.sort((left, right) =>
      /** @type {number} */ (sourceOrder.get(left.id))
      - /** @type {number} */ (sourceOrder.get(right.id)));
    const current = /** @type {Topic} */ (queue.shift());
    sorted.push(current);

    for (const id of /** @type {string[]} */ (children.get(current.id))) {
      const next = /** @type {number} */ (indegree.get(id)) - 1;
      indegree.set(id, next);
      if (next === 0) queue.push(/** @type {Topic} */ (byId.get(id)));
    }
  }

  if (sorted.length !== topics.length) {
    const sortedIds = new Set(sorted.map((topic) => topic.id));
    const unresolved = topics.filter((topic) => !sortedIds.has(topic.id));
    throw new Error(`Cycle detected: ${unresolved.map((topic) => topic.id).join(', ')}`);
  }
  return sorted;
}

/** @param {Topic[]} topics */
export function computeDepths(topics) {
  const depths = new Map();
  for (const topic of topologicalSort(topics)) {
    const depth = topic.prerequisites.length > 0
      ? Math.max(...topic.prerequisites.map((id) => /** @type {number} */ (depths.get(id)))) + 1
      : 0;
    depths.set(topic.id, depth);
  }
  return depths;
}

/** @param {Topic[]} topics @param {{horizontalGap?:number,verticalGap?:number,margin?:number}} [options] */
export function createLayout(topics, options = {}) {
  const horizontalGap = options.horizontalGap ?? 96;
  const verticalGap = options.verticalGap ?? 30;
  const margin = options.margin ?? 72;
  const depths = computeDepths(topics);
  const maxDepth = Math.max(0, ...depths.values());
  const layers = Array.from({ length: maxDepth + 1 }, () => []);
  const domainOrder = new Map([['math', 0], ['bridge', 1], ['physics', 2]]);

  for (const topic of topics) {
    layers[/** @type {number} */ (depths.get(topic.id))].push(topic);
  }
  for (const layer of layers) {
    layer.sort((left, right) =>
      (domainOrder.get(left.domain) ?? 3) - (domainOrder.get(right.domain) ?? 3)
      || compareText(left.area, right.area)
      || compareText(left.id, right.id));
  }

  const maxLayerSize = Math.max(1, ...layers.map((layer) => layer.length));
  const width = margin * 2 + (maxDepth + 1) * NODE_WIDTH + maxDepth * horizontalGap;
  const height = margin * 2 + maxLayerSize * NODE_HEIGHT
    + Math.max(0, maxLayerSize - 1) * verticalGap;
  const positions = new Map();

  layers.forEach((layer, depth) => {
    const layerHeight = layer.length * NODE_HEIGHT
      + Math.max(0, layer.length - 1) * verticalGap;
    const offset = margin + (height - margin * 2 - layerHeight) / 2;
    layer.forEach((topic, order) => positions.set(topic.id, {
      x: margin + depth * (NODE_WIDTH + horizontalGap),
      y: offset + order * (NODE_HEIGHT + verticalGap),
      depth,
      order,
    }));
  });

  return { positions, width, height, maxDepth };
}

/** @param {string} id @param {Map<string,Topic>} byId */
export function getAncestors(id, byId) {
  const ancestors = new Set();
  const visit = (current) => {
    const topic = byId.get(current);
    if (!topic) return;
    for (const prerequisite of topic.prerequisites) {
      if (ancestors.has(prerequisite)) continue;
      ancestors.add(prerequisite);
      visit(prerequisite);
    }
  };
  visit(id);
  return ancestors;
}

/** @param {string} id @param {Topic[]} topics */
export function getDescendants(id, topics) {
  const descendants = new Set();
  const children = new Map(topics.map((topic) => [topic.id, []]));
  for (const topic of topics) {
    for (const prerequisite of topic.prerequisites) {
      children.get(prerequisite)?.push(topic.id);
    }
  }
  const visit = (current) => {
    for (const child of children.get(current) ?? []) {
      if (descendants.has(child)) continue;
      descendants.add(child);
      visit(child);
    }
  };
  visit(id);
  return descendants;
}

/** @param {string} id @param {Topic[]} topics */
export function getLearningPath(id, topics) {
  const byId = indexTopics(topics);
  if (!byId.has(id)) return [];
  const ids = getAncestors(id, byId);
  ids.add(id);
  return topologicalSort(topics.filter((topic) => ids.has(topic.id)));
}

/** @param {Topic} topic @param {Record<string,ProgressStatus>} statuses */
export function isUnlocked(topic, statuses) {
  return topic.prerequisites.every((id) => statuses[id] === 'mastered');
}

/** @param {Topic[]} topics @param {Record<string,ProgressStatus>} statuses @param {number} [limit] */
export function getRecommendedTopics(topics, statuses, limit = 6) {
  const levels = new Map([['foundation', 0], ['intermediate', 1], ['advanced', 2]]);
  const statusRank = (topic) => statuses[topic.id] === 'learning' ? 0 : 1;
  const levelRank = (topic) => levels.get(topic.level) ?? levels.size;
  return topics
    .filter((topic) => statuses[topic.id] !== 'mastered' && isUnlocked(topic, statuses))
    .sort((left, right) =>
      statusRank(left) - statusRank(right)
      || levelRank(left) - levelRank(right)
      || left.estimatedHours - right.estimatedHours
      || compareText(left.id, right.id))
    .slice(0, limit);
}

/** @param {Topic[]} topics @param {Record<string,ProgressStatus>} statuses */
export function getProgressStats(topics, statuses) {
  const counts = { mastered: 0, learning: 0, notStarted: 0, total: topics.length };
  for (const topic of topics) {
    const status = statuses[topic.id] ?? 'not-started';
    if (status === 'mastered') counts.mastered += 1;
    else if (status === 'learning') counts.learning += 1;
    else counts.notStarted += 1;
  }
  return {
    ...counts,
    percent: topics.length > 0 ? Math.round(counts.mastered / topics.length * 100) : 0,
  };
}

/** @param {GraphPoint} source @param {GraphPoint} target */
export function createEdgePath(source, target) {
  const startX = source.x + NODE_WIDTH;
  const startY = source.y + NODE_HEIGHT / 2;
  const endX = target.x;
  const endY = target.y + NODE_HEIGHT / 2;
  const curve = Math.max(44, (endX - startX) * 0.48);
  return `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
}
