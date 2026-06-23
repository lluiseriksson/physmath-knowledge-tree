import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { buildJsonLd, entityIri } from '../src/lib/jsonld.js';
import { executeJsonLdExport, parseJsonLdArguments } from '../scripts/export-jsonld.mjs';

const index = {
  schema_version: '0.6.0', application_version: '2.6.0', created: '2026-06-22', updated: '2026-06-23',
  name: 'Fixture graph', purpose: 'Test deterministic linked-data export.',
};
const nodes = [
  {
    id: 'domain.b', kind: 'domain', title: 'Beta', summary: 'Beta summary', confidence: 'literature',
    tags: ['zeta', 'alpha'], questions: ['Question?'],
    lean: { imports: ['Mathlib'], declarations: [], targets: ['Bounded target'] },
    references: [{ label: 'B source', url: 'https://example.test/b', type: 'paper', scope: 'claim' }],
  },
  {
    id: 'problem.a', kind: 'problem', title: 'Alpha problem', summary: 'Alpha summary',
    confidence: 'formal', status: 'unsolved', tags: ['problem'], questions: ['Open?'],
    lean: { imports: [], declarations: ['A'], targets: ['Prove a finite lemma'] },
    references: [
      { label: 'Z source', url: 'https://example.test/z', type: 'book', scope: 'context' },
      { label: 'A source', url: 'https://example.test/a', type: 'official', scope: 'formalization' },
    ],
  },
];
const edges = [{
  id: 'edge.a_b', source: 'problem.a', target: 'domain.b', relation: 'uses',
  confidence: 'literature', mechanism: 'Alpha uses beta.', notes: 'A bounded fixture note.',
  references: [{ label: 'Edge source', url: 'https://example.test/e', type: 'paper', scope: 'claim' }],
}];
const moves = [{
  id: 'move.test', title: 'Test move', description: 'A reproducible research move.',
  good_for: ['fixtures'], output: 'A finite output', risks: ['Overfitting the fixture'], lean_test: 'Check a finite witness',
}];
const collections = [{
  id: 'collection.test', title: 'Fixture collection', description: 'A deterministic fixture.',
  nodes: ['domain.b', 'problem.a'],
}];

test('entity IRIs are stable, encoded and restricted to HTTP(S)', () => {
  assert.equal(
    entityIri('bridge.a b', 'https://example.test/entities'),
    'https://example.test/entities/bridge.a%20b',
  );
  assert.throws(() => entityIri('', 'https://example.test/'), /non-empty/);
  assert.throws(() => entityIri('x', 'urn:fixture:'), /HTTP or HTTPS/);
});

test('JSON-LD export links endpoints, sorts entities and retains evidence metadata', () => {
  const document = buildJsonLd({
    index, packageVersion: '2.6.0', nodes, edges, moves, collections,
    entityBase: 'https://example.test/id/',
  });
  assert.equal(document['@type'], 'pm:KnowledgeGraph');
  assert.equal(document.applicationVersion, '2.6.0');
  const ids = document['@graph'].map((item) => item['@id']);
  assert.deepEqual(ids, [...ids].sort());

  const edge = document['@graph'].find((item) => item.stableId === 'edge.a_b');
  assert.equal(edge.source, 'https://example.test/id/problem.a');
  assert.equal(edge.target, 'https://example.test/id/domain.b');
  assert.equal(edge.notes, 'A bounded fixture note.');

  const problem = document['@graph'].find((item) => item.stableId === 'problem.a');
  assert.equal(problem.status, 'unsolved');
  assert.deepEqual(problem.citation.map((reference) => reference.name), ['A source', 'Z source']);
  const domain = document['@graph'].find((item) => item.stableId === 'domain.b');
  assert.deepEqual(domain.keywords, ['alpha', 'zeta']);
  const collection = document['@graph'].find((item) => item.stableId === 'collection.test');
  assert.deepEqual(collection.members, [
    'https://example.test/id/domain.b',
    'https://example.test/id/problem.a',
  ]);
});

test('JSON-LD export rejects duplicate IDs and dangling links', () => {
  assert.throws(() => buildJsonLd({
    index, packageVersion: '2.6.0', nodes: [nodes[0], nodes[0]], edges: [],
  }), /Duplicate node ID/);
  assert.throws(() => buildJsonLd({
    index, packageVersion: '2.6.0', nodes, edges: [{ ...edges[0], target: 'missing' }],
  }), /unknown endpoint/);
  assert.throws(() => buildJsonLd({
    index, packageVersion: '2.6.0', nodes, edges: [], moves: [{ ...moves[0], id: nodes[0].id }],
  }), /Duplicate entity ID/);
  assert.throws(() => buildJsonLd({
    index, packageVersion: '2.6.0', nodes, edges: [], collections: [{ ...collections[0], nodes: ['missing'] }],
  }), /unknown node/);
  assert.throws(() => buildJsonLd({ index: null, packageVersion: '2.6.0', nodes, edges }), /index object/);
  assert.throws(() => buildJsonLd({ index, packageVersion: '2.6.0', nodes: {}, edges }), /inputs must be arrays/);
  assert.throws(() => buildJsonLd({
    index: { ...index, application_version: '2.5.0' }, packageVersion: '2.6.0', nodes, edges,
  }), /application-version mismatch/);
  assert.throws(() => buildJsonLd({
    index: { ...index, application_version: '' }, packageVersion: '2.6.0', nodes, edges,
  }), /application-version metadata/);
  assert.throws(() => buildJsonLd({ index, packageVersion: '', nodes, edges }), /application version/);
  assert.throws(() => buildJsonLd({
    index: { ...index, schema_version: '' }, packageVersion: '2.6.0', nodes, edges,
  }), /schema version/);
});

test('JSON-LD CLI argument parsing handles output, base, compact mode and errors', () => {
  const parsed = parseJsonLdArguments([
    '--compact', '--output', 'fixture.jsonld', '--base=https://example.test/entity/',
  ]);
  assert.equal(parsed.pretty, false);
  assert.match(parsed.outputPath, /fixture\.jsonld$/u);
  assert.equal(parsed.entityBase, 'https://example.test/entity/');
  assert.equal(parseJsonLdArguments(['--help']).help, true);
  assert.equal(parseJsonLdArguments(['--check']).check, true);
  assert.throws(() => parseJsonLdArguments(['--check', '--output', 'x.jsonld']), /cannot be combined/);
  assert.throws(() => parseJsonLdArguments(['--unknown']), /Missing value|Unknown option/);
  assert.throws(() => parseJsonLdArguments(['--output']), /Missing value/);
});

test('JSON-LD CLI executes against a repository-shaped fixture', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'physmath-jsonld-'));
  try {
    mkdirSync(join(temporary, 'graph', 'nodes'), { recursive: true });
    writeFileSync(join(temporary, 'package.json'), JSON.stringify({ version: '2.6.0' }));
    writeFileSync(join(temporary, 'graph', 'index.json'), JSON.stringify({
      ...index,
      canonical_files: {
        nodes: 'graph/nodes/core.json', edges: 'graph/edges.json',
        research_moves: 'graph/research_moves.json', collections: 'graph/collections.json',
      },
    }));
    writeFileSync(join(temporary, 'graph', 'nodes', 'core.json'), JSON.stringify(nodes));
    writeFileSync(join(temporary, 'graph', 'edges.json'), JSON.stringify(edges));
    writeFileSync(join(temporary, 'graph', 'research_moves.json'), JSON.stringify(moves));
    writeFileSync(join(temporary, 'graph', 'collections.json'), JSON.stringify(collections));

    const outputPath = join(temporary, 'out.jsonld');
    const result = executeJsonLdExport({
      help: false,
      outputPath,
      entityBase: 'https://example.test/id/',
      pretty: false,
    }, temporary);
    assert.equal(result.exitCode, 0);
    assert.equal(JSON.parse(readFileSync(outputPath, 'utf8'))['@graph'].length, 5);
    assert.equal(result.output.includes('\n  '), false);
    const canonicalOptions = {
      help: false, outputPath: null, entityBase: 'https://example.test/id/', pretty: true, check: false,
    };
    writeFileSync(join(temporary, 'graph', 'knowledge-graph.jsonld'), executeJsonLdExport(canonicalOptions, temporary).output);
    const checked = executeJsonLdExport({ ...canonicalOptions, check: true }, temporary);
    assert.match(checked.output, /5 entities/);
    assert.match(executeJsonLdExport({ help: true }, temporary).output, /export:jsonld/);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test('JSON-LD defaults cover sparse bridge, move, collection and reference metadata', () => {
  assert.equal(entityIri('domain.default', ''), 'https://lluiseriksson.github.io/physmath-knowledge-tree/id/domain.default');
  const sparseNodes = [
    { id: 'bridge.sparse', kind: 'bridge', title: 'Sparse bridge', summary: 'Sparse.' },
    { id: 'domain.sparse', kind: 'domain', title: 'Sparse domain', summary: 'Sparse.', references: [
      { url: 'https://example.test/same', label: 'Z' },
      { url: 'https://example.test/same', label: 'A' },
      {}, {},
    ] },
  ];
  const document = buildJsonLd({
    index,
    packageVersion: '2.6.0',
    nodes: sparseNodes,
    edges: [],
    moves: [{ id: 'move.sparse', title: 'Sparse move', description: 'Sparse', output: 'Output' }],
    collections: [{ id: 'collection.sparse', title: 'Sparse collection', description: 'Sparse' }],
  });
  const bridge = document['@graph'].find((item) => item.stableId === 'bridge.sparse');
  assert.equal(bridge['@type'], 'pm:Bridge');
  assert.deepEqual(bridge.keywords, []);
  assert.deepEqual(bridge.questions, []);
  assert.deepEqual(bridge.leanImports, []);
  assert.deepEqual(bridge.leanDeclarations, []);
  assert.deepEqual(bridge.leanTargets, []);
  assert.deepEqual(bridge.citation, []);
  const domain = document['@graph'].find((item) => item.stableId === 'domain.sparse');
  assert.deepEqual(domain.citation.slice(0, 2).map((item) => item.name), [undefined, undefined]);
  assert.deepEqual(domain.citation.slice(2).map((item) => item.name), ['A', 'Z']);
  const move = document['@graph'].find((item) => item.stableId === 'move.sparse');
  assert.deepEqual(move.goodFor, []);
  assert.deepEqual(move.risks, []);
  const collection = document['@graph'].find((item) => item.stableId === 'collection.sparse');
  assert.deepEqual(collection.members, []);
});
