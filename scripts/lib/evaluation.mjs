import { searchNodes, shortestPath } from '../../src/lib/research-graph.js';

export function hasSourceBearingReference(item) {
  return item.references?.some((reference) =>
    ['claim', 'formalization'].includes(reference.scope)) ?? false;
}

export function buildWaypointRoute(nodes, edges, waypoints, directed = false) {
  if (!Array.isArray(waypoints) || waypoints.length < 2) return null;
  const route = { nodes: [], edges: [] };
  for (let index = 0; index < waypoints.length - 1; index += 1) {
    const segment = shortestPath(nodes, edges, waypoints[index], waypoints[index + 1], directed);
    if (!segment) return null;
    route.nodes.push(...(index === 0 ? segment.nodes : segment.nodes.slice(1)));
    route.edges.push(...segment.edges);
  }
  return route;
}

export function evaluateSearchCases(nodes, cases, limit = 5) {
  const results = cases.map((item) => {
    const matches = searchNodes(nodes, item.query, limit);
    const rankIndex = matches.findIndex((match) => match.node.id === item.expected_node);
    return {
      id: item.id,
      query: item.query,
      expected_node: item.expected_node,
      rank: rankIndex < 0 ? null : rankIndex + 1,
      top_nodes: matches.map((match) => match.node.id),
      passed: rankIndex === 0,
    };
  });
  const reciprocalRank = results.reduce((sum, item) => sum + (item.rank ? 1 / item.rank : 0), 0);
  return {
    total: results.length,
    top_1_accuracy: results.length ? results.filter((item) => item.rank === 1).length / results.length : 0,
    recall_at_3: results.length
      ? results.filter((item) => item.rank !== null && item.rank <= 3).length / results.length
      : 0,
    mean_reciprocal_rank: results.length ? reciprocalRank / results.length : 0,
    passed: results.every((item) => item.passed),
    cases: results,
  };
}

export function evaluateRouteScenario(nodes, edges, scenario) {
  const route = buildWaypointRoute(nodes, edges, scenario.waypoints, scenario.directed);
  if (!route) {
    return { id: scenario.id, title: scenario.title, passed: false, failure: 'unreachable', route: null };
  }
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  const routeEdges = route.edges.map((id) => edgeById.get(id)).filter(Boolean);
  const disallowedEdges = routeEdges
    .filter((edge) => !scenario.permitted_confidence.includes(edge.confidence))
    .map((edge) => edge.id);
  const unreferencedEdges = routeEdges
    .filter((edge) => !(edge.references?.length))
    .map((edge) => edge.id);
  const terminal = route.nodes.at(-1) ?? null;
  const checks = {
    within_edge_budget: route.edges.length <= scenario.maximum_edges,
    permitted_evidence_only: disallowedEdges.length === 0,
    all_edges_referenced: unreferencedEdges.length === 0,
    expected_terminal: terminal === scenario.expected_terminal,
  };
  return {
    id: scenario.id,
    title: scenario.title,
    research_question: scenario.research_question,
    passed: Object.values(checks).every(Boolean),
    checks,
    disallowed_edges: disallowedEdges,
    unreferenced_edges: unreferencedEdges,
    route,
  };
}

export function evaluateEvidence(nodes, edges) {
  const sourceBearingNodes = nodes.filter((node) => ['formal', 'literature'].includes(node.confidence));
  const sourceBearingEdges = edges.filter((edge) => ['formal', 'literature'].includes(edge.confidence));
  const nodeReferences = nodes.filter((node) => node.references?.length).length;
  const edgeReferences = edges.filter((edge) => edge.references?.length).length;
  const claimNodes = sourceBearingNodes.filter(hasSourceBearingReference).length;
  const claimEdges = sourceBearingEdges.filter(hasSourceBearingReference).length;
  return {
    nodes_with_references: nodeReferences,
    node_total: nodes.length,
    edges_with_references: edgeReferences,
    edge_total: edges.length,
    source_bearing_nodes_with_claim_or_formalization: claimNodes,
    source_bearing_node_total: sourceBearingNodes.length,
    source_bearing_edges_with_claim_or_formalization: claimEdges,
    source_bearing_edge_total: sourceBearingEdges.length,
    passed: nodeReferences === nodes.length
      && edgeReferences === edges.length
      && claimNodes === sourceBearingNodes.length
      && claimEdges === sourceBearingEdges.length,
  };
}

export function evaluateLeanInterfaces(nodes) {
  const imports = nodes.filter((node) => node.lean?.imports?.length).length;
  const targets = nodes.filter((node) => node.lean?.targets?.length).length;
  const declarations = nodes.filter((node) => node.lean?.declarations?.length).length;
  return {
    nodes_with_imports: imports,
    nodes_with_bounded_targets: targets,
    nodes_with_named_declarations: declarations,
    node_total: nodes.length,
    passed: imports === nodes.length && targets === nodes.length,
  };
}

export function scoreControlledCriteria(rubric, outcomes) {
  const criteria = rubric.criteria.map((criterion) => ({
    ...criterion,
    passed: Boolean(outcomes[criterion.id]),
    earned: outcomes[criterion.id] ? criterion.weight : 0,
  }));
  return {
    scope: rubric.scope,
    score: criteria.reduce((sum, criterion) => sum + criterion.earned, 0),
    maximum: criteria.reduce((sum, criterion) => sum + criterion.weight, 0),
    criteria,
    exclusions: rubric.exclusions,
  };
}

export function evaluateRepository({ nodes, edges, scenarios, rubric, repositoryChecks }) {
  const search = evaluateSearchCases(nodes, scenarios.search_cases);
  const routes = scenarios.route_scenarios.map((scenario) => evaluateRouteScenario(nodes, edges, scenario));
  const evidence = evaluateEvidence(nodes, edges);
  const lean = evaluateLeanInterfaces(nodes);
  const graphIntegrity = new Set(nodes.map((node) => node.id)).size === nodes.length
    && new Set(edges.map((edge) => edge.id)).size === edges.length
    && edges.every((edge) => nodes.some((node) => node.id === edge.source)
      && nodes.some((node) => node.id === edge.target));
  const quality = scoreControlledCriteria(rubric, {
    graph_integrity: graphIntegrity,
    evidence_traceability: evidence.passed,
    reproducible_retrieval: search.passed && routes.every((route) => route.passed),
    formalization_interfaces: lean.passed,
    automation_and_documentation: repositoryChecks.every(Boolean),
  });
  return {
    schema_version: '1.0.0',
    graph_integrity: { passed: graphIntegrity },
    search,
    routes: {
      total: routes.length,
      passed_count: routes.filter((route) => route.passed).length,
      passed: routes.every((route) => route.passed),
      scenarios: routes,
    },
    evidence,
    lean,
    controlled_quality: quality,
    passed: quality.score === quality.maximum,
  };
}
