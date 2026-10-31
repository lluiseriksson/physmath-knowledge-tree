# A fixed-step metric comparison for the retained mean response

30 October 2026. Supporting manuscript only; no paper, grade or independent assessment. The assumptions of1473–1491 remain. This note concerns only the boundary-free FULL first bare step, fixed odd L, source scale labels j<=1, and the retained strict real convex/analytic class. It does not remove those hypotheses or bound the physical outer law.

Primary reading: CMP96 (1984), printed223 introductory distance convention and printed230–231 Eq2.45–2.46, from the already-held fusion PDF. Fusion SHA256 00cc6b218dcf0e1c2884e135caa1d57b3591df036540b685e7440f30cbd4ff16. Eq2.46 visually read at fusion PDF339. CMP102 printed288 explicitly refers to this distance definition; its Eq190 is still a literature kernel estimate with the unshown189 calculation, not audited here. CMP102 SHA256 838056b5c578f81d058deb3d394c66d934690e3b94c6cf2956534ec6d211b541. Reading depth: selected distance definition/statement, not a propagator proof audit. No foreign PDF body copied to the archive.

The source distance is an infimum of weighted contour lengths: a segment in B^j(Lambda_j) is charged its physical length divided by L^j eta. The source also extends it to arbitrary fine sites by projecting each site to its block root. Thus it is not the unscaled fine-bond distance, and distinct sites within the same block may have zero extended distance. This precludes claiming equality with the raw metric.

For the present single step j<=1, every weighted length has weight at least1/(L eta). Let D be periodic ambient lattice l1 distance measured in fine lattice steps, with the source admissible block partition and periodic contour convention. Every admissible connecting contour has physical length at least eta*D between its endpoints. The two root projections can each move a site by at most d(L-1)/2 fine steps. Therefore

    d_source(x,z) >= max(0, D(x,z)-d(L-1))/L.

Restriction of contours cannot invalidate this lower bound: it only increases their infimum. If the source is interpreted in a nonperiodic chart, use its corresponding ambient distance throughout; a periodic distance is a smaller valid lower bound. The coarse input bond's endpoint conventions and the1491 two-block reconstruction/root-contour carriers require additional finite padding. Let r_L include all these full carriers, plus the finite plaquette and local-term diameters, in fine steps. It depends on fixed L and d, never the volume. Enlarging r_L makes

    kappa_X(c) <= K_L exp[-b max(0,D(x_X,z_c)-r_L)/L]
               <= K_L exp(b*r_L/L) exp[-nu D(x_X,z_c)],
    nu=b/L, b=delta0/8,

a consequence of the1489 background kernel and complete finite carriers. The local explicit coarse-frame term is supported when c belongs to that carrier and fits after enlarging K_L/r_L. The corrected input cell measure cancellation and original-gauge endpoint terms are retained. K_L includes fixed local carrier multiplicities and path factors, not a volume-dependent count of all bonds.

For the raw reflected covariance argument, explicitly choose the ambient periodic fine-bond anchor metric restricted to the free coordinates. Do not take shortest paths in an induced graph with selected bonds removed: detours there are not the source distance. The weighted proof1473 only needs a metric with bounded Hessian interaction range and polynomial growth; finite physical carriers1491 give both for this ambient metric. Recompute R_H and alpha=log(1+m/(2B_H))/R_H for this stated choice. Bond orientation gives finite multiplicity; the lattice torus has volume-independent polynomial growth. No old numerical alpha is inherited without this range conversion.

Absorbing complete support diameters in a fixed prefactor,1490's score sum is bounded by a sum over local-term anchors x,

    C_L sum_x exp[-alpha D(z_p,x)] exp[-nu D(x,z_c)].

With lambda=min(alpha,nu)/2, the triangle inequality gives each summand at most

    exp[-lambda D(z_p,z_c)] exp[-alpha D(z_p,x)/2]
                                      exp[-nu D(x,z_c)/2].

The sum of the remaining factors is bounded by the sum of the first alone. Polynomial lattice growth and bounded local-term multiplicity make that sum volume independent. The direct derivative term has the same source tail. Consequently, under all retained assumptions,

    |partial_(theta_c) a_p(V)| <= C_L' exp[-lambda D(z_p,z_c)],

where theta_c is one dimensionless coarse-bond group-angle direction. Constants may depend on fixed L, source decay/inverse margins, Hessian margin, carrier sizes and Lie dimension. There is no claimed uniformity as L or scale number varies. Parametrization by exp(i g1 B') adds a factor g1 to one coordinate derivative by chain rule.

This closes the fixed-step distance conversion conditionally at the level of a participating-agent analytic deduction. It does not establish later-scale effective insertion regularity, the gradient norm required by a different coarse measure, an outer-history covariance bound, bad-history probability, or global mass gap. Those remain substantive gaps. Next compare this precise response with the actual NEXT-step retained measure and observable requirements before any iteration; if its effective action lacks the finite-range/Hessian hypotheses, the same theorem cannot be reused unchanged.

Falsifiers: an actual scale label j>1 used without changing L in the denominator, missing root/carrier padding, using induced-free-graph distances, an absent source kernel/inverse margin, or a next-step application lacking its own assumptions. Levels: literature—selected source metric/kernel statements; heuristic—unreviewed participating-agent fixed-step conversion/convolution; formal—none new; speculative—later-scale and outer-history closure.
