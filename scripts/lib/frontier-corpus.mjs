import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY_ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const FRONTIER_CORPUS_ROOT = 'integrations/frontier-math-corpus';

const DECISION_ORDER = Object.freeze(['approved', 'conditional', 'metadata_only', 'blocked']);
const MODEL_USE_ORDER = Object.freeze(['candidate-training', 'retrieval-only', 'evaluation-only', 'metadata-only', 'blocked']);
const PEDAGOGICAL_MODALITIES = Object.freeze(['exposition', 'exercises', 'worked-solutions']);
const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

function readJson(root, relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
}

export function loadFrontierCorpus(root = REPOSITORY_ROOT) {
  return {
    manifest: readJson(root, `${FRONTIER_CORPUS_ROOT}/manifest.json`),
    policy: readJson(root, `${FRONTIER_CORPUS_ROOT}/coverage-policy.json`),
    registry: readJson(root, `${FRONTIER_CORPUS_ROOT}/data/sources.json`),
    holdouts: readJson(root, `${FRONTIER_CORPUS_ROOT}/data/evaluation-holdouts.json`),
    snapshotSchema: readJson(root, `${FRONTIER_CORPUS_ROOT}/schemas/snapshot-manifest.schema.json`),
    snapshotTemplate: readJson(root, `${FRONTIER_CORPUS_ROOT}/templates/snapshot-manifest.json`),
  };
}

function countBy(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function orderedCounts(values, order = []) {
  const counts = countBy(values);
  const known = order.filter((value) => counts.has(value));
  const extras = [...counts.keys()].filter((value) => !order.includes(value)).sort();
  return [...known, ...extras].map((value) => ({ id: value, count: counts.get(value) }));
}

function unique(values) {
  return [...new Set(values)].sort();
}

function hasAny(values, expected) {
  return expected.some((value) => values.includes(value));
}

function hasAll(values, expected) {
  return expected.every((value) => values.includes(value));
}

export function isKnowledgeEligible(source, policy) {
  return policy.eligibility.knowledge_decisions.includes(source.decision);
}

export function isCandidateTraining(source, policy) {
  return isKnowledgeEligible(source, policy)
    && policy.eligibility.training_model_uses.includes(source.governance.model_use);
}

function targetGap(label, actual, target) {
  return actual >= target ? null : `${label}: ${actual} < ${target}`;
}

function dimensionMatches(source, dimension) {
  if (dimension.model_uses && !dimension.model_uses.includes(source.governance.model_use)) return false;
  if (dimension.any_levels && !hasAny(source.coverage.levels, dimension.any_levels)) return false;
  if (dimension.any_modalities && !hasAny(source.coverage.modalities, dimension.any_modalities)) return false;
  if (dimension.all_modalities && !hasAll(source.coverage.modalities, dimension.all_modalities)) return false;
  if (dimension.any_capabilities && !hasAny(source.coverage.capabilities, dimension.any_capabilities)) return false;
  if (dimension.all_capabilities && !hasAll(source.coverage.capabilities, dimension.all_capabilities)) return false;
  return true;
}

export function sourceRiskScore(source, policy) {
  const weights = policy.risk_policy.weights;
  let score = 0;
  score += weights.decision[source.decision] ?? 0;
  score += weights.ai_terms[source.license.ai_terms] ?? 0;
  score += weights.contamination_risk[source.governance.contamination_risk] ?? 0;
  score += weights.pii_risk[source.governance.pii_risk] ?? 0;
  score += weights.legal_review[source.governance.legal_review] ?? 0;
  if (source.license.per_item) score += weights.per_item;
  if (source.license.share_alike) score += weights.share_alike;
  if (source.license.source_disclosure) score += weights.source_disclosure;
  return score;
}

export function sourceRiskBand(source, policy) {
  if (source.decision === 'blocked') return 'blocked';
  const score = sourceRiskScore(source, policy);
  return policy.risk_policy.bands.find((band) => score <= band.maximum)?.id ?? 'blocked';
}

function countFamilies(sources) {
  return unique(sources.map((source) => source.family)).length;
}

function areaAdvisory(area, matching, candidateTraining, policy) {
  const targets = policy.advisory_area_targets;
  const dedicatedEligible = matching.filter((source) => source.coverage.role === 'dedicated');
  const dedicatedTraining = candidateTraining.filter((source) => source.coverage.role === 'dedicated');
  const pedagogicalTraining = candidateTraining.filter((source) => hasAny(source.coverage.modalities, PEDAGOGICAL_MODALITIES));
  const researchEligible = matching.filter((source) => source.coverage.levels.includes('research'));
  const values = {
    dedicatedEligibleFamilies: countFamilies(dedicatedEligible),
    dedicatedCandidateTrainingFamilies: countFamilies(dedicatedTraining),
    pedagogicalCandidateTrainingFamilies: countFamilies(pedagogicalTraining),
    researchLevelEligibleFamilies: countFamilies(researchEligible),
  };
  const gaps = [];
  const checks = [
    [`${area} dedicated eligible families`, values.dedicatedEligibleFamilies, targets.all_area_dedicated_eligible_families],
    [`${area} dedicated candidate-training families`, values.dedicatedCandidateTrainingFamilies, targets.all_area_dedicated_candidate_training_families],
    [`${area} research-level eligible families`, values.researchLevelEligibleFamilies, targets.all_area_research_level_eligible_families],
  ];
  if (policy.critical_areas.includes(area)) {
    checks.push([
      `${area} pedagogical candidate-training families`,
      values.pedagogicalCandidateTrainingFamilies,
      targets.critical_area_pedagogical_candidate_training_families,
    ]);
  }
  for (const [label, actual, target] of checks) {
    const gap = targetGap(label, actual, target);
    if (gap) gaps.push(gap);
  }
  return { ...values, gaps };
}

export function analyseFrontierCorpus(documents) {
  const { manifest, policy, registry } = documents;
  const sources = registry.sources;
  const eligibleSources = sources.filter((source) => isKnowledgeEligible(source, policy));
  const candidateTrainingSources = eligibleSources.filter((source) => isCandidateTraining(source, policy));
  const gaps = [];
  const advisoryGaps = [];

  const areas = policy.vocabularies.areas.map((area) => {
    const matching = eligibleSources.filter((source) => source.coverage.areas.includes(area));
    const candidateTraining = matching.filter((source) => isCandidateTraining(source, policy));
    const proofSources = matching.filter((source) => hasAny(source.coverage.modalities, policy.proof_modalities));
    const practiceSources = matching.filter((source) => hasAny(source.coverage.modalities, policy.practice_modalities));
    const eligibleFamilies = unique(matching.map((source) => source.family));
    const candidateTrainingFamilies = unique(candidateTraining.map((source) => source.family));
    const critical = policy.critical_areas.includes(area);
    const areaGaps = [];
    const familyTarget = critical
      ? policy.targets.critical_area_eligible_families
      : policy.targets.all_area_eligible_families;
    const familyGap = targetGap(`${area} eligible families`, eligibleFamilies.length, familyTarget);
    if (familyGap) areaGaps.push(familyGap);
    if (critical) {
      const checks = [
        targetGap(`${area} candidate-training families`, candidateTrainingFamilies.length, policy.targets.critical_area_candidate_training_families),
        targetGap(`${area} practice sources`, practiceSources.length, policy.targets.critical_area_practice_sources),
        targetGap(`${area} proof sources`, proofSources.length, policy.targets.critical_area_proof_sources),
      ];
      for (const gap of checks) if (gap) areaGaps.push(gap);
    }
    gaps.push(...areaGaps);
    const advisory = areaAdvisory(area, matching, candidateTraining, policy);
    advisoryGaps.push(...advisory.gaps);
    return {
      id: area,
      critical,
      eligibleSources: matching.length,
      eligibleFamilies: eligibleFamilies.length,
      candidateTrainingSources: candidateTraining.length,
      candidateTrainingFamilies: candidateTrainingFamilies.length,
      proofSources: proofSources.length,
      practiceSources: practiceSources.length,
      sourceIds: matching.map((source) => source.id).sort(),
      gaps: areaGaps,
      advisory,
    };
  });

  const modalities = policy.vocabularies.modalities.map((modality) => {
    const matching = eligibleSources.filter((source) => source.coverage.modalities.includes(modality));
    const target = policy.targets.modality_eligible_sources[modality] ?? 0;
    const gap = targetGap(`${modality} eligible sources`, matching.length, target);
    if (gap) gaps.push(gap);
    return { id: modality, eligibleSources: matching.length, target, pass: gap === null };
  });

  const capabilities = policy.vocabularies.capabilities.map((capability) => {
    const matching = eligibleSources.filter((source) => source.coverage.capabilities.includes(capability));
    const target = policy.targets.capability_eligible_sources[capability] ?? 0;
    const gap = targetGap(`${capability} eligible sources`, matching.length, target);
    if (gap) gaps.push(gap);
    return { id: capability, eligibleSources: matching.length, target, pass: gap === null };
  });

  const frontierDimensions = policy.frontier_dimensions.map((dimension) => {
    const matching = sources.filter((source) => dimensionMatches(source, dimension));
    const families = countFamilies(matching);
    const dimensionGaps = [];
    const sourceGap = targetGap(`${dimension.id} sources`, matching.length, dimension.minimum_sources);
    const familyGap = targetGap(`${dimension.id} families`, families, dimension.minimum_families);
    if (sourceGap) dimensionGaps.push(sourceGap);
    if (familyGap) dimensionGaps.push(familyGap);
    advisoryGaps.push(...dimensionGaps);
    return {
      id: dimension.id,
      label: dimension.label,
      sources: matching.length,
      families,
      minimumSources: dimension.minimum_sources,
      minimumFamilies: dimension.minimum_families,
      sourceIds: matching.map((source) => source.id).sort(),
      gaps: dimensionGaps,
      pass: dimensionGaps.length === 0,
    };
  });

  const decisionCounts = orderedCounts(sources.map((source) => source.decision), DECISION_ORDER);
  const modelUseCounts = orderedCounts(sources.map((source) => source.governance.model_use), MODEL_USE_ORDER);
  const licenseClassCounts = orderedCounts(sources.map((source) => source.license.class));
  const shardCounts = orderedCounts(sources.map((source) => source.governance.shard));
  const riskBandCounts = orderedCounts(sources.map((source) => sourceRiskBand(source, policy)), ['low', 'medium', 'high', 'critical', 'blocked']);
  const distinctFamilies = countFamilies(sources);

  const globalTargets = [
    ['approved sources', decisionCounts.find((entry) => entry.id === 'approved')?.count ?? 0, policy.targets.minimum_approved_sources],
    ['conditional sources', decisionCounts.find((entry) => entry.id === 'conditional')?.count ?? 0, policy.targets.minimum_conditional_sources],
    ['blocked guardrails', decisionCounts.find((entry) => entry.id === 'blocked')?.count ?? 0, policy.targets.minimum_blocked_guardrails],
    ['distinct source families', distinctFamilies, policy.targets.minimum_distinct_families],
  ];
  for (const [label, actual, target] of globalTargets) {
    const gap = targetGap(label, actual, target);
    if (gap) gaps.push(gap);
  }

  const priorityAreas = areas
    .filter((area) => area.advisory.gaps.length > 0)
    .sort((left, right) => right.advisory.gaps.length - left.advisory.gaps.length || left.id.localeCompare(right.id))
    .map((area) => ({
      id: area.id,
      priority: area.advisory.gaps.length,
      candidateTrainingFamilies: area.candidateTrainingFamilies,
      gaps: area.advisory.gaps,
    }));
  const priorityDimensions = frontierDimensions
    .filter((dimension) => !dimension.pass)
    .sort((left, right) => right.gaps.length - left.gaps.length || left.id.localeCompare(right.id))
    .map((dimension) => ({
      id: dimension.id,
      priority: dimension.gaps.length,
      families: dimension.families,
      sources: dimension.sources,
      gaps: dimension.gaps,
    }));

  return {
    packVersion: manifest.pack_version,
    reviewedOn: manifest.reviewed_on,
    sourceCount: sources.length,
    eligibleSourceCount: eligibleSources.length,
    candidateTrainingSourceCount: candidateTrainingSources.length,
    distinctFamilies,
    decisionCounts,
    modelUseCounts,
    licenseClassCounts,
    shardCounts,
    riskBandCounts,
    areas,
    modalities,
    capabilities,
    frontierDimensions,
    priorityDimensions,
    priorityAreas,
    gaps: unique(gaps),
    advisoryGaps: unique(advisoryGaps),
    pass: gaps.length === 0,
    frontierDimensionsPass: frontierDimensions.every((dimension) => dimension.pass),
    frontierDensityPass: advisoryGaps.length === 0,
  };
}

function escapeCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function markdownTable(headers, rows) {
  const output = [
    `| ${headers.map(escapeCell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
  ];
  for (const row of rows) output.push(`| ${row.map(escapeCell).join(' | ')} |`);
  return output.join('\n');
}

function countSummary(entries) {
  return entries.map(({ id, count }) => `${id}: ${count}`).join(' · ');
}

function generatedHeader(title, analysis) {
  return `# ${title}\n\n> Generated deterministically from the Frontier Mathematics Corpus Atlas ${analysis.packVersion}; reviewed ${analysis.reviewedOn}. Do not edit by hand.\n`;
}

export function renderCoverageReport(documents, analysis = analyseFrontierCorpus(documents)) {
  const areaRows = analysis.areas.map((area) => [
    area.id,
    area.critical ? 'yes' : 'no',
    area.eligibleSources,
    area.eligibleFamilies,
    area.candidateTrainingFamilies,
    area.proofSources,
    area.practiceSources,
    area.gaps.length ? area.gaps.join('; ') : 'pass',
  ]);
  const modalityRows = analysis.modalities.map((item) => [item.id, item.eligibleSources, item.target, item.pass ? 'pass' : 'gap']);
  const capabilityRows = analysis.capabilities.map((item) => [item.id, item.eligibleSources, item.target, item.pass ? 'pass' : 'gap']);
  const gapText = analysis.gaps.length
    ? analysis.gaps.map((gap) => `- ${gap}`).join('\n')
    : '- No hard policy gaps detected.';
  return `${generatedHeader('Frontier Mathematics Corpus Coverage Report', analysis)}
## Governance floor

- Sources: **${analysis.sourceCount}** total; **${analysis.eligibleSourceCount}** knowledge-eligible; **${analysis.candidateTrainingSourceCount}** candidate-training.
- Distinct source families: **${analysis.distinctFamilies}**.
- Decisions: ${countSummary(analysis.decisionCounts)}.
- Model uses: ${countSummary(analysis.modelUseCounts)}.
- Hard policy result: **${analysis.pass ? 'PASS' : 'FAIL'}**.

Candidate-training is an engineering eligibility label, not a blanket legal conclusion. Every acquisition still requires an immutable snapshot, exact notices and source-specific review.

## Area coverage

${markdownTable(
    ['Area', 'Critical', 'Eligible sources', 'Families', 'Training families', 'Proof', 'Practice', 'Hard gate'],
    areaRows,
  )}

## Modality coverage

${markdownTable(['Modality', 'Eligible', 'Target', 'Gate'], modalityRows)}

## Capability coverage

${markdownTable(['Capability', 'Eligible', 'Target', 'Gate'], capabilityRows)}

## License, shard and risk inventory

- License classes: ${countSummary(analysis.licenseClassCounts)}.
- Isolation shards: ${countSummary(analysis.shardCounts)}.
- Review-risk bands: ${countSummary(analysis.riskBandCounts)}.

## Hard gaps

${gapText}
`;
}

export function renderFrontierReadinessReport(documents, analysis = analyseFrontierCorpus(documents)) {
  const dimensionRows = analysis.frontierDimensions.map((dimension) => [
    dimension.label,
    dimension.sources,
    dimension.minimumSources,
    dimension.families,
    dimension.minimumFamilies,
    dimension.pass ? 'pass' : dimension.gaps.join('; '),
  ]);
  const areaRows = analysis.areas.map((area) => [
    area.id,
    area.advisory.dedicatedEligibleFamilies,
    area.advisory.dedicatedCandidateTrainingFamilies,
    area.advisory.pedagogicalCandidateTrainingFamilies,
    area.advisory.researchLevelEligibleFamilies,
    area.advisory.gaps.length ? area.advisory.gaps.join('; ') : 'pass',
  ]);
  const priorityItems = [
    ...analysis.priorityDimensions.map((dimension) => ({ kind: 'dimension', ...dimension })),
    ...analysis.priorityAreas.map((area) => ({ kind: 'area', ...area })),
  ];
  const priorities = priorityItems.length
    ? priorityItems.map((item, index) => `${index + 1}. **${item.id}** (${item.kind}) — ${item.gaps.join('; ')}`).join('\n')
    : '1. No advisory frontier-readiness gaps.';
  return `${generatedHeader('Frontier Mathematics Corpus Readiness Report', analysis)}
## Interpretation

The hard governance/coverage floor is **${analysis.pass ? 'PASS' : 'FAIL'}**. The frontier-dimension envelope is **${analysis.frontierDimensionsPass ? 'PASS' : 'GAPS'}**. Subject-specific density is **${analysis.frontierDensityPass ? 'PASS' : 'INCOMPLETE'}**.

These labels evaluate the corpus plan, not model capability. Omnibus encyclopedias and formal libraries cannot substitute for deep, dedicated pedagogy in every area.

## Frontier dimensions

${markdownTable(['Dimension', 'Sources', 'Minimum', 'Families', 'Minimum', 'Gate'], dimensionRows)}

## Dedicated area density

${markdownTable(['Area', 'Dedicated eligible families', 'Dedicated training families', 'Pedagogical training families', 'Research-level families', 'Advisory'], areaRows)}

## Prioritized additions

${priorities}

## Remaining advisory gaps

${analysis.advisoryGaps.length ? analysis.advisoryGaps.map((gap) => `- ${gap}`).join('\n') : '- None.'}
`;
}

export function renderAttributionLedger(documents, analysis = analyseFrontierCorpus(documents)) {
  const sources = [...documents.registry.sources]
    .filter((source) => source.decision !== 'blocked')
    .sort((left, right) => left.id.localeCompare(right.id));
  const rows = sources.map((source) => [
    source.id,
    source.decision,
    source.license.expression,
    source.governance.shard,
    source.governance.model_use,
    source.acquisition.pin,
    source.license.reviewed_on,
    source.license.next_review_on,
    `${sourceRiskScore(source, documents.policy)} / ${sourceRiskBand(source, documents.policy)}`,
    source.governance.attribution_template,
  ]);
  return `${generatedHeader('Frontier Mathematics Corpus Attribution Ledger', analysis)}
This is a planning ledger, not legal advice. The acquisition manifest for each artifact must also retain its exact URL, immutable revision, cryptographic hash, license text, exclusions and review decision.

${markdownTable(
    ['Source', 'Decision', 'License', 'Shard', 'Model use', 'Pin', 'Reviewed', 'Review by', 'Risk', 'Required record'],
    rows,
  )}
`;
}

export function renderEvaluationHoldouts(documents, analysis = analyseFrontierCorpus(documents)) {
  const rows = documents.holdouts.groups.map((group) => [
    group.id,
    group.source_ids.join(', '),
    group.related_source_ids.join(', ') || 'none',
    group.aliases.join(', '),
    group.matchers.join(', '),
    group.quarantine,
  ]);
  return `${generatedHeader('Frontier Mathematics Evaluation Holdouts', analysis)}
Evaluation holdouts are quarantined by exact content, normalized content, translations, formal equivalents and semantic near-duplicates. A permissive repository license does not make a benchmark suitable for candidate training.

${markdownTable(['Group', 'Direct sources', 'Related sources', 'Aliases', 'Matchers', 'Quarantine scope'], rows)}

## Global rules

${documents.holdouts.global_rules.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}
`;
}

function acquisitionPriority(source) {
  if (source.governance.model_use === 'evaluation-only') return 'holdout';
  if (source.governance.model_use === 'retrieval-only') return 'retrieval';
  if (source.governance.model_use === 'metadata-only') return 'metadata';
  if (source.decision === 'approved') return 'high';
  return 'review-first';
}

export function renderAcquisitionPlan(documents, analysis = analyseFrontierCorpus(documents)) {
  const holdoutBySource = new Map();
  for (const group of documents.holdouts.groups) {
    for (const sourceId of group.source_ids) holdoutBySource.set(sourceId, group.id);
  }
  const entries = documents.registry.sources
    .filter((source) => source.decision !== 'blocked')
    .map((source) => ({
      source_id: source.id,
      priority: acquisitionPriority(source),
      decision: source.decision,
      model_use: source.governance.model_use,
      shard: source.governance.shard,
      license_expression: source.license.expression,
      license_reviewed_on: source.license.reviewed_on,
      license_review_by: source.license.next_review_on,
      pin: source.acquisition.pin,
      content_scope: source.acquisition.content_scope,
      excludes: source.acquisition.excludes,
      attribution: source.governance.attribution_template,
      risk_score: sourceRiskScore(source, documents.policy),
      risk_band: sourceRiskBand(source, documents.policy),
      holdout_group: holdoutBySource.get(source.id) ?? null,
      required_checks: documents.policy.snapshot_requirements.required_quality_checks,
    }))
    .sort((left, right) => left.source_id.localeCompare(right.source_id));
  return `${JSON.stringify({
    schema_version: '1.0.0',
    atlas_pack_version: analysis.packVersion,
    reviewed_on: analysis.reviewedOn,
    legal_notice: documents.registry.legal_notice,
    entries,
  }, null, 2)}\n`;
}

export function renderAgentContext(documents, analysis = analyseFrontierCorpus(documents)) {
  const criticalRows = analysis.areas.filter((area) => area.critical).map((area) => [
    area.id,
    area.eligibleFamilies,
    area.candidateTrainingFamilies,
    area.proofSources,
    area.practiceSources,
    area.advisory.gaps.length ? 'thin' : 'dense-enough',
  ]);
  const approved = documents.registry.sources
    .filter((source) => source.decision === 'approved')
    .map((source) => source.id)
    .sort();
  const blocked = documents.registry.sources
    .filter((source) => source.decision === 'blocked')
    .map((source) => source.id)
    .sort();
  return `${generatedHeader('Frontier Mathematics Corpus Agent Context', analysis)}
## Operating status

- Hard coverage/governance gate: **${analysis.pass ? 'PASS' : 'FAIL'}**.
- Frontier dimensions: **${analysis.frontierDimensionsPass ? 'PASS' : 'GAPS'}**; dedicated density: **${analysis.frontierDensityPass ? 'PASS' : 'INCOMPLETE'}**.
- Registry: ${analysis.sourceCount} sources across ${analysis.distinctFamilies} families.
- Knowledge-eligible: ${analysis.eligibleSourceCount}; candidate-training: ${analysis.candidateTrainingSourceCount}.
- Approved IDs: ${approved.join(', ')}.
- Blocked guardrails: ${blocked.join(', ')}.
- Priority dimensions: ${analysis.priorityDimensions.map((dimension) => dimension.id).join(', ') || 'none'}.
- Priority areas: ${analysis.priorityAreas.map((area) => area.id).join(', ') || 'none'}.

## Critical-area envelope

${markdownTable(['Area', 'Eligible families', 'Training families', 'Proof sources', 'Practice sources', 'Density'], criticalRows)}

## Non-negotiable rules

${documents.manifest.guardrails.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}

## Decision order

1. Resolve a source by stable ID with \`npm run query:frontier-corpus -- source <id>\`.
2. Reject \`blocked\`; use \`metadata_only\` solely for metadata fields.
3. For \`conditional\`, satisfy per-source exclusions and legal review before acquisition.
4. Generate a source-specific manifest with \`npm run query:frontier-corpus -- snapshot-template <id>\`.
5. Pin an immutable release, commit, edition or dated snapshot; record content and license-evidence SHA-256 values.
6. Keep share-alike, documentation-copyleft, code-copyleft and per-item material in separate shards.
7. Apply every holdout matcher to benchmarks, translations, formal equivalents and semantic near-duplicates.
8. Validate the completed manifest and re-run \`npm run validate:frontier-corpus\` after every source or policy edit.
`;
}

export function generatedFrontierCorpusArtifacts(documents) {
  const analysis = analyseFrontierCorpus(documents);
  return new Map([
    [`${FRONTIER_CORPUS_ROOT}/generated/coverage-report.md`, renderCoverageReport(documents, analysis)],
    [`${FRONTIER_CORPUS_ROOT}/generated/frontier-readiness-report.md`, renderFrontierReadinessReport(documents, analysis)],
    [`${FRONTIER_CORPUS_ROOT}/generated/evaluation-holdouts.md`, renderEvaluationHoldouts(documents, analysis)],
    [`${FRONTIER_CORPUS_ROOT}/generated/attribution-ledger.md`, renderAttributionLedger(documents, analysis)],
    [`${FRONTIER_CORPUS_ROOT}/generated/acquisition-plan.json`, renderAcquisitionPlan(documents, analysis)],
    [`${FRONTIER_CORPUS_ROOT}/generated/agent-context.md`, renderAgentContext(documents, analysis)],
  ]);
}

export function querySources(documents, filters = {}) {
  const { policy, registry } = documents;
  return registry.sources
    .filter((source) => !filters.area || source.coverage.areas.includes(filters.area))
    .filter((source) => !filters.capability || source.coverage.capabilities.includes(filters.capability))
    .filter((source) => !filters.modality || source.coverage.modalities.includes(filters.modality))
    .filter((source) => !filters.family || source.family === filters.family)
    .filter((source) => !filters.decision || source.decision === filters.decision)
    .filter((source) => !filters.modelUse || source.governance.model_use === filters.modelUse)
    .filter((source) => !filters.shard || source.governance.shard === filters.shard)
    .filter((source) => !filters.riskBand || sourceRiskBand(source, policy) === filters.riskBand)
    .filter((source) => !filters.eligible || isKnowledgeEligible(source, policy))
    .filter((source) => !filters.candidateTraining || isCandidateTraining(source, policy))
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function createSnapshotTemplate(documents, sourceId) {
  const source = documents.registry.sources.find((entry) => entry.id === sourceId);
  if (!source) throw new Error(`Unknown source: ${sourceId}`);
  if (source.decision === 'blocked') throw new Error(`Blocked source has no acquisition template: ${sourceId}`);
  const checks = Object.fromEntries(
    documents.policy.snapshot_requirements.required_quality_checks.map((check) => [check.replaceAll('-', '_'), 'not-run']),
  );
  return {
    schema_version: documents.policy.snapshot_requirements.schema_version,
    source_id: source.id,
    atlas_pack_version: documents.manifest.pack_version,
    registry_reviewed_on: documents.registry.reviewed_on,
    retrieved_at: 'YYYY-MM-DDTHH:mm:ss.sssZ',
    upstream: {
      url: source.homepage,
      revision: source.acquisition.pin,
      artifact_sha256: '0'.repeat(64),
      license_evidence_url: source.license.evidence_url,
      license_evidence_sha256: '0'.repeat(64),
    },
    scope: {
      included_paths: [source.acquisition.content_scope],
      excluded_paths: [...source.acquisition.excludes],
      file_count: 1,
      bytes: 1,
    },
    governance: {
      decision: source.decision,
      model_use: source.governance.model_use,
      shard: source.governance.shard,
      license_expression: source.license.expression,
      notices_path: `notices/${source.id}.txt`,
      attribution_path: `attribution/${source.id}.json`,
    },
    quality: checks,
    review: {
      status: 'draft',
      reviewer: '',
      reviewed_at: null,
      notes: [],
    },
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isValidUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function isValidDateTime(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function isUsableHash(value) {
  return typeof value === 'string' && HASH_PATTERN.test(value) && value !== '0'.repeat(64);
}

function isUniqueStringArray(value, allowEmpty) {
  if (!Array.isArray(value)) return false;
  if (!allowEmpty && value.length === 0) return false;
  if (!value.every((entry) => typeof entry === 'string' && entry.length > 0)) return false;
  return new Set(value).size === value.length;
}

export function validateSnapshotManifest(snapshot, documents) {
  const errors = [];
  if (!isPlainObject(snapshot)) return ['snapshot must be an object'];
  const source = documents.registry.sources.find((entry) => entry.id === snapshot.source_id);
  if (snapshot.schema_version !== documents.policy.snapshot_requirements.schema_version) errors.push('unexpected snapshot schema_version');
  if (!ID_PATTERN.test(snapshot.source_id ?? '')) errors.push('invalid source_id');
  if (!source) errors.push('unknown source_id');
  if (snapshot.atlas_pack_version !== documents.manifest.pack_version) errors.push('atlas_pack_version mismatch');
  if (snapshot.registry_reviewed_on !== documents.registry.reviewed_on) errors.push('registry_reviewed_on mismatch');
  if (!isValidDateTime(snapshot.retrieved_at)) errors.push('retrieved_at must be an ISO date-time');

  if (!isPlainObject(snapshot.upstream)) {
    errors.push('upstream must be an object');
  } else {
    if (!isValidUrl(snapshot.upstream.url)) errors.push('upstream.url must be http(s)');
    if (typeof snapshot.upstream.revision !== 'string' || snapshot.upstream.revision.length < 7 || /latest|floating|replace|immutable-/iu.test(snapshot.upstream.revision)) errors.push('upstream.revision must be immutable');
    if (!isUsableHash(snapshot.upstream.artifact_sha256)) errors.push('upstream.artifact_sha256 must be a non-placeholder SHA-256');
    if (!isValidUrl(snapshot.upstream.license_evidence_url)) errors.push('upstream.license_evidence_url must be http(s)');
    if (!isUsableHash(snapshot.upstream.license_evidence_sha256)) errors.push('upstream.license_evidence_sha256 must be a non-placeholder SHA-256');
  }

  if (!isPlainObject(snapshot.scope)) {
    errors.push('scope must be an object');
  } else {
    if (!isUniqueStringArray(snapshot.scope.included_paths, false)) errors.push('scope.included_paths must be unique non-empty strings');
    if (!isUniqueStringArray(snapshot.scope.excluded_paths, true)) errors.push('scope.excluded_paths must be unique strings');
    if (!Number.isInteger(snapshot.scope.file_count) || snapshot.scope.file_count < 1) errors.push('scope.file_count must be positive');
    if (!Number.isInteger(snapshot.scope.bytes) || snapshot.scope.bytes < 1) errors.push('scope.bytes must be positive');
  }

  if (!isPlainObject(snapshot.governance)) {
    errors.push('governance must be an object');
  } else if (source) {
    const expected = {
      decision: source.decision,
      model_use: source.governance.model_use,
      shard: source.governance.shard,
      license_expression: source.license.expression,
    };
    for (const [field, value] of Object.entries(expected)) {
      if (snapshot.governance[field] !== value) errors.push(`governance.${field} mismatch`);
    }
    if (typeof snapshot.governance.notices_path !== 'string' || snapshot.governance.notices_path.length === 0) errors.push('governance.notices_path is required');
    if (typeof snapshot.governance.attribution_path !== 'string' || snapshot.governance.attribution_path.length === 0) errors.push('governance.attribution_path is required');
  }

  if (!isPlainObject(snapshot.quality)) {
    errors.push('quality must be an object');
  } else {
    const allowed = documents.policy.snapshot_requirements.allowed_scan_statuses;
    for (const check of documents.policy.snapshot_requirements.required_quality_checks) {
      const field = check.replaceAll('-', '_');
      if (!allowed.includes(snapshot.quality[field])) errors.push(`quality.${field} has invalid status`);
    }
  }

  if (!isPlainObject(snapshot.review)) {
    errors.push('review must be an object');
  } else {
    const allowed = documents.policy.snapshot_requirements.allowed_review_statuses;
    if (!allowed.includes(snapshot.review.status)) errors.push('review.status is invalid');
    const reviewerIsString = typeof snapshot.review.reviewer === 'string';
    if (!reviewerIsString) errors.push('review.reviewer must be a string');
    if (!Array.isArray(snapshot.review.notes) || !snapshot.review.notes.every((note) => typeof note === 'string')) errors.push('review.notes must be strings');
    if (snapshot.review.status === 'draft') {
      if (snapshot.review.reviewed_at !== null) errors.push('draft review.reviewed_at must be null');
    } else {
      if (!reviewerIsString || !snapshot.review.reviewer.trim()) errors.push('completed review requires reviewer');
      if (!isValidDateTime(snapshot.review.reviewed_at)) errors.push('completed review requires reviewed_at');
    }
    if (snapshot.review.status === 'approved' && isPlainObject(snapshot.quality)) {
      for (const check of documents.policy.snapshot_requirements.required_quality_checks) {
        const status = snapshot.quality[check.replaceAll('-', '_')];
        if (!['pass', 'not-applicable'].includes(status)) errors.push(`approved review requires ${check} completion`);
      }
    }
  }

  if (source?.decision === 'blocked') errors.push('blocked source cannot be acquired');
  return unique(errors);
}
