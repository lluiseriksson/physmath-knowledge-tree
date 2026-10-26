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
nonunital, non-entanglement-breaking and outside the inspected `c^2<=r`
Davies sufficient condition. These exclusions are not an exhaustive
literature classification.

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
Its full exact-PDF review is running in a new requested Astra conversation;
no manuscript score or editorial status follows from the preparatory audits.
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
