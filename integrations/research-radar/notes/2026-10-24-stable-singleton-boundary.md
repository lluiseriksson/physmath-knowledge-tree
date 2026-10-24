# Stable singleton-avoidance: exact boundary coefficient and audit limits

Observed 24 October 2026. This records a new mathematical proof checkpoint and its real assessment, not an AIRR acceptance. A full fresh-context Astra xhigh review of the exact seven-page candidate1 assigned technical quality **8.6/10** and AIRR importance **4.2/10**, recommendation **minor revision**, with no material mathematical objection found. Its two requested clarifications concern the finite-slot quantifier and the univariate Bernoulli factorization. Candidate2 contains those explanatory changes and is awaiting same-reviewer delta closure, not a new score. The previous, different TSP architecture manuscript received technical quality **8.5/10** and AIRR importance **3.4/10**; that result remains preserved.

The complete review report hash is `919b48e945f567736bca1ec9281c46ffa0e1de721a97a423da3cb8ca13a4096d`; its39-payload-file manifest hash is `3eaded3474ae4a0f41cbaaf17ad5be97350251f2a69ad3c1ef4cfd02e79f8e57`. Root read the full report and verified41 identical files in work and durable archives. The context was new but the filesystem and provider were shared; no runtime isolation, human independence or independent provider is certified. The requested importance threshold is not met.

## Sourced facts

- Borcea–Brändén, [arXiv:math/0606360v6](https://arxiv.org/pdf/math/0606360v6), Corollary6.7, supplies a real symmetric determinant representation of a bivariate real-stable polynomial, with matrix size equal to its exact total degree. The two variable matrices are positive semidefinite; the constant matrix is only assumed symmetric in that source. The argument below derives its positivity from nonnegative coefficients. The representation theorem is cited, not reproved.
- Gurvits–Klein–Leake, [arXiv:2311.09072v2](https://arxiv.org/html/2311.09072v2), Theorem2.1, Corollary2.2 and selected sections3/5, give gradient-based capacity bounds and their coefficient consequences. Their capacity productization is an antecedent, not automatically a statement preserving a specified coefficient exactly.
- Borcea–Brändén–Liggett, [arXiv:0707.2340v2](https://arxiv.org/pdf/0707.2340v2), Propositions3.1 and3.5, give the closure properties and the strongly Rayleigh property of positive-contraction determinantal laws used below. These passages were checked; the entire paper was not audited.
- Hoeffding's [1956 paper](https://www.jstor.org/stable/2237378) is the classical antecedent for extremizing Bernoulli sums by equalization. The current proof gives its needed pairwise argument explicitly. Root consulted the introduction/summary of the original report, not all its general extremal theorems.
- Gurvits–Leake, [arXiv:2609.21083v2](https://arxiv.org/html/2609.21083v2), introduction1.1–1.4, studies homogeneous squarefree coefficient minimizers near doubly stochastic data. These selected statements were compared, not the whole proof or its bibliography. A difference in targets is not a certificate of novelty.

No exhaustive frontier or worldwide-priority search is claimed. Bibliographic metadata and this original synthesis do not authorize redistribution or training use of linked full text.

## Graph-supported inference

The [retrieved canonical context](../retrieval-stable-singleton-2026-10-24.json) starts from probability, algebra and analysis. The spectralize move suggests translating a boundary coefficient to an adjugate trace. The current graph has no specific node proving this real-stability extremum: its nearby probability/operator topics are context only. The canonical59 nodes,115 edges and confidence labels remain unchanged.

Dictionary: PGF coefficients are event probabilities; gradients at one are means; a determinant pencil yields positive matrices; the target coefficient becomes `Tr(adj(C) A)`; diagonalizing `C` makes this trace insensitive to off-diagonal entries of `A`. Preserved: normalization, both means and this one coefficient, including singular `C`. Lost: the rest of the polynomial and any automatic higher-coefficient or multi-positive-target claim.

## Analytical result with dependent mathematical audit

Let `P(x,z)` be nonnegative, normalized and real stable, of any finite degree, with gradient `(1,b)`. Let `C(b)` be the infimum of `[x z^0]P`. Put

```text
gamma = 4 - 8/e
beta = (sqrt(gamma^2+4gamma)-gamma)/2 = 0.6274840028048535...

C(b) = (1-b)/e                 for 0 <= b <= beta
       (1-b)/2 - b^2/8         for beta <= b <= 2/3
       (1-b)^2                for 2/3 <= b <= 1
       0                      for b >= 1.
```

This is a sharp infimum over arbitrary finite degrees. The low phase is a Poisson limit and is not attained in finite degree when `b<beta`; degree2 attains the other two phases and their common boundary. This does not solve general multivariate prescribed-gradient coefficient minimization.

The proof has four distinct steps:

1. Exact productization for this boundary coefficient. Degree-sized representation and nonnegative coefficients force `A+B>0`, positive determinant sign, and `C>=0`. Normalize `A+B+C=I`; in an eigenbasis of `C`, replacing `A,B` by their diagonals preserves both traces and `Tr(adj(C)A)`. It preserves exact degree only with nonconstant affine factors. A weak converse allowing constant factors at fixed exact degree would be false and was explicitly corrected in a separate addendum.
2. A linear program at fixed factor constants leaves at most one factor containing both `x` and `z`. Merge the pure-`z` factors and use concavity in their total mass. The remaining pure-`x` probabilities equalize at a minimum by the classical pairwise method. This leaves

   ```text
   inf_{k>=1} min_{0<=a<=eps} F_k(a), eps=1-b,
   F_k(a)=(1-(1-a)/k)^(k-1)
          *[eps(1-a)+(1+1/k)a^2-a/k].
   ```

3. An analytic logarithmic bound and an exact Bernstein certificate prove, for **every** integer `k>=2`, `F_k>=eps^2` when `eps<=1/3` and `F_k>=eps/e` when `eps>=1/3`. A finite numerical grid cannot establish this step. The certificate has56 rational coefficients, minimum51/40, over the entire unit square.
4. The `k=1` quadratic and the Poisson limit give the displayed curve. Explicit categorical products prove sharpness. Grouping disjoint blocks extends the bound to strongly Rayleigh subset laws; independent two-element positive-contraction kernels realize all extremal constructions determinantly.

The two stages of targeted Astra xhigh auditing passed. Root read all reports and rehashed14 then21 identical work/archive files. These are dependent AI audits with reused context and a shared filesystem, not human review, formalization, full-paper grades or priority certification. Audit manifest hashes are `75fc8018363089ee3922d693955d44e80884f83c63b000986293353b8fb5cb25` and `408b497a61ef072d220b74a56c3feb70cd98d3d880a8b65d33c7ff8fe2eea3a9`.

## Exact certificate artifact

The [certificate and standard-library checker](../certificates/stable-singleton/README.md) contain the original rational data and a complete polynomial reconstruction. The checker rejects an altered positive entry and a truncated table. It checks an algebraic positivity certificate; it does not by itself establish the analytic reduction or novelty.

The auditor's first additional implementation stopped on structural equality of two algebraically equivalent SymPy expressions. Its original script and failure were preserved; a second version compared the expanded difference and passed. That implementation incident is not a mathematical counterexample.

## New hypothesis: two means and degree bounds

Root has a separate candidate for means `(alpha,b)`, `0<alpha<=1`. Its degree-at-most-D variational reduction passed a separate dependent mathematical audit; the proposed closed envelope below is still undergoing its own audit:

```text
eps=1-b
a=min(eps,max(0,(2alpha-b)/4))
min{alpha*eps*exp(-alpha), alpha*eps-(2alpha-b)*a+2a^2}.
```

This extension is **not** part of the frozen seven-page manuscript and its closed envelope is not certified by the earlier audits. The finite-degree audit manifest is `91bb2c2dbb47def142e2ee3a24a7c86121f66fb14b08e72a7709d15a66c71731`; root read its report and verified12 identical archive files. Three exact polynomial certificates for proposed all-block-size comparisons have441,1530 and16 coefficients; a separate standard-library implementation reconstructs their identities and rejects six corrupted inputs. Those checks do not replace the pending mathematical audit of their use. An earlier weaker certificate route did not cover the two-trial boundary and remains preserved. No score attaches to this extension.

A naive continuation beyond `alpha=1` is already **false**. At means `(13/10,3/10)`, the stable normalized product `(x/10+3z/10+3/5)*(247/250+3x/250)^100` has target coefficient `(247/250)^99*(41/50-3/2500)`, approximately0.2478080146. Exact rational arithmetic and a bounded exponential series show that it is below both the naive pure-Poisson branch and the degree-two branch. This does not refute the candidate restricted to `alpha<=1`. It exposes a new mixed categorical-Poisson limiting mechanism for `alpha>1`; the corrected global lower bound remains unproved. Finite numerical searches support neither a universal theorem nor an importance score.

- Falsifier: a feasible normalized stable product below the proposed envelope, a failure of the scalar degree bookkeeping, a wrong denominator sign, or a failed analytic implication of the three certificates.
- Abandonment condition: a material counterexample or a primary source already proving the same statement without an added substantive result.
- Minimal Lean target: the finite Bernstein partition-of-unity bound for the56-coefficient rational polynomial. No Lean proof has been added or claimed.
- Next task: finish the generalized all-size audit and the minor-revision delta, then test the mixed-Poisson lower-bound conjecture beyond mean one without transferring the existing score.

## Formal result

None in this update. Exact rational computation, an analytical proof with dependent AI checking, a new hypothesis and a checked Lean declaration are different evidence layers. The AIRR importance target remains unverified.
