# Research Workbench

The Research Workbench is a local-first companion to the canonical research graph. It closes three previously documented gaps without changing graph evidence labels:

1. saved local workspaces containing selected nodes, notes and bridge-card drafts;
2. radius and evidence-aware route comparison views;
3. a structured negative-results ledger for failed, inconclusive or falsified mechanisms.

Open `workbench.html` from the deployed site or local development server.

## Data model

Workspace data is browser-local and separate from the canonical graph. Every record references graph content only through stable node IDs.

```text
workspace library
├── active workspace ID
└── workspaces
    ├── selected canonical node IDs
    ├── working notes
    ├── bridge-card drafts
    └── negative results
        ├── status: observed | inconclusive | falsified
        ├── related canonical node IDs
        ├── observation
        ├── challenged mechanism or invariant
        └── next discriminating test
```

The application does not promote a workspace note, draft or negative result into canonical data. Promotion still requires the repository's normal source, evidence and review process.

## Neighborhood comparison

Choose two seed nodes and a radius from one to three. The workbench computes undirected canonical neighborhoods and separates the result into:

- nodes unique to the left seed;
- nodes shared by both neighborhoods;
- nodes unique to the right seed.

The union can be added to the active workspace in one action. This is a retrieval aid, not an assertion that every returned node is relevant to a proposed mechanism.

## Route comparison

Choose a source, a target, two route objectives and an evidence gate. Both routes use the repository's deterministic route planner and report:

- edge count;
- weakest evidence level;
- total attached references;
- overlap between the two routes.

Available objectives are shortest, balanced and strongest-evidence. The evidence gate can admit all levels, only formal/literature edges, or formal edges alone. A missing route is reported explicitly.

## Negative-results format

A negative result is a local research record with a bounded status:

- `observed`: a concrete failure was seen, but the general mechanism has not been ruled out;
- `inconclusive`: the test did not discriminate between the live possibilities;
- `falsified`: the stated mechanism or invariant failed under the recorded conditions.

Each record should state the observation, the challenged mechanism and a next discriminating test. This makes failed routes reusable without overstating what a finite example establishes.

## Import and export

`Export JSON` writes the complete workspace library. Import validates:

- application and schema identity;
- a 2 MB size limit;
- JSON-compatible filename and media type when supplied by the browser;
- bounded record counts and text lengths;
- stable record identifiers;
- canonical node IDs, discarding references that no longer exist.

Merge mode keeps the newest `updated_at` version of each workspace ID. Replace mode replaces the local library after validation.

## Privacy and failure behavior

No account, analytics, cookie or remote synchronization is introduced. Storage denial or quota exhaustion does not break graph exploration; the active in-memory workspace remains usable. Export is the explicit portability boundary.

## Verification

The new pure workspace module is covered by `tests/workspace.test.mjs`. Static product tests check the page's CSP, accessible labels, local-only architecture and required controls. The existing browser smoke suite can discover the page through the PWA shell after the upgrade is applied.
