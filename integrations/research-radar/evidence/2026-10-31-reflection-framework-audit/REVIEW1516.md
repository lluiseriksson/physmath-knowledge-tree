# Technical audit 1516: weighted normal reflection and conditional covariance

Date: 2026-10-31 UTC. One unscored audit of exactly REFLECTION1473.md, FRAMEWORK1474.md and CONDITIONAL-DOSSIER1475.md.

## Disposition

The source-independent, finite-dimensional conditional covariance estimate is mathematically sound under the explicit assumptions stated below. I found no material sign error, reversed gradient metric, missing normalization factor, or hidden volume factor in its proof. The selected primary statements support the reflected-process/Dirichlet-form framework. Two minor specifications should be made explicit: a square-dimensional realization of the Słomiński application, and a convention for disconnected graphs or constant observables. Both have direct repairs given here; neither refutes the estimate.

This disposition does **not** verify that the actual physical conditional law has the asserted product cutoff, Hessian margin, finite interaction range, uniform block bounds, or primitive Lipschitz constants. Those remain substantive external assumptions. It also does not establish global physical decay after history averaging. The notes acknowledge these limitations, and they must remain attached to the result.

## Provenance and scope

Requested configuration: `gpt-6-astra`, reasoning effort `xhigh`. Actual runtime model and effort: **unverified**. The request and manifest identify the desired configuration, but no direct runtime attestation was available. This audit was performed in the separately assigned review context. Scientific independence is unverified; the inputs were authored by the participating parent according to the supplied provenance. This is not an independently certified review or a claim of peer review.

The manifest hash matches the supplied value:

`INPUT-MANIFEST1516.json`: `70757cbe8348ef4fcbfcd04e20e48126fa6aaa3c9ac3bc0469e0377d52c5ac6f`.

The three files were read completely, and their byte counts and SHA256 values match:

| Input | Bytes | SHA256 |
|---|---:|---|
| REFLECTION1473.md | 6819 | `6a046dd5573c3dcb486a802312ed79f54e47b842649e222ac6d00ee39827854c` |
| FRAMEWORK1474.md | 6458 | `c02371b3f7937193399c162915aa1dfcdd669749235df554a5a7a431294cb45e` |
| CONDITIONAL-DOSSIER1475.md | 9678 | `04269b524379768a01c1fc27cf62db00971ee18ef595086aa00b53e782c9a189` |

Both primary PDFs were fetched from the exact manifest URLs into the authorized temporary directory. Their hashes, byte counts and page counts match. The relevant statements were read in page images as well as extracted text. PDF page numbers below are one-based and include any cover page.

| Source | Bytes / pages | SHA256 | Pages visually inspected |
|---|---|---|---|
| Ambrosio-Savaré-Zambotti (ASZ) | 399178 / 43 | `ffdd8f79df957447f37c83f3884e8a3fcbf33992ba002e16fabb947eeab67f5d` | 3 |
| Słomiński | 2426875 / 37 | `b01a032420ad4b4b31275a6319d9d98d731f2a32b46cf26d41276375eaeb0c73` | 4, 5, 6, 25, 29 |

The primary-source proofs were not audited in full. No manuscript/PDF, other note, physical CMP source, formal development or build was assessed. References to earlier derivations inside the three inputs were treated as assumptions rather than checked through other files. Prior-audit coverage and the absence of concurrent reviews are supplied provenance, not independently re-audited facts. No other chat, repository or input was changed; no publication was performed.

## 1. Exact theorem accepted by this audit

Fix a finite set of raw coordinate blocks and the ordinary Euclidean direct-sum inner product. Fix a history and interpolation parameter before constructing the diffusion; the semigroup time below is a separate variable `s`.

Assume:

1. `K = product_b K_b`, with every `K_b` compact and convex with nonempty interior in its independent block. Norm balls satisfy this. The product must be the actual free-coordinate domain, not a product in dependent reconstructed outputs.
2. `H` is real and C2 on a neighborhood of `K`, with `Hess H >= m I` for `m > 0`. The density is exactly `Z^-1 exp(-H) 1_K dA` in these coordinates and this metric.
3. Hessian blocks vanish when the graph distance exceeds `R_H`. Both sums `sup_b sum_c ||H_bc||` and `sup_c sum_b ||H_bc||` are at most `B_H`, uniformly on `K`.
4. The observables are real Lipschitz functions. Their coordinate-gradient carriers are contained in fixed block sets `S,T`: derivatives in other blocks vanish almost everywhere. Their Lipschitz constants refer to the same Euclidean direct-sum norm, not merely to a separate bound on each partial derivative.
5. For a family of volumes, histories and interpolation parameters, `m`, `B_H`, `R_H` and the observable Lipschitz bounds are common constants. This is what makes the final estimate uniform.

For positive `B_H,R_H`, let

`alpha = log(1 + m/(2 B_H))/R_H`.

Then, with finite-distance conventions or the repair in Section 6,

`|Cov_mu(f,g)| <= (2/m) exp(-alpha dist(S,T)) Lip(f) Lip(g)`.

Taking `m=a_soft/2` and **assuming** `Lip(Phi_i)<=gamma g0`, the proposed coefficient is exactly

`C_cond = 4 gamma^2/a_soft`, multiplying `g0^2 exp(-alpha dist(S_p,S_q))`.

This audit validates the implication from these analytic assumptions. It does not derive `gamma=(16/3) C_C c_basis`, `a_soft`, or the physical Hessian/error estimates from the underlying model.

## 2. Weighted Hessian and normal-cone calculation

Put `w_b=exp(-alpha dist(b,S))` and `W=diag_b(w_b I_b)`. On a nonzero Hessian block, the triangle inequality gives `|dist(b,S)-dist(c,S)|<=R_H`. Therefore the block of

`E = W (Hess H) W^-1 - Hess H`

has norm at most `(exp(alpha R_H)-1)||H_bc||`. Its block row and column sums are both bounded by `delta=B_H(exp(alpha R_H)-1)`. Applying the scalar Schur bound to the matrix of block norms gives `||E||_2<=delta`. This is valid for signed and matrix-valued blocks; it does not replace the Hessian with a positive comparison matrix. An operator-norm bound alone would not justify this step.

The same conclusion holds for the averaged Hessian along any segment in `K`, since convexity keeps that segment in the region of the assumptions. Thus for real `z`,

`z . (W Hbar W^-1) z >= (m-delta)|z|^2 >= (m/2)|z|^2`.

The conjugated operator need not be symmetric; its symmetric quadratic form is all that is needed. The notes use the correct conjugation.

Write the reflected SDE as `dX=-grad H(X) ds + sqrt(2)dB - d ell_X`, where the outward regulator is a continuous finite-variation vector measure supported at the boundary. To make the measure notation precise, take a common positive measure dominating the total variations of both regulators; their densities lie in the respective outward normal cones, allowing zero densities.

For a product, `N_K(x)=product_b N_Kb(x_b)`. Consequently, for `Z=X-Y`, each block satisfies `Z_b . d ell_X,b >=0` and `Z_b . d ell_Y,b <=0`. Multiplication by the scalar `w_b^2` preserves both inequalities. This argument applies to every permitted normal-cone direction at a corner; it does not assume a unique smooth normal. A weight varying within a block would require a different argument.

Synchronous noise cancels exactly. With `z=WZ`, the ordinary finite-variation chain rule gives

`d|z|^2 = -2 z . (W Hbar W^-1) z ds -2 sum_b w_b^2 Z_b . d ell_X,b +2 sum_b w_b^2 Z_b . d ell_Y,b <= -m |z|^2 ds`.

Hence `|W(X_s-Y_s)| <= exp(-ms/2)|W(X_0-Y_0)|`. There is no omitted stochastic quadratic-variation term in the difference process. The signs and the factor in REFLECTION1473.md, lines 15-23, are correct.

Product geometry is a substantive condition, not merely convenient notation. For example, take a disk in two scalar coordinate blocks, `W=diag(1,1/2)`, `x=(1,1)/sqrt(2)` and `y=(4,1)/sqrt(17)`. The outward normal at `x` is `x`, but `(x-y) . W^2 x = 5/8-sqrt(17/32)<0`. Thus the needed weighted sign can fail on a coupled convex domain. This does not refute the notes, which explicitly retain the product restriction.

## 3. Primary-source applicability and synchronous construction

Słomiński's PDF page 5 (printed 166) specifies exterior-ball normals and assumptions (A),(B). Page 29 (printed 190), Theorem 5, provides strong existence and uniqueness for bounded Lipschitz coefficients, subject to the stated domain and jump hypotheses. The beginning of its proof describes a measurable solution map. Pages 6 and 25 give the regulator conventions used here. These statements were checked directly. [Primary PDF](https://www.numdam.org/item/AIHPB_1993__29_2_163_0.pdf)

The domain verification in FRAMEWORK1474.md is valid. In a convex domain, the source's exterior-ball inward normals are exactly the unit supporting inward normals: use a segment approaching the boundary point in the exterior-ball inequality to obtain the supporting inequality. Conversely, a supporting inward normal supplies every positive exterior-ball radius. Nonempty interior and compactness give an inball `B(z,r)` and finite `D=max_K|z-x|`. For boundary `y` within `r/2` of boundary `x`,

`(z-x) . n_y = (z-y) . n_y + (y-x) . n_y >= r-r/2`.

Dividing by `|z-x|<=D` proves (B) with the stated `beta=max(1,2D/r)`. This works for all normals, including at corners. Neither `D/r` nor a dimension-free boundary regularity constant is needed in the final covariance coefficient.

**Minor specification F1:** the source's setup on PDF page 25 uses a square `d by d` coefficient and a `d`-dimensional driver. FRAMEWORK1474.md, line 14, inserts the rectangular matrix `(-grad H,sqrt(2)I)` with driver `(s,B_s)` without recording the dimension reduction. This is not literally the printed setup. It is repaired as follows: in dimension `n+1` use domain `U x R`, state `(A,q)`, initial `(x,0)`, driver `(s,B_s)`, first `n` coefficient rows `(-grad H(A),sqrt(2)I_n)` and final row zero. All boundary normals have zero last component. Conditions (A),(B) follow from those on `U`, choosing the same direction with zero last component. The coefficient is bounded and Lipschitz on `K x R`, and the auxiliary state remains zero. Projection gives exactly the required SDE. All drivers are continuous, so the jump restriction is automatic. This repairs the source dictionary without a new analytic hypothesis.

One can now construct each pair of initial conditions with the same Brownian motion. A random initial condition independent of that Brownian motion is also allowed through the measurable construction. The argument needs pairwise couplings and a measurable semigroup, not a differentiable stochastic flow simultaneously indexed by all initial points.

ASZ Theorem 1.2, PDF page 3, closes the Euclidean gradient form for a log-concave probability measure and supplies a reversible, invariant Markov family. Its adjacent finite-dimensional example, equation (1.6), explicitly covers convex open `U` and convex `C1,1(U)` potential with normal reflection and noise `sqrt(2)`. No smooth-boundary restriction is stated there. [Primary PDF](https://cvgmt.sns.it/media/doc/paper/697/asz.pdf)

Here `H|U` has Lipschitz gradient because its Hessian is bounded on compact `K`; it is convex by the lower Hessian bound. The density with convex support is log-concave. Full-dimensional interior identifies the form's affine space with the raw Euclidean space. Boundary values of the extended potential do not affect the measure; if a lower-semicontinuous version is desired, use `H` on closed `K` and infinity outside. This resolves a representational issue, not a changed law. The normal-reflection identification, interpreted by the normal cone at nonsmooth points, and strong uniqueness identify the coupled process with the reversible semigroup. This is a statement-level application of the cited literature, not a full audit of its proofs.

## 4. Gradient metric, form identity and endpoint limit

For the metric `|W(x-y)|`, the dual gradient norm is `|W^-1 grad f|`, since `W` is positive and symmetric. On the convex full-dimensional domain, the Lipschitz seminorm equals its essential supremum for the continuous Lipschitz representative. Almost-everywhere gradients are sufficient. Because the density is bounded above and below by positive constants on each fixed compact domain, its null sets in the interior agree with Lebesgue null sets.

The pairwise contraction therefore yields

`ess sup |W^-1 grad P_s f| <= exp(-ms/2) Lip_W(f)`.

If the gradient carrier of `f` lies in `S`, `w=1` there and `Lip_W(f)=Lip(f)`. For `g` with carrier in `T`, `|W grad g| <= exp(-alpha dist(S,T)) Lip(g)`. The pairing is

`grad P_s f . grad g = (W^-1 grad P_s f) . (W grad g)`.

Thus the metric orientation in the notes is correct. No cardinality factor is introduced when these are full Euclidean Lipschitz bounds. A separate per-block bound would generally require combining the block contributions and is not an interchangeable assumption.

Lipschitz functions belong to the closed form domain here: extend to Euclidean space, approximate by smooth functions and restrict to the bounded convex domain. The density equivalence on each fixed `K` transfers the ordinary Sobolev approximation. This auxiliary approximation need not have volume-uniform constants.

For generator `L=Delta-grad H . grad` with normal reflection, the form has normalization `E(u,v)=int grad u . grad v dmu`; the `sqrt(2)` noise makes the second-order coefficient exactly one. For positive times the symmetric-semigroup identity is

`d/ds <P_s f,g>_mu = -E(P_s f,g)`.

Invariance and the synchronous coupling with `Y_0~mu` give convergence of `P_s f` to `mu(f)` on each compact domain. The finite factor `sup_x E|W(x-Y_0)|` may depend on volume, but is only used to show that the endpoint tends to zero. Taking the time limit separately in each volume is enough. Strong continuity handles the lower endpoint. The gradient pairing is bounded by

`exp(-ms/2) exp(-alpha dist(S,T)) Lip(f)Lip(g)`,

which is time-integrable and already uniform in the stipulated parameters. Integration therefore proves the stated covariance identity and coefficient `2/m`. There is no missing factor two, no deletion of an unaccounted boundary flux, and no hidden use of a volume-uniform mixing rate with a volume-uniform prefactor. The sharp unweighted constant is not needed for this claimed, weaker estimate.

## 5. Physical and averaging limitations: material open conditions

The actual physical assertions in dossier conditions 1-6 are **not verified by these three notes or by this audit**. In particular:

- Deduplicating repeated tests does not by itself prove that all actual retained restrictions factor over independent raw blocks. Any surviving constraint on reconstructed outputs can defeat the product premise.
- The original hard-gap/coercivity assumptions, the hard-to-soft bridge, the complete inside/exterior physical chart bounds, and the constants in `C_H epsilon_h+C_J g0^2<=a_soft/2` have not been derived here. Treating that inequality as an assumption is valid; treating it as proved for the physical ensemble is not.
- A nominally local action does not suffice unless its Hessian in the **actual retained coordinates** has the required fixed range and both block sums. Eliminating variables can change locality. The assumed uniform bounds have to be verified in that coordinate system.
- The primitive Lipschitz constant, complete carrier, real-valued observable identification and transport to the physical observable were assumed, not checked against the original source.

These are material application gates, not defects in the conditional analytic implication. The admitted event may be empty or rare; no lower bound on its probability follows from this proof. Uniformity in the volume follows if the listed constants are common. Uniformity in a further parameter, such as a coupling limit, requires corresponding uniform assumptions and is not created by the argument.

The law-of-total-covariance discussion in CONDITIONAL-DOSSIER1475.md, lines 44-57, is correct when the positive history law and observable disintegration are exact. Real observables in `[-1,1]` have conditional covariance of absolute value at most one. Therefore the displayed `(1-delta) C_cond g0^2 exp(-alpha D)+delta` bound for the averaged inner covariance is valid under the stated common-distance condition. A history-dependent distance must remain inside the expectation or have a proved uniform lower bound.

Even with `delta=0`, the covariance of conditional means remains. For example, a history sign shared by both observables gives inner covariance zero and outer covariance one at every separation. Consequently a conditional estimate alone cannot imply global decay. A small separation-independent bad-history probability also leaves a separation-independent remainder. The notes explicitly preserve these objections; this audit neither removes them nor verifies a mechanism controlling them.

## 6. Minor edge cases and required reading of the claim

**Minor specification F2:** REFLECTION1473.md, line 9, says finite volume makes every weight positive. That additionally requires finite graph distances to a nonempty carrier. A finite graph can be disconnected, and a constant `f` can have empty carrier. For a constant observable the covariance is zero. For disconnected graphs, replace the distance by `min(dist(b,S),M)` with finite `M`; this gives positive weights, retains the same bound on every interacting block and yields the bound with `min(dist(S,T),M)`. Letting `M` tend to infinity recovers zero between disconnected components. Equivalently, assume the relevant finite graph is connected. This is a minor completeness issue rather than a material counterexample.

When `R_H=0`, treat the diagonal case separately as the notes propose: there is no conjugation error, any positive spatial weight parameter works, and disjoint block carriers have zero covariance. With positive `m` and nonzero coordinate dimension, `B_H=0` is incompatible with the Hessian assumptions. The displayed formula for `alpha` is used only for positive `B_H,R_H`.

The interpolation parameter must remain fixed during each semigroup argument. A family of uniformly convex potentials does not by itself give an invariant density for a diffusion whose potential changes with its stochastic time. The notes are naturally read with the parameter fixed; this audit accepts that reading.

## Final assessment

Accepted: the conditional finite-volume covariance theorem with the declared uniform analytic hypotheses, the corner signs, weighted operator estimate, synchronous argument, dual gradient metric, reversible normalization, covariance identity and final constant. The source framework is supported at the inspected statement level, with the explicit square-dimensional bookkeeping repair above.

Not established: applicability of those hypotheses to the actual physical law, nontrivial probability of the admitted event, control of excluded histories, control of the covariance of conditional means, exact full observable transport, all-scale claims or a Yang-Mills mass gap. No novelty or formal-verification claim is made. There is no numeric grade, target score or repeated audit for a preferred disposition.
