# Two-copy spectral certificates and all-copy stability

Observed 25 October 2026. This note records a newly audited argument and its
finite proof objects. It is not a claim of global priority, proof-assistant
formalization or a manuscript score. The associated seven-page manuscript
is undergoing its first complete exact-PDF assessment.

## Scope and dependencies

Use the unnormalized convention

```text
kappa(F) = min ||D||_HS^2 subject to [D,D*]=F,
s(D) = descending eigenvalues of DD*.
```

The earlier convention is identical with `D=C/sqrt(2)`, so
`s=lambda(CC*)/2` when `[C,C*]=2F`.

The classical real Horn/hive realization theorem supplies the feasible set.
All singular variables are nonnegative, including the last one: it is not
silently fixed to zero on an arbitrary coarse point. The
[earlier rank paper](https://airr.science/papers/ARR-2026-5QQF95VHTC9GABH8/versions/v1/),
PDF SHA-256 `17b2361721027649b8ef5b98440032b91b5b04e89e2a9535fcbe7a27954ac1c5`,
contains the integer coarse-grid restriction and the previously open amplified
rank question. The [Sakar antecedent note](2026-10-25-adjoint-moment-antecedent.md)
remains applicable to low-dimensional value formulas; those tables and the
Horn machinery are not claimed as new here.

Small graph retrieval: `domain.functional_analysis`,
`domain.spectral_theory`, and `edge.functional.spectral` supply operator and
spectral vocabulary only. Canonical graph nodes, confidence and solved status
are unchanged.

## The audited general criterion

For a fixed traceless Hermitian `F` in dimension `n`, the following are equivalent:

1. The minimum-cost squared singular spectrum for two direct-sum copies of `F`
   is unique.
2. At every positive integer copy count `k`, every optimum has the same spectrum,
   namely the one-copy optimum `u` with each entry repeated `k` times.
3. Some finite constant `K` controls every feasible factor at every copy count:
   `||s(D)-u^[k]||_1 <= K (||D||_HS^2-k*kappa(F))`.

These assertions concern spectra, not uniqueness or a fixed-basis distance
between the factor matrices. The condition is not satisfied by every target.

### Mechanism and retained structure

Coarse-grid restriction sends each consecutive block of `k` singular values to
its sum and preserves the total cost. A direct sum gives the reverse bound,
so `kappa(F^[k])=k*kappa(F)`.

For a factor at `k` copies, first double it. Its ordered squared singular
spectrum duplicates every entry. Coarse-graining this order-`2nk` hive in blocks
of `k` gives an order-`2n` point for `k*F^[2]`. At zero deficit, division by `k`
lands on the two-copy optimum. Each pair of adjacent coarse blocks has the
same mean. Ordering forces every fine entry in those two blocks to equal
that mean. The pairs align with doubled original entries, including for odd
`k`; no fractional interpolation or coprimality argument is used.

For nonzero deficit, an ordered block pair obeys
`sum |x_i-c| <= 3 (|A-kc|+|B-kc|)`, where `A,B` are its two sums.
Coordinate duals on the two-copy optimum face give a global seed error bound
with constant `L`. The doubled/coarse point has deficit `2*epsilon/k`;
rescaling and dividing by the duplicated count give `K=3L`.
The copy count remains explicit until this cancellation; no dimension-dependent
term is discarded.

### Effective finite test

For an **explicit ordered rational spectrum**, one compact order-`n` hive LP
computes the value. On the order-`2n` face at twice that value, `4n` further LPs
minimize and maximize the `2n` coordinates. Collapsed intervals certify uniqueness;
the cost-row dual multipliers give a finite stability constant. A noncollapsed
interval gives two optimal spectra witnessing failure of the criterion.

Each LP has `O(n^2)` variables and constraints. Standard exact rational LP theory
therefore yields polynomial **bit** complexity for this test and some nonsharp
constant. This is not a strongly polynomial claim, a performance guarantee for
the discovery implementation, or a claim about rational matrices with arbitrary
irrational eigenvalues. Classical LP duality and bit-complexity results remain
external dependencies.

## Concrete family and exact controls

For `F=diag(5,5,5,5,-4,-4,-4,-4,-4)`, the base value `29` is prior work.
The new two-copy coordinate certificates fix
`v=(8^2,6^2,5^4,4^2,1^2,0^6)` at cost `58`, where exponents denote multiplicities.
The criterion then gives, for **every integer k>=1**, all optimum spectra

```text
(8^k,6^k,5^(2k),4^k,1^k,0^(3k)), cost=29k, rank=6k.
```

The dual cost-row coefficients sum to `L=833/90`, yielding a valid nonsharp
constant `K=833/30`. A rank deficit of `m` implies cost deficit at least
`30m/833`. This closes the old interval `17t+1 <= r_*(G_t) <= 18t` to exact
rank `18t` at `G_t=F^[3t]`. The complete intermediate rank-cost curve remains open.

The [portable exact replay](../checks/two-copy-rigidity/verify.py) reconstructs
integer rows and checks the base cost, all 36 seed coordinate primal/dual
identities, and the exact multiplier sum. It requires only Python's standard
library and explicitly refuses optimized Python, which would disable assertions.
[Package notes](../checks/two-copy-rigidity/README.txt) specify conventions and scope.

As a finite negative example, at `H=diag(6,5,4,0,-7,-8)`, two optimal spectra
for `H^[2]` at cost `40` are

```text
(8,8,7,7,4,4,1,1,0,0,0,0)
(9,8,7,7,4,4,1,0,0,0,0,0).
```

The portable package checks both feasible hives and a global cost dual.
This example was added after the targeted proof audit; it is part of the new
full-manuscript assessment, not retrospectively attributed to the earlier audit.
It illustrates the criterion's negative branch, not a new classification of
that whole optimum face.

## Audit, reproducibility and publication boundary

The single targeted audit535/536/537 found no material mathematical objection
within its declared Horn/hive/LP dependencies. It checked 37 exact certificates,
used a separate geometric rhombus construction, and inspected the universal
arguments. Its 54-file preserved C/D archive has manifest SHA-256
`a27f573df66ff1f2b4ce73711f54c93e65bfc85411f515a1354368650bf8b40c`.
It assigned **no score** and did not certify priority or the complete manuscript.
Requested Astra xhigh configuration, shared files, reused context and absence
of independent runtime/independence attestation are declared.

The subsequent complete review uses a new conversation without development
history or earlier referee reports supplied. It still shares the filesystem;
this does not establish statistical independence or human peer review.
The exact seven-page input PDF is SHA-256
`335971ebdcf0a209f0bd6caa77128771d79eb7d81f10d87138748fbfe8b44fba`.
No result from that review is assumed here, and no grade transfers from the
proof audit or any earlier paper.

The seed-only Research Capsule fingerprint is
`3dcc7d7d543b9da8cc28585b86de491eddcefb37d0148a304f1fc55aa96b94fe`.
Its ten artifact hashes verify, but overall readiness is **attention** because
background graph references and Lean-name candidates remain unaudited. It is
not presented as a release-ready campaign or a formal proof. The later finite
nonrigidity witness is outside that recorded seed replay and is checked by
the portable package separately.

Raw exploratory rank-cap controls at `k=1,2,3,4,5,6,8` were preserved. The
`k=10` run hit its five-second limit and is terminal/inconclusive, not a
counterexample or infeasibility certificate. Passing finite screens supply
none of the universal quantifiers above. No timed-out search was restarted
to improve a score.

## Layers and falsifiers

- **Literature:** real Horn/hive realization, classical exact LP and the prior
  coarse-grid mechanism; selected source scope is explicit.
- **Audited own argument:** the two-copy criterion and quantitative transfer,
  with finite rational witnesses. This is not a Lean `formal` promotion.
- **Graph inference:** operator/spectral proximity supplies a dictionary only.
- **Speculative/open:** a sharp stability constant, the complete intermediate
  rank-cost curve, broader families and applications beyond this spectral problem.

A valid two-copy alternative optimum defeats the uniqueness condition for that
target; it does not refute the conditional criterion. A genuine falsifier of the
transfer would require an error in the hive boundary/coarse-grid dictionary,
or an amplified alternative optimum despite valid two-copy uniqueness.
Do not erase the final singular coordinate, turn spectral control into fixed-basis
matrix control, or claim a theorem for general padding from this result.
