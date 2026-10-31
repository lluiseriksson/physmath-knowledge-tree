# Buffered patch inverses repair the absolute-walk gap

Participating-parent derivation, unreviewed. This concerns the actual FIRST free finite-range precision under1540's retained hypotheses. It does not identify a different operator with a source propagator or certify a full activity theorem.

Source examined: Balaban, Propagators for Lattice Gauge Theories, CMP99,389–434, DOI10.1007/BF01240355, printed414/416 Eq3.101–3.108 visually checked in cached balabanfusion.pdf SHA256 00cc6b218dcf0e1c2884e135caa1d57b3591df036540b685e7440f30cbd4ff16. This is CMP116 reference[13], distinct from its gauge-fixing reference. Selected statements, not full proof audit. Source3.105 constructs a commutator/buffer remainder with O(M^-1) norm;3.106 expands that remainder;3.107–3.108 give generalized localized walks. Additional source projection terms and multiscale differential norms are not removed by the simpler argument below.

## Fixed antecedents and concrete partition

Let Q(U) be the actual free precision of1540: range R, local background-carrier range R_bg, bounded BOTH weighted row/column norms, and principal inverses C_D(U) uniformly bounded in the alpha weighted Schur norm by C_inv on a fixed complex chart. Q has a real flat gap and the fixed-chart perturbation already stated1540; those parent antecedents remain unreviewed.

On the source-admissible periodic lattice choose overlapping cubes D_i of diameter O(M), with a real scalar partition sum_i chi_i(x)^2=1. Require |chi_i|<=1, bounded overlap N independent of M/volume, discrete Lipschitz constant G/M, and support chi_i separated by more than R from the complement of D_i. Such a partition is constructed from translates of a fixed compactly supported bump on an M-spaced grid, enlarged cubes, and division by the square root of the sum of squared bumps; the covering lower bound and finite overlap control that denominator and derivative uniformly. Compatible periodic sizes/lifts are required, not arbitrary nonexistent source partitions.

Extend C_Di by zero. Define

    G0=sum_i chi_i C_Di chi_i,
    K=sum_i [Q,chi_i] C_Di chi_i.

Then EXACTLY Q G0=I+K. Indeed Q chi_i=chi_i Q+[Q,chi_i]. Where chi_i is nonzero, its collar ensures that Q applied to the zero-extended patch inverse is the same as its principal restriction; chi_i Q C_Di chi_i=chi_i^2. Outside the collar there is no surviving chi_i factor. This is why a bare restriction without a buffered cutoff is insufficient.

The commutator kernel is Q(x,z)(chi_i(z)-chi_i(x)); a scalar diagonal/tI commutes. Since Q(x,z)=0 beyond R, its extra factor is <=G R/M. The weighted triangle inequality and patch inverse bound give an ABSOLUTE sum bound

    max(row,col) sum_i |[Q,chi_i] C_Di chi_i|_alpha
        <= N G R C_Q,alpha C_inv / M =eta_M.

Fixed block-dimension constants are included in C_Q,alpha. For rows, only boundedly many i have a nonzero commutator near x; for columns, only boundedly many i have chi_i(y) nonzero. Thus no number-of-patches or M^d factor is hidden. Similarly the absolute local summands of G0 have total weighted Schur norm <=N C_inv. These are bounds on individually localized kernels BEFORE multiplying and summing them, unlike the cancellation-dependent fine powers rejected1541.

For eta_M<1,

    Q^-1=G0 (I+K)^-1=sum_(n>=0) G0 (-K)^n.

Each factor depends only on background in D_i enlarged by R_bg and the precision collar. Each product is supported on a chain of overlapping such patch domains because successive kernels share an intermediate coordinate. It is an actual local-kernel walk representation; its absolute norms form a geometric series. Signs remain in the identity, but convergence does not rely on their cancellation.

## Distinct cube tags on a complex polydisc

Partition the localization region into tag cubes of size comparable to M, as in the first source localization. A factor domain of diameter O(M), with its background collar, meets at most m0 tag cubes, uniformly in M once M exceeds the fixed ranges. For a walk containing n+1 factors, multiply by the product of s(Delta) over DISTINCT tag cubes meeting the union of its full factor-dependence domains. This tag choice includes background dependence of the patch inverse, not merely its output support. The number of distinct tags is <=m0(n+1).

On |s(Delta)|<=exp(kappa), the absolute walk series is therefore bounded by

    N C_inv exp(m0 kappa)
       sum_(n>=0) [eta_M exp(m0 kappa)]^n.

Choose fixed M sufficiently large that eta_M exp(m0 kappa)<=1/2. The series defines a uniformly holomorphic tagged operator in those parameters and background variables. At all s=1 it is the ACTUAL Q^-1. It is NOT asserted to be the inverse of a convexly interpolated precision Q(s), nor to remain globally invertible or positive for all complex s.1541's counterexample is fully respected.

When tags outside an allowed region vanish, surviving factor-dependence domains lie in that region. Only chains inside its connected components survive. This gives exact component localization for the tagged kernel, as distinct from merely exponential decay of an untagged inverse. A protected untagged root region can be retained by excluding its cubes from the tag family; that is a parameter convention to specify, not an automatic equality with source sigma0.

## Resolvents and square root: compatible representation, not an invented identity

The same patch construction applies to Q+t I, t>=0. Commutators are still [Q,chi_i]. The flat principal spectral gap is a+t, and the1540 proof with B0(t)=2(B+t) gives a common alpha>0 and C_inv(t)<=C/(a+t). Choose the original fixed background chart uniformly small relative to a. The absolute remainder bound is then <=Cprime/[M(a+t)], with its largest value at t=0. Hence the same M/tag polydisc works for every t, and the tagged inverse is bounded by Cdoubleprime/(a+t), with constants depending on a and the fixed ranges.

Consequently

    S(s)=(1/pi) integral_0^infinity t^-1/2 G_t(s) dt

converges in the weighted norm and is holomorphic by the integrable majorant C t^-1/2/(a+t). At s=1 the accretive principal functional calculus gives S(1)=Q^-1/2, the square root of the actual covariance. Its weighted Schur norm is bounded by C/sqrt(a). For arbitrary s no equality S(s)^2=G_0(s) has been proved or used. Independently interpolated source inputs require their own identities or only the precise bounds their algebra actually needs; tagging does not commute with nonlinear functional calculus automatically.

## Scope and remaining finite gate

This repairs the SPECIFIC spectral-to-absolute-walk gap1541 for a finite-range first precision, under the explicit chart/gap/partition antecedents. It derives a tagged inverse/resolvent/square-root representation rather than simply naming missing interpolation control. It does not prove all the source multiscale propagator regularity norms or identify its Coulomb/projected operators with Q.

Still needed for Gaussian conditioning/activity transfer: the NEAR-ROOT reference comparison in1162.16–2.26, with an untagged collar around the marked domain and the correct determinant normalization. A bounded tagged operator alone does not imply the small real-part perturbation needed for that integral. Next use the actual patch-domain/tag geometry to prove a distance-to-boundary estimate for G(s)-G(1) on the protected block and for S(s), or retain that gate. Do not claim positivity or square-root consistency on the entire polydisc without that argument. No new paper, grade, review or PR.

Levels: literature—selected actual buffered commutator/generalized-walk mechanism; heuristic—parent finite-range patch proof and source-dictionary application, unreviewed; formal—none new; speculative/open—near-root conditioning/determinant activity transfer and full physical/history/global target. Falsifiers: an unbuffered patch identity, lost column bound, volume-dependent overlap or tag count, Q with unbounded range, or treating tagged S as a square root of tagged G without proof.
