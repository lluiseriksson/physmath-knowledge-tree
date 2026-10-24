import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { searchResearchRadar, validateResearchRadar } from './lib/research-radar.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const directory = 'integrations/research-radar/';
const registry = read(`${directory}registry.json`);
const catalogue = read(`${directory}catalogue/openai-math-2026-10-24.json`);
const inventory = read(`${directory}repository-inventory.json`);
const nodeIds = read('graph/nodes/core.json').map((node) => node.id);
const summary = validateResearchRadar(registry, catalogue, inventory, nodeIds);
const command = process.argv[2] || 'summary';
if (command === 'summary' || command === 'validate') {
  console.log(JSON.stringify({ ...summary, coverage: registry.coverage, observation: registry.observed_on }, null, 2));
} else if (command === 'search') {
  console.log(JSON.stringify(searchResearchRadar(registry, catalogue, process.argv.slice(3).join(' ')), null, 2));
} else if (command === 'next') {
  console.log(JSON.stringify(registry.candidates.filter((candidate) => ['under_audit', 'queued'].includes(candidate.status)), null, 2));
} else {
  throw new Error('Use summary, validate, search <terms>, or next.');
}
