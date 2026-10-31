# One bare first-step conditional covariance dossier

30 October2026. Consolidation of the existing working manuscript, not a new paper or new independent review. The theorem below is an analytic candidate conditional on the enumerated physical-source identifications. It does not discharge the formal RawM3/Rsc frontier. The current public formal-research HEAD was inventoried as5442be3c004c20d3ee7f95ac7f8d16e9ff501d3c; no proof/build claim is made for that HEAD. The generated knowledge context still names an older inspected commit and is historical.

## Exact object and quantifier order

Fix d=4, source block/averaging choices L,M, gauge and real Lie-coordinate norms, strict analytic/constraint-Jacobian margins, and a uniform original-source real saddle regularity/coercivity class. Constants may depend on these fixed choices. They must not depend on finite lattice volume, the two mark locations/separation, a history within the admitted class, or interpolation t in[0,1]. No all-scale statement is made.

For a first-step physical history h use its actual constrained real saddle U, J=J(U), exponential gauge fixing, and independent raw free bond coordinates A. The retained density is the original inside conditional density, including its actual local Haar and constraint Jacobian, with designated constrained bonds eliminated only as outputs. It is normalized only inside that fixed history:

    mu_(h,t)(dA)=Z_(h,t)^-1 1_(K_h)(A) exp(-H_(h,t)(A)) dA.

The two observables are the real normalized traces Phi_p,Phi_q of the actual primitive reconstructed plaquettes. Their complete raw input carriers S_p,S_q include every constraint-lift input needed by those marks. Neither these primitives nor this conditional measure is identified with the fully transported fine observable across arbitrary later histories.

## Admitted event G and source dictionary

G is a set of histories determined BEFORE sampling the inner A. To admit h, require every condition below to hold for the entire retained K_h and t in[0,1], not merely at a sampled field or the saddle.

1. The full mark carriers and all action/constraint stencils used by the estimates lie in the retained free sector and avoid the changed reconstruction bonds S1-star where the current local dictionary requires separation. Source CMP119 printed251-253 identifies retained chiLambda and boundary reconstruction; its buffer radii alone do not imply a mark is deep in that sector.
2. K_h is exactly a product of convex norm balls in DISTINCT independent raw bond blocks; repeated same-threshold cutoff tests are deduplicated. No ball is imposed as an independent coordinate on a selected eliminated bond. Source CMP119 printed249-250 underlies this dictionary. The original threshold is r_cut=delta_cut/g0, with its original convention retained; the earlier source A0/A1 prefactor discrepancy is not silently repaired.
3. On the SAME physical constrained tangent/gauge class, Q_Lambda=C_lift* Delta1 C_lift restricted to the actual free inside subset has Q_Lambda>=a_soft I. The manuscript's hard-to-soft bridge derives a_soft from the original physical hard-gauge gap and real gauge decomposition. That bridge is a participating-agent derivation; the original hard-gap/source regularity hypotheses remain external inputs. A delta-gauge covariance is not substituted for the soft one; the J-curvature term is retained.
4. There is one fixed compact strict physical chart for every complete stencil of the bare first-step action, constraint map and Jacobian. Define epsilon_h as the supremum, over t and all A in K_h, of the norms of ALL physical inputs entering those stencils, including exterior inputs and reconstructed coefficients required by the derivative bounds. Require

       C_H epsilon_h + C_J g0^2 <= a_soft/2.

   This is the explicit physical event. Bounds only on the inside raw cutoffs do not suffice. If a checked dictionary gives an interior bound eta_in(g0) and an exterior-history bound eta_out(h), both must imply the displayed bound, with all lift/norm constants retained. No unproved replacement epsilon_h=g0 log^p(g0^-2) is allowed when exterior values are merely bounded by a fixed chart radius.
5. On that chart the bare action's local third derivatives and local log-Jacobian second derivatives have fixed maxima, bounded overlap and a fixed raw interaction range R_H. The manuscript's mean-value/Schur calculation then gives Hess_A H>=m I, m=a_soft/2. The same local block maxima and degree bound give BOTH block row and column norm sums <=B_H. These are bounds for the actual bare density; later H1-reconstructed actions may be nonlocal and are excluded.
6. The primitive raw-carrier differential calculation holds uniformly: Lip Phi_i<=gamma*g0 with gamma=(16/3)C_C c_basis. Fixed-history background centering does not change covariance. Complex independent U,J references are excluded.

Conditions1-3 and6 are source identifications/earlier analytic deductions with stated scope, not independently audited source theorems in this dossier. Condition4 is an explicit restricted event, not a proof that every original physical history belongs to it. Condition5 is the local finite-stencil consequence after those identifications. There is no new hypothesis called 'mixing' that restates the desired conclusion.

## Conditional analytic conclusion

Assume this dictionary and event. Set alpha=log(1+m/(2B_H))/R_H for positive B_H,R_H. The weighted synchronous reflection argument yields

    |Cov_(mu_h,t)(Phi_p,Phi_q)|
       <=C_cond g0^2 exp(-alpha dist(S_p,S_q)),
    C_cond=4 gamma^2/a_soft.

The source-independent finite-dimensional mechanism is fully specified in1473-1474: W_b=exp(-alpha dist(b,S_p)); its conjugation error is <=B_H(exp(alpha R_H)-1)<=m/2. Product normal cones preserve the weighted reflection sign. Synchronous contraction is exp(-mt/2), and the reversible gradient form integrates it to2/m. Existence-domain inball constants can depend on finite volume but do not enter this estimate. No global lower bound on Z, surface-flux deletion or absolute off-diagonal comparison positivity is used.

Literature prerequisites have been statement-read, not full-proof audited: Slominski1993 Theorem5 with its(A),(B), and Ambrosio-Savare-Zambotti author PDF Theorem1.2 plus adjacent convex-domain reflection identification. Exact source hashes and URLs are in LITERATURE1474.json / FRAMEWORK1474.md. Tanaka1979 remains inventory only because its primary route was inaccessible. Menz2014 comparison-matrix theorem is not imported from a signed precision gap. These are old methods, not2026 discoveries.

## What survives averaging and why a rare bad set is insufficient

At t=1 suppose the actual positive physical history law pi has been identified and already includes the inside normalizing factor exactly once. Let a_h=E_(mu_h)Phi_p, b_h=E_(mu_h)Phi_q, k_h=Cov_(mu_h)(Phi_p,Phi_q), and delta=pi(G-complement). The exact physical identity, WHEN the observable/history dictionary is valid, is

    Cov_phys(Phi_p,Phi_q)=E_pi k_h+Cov_pi(a_h,b_h).

Real unitary normalized traces lie in[-1,1], so |k_h|<=1 by Cauchy-Schwarz and variance<=1. Consequently the conditional contribution satisfies

    |E_pi k_h|
       <=(1-delta) C_cond g0^2 exp(-alpha D) + delta,

provided the SAME physical carrier distance D and constants work throughout G. If supports/distances depend on h, keep the expectation of exp(-alpha D_h) instead of replacing it by a deterministic D. The identity does not permit silently pulling a varying geometry out of the average.

Even delta=0 leaves Cov_pi(a_h,b_h). Thus a small bad-history probability alone cannot establish the target spatial decay. To obtain an exponential global bound at distance D, one needs actual distance-sensitive control of the complement contribution AND the outer covariance, or a signed joint cancellation/cluster theorem that controls their combined expression without destroying locality. No such estimate is supplied here. The existing mixture obstruction is retained rather than duplicated as a new case.

## Decision and next finite work

The conditional argument removes a separately assumed conditional spatial-mixing estimate on the stated uniformly convex bare class. It does not remove original hard-gap regularity, the full exterior margin event, the original observable/history identification, or the outer connected estimate. Its payoff is a reduction of the remaining calculation to an explicit physical event and the outer law, with the target distance still present.

Next: inspect the actual CMP119 first-step outer reconstruction/R operation for the law pi and transported conditional means, to decide whether its positive history representation satisfies the exact observable identity and whether it retains a distance-sensitive connected mechanism. Do not open an arbitrary new route or repeatedly refine the conditional constant. Prepare a single knowledge-tree synthesis of the source dictionary, reflection reduction and negative outer-history conclusion after that source check. No separate manuscript/PDF/review/grade is justified by these supporting estimates.

Falsifiers: an actual coupled raw cutoff, failed complete-stencil Hessian margin, nonuniform block row/column bound, unproved observable equality, or loss of the distance under history averaging invalidates the corresponding inference. Evidence levels: literature for selected primary statements and source passages; heuristic for this participating-agent physical dictionary/application; speculative for unresolved outer transport; formal: no new verified declaration. No independent assessment or peer review is claimed.
