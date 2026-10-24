# Partial entropy bounds and the remaining tensorization problem

This checkpoint follows [the earlier reset update](2026-10-24-universal-reset-review-and-tensorization.md). The canonical graph, confidence labels, evaluation routes and Lean declarations remain unchanged. No new manuscript score is assigned.

## Sourced and recorded facts

The [laboratory follow-up](https://github.com/lluiseriksson/reset-minimax-lab/pull/3) preserves exact candidates and two separate, dependent GPT-6 Astra xhigh audits. The root read both full reports and verified their native manifests. The reports support only the stated finite-dimensional partial lemmas. They are neither independent human reviews nor formal verification or originality assessments. Their conclusions do not increase the combined manuscript's recorded importance4.6.

Write `R_q(rho)=(1-q)rho+q tau Tr(rho)`, and let `psi` be a fixed pure input on `n` copies with one-site marginals `psi_i`. All entropies are in nats. Define

```text
G(q) = S(R_q^tensor n(psi)) - n[q S(tau)+h(q)]
       + sum_i h(q Tr(psi_i tau)),
a = sum_i [1-Tr(tau psi_i^2)],
Delta = sum_i Tr[tau(psi_i-psi_i^2)].
```

The first audited lemma proves `G(q)=Delta q ln(1/q)+O(q)` for the fixed tuple. If `Delta=0`, pure marginal sites factor out; on the other sites the reset support is orthogonal to the original marginal support. Distinct reset patterns then have orthogonal supports, giving `G(q)>=0` for every physical `q` in that special case.

The second audited lemma gives, for `0<=q<=1/(2n)`,

```text
S(R_q^tensor n(psi)) >= h(a q (1-q)^(2n-1)).
```

For `Delta>0`, it supplies the explicit sufficient interval `0<=q<=q0`, where

```text
q0 = min{1/(2n), Delta/(4n^2),
         exp[-2n(ln n+S(tau)+1)/Delta]}.
```

This removes an unspecified small-noise remainder from the sufficient condition; it does **not** remove dependence on `n`, `Delta` or the reset entropy. The exact candidates and full proofs are in the laboratory's `hypotheses/tensorization67/` package. No uniform positive interval over varying states or blocklengths is inferred.

The larger finite search tested2880 weighted GHZ cases and36 local optimizations up to8 channel uses, with32 comparisons against a full channel construction. It found no margin below the declared -2e-10 threshold. Small negative equality margins, solver flags and the restricted GHZ family are preserved. These are floating-point diagnostics, not a proof of the general conjecture. No ready Research Capsule or independent reproduction beyond the recorded laboratory workflow is claimed here.

## Graph-supported inference

The retrieved neighborhood remains `domain.quantum_information_theory`, `bridge.conditional_mutual_information_recovery` and the channel/reference-system interfaces recorded in [the graph retrieval](../retrieval-2026-10-24.json). It supports keeping conditioning and tensor quantifiers explicit, without implying the new inequality. In particular, positivity for each fixed tuple near `q=0` cannot be exchanged for a bound at a fixed nonzero noise level for every blocklength.

## Speculative bridge: erase flags, retain an entropy correction

- Target: `domain.quantum_information_theory`; move: `move.spectralize`.
- Confidence: **speculative**, with no canonical promotion.
- Dictionary: a flagged erasure pattern corresponds to a retained subset; filling an erased register with `tau` creates the reset output. Local overlaps survive this map, while distinguishability of erasure flags may be lost.
- Mechanism sought: bound the lost flag information by local binary corrections plus expected retained-subset entropy.
- Exact missing statement: `H(J^n|B^n) <= E_T S(psi_T)+sum_i h(q Tr(psi_i tau))`, with independent retention probability `1-q` and the specified cq flag/output state.
- External hypothesis still required: an all-noise bound uniform in blocklength. Neither partial lemma supplies it.
- Falsifier: a rigorously negative finite entropy margin; near-zero floating output requires a higher-precision or interval check before being treated as a counterexample.
- Abandonment condition: a verified counterexample, or a proposed transfer that silently reverses the entropy/data-processing direction or absorbs the missing estimate into a new hypothesis.
- Minimal formal target: the finite cq entropy identity and the two elementary largest-eigenvalue/purity inequalities; no universal conjecture encoded as an assumption and renamed a theorem.
- Next computation: entangled states outside the diagonal-reset GHZ family, rather than repeating its passing grids.

## Primary leads and limits of their transfer

[Bao, Dong, Ou and Yao](https://ir.cwi.nl/pub/35176/35176.pdf): abstract, introduction and displayed results through the start of Theorem1.8 read. The repository lists a2025 publication; this PDF is headed January2026. Its weighted erasure/random-partial-trace estimates retain structure that disappears when the flags are filled by an overlapping reset. No entropy transfer theorem has been established.

[OpenAI, *The entropy photon-number inequality*](https://github.com/openai/math/blob/1581d4cbdd69a0faf34b2089614fe2a814316a6a/preprints/The-entropy-photon-number-inequality-September-24-2026/paper.pdf): pinned PDF SHA256 `d826f8ebe18596419871100e79611868dff2a45a4aa157433c58e6f49a234d82`. Read abstract/introduction through the start of page5 and pages8-9, including Theorem3.1; remaining proofs were not read this round. Its four-weight interpolation is a possible tool, but the four required comparisons have not been proved for the reset problem. A scalar-target LP diagnostic found no violating candidate in2391 successful solves and retained9 solver failures. It does not audit the preprint or establish the required transfer. This index stores metadata and original synthesis, not the third-party full text or a training-permission decision.

[Amosov, arXiv:1409.5881v2](https://arxiv.org/abs/1409.5881): abstract/metadata only. A dephasing-channel entropy result requires a valid reset-channel decomposition before use; none is supplied.

## Formal-result boundary

No Lean theorem was added or strengthened. Passing scripts, AI audits and source metadata do not promote graph confidence to `formal`. The full entropy conjecture, a regularized-capacity extension and an importance score above7 remain unestablished.
