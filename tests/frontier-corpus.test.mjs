import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FRONTIER_CORPUS_ROOT,
  REPOSITORY_ROOT,
  analyseFrontierCorpus,
  createSnapshotTemplate,
  generatedFrontierCorpusArtifacts,
  isCandidateTraining,
  isKnowledgeEligible,
  loadFrontierCorpus,
  querySources,
  renderAcquisitionPlan,
  renderAgentContext,
  renderAttributionLedger,
  renderCoverageReport,
  renderEvaluationHoldouts,
  renderFrontierReadinessReport,
  sourceRiskBand,
  sourceRiskScore,
  validateSnapshotManifest,
} from '../scripts/lib/frontier-corpus.mjs';

const documents = loadFrontierCorpus();

function source(id) {
  const value = documents.registry.sources.find((entry) => entry.id === id);
  assert.ok(value, `missing source ${id}`);
  return value;
}

function completedSnapshot(sourceId = 'statsmodels') {
  const snapshot = createSnapshotTemplate(documents, sourceId);
  snapshot.retrieved_at = '2026-06-25T12:34:56.000Z';
  snapshot.upstream.revision = 'v1.2.3-abcdef0';
  snapshot.upstream.artifact_sha256 = 'a'.repeat(64);
  snapshot.upstream.license_evidence_sha256 = 'b'.repeat(64);
  for (const check of documents.policy.snapshot_requirements.required_quality_checks) {
    snapshot.quality[check.replaceAll('-', '_')] = 'pass';
  }
  snapshot.review = {
    status: 'approved',
    reviewer: 'Corpus reviewer',
    reviewed_at: '2026-06-25T13:00:00.000Z',
    notes: ['Immutable snapshot and notices verified.'],
  };
  return snapshot;
}

test('loads the full atlas through default and explicit roots', () => {
  const explicit = loadFrontierCorpus(REPOSITORY_ROOT);
  assert.equal(FRONTIER_CORPUS_ROOT, 'integrations/frontier-math-corpus');
  assert.deepEqual(explicit.manifest, documents.manifest);
  assert.equal(documents.manifest.pack_version, '1.1.0');
  assert.equal(documents.registry.sources.length, 81);
  assert.equal(documents.holdouts.groups.length, 4);
  assert.equal(documents.snapshotSchema.title, 'Frontier Mathematics Corpus snapshot manifest');
});

test('hard governance coverage passes while advisory density remains honest', () => {
  const analysis = analyseFrontierCorpus(documents);
  assert.equal(analysis.pass, true);
  assert.deepEqual(analysis.gaps, []);
  assert.equal(analysis.sourceCount, 81);
  assert.equal(analysis.distinctFamilies, 47);
  assert.equal(analysis.frontierDimensionsPass, false);
  assert.equal(analysis.frontierDensityPass, false);
  assert.ok(analysis.areas.every((area) => area.eligibleFamilies >= 3));
  assert.ok(analysis.areas.filter((area) => area.critical).every((area) => area.candidateTrainingFamilies >= 3));
  assert.ok(analysis.priorityAreas.some((area) => area.id === 'algebraic-geometry'));
  assert.ok(analysis.priorityAreas.some((area) => area.id === 'research-mathematics'));
  assert.ok(analysis.priorityDimensions.some((dimension) => dimension.id === 'counterexample-discipline'));
  assert.ok(analysis.priorityDimensions.some((dimension) => dimension.id === 'multilingual-mathematics'));
  assert.ok(analysis.advisoryGaps.some((gap) => gap.includes('counterexample-discipline')));
});

test('knowledge, training and risk classifications stay distinct', () => {
  const activeCalculus = source('active-calculus');
  const gsm8k = source('gsm8k');
  const crossref = source('crossref-metadata');
  const openstax = source('openstax-current-textbooks');
  assert.equal(isKnowledgeEligible(activeCalculus, documents.policy), true);
  assert.equal(isCandidateTraining(activeCalculus, documents.policy), true);
  assert.equal(isKnowledgeEligible(gsm8k, documents.policy), true);
  assert.equal(isCandidateTraining(gsm8k, documents.policy), false);
  assert.equal(isKnowledgeEligible(crossref, documents.policy), false);
  assert.equal(isCandidateTraining(crossref, documents.policy), false);
  assert.equal(isKnowledgeEligible(openstax, documents.policy), false);
  assert.equal(sourceRiskBand(openstax, documents.policy), 'blocked');
  assert.ok(sourceRiskScore(activeCalculus, documents.policy) >= 0);

  const unknown = structuredClone(activeCalculus);
  unknown.decision = 'experimental';
  unknown.license.ai_terms = 'unknown';
  unknown.governance.contamination_risk = 'unknown';
  unknown.governance.pii_risk = 'unknown';
  unknown.governance.legal_review = 'unknown';
  unknown.license.per_item = false;
  unknown.license.share_alike = false;
  unknown.license.source_disclosure = false;
  assert.equal(sourceRiskScore(unknown, documents.policy), 0);

  const allFlags = structuredClone(unknown);
  allFlags.license.per_item = true;
  allFlags.license.share_alike = true;
  allFlags.license.source_disclosure = true;
  assert.equal(
    sourceRiskScore(allFlags, documents.policy),
    documents.policy.risk_policy.weights.per_item
      + documents.policy.risk_policy.weights.share_alike
      + documents.policy.risk_policy.weights.source_disclosure,
  );

  const noBands = structuredClone(documents.policy);
  noBands.risk_policy.bands = [];
  assert.equal(sourceRiskBand(activeCalculus, noBands), 'blocked');
});

test('queries exercise every source filter and stable ordering', () => {
  const all = querySources(documents);
  assert.equal(all.length, 81);
  assert.deepEqual(all.map((entry) => entry.id), [...all.map((entry) => entry.id)].sort());

  const cases = [
    ['area', { area: 'calculus' }, (entry) => entry.coverage.areas.includes('calculus')],
    ['capability', { capability: 'formalization' }, (entry) => entry.coverage.capabilities.includes('formalization')],
    ['modality', { modality: 'formal-proofs' }, (entry) => entry.coverage.modalities.includes('formal-proofs')],
    ['family', { family: 'lean-ecosystem' }, (entry) => entry.family === 'lean-ecosystem'],
    ['decision', { decision: 'blocked' }, (entry) => entry.decision === 'blocked'],
    ['model use', { modelUse: 'evaluation-only' }, (entry) => entry.governance.model_use === 'evaluation-only'],
    ['shard', { shard: 'share-alike' }, (entry) => entry.governance.shard === 'share-alike'],
    ['risk band', { riskBand: 'critical' }, (entry) => sourceRiskBand(entry, documents.policy) === 'critical'],
    ['eligible', { eligible: true }, (entry) => isKnowledgeEligible(entry, documents.policy)],
    ['training', { candidateTraining: true }, (entry) => isCandidateTraining(entry, documents.policy)],
  ];
  for (const [label, filters, predicate] of cases) {
    const results = querySources(documents, filters);
    assert.ok(results.length > 0, `${label} query empty`);
    assert.ok(results.length < all.length, `${label} query did not filter`);
    assert.ok(results.every(predicate), `${label} query leaked`);
  }
  assert.deepEqual(querySources(documents, {
    area: 'calculus',
    capability: 'formalization',
    modality: 'benchmarks',
    family: 'does-not-exist',
    decision: 'approved',
    modelUse: 'candidate-training',
    shard: 'permissive',
    riskBand: 'low',
    eligible: true,
    candidateTraining: true,
  }), []);
});

test('all generated reports are deterministic and preserve governance boundaries', () => {
  const analysis = analyseFrontierCorpus(documents);
  const coverage = renderCoverageReport(documents, analysis);
  const readiness = renderFrontierReadinessReport(documents, analysis);
  const holdouts = renderEvaluationHoldouts(documents, analysis);
  const attribution = renderAttributionLedger(documents, analysis);
  const acquisition = renderAcquisitionPlan(documents, analysis);
  const context = renderAgentContext(documents, analysis);

  assert.equal(coverage, renderCoverageReport(documents, analysis));
  assert.match(coverage, /Hard policy result: \*\*PASS\*\*/u);
  assert.match(readiness, /Subject-specific density is \*\*INCOMPLETE\*\*/u);
  assert.match(readiness, /algebraic-geometry/u);
  assert.match(holdouts, /semantic near-duplicates/u);
  assert.match(attribution, /immutable revision/u);
  assert.doesNotMatch(attribution, /openstax-current-textbooks/u);
  assert.match(context, /Blocked guardrails:/u);
  assert.match(context, /OpenStax current textbooks are blocked/u);

  const plan = JSON.parse(acquisition);
  assert.equal(plan.entries.length, 68);
  assert.equal(plan.entries.find((entry) => entry.source_id === 'mini-f2f').priority, 'holdout');
  assert.equal(plan.entries.find((entry) => entry.source_id === 'crossref-metadata').priority, 'metadata');
  assert.equal(plan.entries.find((entry) => entry.source_id === 'arxiv-license-resolved-subset').priority, 'retrieval');
  assert.equal(plan.entries.find((entry) => entry.source_id === 'statsmodels').priority, 'high');
  assert.equal(plan.entries.find((entry) => entry.source_id === 'active-calculus').priority, 'review-first');
  assert.equal(plan.entries.find((entry) => entry.source_id === 'mini-f2f').holdout_group, 'mini-f2f-formal-olympiad');
  assert.equal(plan.entries.find((entry) => entry.source_id === 'statsmodels').holdout_group, null);

  const artifacts = generatedFrontierCorpusArtifacts(documents);
  assert.equal(artifacts.size, 6);
  assert.equal(artifacts.get(`${FRONTIER_CORPUS_ROOT}/generated/coverage-report.md`), coverage);
  assert.equal(artifacts.get(`${FRONTIER_CORPUS_ROOT}/generated/frontier-readiness-report.md`), readiness);
  assert.equal(artifacts.get(`${FRONTIER_CORPUS_ROOT}/generated/evaluation-holdouts.md`), holdouts);
  assert.equal(artifacts.get(`${FRONTIER_CORPUS_ROOT}/generated/attribution-ledger.md`), attribution);
  assert.equal(artifacts.get(`${FRONTIER_CORPUS_ROOT}/generated/acquisition-plan.json`), acquisition);
  assert.equal(artifacts.get(`${FRONTIER_CORPUS_ROOT}/generated/agent-context.md`), context);
});

test('synthetic sparse corpora expose hard, advisory and rendering failure branches', () => {
  const sparse = structuredClone(documents);
  sparse.registry.sources = [];
  delete sparse.policy.targets.modality_eligible_sources.exposition;
  delete sparse.policy.targets.capability_eligible_sources.curriculum;
  const analysis = analyseFrontierCorpus(sparse);
  assert.equal(analysis.pass, false);
  assert.equal(analysis.frontierDimensionsPass, false);
  assert.equal(analysis.frontierDensityPass, false);
  assert.ok(analysis.gaps.length > 80);
  assert.equal(analysis.decisionCounts.length, 0);
  assert.equal(analysis.areas.find((area) => area.id === 'calculus').gaps.length, 4);
  assert.match(renderCoverageReport(sparse, analysis), /Hard policy result: \*\*FAIL\*\*/u);
  assert.match(renderCoverageReport(sparse, analysis), /calculus eligible families/u);
  assert.match(renderFrontierReadinessReport(sparse, analysis), /frontier-dimension envelope is \*\*GAPS\*\*/u);
  assert.match(renderAgentContext(sparse, analysis), /Hard coverage\/governance gate: \*\*FAIL\*\*/u);
});

test('synthetic dense analysis covers optional dimension selectors and no-priority output', () => {
  const dense = structuredClone(documents);
  dense.policy.advisory_area_targets = {
    ...dense.policy.advisory_area_targets,
    all_area_dedicated_eligible_families: 0,
    all_area_dedicated_candidate_training_families: 0,
    critical_area_pedagogical_candidate_training_families: 0,
    all_area_research_level_eligible_families: 0,
  };
  dense.policy.frontier_dimensions = [
    {
      id: 'unfiltered',
      label: 'Unfiltered',
      minimum_sources: 1,
      minimum_families: 1,
    },
    {
      id: 'all-capabilities-pass',
      label: 'All capabilities pass',
      all_capabilities: source('statsmodels').coverage.capabilities.slice(0, 1),
      minimum_sources: 1,
      minimum_families: 1,
    },
    {
      id: 'all-capabilities-fail',
      label: 'All capabilities fail',
      all_capabilities: ['nonexistent-capability'],
      minimum_sources: 0,
      minimum_families: 0,
    },
  ];
  const analysis = analyseFrontierCorpus(dense);
  assert.equal(analysis.pass, true);
  assert.equal(analysis.frontierDimensionsPass, true);
  assert.equal(analysis.frontierDensityPass, true);
  assert.deepEqual(analysis.priorityDimensions, []);
  assert.deepEqual(analysis.priorityAreas, []);
  assert.match(renderFrontierReadinessReport(dense, analysis), /No advisory frontier-readiness gaps/u);
  assert.match(renderFrontierReadinessReport(dense, analysis), /- None\./u);
  assert.match(renderAgentContext(dense, analysis), /Priority areas: none/u);
});

test('analysis retains unexpected count categories', () => {
  const extended = structuredClone(documents);
  const extra = structuredClone(documents.registry.sources[0]);
  extra.id = 'synthetic-extra-category';
  extra.family = 'synthetic-extra-family';
  extra.decision = 'experimental';
  extra.governance.model_use = 'research-only';
  extra.license.class = 'synthetic-license';
  extra.governance.shard = 'synthetic-shard';
  extended.registry.sources.push(extra);
  const analysis = analyseFrontierCorpus(extended);
  assert.deepEqual(analysis.decisionCounts.at(-1), { id: 'experimental', count: 1 });
  assert.deepEqual(analysis.modelUseCounts.at(-1), { id: 'research-only', count: 1 });
  assert.deepEqual(analysis.licenseClassCounts.find((entry) => entry.id === 'synthetic-license'), { id: 'synthetic-license', count: 1 });
  assert.deepEqual(analysis.shardCounts.find((entry) => entry.id === 'synthetic-shard'), { id: 'synthetic-shard', count: 1 });
});

test('snapshot template generation rejects unknown and blocked sources', () => {
  const template = createSnapshotTemplate(documents, 'statsmodels');
  assert.equal(template.source_id, 'statsmodels');
  assert.equal(template.review.status, 'draft');
  assert.ok(Object.values(template.quality).every((status) => status === 'not-run'));
  assert.throws(() => createSnapshotTemplate(documents, 'does-not-exist'), /Unknown source/u);
  assert.throws(() => createSnapshotTemplate(documents, 'openstax-current-textbooks'), /Blocked source/u);
});

test('a completed immutable snapshot validates', () => {
  const snapshot = completedSnapshot();
  assert.deepEqual(validateSnapshotManifest(snapshot, documents), []);

  const httpSnapshot = structuredClone(snapshot);
  httpSnapshot.upstream.url = 'http://example.test/source';
  httpSnapshot.upstream.license_evidence_url = 'http://example.test/license';
  httpSnapshot.quality.pii_scan = 'not-applicable';
  assert.deepEqual(validateSnapshotManifest(httpSnapshot, documents), []);
});

test('snapshot validator reports missing objects without throwing', () => {
  assert.deepEqual(validateSnapshotManifest(null, documents), ['snapshot must be an object']);
  assert.deepEqual(validateSnapshotManifest([], documents), ['snapshot must be an object']);
  assert.deepEqual(validateSnapshotManifest('snapshot', documents), ['snapshot must be an object']);

  const malformed = {
    schema_version: '9.9.9',
    source_id: 'Bad ID',
    atlas_pack_version: '0.0.0',
    registry_reviewed_on: '1900-01-01',
    retrieved_at: null,
    upstream: null,
    scope: [],
    governance: 'bad',
    quality: null,
    review: null,
  };
  const noSourceId = structuredClone(malformed);
  delete noSourceId.source_id;
  assert.ok(validateSnapshotManifest(noSourceId, documents).includes('invalid source_id'));

  const errors = validateSnapshotManifest(malformed, documents);
  assert.ok(errors.includes('unexpected snapshot schema_version'));
  assert.ok(errors.includes('invalid source_id'));
  assert.ok(errors.includes('unknown source_id'));
  assert.ok(errors.includes('atlas_pack_version mismatch'));
  assert.ok(errors.includes('registry_reviewed_on mismatch'));
  assert.ok(errors.includes('retrieved_at must be an ISO date-time'));
  assert.ok(errors.includes('upstream must be an object'));
  assert.ok(errors.includes('scope must be an object'));
  assert.ok(errors.includes('governance must be an object'));
  assert.ok(errors.includes('quality must be an object'));
  assert.ok(errors.includes('review must be an object'));
});

test('snapshot validator covers malformed URLs, hashes, scope and governance', () => {
  const snapshot = completedSnapshot();
  snapshot.upstream = {
    url: 42,
    revision: 42,
    artifact_sha256: 42,
    license_evidence_url: 'ftp://example.test/license',
    license_evidence_sha256: '0'.repeat(64),
  };
  snapshot.scope = {
    included_paths: [],
    excluded_paths: [1],
    file_count: 0,
    bytes: 1.5,
  };
  snapshot.governance = {
    decision: 'conditional',
    model_use: 'retrieval-only',
    shard: 'wrong',
    license_expression: 'wrong',
    notices_path: 42,
    attribution_path: '',
  };
  const errors = validateSnapshotManifest(snapshot, documents);
  for (const expected of [
    'upstream.url must be http(s)',
    'upstream.revision must be immutable',
    'upstream.artifact_sha256 must be a non-placeholder SHA-256',
    'upstream.license_evidence_url must be http(s)',
    'upstream.license_evidence_sha256 must be a non-placeholder SHA-256',
    'scope.included_paths must be unique non-empty strings',
    'scope.excluded_paths must be unique strings',
    'scope.file_count must be positive',
    'scope.bytes must be positive',
    'governance.decision mismatch',
    'governance.model_use mismatch',
    'governance.shard mismatch',
    'governance.license_expression mismatch',
    'governance.notices_path is required',
    'governance.attribution_path is required',
  ]) assert.ok(errors.includes(expected), expected);

  const nonArrayPaths = completedSnapshot();
  nonArrayPaths.scope.included_paths = 'not-an-array';
  nonArrayPaths.scope.excluded_paths = null;
  const nonArrayPathErrors = validateSnapshotManifest(nonArrayPaths, documents);
  assert.ok(nonArrayPathErrors.includes('scope.included_paths must be unique non-empty strings'));
  assert.ok(nonArrayPathErrors.includes('scope.excluded_paths must be unique strings'));

  const duplicatePaths = completedSnapshot();
  duplicatePaths.upstream.url = 'not a URL';
  duplicatePaths.upstream.revision = 'short';
  duplicatePaths.upstream.artifact_sha256 = 'g'.repeat(64);
  duplicatePaths.scope.included_paths = ['same', 'same'];
  duplicatePaths.scope.excluded_paths = ['same', 'same'];
  const duplicateErrors = validateSnapshotManifest(duplicatePaths, documents);
  assert.ok(duplicateErrors.includes('upstream.url must be http(s)'));
  assert.ok(duplicateErrors.includes('upstream.revision must be immutable'));
  assert.ok(duplicateErrors.includes('upstream.artifact_sha256 must be a non-placeholder SHA-256'));
  assert.ok(duplicateErrors.includes('scope.included_paths must be unique non-empty strings'));
  assert.ok(duplicateErrors.includes('scope.excluded_paths must be unique strings'));

  const floating = completedSnapshot();
  floating.upstream.revision = 'latest-release';
  assert.ok(validateSnapshotManifest(floating, documents).includes('upstream.revision must be immutable'));
});

test('snapshot validator covers quality and every review state', () => {
  const missingQuality = completedSnapshot();
  missingQuality.quality = {};
  const qualityErrors = validateSnapshotManifest(missingQuality, documents);
  assert.ok(qualityErrors.some((error) => error.startsWith('quality.')));
  assert.ok(qualityErrors.some((error) => error.startsWith('approved review requires')));

  const invalidReview = completedSnapshot();
  invalidReview.review = {
    status: 'unknown',
    reviewer: 42,
    reviewed_at: 'not-a-date',
    notes: [42],
  };
  const invalidErrors = validateSnapshotManifest(invalidReview, documents);
  assert.ok(invalidErrors.includes('review.status is invalid'));
  assert.ok(invalidErrors.includes('review.reviewer must be a string'));
  assert.ok(invalidErrors.includes('review.notes must be strings'));
  assert.ok(invalidErrors.includes('completed review requires reviewer'));
  assert.ok(invalidErrors.includes('completed review requires reviewed_at'));

  const draft = completedSnapshot();
  draft.review = {
    status: 'draft',
    reviewer: '',
    reviewed_at: '2026-06-25T13:00:00.000Z',
    notes: [],
  };
  assert.ok(validateSnapshotManifest(draft, documents).includes('draft review.reviewed_at must be null'));

  const rejected = completedSnapshot();
  rejected.review = {
    status: 'rejected',
    reviewer: '',
    reviewed_at: 'bad-date',
    notes: [],
  };
  const rejectedErrors = validateSnapshotManifest(rejected, documents);
  assert.ok(rejectedErrors.includes('completed review requires reviewer'));
  assert.ok(rejectedErrors.includes('completed review requires reviewed_at'));

  const nonArrayNotes = completedSnapshot();
  nonArrayNotes.review.notes = 'not-an-array';
  assert.ok(validateSnapshotManifest(nonArrayNotes, documents).includes('review.notes must be strings'));
});

test('blocked source snapshots are rejected even when structurally complete', () => {
  const blocked = source('openstax-current-textbooks');
  const snapshot = completedSnapshot();
  snapshot.source_id = blocked.id;
  snapshot.upstream.url = blocked.homepage;
  snapshot.upstream.license_evidence_url = blocked.license.evidence_url;
  snapshot.governance = {
    decision: blocked.decision,
    model_use: blocked.governance.model_use,
    shard: blocked.governance.shard,
    license_expression: blocked.license.expression,
    notices_path: `notices/${blocked.id}.txt`,
    attribution_path: `attribution/${blocked.id}.json`,
  };
  assert.ok(validateSnapshotManifest(snapshot, documents).includes('blocked source cannot be acquired'));
});
