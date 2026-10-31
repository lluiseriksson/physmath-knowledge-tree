# First-step gauge return and the input cell-volume factor

30 October2026. Same supporting investigation; no new paper, review or grade. This follow-up is outside the1482 audit.

Primary readings: CMP102 printed281/Proposition2, selected287-289/297 text and a magnified visual check of Eq190 on printed308; PDF3355501bytes,SHA256838056b5c578f81d058deb3d394c66d934690e3b94c6cf2956534ec6d211b541, DOI10.1007/BF01229381. CMP109 Eq0.5-0.11 provides the analytic equivariant contour average; CMP119 printed248 specifies the actual first-step background gauge U1(y,x)=I. These are selected source/application checks, not full-proof audits. All original regularity and averaging-compatibility assumptions remain.

## Correction to the1488 scale description

The input factor in the printed Eq190 is **(L^j' eta)^(-d)**, not an unpowered L^j' eta. BACKGROUND-RESPONSE1488's abbreviated input-factor description omitted this essential power. Its original bytes remain preserved; do not propagate the incomplete description.

Under the source's weighted kernel convention, let mu_c=(L^j' eta)^d for an input bond c on level j'. The kernel acts by

    delta Hcal(b)=sum_c mu_c K_H(b,c) delta B(c).

The coarse-cell weights are visible in the source operator compositions, e.g. Eq66. For an ordinary variation B(c)=theta X at ONE prescribed bond, the coordinate derivative is mu_c K_H(b,c)X. Eq190's input inverse cell volume therefore cancels that weight, leaving the stated output-scale factor and exponential decay. Keeping the inverse volume while dropping the integration weight, or replacing it by a positive first power, gives the wrong derivative.

In particular the zeroth regularity component of the stated bound gives, in that convention,

    ||d_theta Hcal(b)|| <=C (L^j eta)^(-1)
       exp[-delta0 d(y,y')/8] ||X||,

with the source's region/scale assignment of b and c. This is not a unitless kernel statement with j arbitrarily set to zero. The physical relative link W=exp(i eta Hcal)U0 has at the base point Hcal=0 the tangent bound eta times that expression. The finite real group derivative away from zero also has the unitary exponential bound. The kernel estimate is retained as the source's stated result; its unshown Eq189 calculation has not been reproduced here.

## An explicit return to the ORIGINAL first-step gauge

Fix a real admissible base V0 and U0=U1(V0) in the gauge required by CMP119, so its averaged contour variable U0(y,x)=I for each fine x in the block rooted at coarse y. For a small prescribed-average perturbation V(theta), Proposition9 supplies the minimal field in the relative Landau representation

    W_theta=exp(i eta Hcal(B(theta)))U0.

It lies on the required critical gauge orbit with the prescribed averages and original exterior constraints. Use the actual source contour family Gamma_yx and define

    g_theta(x)=M({ W_theta(Gamma_yx) }),
    g_theta(y)=I at coarse roots,
    g_theta=I on the fixed exterior outside the first-step block region.

This construction is restricted to the source-compatible full blocks where those contours and strict averaging chart are available. Under the source left/right equivariance, the averaged contour transforms as

    (W_theta^g)(y,x)=g(y) W_theta(y,x) g(x)^(-1).

Consequently W_theta^g_theta satisfies the actual first-step averaged axial conditions. The gauge is identity at the prescribed coarse roots and fixed exterior, so it preserves the average/exterior data. On the source's unique critical orbit and gauge branch it is the desired U1(V(theta)). This selects the first-step gauge directly; it does not assume that every multiscale axial convention is identical to it.

At theta=0, g0=I because U0 already satisfies the required gauge. Differentiation of the explicit link formula gives

    U1_dot(x,x')=g_dot(x)U0(x,x')+W_dot(x,x')
                 -U0(x,x')g_dot(x'),

and hence its operator norm is at most the sum of the three tangent norms. Those endpoint terms are the gauge return; they must not be discarded on the grounds that one closed trace is gauge invariant.

For each root path, unitary product differentiation bounds its tangent by the sum of its link tangents. If ell is the maximum path length and C_M the derivative norm of the ACTUAL contour average on the fixed strict chart,

    ||g_dot(x)|| <=C_M ell sup_(e in root-path carrier of x)||W_dot(e)||.

The path family and ell are finite at fixed L; for the standard within-block shortest contours ell<=d(L-1)/2. C_M depends on the chosen analytic averaging margin and source class, not on the volume. This converts the stated Hcal response into an original-gauge first-step background tangent with a finite enlargement to the endpoint path carriers. Keep the source distance to that whole carrier and its input/output scale assignments; no arbitrary metric or all-history uniformity is inferred.

## Relation to the actual first-T score

This route supplies the background tangent in the original gauge to1486, then1487 supplies C_dot, h_dot and the nonlinear remainder chain. Raw inner and exterior coordinates in1486 are still held fixed. We have not changed the integration variables into a moving Landau frame, so there is no license to replace this original-gauge tangent by W_dot alone. A different pullback calculation would have to transform the entire density and the exterior path as1488 warned.

The quantitative conclusion remains conditional on the source's stated Proposition9/Eq190, strict real averaging/constraint chart, compatible block contours, preserved exterior/coarse data and unique critical branch. It does not verify every history, the previously unshown kernel calculation, or the actual score's summed mixed-derivative norm.

Next finite task: insert this explicit original-gauge tangent into the actual averaging/lift and action/Jacobian derivatives of1486-1487. Bound the local raw/coarse mixed score contributions with their complete carriers and retain all coupling factors. Do not assume that a background tangent estimate alone bounds Cov(O,S) or the outer history covariance. No generic localized-background wrapper or minor paper is needed.

Falsifiers: a contour leaving the permitted block/domain, a failure of averaging equivariance/strict margin, a gauge return changing prescribed exterior data, a dropped input cell weight, or omitted endpoint tangent invalidates the corresponding application. Levels: literature for selected original kernel/gauge facts; heuristic for participating-agent single-bond normalization and first-step gauge-return construction; speculative for score summation/effective-insertion locality/global physical decay; formal:none new.
