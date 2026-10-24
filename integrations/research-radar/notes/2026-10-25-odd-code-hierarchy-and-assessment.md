# Encoded positivity: assessed manuscript and an odd-length hierarchy

Observed 25 October 2026. This updates the dated [perfect-code checkpoint](2026-10-25-perfect-code-spectrum-and-five-copy-target.md). It records mathematical evidence and exact-version assessments, not a new canonical formal result or AIRR admission.

## Assessed manuscript

The ten-page draft 2, **Sharp positivity orders for reduction maps on perfect-tensor codes**, has completed full review 438. Its private single-model recommendation is **accept**, technical quality **9.0/10**, AIRR importance **5.0/10**. No material mathematical objection or mandatory correction was found. The reviewer regards it as a specialized theoretical contribution; the importance-above-seven objective remains unmet.

PDF SHA256: `1b108221b9ada86f87af495abcc07a3e05d7bf84e31fc90d3053d291b91a2f69`. Scientific-packet manifest: `64572ce15f813795ba1ed2d533b48bf59143dae767df30979645aa7063af370a`. Review manifest: `e8f69f1a9c8ecf0b55d16264f68cd03ee9f2dc91de9f71c42c5b2ff411bc7319`; receipt: `7e2f0ae7eef77969953064a6d4eea776c2c45ccdd60c5855a33ce3f9eefc0ecf`.

The full report, proof reconstruction and bounded source comparison were read; all 143 review files were checked byte-for-byte between working and durable archives. The 31 original input files remain intact. The reviewer implemented 231 exact checks separately from the author scripts, including a complex GF(4) code, a complex rotated wheel and mixed-output-block vectors. That separate implementation does not make the reviewer an independent human or an isolated model.

Requested configuration was Astra xhigh; actual model identity and effort are unattested. Prior participation and shared context/filesystem are declared. The private recommendation is not publication, official model-assessment metadata or editorial acceptance. The earlier six-page draft retains its own 8.5 technical/4.0 importance review; neither that score nor draft 2's score transfers to later extensions.

Audit 433 has also closed the rank-order derivation. It validates the stronger privacy assertion against the entire output-code block, the CP complement and the optimal uniform orders 8/32, with the local-trace, effective-level and complex-conjugation conventions made explicit. The three-copy rank minimum is exact throughout its parameter interval. The five-copy rank classification is a sign criterion at t=1/2; its all-parameter theorem concerns the least Choi eigenvalue. These scopes remain distinct.

## All odd lengths: mathematical audit closed with a correction

Candidate 439 and audit 440 extend the operator argument to odd n>=3, conditional on an AME(n+1,d) encoding. Let L=(n−1)/2, define

`f(z)=sum_(j=0)^L binom(n,j)(−z)^j`, `a=f(t/d)`, `h=f(1/(dt))`.

The complete unnormalized Choi matrix splits by the physical output code: its code block is isotropic, with parameters a and b=−t^n h. Centered local-error projections lie outside the entire output-code block by QEC privacy. Expanding retained/traced sites gives exact coefficients for every error support. Projections belonging to different supports need not be orthogonal; the proof bounds their possible negative contribution individually.

For 0<t<=1 and d>=2n²/t, audit 440 validates a CP complement with unnormalized Choi gap at least `1−t²/(2n)−t^(n−1)/2 >= 1/3`. Consequently k-positivity is equivalent to

`a−min(k,d)t^n h >= 0`, for positive integers k.

The dimension-uniform integer order is `floor(t^(−n))`, and cannot be increased over the stated family: explicit code-projector witnesses in sufficiently large prime dimensions give a negative value at the next order. Their existence uses the established [MDS/polynomial-evaluation construction](https://arxiv.org/html/1701.03359v2), not a new code. A level capped at d means CP and therefore every ancillary integer level, not a finite maximum d.

At t=1/2 the dimension domain improves to d>=2n, with optimal uniform order 2^n. **This uses its own gap**, 3/4 for n=3 and `3/4−2n/2^n >= 7/16` for odd n>=5. The phrase “same conclusions” in the frozen producer note was too broad if read as transferring the first numerical gap formula to this larger domain. The exact counterexample n=3,d=7 gives an outside eigenvalue 11/14, below the first formula's 5/6. The original is preserved; the separate correction narrows that formula, while the common 1/3 bound and positivity classification survive.

Audit-440 manifest: `a3c197bfd0bfd92676cf1cbf5b52848930f981bec4e35230bcf08eef0c5040cd`; receipt: `22b6364d4a4dc0308e4667101c4ebc1d454c70f85c05b2b38e2721a3883c21ea`. All 40 C/D files and manifest entries were checked, with complete proof and source comparison read. It is a dependent mathematical audit, unscored and not a manuscript assessment.

## Prior mechanisms and limits

The map family is prior: [Eltschka et al., Eq. 22](https://arxiv.org/html/1807.09165v1) contains the parametrized reduction products. [Terhal–Horodecki](https://arxiv.org/abs/quant-ph/9911117) supplies the classical Schmidt/isotropic optimization. Codes, privacy and error spaces are earlier tools. The specific audited statement combines their encoded output decomposition with a bound proving positivity of the complement in the stated dimension domains.

Every map in this family is completely copositive for 0<=t<=1: the partially transposed local Choi is I−tF>=0. Encoding preserves that property. It therefore lies in the **trivial** tensor-stable class of [Müller-Hermes–Reeb–Wolf](https://arxiv.org/html/1502.05630v2). No new nontrivial tensor-stable map, global Werner/NPPT result or unrestricted higher-rank tensor positivity follows. Higher k-positivity is not tensorized outside CP.

The audit's primary comparison is bounded; no worldwide priority claim follows from an unsuccessful duplicate search. A future manuscript must include the corrected gap and this copositivity limit before receiving its own full assessment. Draft 2's importance 5.0 does not rate the general hierarchy.

## Bridge card: seven-copy refinement still under audit

- Target: remove the large-dimension restriction for the seven-copy encoded family.
- Source anchors: `domain.quantum_information_theory`, `domain.algebra`; move `move.finitize`.
- Current confidence: speculative pending audit 443; no score or new manuscript.
- Graph context: the two literature anchors have no direct canonical edge; the retrieved radius-two neighborhood has 15 nodes. Graph proximity is not a proof. Canonical counts remain 59 nodes/115 edges.
- Dictionary: AME eight-party uniformity becomes orthogonality of distinct pair-error projections; the code block becomes a logical isotropic Choi matrix.
- Preserved structure: whole output-code support, original trace slots, unnormalized reference factor, complex Gram conjugation and Schmidt rank under local output projections.
- Candidate mechanism: the sum of pair-error projections is a projection, while the coefficients of single and triple errors are nonnegative. This may give the exact least eigenvalue min(a,eta) and a CP complement throughout 0<=t<=1,d>=4.
- Hypothesis to remove: the sufficient large-dimension bound of the all-odd theorem, for this fixed length.
- Candidate payoff: exact seven-copy rank intervals and uniform order 128 at the half parameter; an analytic rank-129 witness uses a known prime-dimensional MDS code.
- Falsifier: a failed projection/orthogonality identity, a mixed-block low-Schmidt-rank negative direction inside the claimed positive domain, incorrect parameter endpoints, or an equivalent prior theorem requiring reattribution.
- Minimal formal target: prove pair-error orthogonality from four-party uniformity and the resulting output-complement inequality.
- Next finite task: audit 443 reconstructs the universal proof and exact controls separately. Scalar checks alone do not validate the operator theorem; no enormous witness matrix is claimed constructed.

## Source refresh and custody

Current repository heads remain unchanged from the preceding census: OpenAI `1581d4cbdd69a0faf34b2089614fe2a814316a6a`, DeepMind superhuman `9b620a92886b3a7655b30ddcfe36e725e9596509`, and Anthropic FLT `6e837e75355538c7f80bab5b956861e86c4eacc2`. OpenAI's README still reports 719 manuscripts/372 families. This is a metadata refresh plus selected statement/primary-source reading, not a rereading of all proofs or a formal rebuild. The instrument-extraction survey was revisited as a reading guide, not proof certification.

Private source snapshots, full referee packets and author failure records remain outside this repository. No training permission, public Research Capsule readiness, new Lean result or canonical confidence promotion is implied by this note. The research-radar registry remains at 28 source cards and 10 candidate cards; this dated synthesis is not an additional registered card.
