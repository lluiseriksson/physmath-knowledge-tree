#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGraphSnapshot, diffGraphSnapshots, normalizeGraphSnapshot } from '../src/lib/change-review.js';
import { buildResearchDossier, researchDossierMarkdown } from '../src/lib/research-dossier.js';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));

function fail(message) { throw new Error(message); }
function readJson(path, label) {
  const absolute = isAbsolute(path) ? path : resolve(path);
  if (!existsSync(absolute)) fail(`${label} does not exist: ${absolute}`);
  try { return JSON.parse(readFileSync(absolute, 'utf8')); }
  catch (error) { fail(`${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`); }
}
function canonicalJson(path) { return JSON.parse(readFileSync(join(repositoryRoot, path), 'utf8')); }
function unwrapLedger(value, field) {
  return value && typeof value === 'object' && !Array.isArray(value) && value[field] ? value[field] : value;
}
function parseArguments(argv) {
  const options = { output: 'physmath-research-dossier.json', markdownOutput: '', generatedAt: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--workspace-file') options.workspaceFile = argv[++index];
    else if (argument === '--workspace') options.workspaceId = argv[++index];
    else if (argument === '--evidence-file') options.evidenceFile = argv[++index];
    else if (argument === '--lean-file') options.leanFile = argv[++index];
    else if (argument === '--changes-file') options.changesFile = argv[++index];
    else if (argument === '--output') options.output = argv[++index];
    else if (argument === '--markdown-output') options.markdownOutput = argv[++index];
    else if (argument === '--generated-at') options.generatedAt = argv[++index];
    else if (argument?.startsWith('-')) fail(`Unknown option: ${argument}`);
    else fail(`Unexpected positional argument: ${argument}`);
  }
  return options;
}
function requireOption(value, name) {
  if (typeof value !== 'string' || !value.trim()) fail(`${name} requires a value`);
  return value;
}
function changeBundle(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (value.kind === 'canonical-change-review-bundle' && Array.isArray(value.changes)) {
    const changes = [];
    const decisions = [];
    for (const entry of value.changes) {
      if (!entry || typeof entry !== 'object' || typeof entry.key !== 'string') continue;
      const { decision, ...change } = entry;
      changes.push(change);
      if (decision && typeof decision === 'object') decisions.push(decision);
    }
    return {
      changes,
      ledger: { decisions },
      baseline_fingerprint: value.baseline_snapshot?.fingerprint ?? '',
      current_fingerprint: value.current_fingerprint ?? '',
    };
  }
  return null;
}
async function localChangeState(value, currentSnapshot) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !value.baseline) return null;
  const baseline = await normalizeGraphSnapshot(value.baseline);
  const changes = diffGraphSnapshots(baseline, currentSnapshot);
  return {
    changes,
    ledger: value.ledger ?? null,
    baseline_fingerprint: baseline.fingerprint,
    current_fingerprint: currentSnapshot.fingerprint,
  };
}
function writeOutput(path, content) {
  const absolute = isAbsolute(path) ? path : resolve(path);
  writeFileSync(absolute, content);
  return absolute;
}
function help() {
  console.log(`PhysMath Knowledge Tree integrated research dossier\n\nUsage:\n  npm run dossier:build -- -- --workspace-file <workspaces.json> [options]\n\nOptions:\n  --workspace <id>            Select a workspace; defaults to the exported active workspace\n  --evidence-file <file>      Optional Evidence Review ledger export\n  --lean-file <file>          Optional Lean Target Audit ledger export\n  --changes-file <file>       Optional Change Review bundle or local-state export\n  --output <file>             JSON output (default: physmath-research-dossier.json)\n  --markdown-output <file>    Optional Markdown handoff output\n  --generated-at <ISO date>   Fixed export time for reproducible generation\n  --help                      Show this help\n\nThe command reads canonical graph files from the repository checkout. It never\nchanges graph data or any browser-local ledger.`);
}

export async function run(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  if (options.help) { help(); return { help: true }; }
  const workspaceFile = requireOption(options.workspaceFile, '--workspace-file');
  requireOption(options.output, '--output');
  if (options.markdownOutput !== '') requireOption(options.markdownOutput, '--markdown-output');
  if (options.generatedAt && Number.isNaN(Date.parse(options.generatedAt))) fail('--generated-at must be an ISO-compatible date');

  const index = canonicalJson('graph/index.json');
  const nodes = canonicalJson('graph/nodes/core.json');
  const edges = canonicalJson('graph/edges.json');
  const moves = canonicalJson('graph/research_moves.json');
  const collections = canonicalJson('graph/collections.json');
  const referenceRegistry = canonicalJson('graph/reference-registry.json');
  const workspaceParsed = readJson(workspaceFile, 'Workspace export');
  const workspaceLibrary = unwrapLedger(workspaceParsed, 'library');
  const evidenceLedger = options.evidenceFile ? unwrapLedger(readJson(options.evidenceFile, 'Evidence review export'), 'ledger') : undefined;
  const leanLedger = options.leanFile ? unwrapLedger(readJson(options.leanFile, 'Lean audit export'), 'ledger') : undefined;
  const currentSnapshot = await createGraphSnapshot({ index, nodes, edges, research_moves: moves, collections });
  let changeReview = null;
  if (options.changesFile) {
    const parsedChanges = readJson(options.changesFile, 'Change review export');
    changeReview = changeBundle(parsedChanges) ?? await localChangeState(parsedChanges, currentSnapshot);
    if (!changeReview) fail('Change review export must be a review bundle or local change-review state');
  }
  const dossier = await buildResearchDossier({
    index, nodes, edges, referenceRegistry, workspaceLibrary, workspaceId: options.workspaceId,
    evidenceLedger, leanLedger, changeReview,
    generatedAt: options.generatedAt || new Date().toISOString(),
  });
  const output = writeOutput(options.output, `${JSON.stringify(dossier, null, 2)}\n`);
  const markdownOutput = options.markdownOutput
    ? writeOutput(options.markdownOutput, researchDossierMarkdown(dossier))
    : null;
  console.log(`Research dossier created for ${dossier.workspace.id}.`);
  console.log(`JSON: ${output}`);
  if (markdownOutput) console.log(`Markdown: ${markdownOutput}`);
  console.log(`SHA-256 content fingerprint: ${dossier.content_fingerprint}`);
  return { dossier, output, markdownOutput };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
