# Verification record

Date: **2026-06-23**

Release: **2.6.0**

Local environment: **Node 22.12.0**, **npm 10.9.0**, Windows x64, **Chrome/149.0.7827.155**.

## Complete quality gate

A clean dependency install and the complete deterministic gate passed:

```bash
npm ci
npm run check
```

Validated:

- JavaScript syntax: **47 files**;
- canonical research graph: **58 nodes, 112 edges, 23 research moves and 8 collections**;
- graph topology: **1 connected component, 0 isolated nodes and 58/58 nodes reachable from roots**;
- scoped reference coverage: **58/58 nodes and 112/112 edges**;
- source-bearing coverage: **55/55 formal/literature nodes and 95/95 formal/literature edges** with a `claim` or `formalization` source;
- normalized reference registry: **56 unique URLs** with deterministic use-site lists;
- curation ledger: **3 records, 3 unique source hashes and 45 atomic decisions**;
- intentionally open curation state: **18 verification requests and 3 user-review gates**;
- bilingual learning graph: **90 topics, 199 prerequisite edges, 1 root and maximum depth 15**;
- local links, Markdown targets, CSP invariants and service-worker assets across **4 pages**;
- static accessibility invariants across **4 pages**;
- PWA shell: application version **2.6.0** with **32 cached entries** and a dedicated offline fallback;
- **5 generated research views**;
- automated evaluation: **14/14 top-1 search regressions** and **5/5 route scenarios**;
- repository-controlled quality score: **100/100**, subject to the exclusions in `docs/QUALITY_SCORECARD.md`;
- workflow hardening: **3 workflows and 12 SHA-pinned external action uses**;
- automated unit/integration tests: **58 passed, 0 failed**;
- line coverage: **100.00%** for the explicit instrumented production set;
- branch coverage: **100.00%**;
- function coverage: **100.00%**;
- static production build: **86 files total**, with **85 payload entries** verified byte-for-byte against `dist/build-manifest.json`;
- real Chromium smoke pass over the built `dist/` artifact.

`npm audit --audit-level=low` reported **0 vulnerabilities**. The independent Python graph validator also passed.

## Browser verification

The dependency-free browser runner exercised the production artifact with Chrome/149.0.7827.155:

```bash
npm run build
npm run test:e2e
```

The passing flow verified:

- research graph: **58 nodes and 112 edges**;
- Riemann search, dossier opening and shareable URL state;
- list view: **58 cards**;
- Spanish interface switch;
- a two-node number-theory-to-Riemann path;
- learning graph: **90 graph nodes and 90 list cards**;
- Spanish search and details for general relativity;
- persisted `mastered` state in browser storage;
- runtime accessibility invariants for both dynamic applications;
- service-worker control and the offline fallback page;
- no uncaught exception, console error or same-origin HTTP failure.

See `docs/BROWSER_TESTING.md` for the exact scope and exclusions.

## Reproducible cases

The scenario registry and one full constructive Yang–Mills route can be executed with:

```bash
npm run usecase:list
npm run usecase -- route.target_sensitive_yang_mills
```

A throughput sample can be run with `ITERATIONS=200 npm run benchmark:evaluation`. Timing is machine-dependent and is not committed as a universal performance claim.

## Curated-source verification

Raw source documents are not copied into the repository. A local original can be rechecked against its ledger entry with:

```bash
npm run curation:verify-source -- ./path/to/source.txt
npm run curation:report
```

All three deletion gates remain awaiting explicit user review. No raw original is declared safe to delete merely because extraction succeeded.

## Lean layer

The repository retains its pinned Lean 4.31.0/mathlib configuration and proof-bearing microtheorems. **No completed local Lean build is claimed for this release pass.** The pinned GitHub Actions job remains configured to run `lake build --wfail` and `mk_all` through `leanprover/lean-action`.

The formal layer contains microtheorem targets for rate-budget bookkeeping, physical/lattice exponent conversion, target-erasure detection, finite nonselective-operation collapse, child-factorial products and localized homotopy boundary defects. These finite results do not formalize the surrounding open research programmes.

## External-network boundary

External reference URLs are schema-validated and normalized. The deterministic gate intentionally does not require live remote HTTP checks, because publisher availability, bot protection and network access are not reproducible build inputs.

## Interpretation boundary

This record verifies the delivered software, data invariants and generated artifacts. It does not certify publication novelty, external adoption, user-study outcomes or the scientific truth of heuristic and speculative mechanisms. Those exclusions are listed in `docs/LIMITATIONS.md` and `docs/QUALITY_SCORECARD.md`.
