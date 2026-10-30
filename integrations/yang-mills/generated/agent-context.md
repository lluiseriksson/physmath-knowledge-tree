# Compact Yang–Mills agent context

- Inspected HEAD: `a9937ee1dd5978bf372174500a2395cf259eb395` (Merge pull request #97 from lluiseriksson/codex/consolidated-flat-wall-20261030: Consolidate the closed flat rank walls and audit the actual CT route)
- Core: 8466 jobs; Recorded GitHub CI, not an independent local programme rebuild. Historical ledger anchors are retained separately.
- Current frontier: Both formerly planned marginal adapters exist and are imported by the successful exact-head core build. They preserve explicit source, H# identity, IR and marginal-recursion assumptions. hRpoly and physical uniform estimates remain open. The old geometric and later roadmap plans have not been globally reconciled and must not be proposed from this snapshot.
- Next commit: **Audit one physical source obligation after reconciling historical plans** (risk: medium).
- Preferred physical follow-up: Audit one concrete physical source obligation and its volume/cutoff quantifiers; do not reimplement the existing marginal adapters.

## Declarations with recorded verification anchors

- `YangMills.RG.PhysicalGaugeCMP116ActivityTransport.of_cmp116RawSource` — Construct the canonical dictionary-backed activity transport from a raw-source compatibility package. Anchor: `4ac57638396f62c4cb968676a07a9ae95bd982be`; historical verification, not re-audited at current HEAD.
- `YangMills.RG.physicalGaugeCMP116SupportHypotheses_of_cmp116RawSource` — Project the canonical raw-source transport into the Appendix-F support package. Anchor: `4ac57638396f62c4cb968676a07a9ae95bd982be`; historical verification, not re-audited at current HEAD.
- `YangMills.RG.balabanCMP116_hraw_of_cmp116RawSource` — Produce the exact Appendix-F pointwise hraw shape for the transported family. Anchor: `d1023e1f7bd7cb315b931f0592cb4334ba1b71e4`; historical verification, not re-audited at current HEAD.
- `YangMills.RG.physicalGaugeCMP116RawSourceScaleFamily` — Package the raw-source transport as a family indexed by distance and RG scale. Anchor: `d1023e1f7bd7cb315b931f0592cb4334ba1b71e4`; historical verification, not re-audited at current HEAD.
- `YangMills.RG.singleScaleUVDecay_of_cmp116RawSource_hsharp` — Feed the transported family to the H# endpoint and obtain the consumer-facing SingleScaleUVDecay predicate. Anchor: `d1023e1f7bd7cb315b931f0592cb4334ba1b71e4`; historical verification, not re-audited at current HEAD.
- `YangMills.RG.SingleScaleUVDecay` — Semantic scalar per-scale UV decay consumed by mass-gap assemblies. Anchor: `d1023e1f7bd7cb315b931f0592cb4334ba1b71e4`; historical verification, not re-audited at current HEAD.
- `YangMills.RG.lattice_mass_gap_of_singleScaleUVDecay_geometric` — Consume SingleScaleUVDecay plus a geometric profile g_k <= C r^k and IR decay to produce a positive lattice decay rate. Anchor: `d1023e1f7bd7cb315b931f0592cb4334ba1b71e4`; historical verification, not re-audited at current HEAD.
- `YangMills.RG.lattice_mass_gap_of_cluster_and_marginal_coupling` — Use the marginal recursion and summability of g^kappa0 to assemble scalar per-scale decay into lattice exponential decay. Anchor: `d1023e1f7bd7cb315b931f0592cb4334ba1b71e4`; historical verification, not re-audited at current HEAD.
- `YangMills.RG.lattice_mass_gap_of_singleScaleUVDecay_marginal` — Give the marginal assembly a named semantic consumer of SingleScaleUVDecay. Anchor: `a9937ee1dd5978bf372174500a2395cf259eb395`; remote exact-head CI; direct core import; no independent local replay.
- `YangMills.RG.lattice_mass_gap_of_cmp116RawSource_hsharp_marginal` — Compose the raw-source H# producer with the faithful named marginal consumer. Anchor: `a9937ee1dd5978bf372174500a2395cf259eb395`; remote exact-head CI; direct core import; no independent local replay.

## Historical plans requiring reconciliation

- `YangMills.RG.lattice_mass_gap_of_cmp116RawSource_hsharp_geometric` — historical-unreconciled. Historical proposed name and file only. Current global presence/absence was not checked; do not propose or implement before reconciling it.

## Next commit contract

**Files:** `HYPOTHESIS_FRONTIER.md`, `YangMills/RG/PhysicalGaugeCMP116RawM3.lean`

**Conclusion:** Produce a source-to-binder audit for one concrete physical remainder identity or uniform estimate, with exact quantifier order and a falsifier. Reconcile each old proposed name before any implementation; no new adapter or theorem is asserted.

**Still conditional:** all unproved physical source estimates, hRpoly, continuum limit and reconstruction.

## Hard guardrails

- resolve the current HEAD and search planned declaration names
- check whether the composition already exists; add no duplicate and prioritize elimination of a concrete external hypothesis
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
1. Bind the declaration import closure and exact source HEAD to a successful core/oracle record; disclose remote CI versus independent local replay. Preserve older verification anchors as historical.
1. Do not interpret historical-unreconciled plans as absent declarations or authorized duplicate implementation tasks.
