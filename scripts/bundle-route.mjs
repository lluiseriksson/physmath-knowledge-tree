import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRouteBundle } from '../src/lib/route-bundle.js';
import { parseRouteArguments } from './plan-route.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

export const ROUTE_BUNDLE_USAGE = `Usage:
  npm run route:bundle -- <source-id> <target-id> [route options] [--output PATH]

Creates a tamper-evident JSON bundle containing the selected route, evidence
summary, canonical graph digest and payload SHA-256. Route options are shared
with \`npm run route:plan\`; \`--compare\` is not supported for bundles.
`;

/** @param {string[]} argv */
export async function executeRouteBundle(argv) {
  const options = parseRouteArguments(argv);
  if (options.help) return { exitCode: 0, output: ROUTE_BUNDLE_USAGE, outputPath: null };
  if (!options.source || !options.target) return { exitCode: 2, output: ROUTE_BUNDLE_USAGE, outputPath: null };
  if (options.compare) throw new Error('Route bundles represent one policy; remove --compare');
  const nodes = JSON.parse(readFileSync(options.nodesPath, 'utf8'));
  const edges = JSON.parse(readFileSync(options.edgesPath, 'utf8'));
  const index = JSON.parse(readFileSync(resolve(root, 'graph/index.json'), 'utf8'));
  const bundle = await createRouteBundle({
    index,
    nodes,
    edges,
    source: options.source,
    target: options.target,
    options: {
      policy: options.policy,
      directed: options.directed,
      allowedConfidence: options.allowedConfidence,
      maxEdges: options.maxEdges,
      maxStates: options.maxStates,
    },
  });
  const output = `${JSON.stringify(bundle, null, 2)}\n`;
  if (options.outputPath) writeFileSync(options.outputPath, output);
  return { exitCode: 0, output, outputPath: options.outputPath };
}

const invokedAsScript = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  try {
    const result = await executeRouteBundle(process.argv.slice(2));
    if (!result.outputPath || result.exitCode !== 0) {
      (result.exitCode === 0 ? process.stdout : process.stderr).write(result.output);
    } else {
      process.stdout.write(`Route bundle written to ${result.outputPath}\n`);
    }
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  }
}
