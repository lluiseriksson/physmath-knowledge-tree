# Frontier refresh and a non-Davies test channel

Observed 25 October 2026. Directed source reading and an exact guardrail,
not a new manuscript, a new channel model or a claimed solution of additivity.

## Source delta and selection decisions

The [observation record](../checks/frontier542-sources.json) fixes source hashes,
times and reading levels. Metadata coverage is not proof coverage.

- OpenAI/math remains at `1581d4cbdd69a0faf34b2089614fe2a814316a6a`.
  No new manuscript was inferred from a secondary index's different count.
- DeepMind/formal-conjectures advanced five commits from
  `13538923146e443a47b66a58741b0267cd840a65` to
  `885f152b2edbe059705b00bc047e32291e3867a2`. The delta inventories normality,
  an Erdős 982 concyclic variant, Erdős 698, a generic tensor-rank endpoint and
  crystal-component API lemmas. Only the selected statements below were read.
- [Erdős 982 at the pinned commit](https://github.com/google-deepmind/formal-conjectures/blob/885f152b2edbe059705b00bc047e32291e3867a2/FormalConjectures/ErdosProblems/982.lean)
  separates the open convex-polygon problem from the solved concyclic variant.
  Neither a solved tag nor the main file's `sorry` is a locally checked proof;
  its externally linked proof was not built here. A circular example is not
  progress on the unrestricted convex-polygon statement.
- [TensorRank at the same commit](https://github.com/google-deepmind/formal-conjectures/blob/885f152b2edbe059705b00bc047e32291e3867a2/FormalConjectures/Arxiv/0805.3777/TensorRank.lean)
  records the known critical generic-rank endpoint. Its detailed declaration
  also records complex 3-by-3-by-5 maximal rank six with a linked external proof,
  despite the introductory paragraph still calling that entry undetermined.
  This is a statement/source consistency warning, not our discovery or a local
  verification of that proof. The self-commutator rank problem is a different
  invariant; the shared word rank provides no transfer theorem.
- Anthropic's [FLT announcement](https://www.anthropic.com/research/formalizing-fermats-last-theorem)
  was revisited as methodological context; no formalization build or new FLT
  result is claimed. AIRR catalogue metadata remained unchanged by content hash.
  The ai.viXra author list was readable through the web reader; a separate
  direct snapshot request returned 406 and is recorded as failed access.

The latest own Davies draft explicitly retains the assumption `c^2<=r` in
Bloch coordinates. Its broader phase-covariant complete-positivity region is
not a theorem of that draft. This distinction motivates the finite test below.

## Exact gap in immediate coverage

Consider the standard phase-covariant qubit map

```text
(x,y,z) -> (c*x,c*y,r*z+t),
c=3/5, r=1/4, t=1/5.
```

Its unnormalized Choi matrix, in reference/output order, is

```text
[ 29/40   0      0      3/5  ]
[   0    11/40   0       0   ]
[   0      0    19/40    0   ]
[  3/5     0      0     21/40].
```

Both output traces are one. The nontrivial positive block has determinant
`33/1600`, so the Choi matrix is positive definite. After partial transpose,
the middle principal minor is `-367/1600`; hence this channel is not
entanglement-breaking. Its translation is nonzero, so it is not unital.
Also `r-c^2=-11/100`, outside the Davies assumption.

For a pure input with Bloch coordinate z, the squared output radius is
`c^2*(1-z^2)+(r*z+t)^2`. This concave quadratic attains its exact maximum
`243/595<1` at `z=20/119`. Mixed inputs cannot create a pure output by convexity.
Thus the map also escapes the pure-output hypothesis of
[Tang, Zhu, Bai and Wang, 2609.28592v1](https://arxiv.org/html/2609.28592v1).
Abstract, introduction and the support criterion's stated scope were consulted;
that external triangular theorem was not reproved here.

The [standard-library rational control](../checks/phasecov542-gate.py) checks
these identities; its [output](../checks/phasecov542-gate.json) is finite exact
evidence for this particular example. This is a known type of channel, not a
novel model, a nonadditivity witness or a claim that no other theorem covers it.

## Separate operational gate

[Wilde, 1807.11939v3](https://arxiv.org/html/1807.11939v3), abstract, operational
definitions, Definition 2 and Theorem 1, distinguishes parallel from sequential
simulation and gives their equality for resource-seizable teleportation-simulable
channels. Those hypotheses must be proved; a parallel entanglement-cost result
alone does not supply them. The full proof was not audited here.

For our test map, ordinary X-Pauli covariance fails already at input I/2:
the two output states differ by `t*sigma_z`, with trace distance `1/5`.
This rejects that specific covariance shortcut. It does not rule out every
LOCC simulation or establish a sequential cost.

## Bridge card and decision

- Target: arbitrary-partner Holevo additivity for a genuinely non-Davies,
  nonunital phase-covariant channel, or a certified violation.
- Retrieved context: `domain.quantum_information_theory` and
  `bridge.conditional_mutual_information_recovery`, with their one connecting
  edge, before this synthesis. Canonical confidence is unchanged.
- Dictionary: Bloch contraction/translation specifies a CPTP map; its
  Stinespring output convex roof is the object required by a strong-additivity
  argument. A scalar pure-input entropy curve does not preserve that roof or
  arbitrary reference correlations.
- Mechanism sought: remove the Davies inequality from a valid operator or
  convex-roof bound, retaining every partner and input quantifier.
- Preserved: exact CP, normalization and a concrete target outside four easy
  coverage classes. Lost/unproved: the required all-partner entropy inequality.
- Literature: attributed support and operational theorems. Exact own control:
  the rational identities above. Heuristic: choosing this channel as a useful
  test point. Speculative: extending additivity. Formal: no new Lean proof.
- Falsifier/abandonment: a previously covering theorem, a failed proposed
  operator inequality or a certified violating input. A failed Pauli covariance
  test does not refute additivity. No independent global open-status certificate
  has been obtained.
- Next finite task: formulate the full roof-aware inequality for this target
  and search small correlated inputs with explicit error/optimization bounds;
  numerical success cannot replace its universal proof.

Do not publish this guardrail as a separate major-discovery paper or request a
score for it. The existing rigid-spectrum paper's rating remains preserved.
