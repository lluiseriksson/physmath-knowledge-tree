import { spawnSync } from 'node:child_process';

const productionFiles = [
  'scripts/lib/atomic-publish.mjs',
  'scripts/lib/build-manifest.mjs',
  'scripts/lib/curation.mjs',
  'scripts/lib/evaluation.mjs',
  'scripts/lib/fs-safety.mjs',
  'scripts/lib/i18n-validation.mjs',
  'scripts/lib/public-surface.mjs',
  'scripts/serve.mjs',
  'src/data/topics.js',
  'src/lib/jsonld.js',
  'src/lib/graph.js',
  'src/lib/research-graph.js',
  'src/lib/route-planner.js',
  'src/lib/search.js',
  'src/lib/storage.js',
  'src/lib/text.js',
  'src/lib/url-state.js',
];

const args = [
  '--experimental-test-coverage',
  '--test-coverage-lines=100',
  '--test-coverage-branches=100',
  '--test-coverage-functions=100',
  ...productionFiles.map((file) => `--test-coverage-include=${file}`),
  '--test',
  '--test-reporter=spec',
];

const result = spawnSync(process.execPath, args, {
  cwd: new URL('..', import.meta.url),
  stdio: 'inherit',
});

if (result.error) throw result.error;
if (result.signal) throw new Error(`Coverage process terminated by ${result.signal}`);
process.exitCode = result.status ?? 1;
