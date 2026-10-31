# Direct flat first-step gap from actual root paths and zero block averages

31October2026. Participating-parent deduction for the single supporting manuscript. No new review, paper, score or formal result. This targets the uniform FLAT reference gap needed before paying the original full-cutoff Hessian perturbation. It does not itself certify that perturbation or a physical ensemble.

Source definitions: CMP109252–254 Eq0.3–0.12 and267 selected right inverse; CMP119249–250 and253 first integral. The first averaging derivative at the identity is a positive weighted mean of the same root-to-root paths, up to its fixed nonzero scale normalization. Eq0.8 gives the linear term of the group average. Eq0.12's reference coarse-path term cancels at first order, leaving the weighted root-to-root path sum. Each such path lies in its two endpoint blocks and crosses only their common interface, as checked in1491. The soft gauge coordinate G at the identity is the corresponding mean root-to-site contour sum. Source LQh=I confirms the average is nondegenerate on its selected interface bond.

The original flat Wilson and exponential-gauge quadratic terms are positive multiples of squared discrete curl and squared G. At the flat background J=0, so the background-current correction vanishes. Use matched real Lie-coordinate Hilbert norms and retain the actual positive constants c_W and kappa_G from the source trace/gauge normalization:

    q_flat(B)=c_W ||dB||_2²+kappa_G ||GB||_2²,  QB=0.

All formulas below use unit fine-lattice path sums; fixed first-step scale conversions belong in c_W,kappa_G and the final L-dependent constants. No hard-axial gap is silently identified with this soft precision.

## A constructive local identity

Fix a source-admissible odd L>11 block partition, d=4. Local patches and their contours are lifted consistently across periodic seams; use the existing source family with distinct geometric bonds/blocks. For a Lie-valued fine one-cochain B in ker Q, define lambda(x)=GB(x), with lambda=0 at each block root. Write nabla lambda(e)=lambda(e_+)−lambda(e_−) and

    B'=B−nabla lambda.

Every root-to-site path telescopes on nabla lambda, hence G nabla lambda=lambda and GB'=0. Every root-to-root averaging path has both endpoints at coarse roots, hence Q nabla lambda=0 and QB'=0. Also dB'=dB. This uses the actual flat contour derivative, not an assumed inverse gauge map at nonflat backgrounds.

For an internal edge e=(x,x') of a block rooted at y, average the closed paths

    Gamma_(y,x) + e − Gamma_(y,x').

Their B' integrals average to B'_e because both G endpoint values are zero. Each loop lies in that one rectangular block.

For an edge e crossing the interface of adjacent blocks with roots y,y', form

    P_e=Gamma_(y,e_−)+e−Gamma_(y',e_+).

Its integral, averaged over the two endpoint contour families, is again B'_e. Subtract an independently averaged source root-to-root path P_c for that same coarse bond. Its average integral is zero by QB'=0, regardless of the fixed nonzero normalization of Q. Therefore B'_e is an average of integrals over closed loops P_e−P_c, all in the rectangular union of those two blocks.

In a finite rectangular cubical grid each of these loops is a sum of oriented plaquette boundaries. One constructive filling is to compare each coordinate-permuted path with a fixed ordered path, commute adjacent coordinate segments through rectangles, and cancel backtracking edges. All rectangles stay in the local lifted patch. The path families and lengths are finite at fixed L,d. Choose one such filling for every finitely many local edge/contour types and translate it with the block partition. Discrete Stokes then supplies a concrete finite-carrier scalar operator E_L, acting identically on the Lie coordinates, with

    B'=E_L dB.

No inverse or coercivity assumption defines E_L: its coefficients are the signed plaquette multiplicities in those chosen fillings, averaged with the actual positive contour weights. Every row has finite support in at most two endpoint blocks. Every plaquette belongs to the patches of only a bounded number of fine edges at fixed L. Thus

    R_L=sup_e sum_p |E_L(e,p)| < infinity,
    S_L=sup_p sum_e |E_L(e,p)| < infinity,

with constants independent of total volume. This column bound is important: merely giving a finite row bound or an operator bound dependent on the number of blocks would not suffice. Periodic push-forward of the consistently lifted local fillings retains the same bounded multiplicities. The construction needs the stated source patch convention; no assertion is made for a degenerate one-block geometry outside that convention.

Schur's inequality gives ||B'||²<=R_L S_L ||dB||². The ordinary nearest-neighbor incidence bound gives ||nabla lambda||²<=4d ||lambda||². Consequently

    ||B||² <=2 R_L S_L ||dB||²+8d ||GB||².

Taking C_L=max(1,R_L S_L) yields the positive uniform soft bound

    q_flat(B)>=a_flat ||B||²,
    a_flat=min(c_W/(2 C_L),kappa_G/(8d))>0.

For the actual selected-coordinate lift B=C_flat a, the independent raw variables are a coordinate projection of B, so ||a||<=||B||. Therefore C_flat* Delta_flat C_flat>=a_flat I in the actual SOFT free-coordinate space. No equality with the smaller hard-axial coordinate matrix, no missing G(B_h) cross contribution and no uniform arbitrary-background source gap are used in this direct flat calculation.

## Hypothesis reduction and limits

The mechanism replaces a separately imported flat soft-gap assertion by the source's actual positive quadratic form, its finite contour averages, elementary local Stokes fillings and bounded overlap. It is a parent analytic deduction, not an independent source-proof audit or Lean declaration. The geometric filling is constructive but its coefficients and numerical R_L,S_L have not been enumerated here; only their finite, volume-independent bounds are derived. This is not a numerical certificate.

The zero BLOCK-AVERAGE condition QB=0 is essential. A result about only a global divergence-free subspace or bounded gradient repair cannot be substituted for this condition; low-frequency modes in a different space do not refute this block-pinned estimate. The soft gauge term is also essential to control exact gradients. Deleting either condition changes the problem.

Next bounded calculation: on the FULL first branch, use the source bare density H(A,U)=g0^-2 f_U(g0 A)+j_U(g0 A)+constant and the finite action/Jacobian carriers checked1524 to bound ||Hess_A H−Q_flat|| uniformly on the ENTIRE ORIGINAL raw cutoff. Use a sufficiently small source-admitted Landau-background neighborhood and the exact FULL-integral orthogonal covariance repair, not the false1489 original-gauge tangent. A common first Hessian margin follows only after this actual perturbation and original delta0(g0) budget is paid. The source's stated background kernel, common implicit-chart radius and fixed cutoff convention must remain explicit; no parameter-dependent shrinking of the first law is allowed.

Falsifiers: a nonpositive/non-path flat average, an averaging path leaving the asserted two-block patch, loss of a genuine closed lifted loop, unbounded patch overlap, wrong source gauge quadratic, or an untracked norm/scale conversion invalidates the corresponding step. They are concrete checks on the actual definitions, not a new hypothesis named after the desired gap. Levels: literature—selected source averaging/quadratic definitions; heuristic—this participating-parent constructive gap proof; formal—none new; speculative/open—uniform full-cutoff physical perturbation and all exterior/history/global extensions. No new paper or separate small-result PR is warranted.
