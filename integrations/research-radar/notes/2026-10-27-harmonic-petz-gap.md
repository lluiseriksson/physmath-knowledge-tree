# Harmonic cancellation, a Petz extension and the unresolved complete bound

27 October 2026. Follow-up to the [exact manuscript review](2026-10-27-reviewed-reset.md). No new paper, manuscript grade or canonical confidence promotion is created.

## Sourced facts — literature

Hiai–Ruskai [1508.03551v1](https://arxiv.org/html/1508.03551v1), Proposition 2.1(i) and Eq. 12–13, express Petz divergences through positive resolvent kernels and a quadratic endpoint. This is prior machinery. Only selected definitions and the representation were read, not the entire proof or paper.

Belzig et al. [2411.19890v3](https://arxiv.org/html/2411.19890v3), Section 7 Definition 7.1, uses a ratio of actual mutual informations with a quantum reference. Hirche et al. [2608.27171v1](https://arxiv.org/html/2608.27171v1), Corollary 3 and Section 3.3, distinguish that quantity from equal-reference two-state contraction and from conditional contraction with unequal reference divergences subtracted. Selected passages were reread; full proof audits and worldwide priority are not claimed. A terminology match does not transfer quantifiers.

## Retrieved context — graph-supported inference

Three canonical nodes and two edges around quantum information were [retrieved before synthesis](../evidence/2026-10-27-harmonic-petz/SUBGRAPH985.json). They motivate retaining the reference and local channel, but prove none of the following inequalities. Canonical graph files, confidence levels and Lean declarations are unchanged.

## Own derivations and hypotheses — speculative

For m local unitaries, positive weights w summing to one, uniform twirl E, and mixture N, [979](../evidence/2026-10-27-harmonic-petz/PROOF979.txt) derives the candidate pair bound h(w)=1−m²/(sum 1/w), under E(rho)=E(sigma). The mechanism shifts tangent coefficients by a common scalar because their uniform sum vanishes, then minimizes a positive weighted quadratic form. It uses joint convexity of an inverse quadratic form, never negative convex state weights. Arbitrary finite reference dimension is retained.

[981](../evidence/2026-10-27-harmonic-petz/PROOF981.txt) applies the same mechanism to Petz resolvent kernels. It removes dependence on the logarithmic generator for faithful states; it does not remove equal-E or positive-weight assumptions. A nontrivial involution twirl has exact coefficient (2w−1)², with a central-state perturbative lower witness. These are parent derivations awaiting scientific review and priority comparison, not formal results.

For local depolarization in dimension d, 979 gives (d²−1)lambda²/[1+(d²−2)lambda]. At qubit lambda=1/2 this is 3/8. The proposed sharper complete-pair upper 1/3 remains unproved. The [983 contrast](../evidence/2026-10-27-harmonic-petz/CONTRAST983.txt) records a two-Bell-state tangent lower construction d²lambda²/[2+(d²−2)lambda]. This is a TWO-STATE lower witness, not an actual-product MI witness. For d=3, lambda=1/2, the resulting interval is [9/22,4/9]; no equality is asserted.

## Refuted shortcut and bounded controls — heuristic evidence

The [exact977 counterexample](../evidence/2026-10-27-harmonic-petz/COUNTEREXAMPLE977.json) refutes a naive partial-trace order step. It does not refute the proposed complete bound. Retain it to prevent repeating the failed route.

979 passed 48 finite metric and 48 pair controls, plus two scalar identities. 981 passed 600 divergence controls on 60 noncommuting faithful pairs and 360 resolvent identity comparisons. [983](../evidence/2026-10-27-harmonic-petz/RESULT983.json) completed 32 fixed-budget local optimizations, all with successful optimizer termination, for two reference dimensions and two metrics. Its best BKM value was approximately 0.33333167667; its best quadratic value was approximately 0.33333232732. A separate [70-digit evaluation](../evidence/2026-10-27-harmonic-petz/VERIFY983.json) of the saved directions remains below 1/3. None of these diagnostics proves the universal upper, certifies an optimum, or assesses a paper. Fixed budgets, seeds and full outcomes are retained; no claim of a computational-campaign reproducibility capsule is made.

## Retained hypothesis, falsifier and next step

The hard missing result remains a uniform BKM inequality for every faithful base, every finite reference and every partial-trace-zero tangent. Replacing the reference-dependent output by global replacement would erase this problem. A stable violating pair refutes the upper-bound route; a covering earlier random-unitary or Doeblin theorem defeats novelty. Search absence establishes neither proof nor priority.

No new Lean-checked theorem or independent review is added. The published exact957 still has importance 4.0, global 4.5 and technical 8.5 from review958; these scores do not transfer here. The research objective of importance strictly greater than seven remains unmet. These connected lemmas belong in one substantive project, not separate minor papers.

[MANIFEST985](../evidence/2026-10-27-harmonic-petz/MANIFEST985.json) records original versus LF transport hashes. Source bodies, credentials and private data are excluded. Original sealed numerical witnesses remain in the research dossier; the public JSON contains the scoped diagnostic outcomes rather than a claimed proof certificate.
