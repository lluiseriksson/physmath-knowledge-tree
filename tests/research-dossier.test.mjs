import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildResearchDossier,
  importResearchDossier,
  researchDossierMarkdown,
  verifyResearchDossier,
} from '../src/lib/research-dossier.js';

const NOW = '2026-06-25T12:00:00.000Z';

function fixtures() {
  const index = {
    name: 'PhysMath Knowledge Tree', schema_version: '0.6.0', application_version: '2.6.0', updated: '2026-06-25',
  };
  const nodes = [
    {
      id: 'domain.logic', kind: 'domain', title: 'Logic', summary: 'Foundations', confidence: 'literature', tags: ['logic'], questions: [],
      lean: { imports: ['Mathlib'], declarations: ['Prop'], targets: ['Model one finite proposition.'] },
    },
    {
      id: 'problem.alpha', kind: 'problem', title: 'Alpha', summary: 'Open target', confidence: 'heuristic', tags: ['alpha'], questions: [],
      lean: { imports: ['Mathlib.Data.Finset.Basic'], declarations: ['Finset'], targets: ['Formalize a finite toy model.'] },
    },
    {
      id: 'problem.beta', kind: 'problem', title: 'Beta', summary: 'Outside scope', confidence: 'speculative', tags: [], questions: [],
      lean: { imports: [], declarations: [], targets: [] },
    },
  ];
  const edges = [
    {
      id: 'edge.logic.alpha', source: 'domain.logic', target: 'problem.alpha', relation: 'suggests', confidence: 'heuristic',
      mechanism: 'Finite encodings expose the obstruction.', references: [{ label: 'Paper', url: 'https://example.org/paper', type: 'paper', scope: 'claim' }],
    },
    {
      id: 'edge.alpha.beta', source: 'problem.alpha', target: 'problem.beta', relation: 'suggests', confidence: 'speculative', mechanism: 'Outside edge', references: [],
    },
  ];
  const referenceRegistry = {
    schema_version: '1.0.0', graph_schema_version: '0.6.0', references: [
      { url: 'https://example.org/book', label: 'Logic Book', type: 'book', scopes: ['claim'], used_by: ['node:domain.logic'] },
      { url: 'https://example.org/paper', label: 'Alpha Paper', type: 'paper', scopes: ['claim'], used_by: ['edge:edge.logic.alpha'] },
      { url: 'https://example.org/outside', label: 'Outside', type: 'paper', scopes: ['claim'], used_by: ['node:problem.beta'] },
    ],
  };
  const workspaceLibrary = {
    schema_version: 1,
    active_workspace_id: 'workspace.alpha',
    updated_at: NOW,
    workspaces: [{
      id: 'workspace.alpha', title: 'Alpha campaign', node_ids: ['domain.logic', 'problem.alpha'],
      notes: 'Transfer the finite encoding and preserve the stated invariant.',
      bridge_cards: [{
        id: 'card.alpha', title: 'Finite bridge', markdown: '## Falsifier\nA counterexample breaks the invariant.',
        node_ids: ['domain.logic', 'problem.alpha'], created_at: NOW, updated_at: NOW,
      }],
      negative_results: [{
        id: 'negative.alpha', title: 'Small counterexample', status: 'observed', node_ids: ['problem.alpha'],
        observation: 'The first encoding loses parity.', challenged_mechanism: 'Parity preservation',
        next_test: 'Repeat with an even carrier.', created_at: NOW, updated_at: NOW,
      }],
      created_at: NOW, updated_at: NOW,
    }],
  };
  return { index, nodes, edges, referenceRegistry, workspaceLibrary };
}

function evidenceLedger() {
  return {
    schema_version: 1, updated_at: NOW, reviews: [
      { url: 'https://example.org/book', status: 'verified', source_class: 'secondary', identifier: null, checked_at: NOW, notes: '', updated_at: NOW },
      { url: 'https://example.org/paper', status: 'needs-follow-up', source_class: 'primary', identifier: { kind: 'doi', value: '10.1000/example' }, checked_at: NOW, notes: 'Check theorem numbering.', updated_at: NOW },
    ],
  };
}

function leanLedger(nodes) {
  const ids = [];
  for (const node of nodes) {
    for (const [type, values] of [['import', node.lean.imports], ['declaration', node.lean.declarations], ['target', node.lean.targets]]) {
      for (const value of values) ids.push({ item_id: JSON.stringify([node.id, type, value]), type, value });
    }
  }
  return {
    schema_version: 1, updated_at: NOW, records: ids.map((item) => ({
      item_id: item.item_id,
      status: item.type === 'target' ? 'unreviewed' : item.value === 'Finset' ? 'renamed' : 'verified',
      checked_at: NOW,
      toolchain: 'v4.31.0',
      replacement: item.value === 'Finset' ? 'Finset.card' : '',
      notes: '',
      updated_at: NOW,
    })),
  };
}

function changeReview() {
  return {
    baseline_fingerprint: 'a'.repeat(64), current_fingerprint: 'b'.repeat(64),
    changes: [
      {
        key: 'node:problem.alpha:modified', entity_type: 'node', entity_id: 'problem.alpha', change_type: 'modified',
        risk: 'critical', flags: ['confidence-promotion'], title: 'Alpha', fields: [], before: { id: 'problem.alpha' }, after: { id: 'problem.alpha' },
      },
      {
        key: 'node:problem.beta:modified', entity_type: 'node', entity_id: 'problem.beta', change_type: 'modified',
        risk: 'critical', flags: ['confidence-promotion'], title: 'Beta', fields: [], before: { id: 'problem.beta' }, after: { id: 'problem.beta' },
      },
    ],
    ledger: {
      decisions: [
        { key: 'node:problem.alpha:modified', status: 'needs-work', notes: 'Source missing.', updated_at: NOW },
        { key: 'node:problem.beta:modified', status: 'accepted', notes: '', updated_at: NOW },
      ],
    },
  };
}

test('integrated dossier scopes canonical data and combines all four local ledgers', async () => {
  const data = fixtures();
  const dossier = await buildResearchDossier({
    ...data,
    evidenceLedger: evidenceLedger(),
    leanLedger: leanLedger(data.nodes),
    changeReview: changeReview(),
    generatedAt: NOW,
  });

  assert.equal(dossier.workspace.id, 'workspace.alpha');
  assert.deepEqual(dossier.scope.nodes.map(({ id }) => id).sort(), ['domain.logic', 'problem.alpha']);
  assert.deepEqual(dossier.scope.edges.map(({ id }) => id), ['edge.logic.alpha']);
  assert.equal(dossier.evidence.reference_count, 2);
  assert.equal(dossier.evidence.claim_reference_count, 2);
  assert.equal(dossier.evidence.by_status.verified, 1);
  assert.equal(dossier.evidence.by_status['needs-follow-up'], 1);
  assert.equal(dossier.lean.probe_item_count, 4);
  assert.equal(dossier.lean.by_status.renamed, 1);
  assert.equal(dossier.changes.change_count, 1);
  assert.equal(dossier.changes.items[0].change.entity_id, 'problem.alpha');
  assert.equal(dossier.readiness.overall, 'blocked');
  assert.equal(dossier.readiness.gates.find(({ label }) => label === 'Evidence').state, 'attention');
  assert.equal(dossier.readiness.gates.find(({ label }) => label === 'Lean names').state, 'ready');
  assert.equal(dossier.readiness.gates.find(({ label }) => label === 'Canonical changes').state, 'blocked');
  assert.match(dossier.content_fingerprint, /^[a-f0-9]{64}$/u);
  assert.ok(dossier.readiness.actions.some(({ kind, target }) => kind === 'evidence' && target === 'https://example.org/paper'));
  assert.ok(dossier.readiness.actions.some(({ kind, target }) => kind === 'change' && target === 'node:problem.alpha:modified'));
  assert.ok(dossier.readiness.actions.some(({ kind }) => kind === 'experiment'));
});

test('dossier fingerprints round-trip and reject tampering', async () => {
  const data = fixtures();
  const dossier = await buildResearchDossier({ ...data, evidenceLedger: evidenceLedger(), leanLedger: leanLedger(data.nodes), generatedAt: NOW });
  assert.deepEqual(await verifyResearchDossier(dossier), dossier);
  assert.deepEqual(await importResearchDossier(JSON.stringify(dossier)), dossier);
  const tampered = structuredClone(dossier);
  tampered.workspace.notes = 'Changed after export';
  await assert.rejects(() => verifyResearchDossier(tampered), /fingerprint mismatch/u);
  await assert.rejects(() => importResearchDossier('not json'), /Unexpected token|JSON/u);
});

test('empty workspaces produce bounded blockers instead of fabricating readiness', async () => {
  const data = fixtures();
  data.workspaceLibrary.workspaces[0].node_ids = [];
  data.workspaceLibrary.workspaces[0].notes = '';
  data.workspaceLibrary.workspaces[0].bridge_cards = [];
  data.workspaceLibrary.workspaces[0].negative_results = [];
  const dossier = await buildResearchDossier({ ...data, generatedAt: NOW });
  assert.equal(dossier.scope.node_count, 0);
  assert.equal(dossier.readiness.overall, 'blocked');
  assert.equal(dossier.readiness.gates.find(({ label }) => label === 'Scope').state, 'blocked');
  assert.equal(dossier.readiness.gates.find(({ label }) => label === 'Evidence').state, 'not-applicable');
  assert.equal(dossier.readiness.gates.find(({ label }) => label === 'Lean names').state, 'not-applicable');
  assert.equal(dossier.readiness.gates.find(({ label }) => label === 'Canonical changes').state, 'not-applicable');
});

test('Markdown handoff includes gates, fingerprints and explicit safety boundary', async () => {
  const data = fixtures();
  const dossier = await buildResearchDossier({ ...data, evidenceLedger: evidenceLedger(), leanLedger: leanLedger(data.nodes), generatedAt: NOW });
  const markdown = researchDossierMarkdown(dossier);
  assert.match(markdown, /^# Research Dossier: Alpha campaign/mu);
  assert.match(markdown, /Content fingerprint/u);
  assert.match(markdown, /## Readiness gates/u);
  assert.match(markdown, /Alpha Paper/u);
  assert.match(markdown, /Finset\.card/u);
  assert.match(markdown, /does not promote graph confidence/u);
  assert.throws(() => researchDossierMarkdown({}), /needs a research dossier/u);
});

test('dossier validates duplicate graph IDs and unknown workspace IDs', async () => {
  const data = fixtures();
  await assert.rejects(() => buildResearchDossier({ ...data, nodes: [...data.nodes, data.nodes[0]], generatedAt: NOW }), /Duplicate graph node ID/u);
  await assert.rejects(() => buildResearchDossier({ ...data, workspaceId: 'workspace.missing', generatedAt: NOW }), /Unknown workspace ID/u);
});

function evidenceWithStatuses(statusByUrl) {
  const base = evidenceLedger();
  return {
    ...base,
    reviews: base.reviews.map((review) => ({
      ...review,
      status: statusByUrl[review.url] ?? review.status,
    })),
  };
}

function leanWithStatuses(nodes, statusFor) {
  const base = leanLedger(nodes);
  return {
    ...base,
    records: base.records.map((record) => {
      const [nodeId, type, value] = JSON.parse(record.item_id);
      const configured = statusFor({ nodeId, type, value, record });
      if (!configured) return record;
      return {
        ...record,
        status: configured.status,
        replacement: configured.replacement ?? '',
      };
    }),
  };
}

function gateState(dossier, id) {
  return dossier.readiness.gates.find((item) => item.id === id)?.state;
}

test('default local records produce attention while bridge-card text supplies falsifiability', async () => {
  const data = fixtures();
  data.workspaceLibrary.workspaces[0].negative_results = [];
  data.workspaceLibrary.workspaces[0].notes = '';
  const dossier = await buildResearchDossier({ ...data, changeReview: { changes: [], ledger: {} } });

  assert.equal(dossier.evidence.references.every(({ review }) => review.status === 'unreviewed'), true);
  assert.equal(dossier.lean.items.every(({ audit }) => audit.status === 'unreviewed'), true);
  assert.equal(gateState(dossier, 'mechanism'), 'ready');
  assert.equal(gateState(dossier, 'falsifiability'), 'ready');
  assert.equal(gateState(dossier, 'evidence'), 'attention');
  assert.equal(gateState(dossier, 'lean'), 'attention');
  assert.equal(gateState(dossier, 'changes'), 'not-applicable');
  assert.equal(dossier.readiness.overall, 'attention');
  assert.ok(dossier.readiness.actions.some(({ kind }) => kind === 'lean'));
});

test('fully governed scope reaches ready with no open actions', async () => {
  const data = fixtures();
  data.workspaceLibrary.workspaces[0].negative_results = [];
  const dossier = await buildResearchDossier({
    ...data,
    evidenceLedger: evidenceWithStatuses({
      'https://example.org/book': 'verified',
      'https://example.org/paper': 'verified',
    }),
    leanLedger: leanWithStatuses(data.nodes, ({ type, value }) => ({
      status: type === 'target' ? 'unreviewed' : value === 'Finset' ? 'renamed' : 'verified',
      replacement: value === 'Finset' ? 'Finset.card' : '',
    })),
    changeReview: {
      baseline_fingerprint: 'c'.repeat(64),
      current_fingerprint: 'd'.repeat(64),
      changes: [{
        key: 'node:problem.alpha:low', entity_type: 'node', entity_id: 'problem.alpha', risk: 'low',
        title: 'Editorial clarification', before: {}, after: {},
      }],
      ledger: { decisions: [] },
    },
    generatedAt: NOW,
  });

  assert.equal(dossier.readiness.overall, 'ready');
  assert.equal(gateState(dossier, 'evidence'), 'ready');
  assert.equal(gateState(dossier, 'lean'), 'ready');
  assert.equal(gateState(dossier, 'changes'), 'ready');
  assert.equal(dossier.readiness.action_count, 0);
  assert.match(researchDossierMarkdown(dossier), /No open actions/u);
});

test('superseded evidence, broken Lean names and pending changes create bounded blockers', async () => {
  const data = fixtures();
  const changes = {
    baseline_fingerprint: '1'.repeat(64), current_fingerprint: '2'.repeat(64),
    changes: [
      { key: 'node:problem.alpha:pending', entity_type: 'node', entity_id: 'problem.alpha', risk: 'high', title: 'Pending change', before: {}, after: {} },
      { key: 'edge:edge.logic.alpha:work', entity_type: 'edge', entity_id: 'edge.logic.alpha', risk: 'critical', title: 'Needs work', before: {}, after: {} },
    ],
    ledger: { decisions: [
      { key: 'edge:edge.logic.alpha:work', status: 'needs-work', notes: 'Repair source loss.', updated_at: 'invalid' },
      { key: 'node:problem.alpha:pending', status: 'invalid', notes: 42, updated_at: NOW },
      null,
    ] },
  };
  const dossier = await buildResearchDossier({
    ...data,
    evidenceLedger: evidenceWithStatuses({
      'https://example.org/book': 'superseded',
      'https://example.org/paper': 'needs-follow-up',
    }),
    leanLedger: leanWithStatuses(data.nodes, ({ type, value }) => {
      if (type === 'target') return { status: 'unreviewed' };
      if (value === 'Mathlib') return { status: 'missing' };
      if (value === 'Prop') return { status: 'blocked' };
      return { status: 'unreviewed' };
    }),
    changeReview: changes,
    generatedAt: NOW,
  });

  assert.equal(gateState(dossier, 'evidence'), 'blocked');
  assert.equal(gateState(dossier, 'lean'), 'blocked');
  assert.equal(gateState(dossier, 'changes'), 'blocked');
  assert.equal(dossier.readiness.overall, 'blocked');
  assert.ok(dossier.readiness.actions.some(({ kind, severity }) => kind === 'evidence' && severity === 'blocked'));
  assert.ok(dossier.readiness.actions.some(({ kind, severity }) => kind === 'lean' && severity === 'blocked'));
  assert.ok(dossier.readiness.actions.some(({ kind, severity }) => kind === 'change' && severity === 'blocked'));
  assert.ok(dossier.readiness.actions.some(({ kind, severity }) => kind === 'change' && severity === 'attention'));
});

test('terminal decisions resolve all governed changes', async () => {
  const data = fixtures();
  const dossier = await buildResearchDossier({
    ...data,
    evidenceLedger: evidenceWithStatuses({
      'https://example.org/book': 'verified', 'https://example.org/paper': 'verified',
    }),
    leanLedger: leanWithStatuses(data.nodes, ({ type }) => ({ status: type === 'target' ? 'unreviewed' : 'verified' })),
    changeReview: {
      baseline_fingerprint: '3'.repeat(64), current_fingerprint: '4'.repeat(64),
      changes: [
        { key: 'node:problem.alpha:a', entity_type: 'node', entity_id: 'problem.alpha', risk: 'critical', title: 'Accepted', before: {}, after: {} },
        { key: 'edge:edge.logic.alpha:r', entity_type: 'edge', entity_id: 'edge.logic.alpha', risk: 'high', title: 'Rejected', before: {}, after: {} },
      ],
      ledger: { decisions: [
        { key: 'node:problem.alpha:a', status: 'accepted', notes: '', updated_at: NOW },
        { key: 'edge:edge.logic.alpha:r', status: 'rejected', notes: '', updated_at: NOW },
      ] },
    },
    generatedAt: NOW,
  });
  assert.equal(gateState(dossier, 'changes'), 'ready');
  assert.equal(dossier.changes.by_status.accepted, 1);
  assert.equal(dossier.changes.by_status.rejected, 1);
  assert.equal(dossier.readiness.actions.some(({ kind }) => kind === 'change'), false);
});

test('change scoping covers metadata, edges, collections and research moves conservatively', async () => {
  const data = fixtures();
  const changes = [
    null,
    { key: 'metadata:critical', entity_type: 'metadata', entity_id: 'index', risk: 'critical', title: 'Contract', before: {}, after: {} },
    { key: 'metadata:low', entity_type: 'metadata', entity_id: 'index', risk: 'low', title: 'Metadata note', before: {}, after: {} },
    { key: 'node:selected', entity_type: 'node', entity_id: 'problem.alpha', risk: 'weird', title: 'Selected node', before: {}, after: {} },
    { key: 'node:outside', entity_type: 'node', entity_id: 'problem.beta', risk: 'critical', title: 'Outside node', before: {}, after: {} },
    { key: 'edge:direct', entity_type: 'edge', entity_id: 'edge.logic.alpha', risk: 'high', title: 'Direct edge', before: {}, after: {} },
    { key: 'edge:endpoint', entity_type: 'edge', entity_id: 'edge.new', risk: 'high', title: 'Endpoint edge', before: { source: 'problem.alpha' }, after: {} },
    { key: 'edge:outside', entity_type: 'edge', entity_id: 'edge.outside', risk: 'high', title: 'Outside edge', before: { source: 'problem.beta', target: 'other' }, after: {} },
    { key: 'collection:selected', entity_type: 'collection', entity_id: 'collection.one', risk: 'medium', title: 'Collection', before: { nodes: ['problem.alpha'] }, after: {} },
    { key: 'collection:outside', entity_type: 'collection', entity_id: 'collection.two', risk: 'medium', title: 'Outside collection', before: { nodes: ['problem.beta'] }, after: { nodes: [] } },
    { key: 'move:selected', entity_type: 'research_move', entity_id: 'move.one', risk: 'medium', title: 'Move', before: {}, after: { good_for: ['domain.logic'] } },
    { key: 'move:outside', entity_type: 'research_move', entity_id: 'move.two', risk: 'medium', title: 'Outside move', before: { good_for: ['problem.beta'] }, after: {} },
    { key: 'mystery', entity_type: 'mystery', entity_id: 'unknown', risk: 'critical', title: 'Unknown', before: {}, after: {} },
  ];
  const decisions = changes.filter(Boolean).map((change) => ({ key: change.key, status: 'accepted', notes: '', updated_at: NOW }));
  const dossier = await buildResearchDossier({
    ...data,
    changeReview: {
      baseline_fingerprint: '5'.repeat(64), current_fingerprint: '6'.repeat(64), changes,
      ledger: { decisions },
    },
    generatedAt: NOW,
  });
  assert.deepEqual(dossier.changes.items.map(({ change }) => change.key).sort(), [
    'collection:selected', 'edge:direct', 'edge:endpoint', 'metadata:critical', 'move:selected', 'node:selected',
  ].sort());
});

test('valid explicit workspace selection overrides the active workspace', async () => {
  const data = fixtures();
  data.workspaceLibrary.workspaces.push({
    ...structuredClone(data.workspaceLibrary.workspaces[0]),
    id: 'workspace.second', title: 'Second campaign', node_ids: ['problem.beta'], bridge_cards: [], negative_results: [], notes: '',
  });
  const dossier = await buildResearchDossier({ ...data, workspaceId: ' workspace.second ', generatedAt: NOW });
  assert.equal(dossier.workspace.id, 'workspace.second');
  assert.deepEqual(dossier.scope.nodes.map(({ id }) => id), ['problem.beta']);
});

test('input, import and verification boundaries reject malformed payloads', async () => {
  const data = fixtures();
  await assert.rejects(() => buildResearchDossier(null), /must be an object/u);
  await assert.rejects(() => buildResearchDossier({ ...data, index: null, generatedAt: NOW }), /Graph index must be an object/u);
  await assert.rejects(() => buildResearchDossier({ ...data, nodes: null, generatedAt: NOW }), /Graph nodes must be an array/u);
  await assert.rejects(() => buildResearchDossier({ ...data, edges: null, generatedAt: NOW }), /Graph edges must be an array/u);
  await assert.rejects(() => buildResearchDossier({ ...data, generatedAt: 'invalid' }), /ISO-compatible/u);
  await assert.rejects(() => buildResearchDossier({ ...data, nodes: [null], generatedAt: NOW }), /needs a non-empty ID/u);
  await assert.rejects(() => buildResearchDossier({ ...data, nodes: [{ id: '' }], generatedAt: NOW }), /needs a non-empty ID/u);
  await assert.rejects(() => buildResearchDossier({ ...data, edges: [null], generatedAt: NOW }), /needs a non-empty ID/u);
  await assert.rejects(() => buildResearchDossier({ ...data, edges: [...data.edges, data.edges[0]], generatedAt: NOW }), /Duplicate graph edge ID/u);
  await assert.rejects(() => buildResearchDossier({ ...data, changeReview: { baseline_fingerprint: 'x', changes: {} }, generatedAt: NOW }), /changes must be an array/u);

  const valid = await buildResearchDossier({ ...data, generatedAt: NOW });
  for (const [field, value, pattern] of [
    ['application', 'Other', /another application/u],
    ['schema_version', 99, /schema version/u],
    ['kind', 'other', /dossier kind/u],
    ['generated_at', 'invalid', /ISO-compatible/u],
    ['content_fingerprint', 'bad', /fingerprint is invalid/u],
  ]) {
    const changed = structuredClone(valid);
    changed[field] = value;
    await assert.rejects(() => verifyResearchDossier(changed), pattern);
  }
  for (const field of ['graph', 'workspace', 'scope', 'evidence', 'lean', 'changes', 'readiness']) {
    const changed = structuredClone(valid);
    changed[field] = null;
    await assert.rejects(() => verifyResearchDossier(changed), /must be an object/u);
  }
  await assert.rejects(() => verifyResearchDossier(null), /must be an object/u);
  await assert.rejects(() => importResearchDossier(null), /must be text/u);
  await assert.rejects(() => importResearchDossier('x'.repeat(12_000_001)), /size limit/u);
});

test('Markdown covers empty and partial optional sections safely', async () => {
  const data = fixtures();
  data.workspaceLibrary.workspaces[0].node_ids = [];
  data.workspaceLibrary.workspaces[0].notes = '';
  data.workspaceLibrary.workspaces[0].bridge_cards = [];
  data.workspaceLibrary.workspaces[0].negative_results = [];
  data.index.name = '';
  data.index.application_version = '';
  const empty = await buildResearchDossier({ ...data, generatedAt: NOW });
  const emptyMarkdown = researchDossierMarkdown(empty);
  assert.match(emptyMarkdown, /No working notes recorded/u);
  assert.match(emptyMarkdown, /No bridge-card drafts/u);
  assert.match(emptyMarkdown, /No negative or inconclusive results/u);
  assert.match(emptyMarkdown, /No local change-review baseline/u);

  const populatedData = fixtures();
  populatedData.workspaceLibrary.workspaces[0].bridge_cards[0].markdown = '';
  populatedData.workspaceLibrary.workspaces[0].negative_results[0].observation = '';
  populatedData.workspaceLibrary.workspaces[0].negative_results[0].challenged_mechanism = '';
  populatedData.workspaceLibrary.workspaces[0].negative_results[0].next_test = '';
  const populated = await buildResearchDossier({ ...populatedData, changeReview: changeReview(), generatedAt: NOW });
  populated.scope.nodes[0].title = null;
  populated.scope.nodes[0].summary = null;
  populated.readiness.gates[0].detail = 'pipe | and\nnewline';
  const markdown = researchDossierMarkdown(populated);
  assert.match(markdown, /_Empty draft\._/u);
  assert.match(markdown, /Not recorded\./u);
  assert.match(markdown, /pipe \\| and newline/u);
  assert.match(markdown, /Relevant changes/u);
});

test('sorting, formalization scopes and pending governance cover deterministic fallbacks', async () => {
  const data = fixtures();
  data.nodes.push({
    id: 'domain.logic.two', kind: 'domain', title: 'Logic', summary: 'Second logic node', confidence: 'literature', tags: [], questions: [],
    lean: { imports: [], declarations: [], targets: [] },
  });
  data.workspaceLibrary.workspaces[0].node_ids.push('domain.logic.two');
  data.edges.push({
    id: 'edge.logic.two.alpha', source: 'domain.logic.two', target: 'problem.alpha', relation: 'uses', confidence: 'literature',
    mechanism: 'Second selected edge.', references: [],
  });
  data.referenceRegistry.references.push(
    { url: 'https://example.org/a', label: 'Same label', type: 'paper', scopes: ['formalization'], used_by: ['node:domain.logic'] },
    { url: 'https://example.org/b', label: 'Same label', type: 'paper', scopes: ['context'], used_by: ['node:domain.logic.two'] },
  );
  const dossier = await buildResearchDossier({
    ...data,
    changeReview: {
      baseline_fingerprint: '7'.repeat(64), current_fingerprint: '8'.repeat(64),
      changes: [
        { key: 'collection:after', entity_type: 'collection', entity_id: 'collection.after', risk: 'medium', title: 'After collection', after: { nodes: ['domain.logic'] } },
        { key: 'node:pending-only', entity_type: 'node', entity_id: 'problem.alpha', risk: 'high', title: 'Pending only', before: {}, after: {} },
      ],
      ledger: { decisions: [] },
    },
    generatedAt: NOW,
  });
  assert.equal(dossier.scope.nodes.length, 3);
  assert.equal(dossier.scope.edges.length, 2);
  assert.equal(dossier.evidence.claim_reference_count, 3);
  assert.equal(gateState(dossier, 'changes'), 'attention');

  const noChanges = await buildResearchDossier({
    ...data,
    changeReview: { baseline_fingerprint: '9'.repeat(64), ledger: { decisions: [] } },
    generatedAt: NOW,
  });
  assert.equal(gateState(noChanges, 'changes'), 'ready');

  const missingFingerprint = structuredClone(dossier);
  delete missingFingerprint.content_fingerprint;
  await assert.rejects(() => verifyResearchDossier(missingFingerprint), /fingerprint is invalid/u);
  dossier.readiness.gates[0].label = null;
  assert.match(researchDossierMarkdown(dossier), /\|  \| ready/u);
});
