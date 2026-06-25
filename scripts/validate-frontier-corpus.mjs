import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  FRONTIER_CORPUS_ROOT,
  REPOSITORY_ROOT,
  analyseFrontierCorpus,
  createSnapshotTemplate,
  generatedFrontierCorpusArtifacts,
  loadFrontierCorpus,
  renderAcquisitionPlan,
  sourceRiskBand,
  validateSnapshotManifest,
} from './lib/frontier-corpus.mjs';

const documents = loadFrontierCorpus(REPOSITORY_ROOT);
const { manifest, policy, registry, holdouts, snapshotSchema, snapshotTemplate } = documents;
const gates = [];
const fail = (message) => { throw new Error(message); };
const gate = (name, test) => { test(); gates.push({ name, pass: true }); };
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const datePattern = /^\d{4}-\d{2}-\d{2}$/u;

function requireString(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a non-empty string`);
}

function requireUrl(value, label) {
  requireString(value, label);
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol)) fail(`${label} must use http(s)`);
}

function requireUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) fail(`duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function requireVocabulary(values, vocabulary, label) {
  if (!Array.isArray(values) || values.length === 0) fail(`${label} must be a non-empty array`);
  requireUnique(values, label);
  for (const value of values) if (!vocabulary.includes(value)) fail(`${label} contains unknown value ${value}`);
}

function daysBetween(left, right) {
  return Math.round((Date.parse(right) - Date.parse(left)) / 86_400_000);
}

function countDecision(decision) {
  return registry.sources.filter((source) => source.decision === decision).length;
}

function sourceById(id) {
  return registry.sources.find((source) => source.id === id);
}

gate('manifest-and-entrypoints', () => {
  if (manifest.pack_version !== '1.1.0') fail(`unexpected pack version ${manifest.pack_version}`);
  if (!datePattern.test(manifest.reviewed_on)) fail('manifest reviewed_on must be YYYY-MM-DD');
  if (manifest.reviewed_on !== policy.reviewed_on || manifest.reviewed_on !== registry.reviewed_on || manifest.reviewed_on !== holdouts.reviewed_on) {
    fail('manifest, policy, registry and holdout review dates must match');
  }
  requireUnique(manifest.entrypoints, 'manifest entrypoint');
  for (const entrypoint of manifest.entrypoints) {
    if (!entrypoint.startsWith(`${FRONTIER_CORPUS_ROOT}/`)) fail(`entrypoint escapes pack: ${entrypoint}`);
    if (!existsSync(join(REPOSITORY_ROOT, entrypoint))) fail(`missing entrypoint: ${entrypoint}`);
  }
  if (!Array.isArray(manifest.guardrails) || manifest.guardrails.length < 10) fail('manifest needs at least ten guardrails');
});

gate('registry-shape-license-and-vocabularies', () => {
  if (registry.schema_version !== '1.1.0') fail(`unexpected registry schema ${registry.schema_version}`);
  if (policy.schema_version !== '1.1.0') fail(`unexpected policy schema ${policy.schema_version}`);
  if (!Array.isArray(registry.sources) || registry.sources.length < 80) fail('registry must contain at least 80 sources');
  requireUnique(registry.sources.map((source) => source.id), 'source id');
  for (const source of registry.sources) {
    if (!idPattern.test(source.id)) fail(`invalid source id: ${source.id}`);
    for (const [key, value] of Object.entries({ title: source.title, family: source.family, source_type: source.source_type, decision_reason: source.decision_reason })) {
      requireString(value, `${source.id}.${key}`);
    }
    requireUrl(source.homepage, `${source.id}.homepage`);
    requireUrl(source.license?.evidence_url, `${source.id}.license.evidence_url`);
    if (!datePattern.test(source.license?.reviewed_on ?? '')) fail(`${source.id}: license reviewed_on must be YYYY-MM-DD`);
    if (!datePattern.test(source.license?.next_review_on ?? '')) fail(`${source.id}: license next_review_on must be YYYY-MM-DD`);
    if (source.license.reviewed_on !== registry.reviewed_on) fail(`${source.id}: stale license review date`);
    const reviewDays = daysBetween(source.license.reviewed_on, source.license.next_review_on);
    if (reviewDays < 1 || reviewDays > policy.license_review.maximum_days_between_reviews) fail(`${source.id}: invalid license review horizon`);
    if (!policy.vocabularies.decisions.includes(source.decision)) fail(`${source.id}: unknown decision ${source.decision}`);
    if (!policy.vocabularies.model_uses.includes(source.governance?.model_use)) fail(`${source.id}: unknown model use`);
    if (!policy.vocabularies.coverage_roles.includes(source.coverage?.role)) fail(`${source.id}: unknown coverage role`);
    if (!policy.vocabularies.ai_terms.includes(source.license?.ai_terms)) fail(`${source.id}: unknown ai_terms`);
    if (!policy.license_classes[source.license?.class]) fail(`${source.id}: unknown license class ${source.license?.class}`);
    requireVocabulary(source.coverage?.areas, policy.vocabularies.areas, `${source.id}.areas`);
    requireVocabulary(source.coverage?.modalities, policy.vocabularies.modalities, `${source.id}.modalities`);
    requireVocabulary(source.coverage?.capabilities, policy.vocabularies.capabilities, `${source.id}.capabilities`);
    requireVocabulary(source.coverage?.levels, policy.vocabularies.levels, `${source.id}.levels`);
    requireVocabulary(source.coverage?.languages, ['en', 'multi'], `${source.id}.languages`);
    for (const field of ['redistributable', 'derivatives', 'commercial_use', 'attribution', 'share_alike', 'source_disclosure', 'per_item']) {
      const value = source.license[field];
      if (![true, false, null].includes(value)) fail(`${source.id}.license.${field} must be boolean or null`);
    }
    requireString(source.acquisition?.mode, `${source.id}.acquisition.mode`);
    requireString(source.acquisition?.pin, `${source.id}.acquisition.pin`);
    requireString(source.acquisition?.content_scope, `${source.id}.acquisition.content_scope`);
    if (!Array.isArray(source.acquisition?.excludes)) fail(`${source.id}.acquisition.excludes must be an array`);
    requireString(source.governance?.shard, `${source.id}.governance.shard`);
    requireString(source.governance?.attribution_template, `${source.id}.governance.attribution_template`);
    if (!['low', 'medium', 'high'].includes(source.governance?.contamination_risk)) fail(`${source.id}: bad contamination risk`);
    if (!['none', 'low', 'medium', 'high'].includes(source.governance?.pii_risk)) fail(`${source.id}: bad PII risk`);
    if (!['complete', 'required', 'not-applicable'].includes(source.governance?.legal_review)) fail(`${source.id}: bad legal review`);
    if (!Array.isArray(source.notes)) fail(`${source.id}.notes must be an array`);
  }
});

gate('decision-and-license-shard-discipline', () => {
  for (const source of registry.sources) {
    if (source.decision === 'approved') {
      if (source.governance.legal_review !== 'complete') fail(`${source.id}: approved source requires completed legal review`);
      if (source.license.ai_terms !== 'none-observed') fail(`${source.id}: approved source has unresolved AI terms`);
      for (const field of ['redistributable', 'derivatives', 'commercial_use']) {
        if (source.license[field] !== true) fail(`${source.id}: approved source lacks ${field}`);
      }
    }
    if (source.decision === 'conditional') {
      if (source.governance.legal_review !== 'required') fail(`${source.id}: conditional source must require legal review`);
      if (source.license.ai_terms === 'explicit-restriction') fail(`${source.id}: conditionals may not override explicit AI restrictions`);
      const rights = ['redistributable', 'derivatives', 'commercial_use'].map((field) => source.license[field]);
      const fullyGranted = rights.every((value) => value === true);
      const perItemUnknown = source.license.per_item && rights.every((value) => value === null);
      if (!fullyGranted && !perItemUnknown) fail(`${source.id}: conditional rights must be granted or explicitly per-item`);
    }
    if (source.decision === 'metadata_only' && source.governance.model_use !== 'metadata-only') fail(`${source.id}: metadata_only source must use metadata-only`);
    if (source.decision === 'blocked') {
      if (source.governance.model_use !== 'blocked' || source.governance.shard !== 'blocked') fail(`${source.id}: blocked source escaped blocked governance`);
      if (source.acquisition.mode !== 'none') fail(`${source.id}: blocked source must have acquisition mode none`);
      if (sourceRiskBand(source, policy) !== 'blocked') fail(`${source.id}: blocked source must remain in the blocked risk band`);
    }
    const policyClass = policy.license_classes[source.license.class];
    if (source.governance.shard !== policyClass.default_shard) fail(`${source.id}: shard does not match license-class default`);
    if (source.license.share_alike && source.decision !== 'blocked' && !['share-alike', 'documentation-copyleft'].includes(source.governance.shard)) fail(`${source.id}: share-alike source is not isolated`);
    if (source.license.per_item && source.decision !== 'blocked' && !['per-item', 'public-domain', 'metadata'].includes(source.governance.shard)) fail(`${source.id}: per-item source is in an unsafe shard`);
  }
});

gate('immutable-acquisition-and-attribution', () => {
  for (const source of registry.sources) {
    if (/latest|floating|unversioned/iu.test(source.acquisition.pin)) fail(`${source.id}: non-immutable pin policy`);
    if (source.decision !== 'blocked' && source.acquisition.mode === 'none') fail(`${source.id}: nonblocked source has no acquisition mode`);
    if (source.decision !== 'blocked' && source.governance.attribution_template.length < 30) fail(`${source.id}: attribution record is too short`);
    if (source.decision !== 'blocked' && source.license.attribution === true && !/credit|retain|record|cite|attribute|include|store|preserve/iu.test(source.governance.attribution_template)) fail(`${source.id}: attribution template does not state an attribution action`);
  }
});

gate('benchmark-pii-and-holdout-quarantine', () => {
  for (const source of registry.sources) {
    if (source.decision !== 'blocked' && source.coverage.modalities.includes('benchmarks')) {
      if (source.governance.model_use !== 'evaluation-only') fail(`${source.id}: benchmark must be evaluation-only`);
      if (source.governance.contamination_risk !== 'high') fail(`${source.id}: benchmark contamination risk must be high`);
    }
    if (source.governance.pii_risk === 'high' && source.governance.model_use === 'candidate-training') fail(`${source.id}: high-PII source cannot be candidate-training`);
  }
  for (const id of policy.required_evaluation_ids) {
    const source = sourceById(id);
    if (!source || source.governance.model_use !== 'evaluation-only') fail(`missing evaluation-only guardrail ${id}`);
  }
  if (holdouts.schema_version !== '1.0.0') fail('unexpected holdout schema');
  if (!Array.isArray(holdouts.global_rules) || holdouts.global_rules.length < 5) fail('holdout global rules are incomplete');
  requireUnique(holdouts.groups.map((group) => group.id), 'holdout group id');
  const directSources = [];
  for (const group of holdouts.groups) {
    if (!idPattern.test(group.id)) fail(`bad holdout group id ${group.id}`);
    requireString(group.title, `${group.id}.title`);
    requireVocabulary(group.source_ids, policy.required_evaluation_ids, `${group.id}.source_ids`);
    directSources.push(...group.source_ids);
    if (!Array.isArray(group.related_source_ids)) fail(`${group.id}.related_source_ids must be an array`);
    requireUnique(group.related_source_ids, `${group.id}.related_source_ids`);
    for (const id of group.related_source_ids) if (!sourceById(id)) fail(`${group.id}: unknown related source ${id}`);
    requireUnique(group.aliases, `${group.id}.aliases`);
    requireUnique(group.matchers, `${group.id}.matchers`);
    if (!group.aliases.length || !group.matchers.length) fail(`${group.id}: aliases and matchers are required`);
    requireString(group.quarantine, `${group.id}.quarantine`);
    for (const id of group.source_ids) if (sourceById(id)?.governance.model_use !== 'evaluation-only') fail(`${group.id}: direct source ${id} is not evaluation-only`);
  }
  requireUnique(directSources, 'direct holdout source');
  for (const id of policy.required_evaluation_ids) if (!directSources.includes(id)) fail(`evaluation source lacks holdout group: ${id}`);
});

gate('governance-and-required-blocks', () => {
  const contract = `${registry.legal_notice} ${manifest.guardrails.join(' ')}`.toLowerCase();
  for (const required of ['not legal advice', 'free access', 'immutable', 'share-alike', 'benchmark', 'personal', 'derived', 'frontier-level']) {
    if (!contract.includes(required)) fail(`governance contract is missing: ${required}`);
  }
  if (!registry.legal_notice.includes('every jurisdiction')) fail('registry legal notice must reject universal legal conclusions');
  for (const id of policy.required_blocked_ids) {
    const source = sourceById(id);
    if (!source) fail(`missing required blocked source ${id}`);
    if (source.decision !== 'blocked') fail(`${id} must remain blocked`);
  }
  if (countDecision('blocked') < policy.targets.minimum_blocked_guardrails) fail('insufficient blocked guardrails');
});

gate('snapshot-manifest-contract', () => {
  if (snapshotSchema.$schema !== 'https://json-schema.org/draft/2020-12/schema') fail('snapshot schema must use JSON Schema 2020-12');
  if (snapshotSchema.properties?.schema_version?.const !== policy.snapshot_requirements.schema_version) fail('snapshot schema version mismatch');
  for (const field of ['source_id', 'upstream', 'scope', 'governance', 'quality', 'review']) {
    if (!snapshotSchema.required.includes(field)) fail(`snapshot schema missing required field ${field}`);
  }
  if (!String(snapshotTemplate.$comment ?? '').includes('snapshot-template')) fail('snapshot template lacks generation instruction');
  const example = createSnapshotTemplate(documents, 'mathlib4');
  example.retrieved_at = '2026-06-25T12:00:00.000Z';
  example.upstream.revision = '0123456789abcdef0123456789abcdef01234567';
  example.upstream.artifact_sha256 = '1'.repeat(64);
  example.upstream.license_evidence_sha256 = '2'.repeat(64);
  for (const field of Object.keys(example.quality)) example.quality[field] = 'pass';
  example.review = { status: 'approved', reviewer: 'validation-suite', reviewed_at: '2026-06-25T12:30:00.000Z', notes: [] };
  const errors = validateSnapshotManifest(example, documents);
  if (errors.length) fail(`valid snapshot example failed: ${errors.join('; ')}`);
});

gate('coverage-and-frontier-honesty', () => {
  const analysis = analyseFrontierCorpus(documents);
  if (!analysis.pass) fail(`coverage gaps:\n${analysis.gaps.join('\n')}`);
  if (analysis.frontierDimensions.length !== policy.frontier_dimensions.length) fail('frontier dimension analysis is incomplete');
  if (analysis.frontierDensityPass) fail('density advisory unexpectedly claims universal subject depth');
  for (const id of ['algebraic-geometry', 'research-mathematics']) {
    if (!analysis.priorityAreas.some((area) => area.id === id)) fail(`missing honest density priority ${id}`);
  }
});

gate('risk-prioritization-and-acquisition-plan', () => {
  const expectedBands = {
    mathlib4: 'low',
    'active-calculus': 'medium',
    'mini-f2f': 'high',
    'math-stackexchange-dump': 'critical',
    'openstax-current-textbooks': 'blocked',
  };
  for (const [id, expected] of Object.entries(expectedBands)) {
    const source = sourceById(id);
    if (!source || sourceRiskBand(source, policy) !== expected) fail(`${id}: unexpected risk band`);
  }
  const plan = JSON.parse(renderAcquisitionPlan(documents));
  if (plan.entries.length !== registry.sources.filter((source) => source.decision !== 'blocked').length) fail('acquisition plan source count mismatch');
  const mini = plan.entries.find((entry) => entry.source_id === 'mini-f2f');
  if (mini?.priority !== 'holdout' || mini.holdout_group !== 'mini-f2f-formal-olympiad') fail('miniF2F acquisition plan lost holdout status');
  if (plan.entries.some((entry) => policy.required_blocked_ids.includes(entry.source_id))) fail('blocked source escaped into acquisition plan');
});

gate('generated-artifacts', () => {
  const artifacts = generatedFrontierCorpusArtifacts(documents);
  if (artifacts.size !== 6) fail(`expected six generated artifacts, found ${artifacts.size}`);
  for (const [relativePath, expected] of artifacts) {
    const file = join(REPOSITORY_ROOT, relativePath);
    if (!existsSync(file)) fail(`missing generated artifact ${relativePath}`);
    if (readFileSync(file, 'utf8') !== expected) fail(`stale generated artifact ${relativePath}`);
  }
});

console.log(JSON.stringify({ score: gates.length * 10, maximum: gates.length * 10, gates }, null, 2));
