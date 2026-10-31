# Real two-carrier decay without differentiating a hard cutoff

Parent conditional deduction, 31 October2026; unreviewed, outside assessment1547. This closes a two-observable real Gaussian estimate only. It does not establish the original geometric dictionary, a complex tagged measure, or a full connected expansion.

## Density interpolation

Let disjoint finite coordinate sets D,E have Gaussian marginal covariance C1, with B^-1 I<=C1<=a^-1 I. Write C0=diag(C_DD,C_EE) and C_s=C0+s H, H=[[0,C_DE],[C_ED,0]], for real 0<=s<=1. Both endpoints have the same spectral bounds, so convexity gives the bounds for all s. This does not assert positivity on a complex disc.

For any fixed measurable F with the needed integrability, differentiation of the finite Gaussian density gives

    d_s E_s F=E_s(F S_s),
    S_s=.5[A^T C_s^-1 H C_s^-1 A-tr(C_s^-1 H)].

No derivative acts on F. In particular a fixed hard cutoff in F causes no boundary derivative. The score is centered, and Wick's identity gives

    E_s S_s^2=.5 tr[(C_s^-1/2 H C_s^-1/2)^2]
               <=B^2 ||C_DE||_HS^2.

For local f(A_D),g(A_E), the marginals stay fixed along s and factorize at s=0. Thus

    Cov_1(f,g)=integral_0^1 E_s(f g S_s) ds.

This is a fixed-domain density identity, not integration by parts across a cutoff boundary. Truncation followed by dominated convergence justifies it for the exponentially dominated insertions below.

## Small insertions with local indicators

Take f_i=1_(K_i)(exp(v_i)-1), with fixed measurable K_i in its own coordinates, |v_i|<=t W_i on K_i, W_i=sum_(D_i) A_b^2+c|D_i|, |D_i|<=d0 and coordinate overlap<=m. Outside K_i set f_i=0 solely for this real estimate. Put epsilon=a/(16m), t<=epsilon. The same determinant argument1563, now using |f_i|^2<=t^2 W_i^2 exp(2tW_i) and W_i^2<=epsilon^-2 exp(2epsilon W_i), yields

    ||product_(i=1)^n f_i||_(L2(mu_s)) <=(K2 t)^n,
    K2=epsilon^-1 exp[2epsilon(c+2/a)d0].

Indeed q=2(t+epsilon)<=a/(4m); the logarithmic Gaussian moment is at most2q d0 n/a, and taking a square root gives the claimed constant. This holds uniformly for the real interpolated covariances above. Empty carriers are trivial, as in1563.

Consequently for two insertions with disjoint supports,

    |Cov_1(f,g)|<=B ||C_DE||_HS (K2 t)^2.

If |C_bc|<=Cdec exp[-alpha dist(b,c)], then

    |Cov_1(f,g)|<=B Cdec d0 (K2 t)^2 exp[-alpha dist(D,E)].

The covariance bounds a,B and Cdec must refer to this SAME actual Gaussian reference. The pair supports are disjoint here; overlapping carriers require the product estimate instead. A scalar check with covariance rho s and observables X^2,Y^2 gives derivative4s rho^2 and integral2rho^2, as required by Wick's formula.

## What remains for the original integral

This removes the need to differentiate the artificial local zero extensions in this real pair estimate. It does not remove the GLOBAL original cutoff. The coefficient in1564 is E[1_K product f_i]; an outside cutoff factor is generally not a function of D alone or E alone, so this pair identity cannot simply be substituted for that coefficient. Conditioning on the outside also changes means and covariance and must be accounted for. Alternatively one must expand/allocate all cutoff factors, pay the large-field tails, and keep the exact normalizer.

An n-point forest expansion still needs derivative orders, factorial/tree counting, and covariance interpolation bounds for every needed forest. A real convex two-block path does not certify complex tags or a source-compatible global interpolation. No global exponential clustering or activity norm is concluded.

Primary context: CMP116 printed15–17, equations2.14–2.26, DOI10.1007/BF01239022, retains local quadratic/determinant costs and then performs separate family sums. This is previously selected literature context, not a source for the new elementary score lemma; no additional full-proof audit is claimed. Existing primary inventory is refreshed separately and remains directed, not exhaustive.

Mechanism: interpolate covariance by a real density and retain measurable cutoffs inside observables; Gaussian score variance extracts a cross-covariance link. Hypotheses: uniform upper AND lower covariance bounds, fixed local measurable supports, quadratic domination, real parameter interval. Falsifiers: missing lower covariance bound, moving cutoff/background domain, use of a nonsymmetric covariance, or applying the local pair formula with an unallocated global cutoff. Levels: formal—no new machine proof; literature—previous selected context; heuristic—conditional application to bare factors; speculative—full cutoff/forest/complex activity transfer. No new paper, grade or review is created.
