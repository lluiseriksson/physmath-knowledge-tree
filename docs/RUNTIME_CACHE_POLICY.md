# Runtime cache policy

Production builds inject a SHA-256 revision derived from the complete closed static artifact into `dist/sw.js`. Cache namespaces therefore change when any shipped page, module, graph datum, document, icon or service-worker rule changes, even while application version `2.6.0` intentionally remains unchanged.

Each revision uses two caches:

- an immutable shell cache containing the declared offline application surface;
- a bounded runtime cache for successful same-origin navigations and static assets.

Runtime keys are canonicalized by removing query strings and fragments. Shareable graph state therefore cannot create one entry per URL variant. Range requests, opaque responses, redirects, partial responses and unsuccessful responses are never persisted. The runtime cache is capped at 64 entries; successful writes refresh recency before deterministic eviction.

Navigation is network-first. When the network fails, a refreshed runtime entry is preferred over the original shell entry, followed by the route-aware shell fallback. Static assets are cache-first with background revalidation. Activation deletes only stale caches owned by the `physmath-knowledge-tree-` prefix and preserves unrelated origin caches.

The policy is checked statically by `npm run validate:pwa`, behaviorally by `tests/service-worker-policy.test.mjs`, and cryptographically by `npm run validate:dist`, which recomputes the build revision and verifies every manifest entry.
