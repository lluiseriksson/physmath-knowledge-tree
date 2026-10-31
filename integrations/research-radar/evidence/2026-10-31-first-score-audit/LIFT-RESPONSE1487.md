# The actual selected-coordinate lift response

30 October2026. Follow-up to the actual score in1486, same supporting manuscript. No new paper, review or score. This follow-up is outside the four-note1482 audit.

Primary: CMP109 printed267 Eq2.10-2.11 and the intervening linearization construction, exact held PDF5490078bytes,SHA2561c2d2e500fd1e6a1a7981fed259cc2354ebcf64e473fd564bfc3f2c4d7dfbe2a, DOI10.1007/BF01215223. Selected text read here. CMP119 printed249 gives Q C=0 after selected-coordinate elimination. No full-proof audit. The source identifies b0(c) as the fine bond in the coarse bond c and its corridor, and h is supported only on these bonds with L Q h=I.

## Differentiate the source constraints, not a covariance surrogate

Keep the selected bond set and the free coordinate projection P fixed along the real coarse-field chart from1486. Use Q_theta for the source's LINEAR AVERAGING operator in this section, not for the precision C*Delta C also denoted Q in earlier notes. Call the latter precision K_free when both occur. This distinction is essential.

The actual free constraint lift C_theta and selected right inverse satisfy

    Q_theta C_theta=0, P C_theta=I,
    T_theta=L h_theta, Q_theta T_theta=I,
    range(T_theta) lies in the selected-coordinate subspace.

The restriction of Q_theta to that selected subspace is invertible in the source chart. Differentiating the first two identities shows that C_dot has zero free projection and

    Q_theta C_dot=-Q_dot C_theta.

Uniqueness on the selected subspace then gives the ACTUAL lift derivative

    C_dot=-T_theta Q_dot C_theta=-L h_theta Q_dot C_theta.

Likewise, since the selected subspace is fixed,

    T_dot=-T_theta Q_dot T_theta,
    h_dot=-L h_theta Q_dot h_theta.

No Gaussian inverse is involved. The factor L follows from the source normalization L Q h=I and must not be omitted. The derivative includes the total dependence of the averaging linearization on the changing background/chart. If Q is constant on a special parametrization, these terms vanish there; this is not assumed for the general physical path.

For compatible operator norms this yields

    ||C_dot||<=L ||h_theta|| ||Q_dot|| ||C_theta||.

The source average is a function of a finite set of block contours at fixed L. On a fixed strict analytic/logarithm-margin class its first/second local derivatives have finite uniform maxima. Therefore local Q_dot blocks can be bounded by the ACTUAL background/coarse-frame tangent on their complete contour inputs, with finite-overlap constants. This is locality in those input derivatives; it is not yet exponential locality in the coarse perturbation, because the background tangent remains to be bounded.

## Nonlinear constraint response in the same chart

To avoid confusing the source's nonlinear remainder C(B') with the free lift C, denote that nonlinear remainder by N_theta. The source equation is

    D_theta=N_theta(B_theta-h_theta D_theta),
    B_theta=g0 C_theta A,
    R_theta=B_theta-h_theta D_theta.

All dots below hold the raw A and g0 fixed, as in1486. With X_theta=B_theta-h_theta D_theta and N_x its derivative in the field argument,

    B_dot=g0 C_dot A,
    (I+N_x h_theta) D_dot
       =(partial_theta N_theta)(X_theta)
        +N_x(B_dot-h_dot D_theta),
    R_dot=B_dot-h_dot D_theta-h_theta D_dot.

The partial theta derivative of N holds its argument X fixed and retains the background/chart dependence; it is not the total derivative already counted in B_dot. In the same strict contraction class used by the primitive estimate, ||N_x h||<=1/4 gives ||(I+N_x h)^-1||<=4/3. Hence a usable source-relative bound is

    ||D_dot||<=4/3 [||(partial_theta N)(X)||
        +||N_x|| (||B_dot||+||h_dot|| ||D||)].

This is the explicit chain needed in the direct observable derivative and in the Jacobian/nonlinear terms of the1486 score. It prevents treating the lift, selected correction or nonlinear Jacobian as frozen when V varies. It does not replace the missing physical background response by a newly assumed bound.

## Remaining background problem

U1(V) is a constrained critical point with the actual original gauge choice. Its tangent must be obtained by differentiating that constrained variational problem, including the curvature/Lagrange-multiplier term and physical J=J(U1). A free-coordinate covariance inverse alone is not the full reconstruction tangent. An unconstrained formula that inverts an action Hessian on gauge/constraint-null directions is also not justified merely by the constrained gap.

Next finite task: recover the corresponding constrained-background derivative equation/operator from the held variational source and match its gauge/target normalization to Q_theta and h_theta above. Then insert it into Q_dot, partial_theta N and the precision/Jacobian terms of the actual first-step score. The locality of a_i(V) remains unproved until those real carrier/tail sums are controlled. Do not add a named localized-score hypothesis or a paper for these supporting chain rules.

Falsifiers: a moving selected set, loss of the selected-subspace inverse, wrong L normalization, confusing averaging Q with precision K_free, or dropping the physical background chain. Levels: literature for selected original coordinate identities; heuristic for participating-agent differentiation/local finite-stencil application; speculative for uniform coarse-background response/physical connected decay; formal:none new. No novelty, independent review, grade or global physical result.
