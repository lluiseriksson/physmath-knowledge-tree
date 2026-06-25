import assert from 'node:assert/strict';
import test from 'node:test';
import {
  analyseFrontierCorpus,
  generatedFrontierCorpusArtifacts,
  isCandidateTraining,
  isKnowledgeEligible,
  loadFrontierCorpus,
  querySources,
  renderAgentContext,
  renderAttributionLedger,
  renderCoverageReport,
} from '../scripts/lib/frontier-corpus.mjs';

const documents = loadFrontierCorpus();

test('frontier corpus meets the committed coverage policy', () => {
  const analysis = analyseFrontierCorpus(documents);
  assert.equal(analysis.pass, true);
  assert.deepEqual(analysis.gaps, []);
  assert.equal(analysis.sourceCount, documents.registry.sources.length);
  assert.ok(analysis.sourceCount >= 70);
  assert.ok(analysis.areas.every((area) => area.eligibleFamilies >= 2));
  assert.ok(analysis.areas.filter((area) => area.critical).every((area) => area.candidateTrainingFamilies >= 2));
});

test('eligibility and training decisions remain distinct', () => {
  const activeCalculus = documents.registry.sources.find((source) => source.id === 'active-calculus');
  const gsm8k = documents.registry.sources.find((source) => source.id === 'gsm8k');
  const crossref = documents.registry.sources.find((source) => source.id === 'crossref-metadata');
  const openstax = documents.registry.sources.find((source) => source.id === 'openstax-current-textbooks');
  assert.equal(isKnowledgeEligible(activeCalculus, documents.policy), true);
  assert.equal(isCandidateTraining(activeCalculus, documents.policy), true);
  assert.equal(isKnowledgeEligible(gsm8k, documents.policy), true);
  assert.equal(isCandidateTraining(gsm8k, documents.policy), false);
  assert.equal(isKnowledgeEligible(crossref, documents.policy), false);
  assert.equal(isKnowledgeEligible(openstax, documents.policy), false);
});

test('queries respect area, decision, shard and training filters', () => {
  const calculus = querySources(documents, { area: 'calculus', eligible: true });
  assert.ok(calculus.some((source) => source.id === 'active-calculus'));
  assert.ok(calculus.every((source) => source.coverage.areas.includes('calculus')));
  const blocked = querySources(documents, { decision: 'blocked' });
  assert.equal(blocked.length, documents.policy.required_blocked_ids.length);
  const shareAlike = querySources(documents, { shard: 'share-alike' });
  assert.ok(shareAlike.length > 0);
  assert.ok(shareAlike.every((source) => source.governance.shard === 'share-alike'));
  const training = querySources(documents, { candidateTraining: true });
  assert.ok(training.length > 20);
  assert.ok(training.every((source) => source.governance.model_use === 'candidate-training'));
});

test('generated reports are deterministic and contain governance boundaries', () => {
  const analysis = analyseFrontierCorpus(documents);
  const coverage = renderCoverageReport(documents, analysis);
  const attribution = renderAttributionLedger(documents, analysis);
  const context = renderAgentContext(documents, analysis);
  assert.equal(coverage, renderCoverageReport(documents, analysis));
  assert.match(coverage, /Policy result: \*\*PASS\*\*/u);
  assert.match(attribution, /immutable revision/u);
  assert.doesNotMatch(attribution, /openstax-current-textbooks/u);
  assert.match(context, /Blocked guardrails:/u);
  assert.match(context, /OpenStax current textbooks are blocked/u);
  const artifacts = generatedFrontierCorpusArtifacts(documents);
  assert.equal(artifacts.size, 3);
  assert.equal(artifacts.get('integrations/frontier-math-corpus/generated/coverage-report.md'), coverage);
});

test('failing synthetic corpora expose every gap branch', () => {
  const sparse = structuredClone(documents);
  sparse.registry.sources = [];
  delete sparse.policy.targets.modality_eligible_sources.exposition;
  delete sparse.policy.targets.capability_eligible_sources.curriculum;
  const analysis = analyseFrontierCorpus(sparse);
  assert.equal(analysis.pass, false);
  assert.ok(analysis.gaps.length > 20);
  assert.equal(analysis.decisionCounts.length, 0);
  assert.equal(analysis.areas.find((area) => area.id === 'calculus').gaps.length, 4);
  assert.match(renderCoverageReport(sparse, analysis), /Policy result: \*\*FAIL\*\*/u);
  assert.match(renderCoverageReport(sparse, analysis), /calculus eligible families/u);
  assert.match(renderAgentContext(sparse, analysis), /Coverage gate: \*\*FAIL\*\*/u);
});

test('analysis retains unexpected count categories and every query filter', () => {
  const extended = structuredClone(documents);
  const extra = structuredClone(documents.registry.sources[0]);
  extra.id = 'synthetic-extra-category';
  extra.family = 'synthetic-extra-family';
  extra.decision = 'experimental';
  extra.governance.model_use = 'research-only';
  extended.registry.sources.push(extra);
  const analysis = analyseFrontierCorpus(extended);
  assert.deepEqual(analysis.decisionCounts.at(-1), { id: 'experimental', count: 1 });
  assert.deepEqual(analysis.modelUseCounts.at(-1), { id: 'research-only', count: 1 });
  const evaluation = querySources(documents, { modelUse: 'evaluation-only' });
  assert.equal(evaluation.length, 3);
  assert.ok(evaluation.every((source) => source.governance.model_use === 'evaluation-only'));
  assert.deepEqual(querySources(documents, { area: 'calculus', decision: 'blocked', modelUse: 'metadata-only' }), []);
});
