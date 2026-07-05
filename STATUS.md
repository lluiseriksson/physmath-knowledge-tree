# Repository status heartbeat

Last reviewed: 2026-07-05T12:54+02:00

This file is an operational heartbeat for agents and maintainers. It records
the current repository state without promoting any graph confidence label or
making a mathematical claim.

## Current state

- Default branch: `main`
- Reviewed HEAD: `947ade1016327ebab77f9c0bb2741b3f60fbb227`
- Latest `main` workflows for the reviewed HEAD completed successfully:
  CI
  ([run 28736990769](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28736990769)),
  CodeQL
  ([run 28736990763](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28736990763))
  and GitHub Pages
  ([run 28736990767](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28736990767)).
- Open pull requests at review time: none.
- Open operational blocker: [#6](https://github.com/lluiseriksson/physmath-knowledge-tree/issues/6),
  `Blocked: verify CMP source packet for Yang-Mills unblock queue`.
- Recently merged status heartbeat:
  [#16](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/16)
  refreshed this file after PR #15 merged and recorded the same active
  source-specific blocker.
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
