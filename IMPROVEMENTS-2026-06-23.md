# Hardening delta - 2026-06-23

Base commit: `25769e669cbc43b7a82bfa7498305ed872b9abb5`.

## Applied improvements

- Progress imports now reject unrelated JSON, unsupported schemas and structurally corrupt payloads before sanitization can turn them into empty progress.
- Progress-file checks require a `.json` filename when available and constrain declared media types to JSON or common browser-generic labels.
- Learning search uses locale-independent lowercase conversion, Unicode compatibility normalization, deterministic tie-breaking and safe negative/fractional limits.
- URL state is canonical: focus cannot survive without a topic, topic IDs are trimmed, invalid values are discarded and unrelated query/hash data is preserved.
- The URL-state and filesystem-safety modules are part of the explicit 100% coverage allowlist.
- The development server rejects encoded Windows separators and NUL bytes, fixes the `..prefix` containment false positive and prevents files from escaping the served root through symlinks or junctions.
- `npm run check` now starts with a repository-source symlink preflight while excluding generated dependency/build directories.
- Build inputs are preflighted before the previous `dist/` is removed; build and artifact verification reject symlinks before copying or hashing, so a failed build preserves the prior artifact and the closed SHA-256 manifest cannot silently include files outside the repository tree.
- Eight focused regression tests cover these import, search, URL, server, source-preflight and artifact-integrity failure modes.

## Scope

This package is an overlay/patch for the stated base commit. It intentionally does not alter graph evidence labels, curated-source decisions, Lean claims or release-version metadata.
