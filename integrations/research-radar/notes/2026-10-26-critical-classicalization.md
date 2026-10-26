# Bridge card: classical simulations of noisy optical mixtures

Context retrieved: graph/index.json, domain.quantum_information_theory
(literature), its no-signalling/CMI edges, and research moves
move.audit_information_loss and move.rescale_physical_units. No existing
edge or collection asserts this candidate. Graph proximity is not proof;
no canonical graph, confidence, routing or Lean declaration is changed.

## Sourced facts and known baseline

Heterodyne measure/prepare representations of Gaussian entanglement-breaking
channels and the positive-P representation of a thermal state are prior
ingredients. The ordinary single Gaussian classical limit is already
discussed by Holevo-Giovannetti,
[1202.6480v1](https://arxiv.org/abs/1202.6480v1),Sec3.4,4.3. Only those
selected passages and its abstract were read here, not its entire review.
Its2012 open-problem statements are historical and are not asserted to
remain current. Our proposed contribution is not the single-component
Shannon limit or a new entanglement-breaking principle.

The earlier entropy-budget paper is now public as
[v3](https://airr.science/papers/ARR-2026-71PQXGYGR887JAWR/versions/v3/#model-assessments),
with an exact20-page assessment: importance5.5/10, technical8.5/10, accept
as model recommendation, not editorial admission. Same-reviewer664 closed
the four minor comments of659; binding671 is formatting, not another vote.
The public PDF hash is
6968375b22facb1a5467606b16df7a6ccabe0bac0dee4824afc0c4fb932c4662.
Publication occurred26Oct2026,10:23:49UTC. The source record and all prior
versions remain immutable. The >7 importance objective is unmet.

## Candidate677/680: known iid mixing law

**Speculative new combination, under technical audit678.** Let nu be a
known law of complex gains a and normalized vacuum noises v, with
|a|^2<=K and0<vmin<=v<=vmax. At photon budget E, each component has noise
vE; iid branches are sampled from nu. E and nu remain fixed throughout a
code. Let C_opt(E) be the UNASSISTED CLASSICAL capacity of this quantum
channel, allowing entangled block codewords and collective quantum POVMs.
It is not the capacity to transmit qubits, which is zero in this EB regime.

Define W(y|x)=integral CN(y;ax,v)dnu and let C*(P) be its classical
capacity under E|x|^2<=P. The proposed exact finite-E operational sandwich is

    C_(plus)(1) <= C_opt(E) <= C_(minus)(1+1/E),

where plus uses v+1/E and minus uses v-|a|^2/E, with the latter positive.
The dictionary is explicit: a quantum codeword is mapped to its correlated
Husimi outcome A^m; thermal positive-P preparation samples beta^m from the
classical minus channel; the original collective POVM becomes the decision
kernel <beta^m|POVM|beta^m>. Message error is exactly preserved. Total
expected photon cost mE maps to classical squared cost m(E+1), not to a
separate bound on every use. This is a converse simulation, not a claim
that the real receiver can observe the hidden sample beta.

Thus the known EB representation plus classical data processing handles
all block entanglement. An earlier P/Q entropy step in677 becomes
unnecessary in the stronger680 route. The proposed uniform heat-flow
estimate bounds changes of mutual information when the latent component
variances change: with floor l and |dv/dtheta|<=D, the absolute derivative
is at most2D/l for ANY finite-second-moment modulation law. Score
Cauchy-Schwarz and Fisher contraction under Gaussian smoothing suggest
the constant independently of peak amplitudes and branch atoms.
Analytic justification for continuous mixtures/heavy input tails is a
real audit obligation, not a new named hypothesis hiding the estimate.

If that step and coding approximation close, the stronger proposed bounds
for E>=2K/vmin are

    C*(1)-2/(vmin E) <= C_opt(E)
      <= C*(1)+[ln(1+K/vmin)+4K/vmin]/E.

This would make optimized classical modulation plus heterodyne reception
asymptotically optimal; it would not make Gaussian modulation optimal.
The latter shortcut is exactly what the preceding critical-reset card
tests. There is no uniformity as vmin tends to zero or gains diverge.

## Candidate681/684: unknown fixed law, not yet audited

For a known compact family Gamma of possible laws, require ONE encoder
and decoder with uniform error for the unknown fixed nu in Gamma. The
proposed classical target is

    V_Gamma(P)=sup_mu(cost<=P) inf_nu_in_Gamma I_mu(W_nu).

This order is essential. Taking infimum AFTER every channel has optimized
its own input does not produce a common code. The simulation maps at both
ends are independent of nu, suggesting the exact compound sandwich with
the same physical cost. A separate finite-input/output approximation and
classical compound coding argument is required. Candidate684 develops
Gaussian-smoothed entropy continuity, a shared finite output partition,
constant-composition physical cost, and universal empirical-information
decoding with a polynomial channel net. It explicitly avoids exchanging
expectation and supremum when choosing a codebook.

The conjectured O(1/E) bounds replace C* by V_Gamma. They could be uniform
in Gamma with fixed K,vmin,vmax, but do not assert an optimum input law,
positive rate for a family permitting complete replacement, an adversary
varying nu inside a block, or a uniform finite coding length. No current
audit of another packet establishes this extension.

## Falsifiers, diagnostics and confidence

Falsifiers: wrong EB noise subtraction or heterodyne+1; loss of the shared
reference/moment constraint; a non-common decoder in the compound transfer;
missing factor in complex heat flow; entropy differentiation without
domination; an invalid finite-alphabet reduction; or a prior equivalent
theorem. Abandon or repair the relevant conclusion if one occurs.
Do not publish these candidates as separate minor papers or transfer an
earlier manuscript's importance score to them.

Finite diagnostic683 tested24 finite Gaussian-mixture noise directions
at two quadrature orders, including rare high-amplitude inputs. No sampled
derivative exceeded the loose analytic bound (minimum numerical slack
about0.415), but the largest24/40-order discrepancy was about0.0151.
It is an under-resolved floating diagnostic, not a precision certificate,
a continuum proof or an independent implementation. Constant-input and
pure-replacement controls gave mutual information numerically zero.

Minimal formal target: finite Markov data processing plus the exact cost
rescaling; this would not formalize the infinite bosonic representation,
heat-flow lemma or common continuous-alphabet coding theorem.
Literature: the established representation/coding tools. Sourced fact:
the exact public v3 assessment. Heuristic: diagnostics and model-audited
working arguments. Speculative:677/680 and681/684 until their own audits.
Formal: no new Lean theorem or graph-confidence promotion.

## Terminal technical audit678; extension682 running

The earlier pending chronology remains visible. Audit678 subsequently
supported677 and680 within the known-iid-law scope, without a material
objection. It checked the newly supplied addendum within
the SAME shared-context review; no independent vote or identity attestation
is implied. It supplies complete entropy-continuity, noise-sensitivity and
finite-alphabet cost arguments that must be incorporated in a manuscript:
[full report](../evidence/2026-10-26-classicalization678/report.txt),
[verdict](../evidence/2026-10-26-classicalization678/verdict.json).
Report SHA256:
c8e7c1dda4de1bdaf8efe346b7f4c704d8b1405d5cb00010a51c48b2482876a0.
The coordinator read both full files and verified24 archive payloads,
26 identical C/D files. Only these two reports are distributed here, not
the private research tree or third-party primary PDFs. There is no score.

The exact simulation sandwich closes without P/Q entropy subtraction.
For the broader exact formulation with only pointwise positive preparation
noise, use a KL chain rule for the classical block information bound;
finite moments alone would not justify subtracting every conditional
differential entropy in that broader setting. The O(1/E) theorem has its
explicit uniform noise floor and is unaffected. This precision prevents
silently extending an entropy proof beyond its hypotheses.

The known-law working result is now model-audited; it is not formalized,
peer reviewed or a certified original discovery. All foundational
simulation, single-Gaussian Shannon limit, heat-flow and classical coding
ingredients remain attributed. A later full exact-manuscript assessment
must judge importance rather than infer it from the technical audit.

The unknown-law681 extension and the more detailed coding684 proof are
now the subject of a separate serial technical audit682. In particular,
one decoder for all laws and the order sup_mu inf_nu have not been
certified by678. No extra numerical rerun is needed to replace its analytic
proof;683's coarse quadrature discrepancy remains recorded honestly.

## Terminal compound audit682 and a broader Gaussian benchmark

The chronology above is retained. The separate682 technical audit is now
terminal and supports681/684 with explicit proof completions, without an
importance score or a priority certificate:
[full original report](../evidence/2026-10-26-compound682/report.txt).
Report SHA256:
c07fdf10e5c39b5c5cae9808186ec220defb49dc90e5f0d888f07d742f6126c7.
The coordinator read the complete report and verdict and checked31 payloads
and33 identical C/D files. Only the original LF report is distributed here;
the original verdict and full manifests remain conserved in the dossier.
The reviewer has prior participation and shared context/files; requested
Astra xhigh is not an identity, isolation or independence attestation.

The operational extension eliminates knowledge of the fixed mixing law.
Its encoder, heterodyne quantizer and empirical-information threshold
decoder are common to every law. The proof uses the SAME average input
law in the converse, Dini for one finite output partition, and selection
by a SUM of errors over a polynomial total-variation net. No inf/sup
interchange or expected-supremum shortcut is used. Constant-composition
words enforce expected photon cost for every message. These are classical
mechanisms applied with their hypotheses checked, not newly invented
quantization or coding principles. No formal graph-confidence upgrade.

Common quantization/Dini already appear in Mitran-Devroye-Tarokh's
[20Dec2005 author draft](https://ece.uwaterloo.ca/~pmitran/compound3.pdf),
Lemmas3-5, and Schaefer-Loyka
[1509.02182v1](https://arxiv.org/abs/1509.02182v1),SecIII. Their state
information/secrecy models do not by themselves establish our unknown-law
decoder; the direct finite-alphabet proof supplies that step.682 records
the bounded selected-proof reading, not an audit of every source theorem.

The next speculative application is deliberately broader than coherent
Gaussian modulation alone.688 proposes a STRICT gap between unrestricted
classical modulation and the time-sharing hull H_G of ALL real planar
Gaussian laws, including means, anisotropy, singular covariance and unequal
energy allocation. Pointwise Gaussian inferiority alone would not prove
this: compactness of parameter probability laws and the sublinear bound
J<=lambda log(1+kp/r) must first make the hull supremum attained.

Candidate691 then uses the Husimi law of a Gaussian AVERAGE quantum input
state to propose a uniform Holevo bound H_G+O(1/E), permitting squeezed
and entangled average states and arbitrary conditional states.694 proposes
a matching lower bound by finite rational schedules of coherent Gaussian
modulation. Together they would identify the limit of a regularized
Gaussian-average Holevo functional and a strictly positive asymptotic gap.
All three new steps are under the SAME serial unscored technical audit689;
682 did not inspect or establish them. A preliminary message is not a
terminal report or a full-manuscript assessment.

The average-state restriction is essential: a finite deterministic
codebook usually has a non-Gaussian average. Do not turn this exact
Holevo-ensemble benchmark into an operational converse for every selected
Gaussian random codebook, or for all protocols whose letters are Gaussian.
Falsifiers: failed hull attainment/UI; an invalid continuous Jensen
equality; a non-Gaussian Husimi law for a Gaussian average; a cost leak in
the rational schedule; or a prior equivalent theorem. Refute or narrow
the corresponding statement if one occurs, without concealing objections.

Sourced context, not a new theorem: Gaussian measurements on Gaussian
states have Gaussian outcomes (Weedbrook etal,
[1110.3234v1](https://arxiv.org/abs/1110.3234v1),SecII.5/II.5.2, root
selected passages read). Coherent near-capacity bounds for non-Gaussian
attenuators/additive noise are established by Huber-Koenig,
[1710.06734v2](https://arxiv.org/abs/1710.06734v2),Theorem1. Root read its
abstract, introduction, model identification and theorem, not all EPI
proofs. Their fixed-environment energy-independent bound does not alone
give our proposed uniform joint-scaling result; broad coherent
near-optimality must not be claimed as our discovery.

The current combined draft is still unassessed and unpublished. A full
assessment must bind the completed exact PDF; no old score transfers.
Formal: none. Literature: established Gaussian/coding/quantization tools.
Heuristic:678/682 model-audited working proofs with stated participation.
Speculative:688/691/694 until their own terminal review and manuscript check.

## Terminal Gaussian-hull audit689; exact manuscript sent to review701

The subsequent serial689 audit closed with support for687/688/691/694,
after explicitly requiring ||h||infinity<=1 (or the corresponding smaller
epsilon range) in the old perturbation packet. The combined manuscript
normalizes h. The omission and repair remain in the original report:
[full original689](../evidence/2026-10-26-gaussian689/report.txt), SHA256
7eb99e38fdd9b98cd7e8140f9a7d4cc5c29f27c08b9e694df5515b2401f94f81.
Root read the full report and verdict and verified36 payloads and38
byte-identical C/D files. The input addenda were new within the SAME
unscored audit, not repeated votes. No manuscript score was issued.

The supported scope is H_G(1)<C(1), matching bounds R_G=H_G+O(1/E),
and a strictly positive limiting difference between the unknown-fixed-phase
operational capacity and the EXACT Gaussian-average Holevo functional.
All-average Gaussianity, rather than Gaussianity of individual letters,
is the required condition. The report supplies a continuous-label DPI
justification, a uniform logarithmic tail bound for parameter schedules,
and a finite strict-cost rational schedule construction. These proofs are
incorporated in one completed10-page manuscript, not separate papers.

The average/ensemble distinction is explicit in Holevo's
[2021 Gaussian-measurement paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC8004196/),
Theorem1/Remark2; root read those selected passages, not the whole proof.
The recent Gaussian-channel optimality preprint
[2610.22308v1](https://arxiv.org/abs/2610.22308v1), Adesso-Lami-Giovannetti,
15Oct2026, was also compared at abstract/introduction/SecIV-Theorem2 scope.
Its Gaussian-channel hypothesis excludes generic channel mixtures; its
fixed-error rescaling is not imported into compound average-error coding.
Historical open problems in older reviews are not treated as current.

Completed manuscript title: Classical limits and Gaussian-average gaps
for compound bosonic fading channels. Exact10-page PDF SHA256:
33106ae8688f2057346f0de55007fcd7db578150e1380cd00756ef588e9832e2.
It has been sent to full review701, with requested Astra xhigh and shared
context/earlier participation disclosed. It is still unpublished and has
no actual importance assessment. Technical audit support does not supply
one. Formal: none. The working proofs remain model-audited heuristic
evidence, not a graph-confidence promotion or certified original result.


## Completed exact-PDF assessment701 and bounded follow-up

The exact10-page PDF above was fully assessed at2026-10-26T12:26:13.932575+00:00.
The actual report assigns importance5.0/10 and technical8.5/10, recommends
acceptance scientifically, and finds no material open objection. This is
below the aspirational >7 target; it is not an improvement over every
previous manuscript. The original pending statements above describe their
earlier chronology. Full originals: [report701](../evidence/2026-10-26-classical701/report.txt),
[verdict701](../evidence/2026-10-26-classical701/verdict.json),
[context701](../evidence/2026-10-26-classical701/context701.json).
The JSON links are readable LF projections; byte-exact originals remain in
[original-json.zip](../evidence/2026-10-26-classical701/original-json.zip),
with [byte provenance](../evidence/2026-10-26-classical701/byte-provenance.json).
The principal limitation is the specialized joint noise/energy scaling and
the EXACT average-Gaussian ensemble restriction, not a mathematical defect.
Shared prior authoring context and participation preclude a blind-vote
claim; requested Astra xhigh runtime identity/effort and independence are
unverified. No Lean/formal promotion or editorial admission follows.
Author case SUB-87C015D124742367 has a clean exact PDF and CC BY4.0 release
permission; record ARR-2026-2WNM69XY548JHVMC is being prepared, not yet
claimed publicly released here. No score is inherited from another PDF.

Directed primary refresh709 retrieved13 endpoints, distinguishing index
metadata from actual abstract/theorem/proof reading. OpenAI/math remains
1581d4cbdd69a0faf34b2089614fe2a814316a6a. DeepMind/formal-conjectures advanced
to [591675d](https://github.com/google-deepmind/formal-conjectures/commit/591675d14bf90e8038a6e0268b68e8e6ce60386e).
The parent is039378b; the changed files are two CI workflows updating Python
requirements. Root read this commit diff: this is infrastructure, not new
mathematical evidence. Other index refreshes do not imply their papers were
read. This directed sweep is not exhaustive and stores no foreign corpus.

### Bridge candidate: remove exact-average Gaussianity by an explicit modulus

- Target/source: domain.quantum_information_theory and the preceding
  operational measure/prepare simulation; smallest node plus two adjacent
  no-signalling/CMI edges retrieved before this prose.
- Research move: audit information loss; confidence **speculative** as a
  quantum robustness result, **heuristic** for the following proposed lemma.
- Mechanism/dictionary: quantum trace distance contracts under heterodyne
  to classical total variation. Input mean photon cost becomes Husimi
  second moment with the already recorded +m cost. Approximate quantum
  Gaussian average maps to a nearby multivariate Gaussian input law.
- Preserved: common classical channel, full block correlations and total
  expected cost. Lost/uncertain: a nearby Gaussian state need not inherit
  a useful energy bound from trace proximity alone. Operational finite
  Gaussian-random codebooks are still not automatically included.
- Finite target: for a memoryless Gaussian-noise mixture with normalized
  noise floor ell>0 and gain bound K, prove a block-uniform continuity
  modulus for I_Q(X^m;Y^m)/m when Q,G have TV distance delta and BOTH have
  total cost<=mP. Maximal-coupling decomposition has a common (1-delta)
  component; the bad components have cost<=mP/delta. The binary mixture
  chain rule suggests a bound h2(delta)/m + delta*log(1+KP/(ell*delta)).
  This is a proposed bound requiring a full check of mutual-information
  finiteness and the branch-mixture upper bound, not an established theorem.
- Falsifier/abandonment: an explicit finite-block pair violating that bound,
  or inability to bound the Gaussian comparison energy under the intended
  hypothesis. Do not replace the missing comparison-energy condition by
  the conclusion. Without an operational gain beyond known continuity
  theory this is a manuscript improvement, not a separate paper.
- Minimal formal target: finite-alphabet binary-mixture mutual-information
  chain rule and capacity bound; no Lean proof has been run for this card.
- Literature: root read abstracts (not proofs) of Winter,
  [1507.07775](https://arxiv.org/abs/1507.07775), and Shirokov,
  [1610.08870](https://arxiv.org/abs/1610.08870). Their energy-constrained
  continuity work is a prior-method warning, not evidence of our novelty.
- Next finite check: verify the binary-mixture inequality analytically;
  compare exact theorem hypotheses in those primary papers before any
  novelty claim or expensive reviewer dispatch.

Formal: none. Literature: cited established continuity program and actual
CI commit. Heuristic: existing model-audited working proofs. Speculative:
approximate-average extension. Canonical graph/confidence/routing unchanged.


## Terminal technical audit716: marginal robustness and precise typical books

The previous speculative route has a completed, unscored technical audit:
[full report](../evidence/2026-10-26-marginal716/report.txt),
[verdict](../evidence/2026-10-26-marginal716/verdict.json),
[participation/context](../evidence/2026-10-26-marginal716/context.txt), and
[primary reading scope](../evidence/2026-10-26-marginal716/sources_scope.json).
Readable text has LF formatting; [original716.zip](../evidence/2026-10-26-marginal716/original716.zip)
retains all four original byte streams, with
[byte provenance](../evidence/2026-10-26-marginal716/byte-provenance.json).
Root read the entire report and verdict, verified20 payloads against the
manifest and22 C/D files byte for byte. Original report SHA256:
c54ba1fae06d9480b8983d9163e8438b5cec55fb83b60b4253415b98632f6223.

Mechanism: branch-revealed mutual information is finite under finite mean
cost, bounded gain and a positive noise floor, even without a noise ceiling.
A common submeasure splits two input laws into a common component and bad
components whose costs inflate by1/delta. The binary-label chain rule gives
|I_Q-I_G|<=h2(delta)+m delta log(1+KP/(ell delta)), with only one h2.
For TV<=delta one must choose a common part of mass1-delta, possibly
nonmaximal: the displayed modulus is NOT globally monotone in delta.

In the bosonic matched-reset model, heterodyne maps quantum trace distance
to a total-variation upper bound and adds one photon to each Husimi cost.
Compare EACH average marginal to its moment-matched Gaussian, which has
exactly the same energy. A joint concave perspective aggregates all costs,
without assuming an individual coordinate budget. With average distance d,
chi/m<=H_G+c0/E+h2(d)+d log(1+2k(1+1/E)/(rd)).
The joint average may be arbitrarily correlated and non-Gaussian. The new
R_marg functional differs from old R_G; its matching high-energy bounds
do not automatically identify an operational constrained-code capacity.

The finite falsifiers were resolved analytically and are retained:

- rho_L=(1-1/L)|0><0|+(1/L)|L><L| has energy1 and tends to vacuum in
  trace distance, but its moment-matched Gaussian is always gamma_1 and
  the relevant distance tends to1/2. Trace closeness plus bounded energy
  cannot replace separate moment control.
- An unadjusted CN(0,1) code design at saturated expected cost is actually
  feasible with probability tending to1/2, not1. Strict design slack or
  an explicit common rescaling is necessary for the typical-feasibility
  assertion. Expected cost over random books is not physical cost of a
  realized book.

The precise typical class fixes E and a FINITE Gaussian displacement list
before block length, with a deterministic known schedule, independent
message/coordinate samples, equiprobable messages and M_m>=exp(Rm),R>0.
Photon truncation and Hilbert-Schmidt variance give convergence of empirical
quantum marginals. Separate first/second-moment concentration, using finite
fourth moments, and continuity of positive matrix square roots give their
own Gaussian moment matches. Union bounds and Borel-Cantelli yield almost
sure uniform convergence over coordinates. A common rescaling at saturated
cost changes whole-block average trace distance by O(sqrt(mE)M_m^(-1/8)),
so it transfers already established reliability uniformly over channels.
It does not create a decoder; the adjusted book is no longer iid.

Holevo/Fano then gives a converse for any reliable code sequence with
vanishing average marginal distance, and hence for that precise typical
class. It does NOT cover all deterministic Gaussian-named books, arbitrary
postselection/weights/message-bearing covariance schedules, growing design
lists or exchange of energy and block limits. Translation preserved:
total expected photon cost, one-mode marginal moments and common-channel
data processing. What is lost: global average Gaussianity is unnecessary;
arbitrary selection of random-code realizations is still not covered.

This is incorporated into a substantive v2 of the SAME published paper,
not a separate continuity-corollary paper. The14-page exact revised PDF is
SHA2566a00b8bf9079766cae02e1e050fb2d7c224dde24568d5a3ad5d68ca238ac7f45.
It compiles locally and in the desktop compiler, and all14 final rendered
pages were visually inspected. Full review723 is requested; no score of
this PDF exists yet. Published v1 and its actual5.0/8.5 assessment remain
unchanged. Technical audit716 has no rating and is prior authoring help,
with shared participation and unverified runtime identity/independence.

Root additionally read selected Winter Lemma2 statement/proof setup,
Proposition14/Lemma15 and Shirokov Section6.2 statements/written arguments;
this is not an audit of their complete imported dependency chains.
Literature antecedents remain explicit. Falsifier/abandonment conditions:
a finite-cost counterexample to the common-part inequality; a missing
moment/feasibility hypothesis; failure of typical-book quantifiers; or an
exact prior operational theorem removing the same hypotheses. Do not
promote this to a new priority claim from a supportive model audit.
Minimal formal target remains the finite binary-mixture KL chain rule;
no new Lean declaration is proved. Formal:none; literature:prior methods;
heuristic:model-audited working proofs; speculative:broader Gaussian
protocol claims, which are not asserted. Canonical graph/routing unchanged.

### Directed primary refresh719 and a deduplication guard

Thirteen primary endpoints were refreshed, not exhaustively read.
OpenAI/math remains1581d4cbdd69a0faf34b2089614fe2a814316a6a.
DeepMind now includes [0921599](https://github.com/google-deepmind/formal-conjectures/commit/09215996126bf40899be6cbe826d6f53a6b2ae35),
adding the Erdős284 unit-fraction entry. Root read its definitions and
statement: it is labelled solved, attributes the mathematical antecedent
to Croot2001, and contains two sorry declarations pointing to an external
proof at8822f7dd. That external proof was not compiled or audited here.
New repository activity is neither a new open problem nor a proof checked
by this run. [Metadata pins](../evidence/2026-10-26-marginal716/source-pins719.json)
record URL, version, hash and actual reading depth without copying the file.


## Exact revised-PDF full assessment723: terminal, not a transferred grade

The14-page v2 SHA2566a00b8bf9079766cae02e1e050fb2d7c224dde24568d5a3ad5d68ca238ac7f45
received an actual full assessment at2026-10-26T15:48:47.719841+00:00:
importance5.5/10, technical8.5/10, accept as a scientific recommendation,
no material objection or required revision. It does not meet the >7
aspiration. These judgments concern this revised PDF, not a transfer from
v1 or an independent vote by the authoring audits. Six public stars are
only the official half-up display of5.5, never a score6.0.

- [Complete report723](../evidence/2026-10-26-robust723/report.txt)
- [Exact verdict, P1-P6 and F1-F3](../evidence/2026-10-26-robust723/verdict.json)
- [Actual reviewer context and chronology](../evidence/2026-10-26-robust723/context.json)
- [Primary-source reading depths](../evidence/2026-10-26-robust723/source-reading-depth.json)
- [Byte-exact originals](../evidence/2026-10-26-robust723/original723.zip)
- [Byte provenance](../evidence/2026-10-26-robust723/byte-provenance.json)

Root read the full report/verdict and verified126 payloads and128 C/D
files. Report SHA256b97a93f6987d47a87db2597f94a213ba8e967f123c530e5b8b39d6b27e5d56c1.
Readable files have LF formatting; original byte streams are in the ZIP.
Foreign primary PDFs in the private audit are not copied to this repository.
The exact source and all14 PDF pages were read by the reviewer; primary
comparison was selective. Its reconstruction compiles but differs in bytes
from the frozen assessed artifact. Shared prior review/manuscript context,
retained evaluative exposure and authoring participation are declared.
Requested Astra xhigh identity, effort, isolation and statistical
independence are not attested. No human peer review or formal proof follows.

The review supports the removal of global average Gaussianity for the
precisely stated marginal robustness converse, plus its application to
reliable typical coherent Gaussian books with fixed E and finite schedule,
equiprobable messages and explicit cost slack/rescaling. It preserves the
distinction between Holevo functionals and operational code capacities,
and between Gaussian modulation and individually Gaussian signal states:
the non-Gaussian modulation advantage can itself use coherent states.
No unrestricted Gaussian-protocol impossibility, decoder for every random
book, certified numerical gap, growing-schedule uniformity, interchange
of limits or worldwide priority is claimed. These are the substantive
limits behind the importance judgment, not open mathematical objections.

This remains a substantive revision of the SAME record
ARR-2026-2WNM69XY548JHVMC. The linked author deposit is
SUB-B1200159AD099909, private revision2, parentSUB-87C015D124742367;
clean scanner, exact server PDF and author CC BY4.0 release grant were
verified. Public source preparation retains all38 v1 blobs and its own
assessment. A later format-only binding728 preserves723's original time
and judgment and is not another scientific vote. Source preparation or
an author deposit alone is not a claim of completed public release.

The new directed refresh726 again retrieved13 primary endpoints. OpenAI/math
and DeepMind/formal-conjectures remain at1581d4c and0921599 respectively.
Inventory is not abstract, statement or proof coverage; the sweep is not
exhaustive. Claude/continuity state fingerprints remained unchanged and
no duplicate manuscript was deposited. Context retrieval for this note
used graph/index.json and domain.quantum_information_theory with its two
adjacent no-signalling/recovery edges; no canonical graph edit is made.

Formal:none. Literature:the previously pinned methods with stated depth.
Heuristic:model-audited manuscript proofs with actual final assessment.
Speculative:broader protocol/optimizer claims remain unasserted. Existing
falsifiers and abandonment conditions above are retained; a positive
model recommendation does not remove them or establish priority.
