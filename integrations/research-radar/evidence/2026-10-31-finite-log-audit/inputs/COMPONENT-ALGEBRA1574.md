# Exact component algebra and the dimension cost before spatial summation

Parent unreviewed addendum,31October2026. Outside assessment1547 and PR240. The forest identity is used as a literature premise with the finite smoothness bridge1573/1567; no external Lean proof/build is imported or independently certified. This is not a complete activity norm.

## Finite factor model and the exact grouping

Let I be the finite set of actual interaction and original cutoff-tail labels1566, with fixed measurable factors f_i and nonempty raw-coordinate supports D_i. Empty factors are removed. The original unnormalized fluctuation integral, with its already allocated Gaussian/baseline factors, has finite factor part

    Z=E_C product_(i in I)(1+f_i).

For a chosen subset S of labels, form the overlap graph: two labels are adjacent when their coordinate supports intersect. Its components S_1,...,S_N have DISJOINT coordinate unions U_j, and observables G_j=product_(i in S_j) f_i. Do not replace the original joint cumulant by a cumulant of these grouped observables without a separate identity.

Instead apply the finite forest formula to the MOMENT E product_j G_j. Define z(B), for any nonempty label set B, as the sum of spanning-tree forest integrals connecting the overlap components of B, with the tree derivative of the Gaussian density and the actual factors in B retained. When B has one overlap component, take z(B)=E product_(i in B) f_i. The known finite forest formula, plus factorization of block-diagonal Gaussian densities at disconnected forest components, then gives

    E product_(i in S) f_i
      =sum_(partitions P of S with disjoint block supports) product_(B in P) z(B).

The reason the support condition is necessary: an overlap edge cannot cross two different forest components. Conversely a partition with disjoint block supports partitions the overlap components of S, and each internal connected forest is a spanning tree on the corresponding component vertices. Its density derivative/integral factorizes across those vertices' connected groups. This is a bijective regrouping, not an independence claim for the original Gaussian.

Summing over all S therefore gives an exact FINITE hard-core polymer gas Z=sum_(compatible families of label sets B) product z(B), with compatibility meaning disjoint raw-coordinate supports. Labels within each polymer occur once; disjoint supports prevent their reuse across a family. This algebra does not assert positivity of z(B), a zero-free domain, a convergent logarithm, an infinite-volume limit or any normalizer lower bound.

## Conditional dimension payment in the tree bound

For a fixed polymer B let its N overlap components have label sizes s_i>=1 and scalar dimensions V_i<=D s_i, where D bounds a single original factor's scalar support. Write s=sum_i s_i. The density prefactor1573 obeys Kden^(sum V_i)<=Kden^(D s), a fixed exponential per original label, including cutoff-tail labels.

Bounding each cross-covariance block by Cdec sqrt(V_i V_j) exp[-alpha dist(U_i,U_j)] contributes a size factor product_i s_i^(d_i/2), with D paid per edge. Combined with1573, the degree/size factor is product_i(d_i s_i)^(d_i/2).

For any fixed epsilon>0 and d>=1,

    s^(d/2)<=exp(epsilon s)(2epsilon)^(-d/2) sqrt(d!),
    d^(d/2)<=exp(d/2) sqrt(d!).

The first inequality follows by maximizing s^(d/2) exp(-epsilon s) and using d!>=(d/e)^d. Hence, for a tree,

    product_i(d_i s_i)^(d_i/2)
      <=exp(epsilon s)(e/(2epsilon))^(N-1) product_i d_i!.

The degree factorials still have an exponential labeled-tree sum AFTER dividing by N!. Prüfer counting gives exactly

    sum_(labeled trees T) product_i d_i!
      =(N-2)! binomial(3N-3,N-2),    N>=2,

because its degree generating function is sum_(l>=0)(l+1)z^l=(1-z)^-2. Thus the divided sum is at most8^N/[N(N-1)]. The N=1 case has no tree edge and must be handled separately. This pays the component-dimension factors in this particular FIXED-support bound without replacing a large component by a bounded one.

If the original factor-overlap graph has maximum degree Delta, a rooted connected set of s labels admits a canonical depth-first walk of length2(s-1). Therefore the number of such sets at a fixed label is at most max(1,Delta)^(2(s-1)). This is an exponential bound on overlap-component shapes, not yet a sum over translations of distinct components or covariance attachments.

## Do not spend the same budget on spatial placements twice

The surviving spatial factors exp[-alpha dist(U_i,U_j)] are distances between SETS, not between declared anchors. For variable shapes, summing translations can introduce further powers of s_i,s_j; replacing set distances by anchor distances introduces different shape-dependent losses. Neither cost has been included in the inequalities above. They cannot both be declared absorbed into the same exp(epsilon s) without a new bound.

In particular the exact polymer gas still needs a rooted spatial/attachment sum, followed by a zero-free/logarithm criterion with the signed tail factors and original normalizer. A bound on fixed-support derivatives and an N! tree identity do not automatically supply the factorial normalization or embedding multiplicities for that rooted activity norm. Those must be derived from its exact enumeration.

Next finite target: specify the rooted polymer norm and an attachment-coordinate enumeration that preserves a summable covariance link while charging overlap shape, dimension and translation costs exactly once. If this needs an extra uncontrolled degree-dependent size cost, this route is still blocked and no activity conclusion follows.

Mechanism: moment-level forest factorization gives the correct finite polymer gas; a degree-mass inequality pays dimensions before spatial enumeration. Hypotheses: exact finite forest premise, fixed measurable factors, correct disjoint overlap components, bounded original support/overlap, and the actual Gaussian bounds. Falsifiers: omission of the support compatibility condition, reuse of labels, unjustified N! normalization, or uncharged spatial attachment losses. Levels: formal—none new; literature—previous forest identity premise with its reading/build limits retained; heuristic—conditional application to actual factors; speculative—rooted summability, zero-free normalization and source transfer. Original geometry/law/complex-background obligations remain open; no new paper, score or model review.
