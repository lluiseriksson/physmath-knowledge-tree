# A credited switching corollary, with its remaining boundaries

## Source and graph scope

Retrieved `domain.quantum_information_theory` and its two incident literature
edges before writing this note. They provide channel/reference-system context,
not a proof of a coding theorem. No canonical node, edge, confidence, route or
Lean declaration is changed.

This closes the audit that was in progress in the earlier
[optical minimax note](2026-10-26-optical-minimax-review.md). That earlier text
records its dated checkpoint; its speculation is not silently reclassified.

## What the bounded audit supports

**Literature:** Boche, Janssen and Kaltenstadler,
[1606.09314v3](https://arxiv.org/abs/1606.09314v3), Lemma 4, supplies the exact
cyclic message-mask mechanism. Gilbert packing and Forney concatenation supply
the outer error-correction mechanism. Razeghi,
[2608.22685v2](https://arxiv.org/abs/2608.22685v2), Section IV/Theorem 2, already
treats finite classical switching families with a common uniform
capacity-achieving input. Its path-count refinement alone is not a substantial
new discovery. Audit602 read the cited proof passages; the refresh here checked
the arXiv abstracts/version metadata, not every external proof again.

**Heuristic / analytically supported working corollary:** given strong-cost EA
compound-classical inner codes, each *specified known* switch envelope
`s_n=o(n)` admits the same asymptotic rate against seed-oblivious product paths.
Choose an available inner length growing slowly enough that `s_n l_n/n -> 0`.
At most `s_n` inner blocks straddle changes. A private uniform modular shift
makes good-block average inner error a per-outer-symbol bound. Markov and a
q-ary Gilbert code then yield vanishing maximal outer-message error, averaged
over the private seeds. No reliability exponent or dense inner-length sequence
is assumed. Constant paths give the converse inclusion.

**Hypothesis reduction:** constant parameters are replaced by the specified
sublinear change envelope. Unknown segmentation is not supplied to the decoder.
The strong additive expected cost of each encoded message is retained; this
does not establish a peak-number or local-per-use support constraint. Padding
needs a feasible one-use state of cost at most `E`, not a zero-cost state:
`m l E + (n-m l)E = nE`. A feasible inner block supplies such a marginal. The
new609 wording is root clarification, not a fresh exact-text model review.

## Translation dictionary, limits and falsifier

Dictionary: constant segments -> good compound-code blocks; changes -> arbitrary
symbol errors; private shifts -> per-symbol averaging; outer Hamming distance ->
protection from the bad blocks. Additive expected physical cost and asymptotic
rate are preserved. Efficient implementation, a common finite-length guarantee
for every unspecified sublinear envelope, a maximum over seed outcomes, and
seed-aware/adaptive/entangled-environment jammers are not preserved or proved.
Quantum, private and two-way capacity extensions require separate resource/error
arguments and are not inferred from the classical reduction alone.

Falsifier: an admissible seed-oblivious product path satisfying the stated inner
code premises that violates the explicit mask/Markov/Gilbert bound. Dropping a
premise is not such a counterexample. The unrestricted pure-Fock-reset mixture
obstruction in the earlier note remains relevant to the stronger variation model.

**Speculative:** standalone novelty remains unestablished; do not promote this
corollary to another paper or assign it the optical manuscript's score. Abandon
the standalone route if a prior theorem already supplies the same operational
lift. The natural finite formal targets are the change-point block count and
the modular averaging identity, not an infinite-dimensional capacity formula.

**Formal:** no new Lean-checked result. The model audit reused prior context and
files; independence, runtime identity and memory isolation are not attested.

## Exact provenance and publication separation

- Original candidate600 SHA-256:
  `f8e698f95a308d9f4a50694555ecf1ca37ef389efb500204adf3319ea2753724`.
- Terminal unscored audit602 report SHA-256:
  `28643a9f7e4634622e43901d183f4b99b408f68908ef26a61d3102957d88c2c0`.
- Audit602 verdict SHA-256:
  `8fbb495ee25d5f0337db6b000dc7b615e61e87fd2d855e634e248298aa6025fc`.
- Clarified609 note SHA-256:
  `4992fa92c0ee4e35a9b2d787f2304e0f686c62bbc96eb0d5df2cd7253a37588c`.

The separate [entropy/optical manuscript](https://airr.science/papers/ARR-2026-7SWAJZ0X278GJ9NK/versions/v1/#model-assessments)
is now a public Working paper with its exact-PDF full report and context.
Its importance remains **4.5/10**, technical contribution **5.5/10**, and
recommendation minor revision. The later public-identifier binding is the same
review, not another scientific vote. Its PDF SHA-256 is
`0b6572379ef56dd2d667cb52c768d55bd89ee7991545c3c186be92776aeb07c3`.
This does not grade the switching corollary, certify priority, complete founder
admission, or satisfy the research objective of importance strictly above 7.

## Directed primary-source refresh

On 26 October 2026, commit metadata still pins
[OpenAI/math](https://github.com/openai/math/tree/1581d4cbdd69a0faf34b2089614fe2a814316a6a)
to `1581d4cbdd69a0faf34b2089614fe2a814316a6a` (12 October) and
[DeepMind formal-conjectures](https://github.com/google-deepmind/formal-conjectures/tree/039378b7951df701428aa5c6732a94a149a077e1)
to `039378b7951df701428aa5c6732a94a149a077e1` (25 October). Metadata and a
catalogue proof link do not establish a new checked theorem in this work.
The [Anthropic announcement](https://www.anthropic.com/research/formal-verification)
was read at introduction/announcement depth; its software specifications do not
discharge channel-coding proof obligations. The
[AIRR author catalogue](https://airr.science/authors/lluis-eriksson/),
[ai.viXra author index](https://www.ai.vixra.org/author/lluis_eriksson),
and public research-repository metadata were refreshed at inventory depth.
No exhaustive paper sweep, imported proof build, foreign full-text corpus,
private-repository inventory or score increase is claimed.
