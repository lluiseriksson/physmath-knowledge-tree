import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateRouteSigningKeyPair } from '../src/lib/route-attestation.js';

export const ROUTE_KEYGEN_USAGE = `Usage:
  npm run route:keygen -- [--output-dir DIR] [--json]

Generates an Ed25519 JWK keypair for route attestations. Existing key files are
never overwritten. The default directory is .route-keys/ (ignored by Git).
`;

/** @param {string[]} argv */
function parseArguments(argv) {
  const options = { help: false, json: false, outputDirectory: '.route-keys' };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--json') options.json = true;
    else if (argument === '--output-dir') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error('--output-dir requires a path');
      options.outputDirectory = value;
      index += 1;
    } else {
      throw new Error(`Unknown route:keygen option: ${argument}`);
    }
  }
  return options;
}

/** @param {string[]} argv */
export async function executeRouteKeygen(argv) {
  const options = parseArguments(argv);
  if (options.help) return { exitCode: 0, output: ROUTE_KEYGEN_USAGE };
  const outputDirectory = resolve(options.outputDirectory);
  const privateKeyPath = join(outputDirectory, 'route-signing.private.jwk.json');
  const publicKeyPath = join(outputDirectory, 'route-signing.public.jwk.json');
  const keys = await generateRouteSigningKeyPair();
  mkdirSync(outputDirectory, { recursive: true });

  let privateWritten = false;
  let publicWritten = false;
  try {
    writeFileSync(
      privateKeyPath,
      `${JSON.stringify(keys.private_key, null, 2)}\n`,
      { flag: 'wx', mode: 0o600 },
    );
    privateWritten = true;
    writeFileSync(
      publicKeyPath,
      `${JSON.stringify(keys.public_key, null, 2)}\n`,
      { flag: 'wx', mode: 0o644 },
    );
    publicWritten = true;
  } catch (error) {
    if (privateWritten) rmSync(privateKeyPath, { force: true });
    if (publicWritten) rmSync(publicKeyPath, { force: true });
    throw error;
  }

  const result = {
    algorithm: keys.algorithm,
    fingerprint: keys.fingerprint,
    private_key: privateKeyPath,
    public_key: publicKeyPath,
  };
  const output = options.json
    ? `${JSON.stringify(result, null, 2)}\n`
    : `Route signing keypair generated.\nFingerprint: ${keys.fingerprint}\nPrivate key: ${privateKeyPath}\nPublic key: ${publicKeyPath}\n`;
  return { exitCode: 0, output, ...result };
}

const invokedAsScript = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  try {
    const result = await executeRouteKeygen(process.argv.slice(2));
    (result.exitCode === 0 ? process.stdout : process.stderr).write(result.output);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  }
}
