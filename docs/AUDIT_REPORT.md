# Current repository audit

Audit date: **2026-06-22**
Target release: **2.4.0**

## Baseline

The audited source is the complete 2.3.0 research/learning application plus all three curated source ledgers. The public `main` history was also checked; this delivery remains a complete source archive and does not assume that every locally curated release has already been pushed.

## Findings corrected in 2.4.0

1. **Stale release metadata:** the README still reported the 2.2 graph counts, the Lean metadata declared graph schema 0.2.0 while canonical JSON declared 0.4.0, and the service-worker cache name still contained `v2-1`.
2. **Invisible evidence debt:** most literature/formal edges had mechanisms but no direct reference object. A deterministic graph audit now records direct-reference coverage, topology and the exact citation queue instead of hiding it.
3. **PNG curation gap:** the documented crop protocol had no machine-readable image-region schema. Curation 1.1 added bounded pixel regions, captions, alt text and transformation history; schema 1.2 adds an explicit user-review gate.
4. **No source re-verification command:** a local original can now be checked against its recorded SHA-256, byte count, text line count or PNG dimensions without copying it into Git.
5. **No deletion-gate overview:** the generated curation report summarizes status, retention, decision anchors and unresolved source requests.
6. **PWA cache/fallback weaknesses:** navigation with query parameters could miss cached routes and fall back to the wrong application. Cache writes were not awaited. The service worker is now version-aligned, route-aware and has a dedicated offline page.
7. **Import/storage hardening:** progress imports had no size/type guard and storage-write failures could escape. Imports are capped and validated; blocked/quota-exhausted storage no longer breaks the app.
8. **Accessibility maintenance debt:** static pages did not consistently declare button types or drawer relationships, and interactive drawers/details lacked reliable focus return. Static accessibility checks and focus management were added.
9. **Unverifiable build contents:** the static artifact now includes a deterministic SHA-256 build manifest and a post-build verifier.
10. **Historical audit drift:** the previous audit report described the 2.0 delivery counts as if they were current. Current counts and remaining debt are generated from canonical data.

## Current graph status

The canonical graph contains **58 nodes, 112 edges, 23 research moves and 8 collections** in one weakly connected component. All 58 nodes are reachable from the declared roots and none is isolated.

Direct citations remain an explicit maintenance frontier. See [`GRAPH_AUDIT.md`](./GRAPH_AUDIT.md); citation debt is not treated as proof failure, but it must be paid before upgrading evidence labels or making source-specific claims.

## Deliberate boundaries

- The bridge-card generator produces research scaffolding, never a theorem.
- Lean metadata identifies bounded targets; it does not formalize whole literature claims.
- Curation records preserve provenance and decisions, not the raw private archive.
- The local environment may validate the web/data layer without possessing `lake`; Lean results are claimed only when actually run.
- No backend, analytics, account, tracking or remote runtime dependency is introduced.
