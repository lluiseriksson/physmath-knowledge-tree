# Yang–Mills Agent Pack

This integration turns the generic PhysMath graph into a precise working memory
for the verified Yang–Mills RG repository.

**Inspected formal HEAD:** `a9937ee1dd5978bf372174500a2395cf259eb395` (30 October 2026)
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
- A current source-obligation audit and eight historical roadmap records, held for reconciliation before implementation.
- A Balaban/Dimock source-to-Lean map that never treats citations as proofs.
- Specialized research moves and decision rules.
- A 100-point evaluation suite for future agent answers.
- A deterministic context generator and query CLI.

## Non-negotiable scope

This pack does not claim `hRpoly`, an unconditional physical source theorem, a
continuum limit, or the Clay result. Its purpose is to make the next correct
formal move easier to identify and harder to overstate.

The two formerly planned marginal adapters already exist. Their conditional
statements and direct core imports were inspected, and the exact-head GitHub
core/oracle run passed. This is recorded CI evidence, not an independent local
programme rebuild. See the [verification record](data/verification-2026-10-30.json)
and [scope audit](PROVENANCE-2026-10-30.md). Older declaration anchors remain
historical. Unreconciled plans do not establish that a theorem is absent.

## Refreshing the snapshot

Before editing the Yang–Mills repository, resolve its current HEAD and search for
all planned theorem names. Update `data/repository-state.json`,
`data/declarations.json` and `data/commit-roadmap.json`, then run:

```bash
npm run validate:yang-mills
npm run generate:yang-mills
npm run validate:yang-mills-generated
```
