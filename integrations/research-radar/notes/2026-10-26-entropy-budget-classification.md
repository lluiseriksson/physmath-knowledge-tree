# Entropy budgets, compound coding and the exact assessment boundary

This follows the [earlier reset proposal](2026-10-26-entropy-review-and-obstructions.md).
The retrieved small subgraph contains `edge.qinfo.no_signalling` and
`edge.qinfo.cmi_recovery`, both `literature`, incident to
`domain.quantum_information_theory`. Conditional branch information is a useful
dictionary, not a proof imported from graph proximity. Canonical nodes, edges,
confidence labels and Lean declarations are unchanged.

## Sharp statement and the hypothesis actually removed

For fixed `0<lambda<1`, an oscillator input has expected block-average energy
at most E. The reset channel is `lambda id +(1-lambda) tau Tr`. The unknown
reset is fixed throughout the block. Its state need not have bounded energy
or any prescribed eigenvector orientation. For each fixed finite Renyi order,
vanishing absolute entanglement-assisted loss from `2 lambda g(E)` is equivalent
to the following budget condition:

| Order | Budget condition |
| --- | --- |
| `0<alpha<1` | `2^B(E)/E -> 0` |
| `alpha=1` | `B(E)/log2(E+1) -> 0` |
| `1<alpha<infinity` | `B(E) -> 0` |

The same sufficient conditions allow one encoder/decoder sequence for the
entire noise class for C, C_EA, Q and P. Their respective benchmark
coefficients are `lambda, 2lambda, (2lambda-1)+, (2lambda-1)+`.
Necessity is through C_EA and simultaneous recovery. It is not a separate
necessity theorem for each unassisted capacity, particularly when Q=P=0.
Uniform individual Q2/K2 estimates also follow, with noise-dependent codes;
no compound two-way assertion is made.

Compared with an energy-constrained reset family, the eliminated assumption
is a uniform reset-energy/output-approximation bound. It is replaced by a
spectral entropy budget, not by an assertion that arbitrary reset families
are compact. The existing fixed-reset
[spectral recovery paper](https://airr.science/papers/ARR-2026-58XZ9SCZA39DSRF0/versions/v1/)
and [energy-budget minimax paper](https://airr.science/papers/ARR-2026-2EXHFGWW0S8MG8QA/versions/v1/)
remain substantive scientific dependencies.

## Mechanism and operational dictionary

- Spectral concentration maps to a small reset subspace; its orientation may
  vary without changing the spectral-tail bound.
- A fixed finite output compression preserves a spectral tail with rank
  increased by at most one. It need not approximate every output in trace norm.
- A noise-dependent hypothetical branch detector bounds information; it is
  not implemented by the common physical decoder.
- An exact type subspace maps expected probability cost to identical physical
  energy for every supported input, including assisted superpositions.
- Finite-dimensional compound coding then supplies the common decoder, with
  coding length tending to infinity at each fixed E before E grows.

The class need not have finite output entropy. The converse uses a finite
classical branch and a finite-entropy vacuum/thermal witness. It excludes all
near-optimal input states rather than only evaluating the thermal input.
The separate two-way argument uses finite-codimension min-max interlacing and
the earlier paid-seed distillation theorem. Its seed consumes channel uses and
physical input energy; it does not supply a uniform unknown-noise two-way code.

## Primary antecedents and reading scope

The underlying tools are not claimed as new:

- [Verstraete--Cirac, cond-mat/0505140v6](https://arxiv.org/abs/cond-mat/0505140v6),
  Lemma 2 and its spectral-tail proof, selected reading.
- [Schuch et al., 0705.0292v2](https://arxiv.org/abs/0705.0292v2), selected
  introduction on entropy-order distinctions in matrix-product approximation.
- [Bjelakovic--Boche, 0710.3027v2](https://arxiv.org/abs/0710.3027v2),
  Theorems III.1/V.10, finite cq compound coding.
- [Bjelakovic--Boche--Noetzel, 0811.4588v3](https://arxiv.org/abs/0811.4588v3),
  Section 6.1 Lemma 16 and selected proof/error estimates, finite quantum coding.
- [Berta--Gharibyan--Walter, 1603.02282v2](https://arxiv.org/abs/1603.02282v2),
  Theorem 1/Lemma 9 and the assisted classical/quantum dictionary.
- [Winter, 1507.07775v6](https://arxiv.org/abs/1507.07775v6), Lemma 2,
  finite-classical-system conditional-entropy continuity.
- [Cacioppo--Noetzel--Rosati, 2105.04274v1](https://arxiv.org/abs/2105.04274v1),
  Definition 3/Theorem 5 selected statements. Their uniform output-energy and
  effective-projection assumptions cannot simply be assigned to these reset
  classes: a pure reset may be orthogonal to any fixed finite output window.

These are selected locators, not a claim that every foundational proof was
re-proved. Search coverage is directed, with no worldwide novelty certificate.

## Exact manuscript review and retained correction

The nine-page draft entitled *Sharp entropy budgets for communication through
unknown reset noise* was fully assessed in one requested fresh GPT-6 Astra
xhigh conversation. Its PDF SHA256 is
`1dbd037db85a28815e952eb3a5eee17fc2e22c5ec122c1bb0a23894cf14cc952`.
The terminal private assessment is minor revision: global AIRR 4.8/10,
technical quality 5.8/10, scientific importance 4.4/10. Its separate profile
is correctness 4/5, rigor 4/5, novelty 3/5, significance 3/5, reproducibility
4/5. This is not an official public AIRR screening or editorial acceptance.
The importance-above-seven goal remains unmet.

No unresolved theorem-level objection was found. Required R1 corrects an
overgeneralization: only an equal-amplitude finite-support pure superposition
dephases to entropy equal to the logarithm of its support. Unequal amplitudes
are a retained counterexample to the original sentence. Optional clarifications
concern half-trace-norm secrecy, exact inherited theorem locators, and the
distinction between recorded asymptotic evaluations and independent assertions.
The corrected draft has no inherited score.

The coordinator read the entire report and verdict and verified the actual
final inventory: 59 byte-identical C:/D: files, with 57 bound manifest payloads.
The reviewer final prose's count of 58 was superseded by this observed count;
the report and assessment remain unchanged. Report SHA256:
`c253f8de90036a76bb38e92ccb3c76fdd69454ef9d055ed8c2117dff3a855460`.
Verdict SHA256:
`e8e4174019b3dabefb1084419706614d6303d1af945e87e2f5a34148b3b60969`.

Requested configuration is not independently attested model identity or
statistical independence. The author directed Codex derivation and writing;
preparatory audits reused context/shared files and encountered historical
evaluations. The fresh reviewer reports no prior private reports or other
papers' numerical grades read. No human review, Lean proof, blinded experiment
or priority certificate is claimed. Finite calculations are corroboration,
not a ready Research Capsule or proof of a coding limit.

## Remaining bounded target at this earlier checkpoint

Research move: sharpen the existing spectral/branch reduction into a full
minimax loss law. This is a new hypothesis (`speculative`), not a consequence
certified by the review above. Keep the exact assessed PDF immutable.
The proposed sharpening must bound capacity optimized over all inputs,
uniformly over every budget, and match a common-code achievable bound.
Abandon the claim if either optimized-input converse, uniform endpoint error,
or finite type-cost transfer fails. Scalar diagnostics alone cannot close it.
No higher score is forecast or requested for that working argument.

The subsequent [optical minimax review](2026-10-26-optical-minimax-review.md)
records the completed full-law manuscript assessment, its different exact
PDF, the actual 4.5 importance mark and retained minor comments. This earlier
report and its 4.4 mark remain attached to the nine-page predecessor.
