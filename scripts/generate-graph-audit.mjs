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

const connectedComponents = components();
const reachable = reachableFromRoots();
const degrees = nodes.map((node) => ({ id: node.id, degree: adjacency.get(node.id)?.size ?? 0 }))
  .sort((a, b) => b.degree - a.degree || a.id.localeCompare(b.id));
const nodeCitationDebt = nodes
  .filter((node) => ['formal', 'literature'].includes(node.confidence) && !(node.references?.length))
  .map((node) => node.id)
  .sort();
const edgeCitationDebt = edges
  .filter((edge) => ['formal', 'literature'].includes(edge.confidence) && !(edge.references?.length))
  .map((edge) => edge.id)
  .sort();
const formalWithoutDeclarations = nodes
  .filter((node) => node.confidence === 'formal' && !(node.lean?.declarations?.length))
  .map((node) => node.id)
  .sort();
const curationQueue = curationRecords.reduce((sum, record) =>
  sum + record.verification_queue.filter((item) => !['verified', 'rejected'].includes(item.status)).length, 0);
const pendingCurationReviews = curationRecords.filter((record) => record.review.status !== 'approved').length;
const promotedDestinations = curationRecords.flatMap((record) => record.promoted.flatMap((decision) => decision.destinations));
const promotedNodeIds = new Set(promotedDestinations.filter((item) => item.type === 'graph_node').map((item) => item.value));
const promotedEdgeIds = new Set(promotedDestinations.filter((item) => item.type === 'graph_edge').map((item) => item.value));

const audit = {
  schema_version: '1.0.0',
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
    nodes_with_direct_references: nodes.filter((node) => node.references?.length).length,
    edges_with_direct_references: edges.filter((edge) => edge.references?.length).length,
    formal_nodes_with_declarations: nodes.filter((node) => node.confidence === 'formal' && node.lean?.declarations?.length).length,
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
const mdLines = [
  '# Graph evidence and integrity audit',
  '',
  'Generated deterministically from the canonical graph and curation ledger. This report exposes citation debt instead of silently treating every edge as independently sourced.',
  '',
  '## Integrity',
  '',
  `- Nodes: **${nodes.length}**; edges: **${edges.length}**; moves: **${moves.length}**; collections: **${collections.length}**.`,
  `- Weakly connected components: **${connectedComponents.length}**; nodes reachable from declared roots: **${reachable.size}/${nodes.length}**.`,
  `- Isolated nodes: **${audit.graph.isolated_nodes.length}**.`,
  '',
  '## Evidence coverage',
  '',
  `- Nodes with direct references: **${audit.evidence.nodes_with_direct_references}/${nodes.length}**.`,
  `- Edges with direct references: **${audit.evidence.edges_with_direct_references}/${edges.length}**.`,
  `- Formal nodes with named Lean declarations: **${audit.evidence.formal_nodes_with_declarations}**.`,
  `- Open source-verification requests in the curation ledger: **${curationQueue}**.`,
  `- Curation records awaiting explicit user review: **${pendingCurationReviews}**.`,
  '',
  '> A `formal` label means the represented implication is elementary or formal under stated assumptions; it does not mean the entire surrounding research programme has been formalized.',
  '',
  '## Highest-degree nodes',
  '',
  '| Node | Degree |',
  '| --- | ---: |',
  ...degrees.slice(0, 10).map((item) => `| \`${item.id}\` | ${item.degree} |`),
  '',
  `## Node citation debt (${nodeCitationDebt.length})`,
  '',
  ...(nodeCitationDebt.length ? nodeCitationDebt.map((id) => `- \`${id}\``) : ['No formal/literature node lacks a direct reference.']),
  '',
  `## Edge citation debt (${edgeCitationDebt.length})`,
  '',
  'Edges currently state mechanisms and evidence classes, but most inherit their source context from node references and curation records. Direct edge references should be added during primary-source verification.',
  '',
  ...(edgeCitationDebt.length ? edgeCitationDebt.map((id) => `- \`${id}\``) : ['No formal/literature edge lacks a direct reference.']),
  '',
];
const mdOutput = `${mdLines.join('\n')}\n`;
const mdPath = join(root, 'docs/GRAPH_AUDIT.md');

if (check) {
  if (readFileSync(jsonPath, 'utf8') !== jsonOutput) throw new Error('graph/audit.json is stale; run npm run generate:audit');
  if (readFileSync(mdPath, 'utf8') !== mdOutput) throw new Error('docs/GRAPH_AUDIT.md is stale; run npm run generate:audit');
  console.log('Validated generated graph audit.');
} else {
  writeFileSync(jsonPath, jsonOutput);
  writeFileSync(mdPath, mdOutput);
  console.log('Wrote graph/audit.json and docs/GRAPH_AUDIT.md');
}
