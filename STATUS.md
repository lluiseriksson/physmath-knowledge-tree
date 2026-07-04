# Repository status heartbeat

Last reviewed: 2026-07-04T21:15Z

This file is an operational heartbeat for agents and maintainers. It records
the current repository state without promoting any graph confidence label or
making a mathematical claim.

## Current state

- Default branch: `main`
- Reviewed HEAD: `e6ff472f0247299ca99ed38c0c251eec7ea17d0e`
- Latest `main` workflows for the reviewed HEAD completed successfully:
  CI
  ([run 28718681716](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28718681716)),
  CodeQL
  ([run 28718681702](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28718681702))
  and GitHub Pages
  ([run 28718681692](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28718681692)).
- Open pull requests at review time: none.
- Open operational blocker: [#6](https://github.com/lluiseriksson/physmath-knowledge-tree/issues/6),
  `Blocked: verify CMP source packet for Yang-Mills unblock queue`.
- Recently merged operational digest:
  [#9](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/9)
  added `docs/curated/YM-UNBLOCK-2026-07-04-CMP-LOCATOR-DIGEST.md`
  and linked it from the source queue.
- Recently merged operational heartbeat:
  [#10](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/10)
  refreshed this status file and merged as the current reviewed HEAD.

## Yang-Mills handoff boundary

The current curated Yang-Mills unblock packet remains source-blocked at
`v1_cmp_source_packet` for `claim.p4_contract_activity`. The queue is anchored
in:

- `docs/curated/YM-UNBLOCK-2026-07-03-SOURCE-QUEUE.md`
- `curation/records/ym-unblock-2026-07-03.json`
- `docs/curated/YM-UNBLOCK-2026-07-03-MOTHER-DIGEST.md`
- `docs/curated/YM-UNBLOCK-2026-07-04-CMP-LOCATOR-DIGEST.md`
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
