# Release 2.4.0 — integrity, curation and offline hardening

Date: **2026-06-22**

This release consolidates the complete research graph, bilingual learning map and all three curated-source ledgers into one reproducible source archive.

## Main improvements

- deterministic topology and evidence audit for the canonical graph;
- curation schema 1.2.0 with TXT/Markdown/PNG verification, bounded image regions, explicit user approval and a conservative deletion gate;
- generated curation report exposing every unresolved primary-source request;
- route-aware PWA caching, dedicated offline fallback and version-scoped cache cleanup;
- deterministic build manifest with SHA-256 and byte-size verification of a closed artifact set;
- import-size/type validation, resilient browser storage and hardened static-server headers;
- keyboard navigation, focus return, accessible search names and explicit progress semantics;
- SHA-pinned GitHub Actions, least-privilege permissions and checkout credential hardening;
- synchronized application, graph-schema, curation-schema, Lean metadata and service-worker versions.

## Verified release facts

- research graph: **58 nodes, 112 edges, 23 moves, 8 collections**;
- topology: **1 connected component, 0 isolated nodes, 58/58 root-reachable**;
- learning graph: **90 topics and 199 prerequisite edges**;
- curation: **3 records, 45 decisions, 18 open source-verification requests, 3 pending user reviews**;
- automated tests: **33 passed, 0 failed**;
- production build: **70 files**, each verified against `dist/build-manifest.json`;
- dependency audit: **0 known npm vulnerabilities**.

## Deliberate boundaries

The release does not claim that all literature-labelled claims have direct primary citations; citation debt is listed in `docs/GRAPH_AUDIT.md`. It does not declare any original source safe to delete without explicit user approval and a closed verification queue. The local release environment did not provide `lake`, so no local Lean build is claimed. Browser-level end-to-end execution was unavailable in the release environment; UI confidence comes from unit tests, static accessibility/CSP checks and deterministic build validation.
