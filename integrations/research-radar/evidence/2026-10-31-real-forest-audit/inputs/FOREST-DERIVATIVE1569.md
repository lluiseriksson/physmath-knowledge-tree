# All-order real density derivatives: explicit links, but a factorial barrier

Parent unreviewed addendum, 31 October2026; outside assessment1547 and the fixed PR240 head. No claim of a complete connected expansion or new theorem novelty.

## Finite derivative bound

At a real forest covariance C satisfying B^-1 I<=C<=a^-1 I, let H_1,...,H_k be symmetric covariance directions, each independent of the differentiation variables. With p_C the normalized Gaussian density and T_e=C^-1/2 H_e C^-1/2, the mixed derivative density divided by p_C is

    2^-k <Hermite_(2k)(C^-1/2 A), Sym(T_1 tensor ... tensor T_k)>.

This follows from the Gaussian heat identity D_H p_C=(1/2) sum H_ab partial_a partial_b p_C, applied k times. The order2k Hermite tensor includes the lower polynomial counterterms; replacing it by the uncentered monomial is wrong. Orthogonality of Gaussian Hermite tensors gives the upper bound

    ||(D_(H_1)...D_(H_k) p_C)/p_C||_2
      <= sqrt((2k)!)/2^k product_e ||T_e||_HS
      <= sqrt((2k)!)/2^k B^k product_e ||H_e||_HS.

All norms are finite scalar-coordinate norms; there is no hidden total-volume norm in this inequality. For a block edge e={i,j}, H_e has the original cross blocks C_ij,C_ji and zero elsewhere, so ||H_e||_HS=sqrt(2)||C_ij||_HS. Consequently

    |D_F E_C G|
      <= ||G||_2 sqrt((2k)!)/2^(k/2) B^k
         product_(e={i,j} in F) ||C_ij||_HS.

Here G is fixed as a measurable function of the coordinates, as in1565–1567; only the Gaussian density is differentiated. Smooth matrix cutoff extensions1567 have no derivative terms at forest covariances because they are identically one in a neighborhood there. The covariance directions in this formula are affine edge directions, not derivatives of the path-minimum parameterization itself.

If entrywise covariance decays, each cross-block Hilbert–Schmidt factor can be bounded by Cdec sqrt(|D_i||D_j|) exp[-alpha dist(D_i,D_j)]. Thus one explicit decaying link survives for each edge, at the cost product_i |D_i|^(degree_i/2). Overlap components can be large; their sizes cannot be replaced by a fixed single-insertion size.

For a product G of n interaction insertions and h distinct cutoff tails, the fourth-moment version of1565 and the simultaneous tail estimate1566 yield

    ||G||_2 <=(K4 t0)^n q^(h/4),

provided t0<=a/(32m), with K4=(a/(32m))^-1 exp[2(a/(32m))(c+2/a)d0]. This uses Holder, not independence, and retains the original cutoff factors. At k=0 the score polynomial is1 and the same statement reduces to the product bound.

## The bound is not yet summable

The global prefactor sqrt((2k)!)/2^(k/2) grows at factorial order. For a tree on N components, k=N-1. A crude sum over rooted spatial placements and N^(N-2) labeled trees, even with the usual1/N! for unordered labels, leaves a superexponential upper-bound sequence when this extra global factorial is retained. It therefore gives no positive uniform activity radius by that counting argument.

This is a failure of the crude majorant, NOT a proof that the actual series diverges. In particular the repeated one-dimensional covariance-direction case attains the Hermite factorial bound, but it is not itself a forest of disjoint source components. A useful next bound must exploit the block-edge pattern to localize derivative costs to vertex degrees, or use a different connected expansion with demonstrably summable constants. Simply relabeling the global factorial as a constant per edge is invalid.

The scalar repeated-direction check: for C=1 and H=1, D^k p/p=2^-k He_(2k), hence its squared L2 norm is (2k)!/4^k. This validates the normalization and distinguishes the generic bound from a source-specific forest claim. It supplies neither novelty nor an actual lattice counterexample.

## Disposition

Real forest gap/smoothness1567 plus this density identity remove the need to differentiate hard-cutoff boundaries and expose explicit spatial edges. They do not remove the quantitative combinatorial hypothesis. Keep original geometric admission, source-normalized law/counterterm and complex-background measures separate. PR240 remains at its already checked fixed head and does not include this addendum.

Mechanism: Hermite orthogonality estimates density derivatives without field-cutoff derivatives. Hypotheses: centered symmetric real covariance, spectral bounds, affine symmetric directions, fixed integrable observables, correct overlap-component grouping. Falsifiers: replacing the Hermite tensor by an uncentered moment, dropping component sizes, differentiating a moving cutoff, or assuming the global factorial has exponential growth. Levels: formal—no new machine proof; literature—Gaussian/forest source context already recorded, no additional proof audit; heuristic—conditional application to actual mixed factors; speculative—degree-local summability and full source transfer. No paper, grade or model review is created.
