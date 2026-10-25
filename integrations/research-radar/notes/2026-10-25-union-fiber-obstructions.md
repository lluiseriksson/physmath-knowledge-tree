# Union fibers and two failed correlation shortcuts

The global quadratic union-entropy target remains open in this research log.
This checkpoint extends the hereditary deficit argument, then records why two
tempting upper-fiber shortcuts must not be used. No new paper, importance
score, worldwide-priority claim or formal graph promotion is made.

## Context and confidence

- Retrieved context: the probability/algebra nodes and their incident
  representation/stochastic bridges; research move `move.find_barrier`.
  Graph adjacency supplies no union-closed inequality.
- Dictionary: union is join; a principal ideal is the subfamily below a fixed
  member; a translation is the map x -> x union a when it preserves the family.
  Uniform input must remain distinct from conditional union output.
- `literature`: the entropy tools and primary-source scopes recorded in the
  [previous checkpoint](2026-10-25-union-entropy-structure.md).
- Derived proof: the ideal argument below has targeted audit519. The conditional
  implication involving F1 is separate and its universal premise is false.
- `heuristic`: earlier bounded screens passed. This is not a ready Research
  Capsule or evidence of universal validity; the later exact counterexamples
  remain authoritative.
- `speculative`: the weaker upper-entropy comparator E1 below and the general
  quadratic target Q. Neither follows from the refuted arithmetic condition.
- Formal result: none added. A minimal later Lean target is the integer-count
  counterexample, not a conjectural entropy theorem.

## Hereditary excess without ordinal domination

For finite union-closed F, let N=|F|>=2 and let d_F=ln(N)-H(U), where U is
the union of two independent uniform members. Let delta_N be the sharp
chain-reference deficit from the previous note, with delta_1=0.
Fix z in F and its proper nonempty principal ideal I={x in F:x subset z}.
Write M=|I|, K=N-M, w=M/N and E_F=d_F-delta_N.

The event U in I is exactly that both inputs lie in I; its mass is w^2 and
its conditional law is the iid-union law of I. Let rho be the conditional law
outside I. In a linear extension of that complement, a prefix of j outputs
can receive at most j^2 upper-upper pairs and 2Mj cross pairs. Consequently
rho majorizes

```text
bshift_j=(2M+2j-1)/(N^2-M^2),  j=1,...,K.
```

The complement is itself union-closed, but rho need not be its iid-union law.
Putting `B(w)=D(Ber(w^2)||Ber(w))`, the entropy chain rule gives

```text
d_F = B(w)+w^2*d_I+(1-w^2)*(ln(K)-H(rho)),
delta_N = B(w)+w^2*delta_M+(1-w^2)*(ln(K)-H(bshift)).
```

The second identity is the same partition of the N-member chain. Subtraction
therefore gives the exact nonnegative remainder

```text
E_F-w^2*E_I=(1-w^2)*(H(bshift)-H(rho))>=0.
```

Ordinal domination and uniform cross output are not needed. This transports
excess already present in I; it does not supply the missing frequency bound
or the complement's own iid deficit. In particular it does not prove Q.

Audit519 found the argument valid, asking that B be defined explicitly and
the complement/law distinction retained. Its manifest SHA256 is
`a1b54e17cd25d62242b1bf1ed6cdc4a368bd9d2316d7d2eb9dd9b2f22dd07bff`.
The frozen input is preserved. Requested configuration: GPT-6 Astra xhigh;
context, preparation and filesystem were shared; runtime and independence
were not independently attested. No grade was assigned.

## The upper comparator and its invalid stronger form

Partition a union-closed family into disjoint union-closed lower L and upper G,
with |L|=M, |G|=K, such that every translation by a member of L preserves G.
A coordinate absence/presence partition has these properties. Let r(y) be the
ordered union count inside G and f_a(y)=#{x in G:x union a=y}. The actual
upper counts are

```text
V1(y)=r(y)+2 sum_(a in L) f_a(y).
```

Replacing each cross output by uniform G gives the comparator
`V0(y)=r(y)+2M`. Both totals are K(K+2M). The claim E1 is that the entropy
of normalized V1 is at most that of normalized V0. E1 is not proved here.

The stronger claim that V1 always majorizes V0 is false. In bit notation take
L={0,31} and G={32,33,...,47,63}. The full family has 19 members on six
coordinates and is union-closed. Its upper counts are

```text
V1=(3,5,5,11,5,11,11,29,5,11,11,29,11,29,29,83,69),
V0=(5,7,7,13,7,13,13,31,7,13,13,31,13,31,31,85,37).
```

Both sum to357, but max(V1)=83<85=max(V0). Thus V1 does not majorize V0.
The entropy comparison E1 nevertheless holds in this example; this is not
its refutation. The bounded four-coordinate split screen missed this failure.

## The arithmetic fiber condition is also false

A proposed sufficient condition F1 was

```text
sum_(x:T_a(x)=y) r(x) <= |T_a^(-1)(y)|*r(y),
T_a(x)=x union a.
```

It passed the earlier bounded screens, including a raw five-coordinate run.
A structural construction refutes it on only 12 members on seven coordinates:

```text
G={35,39,43,47,63,76,77,78,79,95,111,127},   a=31.
```

G is union-closed and every x union31 stays in G. The fiber above127 is
{111,127}. Its ordered union counts are49 and45, so F1 would require
`49+45<=2*45`, or `94<=90`. This is an exact integer contradiction.

To see the mechanism, use disjoint two-element sets P,Q and three new elements
j,u,v. Put A=P union Q union{j}. The u-layer is every set containing P with
arbitrary Q, plus A; the v-layer interchanges P,Q. Attach u or v respectively,
and add the two sets (P union Q union{u,v}) and (A union{u,v}). Cross unions
produce the first top member unless an A-input is used. Their top counts
are49 and45. Translating by A identifies precisely these two top members.

F1 must be abandoned as a universal premise. The constructed example still
has H(V1)<H(V0), so it does not refute E1 or Q. The Jensen argument below is
only a conditional implication and cannot restore F1.

## What the conditional implication actually proves

If F1 held for a particular G and all translations used by L, Jensen would
give for every c>0

```text
sum_y (f_a(y)-1)*ln(r(y)+c)>=0.
```

Apply Jensen separately on each translation fiber. The convex tangent-plane
inequality for `J(V)=sum_y V(y)ln V(y)`, at `V0=r+2M`, would then imply
J(V1)>=J(V0), hence E1. It is the unproved premise, not this convex calculation,
that failed. Even E1 alone would still require a quantitative connection to
frequencies before implying Q.

L must be union-closed to identify V1 with the upper counts. Stability alone
is insufficient: L={1,2}, G={3} gives F={1,2,3}; pairs from L also reach G,
so actual upper mass is7 rather than the purported5. For vectors V0,V1
defined algebraically the conditional convex implication does not need that
counting interpretation. This distinction is retained in audit522.

Audit522 closed with the exact F1-refutation addendum525, directly checking
the member list, closure, translation and 94>90. It also certified the negative
entropy gaps in both counterexamples by integer products, not rounded signs.
It retained the lower-family closure correction above. The addendum manifest
SHA256 is
`158ba046fbc01f9d715310d873d7783947e777de50a617f54b0d322c64150e1f`.
The final audit manifest SHA256 is
`03581624039b5bf0407590dc5376d4a16cc6ba4fa7359444ef9b289d352b6f2f`.
Earlier inputs and the pre-addendum report are preserved. Requested Astra
xhigh, preparatory participation, reused context and shared filesystem are
declared; runtime and independence are not independently attested. No grade,
universal theorem or priority conclusion is inferred.

The separate raw root run on five coordinates reported 2,771,071 nontrivial
families and 238,342,563 translation fibers without finding F1's failure.
It used a NextClosure implementation and is not part of audit522's frozen
input or a ready Research Capsule. Its role is historical negative-search
evidence, not universal proof. The small seven-coordinate construction
supersedes any suggestion that the passing screen made F1 a theorem.

## Continuation gate

The [small exact control](../checks/union-fiber-obstructions.py) checks the
counterexamples and the bounded ideal-prefix identities. It does not certify
a large computational campaign, global novelty, or any conjectural inequality.
Preserve the refutations rather than search new random seeds to rehabilitate
F1. A direct global logarithmic-drift inequality is weaker, but renaming it
does not prove it; it needs its own proof or falsifier.
