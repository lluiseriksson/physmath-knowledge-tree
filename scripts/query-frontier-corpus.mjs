import process from 'node:process';
import {
  analyseFrontierCorpus,
  loadFrontierCorpus,
  querySources,
} from './lib/frontier-corpus.mjs';

const documents = loadFrontierCorpus();
const analysis = analyseFrontierCorpus(documents);
const [command = 'summary', value] = process.argv.slice(2);

function printSources(sources) {
  for (const source of sources) {
    console.log(`${source.id}\t${source.decision}\t${source.governance.model_use}\t${source.license.expression}\t${source.title}`);
  }
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
      policy_pass: analysis.pass,
      gaps: analysis.gaps,
    }, null, 2));
    break;
  case 'gaps':
    console.log(analysis.gaps.length ? analysis.gaps.join('\n') : 'No policy gaps detected.');
    break;
  case 'area': {
    if (!value) throw new Error('Usage: npm run query:frontier-corpus -- area <area-id>');
    if (!documents.policy.vocabularies.areas.includes(value)) throw new Error(`Unknown area: ${value}`);
    printSources(querySources(documents, { area: value, eligible: true }));
    break;
  }
  case 'decision': {
    if (!value) throw new Error('Usage: npm run query:frontier-corpus -- decision <decision>');
    if (!documents.policy.vocabularies.decisions.includes(value)) throw new Error(`Unknown decision: ${value}`);
    printSources(querySources(documents, { decision: value }));
    break;
  }
  case 'shard': {
    if (!value) throw new Error('Usage: npm run query:frontier-corpus -- shard <shard>');
    printSources(querySources(documents, { shard: value }));
    break;
  }
  case 'training':
    printSources(querySources(documents, { candidateTraining: true }));
    break;
  case 'source': {
    if (!value) throw new Error('Usage: npm run query:frontier-corpus -- source <source-id>');
    const source = documents.registry.sources.find((entry) => entry.id === value);
    if (!source) throw new Error(`Unknown source: ${value}`);
    console.log(JSON.stringify(source, null, 2));
    break;
  }
  default:
    throw new Error(`Unknown query command: ${command}`);
}
