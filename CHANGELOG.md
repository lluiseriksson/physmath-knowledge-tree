# Changelog

All notable changes are documented here. The project follows semantic versioning for its application and schema releases.

## [Unreleased]

### Added

- A `test:coverage` quality gate that fails below 100% line coverage for the instrumented Node-tested modules.
- Regression tests for malformed/traversal requests, safe 500 responses, preference-storage failures and coincident graph-layout points.

### Changed

- The complete `npm run check` gate now enforces line coverage instead of running the non-threshold test command.
- Static-server startup is exposed through testable helpers and reports the actual ephemeral port when `PORT=0`.

### Fixed

- The development server no longer logs port `0` after the operating system assigns an ephemeral port.

## [2.4.0] — 2026-06-22

Release notes: [`docs/RELEASE_2_4_0.md`](./docs/RELEASE_2_4_0.md).

### Added

- Curation schema 1.2 with machine-readable PNG crop regions, explicit user-review state and a conservative deletion gate.
- Local source re-verification, UTF-8/PNG structural checks and a deterministic curation deletion-gate report.
- Deterministic graph integrity/evidence audit with explicit citation debt.
- Direct references for 45 high-value graph edges across Millennium-problem routes, constructive RG/polymer mechanisms and AQFT/QI bridges.
- Lean microtheorems for exact rate-budget algebra, physical/lattice exponent conversion, target-erasure detection, finite nonselective-operation collapse, child-factorial congruence and localized homotopy boundary defects.
- Static accessibility, PWA shell and SHA-pinned workflow validators.
- Dedicated offline page, route-aware service-worker fallback and version-aligned cache.
- Deterministic SHA-256 build manifest with post-build verification.
- Progress-import size/type limits and storage-failure resilience.

### Changed

- Release, graph-count, Lean metadata and service-worker versions are synchronized.
- Drawer/detail focus management, accessible search names, progress semantics and keyboard graph navigation are improved.
- Edge schema now accepts direct reference objects for incremental citation-debt reduction.
- Formal graph nodes now link to named declarations in `PhysMathKnowledgeTree/Formal/Microtheorems.lean`.
- The complete quality gate validates generated audits, pinned workflow dependencies and the built artifact.

### Fixed

- README and historical audit count drift.
- Query-string cache misses falling back from the learning map to the research page.
- Immediate object-URL revocation during progress export.

## [2.3.0] — 2026-06-22

### Added

- Curated provenance, mathematical extract, source queue and quarantine report for `ideas3(8).txt`.
- Algebraic QFT and quantum-information domains; vacuum nonfactorization, no-signalling, CMI recovery and Gaussian Markov-blanket bridges.
- Exact rooted-tree Catalan closure, localized-homotopy boundary defect and four-dimensional Yang–Mills marginality bridges.
- Research moves for parent-kernel normalization, exact generating-function closure, separator conditioning, uniform recovery and homotopy localization.
- AQFT locality/recovery collection and proof playbook.

### Changed

- Research graph expanded to 58 nodes, 112 edges, 23 moves and 8 collections.
- The target-sensitive Appendix-F playbook now distinguishes the exact Catalan closure from the robust `4^n` fallback.

### Verification

- Three curation records and all promoted destinations are included in the quality gate.

## [2.2.0] — 2026-06-22

### Added

- Curated provenance, mathematical extract and quarantine report for `ideas 2(4).txt`.
- Polymer/cluster-expansion domain and four target-sensitive Appendix-F bridge nodes.
- Research moves for preserving exact targets, eliminating tree leaves and auditing information loss.
- Focused target-sensitive cluster collection and proof playbook.
- Hypothesis-reduction checks in the agent protocol.

### Changed

- Research graph expanded to 49 nodes, 94 edges, 18 moves and 7 collections.
- Cluster-expansion and Yang-Mills RG targets now separate the model-independent second gas from the concrete gauge activity producer.

### Verification

- Both curation records and every promoted destination are validated by the quality gate.

## [2.1.0] — 2026-06-22

### Added

- Deletion-safe TXT/Markdown/PNG curation workflow with SHA-256 records, line ranges, promotion, quarantine and discard decisions.
- Registration and validation scripts that never copy raw sources into the repository.
- Curated mathematical extract and quarantine report for `ideas(12).txt`.
- Constructive QFT and renormalization-group domains; five reusable bridges; one concrete Yang-Mills RG subproblem.
- Three research moves: cancel before majorizing, separate support roles and rescale physical units.
- Constructive Yang-Mills RG curated collection.

### Changed

- Research graph expanded to 44 nodes, 81 edges, 15 moves and 6 collections.
- Static builds now include documentation and curation provenance.

### Verification

- New curation validator checks hashes, ranges, record uniqueness and destination integrity.

## [2.0.0] — 2026-06-22

### Added

- Canonical research application backed directly by `graph/` JSON.
- 36 evidence-labelled research nodes, 61 typed edges, 12 research moves and 5 curated collections.
- Search, filters, graph/list parity, shortest-path exploration, node dossiers and visible-subgraph export.
- Bridge-card generator with explicit confidence, falsifier and Lean-target fields.
- Stable shareable URL state, bilingual interface, responsive design, dark mode and offline caching.
- Dedicated `learning.html` experience with 90 bilingual topics and 199 prerequisite relations.
- Strict JSON schemas and validation for nodes, edges, moves and collections.
- Deterministic generated Markdown and Mermaid projections with staleness checks.
- Lean 4 ontology package pinned to Lean/mathlib v4.31.0.
- CI matrix, independent Lean job, CodeQL, GitHub Pages deployment and dependency maintenance.
- Agent protocol, ontology, playbooks, deployment guide, citation metadata and dual-license notice.
- Research-aware issue forms, bridge proposal template, CODEOWNERS and expanded pull-request/release governance.

### Changed

- The research graph is now the canonical home page; the learning map remains a complementary route.
- Security policy, service worker, manifest, 404 page and build pipeline cover both applications.
- Documentation now separates formal facts, literature, heuristics and speculation.

### Verification

- Node and graph data validators.
- Syntax, formatting, local-link and CSP checks.
- Unit tests for research graph, search, paths, layout, curriculum, persistence and hardened static-server logic.
- Independent JSON Schema/YAML parsing, npm audit and served-build smoke checks.
- Reproducible static build to `dist/`.

## [1.0.0] — 2026-06-22

- Initial bilingual prerequisite-map application and repository engineering baseline.

## [0.1.0] — 2026-06-22

- Initial research-graph and Lean seed.
