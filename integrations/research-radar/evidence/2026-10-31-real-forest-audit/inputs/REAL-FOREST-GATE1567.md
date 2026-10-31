# Real forest covariance admission and the global smoothness gate

Parent conditional synthesis, 31 October2026. Unreviewed, outside assessment1547. This concerns a real finite Gaussian expansion of the exact local factors1566, not the source's complex tagged construction or a finished connected activity bound.

## Source and formalization locator

[Abdesselam and Rivasseau, hep-th/9409094v1](https://arxiv.org/abs/hep-th/9409094v1), first preprint16 September1994, related DOI10.1007/3-540-59190-7_20: abstract/history read only. The paper develops tree-formula methods; its statements and proofs were not read here. This is old literature newly located in this directed search, not a new2026 paper.

[Scott Armstrong's BKARForestFormula](https://github.com/scottnarmstrong/BKARForestFormula/tree/a07f44a534240fe6339558951dd78a19e4ef7c51), HEAD a07f44a534240fe6339558951dd78a19e4ef7c51: README and selected flagship declaration in BKAR/Formula.lean read. It presents a Lean formalization of the known forest formula for globally smooth real scalar functions. Manifest/toolchain metadata were inventoried; no imports, proof audit, local build or CI verification occurred, and it is NOT added as a formal dependency. Its model/proof-checking claims remain repository attributions. Exact retrieved-file hashes and declared revisions are in BIBLIOGRAPHY1567.json. No corpus was copied. No matching identifier/title was found in the local radar/manuscript search; that search was not exhaustive.

## Real covariance bounds for every forest point

Group overlapping insertion supports into connected components of their overlap graph. Their coordinate unions are now disjoint; use these as blocks. One must not duplicate a shared raw coordinate into independent replicas and assume a positive lower covariance bound. Component sizes may grow with insertion count and their costs must be retained.

Let C on the union of coordinates satisfy B^-1 I<=C<=a^-1 I. For a forest F on the disjoint blocks, with real edge parameters u in[0,1], set w_ii=1, w_ij=min of u along the unique forest path, or0 across distinct components. Define C_F by multiplying its i,j coordinate block by w_ij.

For each h in[0,1], remove forest edges with u<h. This gives a partition P_h. Let Pinch_(P_h)(C) retain only the diagonal blocks of that partition. Then

    C_F=integral_0^1 Pinch_(P_h)(C) dh.

Indeed two vertices remain in the same threshold component exactly for a set of h of length w_ij. Every pinching preserves both spectral inequalities: it is the sum P C P over orthogonal block projections P with sum P=I. Integrating therefore gives

    B^-1 I<=C_F<=a^-1 I

uniformly in forest, edge parameters and total coordinate count. Each entry also obeys |(C_F)_bc|<=|C_bc|, so a preexisting entrywise exponential covariance bound is retained. The real product/tail majorants1563–1566 consequently hold at these forest points with the same spectral constants and coordinate-overlap bookkeeping. This is a direct finite matrix proof; it is not a machine-verified import from the located repository.

## Why arbitrary edge variables still need care

Independent numbers x_ij in[0,1] need not give a positive covariance. For equicorrelation C with diagonal1 and all off-diagonals3/4, C is positive. Setting x12=x23=1,x13=0 gives determinant -1/8. Such a point is not the path-minimum point of a tree with those two edges equal1. Thus the function rho(x)=GaussianExpectation_(C(x))(product of fixed measurable insertions) is not automatically defined on the full edge cube, whereas a global smooth forest theorem asks for a smooth scalar function there.

For each fixed finite family this can be handled without changing values or derivatives at forest points. Choose a smooth matrix cutoff chi that is identically1 on an open neighborhood of the compact spectral band B^-1 I<=C<=a^-1 I, supported within (2B)^-1 I<C<2a^-1 I. On positive matrices in that support form the Gaussian expectation of the fixed real measurable product F from1566; multiply by chi, and extend by0 outside its support. Composition with affine C(x) is globally smooth in x.

Justification: F is a finite product of local indicators and insertions bounded by quadratic exponentials. With t0 small enough for the enlarged covariance upper bound2/a, Gaussian densities and every finite matrix derivative are dominated locally by an integrable Gaussian times a polynomial. Differentiation acts on the density, so fixed discontinuous cutoffs cause no boundary differentiation. A compact smooth extension exists in finite matrix space; chi is constant near every forest covariance, hence all its derivative terms vanish there. No bound on chi derivatives is used at those points. At all-ones and all-zeros edge configurations the original values are retained.

This is a finite-dimensional smoothness bridge, not a uniform analytic extension or a bound on all derivative orders. Applying any external forest theorem still requires its exact hypotheses and a justified literature/formal endpoint; none is claimed kernel-checked here.

## Remaining decisive obstruction

What remains is the quantitative all-order density derivative bound WITH one spatial link per forest edge, support-size and degree factorial costs, and a summable tree/overlap-component count. Merely knowing each forest covariance has a gap or that a smooth extension exists does not bound those quantities. The original local B1 constructor, source law/counterterm dictionary and complex-background admission also remain open. No full activity norm, zero-free normalizer, paper or grade is obtained.

Mechanism: threshold partitions preserve real covariance gaps; a finite smooth density extension accommodates hard cutoffs. Hypotheses: genuine disjoint coordinate blocks, real forest parameters, actual spectral bounds and sufficiently small quadratic insertion growth. Falsifiers: overlapping blocks left unmerged, an arbitrary nonforest covariance substituted for a forest point, moving cutoff domains, or an unsupported uniform higher-derivative estimate. Levels: formal—existing local dependency pins checked, no new formal theorem imported; literature—abstract/history and selected declaration only; heuristic—conditional application to actual insertions; speculative—quantitative connected analytic expansion. Bibliography integration in the knowledge-tree is pending, with no canonical graph promotion.
