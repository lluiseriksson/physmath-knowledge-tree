# Weyl publications and a bounded conditioning candidate

Observed 24 October 2026. This discovery note keeps published results, primary-source reading, candidate mathematics and formal status separate. It does not promote canonical graph confidence.

## Published versions

Two immutable working-paper versions are public:

- [Removing the binary and ternary factors from cyclic Weyl rank uncertainty, v1](https://airr.science/papers/ARR-2026-1QEPAQ29TN8FZRK5/versions/v1/). Canonical PDF SHA256: `40f70f41df16a6206a00d6a5bf0612656ff9ceea2bd7faae07a07fc21fc1faef`.
- [An exact two-mean law for singleton-avoidance probabilities, v1](https://airr.science/papers/ARR-2026-737GSKN7CK9V1RVH/versions/v1/). Canonical PDF SHA256: `ab07671365f0320dadb3b345ecc394291d5736cfe9b1587ad8336ecebe373240`.

Publication, mathematical correctness, novelty and assessment scores are different claims. The public records were verified against their PDF bytes, citations and actual release timestamps. Both were labelled Working paper and Not yet rated at verification; no score from an earlier draft was transferred. The rank-uncertainty paper does not determine every residual prime-factor profile or a density-state reconstruction algorithm.

## Selected primary reading

| Primary source | Reading scope | Consequence for attribution |
| --- | --- | --- |
| [Carmeli, Heinosaari, Schultz and Toigo, arXiv:1308.5502v2](https://arxiv.org/abs/1308.5502v2) | Introduction and relevant inertia-cone lemmas and Theorem 1; not an audit of every proof | Kernel/inertia criteria for restricted and unrestricted positive competitors are established results. |
| [Baldwin, Deutsch and Kalev, arXiv:1605.02109v1](https://arxiv.org/abs/1605.02109v1) | Abstract, introduction and Sections II–III; appendices and experiments not fully audited | Rank-r strict-completeness and its convex-recovery significance are prior work. |
| [Zhu and Wang, arXiv:2608.11850v1](https://arxiv.org/abs/2608.11850v1) | Abstract, introduction and beginning of the spectral-interface section; later construction proofs not audited | Full-space Gram spectral floors for minimal rank-one Weyl–Heisenberg POVMs are a close but different conditioning question. |

The source inventory and targeted searches do not amount to reading all frontier papers. The earlier pinned OpenAI catalogue remains a metadata inventory, not proof verification. No worldwide priority certificate follows from an unsuccessful keyword search.

## Bridge card: an additive spectral kernel

- Target node: `domain.spectral_theory`.
- Research move: `move.spectralize`.
- Discovery confidence: `speculative`, pending complete exact-manuscript assessment and novelty comparison. Analytical author proofs and AI audits are not Lean formalization or human peer review.
- Dictionary: four omitted cyclic Weyl coefficients correspond to a real Hermitian kernel; commuting order-three generators correspond to nine equal-dimensional joint cells; a kernel eigenvalue is a sum `f_i + g_j` of zero-mean real triples; low-rank state differences correspond to trace-zero matrices with bounds on both inertias.
- Preserved structure: Frobenius geometry, trace, spectrum with multiplicities, and the positive/negative inertia restrictions.
- Lost or uncertain: experimental probability normalization, sample complexity, other missing-label patterns, unequal multiplicities, and an efficient subquadratic measurement scheme.
- Hypothesis removed by the candidate: the worst-case direction is optimized over all state differences, including matrices that do not commute with the missing-coefficient kernel. A diagonal-only calculation would not establish this conclusion.

For `d = 9n`, take `U = X_d^(d/3)`, `V = Z_d^(d/3)` and omit `U, U*, V, V*`. If `P` is their orthogonal Frobenius projection, the candidate sharp hidden-energy fraction on differences of rank-at-most-r states is

```text
x = r/n, with r an integer and 1 <= r < 2n
L(x) = 2x/3                                for x <= 1
L(x) = (x + sqrt(x*x - 3*x + 3))/3          for 1 <= x < 2
C(n,r) = 1/sqrt(1 - L(x))
```

Explicit state pairs attain the proposed constant. At `r >= 2n`, a kernel element with inertias `(2n,2n)` gives an exact collision. A separate argument proposes the same threshold against positive competitors of unrestricted rank, with the conservative bound `sqrt(1 + 288n/(2n-r))`. The sharp balanced-rank constant must not be substituted for that one-sided bound.

The parent manuscript is frozen as a seven-page draft; its full PDF assessment is pending. No importance grade or publication claim is assigned to this new draft. The exact-law audit, the one-sided-bound audit and the full-manuscript review are distinct processes with shared filesystem and declared reused model context, without independently attested runtime isolation.

- Concrete falsifiers: a trace-zero Hermitian difference with both inertias at most r and a larger hidden-energy ratio; an incorrect branch pencil; failure of a partial-cell attainer; or a kernel matrix with fewer than `2n` positive or negative eigenvalues.
- Minimal formal target: prove the common-shift trace inequality for bounded inertia and the two symbolic four-by-four determinant identities. No Lean implementation is claimed.
- Finite next step: compare exact sorted-grid spectra with the common-shift formula, test noncommuting state differences, and preserve any failed check before extending the theorem.
- Abandonment conditions: a valid counterexample or a primary antecedent already establishing the claimed exact law. Correctness alone would not establish consequential novelty.

The canonical 59-node, 115-edge graph and its confidence labels remain unchanged.
