# Mixed score bound on the full first small-field branch

30 October2026. Same supporting manuscript, no new paper, review or grade. This follow-up is outside the1482 audit. The quantitative calculation below is restricted first to the boundary-free FULL retained first-step small-field branch. It does not silently include the extra boundary/background changes of large-field histories.

Inputs retained: the actual first-T inserted measure from1485-1486; the strict real source chart and positive normalized density; the explicit physical Hessian margin giving m>0; the selected-lift/remainder chain from1487; and the source Proposition9 background response, its corrected input-volume convention and original-gauge return from1488-1489. The source Eq190 kernel calculation remains a stated literature input, not independently reproduced. No all-history/all-scale hypothesis is removed here.

## Why the bare raw dependence is local in this unit-step construction

The coarse-bond average in CMP109 Eq0.4 uses contours inside its two endpoint blocks and the paths between those adjacent blocks. Printed267 chooses b0(c) on the corresponding coarse bond/interface and h(c) only on that selected fine bond. A contour inside an endpoint block does not cross another block interface. The translated interblock path crosses this pair's interface, rather than an unrelated coarse-bond interface.

The proposed unit-step carrier deduction is that the nonlinear constraint for c contains its own selected coordinate and finitely many free inputs from those neighboring blocks. This needs a bond-by-bond check of the precise contour convention, including corner/interface assignments. Conditional on that check excluding other selected coordinates, solving the local implicit equation in the strict contraction chart preserves that finite raw input carrier. This is different from the globally decaying H-based linearization used in the older multiscale variational proof.

Under this explicit carrier premise, the selected-coordinate Jacobian is a product of finite Lie-coordinate blocks and its logarithm is a sum of local terms. The original Haar factors are local. The Wilson plaquette terms and averaged within-block gauge terms remain local after finite raw reconstruction. Conditional on these premises the bare first-step negative log density can be grouped into H=sum_X H_X with bounded-size/overlap raw carriers X. Their coefficients can depend nonlocally on the coarse background; locality in raw A is not locality in V. The precise contour/selected-bond placement remains an application obligation; this note does not certify it by assertion.

Primary anchors: CMP109 printed252-254 Eq0.3-0.12 and printed267; CMP119 printed249/253. Exact PDF hashes remain1c2d2e500fd1e6a1a7981fed259cc2354ebcf64e473fd564bfc3f2c4d7dfbe2a and db1deec2f1cfedfc5210b023a4cc07fe9a3363a3b5bf59e4cac8fac871ffac7a. These selected source passages are the dictionary inputs, not a full-proof audit of all earlier results.

## Insert the actual background response into each local term

V(theta) changes one prescribed coarse bond c by a real, dimensionless group-angle direction of norm1, holding the raw A fixed. Let r_b(c) be the norm of the actual ORIGINAL-GAUGE background link tangent from1489, including its endpoint root-contour terms. For each H_X collect its full background/averaging/frame input carrier T_X and define the actual finite input response

    kappa_X(c)=sum_(b in T_X) r_b(c)
                 +local explicit coarse-frame contributions at c.

The last contributions are derivatives of the source's coarse right-trivialized frames where those frames occur explicitly; they cannot be discarded by treating V and U1 as unrelated constants. This kappa is constructed from those actual input derivatives, not postulated as an independent localized-score hypothesis. The1489 source estimate supplies its source-metric tails at the enlarged root-contour carriers, within its admitted class.

Let S_X=-partial_theta H_X, so the actual score is sum_X S_X. In physical raw inputs x=g0*A, each bare action term has the factor g0^-2. One raw derivative contributes a factor g0; a coarse/background derivative is bounded by kappa_X via the actual1487 chain. On the fixed compact strict analytic class, the local physical derivatives and overlaps have uniform finite maxima. Therefore, uniformly throughout the retained cutoff,

    Lip_raw(S_X)<=[C_act/g0+C_J*g0] kappa_X(c)
                 <=C_S/g0 kappa_X(c), 0<g0<=1.

C_S includes the fixed carrier dimension, source averaging/implicit-inverse margins, gauge-path lengths and norm conversions; it is not a numerically extracted source constant. The g0 term comes from the raw derivative of the local logarithmic Jacobian/Haar terms. Background-only normalization pieces can have much larger derivatives, but they are constant in A and disappear from the covariance. Full physical inside inputs must stay in the declared strict chart for these uniform local maxima; in this FULL branch there are no exterior raw inputs. A large-field branch needs its additional exterior and boundary chains checked separately.

The same local chain and unitary trace derivative give

    sup_A|partial_theta O_p(A,V)|<=C_O kappa_p(c),

where kappa_p collects the complete reconstructed plaquette input carrier. This is an angular coarse derivative, not a derivative with respect to an already g1-scaled fluctuation coordinate.

## The coupling cancellation in the normalized mean response

On the previously derived, unreviewed conditional convex class, and subject to the local carrier premise above, the raw covariance estimate applied termwise to the actual score gives

    |Cov_mu(O_p,S_X)|
       <=(2/m)(gamma*g0)(C_S/g0) kappa_X(c)
                    exp[-alpha dist_raw(S_p,X)].

The g0 factors CANCEL. Using the exact derivative identity from1486 yields the explicit two-kernel bound

    |partial_theta a_p(V)|
       <=C_O kappa_p(c)
          +(2 gamma C_S/m) sum_X
              exp[-alpha dist_raw(S_p,X)] kappa_X(c).

Both p and the perturbed coarse bond c remain in this expression. No uniform lower bound on a global partition function is inserted, and no large background-only score constant is mistakenly charged as g0^-2.

In the fixed single-step class the normalized source background tangent has a bounded amplitude, and the local-term overlap is bounded. The sum of exp(-alpha dist_raw(S_p,X)) has a volume-independent polynomial-growth bound on the periodic raw bond lattice. Hence the displayed expression supplies a uniform ONE-COARSE-BOND angular response bound in that class. It does not by itself give a volume-independent norm of the gradient over ALL coarse bonds.

For spatial locality retain the convolution as written. Converting it to one exponential in a common metric requires a checked comparison between the source background distance in kappa_X and the raw conditional distance, including root-contour enlargement and scale/family labels. Replacing kappa_X by a constant is allowed for an amplitude bound only; it loses the c-distance and cannot prove spatial decay.

If a subsequent coarse fluctuation is parametrized as V=exp(i g1 B')V_ref, this ONE-BOND estimate gains a factor g1 by chain rule. It does not authorize treating the nonlocal effective insertion as a finite-carrier function at the next scale or iterating the theorem for later H1 actions.

## Decision and remaining target

The mixed score calculation is now tied to explicit candidate action/Jacobian carriers and background/lift chains. Subject to the unresolved precise carrier check and the retained analytic/convex hypotheses, the boundary-free first-step mean-response calculation avoids a spurious negative coupling power. The physical outer-history covariance, bad histories, later effective actions and a global mass-gap statement remain open.

Next finite task: check the precise unit-step selected-coordinate/Jacobian carriers first, then the ONE-STEP source/raw distance comparison for this explicit convolution. Then check which parts survive the actual retained boundary history before any iteration. Do not make a separate paper for this chain or call the source kernel proof audited. Falsifiers are a contour reaching an unrelated selected interface, a nonlocal raw Jacobian missed by the selected-coordinate argument, a failed physical chart/mixed derivative margin, or a wrong source/raw metric identification.

Levels: literature for the selected source coordinate/background facts; heuristic for this participating-agent local-chain and conditional mean-response calculation; speculative for its complete metric/boundary transport and physical connected decay; formal:none new. No novelty, independent review or grade.
