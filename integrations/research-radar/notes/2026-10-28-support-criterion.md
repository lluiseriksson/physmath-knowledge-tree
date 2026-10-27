# From symmetric channels to a support criterion

28 October 2026. Directed follow-up, not an exhaustive literature search or a priority certificate. This note supersedes the *pending* status of the three-column direction in the [27 October snapshot](2026-10-27-classical-reference.md); that historical snapshot remains intact.

## Evidence layers and current review status

- **literature:** Doeblin replacement decompositions, joint convexity and data processing already give the upper bound `eta_c <= 1-d`. Classical scrambling characterizes ordinary strict KL contraction. These prior facts are not new discoveries.
- **heuristic, technically audited:** [audit1136](../evidence/2026-10-28-support/audit1136/AUDIT1136.txt) supports the proposed converse for finite classical channels, including its fixed-input-dimension uniformity. This is a dependent AI mathematical audit with recorded exact and interval controls, not a Lean theorem or an independent human review.
- **speculative:** novelty beyond the selected primary passages, resource-constrained optimality and practical advantage remain open. No general formula `eta_c=1-d`, uniformity in dimension or capacity theorem is inferred.
- **formal:** no new formal declaration or confidence promotion. Canonical graph topology, labels and evaluation routes are unchanged. The [retrieved radius-two subgraph](../evidence/2026-10-28-support/SUBGRAPH1150.json) has four nodes and four edges.

The [public symmetric-channel v1 and its full assessment](https://airr.science/papers/ARR-2026-564FZ70CSN83KACD/versions/v1/#model-assessments) fix the PDF SHA256 `3a08346e76b1a168aa3759921ae336aa6d97bd739eb61f8b42fa800b3b18f783`. Review1128 assigns importance **6.5**, global **6.3** and technical quality **8.8**, with all objections retained. It is a Working paper, not editorial acceptance or peer review. These judgments do not grade the extension below.

The connected fifteen-page manuscript *Support and quantum-reference activation of classical channels* is frozen separately as PDF SHA256 `203d0c2fde218e4de67fc54852129bdc70a8352336f68e4222e0a01e551c8288`. Its full review1148 is pending. Twelve bounded computational checkers replayed successfully; three dependency-path lines were adapted only in execution copies. This is not a universal proof. No new public version or grade is asserted. The objective strictly above7 remains unmet.

Requested reviewer configuration is GPT-6 Astra xhigh; effective model identity, effort, runtime isolation and independence are unattested. Shared filesystem, reused context and prior Codex involvement are disclosed. Component audits are not extra manuscript votes.

## Bridge card: common support versus pairwise overlap

- Target node: `domain.quantum_information_theory`.
- Source context: `bridge.local_operations_no_signalling`, `bridge.conditional_mutual_information_recovery`; graph proximity is context, not proof.
- Research move: `move.spectralize`, with a finite Schur-complement falsifier before extrapolation.
- Current confidence: `heuristic`, with technical audit1136 and explicit boundaries.
- Dictionary: a column-stochastic matrix `K(y|i)` becomes a dephasing classical channel; scalar input letters become classical flags carrying noncommuting reference blocks. Common output support is measured by `d(K)=sum_y min_i K(y|i)`. Equal reference marginals remain a constraint on the compared input states.
- Mechanism: when `d>0`, the known replacement component contracts complete Umegaki divergence strictly. When `d=0`, every nonzero row misses an input letter. A single simplex-based input preparation works for all such finite matrices at fixed input size n. The *minimum* eigenvector of each minus-output block gives a binary readout whose retained divergence tends to the input divergence, both approaching `ln(2)`. Proper-row Gram inverses and row-independent Schur bounds control this limit.
- Proposed result: `eta_c^D(K)=1 iff d(K)=0`, for complete equal-reference Umegaki divergence and faithful normalized finite-dimensional admissible pairs. The same criterion holds for binary output measurement with the quantum input divergence as denominator. This is not a classical-input-denominator claim.
- Structure preserved: finite classical input/output, quantum reference dimension n, separable CQ input, equal reference, divergence orientation and a common K-independent preparation at each k.
- Quantifiers: for fixed n the lower approaches1 uniformly over finite zero-Doeblin matrices, even when support, weights and finite output count vary with k. Readout effects depend on K and k. No uniformity in n, conditioning, precision cost, a fixed effect or a positive spectral floor is claimed.
- External hypothesis removed: symmetry of the classical channel is unnecessary for this criterion. Pairwise column overlap can force ordinary strict contraction while absence of a row common to all columns allows complete retention arbitrarily close to1. The known Doeblin upper alone does not supply this converse.
- Preserved cost: the sealed preparation has beta=`1/(4nk)`, delta=`2^-k`, epsilon=`beta*delta`; conditioning deteriorates and effects vary. The finite limiting divergence is not a robustness or capacity certificate.
- Falsifiers / abandonment: a covering prior theorem with the same reference, denominator and quantifiers defeats novelty. A zero-Doeblin matrix with a strict complete upper defeats the converse. A positive-Doeblin example retaining1 contradicts the known upper. A counterexample to row-independent Schur bounds defeats uniformity.
- Minimal Lean target: the proper simplex Gram inverse and scalar Schur-root bounds with positivity domains; not implemented here.
- Next finite task: a fixed-resource upper/lower comparison with a nonvanishing spectral floor and explicitly bounded measurement precision. Abandon any experimental-robustness narrative if the gap disappears at fixed resources. This task is unexecuted and has no assigned score.

## Adverse controls are part of the result

[Verdict1136](../evidence/2026-10-28-support/audit1136/verdict1136.json), [controls](../evidence/2026-10-28-support/audit1136/CONTROLS1136.json) and [incidents](../evidence/2026-10-28-support/audit1136/INCIDENTS1136.json) retain the following boundaries:

1. Maximizing eigenvector overlap selects the wrong branch for the exclusion example n=k=16. The sealed proof uses the minimum eigenvalue for its specified regularization.
2. Changing epsilon to `beta*sqrt(delta)` changes the cycle-four measured limit to1/2; changing it to `beta*delta^2` can make the minimum inactive. Arbitrary regularization is invalid.
3. Replacing varying effects by their limit gives equal binary probabilities and zero retained divergence.
4. The [original first control](../evidence/2026-10-28-support/candidate1134/CONTROL-FIRST1134.json) measured a common full-support replacement row and lost the rare-event contrast. It remains preserved alongside the corrected flagged-row protocol; the latter is not retroactive success of the former.
5. The binary channel with parameters(.9,.2) has coefficient1/2 although `1-d=.7`. The criterion does not establish equality to the Doeblin upper in general.

The asymmetric three-input example has ordinary KL coefficient at most.75 while certified complete lower ratios exceed.8860189 at k64 and.9328480 at k128. These are divergence ratios, not assessment scores. Nine integer-interval certificates, fifteen proper-support and five full-support exact cases, and ten ambient controls test specified finite claims; they do not replace the proofs or certify priority.

## Selected primary reading and preservation

The [reading ledger](../evidence/2026-10-28-support/audit1136/READINGS1136.json) records versions, SHA256 hashes, actual passages and failures:

- [Quantum Doeblin coefficients,2503.22823v3](https://arxiv.org/abs/2503.22823v3): definitions11–12 and selected contraction propositions/corollary proofs, not all108pages.
- [Conditional contraction coefficients,2608.27171v1](https://arxiv.org/abs/2608.27171v1): selected definitions, Lemmas1–3 and Proposition2, with additional application passages; the easy upper is prior.
- [Cohen et al.,1993](https://doi.org/10.1016/0024-3795(93)90331-H): Theorems4.1–4.2 and Remark4.3 distinguish ordinary scrambling from common support across every column.
- [Buscemi,1511.08893v2](https://arxiv.org/abs/1511.08893v2): selected min-entropy definitions and Corollary3; guessing-order results are not silently exchanged for Umegaki statements.
- [Hirche, Rouze and Stilck Franca,2011.05949v4](https://arxiv.org/abs/2011.05949v4): selected order definitions; remitted proofs were not audited.
- [Doeblin Curves,2606.19859v1](https://arxiv.org/abs/2606.19859v1): abstract/introduction/definitions and a proposition statement, not its proof corpus.

No literal covering converse was identified in those passages. That bounded observation does not establish worldwide originality. Lee–Makur full-text coverage remains unresolved. Search results are leads, not proof readings.

All56 original own dossier files, including failed routes, are byte-exact in ORIGINAL1150.zip; expanded text uses LF and declared whitespace/final-newline transport, with both hashes in the [transport ledger](../evidence/2026-10-28-support/TRANSPORT1150.json). Original archival manifests retain their historical paths. Execution scripts may require their declared local dependency paths; the ledger does not claim standalone replay of every script. No foreign full-text corpus, private account data or credentials are included.
