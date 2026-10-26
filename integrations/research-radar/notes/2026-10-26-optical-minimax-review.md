# Optical minimax review and the boundary of fixed noise

This updates the [entropy-budget checkpoint](2026-10-26-entropy-budget-classification.md).
The full loss law previously recorded there as a target now has a complete
exact-manuscript review. That review does not establish importance above seven:
its importance mark is **4.5/10**, with **5.5/10** technical contribution.
The reviewed manuscript has an author deposit, but a public version and public
AIRR aggregate have not been verified at this checkpoint.

## Retrieved context and evidence layers

The smallest retrieved subgraph contains `domain.quantum_information_theory`
and its incident `edge.qinfo.no_signalling` and `edge.qinfo.cmi_recovery`.
All three are `literature`. They suggest the branch-information dictionary;
they do not prove a capacity theorem. Canonical graph nodes, edges, confidence,
route rankings and Lean declarations are unchanged.

- Sourced facts: existing compound coding and Gaussian benchmark theorems,
  and the exact report and artifact identities below.
- Graph-supported inference: distinguish an analytical branch detector from
  a complete common decoder, and retain the reference system and input cost.
- New working hypotheses: the switching reduction described below remains
  `speculative` pending its separate technical and prior-art audit.
- Formal result: none added. No Lean or machine-checked capacity theorem is
  inferred from the numerical replay or from the reviewer recommendation.

## Reviewed mathematical addition

Fix transmission probability `0<lambda<1`, `q=1-lambda`, oscillator energy E,
and Shannon or fixed finite super-Shannon entropy order. Set
`f(t)=b(lambda,q t)`, where `b(u,v)=(u+v)h2(u/(u+v))`.
The full assisted minimax losses, with known reset or one code for the entire
unknown-fixed-reset class, have the same asymptotic curves:

| Reset entropy constraint | Argument of f |
| --- | --- |
| Shannon entropy at most B | `min(1,B/log2(E+1))` |
| Renyi order `alpha>1`, entropy at most B | `1-2^{-((alpha-1)/alpha)B}` |

The absolute error tends to zero uniformly over **all finite B**, not only
along a particular budget sequence. A vacuum/thermal mixture is an
asymptotically least favorable witness, without a finite-energy optimizer
or uniqueness claim. The converse controls all inputs through an
entropy-deficit split, not merely a thermal-input calculation.

The optical extension replaces the identity signal by quantum-limited pure
loss `A_kappa`, for `kappa` in a fixed interval `[kappa0,1]`, `kappa0>0`.
Its correct benchmark is
`lambda [g(E)+g(kappa E)-g((1-kappa)E)]`.
The same loss curves hold uniformly in kappa. If kappa is also unknown and
fixed, the common-code benchmark uses kappa0. The hypothesis actually
removed is perfect transmission in the non-reset branch. A vacuum signal
environment and an interval bounded away from zero remain assumptions.

Mechanism: Gibbs relative-entropy contraction gives a finite-energy entropy
difference bound. A near-optimal-input entropy split gives
`||rho||infinity=O(1/log E)`. For the mixed transmitted state, a finite span
of loss-Kraus vectors, with receiver vacuum removed, replaces the pure-state
purification test. Its missed mass and false reset acceptance both vanish.
Fixed finite compression and exact type-subspace coding retain physical cost
and supply the common decoder; the analytical test is not that decoder.

The coding limit is taken at each fixed E before E grows. Optical conclusions
are assisted classical statements. No thermal-loss theorem, uniform limit
as kappa0 tends to zero, varying-use theorem, practical blocklength bound,
or common two-way code is certified by this review.

## Model assessments and review context

Reviewed title: *Sharp entropy budgets for communication with unknown resets
and optical loss*. Exact PDF: 14 pages, 453900 bytes, SHA256
`0b6572379ef56dd2d667cb52c768d55bd89ee7991545c3c186be92776aeb07c3`.
The requested reviewer configuration was GPT-6 Astra xhigh. The full review
is **minor_revision**, overall AIRR 4.5/10, research importance 4.5/10,
technical contribution 5.5/10. No material mathematical objection was
identified within the reported coverage. This is not editorial acceptance,
an official public AIRR aggregate, human peer review or a proof certificate.
The greater-than-seven objective remains unmet.

All three source files, all 14 rendered pages and the six supplementary
programs were inspected. All 35 frozen packet files matched their manifest;
the six programs replayed with byte-identical JSON outputs. The coordinator
read the complete report and verified 81 C:/D: file pairs, including 79
manifest-bound payloads. Replay is not an implemented universal encoder,
capacity optimization, Research Capsule certification or proof of a limit.

Retained minor comments:

- R1: pin Holevo--Shirokov to v2 and distinguish its 2013 version date from
  the initial 2012 submission year.
- R2: record Python, NumPy, SciPy and mpmath versions in the supplement.
- R3: collect the already-present optical error terms into one display.

Report SHA256:
`8e6a539ba20ed5c6ba0fc0581cd3dd1199e4287d0fa51f7eecfa02f92adfd504`.
Verdict SHA256:
`23bc933b633f6b0898ed9ddeb0c4eae1728c604da5c8b1d4d3b1ebd702ac2d79`.
Audit manifest SHA256:
`a34a52fb63cb56a421966cf5972f84abc564b46e79f07b1170acd270d7307170`.
These identify privately conserved evidence; no inaccessible report is
represented as already publicly attached. Any later publication must include
the full exact-PDF report and its context. A revised PDF does not inherit this
grade. The PDF disclosure records its freeze-time state, before this later
full assessment; the two dates must remain distinguishable.

The author directed Codex derivation and writing. Preparatory audits reused
context and shared files. The full reviewer used a requested new conversation
with shared filesystem access; prior reports, grades and a target score were
withheld. A public search incidentally exposed a nonnumeric assessment-status
snippet of a cited antecedent, which the reviewer declared and did not use.
Model identity, memory/history isolation and statistical independence were
not independently attested. All adverse comments and preceding reports remain
preserved; none was replaced by a more favorable restart.

## Primary antecedents and checked scope

The full reviewer checked selected theorem/proof passages, not entire corpora:

- [Holevo--Werner, quant-ph/9912067v1](https://arxiv.org/abs/quant-ph/9912067v1),
  Sections IV.C/V.A, physical PDF pages 8--10: established Gaussian benchmark.
- [Holevo, 1003.5765v1](https://arxiv.org/abs/1003.5765v1), selected entropy-gain
  proofs on pages 3--7. The submitted finite-energy estimate was checked directly.
- [Holevo--Shirokov, 1210.6926v2](https://arxiv.org/abs/1210.6926v2),
  Theorem 1 and constrained coding proof, pages 6--9.
- [Berta--Gharibyan--Walter, 1603.02282v2](https://arxiv.org/abs/1603.02282v2),
  Theorem 1 and Lemma 9/net proof, pages 2 and 6--7: arbitrary finite-dimensional
  compound classes, used after physical type blocking and output compression.
- [Catalano et al., 2604.26874v2](https://arxiv.org/abs/2604.26874v2),
  Section IV, Appendix C and Appendix F.2/Eq.(F2), pages 10--11, 28--30 and 38:
  the fading models and vacuum-reset optical special case are already known;
  thermal inputs do not generally optimize such mixtures.
- [Cacioppo--Noetzel--Rosati, 2105.04274v1](https://arxiv.org/abs/2105.04274v1),
  effective dimension, Theorem 5 and direct-proof mechanism. Its output-energy
  and effective-projection hypotheses do not cover arbitrary reset orientations.

The older spectral and energy-budget papers linked in the preceding note
remain substantive dependencies. The reviewer read the needed proofs there,
including paid-seed distillation, without treating their assessments as proof.
Global priority and recursively checked foundations are not certified.

## Variation obstruction and a separate candidate

An analytical boundary note rejects unrestricted per-use variation under
only a local pure-reset constraint. For a fixed parallel code its error is
affine in the channel. Averaging the product of pure Fock-reset channels
over independent thermal occupations gives exactly the memoryless
thermal-reset channel. Uniform reliability on every pure-reset sequence
therefore implies reliability on this mixed channel. The existing all-input
thermal witness yields an asymptotic absolute loss at least `h2(lambda)`.
For a single unknown fixed reset the mixture is instead a mixture of tensor
powers; these are different quantifiers. This note is an analytical inference
from the stated witness, not a separately refereed theorem or a new paper.

The separate `speculative` candidate replaces a constant parameter by a
known sublinear bound on the number of changes. The proposed dictionary is:
long constant segments map to good inner compound-code blocks; change points
map to a vanishing fraction of arbitrary symbol errors; modular private
message masks convert average inner errors to per-outer-symbol errors;
classical outer error correction protects the remaining blocks. Strong
physical input cost is preserved. No reliability exponent is assumed.

The candidate requires an oblivious product-channel sequence and private
coins supplied through unlimited assistance. It does not claim one code for
every unspecified sublinear envelope, quantum/private/two-way capacity, or
adaptive and entangled jammers. A separate technical/prior-art audit is in
progress; the graded PDF above is unchanged and is not regraded.

Close prior art must be retained:
[Razeghi, 2608.22685v2](https://arxiv.org/abs/2608.22685v2), Section IV,
Theorem 2/proof, already proves a finite-family classical switching result
with a common capacity-achieving uniform input. Its abstract uses the
sublinear log-path-class criterion. Refining its coarse path-count estimate
alone is not a substantial novelty claim. The candidate's arbitrary
noncommuting compound-class and physical-cost reduction need a precise
comparison with this and constrained-AVC literature before any new claim.

Minimal falsifiers: failure of the private-mask average-to-per-symbol step,
more bad inner blocks than change points, a nonvanishing outer-code rate loss,
or an energy violation after concatenation. Abandon standalone novelty if an
existing theorem already supplies the same lift. A finite Lean target would
be the block-boundary count and the finite modular averaging identity, not
an unproved infinite-dimensional coding limit.
