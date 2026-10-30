# Conditional marginal endpoint: provenance correction, 30 October 2026

The June agent pack proposed two adapters that already exist at programme HEAD
`a9937ee1dd5978bf372174500a2395cf259eb395`. The correction prevents duplicate
implementation; it supplies no new physical estimate or mass-gap theorem.
The core graph and its confidence labels are unchanged.

## Mechanism and formal scope

`lattice_mass_gap_of_singleScaleUVDecay_marginal` consumes the scalar decay
predicate, positive time-decay constants, a positive running coupling satisfying
`g(k+1) = g(k) (1 - beta g(k))`, `beta g(k) < 1`, exponent `kappa0 > 1`,
and an IR exponential bound. Summability of `g(k)^kappa0` then permits the
marginal assembly. The raw-source/H# adapter composes the existing producer
with this consumer in `PhysicalGaugeCMP116RawM3.lean`.

This preserves a scalar remainder bound and the explicit source assumptions.
It loses the underlying polymer, support and measure data unless their
identification has already been supplied. At fixed parameters the conclusion
has a positive gap valid for every time. A gap uniform in volume or cutoff
requires a separate constants package outside those quantifiers.
The frontier structure packages assumptions and proves none of its fields.

## Verification and limits

The [exact-head CI run](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/actions/runs/41029119825)
compiled the core (8466 jobs) and completed its axiom oracle: 2854 readouts,
2828 using the standard three axioms or a subset, 26 axiom-free, none
non-standard. Both adapter files are direct core imports. The separate 8313-job
build covers other oracle imports; it is not an additional core count.
The [machine record](data/verification-2026-10-30.json) pins the source blobs,
toolchain, all nine manifest dependency commits and selected actual log lines.
Dependency checks establish commit identity/existence, not an independent
reproduction of the runner checkout or kernel build.

This audit inspected source statements, adapter bodies, import entries and
remote CI records. It did not rebuild the programme locally or independently
prove the physical source estimates. A separate auxiliary orchestrator run
failed and was not investigated; the claim is confined to the successful Lean
core/oracle job. The source tree changed since the older recorded October
checkpoint, so equal entrypoint blobs alone would not justify transferring its
build. Current-head CI was checked separately.

## Research decision and falsifier

- **Formal:** the two conditional marginal adapters are already implemented,
  with recorded exact-head CI evidence. Historical registry IDs are retained.
- **Literature:** source citations remain provenance for estimates to translate;
  they do not discharge Lean hypotheses.
- **Heuristic:** audit a concrete physical remainder identity or uniform bound
  before adding further wrappers. State which external assumption is eliminated.
- **Speculative:** no new physical claim is advanced. Abandon a proposed wrapper
  if its name already exists; reject a uniformity claim if its constants depend
  on the indices over which uniformity is asserted.

`hRpoly`, concrete physical source construction, uniform analytic estimates,
the continuum limit and reconstruction remain open. Historical geometric and
later roadmap plans are held for reconciliation; a bounded lookup does not
establish global absence. There is no new manuscript, model score or AIRR
publication associated with this provenance correction.

## Primary source anchors

- [Named marginal consumer](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/a9937ee1dd5978bf372174500a2395cf259eb395/YangMills/RG/MarginalUVMassGap.lean)
- [Raw-source/H# marginal composition and frontier](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/a9937ee1dd5978bf372174500a2395cf259eb395/YangMills/RG/PhysicalGaugeCMP116RawM3.lean)
- [Core import closure entrypoint](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/a9937ee1dd5978bf372174500a2395cf259eb395/YangMillsCore.lean)
- [Canonical project state](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/a9937ee1dd5978bf372174500a2395cf259eb395/project-state.json)
