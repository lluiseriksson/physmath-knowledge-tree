import assert from 'node:assert/strict';
import test from 'node:test';
import {
  IDENTIFIER_KINDS,
  MAX_REVIEW_IMPORT_BYTES,
  MAX_REVIEW_RECORDS,
  REVIEW_APPLICATION,
  REVIEW_SCHEMA_VERSION,
  REVIEW_STATUSES,
  REVIEW_STORAGE_KEY,
  SOURCE_CLASSES,
  buildEvidenceWorklist,
  buildReviewPacket,
  createReviewLedger,
  exportReviewLedger,
  importReviewLedger,
  inferPublicationIdentifier,
  loadReviewLedger,
  mergeReviewLedgers,
  normalizeReferenceRegistry,
  normalizeReviewLedger,
  removeReview,
  saveReviewLedger,
  summarizeEvidenceReviews,
  upsertReview,
  validateReviewFile,
} from '../src/lib/evidence-review.js';

const now = '2026-06-24T12:00:00.000Z';
const later = '2026-06-25T12:00:00.000Z';

function registryFixture() {
  return {
    schema_version: '1.0.0',
    graph_schema_version: '0.6.0',
    references: [
      {
        url: 'https://doi.org/10.1000/example',
        label: 'Primary theorem paper',
        type: 'paper',
        scopes: ['claim', 'formalization', 'claim'],
        used_by: ['node:domain.alpha', 'edge:edge.alpha.beta', 'node:domain.alpha'],
      },
      {
        url: 'https://arxiv.org/abs/2401.12345',
        label: 'Context survey',
        type: 'survey',
        scopes: ['context'],
        used_by: ['edge:edge.beta.gamma'],
      },
      {
        url: 'https://example.org/book',
        label: 'Reference book',
        type: 'book',
        scopes: ['claim'],
        used_by: [
          'node:domain.alpha', 'node:domain.beta', 'node:domain.gamma',
          'edge:edge.alpha.beta', 'edge:edge.beta.gamma',
        ],
      },
      {
        url: 'https://example.org/docs',
        label: 'Official documentation',
        type: 'official',
        scopes: ['claim'],
        used_by: ['node:domain.docs'],
      },
    ],
  };
}

function validUrls() {
  return new Set(registryFixture().references.map(({ url }) => url));
}

function review(url, overrides = {}) {
  return {
    url,
    status: 'verified',
    source_class: 'primary',
    identifier: { kind: 'doi', value: '10.1000/example' },
    checked_at: now,
    notes: 'Checked against the canonical claim.',
    updated_at: now,
    ...overrides,
  };
}

function storage(initial = null, options = {}) {
  const values = new Map(initial === null ? [] : [[REVIEW_STORAGE_KEY, initial]]);
  return {
    getItem(key) {
      if (options.failGet) throw new Error('blocked');
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (options.failSet) throw new Error('quota');
      values.set(key, value);
    },
    value(key = REVIEW_STORAGE_KEY) { return values.get(key); },
  };
}

test('constants expose bounded review vocabularies', () => {
  assert.equal(REVIEW_SCHEMA_VERSION, 1);
  assert.equal(REVIEW_APPLICATION, 'PhysMath Knowledge Tree');
  assert.equal(MAX_REVIEW_IMPORT_BYTES, 2_000_000);
  assert.equal(MAX_REVIEW_RECORDS, 10_000);
  assert.deepEqual([...REVIEW_STATUSES], ['unreviewed', 'verified', 'needs-follow-up', 'superseded']);
  assert.deepEqual([...SOURCE_CLASSES], ['unknown', 'primary', 'secondary', 'official']);
  assert.deepEqual([...IDENTIFIER_KINDS], ['doi', 'arxiv', 'isbn', 'other']);
});

test('reference registry normalization is deterministic and strict', () => {
  const normalized = normalizeReferenceRegistry(registryFixture());
  assert.deepEqual(normalized.references[0].scopes, ['claim', 'formalization']);
  assert.deepEqual(normalized.references[0].used_by, ['edge:edge.alpha.beta', 'node:domain.alpha']);
  assert.throws(() => normalizeReferenceRegistry(null), /must be an object/);
  assert.throws(() => normalizeReferenceRegistry({}), /references must be an array/);
  assert.throws(() => normalizeReferenceRegistry({ references: [null] }), /Reference 0 must be an object/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], url: ' spaced ' }] }), /normalized URL/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], url: 'not a url' }] }), /absolute URL/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], url: 'ftp://example.org/x' }] }), /HTTP\(S\)/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], url: 'https://user:pass@example.org/x' }] }), /HTTP\(S\)/);
  assert.throws(() => normalizeReferenceRegistry({ references: [registryFixture().references[0], registryFixture().references[0]] }), /Duplicate reference URL/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], label: ' ' }] }), /needs a label/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], type: 'Bad Type' }] }), /invalid type/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], scopes: null }] }), /at least one scope/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], scopes: [] }] }), /at least one scope/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], scopes: ['claim', 'mystery'] }] }), /invalid scope/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], used_by: null }] }), /used_by must be an array/);
  assert.throws(() => normalizeReferenceRegistry({ references: [{ ...registryFixture().references[0], used_by: ['invalid'] }] }), /invalid usage target/);
});

test('publication identifiers are inferred only from recognizable URL shapes', () => {
  assert.equal(inferPublicationIdentifier('not a url'), null);
  assert.equal(inferPublicationIdentifier('https://doi.org/'), null);
  assert.deepEqual(inferPublicationIdentifier('https://doi.org/10.1000/Example'), { kind: 'doi', value: '10.1000/Example' });
  assert.deepEqual(inferPublicationIdentifier('https://dx.doi.org/10.5555/test'), { kind: 'doi', value: '10.5555/test' });
  assert.deepEqual(inferPublicationIdentifier('https://arxiv.org/abs/2401.12345'), { kind: 'arxiv', value: '2401.12345' });
  assert.deepEqual(inferPublicationIdentifier('https://www.arxiv.org/pdf/math/0601234.pdf'), { kind: 'arxiv', value: 'math/0601234' });
  assert.equal(inferPublicationIdentifier('https://arxiv.org/list/math/new'), null);
  assert.deepEqual(inferPublicationIdentifier('https://link.springer.com/book/10.1007/978-1-234-56789-0'), { kind: 'doi', value: '10.1007/978-1-234-56789-0' });
  assert.equal(inferPublicationIdentifier('https://example.org/book'), null);
});

test('review ledgers normalize bounded records and newest duplicates', () => {
  assert.deepEqual(createReviewLedger(now), { schema_version: 1, updated_at: now, reviews: [] });
  assert.throws(() => createReviewLedger('bad date'), /updated_at/);
  const urls = validUrls();
  const input = {
    schema_version: 1,
    updated_at: 'bad',
    reviews: [
      review('https://doi.org/10.1000/example', { updated_at: now }),
      review('https://doi.org/10.1000/example', { status: 'needs-follow-up', updated_at: later, notes: 'newest' }),
      review('https://example.org/book', {
        status: 'BAD', source_class: 'BAD', checked_at: 'bad',
        identifier: { kind: 'bad', value: 'x' }, notes: `  ${'n'.repeat(12_100)}  `,
      }),
      review('https://unknown.example/source'),
      null,
    ],
  };
  const normalized = normalizeReviewLedger(input, urls, now);
  assert.equal(normalized.updated_at, now);
  assert.equal(normalized.reviews.length, 2);
  assert.equal(normalized.reviews[0].status, 'needs-follow-up');
  const book = normalized.reviews.find(({ url }) => url === 'https://example.org/book');
  assert.equal(book.status, 'unreviewed');
  assert.equal(book.source_class, 'unknown');
  assert.equal(book.checked_at, null);
  assert.equal(book.identifier, null);
  assert.equal(book.notes.length, 12_000);
  assert.deepEqual(normalizeReviewLedger(null, urls, now), createReviewLedger(now));
  assert.deepEqual(normalizeReviewLedger({ schema_version: 2, reviews: [] }, urls, now), createReviewLedger(now));
  assert.deepEqual(normalizeReviewLedger({ schema_version: 1, reviews: null }, urls, now), createReviewLedger(now));
});

test('load and save tolerate unavailable browser storage', () => {
  const urls = validUrls();
  assert.equal(loadReviewLedger(storage(), urls).reviews.length, 0);
  assert.equal(loadReviewLedger(storage('{bad'), urls).reviews.length, 0);
  assert.equal(loadReviewLedger(storage(null, { failGet: true }), urls).reviews.length, 0);
  const ledger = { schema_version: 1, updated_at: now, reviews: [review('https://doi.org/10.1000/example')] };
  const store = storage();
  const saved = saveReviewLedger(store, ledger, urls, later);
  assert.equal(saved.updated_at, later);
  assert.equal(JSON.parse(store.value()).reviews.length, 1);
  assert.equal(saveReviewLedger(storage(null, { failSet: true }), ledger, urls, later).reviews.length, 1);
  assert.throws(() => saveReviewLedger(store, ledger, urls, 'bad'), /updated_at/);
});

test('review exports, imports and file checks reject incompatible payloads', () => {
  const urls = validUrls();
  const ledger = { schema_version: 1, updated_at: now, reviews: [review('https://doi.org/10.1000/example')] };
  const exported = exportReviewLedger(ledger, urls, later);
  const parsed = JSON.parse(exported);
  assert.equal(parsed.application, REVIEW_APPLICATION);
  assert.equal(parsed.exported_at, later);
  assert.equal(importReviewLedger(exported, urls, later).reviews.length, 1);
  assert.equal(importReviewLedger(JSON.stringify(ledger), urls, later).reviews.length, 1);
  assert.throws(() => exportReviewLedger(ledger, urls, 'bad'), /export date/);
  assert.throws(() => importReviewLedger(null, urls), /must be text/);
  assert.throws(() => importReviewLedger('x'.repeat(MAX_REVIEW_IMPORT_BYTES + 1), urls), /size limit/);
  assert.throws(() => importReviewLedger('null', urls), /JSON object/);
  assert.throws(() => importReviewLedger(JSON.stringify({ application: 'Other', schema_version: 1, ledger }), urls), /another application/);
  assert.throws(() => importReviewLedger(JSON.stringify({ application: REVIEW_APPLICATION, schema_version: 2, ledger }), urls), /export schema/);
  assert.throws(() => importReviewLedger(JSON.stringify({ application: REVIEW_APPLICATION, schema_version: 1, ledger: null }), urls), /ledger must be an object/);
  assert.throws(() => importReviewLedger(JSON.stringify({ schema_version: 2, reviews: [] }), urls), /ledger schema/);
  assert.throws(() => importReviewLedger(JSON.stringify({ schema_version: 1, reviews: null }), urls), /ledger schema/);
  assert.throws(() => importReviewLedger(JSON.stringify({ schema_version: 1, reviews: [review('https://unknown.example/source')] }), urls), /does not contain references/);
  assert.equal(importReviewLedger(JSON.stringify({ schema_version: 1, reviews: [null, review('https://doi.org/10.1000/example')] }), urls, later).reviews.length, 1);

  assert.equal(validateReviewFile({ size: 10, name: 'reviews.json', type: 'application/json; charset=utf-8' }), true);
  assert.equal(validateReviewFile({ size: 10, name: '', type: '' }), true);
  assert.equal(validateReviewFile({ size: 10, name: 'reviews.JSON', type: 'application/vnd.test+json' }), true);
  assert.throws(() => validateReviewFile(null), /Invalid review file/);
  assert.throws(() => validateReviewFile({ size: Number.NaN }), /Invalid review file/);
  assert.throws(() => validateReviewFile({ size: -1 }), /Invalid review file/);
  assert.throws(() => validateReviewFile({ size: MAX_REVIEW_IMPORT_BYTES + 1 }), /size limit/);
  assert.throws(() => validateReviewFile({ size: 10, name: 'reviews.txt' }), /filename/);
  assert.throws(() => validateReviewFile({ size: 10, name: 'reviews.json', type: 'image/png' }), /JSON-compatible/);
});

test('merge, upsert and removal preserve the newest canonical record', () => {
  const urls = validUrls();
  const left = { schema_version: 1, updated_at: now, reviews: [review('https://doi.org/10.1000/example', { notes: 'left', updated_at: later })] };
  const right = { schema_version: 1, updated_at: now, reviews: [
    review('https://doi.org/10.1000/example', { notes: 'older', updated_at: now }),
    review('https://example.org/book', { identifier: null, updated_at: now }),
  ] };
  let merged = mergeReviewLedgers(left, right, urls, later);
  assert.equal(merged.reviews.find(({ url }) => url.includes('doi.org')).notes, 'left');
  assert.equal(merged.reviews.length, 2);
  merged = mergeReviewLedgers(right, left, urls, later);
  assert.equal(merged.reviews.find(({ url }) => url.includes('doi.org')).notes, 'left');
  merged = mergeReviewLedgers(left, { ...right, reviews: [review('https://doi.org/10.1000/example', { notes: 'tie incoming', updated_at: later })] }, urls, later);
  assert.equal(merged.reviews[0].notes, 'tie incoming');

  let next = upsertReview(createReviewLedger(now), review('https://doi.org/10.1000/example'), urls, later);
  assert.equal(next.reviews[0].updated_at, later);
  next = upsertReview(next, { url: 'https://doi.org/10.1000/example', status: 'superseded' }, urls, later);
  assert.equal(next.reviews[0].status, 'superseded');
  assert.throws(() => upsertReview(next, null, urls, later), /not present/);
  assert.throws(() => upsertReview(next, { url: 'https://unknown.example' }, urls, later), /not present/);
  next = removeReview(next, 'https://doi.org/10.1000/example', urls, later);
  assert.equal(next.reviews.length, 0);
  assert.throws(() => removeReview(next, 'x', urls, 'bad'), /updated_at/);
});

test('worklists rank, filter and sort canonical references deterministically', () => {
  const registry = registryFixture();
  const urls = validUrls();
  const ledger = normalizeReviewLedger({
    schema_version: 1,
    updated_at: later,
    reviews: [
      review('https://doi.org/10.1000/example', { status: 'verified', updated_at: later }),
      review('https://arxiv.org/abs/2401.12345', { status: 'needs-follow-up', source_class: 'secondary', identifier: { kind: 'arxiv', value: '2401.12345' }, notes: 'Check theorem scope.', updated_at: now }),
      review('https://example.org/docs', { status: 'superseded', source_class: 'official', identifier: { kind: 'other', value: 'docs-v1' }, updated_at: later }),
    ],
  }, urls, later);

  const priority = buildEvidenceWorklist(registry, ledger);
  assert.equal(priority.length, 4);
  assert.equal(priority[0].status, 'needs-follow-up');
  assert.equal(priority.find(({ reference }) => reference.url.includes('/book')).identifier_missing, true);
  assert.equal(priority.find(({ reference }) => reference.url.includes('doi.org')).formalization_bearing, true);
  assert.equal(priority.find(({ reference }) => reference.url.includes('arxiv')).context_only, true);
  assert.equal(priority.find(({ reference }) => reference.url.endsWith('/docs')).identifier_missing, false);

  assert.deepEqual(buildEvidenceWorklist(registry, ledger, { query: 'theorem primary', status: 'verified' }).map((item) => item.reference.label), ['Primary theorem paper']);
  assert.deepEqual(buildEvidenceWorklist(registry, ledger, { query: 'check scope', status: 'needs-follow-up' }).map((item) => item.reference.label), ['Context survey']);
  assert.equal(buildEvidenceWorklist(registry, ledger, { scope: 'context' }).length, 1);
  assert.equal(buildEvidenceWorklist(registry, ledger, { type: 'book' }).length, 1);
  assert.equal(buildEvidenceWorklist(registry, ledger, { usage: 'node' }).length, 3);
  assert.equal(buildEvidenceWorklist(registry, ledger, { usage: 'edge' }).length, 3);
  assert.equal(buildEvidenceWorklist(registry, ledger, { usage: 'mixed' }).length, 2);
  assert.equal(buildEvidenceWorklist(registry, ledger, { usage: 'none' }).length, 0);
  assert.equal(buildEvidenceWorklist(registry, ledger, { limit: 0 }).length, 0);
  assert.equal(buildEvidenceWorklist(registry, ledger, { limit: 2 }).length, 2);
  assert.equal(buildEvidenceWorklist(registry, ledger, { sort: 'usage' })[0].reference.label, 'Reference book');
  assert.equal(buildEvidenceWorklist(registry, ledger, { sort: 'label' })[0].reference.label, 'Context survey');
  assert.equal(buildEvidenceWorklist(registry, ledger, { sort: 'status' })[0].status, 'unreviewed');
  assert.equal(buildEvidenceWorklist(registry, ledger, { sort: 'updated' })[0].updated_at, later);
  assert.throws(() => buildEvidenceWorklist(registry, ledger, null), /options must be an object/);
  assert.throws(() => buildEvidenceWorklist(registry, ledger, { sort: 'bad' }), /Unknown evidence worklist sort/);
  assert.throws(() => buildEvidenceWorklist(registry, ledger, { limit: -1 }), /non-negative integer/);
  assert.throws(() => buildEvidenceWorklist(registry, ledger, { limit: 1.5 }), /non-negative integer/);
});

test('summary and review packets expose review state without promoting evidence', () => {
  const registry = registryFixture();
  const urls = validUrls();
  const ledger = normalizeReviewLedger({
    schema_version: 1,
    updated_at: later,
    reviews: [
      review('https://doi.org/10.1000/example', { status: 'verified' }),
      review('https://arxiv.org/abs/2401.12345', { status: 'needs-follow-up', identifier: { kind: 'arxiv', value: '2401.12345' } }),
      review('https://example.org/docs', { status: 'superseded', source_class: 'official', identifier: { kind: 'other', value: 'docs-v1' } }),
    ],
  }, urls, later);
  const summary = summarizeEvidenceReviews(registry, ledger);
  assert.deepEqual(summary.by_status, { unreviewed: 1, verified: 1, 'needs-follow-up': 1, superseded: 1 });
  assert.equal(summary.total, 4);
  assert.equal(summary.reviewed, 3);
  assert.equal(summary.claim_bearing, 3);
  assert.equal(summary.formalization_bearing, 1);
  assert.equal(summary.high_impact_unreviewed, 1);
  assert.equal(summary.recognized_identifiers, 3);
  assert.deepEqual(summary.source_types, ['book', 'official', 'paper', 'survey']);

  const packet = buildReviewPacket(registry, ledger, [
    'https://example.org/book',
    'https://doi.org/10.1000/example',
    'https://unknown.example',
    'https://example.org/book',
  ], later);
  assert.equal(packet.reference_count, 2);
  assert.equal(packet.references[0].reference.url, 'https://doi.org/10.1000/example');
  assert.equal(packet.references[1].review, null);
  assert.equal(packet.application, REVIEW_APPLICATION);
  assert.equal(packet.generated_at, later);
  assert.throws(() => buildReviewPacket(registry, ledger, [], later), /at least one canonical reference/);
  assert.throws(() => buildReviewPacket(registry, ledger, ['https://unknown.example'], later), /at least one canonical reference/);
  assert.throws(() => buildReviewPacket(registry, ledger, ['https://doi.org/10.1000/example'], 'bad'), /packet date/);
});

test('fallback timestamps, optional filenames and comparator ties stay deterministic', () => {
  const urls = validUrls();
  const missingTimestamp = normalizeReviewLedger({
    schema_version: 1,
    updated_at: now,
    reviews: [{ url: 'https://example.org/docs', status: 'verified' }],
  }, urls, later);
  assert.equal(missingTimestamp.reviews[0].updated_at, later);
  assert.equal(validateReviewFile({ size: 0, type: 'application/json' }), true);

  const tieRegistry = {
    schema_version: '1.0.0',
    graph_schema_version: '0.6.0',
    references: [
      { url: 'https://example.org/a', label: 'Same', type: 'official', scopes: ['claim'], used_by: ['node:domain.a'] },
      { url: 'https://example.org/b', label: 'Same', type: 'official', scopes: ['claim'], used_by: ['node:domain.b'] },
      { url: 'https://example.org/c', label: 'Alpha', type: 'official', scopes: ['claim'], used_by: ['node:domain.c'] },
      { url: 'https://example.org/d', label: 'Beta', type: 'official', scopes: ['claim'], used_by: ['node:domain.d'] },
    ],
  };
  const empty = createReviewLedger(now);
  assert.deepEqual(
    buildEvidenceWorklist(tieRegistry, empty, { sort: 'label' }).slice(-2).map((item) => item.reference.url),
    ['https://example.org/a', 'https://example.org/b'],
  );
  assert.deepEqual(
    buildEvidenceWorklist(tieRegistry, empty, { sort: 'status' }).map((item) => item.reference.label),
    ['Alpha', 'Beta', 'Same', 'Same'],
  );
  assert.deepEqual(
    buildEvidenceWorklist(tieRegistry, empty, { sort: 'priority' }).map((item) => item.reference.label),
    ['Alpha', 'Beta', 'Same', 'Same'],
  );
});
