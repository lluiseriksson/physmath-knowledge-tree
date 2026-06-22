# Reproducibility guide

## Deterministic checks

Requirements: Node.js 22 or newer. The web application has no runtime npm dependencies.

```bash
npm ci
npm run check
```

The complete gate validates syntax, graph schemas and invariants, curation provenance, generated reports, learning data, links, accessibility checks, PWA metadata, workflow pinning, formatting, tests with 100% line coverage for the instrumented Node module set, the production build and its SHA-256 manifest.

Regenerate canonical projections and evaluations with:

```bash
npm run generate:views
npm run generate:audit
npm run evaluate
```

Verify that generated artifacts are current without rewriting them:

```bash
npm run validate:views
npm run validate:audit
npm run validate:evaluation
```

## Reproducible scenarios

List available scenarios:

```bash
npm run usecase:list
```

Render one route:

```bash
npm run usecase -- route.target_sensitive_yang_mills
```

The route output is derived only from canonical JSON, deterministic breadth-first path selection and the committed scenario definition.

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
