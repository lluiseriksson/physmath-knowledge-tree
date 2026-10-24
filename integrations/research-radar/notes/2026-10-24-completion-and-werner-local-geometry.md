# Positive completion, actual assessment and a local Werner candidate

Observed 24 October 2026. Sourced facts, graph-supported retrieval, candidate mathematics and formal status are separated below. This note does not promote canonical graph confidence.

## Sourced publication facts

Two further immutable Working papers are now public:

- [A sharp stability transition for low-rank tomography with four missing Weyl coefficients, v1](https://airr.science/papers/ARR-2026-54DW9GY89V9D8TAB/versions/v1/). PDF SHA256 `f77e43531efe931084f4c0f960faf31735514851e1e08d28ad791770928a1293`.
- [Sharp marginal-erasure bounds and positive completion of nonunital quantum channels, v1](https://airr.science/papers/ARR-2026-3K6NV742FP8WH8K9/versions/v1/). PDF SHA256 `f8498369fef75f757904f6293499692b05e6e068bd1b16eea06c7c23efd412b2`.

Both actual releases occurred at `2026-10-24T18:24:31Z`. Their same-domain PDF bytes, seven-page counts, four citation formats, titles, timestamps and Working-paper/Not-yet-rated labels were checked after deployment. The records are not accepted-collection admissions or public model ratings. The stability version incorporates author corrections; its earlier draft's 8.5 technical/3.5 importance assessment is not silently transferred.

The exact positive-completion PDF received private full review 278: technical quality **8.8/10**, AIRR importance **3.4/10**, recommendation **minor revision**, no material mathematical error found. This was a dependent requested Astra xhigh review with prior participation, reused context and shared files, without runtime attestation or independent human review. It is not a public AIRR aggregate. The reviewer considered the exact constants useful but specialized; correctness did not establish broad impact. Accompanying source notes clarify arbitrary-channel quantifiers in the tail bounds and distinguish the public supplement from additional private controls mentioned in the manuscript.

For deleting the traceless local algebra `I_m tensor B` on `C^m tensor C^k`, the paper proves the exact Frobenius inverse constants `sqrt(m/(m-r))` between two rank-at-most-r states and `sqrt((m+r)/(m-r))` between one such state and an arbitrary density matrix, for `1 <= r < m`, independently of `k >= 2`. Rank-m collisions show the threshold is sharp. The normalized-Choi consequence identifies channels of Kraus rank below the input dimension among all channels from their action on traceless inputs. Optimal conditioning within the trace-preserving subclass and compressed sampling are not established.

## Selected primary antecedents

| Stable source | Reading scope | Attribution boundary |
| --- | --- | --- |
| [Costa Rico, 2025, DOI 10.1007/s11005-025-01935-y](https://doi.org/10.1007/s11005-025-01935-y) | Theorem 1 and proof; selected Appendix A calculation in the source audit | The endpoint partial-trace formulation is prior work. |
| [Lewenstein et al., quant-ph/0006064v2](https://arxiv.org/abs/quant-ph/0006064v2) | Appendix C, including C4 and C15; not the entire paper | Zero families, tangent variations and local-minimum Hessian analysis already occur for two copies in dimension three. Their displayed remaining-side vectors are orthogonal. |
| [Pankowski et al., 0711.2613v2](https://arxiv.org/abs/0711.2613v2) | Section III and matrix-vector convention | Nonfactorized saturators prevent a global classification from a simple factorized zero family. |
| [Qi, Gupur, Wu and Guo, PRA 110, 012406 (2024)](https://doi.org/10.1103/PhysRevA.110.012406) | Primary abstract read; Section VI comparison is in progress in review 306 | A rank-one multivariable formulation with critical points and a Hessian question is a further pertinent antecedent. An abstract-level match does not establish identity with the new constrained rank-two theorem. |
| [Bharti, Gajjala and Haug, 2607.24479v1](https://arxiv.org/abs/2607.24479v1) | Setup and finite-copy scope; selected Section 8 | Global two-copy claims are source claims, not independently verified premises of the local proof. Rank bounds and two-positivity cannot simply be tensorized. |
| [Wu and Zou, 2608.02647v1](https://arxiv.org/abs/2608.02647v1) | Targeted source audit of theorem scopes and structured sectors | Normal and specified nonnormal sectors must be distinguished from unrestricted rank-two neighborhoods. |

A pinned external three-copy qutrit certificate candidate was also inventoried at [ipitchford/three-copy-werner-undistillability, commit 66cd2f9](https://github.com/ipitchford/three-copy-werner-undistillability/tree/66cd2f931abb1a2f24e18e1b86e280401be9a5e8). File hashes were compared with its Zenodo release, but its multiplier identities were not completely replayed. It is neither a certified theorem nor a refuted claim in this record. The qutrit question must not be presented as an uncontested new gap simply by ignoring that candidate.

The finite targeted search is not an exhaustive reading of all frontier papers. The pinned 719-item OpenAI inventory remains metadata coverage, and the existing Anthropic/DeepMind source cards retain their stated reading scopes. No permission for training or redistribution of full texts is inferred from public access.

## Graph-supported retrieval

The retrieved canonical anchors are `domain.quantum_information_theory`, `domain.spectral_theory` and `domain.differential_geometry`. Existing neighboring edges supply channel, spectral and manifold vocabulary; none proves a Werner endpoint inequality or an importance score. The 59-node, 115-edge canonical graph is unchanged.

## Bridge card: transverse geometry at endpoint zeros

- Target node: `domain.quantum_information_theory`.
- Source nodes: `domain.spectral_theory`, `domain.differential_geometry`.
- Research moves: `move.spectralize`, `move.geometrize`.
- Discovery confidence: `speculative` in this registry. Analytic author proofs and dependent AI audits are not Lean formalization, human peer review or priority certification.
- Dictionary: a Schmidt-rank-two coefficient vector maps to a complex rank-two matrix; endpoint expectations map to the unnormalized partial-trace quadratic form; a rank-two factor chart maps to physical tangent directions modulo an eight-real-dimensional gauge; a Hessian kernel maps to the tangent of a critical zero manifold.
- Structure preserved: complex nonnormal matrices, Frobenius geometry, rank restriction, tensor-slot traces and real differential structure.
- Structure lost or uncertain: global rank-two positivity, an explicit neighborhood radius, uniformity across copy counts, an operational distillation protocol and worldwide novelty.

For each finite `ell >= 2` and finite local dimensions `d_i >= 2`, put

```text
q_ell(C) = sum over S of (-1/2)^|S| * ||Tr_S C||_F^2
C0 = P2 tensor |0,...,0><0,...,0|
Z = {P tensor R : P is a rank-two orthogonal projector,
                  R is an arbitrary nonzero complex rank-one matrix}
```

The candidate proves, in an ell- and dimension-dependent neighborhood among matrices of rank at most two, `q_ell(C) >= c dist_F(C,Z)^2`. The local zero set is exactly Z. With `D = product(d_2,...,d_ell)`, the real physical kernel has dimension `4d_1 + 4D - 10`; the exact transverse quadratic coefficient gap at C0 is `2^(-(ell-1))`. The differential Hessian has twice that gap. The rank chart uses the support minor indexed by `0,D` in tensor lexicographic order, not a literal leading `0,1` minor.

The analytic contraction formula and critical-manifold proof survived targeted audit 292. The audit did not rate importance or prove global undistillability. A new seven-page complete draft, **Local zero geometry of finite-copy Werner endpoint witnesses**, PDF SHA256 `6904a3126929fc5820af9149ad209d1d499daf9e278121f247735ede54af85f6`, is now in full review 306. No result or score from that pending review is asserted.

The complete draft adds an exact obstruction: at `I_2 tensor ab*`, the constrained Hessian is nonnegative exactly when the previous-system form is nonnegative on every `xb* + ay*`. Positivity of these Hessians for every nonzero a,b is therefore equivalent to the previous global rank-two inequality. A two-block curve gives `q_(n+1)(C(t)) = 2t^2 q_n(xb* + ay*)`. This equivalence is included in the new complete-manuscript review, not misrepresented as part of the earlier frozen audit input.

- Hypothesis removed: the local theorem allows every sufficiently close complex rank-two perturbation, not only normal or factorized witnesses. It does not remove the requirement to stay near the selected product-projector center.
- Falsifiers: an error in the matrix-unit contraction; an additional physical Hessian zero mode; failure of criticality along nearby Z; a negative admissible matrix arbitrarily close to C0; or a primary antecedent already establishing the same general theorem.
- Minimal Lean target: the two-by-two trace projection and the exterior block eigenvalues, followed by the finite-dimensional gauge quotient. No such formalization is claimed.
- Next finite computation: test the new qubit Hessian identity on nonnormal entangled rank-one centers, while preserving every failed verifier execution. The author controls currently cover 48 Pauli identities and 192 exact-range Gaussian-integer curve evaluations, supplementing the prior 56 quadratic-identity controls.
- Abandonment condition: a valid counterexample or proof of complete antecedent overlap. A positive local audit alone does not justify globalizing the theorem or calling the paper important.

## Formal status

No new Lean declaration or graph-confidence upgrade is made by this update. Existing repository build success would validate existing formal code only. None of the new candidate theorems or private model scores becomes formal evidence merely by being recorded here.
