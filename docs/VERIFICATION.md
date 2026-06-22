# Verification record

Date: **2026-06-22**

## Automated quality gate

```bash
npm ci
npm run check
```

Verified results:

- 28 JavaScript modules parsed;
- 36 canonical research nodes;
- 61 canonical research edges;
- 12 research moves;
- 5 curated collections;
- 90 bilingual learning topics;
- 199 prerequisite edges;
- 1 learning root and maximum depth 15;
- local HTML/Markdown links, CSP invariants and service-worker assets valid;
- 5 deterministic generated views current;
- independent JSON Schema 2020-12 validation passed for all four canonical collections;
- all GitHub workflow and issue-form YAML parsed successfully;
- formatting invariants valid;
- 26 Node tests passed, 0 failed;
- static production build created in `dist/`;
- the built site served `index.html`, `learning.html` and the 36-node JSON graph with the expected security headers;
- `npm audit --omit=dev` reported 0 vulnerabilities.

## Browser smoke tests

Chromium was executed with production HTML/CSS/JavaScript and local canonical data. Direct localhost navigation is administratively blocked in the execution environment, so each application was loaded as an in-memory production-equivalent document.

Research interface checks:

- application startup;
- all 36 SVG nodes;
- canonical summary count;
- search and node dossier;
- shortest-path discovery;
- bridge-card warning and falsifier section;
- Spanish interface switch;
- 36-card list parity;
- screenshot generation.

Learning interface checks:

- all 90 SVG nodes;
- Spanish translated search;
- topic details;
- progress transition to “learning”;
- 90-card list parity after clearing search.

## Lean boundary

The package is pinned to Lean/mathlib `v4.31.0` and CI is configured to run `lake build --wfail`, the mathlib cache, `mk_all` coverage and `leanchecker`. Lean was not installed in this container, so a local Lean build is not represented as completed. The dedicated GitHub Actions job is the authoritative remaining environment check after the ZIP is committed.
