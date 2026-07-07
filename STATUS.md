# Repository status heartbeat

Last reviewed: 2026-07-07T02:28+02:00

This file is an operational heartbeat for agents and maintainers. It records
the current repository state without promoting any graph confidence label or
making a mathematical claim.

## Current state

- Default branch: `main`
- Reviewed HEAD: `61f649fbb144783e464022efd46430f80f12bca6`
- Latest `main` workflows for the reviewed HEAD completed successfully:
  CI
  ([run 28830574615](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28830574615)),
  CodeQL
  ([run 28830574614](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28830574614))
  and GitHub Pages
  ([run 28830574595](https://github.com/lluiseriksson/physmath-knowledge-tree/actions/runs/28830574595)).
- Open pull requests at review time: none.
- Open operational blocker: [#6](https://github.com/lluiseriksson/physmath-knowledge-tree/issues/6),
  `Blocked: verify CMP source packet for Yang-Mills unblock queue`.
- Recently closed operational agent task:
  [#32](https://github.com/lluiseriksson/physmath-knowledge-tree/issues/32),
  `Record 2602.0032 conditional Witten-lattice package`, closed by
  [#37](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/37).
- Recently merged operational digest:
  [#37](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/37)
  added
  `docs/curated/YM-WITTEN-LATTICE-2602-0032-MOTHER-DIGEST.md` as a
  conditional Witten-Laplacian lattice-reduction package with explicit
  `(H-BAL)`, `(H-CONST)`, `(H-MB)` and `(H-HAM)` hypotheses and errata.
- Previous status heartbeat:
  [#60](https://github.com/lluiseriksson/physmath-knowledge-tree/pull/60)
  refreshed this file and is merged into the reviewed HEAD.
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
- No current operational digest is in review. The `2602.0032` digest is now
  merged into the reviewed HEAD and remains separate from `2602.0020` and
  `2602.0021`.

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
