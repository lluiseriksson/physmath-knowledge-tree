# Mother-facing digest - Yang-Mills unblock batch 2026-07-03

This digest is a small handoff from `physmath-knowledge-tree` to the
THE-ERIKSSON-PROGRAMME working memory. It names the exact repository objects
that can be consumed next. It does not claim `hRpoly`, a continuum mass gap,
Osterwalder-Schrader reconstruction, Wightman reconstruction, a source theorem
or a Clay result.

## Source boundary

- Curated record: `curation/records/ym-unblock-2026-07-03.json`
- Human extract: `docs/curated/YM-UNBLOCK-2026-07-03-MATHEMATICAL-EXTRACT.md`
- Source queue: `docs/curated/YM-UNBLOCK-2026-07-03-SOURCE-QUEUE.md`
- Staged candidates: `docs/curated/YM-UNBLOCK-2026-07-03-CANDIDATES.json`
- Agent pack snapshot: `integrations/yang-mills/generated/agent-context.md`
- Inspected formal HEAD in the pack: `4ac57638396f62c4cb968676a07a9ae95bd982be`

## Ready-to-consume formal names

The current pack says these declarations are already verified in the inspected
formal repository snapshot:

- `YangMills.RG.PhysicalGaugeCMP116ActivityTransport.of_cmp116RawSource`
- `YangMills.RG.physicalGaugeCMP116SupportHypotheses_of_cmp116RawSource`
- `YangMills.RG.balabanCMP116_hraw_of_cmp116RawSource`
- `YangMills.RG.physicalGaugeCMP116RawSourceScaleFamily`
- `YangMills.RG.singleScaleUVDecay_of_cmp116RawSource_hsharp`
- `YangMills.RG.SingleScaleUVDecay`
- `YangMills.RG.lattice_mass_gap_of_singleScaleUVDecay_geometric`
- `YangMills.RG.lattice_mass_gap_of_cluster_and_marginal_coupling`

These names can be used as search anchors before editing THE-ERIKSSON-PROGRAMME.
They should be rechecked against the live default branch before any code change.

## Next thin consumer shape

The pack's next low-risk commit contract is:

- Commit id: `commit.raw-hsharp-geometric-m3`
- Planned declaration:
  `YangMills.RG.lattice_mass_gap_of_cmp116RawSource_hsharp_geometric`
- Intended file:
  `YangMills/RG/PhysicalGaugeCMP116RawUVMassGap.lean`
- Local verification targets in the formal repository:
  `lake env lean YangMills/RG/PhysicalGaugeCMP116RawUVMassGap.lean`,
  `lake build YangMillsCore`, `lake env lean oracle_check.lean`,
  `python scripts/check_consistency.py`, `git diff --check`

This is a composition target only. Its conclusion remains conditional on the
raw-source/H# package, a geometric scale profile and IR decay input.

## Hypotheses that must stay visible

Do not collapse these obligations into a generic activity assumption:

- `obl.gaussian-pushforward`
- `obl.root-localization`
- `obl.wilson-hessian`
- `obl.local-activity`
- `obl.raw-decay`
- `obl.support-localization`
- `obl.measurability`
- `obl.hsharp-remainder-identity`
- `obl.geometric-profile`
- `obl.marginal-recursion`
- `obl.uniform-constants`

Support roles also stay separated: spectator, fluctuation, physical-active,
Omega, skeleton and full-target.

## Source checks blocking promotion

The source queue names the checks that block any promotion beyond heuristic
staging:

- Recover the exact CMP source packet for Wilson second variation, gauge fixing,
  nonlinear block map, flat periodic Hodge/Poincare constants, small-background
  defect norm, the operator before CMP95 estimates, CMP109 one-step fluctuation
  integral and Omega restriction/enlargement convention.
- Verify Balaban Eq. (2.31), CMP119 Eq. (2.42), Cammarota CMP85, termwise
  activity identification and covariance-root localization.

Until these are resolved against primary sources, the P4 activity contract and
frontier blockers remain staging objects, not literature or formal graph data.

## Useful next action

For the formal repository: refresh HEAD, grep for the planned declaration names,
then attempt only the thin geometric wrapper if the verified declarations above
still exist. For this repository: keep the curated queue pending until those
source checks are either cited exactly or recorded as blocked.
