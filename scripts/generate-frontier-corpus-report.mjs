import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import {
  REPOSITORY_ROOT,
  generatedFrontierCorpusArtifacts,
  loadFrontierCorpus,
} from './lib/frontier-corpus.mjs';

const check = process.argv.slice(2).includes('--check');
const documents = loadFrontierCorpus(REPOSITORY_ROOT);
const artifacts = generatedFrontierCorpusArtifacts(documents);
const stale = [];

for (const [relativePath, content] of artifacts) {
  const file = join(REPOSITORY_ROOT, relativePath);
  if (check) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== content) stale.push(relativePath);
  } else {
    writeFileSync(file, content);
  }
}

if (stale.length) throw new Error(`Stale frontier-corpus artifacts:\n${stale.join('\n')}`);
console.log(`${check ? 'Validated' : 'Generated'} ${artifacts.size} frontier-corpus artifacts.`);
