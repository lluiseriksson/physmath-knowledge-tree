# Candidate: separate entanglement assistance from learning feedback

Current status: technical audit745 is now terminal (see the chronological update below). Earlier pending language records the initial proposal snapshot. The combined manuscript753 is a different exact artifact and has no completed full assessment at this update.


This is an unreviewed research proposal, not a new manuscript or a new
assessment of the [published v2](https://airr.science/papers/ARR-2026-2WNM69XY548JHVMC/versions/v2/).
Its previous grade does not transfer. One technical audit745 has been
requested with GPT-6 Astra xhigh, without a numerical grade; no completed
report is represented at this snapshot. Runtime identity, isolation and
independence are not attested. Prior author-generated proofs are dependencies.

## Literature and selected reading

[Berta, Gharibyan and Walter](https://arxiv.org/html/1603.02282v1),
Introduction and Section II Theorems 1, 3 and 4, already describe the
sup-inf entanglement-assisted compound capacity, its change to inf-sup
with informed senders, and finite-family feedback by channel training.
The framework there has fixed finite-dimensional channel systems. Root
read those statements and scope, not their full proof chains. The minimax
order change and sublinear training mechanism are antecedents, not discoveries.

[Boche, Janßen and Kaltenstadler](https://arxiv.org/html/1606.09314v3)
also give entanglement-assisted classical compound coding theorems;
abstract/introduction were read, not full proofs. The
[Shrader–Permuter abstract](https://arxiv.org/abs/0711.0705) states the
classical feedback compound inf-sup formula. These results must be
compared before claiming novelty for any bosonic extension.

The official [Shi–Zhang–Zhuang paper](https://doi.org/10.1103/PhysRevApplied.13.034029)
contains the single thermal-channel entanglement-assisted formulas and
large-noise fixed-signal comparison (selected PDF extraction read, no full
proof audit). The [Hao et al. abstract](https://arxiv.org/abs/2101.07482)
reports a finite-energy optical advantage from prior entanglement. Neither
an entanglement-breaking representation nor high noise alone implies that
entanglement assistance is useless. Our proposed limit instead scales
signal budget and thermal noise together.

## Mechanism and proposed hypothesis removal

The proposed change is to remove the **unassisted** restriction in the
uniform noisy optical comparison. The heterodyne measurement must retain
the receiver reference system, including conditional steering states.
After its classical outcome X, pass through the same noisy classical
kernel W-minus and prepare the output coherent state. This is claimed as
a complete channel identity on references, not merely an agreement of
output states for a restricted set of inputs.

For a classical bottleneck X -> Y with conditional independence of Y and
MR given X, the proposed one-step inequality is

```text
I(M;RY) - I(M;R) = I(M;Y|R)
                 = I(MR;Y) - I(R;Y) <= I(X;Y).
```

Without feedback, no-signalling keeps the message independent of the
receiver's initial reference and the joint heterodyne input law independent
of the unknown fixed channel law. This preserves the same common-input
sup-inf order as the unassisted problem. With feedback, the input law can
depend on what was learned; the proposed inequality is instead telescoped
at each fixed actual law. The photon budget must hold separately under
every law, including wrong-estimate events.

If valid, both capacities have the explicit comparison error inherited
from the existing heat-flow and cost estimates, O(1/E). The claimed
no-feedback limit is V_Gamma(1); for a finite family with free classical
Bob-to-Alice feedback it is inf_nu C_nu(1). Prior entanglement is of
arbitrary finite dimension per block and may grow with block length.
There is no free forward side channel. All limits first fix E and the
finite family, then take block length; no uniform coding-length assertion.

## Candidate strict separation within the optical family

The complete [frozen analytical proposal](../evidence/2026-10-26-assisted744/candidate744.txt)
has SHA256 ec8944221d7957763b18201166b72c3a61438e3911e8efb7ee263a9d4257f256.
It constructs a two-law family: a matched-reset kernel W1 with strict
non-Gaussian modulation advantage, and an AWGN kernel W2 tuned to have
the same individually optimized capacity C1. Its gain satisfies
b² = r(exp(C1)-1) <= k. The reset noise is s=k+r, not r.

W2 uniquely optimizes at CN(0,1), which does not optimize W1. The proposed
compactness/entropy-continuity argument would force
sup_mu min(I_mu(W1), I_mu(W2)) < C1. Combined with the proposed assisted
comparison, this would make unassisted learning feedback outperform
unlimited prior entanglement without feedback at sufficiently large E.
The gap is existential, not numerically certified. This is a comparison
of different resources under channel uncertainty, not a contradiction of
the known-channel feedback theorem or a new general minimax phenomenon.

The initial audit response identified a wording repair: the telescope must
use **quantum mutual information**, not optimized accessible information.
The original candidate and this objection are retained. A separate
[author clarification](../evidence/2026-10-26-assisted744/author-clarification744a.txt)
fixes that wording and spells out the vacuum-pilot observation suggested
by the auditor. With u=r+1/E and w=s+1/E, the threshold event |Y|²<=u has
probabilities differing by q(exp(-u/w)-exp(-1))>0. Its empirical frequency
distinguishes the pair with a Hoeffding bound and zero transmitted photon
cost. This is author-generated elaboration within the same ongoing audit,
not a new independent review or a new grade; terminal checking is pending.

## Bridge card, tests and limits

- Target node: domain.quantum_information_theory, with the retrieved
  no-signalling and recovery edges. Adjacency supplies context, not a proof.
- Dictionary: reference-preserving measurement -> classical noisy
  bottleneck; no-signalling -> common input; feedback -> law-dependent
  encoding after estimation; average physical cost -> heterodyne cost +1.
- Preserved: quantum receiver memory, one common protocol, fixed unknown
  law, reference correlations, per-law expected cost and limit order.
- Uncertain: complete sequential amortization, infinite-dimensional
  information identities, entropy compactness and standalone novelty.
- Falsifiers: failure of the bottleneck inequality with steering; a hidden
  discarded receiver register; feedback-dependent cost not bounded under
  every law; wrong-estimate budget failure; or discontinuity invalidating
  strict compact minimax separation. Any exact prior equivalent defeats a
  novelty claim even if the argument is correct.
- Minimal formal target: finite cq conditional-independence chain rule
  with a retained reference. No new Lean theorem has been proved here.
- Abandonment condition: if this is only a routine known corollary with
  no substantive removal beyond prior results, record it in the same
  research line rather than manufacture another small paper.
- Confidence: formal = none; literature = scoped antecedents;
  heuristic = author's unreviewed derivation; speculative = the proposed
  assisted bosonic theorems and resource separation pending audit.

[Retrieval](../evidence/2026-10-26-assisted744/retrieval.json),
[primary pins and reading depths](../evidence/2026-10-26-assisted744/primary-pins.json),
[current inventory](../evidence/2026-10-26-assisted744/source-refresh743.json),
and [candidate provenance](../evidence/2026-10-26-assisted744/candidate-provenance.json)
are retained. Thirteen primary endpoints were refreshed across the requested
sources; this is directed inventory, not an exhaustive reading. The latest
DeepMind commit f153efa8fdc078131e214547781d631e2d257daf adds an already solved
Erdős1114 entry; only its commit description was inspected, not its proof.
OpenAI/math remains 1581d4cbdd69a0faf34b2089614fe2a814316a6a. No canonical
graph, routing, confidence label, published PDF or actual grade is changed.


## Terminal unscored audit745 and integration into the same paper

The [full original technical report](../evidence/2026-10-26-assisted745/report.txt)
and [structured verdict](../evidence/2026-10-26-assisted745/verdict.json)
support A/B/D within the stated model and C with the explicit quantum-MI
correction. The [actual context](../evidence/2026-10-26-assisted745/context.json)
records parent input and the author clarification during this same audit.
Requested Astra xhigh identity/effort, isolation and independence are not
attested. No numerical score or whole-manuscript assessment was assigned.

Root read the complete report/verdict and verified all 13 native payloads
and 16 C/D files. The [provenance](../evidence/2026-10-26-assisted745/byte-provenance.json)
binds the original byte streams, including report SHA256
c424c6ac6cb9c97e3bd2403e8e9a60ea834f9513944a8d1f16b776af2d4415a1.
JSON links use LF renditions for repository formatting; all four authoritative
[original byte streams](../evidence/2026-10-26-assisted745/original745.zip)
are preserved together and hash-bound in the provenance record.
The original candidate's accessible-information wording remains preserved.
O1 requires quantum mutual information; O2 requires relative-entropy
definitions, receiver memory/transcript retention and finite information
before subtraction; O3 keeps per-law expected cost and the order of limits;
O4 leaves priority and standalone significance unresolved. These conditions
are incorporated into the new source; the audit is not used to erase them.

The complete original [primary-source comparison and reading depths](../evidence/2026-10-26-assisted745/source_pins.json)
are preserved. The audit read selected Berta Section VI training arguments,
Boche Section4.1/Remark2, Shrader SectionVII, constrained-EA antecedents,
and Shi's thermal-channel formulas. These largely anticipate the qualitative
mechanisms. Their exact single-Gaussian formulas already yield related
simultaneous high-energy limits; the candidate's additional content is only
the uniform mixture comparison and the specified two-law construction.
The bounded comparison establishes neither priority nor standalone impact.
Foreign primary PDFs/text caches are not copied into this repository.

The extension is integrated as a substantive v3 of the SAME record, not a
separate corollary paper. Title: Classical limits and learning gaps for
compound bosonic fading channels. The new 18-page PDF has SHA256
66176e7f21d2a4785b2355f07b3dcc49d4d4d3b8f93ebd36efe19d9a51537881;
source SHA2563280bdee50662caf303cdc0182a94a68f92ba5428a718decad7287dbc637955b.
New Lemma11, Theorem12 and Proposition13 state the reference bottleneck,
explicit assisted comparisons and the feedback-versus-prior-entanglement
separation, with a zero-photon pilot. Both compilation routes passed;
all 18 final rendered pages were inspected, with the new proof pages also
inspected at full size before the final cross-reference correction.
The final source has no TeX layout or reference warnings.

This PDF is frozen as input753 for ONE complete review754, requested Astra
xhigh in a separate conversation with shared filesystem and no independence
attestation. Its whole-manuscript assessment is pending. Neither audit745
nor the actual grades of published v1/v2 are a score for this changed PDF.
No new author case, publication, numerical gap or Lean result is claimed.
The existing public versions, reports and adverse/scope records remain intact.

The directed inventory749 refreshed all 13 endpoints successfully. OpenAI/math
and DeepMind/formal-conjectures remain at1581d4cbdd69a0faf34b2089614fe2a814316a6a
and f153efa8fdc078131e214547781d631e2d257daf respectively; this is metadata
coverage, not an exhaustive paper/statement/proof sweep. The small retrieved
quantum-information neighborhood remains context only. Formal:none;
literature:scoped antecedents; heuristic:unscored model-audited working proofs;
speculative:novelty, impact and any larger resource/model extension.
Original falsifiers and abandonment conditions remain in force.
