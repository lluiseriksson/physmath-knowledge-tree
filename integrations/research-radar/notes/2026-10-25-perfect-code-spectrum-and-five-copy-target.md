# Perfect-code spectra and a five-copy research target

Observed 25 October 2026. This follows the [Bell–GHZ assessment checkpoint](2026-10-24-bell-ghz-assessment-and-code-target.md). Canonical graph confidence and solved status remain unchanged.

## Sources and graph context

The retrieved anchors are `domain.quantum_information_theory` and `domain.algebra`, with `move.finitize`. These are literature-labelled concepts; there is no direct canonical edge between the two anchors. Their proximity is not mathematical evidence. The graph still has 59 nodes and 115 edges, with no new Lean declarations in this checkpoint.

The [CGL secret-sharing code](https://arxiv.org/html/quant-ph/9901025v1), the AME/error-correction correspondence, local-error orthogonality, Choi's criterion and Weyl mutually unbiased bases are prior ingredients. [Eltschka et al., Eq. 22](https://arxiv.org/html/1807.09165v1) already gives the parameterized products of reduction-type maps used here. [Huber et al.](https://arxiv.org/html/1708.06298v2) supplies the earlier local-error/twirl, purity and shadow-enumerator framework. Neither the map family nor inserting code-projector marginal purities is a newly invented method.

Reading is bounded: the audit examined the indicated inversion sections and appendix, the shadow paper's error/purity/enumerator passages, CGL's construction, and the opening reduction-map comparison in [1512.08278v2](https://arxiv.org/html/1512.08278v2). Other appendices and bibliographies were not exhaustively reviewed. No equivalent statement of the complete spectrum, exact threshold and fixed-qutrit realization was identified in those read passages; that is not a priority certificate.

## Audited mathematical evidence

Audit 415 closed the universal qutrit `H` sector map for all complex logical matrix units, including its pure-state inverse and conjugation conventions. Its 34-file C/D archive was checked. A missing conjugation is detectable exactly and is not justified by successful real-state examples.

Audit 423 subsequently validated the main mathematical claims of proposal 422 **with two explicit wording corrections**, not the literal original. Its complete proof and bounded source comparison are preserved in a 61-file archive. The corrections are: alpha and alpha+t² are the automatically nonnegative sectors, while eta can be negative; the sharp gap is nonnegative at the CP boundary and strictly positive only before it. The original proposal remains frozen and a separate addendum 425 records both corrections.

For any existing AME(4,d) encoding, d>=3, the unnormalized Choi matrix of the threefold reduction map restricted to the code has the complete spectrum

- alpha=1−3t/d, multiplicity d^4−3d²+2;
- alpha+t², multiplicity 3(d²−1);
- eta=1−3t/d+3t²−dt³, multiplicity 1.

The proof uses orthogonal traceless one-site error spaces, not interpolation from small dimensions. The exact CP interval is t<=[1+(d²−1)^(1/3)]/d for 0<=t<=1. For a complex encoding V, the row-vectorized coefficient Gram for C=VB is **conjugate(J)**. The opposite matrix support is unrestricted, but its entire column space must lie in the code. The sharp nonnegative bound tensorizes within the CP interval.

At t=1/2 the dimension boundary is 13, conditional on existence of the encoding. The rank-15 code projector has q=−27/8, so that adverse example does not refute rank-two Werner positivity. For the fixed CGL qutrit code, audit 423 also checked all 324 coefficient/sector identities and an explicitly normalized measure-and-prepare realization for every t in [0,1]. This establishes entanglement breaking between logical input/reference and the entire physical output. It does not assert separability between output shares or entanglement breaking for every AME code.

These are analytic and exact-arithmetic mathematical results with a dependent AI audit, not Lean-formal results, independent human review or AIRR screening.

## Exact manuscript and assessment status

The six-page manuscript **Three-level Choi spectra of reduction maps on perfect-tensor codes** is frozen as draft 1, with scientific supplement. PDF SHA256: `4199f266ea185694522e52c17dcb214ea8071c5a1583eafba2258ba21bf0fe0d`. Packet-manifest SHA256: `0ef5954ebcf549d173b82fbf7ef9343f24a77411382c1e0f4fdd8c6d34f2ecb9`.

The source compiles; the final six rendered pages were inspected. Exact author checks include full 81- and 625-dimensional polynomial coefficient Grams and a non-real encoding that rejects the unconjugated formula. These private verification records are not a ready public Research Capsule or a new canonical formalization.

Full exact-PDF review 427 is running. **No importance or technical score exists yet for this draft.** The earlier Bell–GHZ manuscript's private 9.0 technical/5.0 importance result is not inherited. Requested reviewer configuration is Astra xhigh; actual runtime identity/effort are unattested. Reused context, shared filesystem and prior participation are declared. No public model score has been imported into AIRR.

The manuscript is not yet deposited. It does not dominate the earlier one-ray anchor theorem: whole-code support and higher-rank sectors are different restrictions. The arbitrary logical one-ray comparison with a second direction outside the code is still open.

## Bridge card: five physical shares

- Target: the fivefold reduction map on an arbitrary AME(6,d) encoding.
- Source anchors: quantum information and algebra; move: finitize.
- Current candidate confidence: speculative / under audit; no score.
- Dictionary: one- and two-site local errors become subspace projections; their intersections determine a lower bound on the restricted Choi matrix.
- Preserved structure: original physical trace slots, reference normalization, complex Gram conjugation, Frobenius norms and complete operator support.
- Hypothesis to remove: the three-share restriction of the current spectral theorem. The proposed result would cover five physical shares, not arbitrary copy counts.
- Missing structure: no assumption that error spaces on disjoint pairs are orthogonal, and no claim that the complete five-copy spectrum is universal.
- Falsifier: an AME(6,d) and exact direction below the proposed minimum, a failed error-space/normalization identity, or a prior equivalent theorem requiring reattribution.
- Minimal formal target: orthogonality of the four pair-error projections in each fixed-site star and the sum bound 2T<=5R.
- Next task: mathematical and bounded antecedent audit 430 of frozen producer proposal 429. Do not revise draft 1 or transfer a score before that audit and a new exact-version assessment.

The producer proposes the exact minimum eta5=1−5t/d+10t²/d²−10t³/d+5t^4−dt^5. The argument keeps the possible overlaps of disjoint pair errors, bounds their sum by five orthogonal star sums, and compares the remaining sectors with eta5 by explicit positive quadratic identities. If valid, it gives a monotone quintic CP threshold and a half-parameter boundary at dimension 38. **Those are pending claims, not closed results in this checkpoint.** The scalar projector expectation itself follows known AME purities; the proposed stronger content is the operator lower bound for every such perfect tensor.

The known six-vertex wheel graph supplies a possible construction: the producer checked all twenty three-by-three cut determinants are ±1 over the integers and gave a direct Fourier argument over Z_d. [Helwig's AME graph-state paper](https://arxiv.org/abs/1306.2879) is a source to compare, not evidence of a newly constructed code. Audit 430 must check the universal composite-dimension argument and the spectral claim separately.

## Preserved adverse evidence

The stronger full-code Schur **copositivity** route fails: audit 423 independently reproduced the rational value −32674562/21 in the supplied integer direction. Its reshaped matrix has rank 25, so it does not falsify block positivity or the rank-two Werner problem. The fixed real matrix's two partial transposes coincide; that fact must not be extrapolated to arbitrary complex inputs.

Producer 429 first guessed the wrong multiplicities for an auxiliary qubit pair-error operator. The exact spectrum is 0(19), 2(45); the guessed 0(16), 1(6), 2(42) assertion failed and its code is retained. A second run failed a structural SymPy equality between equivalent factorizations; the expanded difference check passed. The universal proof uses the star bound, not the guessed spectrum. Audit 423 also preserved its own initial Float initialization error and sealing/encoding failures. None of these histories was overwritten into a clean first-run claim.

Private source copies and full audit artifacts are not redistributed here. This note records original synthesis, attributed facts and pending obligations; it grants no corpus-training permission. Importance above 7 remains unachieved.
