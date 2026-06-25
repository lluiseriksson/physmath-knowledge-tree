// @ts-check
import { verifyResearchDossier } from './research-dossier.js';
import {
  canonicalStringify,
  normalizeRunLedger,
  sha256Hex,
  verifyRunFingerprint,
} from './run-ledger.js';

export const RESEARCH_CAPSULE_APPLICATION = 'PhysMath Knowledge Tree';
export const RESEARCH_CAPSULE_SCHEMA_VERSION = 1;
export const RESEARCH_CAPSULE_KIND = 'reproducible-research-capsule';
export const RESEARCH_CAPSULE_GATE_STATES = Object.freeze(['ready', 'attention', 'blocked', 'not-applicable']);
export const MAX_CAPSULE_IMPORT_BYTES = 20_000_000;
export const MAX_CAPSULE_RUNS = 128;

const TERMINAL_RUN_STATUSES = new Set(['passed', 'failed', 'inconclusive', 'cancelled']);
const SHA256 = /^[a-f0-9]{64}$/u;
const ACTION_RANK = new Map([['blocked', 0], ['attention', 1], ['info', 2]]);

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

/** @param {unknown} value @param {string} label */
function requireDate(value, label) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new Error(`${label} must be an ISO-compatible date`);
  return new Date(value).toISOString();
}

/** @param {unknown} value @param {number} limit */
function boundedText(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

/** @param {unknown} value */
function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

/** @param {string} state @param {string} id @param {string} label @param {string} detail @param {number} completed @param {number} total */
function gate(state, id, label, detail, completed, total) {
  return { id, state, label, detail, completed, total };
}

/** @param {Array<any>} actions */
function sortActions(actions) {
  return actions.sort((left, right) => {
    const leftKey = `${ACTION_RANK.get(left.severity)}\0${left.kind}\0${left.target}\0${left.title}`;
    const rightKey = `${ACTION_RANK.get(right.severity)}\0${right.kind}\0${right.target}\0${right.title}`;
    return leftKey.localeCompare(rightKey, 'en', { sensitivity: 'base', numeric: true });
  });
}

/** @param {any} capsule */
function fingerprintCore(capsule) {
  return {
    title: capsule.title,
    dossier: capsule.dossier,
    execution: capsule.execution,
    verification: capsule.verification,
    readiness: capsule.readiness,
  };
}

/** @param {any} run */
function artifactComplete(run) {
  return run.artifacts.length > 0 && run.artifacts.every(({ sha256, bytes }) => Boolean(sha256) && bytes !== null);
}

/** @param {Array<any>} wrappers */
function artifactVariants(wrappers) {
  const byPath = new Map();
  for (const { run } of wrappers) {
    for (const artifact of run.artifacts) {
      const current = byPath.get(artifact.path) ?? new Map();
      const key = artifact.sha256 ?? '<missing>';
      current.set(key, [...(current.get(key) ?? []), run.id]);
      byPath.set(artifact.path, current);
    }
  }
  return [...byPath.entries()]
    .filter(([, variants]) => variants.size > 1)
    .map(([path, variants]) => ({
      path,
      variants: [...variants.entries()].map(([sha256, run_ids]) => ({ sha256: sha256 === '<missing>' ? null : sha256, run_ids })),
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

/**
 * Build a stable, self-contained handoff from one verified dossier and selected
 * reproducible-run records. The capsule remains a research artifact: it does
 * not promote canonical graph confidence or claim that a successful command is
 * a mathematical proof.
 *
 * @param {{
 *   dossier: unknown,
 *   runLedger: unknown,
 *   validNodeIds: Set<string>,
 *   selectedRunIds?: Iterable<string>,
 *   generatedAt?: unknown,
 *   title?: unknown,
 * }} input
 */
export async function buildResearchCapsule(input) {
  const options = requireRecord(input, 'Research capsule input');
  if (!(options.validNodeIds instanceof Set)) throw new Error('validNodeIds must be a Set');
  const generatedAt = requireDate(options.generatedAt ?? new Date().toISOString(), 'Research capsule generated_at');
  const dossier = await verifyResearchDossier(options.dossier);
  const ledger = normalizeRunLedger(options.runLedger, options.validNodeIds, generatedAt);
  const scopeNodeIds = new Set(requireArray(dossier.scope?.nodes, 'Dossier scope nodes').map((node, position) => {
    if (!isRecord(node) || typeof node.id !== 'string' || !node.id) throw new Error(`Dossier scope node ${position} needs an ID`);
    return node.id;
  }));

  const relevantRuns = ledger.runs.filter((run) => run.node_ids.some((id) => scopeNodeIds.has(id)));
  const explicitSelection = options.selectedRunIds !== undefined;
  if (explicitSelection && (options.selectedRunIds === null
      || typeof options.selectedRunIds === 'string'
      || typeof options.selectedRunIds[Symbol.iterator] !== 'function')) {
    throw new Error('selectedRunIds must be an iterable of run IDs');
  }
  const requested = explicitSelection ? new Set([...options.selectedRunIds].map(String)) : new Set(relevantRuns.map(({ id }) => id));
  const unknown = [...requested].filter((id) => !ledger.runs.some((run) => run.id === id));
  if (unknown.length) throw new Error(`Unknown selected run IDs: ${unknown.join(', ')}`);
  const selectedRuns = ledger.runs.filter(({ id }) => requested.has(id));
  if (selectedRuns.length > MAX_CAPSULE_RUNS) throw new Error(`Research capsule exceeds ${MAX_CAPSULE_RUNS} runs`);

  const wrappers = [];
  for (const run of selectedRuns) {
    const linkedNodes = run.node_ids.filter((id) => scopeNodeIds.has(id));
    wrappers.push({
      run: cloneJson(run),
      scope_linked: linkedNodes.length > 0,
      relevant_node_ids: linkedNodes,
      fingerprint_present: Boolean(run.fingerprint),
      fingerprint_verified: await verifyRunFingerprint(run, options.validNodeIds, generatedAt),
      artifact_complete: artifactComplete(run),
    });
  }
  wrappers.sort((left, right) => left.run.id.localeCompare(right.run.id));

  const statusCounts = Object.fromEntries(['planned', 'running', 'passed', 'failed', 'inconclusive', 'cancelled'].map((status) => [status, 0]));
  for (const { run } of wrappers) statusCounts[run.status] += 1;
  const coveredNodeIds = new Set(wrappers.flatMap(({ relevant_node_ids: ids }) => ids));
  const completed = wrappers.filter(({ run }) => TERMINAL_RUN_STATUSES.has(run.status));
  const invalidFingerprints = wrappers.filter(({ fingerprint_present, fingerprint_verified }) => fingerprint_present && !fingerprint_verified);
  const missingFingerprints = wrappers.filter(({ fingerprint_present }) => !fingerprint_present);
  const incompleteArtifacts = completed.filter(({ artifact_complete }) => !artifact_complete);
  const failed = wrappers.filter(({ run }) => run.status === 'failed' || run.timed_out);
  const unresolved = wrappers.filter(({ run }) => ['planned', 'running', 'inconclusive', 'cancelled'].includes(run.status));
  const unlinked = wrappers.filter(({ scope_linked }) => !scope_linked);
  const variants = artifactVariants(wrappers);
  const provenanceMissing = wrappers.filter(({ run }) => !run.provenance.git_commit || !run.provenance.toolchain);
  const commits = [...new Set(wrappers.map(({ run }) => run.provenance.git_commit).filter(Boolean))].sort();
  const toolchains = [...new Set(wrappers.map(({ run }) => run.provenance.toolchain).filter(Boolean))].sort();
  const platforms = [...new Set(wrappers.map(({ run }) => run.provenance.platform).filter(Boolean))].sort();

  const gates = [];
  const dossierState = dossier.readiness?.overall;
  gates.push(dossierState === 'blocked'
    ? gate('blocked', 'dossier', 'Dossier readiness', 'The source dossier contains blocked readiness gates.', 0, 1)
    : dossierState === 'attention'
      ? gate('attention', 'dossier', 'Dossier readiness', 'The source dossier still contains attention gates.', 0, 1)
      : gate('ready', 'dossier', 'Dossier readiness', 'The source dossier reports ready.', 1, 1));

  gates.push(wrappers.length === 0
    ? gate('blocked', 'runs', 'Run selection', 'Select at least one reproducible run for the capsule.', 0, 1)
    : unlinked.length > 0
      ? gate('attention', 'runs', 'Run selection', `${unlinked.length} selected runs are not linked to the dossier scope.`, wrappers.length - unlinked.length, wrappers.length)
      : gate('ready', 'runs', 'Run selection', `${wrappers.length} selected runs are linked to the dossier scope.`, wrappers.length, wrappers.length));

  gates.push(wrappers.length === 0
    ? gate('not-applicable', 'fingerprints', 'Run fingerprints', 'No runs are selected.', 0, 0)
    : invalidFingerprints.length > 0
      ? gate('blocked', 'fingerprints', 'Run fingerprints', `${invalidFingerprints.length} run fingerprints do not verify.`, wrappers.length - invalidFingerprints.length - missingFingerprints.length, wrappers.length)
      : missingFingerprints.length > 0
        ? gate('attention', 'fingerprints', 'Run fingerprints', `${missingFingerprints.length} selected runs lack fingerprints.`, wrappers.length - missingFingerprints.length, wrappers.length)
        : gate('ready', 'fingerprints', 'Run fingerprints', 'Every selected run fingerprint verifies.', wrappers.length, wrappers.length));

  gates.push(completed.length === 0
    ? gate('attention', 'artifacts', 'Artifact integrity', 'No selected run has reached a terminal outcome.', 0, wrappers.length)
    : incompleteArtifacts.length > 0
      ? gate('attention', 'artifacts', 'Artifact integrity', `${incompleteArtifacts.length} terminal runs lack complete artifact hashes or byte counts.`, completed.length - incompleteArtifacts.length, completed.length)
      : variants.length > 0
        ? gate('attention', 'artifacts', 'Artifact integrity', `${variants.length} artifact paths have multiple content hashes across selected runs.`, completed.length, completed.length)
        : gate('ready', 'artifacts', 'Artifact integrity', 'Every terminal run has content-addressed artifacts.', completed.length, completed.length));

  gates.push(wrappers.length === 0
    ? gate('not-applicable', 'outcome', 'Execution outcome', 'No runs are selected.', 0, 0)
    : failed.length > 0
      ? gate('blocked', 'outcome', 'Execution outcome', `${failed.length} selected runs failed or timed out.`, statusCounts.passed, wrappers.length)
      : unresolved.length > 0
        ? gate('attention', 'outcome', 'Execution outcome', `${unresolved.length} selected runs remain planned, running, cancelled or inconclusive.`, statusCounts.passed, wrappers.length)
        : gate('ready', 'outcome', 'Execution outcome', 'Every selected run passed.', wrappers.length, wrappers.length));

  gates.push(scopeNodeIds.size === 0
    ? gate('not-applicable', 'coverage', 'Scope coverage', 'The dossier has no canonical scope nodes.', 0, 0)
    : coveredNodeIds.size === scopeNodeIds.size
      ? gate('ready', 'coverage', 'Scope coverage', 'Every dossier node is linked to at least one selected run.', coveredNodeIds.size, scopeNodeIds.size)
      : gate('attention', 'coverage', 'Scope coverage', `${scopeNodeIds.size - coveredNodeIds.size} dossier nodes have no selected run.`, coveredNodeIds.size, scopeNodeIds.size));

  gates.push(wrappers.length === 0
    ? gate('not-applicable', 'provenance', 'Execution provenance', 'No runs are selected.', 0, 0)
    : provenanceMissing.length > 0
      ? gate('attention', 'provenance', 'Execution provenance', `${provenanceMissing.length} selected runs lack a git commit or toolchain identifier.`, wrappers.length - provenanceMissing.length, wrappers.length)
      : gate('ready', 'provenance', 'Execution provenance', 'Every selected run records a git commit and toolchain.', wrappers.length, wrappers.length));

  const actions = [];
  if (dossierState === 'blocked') actions.push({ kind: 'dossier', severity: 'blocked', title: 'Resolve blocked dossier gates', target: dossier.workspace.id, detail: 'Rebuild the dossier after resolving its blocked readiness gates.' });
  else if (dossierState === 'attention') actions.push({ kind: 'dossier', severity: 'attention', title: 'Resolve dossier attention gates', target: dossier.workspace.id, detail: 'Address the dossier actions before treating the capsule as release-ready.' });
  if (wrappers.length === 0) actions.push({ kind: 'run', severity: 'blocked', title: 'Select a run', target: dossier.workspace.id, detail: 'Record or import at least one run linked to the dossier scope.' });
  for (const item of unlinked) actions.push({ kind: 'scope', severity: 'attention', title: 'Link a supplemental run to scope', target: item.run.id, detail: 'Add at least one canonical dossier node to the run record or deselect it.' });
  for (const item of invalidFingerprints) actions.push({ kind: 'fingerprint', severity: 'blocked', title: 'Repair an invalid run fingerprint', target: item.run.id, detail: 'Re-export the run from a trusted ledger or regenerate its fingerprint.' });
  for (const item of missingFingerprints) actions.push({ kind: 'fingerprint', severity: 'attention', title: 'Fingerprint a run', target: item.run.id, detail: 'Use the Run Ledger or CLI to add a deterministic fingerprint.' });
  for (const item of incompleteArtifacts) actions.push({ kind: 'artifact', severity: 'attention', title: 'Content-address terminal artifacts', target: item.run.id, detail: 'Record SHA-256 and byte size for every terminal-run artifact.' });
  for (const item of failed) actions.push({ kind: 'outcome', severity: 'blocked', title: item.run.timed_out ? 'Resolve a timed-out run' : 'Resolve a failed run', target: item.run.id, detail: `Status ${item.run.status}; exit ${item.run.exit_code ?? 'unknown'}.` });
  for (const item of unresolved) actions.push({ kind: 'outcome', severity: 'attention', title: 'Resolve a nonterminal run outcome', target: item.run.id, detail: `Current status: ${item.run.status}.` });
  for (const variant of variants) actions.push({ kind: 'artifact', severity: 'attention', title: 'Disambiguate artifact variants', target: variant.path, detail: 'Archive run-specific copies before verifying the capsule against one artifact root.' });
  for (const item of provenanceMissing) actions.push({ kind: 'provenance', severity: 'attention', title: 'Record execution provenance', target: item.run.id, detail: 'Add git_commit and toolchain metadata.' });
  sortActions(actions);

  const overall = gates.some(({ state }) => state === 'blocked')
    ? 'blocked'
    : gates.some(({ state }) => state === 'attention')
      ? 'attention'
      : 'ready';
  const title = boundedText(options.title, 300) || `Research capsule: ${dossier.workspace.title}`;
  const capsule = {
    application: RESEARCH_CAPSULE_APPLICATION,
    schema_version: RESEARCH_CAPSULE_SCHEMA_VERSION,
    kind: RESEARCH_CAPSULE_KIND,
    generated_at: generatedAt,
    title,
    dossier: cloneJson(dossier),
    execution: {
      relevant_run_count: wrappers.filter(({ scope_linked: linked }) => linked).length,
      selected_run_count: wrappers.length,
      scope_node_count: scopeNodeIds.size,
      covered_node_count: coveredNodeIds.size,
      status_counts: statusCounts,
      fingerprint_verified: wrappers.filter(({ fingerprint_verified }) => fingerprint_verified).length,
      artifact_complete: wrappers.filter(({ artifact_complete }) => artifact_complete).length,
      passed: statusCounts.passed,
      unresolved: unresolved.length,
      runs: wrappers,
    },
    verification: {
      dossier_fingerprint: dossier.content_fingerprint,
      selected_run_ids: wrappers.map(({ run }) => run.id),
      artifact_count: wrappers.reduce((sum, { run }) => sum + run.artifacts.length, 0),
      artifact_variants: variants,
      provenance: { git_commits: commits, toolchains, platforms },
    },
    readiness: {
      overall,
      gates,
      action_count: actions.length,
      actions: actions.slice(0, 500),
    },
  };
  capsule.content_fingerprint = await sha256Hex(canonicalStringify(fingerprintCore(capsule)));
  return capsule;
}

/** @param {unknown} input */
export async function verifyResearchCapsule(input) {
  const capsule = requireRecord(input, 'Research capsule');
  if (capsule.application !== RESEARCH_CAPSULE_APPLICATION) throw new Error('Research capsule belongs to another application');
  if (capsule.schema_version !== RESEARCH_CAPSULE_SCHEMA_VERSION) throw new Error('Unsupported research capsule schema version');
  if (capsule.kind !== RESEARCH_CAPSULE_KIND) throw new Error('Unsupported research capsule kind');
  requireDate(capsule.generated_at, 'Research capsule generated_at');
  if (!SHA256.test(String(capsule.content_fingerprint ?? ''))) throw new Error('Research capsule fingerprint is invalid');
  await verifyResearchDossier(capsule.dossier);
  const execution = requireRecord(capsule.execution, 'Research capsule execution');
  const wrappers = requireArray(execution.runs, 'Research capsule runs');
  if (wrappers.length > MAX_CAPSULE_RUNS) throw new Error(`Research capsule exceeds ${MAX_CAPSULE_RUNS} runs`);
  const scopeIds = new Set(requireArray(capsule.dossier.scope?.nodes, 'Research capsule dossier scope nodes')
    .map((node, position) => {
      if (!isRecord(node) || typeof node.id !== 'string' || !node.id) throw new Error(`Research capsule dossier scope node ${position} needs an ID`);
      return node.id;
    }));
  const validNodeIds = new Set(scopeIds);
  for (const wrapper of wrappers) {
    if (isRecord(wrapper?.run) && Array.isArray(wrapper.run.node_ids)) {
      for (const id of wrapper.run.node_ids) if (typeof id === 'string' && id) validNodeIds.add(id);
    }
  }
  for (const [position, wrapper] of wrappers.entries()) {
    const item = requireRecord(wrapper, `Research capsule run ${position}`);
    const run = requireRecord(item.run, `Research capsule run ${position} manifest`);
    const relevant = requireArray(item.relevant_node_ids, `Research capsule run ${position} relevant_node_ids`);
    const expectedRelevant = Array.isArray(run.node_ids) ? run.node_ids.filter((id) => scopeIds.has(id)) : [];
    if (canonicalStringify(relevant) !== canonicalStringify(expectedRelevant)) throw new Error(`Research capsule run ${position} scope linkage mismatch`);
    if (item.scope_linked !== (expectedRelevant.length > 0)) throw new Error(`Research capsule run ${position} scope_linked mismatch`);
    if (item.artifact_complete !== artifactComplete(run)) throw new Error(`Research capsule run ${position} artifact completeness mismatch`);
    const verified = await verifyRunFingerprint(run, validNodeIds, capsule.generated_at);
    if (item.fingerprint_present !== Boolean(run.fingerprint) || item.fingerprint_verified !== verified) {
      throw new Error(`Research capsule run ${position} fingerprint verification mismatch`);
    }
  }
  requireRecord(capsule.verification, 'Research capsule verification');
  requireRecord(capsule.readiness, 'Research capsule readiness');
  const rebuilt = await buildResearchCapsule({
    dossier: capsule.dossier,
    runLedger: {
      application: RESEARCH_CAPSULE_APPLICATION,
      schema_version: 1,
      updated_at: capsule.generated_at,
      runs: wrappers.map(({ run }) => run),
    },
    validNodeIds,
    selectedRunIds: wrappers.map(({ run }) => run.id),
    generatedAt: capsule.generated_at,
    title: capsule.title,
  });
  if (canonicalStringify(fingerprintCore(rebuilt)) !== canonicalStringify(fingerprintCore(capsule))) {
    throw new Error('Research capsule derived summary mismatch');
  }
  const expected = await sha256Hex(canonicalStringify(fingerprintCore(capsule)));
  if (expected !== capsule.content_fingerprint) throw new Error('Research capsule fingerprint mismatch');
  return cloneJson(capsule);
}

/** @param {string} text */
export async function importResearchCapsule(text) {
  if (typeof text !== 'string') throw new Error('Research capsule import must be text');
  if (new TextEncoder().encode(text).length > MAX_CAPSULE_IMPORT_BYTES) throw new Error('Research capsule import exceeds the size limit');
  return verifyResearchCapsule(JSON.parse(text));
}

/** @param {unknown} capsule */
export function capsuleArtifactPlan(capsule) {
  const record = requireRecord(capsule, 'Research capsule');
  const wrappers = requireArray(record.execution?.runs, 'Research capsule runs');
  return wrappers.flatMap((wrapper) => wrapper.run.artifacts.map((artifact) => ({
    run_id: wrapper.run.id,
    role: artifact.role,
    path: artifact.path,
    sha256: artifact.sha256,
    bytes: artifact.bytes,
    media_type: artifact.media_type,
  }))).sort((left, right) => `${left.path}\0${left.run_id}`.localeCompare(`${right.path}\0${right.run_id}`));
}

/** @param {unknown} value */
function markdownCell(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\r', ' ').replaceAll('\n', ' ').trim();
}

/** @param {any} capsule */
export function researchCapsuleMarkdown(capsule) {
  if (!isRecord(capsule) || capsule.kind !== RESEARCH_CAPSULE_KIND) throw new Error('Markdown export needs a research capsule');
  const lines = [
    `# ${capsule.title}`,
    '',
    `- **Generated:** ${capsule.generated_at}`,
    `- **Workspace:** \`${capsule.dossier.workspace.id}\``,
    `- **Dossier fingerprint:** \`${capsule.dossier.content_fingerprint}\``,
    `- **Capsule fingerprint:** \`${capsule.content_fingerprint}\``,
    `- **Readiness:** **${capsule.readiness.overall}**`,
    '',
    '## Capsule gates',
    '',
    '| Gate | State | Progress | Detail |',
    '| --- | --- | ---: | --- |',
    ...capsule.readiness.gates.map((item) => `| ${markdownCell(item.label)} | ${item.state} | ${item.completed}/${item.total} | ${markdownCell(item.detail)} |`),
    '',
    '## Dossier scope',
    '',
    `- Canonical nodes: ${capsule.dossier.scope.node_count}`,
    `- Induced edges: ${capsule.dossier.scope.edge_count}`,
    `- Dossier readiness: ${capsule.dossier.readiness.overall}`,
    '',
    ...capsule.dossier.scope.nodes.map((node) => `- **${node.title ?? node.id}** (\`${node.id}\`)`),
    '',
    '## Selected runs',
    '',
    ...(capsule.execution.runs.length ? capsule.execution.runs.flatMap((item) => [
      `### ${item.run.title}`,
      '',
      `- ID: \`${item.run.id}\``,
      `- Status: **${item.run.status}**`,
      `- Kind: ${item.run.kind}`,
      `- Scope linked: ${item.scope_linked ? 'yes' : 'no'}`,
      `- Fingerprint verified: ${item.fingerprint_verified ? 'yes' : 'no'}`,
      `- Artifacts complete: ${item.artifact_complete ? 'yes' : 'no'}`,
      `- Command: ${item.run.command.length ? `\`${item.run.command.join(' ')}\`` : '_not recorded_'}`,
      '',
      ...(item.run.artifacts.length ? item.run.artifacts.map((artifact) =>
        `- ${artifact.role}: \`${artifact.path}\` — ${artifact.sha256 ? `\`${artifact.sha256}\`` : 'missing SHA-256'}${artifact.bytes === null ? '' : ` (${artifact.bytes} bytes)`}`) : ['- No artifacts recorded.']),
      '',
    ]) : ['_No runs selected._', '']),
    '## Open actions',
    '',
    ...(capsule.readiness.actions.length
      ? capsule.readiness.actions.map((action) => `- **${action.severity} · ${action.kind}:** ${action.title} — ${action.detail}`)
      : ['- No open capsule actions.']),
    '',
    '## Boundary',
    '',
    'This capsule verifies the recorded dossier, run manifests and artifact metadata. It does not by itself prove a mathematical claim, validate scientific novelty or promote canonical graph confidence.',
    '',
  ];
  return lines.join('\n');
}
