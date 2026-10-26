# A coverage correction and a local entropy gate

Subsequent work: [the global family checkpoint](2026-10-26-global-entropy-families.md)
extends the local result to all pure two-qubit inputs for a specified rectangle
of channel pairs. The account below preserves the earlier local scope and
its verifier correction; it is not the current limit for that rectangle.

This is a research checkpoint, not another manuscript or assessment. The
canonical graph, confidence labels and Lean declarations are unchanged.
The retrieved neighborhood is `domain.quantum_information_theory` and its
channel/no-signalling and conditional-mutual-information interfaces. None of
those edges proves the inequality below.

The [dated source inventory](../checks/local558-sources.json) records hashes,
versions and reading scopes for a directed26October refresh of OpenAI/math,
DeepMind/formal-conjectures, Anthropic, arXiv, AIRR, ai.viXra and the first
page of the author's public repositories. Both frontier repository heads
were unchanged from the preceding observation. Inventory is not abstract,
statement or proof coverage; no exhaustive sweep is claimed.

## Literature boundary and a retired target

[Tang, Zhu, Bai and Wang, arXiv:2609.28592v1](https://arxiv.org/html/2609.28592v1)
state strong convex-roof superadditivity against arbitrary finite-dimensional
partners for qubit channels admitting a pure output (Corollary5.1), including
every qubit-to-qubit channel of Kraus rank at most two (Corollary5.3).
The selected statements, the short corollary proofs and part of Lemma5.2 were
read; the triangular entropy theorem and its entire dependency chain were
not freshly audited here.

The previous anisotropic partner had Kraus matrices
`K0=diag(4/5,12/13)` and `K1=[[0,5/13],[3/5,0]]`.
Its input `(5 sqrt(5),13)/sqrt(294)` produces the pure state
`[[5,3 sqrt(5)],[3 sqrt(5),9]]/14`. Thus the cited result already covers
that fixed-pair target, after exchanging the channels. This coverage was
missed when selecting it. Its numerical run556 is retained as a known-case
control; its proposed Hessian novelty route is abandoned, not restarted.

## The new fixed-pair reduction

Use the axial Bloch maps `N=(c,r,t)=(3/5,1/4,1/5)` and
`Q=(11/20,1/5,1/10)`, acting by `(x,y,z) -> (cx,cy,rz+t)`.
Both have positive-definite Choi matrices, a negative partial-transpose
principal minor, nonzero translation and no pure output. Their squared
transverse contractions exceed `r`, violating the structural `c^2<=r`
restriction of the positive axial Davies semigroup class. This is not a
cited sufficient Holevo-additivity theorem; the later
[source correction](2026-10-26-entropy-review-and-obstructions.md) records
the precise equations and limits of this comparison.

For either channel set `A=c^2-r^2`, `z0=rt/A` and
`q(z)=c^2(1-z^2)+(rz+t)^2=Qmax-A(z-z0)^2`.
The maxima are `243/595` for N and `13189/42000` for Q, both below1.
The one-use entropy roof is `e(z)=h2((1+sqrt(q(z)))/2)`:
convexity follows from the displayed second derivative in the
[working proof](../checks/local558-proof.txt), and a same-latitude pure-state
ensemble attains Jensen's bound. This reconstructs classical axial-roof
structure, with [Hellmund and Uhlmann](https://arxiv.org/abs/0903.1340)
as an antecedent, rather than claiming a new one-use roof.

Every transverse Schmidt perturbation of a product can, by covariance, be
written `psi(eps)=sqrt(1-eps^2)|ab>+eps exp(i theta)|a_perp b_perp>`
with real local kets at Bloch latitudes z,w. Let

```text
G(eps) = S((N tensor Q)(psi(eps)))
         - hatS_N(rho_A(eps)) - hatS_Q(rho_B(eps)).
```

The working claim is that the coefficient of `eps^2` in G is at least
`27/200` nats, or `27/(200 ln2)` bits, uniformly in z,w and theta.
Consequently a uniform but unspecified pure-state neighborhood `|eps|<=eps0`
satisfies `G(eps)>=0` for these Schmidt perturbations. This does not assert
a neighborhood of arbitrary mixed product states.
No explicit eps0, global entangled-input bound, arbitrary-partner
theorem, Holevo additivity or capacity formula is established.

[Ruskai and Yard, Local Additivity Revisited](https://arxiv.org/abs/2111.11385v4)
is relevant prior work on local output-entropy additivity and relative
entropy. The auditor inspected selected statements in v1; the coordinator
read the latest v4 abstract and version history, not its full proof.
No implication from that work to this precise all-orientation roof-subtracted
bound has been established in this checkpoint. Worldwide originality is
unverified, and the local result is retained as a tool rather than a paper.

## Mechanism and arithmetic certificate

At the product output `T0=A0 tensor B0`, put `L=N(a a_perp*)` and
`M=Q(b b_perp*)`. The entropy Hessian contains the divided differences
`Fij=(ln lambda_i-ln lambda_j)/(lambda_i-lambda_j)`, with `Fij=1/lambda_i`
whenever the two eigenvalues coincide, including off-diagonal indices.
The logarithmic-mean bound `Fij<=1/sqrt(lambda_i lambda_j)` and
the triangle inequality control the coherence term by `4 g_N(z) g_Q(w)`,
where `g_N=||A0^(-1/4)L A0^(-1/4)||_HS^2`.
After subtracting the exact marginal roofs the two local terms simplify to
`2c_N^2 f(s_N)+2c_Q^2 f(s_Q)`, with `f(s)=atanh(s)/s>=1`.

For either channel the weighted norm is explicitly

```text
d=(1-q)/4,
h=[c^2(1+z^2)+r^2(1-z^2)]/2,
ell2=(1-z^2)[(c^2-r^2)z-rt]^2/(4q),
g=h/sqrt(d)+ell2(1/d-2/sqrt(d)).
```

The [exact rational certificate](../checks/local558-interval-certificate.json)
has11 cells for N and9 for Q. The
[verifier](../checks/local558-interval.py) rechecks full coverage of[-1,1],
each rational upper bound, and squared binary rational enclosures of the
square roots. It requires exactly the two named channels, parameters and
targets. Thus `g_N<=17/20`, `g_Q<=7/10`, giving
`2[(3/5)^2+(11/20)^2]-2(17/20)(7/10)=27/200`.
Run the verifier with `verify` as its argument. It verifies the arithmetic
bounds, not the analytical reduction linking them to entropy.

The original558 verifier recomputed the listed cases but did not bind their
identities to its hard-coded margin. That integrity gap is preserved in the
private dossier and corrected in559; seven changed-case mutations were
rejected. The concrete original certificate itself had the intended cases.
Finite calibrations used961 orientation pairs and12 symmetric finite-
difference comparisons. They are diagnostics, not the uniform proof or a
ready computational Research Capsule. No optimizer or historical restart
was used for this local calculation.

## Audit and hypothesis-reduction boundary

A single requested GPT-6 Astra xhigh audit of the analytical chain and
certificate is complete. It found no remaining material objection to the
precise local claim after the degeneracy/scope clarifications and559 fix.
It reimplemented the20-cell check with80-bit rational root enclosures,
recomputed all961 stored coefficients, checked32 additional complex cases,
and rejected16 changed-input mutations. It also derived the uniform output
floor `121/160000`; the numerical tests remain diagnostics.

The coordinator read the full report and verified all32 C:/D: artifact
copies. The report SHA256 is
`b52c33b687a90f8249d4c46ef92ff10166b695dc8f695ebbd3e2838bcc5184a7`,
and the verdict SHA256 is
`a97382a607fe8022174535ec01dfc1f77d209704e660da7646bccedee5288c75`.
The audit shares the filesystem; effective model identity, runtime isolation
and independence are not independently attested. An accidental search extract
exposed grades of another AIRR manuscript; the reviewer documented that
exposure and did not use those evaluations as evidence. No score was requested
or assigned to this local stepping stone, and priority remains unverified.

- Literature: the cited pure-output coverage and classical axial-roof
  structure, with the reading scopes above.
- Own written analytical result: the fixed-pair uniform local entropy bound,
  supported by the limited audit above. It is not labelled `formal`.
- Exact finite arithmetic: the rational weighted-norm certificate, subject
  to its explicit analytical proof obligations.
- Heuristic: controlling the entropy Hessian may help isolate the global
  obstruction. Speculative: a global bound for these channels or a larger
  class. Neither follows from positivity near product states.

The dictionary maps transverse Schmidt coherence to the off-diagonal
entropy Hessian and maps each marginal roof to its latitude function.
It retains channel parameters and Schmidt phase, but discards higher-order
terms. The eliminated hypothesis is an unspecified *local* Hessian sign
for this fixed pair; the missing *global* inequality remains external.
Falsifiers are an error in the entropy/roof reduction, a failed interval
enclosure, a negative local coefficient, or an antecedent covering the
proposed consequence. Abandon novelty claims if that antecedent is found.
The next useful target is a bound on the remaining entanglement interval,
not another product grid or a separately rated local-lemma paper.
An eventual minimal Lean target would be the rational interval-cover
arithmetic; no such formalization has been added.
