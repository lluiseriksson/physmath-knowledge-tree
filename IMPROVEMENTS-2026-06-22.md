# Improvements applied after v2.5.0

This package is based on release commit `4517818c48a2cc318fc14c56df97b60ebb15f491` and includes the documented `usecase:list` polish from `main`.

## Engineering hardening

- Raised the explicit core coverage gate from line-only to **100% lines, branches and functions**.
- Expanded the suite from 47 to **58 passing tests**.
- Reworked learning-graph helpers around readable invariants and deterministic tie-breakers.
- Separated the static-server CLI bootstrap from request handling.
- Fixed direct numeric port `0`, default request handling and binary MIME fallback regressions.
- Added a cross-platform Node coverage launcher with exact production-file inclusion.

## Production browser verification

- Added a dependency-free Chrome DevTools Protocol runner.
- Exercised the built `dist/` artifact in Chromium.
- Verified research search, dossier state, list view, Spanish UI and shortest paths.
- Verified learning graph/list counts, bilingual search and persisted progress.
- Verified generated-control accessibility and a real service-worker offline fallback.
- Made uncaught exceptions, console errors and same-origin HTTP failures fatal.
- Added deterministic CI browser discovery.

## Documentation and release

- Added browser-testing methodology and explicit boundaries.
- Updated coverage, reproducibility, limitations and verification records.
- Added release notes for v2.6.0.
- Preserved the 18 source-verification requests and 3 approval gates rather than hiding unresolved evidence work.
