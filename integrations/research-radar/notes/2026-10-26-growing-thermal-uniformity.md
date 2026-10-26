# Growing thermal noise: working extension and exact antecedents

## Retrieved context and evidence levels

Retrieved domain.quantum_information_theory and its incident literature edges
edge.qinfo.no_signalling and edge.qinfo.cmi_recovery before writing.
They provide context, not a capacity proof. No canonical node, edge,
confidence, ranking or Lean declaration changes.

**Literature:** Holevo's [1004.0196v3](https://arxiv.org/abs/1004.0196v3),
Proposition 2 and one-mode example on p.13, gives the exact Choi norm.
His amplitude is sqrt(kappa) and noise coefficient is
m=(1-kappa)(n+1/2), hence ||J||=1/[(1-kappa)(n+1)].
This is an exact antecedent, not a new lemma.
Audenaert's [1102.3040v2](https://arxiv.org/abs/1102.3040v2), Theorem 4,
already gives the telescopic relative-entropy inequality used here.
Selected definitions, theorem/proof passages and the Choi example were read,
not the complete dependency corpus. A printed difference-orientation
inconsistency on p.10 of the TRE proof is repaired by reversing that
auxiliary difference; the theorem remains unchanged.

**Heuristic / analytically supported working result:** unscored audit615
supports the full Shannon and fixed finite super-Shannon reset-budget
minimax curves for a known thermal signal with n=o(E), and for unknown
fixed signal parameters in a known envelope kappa>=kappa0>0,
0<=n<=N(E)=o(E). One code serves the latter signal/reset family.
Parameters remain fixed inside a block; coding length tends to infinity
at each fixed energy and family before the energy limit.
The audit reused context and files; independence and runtime identity are
not independently attested. It did not assess an exact manuscript PDF.

## Hypothesis reduction, dictionary and falsifiers

The preceding rank-counting working argument required n=o(sqrt(E)).
The replacement does not pay a growing environment Kraus rank.
Bounded Choi order gives omega_RB<=c rho_R tensor I_B.
A near-capacity pure-component bound makes the largest input eigenvalue
and signal-vacuum probability vanish.
A conditional-entropy deficit survives output pinching with a fixed
reference. A normalized thermal comparator and the existing telescopic
inequality turn relative-entropy saturation into branch discrimination.

The normalized good block does not retain the original reference marginal.
Its D0 uses the original rho_R and equals negative conditional entropy
plus the relative entropy of reference marginals. Both normalization
terms have sign +log(v). Ignoring these facts creates a false shortcut.
This dictionary preserves order, weights, expected physical cost and a
uniform absolute rate bound. It does not produce an efficient decoder,
uniform blocklength, peak-number constraint or arbitrary within-block noise.
Signal ordering compares mutual information of the same input only;
degrading the whole mixture could change reset entropy.

The joint limiting parameters are E->infinity and E/(n+1)->infinity.
There is no fixed-energy supremum over all unspecified sublinear paths.
An admissible violation of the flat order, fixed-reference pinching,
explicit branch-error envelope or matching common-code lower bound would
refute the result. Seventy-two finite noncommuting matrix controls and
ninety high-precision scalar controls replay byte-identically; they are
corroboration, not infinite-dimensional proofs.

**Speculative:** the full critical-temperature minimax law remains open
here. At kappa=lambda=1/2 and n=E, thermal assisted capacity tends to one
bit and the flagged benchmark to half a bit. The old saturated loss curve
would be one bit, impossible by nonnegativity of capacity. This refutes
that extrapolation, not all critical-regime laws or a universal threshold.
Do not turn the boundary example into a separate discovery paper.

**Formal:** no new checked theorem. Fixed-reference pinching for finite
positive matrices is a possible small formal target. It would not certify
Gaussian domains, capacity, novelty or the infinite coding limit.

## Exact artifact, publication and freshness separation

The eight-page draft PDF SHA-256 is
a9d335c8f7b192f070177eb5d5b69ec0d2dd317b544602421197686abadafdc8.
Its full requested Astra review620 is pending at this checkpoint; no grade
is presumed or transferred. Audit615 report SHA-256 is
ebbed1d173f87583c747d88bd975c2c2dd60cf4f8b3989e0ed8e4d7796b70495.

The separate [Davies v3 Working paper](https://airr.science/papers/ARR-2026-5YJX444B6M95ZTG4/versions/v3/#model-assessments)
is public with original Sonnet/Haiku scores 4.3 and 4.5, adverse reports,
disclosed format-only bindings and the author/operator response.
Those reports do not assess the thermal draft. Working paper is not
editorial acceptance. The importance-above-seven goal remains unmet.

The directed source refresh returned unchanged OpenAI/math commit
1581d4cbdd69a0faf34b2089614fe2a814316a6a and DeepMind/formal-conjectures
commit 039378b7951df701428aa5c6732a94a149a077e1, plus public repository
and author/index metadata. That is inventory coverage, not a claim to
have read every statement or proof.

## Follow-up: exact review620 and strict-gap audit627

This update follows the checkpoint above; it does not rewrite that chronology.
The same small quantum-information subgraph and its two incident edges were
retrieved again. They remain context, not evidence of a new capacity theorem.

The complete requested Astra review620 of the exact eight-page PDF closed
with importance4.0, technical5.5 and minor_revision. Its nonmaterial R1
corrects the pinpoint attribution of the valid exact-type information bound:
Berta-Gharibyan-Walter Lemma9 supplies compound coding, not that type
estimate. The next draft gives the short type proof directly.
Original report SHA256:
a9b287db3f032739b03724aff16ac87ebee1033d0ba9ee713b85973b12fcff2d.
Later original-reviewer binding631 retains the same assessment and time;
it is not another vote. No score transfers to the expanded manuscript.

**Literature:** the binary purification/Gram bound is an exact antecedent
in Roga-Fannes-Zyczkowski,
[1004.4782v1](https://arxiv.org/abs/1004.4782v1), Corollary4/Lemma5,
also Fannes-de Melo-Roga-Zyczkowski,
[1104.2271v1](https://arxiv.org/abs/1104.2271v1), Eqs.(3)-(6).
The second source uses squared fidelity; our F is root fidelity.
The relative-entropy/fidelity bound and Pinsker are established.
Selected statements and proof passages were inspected, not every theorem
in these papers. This known Gram bound is not a new discovery.

**Heuristic / analytically audited working result:** audit627 supports
the combination

    0 <= lambda*c - I(R:B)_[lambda*omega+q*omega_R tensor tau]
      <= h(lambda) - [2*lambda*q/(3*ln(2))]*2^(-c),

for finite c=I(R:B)_omega, normalized separable-system states and every
reset tau, even with infinite entropy or energy. It assigned no score
and did not assess a manuscript PDF. Its report SHA256 is
09a102be4bb3a62d308072861073dafdafa948451636afcacab3164abe97c7d6;
manifest SHA256 is
e85ea71182212c8a543043fca3b7d7a772d806baf0429b9157c744783b068b76.
Reused context, shared filesystem, prior assessment exposure and absent
independent runtime/participation attestation remain disclosed.

The mechanism uses the finite branch flag X, avoiding subtraction of
infinite reset entropies:
h(lambda)-loss = chi_B + H(X|RB).
Bures distance d between omega_B and tau controls chi_B from below;
the known two-purification Gram matrix controls H(X|RB).
With a=F(omega,omega_R tensor omega_B), purification geometry gives
F(omega,omega_R tensor tau)>=(a-d)_+.
The scalar inequality d^2+2(a-d)_+^2 >= 2*a^2/3 and
a^2>=2^(-c) give the gap. The chosen constant is not claimed optimal.

The translation dictionary maps state information c to a signal-input
mutual information, the binary flag to transmission/reset, and the
positive gap to a uniform operational lower bound.
It preserves normalization, fixed channel parameters, unlimited
entanglement assistance and expected physical cost. It does not
preserve the reset's budget after output compression, so the proof
must hold for all compressed resets instead of assuming a new budget.
Pointwise information does not by itself imply one compound code.
Fixed input/output cuts, one exact input type and the existing
arbitrary-index finite compound theorem supply that code.
For each finite E,N this works also when N>>E; output cuts may grow
with N. There is no uniform blocklength claim.

At n=rE with fixed r>0, both true complementary occupations grow
linearly, with product/E^2 tending to (1-kappa)*r. The signal benchmark
tends to log2(1+kappa/((1-kappa)*r)), a finite constant.
If n/E does not vanish, signal-noise ordering gives a bounded benchmark
on an unbounded subsequence and hence a strictly positive gap below
h(lambda), uniformly over every reset budget. Choosing
B(E)=log2(E+1) prevents the old complete curve from holding.
Together with the earlier sublinear sufficiency, this supports the
sharp iff regime n=o(E), and N=o(E) for a known unknown-signal envelope.
The eliminated hypothesis is that the sublinear condition was only
sufficient; this is necessity for the complete uniform-in-budget law,
not for each small-budget recovery problem.

Falsifiers include a violation of the state inequality, failure of the
common-cost arbitrary-index coding transfer, or failure of the true
two-mode critical capacity limit. 1080 seeded finite diagnostics pass,
but do not establish the infinite or operational results.
The actual critical-regime minimax curve remains unresolved.
Do not split successive strict-gap constants into separate papers.

**Formal:** no new Lean-checked theorem and no confidence promotion.
A minimal candidate is the scalar remainder
d^2+2(a-d)_+^2 >= 2*a^2/3 for a,d>=0; proving it alone would not
certify the quantum or capacity conclusions.
**Speculative:** obtaining the actual critical-temperature minimax curve
requires matching witnesses and a uniform converse at bounded signal
information. Abandon any proposal inferred from the upper gap alone:
it provides no matching formula.

The combined eleven-page manuscript632 has PDF SHA256
944f8e477cb6ef8a53b8017ac5214ca715a82c4bfc090683e95bcf14de9504a9,
manifest SHA256
15b350cfcd8c1c77386a3fec3a3232935eda46bf7a9719c6e2451b449adad167.
It compiles and all pages were inspected. Its complete exact-PDF
review634 is pending; no grade or publication is presumed.

## Directed freshness633 and a separate literature lead

Ten primary metadata/index requests succeeded. OpenAI/math and
DeepMind/formal-conjectures retained the commits recorded above.
Anthropic, DeepMind research, AIRR, ai.viXra and the owner's public
repository index were refreshed as inventory, not proof coverage.
Refresh manifest SHA256:
9483aee624297e0cdc39023e7f86b430a0cbb0e7b0d67738ecc9ff1014e5d844.

The abstract of Mele et al.,
[2607.27449v1](https://arxiv.org/abs/2607.27449v1),
reports a certified rank-two non-Gaussian witness for positive
unassisted quantum coherent information beyond the Gaussian threshold.
Coverage here is abstract only, not a theorem or numerical-witness audit.
This concerns unassisted quantum capacity; it does not refute the
entanglement-assisted thermal optimizer used above.
A proposed bridge to reset noise is speculative until that witness,
its error certification and model assumptions are inspected.
Finite next step: reproduce the certified witness at its stated
parameters before adding a reset perturbation. Abandon a proposed
extension if the base certificate cannot be reproduced or its
positivity follows already from the cited results.

## Actual publication and full assessment634 (later update)

The pending status above is historical. The exact eleven-page PDF632
was assessed in full: importance **4.5/10**, technical **6.0/10**,
model recommendation accept, with no material or required minor change.
Optional comments concern the program inventory and an earlier binary
purification antecedent. This is a model recommendation, not editorial
acceptance. The target of importance strictly above7 remains unmet.
The original report SHA256 is
01ab08165bfa89527c3359a7753551c5b26d47d638e48957b0ae8ec8075e9b78.
The later public binding is the same assessment, not a second vote.
Reused context, shared files and earlier assessment exposure are disclosed;
independence, runtime identity and reasoning effort are not attested.

The exact PDF, its report and review context are now public as
[thermal v2](https://airr.science/papers/ARR-2026-71PQXGYGR887JAWR/versions/v2/#model-assessments),
a Working paper published2026-10-26T08:00:03Z. The actual website PDF
download matched the SHA256 above. Original v1 evidence was retained.
Author deposit SUB-E05C31B641FA9C61 is a linked revision, not a new paper.
No grade transfers from this PDF to the extensions below.

## Resource removal641, terminal bounded audit644

**Literature:** CMI data processing is applied on the reference R,
not on the conditioning output B. For a reference measurement R->X
preparing an ensemble and a product-reference reset, flag chain rules give

    0 <= I(R:B)_mixed - I(X:B)_mixed
       <= lambda * [I(R:B)_signal - I(X:B)_signal].

The mechanism and infinite-dimensional CMI antecedents are standard:
[Shirokov1506.06377v2](https://arxiv.org/abs/1506.06377v2), section6.1,
Theorem2 and selected extension proof. Thermal-reference heterodyne
prepares a locally implementable Gaussian coherent ensemble. The established
signal classical benchmark is G=g(kE+t)-g(t), t=(1-k)n, from
[Giovannetti et al.1312.6225v1](https://arxiv.org/abs/1312.6225v1).
Its full Gaussian minimum-output theorem is imported, not reaudited.

**Heuristic / analytically audited working result:** terminal audit644
supports removing preshared entanglement for the complete entropy-budget
curves when n->infinity and n=o(E). Under the divergent-bath premise,
the sublinear condition is also necessary. For unknown fixed signal
parameters, replace n by the prescribed envelope N; individual family
members may still have n=0. This is an operational hypothesis reduction
of the same thermal project, not a new general CMI theorem.

The Gaussian same-input gap obeys

    0 <= C_EA-G
      <= log2(1+1/t)+(1/E+1/t)/(2*ln2),   E,t>0.

Only the worst-pair gap must vanish in the unknown-signal sandwich.
The reference measurement compares one input and one ensemble; it does
not bound the optimized assisted/unassisted capacity gap for every reset.

The translation dictionary maps the reference measurement to local mixed
coherent preparations; the spectral test to a flag-entropy estimate; and
finite types to actual photon-cost words. It preserves fixed memoryless
parameters, expected physical block cost and a common collective decoder.
It loses preshared entanglement. It does not turn a reset-dependent
analytical test into a parameter-dependent operational decoder.

The nontrivial operational closure is explicit: truncate a Gaussian
amplitude disk, replace cells by conditional mixed preparations, cut output
Fock space with overflow, then use exact-cost type superletters and the
arbitrary-index finite cq compound theorem
[Bjelakovic--Boche0710.3027v2](https://arxiv.org/abs/0710.3027v2),
Theorem3.1 and selected direct proof5.10. The type loss is one d_l,
not two. For necessity at each fixed finite E,N, reference-tail compression
costs at most 2h(epsilon)+2epsilon*g(E); finite-reference continuity then
gives uniform output-cut convergence even when N>>E. A bounded-G
stratification supplies one common strict rate. Limits of code length
precede all energy limits. No uniform blocklength or phase uncertainty
claim is made.

Audit644 found no material objection within this scope and assigned no
score. It imports earlier615/627 scientific results rather than reauditing
them. Its report SHA256 is
ec115c2eba9fe8f0c2963a8384e4cbe1ea043c07863a5bfd17079f7a7e68866d;
manifest SHA256 is
e8c71ad5b8dbc2fc30408d7d9c794bfad323b2d24403f0bb338be85620b12064.
All37 payloads were hash-checked and matched between working/preserved
copies. Its540 finite-state and150 Gaussian checks reproduced; four
symbolic identities were checked. These are diagnostics, not coding proofs.
Participation and shared context are declared; isolation is not verified.

Falsifiers: a common-code failure after fixed cuts; wrong-side CMI DPI;
lost physical cost; assuming every unknown member has a diverging bath;
or using a pointwise Holevo bound as a compound capacity theorem.
Abandon any stronger statement for bounded non-EB baths without another
converse. The sharp critical minimax curve remains open here.

**Formal:** no new Lean result or graph confidence promotion. A minimal
finite target is the four exact Gaussian radical/product identities;
it would not formalize the compound coding theorem.

## Bounded-bath candidate648: pending technical audit, not a theorem

**Speculative:** a second route might remove n->infinity when the selected
worst thermal signal is entanglement breaking: t>=k.
The explicit heterodyne/prepare representation uses seed
gamma_(t-k) and yields Phi(rho)<=I/(t-k+1). Near-capacity cq ensembles
have conditional output entropy at most g(t)+a fixed constant. A
fixed-reference window and the already-established telescopic inequality
then suggest a uniform joint flag test for a vacuum/thermal reset witness.

The missing operational bridge cannot be bare unconstrained additivity:
unconstrained bosonic capacities are infinite. The relevant existing
source is [Shirokov quant-ph/0408009v3](https://arxiv.org/abs/quant-ph/0408009v3),
Proposition7(ii), the marginal chi-function inequality23 and its
finite-to-infinite extension proof. These passages were read; the full
paper and original finite-dimensional theorem were not reaudited.
Source PDF SHA256:
617b09802cba41942b673f3fbd43908fb65666ced35aed0609906fdd48aae7a7.
Strong constrained chi subadditivity would allow energy sharing and
entangled block inputs to be bounded by a one-letter witness converse.
Only the worst-pair witness would need EB; other unknown family members
could remain cold or noiseless.

The proposal removes a concrete divergent-bath hypothesis if valid;
it does not address every bounded non-EB bath. The exact working packet
manifest SHA256 is
af75f1a09b4c8b404b45af2fe555e0232c4ff164172c05650af836df544eebae.
An unscored technical audit was requested after644 finished. It is pending,
and no importance, correctness or publication is presumed.
Checks of240 noncommuting cq states,30 thermal parameters,21 diagonal
witnesses and the exact characteristic-function noise factor passed;
they do not prove infinite-dimensional additivity or uniform asymptotics.
Falsifiers include incorrect noise at t=k, dropping the posterior/original
reference correction, nonuniformity in ensemble cardinality, wrong
energy-sharing concavity, or a failure of constrained chi subadditivity
in the actual witness channel. No new graph edge is inferred.

## Directed freshness648 and distinct new abstract leads

All ten primary metadata/index requests succeeded on26October2026.
OpenAI/math and DeepMind/formal-conjectures retained the previously pinned
commits. Anthropic, DeepMind, AIRR, ai.viXra and public owner-repository
indexes were inventoried; this is not exhaustive reading or proof coverage.
The follow-up literature search was directed, not a priority certificate.

[Adesso--Lami--Giovannetti2610.22308v1](https://arxiv.org/abs/2610.22308v1)
announces constrained classical capacities for all single-mode Gaussian
channels and mean-energy rate/error trade-offs. Coverage: abstract read.
It is an important antecedent lead, not evidence of an additivity theorem
for our generally non-Gaussian reset mixture. Inspect its actual theorem
and hypotheses before extending the present proof beyond the EB witness.
[Barber--Pirandola2610.26783v1](https://arxiv.org/abs/2610.26783v1)
announces PPT-assisted quantum capacities; coverage: abstract read.
PPT-assisted quantum transmission is a different resource/task from our
unassisted classical compound problem, so its formulas are not substituted.

## Terminal649, all-block converse653/654 and exact draft657

The pending648 status above is historical. Audit649 subsequently supported
the bounded-bath EB route within its stated regime, without a score.
Its report SHA256 is
1b466198bb64aab9b6ad026ad062eb2fd8175a57106e1314caf8bcd7f0377e3d.
Its35 payloads were verified against hashes and working/preserved copies.
The scope remains EB: that report did not prove the next all-block result.
The route was superseded by a broader converse, not refuted or erased.

**Literature:** thermal Gaussian tensor-power minimum output entropy is
an established input, including entangled states of finite second moments:
[Giovannetti--Holevo--Garcia-Patron1312.2251v1](https://arxiv.org/abs/1312.2251v1),
Proposition4/Eqs25-26, the Section6 closure and Section7 formulas.
The correct title of1312.6225v1 is *Ultimate communication capacity of
quantum optical channels by solving the Gaussian minimum-entropy conjecture*;
its Eq2 states the all-block entropy minimum explicitly.
These foundational results are imported, not newly proved here.
The bounded Gaussian Choi operator is from
[Holevo1004.0196v3](https://arxiv.org/abs/1004.0196v3), Proposition2 and
the one-mode example; no EB premise is required for thermal attenuation.

**Heuristic / analytically audited working result:** terminal audit654
supports candidate653's converse uniformly over block length, permitting
arbitrary entangled block inputs and total expected photon cost. Combined
with the earlier common cq lower code and strict necessity, this supports
the complete unassisted curves iff n=o(E), without n->infinity or EB.
For an unknown fixed attenuator family the corresponding criterion is
N=o(E), including bounded, zero and oscillating envelopes. Known k and
worst-family k0 remain fixed in(0,1); identity may be another family member.

The removed hypotheses are bath divergence and the EB/additivity witness
restriction. The mechanism is not an assumed additivity of the reset mixture:

1. At position j retain causal reference R_j=(message,past mixed outputs).
   The current flag is independent of it, even for entangled inputs.
2. Degrading the all-signal past to the mixed past raises conditional
   entropy, so sum_j K_j>=S(signal block|message)>=m*g(t).
   Individual K_j may be negative. Flat Choi order separately supplies
   d_j=log2(c)+K_j>=0, c=1/(t+1-k).
3. A near-capacity block has bounded average d_j and average vacuum mass
   O(1/log E), using total energy and a common thermal comparator.
   It need not have a thermal or energy-E marginal at every position.
4. Markov bounds the fraction of bad positions. Fixed-reference pinching
   and normalized TRE on good positions imply average flag uncertainty
   o(1), with no factor m, message dimension or reference entropy.
5. The same witness and a remainder uniform in m give the operational
   capacity converse by Holevo--Fano before taking the energy limit.

Translation dictionary: causal references retain quantum past correlations;
the summed entropy floor is inherited from the signal's tensor powers;
good-position selection replaces an invalid per-use floor; a conditional
Helstrom test bounds an already-conditioned entropy and is not the decoder.
What is preserved: total expected cost, arbitrary block entanglement,
fixed channel/reset, collective decoding and all finite entropy budgets.
What remains outside: efficient blocklengths, within-code variation,
known exactly noiseless k=1 by this order argument, and the critical curve.

Audit654 report SHA256:
0577fd73a74782b7cf31ea8f2e991fc0149183bc3b49220bfbba6f81621439f0.
Manifest SHA256:
008409754cce158e65e19f1944c130b98c76b02c4cc780a8a5a52b21c8d1c2c4.
All29 payloads were hash-verified and matched between copies; the full
report was read. It assigns no importance score and is not a PDF assessment.
Shared context/participation and absence of independent runtime attestation
are declared. Its120 finite block controls and four symbolic checks passed;
the explicit Bell example K=-0.9025202799742829 falsifies the tempting
individual-floor shortcut. These controls do not prove the infinite theorem.

Falsifiers: a failure of causal-flag independence, reversed conditioning
DPI, a per-use energy assumption hidden in the total-cost argument,
failure of Choi order for a mixed reference, a missing posterior-reference
divergence, or an m-dependent TRE/flag error. Abandon any generalization
that fails one of these transfers. The claim is a combination of existing
information inequalities with a new operational argument, not priority
for those inequalities.

**Formal:** no Lean theorem or confidence promotion. A small finite target
is the causal entropy identity plus the distinction between summed and
individual conditional floors. Formalizing those alone would not establish
the imported Gaussian theorem or the common infinite-dimensional code.

## Authorial extension658 and fresh full review659 pending

**Speculative, pending full manuscript assessment:** the same block proof
appears to extend to centered phase-insensitive covariant Gaussian channels
of gain k>0 and vacuum noise t>=max(0,k-1). Their known signal capacity is
g(kE+t)-g(t). This includes attenuation, amplification and additive noise.
The proposed full-curve criterion is t=o(E) for fixed k!=1; at k=1 a
positive eventual noise floor t>=t0 is retained. An unknown physically
admissible family with gain in[k0,kplus],0<k0<1<=kplus<infinity, and t<=T
has the proposed criterion T=o(E), relative to the worst pair(k0,T).
It does not require EB of the other family members.

The precise dictionary changes Choi c to1/[t+(1-k)_+]. For additive k=1,
the correct source is Holevo's separate Case3(p11), not its nondegenerate
symplectic Proposition2. The signal decomposition into a pure-loss channel
eta=k/(t+1) followed by quantum-limited amplification bounds reference
information in the necessity argument. Known minimum-output and signal
capacity formulas are antecedents. The new claim concerns the reset
minimax combination, not Gaussian optimization itself.
Falsifiers: wrong amplifier vacuum-noise convention, forgetting the CP
noise floor, treating t->0 as bounded below, unbounded gain without a common
cutoff, or applying signal ordering to a reset mixture. Phase-sensitive
squeezing, arbitrary phase uncertainty and within-code variation remain
excluded. The360 high-precision parameter checks and exact noise identity
are diagnostics, not an audit of this extension. Its working manifest is
d5cb501c4a63a7a0f7c651da51a4de81e7a253b49e6a34622c8e4567b1cf2469.

The consolidated19-page draft657 includes this authorial extension as well
as the supported thermal block argument. All pages were rendered and
visually checked; built-in/local compilation passed. Six supplied programs
replayed byte-identically; they remain finite supplied implementations,
not independent implementations or an operational code.
Exact PDF SHA256:
2b88eee52e57d7104636f2faa165976871dc11c238e7d63d21a17ac559f5d711.
Frozen manuscript manifest SHA256:
d7f5c609bd6a2f75f16eb2851cb35c078889ab6702bcd5422f4cd732c842b809.

A single full Astra xhigh review659 was requested in a new context with
the exact PDF, source, six programs/expected outputs, primary pins and
scale-only context. No earlier numerical score or other referee report was
supplied in that clean input. The PDF itself retains truthful participation
and review-context disclosure. Context freshness is requested, not proof
of runtime identity, isolation or statistical independence; the filesystem
is shared. The reviewer must assess all19 pages and extension658 rather
than infer it from654. No score, publication or goal completion is presumed.
The last actual public full-PDF importance score remains4.5 for the earlier
eleven-page v2; it does not transfer to this draft.

## Directed freshness656

Ten primary index/metadata requests again succeeded; this is inventory,
not exhaustive reading. OpenAI/math retained commit
1581d4cbdd69a0faf34b2089614fe2a814316a6a and DeepMind/formal-conjectures
retained039378b7951df701428aa5c6732a94a149a077e1.
Anthropic, DeepMind research, AIRR, ai.viXra and public owner-repository
indexes were refreshed without copying their corpora into this repository.
The additional1312.2251v1 PDF was pinned to
42b6b0715c4571919a259ebefd90747487236b3bb5e57a4a28bc186460564505.
Reading covers the stated domain, Proposition4/selected reduction proof,
Section6 conclusion and Section7 signal formulas; not a complete proof audit.
The source-bundle manifest is
d2927ed847784e8f8221b8485544e8944f358f41145d901a82b753aaaea1c3a9.

## Terminal full review659 and editorial correction663

The preceding pending chronology is retained. Review659 subsequently
finished on the exact19-page PDF2b88eee52e57d7104636f2faa165976871dc11c238e7d63d21a17ac559f5d711.
Its actual judgment is importance5.5/10, technical8.5/10, recommendation
minor, with no material mathematical objection found within the audited
scope. This is a model recommendation, not editorial acceptance or a
correctness certificate. The >7 importance objective remains unmet.
The complete source was read and six supplied programs replayed with
byte-identical outputs; these are not independent implementations.

Report SHA256:b610a4bbc4a92951a36af207d34d1db1d9416dd506016ddf76019ca9dd87132c.
Verdict SHA256:45c9e999cb7ac77abe8f1f234913a50754df4cb073ab025371ab223949b2fc65.
Manifest SHA256:b8a2c1659b6377fa276b9da98bd3ffa76534724cc9a7375bb401e1663b061301.
The coordinator verified156 payloads and158 identical C/D files. Requested
GPT-6 Astra/xhigh identity, effort, isolation and independence are not
independently attested. Shared filesystem and incidental exposure to another
paper's qualitative search summary are disclosed. Twenty-two primary PDFs
were consulted at declared depths, not every foundational proof rederived.

Four minor requests concern explicit individual-infimum versus common-code
deficits, direct contextual citations, exact version metadata, and moving
the unchanged participation disclosure to an appendix. Draft663 addresses
them in20pages, with PDF SHA256
6968375b22facb1a5467606b16df7a6ccabe0bac0dee4824afc0c4fb932c4662.
All pages passed visual QA and compilation. Its38 frozen payloads were
verified; an exact-PDF correction check664 was requested from the SAME
reviewer. No score is automatically transferred to this different PDF.
It is not yet deposited or public at this checkpoint.

Contextual primary references now distinguish finite identity/replacer
models [quant-ph/0408103v3,IV.B,Eq34](https://arxiv.org/abs/quant-ph/0408103v3),
optical mixtures [2604.26874v2](https://arxiv.org/abs/2604.26874v2), and
energy-constrained cq compound channels
[2105.04274v1](https://arxiv.org/abs/2105.04274v1).
Baitenov2024,doi10.1134/S0081543824010048, was read through its editorial
abstract only; full text remains inaccessible and detailed overlap unknown.
The0710.3027v2 revision is2009, first submission2007. These are provenance
corrections, not new imported theorems or a certificate of priority.

## Directed freshness666 and next falsifier

Eleven current primary index/metadata requests succeeded. OpenAI/math and
DeepMind/formal-conjectures retained the commits recorded above. Anthropic,
DeepMind research, AIRR, ai.viXra and owner-public-repository metadata were
refreshed; this is inventory, not proof reading or an exhaustive sweep.

A bounded next research move examines the critical-noise regime rather
than assuming Gaussian modulation still optimizes the non-Gaussian reset
channel. The new candidate is separately recorded in
[the critical-reset bridge card](2026-10-26-critical-reset-modulation.md).
Its analytic combination is unaudited, its classical quadrature is not an
interval certificate, and no new capacity, minimax value or importance
score is claimed. No canonical graph, confidence, route or Lean declaration
is changed by this chronology.
