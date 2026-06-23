import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  fingerprintRoutePublicKey,
  verifyRouteArtifact,
} from '../src/lib/route-attestation.js';

const root = fileURLToPath(new URL('..', import.meta.url));

export const ROUTE_VERIFY_USAGE = `Usage:
  npm run route:verify -- <route-bundle-or-attestation.json> [--json]
    [--trust-key PUBLIC_JWK] [--trust-fingerprint SHA256]
    [--require-signed] [--require-trusted]

Verifies route integrity and canonical recalculation. Signed wrappers also receive
Ed25519 verification. Trust is explicit: embedded public keys are not identities.
`;

/** @param {string[]} argv */
function parseArguments(argv) {
  const options = {
    help: false,
    json: false,
    requireSigned: false,
    requireTrusted: false,
    inputPath: null,
    trustKeyPaths: [],
    trustFingerprints: [],
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--json') options.json = true;
    else if (argument === '--require-signed') options.requireSigned = true;
    else if (argument === '--require-trusted') options.requireTrusted = true;
    else if (argument === '--trust-key' || argument === '--trust-fingerprint') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value`);
      if (argument === '--trust-key') options.trustKeyPaths.push(resolve(value));
      else options.trustFingerprints.push(value);
      index += 1;
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown route:verify option: ${argument}`);
    } else if (options.inputPath === null) {
      options.inputPath = resolve(argument);
    } else {
      throw new Error(`Unexpected route:verify argument: ${argument}`);
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

/** @param {string[]} paths @param {string[]} explicit */
async function trustedFingerprints(paths, explicit) {
  const fingerprints = [...explicit];
  for (const path of paths) {
    const key = JSON.parse(readFileSync(path, 'utf8'));
    if (key && typeof key === 'object' && Object.hasOwn(key, 'd')) {
      throw new Error('--trust-key requires a public JWK; private key material was supplied');
    }
    fingerprints.push(await fingerprintRoutePublicKey(key));
  }
  return [...new Set(fingerprints)];
}

/** @param {Record<string, any>} result */
function renderText(result) {
  const lines = [
    result.attestation ? 'Signed route attestation verified.' : 'Route bundle verified.',
    `Payload SHA-256: ${result.payload_sha256}`,
    `Graph SHA-256: ${result.graph_sha256}`,
    `Edges: ${result.route.edges.length}`,
  ];
  if (result.attestation) {
    lines.push(`Signature: ${result.attestation.algorithm} valid`);
    lines.push(`Signer: ${result.attestation.fingerprint}`);
    lines.push(`Trust: ${result.attestation.trusted ? 'trusted' : 'untrusted'}`);
  }
  return `${lines.join('\n')}\n`;
}

/** @param {string[]} argv @param {string} [repositoryRoot] */
export async function executeRouteVerification(argv, repositoryRoot = root) {
  const options = parseArguments(argv);
  if (options.help) return { exitCode: 0, output: ROUTE_VERIFY_USAGE };
  if (!options.inputPath) return { exitCode: 2, output: ROUTE_VERIFY_USAGE };
  const input = JSON.parse(readFileSync(options.inputPath, 'utf8'));
  const trusted = await trustedFingerprints(options.trustKeyPaths, options.trustFingerprints);
  const result = await verifyRouteArtifact(input, canonicalGraph(repositoryRoot), {
    trustedFingerprints: trusted,
    requireSigned: options.requireSigned,
    requireTrusted: options.requireTrusted,
  });
  return {
    exitCode: 0,
    output: options.json ? `${JSON.stringify(result, null, 2)}\n` : renderText(result),
  };
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
