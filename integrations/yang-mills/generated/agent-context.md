# Compact Yang–Mills agent context

- Inspected HEAD: `4ac57638396f62c4cb968676a07a9ae95bd982be` (feat(RG): transport CMP116 raw source to Appendix-F hraw)
- Ledger: Addendum 296; verified core 8349 jobs.
- Current frontier: SingleScaleUVDecay is verified; a clean top-level raw-source/H# to M3 theorem is not present at the inspected HEAD.
- Next commit: **feat(RG): assemble raw-source Hsharp into geometric M3** (risk: low).
- Preferred physical follow-up: named marginal SingleScaleUVDecay consumer.

## Verified declaration path

- `YangMills.RG.PhysicalGaugeCMP116ActivityTransport.of_cmp116RawSource` — Construct the canonical dictionary-backed activity transport from a raw-source compatibility package.
- `YangMills.RG.physicalGaugeCMP116SupportHypotheses_of_cmp116RawSource` — Project the canonical raw-source transport into the Appendix-F support package.
- `YangMills.RG.balabanCMP116_hraw_of_cmp116RawSource` — Produce the exact Appendix-F pointwise hraw shape for the transported family.
- `YangMills.RG.physicalGaugeCMP116RawSourceScaleFamily` — Package the raw-source transport as a family indexed by distance and RG scale.
- `YangMills.RG.singleScaleUVDecay_of_cmp116RawSource_hsharp` — Feed the transported family to the H# endpoint and obtain the consumer-facing SingleScaleUVDecay predicate.
- `YangMills.RG.SingleScaleUVDecay` — Semantic scalar per-scale UV decay consumed by mass-gap assemblies.
- `YangMills.RG.lattice_mass_gap_of_singleScaleUVDecay_geometric` — Consume SingleScaleUVDecay plus a geometric profile g_k <= C r^k and IR decay to produce a positive lattice decay rate.
- `YangMills.RG.lattice_mass_gap_of_cluster_and_marginal_coupling` — Use the marginal recursion and summability of g^kappa0 to assemble scalar per-scale decay into lattice exponential decay.

## Planned declarations

- `YangMills.RG.lattice_mass_gap_of_cmp116RawSource_hsharp_geometric` — Compose the verified raw-source H# producer directly with the named geometric SingleScaleUVDecay consumer.
- `YangMills.RG.lattice_mass_gap_of_singleScaleUVDecay_marginal` — Give the marginal assembly a named semantic consumer of SingleScaleUVDecay.
- `YangMills.RG.lattice_mass_gap_of_cmp116RawSource_hsharp_marginal` — Compose the raw-source H# producer with the faithful named marginal consumer.

## Next commit contract

**Files:** `YangMills/RG/PhysicalGaugeCMP116RawUVMassGap.lean`, `YangMillsCore.lean`, `oracle_check.lean`, `CURRENT-STATE.md`, `docs/VERIFICATION-LEDGER.md`

**Conclusion:** A positive uniform lattice decay rate for covIR + covUV_concrete, conditional on the complete raw-source/H# package and a geometric scale profile.

**Still conditional:** obl.gaussian-pushforward, obl.root-localization, obl.wilson-hessian, obl.local-activity, obl.raw-decay, obl.support-localization, obl.measurability, obl.hsharp-remainder-identity, obl.geometric-profile, obl.uniform-constants.

## Hard guardrails

- resolve the current HEAD and search planned declaration names
- prefer a thin composition theorem before a new structure
- encode the branch in the theorem name
- Do not: say hRpoly is proved
- Do not: claim continuum mass gap or Clay
- list all support roles separately
- label the statement source-anchor, candidate, theorem-shape or Lean-verified
- state the exact quantifier order and allowed constant dependencies
- state the exact correlator expression and constants
- include isolated Lean, core, oracle, consistency and diff commands

## Refresh before use

1. Resolve the current default-branch HEAD without assuming the stored SHA.
1. Search for every planned declaration name before proposing it.
1. Inspect consumers of SingleScaleUVDecay and compare geometric versus marginal assumptions.
1. Update this snapshot only after Lean and oracle verification.
