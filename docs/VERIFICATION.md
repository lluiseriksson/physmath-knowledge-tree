# Verification record

Date: **2026-06-22**

Release: **2.4.0**

## Quality gate

The complete JavaScript, graph, curation and static-site quality gate passed from a clean `npm ci` install:

```text
npm run check
```

Validated:

- JavaScript syntax: 39 files;
- canonical research graph: 58 nodes, 112 edges, 23 research moves and 8 collections;
- graph topology: one connected component, no isolated node and every node reachable from a declared root;
- evidence audit: direct-reference coverage and the unresolved citation queue are recorded in `graph/audit.json` and `docs/GRAPH_AUDIT.md`;
- curation ledger: 3 records, 3 unique source hashes and 45 atomic decisions;
- generated curation deletion-gate report: 23 promoted decisions, 22 quarantined decisions and 18 unresolved source requests;
- bilingual learning graph: 90 topics, 199 prerequisite edges, 1 root and maximum depth 15;
- local links, Markdown targets, CSP invariants and service-worker assets across 4 pages;
- static accessibility invariants across 4 pages;
- PWA shell: application version 2.4.0 with 31 explicitly cached entries and a dedicated offline fallback;
- 5 generated research views;
- evidence hardening: 45 directly referenced edges and 8 formal nodes with named Lean declarations;
- formatting invariants;
- automated tests: 33 passed, 0 failed;
- static production build: 71 files verified byte-for-byte against `dist/build-manifest.json`.

`npm audit --omit=dev` reported **0 vulnerabilities**.

The independent Python graph validator also passed before and after regenerating the Markdown/Mermaid views.

## Curated-source verification

Raw source documents are not copied into the repository. A local original can be rechecked against its ledger entry with:

```bash
npm run curation:verify-source -- ./path/to/source.txt
npm run curation:report
```

Text records retain hashes, byte counts and line anchors. PNG records use bounded pixel regions, captions, alternative text and transformation history. Curation schema 1.2.0 also separates extraction status from explicit user review.

All three current deletion gates remain awaiting explicit user review; no raw original is declared safe to delete merely because extraction succeeded.

## Lean layer

The repository retains its pinned Lean 4.31.0/mathlib configuration and Lean source files. No local Lean pass is claimed in this record. The pinned GitHub Actions job runs `lake build --wfail` and `mk_all` through `leanprover/lean-action`.

On the scientific-hardening commit, GitHub Actions built `PhysMathKnowledgeTree.Formal.Microtheorems` and the root package successfully before the bundled `leanchecker` stage cancelled. Because that cancellation is runner/tooling behavior rather than a Lean build error, `leanchecker` is documented as a manual release-hardening step rather than a required CI gate.

The current formal layer includes checked microtheorem targets for six graph mechanisms: rate-budget bookkeeping, physical/lattice exponent conversion, target-erasure detection, finite nonselective-operation collapse, child-factorial products and localized homotopy boundary defects.

## Reproducibility boundary

This record verifies the delivered web/data artifact and its generated files. It does not certify every mathematical statement as a theorem. Formal, literature, heuristic and speculative evidence classes remain distinct, and unresolved citations are surfaced rather than treated as verified.

## Browser execution boundary

Browser-level end-to-end execution was not available in the release environment. UI behavior is covered by unit tests, static accessibility/CSP/PWA checks and deterministic artifact verification; this record does not claim a local Playwright or Chromium end-to-end pass.
