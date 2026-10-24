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
| [Qi, Gupur, Wu and Guo, PRA 110, 012406 (2024)](https://doi.org/10.1103/PhysRevA.110.012406) | Section VI compared in reviews 306 and 319 | The rank-one multivariable formulation and Hessian question are methodological antecedents now acknowledged in corrected draft 2. This does not identify their formulation with the constrained rank-two local theorem. |
| [Bharti, Gajjala and Haug, 2607.24479v1](https://arxiv.org/abs/2607.24479v1) | Setup and finite-copy scope; selected Section 8 | Global two-copy claims are source claims, not independently verified premises of the local proof. Rank bounds and two-positivity cannot simply be tensorized. |
| [Wu and Zou, 2608.02647v1](https://arxiv.org/abs/2608.02647v1) | Section 7.2, Lemma 7.4 and Theorem 7.3 proof; primary PDF pages 14–15 | The signed co-Choi tensor-contraction argument already implies the fully-product-ray sector for every finite copy count. Their printed statement is for three copies; the all-copy extension is an immediate deduction from the proof, not a new mechanism. |
| [Dragomir Ž. Đoković, Entropy 18(6), 216 (2016), 1003.4337v3](https://arxiv.org/abs/1003.4337v3) | Proposition 7.1 and relevant proof passages; Maple certificates not replayed | Sole-author antecedent for two qutrit copies when a support plane contains a product ray. Do not attribute this paper to Chen–Đoković or extend its stated dimension scope. |

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

The analytic contraction formula and critical-manifold proof survived targeted audit 292. Full review 306 of the exact seven-page draft **Local zero geometry of finite-copy Werner endpoint witnesses**, PDF SHA256 `6904a3126929fc5820af9149ad209d1d499daf9e278121f247735ede54af85f6`, subsequently gave technical quality **9.0/10**, importance **4.0/10**, and **minor revision**, without finding a material mathematical error. This was a dependent requested Astra xhigh review with reused context and shared files; runtime was not attested and no independent human review occurred. It is a private manuscript-specific assessment, not an AIRR aggregate or a score above seven.

Corrected draft 2, PDF SHA256 `d63e5a8e596361fe60b10a873c32dcaf77c517fd17e69d1659e45f3062dc9ad8`, adds the Qi methodological antecedent and the Bharti comparison without changing the mathematics. Delta audit 319 closed those two observations; it issued no replacement score. The publication packet contains this exact corrected PDF and six unchanged control files, with current build provenance separated from frozen draft-1 logs. Its deposit remains pending author access, while the operator session is available. Neither a deposit nor publication is claimed for this manuscript.

The complete draft adds an exact obstruction: at `I_2 tensor ab*`, the constrained Hessian is nonnegative exactly when the previous-system form is nonnegative on every `xb* + ay*`. Positivity of these Hessians for every nonzero a,b is therefore equivalent to the previous global rank-two inequality. A two-block curve gives `q_(n+1)(C(t)) = 2t^2 q_n(xb* + ay*)`. This equivalence is included in the new complete-manuscript review, not misrepresented as part of the earlier frozen audit input.

- Hypothesis removed: the local theorem allows every sufficiently close complex rank-two perturbation, not only normal or factorized witnesses. It does not remove the requirement to stay near the selected product-projector center.
- Falsifiers: an error in the matrix-unit contraction; an additional physical Hessian zero mode; failure of criticality along nearby Z; a negative admissible matrix arbitrarily close to C0; or a primary antecedent already establishing the same general theorem.
- Minimal Lean target: the two-by-two trace projection and the exterior block eigenvalues, followed by the finite-dimensional gauge quotient. No such formalization is claimed.
- Next finite computation: test the new qubit Hessian identity on nonnormal entangled rank-one centers, while preserving every failed verifier execution. The author controls currently cover 48 Pauli identities and 192 exact-range Gaussian-integer curve evaluations, supplementing the prior 56 quadratic-identity controls.
- Abandonment condition: a valid counterexample or proof of complete antecedent overlap. A positive local audit alone does not justify globalizing the theorem or calling the paper important.

## Closed local audits and a rejected novelty claim

Targeted audit 316 reconstructed the local theorem at `P2 tensor ab*` for fully product a and b, including orthogonal factors. If z local overlaps vanish, the physical real Hessian nullity is `4d_1 + 4D - 10 + 6(2^z - 1)`. Only the nondegenerate case z=0 has the stated local zero-manifold/coercivity conclusion. Audit 331 then checked the extension with a fully product, b arbitrary and `<a,b> != 0`. It reconstructed the needed algebra directly, rather than treating another auditor's PASS as proof. Neither audit rated a complete paper or certified novelty.

The separate all-copy product-ray proposal 325 passed a correctness audit but failed the novelty comparison. Source audit 333 explicitly identifies its map with the Hilbert–Schmidt adjoint of the map in Wu–Zou Section 7.2, and the two co-Choi matrices with swap conjugates. The signed tensor-contraction proof already extends to every finite factor count; even the proposed lower spectral refinement `-1/3` follows from the displayed local blocks. This route is retained as attributed prior machinery and abandoned as a new main theorem. Correctness alone was insufficient.

A random-compression transfer was also rejected: averaging dimension-four compressions to dimension three yields effective trace coefficient `3/7`, rather than the endpoint `1/2`. It therefore cannot lift a lower-dimensional endpoint certificate without a new estimate. A more elaborate restatement of that missing estimate would not repair the loss.

## Bridge card: entangled anchor blocks

- Target: `domain.quantum_information_theory`; source: `domain.spectral_theory`; move: `move.spectralize`.
- Confidence: `speculative` as a discovery record; no priority or importance score is assigned.
- Dictionary: each pair of original ququart slots maps to a block map `Phi_4 tensor Phi_4`; an anchor Bell vector maps to a Schur CP map; input partial transpose maps its Choi matrix to a signed comparison with the positive swap matrix. Grouping the Hilbert spaces does **not** replace that map by `Phi_16`.
- Candidate: on `2k` original ququart slots, require one support plane of a rank-at-most-two matrix C to contain a tensor product of k Bell vectors, paired across original slots. Other coefficient vectors may be entangled across blocks. The proposed conclusion is `q_(2k)(C) >= 0`, for each finite k.
- Hypothesis removed relative to the fully-product-ray sector: the anchor is entangled inside every pair. The support-plane hypothesis remains restrictive; it is not global positivity or undistillability.
- Mechanism: the tensor-contraction step is attributed to Wu–Zou. The additional proposed ingredient is an explicit Bell-block signed co-Choi gate, not a new general tensorization principle.
- Finite author evidence: a rational 256-by-256 matrix `R = A^(-1) B` satisfies the proposed annihilator with scaled roots `-21,-9,-3,3,9,11,27` for `27R`. It has 2032 nonzero entries and invariant components of size at most 28. Hermitian similarity would give `-A <= B <= A`. Audit 338 is checking the construction, index reshuffling, conjugations and downstream proof; a passing author script is not its verdict.
- Scope control: an exact four-slot rank-two example has no fully original-slot-product ray in either support plane and operator Schmidt rank greater than one across every nontrivial original-slot cut. Its direct partial-trace value is `q_4(C)=12016`. This separates the displayed hypotheses from full-product support planes and factorized operators; one example proves neither the general theorem nor priority.
- Countercontrol: the analogous Bell block in local dimension two has exact normalized eigenvalue `-11/9`; the signed gate cannot be asserted for arbitrary entangled anchors or all dimensions. This is a failure of the sufficient comparison, not a negative Werner witness.
- Sources to verify: the specific Bell-block claim against Wu–Zou, Fu–Gao–Park and Bharti, including their original hypotheses. The two-copy case is already contained in general two-copy results; any potential additional scope starts at larger copy count. Source audit 341 is pending.
- Falsifiers: an incorrect mixed contraction, partial transpose or complex conjugation; a failed exact annihilator; an uncovered matrix component; invalid tensorization for an entangled coefficient vector; or an antecedent implying the same sector.
- Minimal Lean target: certify the finite rational annihilator and Hermitian similarity, separately from the analytic Schur identity. No such formalization exists in this checkpoint.
- Next computation: complete audit 338 and the primary-source implication comparison before writing a complete manuscript or requesting a manuscript-specific score.

The 333 source packet was independently compared between its 35 saved C/D files and its manifest. Its primary-source reading scope and failed accesses are retained privately; the public note contains links and original analysis, not redistributed source full texts or private browser captures.

## Formal status

No new Lean declaration or graph-confidence upgrade is made by this update. Existing repository build success would validate existing formal code only. None of the new candidate theorems or private model scores becomes formal evidence merely by being recorded here.
