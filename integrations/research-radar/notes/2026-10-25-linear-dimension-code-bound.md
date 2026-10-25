# Linear dimension bound for encoded positivity: author candidate

25 October 2026. This is a proposed extension of the [audited odd-length hierarchy](2026-10-25-odd-code-hierarchy-and-assessment.md), not a new scored manuscript. The frozen ten-page PDF and its private 9.0 technical/5.0 importance assessment remain unchanged.

## Four evidence layers

- **Sourced fact / literature:** AME marginals are uniform, their encodings have quantum-error-correction privacy, and sufficiently large prime-dimensional examples follow from the known [MDS construction](https://arxiv.org/abs/1701.03359). The source abstract was refreshed; this does not re-audit the complete paper.
- **Graph-supported inference:** the radius-two neighborhood of the algebra and quantum-information anchors contains 15 nodes, with no direct canonical edge between the two anchors. It suggests an operator/combinatorial route but proves no positivity statement.
- **New hypothesis / heuristic candidate:** the existing exact Choi decomposition has a strictly positive outside-code block whenever `n>=3` is odd, `0<t<=1`, and integer `d>=2n/t`, conditional on an AME(n+1,d). An author analytic proof is supplied below, but no separate audit or originality certification has closed.
- **Formal result:** no new Lean declaration or checked formal theorem. Canonical confidence labels and graph counts remain unchanged.

## Mechanism and eliminated hypothesis

Write `n=2m-1`, `L=m-1`. In the existing Choi expansion let `E_S` be the projection onto centered error vectors with exact nonempty support S, for `|S|<=L`. All such projections lie outside the whole output-code block W. They need not be orthogonal for arbitrary supports.

For a fixed m-site subset U, distinct r-site supports S,T contained in U are orthogonal because their union has a maximally mixed marginal and their symmetric difference supplies a trace-zero factor. Therefore their sum is a projection bounded by `I-W`. Averaging over all U gives the elementary cover inequality

`sum_(|S|=r) E_S <= [binom(n,r)/binom(m,r)] (I-W)`.

This projection/counting inequality itself is not claimed novel. Substituting it for the earlier individual-projection bound in the specific encoded Choi expansion reduces the sufficient all-parameter dimension condition from `2n²/t` to `2n/t`. It preserves the AME assumption, whole-code support restriction, exact original-slot trace form and complex-conjugation conventions. It does not remove those substantive hypotheses.

The author proof gives a conservative common unnormalized Choi gap `41/564`. For n>=7 it bounds the scalar part below by `7/12` and the negative error contribution above by `24/47`; n=3 and n=5 have stronger separate bounds. The exact k-sign criterion and uniform order `floor(t^(-n))` then follow by the existing output-block and Schmidt arguments. Their optimality over dimensions still uses the previously attributed large-prime MDS construction, not a new code.

The earlier half-parameter domain `d>=2n` is stronger than this candidate's specialization `d>=4n`; it remains a separate result with its own gap. This proposal neither improves that endpoint nor claims an optimal dimension threshold.

## Finite reduction and falsifier

Author materials: [analytic proof](2026-10-25-linear-dimension-proof.txt) and [exact rational controls](2026-10-25-linear-dimension-controls.py). The latter checks 360 scalar cases: odd n from 3 through 61, four rational parameters, and three dimensions per pair. It also checks the exact binomial-cover multiplicity and rational constants. Its minimum sampled lower bound is `4/15`. These finite checks do not test a full Choi matrix or establish the universal operator theorem.

- **Falsifier:** an AME encoding and outside-code vector with Choi Rayleigh value below `41/564` inside the proposed domain, or an invalid cover/sign inequality in the proof.
- **Minimal formal target:** for projections whose r-support families inside every m-subset are orthogonal, prove the displayed averaged cover inequality by double counting.
- **Next audit:** reconstruct the operator expansion and cover lemma without assuming orthogonality between arbitrary error supports; compare the precise encoded positivity claim with prior literature.
- **Abandonment condition:** a counterexample to the universal bound, or an equivalent earlier theorem requiring reattribution. Failure to improve a score is not a reason to restart a reviewer.

The map family remains completely copositive on the stated parameter interval and therefore belongs to the known trivial tensor-stable class. No unrestricted Werner result, nontrivial tensor-stability, physical realization of a non-CP map, new AME existence theorem or importance prediction follows.

## Custody and review status

Proof SHA256: `e1c77bfeaa2cf824f9d8afb874a3b12ffd8f8cf17c77c01bd480b4df7c1f9d05`. Original derivation and exact control output are archived privately with hashes. This public note contains author synthesis and own code, no copied third-party corpus. No Research Capsule readiness or independent human review is claimed. Source refresh was directed, not exhaustive; no training permission follows from retrieval.
