# Delivery and audit report

Audit date: **2026-06-22**

## Baseline reviewed

The repository baseline contained a valuable seed: canonical research JSON, documentation, scripts and a minimal Lean/mathlib package. It did not include a deployable web frontend tied to that canonical graph or a GitHub Pages deployment workflow in the inspected source tree. A separate earlier learning-map package existed, but it duplicated a different 90-topic graph and did not preserve the repository's research/Lean layers.

The public application URL could not be independently fetched from the restricted audit environment. Deployment readiness was therefore assessed from source, workflow configuration, static build output and local browser execution rather than from a live production response.

## Principal risks found

1. **Two disconnected products:** the research graph and educational map had separate data models and no navigation between them.
2. **No canonical web projection:** the research JSON was readable by scripts but not interactively explorable.
3. **Generated-view drift:** Markdown projections had no deterministic staleness gate.
4. **Limited provenance structure:** many graph records had useful mechanisms but few direct reference objects.
5. **Deployment gap:** the inspected baseline did not provide a Pages build/deploy path for the canonical project.
6. **Documentation mismatch:** earlier audit and architecture text described only the learning app and incorrectly characterized the repository as initially empty.
7. **Formal-status ambiguity:** Lean metadata could be mistaken for formalization of the surrounding research claim without a clear boundary.

## Delivered improvements

### Unified product

- Canonical research graph as the home page.
- Learning map retained at `learning.html` and linked bidirectionally.
- Shared theme, manifest, service worker, icons, 404 handling and static build.

### Research functionality

- Search across IDs, titles, summaries, tags and questions.
- Kind, confidence and curated-collection filtering.
- Deterministic SVG graph plus an accessible list alternative.
- Directed/undirected shortest paths and node-neighborhood focus.
- Node dossiers with evidence, references, mechanisms and Lean targets.
- Visible-subgraph JSON export and shareable URL state.
- Bridge-card generator that labels exploratory output and requires a falsifier.

### Data integrity

- 36 canonical research nodes, 61 edges, 12 moves and 5 collections.
- Strict endpoint, identifier, confidence, status, reference and speculative-falsifier validation.
- JSON Schema contracts for each canonical collection.
- Deterministic Markdown/Mermaid generation with a CI staleness check.
- Added provenance/input edges so every canonical node is connected.

### Engineering and governance

- Node 22/24 quality-gate matrix.
- Separate Lean build using pinned Lean/mathlib v4.31.0.
- CodeQL and least-privilege GitHub Pages deployment.
- Agent protocol, ontology, research playbooks, formalization guide and deployment runbook.
- Citation metadata, dual-license notice, maintenance automation and contribution templates specialized for research graph, learning content and Lean changes.
- A structured bridge-proposal issue form requiring IDs, evidence, a translation dictionary, confidence and a falsifier.

## Verification performed

The complete local gate validates:

- research graph counts and cross-file integrity;
- 90 learning topics and 199 prerequisite relations;
- one learning root and maximum prerequisite depth 15;
- JavaScript syntax;
- local application links, CSP restrictions and service-worker assets;
- generated-view freshness and formatting;
- 26 unit tests;
- independent JSON Schema and GitHub YAML parsing;
- zero npm audit findings;
- production build generation and static-server response checks.

Browser smoke tests run both applications from in-memory production-equivalent documents because direct localhost navigation is blocked in this execution environment. The research test verifies startup, all canonical graph nodes, search/details, path discovery, bridge-card safeguards, language switching, list parity and screenshot rendering. The learning test verifies all 90 nodes, Spanish search/details, a persisted progress transition and list parity.

## Deliberate boundaries and remaining checks

- Lean is pinned and configured for CI, but the toolchain is not installed in this container; local `lake build` was therefore not claimed. The dedicated workflow performs that check after push.
- External reference URLs are validated structurally as HTTPS, not exhaustively crawled during every build.
- The bridge-card generator is deterministic scaffolding, not an AI solver and not evidence of a new theorem.
- No backend, analytics, account system, cloud synchronization or third-party runtime resources were added.
