### Closing the finite-dimensional reflection framework at statement level

30 October2026. This supersedes only the framework gate in1473. It preserves the explicit physical Hessian/history assumptions and all outer-history limitations. It is a participating-agent application of published statements and an analytic deduction, without independent review or formal verification.

Primary source A: L.Slominski, *On existence, uniqueness and stability of solutions of multidimensional SDE's with reflecting boundary conditions*, Ann.Inst.H.Poincare Probab.Statist.29(2),163-198(1993), [Numdam](https://www.numdam.org/item/AIHPB_1993__29_2_163_0.pdf). Exact PDF2426875bytes,SHA256 b01a032420ad4b4b31275a6319d9d98d731f2a32b46cf26d41276375eaeb0c73. Abstract and selected statements read; PDF5 defines inward normals and domain assumptions(A),(B); PDF29/printed190 Theorem5 supplies strong existence/uniqueness for bounded Lipschitz coefficients under those conditions, with its stated jump restriction. Its proofs have not been fully audited. This old primary source supplies an accessible theorem rather than an assertion about the inaccessible Tanaka PDF.

Here is the domain check, not an extra dimension-uniform assumption. Write U=int K, where K is the actual finite compact convex product with nonempty interior. Every supporting inward unit normal admits an exterior ball of any fixed radius, so(A) holds. Choose an interior ball B(z,r) contained in U and D=max_{x in K}|z-x|. For x on the boundary, y on the boundary within delta=r/2 of x, and any inward supporting unit normal n_y, convexity and the inball imply

    <z-y,n_y> >= r,
    <(z-x)/|z-x|,n_y> >= r/(2D).

Thus(B) holds with l_x=(z-x)/|z-x| and beta=max(1,2D/r). Corners cause no failure: the inequalities hold for every inward normal, not a chosen smooth face alone. These auxiliary domain constants may depend on finite volume; they establish existence and do not enter the covariance estimate. Do not claim their uniformity.

In Theorem5 use the continuous driver Z=(t,B_t), fixed initial process, and coefficient matrix f(A)=(-grad H(A),sqrt(2)I). H is C2 near compact K, so f is bounded and Lipschitz on K; no discontinuous driver or jump restriction issue arises. The theorem yields pathwise uniqueness and a strong solution for each initial point on the same prescribed Brownian space. The unweighted normal-cone formulation supplies exactly the synchronously coupled objects used in1473. Product structure is still needed for its WEIGHTED reflection signs.

Primary source B: L.Ambrosio,G.Savare,L.Zambotti, *Existence and Stability for Fokker-Planck equations with log-concave reference measure*, [author-deposited PDF](https://cvgmt.sns.it/media/doc/paper/697/asz.pdf), linked from [CVGMT697](https://cvgmt.sns.it/paper/697/), arXiv0704.2458, first preprint19April2007. Exact deposited PDF399178bytes,SHA256 ffdd8f79df957447f37c83f3884e8a3fcbf33992ba002e16fabb947eeab67f5d. Abstract and PDF3 Theorem1.2/adjacent finite-dimensional reflection example read; no full-proof audit. The theorem constructs the symmetric gradient Dirichlet form and invariant reversible process for a log-concave measure. The adjacent example identifies reflection on a convex open set for a C1,1 convex interior potential. The archive's update date is not a first-preprint date; its PDF is not asserted byte-identical to an arXiv version or journal version.

Apply B to V=H on U, extended by +infinity outside U; changing boundary values does not change the Lebesgue density. Convexity of H on K makes the resulting probability log-concave. The support is K, and finite dimension/full interior gives the ordinary Euclidean gradient form. The finite-dimensional reflection identification and the pathwise-unique normal-reflection solution above identify the semigroup used in1473 with this reversible one. The form normalization is E(u,v)=int grad u dot grad v dmu, matching sqrt(2) noise; there is no missing factor2.

The final convergence step can be obtained directly without a volume-uniform mixing theorem. Couple X_0=x to Y_0 distributed as mu, independently of the driving Brownian motion, using their common Brownian motion thereafter. Invariance gives Y_t distributed as mu. The weighted contraction from1473 bounds

    |P_t f(x)-mu(f)|
       <=Lip_W(f) exp(-m t/2) E||W(x-Y_0)||.

The last expectation is finite on compact K; it need not be uniform in volume. Therefore P_t f converges to mu(f). For bounded Lipschitz f,g in the closed form domain, the symmetric semigroup identity first on a finite positive time interval, followed by the gradient bound and dominated integration, gives the covariance identity in1473. Sobolev gradients suffice; a boundary-smooth stochastic flow is not required.

Consequently the framework gap in1473 is closed at the level of these selected primary statements and the explicit finite-dimensional domain/coefficient dictionary. The resulting CONDITIONAL finite-volume conclusion is

    |Cov_mu(Phi_p,Phi_q)| <= (4 gamma^2/a_soft) g0^2 exp(-alpha dist(S_p,S_q)),
    alpha=log(1+m/(2B_H))/R_H, m=a_soft/2,

under the actual raw product geometry, full inside/outside physical Hessian margin, uniform bare finite-range row/column Hessian bounds and primitive Lipschitz estimates. This removes a separately ASSUMED connected-mixing estimate on that particular conditional convex class. It does not establish that every physical history lies in the class, nor bound the excluded histories or the covariance of conditional means. Those are the consequential remaining hypotheses, together with original source coercivity and exact observable transport. It is not a global Yang-Mills mass-gap result, an all-scale H1 result, or a novelty claim.

Next finite task: consolidate the exact admitted first-step physical history event, its complete exterior-stencil dictionary, and all remaining original-source assumptions into one theorem/scope dossier before a meaningful knowledge-tree update. Abandon any global inference unless the law-of-total-covariance outer term and complement are actually controlled. Do not create a separate paper for this standard reflection argument. Confidence: literature for the cited selected statements; heuristic for this participating-agent application and the earlier physical dictionary; speculative for outer-history transport; no new formal result. Existing adverse findings and inaccessible Tanaka status remain preserved.
