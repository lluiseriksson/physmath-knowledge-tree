# Shared null directions in the wave determinant energy

Bounded reading, 28 October 2026. Source: OpenAI/math commit
7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a, wave PDF SHA256
9ca156c552f2d940528f7131716326ef0d67a5829e723e1d294d74560c8636ff.
New text pages read: 11–17; earlier pages 1–5 and 23. Text extraction does
not certify displayed formula typography, the full proof, or its formalization.
The radius-one analysis/PDE subgraph was retrieved before this synthesis.

## Literature: distinct hypotheses doing distinct work

The source's cofactor divergence identity and its boundary cancellation are
different steps. For zero boundary data u=r*rho, compression of the Hessian
of B0+theta*u to the full moving-wall normal's orthogonal complement equals
the compression of B+theta*rho*H(r). Zero boundary values alone do not make
that compression singular.

Lemma 4.1 supplies the missing geometric structure. The holomorphic fiber
map F=(W/w0,10Q) has invertible spatial Jacobian, while its full Jacobian
has one quaternionic null line. Since H(r)=4 J*J, that line annihilates
H(r), is orthogonal to G(r), and also annihilates H(|Phi|^2). The background
B=lambda H(|Phi|^2) consequently preserves the same null line. This makes
the compressed boundary Hessian singular and its normal cofactor zero.
This is the source's mechanism, not a new theorem of this project.

Proposition 4.2 additionally uses A:B=0 and positivity of the Schur remainder
Sigma. It balances the base Laplacian of determinant energy plus potential
mass against the lateral wave flux. The wall normal is the full moving
normal; replacing it with only a spatial fiber normal would discard terms.
The regularizing cofactor's own normal flux vanishes separately.

## Exact finite check, without formal promotion

In a real-symmetric 3x3 subcase take R=diag(0,1,1), B=diag(0,lambda,0),
normal nu=e2, and lambda,rho>0. For M=B+rho R,
nu^T adj(M) nu=0. Adding epsilon e1 e1^T with epsilon>0 gives exactly
epsilon*rho. SymPy 1.14.0 checks both polynomial identities in exact
arithmetic. This tests the common-null-line cancellation, not the PDE,
quaternionic calculus, or existence of a Dirichlet solution. No Lean proof
or independent computational reproduction is claimed.

## Heuristic and speculative boundary for extensions

Translation dictionary: a null direction of the full Jacobian maps to a
missing eigenvalue of the compressed boundary Hessian, hence to a zero
normal cofactor. A spatially invertible Jacobian still provides ellipticity
on each fiber. What is preserved is this finite algebraic cancellation;
what is lost in the toy is integrability, moving-domain geometry, the actual
conserved current, smooth parameter dependence and all uniform estimates.

A perturbed geometry must track BOTH the boundary cofactor remainder and
the interior current-background pairing A:B. Nonzero boundary flux alone
does not refute an extension: its sign may be favorable. Nor does preserving
one null direction establish the needed analytic estimates. Abandon a
proposed unchanged exact balance if its compressed normal cofactor is
nonzero without a replacement identity; abandon a claimed uniform estimate
if the added A:B or boundary terms cannot be bounded uniformly at its stated
scales. These are tests for a future proposal, not evidence for a new paper.

## Reading limits and next check

Theorem A.1 (Dirichlet solvability), later barrier arguments, the continuation
of Lemma 4.3, and Appendix B have not been read/audited in this round.
Before claiming a curved extension, check solvability and scale-uniform
barriers against the exact geometry. Before a new logarithmic improvement,
read Appendix B: the source already discusses angular regularity, and the
page23 scalar counterexample excludes a scalar-superharmonic-only shortcut.

No new manuscript, score, solved open problem or confidence upgrade follows.
This synthesis accompanies the earlier logarithm note and a precise reading-boundary source-card update.

## Directed source inventory delta

Eighteen primary endpoints returned HTTP200 in the recorded metadata sweep;
these were inventories, not eighteen proof readings. OpenAI's pinned head
was unchanged. DeepMind formal-conjectures advanced from c0c5380 to
5a2fb85045c86e4a184b15ce7531ba199a3c4580, adding the Erdős777 entry.
Its commit description refers to already known results from 1985/2015 and
external formal proofs at 8822f7dd; it is not evidence of a newly solved
mathematical problem. The entry's build/proof/dependency closure was not
replayed here. No corpus or evaluation tasks were imported.

Primary links:
- https://github.com/openai/math/tree/7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a
- https://github.com/google-deepmind/formal-conjectures/commit/5a2fb85045c86e4a184b15ce7531ba199a3c4580

## Later statement reading: 13:44 UTC round

**Literature.** Text pages38 and41 now supply the precise analytical contracts.
Theorem A.1 assumes a strictly positive defining quaternionic Hessian, a
positive-semidefinite background Hessian, and g>det H(B0), rather than just
g>0. It asserts unique smooth Dirichlet solvability and locally uniform
parameter dependence. Its proof on pp39-40 remains unread here. Local
uniformity in a finite parameter neighborhood does not itself prove bounds
uniform as the wavelength h tends to zero; the source assigns those bounds
to its comparison barriers. A full-rank perturbation changes the determinant
gap assumption as well as the boundary/current terms. The rank-one spatial
background in dimension n>=2 has zero determinant, explaining why positive
lambda*mu meets this particular gap requirement in the original setup.

Theorem B.1 assumes B>1/2+1/p at p=2n/(n-1). Its strong bound uses both
logarithmic frequency weight 1/p and logarithmic angular weight B. Its joint
weak spacetime bound needs only the angular logarithmic weight. An arbitrary
positive angular Sobolev exponent can replace that angular norm, with its
own constant. Proposition B.2 separates bounded angular degree M from
frequency N: its strong bound costs log(N)^(1/p)+log(M)^(2/p), while its
weak bound costs log(M)^(2/p). These are source statements, not results
established in this repository. Radial sharpness of 1/p is stated separately.
Do not turn a fixed-M bound into an unrestricted estimate or erase constants
depending on positive angular regularity. The rest of AppendixB is unread.

Pages52-53 apply the same fiber mechanism to an anisotropic cone patch.
The argument chooses a small fixed cap gamma so an inverse-multiplier
growth exponent is dominated by the wall's Gaussian decay exponent, then
fixes K. This is an order-of-choices condition, not a uniform assertion in
arbitrary gamma or arbitrary curvature. It remains selected source reading.

**Heuristic/speculative.** A candidate extension must preserve or replace the
Dirichlet gap, prove its scale-uniform barriers, and account for all signed
remainders. Failure of any one rejects that candidate's claimed transfer;
it does not refute the source's original theorem. No new extension is claimed.
**Formal result:** none. Exact finite matrix identities alone do not certify
the PDE or its advertised downstream consequences.

The [reading ledger](../evidence/2026-10-28-wave-mechanism/READING1198.json),
[matrix identities](../evidence/2026-10-28-wave-mechanism/EXACT1197.json),
[scalar check](../evidence/2026-10-28-wave-mechanism/EXACT1196.json) and
[directed inventory](../evidence/2026-10-28-wave-mechanism/SOURCES1198.json)
preserve the scope. Original own bytes, including the initial failed symbolic
helper, are retained in the evidence ZIP. Foreign source bodies are excluded.
