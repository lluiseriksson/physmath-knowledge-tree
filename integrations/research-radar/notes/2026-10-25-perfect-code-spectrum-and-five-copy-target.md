# Perfect-code reviews and a rank-positivity target

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

Full exact-PDF review 427 has closed: **8.5 technical quality, 4.0 AIRR importance, minor revision** for those exact bytes. The complete report and proof were read and its 112-file C/D archive checked. It found no material mathematical error, requested an explicit spectral-label convention, and supplied a classical EB comparison. The earlier Bell–GHZ manuscript's private 9.0 technical/5.0 importance result is not inherited. Requested reviewer configuration is Astra xhigh; actual runtime identity/effort are unattested. Reused context, shared filesystem and prior participation are declared. No public model score has been imported into AIRR.

The reviewer derived the abstract EB conclusion through [Horodecki–Lewenstein–Vidal–Cirac's low-rank PPT separability theorem](https://arxiv.org/abs/quant-ph/0002089v1). At d=3,t=1 the Choi is PPT, rank 24, with marginal-support dimensions 3 and 24; the classical criterion proves separability. A positive decomposition extends EB to the whole parameter interval, even for arbitrary AME(4,3). This is a reviewer deduction from a classic theorem, not a claim that the particular application or CGL sector formulas were published in that source. It limits the novelty credit of abstract EB existence. The explicit measure-and-prepare realization remains separate information. The next manuscript must incorporate this comparison and the eigenvalue-label convention rather than only polishing language to seek a higher score.

The manuscript is not yet deposited. It does not dominate the earlier one-ray anchor theorem: whole-code support and higher-rank sectors are different restrictions. The arbitrary logical one-ray comparison with a second direction outside the code is still open.

## Five physical shares: closed mathematical audit

Audit 430 validated the universal five-copy minimum eta5=1−5t/d+10t²/d²−10t³/d+5t^4−dt^5, its simplicity for t>0, the unique monotone quintic CP threshold, and the half-parameter dimension boundary at 38. The complete proof and source comparison were read and 44 C/D files checked. The argument retains overlaps of disjoint pair-error spaces: summing five orthogonal incident-pair stars proves 2T<=5R. Explicit positive quadratic gaps show all other sectors exceed eta5. It is a universal minimum theorem, not a universal full-spectrum theorem.

The normalization explanation needed a separate accepted correction: rowvec(V*)=sqrt(d) conjugate(Psi); its normalized vector is conjugate(Psi). This changes no inequality or threshold. The original proposal remains frozen. No manuscript score is assigned to this extension and the six-page draft has not been silently replaced.

## Bridge card: exact positivity orders of encoded maps

- Target: rank-constrained positivity of three- and fivefold reduction maps on perfect-code supports.
- Source anchors: quantum information and algebra; move: finitize.
- Current candidate confidence: speculative / under audit; no score.
- Dictionary: code privacy may place centered error subspaces entirely in the physical output complement of the code, leaving an isotropic logical block and a CP complement.
- Preserved structure: original physical trace slots, reference normalization, complex Gram conjugation, Frobenius norms and complete operator support.
- Hypothesis to remove: complete positivity limits the entire code dimension; the proposed rank-constrained classification would allow unbounded dimensions while keeping an explicit rank limit.
- Missing structure: no assumption that error spaces on disjoint pairs are orthogonal, and no claim that the complete five-copy spectrum is universal.
- Falsifier: an AME(6,d) and exact direction below the proposed minimum, a failed error-space/normalization identity, or a prior equivalent theorem requiring reattribution.
- Minimal formal target: prove the stronger output-support consequence of the QEC privacy identity and the CP property of the remaining output block.
- Next task: mathematical and bounded antecedent audit 433 of producer proposal 432. Group validated extensions in the parent manuscript and assess its new exact version; no score is inherited from the six-page draft.

The producer now proposes exact k-positivity classifications for the encoded maps. They would imply uniform order 8 for three physical shares and order 32 for five shares at t=1/2, with sharp adverse rank-9 and rank-33 code-projector examples in dimensions 43 and 245. **These rank-order claims are pending audit 433.** They concern the encoded logical map and whole-code column supports, not unrestricted physical tensor powers. Ordinary isotropic k-positivity and Schmidt-overlap criteria are prior tools; the missing obligation is the asserted output-block decomposition and positive complement. No tensor-stability claim for merely k-positive maps is inferred.

The known six-vertex wheel graph supplies AME(6,d) in every integer dimension d>=2. Audit 430 verified the twenty integer-unimodular cuts and cyclic-ring Fourier argument, and compared the graph visually with [Helwig's Figure 2(d)](https://arxiv.org/html/1306.2879v1). That paper's section 4.3 already gives the general existence conclusion. Neither the graph nor all-d existence is claimed new here. The scalar projector expectations also follow known AME purities; the additional audited five-copy content is the operator lower bound in every direction.

## Preserved adverse evidence

The stronger full-code Schur **copositivity** route fails: audit 423 independently reproduced the rational value −32674562/21 in the supplied integer direction. Its reshaped matrix has rank 25, so it does not falsify block positivity or the rank-two Werner problem. The fixed real matrix's two partial transposes coincide; that fact must not be extrapolated to arbitrary complex inputs.

Producer 429 first guessed the wrong multiplicities for an auxiliary qubit pair-error operator. The exact spectrum is 0(19), 2(45); the guessed 0(16), 1(6), 2(42) assertion failed and its code is retained. A second run failed a structural SymPy equality between equivalent factorizations; the expanded difference check passed. The universal proof uses the star bound, not the guessed spectrum. Audit 423 also preserved its own initial Float initialization error and sealing/encoding failures. None of these histories was overwritten into a clean first-run claim.

Private source copies and full audit artifacts are not redistributed here. This note records original synthesis, attributed facts and pending obligations; it grants no corpus-training permission. Importance above 7 remains unachieved.
