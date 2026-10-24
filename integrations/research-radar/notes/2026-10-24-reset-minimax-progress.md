# Reset minimax progress and fresh-source sweep

## Scope of the new analytical candidate

For the oscillator and fixed transmission probability, the draft studies known identity/replacement channels, optimizing capacities over input energy E and minimizing over reset energy M. It proposes a uniform reduction to a classical entropy game and an explicit beta/digamma parametrization of the limiting absolute loss at M/E=c. The constructed least-favorable family has a zero-energy atom below a branch junction and is diffuse above it. The high-budget binary-entropy plateau is attributed to the known depolarizing asymptotic, not claimed as new.

The earlier threshold note is retained as an historical proof candidate. Later internal audits48,50,51 support its threshold, the uniform reduction and the discrete-certificate continuum proof. Audit51 is conditional on reduction50; the root read both. All were AI checks with reused context. They neither establish novelty nor substitute for a fresh full-manuscript assessment. The thermal-comparison supplement52 is still being finalized. No importance grade is assigned.

The global entropy inequalities retain both constraints and the order of infimum and supremum. A singular Riemann-sum argument and a diagonal slack sequence are required. Replacing these steps with a numerical stationary point would not prove the quantum result. The finite lab preserves exactly that distinction.

## Reusable finite laboratory

[reset-minimax-lab](https://github.com/lluiseriksson/reset-minimax-lab) is a distinct, useful reference rather than another literature index. It preserves the initial solver success with failed energy residual, corrected bounded multistart code, 28 finite games and both linear-program tangent best responses. Larger-grid diagnostics are optional and separate. A local Windows replay and the [Linux/Windows workflow40065903227](https://github.com/lluiseriksson/reset-minimax-lab/actions/runs/40065903227) passed all28 cases at commit093f9d34e3cecfe63a1a6cec0ac46eafdcd68412. The first CI run40065899269 failed on Windows because checkout changed line endings and broke file fingerprints; .gitattributes fixes byte preservation without changing numerical source or results. No floating-point interval or formal certification is claimed.

## Three new primary-source leads

- [Chervonyi–Gukov–Luong, v1](https://arxiv.org/abs/2610.30277v1),21October: selected construction passages suggest a search pattern of identifying repeating structure and verifying its reduced exact representative. Irreducibility and the full asymptotic claims have not been replayed. No implication for our capacity theorem is established.
- [el Abdalaoui, v1](https://arxiv.org/abs/2610.30797v1),22October: a scope critique of a Littlewood counterexample. The critique itself needs mathematical checking; in particular a bound on the maximum is not a pointwise lower bound. This is a contested interpretation lead, not an established correction.
- [Zhang et al., v1](https://arxiv.org/abs/2610.30216v1),21October: selected contract sections bind correctness, resources and reference-system restoration to one execution. A potential bridge to the branch lab must supply the exact execution map; no Lean package or theorem has been checked here.

## Bridge gate

Map a finite branch-lab execution to a formal algorithm execution, preserving controls, all measurement outcomes, symbolic phase and reference-system restoration. Lost or uncertain: representation overhead and the specification of permitted primitives. Falsifier: the encoded program proves correctness for one execution and costs for another, drops a measurement branch, or returns only the marginal state of a borrowed register. The minimal first target is one two-qubit controlled decoder with joint-reference restoration and an attached event count. This remains a proposed formalization task, not an accomplished theorem.

No canonical graph edge is promoted by this update. Metadata coverage, selected reading, finite replay, mathematical audit and formal proof remain separate levels.
