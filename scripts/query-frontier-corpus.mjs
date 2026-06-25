import { readFileSync } from 'node:fs';
import process from 'node:process';
import {
  analyseFrontierCorpus,
  createSnapshotTemplate,
  loadFrontierCorpus,
  querySources,
  sourceRiskBand,
  sourceRiskScore,
  validateSnapshotManifest,
} from './lib/frontier-corpus.mjs';

const documents = loadFrontierCorpus();
const analysis = analyseFrontierCorpus(documents);
const [command = 'summary', value] = process.argv.slice(2);

function printSources(sources) {
  for (const source of sources) {
    console.log(`${source.id}\t${source.decision}\t${source.governance.model_use}\t${source.license.expression}\t${source.title}`);
  }
}

function requireValue(usage) {
  if (!value) throw new Error(`Usage: npm run query:frontier-corpus -- ${usage}`);
  return value;
}

switch (command) {
  case 'summary':
    console.log(JSON.stringify({
      pack_version: analysis.packVersion,
      reviewed_on: analysis.reviewedOn,
      sources: analysis.sourceCount,
      eligible_sources: analysis.eligibleSourceCount,
      candidate_training_sources: analysis.candidateTrainingSourceCount,
      distinct_families: analysis.distinctFamilies,
      hard_policy_pass: analysis.pass,
      frontier_dimensions_pass: analysis.frontierDimensionsPass,
      dedicated_density_pass: analysis.frontierDensityPass,
      priority_dimensions: analysis.priorityDimensions.map((dimension) => dimension.id),
      priority_areas: analysis.priorityAreas.map((area) => area.id),
      hard_gaps: analysis.gaps,
      advisory_gaps: analysis.advisoryGaps,
    }, null, 2));
    break;
  case 'gaps':
    console.log(analysis.gaps.length ? analysis.gaps.join('\n') : 'No hard policy gaps detected.');
    break;
  case 'priorities': {
    const priorities = [
      ...analysis.priorityDimensions.map((dimension) => `dimension\t${dimension.id}\t${dimension.priority}\t${dimension.gaps.join('; ')}`),
      ...analysis.priorityAreas.map((area) => `area\t${area.id}\t${area.priority}\t${area.gaps.join('; ')}`),
    ];
    console.log(priorities.length ? priorities.join('\n') : 'No advisory frontier-readiness gaps.');
    break;
  }
  case 'frontier':
    console.log(JSON.stringify({
      dimensions: analysis.frontierDimensions,
      priority_dimensions: analysis.priorityDimensions,
      priority_areas: analysis.priorityAreas,
      advisory_gaps: analysis.advisoryGaps,
    }, null, 2));
    break;
  case 'area': {
    const area = requireValue('area <area-id>');
    if (!documents.policy.vocabularies.areas.includes(area)) throw new Error(`Unknown area: ${area}`);
    printSources(querySources(documents, { area, eligible: true }));
    break;
  }
  case 'decision': {
    const decision = requireValue('decision <decision>');
    if (!documents.policy.vocabularies.decisions.includes(decision)) throw new Error(`Unknown decision: ${decision}`);
    printSources(querySources(documents, { decision }));
    break;
  }
  case 'model-use': {
    const modelUse = requireValue('model-use <model-use>');
    if (!documents.policy.vocabularies.model_uses.includes(modelUse)) throw new Error(`Unknown model use: ${modelUse}`);
    printSources(querySources(documents, { modelUse }));
    break;
  }
  case 'shard':
    printSources(querySources(documents, { shard: requireValue('shard <shard>') }));
    break;
  case 'capability': {
    const capability = requireValue('capability <capability>');
    if (!documents.policy.vocabularies.capabilities.includes(capability)) throw new Error(`Unknown capability: ${capability}`);
    printSources(querySources(documents, { capability, eligible: true }));
    break;
  }
  case 'modality': {
    const modality = requireValue('modality <modality>');
    if (!documents.policy.vocabularies.modalities.includes(modality)) throw new Error(`Unknown modality: ${modality}`);
    printSources(querySources(documents, { modality, eligible: true }));
    break;
  }
  case 'training':
    printSources(querySources(documents, { candidateTraining: true }));
    break;
  case 'risk': {
    const sources = value
      ? querySources(documents, { riskBand: value })
      : [...documents.registry.sources].sort((left, right) => sourceRiskScore(right, documents.policy) - sourceRiskScore(left, documents.policy) || left.id.localeCompare(right.id));
    for (const source of sources) {
      console.log(`${source.id}\t${sourceRiskScore(source, documents.policy)}\t${sourceRiskBand(source, documents.policy)}\t${source.decision}\t${source.title}`);
    }
    break;
  }
  case 'holdouts':
    console.log(JSON.stringify(documents.holdouts, null, 2));
    break;
  case 'source': {
    const sourceId = requireValue('source <source-id>');
    const source = documents.registry.sources.find((entry) => entry.id === sourceId);
    if (!source) throw new Error(`Unknown source: ${sourceId}`);
    console.log(JSON.stringify(source, null, 2));
    break;
  }
  case 'snapshot-template':
    console.log(JSON.stringify(createSnapshotTemplate(documents, requireValue('snapshot-template <source-id>')), null, 2));
    break;
  case 'snapshot-validate': {
    const path = requireValue('snapshot-validate <file>');
    const snapshot = JSON.parse(readFileSync(path, 'utf8'));
    const errors = validateSnapshotManifest(snapshot, documents);
    if (errors.length) throw new Error(`Invalid snapshot manifest:\n${errors.join('\n')}`);
    console.log(`Snapshot manifest is valid for ${snapshot.source_id}.`);
    break;
  }
  default:
    throw new Error(`Unknown query command: ${command}`);
}
