# Repository status heartbeat

Last reviewed: 2026-07-06T01:38+02:00

This file is an operational heartbeat for agents and maintainers. It records
the current repository state without promoting any graph confidence label or
making a mathematical claim.

## Current state

- Default branch: `main`
- Reviewed HEAD: `7ff79611fec82873fb15803f83687c1040c2b675`
- Latest `main` workflows for the reviewed HEAD completed successfully:
  CI
  ([run 28758011413](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28758011413)),
  CodeQL
  ([run 28758011425](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28758011425))
  and GitHub Pages
  ([run 28758011412](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28758011412)).
- Open pull requests at review time: none.
- Open operational blocker: [#6](https://github.com/lluiseriksson/physmath-knowledge-tree/issues/6),
  `Blocked: verify CMP source packet for Yang-Mills unblock queue`.
- Recently merged status heartbeat:
  [#25](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/25)
  refreshed this file after PR #24 merged and recorded the same active
  source-specific blocker.
- Most recent operational CI repair: GitHub Pages
  [run 28745433446](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28745433446)
  initially failed in the deploy-only job after creating the deployment for
  `57bbe0f001d5a20b37e29e8c6c47be500058f7b3`. The failed job was rerun and the workflow is now
  successful for `57bbe0f001d5a20b37e29e8c6c47be500058f7b3`.
- Recently closed operational CI task:
  [#18](https://github.com/lluiseriksson/physmath-knowledge-tree/issues/18)
  tracked a deploy-only GitHub Pages failure for run 28740225531; the failed
  job was rerun and completed successfully for the reviewed HEAD.
- Recently merged operational digest:
  [#9](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/9)
  added `docs/curated/YM-UNBLOCK-2026-07-04-CMP-LOCATOR-DIGEST.md`
  and linked it from the source queue.
- Recently merged operational blocker note:
  [#13](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/13)
  added
  `docs/curated/YM-UNBLOCK-2026-07-05-WILSON-SECOND-VARIATION-BLOCKER.md`
  and records that the Springer chapter page and public preview for Wilson's
  Cargese 1976 chapter do not expose the requested second-variation statement.

## Yang-Mills handoff boundary

The current curated Yang-Mills unblock packet remains source-blocked at
`v1_cmp_source_packet` for `claim.p4_contract_activity`. The queue is anchored
in:

- `docs/curated/YM-UNBLOCK-2026-07-03-SOURCE-QUEUE.md`
- `curation/records/ym-unblock-2026-07-03.json`
- `docs/curated/YM-UNBLOCK-2026-07-03-MOTHER-DIGEST.md`
- `docs/curated/YM-UNBLOCK-2026-07-04-CMP-LOCATOR-DIGEST.md`
- `docs/curated/YM-UNBLOCK-2026-07-05-WILSON-SECOND-VARIATION-BLOCKER.md`
- `integrations/yang-mills/generated/agent-context.md`

Do not collapse the pending CMP source items into a generic activity
assumption. The current next action is to recover the first exact primary-source
citation, equation or definition for the Wilson second variation item in the
packet, or to record a source-specific blocker naming the attempted source and
missing symbol or statement.

## Local validation target

For edits that touch the current blocker or its curated handoff, run at least:

```bash
npm run validate:curation
npm run validate:yang-mills
npm run validate:yang-mills-generated
```
