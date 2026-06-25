import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import {
  createWriteStream,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  RUN_LEDGER_SCHEMA_VERSION,
  RUN_MANIFEST_KIND,
  withRunFingerprint,
} from '../src/lib/run-ledger.js';

const HELP = `Record one reproducible research run without invoking a shell.

Robust npm form:
  npm run run:record -- -- --id run.example --title "Example" --kind node -- node -e "console.log('ok')"

Direct form:
  node scripts/record-research-run.mjs --id run.example --title "Example" --kind lean -- lake build

Options:
  --id <stable-id>             Required run ID.
  --title <text>               Required human title.
  --kind <kind>                lean|node|python|shell|browser|simulation|symbolic|manual.
  --node <canonical-id>        Repeatable canonical graph node.
  --cwd <relative-path>        Working directory inside the repository.
  --timeout-ms <integer>       Kill the child after this duration (default 600000).
  --artifact-in <path>         Repeatable input file; must exist before execution.
  --artifact-out <path>        Repeatable expected output file.
  --env <NAME>                 Repeatable non-sensitive environment key to record.
  --manifest <path>            Manifest output (default .run-ledger/manifests/<id>.json).
  --logs-dir <path>            Log directory (default .run-ledger/logs/<id>/).
  --notes <text>               Bounded run notes.
  --dry-run                    Emit a planned manifest without executing.
  --no-propagate               Exit zero after recording a failed command.
  --help                       Show this help.

Everything after the final -- is passed as an argument vector with shell:false.
`;

const SENSITIVE = /(?:authorization|cookie|credential|password|secret|token|api[_-]?key)/iu;

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const args = [...argv];
  while (args[0] === '--') args.shift();
  const options = {
    nodes: [], inputs: [], outputs: [], envNames: [], kind: 'manual', cwd: '',
    timeoutMs: 600_000, dryRun: false, noPropagate: false, command: [],
  };
  function take(index, name) {
    const value = args[index + 1];
    if (value === undefined || value === '--') fail(`${name} requires a value`);
    return value;
  }
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--') {
      options.command = args.slice(index + 1);
      break;
    }
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--dry-run') options.dryRun = true;
    else if (argument === '--no-propagate') options.noPropagate = true;
    else if (argument === '--id') { options.id = take(index, '--id'); index += 1; }
    else if (argument === '--title') { options.title = take(index, '--title'); index += 1; }
    else if (argument === '--kind') { options.kind = take(index, '--kind'); index += 1; }
    else if (argument === '--node') { options.nodes.push(take(index, '--node')); index += 1; }
    else if (argument === '--cwd') { options.cwd = take(index, '--cwd'); index += 1; }
    else if (argument === '--timeout-ms') { options.timeoutMs = Number(take(index, '--timeout-ms')); index += 1; }
    else if (argument === '--artifact-in') { options.inputs.push(take(index, '--artifact-in')); index += 1; }
    else if (argument === '--artifact-out') { options.outputs.push(take(index, '--artifact-out')); index += 1; }
    else if (argument === '--env') { options.envNames.push(take(index, '--env')); index += 1; }
    else if (argument === '--manifest') { options.manifest = take(index, '--manifest'); index += 1; }
    else if (argument === '--logs-dir') { options.logsDir = take(index, '--logs-dir'); index += 1; }
    else if (argument === '--notes') { options.notes = take(index, '--notes'); index += 1; }
    else fail(`Unknown option: ${argument}`);
  }
  if (options.help) return options;
  if (!options.id) fail('--id is required');
  if (!options.title) fail('--title is required');
  if (!Number.isSafeInteger(options.timeoutMs) || options.timeoutMs < 1 || options.timeoutMs > 86_400_000) {
    fail('--timeout-ms must be an integer between 1 and 86400000');
  }
  if (!options.dryRun && options.command.length === 0) fail('A command is required after -- unless --dry-run is used');
  return options;
}

function normalizedRelative(value, label, allowEmpty = false) {
  const text = String(value ?? '').trim().replaceAll('\\', '/');
  if (allowEmpty && !text) return '';
  const segments = text.split('/');
  if (!text || isAbsolute(text) || /^[a-z]:\//iu.test(text) || segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    fail(`${label} must be a normalized repository-relative path`);
  }
  return text;
}

function assertNoSymlinkPath(root, absolute, label) {
  const rel = relative(root, absolute);
  if (rel.startsWith('..') || isAbsolute(rel)) fail(`${label} escapes the repository`);
  let current = root;
  for (const segment of rel.split(/[\\/]/u).filter(Boolean)) {
    current = join(current, segment);
    if (!existsSync(current)) break;
    if (lstatSync(current).isSymbolicLink()) fail(`${label} traverses a symbolic link`);
  }
}

function resolveInside(root, value, label, allowEmpty = false) {
  const rel = normalizedRelative(value, label, allowEmpty);
  const absolute = rel ? resolve(root, rel) : root;
  assertNoSymlinkPath(root, absolute, label);
  return { rel, absolute };
}

function sha256File(path) {
  const bytes = readFileSync(path);
  return { sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
}

function artifactFromPath(root, value, role, required) {
  const { rel, absolute } = resolveInside(root, value, `${role} artifact`);
  if (!existsSync(absolute)) {
    if (required) fail(`Missing ${role} artifact: ${rel}`);
    return { role, path: rel, sha256: null, bytes: null, media_type: '' };
  }
  const stat = statSync(absolute);
  if (!stat.isFile()) fail(`${role} artifact is not a regular file: ${rel}`);
  const digest = sha256File(absolute);
  return { role, path: rel, ...digest, media_type: '' };
}

function optionalTextFile(root, path) {
  const absolute = join(root, path);
  return existsSync(absolute) && statSync(absolute).isFile() ? readFileSync(absolute, 'utf8').trim() : '';
}

function gitHead(root) {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  return result.status === 0 ? result.stdout.trim() : '';
}

function packageVersion(root) {
  try {
    return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version ?? '';
  } catch {
    return '';
  }
}

function loadValidNodeIds(root, requested) {
  const path = join(root, 'graph/nodes/core.json');
  if (!existsSync(path)) return new Set(requested);
  const nodes = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(nodes)) fail('graph/nodes/core.json must be an array');
  const valid = new Set(nodes.filter((node) => node && typeof node.id === 'string').map(({ id }) => id));
  const unknown = requested.filter((id) => !valid.has(id));
  if (unknown.length) fail(`Unknown canonical node IDs: ${unknown.join(', ')}`);
  return valid;
}

function recordedEnvironment(names) {
  const output = {};
  for (const name of names) {
    if (!/^[A-Za-z_][A-Za-z0-9_.-]{0,79}$/u.test(name)) fail(`Invalid environment key: ${name}`);
    if (SENSITIVE.test(name)) fail(`Sensitive environment key cannot be recorded: ${name}`);
    if (process.env[name] !== undefined) output[name] = process.env[name];
  }
  return output;
}

async function execute(command, cwd, stdoutPath, stderrPath, timeoutMs) {
  mkdirSync(dirname(stdoutPath), { recursive: true });
  const stdout = createWriteStream(stdoutPath, { flags: 'wx' });
  const stderr = createWriteStream(stderrPath, { flags: 'wx' });
  const child = spawn(command[0], command.slice(1), { cwd, shell: false, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', (chunk) => { stdout.write(chunk); process.stdout.write(chunk); });
  child.stderr.on('data', (chunk) => { stderr.write(chunk); process.stderr.write(chunk); });
  let timedOut = false;
  let escalation = null;
  const timer = setTimeout(() => {
    timedOut = true;
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
    escalation = setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    }, 1000);
    escalation.unref?.();
  }, timeoutMs);
  const outcome = await new Promise((resolveOutcome) => {
    child.once('error', (error) => resolveOutcome({ code: null, signal: error.code ?? error.name }));
    child.once('close', (code, signal) => resolveOutcome({ code, signal: signal ?? '' }));
  });
  clearTimeout(timer);
  if (escalation) clearTimeout(escalation);
  await Promise.all([
    new Promise((resolveClose) => stdout.end(resolveClose)),
    new Promise((resolveClose) => stderr.end(resolveClose)),
  ]);
  return { ...outcome, timedOut };
}

function writeJsonAtomic(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  try {
    writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
}

export async function main(argv = process.argv.slice(2), root = process.cwd()) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(HELP);
    return 0;
  }
  const validNodeIds = loadValidNodeIds(root, options.nodes);
  const cwd = resolveInside(root, options.cwd, 'Run cwd', true);
  if (!statSync(cwd.absolute).isDirectory()) fail('Run cwd must be a directory');
  const id = options.id;
  const manifest = resolveInside(root, options.manifest ?? `.run-ledger/manifests/${id}.json`, 'Manifest path');
  const logs = resolveInside(root, options.logsDir ?? `.run-ledger/logs/${id}`, 'Logs directory');
  if (existsSync(manifest.absolute)) fail(`Manifest already exists: ${manifest.rel}`);
  if (existsSync(logs.absolute)) fail(`Logs directory already exists: ${logs.rel}`);

  const startedAt = new Date().toISOString();
  const inputArtifacts = options.inputs.map((path) => artifactFromPath(root, path, 'input', true));
  let outcome = { code: null, signal: '', timedOut: false };
  let stdoutRel = '';
  let stderrRel = '';
  if (!options.dryRun) {
    mkdirSync(logs.absolute, { recursive: true });
    stdoutRel = `${logs.rel}/stdout.log`;
    stderrRel = `${logs.rel}/stderr.log`;
    outcome = await execute(
      options.command,
      cwd.absolute,
      join(root, stdoutRel),
      join(root, stderrRel),
      options.timeoutMs,
    );
  }
  const completedAt = options.dryRun ? null : new Date().toISOString();
  const outputArtifacts = options.outputs.map((path) => artifactFromPath(root, path, 'output', false));
  const logArtifacts = options.dryRun ? [] : [
    artifactFromPath(root, stdoutRel, 'log', true),
    artifactFromPath(root, stderrRel, 'log', true),
  ];
  const status = options.dryRun ? 'planned' : outcome.code === 0 && !outcome.timedOut ? 'passed' : 'failed';
  const run = await withRunFingerprint({
    id,
    title: options.title,
    kind: options.kind,
    status,
    node_ids: options.nodes,
    command: options.command,
    cwd: cwd.rel,
    environment: recordedEnvironment(options.envNames),
    provenance: {
      git_commit: gitHead(root),
      package_version: packageVersion(root),
      toolchain: optionalTextFile(root, 'lean-toolchain'),
      platform: process.platform,
      arch: process.arch,
      node_version: process.version,
    },
    started_at: options.dryRun ? null : startedAt,
    completed_at: completedAt,
    exit_code: outcome.code,
    signal: outcome.signal,
    timed_out: outcome.timedOut,
    artifacts: [...inputArtifacts, ...outputArtifacts, ...logArtifacts],
    notes: options.notes ?? '',
    created_at: startedAt,
    updated_at: completedAt ?? startedAt,
  }, validNodeIds, completedAt ?? startedAt);
  const payload = {
    application: 'PhysMath Knowledge Tree',
    kind: RUN_MANIFEST_KIND,
    schema_version: RUN_LEDGER_SCHEMA_VERSION,
    generated_at: completedAt ?? startedAt,
    run,
  };
  writeJsonAtomic(manifest.absolute, payload);
  process.stdout.write(`Run manifest written to ${manifest.rel} (${run.fingerprint}).\n`);
  if (options.dryRun || options.noPropagate) return 0;
  return outcome.code ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then((code) => { process.exitCode = code; }).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
