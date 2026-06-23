# Yang–Mills Agent Pack

This integration turns the generic PhysMath graph into a precise working memory
for the verified Yang–Mills RG repository.

**Inspected formal HEAD:** `4ac57638396f62c4cb968676a07a9ae95bd982be`
**Previous H# checkpoint:** `d1023e1f7bd7cb315b931f0592cb4334ba1b71e4`
**Knowledge-tree baseline:** `25769e669cbc43b7a82bfa7498305ed872b9abb5` (`v2.6.0`)

## Start here

```bash
npm run validate:yang-mills
npm run generate:yang-mills
npm run query:yang-mills -- status
npm run query:yang-mills -- next-commit
npm run query:yang-mills -- route marginal
```

The generated compact context is
[`generated/agent-context.md`](generated/agent-context.md). It is intentionally
small enough to paste into an agent session while preserving theorem status,
hypothesis provenance, branch fidelity, information-loss warnings and exact
verification targets.

## What this adds

- A declaration registry separating **verified** and **planned** Lean names.
- A theorem pipeline with geometric and marginal branches kept distinct.
- An auditable analytic frontier with source ownership and quantifier scope.
- An eight-commit roadmap from raw-source H# to a final source-theorem shape.
- A Balaban/Dimock source-to-Lean map that never treats citations as proofs.
- Specialized research moves and decision rules.
- A 100-point evaluation suite for future agent answers.
- A deterministic context generator and query CLI.

## Non-negotiable scope

This pack does not claim `hRpoly`, an unconditional physical source theorem, a
continuum limit, or the Clay result. Its purpose is to make the next correct
formal move easier to identify and harder to overstate.

## Refreshing the snapshot

Before editing the Yang–Mills repository, resolve its current HEAD and search for
all planned theorem names. Update `data/repository-state.json`,
`data/declarations.json` and `data/commit-roadmap.json`, then run:

```bash
npm run validate:yang-mills
npm run generate:yang-mills
npm run validate:yang-mills-generated
```
