# Coverage gate

The repository has a reproducible coverage gate for dependency-free production logic that can be exercised deterministically under Node.js.

```bash
npm run test:coverage
```

The cross-platform runner uses Node's built-in test coverage and exits non-zero unless **lines, branches and functions all remain at 100%**. The explicit allowlist is:

- `scripts/lib/atomic-publish.mjs`
- `scripts/lib/build-manifest.mjs`
- `scripts/lib/curation.mjs`
- `scripts/lib/evaluation.mjs`
- `scripts/lib/fs-safety.mjs`
- `scripts/lib/i18n-validation.mjs`
- `scripts/lib/public-surface.mjs`
- `scripts/serve.mjs`
- `src/data/topics.js`
- `src/lib/graph.js`
- `src/lib/jsonld.js`
- `src/lib/research-graph.js`
- `src/lib/route-planner.js`
- `src/lib/search.js`
- `src/lib/storage.js`
- `src/lib/text.js`
- `src/lib/url-state.js`

The allowlist is deliberate. Browser entry modules are exercised against the built artifact by the real Chromium smoke suites rather than being presented as Node unit coverage. See [`docs/BROWSER_TESTING.md`](./BROWSER_TESTING.md).

Regression cases include:

- canonical graph, curation and evaluation invariants;
- Unicode-aware deterministic search and graph ordering;
- evidence-aware routes, Pareto-frontier pruning, hard evidence gates and finite search limits;
- canonical JSON-LD generation and validation of linked endpoints and collections;
- bilingual catalog parity and static translation-hook coverage;
- strict progress imports and blocked/corrupt browser storage;
- public-surface enforcement, traversal rejection and symlink/junction containment;
- atomic artifact publication, closed manifest schema and aggregate SHA-256 identity;
- bounded service-worker runtime caching and offline navigation behavior.

A coverage percentage proves that the selected executable branches were exercised. It does not certify scientific claims, browser interoperability, usability or publication novelty.
