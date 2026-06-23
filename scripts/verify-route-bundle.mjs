import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { verifyRouteBundle } from '../src/lib/route-bundle.js';

const root = fileURLToPath(new URL('..', import.meta.url));

export const ROUTE_VERIFY_USAGE = `Usage:
  npm run route:verify -- <route-bundle.json> [--json]

Verifies the bundle SHA-256, canonical graph digest, application/schema versions,
route recalculation and evidence summary against the current repository graph.
`;

/** @param {string[]} argv @param {string} [repositoryRoot] */
export async function executeRouteVerification(argv, repositoryRoot = root) {
  const json = argv.includes('--json');
  const positional = argv.filter((argument) => argument !== '--json');
  if (positional.includes('--help') || positional.includes('-h')) {
    return { exitCode: 0, output: ROUTE_VERIFY_USAGE };
  }
  if (positional.length !== 1) return { exitCode: 2, output: ROUTE_VERIFY_USAGE };
  const bundle = JSON.parse(readFileSync(resolve(positional[0]), 'utf8'));
  const index = JSON.parse(readFileSync(resolve(repositoryRoot, 'graph/index.json'), 'utf8'));
  const nodes = JSON.parse(readFileSync(resolve(repositoryRoot, index.canonical_files.nodes), 'utf8'));
  const edges = JSON.parse(readFileSync(resolve(repositoryRoot, index.canonical_files.edges), 'utf8'));
  const result = await verifyRouteBundle(bundle, { index, nodes, edges });
  const output = json
    ? `${JSON.stringify(result, null, 2)}\n`
    : `Route bundle verified.\nPayload SHA-256: ${result.payload_sha256}\nGraph SHA-256: ${result.graph_sha256}\nEdges: ${result.route.edges.length}\n`;
  return { exitCode: 0, output };
}

const invokedAsScript = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  try {
    const result = await executeRouteVerification(process.argv.slice(2));
    (result.exitCode === 0 ? process.stdout : process.stderr).write(result.output);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  }
}
