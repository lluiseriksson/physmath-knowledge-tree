import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRouteBundle,
  sha256Hex,
  stableStringify,
} from '../src/lib/route-bundle.js';
import {
  ROUTE_ATTESTATION_ALGORITHM,
  ROUTE_ATTESTATION_KIND,
  ROUTE_ATTESTATION_SCHEMA_VERSION,
  attestRouteBundle,
  canonicalRoutePrivateKey,
  canonicalRoutePublicKey,
  decodeBase64Url,
  encodeBase64Url,
  fingerprintRoutePublicKey,
  generateRouteSigningKeyPair,
  isRouteAttestation,
  verifyRouteArtifact,
  verifyRouteAttestation,
} from '../src/lib/route-attestation.js';

const index = { application_version: '2.6.0', schema_version: '0.6.0' };
const nodes = [{ id: 'domain.a' }, { id: 'bridge.b' }, { id: 'problem.c' }];
const edges = [
  {
    id: 'edge.ab', source: 'domain.a', target: 'bridge.b', relation: 'bridge', confidence: 'formal',
    mechanism: 'A formal bridge.', references: [{ label: 'A', url: 'https://example.test/a', type: 'paper', scope: 'claim' }],
  },
  {
    id: 'edge.bc', source: 'bridge.b', target: 'problem.c', relation: 'uses', confidence: 'literature',
    mechanism: 'A literature bridge.', references: [{ label: 'B', url: 'https://example.test/b', type: 'paper', scope: 'context' }],
  },
];
const canonical = { index, nodes, edges };
const createdAt = '2026-06-23T12:00:00.000Z';
const signedAt = '2026-06-23T13:00:00.000Z';

async function routeBundle() {
  return createRouteBundle({
    index,
    nodes,
    edges,
    source: 'domain.a',
    target: 'problem.c',
    options: { directed: true },
    createdAt,
  });
}

async function resign(document, privateKey) {
  const clone = structuredClone(document);
  delete clone.signature;
  const key = await crypto.subtle.importKey(
    'jwk',
    { ...privateKey, ext: true, key_ops: ['sign'] },
    { name: 'Ed25519' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    { name: 'Ed25519' },
    key,
    new TextEncoder().encode(stableStringify(clone)),
  );
  return {
    ...clone,
    signature: { encoding: 'base64url', value: encodeBase64Url(new Uint8Array(signature)) },
  };
}

async function recomputeBundleIntegrity(bundle) {
  const clone = structuredClone(bundle);
  const { integrity: _integrity, ...payload } = clone;
  clone.integrity.payload_sha256 = await sha256Hex(stableStringify(payload));
  return clone;
}

test('base64url helpers round-trip canonical bytes and reject malformed inputs', () => {
  const bytes = Uint8Array.from([0, 1, 2, 253, 254, 255]);
  const encoded = encodeBase64Url(bytes);
  assert.equal(encoded, 'AAEC_f7_');
  assert.deepEqual(decodeBase64Url(encoded), bytes);
  assert.throws(() => encodeBase64Url([]), /must be bytes/);
  assert.throws(() => decodeBase64Url('A'), /canonical/);
  assert.throws(() => decodeBase64Url('a=b'), /canonical/);
  assert.throws(() => decodeBase64Url('AB'), /canonical/);

  const btoaDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'btoa');
  Object.defineProperty(globalThis, 'btoa', { configurable: true, value: undefined });
  try {
    assert.throws(() => encodeBase64Url(bytes), /encoding is unavailable/);
  } finally {
    Object.defineProperty(globalThis, 'btoa', btoaDescriptor);
  }

  const atobDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'atob');
  Object.defineProperty(globalThis, 'atob', { configurable: true, value: undefined });
  try {
    assert.throws(() => decodeBase64Url(encoded), /decoding is unavailable/);
  } finally {
    Object.defineProperty(globalThis, 'atob', atobDescriptor);
  }

  Object.defineProperty(globalThis, 'atob', { configurable: true, value: () => { throw new Error('bad'); } });
  try {
    assert.throws(() => decodeBase64Url('AA'), /not valid/);
  } finally {
    Object.defineProperty(globalThis, 'atob', atobDescriptor);
  }
});

test('generated Ed25519 keys have canonical projections and stable fingerprints', async () => {
  const generated = await generateRouteSigningKeyPair();
  assert.equal(generated.algorithm, ROUTE_ATTESTATION_ALGORITHM);
  assert.match(generated.fingerprint, /^sha256:[a-f0-9]{64}$/u);
  assert.deepEqual(canonicalRoutePublicKey({ ...generated.public_key, ignored: true }), generated.public_key);
  assert.deepEqual(canonicalRoutePrivateKey({ ...generated.private_key, ignored: true }), generated.private_key);
  assert.equal(await fingerprintRoutePublicKey(generated.private_key), generated.fingerprint);
  assert.equal(decodeBase64Url(generated.public_key.x).length, 32);
  assert.equal(decodeBase64Url(generated.private_key.d).length, 32);

  assert.throws(() => canonicalRoutePublicKey(null), /Ed25519 OKP/);
  assert.throws(() => canonicalRoutePublicKey({ kty: 'RSA', crv: 'Ed25519', x: 'AA' }), /Ed25519 OKP/);
  assert.throws(() => canonicalRoutePublicKey({ kty: 'OKP', crv: 'Ed25519', x: 'AA' }), /32 bytes/);
  assert.throws(() => canonicalRoutePrivateKey(generated.public_key), /private key d/);
  assert.throws(() => canonicalRoutePrivateKey({ ...generated.public_key, d: 'AA' }), /32 bytes/);
});

test('route attestations round-trip and distinguish cryptographic validity from trust', async () => {
  const bundle = await routeBundle();
  const key = await generateRouteSigningKeyPair();
  const attestation = await attestRouteBundle(bundle, canonical, key.private_key, { signedAt });
  const repeated = await attestRouteBundle(bundle, canonical, key.private_key, { signedAt });
  assert.equal(stableStringify(repeated), stableStringify(attestation));
  bundle.route.nodes[0] = 'mutated-after-signing';
  assert.equal(attestation.bundle.route.nodes[0], 'domain.a');
  assert.equal(attestation.kind, ROUTE_ATTESTATION_KIND);
  assert.equal(attestation.schema_version, ROUTE_ATTESTATION_SCHEMA_VERSION);
  assert.equal(attestation.signer.signed_at, signedAt);
  assert.equal(attestation.signer.fingerprint, key.fingerprint);
  assert.equal(isRouteAttestation(attestation), true);
  assert.equal(isRouteAttestation(bundle), false);
  const nullPrototype = Object.assign(Object.create(null), {
    application: attestation.application,
    kind: attestation.kind,
  });
  assert.equal(isRouteAttestation(nullPrototype), true);

  const untrusted = await verifyRouteAttestation(attestation, canonical);
  assert.equal(untrusted.valid, true);
  assert.equal(untrusted.artifact_kind, ROUTE_ATTESTATION_KIND);
  assert.equal(untrusted.attestation.valid, true);
  assert.equal(untrusted.attestation.trusted, false);

  const trusted = await verifyRouteAttestation(attestation, canonical, {
    trustedFingerprints: [key.fingerprint, key.fingerprint],
    requireTrusted: true,
  });
  assert.equal(trusted.attestation.trusted, true);
  assert.deepEqual(trusted.route.nodes, ['domain.a', 'bridge.b', 'problem.c']);

  const artifact = await verifyRouteArtifact(attestation, canonical, {
    trustedFingerprints: [key.fingerprint],
  });
  assert.equal(artifact.attestation.trusted, true);
});

test('unsigned route artifacts remain compatible unless signed evidence is required', async () => {
  const bundle = await routeBundle();
  await assert.rejects(() => verifyRouteArtifact(bundle, canonical, null), /options must be an object/);
  const verified = await verifyRouteArtifact(bundle, canonical);
  assert.equal(verified.valid, true);
  assert.equal(verified.attestation, null);
  assert.equal(verified.artifact_kind, 'evidence-route-bundle');
  await assert.rejects(() => verifyRouteArtifact(bundle, canonical, { requireSigned: true }), /signed route attestation/);
  await assert.rejects(() => verifyRouteArtifact(bundle, canonical, { requireTrusted: true }), /signed route attestation/);
});

test('verification rejects malformed attestation metadata before route recalculation', async () => {
  const bundle = await routeBundle();
  const key = await generateRouteSigningKeyPair();
  const valid = await attestRouteBundle(bundle, canonical, key.private_key, { signedAt });

  await assert.rejects(() => verifyRouteAttestation(valid, canonical, null), /options must be an object/);
  await assert.rejects(() => verifyRouteAttestation(null, canonical), /Not a PhysMath/);
  await assert.rejects(() => verifyRouteAttestation({ application: valid.application, kind: valid.kind }, canonical), /Unsupported/);

  const incomplete = structuredClone(valid);
  delete incomplete.bundle;
  await assert.rejects(() => verifyRouteAttestation(incomplete, canonical), /structurally incomplete/);

  const wrongBundle = structuredClone(valid);
  wrongBundle.bundle.kind = 'other';
  await assert.rejects(() => verifyRouteAttestation(wrongBundle, canonical), /does not contain/);

  const algorithm = structuredClone(valid);
  algorithm.signer.algorithm = 'RSA-PSS';
  await assert.rejects(() => verifyRouteAttestation(algorithm, canonical), /algorithm is unsupported/);

  const fingerprint = structuredClone(valid);
  fingerprint.signer.fingerprint = `sha256:${'0'.repeat(64)}`;
  await assert.rejects(() => verifyRouteAttestation(fingerprint, canonical), /fingerprint mismatch/);

  const timestamp = structuredClone(valid);
  timestamp.signer.signed_at = '2026-06-23T13:00:00Z';
  await assert.rejects(() => verifyRouteAttestation(timestamp, canonical), /canonical ISO/);
  timestamp.signer.signed_at = 'bad';
  await assert.rejects(() => verifyRouteAttestation(timestamp, canonical), /ISO-compatible/);

  const signatureMetadata = structuredClone(valid);
  signatureMetadata.signature.note = 'not covered by the signature';
  await assert.rejects(() => verifyRouteAttestation(signatureMetadata, canonical), /unsupported fields/);

  const encoding = structuredClone(valid);
  encoding.signature.encoding = 'hex';
  await assert.rejects(() => verifyRouteAttestation(encoding, canonical), /encoding is unsupported/);

  const length = structuredClone(valid);
  length.signature.value = encodeBase64Url(Uint8Array.of(1));
  await assert.rejects(() => verifyRouteAttestation(length, canonical), /64 bytes/);
});

test('signature tampering, re-signed false routes and untrusted signers are rejected', async () => {
  const bundle = await routeBundle();
  const trustedKey = await generateRouteSigningKeyPair();
  const attackerKey = await generateRouteSigningKeyPair();
  const valid = await attestRouteBundle(bundle, canonical, trustedKey.private_key, { signedAt });

  const tampered = structuredClone(valid);
  tampered.bundle.route.nodes[1] = 'domain.a';
  await assert.rejects(() => verifyRouteAttestation(tampered, canonical), /signature mismatch/);

  let falseBundle = structuredClone(bundle);
  falseBundle.route.nodes[1] = 'domain.a';
  falseBundle = await recomputeBundleIntegrity(falseBundle);
  const resignedFalse = await resign({ ...valid, bundle: falseBundle }, trustedKey.private_key);
  await assert.rejects(() => verifyRouteAttestation(resignedFalse, canonical), /canonical recalculation/);

  const attacker = await attestRouteBundle(bundle, canonical, attackerKey.private_key, { signedAt });
  await assert.rejects(() => verifyRouteAttestation(attacker, canonical, {
    trustedFingerprints: [trustedKey.fingerprint],
    requireTrusted: true,
  }), /not trusted/);

  await assert.rejects(() => verifyRouteAttestation(valid, canonical, {
    trustedFingerprints: 'not-an-array',
  }), /must be an array/);
  await assert.rejects(() => verifyRouteAttestation(valid, canonical, {
    trustedFingerprints: ['bad'],
  }), /Invalid trusted/);
});

test('signing validates the route, timestamp and private/public key agreement', async () => {
  const bundle = await routeBundle();
  const first = await generateRouteSigningKeyPair();
  const second = await generateRouteSigningKeyPair();
  await assert.rejects(() => attestRouteBundle(bundle, canonical, first.private_key, null), /options must be an object/);
  await assert.rejects(() => attestRouteBundle(bundle, canonical, first.private_key, { signedAt: 'bad' }), /ISO-compatible/);

  const falseBundle = structuredClone(bundle);
  falseBundle.request.target = 'bridge.b';
  await assert.rejects(() => attestRouteBundle(falseBundle, canonical, first.private_key), /payload SHA-256 mismatch/);

  const mismatched = { ...first.private_key, d: second.private_key.d };
  await assert.rejects(() => attestRouteBundle(bundle, canonical, mismatched), /(private key|DataError|Invalid keyData)/);
});

test('signing rejects a cryptographic self-check failure', async () => {
  const bundle = await routeBundle();
  const key = await generateRouteSigningKeyPair();
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  const subtle = globalThis.crypto.subtle;
  const fakeSubtle = {
    digest: subtle.digest.bind(subtle),
    importKey: subtle.importKey.bind(subtle),
    sign: subtle.sign.bind(subtle),
    verify: async () => false,
  };
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { subtle: fakeSubtle } });
  try {
    await assert.rejects(() => attestRouteBundle(bundle, canonical, key.private_key), /does not match/);
  } finally {
    Object.defineProperty(globalThis, 'crypto', descriptor);
  }
});

test('Web Crypto absence fails explicitly', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
  try {
    await assert.rejects(() => generateRouteSigningKeyPair(), /Ed25519 is unavailable/);
  } finally {
    Object.defineProperty(globalThis, 'crypto', descriptor);
  }
});
