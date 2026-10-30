# Matching the actual hard tree slice to the averaged soft gauge

30 October2026. Same supporting manuscript. CMP109254–255 and265–268 (especially2.5,2.11), CMP99 printed428 selected definitions/statements reread. Exact source hashes are retained in1494; fusion00cc6b218dcf0e1c2884e135caa1d57b3591df036540b685e7440f30cbd4ff16, CMP1091c2d2e500fd1e6a1a7981fed259cc2354ebcf64e473fd564bfc3f2c4d7dfbe2a. No complete propagator proof audit or independent review.

There is a concrete way to avoid1494's requirement that the hard and averaged axial slices coincide. Use the actual hard tree slice from CMP99, then keep its nonzero averaged contour coordinate explicitly. Let B be a coarse unit-lattice fluctuation satisfying the linear average constraint at the actual critical V^(1). Work with gauge parameters lambda zero at block roots (and fixed exterior), and T the infinitesimal gauge action in the source left/right link convention. The root-fixed gauge covariance of the coarse average gives Q_av T lambda=0. In the full boundary-free branch, a hard tree gauge can be reached independently in each block: solve the gauge parameter recursively along its fixed tree so B_h=B-T lambda_h has zero tree bonds. Background parallel transports are unitary on the real branch, so each solved parameter is a sum of at most ell_L transported bond components, ell_L bounded by the finite block tree diameter. The maps B->lambda_h and B->B_h have bounded row and column multiplicities depending only on fixed L,d and group dimension, hence volume-independent l2 norms. This concerns the coarse lattice, not the fine H1 reconstruction.

Let G be the linearized *averaged* contour gauge map in CMP1092.5, expressed in unitary transported site frames. Covariance of every root contour gives G(T lambda)=lambda with a consistently chosen sign. At the averaged-gauge critical background, each contour's relative product is based at the identity average, so the same covariance identity holds for their analytic mean; no particular tree equality is assumed. G itself is a finite within-block contour derivative with bounded norm K_G on the strict real averaging class. Define mu=G B. Then

    mu=G B_h+lambda_h,
    B=B_h+T(mu-G B_h).

In particular G B_h need NOT vanish. This is the slice-change term missing from an identification of the two gauge conventions.

The constrained physical Hessian q_phys at the actual stationary constrained background is gauge-null with zero mixed gauge terms: differentiate invariance along the root-fixed gauge orbit and use stationarity on the constrained manifold. This is the Hessian of the constrained action, including its constraint-curvature/J terms, not an arbitrary unconstrained Wilson Hessian. CMP1092.11 identifies that physical quadratic form with CMP99's3.156, replacing the hard gauge condition by the exponential gauge quadratic. Hence

    q_soft(B)=q_phys(B_h)+kappa_G ||mu||^2.

Here kappa_G>0 retains the actual quadratic gauge coefficient and trace/basis normalization from2.5; it is not assigned the value1 by convention without checking that normalization. Source428 gives q_phys(B_h)>=gamma_ax ||a_h||^2 for B_h=C_h a_h in its actual hard free-coordinate norm, on its regularity class. The statement remains literature input with the source proof limits1494.

The eliminated hard selected-coordinate map C_h has finite carrier and norm K_C on the admitted real background class: its selected coefficient inverse is uniformly bounded in the strict averaging chart; other outputs are identity or fixed tree-zero components. Thus ||B_h||<=K_C||a_h||. The infinitesimal gauge map T has norm K_T bounded by the finite endpoint degree (unitary adjoint transports), uniformly in volume. For actual soft free coordinates a, a is a coordinate projection of B=C_raw a, so ||a||<=||B||. It follows that

    ||a|| <= A_L ||a_h||+B_L ||mu||,
    A_L=K_C(1+K_T K_G), B_L=K_T,
    ||a||^2 <= (A_L^2+B_L^2)(||a_h||^2+||mu||^2),
    q_soft(C_raw a) >= m_G ||a||^2,
    m_G=min(gamma_ax,kappa_G)/(A_L^2+B_L^2)>0.

This supplies an explicit symbolic hard-to-soft constant at fixed L, subject to the stated actual critical/chart/source conditions. No numerical bound or scale-uniform statement is extracted. The tree gauge recursion is used for existence of the decomposition; the displayed norm bound uses only C_h,T,G after the decomposition, so it does not acquire an exterior volume factor.

The same identity identifies the soft raw precision as R_h* Q_h R_h+kappa_G G_raw*G_raw, with R_h taking soft raw variables to hard free coordinates and G_raw=G C_raw. R_h, C_raw and G_raw have bounded finite carriers on this unit step; Q_h has the source428 exponential kernel. Therefore their composition retains an exponential precision kernel after finite padding and fixed-L norm factors. Its weighted Schur moment tends uniformly to0 with alpha->0 by polynomial lattice growth. This is a participating-agent deduction, not a claim that a source supplied the soft matrix unchanged.

Decision: the gauge-convention mismatch can be bridged explicitly without pretending the slices coincide. The Gaussian part of the1493 curvature gate now has a conditional positive margin m_G and exponential moment mechanism. The FULL density still requires all2.12 correction Hessians to fit that margin, including old E1(U1(V)), H1 nonlinear chains, Haar/Jacobians and Cauchy radii. Next extract their actual normalized coupling/physical cutoff dependence before claiming a small perturbation. Outer-history/bad sets/all-scale physical covariance remain open. No new paper, grade, formal result or independent assessment.

Falsifiers: failure of constrained stationarity/gauge covariance, a singular averaging inverse, missing G B_h slice term, incorrect gauge normalization, or nonunitary/complex transports used in the real l2 argument without bounds. Levels: literature—source hard gap and actual soft quadratic identification; heuristic—unreviewed participating-agent slice bridge/norm and weighted-kernel deduction; speculative—full nonlinear curvature/iteration/global bound; formal—none new.
