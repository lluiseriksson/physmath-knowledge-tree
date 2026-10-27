# TU Jensen search and the three-color lifting obstruction

Target: Leake–Mohammadi Yekta, arXiv2609.39917v1 Question1.7. The current primary metadata still exposes the same question; the unrestricted claim is not proved or refuted here. This is a research obstacle and finite experiment record, not a paper or importance assessment.

## New regimes, compared with398/399

The older weighted binary search used only the five-cycle augmentation [I5|-I5+adj(C5)]. This run instead tested the oriented-incidence matrices of K5 and K6 and regular-matroid duals from K5 and K3,3. Each has24 fixed seeded integer weight assignments. Exact dynamic-programming fiber counts feed9600 floating-point LP envelope searches; none failed, none exceeded the1e-7 lead threshold, and the largest positive discrepancy was6.733e-13. No rational/integer Jensen counterexample was obtained. A negative LP search is not a proof, even of every finite instance.

All square minors of the four new input matrices were checked with integer arithmetic:1000,15503,8007 and714 minors respectively. Native outputs and all counts are retained. SEARCH808's original vertices field mistakenly contains equation-rank+1; METADATA808-CORRECTION preserves the original data and gives the correct graph interpretation. This changes no matrix, count or LP dimension.

A separate exact test compared coefficients of F_b(w)^3 with F_a(w)F_c(w)F_d(w), where a+c+d=3b. Here F is the binary fiber polynomial in independent positive external weights. Five fixed matrices (K4,K5,dual K3,3,dual K5 and the previous five-cycle augmentation) passed261149 nontrivial integer-mean RHS triples, with no negative coefficient witness. This is a finite ternary control only: not arbitrary rational probabilities, all matrices or the full unbounded-fiber Jensen question. Integer mean feasibility follows from the integrality of the TU box polytope; no missing central fiber may be silently assumed in a broader non-TU setting.

## Exact obstruction to a direct proof transfer

Let M be the3-by6 oriented incidence of K4 with its last vertex row deleted. For three colors and shared edge capacities use the full-row-rank reduced lift

L = [[M,0,0],[0,M,0],[I6,I6,I6]], of size12-by18.

The third color's M row equations are determined by the first two and the capacity equations. This is a proposed higher-color interface, not the two-level Lawrence operation of the literature.

L has a12-by12 minor with determinant-2 and another with absolute determinant1. Thus it is not even unimodular (nonzero maximal minors do not have a common absolute value), not merely non-TU. A direct invocation of the source's unimodular midpoint theorem on this exact lift is invalid. No claim is made that every alternative lift or every higher-color proof fails.

The exhibited determinant-2 basis has a nonnegative half-integral basic vertex with an integral RHS and capacity rows all1. Enumerating all729 edge colorings gives8 integral points for that RHS. This does NOT refute Jensen or integer feasibility; it supplies a fractional vertex and the missing-hypothesis warning. The source's actual midpoint theorem is unchanged. The general loss of integrality in higher-color constructions is established background, not a certified new discovery; no worldwide priority claim is made for this explicit local witness.

The [exact certificate](../evidence/2026-10-27-tu806/LIFT815-VERIFIED.json) supplies every matrix entry, selected column, determinant, vertex and RHS. [verify815.py](../evidence/2026-10-27-tu806/verify815.py) checks the determinant with both SymPy and FLINT and re-enumerates the729 colorings. This is arithmetic implementation diversity, not independent model/human review or Lean verification.

## Layers, limits and next action

- Literature: selected primary Question1.7 and the earlier midpoint statement; Bernstein–Sullivant Definition1.1 and selected two-level Lawrence preservation statements. No full classification or priority audit. A separate author catalogue surfaced restricted low-dimensional Jensen claims; only its abstract was seen, so that route must not be presumed new or verified here.
- Graph-supported inference: small algebra/complexity neighborhood retrieved before synthesis; canonical graph and confidence labels unchanged.
- Heuristic: LP envelope searches are leads only; no strict lead was obtained. The exact finite ternary counts are controls, not a universal theorem.
- Speculative: a TU-specific central-fiber coupling or another structural proof retaining all quantifiers. The naive lift-based proof move has the exact falsifier above.
- Formal: no new proof-assistant result or importance score. The existing published optical v3/report754 remains untouched.

Next seek a direct universal argument or a genuine Jensen witness, not more repetitions of these matrices or a paper composed of tables. Any use of the higher-color lift must pay for its nonunimodularity. Preserve the optical provenance/capsule task as pending; this search does not close it. Native scripts retain declared historical dependencies; no ready Research Capsule or whole-campaign reproducibility claim is made.

[Leake–Yekta primary question](https://arxiv.org/html/2609.39917v1#S1.SS2). [Bernstein–Sullivant primary background](https://doi.org/10.1016/j.jctb.2016.11.003). Directed primary refresh807 covers13 endpoints with dated response hashes and unchanged OpenAI/DeepMind pins; this is not exhaustive mathematical coverage. No foreign full text is redistributed.

[Own evidence manifest](../evidence/2026-10-27-tu806/PUBLIC-MANIFEST816.json).
