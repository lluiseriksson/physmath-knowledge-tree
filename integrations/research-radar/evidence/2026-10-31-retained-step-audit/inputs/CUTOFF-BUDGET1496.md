# What the second-step Hessian budget must actually scale with

30 October2026; supporting manuscript only. CMP109268–272 Eq2.12–2.14,3.1–3.14 selected statements read. SHA2561c2d2e500fd1e6a1a7981fed259cc2354ebcf64e473fd564bfc3f2c4d7dfbe2a. No complete proof audit. The source's statement269 that P^(k) is bounded by a quadratic polynomial with O(gk) coefficients is not, by itself, a Hessian bound on the expanding raw cutoff box.

The actual fixed source cutoff is |g1 C a|<=epsilon1 (with selected nonlinear reconstruction included). Raw coordinates can therefore be of size epsilon1/g1. The phrase 'the exponent vanishes at g1=0' in2.14 is a fixed-raw statement. It does not imply a perturbation Hessian uniformly O(g1) on that entire g1-dependent box. A cubic scalar example makes the distinction exact: P_g(a)=g*a^3, so P_g''=6g*a reaches6epsilon1 at a=epsilon1/g. It vanishes for fixed a as g->0, but its supremum Hessian on the actual physical cutoff is not O(g). This is a counterexample to that inference only, not to the source action or theorem.

Use physical coarse variables x=g1 C a and retain the source nonlinear constraint reconstruction. Group the actual action/gauge contribution after subtracting its critical constant and Gaussian quadratic as g1^-2 R(x), with R beginning at order3 on the constrained critical chart. In a uniform complex physical neighborhood with bounded third derivatives and finite reconstruction norms,

    ||Hess_raw[g1^-2 R(g1 C a)]|| <= C_action epsilon_phys,

with an analogous weighted-row bound if the third derivative chains have the required exponential carriers. The factors from two raw derivatives cancel g1^-2. This is a physical small-field budget, not a bare small-coupling budget. Nonlinear reconstruction derivatives and the nonzero constrained J terms must be included in R's coefficients; they cannot be treated as an ordinary unconstrained cubic Wilson remainder.

For analytic log Haar/Jacobian contributions J(x), two raw derivatives produce g1^2 times their physical mixed second derivative, with uniform constants only away from singular selected/chart inverses. For the previous action contribution F(x)=E1(U1(V(x)))-E1(U1(V(0))), the same two derivatives give g1^2 Hess_x F, since there is no outer g1^-2 factor. The subtraction affects only its constant; its linear term need not vanish and is not discarded. A uniform per-volume energy bound does not control its Hessian operator; polymer incidence and derivative decay are needed instead.

There is a source-specific regularity obstacle here. CMP1093.10–3.14 substitutes both U'=exp(i xi A)U2 and its CURRENT J', which contains D*D A. Printed272 explicitly explains why a generic propagator estimate does not bound this second-order term and why the J variable/appropriate Landau representation are used. Eq3.14 demands control of A, P A, covariant gradient A and covariant Laplacian A. A Cauchy estimate in U alone, holding J fixed, is not the derivative of the actual composite F. It omits J' and the first/second U1 reconstruction chains.

At the present FIXED k=1,L one can bound a discrete Laplacian by a finite stencil norm O(L^2) in the underlying fine lattice units. Thus a sufficiently smaller complex sup-norm window could enforce the3.14 conditions. This costs fixed-L constants and an explicit source-domain margin; it is not a scale-uniform replacement for the source regularity estimates. The common analytic window must still be checked simultaneously for the reconstructed fields, J and selected inverse over the full retained background class. No such numerical/common window is certified in this note.

The concrete full-density budget to seek is therefore

    ||Hess H_next-Q_soft||_(weighted row/column)
          <= C_R,L epsilon_phys + g1^2(C_J,L+C_E,L),

with the same full source class, valid complex margins, actual J chain and polymer entropy. Relative to1495 choose this small enough to preserve a positive gap (e.g. <=m_G/2 in unweighted operator norm), and allocate the remaining weighted conjugation moment separately. A norm without the exp(alpha Dbc) weight is insufficient for1493's nonlocal-gradient covariance mechanism. The displayed inequality is a target with a derived coupling dictionary, not an established source estimate.

Decision: abandon the claim that coupling alone controls the entire next Hessian on the source cutoff. The cubic action part needs a physical cutoff margin; old E1 and Jacobian terms need actual composite derivative/entropy bounds. Next extract the complex radius and current-chain estimates from the source localization expansion, or explicitly limit the result to a smaller jointly admitted physical window with a proved weighted norm. Do not announce a full next-step convexity theorem until that target inequality is established. No extra paper, review, score or formal promotion.

Falsifiers: ignoring the expanding raw cutoff, dropping J variation, missing reconstruction second derivatives, singular analytic inverses, or uncontrolled polymer incidence. Levels: literature—selected source expansion/current conditions; heuristic—participating-agent coupling dictionary and proposed norm budget; formal—none new; speculative—uniform actual correction constants/iteration/global transport.
