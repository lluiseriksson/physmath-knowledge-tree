# Hardening round 3 - evidence routing, linked data and atomic artifacts

Base commit: `163a1cb02279e1690c5fbdf2cbb97b52303a340b`.

This change set keeps application metadata at `2.6.0` and does not alter graph claims, confidence labels, curation decisions or Lean theorems.

## Product improvements

- The research application can optimize routes for fewest edges, a balanced risk/length objective or strongest available evidence.
- Formal-only and sourced-only gates are hard constraints, not visual filters.
- Route state is shareable through canonical URL parameters and restores through browser history.
- The CLI can emit one route or compare all policies in Markdown or JSON.
- The route engine uses deterministic Pareto-frontier labels. Cycles are pruned by monotone metrics, invalid options are rejected and every canonical node pair can be evaluated without reaching the safety ceiling.
- Browser and CLI outputs retain edge IDs, mechanisms, confidence labels and scoped references without promoting them.

## Interoperability

- Nodes, edges, research moves and collections have a deterministic JSON-LD projection with stable HTTP(S) IRIs.
- The projection rejects duplicate entities, dangling endpoints, unknown collection members and application/schema drift.
- The canonical projection is committed, linked from both application pages, available as `application/ld+json` and checked for staleness.

## Delivery and offline integrity

- Builds are completed in staging and published atomically, preserving the prior `dist/` on failure.
- Build-manifest format 3 closes the artifact over exact paths, sizes, per-file hashes, total bytes, entity count and an aggregate SHA-256.
- The static server and build share one explicit public-surface declaration; repository scripts, tests and package metadata are not exposed.
- Service-worker shell and runtime caches are separated, content-addressed and bounded. Query variants share canonical keys, while range, redirect, opaque, partial and unsuccessful responses are excluded.

## Maintenance gates

- English/Spanish dictionaries must have identical keys and interpolation variables.
- Every static `data-i18n` hook must exist in both languages.
- PWA metadata now validates shortcuts, screenshots, shell dependencies and cache policy.
- The Chromium product smoke covers evidence routes, JSON-LD export, public-surface denial, canonical history, cache identity and real offline fallback.

## Boundaries

The planner ranks routes inside the repository's declared graph; it does not discover new mathematics or certify the truth of an edge. JSON-LD improves interoperability but does not turn heuristic or speculative mechanisms into sourced claims. The build manifest certifies delivered bytes, not scientific validity.
