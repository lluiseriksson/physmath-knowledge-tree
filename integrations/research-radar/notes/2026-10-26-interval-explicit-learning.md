# Explicit optical gain: interval reduction and unscored component audit

Observed26October2026. This is a research component of the same optical
paper, not a separate manuscript or a new grade. Public v3 and its actual
importance4.5/technical8.5 assessment remain unchanged. The earlier
[uncertified witness](2026-10-26-frontier-update-and-learning-witness.md)
and all original estimates remain preserved.

## What is now checked

The [working analytic reduction](../evidence/2026-10-26-interval777/ANALYTIC780.md)
uses the sufficient radial statistic T=|Y-2sqrt(z)|^2/2 for the binary flag
of the matched-reset model k=r=1,lambda=1/2. Its two conditional densities
share the entire0F1 factor, removing a square-root branch from the integration
oracle. Known shifted-Gaussian/Poisson-Gamma identities supply the mechanism;
this is not a new general information principle.

The proof specifies a holomorphic strip, an explicit broad-box bound M,
analytic flags for every logarithm, a finite t cutoff200 and z cutoff20,
and nonnegative tail enclosures. The [core oracle](../evidence/2026-10-26-interval777/interval778.py)
and [calculation](../evidence/2026-10-26-interval777/certificate779.py)
produce [enclosures at128 and160bits](../evidence/2026-10-26-interval777/CERTIFICATE779.json).
These use the documented [python-flint analytic callback contract](https://python-flint.readthedocs.io/en/latest/acb.html),
not just agreement of floating-point quadratures. The library is trusted;
its kernel was not independently audited or formalized here.

The moment-annihilating three-annulus perturbation has exact determinant
coefficients and epsilon=1/200. The checked comparisons, in nats, are:

| Quantity | Verified enclosing comparison |
|---|---|
| Gaussian W1 information G1 | .17825<G1<.17826 |
| Perturbation correlation a0 | .0078<a0<.0079 |
| Squared L2 norm N | .737<N<.739 |
| AWGN C2 for b^2=9757/50000 | .178263333<C2<.178263334 |
| Feasible W1 lower expression | G1+epsilon*a0-epsilon^2*N>.178270525 |

Thus G1<C2<C1, using a feasible W1 rate below its unknown capacity C1.
The AWGN gain is now explicitly specified instead of defined through C1.
With the existing v3 compactness/continuity and common-code comparison,
this gives the qualitative strict resource separation for that explicit
two-law family. The hypothesis removed is the implicit capacity-matching
parameter, not the model's high-signal/high-noise scaling or cost conditions.

## Audit and retained contrary diagnostics

The [full component report781](../evidence/2026-10-26-interval777/audit781-report.txt)
and [verdict](../evidence/2026-10-26-interval777/audit781-verdict.json)
support the reduction, oracle, tails and stated conditional consequence.
The [context](../evidence/2026-10-26-interval777/audit781-context.json)
declares reused745 reviewer history, parent input and shared filesystem.
Requested Astra xhigh identity/effort and independence are not attested.
This is unscored AI assistance; it is neither another whole-manuscript
assessment nor an independent human review or a new vote for public v3.

The reviewer reproduced the exact128/160bit run and its comparisons.
The [original diagnostic](../evidence/2026-10-26-interval777/audit781-CONTROLS781.json),
[refinement](../evidence/2026-10-26-interval777/audit781-CONTROL_FOLLOWUP781.json),
[exact replay](../evidence/2026-10-26-interval777/audit781-replica-CERTIFICATE779.json)
and their code/logs are also published as own evidence.
A nonrigorous Cartesian control at256 nodes disagreed at z=20; refinement
through384-1024 nodes approached the Arb value. All attempts remain in the
private audit inventory; this convergence is a diagnostic, not the enclosure
proof. The [selected native audit archive](../evidence/2026-10-26-interval777/original781-selected.zip)
and [input archive](../evidence/2026-10-26-interval777/original780.zip)
retain original byte streams; [provenance](../evidence/2026-10-26-interval777/BYTE-PROVENANCE784.json)
distinguishes them from public LF renditions. No contrary report is removed.

## Bounds still missing

The numerical common-input gap Delta=C2-V is not computed. In particular,
a single-law improvement is not a lower bound on Delta. The energy threshold
E>(6+log2)/Delta remains existential. No unrestricted Gaussian-protocol
statement, fixed-noise conclusion, general resource principle, worldwide
priority, paper importance improvement or completed goal>7 is asserted.
This component alone is not a reason to split off another paper.

Next finite target: a rigorous upper certificate for the common-input
optimum, or a physically broader family with a quantitatively useful gap.
Falsify the interval result if M fails to enclose the analytic extension,
if branch checks or tails are omitted, or if the rate enclosures overlap.
Abandon a standalone novelty claim that only restates existing minimax/training.

The [directed refresh776](../evidence/2026-10-26-interval777/SOURCES776.json)
again covers13 primary endpoints with dates/hashes, all200. OpenAI and
DeepMind pins are unchanged from the last checkpoint; metadata coverage is
not new abstract, theorem or proof reading. The small qinfo subgraph is
retrieved context only. The research radar gains one explicit candidate;
canonical graph nodes, edges, confidence labels and graph routes are unchanged.
Formal:none for this component; literature:scoped mechanisms and tool contract;
heuristic:working derivation supported by an unscored model audit;
speculative:downstream numerical gap, broader impact and novelty.
The packet is not presented as a ready Research Capsule.
