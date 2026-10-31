# Audit 1547: fixed first-retained-integral admission packet

Date: 2026-10-31. One unscored mathematical and source-specific audit. The reviewed object is the immutable packet identified by INPUT-MANIFEST1547.json, not a manuscript or PDF.

## Disposition

The packet supports a **conditional near-identity, bare-first-step admission argument**, including a direct flat soft gap and a perturbation estimate on the entire declared original free cutoff. The finite path geometry and selected-coordinate locality needed for that argument agree with the original definitions inspected here. Those deductions do not require a volume-dependent compactness argument, a hard-axial precision in place of the soft precision, or a negative power of the coupling in the Hessian error.

The packet is **not correct as a completely specified arbitrary-tag Gaussian construction**. The patch-factor expansion in 1542 is generally nonsymmetric after tagging, even when the original precision is symmetric. Invertibility, proximity to a positive covariance, and an accretive inverse do not suffice to interpret that tagged matrix as a Gaussian covariance with the determinant and compensator used in 1544. Section 6 gives the exact obstruction and a repair within this audit. The physical endpoint, the untagged inverse estimates, and the actual Gaussian conditioning identity are not refuted.

A second necessary specification is the localized real reference in the last Gaussian majorant: the reference must have the same finite column support as the localized term. The physical all-tags-one reference generally does not. The original source explicitly switches to zero exterior tags. Section 7 supplies that choice and derives the repaired finite Gaussian bound. The input notes remain unchanged, and both objections are preserved.

These repairs establish finite operator/Gaussian subgates under the stated gap, chart and compatible-geometry hypotheses. They do **not** identify the new interpolation with every original projected source propagator, prove the connected activity sum, resolve the printed cutoff-prefactor discrepancy, or admit an earlier unindexed old action. There is no score, all-scale conclusion, or claim of scientific independence.

## 1. Provenance, immutable scope, and method

Requested configuration: `gpt-6-astra`, reasoning effort `xhigh`. Actual runtime model and effort: **unverified**. The assignment names that requested configuration, but no runtime attestation was available. A separate assigned review context is observed; scientific independence is unverified. The parent authored the new notes and scope guide. This is one audit with no restart, model substitution initiated by this reviewer, or delegated review.

All 15 inputs and all five cached source PDFs matched their manifest SHA256 values and byte lengths before substantive reading. INPUT-MANIFEST1547.json itself has SHA256 `ec7ed6a84c0ff8c4047f2fb1ebd81a6dcc39241a5eef2ba16660894f3ed4bf7a` and 7160 bytes. The final manifest records the complete file-level binding and the end-of-audit recheck.

The complete new notes read were FLAT-GAP1533, FULL-CUTOFF1534, SOURCE-ORDERING1535, LOCAL-INDICATOR1536, CLUSTER-TAIL1537, ANALYTIC-SPACE1538, BARE-FIRST1539, GAUSSIAN-LOCAL1540, INTERPOLATION-GATE1541, BUFFERED-WALKS1542, PROTECTED-ROOT1543, CONDITIONING1544, and SOURCE-ANCHORS1546. ADMISSION-PACKET1545 was read as the unreviewed scope guide. REVIEW1524-context was read completely as adverse historical context only. Its older target was not reassessed, its conditional acceptance was not inherited, and its findings were not converted into approval of these new notes.

Only the assigned review directory was written. Cached PDFs and all inputs were read-only. The PDF skill was used for selected source extraction and visual inspection. Page images and a rendering helper are confined to `review/review-tmp`; they are not final deliverables. No corpus was copied, no web statistics or AIRR submission was made, no credentials or paid service was used, and no Lean run or repository build was performed. One small exact rational matrix calculation was used to verify the new obstruction's arithmetic; it is not a lattice numerical certificate.

The manifest's statement that no other reviews were running is supplied parent provenance, not a session-wide observation independently verified here. Earlier reports and parent numerical checks outside these 15 inputs are not additional reviewed evidence.

## 2. Actual source reading scope

The following are the existing cached files in the input manifest. A selected equation or theorem statement being read is not an independent audit of its full proof.

| Cached source | Text read in this audit | Page images inspected | Principal use |
|---|---|---|---|
| `balaban-rg-I-cmp109-1104116842.pdf`, CMP109, 249-301, DOI 10.1007/BF01215223 | Printed 252-254, 261-263, 265-270, 276-280 | Printed 253, 254, 267; PDF pages 5, 6, 19 | Contours/averages, soft gauge, selected bond and right inverse, bare/old-E split, four analytic-space conditions and parameter ratios |
| `balaban-convergent-cmp119-from-fusion.pdf`, CMP119, 243-285, DOI 10.1007/BF01217741 | Printed 246-250, 253-257, 259 | Printed 246, 247, 249, 250, 253, 256; PDF pages 4, 5, 7, 8, 11, 14 | Actual first density, original cutoff, selected elimination, simultaneous covariance, local indicators, law discrepancy, determining geometry and normalization |
| `cmp102_variational/1104114383.pdf`, CMP102, 277-309, DOI 10.1007/BF01229381 | Printed 277-279, 288, 305-309 | Printed 278, 279, 288, 307, 308; PDF pages 2, 3, 12, 31, 32 | Mixed input condition (7), Theorem 1, kernel integration weights, Proposition 9 and Eq190 |
| `balaban-rg-II-cmp116-1104161193.pdf`, CMP116, 1-22, DOI 10.1007/BF01239022 | Printed 1-5 and 9-21 | Printed/PDF pages 13, 15, 17, 18, 19, 20, 21 | Distinct-domain tags, polydisc, square-root representation, conditioning/compensator, zero-tag reference, tail and activity restrictions |
| `balabanfusion.pdf`, multi-article container | CMP99, 389-434, printed 414-416; CMP96, 223-250, printed 230-231 | CMP99 printed 414, 416 = fusion PDF 192, 194; CMP96 printed 231 = fusion PDF 339 | Actual buffered commutator/generalized-walk mechanism, and source distance Eq2.46 |

CMP99 here is the propagator article, DOI 10.1007/BF01240355, not the different gauge-fixing article at CMP99, 75-102. CMP96 is *Propagators and Renormalization Transformations for Lattice Gauge Theories II*; its bibliographic identification for this audit is the actual printed volume/pages and Eq2.46 in the hashed fusion file. The fusion container has no single article DOI applicable to all of its pages.

The fusion file was searched in memory for the selected formulas. Incidental hits at fusion pages 8, 113 and 205 were displayed during that search; they are not a claimed audit of those other arguments. Rendered but uninspected pages are not counted as visually reviewed.

Additional real literature dependencies remain beyond Eq190: the existence/uniqueness and regularity theorem for the mixed determining problem; applicability of the earlier constructions to CMP109's symmetric group averaging; the local/global minimum comparison used in CMP119 Eq1.19; and, if imported, the entire source analytic-space/cluster theorem with its hypotheses and constants. None of these full source proofs was reproduced. CMP102 p308 explicitly omits the lengthy calculation behind Eq189 before stating Eq190; that dependence remains explicit rather than being redescribed as independently proved.

## 3. Flat contour gap and finite selected maps

### 3.1 Actual average and selected coefficient

CMP109 Eq0.3 defines shortest coordinate-permutation paths inside a centered block. Eq0.8 gives the arithmetic mean as the linearization of the group mean. Consequently Eq0.11 has as its flat derivative the positive average of those root-to-site path sums. In Eq0.12 the reference coarse segment occurs negatively inside the logarithm and positively in the final multiplication by its transport. The weights sum to one, so these two derivatives cancel exactly. The remaining derivative is the positive average of the paths from one block root to its neighbor through a translated coarse segment.

For an oriented coarse bond in coordinate direction 1, the selected fine edge is the central interface edge. The translated segment uses it exactly when all transverse coordinates of its starting site vanish. There are L choices of the longitudinal coordinate. Endpoint contours remain inside their blocks and cannot use that interface edge. Thus the derivative of the **physical group average** with respect to that selected edge is `L^(1-d) I`. If the source writes the physical derivative as `L Q`, the coefficient in Q is `L^-d I`. CMP109 p267 explicitly has `L Q h = I`. The distinction in 1546 is correct; numerical constants cannot interchange these normalizations.

A path for that coarse bond uses no other selected interface bond. This remains a structural statement about the nonlinear input paths, not only their flat derivative. Each selected equation is therefore a finite local equation in its own selected variable and free/background inputs in the two endpoint blocks. It is not a coupled nonlinear solve over all selected variables in the volume.

The inverse of the flat selected coefficient is fixed and finite at fixed L and group. Complexifying the actual finite local averages and logarithms and applying the finite-dimensional implicit-function theorem gives a common smaller joint chart over finitely many orientation prototypes. It also gives finite derivative and inverse bounds there. Haar densities and the relevant selected determinant are nonzero on a sufficiently small chart. For real absolute determinants one fixes the flat sign component and continues `log(sign_flat det)` analytically; one does not complexify an absolute-value operation.

CMP119 p249 verifies that the selected correction changes no free output. Its derivative has identity free rows and a finite selected block for each coarse bond. Its determinant reduces to the product of those selected blocks, even though Eq1.14 writes a full `Tr log`. Linear delta elimination contributes its separate background-only factor. The source's free cutoff does not become a restriction on all reconstructed selected outputs.

### 3.2 The local Stokes proof supplies the gap

Write the flat soft Hessian form, in matched trace/Lie norms, as

`q(B) = c_W ||dB||_2^2 + kappa_G ||G B||_2^2`, subject to `Q B = 0`.

Both constants are positive: this follows by expanding the actual Wilson Eq0.2 and exponential gauge Eq0.14/CMP119 Eq1.7. The current term in CMP119 Eq1.16 vanishes at the identity. Factor-of-two Hessian conventions belong in `c_W,kappa_G`; no uncomputed numerical value is asserted.

Set `lambda=GB`, with zero values at block roots, and `B'=B-d lambda`. Root-to-site telescoping gives `G d lambda=lambda`, root-to-root telescoping gives `Q d lambda=0`, and `dB'=dB`. An internal edge is the average of the closed root-to-endpoint loops in 1533. An interface edge is obtained by subtracting the averaged coarse path, whose integral is zero by the actual block constraint. The resulting closed loops lie in one block or a rectangular two-block lift.

Such loops have finite plaquette fillings. Choosing a filling for each of the finitely many local path/edge types defines `B'=E_L dB` without using an inverse or a gap assumption. Both row and column sums of the absolute filling coefficients are bounded uniformly in volume: rows use a fixed patch, and only a bounded number of translated edge patches can contain a given plaquette. Consistent periodic push-forward preserves this bound. The nondegenerate lifted-patch convention is necessary; this is not a statement about arbitrary collapsed one-block geometries.

Schur's inequality and the nearest-neighbor incidence estimate give exactly the mechanism in 1533:

`||B||_2^2 <= 2 R_L S_L ||dB||_2^2 + 8d ||GB||_2^2`.

Thus `a_flat = min(c_W/(2 max(1,R_L S_L)), kappa_G/(8d)) > 0` is a volume-uniform soft gap. The free variables are a coordinate projection of `B=C_flat a`, so `||a||<=||B||`; the same lower bound applies to the actual free precision. No upper bound for the lift is needed for this lower-bound step. Upper row/column constants for the lift are separately finite by the selected-map locality.

**Classification:** proved conditional on the stated fixed-L cubical partition/periodic-lift convention and the actual source definitions just checked. Enumeration of numerical filling constants is unnecessary for this existence result, but no numerical gap certificate has been produced. This is a soft, block-pinned gap; neither the gauge term nor the block-average constraint can be deleted.

## 4. Entire original cutoff, complete density, and real admission

### 4.1 A concrete complete local extension

The local density premise can be made more explicit than the phrase “complete f/j dictionary.” Let `R_U(x)` denote the reconstructed relative fine-link field, with free logarithmic inputs x and selected outputs obtained by the finite constraint solve. Its constraint is that the coarse group average of `R_U(x) U` equals that of U. Uniqueness on the strict chart identifies this solve with the source's linear lift followed by selected nonlinear correction.

For the Wilson term use the full action of `R_U(x)U`, with its background baseline separated. For the gauge term use the relative averaged contour

`M({(R_U(x)U)(Gamma)}) M({U(Gamma)})^-1`

at each original root/site pair. On the original averaged-axial representative the second factor is the identity, so this is the actual source gauge term. Under simultaneous vertex gauge transformation the ratio transforms by conjugation at its root. This is a local covariant extension of that same term, not the absolute gauge functional evaluated on an unrelated Landau representative. CMP109 p266 explicitly uses the corresponding relative averaged-contour variable; CMP119 Eq1.17 gives the simultaneous covariance.

Use the original Haar coordinate density and selected-constraint Jacobian, with their signs and baseline factors. Equivalently, direct finite delta elimination produces the inverse selected derivative determinant, factored into the same finite blocks; the source factors split this into linear elimination and nonlinear correction. On the physical branch these are the original density, not extra factors appended to it. Differentiating the complete reconstructed action automatically includes the current/constraint-curvature contribution `-2 <h C^(2)(A),J_1>` of CMP119 Eq1.16. Removing that term separately would be wrong.

These constructions give locally

`H_g(A,U) = g^-2 sum_X f_X(g A,U) + sum_X j_X(g A,U) + constant(U,g)`.

There are finitely many carrier prototypes, finite background carriers, and bounded overlap. The real functions have analytic complexifications on a fixed smaller chart: for example normalized `Re tr V` on the unitary group extends as `tr(V+V^-1)/2`, not by conjugating independent complex coordinates. This explicit local extension supplies the finite-chart argument near the identity; it does not establish the much larger source inductive analytic space.

The full-integral gauge change at fixed background is a blockwise adjoint rotation of free raw coordinates. It preserves Lebesgue measure and the original adjoint-invariant product cutoff. The selected solve intertwines by uniqueness, and all contour/frame arguments transform together. Hessian lower bounds, block norm sums and finite ranges therefore transfer between the two representatives. This uses the inspected simultaneous covariance; it neither revives the original-gauge tangent rejected in REVIEW1524 nor reassesses that older report's scalar theorem.

### 4.2 Hessian estimate and coupling powers

On the full free product `||g A_b||_* <= delta_0`, selected outputs are controlled by the finite reconstruction derivatives. The physical cutoff must be small relative to that reconstruction chart; its potentially large fixed-L constants are included in the derivative bounds. At `x=0,U=I`, the action Hessian is the flat soft precision of Section 3.

Finite third derivatives of the actual local action and finite second derivatives of the logarithmic terms give both block row and column estimates

`||Hess_A H_g - Q_flat||_(row,col) <= C_f(r+delta_0) + C_j g^2`,

where r is the local background logarithm radius in the chosen frames. The two raw derivatives exactly cancel `g^-2` in the action and leave `g^2` in the logarithmic terms. Background-only normalizers have zero raw Hessian. There is no illicit estimate on a fixed raw A ball: the raw radius `delta_0/g` is allowed to grow.

The choices in 1534 make this error at most `a_flat/2`. Thus the entire original domain has a common lower margin, upper block sums, and finite range. This is stronger than a calculation only at A=0. No deleted current, extra selected-output cutoff, or total-volume factor is needed. The result is an existence statement with finite symbolic constants at fixed L/group, not their numerical evaluation.

For the background response, CMP102 Eq66 confirms the input cell weights, and Eq190 contains the reciprocal input volume. They cancel in applying the kernel. CMP96 Eq2.46 confirms the weighted contour distance; at one step it is bounded below by `(D_fine-fixed_padding)_+/L`. Polynomial lattice growth then bounds its exponential row sum uniformly in volume. Integrating the stated response along a sufficiently small coarse link-log path from the identity gives `r <= D_L b`. The original kernel theorem and the source-admissibility range of that path remain literature assumptions; the row-sum and coupling calculation are deductions from them.

### 4.3 Exact law version and indicators

CMP119 p247 really prints `delta_0=g_0 A_1 p_0(g_0)=(A_1/A_0) epsilon_0`, while p246 defines `p_0=A_0 (log g_0^-2)^p` and `epsilon_0=g_0 p_0`. Those two expressions for delta_0 disagree unless an additional convention/change is supplied. This audit does not invent an erratum. The explicitly parameterized law `delta_0=C_delta g_0 ell^p`, with fixed positive C_delta, is well-defined; it is not an identification of both printed formulas or an earlier unspecified E1.

For that fixed law, the Hessian perturbation tends to zero as asserted. The fine/gauge removal ratio is different: `delta_0/epsilon_0=C_delta/A_0` is constant. The sufficient reconstruction/contour budgets of 1535 have the right dependencies; taking g smaller cannot repair a failed ratio. The approximate-background cutoff also needs the actual Eq1.19 comparison, its prefactor, matching norm and protected determining set. The source comparison is still a literature dependency.

CMP119 Eq1.3 assigns the identity to internal block bonds and V(c) to interface bonds; it is not arbitrary zero padding. Eq1.2 uses `M'(Q_1^* V)` and the minimal determining construction. CMP102 condition (7) explicitly averages missing lower-level bonds at interfaces. Therefore the one-scale finite-map argument in 1536 does test the appropriate mixed factors, provided those actual determining domains are used. A bound `4 K_mix,L b` follows without using the output minimum to prove its own input condition.

Theorem 1 then places the minimum in `U_1(B_3 epsilon_in)`, whose fine plaquette bound is `B_3 epsilon_in L^-2`. The L^-2 in the local indicator is essential and is present in 1536. The source's minimal-domain erosion statement on CMP119 p256 also has to be in the same lattice units as the dilations. The supplied `M R_1 > 2 M_1` is a conservative fit for the specified rescaling; it does not by itself replace all domain-separation/partition conditions of the cited variational theorem.

**Classification:** the real finite-map estimates and conditional shrinking neighborhood are supported. Source-law correspondence to an earlier unindexed action, a single fully specified compatible geometric family for every chosen parameter, and full marginal/support/probability admission are not established. A nonempty flat-centered neighborhood for an admissible finite volume is not uniform probability or the whole next marginal. An arbitrarily small fixed torus cannot be kept while a logarithmic collar grows without bound.

## 5. Bare first interaction and untagged Gaussian estimates

CMP109 Eq2.12-2.13 and CMP116 Lemmas 1-2 really separate the bare fluctuation terms from the previous effective-activity difference. At the microscopic bare first step that previous-E expression is absent. The new Haar/selected terms, new Gaussian determinant and new interaction are not absent. The second step, with old E1, is outside this reduction.

At a physically critical background the total leading first derivative vanishes on the constrained free space; CMP119 p250 explicitly says so. Individual carrier first derivatives need not vanish. Taylor's theorem then gives a cubic action remainder bounded by `C delta_0 sum |A_b|^2`. The logarithmic term can have a linear term `g ell[A]`; Young's inequality produces the necessary local constant `C g^2/delta_0` per degree of freedom. Thus 1539's

`t_0 = C(delta_0 + g^2 + g^2/delta_0)`

is the correct type of bare local domination parameter, and its volume cost cannot be erased.

For an off-shell complex extension, critical cancellation cannot simply be assumed. An explicit admissible local extension for this bare remainder is obtained by subtracting `f_X(U,0)` and `D_x f_X(U,0)x` carrier by carrier before taking the quadratic/cubic decomposition. The total subtracted linear term is zero on the physical critical branch, so the extension agrees there. This supplies the local polynomial bound on a fixed chart. It still is not proof that all source analytic-space conditions and activity norms hold for that extension.

The four conditions recorded in 1538 agree with CMP109 Eq1.11-1.16; especially the independent current and nested reconstructed minima cannot be omitted. The inequalities involving alpha_0, alpha_1, alpha_2 and alpha_3 are genuine extra ratios. The ordering `q_1>q_0>p` pays only the two stated linear ratios. The actual CMP119 statement `q_0,q_1>1` does not itself impose that stronger ordering.

The tail substitution in 1537 is algebraically correct with fixed auxiliary gamma_2 and fixed constants. With `r_chi=c_chi C_delta ell^p`, the negative tail exponent is quadratic in r_chi, while delta_0 is exponentially small in ell. For p>1/2 its sufficient inequalities have a common small-coupling direction. CMP116 pp18-20 retain both the tail-largeness condition and separate interaction-smallness conditions. This scalar check cannot keep D or C_3 fixed if their actual analytic-margin dependence has not been traced. The warning in 1538 is necessary.

For 1540, principal restrictions retain the real flat gap. The finite-propagation spectral series, followed by the polynomial ball-count/Cauchy-Schwarz estimate, genuinely gives uniform weighted row and column bounds. A small fixed complex finite-range perturbation then gives all principal inverses by a convergent Schur-norm series. The conditional mean `-Q_D^-1 Q_(D,Dc) A_Dc` retains the exterior variable. The boundary resolvent identity has the stated minus sign. Trace-log costs are proportional to dimension, not bounded independently of volume.

The two exact generic counterexamples in 1541 are correct. Real convex positivity does not imply the source complex-polydisc inverse, and a spectrally convergent Neumann series need not converge after taking absolute values of every fine-coordinate walk. They do not refute the actual source or lattice. The patch construction in 1542 correctly repairs that particular absolute-convergence issue: its commutator gains `C/m`, both Schur sums are needed, and distinct full-dependence-domain tags cost at most `exp(m_0 kappa(n+1))`. Constants may absorb a fixed overlap enlargement; no factor counting all patches or m^d is required.

The shifted construction can use a common alpha, with bounds `C/(a+t)`, and its integral gives Q^-1/2 at tags one. It does not give `S(s)^2=G(s)` away from one. The two-scale witness proof in 1543 correctly requires the patch diameter to be much smaller than the protected collar. Its restricted row and column estimates sum over all other endpoints and retain a local determinant dimension factor. These operator facts survive the following adverse finding.

## 6. Adverse finding F1: tagging does not preserve covariance symmetry

**Location:** BUFFERED-WALKS1542's tagged `G_0(-K)^n` construction; its use as a “corresponding tagged/comparison root matrix” in PROTECTED-ROOT1543, especially the Gaussian interpretation following the inverse estimate; and CONDITIONING1544 lines 31-38, where same covariance, invertibility, positive real part and determinant branch are presented as the sufficient interpolation dictionary.

The issue is transpose symmetry, not the abandoned square-root identity. The complete inverse of a symmetric precision is symmetric, but individual commutator factors are not. Multiplication by localization-dependent tag weights can destroy cancellations that restore symmetry at all tags one.

Here is the exact algebra. Use the same full enlarged patch domain for the G_i and K_i factors, as is permitted by 1542's tagging rule. At zero tags outside an allowed region, let H be the retained patch family. Put

`G_H = sum_(i in H) chi_i C_Di chi_i`,

`D_H = sum_(i in H) chi_i^2`,

`K_H = sum_(i in H) [Q,chi_i] C_Di chi_i = Q G_H - D_H`.

All these are the actual factors of 1542. The surviving tagged series is

`A_H = G_H (I+K_H)^-1`.

For real symmetric Q and principal inverses, G_H and D_H are symmetric. Direct multiplication, with no limiting argument, gives

`A_H-A_H^t = (I+K_H^t)^-1 [G_H,D_H] (I+K_H)^-1`.

The incomplete partition D_H is generally not constant in the boundary transition. Even a single retained patch has `[chi C_D chi,chi^2]_(xy) = chi(x) C_D(x,y) chi(y) (chi(y)^2-chi(x)^2)`, which need not vanish. Smoothness/smallness of the commutator does not make this expression zero. Complete partition at tags one gives D_H=I and restores symmetry, exactly as it should.

A rational two-coordinate check makes the nonidentity explicit. Take

`Q=[[2,-1/10],[-1/10,2]]`, `chi=diag(1/2,3/4)`, `G=chi Q^-1 chi`, `D=chi^2`, `K=QG-D`.

Then the absolute maximum row sum of K is `31/3192 < 1/100`, but

`G(I+K)^-1 = (1/51083) [[6400,540],[390,14400]]`,

whose skew part has entry `(1,2)=150/51083`. This is an exact local-factor algebra witness, not a claimed enumeration of the Yang-Mills lattice or a counterexample to the source theorem. The preceding commutator identity is the general obstruction in the proposed tagged construction; buffered supports and arbitrarily small commutators do not impose its missing commutation relation.

Nor is covariance normalization repaired merely by proximity to a positive matrix. For

`C=[[1,t],[-t,1]]`, with real nonzero small t,

`Herm(C^-1)=(C^-1+(C^-1)^*)/2=I/(1+t^2)>0`, and C is close to I. Nevertheless the purported density `(2 pi)^-1 det(C)^-1/2 exp(-B^t C^-1 B/2)` integrates to `sqrt(1+t^2)`, not 1. If instead it is normalized as an actual Gaussian, its covariance is `(1+t^2)I`, not C. Thus the displayed moment-generating identity of 1544 does not follow for an arbitrary nonsymmetric matrix meeting just the stated norm/inverse/branch conditions.

If the phrase “complex Gaussian branch” is defined in advance to require a bilinear symmetric covariance, the Gaussian identity itself is correct, but the packet has then not shown that its generic tagged operator belongs to that branch. Complex symmetry of the original Q alone does not prove this. CMP116 p15's discussion of nonsymmetric operators must not be read as a license to use an arbitrary nonsymmetric matrix as a covariance; no error in the source is asserted here.

### Repair R1, verified in this same audit

For every covariance to be used in a Gaussian measure, use the explicitly symmetric tagged representation

`G_sym(s) = (G(s)+G(s)^t)/2`.

Transpose preserves the maximum of weighted row/column norms. It also preserves each factor-dependence domain and its set of distinct tags, after reversing the kernel endpoints. Therefore absolute convergence, holomorphy, exact component localization and the protected row/column bounds all remain valid, with at most the existing constant adjustments. At tags one, `G_sym(1)=Q^-1` for the actual complex-symmetric precision. Its protected root restriction is symmetric and remains epsilon-close to the real reference. The determinant/inverse estimates of 1543 now yield a legitimate normalized complex Gaussian branch. Using this same symmetric C_s in the compensator makes the identity valid for arbitrary Gamma_s. No relation `S(s)^2=G_sym(s)` is required.

There is an even narrower repair for this finite-range bare-first problem. Take the conditional covariance directly as `C_s=Q_D(U)^-1`, independent of exterior tags. Its complete background carrier lies in D enlarged by the fixed background range. Include that enlargement in the protected untagged region. The root conditional covariance then needs no exterior tagging at all; it is already symmetric and local in precisely the relevant external-background sense. Only the full-space square-root factor in Gamma needs the walk localization. This option does not apply automatically to an arbitrary nonlocal multiscale projected precision.

**Classification:** the generic covariance promotion is false without the missing symmetry property; the arbitrary-Gamma Gaussian identity is correct for an actual symmetric complex covariance. R1 repairs the finite construction without changing its physical endpoint or original cutoff. These are explicit additions in this report, not silent revisions of the frozen inputs. The more specific “root principal precision entirely inside the protected region” interpretation of 1544 can implement the second repair directly, but that convention must be stated.

## 7. Adverse specification F2: the localized reference and the exact compensator

### 7.1 The physical endpoint is correct

For a real positive free precision

`Q=[[P,T],[T^t,W]]`, `C=P^-1`, `H=W-T^t C T`, `Sigma=Q^-1`,

the exterior marginal has covariance H^-1=Sigma_EE, and the conditional root has mean `-C T y` and covariance C. Relative to the centered root Gaussian, its density ratio is

`exp[-B^t T y - (T y)^t C(T y)/2]`.

Taking the exterior coordinates of `Sigma^(1/2) X` gives exactly 1544's `Gamma=T projection_E Sigma^(1/2)`. The covariance C is the inverse root **precision** block, not Sigma_DD. The latter is `C+C T H^-1 T^t C`. The determinant identity `det Q=det P det H` is already exhausted by the normalized Gaussian measures; it creates no extra factor multiplying the law. These assertions agree with CMP116 Eq2.5-2.6 and the visually checked Eq2.14.

### 7.2 A full reference cannot give a bound in X_Z alone

CONDITIONING1544 lines 42-54 do not fix the reference tags explicitly. The preceding protected comparison is to all tags one, whereas the claimed majorant charges only `||X_Z||^2`. A full-space `Gamma_0=T projection_E Sigma_0^(1/2)` generally has columns outside any proper finite localization region Z. If Gamma_s has been localized to Z and X is supported outside Z, then Gamma_s X=0 but Gamma_0 X need not vanish. Neither the displayed bilinear difference bound by `C epsilon (||B_D||^2+||X_Z||^2)` for all B,X nor the quadratic difference bound in `||X_Z||^2` follows from a global operator-norm estimate with that reference. Fix a B with nonzero pairing against such an exterior response and scale X: the proposed right-hand side stays fixed while the bilinear left-hand side grows.

This is a missing reference/support specification, not a false physical block-Gaussian identity. The input phrase “reference tags” permits a correct choice, but its necessary choice cannot be replaced by the physical all-tags-one reference. CMP116 p15 explicitly replaces sigma by zero and the background/current by its real reference before the calculation on p17. That is the relevant source anchor.

### Repair R2 and quantitative finite majorant

For each localized expansion region Z, set exterior tags to zero and all other tags to zero as the real comparison convention, while preserving the untagged protected root. Equivalently use a real zero-tag comparison supported within the same allowed region; there is no need for it to be the physical full Gaussian. Set `Gamma_0` from that real tagged square-root representation and the real cross precision. It is real and has columns only in Z. Use R1 for the covariance, or simply `C_0=P_0^-1` and the untagged finite root conditional covariance. The covariance reference is positive by the established protected comparison, or directly by the real principal gap in the second option.

Both the localized s-family and this zero-tag family are close near the protected root to the physical tags-one operator by the witness bound. The triangle inequality gives their mutual `O(exp(-alpha h/2))` difference. Add the `O(rho)` background perturbation and protect the actual cross-precision support. Thus the same epsilon type controls both differences, with a harmless factor two, and **both** Gamma_s and Gamma_0 have columns in Z. This proves the formerly unsupported replacement of global X norms by X_Z norms.

For an actual symmetric C_s with `Re(C_s^-1)>0`,

`integral dnu_Cs(B) exp(-B^t Gamma_s X) = exp(X^t Gamma_s^t C_s Gamma_s X/2)`.

This is the ordinary complex Gaussian integral on the branch continued from the real positive covariance. It holds for any Gamma_s. Arbitrary Gamma does not mean arbitrary nonsymmetric C. Transposes here are bilinear transposes, not conjugate transposes.

After comparison to the real localized pair, the finite majorant in 1544 is valid. If `1/B <= C_0 <= 1/a`, `||Gamma_0||<=G`, and `u<=a/2`, exact integration in B produces

`det(I-u C_0)^-1/2`

and the compensator remainder

`gamma^t[(C_0^-1-u I)^-1-C_0]gamma/2`, where `gamma=Gamma_0 X`.

The inverse difference is bounded by `2u/a^2`, and the determinant by `exp((u/a) dim D)`. Put `v=u(1+2G^2/a^2)`. For `v<=1/2`, the remaining standard Gaussian integral costs at most `exp(v dim Z)`. Coordinates outside Z integrate to one because the reference and perturbation have the specified support. With `u=C(epsilon+t_0)+gamma_2`, this yields

`exp[C(t_0+u)(dim D+dim Z)]`.

This is a local dimension cost, not a volume-independent constant. The bare Young constant, determinant factor, interpolation constants, and fixed excluded-bond absorption all remain charged once. Choose the fixed patch/tag constants and collar first, then the inner complex radius and fixed small gamma_2, and finally the small coupling. No original cutoff is enlarged or reset.

**Classification:** the physical endpoint and Gaussian algebra are proved. The X_Z bounds require R2 or an equivalent explicit localized real reference. With R1 and R2 the finite Gaussian conditioning gate is proved under the stated operator/geometry assumptions. Source Eq2.23-2.25 supports this mechanism; full connected activity estimates and equality of the newly chosen interpolation with the original source interpolation remain unproved.

## 8. Assessment by component and remaining obligations

| Component | Assessment of these exact inputs |
|---|---|
| 1533/1546 flat Q/G, selected coefficient, local fillings, soft free gap | Supported source anchors and a valid conditional volume-uniform deduction; retain L normalization and admissible lifted geometry |
| 1534 actual finite selected maps and full-cutoff Hessian budget | Valid near-identity existence argument for the complete bare density on the declared original product; symbolic fixed-L constants, no numerical certificate |
| 1535 fixed ratio, version index and approximate-background cutoff | Correct conditional estimates; the printed prefactor discrepancy and identification with an earlier law are unresolved |
| 1536 mixed local indicators | Correct finite-map reduction with the actual mixed data; source variational theorem, domain separation and rescaled geometric fit remain required |
| 1537 tail gate | Correct scalar small-coupling direction for fixed constants; not a transfer of the whole activity theorem |
| 1538 analytic spaces | Correct warning/ratio ledger; no completed complex nested/current admission or uniform activity-constant trace |
| 1539 bare-first interaction | Correct on the physical critical branch with the retained logarithmic linear term/local constant; off-shell subtraction must be explicitly chosen; no old-E removal at step two |
| 1540 untagged inverse/mean/determinant locality | Correct conditional operator argument; both Schur norms and ambient polynomial growth are essential |
| 1541 two generic falsifiers | Correct exact counterexamples to the proposed shortcuts; no counterexample to the actual source/lattice |
| 1542 absolute patch and resolvent/square-root representation | Correct as an operator construction under its assumptions; generic tagged covariance symmetry does not follow |
| 1543 protected witness and matrix estimates | Correct operator/determinant estimates; Gaussian use requires R1 and the correct type of root matrix |
| 1544 endpoint/compensator | Correct for symmetric conditional covariance; its generic construction needs R1, and its local dimension majorant needs the R2 reference/support choice |
| 1545 consolidated guide | Useful scope declaration, not additional mathematical evidence or inherited acceptance |
| Full source activity theorem / original maximal next marginal | Not established by this packet or by the finite repairs |

The remaining obligations are concrete:

1. **Bind a particular law before transferring an old action.** Give the exact original C_delta and all matched normalizers, subtractions/counterterms and old E for that domain. A parameterized existence result cannot select a favorable convention for an earlier unindexed object.
2. **Specify one simultaneous compatible geometric/parameter family.** The flat patches, determining-set erosion, original protected tails, two localization scales, tag cubes and periodic lifts must coexist. Constants are uniform over that admitted family, not over arbitrary torus sizes as g tends to zero.
3. **Retain genuine source theorem assumptions.** Besides Eq190, source variational existence/regularity, the extension to symmetric averages, and Eq1.19 comparison are not fully re-proved here. The near-flat finite chart is derived locally; the full inductive complex space is a different requirement.
4. **Adopt the explicit covariance/reference repairs before using arbitrary tags.** Symmetry is a mathematical condition, not a consequence of the recorded inverse margin. Finite support must apply to the real comparison Gamma as well as the localized term. These changes preserve physical endpoint identities but constitute an amended construction.
5. **Prove the missing activity estimates.** Products and contour derivatives, localization identities for all factors, connected polymer sums, and uniform dependence on shrinking analytic margins are not consequences of a quadratic Gaussian majorant alone. The source's projected multiscale family is not identified merely by a similar commutator mechanism.
6. **Keep later and physical extensions separate.** Step two has old E1 and the full later curvature budget. Exterior histories, removed annuli, outer conditional means, full marginal support/probability, iteration, continuum limits and global mass-gap statements are outside this audit.

No additional negative coupling power or hidden total-volume constant was found in the correctly scoped flat-gap, entire-cutoff perturbation, bare Taylor/Young, or repaired finite Gaussian computations. That finding is limited to these computations; it is not a completeness claim for a source cluster proof or a manuscript.

## 9. Integrity and delivery

The final deliverables are REVIEW1547.md, ASSESSMENT1547.json and SHA256-MANIFEST1547.json in the assigned review directory. The JSON assessment is unscored and records requested versus unverified observed identity, parent participation, exact reviewed scope, source reading scope, adverse findings, repairs and open obligations. The final SHA256 manifest binds the report and assessment, the input manifest, all 15 original inputs and all five cached PDFs. Its own hash is returned separately to avoid a circular self-hash.

All listed inputs and cached sources are rehashed at completion. No altered input is substituted for this review. The preserved REVIEW1524 context remains adverse context only. The original notes are not silently repaired, no older assessment is restarted, and no manuscript/PDF grade is assigned.
