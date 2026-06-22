# Contributing

Thank you for improving PhysMath Knowledge Tree. Contributions may change canonical research data, Lean metadata, the web applications, curriculum content, translations, accessibility, tests or documentation.

## Before opening a change

1. Search existing issues and pull requests.
2. Keep each pull request focused on one coherent improvement.
3. For ontology changes, large data migrations or new runtime dependencies, open a proposal issue first.
4. Do not commit secrets, personal progress exports, `.lake/`, `node_modules/` or generated `dist/` files.

## Local workflow

```bash
npm ci
npm run check
lake build
```

The web gate runs on supported Node versions in CI. Lean changes must also compile against the pinned toolchain. When Lean is unavailable locally, say so explicitly in the pull request and rely on the dedicated CI job rather than claiming success.

## Canonical research-graph changes

Read `docs/ontology.md` and `docs/agent-protocol.md` first.

Every node must:

- use a stable lowercase dotted ID whose prefix matches its kind;
- have an operational summary, at least two tags and a live question;
- declare a confidence level;
- include bounded Lean metadata, even when the relevant library support is preliminary;
- use `status` only for problem nodes;
- attach authoritative HTTPS references with an explicit `claim`, `context` or `formalization` scope.

Every edge must:

- connect existing nodes;
- use one defined relation;
- explain a mechanism rather than merely say “related”;
- carry its own confidence label;
- include an explicit falsifier note when speculative;
- carry at least one scoped reference, with a `claim` or `formalization` source required for `formal` and `literature` edges.

After editing canonical JSON:

```bash
npm run generate:views
npm run generate:audit
npm run evaluate
npm run check
```

Commit the regenerated `views/` files in the same pull request. Do not edit those projections manually.

## Evaluation changes

- Treat `evaluation/scenarios.json` as a regression corpus, not a collection of claimed scientific results.
- Every route scenario must state a research question, ordered waypoints, direction, edge budget, permitted evidence classes and expected terminal.
- Add a failing test before changing retrieval behavior that affects a committed scenario.
- Do not edit generated `evaluation/results.json`, `docs/EVALUATION.md`, `docs/USE_CASES.md` or `docs/QUALITY_SCORECARD.md` by hand.
- Run `npm run evaluate` and commit all generated outputs together.
- Keep user-study outcomes separate from the protocol until real participants and an auditable dataset exist.

## Learning-map changes

Read `docs/CONTENT_GUIDE.md`. Every topic must:

- have a stable kebab-case ID;
- include English and Spanish titles, summaries and concepts;
- reference only existing prerequisites;
- preserve an acyclic graph and topological source order;
- use a valid taxonomy value and positive study-time estimate.

Run `npm run validate:learning` after content edits.


## Source-curation changes

- Never commit raw private TXT/Markdown/PNG inbox files.
- Register originals by SHA-256 with `npm run curation:register -- <file> [id]`.
- Use line ranges for text decisions and bounded pixel regions for PNG decisions.
- Add captions and alt text for promoted crops or redraws.
- Recheck a retained original with `npm run curation:verify-source -- <record> <file>`.
- Regenerate `curation/REPORT.md` after changing indexed records.
- Do not mark a record `reviewed`, set `review.status` to `approved`, or use `deleted-after-review` without explicit user review and a closed verification queue.

## Lean changes

- Prefer a small complete theorem over a large scaffold.
- Do not use `sorry`, `admit`, hidden axioms or an open-problem conclusion as an assumption disguised by notation.
- Minimize imports after the proof works.
- State what a toy result does not establish about the motivating research problem.
- Keep warnings at zero.

## Application changes

- Use browser standards and small deterministic modules where practical.
- Create dynamic content with safe DOM APIs; do not insert untrusted markup.
- Preserve CSP, offline behavior and same-origin runtime operation.
- Add tests for bug fixes and behavior changes.
- Maintain list-view and keyboard parity with graphical interactions.
- Respect reduced-motion, contrast and responsive-layout requirements.

The project intentionally has no third-party runtime dependencies. Adding one requires a written security, accessibility, maintenance and bundle-size justification.

## Pull-request evidence

Explain the problem, solution, data/ontology implications, test output and accessibility impact. Include before/after screenshots for visible changes. By contributing, you agree that code is distributed under MIT and original graph/documentation content under CC BY 4.0 as described in `LICENSE.md`.
