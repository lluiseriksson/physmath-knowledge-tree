# Repository status heartbeat

Last reviewed: 2026-07-04T14:48Z

This file is an operational heartbeat for agents and maintainers. It records
the current repository state without promoting any graph confidence label or
making a mathematical claim.

## Current state

- Default branch: `main`
- Reviewed HEAD: `1f0c4dee0df3e7280c227ca6989c35e9c3f70a07`
- Latest `main` workflows for the reviewed HEAD completed successfully:
  CI
  ([run 28709059286](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28709059286)),
  CodeQL
  ([run 28709059326](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28709059326))
  and GitHub Pages
  ([run 28709059304](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28709059304)).
- Open pull requests at review time: none.
- Open operational blocker: [#6](https://github.com/lluiseriksson/physmath-knowledge-tree/issues/6),
  `Blocked: verify CMP source packet for Yang-Mills unblock queue`.

## Yang-Mills handoff boundary

The current curated Yang-Mills unblock packet remains source-blocked at
`v1_cmp_source_packet` for `claim.p4_contract_activity`. The queue is anchored
in:

- `docs/curated/YM-UNBLOCK-2026-07-03-SOURCE-QUEUE.md`
- `curation/records/ym-unblock-2026-07-03.json`
- `docs/curated/YM-UNBLOCK-2026-07-03-MOTHER-DIGEST.md`
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
