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
