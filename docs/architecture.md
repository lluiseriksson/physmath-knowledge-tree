# Architecture

## Goals

PhysMath Knowledge Tree is designed to be understandable from source, deployable as static files, usable offline, accessible without a mouse, and safe to host with no backend. The architecture favors deterministic pure functions and progressive enhancement over framework-specific abstractions.

## Runtime layers

### Data

`src/data/topics.js` exports the taxonomy and a topologically ordered topic array. A topic carries localized text, classification, prerequisites, concepts, search terms, and estimated study time. IDs are stable storage and URL keys; titles are presentation data and may change.

### Pure domain logic

`src/lib/graph.js` owns graph indexing, Kahn topological sorting, depth calculation, layered layout, ancestor and descendant traversal, learning paths, readiness, recommendations, and progress statistics. It does not access the DOM or browser storage and is directly unit tested.

`src/lib/search.js` normalizes accents and punctuation and performs deterministic weighted matching. `src/lib/storage.js` owns schema validation and serialization. `src/lib/url-state.js` limits shareable state to known query parameters.

### Presentation and orchestration

`src/app.js` is the composition root. It holds ephemeral UI state, renders DOM and SVG elements, wires events, persists learner changes, and coordinates language, theme, filters, focus, and view selection. Dynamic text is assigned with `textContent`; imported JSON never becomes markup.

`src/styles.css` defines design tokens, themes, responsive drawers, graph states, focus treatment, reduced motion, and print behavior.

### Offline layer

`sw.js` precaches the same-origin application shell. Navigation requests use network-first behavior with an index fallback; immutable application assets use cache-first behavior with background refresh. Progress remains in `localStorage` and is not placed in Cache Storage.

## Data flow

1. Startup loads validated local progress and small preferences.
2. URL parameters select an optional topic, focus mode, and view.
3. Pure selectors derive visible topics, readiness, recommendations, and paths.
4. Renderers replace bounded UI regions with safely constructed elements.
5. Learner actions update state, persist only the progress document, and rerender affected regions.
6. Export creates a versioned JSON wrapper; import sanitizes all IDs and status values.

## Graph invariants

- Topic IDs are unique and stable.
- Every prerequisite references an earlier topic in source order.
- The graph is acyclic.
- Every taxonomy ID exists.
- English and Spanish text is complete.
- Layout is deterministic for a given catalog.

`scripts/validate-data.mjs` and the graph test suite enforce these properties.

## Security boundaries

The application trusts its shipped source data after CI validation. Browser storage and imported files are untrusted and sanitized. URL parameters are treated as identifiers, checked against the catalog, and never injected into HTML. Requests are restricted to same-origin static content by design and by CSP.

## Why no application framework

The interface is small enough to implement with browser primitives, and the graph logic is framework-independent. Zero runtime dependencies reduce supply-chain exposure, eliminate upgrade churn, and let the repository work immediately after cloning. A future dependency should be adopted only when its tested benefit outweighs bundle, audit, and maintenance cost.

## Build and deployment

The build script copies the verified source application to `dist/` and adds host-compatible security headers. GitHub Pages ignores `_headers`, while other static hosts may apply it. The Pages workflow uses the official artifact deployment path and grants only `contents: read`, `pages: write`, and `id-token: write` where needed.
