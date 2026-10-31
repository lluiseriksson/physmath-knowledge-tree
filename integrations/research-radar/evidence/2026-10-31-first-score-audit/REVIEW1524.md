# Technical audit 1524: first retained normalized mean and its coarse response

Date: 2026-10-31. One unscored source-specific audit of the immutable eight-note chain 1485-1492. No manuscript, next-law covariance theorem, numerical certificate or all-scale claim is assessed.

## Disposition

**The original-gauge derivation in the eight notes is not correct as written.** AXIAL-TANGENT1489 identifies the relative Landau representative from CMP102 Proposition 9 with an element of the original prescribed-average fiber. That identification is false in the cited construction. Its proposed gauge transformation fixed at the coarse roots therefore does not, in general, return the specified background `U1(V)`. Consequently its displayed tangent is not established as the derivative of that background, and the original-gauge interpretation of the subsequent score bounds is not justified by that argument.

**The requested scalar estimate nevertheless has a valid conditional repair on precisely the boundary-free FULL first branch.** It uses simultaneous gauge covariance of the entire retained integral, including the selected-coordinate chart, its Jacobians, the actual plaquette insertion and the ORIGINAL cutoff `chi^(0)`. This is proved below from the inspected source identities and the finite-coordinate construction. The repaired argument differentiates a gauge-covariant extension of that same normalized integral along the relative Landau background. It does not assert the incorrect original-gauge tangent. With the common real-source, strict analytic and positive Hessian margins explicitly admitted in the question, and accepting Proposition 9/Eq190 as a stated literature input, it yields

`|partial_(theta_c) a_p(V)| <= C_L exp[-lambda Dfine(p,c)]`

uniformly in the source-admissible finite volumes, at fixed odd `L > 11`, `d = 4`, with no negative power of `g0` introduced by the response calculation. This is a repaired conditional scalar conclusion, not approval of every identity in 1485-1492. It is not a proof that the admitted physical class has uniform margins, is nonempty, has appreciable probability, or covers the original full ensemble.

The repair matters: gauge invariance of a trace alone would not suffice. The full-product cutoff, absence of exterior raw coordinates, and simultaneous transformation of all background/frame data are what allow it here. A partial-history fixed-exterior problem does not inherit this argument without additional work.

## 1. Provenance, configuration and boundaries of this review

Requested configuration: `gpt-6-astra`, reasoning effort `xhigh`. Actual runtime model and reasoning effort: **unverified**; no direct runtime attestation was available. A separately assigned review context is observed, but scientific independence is **unverified**. The inputs were parent-authored according to supplied provenance. A separate context and a requested model are not certification of independence or peer review.

The manifest was the first file read. Its SHA256 is exactly the supplied value, `917cb9c1b7d2b7bfb66e8450b8ffdd35276f9bd9229c986c7ae8c6d2cac64c24`. All eight copied notes, the one context report and the four existing primary PDF files matched their listed byte counts and SHA256 values before review. No input, primary PDF, manuscript, repository, root state or other chat was edited. No subagent, build, Lean run, numerical integer checker, publication or numerical grade was used. This was one review, with no restart or regrading.

CONTEXT-REVIEW1516.md was read as a prior conditional analytic result. Its reflection argument was not repeated. Its product-domain, full Euclidean Lipschitz, Hessian, finite-range, row/column-sum and common-constant requirements remain in force. Its square-dimensional SDE specification F1 can be retained as recorded there. The ambient finite torus distance used here avoids the disconnected-distance issue F2; a constant observable is handled separately by zero covariance.

Historical corrections are preserved: 1489 already corrects 1488's input factor to `(L^j' eta)^(-d)` with its integration weight; 1491 already addresses the carrier premise left open in 1490. Neither is counted as a newly discovered error. The new adverse finding below is the different gauge-fiber issue in 1489.

The parent independently reported inspecting the same explicit fiber warning after this reviewer communicated the gauge concern. That corroboration was not needed for the finding: this review read the source text and images itself. It does not increase the claim of scientific independence.

## 2. Exact data and actual source-reading depth

All paths in this section identify the existing read-only files. Temporary text extraction and page renders were confined to `C:/Trabajo/airr/2026-10-31_execution1524/review-tmp`; they are not deliverables and must not enter the durable/public review packet. Extracting a PDF is not a claim to have read all its pages.

### Immutable review inputs

The review directory is `C:/Trabajo/airr/2026-10-31_execution1524/review`. Every following note and the context report was read completely.

| File | Bytes | SHA256 |
|---|---:|---|
| INPUT-MANIFEST1524.json | 6333 | `917cb9c1b7d2b7bfb66e8450b8ffdd35276f9bd9229c986c7ae8c6d2cac64c24` |
| FIRST-T-INSERTION1485.md | 6655 | `79d9d285ef63623d62a56995dfc3f334915af99b0a2ef3a05f8de98e2d0d6faf` |
| FIRST-T-SCORE1486.md | 6435 | `261223c0145c44f4b10e2a75c19a9a6708d753e9de0067071b8d35aee18c9015` |
| LIFT-RESPONSE1487.md | 5535 | `13e21c1fd12b9dc6b9b1cc5232c4af04b806b108e186cd6a64255938314f07d8` |
| BACKGROUND-RESPONSE1488.md | 6912 | `3784d21bb6bd5174320d53a56012d1e07fe8afd9b1ca99717758dc84250d465b` |
| AXIAL-TANGENT1489.md | 6675 | `ac514a73bacc4896e08261c1be2296e5eb2af9265acf1284cf90e0607416e64d` |
| MIXED-SCORE1490.md | 8778 | `fecf8752af2c18387b95f4fc15d35860f6cc8087851f8ce3bda4010adc80837d` |
| CARRIERS1491.md | 5019 | `3ba15e0f9ebba72952f18de5c06d0eb73cad285eeaabdead7d732b6527fe62a4` |
| METRIC1492.md | 5790 | `577c4b717f966d56da36e1298a0752e9dc41394ff9297ff45505b3b98fc54521` |
| CONTEXT-REVIEW1516.md | 19156 | `04ffc7f9ecdf52e6eeadf419f355d78c1c5015a1f434f4c58889c4d94dc2665a` |

### Frozen primary files

1. `C:/Users/lluis/Documents/CodexYangMillsAutopilot/runtime/sources/primary/balaban-rg-I-cmp109-1104116842.pdf`: 5490078 bytes, 54 PDF pages, SHA256 `1c2d2e500fd1e6a1a7981fed259cc2354ebcf64e473fd564bfc3f2c4d7dfbe2a`. CMP109 (1987), 249-301; supplied DOI `10.1007/BF01215223`. Text read: printed 251-254, 260-268, 274-275. Images inspected: printed 253, 254, 267, corresponding to one-based PDF pages 5, 6, 19. Focus: averaging contours and equivariance, the actual selected right inverse, linearization and the distinction from later effective actions.

2. `C:/Users/lluis/Documents/CodexYangMillsAutopilot/runtime/sources/primary/cmp102_variational/1104114383.pdf`: 3355501 bytes, 34 PDF pages, SHA256 `838056b5c578f81d058deb3d394c66d934690e3b94c6cf2956534ec6d211b541`. CMP102 (1985), 277-309; supplied DOI `10.1007/BF01229381`. Text read: printed 277-282, 287-289, 297, 305-309. Images inspected: printed 281, 288, 307, 308, PDF pages 5, 12, 31, 32. Focus: the determining data and gauge conditions, Theorem 1, Proposition 2, Eq66, Eq179-190 and Proposition 9. The extra PDF page is not treated as part of the 33-page article.

3. `C:/Users/lluis/Documents/CodexYangMillsAutopilot/runtime/sources/primary/balaban-convergent-cmp119-from-fusion.pdf`: 4172827 bytes, 43 PDF pages, SHA256 `db1deec2f1cfedfc5210b023a4cc07fe9a3363a3b5bf59e4cac8fac871ffac7a`. CMP119 (1988), 243-285; supplied DOI `10.1007/BF01217741`. Text read: printed 248-253; printed 247 read in its page image as well. Images inspected: printed 247, 248, 249, 250, 253, PDF pages 5, 6, 7, 8, 11. Focus: the genuine background, elimination, old versus new cutoffs, covariance Eq1.17, boundary changes and the FIRST line of Eq1.26.

4. `C:/Users/lluis/Documents/CodexYangMillsAutopilot/runtime/sources/primary/balabanfusion.pdf`: 35847780 bytes, 382 PDF pages, SHA256 `00cc6b218dcf0e1c2884e135caa1d57b3591df036540b685e7440f30cbd4ff16`. This is a multi-article container; a DOI supplied for it is not a DOI for every contained article. Read CMP96 (1984), 223-250, *Propagators and Renormalization Transformations for Lattice Gauge Theories. II*, printed 223, 230-231 in text and images (fusion PDF 331, 338-339). The essential Eq2.46 was visually checked.

To resolve the gauge dictionary, additional sections inside that SAME immutable fusion file were inspected. These were not new downloads or new source files:

- CMP99 (1985), 75-102, *Spaces of Regular Gauge Field Configurations on a Lattice and Gauge Fixing Conditions*, specifically the relative/axial/Landau definitions and Eq1.13-1.38 on printed 78-83, with preceding short text from 77. Images inspected: printed 80-82, fusion PDF 218-220. This is CMP102 reference [6], not CMP99 (1985), 389-434, the separate propagator paper [5].
- CMP98 (1985), 17-52, *Averaging Operations for Lattice Gauge Theories*, selected text on printed 27-31, 33-35 and a short 43-44 excerpt; images on printed 27-28, 30-31, 33 (fusion PDF 305-306, 308-309, 311). Focus: the non-root-fixed inverse transformation Eq60-63, Eq78-92 and Eq104-106, not a full audit of its averaging proofs.

The primary proofs were not audited in full. In particular CMP102 explicitly omits the lengthy second-derivative kernel derivation leading to Eq189. Eq189/Eq190 and Proposition 9 are used at statement level as literature inputs, not independently reproduced kernel estimates. CMP109's asserted applicability of the earlier constructions to its admissible symmetric averaging conventions is likewise retained as a source-level input; no new proof of all those earlier modifications is claimed.

## 3. Material adverse finding F1: the proposed original-gauge return is wrong

1489 puts `W_theta = exp(i eta Hcal(B(theta))) U0` and says it lies on the required critical gauge orbit with the prescribed averages. It then sets the return transformation to the averaged root contour of `W_theta`, with `g_theta(y)=I` at coarse roots, and identifies `W_theta^g_theta` with `U1(V(theta))`.

There are two different notions of gauge orbit here. The original prescribed-average fiber is invariant under vertex transformations fixed at its determining roots (CMP102 Eq3-4; CMP99 Eq1.13-1.14). The construction of the relative Landau representative instead normalizes **averages** of the transformation: `overline(R0 u^j)=I` on `Lambda_j` (CMP102 printed 281; CMP99 Eq1.29). This is not the condition `u(y)=I`. CMP99 printed 80 explains why the pointwise condition was replaced; printed 81 explicitly states that the Landau image is not contained in the original prescribed-average fiber. The constraints on that image are the modified averages in Eq1.30-1.32.

This remains relevant for the full first step. Absence of a boundary removes the boundary correction in the input `B` of Eq1.31; it does not turn the average normalization of the Landau gauge transformation into pointwise root normalization. CMP98 Eq62 gives the one-step root value of the inverse transformation as an exponential of a block average of relative contour logarithms. That value is generally nonidentity. The multiscale formula Eq87 makes the same distinction. These formulas were visually inspected.

The root-fixed averaged-contour transformation in 1489 is a legitimate way to impose the specified absolute averaged axial conditions on a given configuration in its **root-fixed** orbit. The covariance formula for its averaged contour and its endpoint differentiation are themselves correct. But it preserves the coarse average already possessed by `W_theta`. If that average differs from `V(theta)` by the coarse-root gauge induced by the Landau construction, this transformation cannot restore `V(theta)`. Uniqueness within the correct prescribed-average fiber cannot identify a representative that has not been shown to belong to that fiber.

Consequences:

- The three-term link derivative displayed in 1489 is the derivative of the constructed root-fixed return, not a proved derivative of the source's original `U1(V(theta))`.
- The missing terms are the nontrivial coarse-root return and its derivative, together with the matching relative-to-absolute axial convention. They are not remedied by the already corrected input-cell weight.
- Calling `r_b(c)` the actual ORIGINAL-GAUGE tangent in 1490, and using 1489 alone to supply it, is unsupported. If “preserved prescribed data” is promoted to an admission precisely to force this equality, it is a new compatibility assumption replacing the failed deduction. It is not a result of Proposition 9, and would evade the stated source-specific task.
- This finding does not disprove exponential decay for the actual background or the normalized mean. The source's inverse gauge formula is local within a fixed first-step block, so a properly matched return is a possible remedy. This review does not declare that complete symmetric original-gauge return derived. The different, fully explicit scalar remedy in Section 5 suffices for the requested FULL-branch scalar target.

## 4. Source/application checks that survive

### 4.1 Actual insertion and the original fixed raw domain

CMP119 Eq1.12-1.16 supports the reconstruction of the microscopic field as

`U_b(A,V) = exp(i [B-h D(B)]_b) U1_b(V),  B = g0 C A`,

with free coordinates excluding the selected `b0(c)`. The observable is the real normalized trace of the complete reconstructed plaquette, with inverse group links for reverse orientations. It is not the background-only trace. On the FULL branch there are no Eq1.22 boundary coordinate changes to compose. Thus the relevant part of 1485 correctly identifies the actual observable and its joint inserted coefficients.

The older `chi'_0` is not a background-independent raw cutoff. CMP119 printed 250 explicitly singles it out as the exception to simultaneous covariance and replaces it. The FIRST line of Eq1.26 instead contains `chi^(0)(Lambda1)`, originating in Eq1.18. Its small-field conditions are suprema of norms of individual FREE raw `A(b)` over overlapping cubes, with the selected coordinates excluded by the star convention. On the boundary-free full branch all these conditions are upper small-field tests. Repeated tests merely repeat one-coordinate norm restrictions. Their intersection is a product of the corresponding Lie-algebra norm balls (with the source thresholds, in this case `g0^-1 delta0`). The boundaries have Lebesgue measure zero. The balls are compact and convex with interior in the independent coordinates. Their norms are invariant under real adjoint transformations.

This establishes the domain/product premise for this particular full retained integral; it does not establish that premise for all history fibers. It does not change the cutoff, replace it by a smoother cutoff or remove the cutoff's boundary. The thresholds are fixed in the coarse-field derivative because `g0` and the history are fixed. Raw integration by parts would still have boundary terms; the accepted reflection theorem, not an illicit boundary-free IBP, is used.

### 4.2 The fixed-raw score identity

For the first Lebesgue integral in Eq1.26, the exponent and the `C* Delta1 C` dependence in 1486 are correct. In the full case the exterior cross term is absent; it has the correct coefficient in the general first-line expression. All argument derivatives of `C`, the physical `Delta1/J`, and the nonlinear/Haar Jacobians must be retained. A parameter-dependent Gaussian normalization is avoided by staying in these raw Lebesgue coordinates. A remaining elimination determinant or vacuum factor depending only on the background can be left in the exponent: its derivative is constant in `A` and cancels from a covariance.

On a strict smooth real neighborhood of the unchanged cutoff,

`partial_theta E_mu O = E_mu(partial_theta O) + Cov_mu(O, partial_theta F)`

follows by differentiating numerator and denominator at finite volume. Compactness and positivity justify this local operation; they do not themselves give a volume-uniform constant. The joint cumulant formula in 1486 is algebraically correct as well, but it is not needed for this one-mark audit. No exterior/history boundary differentiation is included.

### 4.3 Selected lift, correction and carrier structure

CMP109 printed 267 has the normalization `L Q h = I`, with `h` supported on the one selected interface link for each coarse bond. Distinguishing this averaging `Q` from the free precision, the differentiated identities in 1487 are correct:

`C_dot = -L h Q_dot C`, `h_dot = -L h Q_dot h`.

They follow from `Q C=0`, `P C=I`, a fixed selected subspace and uniqueness of the inverse on that subspace. No Gaussian covariance is substituted for a constrained-background response. For `D=N(B-hD)`, the sign and terms of

`(I+N_x h) D_dot = (partial_theta N)(B-hD) + N_x(B_dot-h_dot D)`

are also correct. `B_dot=g0 C_dot A` and `R_dot=B_dot-h_dot D-hD_dot` retain the full chain. The inverse bound `4/3` is valid when the explicitly admitted operator norm is at most `1/4`. Finite mixed derivatives follow on a common strict local chart with a common inverse margin; bare analyticity without such a margin would not supply them.

1491's geometric repair to 1490 is supported by the actual source definitions, not just its reported finite checker. The root contours in CMP109 Eq0.3-0.4 remain inside an endpoint block. A translated coarse segment changes only its longitudinal coordinate and crosses only the relevant interface. The reference coarse-axis path in the logarithmic average crosses the same selected interface. No other selected interface variable is encountered. The averaged-contour version Eq0.11-0.12 has the same finite carrier. Odd `L` gives a well-defined centered block partition; the source-admissible periodic partition and distinct geometric bonds must be respected.

Thus each nonlinear selected equation has the form `F_c(s_c,a_c)`, not a coupled system in all `s_c'`. Solving it in the admitted unique strict chart gives finite reconstruction carriers. The Jacobian of the identity-plus-selected-row transformation reduces to its selected submatrix; that submatrix is block diagonal over independent coarse bonds. Its determinant factors into finite Lie-coordinate blocks. Haar densities are per-link factors. The background-dependent determinant from linear delta elimination is independent of raw `A`. These observations justify a finite-carrier logarithmic Jacobian, rather than an unexamined extensive log determinant.

Bare Wilson and within-block gauge terms, after this reconstruction, therefore have finite raw carriers, bounded cardinalities, bounded geometric diameters and bounded overlap at fixed `L`. Background and physical `J(U)` inputs to each coefficient have finite enlarged carriers too. Two raw derivatives of a bare `g0^-2` action term supply `g0^2`; logarithmic density terms supply `g0^2` as well. Consequently common local physical derivative bounds yield common raw Hessian block sums, with no negative coupling power. The positive lower Hessian margin is a separate admission, not a consequence of finite range. These facts do not establish finite raw range after the source's boundary corrections or for later effective actions.

### 4.4 Background response and normalization

The constrained minimizer, not a free covariance inverse, is the relevant background map. CMP102 Eq179-184 contains the `Delta^(2)` correction and the nonlinear action Hessian; 1488 reproduces Eq184 with the correct sign and operator placement. Eq182 adds the nonlinear reconstruction derivative. These equations do not identify the response with `H0` alone.

The visually read Eq190 has an input inverse cell-volume factor `(L^j' eta)^(-d)` and, for the zeroth output component, `(L^j eta)^(-1)`. CMP102 Eq66 explicitly exhibits the coarse input weights in kernel composition. Thus with `mu_c=(L^j' eta)^d`, a single coordinate perturbation gives `mu_c K_H(b,c)X`, and the input inverse volume cancels. For `B(c)=theta X`, `||X||=1`,

`||partial_theta Hcal_b|| <= C (L^j eta)^(-1) exp[-b d_source(y,y')], b=delta0/8`.

The physical link tangent of `exp(i eta Hcal) U0` has the extra `eta` factor. At the base point `Hcal=0` this is immediate, and the real unitary exponential derivative has the same bound away from zero. In the full one-step case the defining input is the dimensionless `B=log(V V0^-1)/i`; no cross-region boundary correction of Eq1.31 is present. No factor `g0` or `g1` belongs to this angular input. A later parametrization by `exp(i g1 B')` contributes `g1` by chain rule.

The historical weight correction is therefore valid. It does not fix the separate gauge error. The source restrictions, common regularity constants and the unproved-in-this-review kernel theorem must remain attached to this Landau response estimate.

## 5. Explicit FULL-integral repair of the scalar response

This section is a deduction supplied by this audit, not a claim that 1489 already contains it. It implements the full-pullback alternative contemplated in 1488, using the special full branch to remove its exterior-coordinate obstruction. It establishes the scalar estimate without proving a false identity for the original-gauge tangent.

### 5.1 The covariant extension is the same normalized integral

Let `U` denote a background in the real gauge orbit of an admitted first-step minimum. Define `widehat F(A,U)` and `O_p(A,U)` by the source's same relative fluctuation, selected elimination and bare density formulas. When `U=U1(V)` in its specified gauge, this is exactly the FIRST integral in Eq1.26 and its actual inserted plaquette. Denote its normalized mean by `widehat a_p(U)`. This extends the formula to gauge-related backgrounds; it does not introduce another cutoff or another observable.

For a real vertex gauge transformation `u`, let `R_free(u)` act on each independent positively oriented raw bond by the corresponding adjoint action at its initial vertex. This is a block-diagonal orthogonal linear map for the fixed Euclidean Lie metric, with absolute Lebesgue Jacobian one. It preserves each raw norm ball, hence `K`. It leaves the selected/free index sets unchanged. In the use below, `u` is determined by the background path, not by the integrated fluctuation `A`; there is no field-dependent gauge-change Jacobian hidden in this rotation.

CMP119 Eq1.17 asserts covariance under simultaneous transformation of the background and raw fluctuation. The exclusion there is the OLD `chi'_0`; it is precisely why the source replaces that cutoff by the raw `chi^(0)` in Eq1.18. This replacement is already part of the ORIGINAL integral targeted here.

The selected chart respects this covariance, not just its quadratic part. Averaging equivariance gives an intertwining identity for the linear averaging operator with the fine and coarse adjoint actions. Uniqueness on the fixed selected subspace then gives

`C_(U^u) R_free(u) = R_all(u) C_U`.

The analogous identity holds for `h`, and the equivariance and uniqueness of the strict nonlinear equation give the corresponding identity for `D` and `B-hD`. Thus the reconstructed fine link transforms as a gauge link. Its closed plaquette trace is unchanged. The nonlinear determinant and the Haar factors transform consistently; a background-only prefactor is immaterial after normalization. In particular, this does not freeze `C`, `h`, `D`, `J` or their frames during the change of background.

Consequently, by the explicit change of variables `A'=R_free(u)A`,

`widehat a_p(U^u) = widehat a_p(U)`.

Every background/frame argument must be transformed together. If a formula exposes the coarse average or a right-trivialized coarse frame explicitly, its value on this extension is the one induced by `U`, and on the transformed extension by `U^u`. It is NOT permissible to replace `U1` by `W` while retaining an unrelated fixed coarse frame from the original `V`. CMP119 describes these full bare expressions as functions of `U1`; the consistent extension is obtained from those actual formulas. The induced coarse averages have finite two-block input carriers, so their derivatives below are controlled by the same finite input chain.

### 5.2 Equality along the physical coarse-field path

Fix an admissible `V0` and a one-bond real angular perturbation `V(theta)`. Proposition 9 constructs the relative Landau representative

`W_theta = exp(i eta Hcal(B(theta))) U0`, `U0=U1(V0)`.

It is gauge-related to the physical constrained minimum along the path, even though it need not itself have the original coarse averages. The inverse transformation has nonidentity root values in general; its existence, not an incorrect root normalization, is what is used. The same conclusion holds if another absolute axial representative is chosen afterward. Therefore the exact normalized equality is

`a_p(V(theta)) = widehat a_p(U1(V(theta))) = widehat a_p(W_theta)`.

Differentiate the right-hand integral with its own raw `A` fixed. Its cutoff is still the same `K`. There is no exterior raw variable whose prescribed path has inadvertently changed. The score identity gives

`partial_theta a_p = E_(W_theta)(partial_theta O_p) + Cov_(W_theta)(O_p, partial_theta widehat F)`.

This is an identity for the derivative of the ORIGINAL scalar mean. It is not an assertion that either separate summand equals the corresponding original-gauge summand. A parameter-dependent raw rotation would generate connection terms if one compared those summands individually; the full integral equality already accounts for their combined effect. No derivative, locality or volume-uniform norm of the unknown gauge transformation is needed.

At each fixed parameter, the extension's raw potential and its original-gauge counterpart are related by an orthogonal map acting separately on each raw coordinate block. The Hessian lower bound, block row/column norm bounds, carrier sizes and interaction ranges therefore transfer unchanged. The common strict chart/positivity conditions transfer on this gauge-covariant extension as well. This is not an extra assumed decay bound: it is the source covariance and a finite-dimensional change of variables.

For a derivative at an arbitrary admissible `V`, rebase the Proposition 9 construction there. It suffices to use `B=0` at that base point, with the one-bond input direction. Uniformity follows from the stipulated common source and chart margins, not from choosing a single base point for every volume or configuration.

### 5.3 Local score bounds and the cancellation of the coupling

Use the verified finite carriers to group the bare negative log density as `H=sum_X H_X` plus a raw-independent constant. One may work directly with the reconstructed Wilson/gauge action and logarithmic Jacobians; there is no need to bound a separately renormalized effective action. In physical independent inputs `x=g0 A`, each local term has the form

`H_X(A,U)=g0^-2 f_X(x,U) + j_X(x,U)`

up to a background-only constant and with the finite reconstruction composed into `f_X,j_X`. All dependence of the averaging, lift, selected correction and physical `J(U)` is included in these local functions. The source's fixed first-step scaling factors can be absorbed into constants depending on `L`; no volume factor is absorbed.

Let `kappa_X^W(c)` be the finite sum of the ACTUAL Landau-path link tangents on the complete background inputs of these functions, enlarged for their averaging/frame inputs. This is directly computed/bounded from `partial_theta W` and the finite local maps. No independent localized-score hypothesis is postulated. The corresponding one-plaquette quantity is `kappa_p^W(c)`.

Common strict local analytic and inverse margins give common finite physical first and mixed derivatives. The raw derivative supplies one factor `g0`. Thus, with `S_X=-partial_theta H_X`,

`Lip_raw(S_X) <= (C_act/g0 + C_J g0) kappa_X^W(c) <= (C_S/g0) kappa_X^W(c)`

for `0<g0<=1`. This is a full Euclidean Lipschitz norm on the finite raw carrier, not a per-coordinate bound silently used without its dimension factor. That factor is bounded in terms of fixed `L` and Lie dimension. Similarly,

`Lip_raw(O_p) <= gamma_L g0`,

`sup_A |partial_theta O_p| <= C_O kappa_p^W(c)`.

The first bound follows directly from unitary trace/product differentiation, a finite number of reconstructed links and the strict derivative bounds for their physical reconstruction. The second includes the background and the complete lift/correction derivative. The physical cutoff bounds `x=g0 A`, so the changing lift times `A` does not secretly supply another uncontrolled raw radius: it occurs as a bounded physical input. Background-only large scores drop out of covariance exactly.

Now use the covariance result from CONTEXT-REVIEW1516, with the common admitted positive Hessian margin `m` and its other hypotheses verified or stipulated as above. For the ambient raw metric and a recomputed range `R_H`, put

`alpha = log(1+m/(2 B_H))/R_H`.

Then

`|Cov(O_p,S_X)| <= (2 gamma_L C_S/m) kappa_X^W(c) exp[-alpha dist_raw(S_p,X)]`.

The `g0` and `g0^-1` cancel. The resulting bound is

`|partial_theta a_p| <= C_O kappa_p^W(c) + (2 gamma_L C_S/m) sum_X exp[-alpha dist_raw(S_p,X)] kappa_X^W(c)`.

This is the same useful two-kernel structure as 1490, now with the correct, explicitly justified connection. It does not require a lower bound uniform in volume on the partition function. Nor does it bound the full score by its extensive absolute size. Only its local raw fluctuations enter.

If the admitted Hessian margin or local inverse margins are allowed to deteriorate with `g0`, the displayed cancellation alone cannot prove a coupling-uniform constant. The claim with no negative coupling loss is valid for the common-margin class; the dependence on its margins must be stated. This caveat is already inherent in the requested conditional setting, not a new physical estimate.

## 6. Source/raw distances and the volume-uniform sum

CMP96 Eq2.46, visually checked, defines the source distance by the infimum of contour lengths weighted by `(L^j eta)^(-1)` in the corresponding regions. Its extension to fine sites projects onto block roots. This is not equality with the fine lattice distance and can be zero between different sites in one block.

At the actual first step only `j<=1` appears. Every weight is at least `(L eta)^(-1)`. A contour from the projected roots has physical length at least their periodic ambient `l1` distance. Projecting each of the two fine sites moves it by at most `d(L-1)/2` fine steps. Therefore the lower bound in 1492 is valid:

`d_source(x,z) >= max(0, Dfine(x,z)-d(L-1))/L`.

Restrictions on permissible contours can only increase their infimum. A source nonperiodic chart can also be lower bounded by the smaller periodic ambient distance. Fine bonds, their coarse input endpoints and the actual local input carriers require fixed additive padding. Finite carrier sizes and diameters from Section 4.3 ensure that padding does not depend on volume.

Applying the normalized source Landau bound and the finite local input chain gives

`kappa_X^W(c) <= K_L exp[-nu Dfine(x_X,z_c)]`, `nu=(delta0/8)/L`,

after enlarging `K_L` for the fixed padding, orientations and carrier multiplicities. The direct derivative has the same tail. The incorrect original-gauge `r_b(c)` is not used in this step. If a correctly proved local original-gauge return were used instead, its extra root/endpoint carriers would merely enlarge the padding; it is not proved by 1489 as written.

The raw metric can be the ambient periodic fine-bond distance restricted to the free coordinates. It must not be the shortest-path metric of the graph obtained by deleting selected links. Finite physical carriers give finite `R_H` for the ambient metric; `alpha` must be computed for that range. Using initial-point anchors for bonds gives at worst a pseudometric with finitely many orientations at one anchor; the weighted proof uses the triangle/range estimates and still applies. Equivalently use a genuine bond metric differing by a fixed additive amount and absorb it into the constants. The growth bound is uniformly polynomial on these periodic tori.

The local-term sum is consequently bounded by

`C_L sum_x exp[-alpha Dfine(z_p,x)] exp[-nu Dfine(x,z_c)]`.

For `lambda=min(alpha,nu)/2`, the triangle inequality gives

`exp[-alpha a - nu b] <= exp[-lambda Dfine(z_p,z_c)] exp[-alpha a/2] exp[-nu b/2]`,

where `a=Dfine(z_p,x)`, `b=Dfine(x,z_c)`. The remaining sum is bounded by `sum_x exp[-alpha Dfine(z_p,x)/2]`, times the bounded number of local terms per anchor. Polynomial lattice growth makes it independent of volume. The direct term obeys the same final exponential. This verifies the convolution calculation in 1492; it is not itself a replacement for the required response kernel.

At fixed admissible `L`, `d=4`, and common admitted source, inverse and Hessian margins, this proves the repaired conditional target in the disposition. `C_L` also depends on the group/norm convention, finite carrier data and those margins. It is not asserted uniform as `L` or the number of RG scales changes. The precise `Dfine(p,c)` may be any stated plaquette/coarse-bond anchor convention differing from the complete carriers by this fixed padding.

## 7. What is proved, what is only admitted, and what remains outside scope

| Item | Assessment |
|---|---|
| Actual FULL first plaquette preimage and numerator/denominator normalization | Supported by the selected source formulas and the change-of-variable dictionary. |
| Fixed original `chi^(0)` product domain on that FULL branch | Checked from Eq1.18 and Eq1.26; no substitute cutoff used. |
| Fixed-raw score calculus and cancellation of raw-independent terms | Correct finite-dimensional identities. |
| Selected-lift and nonlinear correction derivatives | Correct with the fixed selected set and common strict inverse margin. |
| Bare action/Jacobian carriers | Supported by source geometry and selected-block determinant reduction; the 1491 correction is honored. |
| Proposition 9/Eq184 response dictionary | Supported at statement/equation level. |
| Corrected input-cell weighting | Verified; already corrected in 1489, not a new finding. |
| Eq189/Eq190 kernel proof | Not reproduced; stated literature input, including the omitted calculation. |
| 1489 root-fixed original-gauge identification | Material false source/application identity; must not be retained as proved. |
| Original-gauge tangent estimate as written in 1489/1490 | Not established by that route. |
| FULL-integral gauge pullback | Verified in this audit using source simultaneous covariance, the actual product cutoff, chart equivariance and absence of exterior coordinates. |
| Mixed-score `g0` cancellation and metric convolution | Correct on the common admitted class, in the repaired consistent connection. |
| Conditional scalar first-mean estimate | Established by the explicit repair above, subject to the stated source kernel and common analytic/convex admissions. |
| Uniform physical Hessian lower margin and nontrivial availability of the class | Not derived here; remain admissions/external application gates. |
| Partial histories, fixed exterior paths and boundary maps | Not covered by the repair. |
| Next-step effective measure/covariance, all-scale iteration or physical mass gap | Not assessed and not established. |

The common Hessian lower margin is substantive. Strictness, a positive Hessian at a single critical point, or compactness of a particular finite-volume parameter set does not alone imply it on the entire ORIGINAL retained raw cutoff uniformly in volume. The declared class must impose the common margin on that actual domain, rather than shrink the integration domain after the fact. Likewise common logarithm/implicit-inverse margins and the source regularity hypotheses are substantive. No numerical certificate for them is supplied or requested in this review.

There is no new arbitrary localized-score assumption in the repaired result: the local score bound comes from the reconstructed bare functions and the actual source Landau response, and its spatial sum from the inspected metric definition. Conversely, merely naming `kappa_X` a localized response would prove nothing without those identifications. The report records which identifications were checked and the one that failed.

A future original-gauge formulation must either supply the complete source inverse return, including its coarse-root factors and the actual symmetric averaging convention, or use the FULL-integral equality explicitly. It must not cite this audit as validating the three-term derivative of 1489 as the original tangent. The repaired proof also must not be used to justify transporting a fixed-exterior fiber by an arbitrary parameter-dependent gauge transformation.

No full physical connected-decay theorem follows: covariance of outer conditional means, excluded histories and their probability, later effective-action hypotheses and the next-scale observable transport remain separate problems. The scope excludes 1493, the evolving manuscript/PDF and prior audits of different chains. There is no numerical grade, novelty claim or formal-verification claim.
