# A two-scale collar pays the protected Gaussian comparison

Participating-parent derivation, unreviewed. Conditional on the actual first free precision/local-map and flat-gap antecedents1540–1542. No source activity theorem or full Gaussian integral is declared proved.

Source target: CMP116 printed13/15–17 Eq2.7/2.14–2.25, DOI10.1007/BF01239022, cached SHA256 ee39523a0f7b83af958513c7bd6f9c7731934b40355ef5d6b0f7a68ee6d022fc. Selected formulas read1537/1541; not full proof audit. The actual generalized source walk domains use the smaller M1 scale, while its tag/conditioning regions use larger M/LM scales. Do not conflate them. CMP99 printed414/416 mechanism was visually checked1542.

## Repair a geometric limitation of the preceding construction

1542 proves a tagged walk representation with patch size and tag-cube size comparable. That is valid for its stated convergence, but a patch of diameter C M can cross a protected collar of thickness M/2 in one factor. Then no exp(-c M) protected comparison follows merely from that geometry.

For the present comparison use TWO scales. Choose patch size m sufficiently large to pay the absolute remainder eta_m exp(m0 kappa)<=1/2. Hold m fixed after the precision constants and kappa are fixed. Choose larger tag cubes/untagged collar scale M, with M much larger than the full patch/background-dependence diameter D_patch<=C m. The number m0 of larger tag cubes meeting one patch remains bounded independently of M. Both partitions must be compatible with the admitted periodic lattice. This matches the distinction between smaller source localization domains and larger tag blocks in mechanism, but does not identify all its projected operators with our free Q.

Let R be the protected free-block set, Z its untagged neighborhood, d=dist(R,Zc), and h=d-D_patch>0. Tag only cubes outside Z (or use a conservative union of tag cubes whose full factor domains are disjoint from the protected collar). Every factor carrying a nontrivial tag has some dependence point in Zc, so each endpoint of that factor lies at distance at least h from R. This uses the FULL factor domain, including dependence of the patch inverse on all its background inputs.

## Witness-factor bound

The difference between a tagged walk weight and its value at all tags1 is zero unless at least one factor meets the tagged region. On |s|<=exp(kappa), its magnitude is <=2 exp(m0 kappa(n+1)) for a walk with n+1 factors. Mark one such factor, overcounting by at most n+1.

The absolute local-kernel estimates1542 hold in weighted Schur norm alpha. For a row starting in R, any contributing product must travel at least h before it reaches the marked factor. Spend half of the exponential weight on that excursion and retain half for the output distance. Thus in the row norm restricted to R, and likewise the column norm restricted to R,

    ||G(s)-G(1)||_(alpha/2;R)
       <=2 A exp(m0 kappa) exp(-alpha h/2)
          sum_(n>=0)(n+1) r^n,
    r=eta_m exp(m0 kappa)<=1/2,
    A=N C_inv.

The norm here sums over ALL other endpoints, not only endpoints in R. The geometric sum is (1-r)^-2<=4. No count of points in R occurs. For an R-to-R kernel both outbound and return travel are available, but the weaker displayed bound is enough and avoids assuming both endpoints for later cross terms. Empty tagged region gives zero directly.

This proves a protected difference, not zero support of the original inverse. Taking d proportional to the larger M and M>2D_patch gives exp(-c M) with constants fixed before total volume. If an admitted geometry cannot realize that collar, keep the gate rather than applying the bound with negative h.

For Q+t I the prefactor is bounded by C/(a+t), uniformly in t>=0 as1542. Integrating t^-1/2 times this majorant gives the same protected-root comparison for the tagged inverse square-root representation, with prefactor C/sqrt(a). At tags1 it is the actual covariance square root. No identity S(s)^2=G(s) is assumed away from1.

## Add the actual small complex background perturbation

Compare the complex background to its admitted real representative in the SAME local frames; do not use the false return map1489. Finite local derivative sums give ||Q(U)-Q(Ureal)||_alpha<=C rho. Resolvent identity and1540 yield an O(rho) weighted inverse difference, uniformly for principal domains; the shifted integral yields O(rho) for the inverse square root, with fixed powers of a in the constant. Combining with the tagged comparison gives a protected row/column error

    epsilon=C[rho+exp(-alpha h/2)].

Keep rho a freely chosen INNER perturbation of the fixed analytic chart. The chart's existence does not require taking this particular epsilon small in a volume-dependent way. For all source-admitted large collars, choose the inner rho and M so epsilon lies below the stated fixed Gaussian margins.

## Root covariance determinant and coercivity

Let C0 be the REAL reference covariance restricted to the root R, either a full principal inverse restricted to R or the actual conditional inverse on R. From a I<=Qreal<=B I, 1/B I<=C0<=1/a I. Let C_s be the corresponding tagged/comparison root matrix, and ||C_s-C0||_2<=epsilon, as implied by the two Schur bounds above. Set F=C0^-1/2(C_s-C0)C0^-1/2. If B epsilon<=1/2, ||F||<=1/2, so C_s is invertible on the branch continued from C0 and

    |log det C_s-log det C0|
        <=dim(R)[-log(1-B epsilon)]
        <=2 dim(R) B epsilon.

The determinant factor is therefore at most exp(C epsilon dim(R)), exactly the type of LOCAL VOLUME cost that must be retained in a polymer budget. It is never a volume-independent O(1).

Also ||C_s^-1-C0^-1||_2<=2 B^2 epsilon. If 2 B^2 epsilon<=a/2, the Hermitian real part of the inverse is >=a/2 I. This is a genuine small protected comparison, unlike1541's invalid real-convex-gap implication on an entire disc. For complex-symmetric first precisions, the resulting quadratic Gaussian bound uses real integration coordinates and the Hermitian/symmetric-real-part lower bound; the determinant branch remains explicit.

These bounds do not assert that a tagged root covariance is the principal restriction of an everywhere positive global interpolated precision. Only the protected matrix and its near-reference estimate were used.

## Remaining precise matching

The free-precision construction now supplies a protected tagged inverse and square-root difference and a local determinant/coercivity estimate, under the recorded gap/chart/partition hypotheses. To transfer the full Gaussian-conditioning calculation, still match the EXACT block conditional covariance, cross operator Gamma and square-root factors in1162.14–2.25, retaining the exterior Gaussian variables. Since tagged G and tagged S are separate analytic representations, algebraic cancellations requiring their compatibility must be checked at the reference point and estimated away from it; they cannot be asserted as identities for arbitrary tags.

Next perform that finite block-Gaussian identity/perturbation audit for the bare first precision, including the Schur-complement determinant and exterior mean. Do not erase those variables or double charge the normalization1513. Full polymer summation, second-step old E1 and physical/history/global target remain open. No new paper, score, review or PR for this supporting lemma.

Levels: literature—selected source protected conditioning and two localization scales; heuristic—parent witness-factor/protected matrix proof, unreviewed; formal—none new; speculative/open—exact Gamma/normalization matching, full activity and global target. Falsifiers: a one-factor domain crossing the entire collar, omitted background-dependence tags, lost restricted column estimate, hidden root-volume constant, wrong determinant branch, or using S(s)^2=G(s) without proof.
