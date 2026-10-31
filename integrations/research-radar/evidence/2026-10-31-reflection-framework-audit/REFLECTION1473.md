### Weighted synchronous reflection: conditional estimate and precise remaining gate

30 October 2026. Participating-agent deduction for the existing bare first-step candidate. This is not an independently reviewed theorem, a new paper, or a result about the outer history law. The Hessian and physical-history margin from1472 remain explicit hypotheses.

Let K=product_b K_b be the ACTUAL retained domain in distinct independent raw Lie-algebra bond blocks, with repeated identical cutoff restrictions deduplicated. Each K_b is a compact convex norm ball with nonempty interior. Eliminated selected bonds are outputs of the constraint chart, not extra independent cutoff coordinates. Let mu=Z^-1 1_K exp(-H)dA. Require H C2 on a neighborhood of K, Hess H>=m I, m=a_soft/2, and the actual bare block Hessian to have range R_H and block row/column norm sums at most B_H, uniformly on K and the admitted histories/interpolation. These assumptions require the full inside AND outside physical input margin CH epsilon_phys+CJ g0^2<=a_soft/2. No estimate for the probability of the complement has been supplied.

Framework gate: the following argument uses the normally reflected Langevin process with generator L=Delta-grad H dot grad on this possibly nonsmooth convex product, its synchronous construction, and its reversible Sobolev Dirichlet form E(u,v)=int grad u dot grad v dmu. These are standard types of objects, but the applicability of a primary theorem with all the present domain/drift hypotheses has NOT yet been statement-read here. Thus the calculation below is a conditional proof reduction, not a source-verified hard-cutoff theorem. No smooth stochastic flow or vector H2 boundary regularity is assumed.

For S=support(grad f), set w_b=exp(-alpha dist(b,S)) and W=diag_b(w_b I). Distance is in the actual raw bond graph, with the chosen finite interaction range measured in that graph. In a finite volume all w_b are positive. For a nonzero Hessian block, w_b/w_c lies between exp(-alpha R_H) and exp(alpha R_H). Schur's bound therefore gives

    ||W Hess H W^-1 - Hess H|| <= B_H (exp(alpha R_H)-1).

Choose alpha>0 with the right side <=m/2. For B_H>0 and R_H>0 one may take alpha=log(1+m/(2 B_H))/R_H. Purely block diagonal cases can be treated separately. The symmetric quadratic form of the conjugated Hessian is then >=m/2. B_H is a row/column bound, not merely an operator-norm bound: bounded stencil degree times the uniform block norm supplies it for the actual bare finite-range action. Signed off-diagonal blocks are retained; positivity of an absolute comparison matrix is unnecessary in this calculation.

Couple two reflected processes by the same Brownian motion, with noise sqrt(2)dB. Write the reflection as -d ell_X, where d ell_X belongs to the outward normal cone at X. The Brownian terms cancel. Since K is a product, each coordinate normal is a normal to K_b. Convexity implies, separately in every block,

    (X_b-Y_b) dot d ell_X,b >=0,
    (X_b-Y_b) dot d ell_Y,b <=0.

Multiplication by w_b^2 preserves these signs, including nonsmooth boundary points via normal cones. The mean Hessian along the segment between X and Y is covered by the same conjugation bound, since that segment stays in K. Consequently, in the finite-variation differential inequality,

    d ||W(X-Y)||^2 <= -m ||W(X-Y)||^2 dt,
    ||W(X_t-Y_t)|| <= exp(-m t/2) ||W(X_0-Y_0)||.

This product argument fails for a general coupled convex cutoff: a diagonal weight need not preserve the normal-cone signs there. It is also invalid to replace the raw free domain by a product over selected dependent outputs.

Define Lip_W f using the metric ||W(x-y)||, equivalently ess sup ||W^-1 grad f|| on the convex domain. The synchronous contraction gives Lip_W P_t f<=exp(-m t/2)Lip_W f by finite differences; differentiation of a reflected stochastic flow is unnecessary. Because w=1 on S, a function supported there has Lip_W f<=Lip f. For g supported on T, with D=dist(S,T),

    ||W grad g|| <= exp(-alpha D) Lip g.

Under the stated reversible Dirichlet-form framework, differentiate int P_t f g dmu and integrate t from0 to infinity. The invariant mean limit gives

    Cov_mu(f,g)=int_0^infinity int grad P_t f dot grad g dmu dt,
    |Cov_mu(f,g)| <= (2/m) exp(-alpha D) Lip f Lip g.

There is no factor2 in the Dirichlet identity for generator Delta-grad H dot grad; the factor2/m comes only from integrating exp(-m t/2). For smooth f,g the derivatives can first be taken for positive times and then passed in the Sobolev form. The required semigroup/invariance/convergence facts remain within the framework gate. Compact-volume diameter constants may appear in establishing convergence, but not in the displayed final gradient integral once that framework is established.

For the current real primitive carriers, Lip Phi_i<=gamma*g0, gamma=(16/3) C_C c_basis. Thus the proposed fixed-history estimate becomes

    |Cov_mu(Phi_p,Phi_q)|
       <= (4 gamma^2/a_soft) g0^2 exp(-alpha dist(S_p,S_q)).

Subtracting fixed-history background constants does not alter this conditional covariance. This route would handle the hard boundary through reflection rather than discard its flux or separately sum absolute surface masses. It gives neither an outer-history covariance bound nor a bound on bad histories. General later-step nonlocal H1 actions, complex reference fields, the original fine observable flow and the physical Rsc claim remain outside its scope. It uses established coupling ideas, with no claim of novelty.

Bibliographic lead, still inventory only: Hiroshi Tanaka, *Stochastic differential equations with reflecting boundary condition in convex regions*, Hiroshima Mathematical Journal9(1),163-177(1979), DOI10.32917/hmj/1206135203. DOI metadata was located through CiNii; the primary Project Euclid article route returned a security service notice on30October2026. The article statement/proof and exact PDF bytes/hash were not obtained. No theorem number, scope, or publication-day precision is asserted from that blocked page. Kolesnikov-Milman arXiv1310.2526v7 remains abstract/metadata read only; no theorem from it is imported. Menz2014 remains as scoped in1472.

Next: close the normal-reflection/Dirichlet-form applicability gate from an accessible primary statement, then consolidate ONE actual first-step conditional theorem with its complete source-history event and scope audit. Do not keep splitting auxiliary inequalities into papers or restart the abandoned unconditional-history shortcut. Falsifiers are a nonproduct actual raw domain, failed physical Hessian margin, lack of uniform block row/column range bounds, or an unsupported reflected-semigroup framework. Until those are closed this is a conditional analytic reduction, with no formal verification or independent review.
