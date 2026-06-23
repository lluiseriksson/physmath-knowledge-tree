# Browser smoke testing

The production artifact is exercised in a real Chromium-family browser without adding a runtime or npm dependency.

```bash
npm run build
npm run test:e2e
```

`test:e2e` starts the repository's static server on operating-system-assigned loopback ports, launches fresh headless browser profiles and drives the pages through the Chrome DevTools Protocol. Set `BROWSER_BIN` when Chrome, Chromium or Edge is not available under a standard executable name.

## Baseline product pass

The original production smoke suite checks:

- research graph initialization with 58 nodes and 112 edges;
- search, node dossiers, graph/list parity and shareable state;
- English-to-Spanish switching and runtime accessibility invariants;
- the 90-topic learning graph, list rendering, bilingual search and persisted progress;
- service-worker control and a real offline navigation fallback;
- absence of uncaught exceptions, console errors and unexpected same-origin HTTP failures.

## Round-three product and artifact pass

A second smoke suite checks the newly hardened surface:

- evidence-aware route policies, evidence gates and deterministic highlighting;
- canonical URL replacement, history restoration and preservation of unrelated query/hash data;
- browser-side JSON-LD export with 201 linked entities;
- bilingual accessible names on newly translated controls;
- denial of repository-private paths while declared public files remain available with correct media types;
- build-manifest v3 metadata, content-addressed shell/runtime cache names and bounded runtime entries;
- query-canonical cache keys and the route-aware offline fallback.

Expected 404 responses used to test the closed public surface are cleared from browser diagnostics only after their exact status assertions pass. All later browser errors remain fatal.

## Boundary

This is a deterministic functional and offline-readiness smoke test, not an exhaustive browser-certification programme. It currently targets one Chromium-family engine and does not replace manual assistive-technology review, visual-regression testing, performance profiling or cross-browser testing.

Enterprise browser policies may block loopback navigation. In that environment, use a clean test profile or allowlist the local test origin. The scripts fail rather than silently skipping when no compatible browser is available.
