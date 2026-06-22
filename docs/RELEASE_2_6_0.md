# Release 2.6.0 — browser verification and complete core coverage

Release 2.6.0 strengthens the engineering evidence without changing the graph's scientific claims or evidence labels.

## Complete core coverage

- The explicit Node-instrumented production set now enforces 100% line, branch and function coverage.
- The suite contains 58 deterministic tests covering graph invariants, search ranking, storage failure modes, curation boundaries, evaluation scenarios and the static server.
- A cross-platform runner passes coverage arguments directly to Node rather than relying on shell-specific quoting.

## Real production-browser smoke test

- `npm run test:e2e` launches a fresh Chromium-family profile and tests the built `dist/` artifact.
- The research interface is checked for graph counts, search, dossier opening, URL state, list view, Spanish UI and shortest-path execution.
- The learning interface is checked for graph/list counts, bilingual search, detail opening and persisted mastery state.
- Runtime accessibility invariants, service-worker control and an actual offline fallback are verified.
- Uncaught exceptions, console errors and same-origin HTTP failures fail the run.
- The runner uses the Chrome DevTools Protocol directly and adds no npm dependency.

## Server and graph maintenance

- Static request handling is separated from the CLI bootstrap.
- Direct numeric `PORT=0` input now retains ephemeral-port semantics.
- Learning graph helpers are formatted around explicit invariants and deterministic tie-breakers.
- New regressions cover malformed prerequisites, cycles, unknown targets, MIME fallback and optional metadata boundaries.

## Boundaries

The browser pass covers one Chromium-family engine and selected critical flows. It is not a cross-browser, assistive-technology or visual-regression certification. The curation ledger still has 18 source-verification requests and 3 explicit user approvals pending. Local Lean verification remains separately reported.
