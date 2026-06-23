# Yang–Mills commit roadmap

## 1. feat(RG): assemble raw-source Hsharp into geometric M3

- Status: next
- Risk: low
- Files: `YangMills/RG/PhysicalGaugeCMP116RawUVMassGap.lean`, `YangMillsCore.lean`, `oracle_check.lean`, `CURRENT-STATE.md`, `docs/VERIFICATION-LEDGER.md`
- Conclusion: A positive uniform lattice decay rate for covIR + covUV_concrete, conditional on the complete raw-source/H# package and a geometric scale profile.
- Remains conditional: obl.gaussian-pushforward, obl.root-localization, obl.wilson-hessian, obl.local-activity, obl.raw-decay, obl.support-localization, obl.measurability, obl.hsharp-remainder-identity, obl.geometric-profile, obl.uniform-constants
- Verification:
  - `lake env lean YangMills/RG/PhysicalGaugeCMP116RawUVMassGap.lean`
  - `lake build YangMillsCore`
  - `lake env lean oracle_check.lean`
  - `python scripts/check_consistency.py`
  - `git diff --check`

## 2. feat(RG): add the marginal SingleScaleUVDecay M3 consumer

- Status: planned
- Risk: low
- Files: `YangMills/RG/MarginalUVMassGap.lean`, `YangMills/RG/PhysicalGaugeCMP116RawUVMassGap.lean`, `oracle_check.lean`
- Conclusion: The raw-source/H# frontier reaches the faithful 4D marginal M3 assembly without a geometric-coupling surrogate.
- Remains conditional: obl.hsharp-remainder-identity, obl.marginal-recursion, obl.uniform-constants
- Verification:
  - `lake env lean YangMills/RG/MarginalUVMassGap.lean`
  - `lake env lean YangMills/RG/PhysicalGaugeCMP116RawUVMassGap.lean`
  - `lake env lean oracle_check.lean`

## 3. refactor(RG): name the raw Hsharp hypothesis frontier

- Status: planned
- Risk: medium
- Files: `YangMills/RG/PhysicalGaugeCMP116RawHsharpFrontier.lean`, `YangMills/RG/PhysicalGaugeCMP116RawUVMassGap.lean`
- Conclusion: One stable bundle with projections to SingleScaleUVDecay and both M3 branches.
- Remains conditional: inhabitation of the frontier by the physical model
- Verification:
  - `lake env lean YangMills/RG/PhysicalGaugeCMP116RawHsharpFrontier.lean`
  - `#print axioms on every projection`

## 4. docs(RG): audit the CMP116 raw Hsharp analytic frontier

- Status: planned
- Risk: low
- Files: `docs/CMP116-RAW-HSHARP-M3-FRONTIER.md`, `HYPOTHESIS_FRONTIER.md`, `CURRENT-STATE.md`
- Conclusion: A binder-to-source audit table that an agent can query without re-reading the entire RG tree.
- Remains conditional: all analytic mathematics
- Verification:
  - `check every declaration name with grep/#check`
  - `validate links and ledger references`

## 5. refactor(RG): replace opaque source Props with typed source facts

- Status: planned
- Risk: medium-high
- Files: `YangMills/RG/PhysicalGaugeCMP116ActivityConstruction.lean`, `YangMills/RG/PhysicalGaugeCMP116RawHsharpFrontier.lean`
- Conclusion: Source hypotheses mention concrete operators, activities and equalities instead of arbitrary Prop parameters.
- Remains conditional: proofs of the typed facts
- Verification:
  - `compile the full raw-source -> H# chain`
  - `ensure each new field is consumed downstream`

## 6. feat(RG): make finite-volume and scale uniformity explicit

- Status: planned
- Risk: high
- Files: `YangMills/RG/PhysicalGaugeCMP116UniformRawHsharp.lean`
- Conclusion: A single constants package lies outside all finite-volume, cutoff, background, hole and scale quantifiers.
- Remains conditional: uniform analytic estimates
- Verification:
  - `check quantifier order in #check output`
  - `instantiate with a finite toy index`
  - `prove pointwise projections`

## 7. test(RG): prove non-vacuity of the numerical Hsharp shell

- Status: planned
- Risk: medium
- Files: `YangMills/RG/AppendixFHsharpNumericalWindow.lean`, `oracle_check.lean`
- Conclusion: The numerical smallness and denominator conditions are jointly satisfiable without asserting a physical source package.
- Remains conditional: all physical/source obligations
- Verification:
  - `construct explicit witnesses`
  - `oracle output is standard only`

## 8. feat(RG): state the Balaban-Dimock raw Hsharp source estimate interface

- Status: planned
- Risk: medium-high
- Files: `YangMills/RG/BalabanDimockCMP116SourceEstimate.lean`, `docs/BALABAN-DIMOCK-CMP116-SOURCE-TARGET.md`
- Conclusion: One source theorem-shaped object projects directly to the raw H# frontier and marginal M3 conditional.
- Remains conditional: construction of the source estimate object from Balaban/Dimock
- Verification:
  - `every field has a downstream consumer`
  - `removing any source field breaks a named projection`
  - `full core/oracle checks`
