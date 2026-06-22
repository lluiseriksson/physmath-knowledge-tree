import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const check = process.argv.includes('--check');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const index = readJson('graph/index.json');
const nodes = readJson(index.canonical_files.nodes);
const edges = readJson(index.canonical_files.edges);
const moves = readJson(index.canonical_files.research_moves);
const collections = readJson(index.canonical_files.collections);
const curationIndex = readJson('curation/index.json');
const curationRecords = curationIndex.records.map(readJson);

const nodeById = new Map(nodes.map((node) => [node.id, node]));
const adjacency = new Map(nodes.map((node) => [node.id, new Set()]));
for (const edge of edges) {
  adjacency.get(edge.source)?.add(edge.target);
  adjacency.get(edge.target)?.add(edge.source);
}

function components() {
  const unseen = new Set(nodes.map((node) => node.id));
  const result = [];
  while (unseen.size) {
    const seed = unseen.values().next().value;
    const queue = [seed];
    const part = [];
    unseen.delete(seed);
    while (queue.length) {
      const current = queue.shift();
      part.push(current);
      for (const next of adjacency.get(current) ?? []) {
        if (!unseen.has(next)) continue;
        unseen.delete(next);
        queue.push(next);
      }
    }
    result.push(part.sort());
  }
  return result.sort((a, b) => b.length - a.length || a[0].localeCompare(b[0]));
}

function reachableFromRoots() {
  const seen = new Set(index.root_nodes.filter((id) => nodeById.has(id)));
  const queue = [...seen];
  while (queue.length) {
    const current = queue.shift();
    for (const next of adjacency.get(current) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return seen;
}

function hasSourceBearingReference(item) {
  return item.references?.some((reference) => ['claim', 'formalization'].includes(reference.scope)) ?? false;
}

function createReferenceRegistry() {
  const entries = new Map();
  for (const [kind, items] of [['node', nodes], ['edge', edges]]) {
    for (const item of items) {
      for (const reference of item.references ?? []) {
        const existing = entries.get(reference.url) ?? {
          url: reference.url,
          label: reference.label,
          type: reference.type,
          scopes: new Set(),
          used_by: [],
        };
        existing.scopes.add(reference.scope);
        existing.used_by.push(`${kind}:${item.id}`);
        entries.set(reference.url, existing);
      }
    }
  }
  return {
    schema_version: '1.0.0',
    graph_schema_version: index.schema_version,
    references: [...entries.values()]
      .sort((a, b) => a.url.localeCompare(b.url))
      .map((entry) => ({
        url: entry.url,
        label: entry.label,
        type: entry.type,
        scopes: [...entry.scopes].sort(),
        used_by: entry.used_by.sort(),
      })),
  };
}

const connectedComponents = components();
const reachable = reachableFromRoots();
const degrees = nodes
  .map((node) => ({ id: node.id, degree: adjacency.get(node.id)?.size ?? 0 }))
  .sort((a, b) => b.degree - a.degree || a.id.localeCompare(b.id));
const sourceBearingNodes = nodes.filter((node) => ['formal', 'literature'].includes(node.confidence));
const sourceBearingEdges = edges.filter((edge) => ['formal', 'literature'].includes(edge.confidence));
const nodeCitationDebt = sourceBearingNodes
  .filter((node) => !hasSourceBearingReference(node))
  .map((node) => node.id)
  .sort();
const edgeCitationDebt = sourceBearingEdges
  .filter((edge) => !hasSourceBearingReference(edge))
  .map((edge) => edge.id)
  .sort();
const contextOnlyNodes = nodes
  .filter((node) => !hasSourceBearingReference(node))
  .map((node) => node.id)
  .sort();
const contextOnlyEdges = edges
  .filter((edge) => !hasSourceBearingReference(edge))
  .map((edge) => edge.id)
  .sort();
const formalWithoutDeclarations = nodes
  .filter((node) => node.confidence === 'formal' && !(node.lean?.declarations?.length))
  .map((node) => node.id)
  .sort();
const curationQueue = curationRecords.reduce(
  (sum, record) => sum + record.verification_queue
    .filter((item) => !['verified', 'rejected'].includes(item.status)).length,
  0,
);
const pendingCurationReviews = curationRecords.filter((record) => record.review.status !== 'approved').length;
const promotedDestinations = curationRecords.flatMap(
  (record) => record.promoted.flatMap((decision) => decision.destinations),
);
const promotedNodeIds = new Set(
  promotedDestinations.filter((item) => item.type === 'graph_node').map((item) => item.value),
);
const promotedEdgeIds = new Set(
  promotedDestinations.filter((item) => item.type === 'graph_edge').map((item) => item.value),
);
const referenceRegistry = createReferenceRegistry();

const audit = {
  schema_version: '1.1.0',
  graph_schema_version: index.schema_version,
  graph: {
    nodes: nodes.length,
    edges: edges.length,
    research_moves: moves.length,
    collections: collections.length,
    weakly_connected_components: connectedComponents.length,
    largest_component: connectedComponents[0]?.length ?? 0,
    nodes_reachable_from_roots: reachable.size,
    isolated_nodes: degrees.filter((item) => item.degree === 0).map((item) => item.id),
    highest_degree_nodes: degrees.slice(0, 10),
  },
  evidence: {
    nodes_with_references: nodes.filter((node) => node.references?.length).length,
    edges_with_references: edges.filter((edge) => edge.references?.length).length,
    source_bearing_nodes: sourceBearingNodes.length,
    source_bearing_nodes_with_claim_or_formalization: sourceBearingNodes
      .filter(hasSourceBearingReference).length,
    source_bearing_edges: sourceBearingEdges.length,
    source_bearing_edges_with_claim_or_formalization: sourceBearingEdges
      .filter(hasSourceBearingReference).length,
    unique_reference_urls: referenceRegistry.references.length,
    context_only_nodes: contextOnlyNodes,
    context_only_edges: contextOnlyEdges,
    formal_nodes_with_declarations: nodes
      .filter((node) => node.confidence === 'formal' && node.lean?.declarations?.length).length,
    formal_nodes_without_declarations: formalWithoutDeclarations,
    node_citation_debt: nodeCitationDebt,
    edge_citation_debt: edgeCitationDebt,
  },
  curation: {
    records: curationRecords.length,
    open_verification_requests: curationQueue,
    pending_user_reviews: pendingCurationReviews,
    promoted_nodes: promotedNodeIds.size,
    promoted_edges: promotedEdgeIds.size,
  },
};

const jsonOutput = `${JSON.stringify(audit, null, 2)}\n`;
const jsonPath = join(root, 'graph/audit.json');
const registryOutput = `${JSON.stringify(referenceRegistry, null, 2)}\n`;
const registryPath = join(root, 'graph/reference-registry.json');
const mdLines = [
  '# Graph evidence and integrity audit',
  '',
  'Generated deterministically from the canonical graph and curation ledger. Reference coverage is reported separately from evidence strength: a contextual source never upgrades a heuristic or speculative claim.',
  '',
  '## Integrity',
  '',
  `- Nodes: **${nodes.length}**; edges: **${edges.length}**; moves: **${moves.length}**; collections: **${collections.length}**.`,
  `- Weakly connected components: **${connectedComponents.length}**; nodes reachable from declared roots: **${reachable.size}/${nodes.length}**.`,
  `- Isolated nodes: **${audit.graph.isolated_nodes.length}**.`,
  '',
  '## Reference coverage',
  '',
  `- Nodes with at least one reference: **${audit.evidence.nodes_with_references}/${nodes.length}**.`,
  `- Edges with at least one reference: **${audit.evidence.edges_with_references}/${edges.length}**.`,
  `- Formal/literature nodes with a claim or formalization source: **${audit.evidence.source_bearing_nodes_with_claim_or_formalization}/${sourceBearingNodes.length}**.`,
  `- Formal/literature edges with a claim or formalization source: **${audit.evidence.source_bearing_edges_with_claim_or_formalization}/${sourceBearingEdges.length}**.`,
  `- Unique normalized reference URLs: **${audit.evidence.unique_reference_urls}**.`,
  `- Context-only nodes: **${contextOnlyNodes.length}**; context-only edges: **${contextOnlyEdges.length}**.`,
  `- Formal nodes with named Lean declarations: **${audit.evidence.formal_nodes_with_declarations}**.`,
  '',
  'Reference scopes are defined in [`REFERENCE_POLICY.md`](./REFERENCE_POLICY.md): `claim` directly supports the represented statement, `context` is background only, and `formalization` points to proof-bearing code or a named declaration.',
  '',
  '> Complete reference coverage is a traceability property, not a certification that every graph mechanism is a theorem. Evidence labels and falsifiers remain authoritative.',
  '',
  '## Curation state',
  '',
  `- Open source-verification requests: **${curationQueue}**.`,
  `- Records awaiting explicit user review: **${pendingCurationReviews}**.`,
  '',
  'The two values above are deliberately not forced to zero: only the user can approve source deletion, and unresolved verification requests remain visible.',
  '',
  '## Highest-degree nodes',
  '',
  '| Node | Degree |',
  '| --- | ---: |',
  ...degrees.slice(0, 10).map((item) => `| \`${item.id}\` | ${item.degree} |`),
  '',
  `## Formal/literature node citation debt (${nodeCitationDebt.length})`,
  '',
  ...(nodeCitationDebt.length
    ? nodeCitationDebt.map((id) => `- \`${id}\``)
    : ['No formal/literature node lacks a claim or formalization reference.']),
  '',
  `## Formal/literature edge citation debt (${edgeCitationDebt.length})`,
  '',
  ...(edgeCitationDebt.length
    ? edgeCitationDebt.map((id) => `- \`${id}\``)
    : ['No formal/literature edge lacks a claim or formalization reference.']),
  '',
  '## Context-only exploratory items',
  '',
  'These items deliberately remain heuristic or speculative and use references only to define their surrounding literature:',
  '',
  ...contextOnlyNodes.map((id) => `- node \`${id}\``),
  ...contextOnlyEdges.map((id) => `- edge \`${id}\``),
  '',
];
const mdOutput = `${mdLines.join('\n')}\n`;
const mdPath = join(root, 'docs/GRAPH_AUDIT.md');

if (check) {
  if (readFileSync(jsonPath, 'utf8') !== jsonOutput) {
    throw new Error('graph/audit.json is stale; run npm run generate:audit');
  }
  if (readFileSync(registryPath, 'utf8') !== registryOutput) {
    throw new Error('graph/reference-registry.json is stale; run npm run generate:audit');
  }
  if (readFileSync(mdPath, 'utf8') !== mdOutput) {
    throw new Error('docs/GRAPH_AUDIT.md is stale; run npm run generate:audit');
  }
  console.log('Validated generated graph audit and reference registry.');
} else {
  writeFileSync(jsonPath, jsonOutput);
  writeFileSync(registryPath, registryOutput);
  writeFileSync(mdPath, mdOutput);
  console.log('Wrote graph/audit.json, graph/reference-registry.json and docs/GRAPH_AUDIT.md');
}
