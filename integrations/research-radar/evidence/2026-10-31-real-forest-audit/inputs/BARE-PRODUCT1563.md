# A real Gaussian product bound and its connectivity boundary

Parent conditional analysis, 31 October2026. Unreviewed addendum outside assessment1547. Geometry1560–1562 and the exact source-law dictionary remain open. This note does not certify a connected polymer expansion.

## Precise product lemma

Let A be a centered finite dimensional real Gaussian with symmetric covariance C satisfying 0<=C<=a^-1 I, a>0. For n distinct local factors let D_i be sets of scalar coordinates, |D_i|<=d0, with every coordinate in at most m of these sets. Assume m>=1 and

    |v_i(A)| <= t W_i(A),   W_i=sum_(b in D_i) A_b^2+c|D_i|,   c>=0.

Take epsilon=a/(8m), 0<=t<=epsilon. Then

    E product_i |exp(v_i)-1| <= (K t)^n,
    K=epsilon^-1 exp[2 epsilon (c+2/a)d0].

The v_i may be complex valued on real A, provided the displayed pointwise absolute bound holds. Empty supports force v_i=0 and give a trivial product; n=0 gives1. Constants depend on fixed local support size/overlap and gap, not total lattice volume.

Proof: |exp(v)-1|<=|v|exp|v| and W<=epsilon^-1 exp(epsilon W) give product <=(t/epsilon)^n exp(q sum_i W_i), q=t+epsilon<=a/(4m). On J=union D_i let M be the diagonal multiplicity matrix, so M<=mI and tr M=sum_i|D_i|<=d0 n. The Gaussian marginal on J has covariance C_JJ, not a newly substituted principal inverse precision. Its exponential moment is det(I-2q C_JJ^(1/2) M C_JJ^(1/2))^-1/2. The matrix inside the logarithm has spectrum in[0,1/2]. The scalar bound -log(1-x)<=2x yields log of this determinant factor <=2q tr(C_JJ M)<=2q d0 n/a. Add the deterministic c q d0 n, and use q<=2epsilon. This proves the stated K.

The Gaussian can be degenerate by restriction/continuity. For the physical bare reference use the genuine symmetric covariance retained after repairR1; a nonsymmetric tagged inverse is not a valid replacement. No complex measure is covered by the positive Gaussian step without its separate density/determinant/compensator bounds.

## What this pays and what it does not

If the actual bare carrier remainder bound1539 holds with t=t0 tending to zero, a,d0,m,c fixed, this lemma pays an arbitrary finite family of local exp(v_i)-1 factors with one small t0 per factor. To apply it, check the actual scalar-coordinate carriers after the finite reconstruction, including Haar/selected-Jacobian terms and the carrierwise off-shell subtraction whose total linear term vanishes on the physical branch. Uniformity of d0,m is an explicit obligation, not a property inferred for arbitrary already-resummed activities.

A real hard-cutoff indicator bounded by1 can remain inside this unnormalized Gaussian integral: removing it gives an upper bound. Dividing by its probability to normalize the truncated measure incurs the reciprocal probability. That cost is not discarded or assumed volume independent, consistent with law-binding1559.

This product lemma supplies neither connectedness nor spatial decay. For scalar standard Gaussian X,Y with covariance rho and disjoint coordinate supports, set v1=t X^2 and v2=t Y^2. Their factors have nonzero covariance

    ((1-2t)^2-4 rho^2 t^2)^(-1/2) - (1-2t)^(-1)
      =2 rho^2 t^2+O(t^3).

Thus disjoint carriers cannot simply be declared independent polymers. A connected expansion must retain covariance links, tree/forest interpolation derivatives, or an already established localized contour construction with its summation bounds. Exponential physical covariance decay alone does not make those costs disappear.

## Primary-source alignment

Selected CMP116 printed15–17, equations(2.14)–(2.26), reread in the cached PDF (DOI10.1007/BF01239022). Printed16 explicitly resums overlapping quadratic contributions using a spatial weight; printed17 keeps a local-volume exponential after the Gaussian calculation and then separately begins the sums over families/domains. These are distinct tasks. No claim is made that the elementary lemma above reproduces the source's complex tagged integral or all of its summation bounds; the full proof is not audited here.

Mechanism: bounded coordinate multiplicity controls a Gaussian quadratic exponential and retains a small factor for every local insertion. Hypotheses and limits are the displayed covariance, support, overlap and remainder bounds; the original geometric admissibility and law remain separate. Falsifier: an actual carrier family with growing d0 or m, an omitted linear/determinant term not satisfying t W_i, or an attempt to use this bound after normalization without paying its probability. Levels: formal—no new machine proof; literature—selected source estimates read; heuristic—conditional application to bare local factors; speculative—full connected activity and marginal transfer. No new paper, review, grade or graph theorem is created.
