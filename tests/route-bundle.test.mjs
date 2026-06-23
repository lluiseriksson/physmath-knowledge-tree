import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalRouteGraph,
  computeRouteGraphSha256,
  createRouteBundle,
  ROUTE_BUNDLE_SCHEMA_VERSION,
  sha256Hex,
  stableStringify,
  verifyRouteBundle,
} from '../src/lib/route-bundle.js';

const index = { application_version: '2.6.0', schema_version: '0.6.0' };
const nodes = [
  { id: 'domain.a' },
  { id: 'bridge.b' },
  { id: 'problem.c' },
];
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

async function signedMutation(bundle, mutate) {
  const clone = structuredClone(bundle);
  mutate(clone);
  const { integrity: _integrity, ...payload } = clone;
  clone.integrity.payload_sha256 = await sha256Hex(stableStringify(payload));
  return clone;
}

test('stable serialization is deterministic and strict', () => {
  assert.equal(stableStringify({ z: 1, a: { y: 2, x: 3 } }), '{"a":{"x":3,"y":2},"z":1}');
  assert.equal(stableStringify({ keep: true, drop: undefined }), '{"keep":true}');
  assert.throws(() => stableStringify({ bad: Number.NaN }), /non-finite/);
  assert.throws(() => stableStringify({ bad: new Date() }), /non-JSON/);
});

test('route graph projection and digest ignore source ordering', async () => {
  const first = canonicalRouteGraph(nodes, edges);
  const second = canonicalRouteGraph([...nodes].reverse(), [...edges].reverse());
  assert.deepEqual(first, second);
  assert.equal(await computeRouteGraphSha256(nodes, edges), await computeRouteGraphSha256([...nodes].reverse(), [...edges].reverse()));
});

test('route bundles round-trip against the canonical graph', async () => {
  const bundle = await createRouteBundle({
    index, nodes, edges, source: 'domain.a', target: 'problem.c',
    options: { policy: 'strongest', directed: true }, createdAt,
  });
  assert.equal(bundle.schema_version, ROUTE_BUNDLE_SCHEMA_VERSION);
  assert.equal(bundle.created_at, createdAt);
  assert.deepEqual(bundle.route.nodes, ['domain.a', 'bridge.b', 'problem.c']);
  assert.equal(bundle.evidence.references, 2);
  assert.match(bundle.integrity.payload_sha256, /^[a-f0-9]{64}$/u);
  const result = await verifyRouteBundle(bundle, canonical);
  assert.equal(result.valid, true);
  assert.deepEqual(result.route, bundle.route);
});

test('same request and timestamp produce the same bundle', async () => {
  const input = { index, nodes, edges, source: 'domain.a', target: 'problem.c', options: { directed: true }, createdAt };
  const first = await createRouteBundle(input);
  const second = await createRouteBundle({ ...input, nodes: [...nodes].reverse(), edges: [...edges].reverse() });
  assert.equal(stableStringify(first), stableStringify(second));
});

test('verification rejects payload tampering and re-signed false routes', async () => {
  const bundle = await createRouteBundle({ index, nodes, edges, source: 'domain.a', target: 'problem.c', createdAt });
  const tampered = structuredClone(bundle);
  tampered.route.nodes[1] = 'domain.a';
  await assert.rejects(() => verifyRouteBundle(tampered, canonical), /payload SHA-256 mismatch/);

  const resigned = await signedMutation(bundle, (value) => { value.route.nodes[1] = 'domain.a'; });
  await assert.rejects(() => verifyRouteBundle(resigned, canonical), /canonical recalculation/);
});

test('verification rejects graph drift, version drift and evidence tampering', async () => {
  const bundle = await createRouteBundle({ index, nodes, edges, source: 'domain.a', target: 'problem.c', createdAt });
  const changedEdges = structuredClone(edges);
  changedEdges[0].mechanism = 'Changed canonical mechanism.';
  await assert.rejects(() => verifyRouteBundle(bundle, { index, nodes, edges: changedEdges }), /graph SHA-256/);
  await assert.rejects(() => verifyRouteBundle(bundle, { index: { ...index, application_version: '2.7.0' }, nodes, edges }), /application version/);

  const evidenceTamper = await signedMutation(bundle, (value) => { value.evidence.references = 99; });
  await assert.rejects(() => verifyRouteBundle(evidenceTamper, canonical), /evidence summary/);
});

test('creation and validation reject malformed inputs', async () => {
  await assert.rejects(() => createRouteBundle({ index: null, nodes, edges, source: 'domain.a', target: 'problem.c' }), /index object/);
  await assert.rejects(() => createRouteBundle({ index: {}, nodes, edges, source: 'domain.a', target: 'problem.c' }), /application-version/);
  await assert.rejects(() => createRouteBundle({ index, nodes, edges, source: 'domain.a', target: 'problem.c', createdAt: 'bad' }), /createdAt/);
  await assert.rejects(() => createRouteBundle({ index, nodes, edges: [], source: 'domain.a', target: 'problem.c' }), /No route/);
  await assert.rejects(() => verifyRouteBundle(null, canonical), /JSON object/);
  await assert.rejects(() => verifyRouteBundle({ application: 'other' }, canonical), /Not a PhysMath/);

  const bundle = await createRouteBundle({ index, nodes, edges, source: 'domain.a', target: 'problem.c', createdAt });
  const schema = structuredClone(bundle);
  schema.schema_version = 999;
  await assert.rejects(() => verifyRouteBundle(schema, canonical), /Unsupported/);
  const incomplete = structuredClone(bundle);
  delete incomplete.route;
  await assert.rejects(() => verifyRouteBundle(incomplete, canonical), /structurally incomplete/);
  const integrity = structuredClone(bundle);
  integrity.integrity.algorithm = 'MD5';
  await assert.rejects(() => verifyRouteBundle(integrity, canonical), /integrity metadata/);
});

test('projection covers optional metadata, duplicate sort ties and reference ordering', () => {
  const projected = canonicalRouteGraph(
    [{ id: 'same' }, { id: 'same' }],
    [
      {
        id: 'edge.same', source: 'same', target: 'same', confidence: 'heuristic',
        references: [
          { label: 'Z' },
          { url: 'https://example.test/no-label' },
          { label: 'A', url: 'https://example.test/a', type: 'book', scope: 'context' },
        ],
      },
      { id: 'edge.same', source: 'same', target: 'same', confidence: 'heuristic' },
    ],
  );
  assert.equal(projected.nodes.length, 2);
  assert.equal(projected.edges[0].relation, null);
  assert.equal(projected.edges[0].mechanism, null);
  assert.equal(projected.edges[1].references.length, 0);
  assert.equal(projected.edges[0].references[0].label, 'A');
  assert.equal(projected.edges[0].references[1].label, 'Z');
  assert.equal(projected.edges[0].references[1].url, null);
  assert.equal(projected.edges[0].references[1].type, null);
  assert.equal(projected.edges[0].references[1].scope, null);
  assert.equal(projected.edges[0].references[2].label, null);
  assert.throws(() => canonicalRouteGraph({}, []), /inputs must be arrays/);
  assert.throws(() => canonicalRouteGraph([], {}), /inputs must be arrays/);
});

test('explicit route constraints are normalized into the bundle', async () => {
  const bundle = await createRouteBundle({
    index,
    nodes,
    edges,
    source: 'domain.a',
    target: 'problem.c',
    options: {
      policy: 'shortest',
      directed: true,
      allowedConfidence: ['literature', 'formal', 'formal'],
      maxEdges: 2,
      maxStates: 99,
    },
    createdAt,
  });
  assert.deepEqual(bundle.request.allowed_confidence, ['formal', 'literature']);
  assert.equal(bundle.request.max_edges, 2);
  assert.equal(bundle.request.max_states, 99);
  assert.equal((await verifyRouteBundle(bundle, canonical)).valid, true);
});

test('schema metadata and a re-signed impossible request are rejected', async () => {
  await assert.rejects(() => createRouteBundle({
    index: { application_version: '2.6.0' }, nodes, edges, source: 'domain.a', target: 'problem.c', createdAt,
  }), /schema-version/);

  const bundle = await createRouteBundle({ index, nodes, edges, source: 'domain.a', target: 'problem.c', createdAt });
  await assert.rejects(() => verifyRouteBundle(bundle, {
    index: { ...index, schema_version: '0.7.0' }, nodes, edges,
  }), /graph schema version/);

  const impossible = await signedMutation(bundle, (value) => { value.request.allowed_confidence = []; });
  await assert.rejects(() => verifyRouteBundle(impossible, canonical), /no longer provides/);
});

test('SHA helper fails explicitly when Web Crypto is unavailable', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
  try {
    await assert.rejects(() => sha256Hex('x'), /unavailable/);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'crypto', descriptor);
    else delete globalThis.crypto;
  }
});
