EXACT PROOF PACKAGE: TWO-COPY SPECTRAL RIGIDITY

Run from any working directory:
  python path/to/repro/verify.py

Requires Python3.10 or later, standard library only. No optimizer, NumPy,
SciPy, internet access or author-specific absolute path is needed for replay.
The verifier reconstructs all integer hive rows and uses fractions.Fraction.
It refuses failed identities rather than treating stored PASS flags as proof.
The nonrigidity target, displayed spectra and ranks are bound explicitly
to the manuscript rather than inferred only from the supplied data.
Python optimization mode (-O or -OO) is explicitly refused before any check.

Files:
  base-cost-certificate.json: one unrestricted order9 primal/dual, cost29.
  full-seed-certificates.json: both coordinate bounds for all18 coordinates
    at target(5^8,-4^10), cost58. There are36 complete certificates.
  nonrigidity-certificate.json: two distinct feasible optimal spectra at
    target(6^2,5^2,4^2,0^2,-7^2,-8^2), with a global cost40 dual.
  verify.py: portable integer-row and exact rational replay, including
    exact cost-multiplier sum833/90.

Convention: s is the squared singular spectrum for [D,D*]=F, cost=sum s.
For the earlier C convention, [C,C*]=2F and s=lambda(CC*)/2.
The full dimension of s is retained; its last entry is not fixed to zero.
The hive corner is fixed to zero to remove the additive gauge.

Finite arithmetic is distinct from the manuscript's universal proofs:
Horn/hive realization is classical. The all-copy quantifier uses symbolic
coarse-grid telescoping, doubling before restriction and ordered-block
inequalities, not an extrapolation from numerical experiments.
The polynomial-time claim is theoretical exact rational LP complexity for
an explicit rational ordered spectrum; this verifier is not an LP algorithm.

Provenance: discovery used the author's public hive_core.py from
arr-research/arr-research.github.io at commit
4d71fb73998fbc3ab18f44117305f24c326005a3, blob
74a74f3f2dab5b9301098dc61e08bbc0f87b21d5. A local copy differed only by
one additional final LF; frozen audit inputs preserve the actual bytes.
The portable replay reconstructs rows separately, following the audited
integer model. It has no dependency on the discovery module.

The parent cost29 is prior work. The finite nonrigidity witness illustrates
the criterion's negative branch; no separate discovery priority is claimed.
Sakar2012 is an earlier moment-polytope antecedent, cited in the manuscript.
No foreign full-text corpus, credential or private data is distributed here.

Exploration disclosure: numerical rank-cap solves k1,2,3,4,5,6,8 were retained;
k10 at n90 hit a five-second solver limit. That run is inconclusive.
Neither these screens nor their finite passing outcomes prove the universal
result. No search was restarted to improve a manuscript score.
The earlier seed-only research capsule is marked attention, not ready;
its scope and fingerprint are disclosed in the manuscript. This portable
package additionally includes the nonrigidity example outside that capsule.

Review disclosure: requested Astra xhigh targeted proof review535/536/537
used shared files and context. Runtime identity and reviewer independence
are not independently attested. This is not human peer review or a guarantee
of priority, importance, acceptance, or a manuscript grade.
