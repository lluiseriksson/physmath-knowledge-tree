# Evidence Review Center

The Evidence Review Center is a local-first companion to the canonical research graph. It turns the generated URL-level reference registry into a bounded review queue without changing canonical claims, evidence labels or graph topology.

Open `evidence.html` from the deployed site or local development server.

## Purpose and boundary

The canonical graph already records where each URL is used and whether the reference supports a claim, context or formalization. The review center adds a separate browser-local ledger for work that still requires human judgment:

- whether a source has actually been checked;
- whether it is primary, secondary or official material;
- whether a DOI, arXiv ID, ISBN or other identifier should be recorded;
- whether follow-up or replacement is required;
- when the source was last reviewed and what was observed.

A local review never upgrades a node or edge from heuristic to literature, never certifies a theorem and never edits `graph/reference-registry.json`. Canonical promotion remains an explicit repository review task.

## Canonical inputs

The application reads three deployed files:

```text
graph/reference-registry.json  URL, label, type, scopes and canonical usages
graph/nodes/core.json          titles for node usage targets
graph/edges.json               mechanisms for edge usage targets
```

The registry is normalized before use. Duplicate URLs, malformed scopes, invalid usage IDs and non-HTTP(S) URLs are rejected rather than silently accepted.

## Local review ledger

Each source can have one local review record:

```text
review
├── canonical URL
├── status: unreviewed | verified | needs-follow-up | superseded
├── source class: unknown | primary | secondary | official
├── identifier: DOI | arXiv | ISBN | other
├── checked_at
├── notes
└── updated_at
```

Unknown URLs are discarded during import or normalization. A review therefore cannot drift onto a different source when the canonical registry changes.

## Worklist priority

The default worklist is deterministic and favors sources that are still unreviewed, support claim or formalization scopes and are reused by more canonical items. The displayed priority is a triage aid only. It is not a scientific confidence score, a citation-quality metric or an automatic recommendation to promote evidence.

The queue can be filtered by:

- free-text search over label, URL, type and canonical usage;
- local review status;
- canonical scope;
- source type;
- minimum reuse count;
- priority, label or reuse sorting.

Selected rows can be placed into `needs-follow-up` in one action or exported as a review packet.

## Publication identifiers

The pure review module suggests identifiers only for recognizable URL forms:

- DOI resolver URLs;
- arXiv abstract or PDF URLs;
- URLs containing a conventional DOI path.

Suggestions remain editable. The software does not resolve metadata remotely, infer authors or publication dates, or treat a URL shape as proof that the source is correct.

## Review packets

A selected review packet contains:

- the canonical registry metadata for each URL;
- every canonical node or edge usage;
- the current local review record, when present;
- an explicit statement that the packet does not modify graph confidence.

Packets are intended for offline checking, issue preparation or a later human-reviewed canonical edit.

## Import, merge and export

`Export ledger` writes the complete local review ledger. Import validates:

- application and schema identity;
- a 2 MB size limit;
- JSON-compatible filename and media type when the browser supplies them;
- a maximum of 10,000 review records;
- bounded text and identifier vocabularies;
- canonical URL membership.

Merge mode keeps the newest `updated_at` record per URL. Replace mode replaces the local ledger after validation. Storage denial or quota exhaustion leaves the active in-memory review session usable.

## Privacy and offline behavior

No account, analytics, cookie, remote metadata service or synchronization endpoint is introduced. Review state stays in browser storage unless explicitly exported. The page, its modules and the canonical registry are part of the PWA shell, so the queue remains available after a successful online load.

## Verification

The upgrade includes:

- pure-module tests for registry normalization, identifier suggestions, imports, merges, filters, ranking, summaries and packets;
- static product tests for CSP, accessibility, local-only architecture and responsive behavior;
- a Chromium-family smoke test covering load, filtering, selection, review persistence, bulk follow-up and packet export;
- integration hooks for the repository's 100% production-module coverage gate, public-surface closure, PWA validation and offline fallback tests.
