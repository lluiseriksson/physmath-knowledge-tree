# Reset-channel research: published artifacts, bounded review, next falsifier

This dated update supersedes the pending-release and pending-audit status in
[the earlier note](2026-10-24-spectral-holevo-followup.md), whose historical
record is retained. No canonical graph confidence, routing or Lean statement
is promoted by this update.

## Sourced and recorded facts

The oscillator manuscript is now a public **Working paper**:
[exact version](https://airr.science/papers/ARR-2026-2EXHFGWW0S8MG8QA/versions/v1/).
The same-domain PDF matches SHA256
`f472a6c9380da16347a66b390d12b967a50d221e77a0c96905fb5f3d4868df7e`.
Its original single-model report is now public: AIRR importance4.5, separate
technical quality5.5. Conversion to registry format did not regrade it or
produce a second vote. Working-paper release is not editorial acceptance.

The combined twelve-page manuscript, *Spectral universality and
entanglement-dependent adversaries for energy-constrained quantum reset
channels*, received a fresh-conversation GPT-6 Astra xhigh review of its exact
candidate1 PDF, SHA256
`0fe3f80a36ca03f2d4de7b6d3339ede3bf8f6ffe573b04de19581589cd64682c`.
The recommendation was minor revisions, with no material objections;
**technical quality8.4 and AIRR importance4.6** are separate judgments.
The root checked all101 manifest-listed review files. Shared filesystem and
model-family involvement were disclosed; no independent runtime attestation,
human peer review, formal proof or novelty certification is claimed.

The candidate2 PDF, SHA256
`2366a44ca8e81442b721bcd51e4ac6874635714a0f070436d42489211d732bcb`,
clarifies the finite spectral projection, the isotropic unit-frequency
oscillator, and six spectral families tested at24 scales. It also supplies
complete replay instructions. The first nineteen-file package omitted three
provenance-only input documents; original files and failed executions remain
preserved with a separately hashed supplement. The new complete manifest
contains22 files. Candidate2 has a delta check pending, not a second independent
assessment. Neither candidate is publicly deposited at this checkpoint.

The new finite diagnostics are public in
[reset-minimax-lab, pinned revision fad6a75](https://github.com/lluiseriksson/reset-minimax-lab/tree/fad6a75b1e7e5a71ee0784d2a8a1c9fc5f239bf1).
Run `python verify_extensions.py` after installing `requirements-extensions.txt`.
The wrapper preserves frozen inputs and replays copied groups. Its fourteen
invalid finite ground-KKT certificates are retained as failures. Both original
and extension workflows passed after merge on Windows and Linux. Numerical
reproduction does not prove infinite-tail limits.

## Graph-supported inference and boundary

The target neighborhood is `domain.quantum_information_theory`, its channel
formalism edge `edge.qinfo.no_signalling`, and
`bridge.conditional_mutual_information_recovery`. These nodes justify keeping
channel quantifiers, reference systems and conditioning explicit. They do not
imply capacity additivity or an entropy tensorization theorem. The new
manuscript concerns entanglement-assisted capacity and **single-letter**
Holevo optimization; regularized unassisted capacity remains excluded.

## Speculative bridge61: entropy tensorization with overlap correction

- Target node: `domain.quantum_information_theory`.
- Research move: `move.spectralize`; reduce a possible multi-use entropy
  statement to finite matrix outputs before making an operational claim.
- Confidence: **speculative**, no graph promotion.
- Dictionary: the binary branch of a single replacement channel becomes a
  pattern of replacements across n subsystems; local overlaps remain
  `Tr(psi_i tau)`, while entanglement creates subset entropies and branch
  correlations absent in the one-use argument.
- Proposed bound, not a result: for pure psi, q=1-lambda and natural-log
  entropy, `S(R_tau^tensor n(psi)) >= n[q S(tau)+h(lambda)]
  - sum_i h(q Tr(psi_i tau))`.
- Preserved structure: channel tensor product, reset state and local overlaps.
- Uncertain structure: controlling joint branch ambiguity by local corrections
  uniformly in n; ordinary subadditivity has the wrong direction.
- Potential payoff: a bound of this strength might control entangled-codeword
  corrections. No regularized-capacity consequence is asserted without that
  proof and all uniform estimates.
- Concrete falsifier: any normalized finite pure input and reset state whose
  left-minus-right margin is rigorously negative; near-zero floating margins
  need higher precision or interval control before rejection or validation.
- Next bounded computation: structured entangled inputs, nonuniform and nearly
  rank-deficient resets, with independent channel-application checks.
- Minimal formal target: the one-use pure-state inequality and exact product
  equality controls; not the universal tensorization statement.

Initial floating searches found no counterexample in1680 random cases up to
three uses and local dimension4. Eighty aligned/orthogonal pure-product
controls, up to four uses, had maximum equality error4.45e-16. This is not
proof. A metadata fault stored pre-overwrite reset eigenvalues in pure-reset
rows; the original artifacts are retained. The correction changed no original
entropy, overlap or margin. No Research Capsule is claimed ready, and the
private campaign is not presented here as independently reproducible.

A tempting stronger conditional extension is **rejected**: taking the
unconditioned mixed input equal to a maximally mixed reset already violates
the proposed extra branch-entropy term. It cannot serve as an induction lemma.

## Primary leads read, with limits

[Song et al., v1,29September2026](https://arxiv.org/html/2609.37240v1):
abstract, Lemma3/proof Eq14–19 and Proposition6 proof excerpt Eq33–41 read.
Shifted log-determinant ordering and spectral anti-concentration are possible
tools, but their uniform-reset depolarizing setting does not establish61.

[Berta–Sutter–Walter2023](https://doi.org/10.1007/s00220-023-04678-w):
selected tensorization warning and Section3.4 Corollary3.7 Eq35–39 read.
The dual minimum-output-entropy formulation is a reformulation tool; the
authors explicitly leave its utility for additivity unclear and note general
counterexamples. It is not a proof of61.

Baitenov2024 full text remains unavailable; the manuscript retains its
priority reservation. The company indexes, user papers and repository
inventories are search maps, not an exhaustive reading of all proofs.

## Formal-result layer

No new Lean theorem or checked formal result is produced by this note.
The canonical graph remains59 nodes and115 edges. The importance target
greater than7 remains unmet by these manuscripts.
