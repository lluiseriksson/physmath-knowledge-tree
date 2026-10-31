# Charge attachments on original labels, before summing component trees

Parent unreviewed conditional deduction,31October2026. Outside assessment1575. This addresses the endpoint sum left in1591. It is an abstract finite-factor estimate with stated source hypotheses, not a completed physical source admission, an assessed manuscript or a novelty claim.

## Inputs and exact objects

Use the actual finite label universe I from1566/1574, with nonempty scalar-coordinate supports D_i of size at most D. Each scalar coordinate belongs to at most m labels. The support-overlap graph has maximum degree Delta (one may use D(m-1)). The ORIGINAL real Gaussian covariance C has uniformly bounded absolute row sum J and uniform lower spectral bound B^(-1). Its real path-minimum forest covariances obey the same lower bound and the upper bound required for the mixed factor estimate. The factors are fixed measurable functions, including original signed cutoff tails. Assume, uniformly at all these forest covariances and for all selected subsets S,

    ||product_(i in S) f_i||_2 <= lambda^|S|.

In the earlier conditional source notation one may use lambda=max(K4 t0,q^(1/4)); this requires all of that product estimate's support, smallness and actual-field hypotheses. No Gaussian independence of the factors is assumed.

For a nonempty subset S, z(S) is EXACTLY1574's sum of connected forest integrals over its support-overlap components; for one component it is the original full moment. Thus labels in S are distinct, and different overlap components have disjoint scalar coordinate unions. The finite Gaussian forest identity and local-noise response1591 are premises of this deduction.

## The original-label tree injection

Fix S and its overlap components S_j. On each S_j choose ONE deterministic spanning tree of its overlap graph, using a fixed total order on I. For each scalar coordinate in its union choose ONE deterministic owner label in S_j whose support contains that coordinate. This owner is selected once for S, not separately for each external edge.

For a component spanning tree T and one scalar endpoint assignment for every edge in1591, attach an external edge between the two endpoint owner labels. Adjoin all chosen internal overlap trees. The result is a tree on all s=|S| ORIGINAL labels: internal edges connect each component, external edges connect the contracted components without a cycle. Color internal versus external edges and retain the scalar endpoints of external edges.

This map is injective for fixed S. Deleting external edges recovers the overlap components, contracting internal trees recovers T, and retained endpoints recover the assignment. Restricting to the chosen canonical internal trees only reduces the set of possible decorated label trees. No free N! for component vertices is inserted.

Let alpha_x be scalar endpoint occupancies in1591, and e_i the external degree of owner label i. Because each scalar has a single owner within its component,

    product_x alpha_x! <= product_i e_i! <= product_i d_i!,

where d_i is its full degree in the resulting label tree. The first inequality is the integer multinomial inequality within each owner's support; the second adds internal degrees. Hence the square-root factorial costs can be bounded on original label vertices BEFORE any spatial/translation sum. Reassigning the same scalar independently to different owners would invalidate this step and is not done.

## A row-summable label kernel pays spatial placements once

Put c=1/(2B), as in1591, and define a symmetric nonnegative kernel on original labels,

    w(i,j)=1_(D_i intersects D_j, i!=j)
           +c^(-1) sum_(x in D_i,y in D_j)|C_xy|.

Internal-edge weight is1; external-edge weights sum over the original scalar endpoints and include their noise derivative cost c^(-1). Summing all color choices is exactly dominated by the product of w along a label tree. Including otherwise forbidden overlapping external supports or repeated labels only enlarges this upper bound. The kernel has row sum at most

    Delta + 2 B D m J <= R,   R=max(1,Delta+2 B D m J).

Indeed sum_j sum_(x in D_i,y in D_j)|C_xy| <= sum_(x in D_i)sum_y m|C_xy| <= DmJ. Thus translations, covariance attachment coordinates and label incidence have already been charged to this ONE row bound. They must not be charged a second time by a set-distance estimate.

The injection and1591 now give, for s>=2,

    |z(S)| <= lambda^s sum_(trees tau on S)
                       product_i sqrt(deg_tau(i)!) product_(ij in tau) w(i,j).

This upper bound also covers the single-overlap-component case by its canonical internal tree. The case s=1 is |z({i})|<=lambda. The forest integration domain has volume1 for each component tree, so integrating its pointwise uniform bound adds no factor. No factorial is suppressed at this step.

## The only enumeration factorial comes from original sets

Fix an original root label r. Order the other s-1 DISTINCT original labels. Every rooted set S of size s is represented exactly (s-1)! times. Its original coefficient and the tree sum are invariant under this reordering. This gives a justified factor1/(s-1)!; it is unrelated to a putative1/N! on overlap components or a Mayer1/p! on polymer families.

For each fixed tree on the ordered vertices, drop distinctness of the other label values and successively sum leaves using the row bound R. This costs at most R^(s-1), with root r fixed. Degree factorials depend on the abstract tree and are left outside those positional sums. Prüfer counting yields

    sum_(trees on s numbered vertices) product_i sqrt(d_i!)
      =(s-2)! [z^(s-2)] F(z)^s,
    F(z)=sum_(l>=0) sqrt((l+1)!)/l! z^l.

All coefficients are nonnegative. Cauchy-Schwarz gives

    F(1) <= sqrt[(sum_l (l+1)2^l/l!)(sum_l 2^(-l))]
          = e sqrt(6) = A.

Consequently, for s>=2,

    sum_(S contains r, |S|=s)|z(S)|
      <= lambda^s R^(s-1) A^s/(s-1).

In particular, if lambda A R<1, the total rooted absolute activity sum is bounded by

    lambda - lambda A log(1-lambda A R).

For an exponential size weight exp(eta|S|), replace lambda throughout by lambda exp(eta). All constants are independent of the finite label universe size under the stated uniform inputs. This is a bound on the UNNORMALIZED connected activity defined1574; no conclusion about normalized source observables or intrinsic counterterms is inferred.

## Why this differs from the failed majorant

The former estimate collapsed each large component into an operator norm, then paid component-size translation losses and degree costs on that same component. Here a global tree on ORIGINAL labels incorporates canonical overlap links and covariance attachments together. Repeated-coordinate factorials are paid on original labels, while the single row-summable kernel pays placements. Its rooted-set factorial is explicitly justified by ordering original distinct labels. The n^2 translated-component witness remains true; its many endpoint choices are included in the sum over original label trees, rather than bounded uniformly by a size-independent component attachment constant.

No zero-free/logarithm theorem is imported in this note. A later application would also need the correct incompatibility norm and an explicitly stated criterion. The original maximal-domain/variational geometry1587/1588, actual Gaussian bounds and factor universe identification remain separate source obligations. The exact finite combinatorial check exercises the canonical tree/owner map, checks no collision and verifies occupancy inequalities on all rooted subsets of one small support universe; it does not prove the theorem or verify physical hypotheses.

Mechanism: combine internal overlap trees with external covariance endpoints before summing degrees or positions. Hypothesis reduction: under the declared Gaussian and factor inputs, replaces the previously unproved component attachment/first-stage enumeration estimate with an original-label rooted activity bound. Formal level: no machine theorem or Lean build; analytic argument and exact finite checks only. Literature: existing finite forest identity and Gaussian heat/convolution context; current source sweep inventory_only. Heuristic: source parameter identification. Speculative: full physical activity, normalizer and marginal transfer. Falsifier: a failure of the owner/tree injection, the uniform mixed-factor bound, the absolute covariance row sum or the correct actual label supports. Preserve this unreviewed status until a fresh technical assessment checks the complete argument; inherit no1575 assessment or numeric grade.
