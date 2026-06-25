// @ts-check
import { canonicalStringify, sha256Hex } from './change-review.js';
import { normalizeReferenceRegistry, normalizeReviewLedger } from './evidence-review.js';
import { normalizeLeanCatalog, normalizeLeanAuditLedger } from './lean-target-audit.js';
import { normalizeWorkspaceLibrary } from './workspace.js';

export const RESEARCH_DOSSIER_APPLICATION = 'PhysMath Knowledge Tree';
export const RESEARCH_DOSSIER_SCHEMA_VERSION = 1;
export const RESEARCH_DOSSIER_KIND = 'integrated-research-dossier';
export const DOSSIER_GATE_STATES = Object.freeze(['ready', 'attention', 'blocked', 'not-applicable']);

const CHANGE_DECISIONS = new Set(['pending', 'accepted', 'needs-work', 'rejected']);
const CHANGE_RISK = new Map([['critical', 0], ['high', 1], ['medium', 2], ['low', 3], ['info', 4]]);
const ACTION_SEVERITY = new Map([['blocked', 0], ['attention', 1], ['info', 2]]);

/** @param {unknown} value @returns {value is Record<string, any>} */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @param {string} label */
function requireRecord(value, label) {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

/** @param {unknown} value @param {string} label */
function requireArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value;
}

/** @param {unknown} value @param {number} limit */
function boundedText(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

/** @param {unknown} value @param {string} label */
function requireDate(value, label) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new Error(`${label} must be an ISO-compatible date`);
  return new Date(value).toISOString();
}

/** @param {unknown} value */
function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

/** @param {string} left @param {string} right */
function compareText(left, right) {
  return String(left).localeCompare(String(right), 'en', { sensitivity: 'base', numeric: true });
}

/** @param {string} state @param {string} label @param {string} detail @param {number} completed @param {number} total */
function gate(state, id, label, detail, completed, total) {
  return { id, state, label, detail, completed, total };
}

/** @param {any} change @param {Set<string>} nodeIds @param {Set<string>} edgeIds */
function changeTouchesScope(change, nodeIds, edgeIds) {
  if (!isRecord(change)) return false;
  if (change.entity_type === 'metadata') return ['critical', 'high'].includes(change.risk);
  if (change.entity_type === 'node') return nodeIds.has(change.entity_id);
  if (change.entity_type === 'edge') {
    if (edgeIds.has(change.entity_id)) return true;
    const endpoints = [change.before?.source, change.before?.target, change.after?.source, change.after?.target];
    return endpoints.some((id) => typeof id === 'string' && nodeIds.has(id));
  }
  if (change.entity_type === 'collection') {
    const members = [...(change.before?.nodes ?? []), ...(change.after?.nodes ?? [])];
    return members.some((id) => typeof id === 'string' && nodeIds.has(id));
  }
  if (change.entity_type === 'research_move') {
    const targets = [...(change.before?.good_for ?? []), ...(change.after?.good_for ?? [])];
    return targets.some((id) => typeof id === 'string' && nodeIds.has(id));
  }
  return false;
}

/** @param {any} workspace */
function hasDiscriminatingTest(workspace) {
  const negativeTest = workspace.negative_results.some((result) =>
    Boolean(boundedText(result.next_test, 20_000)) && Boolean(boundedText(result.challenged_mechanism, 20_000)));
  if (negativeTest) return true;
  return workspace.bridge_cards.some((card) =>
    /\b(?:falsifier|falsador|discriminating test|prueba discriminante|what could destroy|qué lo podría destruir)\b/iu.test(card.markdown));
}

/** @param {any} dossier */
function fingerprintCore(dossier) {
  return {
    graph: dossier.graph,
    workspace: dossier.workspace,
    scope: dossier.scope,
    evidence: dossier.evidence,
    lean: dossier.lean,
    changes: dossier.changes,
    readiness: dossier.readiness,
  };
}

/** @param {Array<any>} actions */
function sortActions(actions) {
  return actions.sort((left, right) => compareText(
    `${ACTION_SEVERITY.get(left.severity)}\0${left.kind}\0${left.title}\0${left.target}`,
    `${ACTION_SEVERITY.get(right.severity)}\0${right.kind}\0${right.title}\0${right.target}`,
  ));
}

/**
 * Assemble one portable research dossier from canonical graph data and the
 * browser-local ledgers used by the Workbench, Evidence Review, Change Review
 * and Lean Target Audit surfaces.
 *
 * @param {{
 *   index: unknown,
 *   nodes: unknown,
 *   edges: unknown,
 *   referenceRegistry: unknown,
 *   workspaceLibrary: unknown,
 *   workspaceId?: unknown,
 *   evidenceLedger?: unknown,
 *   leanLedger?: unknown,
 *   changeReview?: {changes?:unknown,ledger?:unknown,baseline_fingerprint?:unknown,current_fingerprint?:unknown}|null,
 *   generatedAt?: unknown,
 * }} input
 */
export async function buildResearchDossier(input) {
  const options = requireRecord(input, 'Research dossier input');
  const index = requireRecord(options.index, 'Graph index');
  const nodes = requireArray(options.nodes, 'Graph nodes');
  const edges = requireArray(options.edges, 'Graph edges');
  const generatedAt = requireDate(
    options.generatedAt ?? new Date().toISOString(),
    'Research dossier generated_at',
  );

  const nodeById = new Map();
  for (const [position, node] of nodes.entries()) {
    if (!isRecord(node) || typeof node.id !== 'string' || !node.id) throw new Error(`Graph node ${position} needs a non-empty ID`);
    if (nodeById.has(node.id)) throw new Error(`Duplicate graph node ID: ${node.id}`);
    nodeById.set(node.id, node);
  }
  const edgeById = new Map();
  for (const [position, edge] of edges.entries()) {
    if (!isRecord(edge) || typeof edge.id !== 'string' || !edge.id) throw new Error(`Graph edge ${position} needs a non-empty ID`);
    if (edgeById.has(edge.id)) throw new Error(`Duplicate graph edge ID: ${edge.id}`);
    edgeById.set(edge.id, edge);
  }

  const validNodeIds = new Set(nodeById.keys());
  const library = normalizeWorkspaceLibrary(options.workspaceLibrary, validNodeIds, { now: generatedAt });
  const requestedWorkspaceId = boundedText(options.workspaceId, 128);
  const workspaceId = requestedWorkspaceId || library.active_workspace_id;
  const workspace = library.workspaces.find(({ id }) => id === workspaceId);
  if (!workspace) throw new Error(`Unknown workspace ID: ${workspaceId}`);

  const selectedNodeIds = new Set(workspace.node_ids);
  const selectedNodes = workspace.node_ids
    .map((id) => cloneJson(nodeById.get(id)))
    .sort((left, right) => compareText(left.title, right.title) || compareText(left.id, right.id));
  const selectedEdges = edges
    .filter((edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target))
    .map((edge) => cloneJson(edge))
    .sort((left, right) => compareText(left.id, right.id));
  const selectedEdgeIds = new Set(selectedEdges.map(({ id }) => id));

  const registry = normalizeReferenceRegistry(options.referenceRegistry);
  const validUrls = new Set(registry.references.map(({ url }) => url));
  const evidenceLedger = normalizeReviewLedger(options.evidenceLedger, validUrls, generatedAt);
  const reviewByUrl = new Map(evidenceLedger.reviews.map((review) => [review.url, review]));
  const usageKeys = new Set([
    ...workspace.node_ids.map((id) => `node:${id}`),
    ...selectedEdges.map(({ id }) => `edge:${id}`),
  ]);
  const references = registry.references
    .filter((reference) => reference.used_by.some((usage) => usageKeys.has(usage)))
    .map((reference) => {
      const review = reviewByUrl.get(reference.url) ?? {
        url: reference.url,
        status: 'unreviewed',
        source_class: 'unknown',
        identifier: null,
        checked_at: null,
        notes: '',
        updated_at: null,
      };
      return {
        reference: cloneJson(reference),
        relevant_usages: reference.used_by.filter((usage) => usageKeys.has(usage)),
        review: cloneJson(review),
      };
    })
    .sort((left, right) => compareText(left.reference.label, right.reference.label) || compareText(left.reference.url, right.reference.url));
  const claimReferences = references.filter(({ reference }) =>
    reference.scopes.some((scope) => scope === 'claim' || scope === 'formalization'));
  const evidenceByStatus = { unreviewed: 0, verified: 0, 'needs-follow-up': 0, superseded: 0 };
  for (const { review } of references) evidenceByStatus[review.status] += 1;

  const leanCatalog = normalizeLeanCatalog(nodes);
  const validLeanItemIds = new Set(leanCatalog.items.map(({ id }) => id));
  const leanLedger = normalizeLeanAuditLedger(options.leanLedger, validLeanItemIds, generatedAt);
  const leanRecordById = new Map(leanLedger.records.map((record) => [record.item_id, record]));
  const leanItems = leanCatalog.items
    .filter((item) => selectedNodeIds.has(item.node_id))
    .map((item) => {
      const record = leanRecordById.get(item.id) ?? {
        item_id: item.id,
        status: 'unreviewed',
        checked_at: null,
        toolchain: '',
        replacement: '',
        notes: '',
        updated_at: null,
      };
      return { ...cloneJson(item), audit: cloneJson(record) };
    });
  const leanByStatus = { unreviewed: 0, verified: 0, missing: 0, renamed: 0, blocked: 0 };
  for (const { audit } of leanItems) leanByStatus[audit.status] += 1;
  const probeItems = leanItems.filter(({ item_type: type }) => type === 'import' || type === 'declaration');

  const rawChangeReview = isRecord(options.changeReview) ? options.changeReview : null;
  const rawChanges = rawChangeReview ? requireArray(rawChangeReview.changes ?? [], 'Change review changes') : [];
  const rawDecisions = isRecord(rawChangeReview?.ledger) && Array.isArray(rawChangeReview.ledger.decisions)
    ? rawChangeReview.ledger.decisions
    : [];
  const decisionByKey = new Map(rawDecisions
    .filter(isRecord)
    .map((decision) => [decision.key, {
      key: boundedText(decision.key, 1000),
      status: CHANGE_DECISIONS.has(decision.status) ? decision.status : 'pending',
      notes: boundedText(decision.notes, 12_000),
      updated_at: typeof decision.updated_at === 'string' && !Number.isNaN(Date.parse(decision.updated_at))
        ? new Date(decision.updated_at).toISOString()
        : null,
    }]));
  const relevantChanges = rawChanges
    .filter((change) => changeTouchesScope(change, selectedNodeIds, selectedEdgeIds))
    .map((change) => ({
      change: cloneJson(change),
      decision: cloneJson(decisionByKey.get(change.key) ?? { key: change.key, status: 'pending', notes: '', updated_at: null }),
    }))
    .sort((left, right) => compareText(
      `${CHANGE_RISK.get(left.change.risk) ?? 99}\0${left.change.entity_type}\0${left.change.entity_id}`,
      `${CHANGE_RISK.get(right.change.risk) ?? 99}\0${right.change.entity_type}\0${right.change.entity_id}`,
    ));
  const governedChanges = relevantChanges.filter(({ change }) => ['critical', 'high'].includes(change.risk));
  const changeByStatus = { pending: 0, accepted: 0, 'needs-work': 0, rejected: 0 };
  for (const { decision } of relevantChanges) changeByStatus[decision.status] += 1;

  const gates = [];
  gates.push(workspace.node_ids.length > 0
    ? gate('ready', 'scope', 'Scope', `${workspace.node_ids.length} canonical nodes selected.`, workspace.node_ids.length, workspace.node_ids.length)
    : gate('blocked', 'scope', 'Scope', 'Select at least one canonical node in the Research Workbench.', 0, 1));

  const documented = Boolean(workspace.notes.trim()) || workspace.bridge_cards.length > 0;
  gates.push(documented
    ? gate('ready', 'mechanism', 'Mechanism', 'Working notes or a bridge-card draft document the intended mechanism.', 1, 1)
    : gate('attention', 'mechanism', 'Mechanism', 'Add working notes or a bridge-card draft before treating the scope as a campaign.', 0, 1));

  const discriminating = hasDiscriminatingTest(workspace);
  gates.push(discriminating
    ? gate('ready', 'falsifiability', 'Falsifiability', 'A falsifier or next discriminating test is recorded.', 1, 1)
    : gate('attention', 'falsifiability', 'Falsifiability', 'Record a falsifier or next discriminating test in the workspace.', 0, 1));

  if (claimReferences.length === 0) {
    gates.push(gate('not-applicable', 'evidence', 'Evidence', 'No claim/formalization references are attached to this induced scope.', 0, 0));
  } else {
    const verified = claimReferences.filter(({ review }) => review.status === 'verified').length;
    const superseded = claimReferences.filter(({ review }) => review.status === 'superseded').length;
    gates.push(superseded > 0
      ? gate('blocked', 'evidence', 'Evidence', `${superseded} source-bearing references are marked superseded.`, verified, claimReferences.length)
      : verified === claimReferences.length
        ? gate('ready', 'evidence', 'Evidence', 'Every source-bearing reference in scope is locally verified.', verified, claimReferences.length)
        : gate('attention', 'evidence', 'Evidence', `${claimReferences.length - verified} source-bearing references still need verification.`, verified, claimReferences.length));
  }

  if (probeItems.length === 0) {
    gates.push(gate('not-applicable', 'lean', 'Lean names', 'No Lean import or declaration candidates are attached to this scope.', 0, 0));
  } else {
    const usable = probeItems.filter(({ audit }) => audit.status === 'verified'
      || (audit.status === 'renamed' && Boolean(audit.replacement))).length;
    const blocked = probeItems.filter(({ audit }) => audit.status === 'missing' || audit.status === 'blocked').length;
    gates.push(blocked > 0
      ? gate('blocked', 'lean', 'Lean names', `${blocked} import/declaration candidates are missing or blocked.`, usable, probeItems.length)
      : usable === probeItems.length
        ? gate('ready', 'lean', 'Lean names', 'Every import/declaration candidate has a verified or replacement name.', usable, probeItems.length)
        : gate('attention', 'lean', 'Lean names', `${probeItems.length - usable} import/declaration candidates remain unaudited.`, usable, probeItems.length));
  }

  if (!rawChangeReview || !boundedText(rawChangeReview.baseline_fingerprint, 128)) {
    gates.push(gate('not-applicable', 'changes', 'Canonical changes', 'No local canonical-change baseline is available.', 0, 0));
  } else if (governedChanges.length === 0) {
    gates.push(gate('ready', 'changes', 'Canonical changes', 'No high/critical canonical changes affect this scope.', 0, 0));
  } else {
    const resolved = governedChanges.filter(({ decision }) => decision.status === 'accepted' || decision.status === 'rejected').length;
    const needsWork = governedChanges.filter(({ decision }) => decision.status === 'needs-work').length;
    gates.push(needsWork > 0
      ? gate('blocked', 'changes', 'Canonical changes', `${needsWork} high/critical changes are marked as requiring work.`, resolved, governedChanges.length)
      : resolved === governedChanges.length
        ? gate('ready', 'changes', 'Canonical changes', 'Every high/critical relevant change has a terminal decision.', resolved, governedChanges.length)
        : gate('attention', 'changes', 'Canonical changes', `${governedChanges.length - resolved} high/critical changes remain pending.`, resolved, governedChanges.length));
  }

  const actions = [];
  if (workspace.node_ids.length === 0) actions.push({ kind: 'scope', severity: 'blocked', title: 'Define the campaign scope', target: workspace.id, detail: 'Select canonical nodes in the Research Workbench.' });
  if (!documented) actions.push({ kind: 'mechanism', severity: 'attention', title: 'Document the mechanism', target: workspace.id, detail: 'Add notes or a bridge-card draft.' });
  if (!discriminating) actions.push({ kind: 'falsifiability', severity: 'attention', title: 'Add a discriminating test', target: workspace.id, detail: 'Record what would falsify the proposed transfer.' });
  for (const item of claimReferences) {
    if (item.review.status === 'verified') continue;
    actions.push({
      kind: 'evidence',
      severity: item.review.status === 'superseded' ? 'blocked' : 'attention',
      title: item.review.status === 'superseded' ? 'Replace a superseded source' : 'Review a source-bearing reference',
      target: item.reference.url,
      detail: item.reference.label,
    });
  }
  for (const item of probeItems) {
    const usable = item.audit.status === 'verified' || (item.audit.status === 'renamed' && Boolean(item.audit.replacement));
    if (usable) continue;
    actions.push({
      kind: 'lean',
      severity: item.audit.status === 'missing' || item.audit.status === 'blocked' ? 'blocked' : 'attention',
      title: item.audit.status === 'unreviewed' ? 'Audit a Lean name' : 'Resolve a Lean name issue',
      target: item.id,
      detail: `${item.node_title}: ${item.value}`,
    });
  }
  for (const item of governedChanges) {
    if (item.decision.status === 'accepted' || item.decision.status === 'rejected') continue;
    actions.push({
      kind: 'change',
      severity: item.decision.status === 'needs-work' ? 'blocked' : 'attention',
      title: item.decision.status === 'needs-work' ? 'Resolve a risky canonical change' : 'Review a risky canonical change',
      target: item.change.key,
      detail: item.change.title,
    });
  }
  for (const result of workspace.negative_results) {
    if (!result.next_test) continue;
    actions.push({ kind: 'experiment', severity: 'info', title: result.title, target: result.id, detail: result.next_test });
  }
  sortActions(actions);

  const overall = gates.some(({ state }) => state === 'blocked')
    ? 'blocked'
    : gates.some(({ state }) => state === 'attention')
      ? 'attention'
      : 'ready';

  const dossier = {
    application: RESEARCH_DOSSIER_APPLICATION,
    schema_version: RESEARCH_DOSSIER_SCHEMA_VERSION,
    kind: RESEARCH_DOSSIER_KIND,
    generated_at: generatedAt,
    graph: {
      name: boundedText(index.name, 500) || 'PhysMath Knowledge Tree',
      schema_version: boundedText(index.schema_version, 128),
      application_version: boundedText(index.application_version, 128),
      updated: boundedText(index.updated, 128),
    },
    workspace: cloneJson(workspace),
    scope: {
      node_count: selectedNodes.length,
      edge_count: selectedEdges.length,
      nodes: selectedNodes,
      edges: selectedEdges,
    },
    evidence: {
      reference_count: references.length,
      claim_reference_count: claimReferences.length,
      reviewed: references.length - evidenceByStatus.unreviewed,
      by_status: evidenceByStatus,
      references,
    },
    lean: {
      item_count: leanItems.length,
      probe_item_count: probeItems.length,
      reviewed: leanItems.length - leanByStatus.unreviewed,
      by_status: leanByStatus,
      items: leanItems,
    },
    changes: {
      available: Boolean(rawChangeReview && boundedText(rawChangeReview.baseline_fingerprint, 128)),
      baseline_fingerprint: boundedText(rawChangeReview?.baseline_fingerprint, 128) || null,
      current_fingerprint: boundedText(rawChangeReview?.current_fingerprint, 128) || null,
      change_count: relevantChanges.length,
      governed_change_count: governedChanges.length,
      by_status: changeByStatus,
      items: relevantChanges,
    },
    readiness: {
      overall,
      gates,
      action_count: actions.length,
      actions: actions.slice(0, 250),
    },
  };
  dossier.content_fingerprint = await sha256Hex(canonicalStringify(fingerprintCore(dossier)));
  return dossier;
}

/** @param {unknown} input */
export async function verifyResearchDossier(input) {
  const dossier = requireRecord(input, 'Research dossier');
  if (dossier.application !== RESEARCH_DOSSIER_APPLICATION) throw new Error('Dossier belongs to another application');
  if (dossier.schema_version !== RESEARCH_DOSSIER_SCHEMA_VERSION) throw new Error('Unsupported dossier schema version');
  if (dossier.kind !== RESEARCH_DOSSIER_KIND) throw new Error('Unsupported dossier kind');
  requireDate(dossier.generated_at, 'Research dossier generated_at');
  if (!/^[a-f0-9]{64}$/u.test(String(dossier.content_fingerprint ?? ''))) throw new Error('Research dossier fingerprint is invalid');
  requireRecord(dossier.graph, 'Research dossier graph');
  requireRecord(dossier.workspace, 'Research dossier workspace');
  requireRecord(dossier.scope, 'Research dossier scope');
  requireRecord(dossier.evidence, 'Research dossier evidence');
  requireRecord(dossier.lean, 'Research dossier Lean section');
  requireRecord(dossier.changes, 'Research dossier change section');
  requireRecord(dossier.readiness, 'Research dossier readiness');
  const expected = await sha256Hex(canonicalStringify(fingerprintCore(dossier)));
  if (expected !== dossier.content_fingerprint) throw new Error('Research dossier fingerprint mismatch');
  return cloneJson(dossier);
}

/** @param {string} text */
export async function importResearchDossier(text) {
  if (typeof text !== 'string') throw new Error('Research dossier import must be text');
  if (new TextEncoder().encode(text).length > 12_000_000) throw new Error('Research dossier import exceeds the size limit');
  return verifyResearchDossier(JSON.parse(text));
}

/** @param {unknown} value */
function markdownCell(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\r', ' ').replaceAll('\n', ' ').trim();
}

/** @param {any} dossier */
export function researchDossierMarkdown(dossier) {
  if (!isRecord(dossier) || dossier.kind !== RESEARCH_DOSSIER_KIND) throw new Error('Markdown export needs a research dossier');
  const lines = [
    `# Research Dossier: ${dossier.workspace.title}`,
    '',
    `- **Workspace:** \`${dossier.workspace.id}\``,
    `- **Generated:** ${dossier.generated_at}`,
    `- **Graph:** ${dossier.graph.name} ${dossier.graph.application_version || ''}`.trim(),
    `- **Content fingerprint:** \`${dossier.content_fingerprint}\``,
    `- **Readiness:** **${dossier.readiness.overall}**`,
    '',
    '## Readiness gates',
    '',
    '| Gate | State | Progress | Detail |',
    '| --- | --- | ---: | --- |',
    ...dossier.readiness.gates.map((item) =>
      `| ${markdownCell(item.label)} | ${markdownCell(item.state)} | ${item.completed}/${item.total} | ${markdownCell(item.detail)} |`),
    '',
    '## Canonical scope',
    '',
    `- Nodes: ${dossier.scope.node_count}`,
    `- Induced edges: ${dossier.scope.edge_count}`,
    '',
    ...dossier.scope.nodes.map((node) => `- **${node.title ?? node.id}** (\`${node.id}\`) — ${node.summary ?? ''}`),
    '',
    '## Evidence',
    '',
    `- References in scope: ${dossier.evidence.reference_count}`,
    `- Source-bearing references: ${dossier.evidence.claim_reference_count}`,
    `- Locally reviewed: ${dossier.evidence.reviewed}`,
    '',
    ...dossier.evidence.references.map((item) =>
      `- [${item.review.status}] ${item.reference.label} — ${item.reference.url}`),
    '',
    '## Lean target audit',
    '',
    `- Items in scope: ${dossier.lean.item_count}`,
    `- Imports/declarations: ${dossier.lean.probe_item_count}`,
    `- Locally reviewed: ${dossier.lean.reviewed}`,
    '',
    ...dossier.lean.items.map((item) =>
      `- [${item.audit.status}] ${item.node_title} · ${item.item_type}: \`${item.value}\`${item.audit.replacement ? ` → \`${item.audit.replacement}\`` : ''}`),
    '',
    '## Canonical change governance',
    '',
    dossier.changes.available
      ? `- Relevant changes: ${dossier.changes.change_count}; high/critical: ${dossier.changes.governed_change_count}`
      : '- No local change-review baseline was available.',
    '',
    ...dossier.changes.items.map((item) =>
      `- [${item.change.risk}/${item.decision.status}] ${item.change.entity_type}:${item.change.entity_id} — ${item.change.title}`),
    '',
    '## Open actions',
    '',
    ...(dossier.readiness.actions.length
      ? dossier.readiness.actions.map((action) => `- **${action.severity} · ${action.kind}:** ${action.title} — ${action.detail}`)
      : ['- No open actions in the current local ledgers.']),
    '',
    '## Workspace notes',
    '',
    dossier.workspace.notes || '_No working notes recorded._',
    '',
    '## Bridge-card drafts',
    '',
    ...(dossier.workspace.bridge_cards.length
      ? dossier.workspace.bridge_cards.flatMap((card) => [`### ${card.title}`, '', card.markdown || '_Empty draft._', ''])
      : ['_No bridge-card drafts recorded._', '']),
    '## Negative and inconclusive results',
    '',
    ...(dossier.workspace.negative_results.length
      ? dossier.workspace.negative_results.flatMap((result) => [
        `### ${result.title} — ${result.status}`,
        '',
        `- **Observation:** ${result.observation || 'Not recorded.'}`,
        `- **Challenged mechanism:** ${result.challenged_mechanism || 'Not recorded.'}`,
        `- **Next test:** ${result.next_test || 'Not recorded.'}`,
        '',
      ])
      : ['_No negative or inconclusive results recorded._', '']),
    '> This dossier is a local research handoff. It does not promote graph confidence, certify sources, prove Lean targets or mutate canonical JSON.',
    '',
  ];
  return lines.join('\n');
}
