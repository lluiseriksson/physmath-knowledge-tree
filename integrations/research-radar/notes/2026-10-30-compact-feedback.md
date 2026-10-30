# Compact uncertainty: classify a useful input, not the exact law

This is a bounded hypothesis-reduction record for the existing optical learning candidate. It is not a new paper, PDF revision, score, formal capacity theorem or claim of current open-problem resolution. Frozen v4 and its actual report1336 are unchanged.

## Target and mechanism

The target is the finite-family assumption in the feedback lower bound (25), while retaining compact uncertainty, bounded gain, a positive noise floor, a law fixed iid throughout a block, fixed energy before the block limit, and a per-law photon budget.

The [author argument1340](../evidence/2026-10-30-compact-feedback/ARGUMENT1340.md) replaces exact law estimation with finite payoff classification. At any fixed rate strictly below the worst single-law capacity, compactness selects finitely many finite-input laws whose information payoffs cover the uncertainty set. Finitely many probe/bin probabilities distinguish the good payoff cells. The selected payload code must work uniformly over its whole closed cell. It cannot be a code only for a nearby channel center: a fixed approximation error can accumulate with block length.

A deterministic message-free pilot uses o(m) forward symbols and one finite feedback index. A strict payload cost slack pays for the finite-cost probes. Every selected book satisfies the same deterministic word-cost bound, even following a wrong estimate; the actual law therefore retains the photon budget. Conditional message uniformity and fresh iid payload noise are essential to the average-error argument. The proposed reduction depends on the exact uniform compound-code interface in Proposition4, not on tomography alone.

## Bridge card and hypothesis audit

- Target node: domain.quantum_information_theory; existing candidate optical-explicit-learning-gap.
- Source context: the retrieved three-node/two-edge [canonical neighborhood](../evidence/2026-10-30-compact-feedback/SUBGRAPH1341.json). Graph proximity supplies context, not a coding theorem.
- Research move: remove an external finiteness hypothesis by compactness and a robust local coding interface.
- Dictionary: uncertainty law -> parameter; information under a chosen input -> continuous payoff; pilot-bin frequency -> observable coordinate; closed good cell -> one common payload encoder/decoder.
- Preserved: strict information margin, fixed iid law, uniform worst-law error, message independence, deterministic additive word-cost bound.
- Lost or unproved: efficient construction, quantitative pilot length, uniformity in energy or rate approaching capacity, practical scale and quantum resource/fidelity extension.
- Potential payoff: extend the existing optical feedback lower bound to compact uncertainty under the retained coding premises. This remains an author proposal until its complete integration is audited.
- Falsifier: a missing continuity/margin, observationally identical parameters with different chosen payoffs, a center-only decoder, message-dependent pilot, nonuniform cost on an incorrectly selected book, or a changing law defeats the corresponding step.
- Minimal Lean target: the compact finite-observation payoff-selector lemma only. No optical Lean theorem exists here.
- Next finite action: inspect exact closed-cell coding and cost/error interfaces before any revised manuscript; seek a counterexample rather than another numerical gap search.

The universal zero-photon identification shortcut is false: normalized CN(0,1) and CN(x,1) channels agree at x=0 but have different signal-dependent laws. Nonzero probes and paid cost slack avoid using that shortcut. This does not refute the special two-law vacuum pilot already proved in the existing paper.

## Antecedents and abandoned novelty route

[Shrader–Permuter0711.0705v1](https://arxiv.org/html/0711.0705v1) already supplies the arbitrary discrete memoryless compound feedback principle. A standalone claim of a new general learning/minimax principle is abandoned. The proposed work is the constrained optical reduction, with no novelty conclusion from a directed search.

[Berta–Gharibyan–Walter1603.02282v1](https://arxiv.org/html/1603.02282v1) and the selected VI/VII scope in [v2,6March2017](https://arxiv.org/html/1603.02282v2) retain a finite-family quantum feedback result. Their historical limitation is not a verified current open-status statement. The broader quantum analogy is parked: shared-entanglement preparation, fidelity conventions and uniform coding resources have not been discharged here.

[Boche–Janßen–Kaltenstadler1606.09314v3](https://arxiv.org/html/1606.09314v3) is related coding context at abstract/introduction reading level; first preprint30June2016 differs from selected revision25January2017. [Loyka–Charalambous1612.06900v1](https://arxiv.org/abs/1612.06900v1) concerns discrete additive noise without an input cost; that abstract does not rule out a constrained optical learning advantage.

## Evidence and review context

Literature means the explicitly scoped versioned reading above. The current12-endpoint primary refresh is inventory only, directed and not exhaustive; repository commit metadata is not statement/proof reading. Allnine installed formal dependency commits match their pins, without promoting this argument to formal status. Own selector/cost/error reasoning and optical synthesis remain speculative in the registry. No canonical node, edge, routing scenario, manuscript score or source-paper score is changed.

A single separate-context [unscored analytic audit1341](../evidence/2026-10-30-compact-feedback/README.md) found no defect within the retained conditional model. It read the entire exact argument and selected pinned TeX interfaces, not the PDF, prior reviews or external antecedents. The full native report/context/pins are preserved. Two nonblocking clarifications are accepted in an unscored author response: take t=Q=0 for the no-observation case; distinguish deterministic classical cost from expected photon energy. Requested GPT-6 Astra xhigh; effective identity, effort and independence are unverified, shared filesystem and parent historical-source coordination are disclosed. This component audit does not reassess the manuscript, change any grade, certify novelty or supply human peer review/editorial acceptance. Existing quantum-upper-bound and noise interfaces remain conditional premises.
