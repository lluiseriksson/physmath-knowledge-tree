# Browser smoke testing

The production artifact is exercised in a real Chromium-family browser without adding a runtime or npm dependency.

```bash
npm run build
npm run test:e2e
```

`test:e2e` starts the repository's static server on an operating-system-assigned loopback port, launches a fresh headless browser profile, and drives the page through the Chrome DevTools Protocol. Set `BROWSER_BIN` when Chrome, Chromium or Edge is not available under a standard executable name.

## Covered flows

The smoke suite loads the built `dist/` artifact and checks:

- research graph initialization with 58 nodes and 112 edges;
- research search, node dossier opening and shareable URL state;
- graph-to-list switching and all 58 list cards;
- English-to-Spanish interface switching;
- shortest-path execution between number theory and the Riemann Hypothesis;
- learning graph initialization with 90 topics;
- learning list rendering with 90 cards;
- bilingual topic search and detail opening;
- persistence of a mastered topic in browser storage;
- runtime accessibility invariants for generated controls, landmarks, IDs and image alternatives;
- service-worker control and an actual offline navigation fallback;
- absence of uncaught exceptions, console errors and same-origin HTTP failures.

## Boundary

This is a deterministic functional and offline-readiness smoke test, not an exhaustive browser-certification programme. It currently targets one Chromium-family engine and does not replace manual assistive-technology review, visual-regression testing, performance profiling or cross-browser testing.

Enterprise browser policies may block loopback navigation. In that environment, use a clean test profile or allowlist the local test origin. The script fails rather than silently skipping when no compatible browser is available.
