# Reproducibility guide

## Deterministic checks

Requirements: Node.js 22 or newer. The web application has no runtime npm dependencies.

```bash
npm ci
npm run check
```

The complete gate validates syntax, graph and curation invariants, generated reports, learning data, bilingual message parity, links, accessibility, PWA policy, release metadata, deterministic JSON-LD, pinned workflows, formatting, 100% line/branch/function coverage for the explicit Node module set, an atomically published production build, its closed SHA-256 manifest and real Chromium smoke passes over `dist/`.

Regenerate canonical projections and evaluations with:

```bash
npm run generate:views
npm run generate:audit
npm run generate:jsonld
npm run evaluate
```

Verify generated artifacts without rewriting them:

```bash
npm run validate:views
npm run validate:audit
npm run validate:jsonld
npm run validate:evaluation
```

## Browser verification

```bash
npm run build
npm run test:e2e
```

The browser runners auto-detect Chrome, Chromium or Edge. Set `BROWSER_BIN=/path/to/browser` when necessary. They use fresh profiles, loopback-only servers and the Chrome DevTools Protocol; they add no npm dependency. See [`docs/BROWSER_TESTING.md`](./BROWSER_TESTING.md) for covered flows and limitations.

## Fingerprinted research capsules

Build a portable campaign handoff from a verified dossier and reproducible-run manifests:

```bash
npm run capsule:build -- -- --dossier-file exports/dossier.json --run-file .run-ledger/manifests/run.json
npm run capsule:verify -- -- --capsule-file .run-ledger/capsules/campaign.json --artifact-root .
```

The browser verifies dossier/run metadata and fingerprints. The CLI verifier can additionally hash repository-relative artifact files. A ready capsule is a reproducibility statement about recorded inputs and executions, not a proof or confidence promotion.

## Evidence-aware ad-hoc routes

The interactive research app and CLI share the same deterministic planner:

```bash
npm run route:plan -- domain.number_theory problem.riemann_hypothesis
npm run route:plan -- domain.analysis problem.navier_stokes --compare --format json
```

Route output records its objective, direction, evidence gate and finite search limits. It is a graph-derived navigation aid, not a theorem or evidence promotion. See [`docs/ROUTE_PLANNER.md`](./ROUTE_PLANNER.md).

## Committed evaluation scenarios

List available scenarios and reproduce one:

```bash
npm run usecase:list
npm run usecase -- route.target_sensitive_yang_mills
```

These committed regression scenarios remain separate from ad-hoc route planning. Their output is derived from canonical JSON and the committed scenario definition.

## Interoperable graph export

```bash
npm run export:jsonld -- --output physmath-knowledge-graph.jsonld
```

The committed `graph/knowledge-graph.jsonld` is a deterministic projection and is checked for staleness. Canonical edits remain in the source JSON files. See [`docs/JSONLD_EXPORT.md`](./JSONLD_EXPORT.md).

## Machine-dependent performance

```bash
npm run benchmark:evaluation
```

Performance output is intentionally not committed as a universal claim. Report Node version, operating system, processor, iteration count and full command whenever publishing timing results.

## Lean verification

The package is pinned by `lean-toolchain` and `lake-manifest.json`:

```bash
lake build --wfail
```

A successful JavaScript gate does not substitute for a Lean build. Release records must state separately whether Lake was available in the verification environment.
