# Candidate raw small-field reconstruction and its source limits

Integrated research continuation, executions1411–1416, 30 October2026. This is a heuristic knowledge note, not a paper, independent referee report or new Lean theorem. All analytic derivations were made by the participating agent. The numerical probe is floating point and its first execution failed; both records are retained. No model grade, physical hRpoly, continuum result or graph-confidence promotion is claimed.

## Source reconstruction and scope

Balaban CMP109(1987),249–301, DOI10.1007/BF01215223, Section2 Eq2.3–2.13, gives the original small-field current-lattice reconstruction

    V_k(W,B)=exp(i[g_k C_lift B-h D_tilde_k(g_k C_lift B)]) V^(k)(W).

Here R=LQ, Rh=I, h is supported on the selected corridor bonds b0(c), and C_lift=(I-hR)iota embeds free coordinates into kerR. C_lift is distinct from the Gaussian covariance C^(k) and its root. Keep the original Haar/Jacobian factors, sharp cutoff, quadratic compensation and previous effective-action remainder. This is only the source small-field branch. A current-lattice plaquette trace is not automatically an original fine observable transported through all previous steps. Both marks, their mixed contribution and any exterior dependence must accompany the full weight; the large-field complement remains necessary.

The norm bounds below refer to the original average in CMP98 Eq42, not its later modified average. CMP95(1984),17–40, Eq1.6–1.8 fixes half-open blocks and descending-coordinate block paths; x(c)=x+L e_mu. All group inverses on reverse links are actual inverses, with factor order preserved. CMP98 Eq208–214 concerns SITE gauge transformations and supplies no bond-remainder constant here. That proposed transfer is rejected. CMP102(1985),277–309, SectionC gives the appropriate bond-valued fixed-point mechanism but does not identify its conveniently chosen H with the sparse unit h without comparison.

Primary anchor: CMP95/CMP98/CMP102 selected pages were inspected in an existing382-page compilation SHA25600cc6b218dcf0e1c2884e135caa1d57b3591df036540b685e7440f30cbd4ff16. The existing54-page CMP109 PDF has SHA2561c2d2e500fd1e6a1a7981fed259cc2354ebcf64e473fd564bfc3f2c4d7dfbe2a. No primary PDF or corpus is included here; page-level reading scope is in SOURCE-READING.json. These are historical primary papers, not new publications discovered today.

## Exact geometry behind the candidate coefficient

For c=(y,y+L e_mu), write x=y+r,0<=r_j<L. The middle straight segment of Gamma_(c,x) uses b0(c) iff all transverse r_j vanish. There are exactly L such paths among L^d. Their prefixes before b0(c) equal the corresponding prefix of P_c even for noncommuting backgrounds. Block paths have both endpoints in one half-open block and never use a selected crossing edge. No other selected coarse-edge column occurs on this carrier. The stipulated at-least-three-block quotient avoids small-period identifications and is not removed by this argument.

Sliding P_c along the block path sweeps L sum_(j!=mu)r_j <=(d-1)L(L-1)<=dL^2 plaquettes; longitudinal translations cancel without faces. Unitary conjugation/telescoping then bounds the loop distance by dL^2 a0. The inverse-loop derivative is m_x Z-Ad_loop Z, not m_x Z-Z away from a flat background. With G_Y the left-trivialized exponential derivative, ||G_Y||<=1, ||G_Y-I||<=y and ||G_Y^-1-I||<=2y give a log-derivative error6y, an averaged-exponential error at most y and a final-path error2y. This yields the candidate9y coefficient bound below, without commuting the background factors.

## Precise family and raw average

Take d>=2, L>=2, a torus with at least three coarse blocks per coordinate, and independent positively oriented bonds. Half-open L-blocks partition the fine lattice. This excludes small-period edge identifications; no all-volume extension is claimed. Let V0 be unitary and satisfy ||V0(dp)-I||<=a0 on the required two-block plaquette carriers. All norms below are matrix operator norms and their field sup norms. Lie-coordinate Euclidean norm conversion in the programme remains separate.

For a positive coarse bond c, Gamma_(c,x) is the source contour consisting of the block path c_- to x, the straight length-L segment to x(c), and the translated block path back to c_+. Let P_c be the straight coarse path. For U(A)_b=exp(i A_b)V0_b on positive bonds, extend reversed links by the **actual group inverse**, not an assumed ordinary antisymmetry of the left fluctuation. The original source average is

    M(U)_c = exp(i Y_c(U)) U(P_c),
    Y_c(U) = L^(-d) sum_(x in B(c_-)) (-i)Log(U(Gamma_(c,x)) U(P_c)^(-1)).

Define Qtilde_c(A)=-i Log(M(U(A))_c M(V0)_c^(-1)), R=DQtilde(0), and N(A)=Qtilde(A)-RA. This is the original raw average; no modified-averaging coefficient is substituted.

The loop Gamma_(c,x) P_c^(-1) bounds a strip with at most d L^2 elementary plaquettes: slide the coarse path along the at-most d(L-1) edges of the block path, costing at most L faces per edge. Products of unitary conjugates of plaquette holonomies therefore give

    ||loop_x(V0)-I|| <= d L^2 a0,
    y := max_x ||Y_x(V0)|| <= 2 d L^2 a0

when d L^2 a0<=1/2, by the convergent matrix-log series. The nondegenerate block geometry above permits this strip to be lifted without extra winding.

## Selected-bond coefficient and the sparse right inverse

Put alpha=L^(1-d). The selected bond b0(c) is the straight-path bond crossing the two endpoint blocks. Block paths do not cross it. Exactly L of the L^d translated straight paths pass through it; their prefixes up to this bond coincide with the corresponding prefix of P_c. For a variation at b0(c), write Z=i Ad_(V0(prefix)) A. Its norm equals ||A||.

Let m_x be1 for these L paths and0 for the others. At the unitary background the left-trivialized loop derivative is

    u_x = m_x Z - Ad_(loop_x) Z.

For a Hermitian Y with ||Y||<=y, the left-trivialized exponential derivative G_Y is an average of unitary conjugations. Hence ||G_Y||<=1, ||G_Y-I||<=y and, if y<=1/2, ||G_Y^(-1)||<=2 and ||G_Y^(-1)-I||<=2y. Also ||Ad_(exp(iY))-I||<=2y.

Thus u_x differs from (m_x-1)Z by at most2y||Z||. Applying G_(Y_x)^(-1) gives an error at most6y||Z|| in the log derivative. Averaging gives -(1-alpha)Z plus that error. Applying G_(Y_average) costs at most another y||Z||. The final U(P_c) factor contributes Z with error at most2y||Z||. Consequently the selected coefficient a_c of R satisfies

    ||a_c-alpha Ad_(V0(prefix))|| <= 9y.

If

    a0 <= alpha/(36 d L^2),

then y<=alpha/18 and a Neumann inversion gives ||a_c^(-1)||<=2/alpha. On the stated coarse geometry no other independent selected corridor bond is inside this carrier. Therefore the source sparse h, supported at b0(c) with coefficient a_c^(-1), obeys Rh=I and

    ||h||_(sup->sup) <= M := 2 L^(d-1).

This is a real-unitary-background estimate with complex tangent directions. It is not a bound for arbitrary complex background fields. The strip/counting and coefficient comparison above are specific points requiring adversarial checking before promotion.

## A conservative complex fluctuation radius

Let m=2(d+1)L bound the length of every loop word above, and set rho=1/(72m). For ||A||<=rho, a product/inverse word differs from its unitary-background value by at most exp(m||A||)-1<=2m||A||. Since the background loop distance is at most1/36, every inner log remains in the matrix-log ball of radius1/4. The log-series difference bound is at most twice the argument difference. Hence

    ||Y_c(U(A))-Y_c(V0)|| <= 4m||A||,
    ||exp(iY_c(U(A)))-exp(iY_c(V0))|| <= 8m||A||.

The straight path has norm at most exp(L||A||)<2 and differs by at most2L||A||. Therefore

    ||M(U(A))_c M(V0)_c^(-1)-I|| <= 18m||A|| <= 1/4,
    ||Qtilde(A)|| <= 36m||A|| <= 1/2.

All logarithms are now on a fixed analytic branch. One-variable Cauchy estimates along an arbitrary unit field direction give

    ||R|| <= 1/(2rho),
    ||N(A)|| <= K ||A||^2,  K=rho^(-2),  for ||A||<=rho/2.

The second inequality sums the Taylor terms of order>=2, bounded by (1/2)(r/rho)^2/(1-r/rho). No dimension/volume-dependent coordinate sum is used.

## Unit-h contraction and the original cutoff

Choose

    eps <= min(rho/6, 1/(36KM)).

For ||Bbar||<=eps and ||X||<=eps/M, the map X -> N(Bbar-hX) stays in that X-ball because its norm is at most4K eps^2<=eps/(9M). Cauchy differentiation on a field increment circle of norm eps, around arguments of norm at most2eps, gives Lipschitz constant at most9KM eps<=1/4. The circle stays inside the quadratic-bound domain since3eps<=rho/2. The zero-start fixed point D_tilde is analytic on this domain and ||D_tilde(Bbar)||<=4K||Bbar||^2. This reproduces the source fixed-point mechanism with a budget for the actual sparse h, not the unrelated site H'.

With the free-coordinate embedding iota, C_lift=(I-hR)iota satisfies

    ||C_lift|| <= C_C := 1+M/(2rho).

On the chosen constraint branch, the change B'_old=Bbar-hD_tilde(Bbar) changes only selected coordinates. After Bbar=g_k C_lift B, its free coordinates are exactly g_k B. Thus the **original** source cutoff on free logarithmic coordinates implies ||Bbar||<=eps/2 if its threshold eps1 satisfies eps1<=eps/(2 C_C). This budget is independent of volume and positive g_k. It does not cover cutoff-expanded individual terms where upper cutoffs have been removed, or prove absence of other constraint branches outside the chosen small-field chart.

For complex ||Bbar||<=eps, ||B'_old||<=eps+4KM eps^2<2eps. The current-lattice plaquette holonomy and its inverse then have norm at most exp(8eps). The holomorphic normalized trace continuation (Tr P+Tr P^(-1))/(2Nc) is bounded by exp(8eps). This is a primitive marked-insertion bound in the stated fluctuation chart, not a complete marked G/H activity estimate.


## Background dictionary and a sufficient parameter choice

Fix d,L, a compact matrix group G subset U(Nc), the nondegenerate quotient geometry of1413, and the original averaging. Assume the REAL saddle exists in the declared small-field source domain; this note does not construct it. Repeated averaging stays in the compact group and its plaquette norm is gauge invariant.

Here is a conservative way to avoid losing lattice-scale factors. If the original fine configuration has curvature at most epsilon0 eta^2, eta=L^-n, then at a partial averaging level j<=n apply Proposition2 with its effective parameter alpha0=epsilon0(L^j eta)^2. Indeed its input bound alpha0 L^-2j is exactly epsilon0 eta^2. For epsilon0 below the source Proposition2 admissibility constant c2, alpha0<=epsilon0<=c2. The resulting curvature is at most2epsilon0(L^j eta)^2<=2epsilon0. Lattice relabeling does not change a dimensionless plaquette holonomy. This deliberately retains the weaker bound2epsilon0; no unverified extra factor L^-2 is required in matching the current-lattice V^(k).

Consequently, on the source's real small-field saddle family and its required local carriers, it suffices to choose

    epsilon0 <= min(c2, alpha/(72 d L^2), other source existence thresholds),
    alpha = L^(1-d).

Then |V^(k)(dp)-I| <= 2epsilon0 <= alpha/(36dL^2), the curvature hypothesis of the candidate raw sparse-h estimate. Source c2 and the other existence thresholds are positive but have not been numerically evaluated here. The bound is uniform in volume and j for fixed d,L,Nc, subject to the source's domain and geometry. It says nothing about all Gibbs configurations, arbitrary complex saddles, boundary carriers outside the assumed domain, or uniformity as L or Nc changes.

This removes the need to postulate a second independent small real-background plaquette condition INSIDE this specified original-average small-field family: it follows from the literature condition plus the displayed choice. It does not discharge a programme RawM3 field, prove membership of the actual physical family, or eliminate the large-field branch.

## Original fixed cutoff versus the nonlinear coordinate change

Use R=D Qtilde(0)=LQ and the actual selected sparse h. The source changes B'_old=Bbar-h D_tilde(Bbar), then Bbar=g_k C_lift B, with C_lift=(I-hR)iota. Since h has support ONLY at selected bonds, all free coordinates satisfy exactly

    (B'_old)_free=(Bbar)_free=g_k B_free.

Thus the source fixed-threshold cutoff is, after these changes, exactly |g_k B_free(b)|<epsilon1 on free bonds. It is not a Gaussian bound |B(b)|<epsilon1, and it must not be imposed on the selected coordinates independently. The linear lift then gives |Bbar|<=C_C epsilon1, C_C=1+M/(2rho), on the same local small-field branch. With the1413 constants

    m=2(d+1)L, rho=1/(72m), K=rho^-2, M=2L^(d-1),
    epsilon <= min(rho/6,1/(36KM)),
    epsilon1 <= epsilon/(2 C_C),

the original fixed cutoff indeed places Bbar in the half-radius |Bbar|<=epsilon/2, uniformly in positive g_k and volume. This is a sufficient, very restrictive parameter choice permitted by the source's fixed-threshold option. It is not a theorem that any preselected epsilon1 in an implementation already satisfies it. Additional source thresholds must be intersected, not discarded.

The existence argument remains on the local branch obtained from the zero-start constraint fixed point. The characteristic function itself is not holomorphic, and this calculation does not extend cutoff-expanded terms, where the upper cutoff has been removed, to the same complex ball. When using Cauchy bounds, apply them to the holomorphic reconstruction on its declared complex extension, with the real cutoff only providing a bound for the real integration domain. Do not differentiate the sharp cutoff as if it were holomorphic.

## Norm matching: a concrete complex-direction pitfall

CMP98 Eq19 uses matrix operator norm. Its double-bar Hilbert norm comes from an UNNORMALIZED matrix trace; CMP109's normalized trace in the action is a different convention. If coordinates a_j use a Hilbert–Schmidt orthonormal basis T_j, then

    |sum a_j T_j|_op <= ||a||_2,
    ||a||_2=|A|_HS <= sqrt(Nc)|A|_op.

These inequalities hold for complex coefficients too. For an arbitrary fixed basis replace the upper and lower factors by the singular-value constants of its Gram matrix; these depend on the basis and fixed group, not volume. A programme field norm needs an explicit such dictionary before importing any candidate radius or Lipschitz constant. This note does not assert that an abstract field type already supplies it.

The1415 SU2 test used unnormalized Pauli matrices. For REAL a, |a dot sigma|_op=||a||_2. That equality is false for complex directions: sigma_x+i sigma_y=[[0,2],[0,0]] has operator norm2 and coefficient Euclidean norm sqrt(2). Thus extending the real-test norm equality to the complex chart loses a factor sqrt(2). The valid complex upper estimate is |a dot sigma|_op<=sqrt(2)||a||_2, with ||a||_2=|A|_HS/sqrt(2)<=|A|_op for this2x2 basis. The real numerical test never sampled complex directions and therefore supplies no check of this missing conversion. The1413 matrix-op-norm proof is unchanged; any coordinate-norm restatement must carry these constants.


## Finite falsifier and preserved failure

The [own run archive](RAW-CONTOUR1415.zip) contains the frozen scripts/plan, all72 row records from four SU2 cases (d2, coarseperiod3, L2/3, flat/noncommuting backgrounds), actual dossier, both run manifests, logs and capsule. It contains no primary-source body or PDF. All four cases passed the declared floating-point controls; this failed to falsify the coefficient calculation only on those cases. It is not interval arithmetic, a general theorem, a physical-family match or independent review. The independent centered difference of one wrapped column had maximum error9.05e-12; it is an internal numerical check, not an independent model assessment.

The first run failed on numpy.bool_ JSON serialization after its first case; its missing output and full stderr are retained. The second converted those boolean values to native bool and used a separate output filename. It changed no case, seed, formula, step or tolerance. Do not exclude the failed run or reinterpret an implementation error as a mathematical counterexample. This finite numerical lane is closed; no extra seed/dimension scan is proposed.

Capsule fingerprint71896f795b007b476b2d592646c0938467cd642756abfbaf433b818ebb1227de binds BOTH runs. Its readiness is BLOCKED, dossier attention: the failed first execution and missing output remain visible. The existing verifier checked both run fingerprints and13 content-addressed existing artifacts. Its artifact-plan count does not mean the failed output exists. Metadata verification is not mathematical validation or release readiness.

To inspect the conserved capsule, extract the archive's .run-ledger/raw-unit1415 directory at the root of this repository, then run `node scripts/verify-research-capsule.mjs --capsule-file .run-ledger/raw-unit1415/CAPSULE1415.json --artifact-root .`. Existing-file hashes verify; the capsule remains blocked. Preserve original CRLF bytes inside the archive because hashes refer to them. Before the repository-wide format check, move this extracted, ignored run directory aside intact; never normalize frozen bytes or weaken the checker. The original command paths require Python3.12.6 and NumPy2.2.6 as recorded in the result. A replay with another environment is a new execution and needs a new manifest; do not overwrite the conserved output. The recorder's automatic Lean toolchain metadata describes the repository and does not mean Lean executed the Python probe.

## Confidence and abandonment conditions

- literature: selected original-source constructions, cutoff convention, norms and curvature propagation, not full source-proof audits.
- heuristic: participating-agent quantitative component proof and finite numerical falsifier; not independently reviewed or Lean-certified.
- formal: no new formal result; historical c454 verification remains fixed to its exact source scope.
- speculative: application to actual marked G/H activities and the physical remainder.

Falsify this match if the real source background is not the repeated ORIGINAL average, its curvature/carriers fail, the chosen cutoff exceeds the sufficient chart radius without another estimate, or the physical field norm lacks the explicit conversion constants. Abandon any producer erasing either mark, exterior dependence, nonlinear correction, scale dictionary or large-field complement. Actual source activity weights, complex-background continuation, root-tail localization, cutoff-expanded terms, original fine-observable flow, physical Rsc/hRpoly, uniform physical decay and continuum conclusions remain open. No new source/candidate count, paper or review is warranted.

Observed programme HEAD1545066253520178ff3680e1f7297e9790ccd908 adds nonlinear-tangent files beyond the historical c454 anchor. They were inventoried by commit/changed-path metadata only, not statement/proof or kernel audited here. Never inherit the historical8466-job result for these additions. The raw-constraint files used above were unchanged in that comparison; no closed binder/Hodge audit is repeated.
