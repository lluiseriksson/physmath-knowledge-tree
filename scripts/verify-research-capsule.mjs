import { createHash, webcrypto } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { capsuleArtifactPlan, verifyResearchCapsule } from '../src/lib/research-capsule.js';

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const HELP = `Verify a research capsule and, optionally, its repository-relative artifact files.

Robust npm form:
  npm run capsule:verify -- -- --capsule-file capsule.json --artifact-root .

Options:
  --capsule-file <path>      Required capsule JSON.
  --artifact-root <path>     Root for artifact verification (default repository root).
  --metadata-only            Verify JSON fingerprints only; do not read artifact files.
  --allow-missing            Report missing artifact files without failing.
  --help                     Show this help.
`;

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
function fail(message) { throw new Error(message); }
function parseArgs(argv) {
  const args = [...argv];
  while (args[0] === '--') args.shift();
  const options = { metadataOnly: false, allowMissing: false };
  const take = (index, name) => {
    const value = args[index + 1];
    if (value === undefined || value === '--') fail(`${name} requires a value`);
    return value;
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--metadata-only') options.metadataOnly = true;
    else if (argument === '--allow-missing') options.allowMissing = true;
    else if (argument === '--capsule-file') { options.capsuleFile = take(index, argument); index += 1; }
    else if (argument === '--artifact-root') { options.artifactRoot = take(index, argument); index += 1; }
    else fail(`Unknown option: ${argument}`);
  }
  if (!options.help && !options.capsuleFile) fail('--capsule-file is required');
  return options;
}

function resolveWithin(root, value, label) {
  const absolute = resolve(root, String(value));
  const rel = relative(root, absolute);
  if (rel.startsWith('..') || isAbsolute(rel)) fail(`${label} escapes its root`);
  let current = root;
  for (const segment of rel.split(/[\\/]/u).filter(Boolean)) {
    current = join(current, segment);
    if (!existsSync(current)) break;
    if (lstatSync(current).isSymbolicLink()) fail(`${label} traverses a symbolic link`);
  }
  return absolute;
}

const options = parseArgs(process.argv.slice(2));
if (options.help) {
  process.stdout.write(HELP);
} else {
  const capsulePath = resolveWithin(repositoryRoot, options.capsuleFile, 'Capsule file');
  if (!existsSync(capsulePath) || !statSync(capsulePath).isFile()) fail(`Capsule file does not exist: ${options.capsuleFile}`);
  const capsule = await verifyResearchCapsule(JSON.parse(readFileSync(capsulePath, 'utf8')));
  let checked = 0;
  let missing = 0;
  if (!options.metadataOnly) {
    const artifactRoot = resolveWithin(repositoryRoot, options.artifactRoot ?? '.', 'Artifact root');
    for (const artifact of capsuleArtifactPlan(capsule)) {
      if (!artifact.sha256 || artifact.bytes === null) continue;
      const path = resolveWithin(artifactRoot, artifact.path, `Artifact ${artifact.run_id}:${artifact.path}`);
      if (!existsSync(path)) {
        missing += 1;
        if (!options.allowMissing) fail(`Missing artifact ${artifact.run_id}:${artifact.path}`);
        continue;
      }
      const stat = statSync(path);
      if (!stat.isFile()) fail(`Artifact is not a regular file: ${artifact.path}`);
      const bytes = readFileSync(path);
      const digest = createHash('sha256').update(bytes).digest('hex');
      if (bytes.length !== artifact.bytes) fail(`Artifact byte-count mismatch: ${artifact.run_id}:${artifact.path}`);
      if (digest !== artifact.sha256) fail(`Artifact SHA-256 mismatch: ${artifact.run_id}:${artifact.path}`);
      checked += 1;
    }
  }
  console.log(`Research capsule verified: ${capsule.content_fingerprint}`);
  console.log(`Dossier: ${capsule.dossier.content_fingerprint}; selected runs: ${capsule.execution.selected_run_count}`);
  console.log(options.metadataOnly ? 'Artifact files skipped (metadata-only).' : `Artifacts verified: ${checked}; missing allowed: ${missing}.`);
}
