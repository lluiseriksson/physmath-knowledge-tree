# Hardening round 2 - deterministic text, PWA updates and artifact identity

This change set is based on commit `78f8f2732b9dc6390f9da344c7600dbfea835921` and keeps application metadata at `2.6.0`.

## User-facing search and graph determinism

- Learning and research search now share one Unicode-aware normalization layer.
- Greek letters and common mathematical symbols are searchable by either glyph or name, including `ψ`/`psi`, `ℏ`/`hbar`, `∂`/`partial` and `∇`/`nabla`.
- Core search, path and layout ordering no longer depends on host ICU locale through `localeCompare`.
- Deterministic ties fall back to stable IDs.

## PWA update safety

- The source service worker has an independent revision, and production builds replace it with a content-derived `build-...` revision so asset changes invalidate stale caches without pretending to be a new semantic release.
- Runtime caching admits only same-origin/default HTTP 200 responses, excluding partial and opaque responses.
- A cache-write failure no longer converts a successful network request into an offline fallback.
- The new shared text-normalization module is part of the offline shell.

## Build artifact identity

- `dist/build-manifest.json` advances to format 2 and records the injected PWA cache revision.
- The manifest includes one aggregate SHA-256 over the ordered closed file table in addition to per-file hashes.
- Verification recomputes that aggregate after validating every individual path, size and digest.

## Release drift guard

- Application, lockfile, citation, Lean and service-worker versions remain cross-checked.
- The guard also requires a bounded PWA cache revision and confirms that `npm run check` actually invokes the release validator.
