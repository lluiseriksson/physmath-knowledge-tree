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
