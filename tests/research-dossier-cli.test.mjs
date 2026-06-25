import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { verifyResearchDossier } from '../src/lib/research-dossier.js';

const root = new URL('..', import.meta.url);
const NOW = '2026-06-25T16:00:00.000Z';

test('CLI builds deterministic JSON and Markdown from portable local exports', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'physmath-dossier-cli-'));
  try {
    const workspacePath = join(directory, 'workspaces.json');
    const evidencePath = join(directory, 'evidence.json');
    const leanPath = join(directory, 'lean.json');
    const outputPath = join(directory, 'dossier.json');
    const markdownPath = join(directory, 'dossier.md');
    const workspace = {
      application: 'PhysMath Knowledge Tree', schema_version: 1, exported_at: NOW,
      library: {
        schema_version: 1, active_workspace_id: 'workspace.cli', updated_at: NOW,
        workspaces: [{
          id: 'workspace.cli', title: 'CLI dossier', node_ids: ['domain.foundation_logic', 'domain.category_theory'],
          notes: 'Audit the formal substrate.',
          bridge_cards: [{ id: 'card.cli', title: 'CLI bridge', markdown: 'Falsifier: a universe mismatch.', node_ids: ['domain.foundation_logic'], created_at: NOW, updated_at: NOW }],
          negative_results: [], created_at: NOW, updated_at: NOW,
        }],
      },
    };
    const evidence = { application: 'PhysMath Knowledge Tree', schema_version: 1, exported_at: NOW, ledger: { schema_version: 1, updated_at: NOW, reviews: [] } };
    const lean = { application: 'PhysMath Knowledge Tree', schema_version: 1, exported_at: NOW, ledger: { schema_version: 1, updated_at: NOW, records: [] } };
    writeFileSync(workspacePath, `${JSON.stringify(workspace, null, 2)}\n`);
    writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
    writeFileSync(leanPath, `${JSON.stringify(lean, null, 2)}\n`);

    const result = spawnSync(process.execPath, [
      'scripts/build-research-dossier.mjs', '--workspace-file', workspacePath,
      '--evidence-file', evidencePath, '--lean-file', leanPath,
      '--generated-at', NOW, '--output', outputPath, '--markdown-output', markdownPath,
    ], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Research dossier created for workspace\.cli/u);
    const dossier = JSON.parse(readFileSync(outputPath, 'utf8'));
    await assert.doesNotReject(() => verifyResearchDossier(dossier));
    assert.equal(dossier.generated_at, NOW);
    assert.equal(dossier.scope.node_count, 2);
    assert.match(readFileSync(markdownPath, 'utf8'), /^# Research Dossier: CLI dossier/mu);

    const secondPath = join(directory, 'dossier-second.json');
    const second = spawnSync(process.execPath, [
      'scripts/build-research-dossier.mjs', '--', '--workspace-file', workspacePath,
      '--generated-at', NOW, '--output', secondPath,
    ], { cwd: root, encoding: 'utf8' });
    assert.equal(second.status, 0, second.stderr);
    assert.equal(JSON.parse(readFileSync(secondPath, 'utf8')).content_fingerprint, dossier.content_fingerprint);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('CLI help and invalid inputs fail explicitly', () => {
  const help = spawnSync(process.execPath, ['scripts/build-research-dossier.mjs', '--help'], { cwd: root, encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /npm run dossier:build -- -- --workspace-file/u);
  const missing = spawnSync(process.execPath, ['scripts/build-research-dossier.mjs'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /--workspace-file requires a value/u);
});
