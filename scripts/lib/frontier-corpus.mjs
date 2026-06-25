import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY_ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const FRONTIER_CORPUS_ROOT = 'integrations/frontier-math-corpus';

const DECISION_ORDER = Object.freeze(['approved', 'conditional', 'metadata_only', 'blocked']);
const MODEL_USE_ORDER = Object.freeze(['candidate-training', 'retrieval-only', 'evaluation-only', 'metadata-only', 'blocked']);

function readJson(root, relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
}

export function loadFrontierCorpus(root = REPOSITORY_ROOT) {
  return {
    manifest: readJson(root, `${FRONTIER_CORPUS_ROOT}/manifest.json`),
    policy: readJson(root, `${FRONTIER_CORPUS_ROOT}/coverage-policy.json`),
    registry: readJson(root, `${FRONTIER_CORPUS_ROOT}/data/sources.json`),
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

export function isKnowledgeEligible(source, policy) {
  return policy.eligibility.knowledge_decisions.includes(source.decision);
}

export function isCandidateTraining(source, policy) {
  return isKnowledgeEligible(source, policy)
    && policy.eligibility.training_model_uses.includes(source.governance.model_use);
}

function sourceMatchesAnyModality(source, modalities) {
  return source.coverage.modalities.some((value) => modalities.includes(value));
}

function targetGap(label, actual, target) {
  return actual >= target ? null : `${label}: ${actual} < ${target}`;
}

export function analyseFrontierCorpus(documents) {
  const { manifest, policy, registry } = documents;
  const sources = registry.sources;
  const eligibleSources = sources.filter((source) => isKnowledgeEligible(source, policy));
  const candidateTrainingSources = eligibleSources.filter((source) => isCandidateTraining(source, policy));
  const gaps = [];

  const areas = policy.vocabularies.areas.map((area) => {
    const matching = eligibleSources.filter((source) => source.coverage.areas.includes(area));
    const candidateTraining = matching.filter((source) => isCandidateTraining(source, policy));
    const proofSources = matching.filter((source) => sourceMatchesAnyModality(source, policy.proof_modalities));
    const practiceSources = matching.filter((source) => sourceMatchesAnyModality(source, policy.practice_modalities));
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
      const trainingGap = targetGap(
        `${area} candidate-training families`,
        candidateTrainingFamilies.length,
        policy.targets.critical_area_candidate_training_families,
      );
      const practiceGap = targetGap(
        `${area} practice sources`,
        practiceSources.length,
        policy.targets.critical_area_practice_sources,
      );
      const proofGap = targetGap(
        `${area} proof sources`,
        proofSources.length,
        policy.targets.critical_area_proof_sources,
      );
      for (const gap of [trainingGap, practiceGap, proofGap]) if (gap) areaGaps.push(gap);
    }
    gaps.push(...areaGaps);
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

  const decisionCounts = orderedCounts(sources.map((source) => source.decision), DECISION_ORDER);
  const modelUseCounts = orderedCounts(sources.map((source) => source.governance.model_use), MODEL_USE_ORDER);
  const licenseClassCounts = orderedCounts(sources.map((source) => source.license.class));
  const shardCounts = orderedCounts(sources.map((source) => source.governance.shard));
  const distinctFamilies = unique(sources.map((source) => source.family)).length;

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
    areas,
    modalities,
    capabilities,
    gaps: unique(gaps),
    pass: gaps.length === 0,
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
    : '- No policy gaps detected.';
  return `${generatedHeader('Frontier Mathematics Corpus Coverage Report', analysis)}
## Readiness summary

- Sources: **${analysis.sourceCount}** total; **${analysis.eligibleSourceCount}** knowledge-eligible; **${analysis.candidateTrainingSourceCount}** candidate-training.
- Distinct source families: **${analysis.distinctFamilies}**.
- Decisions: ${countSummary(analysis.decisionCounts)}.
- Model uses: ${countSummary(analysis.modelUseCounts)}.
- Policy result: **${analysis.pass ? 'PASS' : 'FAIL'}**.

Candidate-training is an engineering eligibility label, not a blanket legal conclusion. Every acquisition still requires an immutable snapshot, exact notices and source-specific review.

## Area coverage

${markdownTable(
    ['Area', 'Critical', 'Eligible sources', 'Families', 'Training families', 'Proof', 'Practice', 'Gate'],
    areaRows,
  )}

## Modality coverage

${markdownTable(['Modality', 'Eligible', 'Target', 'Gate'], modalityRows)}

## Capability coverage

${markdownTable(['Capability', 'Eligible', 'Target', 'Gate'], capabilityRows)}

## License and shard inventory

- License classes: ${countSummary(analysis.licenseClassCounts)}.
- Isolation shards: ${countSummary(analysis.shardCounts)}.

## Open gaps

${gapText}
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
    source.governance.attribution_template,
  ]);
  return `${generatedHeader('Frontier Mathematics Corpus Attribution Ledger', analysis)}
This is a planning ledger, not legal advice. The acquisition manifest for each artifact must also retain its exact URL, immutable revision, cryptographic hash, license text and exclusions.

${markdownTable(
    ['Source', 'Decision', 'License', 'Shard', 'Model use', 'Pin', 'Required record'],
    rows,
  )}
`;
}

export function renderAgentContext(documents, analysis = analyseFrontierCorpus(documents)) {
  const criticalRows = analysis.areas.filter((area) => area.critical).map((area) => [
    area.id,
    area.eligibleFamilies,
    area.candidateTrainingFamilies,
    area.proofSources,
    area.practiceSources,
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

- Coverage gate: **${analysis.pass ? 'PASS' : 'FAIL'}**.
- Registry: ${analysis.sourceCount} sources across ${analysis.distinctFamilies} families.
- Knowledge-eligible: ${analysis.eligibleSourceCount}; candidate-training: ${analysis.candidateTrainingSourceCount}.
- Approved IDs: ${approved.join(', ')}.
- Blocked guardrails: ${blocked.join(', ')}.

## Critical-area envelope

${markdownTable(['Area', 'Eligible families', 'Training families', 'Proof sources', 'Practice sources'], criticalRows)}

## Non-negotiable rules

${documents.manifest.guardrails.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}

## Decision order

1. Resolve a source by stable ID with \`npm run query:frontier-corpus -- source <id>\`.
2. Reject \`blocked\`; use \`metadata_only\` solely for metadata fields.
3. For \`conditional\`, satisfy per-source exclusions and legal review before acquisition.
4. Pin an immutable release, commit, edition or dated snapshot; record SHA-256 and license evidence.
5. Keep share-alike, documentation-copyleft, code-copyleft and per-item material in separate shards.
6. Keep benchmark and canonical competition material outside candidate-training corpora.
7. Re-run \`npm run validate:frontier-corpus\` after every registry or policy change.
`;
}

export function generatedFrontierCorpusArtifacts(documents) {
  const analysis = analyseFrontierCorpus(documents);
  return new Map([
    [`${FRONTIER_CORPUS_ROOT}/generated/coverage-report.md`, renderCoverageReport(documents, analysis)],
    [`${FRONTIER_CORPUS_ROOT}/generated/attribution-ledger.md`, renderAttributionLedger(documents, analysis)],
    [`${FRONTIER_CORPUS_ROOT}/generated/agent-context.md`, renderAgentContext(documents, analysis)],
  ]);
}

export function querySources(documents, filters = {}) {
  const { policy, registry } = documents;
  return registry.sources
    .filter((source) => !filters.area || source.coverage.areas.includes(filters.area))
    .filter((source) => !filters.decision || source.decision === filters.decision)
    .filter((source) => !filters.modelUse || source.governance.model_use === filters.modelUse)
    .filter((source) => !filters.shard || source.governance.shard === filters.shard)
    .filter((source) => !filters.eligible || isKnowledgeEligible(source, policy))
    .filter((source) => !filters.candidateTraining || isCandidateTraining(source, policy))
    .sort((left, right) => left.id.localeCompare(right.id));
}
