# Unscored technical audit 1501

This is one audit of the six exact notes in INPUT-MANIFEST1501.json, principally FIXED-SECOND-STEP1500.md. All six note hashes and byte counts, and all three source PDF hashes, were verified before review. The notes were not edited. The source PDFs were not changed or downloaded. This is not a manuscript/PDF assessment, a novelty judgment, or an assessment of a global mass-gap claim.

The requested routing is gpt-6-astra with xhigh effort. Neither actual runtime model identity nor actual reasoning effort is independently observable/attested in this review context; both remain unverified. The parent authored the notes. This reviewer received a separate task context and conducted one review, without subagents, retries, or model substitution. Scientific independence is unverified; context separation is not a certificate of scientific independence.

**Disposition: conditionally viable mechanism, with a material full-density dictionary correction required.** The hard-to-soft bridge, complex-kernel/Cauchy argument, star summation, and rooted polymer summation are supportable as fixed-step deductions from the stated literature inputs. I did not find a counterexample to those analytic mechanisms under their actual uniform hypotheses. However, 1497–1499 do not explicitly account for the whole old E1 appearing in source (2.12): there is a coupling counterterm in addition to the localized activity contribution. The prior Gaussian normalization must also be included using the source's aggregated activity convention. The complete density estimate therefore is not justified by the cited calculation as written. These omissions have a relatively small repair at fixed step; they are not evidence that the desired estimate is false.

The literal cutoff description in 1496 is also inaccurate. The actual source cutoff is a product over free bond variables, not a simultaneous equal-radius restriction on all reconstructed bonds. This is a favorable correction for the proposed covariance method, but it must be made explicitly. The first conditional means and the prior reflected-covariance lemma referenced as 1492–1493 were not among the hashed inputs. Their actual gradient estimates and earlier proofs have not been verified here. The resulting mean-transport statement remains an implication conditional on those additional inputs.

**Evidence and scope.** The principal readings were CMP109 printed 254–255 and 264–275; CMP102 printed 305–309, with visual inspection of (190) and Proposition 9; and CMP99 printed 421–429 in the fusion PDF, with visual inspection of printed 428. During this review the parent expressly authorized inspecting related already-held CMP109 pages to resolve the old-action dictionary. CMP109 printed 256–263 establish that dictionary and polymer geometry; printed 250–253 were also read to check the contour/averaging geometry and source parameter conventions. No wider corpus was acquired. Visual checks included CMP109 (1.3), (1.6)–(1.7), (1.18), (2.1), (2.5), (2.9)–(2.12), (3.7)–(3.17), CMP102 (190)/Proposition 9, and CMP99 (3.156)–(3.159).

Page anchors below are printed pages. CMP109 PDF page = printed page minus 248; CMP102 PDF page = printed page minus 276. CMP99 printed 421–429 are fusion PDF pages 199–207. PDF page numbers here are one-based.

**1. The full old-action correction is not just the activity family bounded in 1497–1499.**

The decisive anchors are CMP109 p. 256, (0.22)–(0.23); p. 260, (1.3); p. 261, (1.6)–(1.7); p. 265 immediately after (2.1); and p. 268, (2.12). In the source's explicit convention, at k = 1,

    E1(U) = -beta1(g0) A(U)
            + [log Z^(0)(U) - log Z^(0)(1)]
            + [E_int^(1)(g0,U) - E_int^(1)(g0,1)].

Here E_int^(1) denotes the non-Gaussian integration term in the explicit (1.3) convention; this subscript is introduced in this review to avoid the source's reused E^(1) notation. In the aggregated (1.6) convention one may combine log Z^(0) with E_int^(1) into an activity function, say mathcal E^(1). CMP109 p. 261 explicitly permits the localized representation (1.7) for both conventions, citing the previously constructed expansion of log Z. This is literature support for including that determinant in the activity argument; it is not a new determinant proof in these notes.

The term -beta1(g0) A(U) is still separate in (1.6). The Cauchy/polymer calculation in CAUCHY1497 lines 7–31 and CURRENT-POLYMERS1499 lines 13–32 treats the analytic activity family. It neither writes the counterterm nor proves its contribution is included in C_E,L. FIXED-SECOND-STEP1500 line 26 consequently overstates what that particular calculation has accounted for when it calls it the OLD E1 contribution.

This is also where a normalization distinction matters. Z^(1)(U2), N'_1 and other factors outside the next integral are constant in the next free coordinates. The old Z^(0)(U1(V(x))) is not constant in x. It cannot be discarded as a background-only normalization. The notes do not explicitly discard it, but they do not identify the convention that puts it into their activity family either. This ambiguity must be removed.

The sign and coupling repair can be made completely explicit. Set x = g1 a in free physical coordinates, U(x) = U1(V(x)), and S(x) = A(U(x)) plus the actual averaged gauge action after nonlinear constraint reconstruction. Up to constants independent of a, the negative log density is

    H_next(a) = g1^-2 S(x) - E1(U(x))
                - log J_sel(x) - log sigma(R_h(Cx)).

Thus the counterterm contributes +beta1(g0) A(U(x)) to H_next, and its raw Hessian is

    +g1^2 beta1(g0) Hess_x A(U(x)).

The signs of the Haar and selected Jacobian terms are negative in H_next, because they enter with positive logarithms in the source's density exponent (2.12). Norm bounds may ignore those signs; the actual density dictionary may not. Also, the relation is 1/g0^2 = 1/g1^2 + beta1(g0), as in CMP109 p. 255, (0.18). One must not choose g0 and g1 as unrelated parameters.

Minimal repair: define the activity convention explicitly, include log Z^(0) in mathcal E^(1), and add a bound C_A,L for the weighted physical Hessian of A(U(x)). Such a bound follows from the same first/second background derivative envelopes used for the action: the second chain rule is f'' H_b H_c + f' H_bc, summed over plaquettes. The star summation discussed below applies. CMP109 p. 264, below (1.22), supplies a uniform bound B_beta on beta1 over the admitted coupling interval. The repaired estimate is

    delta <= C_R,L epsilon_phys
             + g1^2 (C_Haar,L + C_sel,L + C_activity,L + B_beta C_A,L).

Equivalently, redefine C_E,L to include C_activity,L + B_beta C_A,L, but explain and prove that redefinition. There is no need for a new smallness hypothesis of order 1/g1^2, and no evidence here of a wrong power of g1. The missing term is a full-density bookkeeping/proof gap, repairable using the stated source inputs and the same fixed-step analysis.

**2. The actual cutoff is product-shaped for a specific reason; the formula in 1496 is not exact.**

CUTOFF-BUDGET1496 line 5 describes the actual fixed source cutoff as |g1 C a| <= epsilon1 with selected nonlinear reconstruction included. Read literally, that is not (2.9). CMP109 p. 266, (2.9), takes the product only over bonds excluding the selected b0(c). CMP109 p. 267 defines h to be supported precisely on these selected bonds and linearizes the constraint by

    B_actual = B_linear - h D_tilde(B_linear).

After eliminating the linear constraint, B_linear = Cx. On a free bond, (Cx)_b = x_b and (h D_tilde(Cx))_b = 0. Consequently the actual cutoff becomes exactly

    chi(a) = product over free bonds b of 1{|g1 a_b| < epsilon1}.

Selected bonds satisfy an induced O(epsilon1) bound, not the same independent epsilon1 restriction; this is stated at the top of p. 267. Imposing additional all-bond constraints would produce a different domain and could destroy the product geometry needed by the proposed reflected argument.

This supplies the missing exact justification for FIXED-SECOND-STEP1500 lines 17–24 and 33. Depending on the chosen Lie-algebra norm, the factors are bond norm balls, not necessarily scalar-coordinate boxes. The covariance gate should be stated for a product of convex bond factors, with spatial weights constant on each Lie-algebra bond block; an assertion limited to scalar rectangles is not automatically the same theorem.

The smaller-window construction is legitimate for the explicitly smaller-cutoff law. A uniform l-infinity bound on C and on the local implicit map R_h gives a positive free-coordinate radius whose reconstructed image lies inside the source variational/current charts. The entire segment tx stays in the free product domain; no convexity of the reconstructed image is required. This corrects the coordinate dictionary without changing the physical epsilon budget.

However, shrinking the cutoff of an already specified retained law changes that law. It does not establish curvature or mean transport on the removed annulus, and does not prove the statement for a previously fixed maximal epsilon1. The main proposal expressly excludes that extension; preserve the exclusion. If the smaller epsilon is chosen from the start for the source transformations, the old E1 and the first conditional means must be those of that compatible construction. If it is instead an additional conditioning of an existing next law, state that interpretation. The two versions should not be silently interchanged.

**3. The hard-tree to averaged-soft bridge is viable, provided the quadratic is the constrained one.**

The source does not identify the hard and averaged slices. CMP109 pp. 253–255, (0.5)–(0.16), defines the covariant average of root contours and its exponential gauge fixing. CMP109 p. 265, (2.2)–(2.3), chooses the critical orbit representative with vanishing averaged gauge action. CMP109 p. 267, (2.11), explicitly identifies the resulting quadratic with CMP99 (3.156), replacing hard delta-function gauge fixing by the exponential gauge term.

The physical quadratic in this identification contains constraint curvature. In source notation its schematic form, before the free-coordinate lift, is

    q_phys(B) = <H1 B, Delta1 H1 B>
                - 2 <H1 h C_tilde^(2)(B), J>.

Delta1 itself already contains the earlier constraint-curvature correction; see CMP109 p. 266, (2.6)–(2.8), and CMP99 p. 421, (3.127)–(3.128). The additional displayed J term arises from the next coarse constraint linearization. CMP99 p. 428, (3.156), also retains its corresponding second-order term. Dropping either correction and invoking a bare Wilson Hessian would invalidate the argument. The six notes do not make that mistake: SOFT-GAP1495 line 14 and FIXED-SECOND-STEP1500 lines 7, 13 correctly insist on the constrained Hessian and on the nonzero f' H_bcd term later in the nonlinear expansion.

At a stationary point of the action restricted to the constraint manifold, gauge invariance implies that its intrinsic Hessian has zero gauge directions and zero mixed terms with those directions. Stationarity on the manifold is essential: the same statement for an arbitrary ambient Wilson Hessian is false. This justifies the gauge-null step used in 1495.

With root-fixed infinitesimal gauge action T and averaged contour differential G, equivariance gives G T = I after fixing the sign/transport convention. It does not require every individual contour holonomy to be the identity. It requires the averaged contour variable at the chosen representative to be the identity and the average to satisfy its source covariance property. The finite block tree gives B_h in the hard slice, and

    mu = G B,
    B = B_h + T(mu - G B_h).

Retaining G B_h is correct. There is no basis for setting it to zero merely because B_h is in a hard tree gauge.

The resulting equality q_soft(B) = q_phys(B_h) + kappa_G |mu|^2 and the norm estimate in SOFT-GAP1495 lines 20–26 yield a positive symbolic m_G in the actual soft free-coordinate norm. The maps used have fixed-block support; the real-background parallel transports are unitary. The same finite-carrier changes of variables preserve an exponential precision kernel from the hard one. I find no volume factor missing in this argument. A general nonunitary complex-background l2 argument would need additional bounds; the note properly uses the gap on the real branch.

The normalization should still be stated in one definite Lie-algebra basis. CMP109 p. 252, (0.2), uses normalized trace, and (2.5) gives one-half the squared linear contour coordinates in the gauge action. In the corresponding Hessian convention this fixes the positive gauge coefficient. Leaving kappa_G symbolic is sufficient for an existence result, but does not constitute an extracted numerical gap.

CMP99 p. 428 asserts the positive lower bound and uniform exponential precision decay on the hard free-coordinate space. It recalls a proof for U = 1 and says the regular-background version can be proved by localization. This audit accepts that stated result as literature input; it has not reconstructed the cited proof or proved its regular-background extension independently. The same qualification applies to the source's asserted change of averaging conventions.

**4. The source complex/current kernel is present; the P1 link and its limits must be explicit.**

CMP102 pp. 305–307, (172)–(180), gives an actual complex input neighborhood for B and analytic variational reconstruction. CMP102 p. 309, Proposition 9, states analyticity in that setting and states that the functional derivative satisfies (190). The visual check of p. 308 confirms that (190) includes the field derivative, covariant gradient, localized Holder gradient, D*_U D_U applied to the derivative, and the covariant Laplacian applied to it, with the scale powers and input-cell factor described in CURRENT-POLYMERS1499 line 5. It is not merely a real or zeroth-order supremum estimate. Reading the proposition as a uniform bound on its stated small complex domain is justified at the statement level. It is not justified on arbitrary complex gauge fields outside that domain.

The P1 component of (3.14) is not separately listed in (190). CMP109 p. 272 supplies the required connection: on the fixed-background Landau subspace,

    D*D H = Delta H - P1 H + a lower-order local term.

Thus P1 H, and P1 applied to an input derivative of H, are controlled by the two second-order bounds in (190) plus lower-order bounds. Here the external reference background is fixed as input B varies; one is not differentiating P1 with respect to a moving external background. This is why one can obtain the full (3.14) norm without pretending that P1 is an arbitrary finite-stencil projection. CURRENT-POLYMERS1499 should include this precise identity when claiming current-norm compatibility. The relevant source anchor already exists; the repair is an explicit operator dictionary, not a new propagator hypothesis.

CMP109 pp. 271–273, (3.7)–(3.17), uses the actual H_j/averaging/H_k composition and explicitly states derivative and second-order versions of its localized estimate. At fixed k = 1, the averaging and selected reconstruction maps have finite carriers and bounded complex derivatives on a strict chart. Convolving the two variational kernels, converting the source input-cell measure to a coordinate derivative, and padding those carriers gives a positive exponential rate with fixed-L constants. Scale powers may enter those constants. They cannot be discarded in a scale-uniform assertion, which the main note does not make.

This conclusion depends on a common domain for all factors of that composition, uniform over the chosen real external-background class. Analyticity at each separate background, with no uniform radius or inverse bound, would not suffice. The main note declares strict uniform source/selected-inverse margins; that declaration must refer to the actual source conditions and intermediate fields, not merely be a new name for an unproved Hessian bound. With the declared strict source class and the fixed-step kernel statements, choosing a sufficiently smaller physical window is a defensible existence construction. No actual numerical radius or certification of a specific nontrivial background is supplied by these six notes or by this audit.

CMP102 p. 308, immediately before (189), explicitly omits the lengthy calculation establishing the localized second-variation estimate used to derive (190). This remains a literature input, not a reproduced proof. The audit does not close that source-level proof omission. Also, the source conventions require source-admissible parameters: CMP109 p. 251 fixes odd L > 11, and Theorem 3 on p. 264 requires its kappa, M, coupling and regularity restrictions. The phrase "fixed odd L" alone is broader than that source statement; write "fixed source-admissible L" or retain the explicit restriction. No extension to all odd L, arbitrary groups/dimensions, or arbitrary regularity notions follows from the audit.

**5. The second/third derivative Cauchy and star estimates are valid deductions under those uniform inputs.**

Suppose the complete reconstructed field has, throughout a strict common complex input neighborhood,

    |H_b(u)| <= A exp[-s D(u,b)]

in the required output norms, with finite carrier padding understood. Use one further input Cauchy circle for H_bc and two independent further parameters for H_bcd; the radii must fit together in the remaining input margin. The input-coordinate radius is fixed independently of distance and volume. Symmetry of the input derivatives then gives, for n <= 3,

    |H_b1...bn(u)| <= A_n exp[-s max_i D(u,b_i)].

This is a valid consequence of the same complex first-derivative bound, not a consequence of real-only decay or bounded holomorphy without spatial decay. Repeated coordinate directions can be handled by independent complex parameters in that same direction, with their total displacement budgeted. No factorial omission invalidates the two-direction bound in 1497.

The inequality exp(-s max_i r_i) <= exp[-(s/n) sum_i r_i] is in the correct direction. For n = 3, insert exp(alpha D(b,c)) and use D(b,c) <= D(b,u) + D(u,c). Choosing alpha < s/3, with additional room for previous rate losses, leaves summable exponential factors in u, c and d. Polynomial lattice growth and a fixed number of fine variables per coarse cell then give the proposed volume-independent third-derivative weighted row bound. Symmetry gives the required permutations. Products appearing in f''' H_b H_c H_d and f'' H_bc H_d obey the same or stronger star envelopes. The f' H_bcd term is essential and is correctly retained in FIXED-SECOND-STEP1500 line 13.

Consequently the Taylor integral identity in lines 17–24 yields the physical action/gauge remainder bound C_R,L epsilon_phys. Two raw derivatives cancel the g1^-2 prefactor. The warning in 1496 against inferring a uniform O(g1) Hessian on an expanding raw box merely from fixed-raw convergence is correct. The cubic example is a valid counterexample to that inference; it is not a counterexample to the proposed repaired physical-cutoff estimate.

The source output Cauchy radius in CMP109 p. 273 is alpha2/3 divided by the output norm, not alpha2/4. INPUT-RADIUS1498 correctly supersedes the false source attribution in CAUCHY1497. A smaller quarter-radius is admissible, so the conservative first derivative constant 4/alpha2 and the two-direction constant 36/alpha2^2 remain usable. This historical attribution error should remain visible, but it does not invalidate the later conservative bounds.

**6. The rooted polymer calculation works for the activity part, with genuine entropy reserve.**

The chain rule in CAUCHY1497 line 16 has both necessary terms:

    D^2 F_X(H)[H_b,H_c] + D F_X(H)[H_bc].

Using the second term's maximum-distance tail, rather than replacing it by a product of first-derivative tails, is correct. The current substitution is part of F_X; keeping J fixed instead would be the wrong derivative. The resulting envelope in CURRENT-POLYMERS1499 lines 15–17 is sufficient for the weighted sum.

CMP109 p. 257 defines localization domains as connected unions of fixed-size cubes and d_j(X) as a normalized shortest-tree length meeting every cube. This supports the tree/diameter comparison and exponential animal counting, up to fixed dimension and scale factors. In particular cube count is bounded by a constant times 1 + d_j(X); a tree vertex meeting several closed cubes changes only a dimension constant. These factors should be retained if different lattice-distance conventions are used.

After using D(b,c) <= dist(b,X) + diam(X) + dist(c,X), choose alpha small relative to the tail rate and the localization scale. Summing c gives a factor proportional to the number of underlying unit sites/bonds in X. The replacement

    exp[-t dist(b,X)] <= sum over z in X exp[-t D(b,z)]

then produces a rooted polymer moment, not a sum over all translates with a volume multiplier. A strict remaining kappa reserve above the rooted animal-counting rate absorbs that moment and its polynomial size factor. This reserve is an actual condition, already acknowledged by the notes, and can be arranged with the source's sufficiently-large-kappa choice followed by M and then sufficiently small alpha. One must not assume it at a critical entropy threshold merely because kappa is positive.

At k = 1 there is no uncontrolled infinite scale sum. Thus the argument establishes the advertised activity Hessian mechanism at the level of source-dependent analysis. It does not by itself establish the counterterm portion of full E1 identified in item 1. The repaired C_E,L must include that separate piece.

**7. Haar, selected Jacobian, and the final curvature algebra.**

The Haar factors are local analytic functions on the small exponential chart. The selected-bond reconstruction is supported on the one-step corridor variables. The source contour geometry (CMP109 pp. 252–254) uses paths inside the endpoint blocks and the translated bond crossing their corridor; this is the geometry behind the local selected solve on p. 267. On a uniform strict inverse chart its relevant determinant blocks have analytic logarithms and bounded derivatives. Merely saying that a large sparse matrix is invertible would not prove that its log determinant is a sum of finite-carrier terms. Here the particular corridor support, not generic sparsity, is the needed justification. It should be recorded explicitly when using FIXED-SECOND-STEP1500 line 26.

For the current Haar/selected factors, two raw derivatives yield g1^2 times bounded physical derivatives, and finite incidence gives weighted row and column bounds. Background-dependent factors outside the current integral have zero a derivatives. This does not apply to old Gaussian normalizations evaluated at U1(V(x)); those belong to item 1.

With the corrected delta, the last curvature algebra in FIXED-SECOND-STEP1500 line 33 is consistent. A weighted row/column bound delta <= m_G/8 gives the unweighted operator bound and hence Hess H_next >= 7m_G/8. Taking m1 = m_G/2 is conservative. If the Gaussian conjugation moment is <= m_G/8, the total is <= m_G/4 = m1/2. Exponential precision decay with fixed constants gives a conjugation moment tending to zero as alpha tends to zero, uniformly in volume.

The order of choices matters: choose an admissible source parameter/background class with positive uniform margins and entropy reserve; choose alpha; then choose a small enough physical free cutoff; then choose compatible small couplings to pay the g1^2 terms. The constants may depend on fixed L, M, source bounds, basis and margins. This is an existence result, not an extracted numerical parameter range, and it is not uniform in an increasing number of retained steps.

**8. What the covariance conclusion does and does not establish.**

Given the corrected curvature estimate on the actual product domain, a compatible reflected covariance theorem and the asserted exponentially localized O(g1) gradients of the complete first conditional means yield the claimed O(g1^2) next conditional covariance with an exponential spatial tail, after the usual convolution loss in decay rate. The arithmetic of that implication is sound. Convex product bond factors are appropriate for the reflection argument when conjugation weights are constant within each bond block; boundary terms cannot be suppressed merely by invoking hard-cutoff integration by parts.

The six-note input set contains neither the definitions/proof for the complete means in 1492 nor the actual theorem/proof in 1493. I have not verified their derivatives, normalization terms, cutoff dependence, or boundary treatment from those missing notes. Therefore this audit cannot certify the actual mean-transport conclusion solely from the six hashed files. They are explicit external dependencies, not demonstrated false statements. The minimal repair is to state the transport part conditionally on those precise gradient and covariance inputs, and to avoid describing them as audited by review 1501.

The source-conditional curvature mechanism survives the audit with the full E1 dictionary repair, the exact product-cutoff identification, and the operator/parameter clarifications above. Actual applicability still requires that the law and external backgrounds really satisfy that dictionary and the shared source margins. No claim is made here about large-field/history contributions, the other tower term, later scales, a fine-observable global covariance, a mass gap, novelty, or numerical strength. No score is assigned.

The integrity details, structured findings and provenance are in ASSESSMENT1501.json and SHA256-MANIFEST1501.json. Temporary source page images remain only in this review work directory for the parent to handle under the C-work/D-preservation rule.
