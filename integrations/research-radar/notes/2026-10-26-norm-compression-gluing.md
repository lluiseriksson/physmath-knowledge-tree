# A rejected convexity shortcut and a chordal compression candidate

26 October 2026 local time; source observations are timestamped in UTC.
This is research evidence and a written conditional argument, not a new
manuscript, score, independent review or priority certificate.

[Primary-source observations](../checks/norm546-sources.json) preserve versions,
UTC dates, content hashes and reading levels. Full source snapshots remain private.

## Directed reading and the actual gap

[Fang, 2609.14621v2](https://arxiv.org/html/2609.14621v2), Theorem 3 and Appendix A
Lemma 5, proves triangular Schatten compression using joint convexity of a
three-argument trace-power difference. Its displayed proof was read; its full
dependency chain was not audited here. Adding the missing noise term to the
non-Davies [test channel](2026-10-25-frontier-refresh-and-phasecov-gate.md)
requires a different block pattern, not a substitution into that theorem.

Audenaert's [math/0702186v2](https://arxiv.org/html/math/0702186v2) conjecture and
special cases, and Zhang's [2410.21961v4](https://arxiv.org/html/2410.21961v4),
Conjecture 1.14 and Theorem 1.15, were read at statement level. The latter gives
a rank-dependent estimate rather than the sharp constant-one comparison.
Those are not a proof of the required new channel inequality. No exhaustive
current open-status search or full proof audit is claimed.

## Exact rejection of the naive extension

For positive scalar or matrix arguments consider the proposed extension

```text
Z(P,Q,R,S) = [[P+Q, sqrt(Q)sqrt(R)],
             [sqrt(R)sqrt(Q), R+S]],
F_s = Tr(P^s+Q^s+R^s+S^s)-Tr Z^s.
```

The claim that this is jointly convex in `(P,R,S)` for fixed Q is false already
for scalars at `s=3/2`. Fix `P=Q=1`, take endpoints `R=S=1` and `R=S=3`, and
their midpoint `R=S=2`. The midpoint value minus the endpoint average lies
strictly between `19/100` and `1/5`, in the wrong direction for convexity.
The [rational interval verifier](../checks/convexity546-obstruction.py) encloses
every square root by integer arithmetic at 100 binary digits; its
[certificate](../checks/convexity546-obstruction.json) retains both rational
bounds. At order two the same gap is exactly two, an auxiliary control.

This rejects the four-variable proof shortcut. It does **not** contradict
Fang's original `S=0` lemma, the norm-compression conjecture, or channel
additivity. A separate new 24-start floating-point search of a stronger block
entropy inequality for the fixed test channel found no significant violation;
its best gap was about `4.9e-14` bits. Raw results are retained privately, not
treated as a global certificate or a ready Research Capsule.

## A different source connection: positivity rather than norm comparison

[Vuong and Osaka, 2610.11021v1](https://arxiv.org/html/2610.11021v1), Theorem 1.2,
states that a positive three-by-three block matrix has positive scalar
compression `(Tr |H_ij|^p)` for `1<=p<=2`. Proposition 5.1 states strict
two-dimensional matrix triangle defects for the associated metric outside
its admissible interval. These statements and the opening of the defect proof
were read; the full new source proofs remain external, unaudited dependencies.
Positivity of this compression is a different assertion from Audenaert's
constant-one norm comparison.

The following **working proposition** connects that three-block result with
classical chordal decomposition. Literature overlap, the complete argument
and scientific value still need audit before deciding on a paper.

For a finite simple graph G, let `P_p(G)` mean: for every finite positive block
matrix H, with zeros outside G's edges, `(Tr |H_ij|^p)` is positive semidefinite.
Zeros on allowed edges are permitted, block sizes are arbitrary, and traces
are unnormalized. The proposed classification for **chordal G**, relative to
the external results just stated, is:

- `p=2`: every graph, including nonchordal graphs.
- `1<=p<2`: precisely the graphs whose maximal cliques are single vertices, edges or triangles
  and meet each other in at most one vertex.
- `p>2`: precisely the forests.

This does not classify all nonchordal graphs or settle the channel target.

### Written argument and dependencies

Vertex gluing preserves `P_p` for `p>=1`. If two pieces meet only at v, order H
as `[[A,B,0],[B*,C,D],[0,D*,E]]`. Its positive generalized Schur complement
allows the leaf piece `[[A,B],[B*,B*A^+B]]`; the remaining piece has v diagonal
`C-B*A^+B` and is positive. The scalar compressions add correctly off v.
At v the remaining difference is
`Tr(C1+C2)^p-Tr C1^p-Tr C2^p>=0`, the classical trace superadditivity of
positive powers. Thus their sum plus a nonnegative diagonal correction is
positive. Singular blocks use the generalized Schur complement or continuity.

For an edge, the positive-block factorization `B=A^(1/2) K D^(1/2)` with
`||K||<=1` and Schatten Holder gives `||B||_p^2<=||A||_p||D||_p`.
Hence the two-block seed holds for all `p>=1`. It glues to forests. For
`1<=p<=2`, the external three-block theorem supplies the triangle seed and
glues to the second class above. Unequal block sizes can be zero-padded.
Chordal clique-tree structure is classical; the selected structural theorem
in [Guillot, Khare and Rajaratnam, 1504.04069v2](https://arxiv.org/html/1504.04069v2)
was read. Their scalar graph critical-exponent theory is a direct antecedent,
not claimed as new here.

For necessity below two, the Gram matrix of columns `(1,0),(0,1),(1,1),(1,-1)`
has C4 support. For `w=(-2,-2,1,1)`, its compression has quadratic value
`2^(p+1)-8<0` when `p<2`. Any chordal graph outside the stated clique class
contains a C4 as a non-induced subgraph: a clique of size four or two cliques
sharing an edge suffices. Embedding the witness proves failure.

At order two, factor `H_ij=X_i*X_j`. The compressed entries are
`Tr(X_i X_i* X_j X_j*)`, a Hilbert--Schmidt Gram matrix with no graph restriction.

For `p>2`, set `t=2/p` and use the external Proposition 5.1 triangle defect
for matrices A_i. The positive block Gram with `X_i=A_i^(1/(2p))` has compressed
entries `Q_t(A_i,A_j)` and diagonal `Tr A_i`. If that compression were positive,
its Gram vectors would realize `d_t(A_i,A_j)` as Euclidean distances divided
by `sqrt(2)`, contradicting the defect. Thus a triangle fails for every such p.
A chordal nonforest contains a triangle; forests were already handled.

As an independent finite order-four control, take
`P1=|0><0|`, `P2=|+><+|`, `P3=I+(sigma_x+sigma_z)/10` and the positive Gram
`H_ij=sqrt(P_i)sqrt(P_j)`. Its compression equals `Tr(P_i P_j)^2` entrywise.
The rational vector `(-121/125,-121/125,1)` has quadratic value `-318/3125`.
The [exact finite controls](../checks/graph548-controls.py) check this and the
C4 witness; [their output](../checks/graph548-controls.json) does not certify
the universal classification or external source proofs.

## Layers, falsifiers and next gate

Two quantum-information graph nodes and their connecting recovery edge were
retrieved before this synthesis. They supply vocabulary, not a compression
theorem; canonical graph confidence and Lean declarations remain unchanged.

- Literature: the cited triangular, three-block and metric statements,
  classical chordal structure, Schur complements and trace inequalities.
- Own written conditional argument: cut-vertex gluing and the displayed
  chordal classification, awaiting audit and overlap checks.
- Exact finite result: the failed convexity extension and two rational
  obstruction controls. They do not constitute a formal Lean proof.
- Heuristic: sparse overlap patterns may offer a more useful route than the
  failed extra-noise convexity argument. Speculative: a nonchordal extension
  or a genuinely sharp channel norm/entropy comparison.

The dictionary maps graph vertices to block labels and a cut vertex to a
single shared diagonal block. It preserves positivity and trace-power
superadditivity; it loses validity when separators have multiple vertices
because off-diagonal corrections are then uncontrolled. A scalar positivity
compression must not be promoted to a bound on the full Schatten norm.
Falsifiers include a failed gluing step, a missing external hypothesis, a
previously covering theorem, or a positive block input contradicting the
classification. Audit those before writing or rating another manuscript.
