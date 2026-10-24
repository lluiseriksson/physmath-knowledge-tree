# Two-mean singleton law, actual review and a Lorentzian barrier

Observed 24 October 2026. This supersedes the pending status of the two-mean hypothesis in the [earlier dated checkpoint](2026-10-24-stable-singleton-boundary.md), without rewriting that historical record. The new exact eight-page manuscript received one fresh-context Astra xhigh assessment: **AIRR importance 4.0/10, technical quality 8.0/10, minor revision**. All three requested changes subsequently passed a same-reviewer delta. That delta is not another full assessment or a new score. The earlier, different seven-page singleton manuscript retains its own 4.2 importance / 8.6 quality assessment; its minor delta also closed. Scores from different PDFs are not pooled or transferred.

The requested configuration and new conversation are recorded; technical workspace isolation, runtime identity, independent providers and human peer review are not certified. No AIRR acceptance, public assessment import or importance above seven is claimed.

## Sourced facts

- [Borcea–Brändén, Corollary 6.7](https://arxiv.org/html/math/0606360v6) supplies the degree-sized bivariate determinant representation used by the exact coefficient reduction. It is a deep cited input, not reproved here.
- [Gurvits–Klein–Leake, Theorem 5.11 and Corollary 5.13](https://arxiv.org/html/2311.09072v2) already imply positivity in the relevant gradient region. The new issue is the sharp value, not a new positivity domain. Their Theorem A.9 records the classical Hoeffding equalization antecedent.
- [Borcea–Brändén–Liggett, Proposition 3.5](https://arxiv.org/pdf/0707.2340v2) places finite determinantal measures with Hermitian positive-contraction kernels in the strongly Rayleigh class. The Hermitian condition matters; arbitrary matrices of inclusion minors are a broader class.
- [Brändén–Huh, Theorem 2.25 and the introductory characterization](https://arxiv.org/html/1902.03719v8) characterize Lorentzian forms using nonnegative coefficients, M-convex support and the signatures of quadratic derivatives. Theorem 2.10 preserves this class under nonnegative linear substitutions. These selected passages were read; the whole article was not audited.
- [Leake–Mohammadi Yekta, Question 1.7](https://arxiv.org/html/2609.39917v1#S1.SS2) asks for a global Jensen inequality for finite lattice-fiber counts of unimodular systems with integer barycenter. Their line inequality does not automatically answer that question. The statements and relevant introductory discussion were read; the general question remains unresolved in this checkpoint.

Source metadata and original synthesis do not authorize redistribution or training use of the linked papers. No exhaustive priority search is claimed.

## Graph-supported inference

The [small retrieved subgraph](../retrieval-two-mean-2026-10-24.json) uses probability, algebra and complexity as context. The research moves are preservation of the exact target and finding a barrier. Graph proximity proves neither the probability law nor the Jensen conjecture. Canonical nodes, edges and confidence labels are unchanged.

Dictionary: normalized coefficients correspond to event probabilities; gradients at one correspond to means; a determinant pencil turns the singleton coefficient into an adjugate trace; the broader Lorentzian class replaces stability by derivative-signature conditions. The exact target and means are preserved in the constructions below. The converse implication from Lorentzianity to stability is lost. The counterexample makes that loss concrete.

## Analytical result with dependent AI checking

For a normalized nonnegative bivariate real-stable PGF with means `(alpha,b)`, let `C(alpha,b)` be the infimum of `[x z^0]` over arbitrary finite degrees. In the positive region `0<alpha<2`, `0<=b<min(1,2-alpha)`, put

```text
eps=1-b, U=min(alpha,eps)
a1=min(U,max(0,(2alpha-b)/4))
H=eps*alpha-(2alpha-b)*a1+2a1^2

ainf=0                                      if alpha<=1
ainf=2b(alpha-1)/(2-alpha+b+
      sqrt((2-alpha+b)^2+4b(alpha-1)))        if alpha>1

J=exp(ainf-alpha)*[eps(alpha-ainf)+ainf(1-alpha+ainf)]
C(alpha,b)=min(H,J).
```

Outside that region the infimum is zero, including `alpha=0`. Degree at most two attains `H`; categorical–binomial products approach `J`. For `alpha>1,b>0`, the limiting exceptional trial has positive `x` mass. A naive pure-Poisson continuation is false, as the earlier checkpoint's exact witness already showed.

The new proof does not infer the universal inequality from a grid. Uniform convergence of the equal-block families forces any strict violation below both branches to attain a finite global minimum. Three feasible variations—compensating the exceptional mass, changing a pair of pure probabilities, and splitting one trial—restrict that minimum. An analytic estimate excludes all blocks of size at least five; three explicit polynomial factorizations exclude sizes two, three and four. The split uses unrestricted finite degree and does not prove a fixed-degree envelope.

The superunit scalar audit passed with 74 freshly reconstructed exact controls. The extension across mean one required an explicit correction: a discarded paragraph falsely inferred `alpha>1` and contained an incorrect identity. Both errors and a rational witness remain retained. The alternative direct feasibility argument supports the conclusion; the separate correction delta closed. Earlier Bernstein proofs and audits are preserved, rather than silently replaced.

A derivative-and-grouping consequence gives lower bounds for nonzero integer targets from neighboring factorial moments. It is a standard transfer conditional on the base law, not a sharp arbitrary-target first-moment theorem. A separately audited five-term cubic Lorentzian subfamily satisfies `B>=(1-b)^2`, with a unique stable equality example in that subfamily. Neither consequence proves an unrestricted Lorentzian extension.

## Actual assessment and correction boundary

The exact first PDF hash is `e9726803504df62784629d3710462f789f4fddc87ff3d84be17b49401454f0c1`. The full-review manifest is `16ee359b2e55522403b0774ea5a93d423770fae8f2fd620224dcff73cdcb6453`; root read the report and verified 39 identical work/archive files.

The reviewer supported the central stable-polynomial theorem and requested:

1. Explicit Hermitian positive-contraction kernels in the determinantal statement. A non-Hermitian inclusion-minor example refutes the broader reading.
2. Visible quadratic-vertex feasibility and the identity `Q-E=-(b-2delta)^2/8`.
3. An explicit explanation that the global minimum covers varying the exceptional parameter and appending a zero trial.

The corrected PDF hash is `ab07671365f0320dadb3b345ecc394291d5736cfe9b1587ad8336ecebe373240`. Its delta manifest is `0a4bf43c2b7a96f789a64d538de350314d3c647f0f760e7ad8d98326d5ab2e6b`; root read that report and verified 23 identical files. All requested changes closed, with no new score. The original review retains 86 passing and two failing reviewer checks; the failures were incorrect reviewer fixtures, diagnosed in a separate seven-check supplement. They are not relabeled as an all-pass original run.

The importance rationale was a technically serious but specialized exact probability law, without a demonstrated new approximation ratio or broad algorithmic consequence. Improving exposition alone is not grounds for resampling the same result until a higher score appears.

## Refuted hypothesis: replace stability by Lorentzian homogenization

Let

```text
f(x,z,w)=w^3*(221x^2+147xw+32w^2+411xz+189zw)/1000
X=(9999x+w)/10000, W=(x+33999w)/34000
G(x,z,w)=f(X,z,W), P(x,z)=G(x,z,1).
```

`P` has actual degree five, is normalized and nonnegative, and has exact means `(1,3/5)`. Its canonical degree-five homogenization is `G`, which is Lorentzian. Yet

```text
[x z^0]P = 16699438774659436771855887
           /113588560000000000000000000
         < 5/34 < 2/(5e),
[x z^0]P < 31/200 = H(1,3/5).
```

The rational comparison uses an upper bound for `e`, not floating eigenvalues or a numerical minimum. The [public exact checker](../certificates/lorentzian-singleton/README.md) reconstructs normalization, means, true degree, M-convex exchanges and every quadratic derivative signature after the substitution. A dependent research reconstruction separately verifies the base form and uses the cited nonnegative-change theorem. Its 23-file manifest is `f9633694289e125088dccece6310aa66a9fba86a53942324565510ccc7bbd8f3`.

The original lead `f(x,z,1)` had degree two: its canonical quadratic homogenization was not Lorentzian. The mean-preserving substitution is essential to fixing that scope problem. The original limitation remains recorded. The example is not stable, as its binary quadratic factor has negative discriminant. It therefore does not refute the stable law, and it does not refute value-at-a-positive-point capacity productization. The correct Lorentzian envelope and the smallest possible counterexample degree remain open here.

Earlier bounded probes found no violations in grouped Fano, weighted Fano and symmetric cubic families; 54 six-term cubic optimizations also found no strict violation. All those negative searches remain finite observations. The degree-five construction demonstrates why they could not certify an extension.

## Next hypothesis: global Jensen for unimodular fibers

The new target is Question 1.7 above: can line log-concavity be strengthened to the stated Jensen inequality for arbitrary finite distributions with integer mean? No reduction to the singleton law is asserted.

- Preserved: the exact unimodular system, finite fibers and integer barycenter.
- Missing: a proof for arbitrary support and weights, or an exact violating system and distribution.
- Falsifier: complete exact fiber counts and rational weights violating Jensen, with all finiteness and matrix hypotheses checked.
- Bounded computations completed: three small acyclic-flow systems; 90,000 sampled three-point distributions, with 1,824 integer centers; then 60 LP searches on their finite count tables. No strict lead was found. The LPs used floating log-count objectives only for discovery; no exact witness verification was invoked because no strict lead appeared. These searches are not a general theorem.
- Next analytical task: verify the proposed finite-support reduction and low-kernel-dimensional cases, compare their antecedents, and isolate what prevents a general injection or concave-envelope argument. These proposed partial results are not certified in this note.
- Minimal formal target: a finite rational barycenter identity or a small exact counterexample checker. No Lean declaration is added here.

## Formal result

None. Analytical arguments, exact finite arithmetic, dependent AI audits and a formal proof-assistant theorem are distinct layers. No canonical graph confidence is promoted by this update.
