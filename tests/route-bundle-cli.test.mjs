import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { executeRouteBundle } from '../scripts/bundle-route.mjs';
import { executeRouteVerification } from '../scripts/verify-route-bundle.mjs';

const nodes = [{ id: 'domain.a' }, { id: 'bridge.b' }, { id: 'problem.c' }];
const edges = [
  { id: 'edge.ab', source: 'domain.a', target: 'bridge.b', relation: 'bridge', confidence: 'formal', mechanism: 'Formal step', references: [] },
  { id: 'edge.bc', source: 'bridge.b', target: 'problem.c', relation: 'uses', confidence: 'literature', mechanism: 'Literature step', references: [] },
];

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'physmath-route-bundle-'));
  mkdirSync(join(root, 'graph/nodes'), { recursive: true });
  writeFileSync(join(root, 'graph/index.json'), JSON.stringify({
    application_version: '2.6.0',
    schema_version: '0.6.0',
    canonical_files: { nodes: 'graph/nodes/core.json', edges: 'graph/edges.json' },
  }));
  writeFileSync(join(root, 'graph/nodes/core.json'), JSON.stringify(nodes));
  writeFileSync(join(root, 'graph/edges.json'), JSON.stringify(edges));
  return root;
}

test('bundle and verification CLIs produce and validate portable JSON', async () => {
  const root = fixture();
  const bundlePath = join(root, 'route.json');
  const result = await executeRouteBundle([
    'domain.a', 'problem.c', '--directed',
    '--nodes', join(root, 'graph/nodes/core.json'),
    '--edges', join(root, 'graph/edges.json'),
    '--output', bundlePath,
  ]);
  assert.equal(result.exitCode, 0);
  assert.equal(result.outputPath, bundlePath);
  const bundle = JSON.parse(readFileSync(bundlePath, 'utf8'));
  assert.deepEqual(bundle.route.nodes, ['domain.a', 'bridge.b', 'problem.c']);

  const verified = await executeRouteVerification([bundlePath, '--json'], root);
  assert.equal(verified.exitCode, 0);
  assert.equal(JSON.parse(verified.output).valid, true);
});

test('CLI helpers expose usage errors and reject comparison bundles', async () => {
  assert.equal((await executeRouteBundle(['--help'])).exitCode, 0);
  assert.equal((await executeRouteBundle([])).exitCode, 2);
  await assert.rejects(() => executeRouteBundle(['domain.a', 'problem.c', '--compare']), /one policy/);
  assert.equal((await executeRouteVerification([], fixture())).exitCode, 2);
  assert.equal((await executeRouteVerification(['--help'], fixture())).exitCode, 0);
});

test('verification CLI rejects tampered files', async () => {
  const root = fixture();
  const bundlePath = join(root, 'route.json');
  await executeRouteBundle([
    'domain.a', 'problem.c',
    '--nodes', join(root, 'graph/nodes/core.json'),
    '--edges', join(root, 'graph/edges.json'),
    '--output', bundlePath,
  ]);
  const bundle = JSON.parse(readFileSync(bundlePath, 'utf8'));
  bundle.request.target = 'bridge.b';
  writeFileSync(bundlePath, JSON.stringify(bundle));
  await assert.rejects(() => executeRouteVerification([bundlePath], root), /payload SHA-256 mismatch/);
});
