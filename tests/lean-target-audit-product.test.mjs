import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import test from 'node:test';
import {
  parseProbeArguments,
  probeHelp,
  selectProbeItemIds,
  runProbeCli,
} from '../scripts/export-lean-target-probe.mjs';
import { normalizeLeanCatalog } from '../src/lib/lean-target-audit.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const page = readFileSync(join(root, 'formalization.html'), 'utf8');
const app = readFileSync(join(root, 'src/formalization-app.js'), 'utf8');
const css = readFileSync(join(root, 'src/formalization.css'), 'utf8');
const cli = readFileSync(join(root, 'scripts/export-lean-target-probe.mjs'), 'utf8');
const docs = readFileSync(join(root, 'docs/LEAN_TARGET_AUDIT.md'), 'utf8');

const nodes = [
  {
    id: 'domain.logic', title: 'Logic', kind: 'domain', confidence: 'literature',
    lean: { imports: ['Mathlib'], declarations: ['Prop'], targets: ['Check a finite theorem.'] },
  },
  {
    id: 'problem.alpha', title: 'Alpha', kind: 'problem', confidence: 'heuristic',
    lean: { imports: ['Mathlib.Data.Finset.Basic'], declarations: ['Finset.card'], targets: [] },
  },
];

test('formalization page has CSP, landmarks, accessible controls and no inline code', () => {
  assert.match(page, /<html\b[^>]*\blang="en"/u);
  assert.match(page, /http-equiv="Content-Security-Policy"/u);
  assert.match(page, /<main\b[^>]*id="lean-audit-center"/u);
  assert.match(page, /class="skip-link"/u);
  assert.match(page, /id="search"[^>]*type="search"[^>]*aria-label=/u);
  assert.match(page, /id="preview-probe"/u);
  assert.match(page, /id="export-ledger"/u);
  assert.match(page, /id="audit-dialog"/u);
  assert.doesNotMatch(page, /<script(?![^>]*\bsrc=)/iu);
  assert.doesNotMatch(page, /<style\b|\sstyle=["']/iu);
});

test('product remains local-first and never writes canonical graph data', () => {
  assert.match(app, /localStorage/u);
  assert.match(app, /\.\/graph\/nodes\/core\.json/u);
  assert.doesNotMatch(app, /fetch\([^)]*,\s*\{[^}]*method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/isu);
  assert.doesNotMatch(app, /innerHTML\s*=/u);
  assert.match(docs, /does not prove|does not certify/iu);
  assert.match(docs, /No account, analytics/u);
});

test('styles expose responsive, focus and reduced-motion behavior', () => {
  assert.match(css, /:focus-visible/u);
  assert.match(css, /@media\s*\(max-width:/u);
  assert.match(css, /prefers-reduced-motion/u);
  assert.match(css, /color-scheme/u);
});

test('CLI argument parser supports bounded node/type filters and output options', () => {
  assert.deepEqual(parseProbeArguments([
    '--node', 'domain.logic', '--node=problem.alpha', '--type', 'declaration',
    '--toolchain', 'v4.31.0', '-o', 'probe.lean',
  ]), {
    nodes: ['domain.logic', 'problem.alpha'],
    types: ['declaration'],
    toolchain: 'v4.31.0',
    output: 'probe.lean',
    ledger: '',
    help: false,
  });
  assert.throws(() => parseProbeArguments(['--type', 'unknown']), /must be one of/u);
  assert.throws(() => parseProbeArguments(['--node']), /requires a node ID/u);
  assert.throws(() => parseProbeArguments(['--output=']), /requires a path/u);
  assert.throws(() => parseProbeArguments(['--ledger=']), /requires a path/u);
  assert.throws(() => parseProbeArguments(['--toolchain=']), /requires text/u);
  assert.match(probeHelp(), /npm run lean:probe/u);
  assert.match(cli, /graph\/nodes\/core\.json/u);
});


test('CLI output is confined to repository-local Lean files', () => {
  const catalog = normalizeLeanCatalog(nodes);
  assert.ok(catalog.items.length > 0);
  assert.match(cli, /must stay inside the repository/u);
  assert.match(cli, /repositoryFile\(root, options\.output, '--output', '\.lean'\)/u);
  assert.match(cli, /repositoryFile\(root, options\.ledger, '--ledger', '\.json'\)/u);
});


test('CLI writes a deterministic bounded probe and rejects escaping output paths', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-lean-probe-cli-'));
  try {
    const graphPath = join(temporary, 'graph/nodes/core.json');
    mkdirSync(dirname(graphPath), { recursive: true });
    writeFileSync(graphPath, `${JSON.stringify(nodes, null, 2)}
`);
    let output = '';
    const result = runProbeCli([
      '--node', 'domain.logic', '--type', 'declaration', '--toolchain', 'v4.31.0',
      '--output', 'generated/Probe.lean',
    ], { root: temporary, stdout: { write(value) { output += value; } } });
    assert.equal(result.selected, 1);
    assert.match(output, /written to/u);
    const first = readFileSync(join(temporary, 'generated/Probe.lean'), 'utf8');
    assert.match(first, /#check Prop/u);
    assert.match(first, /Toolchain note: v4\.31\.0/u);
    runProbeCli([
      '--node', 'domain.logic', '--type', 'declaration', '--toolchain', 'v4.31.0',
      '--output', 'generated/Probe.lean',
    ], { root: temporary, stdout: { write() {} } });
    assert.equal(readFileSync(join(temporary, 'generated/Probe.lean'), 'utf8'), first);
    assert.throws(
      () => runProbeCli(['--output', '../escape.lean'], { root: temporary, stdout: { write() {} } }),
      /must stay inside/u,
    );
    assert.throws(
      () => runProbeCli(['--output', 'generated/probe.txt'], { root: temporary, stdout: { write() {} } }),
      /must end in \.lean/u,
    );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test('CLI applies exported rename records without treating them as canonical edits', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-lean-probe-ledger-'));
  try {
    const graphPath = join(temporary, 'graph/nodes/core.json');
    mkdirSync(dirname(graphPath), { recursive: true });
    writeFileSync(graphPath, `${JSON.stringify(nodes, null, 2)}
`);
    const catalog = normalizeLeanCatalog(nodes);
    const declaration = catalog.items.find((item) => item.node_id === 'domain.logic' && item.item_type === 'declaration');
    const ledgerPath = join(temporary, 'audit.json');
    writeFileSync(ledgerPath, `${JSON.stringify({
      application: 'PhysMath Knowledge Tree',
      schema_version: 1,
      exported_at: '2026-06-25T00:00:00.000Z',
      ledger: {
        schema_version: 1,
        updated_at: '2026-06-25T00:00:00.000Z',
        records: [{
          item_id: declaration.id,
          status: 'renamed',
          checked_at: '2026-06-25T00:00:00.000Z',
          toolchain: 'v4.31.0',
          replacement: 'True',
          notes: 'Replacement fixture.',
          updated_at: '2026-06-25T00:00:00.000Z',
        }],
      },
    }, null, 2)}
`);
    let probe = '';
    runProbeCli([
      '--node', 'domain.logic', '--type', 'declaration', '--ledger', 'audit.json',
    ], { root: temporary, stdout: { write(value) { probe += value; } } });
    assert.match(probe, /Renamed from: Prop/u);
    assert.match(probe, /#check True/u);
    assert.throws(
      () => runProbeCli(['--ledger', '../audit.json'], { root: temporary, stdout: { write() {} } }),
      /must stay inside/u,
    );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});


test('CLI rejects symbolic-link traversal and oversized or non-regular ledger inputs', { skip: process.platform === 'win32' }, () => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-lean-probe-hardening-'));
  const external = mkdtempSync(join(tmpdir(), 'physmath-lean-probe-external-'));
  try {
    const graphPath = join(temporary, 'graph/nodes/core.json');
    mkdirSync(dirname(graphPath), { recursive: true });
    writeFileSync(graphPath, `${JSON.stringify(nodes, null, 2)}
`);
    symlinkSync(external, join(temporary, 'linked'), 'dir');
    assert.throws(
      () => runProbeCli(['--output', 'linked/Probe.lean'], { root: temporary, stdout: { write() {} } }),
      /must not traverse symbolic links/u,
    );
    mkdirSync(join(temporary, 'ledger.json'));
    assert.throws(
      () => runProbeCli(['--ledger', 'ledger.json'], { root: temporary, stdout: { write() {} } }),
      /not a regular file/u,
    );
    writeFileSync(join(temporary, 'large.json'), Buffer.alloc(8_000_001));
    assert.throws(
      () => runProbeCli(['--ledger', 'large.json'], { root: temporary, stdout: { write() {} } }),
      /exceeds the size limit/u,
    );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
});

test('CLI selection is deterministic and rejects filters with no matches', () => {
  const catalog = normalizeLeanCatalog(nodes);
  const selected = selectProbeItemIds(catalog, { nodes: ['domain.logic'], types: ['declaration'] });
  assert.equal(selected.length, 1);
  assert.equal(catalog.items.find(({ id }) => id === selected[0]).value, 'Prop');
  assert.throws(
    () => selectProbeItemIds(catalog, { nodes: ['missing.node'], types: [] }),
    /Unknown canonical node ID/u,
  );
});
