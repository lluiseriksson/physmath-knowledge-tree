# Degree-adapted covariance polydiscs remove the crude global factorial

Parent unreviewed deduction, 31 October2026. Outside assessment1547 and published PR240. No novelty, complete source transfer, manuscript grade or machine-checked result is claimed.

## Exact finite hypotheses

Take disjoint coordinate blocks D_1,...,D_N after merging overlapping insertion supports. Their total scalar dimension is V. At a real forest point let C_* satisfy B^-1 I<=C_*<=a^-1 I. Let C_ij be the ORIGINAL cross-covariance blocks appearing in the affine edge interpolation, not necessarily the interpolated cross block w_ij C_ij. For each edge e={i,j} in a simple forest F, write h_e=||C_ij||_op and d_i=degree_F(i). If h_e=0, the corresponding affine derivative vanishes, and that case is removed before division below.

Let G be a fixed measurable insertion product with finite L2(mu_(C_*)) norm and the quadratic-exponential domination1565–1567. It may include the original local hard-cutoff tail factors1566. Its domains do not move with the edge parameters.

## Local complex extension, not arbitrary source tags

Fix eta=1/8 and perturb only forest-edge blocks by z_e C_ij and their transposes, with

    |z_e|<=R_e=eta/[B h_e sqrt(d_i d_j)].

The matrix of block norm bounds is at most (eta/B) times the normalized adjacency of F, A_ij/sqrt(d_i d_j), with zero rows at isolated vertices. Its operator norm is at most1: apply the weighted edge inequality to the quadratic form, or conjugate the random-walk normalization. For complex block vectors, take the vector of their block norms first. Thus ||E(z)||_op<=eta/B throughout the polydisc, independently of N and V.

Whiten T=C_*^-1/2 E C_*^-1/2; then ||T||_op<=eta. The normalized complex Gaussian density relative to the real base is

    r_T(X)=det(I+T)^(-1/2)
       exp[.5 X^T (I-(I+T)^-1)X],

where X is real standard Gaussian and the determinant branch is continued from T=0. Symmetry is transpose symmetry; the perturbation is not substituted as a nonsymmetric Gaussian covariance. Since ||I-(I+T)^-1||<=eta/(1-eta), the squared absolute density is integrable and

    ||r_T||_2 <=Kden^V,
    Kden=(1-eta)^(-1/2)
          [1-2eta/(1-eta)]^(-1/4).

Indeed the determinant modulus is bounded below by (1-eta)^V using singular values, and the remaining real Gaussian quadratic moment is bounded by [1-2eta/(1-eta)]^(-V/2) before taking a square root. Both factors retain the dimension V of the insertion union. No total-lattice volume is substituted.

Therefore |E_(C_*+E(z)) G|<=Kden^V ||G||_2 by Cauchy–Schwarz. The Gaussian density defines a holomorphic function on this SMALL norm-controlled polydisc. This is an auxiliary local complex covariance extension around a real forest point, not admission of the source's full complex-background/current/tag domain. It is compatible with the real smooth extension1567 at the level of its derivatives: that matrix cutoff is constant near the real point, so its jets equal the local density's jets. The cutoff itself is not asserted holomorphic.

## Distinct-edge derivative bound

Multivariate Cauchy, differentiating each forest edge ONCE, yields

    |partial_F E_C G|_(C=C_*)
      <=Kden^V ||G||_2 (B/eta)^|F|
        product_(e={i,j}) h_e product_i d_i^(d_i/2).

Use0^0=1 at isolated vertices. No multiindex factorial appears because every edge has derivative order1. The missing factorial of1569 has been replaced by a vertex-degree factor through the radius choice; it is not dropped. Fixed quadratic domination/sufficiently small t0 ensures holomorphy and dominated differentiation. For mixed insertions the retained L2 bound is (K4 t0)^n q^(h/4), as in1569.

## The degree-weighted labeled-tree count is exponential

For N>=2, the Prüfer degree count gives

    sum_(labeled trees T) product_i d_i^(d_i/2)
      =(N-2)! [z^(N-2)] f(z)^N,
    f(z)=sum_(l>=0) (l+1)^((l+1)/2) z^l/l!.

All coefficients are nonnegative. Using d!>=(d/e)^d and Cauchy–Schwarz with weights2^-l gives

    f(1)<=Ktree=sqrt[2e(1+2e)exp(2e)]<infinity.

Consequently the degree-weighted tree sum divided by N! is at most Ktree^N/[N(N-1)]. This is the specific combinatorial repair missing from the crude global Hermite bound1569. For singleton or uniformly bounded-size blocks, spatial link factors with a summable row norm can then be summed along each rooted tree at a constant cost per edge. This statement is conditional on that link kernel and the chosen anchor normalization, not a ready activity estimate.

## Remaining application gates

Overlap components in the actual insertion expansion can have growing dimension V_i. Estimating h_ij by entrywise covariance decay introduces sqrt(V_i V_j); high-degree attachment and component entropy must be paid explicitly. One may absorb Kden^V per original fixed-size insertion/tail, but cannot silently replace all component sizes by d0. The root-normalized connected cumulant identity, component grouping and mixed tail/interactions still need an exact summation with the original normalization.

The original B1 determining geometry, source-normalized cutoff/counterterm dictionary, complex backgrounds and final marginal/physical conclusion remain open. This lemma removes a crude all-order factorial obstruction under its finite hypotheses; it does not certify all those hypotheses. No new paper or review is started for this supporting estimate.

Mechanism: graph-normalized covariance polydiscs convert global derivative order into summable vertex degrees. Falsifiers: a direction not confined to its two declared blocks, moving observable/cutoff dependence, omitted growing component dimension, or using repeated derivatives per edge without their factorials. Levels: formal—none new; literature—previous forest bibliography/context only, no additional source-proof audit; heuristic—conditional application to actual factors; speculative—complete component/cumulant/source transfer. The proof above is parent work, with independence and correctness not established by an external assessment.
