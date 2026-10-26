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
