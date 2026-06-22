# Reproducible evaluation

`scenarios.json` contains retrieval regressions and five bounded research-route cases. `quality-rubric.json` defines a 100-point score limited to properties controlled inside this repository.

Generated outputs:

- `evaluation/results.json`
- `docs/EVALUATION.md`
- `docs/USE_CASES.md`
- `docs/QUALITY_SCORECARD.md`

Run `npm run evaluate` to regenerate them or `npm run validate:evaluation` to detect drift. The score explicitly excludes scientific truth, publication novelty, external adoption and user-study outcomes.
