# Repository status heartbeat

Last reviewed: 2026-07-06T07:56+02:00

This file is an operational heartbeat for agents and maintainers. It records
the current repository state without promoting any graph confidence label or
making a mathematical claim.

## Current state

- Default branch: `main`
- Reviewed HEAD: `c3a406242266eb578aa897dbe97911341e89deb3`
- Latest `main` workflows for the reviewed HEAD completed successfully:
  CI
  ([run 28769513271](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28769513271)),
  CodeQL
  ([run 28769513276](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28769513276))
  and GitHub Pages
  ([run 28769513259](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28769513259)).
- Open pull requests at review time: none.
- Open operational blocker: [#6](https://github.com/lluiseriksson/physmath-knowledge-tree/issues/6),
  `Blocked: verify CMP source packet for Yang-Mills unblock queue`.
- Recently merged status heartbeat:
  [#27](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/27)
  refreshed this file before the CodeQL action-pairing repair landed.
- Most recent operational CI repair:
  [#30](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/30)
  aligned the pinned `github/codeql-action/init` and
  `github/codeql-action/analyze` commits and grouped future CodeQL action
  updates in Dependabot. It is merged into the reviewed HEAD.
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
