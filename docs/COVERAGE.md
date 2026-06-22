# Coverage gate

The repository now has a reproducible line-coverage gate for the modules exercised by the Node test suite.

```bash
npm run test:coverage
```

The command uses Node's built-in test coverage, requires **100% line coverage**, and exits non-zero if the threshold regresses. The current run covers the graph/search/storage/curation libraries, curriculum data and dependency-free static server. Browser entry modules are validated by syntax, accessibility, CSP, PWA and build checks; they are not presented as browser-level coverage.

Current verified result (2026-06-22):

```text
Node 22.16.0: 38 passed, 0 failed; line coverage 100.00%
Node 24.17.0: 38 passed, 0 failed; line coverage 100.00%
```

New regression cases exercise:

- traversal and malformed URL rejection through the live HTTP server;
- safe 500 responses for unexpected synchronous filesystem failures;
- validated CLI ports and correct reporting of an OS-assigned ephemeral port;
- preference persistence and blocked/corrupt browser storage;
- coincident force-layout positions without non-finite values.
