# Spatial attachment loss is not removed by a covariance gap

Parent unreviewed finite witness,31October2026. This tests an abstract shortcut, not the actual source lattice construction, and does not refute a claim made by the historical sources or close the physical problem.

Take a two-dimensional periodic lattice with two scalar coordinate types a,b at every site. Its centered Gaussian covariance is the direct sum, over sites, of matrices [[1,epsilon],[epsilon,1]], with fixed0<epsilon<1. It has uniform spectral bounds1-epsilon and1+epsilon, finite interaction range and volume-independent row/column sums.

Let U={(i,0,a):1<=i<=n}, and V={(0,j,b):1<=j<=n}. The sets are disjoint as raw coordinate sets under EVERY spatial translation of V, even when their spatial sites intersect, because their coordinate types differ. Each support can arise as the coordinate union of a connected chain of fixed-size two-coordinate factor supports of its own type. Each original factor then has bounded radius, support size and overlap, independent of n.

For translations t=(u,-v),1<=u,v<=n, the supports U and V+t meet at exactly one spatial site. The cross-covariance block has exactly one nonzero entry epsilon, so its operator norm is epsilon. On a torus of side at least4n these n^2 translations are distinct without wraparound ambiguity. Therefore

    sum_t ||C_(U,V+t)||_op >=epsilon n^2,
    sqrt(|U||V|)=n.

No constant independent of n can bound that translation sum by a constant times sqrt(|U||V|) under ONLY the spectral, finite-range, fixed-size-factor and overlap assumptions above. A gap and entrywise decay alone do not justify the missing spatial summation in1574. The example is an exact finite Gaussian/geometry construction, not random numerical evidence.

This is compatible with a pointwise cross-block bound and with the dimension payment1574: the additional n-dependent count comes from translations. The crude universal replacement of those spatial costs by the same dimension factor must be abandoned. Actual source factors may have stronger incidence constraints; deriving and using those would require an explicit new dictionary, not an appeal to the abstract bounds alone.

Next: audit the real mixed-cutoff/forest packet for correct constants, exact factorization and any remaining unsupported summability claim. Any future rooted norm must count attachment coordinates or supply a different local-degree mechanism that pays the extra spatial multiplicity once. No claim of series divergence, source-family counterexample, novel paper or grade is made.

Levels: formal—no new machine proof; literature—previous source context only; heuristic—comparison with the actual source's still-unverified incidence structure; speculative—an improved rooted activity bound. Falsifier of the shortcut witness would be a mathematical error in the rank-one cross-block/count calculation; excluding it from the actual application requires additional concrete hypotheses. Model assessment1547 does not cover this later witness.
