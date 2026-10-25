# Adjoint moment polytopes: an antecedent for the five-level cost formula

Observed 25 October 2026. This is a directed literature check, not an exhaustive
search or a new manuscript. No new score is assigned.

## Sources and inspected scope

- Serkan Sakar, *Schubert calculus, adjoint representation and moment polytopes*,
  Bilkent University master's thesis, June 2012, supervised by Alexander Klyachko.
  [Official record](http://hdl.handle.net/11693/15547) and
  [official PDF](https://repository.bilkent.edu.tr/server/api/core/bitstreams/79372722-5a67-4c46-a329-36aec263d815/content).
  PDF SHA-256: `eecc87ea35e0ce2f64b7507445d8dd881b940f83a9f36645e1efa3bfaddcd14d`.
  Selected introduction/method sections and appendices read; PDF page 59
  (printed page 51) inspected visually. Full proof and original computational
  completeness certificates have not been independently replayed.
- Lluis Eriksson, *The Exact Five-Level Inverse Commutator Cost*, 11 August 2026,
  [ARR-2026-37B8R0QTA894GTFF v1](https://airr.science/papers/ARR-2026-37B8R0QTA894GTFF/versions/v1/).
  Exact PDF SHA-256: `cf7d5a17a4c205f08b97acfead00e30a63292df38338504398d322651b27f39c`.
  Reduction, formula and bibliography inspected. Its 17-entry bibliography does
  not list Sakar. The public record is an unassessed historical import; this
  note does not change its publication or assessment status.

These are bibliographic metadata and original synthesis. Third-party full text
is not redistributed here and public access does not authorize model training.

## Dictionary and normalization

The source describes possible ordered spectra of `[A,A*]` with `tr(AA*)=1`
as an adjoint moment polytope. The appendix uses trace-zero coordinates after
subtracting the identity shift. Although the introduction says non-decreasing
once, the table's order facets and chapter 4 use decreasing coordinates. There
are also visible typographical sign errors in the method discussion; this note
does not treat those errors as definitions.

For the author's convention

```text
kappa(F) = (1/2) min ||C||_HS^2  subject to [C,C*] = 2F,
```

put `t=||C||_HS^2/2` and `A=C/sqrt(2t)` when `F` is nonzero. Then
`tr(AA*)=1` and `[A,A*]=F/t`. The reverse rescaling, with unitary conjugation
to the prescribed Hermitian target, gives cost `t`. Consequently the cost is
the radial gauge of the normalized spectral set. No additional factor two
remains. The zero target has zero cost separately.

Centering `C` by subtracting `tr(C)I/d` preserves its commutator and decreases
its squared norm, so the unrestricted optimum is traceless. **This centering
argument must not be used inside a rank constraint:** it can increase rank.
Fixed ambient dimension is retained; zero-padding invariance is not assumed.

## Exact table comparison and its limits

Sakar's Appendix B has four ordering inequalities and twelve non-ordering
inequalities with right-hand side one for dimension five. Each of those twelve
coefficient rows equals one of the author's twelve spectral cost rows modulo a
multiple of `(1,1,1,1,1)`. Such a multiple vanishes on a trace-zero target.
This is equality of the entire row sets, not just matching facet counts.

The accompanying
[exact rational comparison](../checks/adjoint-five-level-comparison.py)
checks all twelve matches. It is a small deterministic arithmetic control, not
a numerical research campaign or a reconstruction of the source's completeness
computation. The appendix's four dimension-four cost rows also match the
earlier four-level formula modulo trace.

The five-level **cost formula itself therefore has a concrete earlier
antecedent**, subject to the source's stated spectral characterization. The
manuscript's first-known closed-form claim needs bibliographic correction.
This does not by itself adjudicate the priority or validity of its optimal-rank
classification, attaining singular spectra, explicit certificates, resource
equality loci or later dimension-uniform results. Those claims require separate
comparisons. An old formula does not make every proof or additional theorem old.

## Research gate

- **Literature:** the thesis states polytopes through dimension nine; a new
  finite table must first be compared with those appendices.
- **Graph inference:** a small neighborhood of representation theory and
  functional analysis supplies the spectral/representation dictionary. Graph
  proximity supplies no theorem or priority evidence.
- **Speculative:** nested moment polytopes for conjugation-invariant rank
  varieties might organize rank-constrained costs. The payoff must be a
  dimension-uniform mechanism, not a renamed existing rank-Horn program.
- **Formal scope:** the rational row comparison is exact arithmetic; no Lean
  theorem or new universal mathematical result is claimed. Canonical graph
  confidence and solved status are unchanged.

Falsifier/abandonment condition: abandon a proposed new paper if its claimed
structure is already supplied by these polytopes or is only a restatement of
the existing rank-Horn linear program. Any new rank mechanism must accommodate
the author's already published dimension-eight excess-rank examples and the
failure of general padding invariance. Keep rank constraints throughout the
argument rather than centering them away.

A single targeted Astra xhigh audit was requested for normalization and this
antecedent comparison, with no score target. It uses shared files and prepared
context; runtime identity and independence are not independently attested.
Its final report is tracked in the private research checkpoint; this note
claims only the explicitly documented comparison and not independent review.
