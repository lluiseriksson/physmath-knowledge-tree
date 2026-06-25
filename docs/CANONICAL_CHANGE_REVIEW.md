# Canonical Change Review Center

The Canonical Change Review Center is a local-first governance companion for the PhysMath Knowledge Tree. It compares an earlier canonical snapshot with the graph currently deployed by the repository, classifies review-sensitive changes and exports a bounded packet for deliberate human review.

Open `changes.html` from the deployed site or the local development server.

## Why this exists

The research workbench stores exploratory work and the Evidence Review Center records source-checking decisions. Neither should silently mutate canonical graph data. The change reviewer adds the missing pre-promotion boundary:

1. capture a deterministic snapshot of canonical graph data;
2. compare that snapshot with a later graph version;
3. flag edits that deserve explicit repository review;
4. record local accept, needs-work or reject decisions;
5. export selected changes and decisions as JSON or Markdown.

A risk flag is a governance signal, not a scientific verdict. The application never writes `graph/*.json`, promotes confidence, merges a pull request or certifies a mathematical statement.

## Canonical inputs

The reviewer reads the same deployed sources as the research graph:

```text
graph/index.json
graph/nodes/core.json
graph/edges.json
graph/research_moves.json
graph/collections.json
```

Before fingerprinting, entity arrays are validated, deduplicated by stable ID and sorted. Edge endpoints and collection members must refer to nodes present in the same snapshot. Object keys are recursively canonicalized before SHA-256 hashing, so incidental JSON key or entity-array ordering does not create false changes.

## Snapshot workflow

Use **Download current snapshot** before a graph-editing campaign or release. The file records:

- application and snapshot schema identity;
- capture time;
- normalized canonical graph data;
- a SHA-256 fingerprint of that data.

After the canonical graph changes, import the earlier snapshot into `changes.html`. The application verifies the fingerprint before computing the diff. **Use current graph as baseline** is useful for initializing local state or confirming that two normalized copies are identical.

Imports are limited to 8 MB and must use JSON-compatible filenames and media types when the browser provides them.

## Change classes

The reviewer compares discovery metadata, nodes, edges, research moves and collections by stable ID. Each entity is classified as added, removed or modified. Modified entities include field-level before/after records.

Default risk rules include:

- **critical:** node removal, confidence promotion, edge endpoint/relation rewrite, loss of a claim/formalization reference;
- **high:** edge removal, confidence downgrade, Lean target changes, graph contract changes, other reference loss;
- **medium:** edge addition, collection membership changes and substantive mechanism/summary/research-move edits;
- **low/info:** bounded additions and presentation-level changes.

Rules intentionally over-report governance-sensitive changes. They do not infer whether a new source is correct, whether a formal declaration exists, or whether a confidence promotion is justified.

## Local decisions

Every current change starts as `pending`. A reviewer can set:

- `accepted` — acceptable for the reviewed scope;
- `needs-work` — verification, source repair or revision remains;
- `rejected` — the proposed canonical change should not proceed in its current form.

Notes are bounded to 12,000 characters. Decisions are keyed to the exact baseline/current fingerprint pair. When the current graph changes again, stale decisions are discarded rather than reattached to a different diff.

Browser storage is optional. Storage denial or quota exhaustion does not prevent snapshot creation or comparison during the active session.

## Review packets

Select any current changes and export:

- a JSON review bundle containing the verified baseline snapshot, current fingerprint, field diffs, risk flags and local decisions;
- a Markdown packet suitable for an issue, pull request description or review ledger.

Importing a JSON review bundle restores its baseline and decisions only when the bundle targets the exact current graph fingerprint. This prevents an old approval packet from being applied to a newer canonical state.

## Security and privacy

The feature introduces no accounts, analytics, cookies, remote fonts, third-party runtime scripts or cloud synchronization. It uses the repository's restrictive Content Security Policy and reads only same-origin canonical files. No imported file can execute code.

## Verification

The upgrade includes:

- `tests/change-review.test.mjs` for snapshot validation, SHA-256 fingerprints, risk classification, local decisions and portable bundles;
- `tests/change-review-product.test.mjs` for CSP, accessibility and local-only architecture;
- `scripts/browser-smoke-changes.mjs` for the principal Chromium interaction flow;
- inclusion of `src/lib/change-review.js` in the repository's 100% line/branch/function coverage gate.
