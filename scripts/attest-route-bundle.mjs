import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { attestRouteBundle } from '../src/lib/route-attestation.js';

const root = fileURLToPath(new URL('..', import.meta.url));

export const ROUTE_ATTEST_USAGE = `Usage:
  npm run route:attest -- <route-bundle.json> --private-key PRIVATE_JWK
    [--output PATH] [--signed-at ISO_DATE]

Verifies the route against the current canonical graph, then creates a signed
Ed25519 attestation wrapper. Without --output, the JSON document is printed.
`;

/** @param {string[]} argv */
function parseArguments(argv) {
  const options = {
    help: false,
    bundlePath: null,
    privateKeyPath: null,
    outputPath: null,
    signedAt: undefined,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else if (['--private-key', '--output', '--signed-at'].includes(argument)) {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value`);
      const property = {
        '--private-key': 'privateKeyPath',
        '--output': 'outputPath',
        '--signed-at': 'signedAt',
      }[argument];
      if (options[property] !== null && options[property] !== undefined) {
        throw new Error(`${argument} may be supplied only once`);
      }
      options[property] = value;
      index += 1;
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown route:attest option: ${argument}`);
    } else if (options.bundlePath === null) {
      options.bundlePath = argument;
    } else {
      throw new Error(`Unexpected route:attest argument: ${argument}`);
    }
  }
  return options;
}

/** @param {string} repositoryRoot */
function canonicalGraph(repositoryRoot) {
  const index = JSON.parse(readFileSync(resolve(repositoryRoot, 'graph/index.json'), 'utf8'));
  const nodes = JSON.parse(readFileSync(resolve(repositoryRoot, index.canonical_files.nodes), 'utf8'));
  const edges = JSON.parse(readFileSync(resolve(repositoryRoot, index.canonical_files.edges), 'utf8'));
  return { index, nodes, edges };
}

/** @param {string[]} argv @param {string} [repositoryRoot] */
export async function executeRouteAttestation(argv, repositoryRoot = root) {
  const options = parseArguments(argv);
  if (options.help) return { exitCode: 0, output: ROUTE_ATTEST_USAGE, outputPath: null };
  if (!options.bundlePath || !options.privateKeyPath) {
    return { exitCode: 2, output: ROUTE_ATTEST_USAGE, outputPath: null };
  }

  const bundlePath = resolve(options.bundlePath);
  const privateKeyPath = resolve(options.privateKeyPath);
  const outputPath = options.outputPath === null ? null : resolve(options.outputPath);
  if (outputPath === bundlePath || outputPath === privateKeyPath) {
    throw new Error('Attestation output must not overwrite the bundle or private key');
  }

  const bundle = JSON.parse(readFileSync(bundlePath, 'utf8'));
  const privateKey = JSON.parse(readFileSync(privateKeyPath, 'utf8'));
  const attestation = await attestRouteBundle(
    bundle,
    canonicalGraph(repositoryRoot),
    privateKey,
    options.signedAt === undefined ? {} : { signedAt: options.signedAt },
  );
  const serialized = `${JSON.stringify(attestation, null, 2)}\n`;
  if (outputPath === null) {
    return { exitCode: 0, output: serialized, outputPath, attestation };
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serialized, { flag: 'wx', mode: 0o644 });
  return {
    exitCode: 0,
    output: `Route attestation written to ${outputPath}\nSigner: ${attestation.signer.fingerprint}\n`,
    outputPath,
    attestation,
  };
}

const invokedAsScript = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  try {
    const result = await executeRouteAttestation(process.argv.slice(2));
    (result.exitCode === 0 ? process.stdout : process.stderr).write(result.output);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  }
}
