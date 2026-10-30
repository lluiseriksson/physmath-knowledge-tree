# Conditional reflection and the outer-history boundary

This is supporting research synthesis, not a paper, manuscript assessment or
formal result. A finite-dimensional conditional estimate is separated from the
unproved physical source dictionary and global observable transport. No score,
independent review, novelty or Yang–Mills mass-gap claim is made.

## Evidence and reading depth

| Primary source | Read | Exact inspected PDF SHA256 |
|---|---|---|
| [Bałaban, CMP119(1988),243–285](https://doi.org/10.1007/BF01217741) | Selected cutoff/reconstruction passages; printed254 and260 visually checked; no full-proof audit | `db1deec2f1cfedfc5210b023a4cc07fe9a3363a3b5bf59e4cac8fac871ffac7a` |
| [Słomiński, AIHP29(2)(1993),163–198](https://www.numdam.org/item/AIHPB_1993__29_2_163_0.pdf) | Abstract, domain assumptions(A),(B), Theorem5 on printed190; no full-proof audit | `b01a032420ad4b4b31275a6319d9d98d731f2a32b46cf26d41276375eaeb0c73` |
| [Ambrosio–Savaré–Zambotti, author-deposited PDF](https://cvgmt.sns.it/media/doc/paper/697/asz.pdf) | Abstract, PDF3 Theorem1.2 and adjacent finite-dimensional reflection example; no full-proof audit | `ffdd8f79df957447f37c83f3884e8a3fcbf33992ba002e16fabb947eeab67f5d` |
| [Menz, DOI10.1214/EJP.v19-2997](https://doi.org/10.1214/EJP.v19-2997) | Abstract and selected PDF3,4,8 statements; no full-proof audit | `dcdf9cac93105892648500f6deb91e05a5a78a521c3a5d656f685e401af7bbe9` |

PDF sizes are respectively4172827,2426875,399178,305597bytes. They are not
included here. ASZ first preprint is [arXiv0704.2458](https://arxiv.org/abs/0704.2458),
19April2007; its deposited PDF is not asserted byte-identical to an arXiv or
journal version. Menz first preprint is [arXiv1402.5160v1](https://arxiv.org/abs/1402.5160v1),
20February2014. These are old sources newly used in this synthesis, not new2026
publications. The Tanaka1979 primary route was inaccessible; no theorem from its
unread PDF is imported.

Słomiński's selected theorem supplies strong reflected-SDE existence/uniqueness
for its bounded Lipschitz coefficients and stated domain assumptions. ASZ's
selected theorem supplies the symmetric gradient form and invariant reversible
process for a log-concave reference measure; its adjacent example identifies
normal reflection for a convex interior potential. Menz's absolute comparison
matrix requires an additional positivity condition. A positive signed Hessian
alone does not verify that condition, so that theorem is not substituted below.

## An analytic conditional proposition

Let a finite set of independent Euclidean blocks have an interaction-graph
distance. Let K be a product of compact convex block bodies with nonempty
interior, and let H be C2 near K. Suppose, uniformly on K,

```text
Hess H >= m I, m>0;
Hess H has block range R>0;
both block row and column sums of ||(Hess H)_bc|| are <=B>0.
```

For `mu(dA)=Z^-1 1_K exp(-H(A))dA`, and bounded Lipschitz functions f,g whose
gradients are supported on block sets S,T, the participating-agent deduction is

```text
|Cov_mu(f,g)| <= (2/m) Lip(f) Lip(g) exp(-alpha dist(S,T)),
alpha=log(1+m/(2B))/R.
```

The following proof is original synthesis of standard methods, not a claim of
new mathematics or an independent source-proof audit.

Set `w_b=exp(-alpha dist(b,S))` and let W be the block-scalar diagonal weight.
Schur's bound gives

```text
||W Hess H W^-1 - Hess H|| <= B(exp(alpha R)-1) <= m/2.
```

Thus the conjugated Hessian has symmetric quadratic form at least m/2. Couple
normally reflected Langevin solutions with the same noise `sqrt(2)dB`. Their
noise cancels. For every block, convex normal-cone monotonicity makes the
reflection contribution to `d||W(X-Y)||^2` nonpositive. The drift then gives
`||W(X_t-Y_t)||<=exp(-mt/2)||W(X_0-Y_0)||`.

This gives `Lip_W(P_t f)<=exp(-mt/2)Lip_W(f)` by finite differences, without a
differentiable reflected stochastic flow. Here `Lip_W(f)=ess sup||W^-1 grad f||`.
It is at most Lip(f) since W is identity on S. On T,
`||W grad g||<=exp(-alpha dist(S,T))Lip(g)`.

The invariant reversible form is `E(u,v)=int grad u dot grad v dmu`. Integrating
the semigroup identity gives

```text
Cov_mu(f,g)=int_0^infinity int grad P_t f dot grad g dmu dt.
```

The time integral of `exp(-mt/2)` is2/m; there is no extra normalization factor
in the form for noise `sqrt(2)dB`. Coupling to a stationary initial point proves
the mean limit on compact K. Its finite-volume diameter may enter that
convergence argument but not the final gradient-integral bound.

For applicability of the reflected framework, a ball B(z,r) inside K verifies
the inward-normal domain conditions: at nearby boundary points x,y,
`<z-y,n_y>>=r` and, for `|x-y|<=r/2`,
`<(z-x)/|z-x|,n_y>>=r/(2D)`, where `D=max_K|z-x|`. These existence constants may
depend on volume. The compact C2 drift is bounded Lipschitz. This checks the
selected finite-dimensional source hypotheses; it does not audit their full
proofs. Product geometry is essential for the WEIGHTED normal-cone signs. A
general coupled convex cutoff does not inherit that step.

## Physical dictionary and retained assumptions

The proposed application is only the bare first-step real conditional density
in the source's actual independent raw bond coordinates. Selected constrained
bonds are outputs, not additional independent cutoff coordinates. Full raw
carriers of the primitive plaquettes and their local constraint stencils must
remain in the admitted sector; shell/boundary changes cannot be ignored.

The earlier source-specific physical Hessian calculation is still a
participating-agent candidate, not an audited primary theorem. With the SAME
physical constrained saddle, `J=J(U)`, soft gauge and actual precision Q, it
requires a uniform original-source coercivity bound `Q>=a I`. A local Taylor
and bounded-overlap estimate proposes

```text
||Hess H-Q|| <= C_H epsilon_phys + C_J g0^2 <= a/2.
```

Here epsilon_phys controls complete inside AND exterior physical input
stencils over the entire retained domain and interpolation. An inside cutoff
alone does not imply this margin. Original hard-gauge regularity and the
hard-to-soft physical dictionary remain external obligations. Finite bare
interaction range does not extend automatically to later nonlocal H1 actions.

If those identifications and uniform bounds hold, take `m=a/2`, the actual
block row/column bound B, and primitive Lipschitz constants at most `gamma*g0`.
The conditional conclusion is then

```text
|Cov_h(Phi_p,Phi_q)| <= (4 gamma^2/a) g0^2 exp(-alpha dist(S_p,S_q)).
```

This removes a separately assumed conditional mixing estimate only on that
explicit uniformly convex raw product class. It supplies no probability bound
for histories outside the class, no all-scale theorem and no original-fine-
observable identification across arbitrary reconstruction steps.

## Rejected shortcut: conditional decay plus an unmarked R bound

For an identified positive original disintegration `omega(dh)nu_h(dA)`, let
`Z_h=int nu_h`, `pi=omega Z_h/Z`, `a_h=E_h O_p`, `b_h=E_h O_q` and
`k_h=Cov_h(O_p,O_q)`. The actual inserted observables O must be composed with
the physical changes of variables. Then exactly

```text
Cov_phys(O_p,O_q)=E_pi k_h+Cov_pi(a_h,b_h).
```

Even if every history satisfies the conditional bound, the second term remains.
For real normalized unitary traces and a bad-history probability delta,
`|E_pi k_h|<=E_pi[1_good C g0^2 exp(-alpha D_h)]+delta`. A history-dependent
distance D_h cannot be pulled out of the expectation without a comparison.

Bałaban Eq1.29 defines an unnormalized outer operation T1; the accompanying
effective action already absorbs the inside log normalization. Multiplying by
Z_h again would double count it. Eq2.31 bounds localized unmarked R-action
terms, and the text defers their construction to subsequent work. These facts
do not provide a two-mark response or covariance theorem. Formal re-expansion
terms also need their own positivity check before probabilistic good/bad
inequalities are applied term by term. This is not a claim that the original
positive gauge measure loses positivity.

The existing public [source-claim audit, B7](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/5442be3c004c20d3ee7f95ac7f8d16e9ff501d3c/docs/SOURCE-CLAIM-AUDIT.md)
already inventories CMP122 R I/II with extraction pending. Exact audit blob:
74031bytes,SHA256 `d0e704e723a96d41e110452376f09a4aa9d77f9f62f77af3d276528c0895a2b9`.
It is an existing secondary ledger, not theorem evidence or a fresh case.
No build/proof certification is inferred for that repository HEAD.

The shortcut from unmarked local action bounds and conditional convexity to
global connected decay is abandoned. This rejects an inference, not the source's
ultraviolet-stability result. A standalone paper for these supporting estimates
is parked; no PDF assessment or manuscript score exists for this synthesis.

## Bridge card and next bounded task

- Target/source node: `domain.analysis`; nearby graph context supplies a
  retrieval anchor only, not evidence for a physical estimate.
- Research move: expose the missing conditional-to-global transport.
- Dictionary: raw blocks to reflected coordinates; physical negative log
  density to H; full primitive carriers to S,T; original history disintegration
  to pi. Positivity, normalization and carrier distance must be preserved.
- Mechanism: weighted reflection derives conditional decay; total covariance
  isolates the remaining random-history response.
- Hypothesis removed: separate conditional mixing on the explicitly verified
  convex product class. Retained: physical dictionary, coercivity, exterior
  margin, outer connected estimate and complement control.
- Lost or unproved: actual two-mark outer response, fine observable transport,
  uniform constants beyond the declared bare class, continuum conclusions.
- Falsifier: nonproduct raw cutoff, failed full-stencil margin, nonuniform
  block row/column bounds, or an outer representation that loses mark distance.
- Next finite task: compare the actual composed two-mark numerator with the
  existing R I/II extraction packet; identify a precise marked identity before
  attempting bounds. Another scalar vacuum majorant or named adapter is not
  progress. No separate R inventory case or generic mixing wrapper is needed.
- Minimal formal task: none proposed until the physical dictionary closes.

Evidence levels: **literature** for selected source statements; **heuristic**
for this participating-agent analytic application; **speculative** for the
unproved physical outer transport; **formal**: none new. Canonical graph,
Lean declarations and evaluation routes are unchanged. Independence is
unverified; no peer-review or editorial decision is represented.
