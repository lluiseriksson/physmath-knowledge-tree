import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateRepository } from './lib/evaluation.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const index = readJson('graph/index.json');
const input = {
  nodes: readJson(index.canonical_files.nodes),
  edges: readJson(index.canonical_files.edges),
  scenarios: readJson('evaluation/scenarios.json'),
  rubric: readJson('evaluation/quality-rubric.json'),
  repositoryChecks: [true, true, true, true],
};
const iterations = Number.parseInt(process.env.ITERATIONS ?? '1000', 10);
if (!Number.isInteger(iterations) || iterations < 1) throw new Error('ITERATIONS must be a positive integer');

const started = performance.now();
for (let index = 0; index < iterations; index += 1) evaluateRepository(input);
const elapsedMilliseconds = performance.now() - started;
console.log(JSON.stringify({
  iterations,
  elapsed_milliseconds: Number(elapsedMilliseconds.toFixed(3)),
  evaluations_per_second: Number((iterations / (elapsedMilliseconds / 1000)).toFixed(2)),
  node: process.version,
  platform: process.platform,
  architecture: process.arch,
}, null, 2));
