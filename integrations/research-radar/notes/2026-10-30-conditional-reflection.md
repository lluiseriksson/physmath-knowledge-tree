# Conditional reflection and the outer-history boundary

**31October admission audit1547:** the conditional near-flat soft-gap and whole-original-cutoff argument is supported, with symbolic fixed-scale constants and explicit source/geometry hypotheses. The generic tagged-Gaussian application needs two repairs: an actually symmetric covariance and a zero-tag real reference supported in the same localization region. [Full adverse report, exact inputs and repairs](../evidence/2026-10-31-first-admission-audit/README.md) are preserved. This assesses notes only, not a manuscript/PDF; full connected activities, exact historical law correspondence and the maximal next marginal remain open.


**31October correction (audit1524):** the earlier1489 original-gauge return
identity is invalid as written and is withdrawn. The scalar mean-response
estimate survives conditionally through a different whole-integral pullback
on the FULL boundary-free branch. [Full adverse report and exact inputs](../evidence/2026-10-31-first-score-audit/README.md)
are preserved; later original-gauge interpretations in this historical note
must be read with the correction below. No physical/global theorem follows.


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


## Three-note reflection audit and explicit source specifications

The separate [audit1516 packet](../evidence/2026-10-31-reflection-framework-audit/README.md)
contains the full report, exact1473–1475 inputs, original assessment bytes and
all objections. It accepts the **conditional finite-dimensional analytic
implication** under the stated product domain, C2 real potential, uniform
positive Hessian, finite Hessian range, both block sums and full Euclidean
observable Lipschitz bounds. Weighted corner signs, Schur conjugation, dual
gradient orientation, covariance normalization and final2/m constant were
checked without finding a material error or hidden volume factor.

Requested configuration was GPT-6 Astra/xhigh; actual runtime routing/effort
and scientific independence are unverified. Inputs were authored by the
participating parent and reviewed in a separately assigned context. This is
not a peer-review claim or an assessment of this evolving synthesis/PDF.
There is no numerical grade. The adverse six-note1501 report above remains
intact; its subject and the present three-note subject are different.

Two minor specifications are adopted from the full report:

1. Slominski's printed theorem uses a square coefficient/driver. For n raw
   coordinates, use state(A,q) in U x R, driver(s,B_s), first n coefficient
   rows(-gradH,sqrt(2)I), final row zero. The auxiliary q remains zero and
   boundary normals have zero last component. Source domain(A),(B) constants
   inherit those of U, and projection gives the desired reflected SDE.
2. A finite disconnected graph can have infinite distances. Constant
   observables have zero covariance. Otherwise use positive weights
   exp[-alpha min(dist(b,S),M)] and then M->infinity. This retains the same
   interaction-block conjugation estimate and gives zero covariance across
   disconnected components. Treat the diagonal R_H=0 case separately and
   keep the interpolation parameter fixed during each diffusion time s.

These are subsequent parent specifications in the synthesis, not a newly
reviewed manuscript version. The review does **not** verify actual physical
product cutoffs, the hard-to-soft gap bridge, full inside/exterior margins,
raw finite-range action/Jacobian, primitive constants or the nine1485–1493
first-mean/source/gauge/metric notes. Those retain their prior evidence level.

### Exact first normalization and a sufficient global current criterion

Subsequent selected-source readings clarify the remaining dictionary.
CMP109 printed260 Eq1.4 defines its Gaussian integral WITH the linear
average delta constraint. Splitting selected and free coordinates in
Ms+Na=0 gives z0=|detM|^-1, Ca=(-M^-1Na,a), and

```text
ZG_source=C_norm z0 IG_free,
Z_full,delta=z0 I_delta=ZG_source E_gamma[1_K exp(v-g0^-2 Vrem)].
```

Use matching measure conventions throughout. The aggregated Gaussian/activity
convention already allocates z0: it must not be added a second time. No source
omission or nonconstant-z0 claim is made. Background-only terms cancel from
first normalized score covariances while still belonging in the next marginal.

CMP109260 Eq1.2 explicitly includes both fine plaquette regularity and current
J regularity, and cites CMP102277–279 Theorem1 for a sufficient SMALL COARSE
INPUT criterion. On the boundary-free global first-minimizer branch, that
literature theorem supplies both bounds when epsilon_V<=a1 and
B3 epsilon_V<=epsilon_reg<=a0. Its proof was not audited here. For an
independently admitted next reconstruction with original-gauge coarse-link
response K_V epsilon_next, four-link telescoping gives
rV<=r_base+4K_V epsilon_next. Thus

```text
tV=min(a1/2,epsilon_reg/(2B3)),
r_base<tV/2,
epsilon_next<=tV/(8 max(1,K_V))
```

is a sufficient symbolic global admission criterion. K_V must not be obtained
circularly by assuming the desired first current class. Local determining
fields still require the source's actual mixed-scale/boundary condition7;
global admission does not certify those localized hypotheses. Prior matched
first-cutoff prefactor ambiguity, inner margins and linked couplings remain.
No numerical constant, event probability, arbitrary-background or all-scale
certificate is supplied.

### What the two-level implication still needs

Let E depend on NEXT free raw coordinates only. The exact joint law
mu0,V(dA) nu1,W(dV|E) preserves the original first cutoff and original means.
If the uniform first conditional and actual nonlocal first-mean estimates
hold on that whole event, the repaired next curvature plus deterministic
anchor geometry D0>=L D1-cL give a conditional C_L g1^2 exp(-lambda D1)
bound. Coupling comparison g0^2<=(3/2)g1^2 is explicit, not a relabeling.
The tower identity itself proves none of those physical estimates.

For real normalized traces |f|,|g|<=1, p=P(E), q=1-p, the exact Bernoulli
covariance tower gives

```text
|Cov_P(f,g)-p Cov_(P|E)(f,g)| <= q+4pq <=5q,
|Cov_P(f,g)-Cov_(P|E)(f,g)| <=6q.
```

A separation-independent small q leaves a separation-independent floor.
Complement connected estimates or appropriate distance-sensitive control
are still required, together with the outer W covariance of means. Thus the
global shortcut remains **abandoned**, and the next substantive task is the
actual source-specific score/gauge/metric application, not more generic
reflection constants or separate auxiliary papers.

Levels: **literature** for inspected primary statements; **heuristic** for
participating-parent source/application and threshold compositions;
**speculative** for physical complement/history/global closure; **formal**:
none new. The unscored analytic review is an additional assessment, not a
graph-confidence promotion. Falsifiers remain a coupled actual cutoff,
failed uniform Hessian/block/chart bounds, circular background inclusion,
incorrect marginal normalization or erased outer response.


## Material gauge-fiber correction and the FULL scalar repair

The [single eight-note audit1524](../evidence/2026-10-31-first-score-audit/README.md)
rejects a specific source/application identity in1489. The relative Landau
construction normalizes averages of a gauge transformation; it does not in
general fix its values at coarse roots. The source expressly gives a changed
prescribed-average fiber. A root-fixed contour return cannot automatically
restore the originally prescribed averages, so its three-term derivative
was not proved to be the actual derivative of U1(V). Its later use as the
ORIGINAL-GAUGE tangent is withdrawn. This is a material correction, distinct
from the already repaired input-cell factor and finite-carrier check.

The relevant old papers are distinct:

- [Balaban, CMP99(1985),75–102](https://doi.org/10.1007/BF01466594),
  selected77–83, especially80–82 Eq1.27–1.38, states the gauge/fiber distinction.
- [Balaban, CMP98(1985),17–51](https://doi.org/10.1007/BF01211042),
  selected inverse-gauge formulas inspected in audit1524, has nonidentity
  coarse-root factors in general. The held fusion's following page is blank;
  the historical17–52 reference/report is retained unchanged. It is not a
  second article or a newly published result.

The exact input notes and full adverse report remain unchanged. Requested
configuration was GPT-6 Astra/xhigh; actual runtime model/effort and scientific
independence are unverified. A separate assigned context is not certification
of independence or peer review. No numerical grade or manuscript/PDF
assessment was made. The report's Section5 supplies the DIFFERENT repair;
it does not validate the incorrect original identity.

### The equality is for the complete normalized integral

On the strictly FULL boundary-free original first branch, extend the same
bare retained numerator and denominator to a background U by the actual
source formulas, denoting the normalized inserted mean by widehat a_p(U).
CMP1191.17 simultaneous covariance, the ORIGINAL chi^(0) product cutoff
from1.18 and strict selected-chart equivariance imply

```text
widehat a_p(U^u)=widehat a_p(U),
a_p(V(theta))=widehat a_p(W_theta),
W_theta=exp(i eta Hcal(B(theta))) U0.
```

The real adjoint change acts orthogonally on each independent raw block,
preserves its norm ball and has absolute Jacobian1. Selected/free labels,
original thresholds and the true reconstructed fine plaquette remain the
same. All lift, nonlinear correction, current, Jacobian and exposed coarse
frame arguments transform together. Keeping an unrelated original coarse
frame while changing only U would not be this extension.

The relative Landau W_theta is gauge-related to the physical minimizer even
though it need not have the original coarse averages. Differentiate the
WHOLE normalized equality with raw A fixed on that extension:

```text
partial_theta a_p=E_W(partial_theta O_p)+Cov_W(O_p,partial_theta F).
```

These two summands are not individually asserted equal to the original-gauge
summands. Their combined scalar identity handles the parameter-dependent
coordinate connection. No derivative/locality estimate for the unknown
original-gauge return is used. At each fixed parameter block orthogonal
conjugacy transfers the admitted raw Hessian, block norm and carrier bounds.

### What the audit verifies and what remains admitted

The exact first insertion, original full product domain, fixed-raw score
identity, selected lift/correction derivatives, finite bare action/Jacobian
carriers, corrected source input-cell weighting and ambient metric
convolution were checked at the report's stated source-reading depth.
With the ACTUAL source Landau tangent, the local score factor C_S/g0
cancels the primitive gamma_L*g0. Rebase at each admissible V and retain
common margins to obtain the repaired conditional scalar target

```text
|partial_theta_c a_p(V)|<=C_L exp[-lambda Dfine(p,c)],
lambda=min(alpha,(delta0/8)/L)/2.
```

Eq189/190 remains a stated literature kernel input; its omitted proof was
not reproduced. A common positive physical Hessian margin and strict
source/implicit-inverse margins on the ENTIRE original cutoff remain
substantive admissions. The report does not prove their uniform availability,
class probability or a numerical background/window certificate. There is no
negative coupling loss from the score calculation on that common-margin
class; deterioration of the margins cannot be hidden in its constant.

With frozen exterior raw data, a parameter-dependent adjoint pullback also
changes that exterior path. The FULL repair therefore does not certify
partial-history/boundary fibers,1493next covariance, removed events, outer
W/history covariance, iteration or a global physical result. The earlier
adverse1482/1501 reports and distinct1516 assessment remain in force at
their own scopes. This new synthesis itself was not the assessed manuscript.

Mechanism: whole retained integral covariance replaces a false pointwise
background identity. Falsifiers are an untransformed numerator/frame/lift,
noninvariant surviving cutoff, fixed-exterior path silently moved, wrong
source kernel/scale dictionary or failed common physical margin. Levels:
**literature** for inspected original statements, **heuristic** for the
source/application argument and subsequent synthesis, **speculative** for
physical/global closure, **formal**: none new. The global shortcut stays
**abandoned**. Two historical bibliography cards and one exact assessment
packet are supporting knowledge, not new papers or separate results.
