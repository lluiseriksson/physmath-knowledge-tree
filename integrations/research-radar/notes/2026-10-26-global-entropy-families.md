# From a local entropy test to a global family bound

This checkpoint extends the [local gate](2026-10-26-local-entropy-gate.md)
to all pure two-qubit inputs for two specified channel families. The canonical
graph, confidence labels and Lean declarations are unchanged. The retrieved
node is `domain.quantum_information_theory`, with its no-signalling and
conditional-mutual-information interfaces. Those graph edges do not prove
the new result.

## Exact statement and retained quantifiers

Let `Phi(c,r,t)` act on Bloch vectors by `(cx,cy,rz+t)`. For every pair

```text
N_c = Phi(c,1/4,1/5),  11/20 <= c <= 3/5,
Q_b = Phi(b,1/5,1/10), 1/2 <= b <= 11/20,
```

the written argument and the narrowly scoped audits support, in nats,

```text
S((N_c tensor Q_b)(psi))
 - hatS_N_c(psi_A) - hatS_Q_b(psi_B) >= C(psi)^2/160
```

for **every pure two-qubit input**. Here `hatS` is the convex roof of output
entropy and `C^2=1-R^2`, with R the common marginal Bloch length. This
removes the small-Schmidt-amplitude restriction for these families.

Infimizing over pure decompositions gives the mixed-state inequality with
an additional `tau(rho)/160`, where tau is defined as the convex roof of
`C^2`. Entropy subadditivity and product ensembles then give
`chi(N_c tensor Q_b)=chi(N_c)+chi(Q_b)` for each specified pair.
This supplies no arbitrary-partner property, tensor-power induction or
regularized-capacity formula. The rectangle is not claimed optimal.

## Mechanism: marginal deficits versus output correlations

The one-use roof is the classical axial expression
`e(z)=h((1+sqrt(q(z)))/2)`, with
`q(z)=c^2(1-z^2)+(rz+t)^2`. Its convexity and a same-latitude pure-state
decomposition prove the roof identity directly; this part is not new.
For a mixed input of Bloch length R, the difference between the squared
Bloch radii in the roof and the actual output is `c^2(1-R^2)`.
Since `-d h((1+sqrt(q))/2)/dq >= 1/2`, the marginal entropy deficit is
at least `c^2(1-R^2)/2`.

For the joint output T, set `sigma=T_A tensor T_B` and `Delta=T-sigma`.
The established sandwiched Renyi comparison gives

```text
I(A:B)_T = D(T||sigma)
 <= log(1+||sigma^(-1/4) Delta sigma^(-1/4)||_HS^2)
 <= ||sigma^(-1/4) Delta sigma^(-1/4)||_HS^2.
```

An independently checked resolvent/BKM argument also gives the final bound.
The divergence comparator is prior mathematics, not the contribution.

Keep the Schmidt phase theta. In real local Schmidt frames the exact output
correlation is a sum of a term proportional to C and a term proportional to
`C^2`; neither is a local Taylor remainder. The local weighted Pauli Gram
matrices have the form `[[a,0,h],[0,b,0],[h,0,k]]`. Expanding the tensor
correlation and using a checked sufficient condition `a<=b` for both
channels maximizes the metric majorant over theta. The normalized bound is

```text
B(R,z,w) = [a_N a_Q+b_N b_Q
            +2 sqrt(1-R^2)|h_N h_Q|
            +(1-R^2)k_N k_Q]/16.
```

The Gram formulas in the [certificate program](../checks/entropy-family564.py)
are continuous at a maximally mixed marginal output: rationalization removes
division by its zero Bloch length. The phase reduction applies to this
majorant, not to the exact entropy's extremizing phase.

## Uniform rational certificate

The [certificate](../checks/entropy-family564.json) contains4,454 binary
partition leaves over `[0,1]x[-1,1]^2`. Every state-domain leaf encloses
the **entire transverse parameter rectangle** by interval arithmetic.
The parameters are intervals throughout the formulas, rather than sampled
endpoints. The program proves `B<=27/100` on every leaf.

The [uniform scalar gates](../checks/entropy-family564-conditions.json) and
their [script](../checks/entropy-family564-conditions.py) record positive
Choi corner determinants, negative partial-transpose minors, positive
`c^2-r^2`, no pure output and the phase-order condition. The channels are
nonunital, non-entanglement-breaking and violate `c^2<=r`, the structural
restriction for the positive axial Davies semigroup class. This is not an
exclusion based on a cited Holevo-additivity theorem. See the corrected
[review and obstruction record](2026-10-26-entropy-review-and-obstructions.md)
for the primary equation and the limits of the antecedent comparison.

The minimum sum of marginal deficit coefficients is `221/800`. Therefore
the uniform entropy gap is exactly bounded below by
`221/800-27/100=1/160` times `C^2`.
Run the certificate script with `verify` as its argument. It rechecks
rational arithmetic, exact square-root enclosures and coverage from its
fixed root. Its claim is the scalar majorant bound; the entropy reduction
above is a separate analytical obligation.

No finite grid is used as a continuous proof. The earlier finite diagnostics
remain controls in the private research dossier; this note does not present
a numerical campaign as a ready Research Capsule. The exact arithmetic
certificate is not a theorem-prover formalization.

## Audit provenance and the exact manuscript boundary

A requested GPT-6 Astra xhigh audit rederived the fixed-pair global chain
and independently replayed all637 point-certificate cells. A subsequent
limited delta independently replayed all4,454 family cells, with64-bit
rational root enclosures in addition to the original32-bit bounds.
It checked prefix-free coverage, exact Kraft sum1, full parameter intervals,
uniform hypotheses and the margin. No material objection remained in those
scopes. The coordinator read both complete reports and verified43 and19
C:/D: artifact copies, including41 and17 manifest payload entries.

- Global report SHA256:
  `eea64441dc78ca9b2c192b981bdb5487643e6d664944e02b81dcade5fda03162`.
- Family delta report SHA256:
  `3cb52725e75e56960f55ea5d930d6b6fc1455a6556fe226e05a049400766a69f`.

Those audits reused context and shared files. The reviewer retained a
declared accidental exposure to grades of another manuscript; no blind
review, independent infrastructure or effective-runtime attestation is
claimed. The audits assigned **no scores** and certified no priority.

A combined seven-page manuscript is separately frozen with PDF SHA256
`4c800db8c24ea02a5653c83eb41e0202f73a6bae2157a5fc9b56bcae3485557d`.
Its full exact-PDF review has closed: overall AIRR and importance4.5/10,
technical quality8.5/10, with bibliographic/expository minor revisions.
Those scores apply only to that exact PDF. The separately corrected PDF
does not inherit them; its delta closure resolved O1/O2/O3 without new scores. See the
[review and obstruction record](2026-10-26-entropy-review-and-obstructions.md).
No editorial status follows from these private model reviews.
This knowledge note is not an AIRR deposit receipt or public-paper record.

## Primary antecedents and reading scopes

The [dated source record](../checks/entropy-families-sources567.json) pins
current frontier heads, observed surfaces and private-snapshot hashes.
OpenAI/math and DeepMind/formal-conjectures heads were unchanged in this
refresh. ai.viXra returned406 and was not read anew. Surface observation
does not mean abstracts, statements or proofs were read; the sweep is
directed, not exhaustive. No foreign full text is distributed here.

- [Hellmund--Uhlmann0903.1340v1](https://arxiv.org/abs/0903.1340v1):
  selected flat-roof statements and short proofs read; the one-use identity
  was also rederived. No complete paper audit.
- [Muller-Lennert et al.1306.3142v4](https://arxiv.org/abs/1306.3142v4):
  root read Theorems5/7 and the order-two formula. The global auditor read
  corresponding v3 statements; no full external-proof audit.
- [Filippov1802.00646v2](https://arxiv.org/abs/1802.00646v2): selected
  filtering statements/equations read by the coordinator. Its capacity
  bounds do not automatically provide this exact convex-roof inequality.
- [Tang et al.2609.28592v1](https://arxiv.org/abs/2609.28592v1): selected
  pure-output coverage corollaries read; the old rank-two partner remains
  retired as already covered. These families have no pure output.
- [Ruskai--Yard2111.11385v4](https://arxiv.org/abs/2111.11385v4): root
  read latest abstract/version metadata; an earlier auditor read selected
  v1 passages on local additivity. No complete proof audit or automatic
  global transfer is claimed.

## Hypothesis reduction and next falsifier

- Target: `domain.quantum_information_theory`; move: `move.spectralize`.
- Literature: axial roofs and divergence/metric comparisons.
- Own written result: the audited fixed-family global bound and its exact
  arithmetic certificate, with no canonical promotion to `formal`.
- Heuristic: preserve enough channel dependence in weighted correlation
  norms to compare them to marginal deficits.
- Speculative extension: a corresponding all-partner or tensor-power
  estimate. Neither has been established.

The dictionary maps Schmidt coherence to output correlation, its Pauli
Gram matrix to a weighted norm, and marginal mixing to a one-use entropy
deficit. It preserves all input orientations and the full two-parameter
rectangle. It discards sharp logarithmic information and makes no bridge
from a qubit partner to an arbitrary-dimensional one. The eliminated
hypothesis is small Schmidt amplitude; the remaining partner/blocklength
restriction must not be renamed as a solved capacity problem.

Falsifiers include a failed analytical identity, a missed interval region,
a wrong parameter quantifier, or a counterexample to the stated entropy
gap. A covering antecedent would retire the novelty route while preserving
the verification as a known-case control. The next substantive target is
the larger-partner obstruction or a real tensorization mechanism, rather
than separately scoring each corollary. A minimal formal target would
encode the rational partition and arithmetic; no such Lean theorem was
added. Importance above7 remains unestablished.


## 27October follow-up: leakage continuity and a prior-claim gate

The freshly retrieved quantum-information neighborhood contains3nodes and2edges; graph proximity supplies context, not proof. A conditional own argument transfers the cited excluded-sector theorem to a leakage bound with an error depending on the two original dimensions, uniformly over finite auxiliary dimensions. Koashi--Winter cancels the large entropy terms; Winter's given-purification argument and Shirokov's existing measured-dimension continuity bound control the remainder. Its derivation, exact quantifiers and unverified literature dependencies are in [proof889](../evidence/2026-10-27-leakage889/PROOF889.txt). The generic continuity corollary alone is not selected as a frontier manuscript.

An explicit three-qubit family has leakage epsilon=t^2/(3+t^2) and a strictly linear-in-t change of the superadditivity defect. It excludes an absolute O(epsilon log(1/epsilon)) continuity shortcut. Its defect stays nonnegative: this is neither a counterexample to strong superadditivity nor a refutation of a sharper one-sided bound at the equality locus. The written analytic derivative proves the obstruction;25 exact rational partial traces independently verify the matrix identities. Decimal entropy values are illustrative, not certified bounds.

The already catalogued [OpenAI family276 manuscript](https://github.com/openai/math/blob/7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a/preprints/Classical-capacity-and-entropy-inequalities-for-generalized-amplitude-damping-September-24-2026/build/paper.tex) explicitly claims GAD capacity and arbitrary-partner additivity. Its [formalization scope document](https://github.com/openai/math/blob/7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a/lean/docs/276.md) explicitly excludes arbitrary different partners from the described formalization. These are different scopes; neither was independently Lean-replayed here. Main statements and strategy have now been read, not the included proof sections. Therefore GAD capacity and that partner claim are not selected as new contributions.

The distinct retained candidate is the fixed non-GAD N=(3/5,1/4,1/5), for which c^2 differs from r. A proposed rectangular entropy inequality would retain the input population and allow an arbitrary finite-dimensional partner. Its480 seeded float probes with partner output dimensions2..4 found no negative value (minimum about0.000264685 nats). This is not a continuous proof, exact certificate, arbitrary-partner theorem, Research Capsule or globally certified open problem. The next gate is the actual source thermal proof: identify the use of c^2=r and derive or refute the proposed extension, instead of accumulating more numerical examples.

Literature: [Koashi--Winter Theorem1](https://arxiv.org/pdf/quant-ph/0310037v1), [Winter Lemma2 and Corollary4 proof](https://arxiv.org/pdf/1507.07775v6), [Shirokov Proposition23 Eq172](https://arxiv.org/html/2201.11477v4), and [Tang et al. Theorem4.1](https://arxiv.org/html/2609.28592v1). Source hashes, versions and actual reading scopes, own proof, controls and native/public byte mapping are linked in [evidence889](../evidence/2026-10-27-leakage889/MANIFEST889.json). Only own synthesis/code and bibliographic metadata are included; no foreign source bodies or credentials. The initial private proof draft preceded the fresh graph retrieval; the retrieval was completed before this public integration. Formal layer: no new Lean theorem. Literature layer: attributed dependencies. Heuristic/speculative layer: the unproved rectangular extension. No new manuscript or model grade follows.


### Follow-up895: the actual thermal condition and a rejected transfer

After the initial statement reading above, the entire [thermal theorem and its proof](https://github.com/openai/math/blob/7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a/preprints/Classical-capacity-and-entropy-inequalities-for-generalized-amplitude-damping-September-24-2026/build/sections/thermal.tex) were read. Other dependency proofs remain unaudited here. The source uses alpha*delta-beta*eta=K^2. At interior input population p this is precisely r=c^2; for the retained N the mismatch is -(11/100)p(1-p), so renaming its coefficients does not remove that hypothesis.

The shortcut of making the entropy excess nondecreasing as c rises from the GAD value is false. With p=1/2, r=1/4, t=1/5, identity partner, X=(1,0)^T and Y=(0,1)^T, direct eigenvalue calculus gives F_prime(3/5)<-(23/50)ln5<0. The output is strictly positive and the roof uses sqrt(c^2+t^2), retaining the translation term. [The written analytic argument](../evidence/2026-10-27-leakage889/THERMAL895.txt) uses rational square comparisons and elementary logarithm bounds, not numerical differentiation. It refutes this monotonicity route, not the desired endpoint bound, strong superadditivity or channel additivity. The next route requires a different matrix inequality or an explicit nonmonotone margin; no such theorem is established. [Version/hash ledger](../evidence/2026-10-27-leakage889/COVERAGE895.json).


### Follow-up899--908: exact reductions, full objections and retained restrictions

The newly retrieved radius-one quantum-information subgraph is context only.
The [bounded evidence record](../evidence/2026-10-27-entropy899/README.md)
preserves the original899, separate correction903 and full unscored audit901.
All nine objections remain. The coefficient ray reaches alpha*delta=K^2
while preserving the original population weights after recombination; its
P5 comparison is sufficient for the fixed channel, not proved necessary.
The exact dictionary B_N iff Q retains every finite quantum reference.
Schatten differentiation must include changing block norms, so scalar
compression positivity and integer moments do not close the missing estimate.

[Audenaert2xN v2](https://arxiv.org/html/math/0702186v2) supplies a conjectural
comparison, not an adopted universal theorem. Selected
[Zhang v4](https://arxiv.org/html/2410.21961v4) rank-factor statements leave
a log2 loss on differentiation. The full external proof chains and global
current open status are not certified here. Ordinary and complete channel
comparisons are distinguished in selected
[Reverse-DPI v3](https://arxiv.org/html/2411.19890v3) passages; only the abstract
and metadata of [partial-orders v4](https://arxiv.org/html/2011.05949v4) were
read, with definitions located for further work. Exact own ensembles rule
out either zero-offset ordering between this complement and dephasing.

The own argument904 gives, in nats,
G(rho)>=delta_e(p)-H(Z|R)>=44/125*p*(1-p)-H(Z|R), where Z is the dephased
input and G is the original target gap. It covers arbitrary reference
dimensions and coherences under a remaining conditional-entropy budget.
A mixed entangled example with nonorthogonal reference branch vectors has
a written margin41/750; its supports are distinct lines with zero
intersection. Exact matrix controls do not replace the entropy argument.
The exact input905 and review context are retained in the evidence record;
no subsequent note inherits a component verdict or a manuscript grade.

Separate, unreviewed907 yields G>=I(Z:R)-E_F(A:R), hence covers all separable
inputs and recovers pure inputs. The balance condition is not established
for all mixed entangled states. Separate908 gives an analytical uniform
margin14179/1624320 along a standard two-qubit isotropic line for every
noise parameter in[0,1], using entropy concavity, a binary variational bound,
majorization and exact integer comparisons. Earlier restricted-partner
coverage is not excluded; these are controls for one target, not separate
frontier papers. Fixed-marginal convexity and concavity shortcuts are both
explicitly refuted in903 without refuting Q itself.

Hypothesis audit: exact orthogonality of the reference branches can be
replaced by a quantitative information budget in904. Arbitrary finite
dimension survives; the budget and the unresolved mixed-entangled region
remain. Mechanism: phase pinching isolates coherence cost, SSA bounds the
dephased reference contribution, and scalar curvature retains population p.
Falsifier: a wrong sign, covariance/curvature identity, or exact state
violating the scoped bound; a covering antecedent retires novelty.
Formal layer: no new Lean theorem or confidence promotion. Literature layer:
attributed standard entropy tools and explicitly scoped primary statements.
Heuristic layer: balance reference information against coherence loss.
Speculative layer: the universal P5/Q comparison and arbitrary-partner payoff.
No new manuscript, model importance grade, human peer review or acceptance
is asserted. These bounded logs are not a Research Capsule or full corpus.


The full [component audit906](../evidence/2026-10-27-entropy899/AUDIT906.txt)
supports the explicit904 budget with all seven objections retained. Missing
definitions and dependencies were reconstructed, and nonorthogonal support
lines were distinguished from intersecting subspaces. This is no importance
grade or review of later notes. The [scope gate910](../evidence/2026-10-27-entropy899/PROOF910.txt)
uses [Wootters v2, equations8--10](https://arxiv.org/html/quant-ph/9709029v2)
as an attributed formula: at isotropic v=4/5 both the904 and907 sufficient
bounds are negative, while908 certifies its uniform positive margin. Exact
series/integer comparisons establish this distinction; no worldwide novelty
is inferred. The earlier pure-branch example904 is also covered by907 and
is not counted as a separate advance over that bound.

## 30October2026: retire the broader aligned unital factor detour

The [consolidated argument and full actual component review](../evidence/2026-10-30-hypothesis-audit/README.md) exclude N=Lambda o M for this fixed channel when Lambda is any unital Pauli-diagonal qubit channel in the SAME axes and M is qubit CPTP with a pure output. Sign normalization, tangency and both Choi blocks give alpha*gamma<=beta; outer CP then requires a^2<=841/2880, contradicted by9/25with exact gap979/14400. This covers unequal aligned transverse multipliers beyond the older depolarizing-only test.

The one unscored AI review supports that restricted conclusion, preserving O1-O9, all native context and its output-path-only control adaptation. Requested Astra xhigh; actual backend/effort/independence are unattested. Source [Fukuda v4](https://arxiv.org/html/quant-ph/0505022v4) remains attributed; boundary inequalities are derived directly from Choi, not inferred from strict source prose. This is not a PDF grade, human peer review or novelty certification.

The hypothesis reduction rejects a method class; it removes NO hypothesis from global Q. Do not extend it to arbitrary rotated/non-diagonal outer factors, reverse composition or non-TP filters. Retire aligned Pauli searches and minor subclass/review cycles. Resume Q only with a concrete population/jointER-preserving estimate or applicable new primary mechanism. Literature is scoped source context, heuristic is own applicability reasoning, speculative is global Q, formal:none newly checked. A valid aligned factorization or error in the exact Choi/tangency chain would falsify this guard. No new paper or score follows.
