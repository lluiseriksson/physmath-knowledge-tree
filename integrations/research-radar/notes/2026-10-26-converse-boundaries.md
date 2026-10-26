# Two distinct obstructions to a strong-converse follow-up

This is a rejected research route and a scope guard, not a new paper or a
newly discovered phenomenon. The exact published [v2](https://airr.science/papers/ARR-2026-2WNM69XY548JHVMC/versions/v2/)
and its actual importance 5.5 / technical 8.5 assessment remain unchanged.
No further assessment was requested in this run.

## Sourced facts and reading depth

[Cheng and Tomamichel, 2609.08998v1](https://arxiv.org/html/2609.08998v1),
abstract and Theorems 4–5, concern a fixed finite-dimensional memoryless
channel. Those statements were read, not their complete proofs. Their
result cannot simply be imported into a bosonic mean-cost compound model.

[Wilde and Winter, 1308.6732v2](https://arxiv.org/html/1308.6732v2),
Section 1.1 equations 6–9, already give the vacuum-mixture obstruction to
a mean-photon-cost strong converse. That local argument was read. A
photon-number occupation constraint is a different, stronger hypothesis.
[Bardhan and Wilde, 1312.3287v2](https://arxiv.org/abs/1312.3287) explicitly
retain this distinction for thermal/additive noise; only its abstract was
read here. The earlier [reset-channel note](2026-10-24-reset-tilted-and-population-formulas.md)
already records a finite mean-cost counterexample. Repeating it is not novelty.

Independently of energy, [Bjelaković, Boche, Janßen and Nötzel,
1209.6325v2](https://arxiv.org/html/1209.6325v2), Section 5 Remark 4,
already state that compound cq channels need not have a strong converse
under average message error, citing Ahlswede's earlier counterexample.
The introduction and that remark were read; the full theorem chain was not
audited. Maximum error, average error, compound channels and arbitrarily
varying channels must not be interchanged.

## Own analytical reconstruction of two falsifiers

For any channel family, let a common code have expected total photon cost
at most n P' and worst-law average success at least 1-delta_n. Mixing each
code state with n-mode vacuum, with active probability q=P/P', preserves
the common decoder and rate, reduces cost to n P, and gives worst-law
success at least q(1-delta_n). This uses linearity and positivity, even
when vacuum does not remain vacuum at the output. It is a lower-bound
construction, not an exact epsilon-capacity formula or a new theorem of
priority. The physical channel is held fixed when changing the code cost;
one must not change its noise parameter E simultaneously. No generic
strong-converse upgrade under the published mean-cost convention follows.

A separate finite, constant-cost example shows why repairing the energy
constraint alone cannot establish a compound strong converse.
Let W0 be the binary Z channel with W0(1|0)=0, W0(1|1)=1/2, and let W1
be its input/output-reflected channel. Assign cost one to both symbols.
For input probability p of symbol one,

```text
I0(p) = h(p/2) - p ln 2,       I1(p) = I0(1-p).
C0 = C1 = ln(5/4),            maximizers p=2/5 and 3/5.
Ccompound = max_p min(I0(p),I1(p)) = (3/4) ln(4/3).
C0 - Ccompound = (1/4) ln(16875/16384) > 0.
```

The last sign is exact: 625*27 - 64*256 = 491 > 0. Concavity and reflection
put the compound maximizer at p=1/2; differentiating I0 gives p=2/5.
The decimal values in the accompanying diagnostic are illustrative;
the sign does not depend on floating-point accuracy.

To see the operational obstruction with a single decoder, use an o(n)
all-zero pilot of diverging length. Under W0 it is always zero; under W1
the chance of seeing only zeros is 2^(-pilot_length). The decoder can
therefore estimate the fixed law with vanishing error. Split the message
set into equal halves and use in each half a good code for its intended
law, at any fixed rate below ln(5/4). Decode only that half after the
pilot. For each law at least half the messages are decoded with vanishing
conditional error. Thus limsup worst-law average error is at most 1/2,
at rates strictly above Ccompound. The finite-block error can exceed 1/2
by a vanishing amount; no claim of error <=1/2 at every n is made.
All input words have exactly the same cost, so increasing an allowed
mean-cost budget cannot account for this gain. This does not satisfy a
maximum-message-error criterion. The example concerns a discrete family,
also implementable by commuting cq outputs; it is not an established
counterexample inside the paper's particular Gaussian fading family.

## Bridge card and abandonment decision

- Target: domain.quantum_information_theory; preserve operational quantifiers.
- Retrieved context: graph/index.json, the domain node and two adjacent
  no-signalling/recovery edges, saved in retrieval.json. Graph adjacency is
  context, not proof. No canonical graph or confidence label was changed.
- Dictionary: convex code-state mixture -> expected cost/success mixture;
  message subsets -> law-specific successful subsets; common decoder ->
  pilot estimator followed by a fixed conditional decoding rule.
- Preserved: fixed unknown law, equal message probabilities, one code and
  decoder, cost convention, explicit order of block limits.
- Lost or uncertain: exact epsilon-capacity, Gaussian-family realization,
  exponential exponents, and any transfer to maximum error.
- Mechanism: separate expected-cost dilution from law-dependent message
  outage; neither is excluded by a vanishing-error weak converse.
- Falsifier for the proposed upgrade: either construction above. The
  generic upgrade is abandoned, rather than presented as a new paper.
- Remaining speculative target: an exact error/cost tradeoff for a
  precisely restricted Gaussian compound family, after excluding the
  message-partition mechanism or incorporating it in a variational bound.
  No formula or importance prediction is asserted.
- Minimal formal target: affine success/cost for a mixture with a zero-cost
  state. No Lean declaration for it has been proved here.
- Levels: formal = none; literature = the scoped antecedents; heuristic =
  this unreviewed analytical reconstruction; speculative = exact tradeoff.

## Directed fresh inventory and duplicate-discovery guard

Thirteen primary endpoints were refreshed, including OpenAI/math,
Anthropic science, DeepMind, arXiv, AIRR, ai.viXra and public owner repos.
This is inventory coverage, not reading every paper or proof.
OpenAI/math remains 1581d4cbdd69a0faf34b2089614fe2a814316a6a.
DeepMind/formal-conjectures now points to
0219456467178cc97109a573d4909d9f96e81751. Its Green 27 file changes a lower
bound's status to research solved, citing Cao–Yuan. Definitions and
statements were read; sorry bodies are not checked proofs, and no external
Lean project was compiled by this run.

The [Cao–Yuan abstract](https://arxiv.org/abs/2608.06728) reports a
log(p) loglog(p) lower bound. The subsequently read
[Hou–Yang abstract](https://arxiv.org/abs/2610.09349v1) reports the stronger
near-quadratic lower bound and leaves constant-factor order undetermined.
Neither proof was audited here. New repository activity therefore must
not be mistaken for a newly open lower-bound problem or independent
confirmation of the papers. Do not rediscover either established bound.

[Primary pins, hashes and actual reading depths](../evidence/2026-10-26-converse-boundaries/primary-pins.json),
[current metadata inventory](../evidence/2026-10-26-converse-boundaries/source-refresh739.json),
[retrieved subgraph](../evidence/2026-10-26-converse-boundaries/retrieval.json),
and [algebra diagnostic](../evidence/2026-10-26-converse-boundaries/algebra-diagnostic.json)
retain the distinctions. Foreign source bodies and private data are not copied.
