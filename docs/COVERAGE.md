# Coverage gate

The repository has a reproducible line-coverage gate for the modules exercised by the Node test suite.

```bash
npm run test:coverage
```

The command uses Node's built-in test coverage, requires **100% line coverage**, and exits non-zero if the threshold regresses. The current instrumented set includes graph, search, storage, curation and evaluation libraries, curriculum data and the dependency-free static server.

Current verified local result (2026-06-22):

```text
Node 22.16.0: 47 passed, 0 failed
Line coverage: 100.00%
Branch coverage: 89.75%
Function coverage: 97.74%
```

Line coverage is the enforced threshold. Branch and function percentages are reported rather than described as 100%.

Browser entry modules are validated by syntax, accessibility, CSP, PWA and build checks; they are not presented as browser-level end-to-end coverage. No Playwright or Chromium pass is claimed in the local verification record.

Regression cases exercise:

- canonical graph integrity and scoped-reference rules;
- search rankings and five research-route evaluation scenarios;
- traversal and malformed URL rejection through the live HTTP server;
- safe 500 responses for unexpected synchronous filesystem failures;
- validated CLI ports and correct reporting of an OS-assigned ephemeral port;
- preference persistence and blocked/corrupt browser storage;
- coincident force-layout positions without non-finite values.
