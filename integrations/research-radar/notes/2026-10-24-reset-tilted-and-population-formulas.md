# Reset channels: tilted norms and optimal populations

This follows the [weighted block entropy checkpoint](2026-10-24-weighted-block-entropy-proof.md), which retains the six-page predecessor's importance6/technical9 assessment. The new ten-page manuscript has PDF SHA256 `5066ec7b92bbd7eeb1f7b6be94f85812f1c39da51ee75667819ded0f93cec578`. Its complete exact-artifact Astra xhigh assessment subsequently returned **importance6.0/10 and technical quality8.5/10**, with no material mathematical objection and two minor attribution requests detailed below. No prior score transfers. This note records analytical claims and dependent targeted audits, without changing canonical graph confidence or claiming worldwide priority.

Root read the entire new assessment and verified all76 archived evidence entries. Full report SHA256 `7d1a10ed4c5f34d069d26c6806296f9abfcc7cff6e396b45cd28a8740f32b8e8`; verdict SHA256 `5e01c71707d4fa59b883a2a831397200fa7dd56f5819f148ef6f60ed0518faed`. The review recommends acceptance with minor bibliographic revisions; this is a model recommendation, not an editorial decision or imported AIRR registry grade. The evaluator started without the development history or earlier scores, but used a shared filesystem and the same model family involved in development; no runtime, memory, statistical or human independence is certified. The importance target remains unmet: the evaluator considers the results solid within a specific channel family, without evidence of a field-transforming consequence. The two attribution requests concern Song Proposition11 and the King–Nathanson–Ruskai exponent2 antecedent, already recorded in this follow-up. Later candidates are outside this score.

## Sourced facts

- [Song et al.](https://arxiv.org/html/2609.37240v1), Appendix A.1 Proposition11, equations69–74, already extract Schatten bounds for `1<alpha<=2` from log-determinant ordering by a power integral. Root read this passage in addition to the earlier scoped Section3.1 reading. The scalar integral is an antecedent. Their higher-norm counterexample prevents inferring all exponents from log-determinant ordering alone.
- [King, Nathanson and Ruskai](https://arxiv.org/html/quant-ph/0409181v2), Section2 Definition1 and Theorem3, prove integer-exponent multiplicativity for CP maps when one is entrywise positive, without requiring trace preservation. Positive diagonal tilts of reset maps meet that hypothesis. The exponent2 endpoint therefore has this antecedent; their stated theorem alone does not prove the fractional interval. Root read these statements, not the whole paper.
- [Beigi](https://arxiv.org/html/1306.5920v2), definition3 and Theorem6, supplies sandwiched Renyi data processing. The success-probability framework follows [Wilde, Winter and Yang](https://arxiv.org/html/1306.1586v4), whose introduction, summary and selected framework passages were read.
- Baitenov2024 full text remains unavailable for comparison. Metadata and search failure do not establish novelty.

## Graph-supported inference

The [retrieved neighborhood](../retrieval-2026-10-24.json) concerns quantum information, conditional mutual information and the spectralize move. The dictionary maps input block traces to Jensen weights, diagonal tilts to Renyi reference states, and power traces to decoding-success bounds. This is useful context; graph adjacency proves none of those steps. No canonical graph edit is made.

## Analytical claim: tilted norm multiplicativity

In finite dimensions write `Phi(rho)=lambda rho+q tau Tr(rho)`, `q=1-lambda`, `0<=lambda<=1`, `tau=diag(s)` and `W(k|j)=lambda delta_kj+q s_k`. For `D=diag(d_k)>0`, put `Phi_D(rho)=D Phi(rho) D`. With `nu_alpha(Psi)=max_density ||Psi(rho)||_alpha`, the audited claim is

```text
nu_alpha(Phi_D tensor Psi)
 = [max_j sum_k (d_k^2 W(k|j))^alpha]^(1/alpha) nu_alpha(Psi),
1<alpha<=2, Psi any finite CP map, possibly non-TP or zero.
```

For joint input `R`, retain `p_j=Tr R_jj`, `sigma_j=R_jj/p_j`, `X=(id tensor Psi)(R)`, `Y=Psi(R_B)` and `Xhat=(D tensor I)X(D tensor I)`. The block-column proof uses `B_i=tI+q d_i^2 s_i Y`. It gives log-determinant comparison between `Z=lambda Xhat+q D tau D tensor Y` and comparators `Z_j=lambda d_j^2 |j><j| tensor Psi(sigma_j)+q D tau D tensor Y`, weighted by `p_j`.

Individual comparator traces can differ, but `Tr Z=sum_j p_j Tr Z_j` and their dimensions agree. In the established scalar integral

```text
K_alpha x^alpha = integral_0^infinity t^(alpha-1)
                         [x/t-ln(1+x/t)] dt, 1<alpha<2,
```

weighted trace cancellation gives `Tr Z^alpha<=sum_j p_j Tr Z_j^alpha`. This does not apply an equal-trace entropy identity to unequal traces. The Schatten triangle inequality in each block gives the norm upper bound; a basis input and a maximizing partner input attain it. Compact continuity supplies alpha2. There **exists** a product maximizer; the identity endpoint with identity partner also admits entangled pure maximizers, so not all maximizers are being classified.

Targeted audit input SHA256 `18ef09f4d6e351ca58a3dd90db269bb26cf769073baac44f56a1893d57e60013`; report SHA256 `63e85c9bc0b1d78a50b8f4137e9ee44104d5c83412545a5c78ab33f831496ae0`. Root read the complete report and verified five native manifest entries. This is dependent AI evidence with reused context and shared filesystem, not human review or a complete-paper grade.

### Success bound and failed cost extrapolation

For positive probability vector `r`, set `d_k=r_k^((1-alpha)/(2 alpha))`. Multiplicativity iterates because the partner can be CP without being TP. Define

```text
R_alpha(r)=max_j ln[sum_k W(k|j)^alpha r_k^(1-alpha)]/(alpha-1).
p_success <= exp[-(alpha-1)/alpha {ln M-n R_alpha(r)}].
```

The correct-decoding event has reference probability **1/M** under the uniform message law and product reference state, since decoding effects sum to identity. Sandwiched Renyi data processing yields this bound for entangled codewords and joint decoding. A capacity-optimal classical mean output is strictly positive for lambda>0; the directional-derivative condition gives `max_j D(W_j||r*)=C`. Taking alpha down to1 proves an exponential **finite-dimensional unconstrained** strong converse. The constant channel is handled directly.

This removes the vanishing-error-only restriction for that converse, but does not remove the cost convention. For binary identity, encode half of `2^(n+1)` messages as all basis words and half as all zeros. Decoding the first half has success1/2, mean cost n/4 and limiting rate ln2, above h(1/4). A mean-cost strong converse would be false. No countable strong converse, optimal exponent, all-alpha norm claim or entanglement-assisted statement follows.

## Analytical corollary: explicit optimal classical populations

Assume the finite quantum-to-classical capacity reduction. For `0<lambda<=1`, let `b=q s`, `a_j=H(W_j)` and `t_j=exp(-a_j/lambda)`. The unique positive scalar satisfying `sum_j max(b_j,z t_j)=1` gives

```text
r_j*=max(b_j,z t_j),  p_j*=(r_j*-b_j)/lambda.
```

Indeed `r=b+lambda p` bijects the simplex with `r>=b, sum r=1`. The objective is strictly concave entropy minus an affine term. Its gradient at the proposed point is a common level on active coordinates and no larger on floor coordinates; the concave supporting-plane inequality proves global optimality. The exact objective gap is `D(r||r*)` plus a nonnegative floor-coordinate penalty.

For `0<lambda<1`, differentiating `ln(t(b)/b)` with its common entropy term held fixed gives `ln(1+lambda/b)/lambda-1/b<0`. Thus positive input support is an initial segment of reset eigenvalues ordered from smallest to largest. Zero eigenvalues are active and tied groups enter together. This orders support, not all probability magnitudes. Lambda1 gives the uniform input; lambda0 is separate. This is conventional concave optimization after the quantum reduction, not a classification of all quantum optimal ensembles or a new complexity theorem. Baitenov's full-text comparison remains pending.

The dependent audit passed without mathematical repairs: input SHA256 `f945c0d86c42eb5b52b9a2f6c855de1236dd4d902196e876d003d36111863bd6`; report SHA256 `455c8fc24283a6f0bdf0036d054c22085cddf2fe041bfd849de59a349ea06a93`. Root read it fully and verified nine native manifest entries and eleven identical C/D files. Original144 optimizer comparisons are preserved: all reported success, but max absolute capacity gap was8.059182876607451e-8 and max relative gap1.1742901935650323percent. The six largest-gap inputs replayed exactly with original settings; analytic gradients and objective rescaling reduced their largest objective difference to2.220446049250313e-16. Success flags and objective agreement do not certify probability-vector precision. Numerics are not a proof or a ready Research Capsule.

## Source refresh, next hypothesis and formal boundary

On2026-10-24, a read-only GitHub check found `openai/math` main still at `1581d4cbdd69a0faf34b2089614fe2a814316a6a`, matching the [pinned catalogue](../catalogue/openai-math-2026-10-24.json):719 manuscripts in372 families. This is metadata coverage, not719 audited proofs. Official [OpenAI](https://openai.com/index/sharing-ai-progress-in-mathematics/), [Anthropic](https://www.anthropic.com/research/riemann-zeta) and [DeepMind](https://deepmind.google/blog/alphaevolve-impact/) pages were refreshed as source pointers. Announcements do not substitute for linked proofs; no exhaustive company-paper survey is claimed.

A separate unreviewed candidate extends negative identity coefficients through a finite measure-and-prepare construction. It remains outside the frozen manuscript and is not promoted here. Falsifiers include an invalid physical Choi range, an incorrect four-phase product decomposition, or failure of the one-system determinant argument. The earlier bipartite comparator already fails there: a physical qubit example has expectation `-189/2000`. That failed extension is retained.

There is no new Lean proof, canonical confidence promotion, certified priority, official AIRR registry score or editorial acceptance. Routine corollaries alone do not establish greater scientific importance.

## Later boundary checks and a rejected prior-work collision

The separate negative-coefficient note subsequently passed a dependent targeted audit. That report checks the finite Choi range, explicit separable decomposition and one-system argument; it does not repair the failed bipartite comparator or evaluate a new manuscript. The earlier unreviewed status above records the preceding checkpoint, not a claim that the later audit was independent.

For general entrywise-positive maps, the integer-index theorem and the sufficient criterion of nonnegative Kraus matrices are already in [King--Nathanson--Ruskai, Definition1, Theorem3 and Section3.4](https://arxiv.org/html/quant-ph/0409181v2). They cannot simply be continued to fractional indices by assuming entrywise domination controls a Schatten norm. An exact control is `A=1.5I-0.5J`, `B=0.5I+0.5J=abs_entrywise(A)` in dimension3: both are positive with trace3, but at p=3/2 their power traces are `3sqrt(6)/2 > 5sqrt(2)/2`. This refutes that shortcut, not channel multiplicativity. A dependent targeted audit verified those boundary claims; the full fractional proposition and its current literature status remain unresolved in this investigation.

A contemplated extension of generalized amplitude damping by additional dephasing was rejected as a new candidate after comparison with the author's already public [Davies manuscript, exact v2](https://airr.science/papers/ARR-2026-5YJX444B6M95ZTG4/versions/v2/). Its third-vertex block estimate and scalar convex envelope already contain precisely that extension. The public v2 reports3.1 and2.7 remain distinct from earlier local candidate assessments and from the reset manuscript's6.0 importance assessment. Public material objections are preserved; this note performs no editorial disposition or whole-paper revalidation.

**Speculative next target:** consider the phase-covariant qubit map with population `t=a+(1-a-b)p` and coherence multiplier `sqrt(c)`. Complete positivity allows `c<=(1-a)(1-b)`, whereas the Davies proof assumes the stronger `c<=1-a-b`. The outstanding question is whether the population-resolved entropy bound with arbitrary rectangular partner factors survives outside the Davies region. Fixing the two scalar row masses and the cross coefficient leaves the earlier proof's convex triangle unchanged; its weights cease to be nonnegative beyond that region. Renaming the weights is therefore not a proof of this extension.

The dictionary is the common Kraus factorization of the two conditional partner outputs; it preserves their cross operator, trace and branch entropies. What is lost is the determinant inequality required by the old convex decomposition. A rigorous finite violating tuple would reject the proposed entropy strengthening, without refuting Holevo additivity itself. An antecedent already proving the same strengthening would reject novelty. Generic unital, pure-output and entanglement-breaking overlaps must also be excluded before assessing a contribution. Six bounded local floating-point checks found no violation; that observation supplies no universal proof, certified maximum, ready Research Capsule or importance score. Analytical review is pending, and no new manuscript has been created from this hypothesis.

That bounded review subsequently closed with the general matrix inequality unresolved. A separate scalar reduction passed: write `l=1-a-b>=0`, `c=l+delta`, `0<=delta<=ab`, and `B=c-l^2`. Completing the pure-output determinant square gives `4B v_min=4lab+delta(4ab-delta)>=0`. Thus its square root is a norm of an affine vector, and composition with the standard monotone convex entropy-concurrence function proves convexity of the one-use output entropy above the Davies boundary. The ordinary phase-pair Holevo formula follows. The degenerate constant and identity channels are treated separately. This is a one-use calculation, not arbitrary-partner additivity or a novelty claim. The dependent scalar report SHA256 is `7f4dcb0977c20f938835fbdd8a982c72ec34574be47cc162caa33c9b50c682a5`; root read both reports and the verdict, verified eight payload hashes and ten identical C/D files.

The next conditional route isolates a four-edge block matrix `M=[[A,B,0],[C,0,D]]`. Sharp Schatten compression for each fixed M in a right neighborhood of p=2 would, by differentiating the trace-power inequality, imply an entropy lower bound retaining both the scalar compressed entropy and all weighted internal block entropies. At the CP boundary `alpha*delta=K^2`, repeated X/Y blocks factor precisely in this pattern. A radial mixture of that boundary point and the controlled-purification vertex would then extend the entropy estimate to `alpha*delta>=K^2`. The four-edge compression or its entropy consequence is the unproved prerequisite; the reduction does not supply it. [Audenaert's primary conjecture and restricted cases](https://arxiv.org/html/math/0702186v2) and [Zhang's Conjecture1.14/Theorem1.15](https://arxiv.org/html/2410.21961v4) delimit the comparison. Zhang's rank loss yields an entropy loss of ln2 for rank2, which erases the scalar contribution needed here.

A falsifier correction is preserved: an isolated norm violation at p=3 would reject the stronger global compression conjecture, but would not by itself reject the per-matrix neighborhood hypothesis near2. The latter needs a fixed matrix with violations arbitrarily close to2, or, sufficiently, a strict negative entropy gap. Two local p=3 checks found no violation; they establish neither statement. The conditional reduction is under targeted review, with no new manuscript, score, formal declaration or certified current-open-status claim.
