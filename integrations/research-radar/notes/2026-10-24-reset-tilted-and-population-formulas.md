# Reset channels: tilted norms and optimal populations

This follows the [weighted block entropy checkpoint](2026-10-24-weighted-block-entropy-proof.md), which retains the six-page predecessor's importance6/technical9 assessment. The new ten-page manuscript has PDF SHA256 `5066ec7b92bbd7eeb1f7b6be94f85812f1c39da51ee75667819ded0f93cec578`; its complete assessment is running. No prior score transfers. This note records analytical claims and dependent targeted audits, without changing canonical graph confidence or claiming worldwide priority.

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
