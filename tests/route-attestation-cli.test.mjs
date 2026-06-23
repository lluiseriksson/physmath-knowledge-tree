import test from 'node:test';
import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRouteBundle } from '../src/lib/route-bundle.js';
import { executeRouteAttestation } from '../scripts/attest-route-bundle.mjs';
import { executeRouteKeygen } from '../scripts/generate-route-key.mjs';
import { executeRouteVerification } from '../scripts/verify-route-bundle.mjs';

const nodes = [{ id: 'domain.a' }, { id: 'bridge.b' }, { id: 'problem.c' }];
const edges = [
  {
    id: 'edge.ab', source: 'domain.a', target: 'bridge.b', relation: 'bridge',
    confidence: 'formal', mechanism: 'Formal step', references: [],
  },
  {
    id: 'edge.bc', source: 'bridge.b', target: 'problem.c', relation: 'uses',
    confidence: 'literature', mechanism: 'Literature step', references: [],
  },
];

async function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'physmath-route-attestation-'));
  mkdirSync(join(root, 'graph/nodes'), { recursive: true });
  const index = {
    application_version: '2.6.0',
    schema_version: '0.6.0',
    canonical_files: { nodes: 'graph/nodes/core.json', edges: 'graph/edges.json' },
  };
  writeFileSync(join(root, 'graph/index.json'), JSON.stringify(index));
  writeFileSync(join(root, 'graph/nodes/core.json'), JSON.stringify(nodes));
  writeFileSync(join(root, 'graph/edges.json'), JSON.stringify(edges));
  const bundle = await createRouteBundle({
    index,
    nodes,
    edges,
    source: 'domain.a',
    target: 'problem.c',
    options: { directed: true },
    createdAt: '2026-06-23T12:00:00.000Z',
  });
  const bundlePath = join(root, 'route.json');
  writeFileSync(bundlePath, `${JSON.stringify(bundle, null, 2)}\n`);
  return { root, bundlePath };
}

test('keygen, attestation and trust-pinned verification complete a CLI round trip', async () => {
  const { root, bundlePath } = await fixture();
  const keyDirectory = join(root, 'keys');
  const keygen = await executeRouteKeygen(['--output-dir', keyDirectory, '--json']);
  assert.equal(keygen.exitCode, 0);
  assert.equal(JSON.parse(keygen.output).fingerprint, keygen.fingerprint);
  if (process.platform !== 'win32') {
    assert.equal(statSync(keygen.private_key).mode & 0o777, 0o600);
    assert.equal(statSync(keygen.public_key).mode & 0o777, 0o644);
  }

  const attestationPath = join(root, 'route.attestation.json');
  const attested = await executeRouteAttestation([
    bundlePath,
    '--private-key', keygen.private_key,
    '--signed-at', '2026-06-23T13:00:00Z',
    '--output', attestationPath,
  ], root);
  assert.equal(attested.exitCode, 0);
  assert.equal(attested.outputPath, attestationPath);
  assert.match(attested.output, /Signer: sha256:/u);

  const untrusted = await executeRouteVerification([attestationPath], root);
  assert.match(untrusted.output, /Signed route attestation verified/u);
  assert.match(untrusted.output, /Trust: untrusted/u);

  const trusted = await executeRouteVerification([
    attestationPath,
    '--trust-key', keygen.public_key,
    '--require-signed',
    '--require-trusted',
    '--json',
  ], root);
  const result = JSON.parse(trusted.output);
  assert.equal(result.valid, true);
  assert.equal(result.attestation.valid, true);
  assert.equal(result.attestation.trusted, true);
  assert.equal(result.attestation.fingerprint, keygen.fingerprint);

  const fingerprintPinned = await executeRouteVerification([
    attestationPath,
    '--trust-fingerprint', keygen.fingerprint,
    '--trust-fingerprint', keygen.fingerprint,
    '--require-trusted',
    '--json',
  ], root);
  assert.equal(JSON.parse(fingerprintPinned.output).attestation.trusted, true);
});

test('unsigned verification remains compatible but supports strict signature policy', async () => {
  const { root, bundlePath } = await fixture();
  const text = await executeRouteVerification([bundlePath], root);
  assert.match(text.output, /Route bundle verified/u);
  assert.doesNotMatch(text.output, /Signature:/u);
  const json = await executeRouteVerification([bundlePath, '--json'], root);
  assert.equal(JSON.parse(json.output).attestation, null);
  await assert.rejects(
    () => executeRouteVerification([bundlePath, '--require-signed'], root),
    /signed route attestation is required/u,
  );
  await assert.rejects(
    () => executeRouteVerification([bundlePath, '--require-trusted'], root),
    /signed route attestation is required/u,
  );
});

test('attestation can stream JSON and refuses unsafe output targets', async () => {
  const { root, bundlePath } = await fixture();
  const keygen = await executeRouteKeygen(['--output-dir', join(root, 'keys')]);
  assert.match(keygen.output, /Route signing keypair generated/u);

  const streamed = await executeRouteAttestation([
    bundlePath,
    '--private-key', keygen.private_key,
    '--signed-at', '2026-06-23T13:00:00.000Z',
  ], root);
  assert.equal(streamed.outputPath, null);
  assert.equal(JSON.parse(streamed.output).kind, 'evidence-route-attestation');

  await assert.rejects(
    () => executeRouteAttestation([
      bundlePath, '--private-key', keygen.private_key, '--output', bundlePath,
    ], root),
    /must not overwrite/u,
  );
  await assert.rejects(
    () => executeRouteAttestation([
      bundlePath, '--private-key', keygen.private_key, '--output', keygen.private_key,
    ], root),
    /must not overwrite/u,
  );

  const occupiedPath = join(root, 'occupied-attestation.json');
  writeFileSync(occupiedPath, 'keep me');
  await assert.rejects(
    () => executeRouteAttestation([
      bundlePath, '--private-key', keygen.private_key, '--output', occupiedPath,
    ], root),
    /EEXIST/u,
  );
  assert.equal(readFileSync(occupiedPath, 'utf8'), 'keep me');

  const tampered = JSON.parse(readFileSync(bundlePath, 'utf8'));
  tampered.request.target = 'bridge.b';
  const tamperedPath = join(root, 'tampered.json');
  writeFileSync(tamperedPath, JSON.stringify(tampered));
  await assert.rejects(
    () => executeRouteAttestation([tamperedPath, '--private-key', keygen.private_key], root),
    /payload SHA-256 mismatch/u,
  );
});

test('key generation never overwrites files and rolls back a partial pair', async () => {
  const firstRoot = mkdtempSync(join(tmpdir(), 'physmath-route-key-existing-'));
  const first = await executeRouteKeygen(['--output-dir', firstRoot]);
  const privateBefore = readFileSync(first.private_key, 'utf8');
  const publicBefore = readFileSync(first.public_key, 'utf8');
  await assert.rejects(() => executeRouteKeygen(['--output-dir', firstRoot]), /EEXIST/u);
  assert.equal(readFileSync(first.private_key, 'utf8'), privateBefore);
  assert.equal(readFileSync(first.public_key, 'utf8'), publicBefore);

  const partialRoot = mkdtempSync(join(tmpdir(), 'physmath-route-key-partial-'));
  const publicPath = join(partialRoot, 'route-signing.public.jwk.json');
  const privatePath = join(partialRoot, 'route-signing.private.jwk.json');
  writeFileSync(publicPath, 'occupied');
  await assert.rejects(() => executeRouteKeygen(['--output-dir', partialRoot]), /EEXIST/u);
  assert.equal(existsSync(privatePath), false);
  assert.equal(readFileSync(publicPath, 'utf8'), 'occupied');
});

test('CLI helpers expose usage and reject malformed argument combinations', async () => {
  const { root, bundlePath } = await fixture();
  assert.equal((await executeRouteKeygen(['--help'])).exitCode, 0);
  await assert.rejects(() => executeRouteKeygen(['--unknown']), /Unknown route:keygen/u);
  await assert.rejects(() => executeRouteKeygen(['--output-dir']), /requires a path/u);

  assert.equal((await executeRouteAttestation(['--help'], root)).exitCode, 0);
  assert.equal((await executeRouteAttestation([], root)).exitCode, 2);
  await assert.rejects(() => executeRouteAttestation(['--unknown'], root), /Unknown route:attest/u);
  await assert.rejects(() => executeRouteAttestation([bundlePath, 'extra'], root), /Unexpected/u);
  await assert.rejects(
    () => executeRouteAttestation([bundlePath, '--private-key'], root),
    /requires a value/u,
  );
  await assert.rejects(
    () => executeRouteAttestation([
      bundlePath, '--private-key', 'a', '--private-key', 'b',
    ], root),
    /only once/u,
  );

  assert.equal((await executeRouteVerification(['--help'], root)).exitCode, 0);
  assert.equal((await executeRouteVerification([], root)).exitCode, 2);
  await assert.rejects(() => executeRouteVerification(['--unknown'], root), /Unknown route:verify/u);
  await assert.rejects(() => executeRouteVerification([bundlePath, 'extra'], root), /Unexpected/u);
  await assert.rejects(
    () => executeRouteVerification([bundlePath, '--trust-key'], root),
    /requires a value/u,
  );
});

test('trusted verification rejects wrong keys, malformed pins and signature tampering', async () => {
  const { root, bundlePath } = await fixture();
  const signer = await executeRouteKeygen(['--output-dir', join(root, 'signer')]);
  const other = await executeRouteKeygen(['--output-dir', join(root, 'other')]);
  const attestationPath = join(root, 'attestation.json');
  await executeRouteAttestation([
    bundlePath,
    '--private-key', signer.private_key,
    '--signed-at', '2026-06-23T13:00:00.000Z',
    '--output', attestationPath,
  ], root);

  await assert.rejects(
    () => executeRouteVerification([
      attestationPath, '--trust-key', other.public_key, '--require-trusted',
    ], root),
    /not trusted/u,
  );
  await assert.rejects(
    () => executeRouteVerification([
      attestationPath, '--trust-fingerprint', 'bad', '--require-trusted',
    ], root),
    /Invalid trusted/u,
  );

  await assert.rejects(
    () => executeRouteVerification([attestationPath, '--trust-key', signer.private_key], root),
    /public JWK; private key material/u,
  );

  const malformedKey = join(root, 'malformed-public.json');
  writeFileSync(malformedKey, JSON.stringify({ kty: 'RSA' }));
  await assert.rejects(
    () => executeRouteVerification([attestationPath, '--trust-key', malformedKey], root),
    /Ed25519 OKP/u,
  );

  const tampered = JSON.parse(readFileSync(attestationPath, 'utf8'));
  tampered.bundle.route.nodes[1] = 'domain.a';
  const tamperedPath = join(root, 'tampered-attestation.json');
  writeFileSync(tamperedPath, JSON.stringify(tampered));
  await assert.rejects(
    () => executeRouteVerification([tamperedPath], root),
    /signature mismatch/u,
  );
});
