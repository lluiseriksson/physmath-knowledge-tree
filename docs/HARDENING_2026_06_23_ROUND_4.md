# Hardening round 4 - merge-safe progress and verifiable route bundles

This overlay is based on commit `02abcfa25502ba13600c00869c5e75198a2d61cd` and keeps application metadata at `2.6.0`.

## Merge-safe learning progress

Learning-progress imports now merge with local state instead of replacing it silently. The default policy keeps the furthest state reached for every known topic and unions valid favorites. Explicit `incoming` and `current` policies remain available to scripts and tests. Unknown catalog IDs are discarded by the existing sanitizer.

## Tamper-evident research routes

A route can now be exported as a portable JSON bundle containing:

- the normalized route request and constraints;
- the deterministic route and evidence summary;
- application and graph-schema versions;
- a SHA-256 digest of the route-relevant canonical graph projection;
- a SHA-256 digest of the complete bundle payload.

Verification recalculates both hashes, reruns the evidence-aware planner against the current canonical graph and compares the route and evidence summary. A re-signed but false route is rejected, as is graph or metadata drift.

## Interfaces

- Browser: **Export verified route bundle** after finding a route.
- CLI creation: `npm run route:bundle -- <source> <target> [route options]`.
- CLI verification: `npm run route:verify -- <bundle.json>`.

These bundles are navigation evidence, not mathematical proofs and not promotions of graph confidence labels.

## Validation added

Focused regressions cover deterministic serialization, graph-order invariance, bundle round trips, payload tampering, re-signed false routes, graph drift, metadata drift, impossible recalculation, CLI behavior and all progress merge policies. The new route-bundle module reaches 100% line, branch and function coverage in its focused coverage gate.
