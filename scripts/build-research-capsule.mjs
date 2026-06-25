import { webcrypto } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildResearchCapsule, researchCapsuleMarkdown } from '../src/lib/research-capsule.js';
import { importRunPayload, mergeRunLedgers } from '../src/lib/run-ledger.js';

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const HELP = `Build one fingerprinted research capsule from a dossier and run ledgers.

Robust npm form:
  npm run capsule:build -- -- --dossier-file dossier.json --run-file runs.json --output capsule.json

Direct form:
  node scripts/build-research-capsule.mjs --dossier-file dossier.json --run-file runs.json --output capsule.json

Options:
  --dossier-file <path>     Required integrated dossier JSON.
  --run-file <path>         Repeatable run ledger, packet or manifest JSON.
  --run <stable-id>         Repeatable selected run ID; defaults to all scope-linked runs.
  --title <text>            Optional capsule title.
  --output <path>           JSON output (default .run-ledger/capsules/<workspace>.json).
  --markdown <path>         Markdown output (default beside JSON).
  --generated-at <date>     Deterministic ISO-compatible generation time.
  --help                    Show this help.
`;

const root = fileURLToPath(new URL('..', import.meta.url));

function fail(message) { throw new Error(message); }
function parseArgs(argv) {
  const args = [...argv];
  while (args[0] === '--') args.shift();
  const options = { runFiles: [], runIds: [] };
  const take = (index, name) => {
    const value = args[index + 1];
    if (value === undefined || value === '--') fail(`${name} requires a value`);
    return value;
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--dossier-file') { options.dossierFile = take(index, argument); index += 1; }
    else if (argument === '--run-file') { options.runFiles.push(take(index, argument)); index += 1; }
    else if (argument === '--run') { options.runIds.push(take(index, argument)); index += 1; }
    else if (argument === '--title') { options.title = take(index, argument); index += 1; }
    else if (argument === '--output') { options.output = take(index, argument); index += 1; }
    else if (argument === '--markdown') { options.markdown = take(index, argument); index += 1; }
    else if (argument === '--generated-at') { options.generatedAt = take(index, argument); index += 1; }
    else fail(`Unknown option: ${argument}`);
  }
  if (!options.help && !options.dossierFile) fail('--dossier-file is required');
  return options;
}

function normalizedRelative(value, label) {
  const text = String(value ?? '').trim().replaceAll('\\', '/');
  const segments = text.split('/');
  if (!text || isAbsolute(text) || /^[a-z]:\//iu.test(text) || segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    fail(`${label} must be a normalized repository-relative path`);
  }
  return text;
}

function resolveInside(value, label) {
  const rel = normalizedRelative(value, label);
  const absolute = resolve(root, rel);
  const outside = relative(root, absolute);
  if (outside.startsWith('..') || isAbsolute(outside)) fail(`${label} escapes the repository`);
  let current = root;
  for (const segment of rel.split('/')) {
    current = join(current, segment);
    if (!existsSync(current)) break;
    if (lstatSync(current).isSymbolicLink()) fail(`${label} traverses a symbolic link`);
  }
  return { rel, absolute };
}

function readJson(value, label) {
  const { absolute } = resolveInside(value, label);
  if (!existsSync(absolute) || !lstatSync(absolute).isFile()) fail(`${label} does not exist: ${value}`);
  return JSON.parse(readFileSync(absolute, 'utf8'));
}

function atomicWrite(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}-${Date.now()}`;
  try {
    writeFileSync(temporary, content);
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
}

const options = parseArgs(process.argv.slice(2));
if (options.help) {
  process.stdout.write(HELP);
} else {
  const nodes = JSON.parse(readFileSync(join(root, 'graph/nodes/core.json'), 'utf8'));
  if (!Array.isArray(nodes)) fail('graph/nodes/core.json must be an array');
  const validNodeIds = new Set(nodes.filter((node) => node && typeof node.id === 'string').map(({ id }) => id));
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  let ledger = { application: 'PhysMath Knowledge Tree', schema_version: 1, updated_at: generatedAt, runs: [] };
  for (const runFile of options.runFiles) {
    const incoming = importRunPayload(readJson(runFile, 'Run file'), validNodeIds, generatedAt);
    ledger = mergeRunLedgers(ledger, incoming, validNodeIds, generatedAt);
  }
  const dossier = readJson(options.dossierFile, 'Dossier file');
  const capsule = await buildResearchCapsule({
    dossier,
    runLedger: ledger,
    validNodeIds,
    selectedRunIds: options.runIds.length ? options.runIds : undefined,
    generatedAt,
    title: options.title,
  });
  const safeWorkspace = String(capsule.dossier.workspace.id).replace(/[^a-z0-9._-]+/giu, '-');
  const output = resolveInside(options.output ?? `.run-ledger/capsules/${safeWorkspace}.json`, 'Capsule output');
  const markdown = resolveInside(options.markdown ?? output.rel.replace(/\.json$/iu, '.md'), 'Capsule Markdown output');
  atomicWrite(output.absolute, `${JSON.stringify(capsule, null, 2)}\n`);
  atomicWrite(markdown.absolute, `${researchCapsuleMarkdown(capsule)}\n`);
  console.log(`Research capsule written: ${output.rel}`);
  console.log(`Markdown handoff written: ${markdown.rel}`);
  console.log(`Readiness: ${capsule.readiness.overall}; runs: ${capsule.execution.selected_run_count}; fingerprint: ${capsule.content_fingerprint}`);
  if (capsule.readiness.overall === 'blocked') process.exitCode = 2;
}
