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

## 31 October update: a fixed retained step and its adverse audit

This extends the same supporting synthesis. It does not restore the abandoned
conditional-to-global shortcut or create a separate paper. Four OLD source
cards were added at selected-statement reading depth, not as new publications:

| Primary source | Selected reading | Exact inspected bytes |
|---|---|---|
| [CMP109(1987),249–301](https://doi.org/10.1007/BF01215223) | Averaging, actual cutoff2.9, action2.11–2.12, old-action1.3/1.6/1.7 and current3.10–3.17 dictionaries | PDF5490078bytes; SHA256 `1c2d2e500fd1e6a1a7981fed259cc2354ebcf64e473fd564bfc3f2c4d7dfbe2a` |
| [CMP102(1985),277–309](https://doi.org/10.1007/BF01229381) | Complex domain172, Proposition9 and kernel190; special current/second-order norms | PDF3355501bytes; SHA256 `838056b5c578f81d058deb3d394c66d934690e3b94c6cf2956534ec6d211b541` |
| [CMP99(1985),389–434](https://doi.org/10.1007/BF01240355) | Printed421–429, hard-axial precision gap/decay statement428 | Held fusion container35847780bytes; SHA256 `00cc6b218dcf0e1c2884e135caa1d57b3591df036540b685e7440f30cbd4ff16` |
| [CMP96(1984),223–250](https://doi.org/10.1007/BF01240221) | Printed223,230–231, weighted contour distance2.46 | Same held fusion container; no separately acquired article-PDF hash |

The CMP99/CMP96 DOI metadata was cross-checked against the author's
[Rutgers CMP99 record](https://www.researchwithrutgers.org/en/publications/propagators-for-lattice-gauge-theories-in-a-background-field/)
and [Rutgers CMP96 record](https://www.researchwithrutgers.org/en/publications/propagators-and-renormalization-transformations-for-lattice-gauge-2/).
The source's lengthy kernel calculation before189 is explicitly omitted there;
the regular-background hard-gap proof is referenced/outlined. Both remain
literature inputs, not reproduced proof audits. No source PDF bodies are copied.

The [exact technical audit packet](../evidence/2026-10-31-retained-step-audit/README.md)
contains one real, unscored, separate-context review of six own notes. Requested
model/effort were `gpt-6-astra/xhigh`; actual routing and independence are
unverified. The parent authored the notes. The report found the conditional
mechanism viable but a **material incomplete full-density dictionary**. Full
objections and immutable inputs are retained. This is not a manuscript/PDF
grade, human peer review, editorial acceptance or a new assessed version of the
parent's subsequent repair.

### Exact law and density corrections

At the NEXT retained step, source2.12 contains the old action evaluated at
`U1(V(x))`; it is not the first bare Wilson density with a renamed background.
At `k=1`, source1.3/1.6 gives

```text
E_old,1(U)=-beta1(g0) A(U)+mathcal E1(g0,U)-mathcal E1(g0,1),
1/g0^2=1/g1^2+beta1(g0).
```

Here `mathcal E1` explicitly includes the previous `log Z^(0)` under source1.6's
aggregated activity convention. That old normalization depends on the current
raw variable through `U1(V(x))`; it is not a factor constant outside the integral.
The negative log density has signs

```text
H_next(a)=g1^-2 S(g1 a)+beta1(g0) A(U1(V(g1 a)))
          -mathcal E1(g0,U1(V(g1 a)))
          -log J_sel(g1 a)-log Haar(R_h(C g1 a)),
```

up to constants in a. The beta-action contribution was missing from the
submitted complete Hessian budget. Its raw Hessian is
`g1^2 beta1(g0) Hess_x A(U1(V(x)))`; the source bounds beta on its admitted
coupling interval. Local action chains and exponential reconstruction envelopes
would bound its weighted norm by `g1^2 B_beta C_A,L`. This is the parent's
explicit repair, not a second review.

The actual source2.9 cutoff is exactly

```text
product over FREE bonds b of 1{|g1 a_b|<epsilon_cut}.
```

The selected correction hD vanishes on those coordinates and C is identity
there. Selected outputs have induced bounds; they are not independent
equal-radius hard indicators. Keep the product of convex Lie bond factors and
block-scalar spatial weights. The older note's literal all-reconstructed-bond
cutoff definition is withdrawn. A sufficiently smaller product cutoff can
place the complete reconstructed image in the uniform source charts through
explicit finite norm bounds; it does not require a convex nonlinear image.

For the continuing deduction, the smaller next law is **additional conditioning
of the existing next retained law**, retaining its original old E1 and original
first conditional means. It does not bound the removed annulus or the previously
fixed maximal-cutoff law. Its support must actually remain in the original
first admissible background class; normalization alone cannot establish this.

### Mechanism and retained hypotheses

The source hard-tree precision gap cannot be transferred by identifying its
coordinates with the averaged-soft ones. On the real constrained critical
background, let T be the root-fixed infinitesimal gauge map and G the linearized
averaged contour map. With `G T=I`, hard-tree representative B_h and `mu=G B`,

```text
B=B_h+T(mu-G B_h).
```

The slice term `G B_h` stays. Gauge-null mixed terms vanish for the INTRINSIC
constrained physical Hessian at a stationary constrained background, including
both source J/constraint-curvature corrections. They need not vanish for an
arbitrary ambient Wilson Hessian. With actual finite reconstruction norms,
the source hard gap yields a symbolic positive soft gap at fixed step. Real
unitary transports are used; arbitrary complex-background l2 coercivity is not
inferred.

The common complex INPUT neighborhood and kernel190 allow Cauchy bounds on
second/third reconstruction derivatives. Keep the complete source current norm.
At a FIXED external reference background on the Landau subspace, source272 gives
`P1 H=Delta H-D*D H+lower-order local terms`, linking the two second-order kernel
bounds to the current norm. The reference operator is not varied in those input
derivatives. The source OUTPUT Cauchy fraction273 is alpha2/3, not alpha2/4;
the erroneous attribution in an original input is preserved with its correction.
The smaller quarter contour remains a valid conservative choice.

For an activity composed with the nonlinear background, keep BOTH terms
`D2F[H_b,H_c]+DF[H_bc]`, with the actual J substitution in F. Complex Cauchy and
input symmetry give exponential maximum-distance tails; rooted polymer
incidence/entropy sums turn them into weighted row/column bounds without a
volume multiplier. A positive entropy reserve is essential. For the physical
action retain all third chains, including `f' H_bcd`; Taylor along the physical
raw window costs `C_R,L epsilon_phys`, not uniformly O(g1) merely because
fixed-raw expressions vanish as g1 tends to zero.

The repaired candidate budget is

```text
||Hess H_next-Q_soft||_alpha
 <= C_R,L epsilon_phys
    +g1^2(C_Haar,L+C_sel,L+C_activity,L+B_beta C_A,L).
```

Its constants are fixed-step existence constants, not extracted numerical
values. Source-admissible odd L>11, d=4, the source group/regularity class,
M/kappa/coupling restrictions, uniform inverse/complex margins and compatible
background inclusion all remain. If this budget fits the positive Gaussian
margin and its exponential weighted moment, reflected covariance accommodates
nonlocal observable gradients; finite support at the next scale is unnecessary.

### Two-level scope and assessment boundary

Keep the ORIGINAL normalized first means and conditional covariance
`a_p(V),a_q(V),k_pq(V)`, formed from the complete actual inserted preimages.
For the joint law `mu0,V(dA) nu1,W^small(dV)` at fixed next background W,

```text
Cov_joint(O_p,O_q)=E_nu1,W^small k_pq(V)
                  +Cov_nu1,W^small(a_p(V),a_q(V)).
```

This is a normalized two-level law with an explicit extra retained event, not
the full physical history disintegration. If the original first covariance
bound is uniform on its support, its expectation keeps that bound. If the
complete original first means have the derived localized angular response,
local next coarse reconstruction yields nonlocal raw gradients of size
`g1 A_L exp(-sigma Dcoarse(p*,b))`. Under the repaired next curvature/reflection
hypotheses their covariance would be `O(g1^2)` with an exponential coarse
separation tail. No g0 factor is inherited across running couplings.

The review did NOT assess the prior first-mean gradient/reflection proofs or
certify a particular background/window. Their exact score, normalization,
original-gauge response, product factors and source margins are separate
participating-parent dependencies. Thus this transport implication must not be
called fully verified by that six-note review. It is not a global fine-observable
bound, an all-scale result or control of the outer W/history covariance.

The abandoned shortcut remains abandoned. Falsifiers include omitted beta/logZ,
wrong product cutoff, incompatible first/next laws, lost source scale/current
factors, singular inverse margins or an insufficient weighted entropy reserve.
Next work should certify actual compatible-class inclusion and the original
first-mean/reflection dependencies before promoting physical transport; no
additional paper for the tower identity or another scalar wrapper is warranted.

Evidence levels remain **literature** for selected primary statements,
**heuristic** for the source-dependent parent deduction and repaired mechanism,
**speculative** for actual physical/global closure, **formal**: none new.
Canonical graph, Lean declarations and evaluation routes are unchanged.
