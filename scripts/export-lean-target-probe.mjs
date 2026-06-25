#!/usr/bin/env node
import { existsSync, lstatSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  LEAN_ITEM_TYPES,
  MAX_LEAN_AUDIT_IMPORT_BYTES,
  buildLeanProbe,
  createLeanAuditLedger,
  importLeanAuditLedger,
  normalizeLeanCatalog,
} from '../src/lib/lean-target-audit.js';

const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));

export function parseProbeArguments(argv) {
  const options = { nodes: [], types: [], output: '', ledger: '', toolchain: '', help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--node') options.nodes.push(argv[++index] ?? '');
    else if (argument.startsWith('--node=')) options.nodes.push(argument.slice('--node='.length));
    else if (argument === '--type') options.types.push(argv[++index] ?? '');
    else if (argument.startsWith('--type=')) options.types.push(argument.slice('--type='.length));
    else if (argument === '--output' || argument === '-o') options.output = argv[++index] ?? '';
    else if (argument.startsWith('--output=')) options.output = argument.slice('--output='.length);
    else if (argument === '--ledger') options.ledger = argv[++index] ?? '';
    else if (argument.startsWith('--ledger=')) options.ledger = argument.slice('--ledger='.length);
    else if (argument === '--toolchain') options.toolchain = argv[++index] ?? '';
    else if (argument.startsWith('--toolchain=')) options.toolchain = argument.slice('--toolchain='.length);
    else throw new Error(`Unknown Lean probe argument: ${argument}`);
  }
  if (options.nodes.some((value) => !value)) throw new Error('--node requires a node ID');
  if (options.types.some((value) => !LEAN_ITEM_TYPES.includes(value))) {
    throw new Error(`--type must be one of: ${LEAN_ITEM_TYPES.join(', ')}`);
  }
  const outputRequested = argv.some((argument) => argument === '--output' || argument === '-o' || argument.startsWith('--output='));
  const ledgerRequested = argv.some((argument) => argument === '--ledger' || argument.startsWith('--ledger='));
  const toolchainRequested = argv.some((argument) => argument === '--toolchain' || argument.startsWith('--toolchain='));
  if (outputRequested && !options.output) throw new Error('--output requires a path');
  if (ledgerRequested && !options.ledger) throw new Error('--ledger requires a path');
  if (toolchainRequested && !options.toolchain) throw new Error('--toolchain requires text');
  options.nodes = [...new Set(options.nodes)];
  options.types = [...new Set(options.types)];
  return options;
}

export function probeHelp() {
  return `Usage: npm run lean:probe -- -- [options]\n` +
    `       node scripts/export-lean-target-probe.mjs [options]\n\n` +
    `Options:\n` +
    `  --node <id>         Include one canonical node; repeatable.\n` +
    `  --type <type>       Include import, declaration or target; repeatable.\n` +
    `  --output, -o <path> Write the Lean probe to a file instead of stdout.\n` +
    `  --ledger <path>     Apply an exported local audit ledger (renames/blocks).\n` +
    `  --toolchain <text>  Add a non-authoritative toolchain note to the header.\n` +
    `  --help, -h          Show this help.\n\n` +
    `The generated #check file audits names and imports only. It does not prove graph claims.\n`;
}

export function selectProbeItemIds(catalog, options) {
  const nodeIds = new Set(catalog.nodes.map(({ id }) => id));
  const unknown = options.nodes.filter((id) => !nodeIds.has(id));
  if (unknown.length > 0) throw new Error(`Unknown canonical node ID: ${unknown.join(', ')}`);
  const nodeFilter = new Set(options.nodes);
  const typeFilter = new Set(options.types);
  const selected = catalog.items.filter((item) =>
    (nodeFilter.size === 0 || nodeFilter.has(item.node_id))
    && (typeFilter.size === 0 || typeFilter.has(item.item_type)));
  if (selected.length === 0) throw new Error('Lean probe filters selected no audit items');
  return selected.map(({ id }) => id);
}

function repositoryFile(root, value, label, extension) {
  if (isAbsolute(value)) throw new Error(`${label} must be repository-relative`);
  const output = resolve(root, value);
  const outputRelative = relative(root, output);
  if (!outputRelative || outputRelative.startsWith('..') || isAbsolute(outputRelative)) {
    throw new Error(`${label} must stay inside the repository`);
  }
  if (extension && !output.toLowerCase().endsWith(extension)) throw new Error(`${label} must end in ${extension}`);
  let cursor = root;
  for (const segment of outputRelative.split(/[\\/]/u)) {
    cursor = join(cursor, segment);
    if (existsSync(cursor) && lstatSync(cursor).isSymbolicLink()) {
      throw new Error(`${label} must not traverse symbolic links`);
    }
  }
  return output;
}

export function runProbeCli(argv = process.argv.slice(2), runtime = {}) {
  const root = resolve(runtime.root ?? REPOSITORY_ROOT);
  const stdout = runtime.stdout ?? process.stdout;
  const options = parseProbeArguments(argv);
  if (options.help) {
    stdout.write(probeHelp());
    return { help: true, selected: 0, output: null };
  }
  const nodesPath = join(root, 'graph/nodes/core.json');
  if (!existsSync(nodesPath)) throw new Error(`Missing canonical graph nodes: ${nodesPath}`);
  const catalog = normalizeLeanCatalog(JSON.parse(readFileSync(nodesPath, 'utf8')));
  const selectedIds = selectProbeItemIds(catalog, options);
  const validItemIds = new Set(catalog.items.map(({ id }) => id));
  let ledger = createLeanAuditLedger();
  if (options.ledger) {
    const ledgerPath = repositoryFile(root, options.ledger, '--ledger', '.json');
    if (!existsSync(ledgerPath)) throw new Error(`Missing Lean audit ledger: ${ledgerPath}`);
    const ledgerStat = statSync(ledgerPath);
    if (!ledgerStat.isFile()) throw new Error(`Lean audit ledger is not a regular file: ${ledgerPath}`);
    if (ledgerStat.size > MAX_LEAN_AUDIT_IMPORT_BYTES) throw new Error('Lean audit import exceeds the size limit');
    ledger = importLeanAuditLedger(readFileSync(ledgerPath, 'utf8'), validItemIds);
  }
  const probe = buildLeanProbe(catalog, selectedIds, ledger, {
    toolchain: options.toolchain,
  });
  if (options.output) {
    const output = repositoryFile(root, options.output, '--output', '.lean');
    if (existsSync(output) && !lstatSync(output).isFile()) throw new Error(`Lean probe output is not a regular file: ${output}`);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, probe);
    stdout.write(`Lean target probe written to ${output} with ${selectedIds.length} selected audit items.\n`);
    return { help: false, selected: selectedIds.length, output };
  }
  stdout.write(probe);
  return { help: false, selected: selectedIds.length, output: null };
}

const entrypoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === entrypoint) {
  try {
    runProbeCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
