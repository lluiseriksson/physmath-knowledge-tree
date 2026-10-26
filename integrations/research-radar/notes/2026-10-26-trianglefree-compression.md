# Removing the cycle restriction in trace compression

26 October 2026 local time. This is an audited finite-dimensional argument and a
research checkpoint, not a formal proof, a priority certificate or an AIRR score.
The canonical graph and its confidence labels remain unchanged.

## Evidence layers and hypothesis removed

- **Literature:** [Araki's trace inequality](https://doi.org/10.1007/BF01045887),
  [Vuong–Osaka 2610.11021v1](https://arxiv.org/abs/2610.11021v1), and the
  comparison/bipartite/cycle results of
  [Laurent–Piovesan](https://arxiv.org/abs/1312.6643) are attributed dependencies
  and antecedents. Selected sections were read; not every proof was audited.
- **Derived argument:** the support-projection identity below removes the cycle
  or cactus assumption from the preceding [candidate](2026-10-26-norm-compression-gluing.md).
  It uses only triangle-freeness, which is sharp for the stated compression at
  each fixed exponent above two. An Astra xhigh argument audit found no defect.
- **Heuristic/speculative:** importance, priority, extensions between exponents
  one and two, infinite-dimensional consequences and channel applications remain
  unresolved. None is promoted to `formal` or inferred from graph proximity.
- **Formal result:** none added. Exact finite checks are not a Lean proof.

## Universal statement and a support identity

Let `P_p(G)` mean that `[Tr|H_ij|^p]` is positive semidefinite for every finite
complex positive block matrix `H` supported on `G`, with arbitrary block sizes.
Support means containment: entries on allowed edges may be zero. Traces are
ordinary unnormalized traces. For every fixed `p>2`, the derived criterion is
that `G` is triangle-free. The sufficient direction also gives complete
positivity of the scalar compressed matrix, in the matrix-factorization sense.

The mechanism is elementary support orthogonality. For positive matrices `P_i`,
write `D_ij=Tr(P_i P_j)`, let `E_i` project onto the range of `P_i`, and suppose
`D` has triangle-free support. The neighbors of any vertex have pairwise
orthogonal supports. Hence `F_i=sum_(j in N(i)) E_j` is a projection. For real `x`,

```text
x^T M(D) x = sum_i x_i^2 ||(I-F_i) P_i||_HS^2
              + sum_edges ||x_i P_i E_j - x_j E_i P_j||_HS^2.
```

Here `M` keeps the diagonal and negates off-diagonal entries. The cross trace is
`Tr(E_j P_i E_i P_j)=Tr(P_i P_j)`; no commutation between neighboring projections
is assumed. Summing the edge budgets restores the full diagonal. Thus `M(D)>=0`.

The audit suggested a direct completely positive decomposition as well. Allocate
to edge `ij` the diagonal budgets `a=Tr(P_i^2 E_j)`, `b=Tr(P_j^2 E_i)`.
Hilbert–Schmidt Cauchy–Schwarz gives `D_ij^2<=ab`. Every nonnegative symmetric
matrix `C` with the same diagonal as `D` and `C_ij<=D_ij` is the sum of the
embedded nonnegative positive `2x2` blocks `[[a,C_ij],[C_ij,b]]` and residual
nonnegative singleton budgets. Each block has an explicit nonnegative factor.
This removes the classical comparison criterion as a necessary dependency of
this particular conclusion.

For `H_ij=X_i*X_j`, put `P_i=X_i X_i*` and `r=p/2>=1`.
The trace Araki–Lieb–Thirring inequality gives

```text
C_ij = Tr[(sqrt(P_i) P_j sqrt(P_i))^r] <= Tr(P_i^r P_j^r) = D_ij,
C_ii = D_ii.
```

The positive powers keep zero products and range projections. Apply the support
identity and edge decomposition to `P_i^r`. This proves the sufficient direction
for all triangle-free graphs, not merely cycles or bipartite graphs. For `p>2`
the cited Vuong–Osaka three-block example embeds on any triangle and has a
negative compressed quadratic form. That local example is attributed, not new.

## Other endpoint and limits

A separate written endpoint argument gives `P_1(G)` exactly when `G` has no even
cycle: the negative-coefficient edges of each real test vector form a bipartite
forest, on which polar factors can be aligned recursively. A signed even-cycle
scalar Gram matrix gives necessity. At `p=2` compression is always a
Hilbert–Schmidt Gram matrix. The complete manuscript includes these endpoints;
the preparatory audit above covered only the triangle-free argument for `p>=2`.

The interval `1<p<2` is not classified. ALT reverses direction there. Do not
transfer the positive or odd scalar entrywise-power statements of
[Guillot–Khare–Rajaratnam 1504.04069v2](https://arxiv.org/abs/1504.04069v2)
to arbitrary-block trace compression. In particular,
`Tr|B|^p` is generally not `(Tr|B|^2)^(p/2)`.

## Checks, review and falsifiers

The [exact finite verifier](../checks/trianglefree551-control.py) checks every
quadratic-form coefficient on rational noncommuting factors supported on `C5`
and the Petersen graph, exact positive LDL pivots at `p=4`, and a triangle
negative control. Its [output](../checks/trianglefree551-control.json) is finite
evidence only. Run with Python and SymPy 1.14; optimized Python mode is refused.
This is not presented as a ready computational campaign or Research Capsule.

The preparatory Astra xhigh audit also tested a complex case with noncommuting
range projections, a zero factor and singular comparison matrix. A root replay
passed. The first full review of the complete four-page manuscript is now closed:
PDF SHA256 `256afe881a85773d989f7a9422e4874044fb8390c10d1c748e4c72b640e412b8`.
The private Astra xhigh assessment is **4.0 overall, 6.0 technical quality and
3.5 importance**, with a favorable specialist-note recommendation and minor
attribution/context/package observations, without a mathematical defect found.
These are separate scales, not a public AIRR aggregate or editorial acceptance.
Report SHA256: `48824531c6b80f8af9d4c74d3e6e550264ce2f142b38b52764cae854e0280df0`;
verdict SHA256: `f794a21faeeb86851ca294610921ecb969c454891b8ad29f8719094a30daa0fb`.
The root checked the preserved manifest and all 63 C/D files.

The conversation began without development history or other reports, but its
required manifest exposed the preparatory-audit summary. Individual source,
README and scale hashes were checked after their initial concurrent reading;
PDF and manifest hashes were checked before reading. All matched. The model
family helped prepare the argument; shared filesystem, incidental exposures,
runtime identity and independence limitations remain declared. No review was
restarted for a desired score.

A corrected four-page draft addresses the bibliography and lists its supplement
hash in its manifest. PDF SHA256:
`ecee3925aac79963a82e625e0d630d49322616dad2413d66c67e7ed8d83a5cbe`.
The same reviewer's correction-only delta closed all three minor observations
without detecting a regression. Its favorable private closure is not another
full assessment: no old score is transferred to this changed PDF and no new
score was requested or received. Delta-report SHA256:
`13d567e05dca4e75c612b5c39794ebcb2c31a1dfa4b8e8daa97b24ed41dfd54f`.

Abandon or correct this route if the universal identity, range-projection
orthogonality, ALT parameter map or triangle witness fails, or if an exact
antecedent makes the proposed contribution a reproduction. A negative keyword
search is not novelty evidence. A numerical search on `C5` at `p=3/2` was
terminal and inconclusive: six local runs, two converged, four iteration limits;
no theorem or restart follows from the absence of a negative sample.

## Directed source refresh

[Source observations](../checks/trianglefree551-sources.json) pin primary-source
hashes and reading scope. OpenAI/math HEAD was unchanged. Four new DeepMind
catalogue commits were inventoried; a selected AME(4,6) declaration now links an
external formal proof, but its local `sorry` placeholder is not a checked proof.
The older mathematical existence result is not a new discovery here. Anthropic,
AIRR, ai.viXra and one page of public author-repository metadata were inventoried,
not exhaustively read. The pinned Bollobás–Nikiforov repository's introductory
theorem statements were read; no build or full proof audit is asserted.

## Specific antecedents and the next research decision

The review identified more specific attributions than the initial bibliography:
[Li–Zhang Theorem 1](https://arxiv.org/abs/1407.0331v3) gives a polar proof of
Drury's three-block trace-norm result;
[Drton–Yu Example 5.2](https://arxiv.org/abs/1001.3195v2) and GKR Proposition4.3
already supply scalar even-cycle failure. The cut-forest and general
triangle-free extensions must be distinguished from these known ingredients.
[Sra 2610.15889v1](https://arxiv.org/abs/2610.15889v1), Theorem1.3, is a
contemporary three-block treatment. Its partition inequality is a further
primary-source lead, not a proved channel-additivity bridge.

The [2026 GKR corrigendum](https://doi.org/10.1016/j.jcta.2026.106222) corrects
a singular-value/spectral-radius step in the original scalar bipartite proof and
provides a replacement; the current compression proof does not use that step.
Correction text was read through publisher indexing, with incomplete mathematical
rendering; its replacement proof was not fully audited. The explicit edge
decomposition belongs to established factor-width-two terminology, as in
[Johnston–Moein–Plosker](https://arxiv.org/abs/2405.11556v2). No minimal-factor
count or new definition is claimed.

A distinct bounded exploration of `C6`, `p=3/2`, two-dimensional complex blocks
used seed554, 200 random samples and four local starts. One converged and three
stopped at function-evaluation limits. The smallest observed normalized eigenvalue
was about `2.26e-6`, positive. These terminal inconclusive outcomes are retained;
they neither prove cycle positivity nor justify a restart or a separate paper.

Next: preserve the author-route publication step for the corrected manuscript.
The importance objective is unmet. Further immediate
corollaries of this support identity are not a sufficient reason for another
paper or another grade attempt; a next manuscript needs a substantial new
consequence or a separately defined problem resolved.
