# Coverage gate

The repository has a reproducible coverage gate for the pure graph/search/storage/evaluation modules and the dependency-free static server.

```bash
npm run test:coverage
```

The cross-platform runner uses Node's built-in test coverage and exits non-zero unless **lines, branches and functions all remain at 100%**. Its explicit production-file allowlist is:

- `scripts/lib/curation.mjs`
- `scripts/lib/evaluation.mjs`
- `scripts/serve.mjs`
- `src/data/topics.js`
- `src/lib/graph.js`
- `src/lib/research-graph.js`
- `src/lib/search.js`
- `src/lib/storage.js`

Current verified local result (2026-06-22):

```text
Node 22.16.0: 58 passed, 0 failed
Line coverage: 100.00%
Branch coverage: 100.00%
Function coverage: 100.00%
```

The allowlist is deliberate: browser entry modules are exercised by the real Chromium smoke suite rather than being presented as Node unit coverage. See `docs/BROWSER_TESTING.md`.

Regression cases exercise:

- canonical graph integrity and scoped-reference rules;
- search rankings and five research-route evaluation scenarios;
- malformed DAGs, cycles, unknown targets and deterministic tie-breaking;
- traversal and malformed URL rejection through the live HTTP server;
- safe 500 responses for unexpected synchronous filesystem failures;
- validated CLI ports, default request handling and MIME fallback;
- preference persistence and blocked/corrupt browser storage;
- PNG and text-curation boundary conditions;
- coincident force-layout positions without non-finite values.
