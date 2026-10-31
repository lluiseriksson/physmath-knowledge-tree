# Reject the automatic interpolation transfer

Participating-parent counterexample/application, unreviewed. The counterexample concerns a proposed GENERIC implication. It does not refute the source construction, the actual first precision, or any reviewed manuscript result.

Source scope: CMP116 printed3–5 Eq1.5–1.14 and printed13 Eq2.7 read in this activation; DOI10.1007/BF01239022, cached SHA256 ee39523a0f7b83af958513c7bd6f9c7731934b40355ef5d6b0f7a68ee6d022fc. Selected statements only, not full source proof audit. The source introduces parameters on generalized random-walk localization domains, multiplying each term by the product over DISTINCT intersected cubes. It requires a complex polydisc |s(Delta)|<=exp(kappa1), not merely real convex interpolation. Printed5 bounds these tagged operators by B0 exp(16 kappa1); long-walk geometric decay pays the parameter count, and short walks have a separately retained finite factor. Source2.7 also needs the covariance square root.1540's ordinary inverse estimate is not automatically all these statements.

## Exact finite falsifier

Let

    Q(s)=(3/2) I+s (J-I),

where J is the 3 by3 all-ones matrix. Its eigenvalues are 3/2+2s and 3/2-s (the latter twice). At s=0 it is the block-diagonal precision; at s=1 it is a real positive precision. For every REAL 0<=s<=1, Q(s)>=1/2 I. Nevertheless

    det Q(s)=(3/2+2s)(3/2-s)^2

vanishes at s=-3/4, INSIDE the complex unit disc. Hence a uniform real gap of a convex diagonal/full interpolation does not imply an inverse or log determinant analytic on the source's unit-or-larger complex polydisc. This is an exact rational calculation, independently expanded with SymPy in FALSIFIER1541.json; no numerical eigenvalue tolerance is involved.

It also exposes a second shortcut. For Q(1), take B0=7 and T=I-Q(1)/7. Then T has eigenvalues1/2,13/14,13/14; the ordinary Neumann series converges with a spectral gap. But the entrywise absolute matrix |T| has largest eigenvalue15/14>1. Thus the absolute sum over its INDIVIDUAL fine-coordinate walks diverges even though powers T^n after cancellation satisfy the spectral bound used1540. One cannot tag those individual walks by independent localization variables and retain the1540 estimate merely by taking absolute values. Both signs and the distinction between a matrix power and its expanded paths matter.

1540 remains valid as a conditional inverse/weighted-row lemma: its proof bounds the already multiplied T_D^n with its actual cancellations and finite propagation. It never proved the source tagged walk expansion. The present falsifier abandons precisely the attempted automatic transfer from that lemma or real convex block interpolation to the source polydisc. It does not show that no suitable interpolation exists.

## A finite way forward, without replacing the gap by a name

Inspect the ACTUAL generalized-walk construction CMP99 propagators Sect.C, Eq3.107–3.108 (the CMP116 reference[13]), and its localization domains/buffers. A possible operator construction to check against it is a partition-of-unity parametrix using overlapping fixed-size patch inverses. If sum chi_i^2=1, each chi_i is supported a precision range inside its patch D_i, and its discrete gradient is O(1/M), set G0=sum chi_i Q_Di^-1 chi_i. The identity Q G0=I+K has K built from [Q,chi_i] Q_Di^-1 chi_i; the1540 uniform row/column inverse and bounded overlap suggest ||K||<=C/M. This is only a next finite target until the domain extension, commutator identity, BOTH weighted norms and parameter counting are actually verified. It must not be promoted to an existing source certificate.

If that remainder is genuinely small in an ABSOLUTE local-kernel norm, its walk expansion can survive independent parameter tagging after choosing M large relative to kappa1. This avoids the false use of spectral cancellation alone. Still separately check the source square root/determinant conditioning and the near-block reference estimate2.16; arbitrary parameterized inverses cannot be silently identified with the source's parameterized propagators.

The bare first interaction estimate1539 and fixed-chart Gaussian lemma1540 therefore remain useful conditional inputs. Complete analytic activity transfer stays open. No new paper, manuscript grade, review or PR is warranted for this falsifier alone.

Levels: literature—selected actual complex interpolation requirements; heuristic—participating-parent exact counterexample and scope application; formal—no checked formal result added; speculative/open—actual buffered parametrix/tagged source operator family and full activity/global target. Abandonment condition: any proposed transfer relying only on real positivity or cancellation-dependent fine-walk absolute bounds is rejected by the displayed matrix. A repaired route must exhibit its actual absolute local remainder and complex parameter bounds.
