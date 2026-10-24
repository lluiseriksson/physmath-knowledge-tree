# Weighted block entropy: a proof checkpoint after the missing bridge

This dated checkpoint supersedes the **unresolved finite-dimensional tensor bound** in [the earlier entropy checkpoint](2026-10-24-entropy-audits-and-missing-bridges.md). It preserves that earlier account of what was known at the time. No canonical graph confidence, Lean declaration, manuscript assessment or editorial status is changed here.

## Sourced and recorded facts

[Song, Wang, Tomamichel and Fang, arXiv:2609.37240v1](https://arxiv.org/html/2609.37240v1#S3.SS1), Section3.1 Lemma3, use block columns, Sylvester's determinant identity and log-determinant concavity for a phase-damping comparison. The abstract, introduction and that section were read; this is not a full audit of their preprint. Their unital decomposition alone does not establish a nonunital reset extension.

The new argument below changes both the block baseline and the concavity weights. A targeted GPT-6 Astra xhigh mathematical audit, with reused context and a shared filesystem, found the three exact proof inputs valid in their stated finite-dimensional domains. It checked zero blocks, noncommuting factors, singular states, integral convergence, the tensor induction and the partner ensemble. This is dependent AI correctness evidence, not independent human review, formal verification or priority certification.

The full audit report SHA256 is `f30403ae2a294646428556fb541405106a05dc4ad5396e828cfe28a311f525a9`. The root read it in full and verified all six native manifest entries. Exact main proof input SHA256: `58e9f1bde271125d4e342e8ca34b6f5d29404672b7ee0146f42e1e7ff8d0b3e4`; partner consequence: `6f483f7ed4b49d6ad670e94dc21928407d9eaab65766b4bb35a1315986520483`; overlap consequence: `4cc2ab2a264035f0147a0010682b5e46a9e2fe8d79085d716ec9d31568c77bcc`.

The six-page manuscript *Block entropy inequalities and classical capacity of finite-dimensional quantum reset channels* has frozen PDF SHA256 `6e3dbfbd3320d5972af8369ea36eb396a3e5317a24e8101bc86428e3bf5b6fd6`. It compiled with both the editor compiler and Tectonic and passed visual inspection. Its full assessment is pending at this checkpoint. The targeted audit does not assign a manuscript grade, and no score from another paper transfers to this PDF.

## Graph-supported inference

The [retrieved neighborhood](../retrieval-2026-10-24.json) still concerns `domain.quantum_information_theory`, `bridge.conditional_mutual_information_recovery` and `move.spectralize`. It suggests retaining conditional states and spectral shifts, but does not prove the inequality. The actual proof must preserve the input diagonal block traces until the determinant comparison has been normalized. Replacing those traces with arbitrary weights loses the equal-trace condition needed for the entropy integral.

## New analytical result and its proof

All spaces here are finite dimensional and all logarithms are natural. Let `X` be a density matrix on `A tensor B`, `tau=diag(s_i)`, `0<=lambda<=1`, and `q=1-lambda`. Set

```text
X_jj = <j|X|j>,  p_j = Tr X_jj,
rho_j = X_jj/p_j for p_j>0,
Y = Tr_A X = sum_j p_j rho_j,
a_j = S(lambda |j><j| + q tau),
Z = lambda X + q tau tensor Y.
```

The block bound is

```text
S(Z) >= sum_j p_j a_j + lambda sum_j p_j S(rho_j) + q S(Y)
     >= sum_j p_j a_j + sum_j p_j S(rho_j).
```

For each `t>0`, use the positive blocks `B_i=t I+q s_i Y`, their direct sum `B`, block embeddings `E_i`, and `T_i=X^(1/2) E_i B_i^(-1/2)`. Factorization and Sylvester give

```text
ln det(tI+Z) = sum_i ln det B_i
              + ln det(I+lambda sum_i T_i T_i*).
```

A zero `p_i` implies `X^(1/2)E_i=0` exactly. For the other blocks, weighted log-determinant concavity and rectangular Sylvester give

```text
ln det(I+lambda sum_i T_i T_i*)
 >= sum_j p_j ln det(I+(lambda/p_j) T_j T_j*)
  = sum_j p_j [ln det(B_j+lambda rho_j)-ln det B_j].
```

Define `Z_j=lambda |j><j| tensor rho_j+q tau tensor Y`. Every comparator has trace one and the same dimension as `Z`, so

```text
ln det(tI+Z) >= sum_j p_j ln det(tI+Z_j).
```

For equal-trace, equal-dimension density matrices `U,V`,

```text
S(U)-S(V) = integral_0^infinity [ln det(tI+U)-ln det(tI+V)] dt.
```

The difference is absolutely integrable: logarithmic near zero, including different ranks, and `O(t^-2)` at infinity. Integrating common-reference differences, rather than separate divergent integrals, proves `S(Z)>=sum_j p_j S(Z_j)`. The block weights of `Z_j` are `q s_i` except at `j`, where the weight is `lambda+q s_j`. Entropy concavity in that block yields `S(Z_j)>=a_j+lambda S(rho_j)+q S(Y)`. A final use of `Y=sum_j p_j rho_j` gives the displayed bound. No commutation of `Y` with the `rho_j` is used.

### What this removes

For reset channels `Phi_i`, induction on the sites now gives, for every mixed or entangled input `R`,

```text
S((tensor_i Phi_i)(R)) >= sum_i sum_j (R_i)_jj S(Phi_i(|j><j|)).
```

The conditional input states are normalized diagonal blocks of `R`; after applying the remaining channels they are exactly the states to which the induction hypothesis applies. Their averaged marginal populations recover those of `R`.

In particular, for identical sites this implies the former overlap conjecture for **every finite number of sites and all physical noise parameters**, rather than only a fixed-input small-noise interval:

```text
S(Phi^tensor n(R)) >= n[h(q)+q S(tau)]
                       - sum_i h(q Tr(R_i tau)).
```

Indeed a binary reset flag for basis input `j` has conditional entropy at most `h(q s_j)`; averaging and binary-entropy concavity give the expression above. The old local flag-discrimination shortcut remains invalid; the new determinant proof does not repair or use it. Numerical searches are not premises.

### Classical capacity consequence

Let `W(k|j)=lambda delta_kj+q s_k` and `f(p)=H(Wp)-sum_j p_j a_j`. Pinching bounds the average-output entropy above, while the block bound controls each codeword's entropy below. Basis ensembles attain `f(p)`.

For an arbitrary finite-dimensional partner channel `Psi` and ensemble `{r_x,R_x}`, use the legitimate partner ensemble `{r_x p_xj, (R_x)_jj/p_xj}`. Its average is exactly the original partner marginal. Subadditivity and the block bound therefore give

```text
chi(Phi tensor Psi) <= max_p f(p) + chi(Psi).
```

Product ensembles attain the reverse inequality. This is strong Holevo additivity and gives unassisted classical capacity `max_p f(p)`, including arbitrary entangled codewords in the converse. A commuting additive ensemble-average cost preserves the diagonal populations and reduces the finite-block optimization to the corresponding classical constrained objective. Separate local budgets and a shared total budget must be distinguished. No full convex-roof strong-superadditivity identity, quantum capacity or private capacity is inferred.

## Priority boundaries and the next hypothesis

- [King](https://arxiv.org/abs/quant-ph/0204172) already covers the uniform depolarizing capacity and arbitrary partners. That case is not a new result here.
- [Fukuda](https://arxiv.org/abs/quant-ph/0505022) covers special asymmetric minimum-output-entropy and norm transfers. A generic reset Holevo formula is not inferred from minimum-output entropy alone.
- [Giovannetti, Lloyd and Ruskai2005](https://arxiv.org/html/quant-ph/0408103v3#S4.SS2) already define the same arbitrary-density reset family in equation34 and prove multiplicativity for the fixed index `p=2`. The abstract and SectionIV.B through the positive-coefficient argument were read directly. This is a necessary direct antecedent; that fixed-index norm result alone does not prove the entropy/Holevo consequences here. The full manuscript reviewer identified its omission from candidate1, so it must be addressed before finalizing the paper.
- [Baitenov2024](https://link.springer.com/article/10.1134/S0081543824010048): publisher abstract and references were read; the full text remains unreviewed. Exact overlap and priority therefore remain unresolved.
- [Fujiwara--Nagaoka1998](https://doi.org/10.1109/18.669165): introductory definitions in the author-uploaded primary copy restrict codebooks to product states and explicitly set aside the broader entangled-input extension. No full-paper rereading is claimed.
- [Tang et al2026](https://arxiv.org/abs/2609.28592): abstract/introduction only; pure-output qubit additivity includes a boundary case, while generic mixed reset states do not admit pure outputs.

The next **speculative** bridge is a countable-dimensional, commuting-cost extension using finite input projections and cq mutual information. Its dictionary maps the infinite reset tail to an input-independent orthogonal flag, preserving ensemble information but deliberately avoiding output entropy subtraction. It is not part of the six-page frozen manuscript. Its falsifier would be a failed cost-preserving truncation, a message-dependent tail weight, an invalid conditional-entropy continuity limit, or an unjustified coding step. The budget-finiteness and Gibbs assumptions must be stated separately. A separate targeted audit is pending; no infinite-dimensional theorem is promoted here.

## Formal-result boundary

This is a written analytical proof checkpoint supported by a dependent targeted AI audit. There is no Lean proof and no canonical confidence promotion to `formal`. No ready Research Capsule, independent reproduction campaign, worldwide originality finding, full-manuscript grade or importance threshold is certified. The full-paper assessment and novelty comparison remain separate work.

## Later assessment and extension audit on the same date

After the checkpoint above, a fresh-conversation complete Astra xhigh assessment of the exact six-page PDF reported **importance6.00/10 and technical quality9.00/10**, with no material mathematical objection and minor bibliographic revisions. All61 delivery manifest entries were verified by the root; full report SHA256 `ad94e9918c23702488a03f1d5f2bcb932371ae7fd223553ca3c8d9f34add04a5`, verdict SHA256 `128f8a41c7b48feecae81c83f70de46444467f9057bcdbfdab0d72f0e958883c`. This is a private exact-artifact assessment under the AIRR rubric, not an imported public AIRR registry score or editorial admission. Workspace/runtime isolation is unverified. The score is retained even though it does not meet the research importance target; it is not transferred to any proposed extension.

The separate countable-dimensional candidate subsequently passed its targeted audit with an explicit **finite real budget** clarification for the Gibbs-implies-finite-capacity assertion. Report SHA256 `a7ff9fa356de8bfdef46cce1e723cc899d351da27c92840c82a807952dc44a38`; six native manifest entries verified. The exact literal-domain failure is preserved: the identity channel on the harmonic ladder with budget `E=infinity` has a finite Gibbs partition function but infinite capacity. It does not refute the finite-block equality in extended reals. This extension is still outside the scored six-page manuscript, has no new score, and is not formalized or globally priority-certified.
