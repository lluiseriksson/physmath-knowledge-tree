# Exact manuscript review, a tensorization obstruction and a new reset target

The retrieved local context is `domain.quantum_information_theory` and its
literature edges to conditioned operations and conditional-mutual-information
recovery. These edges motivate retaining branch and correlation information;
they supply no new capacity theorem. Canonical graph confidence and Lean
declarations are unchanged.

## Closed assessment and precise source corrections

The full requested GPT-6 Astra xhigh review of the combined entropy-family
manuscript closed with overall AIRR4.5/10, importance4.5/10 and technical
quality8.5/10. It found no invalidating mathematical defect, confirmed the
4,454-cell family certificate through its own rational implementation, and
requested minor corrections. These numbers bind only PDF SHA256
`4c800db8c24ea02a5653c83eb41e0202f73a6bae2157a5fc9b56bcae3485557d`.
The complete report SHA256 is
`bba41dc5959e6479d279bead256124dd6d87601c59692b8f86789c1be4b943fd`.
The coordinator read it in full and checked78 C:/D: copies and76 manifest
payload entries. The reviewer had access to prior-audit disclosures and
historical numerical language in the supplied inputs. Shared files and
model-family participation are declared; independence, runtime isolation,
blindness and worldwide priority are not attested.

The corrected seven-page PDF has SHA256
`85c0dc84cd6c8d8c49b85cdcbd189254006967f958a04a9f315ed533c261908f`.
Ten lemma/theorem/corollary/proof environments and all mathematical
supplementary files remain byte-identical. All seven pages were visually
checked. The completed delta review closed O1/O2/O3 without regression or a fresh
score. Its report SHA256 is
`263a8ee24fecdfee04de8b2060d4611969486a71bafe134da614093c118489f6`;
36 files match between C: and D:. The original566 report remains intact.
This is not a deposit
receipt, an AIRR acceptance or a new full assessment.

- [Roga--Fannes--Zyczkowski0911.5607v2](https://arxiv.org/abs/0911.5607v2),
  Eqs.(3.13),(3.16),(3.17): the selected statements give
  `c=exp(-s/T1)`, `r=exp(-s/T3)`, `T1<=2T3`, hence `c^2<=r`.
  This is a structural Davies condition, not a cited sufficient theorem
  for Holevo additivity. The earlier ambiguous wording is corrected.
- [Fukuda0505022v4](https://arxiv.org/abs/quant-ph/0505022v4): selected
  composition lemma/proof and examples c-e read. The explicit positive
  axial examples require `c^2<=r` or `c^2<=r(r+t)`, both violated here;
  the latter has a uniform gap at least19/100. This does not exclude every
  possible general factorization, and a minimum-output-entropy conclusion
  alone does not establish the particular constrained roof inequality.
- [Shor0201149v3](https://arxiv.org/abs/quant-ph/0201149v3) and
  [0305035v4](https://arxiv.org/abs/quant-ph/0305035v4): abstracts read;
  entanglement-breaking additivity and universal equivalences are distinct
  antecedents, with different quantifiers from this prescribed pair.

## A known exact falsifier for pairwise tensorization

Use the pure five-cycle graph state and apply fixed endpoint channels
`N,Q,N,Q,N` from the family note. All ten two-qubit input marginals are
exactly `I4/4`; consequently every output pair is a product and has zero
mutual information. Yet the output expectation of `X0 Z1 Z4` is `3/100`,
whereas the product of the five output marginals has expectation zero.
A two-outcome Pauli measurement and relative-entropy data processing give
total output correlation at least `9/20000` nats. Exact rational checks
are [available here](../checks/pairwise-obstruction568.py), with
[recorded results](../checks/pairwise-obstruction568.json).

This refutes a proposed bound of total correlation by a constant times
the sum of pairwise mutual informations, even on pure inputs followed by
these noisy channels. It does not refute the two-channel entropy theorem,
an all-copy entropy conjecture or a capacity statement. The graph state is
a known control, not a new construction or a separately scored paper.
Higher-order or conditional correlations cannot be discarded by that route.

## Bridge card: energy-independent spectral avoidance

- Target: `domain.quantum_information_theory`; move: `move.spectralize`.
- Literature: finite-dimensional min-max/interlacing, Gibbs entropy,
  binary-flag loss and coding; not new ingredients individually.
- Current confidence: `speculative` for the new capacity statements;
  finite checks are diagnostic, not a formal certificate.
- Dictionary: forbidden reset eigenvectors become finite-codimension
  constraints; entropy-tail approximants become inputs in the allowed
  subspace; accepted reset weight becomes a binary branch ambiguity.
- Mechanism: intersect the orthogonal complement of any m vectors with a
  finite energy window. Min-max bounds its compressed energies by the
  original levels with index shifted by m. This avoids projecting a
  finite-energy vector onto a possibly infinite-energy forbidden vector.
- Hypothesis reduction sought: replace fixed reset or a bounded reset
  energy by a uniform spectral-tail condition, allowing noncompact unitary
  orbits and arbitrarily oriented noise with no common energy bound.
- Preserved: strict input-cost slack and per-channel coding conventions.
  Lost or unproved: one common encoder/decoder for unknown noise, uniform
  blocklength, efficient coding, exact loss constants and novelty.
- Oscillator target: for the entire class `S(tau)<=B(E)`, prove simultaneous
  absolute recovery of six erasure benchmarks iff `B(E)=o(log(E+1))`;
  necessity is intended through the entanglement-assisted capacity only.
- Candidate converse: a fixed-weight vacuum/thermal mixture has admissible
  entropy of order `log E` and a positive branch-information loss at the
  thermal input. A finite-branch continuity modulus would exclude inputs
  with vanishing entropy deficit from escaping that loss.
- Minimal formal target: the finite min-max index-shift inequality, then
  the elementary spectral-tail estimate `tail_m<=S/log2(m+1)`.
- Falsifier: a failed arbitrary-isometry coding transfer, an uncontrolled
  infinite-conditioning limit, a reset in the purported sufficient class
  with nonvanishing deficit, or a covering primary antecedent. Retire the
  novelty claim if covered; do not rename an energy-budget theorem.

The earlier [reset minimax paper](https://airr.science/papers/ARR-2026-2EXHFGWW0S8MG8QA/versions/v1/)
uses a reset-energy budget. Its dephasing reduction cannot be transplanted
without proof to an entropy budget: dephasing a pure superposition can
increase entropy and leave the admissible reset class. The present working
derivation instead avoids large reset eigenvectors. No old score is carried
over. Sixty finite interlacing cases and36 finite flag checks passed; these
are not an infinite-dimensional proof or a reproducible campaign claim.

## Primary refresh and scope

The [dated observations](../checks/reset-sources572.json) pin the unchanged
OpenAI/math and DeepMind/formal-conjectures heads, primary surfaces and
reading scopes. Anthropic, arXiv, AIRR and the first100 public repository
records were inventoried; ai.viXra returned406 and was not read anew.
The sweep is directed, not exhaustive; no foreign full-text corpus is
redistributed. Winter1507.07775v6 Lemma2 and its proof were read for the
finite-system conditional-entropy modulus. Catalano2604.26874v2 was read
at abstract/introduction level here, not audited in full. The importance
greater-than-seven objective remains unmet.
