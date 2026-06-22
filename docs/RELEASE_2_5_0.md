# Release 2.5.0 — traceability and reproducible evaluation

Release 2.5.0 turns the existing testing baseline into a broader research-software quality layer while preserving epistemic boundaries.

## Evidence traceability

- All 58 nodes and all 112 edges now have scoped references.
- Every `formal` or `literature` item has a `claim` or `formalization` source.
- Heuristic and speculative items may remain context-only; reference coverage never upgrades their evidence labels.
- `graph/reference-registry.json` deduplicates source URLs and records every use site.

## Reproducible evaluation

- Fourteen committed search cases measure top-1 accuracy, recall@3 and mean reciprocal rank.
- Five directed route scenarios cover spectral arithmetic, analysis/PDE, target-sensitive constructive Yang-Mills, AQFT no-signalling and quantum-information recovery.
- Each route enforces an edge budget, permitted evidence classes, reference presence and an expected terminal.
- `npm run usecase -- <scenario-id>` reconstructs a scenario from canonical data.

## Quality score boundary

`docs/QUALITY_SCORECARD.md` reports 100/100 only for properties controlled inside the repository: integrity, evidence traceability, retrieval regressions, bounded Lean interfaces, automation and documentation. It explicitly excludes publication novelty, scientific truth of exploratory mechanisms, external adoption, independent replication and user-study outcomes.

## Verification commands

```bash
npm ci
npm run check
npm run usecase:list
npm run benchmark:evaluation
lake build --wfail
```

The benchmark is machine-dependent. Lean verification must be reported separately when Lake is unavailable.
