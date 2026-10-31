# Exact cutoff factors with simultaneous Gaussian tail bounds

Parent conditional deduction, 31 October2026, unreviewed and outside assessment1547. This allocates the real original FREE cutoff algebraically; it does not prove the connected/complex expansion.

## Keep the same threshold and law

Partition the FREE scalar coordinates into the original Lie-valued bond variables A_b, each of fixed real dimension r_g. Let K_b be its ORIGINAL cutoff |A_b|<rho, rho=delta0/g0=C_delta ell^p, ell=log(g0^-2), and K=intersection_b K_b. No cutoff constant is enlarged. If the source norm is not the chosen orthonormal Euclidean norm, fix a norm-equivalence constant kappa>0 such that |A_b|>=rho implies ||A_b||_2>=kappa rho. Constants are fixed, not chosen using volume or coupling. The exact source norm/dictionary remains an application obligation.

For a centered real Gaussian with C<=a^-1 I define zeta_b=-1_(K_b complement). Then exactly

    1_K=product_b(1+zeta_b).

For any set T of k DISTINCT free bond variables, Chernoff's bound with lambda=a/4 gives

    E product_(b in T)|zeta_b|
      <=exp[-a kappa^2 rho^2 k/4]
        E exp[(a/4) sum_(b in T)||A_b||_2^2]
      <=q^k,
    q=2^(r_g/2) exp[-a kappa^2 rho^2/4].

The determinant estimate uses the actual Gaussian marginal on the k r_g scalar coordinates, whose eigenvalues are at most1/a. No independence of the tail events is assumed, and the bound is valid for arbitrary correlations satisfying that spectral bound. A value q>1 is simply a non-useful upper bound; for fixed a,kappa,C_delta>0, q tends to zero as g0 tends to zero with p>0.

## Mixed exact finite expansion

Keep the local real extensions f_i of1564, equal to exp(v_i)-1 on every restriction of K. The identity

    1_K exp(sum_i v_i)
      =product_b(1+zeta_b) product_i(1+f_i)

holds pointwise: on K all local factors agree; outside K at least one tail factor makes both sides zero. The left side is understood to be zero outside K, where a chart need not define v_i. There are finitely many factors, so expanding and integrating is an exact finite identity without a convergence claim or a normalization change.

For interaction labels S, |S|=n, and tail labels T, |T|=k, Cauchy–Schwarz together with the L2 product estimate1565 gives

    |E product_(i in S) f_i product_(b in T) zeta_b|
      <=(K2 t0)^n q^(k/2).

Overlaps of interaction carriers with tail coordinates are permitted. Only DISTINCT original cutoff bond labels are counted in k. Both small factors are explicit. This resolves the algebraic allocation issue identified1565 while retaining the original normalizer as the complete sum, including its signs.

The Gaussian determinant and baselines already assigned in1513 are not inserted again. Passing to log of this finite sum, taking an infinite-volume limit, or bounding its reciprocal still requires connected summability/zero-free control. A signed inclusion–exclusion expansion is not by itself a positive polymer gas or a proof that the normalization is uniformly close to1.

## Coupling scale and remaining link costs

For the fixed original C_delta, log q= (r_g/2)log2 -(a kappa^2 C_delta^2/4)ell^(2p). Thus p>1/2 makes q smaller than any prescribed power g0^h for sufficiently small g0, without changing C_delta. At p=1/2 that assertion depends on the coefficient; it is not automatic. This matches the scale distinction retained1537 but is a separate elementary real Gaussian estimate, not a replacement for the source's localized complex large-field calculation.

The next necessary bound concerns connected cumulants of BOTH f_i and zeta_b. Pair score1565 can retain measurable factors on a real covariance interpolation, but its two-block proof alone gives no all-order forest bound. Higher density derivatives, locality of inverse factors, factorial/tree sums, complex-background phases and original local B1 geometry remain unproved here. Do not promote an arbitrary family coefficient to a connected activity.

Primary reading this turn: selected CMP116 printed19–20, equations2.33–2.38 and Lemma3 (DOI10.1007/BF01239022), read as a statement/resummation map only, not a full proof audit. The source separately pays localization-component sums and parameter inequalities before concluding its activity estimate. The present finite cutoff identity inherits none of those estimates automatically.

Mechanism: exact factorization of the original product indicator plus simultaneous Gaussian Chernoff bounds and mixed Holder control. Hypotheses: original FREE product cutoff, fixed norm equivalence, genuine centered positive covariance with uniform upper bound, and actual local interaction domination. Falsifiers: a nonproduct original cutoff without an exact replacement identity, coupling/volume-dependent norm constants, omitted selected-output restrictions, or use of Gaussian independence/normalizer lower bounds not proved. Levels: formal—none new; literature—selected source summation statement; heuristic—conditional application to original law; speculative—connected analytic activity and marginal transfer. No new paper, review or grade.
