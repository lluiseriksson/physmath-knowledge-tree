# Improvement package — 2026-06-22

This archive is based on repository `main` at commit `eccb3f6410158d0d04de5d3038582fde34ce41df`.

Changes in this package:

- line coverage raised from 99.25% to 100.00% for the Node-instrumented module set;
- 38 passing tests, including new server, storage and layout regressions;
- a mandatory 100% line threshold integrated into `npm run check`;
- correct ephemeral-port reporting by the local static server;
- testable `parsePort` and `startStaticServer` helpers;
- updated English/Spanish usage documentation and verification record.

Verification commands:

```bash
npm ci
npm run test:coverage
npm run check
```

The coverage scope and browser-execution boundary are documented in `docs/COVERAGE.md`.
