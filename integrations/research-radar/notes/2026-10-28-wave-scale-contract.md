# Scale contracts in the fixed-fiber comparison

28 October 2026. Literature source: OpenAI/math at
7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a, wave PDF SHA256
9ca156c552f2d940528f7131716326ef0d67a5829e723e1d294d74560c8636ff.
New text pages18-21 were read; no new visual verification or whole-proof
audit is claimed. Canonical analysis/PDE context was retrieved first.

## Literature: the order of choices supplies uniformity

Section5 uses a broad spatial averaging kernel with a fixed large D to
control derivatives of its positive density proxy P*. Its product-rule
error can then be absorbed into the positive defining Hessian. Rank one of
the background makes the determinant comparison give a lower comparison
potential and hence an upper bound on u/r. The opposite comparison, on
radius-h interior balls, uses the ceiling mu^(1/(n-1))<=lambda to bound
the determinant of a small quadratic from above. Multiplying the resulting
depth by the density produces exponent1+1/(n-1), hence the critical wave
power2n/(n-1). These are linked source estimates, not free rank bookkeeping.

Wall Gaussian decay and interior inverse-multiplier growth have different
exponents. The source chooses a sufficiently small fixed aperture gamma
so that C3 gamma^2<c0/2, then fixes K large enough for ball containment and
the density ceiling, and only then takes h<1/(4K). Constants may depend
on gamma and K. Polynomial losses in s/h are absorbed by the remaining
strictly decaying exponential. This does not provide uniformity as arbitrary
gamma, K or the background geometry vary.

## Own bounded inference: changing the inner radius is not cost-free

For the model upper-bound potential V(s)=C s^-2 exp(-c s/h), C,c>0,
the weighted integral in condition6.1 is
I=C integral_[b/h,3/h] log(t/(b/h)) exp(-ct) dt/t.
At a fixed B=b/h>0, log(t/B)<=t/B gives
I<=C exp(-cB)/(cB). Thus the original choice b=2Kh has an h-uniform
bound. The additional supremum condition on [1/2,3/2] is at most4C.

In contrast, if0<b<h<=3, restricting the integral to [b,h] gives
I>=C exp(-c) (log(h/b))^2/2. Therefore this chosen model potential cannot
be assigned an h-uniform condition6.1 constant along b/h tending to zero.
This rejects an unchanged application of that scalar comparison contract;
it does not show the actual wave energy lacks a better potential or refute
the source theorem. The elementary logarithmic primitive was checked exactly.

## A second rejected shortcut: temporal bandwidth alone

The already sourced Remark6.2 scalar obstruction is
E(T,s)=(1-cos T)p(s)+L(s)-g(s). Its temporal frequencies are only0,+1,-1;
symbolically E_TTT+E_T=0. Thus adding temporal band limitation, evenness
or periodicity alone to scalar nonnegativity/superharmonicity cannot exclude
that counterexample or supply a one-log argument. This is an immediate
inference from an existing example, not a new counterexample or paper.
The actual nonlinear wave energy has not been shown bandlimited here.

## Heuristic, speculative and formal boundaries

Dictionary: the inner radius in wavelengths B controls the weighted
potential cost; angular aperture controls separation between wall decay
and interior recovery. Preserved in these calculations are scalar scaling
and the source example's temporal spectrum. Lost are realizability by a
wave current, determinant solvability, nonlinear energy constraints and
the remaining global PDE proof.

A proposed improvement must state which additional realizability identity
excludes the scalar example and preserve the order of parameter choices.
Abandon any proof using only the scalar assumptions plus temporal bandwidth,
or letting b/h tend to zero while retaining an h-uniform comparison
constant for this potential. Neither test rules out a different, proved transfer method.
Formal result added: none; no new score, manuscript or confidence promotion.

The selected Section5 argument is now read, but external elliptic regularity
and Fourier multiplier/proof dependencies have not been independently
certified. AppendixB beyond its first-page statements remains unread.


# A bounded look at periodic Dirichlet solvability

28 October 2026. Pinned wave manuscript commit
7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a; PDF SHA256
9ca156c552f2d940528f7131716326ef0d67a5829e723e1d294d74560c8636ff.
New text reading: pp39-40, continuing the A.1 statement on p38 and
its concluding parameter argument on p41 read in the previous round.
This is selected proof reading, not certification of the theorem or its
external elliptic regularity references. No foreign PDF/page text retained.
A small canonical analysis/PDE subgraph was retrieved before this synthesis.

**Literature.** The source lifts three-slot fibers by adding periodic fourth
coordinates, solves on the compact quotient with boundary, and uses
uniqueness to descend. Its continuity path retains a strict determinant gap
above the background. Comparison barriers give boundary normal gradient
control; differentiated concavity reduces upper Hessian estimates to the
boundary. A quaternionic rigid-motion construction controls mixed
derivatives; positivity on the compressed normal complement then recovers
the remaining normal derivative by the determinant Schur formula.

The subsequent C2,alpha and smoothness step invokes interior and boundary
fully nonlinear regularity and Schauder theory. Those external theorem
hypotheses and their exact compatibility with the source's cutoff extension
have not been independently checked here. This is a pending proof obligation
for our audit, not an identified counterexample or assertion of a source gap.

**Exact finite check.** Let nu be a unit quaternionic normal, and v a real
tangent vector, so Re(nu* v)=0. The source uses
A=v nu* - nu v* - nu(nu* v)nu*. The identities A*=-A and A nu=v follow
from nu*nu=1 and v*nu+nu*v=0. In quaternionic dimension2, normalized
nu=(1,0), an exact symbolic calculation with all seven free real tangent
coordinates verifies both identities in the complex2x2 quaternion
representation. This checks a source algebra step, not the maximum
principle, boundary regularity, PDE solvability or a new mathematical result.
No Lean proof, model grade or independent referee is attached.

**Heuristic dictionary.** A skew-Hermitian matrix supplies the infinitesimal
quaternionic unitary motion; its normal image matches the boundary-shape
derivative. The finite model preserves this local algebra and loses moving
domain estimates, global identifications and uniform analytic constants.

**Speculative extension test.** A future geometric transfer needs a compatible
rotation/covariance calculus, positive spatial defining Hessian and determinant
gap, compressed boundary lower bounds, and uniform regularity/barriers at the
claimed scales. Reject an unchanged mixed-derivative argument if its proposed
motion cannot both preserve the operator and match the required normal image.
Even passing this algebra test supplies none of the remaining estimates.
No extension or hypothesis removal is claimed in this round.

Next scientific step: inspect Section5's wavelength-uniform barriers and
the cited regularity hypotheses before treating A.1 as a verified transfer
engine. The rest of AppendixB remains unaudited. Do not turn this check into
a standalone paper, new AIRR grade or canonical formal-confidence promotion.

**Inventory.** Fifteen directed primary endpoints were refreshed, all HTTP200.
OpenAI and DeepMind heads match the previous round. This is inventory
coverage, not fifteen new proof readings or an exhaustive literature search.
The A.1 proof synthesis is archived for a later checked batch; existing PR164
must be reconciled first, without a duplicate card or pull request.

Integration update: PR164 has merged and its22files were verified byte-exact; all three main workflows passed. The A.1 reading above is now included in this checked batch. [Exact scalar checks](../evidence/2026-10-28-wave-scale/EXACT1200.json), [quaternionic algebra](../evidence/2026-10-28-wave-scale/EXACT1199.json), [reading ledger](../evidence/2026-10-28-wave-scale/READING1200.json) and [new bibliographic lead on hold](../evidence/2026-10-28-wave-scale/LEAD1200.json) preserve their respective scopes. Archival helper scripts use the original local environment; no portable package or independent replay is claimed.
