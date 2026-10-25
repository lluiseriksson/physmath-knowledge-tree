# Union entropy representation and the missing frequency estimate

This is a research gate, not a new paper or a resolution of Frankl's conjecture.
The canonical graph is unchanged. No assessment score or worldwide novelty is
claimed. All logarithms below are natural.

## Bridge card and evidence layers

- Context retrieved: `domain.probability_stochastics`, `domain.algebra` and their
  incident representation, stochastic and analysis bridges. The graph has no
  dedicated union-closed theorem node; adjacency supplies no proof.
- Research move: `move.find_barrier`.
- Dictionary: union becomes join in a finite semilattice; uniform samples become
  a distribution of joins; coordinate frequencies become sizes of separating
  principal ideals. Exact closure and sample uniformity must be retained.
- `literature`: the selected primary claims and dates below. Their full external
  computer-assisted proofs have not been reproduced in this checkpoint.
- Derived arguments: the elementary proofs below are supplied for inspection,
  with exact small combinatorial controls; no Lean formalization is claimed.
- `heuristic`: bounded larger examples have not refuted the quadratic candidate.
- `speculative`: the quadratic frequency estimate. One certified violating
  family falsifies it. Passing a finite census does not establish it.
- Formal result added to the graph: none. A minimal later formal target is the
  ideal-prefix counting lemma, not the full conjectural frequency bound.

## First preserve the actual frequency parameter

Let F be a finite union-closed family with N>=2. Deleting coordinates is allowed
only when the projection is injective on F. Such a projection commutes with
union, so it preserves the entire union table and its entropy, while its maximum
coordinate frequency may decrease. Constant coordinates must not make a
falsifier artificially easy.

The minimum possible maximum frequency among projections can be computed
without a subset search: retain all coordinates of frequency at most t and find
the first threshold t for which all projected sets remain distinct.

There is a standard semilattice interpretation. Write down(z)={x in F:x<=z}.
If z has a unique upper cover, every faithful binary join representation needs
the coordinate with zero class down(z). Indeed, a coordinate separating z from
that cover has a principal-ideal zero class containing z but not its cover;
uniqueness forces that ideal to be down(z). Conversely these coordinates
separate all elements. For x not<=y, choose z maximal subject to y<=z and
x not<=z. Then x join z is the least strict upper element of z, so z has a unique
upper cover and its zero class separates x from y. Thus the intrinsic bottleneck
is max_z[1-|down(z)|/N] over those meet-irreducibles. This is representation
bookkeeping in the known lattice framework, not a proof of Frankl's conjecture.

A replay of 200 bounded dual-Horn examples on 6--10 coordinates improved 54
representations, including examples previously excluded for constant-one
coordinates. All projections were checked for injectivity and union-table
preservation. No significant quadratic violation was found; the smallest ratio
was a Boolean equality case, with roundoff near 7e-16. These are exploratory
diagnostics, not an exhaustive census for those sizes or a ready Research Capsule.

## Sharp chain benchmark: what majorization does prove

Take s>=2 independent uniform samples and let q be the law of their union.
Choose any linear extension F_1,...,F_N of inclusion. Its first j members form
an order ideal. A union in that ideal requires every sample to belong to the
ideal; hence

    sum_{i<=j} q_i <= (j/N)^s.

The sum of the j smallest probabilities is no larger than this particular
prefix sum. Therefore q majorizes

    b_i = [i^s-(i-1)^s]/N^s,   i=1,...,N.

A chain attains b. Every Schur-concave entropy is consequently bounded above
by its chain value. Equality for Shannon entropy makes the sorted q equal to
b by strict Schur concavity. Each ideal-prefix sum is then at least the sum
of the corresponding smallest entries of b, so every prefix bound is an
equality. Every initial segment is therefore closed under union; its last
member must contain all previous ones, forcing a chain.

More explicitly, let S_j=j^s-N^s sum_{i<=j}q_i count the tuples that escape the
initial ideal. Summation by parts gives the exact identity

    H(b)-H(q) = D(q||b)
       + sum_{j=1}^{N-1} [S_j/N^s] log(b_{j+1}/b_j).

Both terms on the right are nonnegative. The escape term equals the expected
logarithmic increase from the largest input rank to the union rank. It is at
most H(b)+log(b_N)<=log s. Also log N-H(b)<=log s. Thus these two bounded terms
cannot supply a logarithmic-in-N frequency estimate for fixed s when its
frequency factor stays bounded away from zero. The missing
frequency-sensitive control would have to constrain D(q||b); merely renaming
that unknown lower bound is not a proof or a new research mechanism.

The [small control](../checks/union-entropy-gates.py) checks exact integer
majorization for pairs and triples, the chain equality criterion and the
projection/irreducible threshold on all eligible three-coordinate families.
Its numerical check of the entropy identity is separately floating point.
This records a derived proof spine without a worldwide priority assertion.

## Why every global subquadratic frequency weight fails

For integer r>=2, put m=r^2 and M=2^m. Take all subsets of an m-element base,
then append L=(r-1)M strictly increasing upper-chain sets, each containing the
entire base. The resulting family has N=rM members and

    p_max=1-1/(2r).

Base members S have ordered union multiplicity 3^|S|; the j-th appended member
has multiplicity 2(M+j)-1. Put w=M/N=1/r and Delta=log2-h(3/4).
The entropy deficit d=log N-H(X union Y) has base contribution
w^2[m Delta+log w]. Each upper-chain atom satisfies N Pr(U=z)<2, so its total
contribution is at most log2. Therefore

    0<=d<=Delta+log2<2log2.

But (1-p_max)^gamma log N=(2r)^(-gamma)(r^2 log2+log r) diverges for every
fixed gamma<2. No universal positive c can make
d>=c(1-p_max)^gamma log N valid in that range. This rejects our proposed
linear bridge analytically. It does not reject a bound conditioned on small
p_max, nor establish that the quadratic endpoint is true. The construction
builds on the familiar chain entropy obstruction; novelty is not certified.

## The unproved quadratic target

The surviving candidate is

    d >= kappa(1-p_max)^2 log N,
    kappa=4[log2-h(3/4)]/log2.

Boolean powersets attain equality. The candidate is stable under Cartesian
products if it holds for each factor, but this does not prove it for arbitrary
families. The four-coordinate census and the bounded generated examples are
not universal evidence. The next task is a closure-sensitive induction or
stability argument, or a structurally justified counterexample, rather than
additional undirected random seeds.

Conditional payoff, not an achieved bound: combining this candidate with the
external entropy reduction below gives

    y+m w0 kappa y^2 <= m,  y=1-p_max,
    m=2468459/4000000, w0=8102221/10000000.

Neither that implication nor its numerical root proves the missing hypothesis.
No new frequency theorem, manuscript or grade is claimed here.

## Primary sources and freshness gates

- [Jiang, 2609.08291v1](https://arxiv.org/abs/2609.08291v1), 8 September 2026:
  selected introduction, Proposition 3.1, method-ceiling argument and Section
  10.7 read. It states a 0.38288525 frequency bound and a finite-size coupling
  gain. The interval certificate and complete coupling proof were not audited.
- [Costa--Sadhu, 2610.02295v1](https://arxiv.org/abs/2610.02295v1), 1 October
  2026: abstract and version history read; an earlier Zenodo date of 7 September
  is reported. Its stated bound is 0.3828852549667978. Not a full proof audit.
- [Quas's chain example](https://mathoverflow.net/questions/437282/),
  26 December 2022: original question and answer read. Chains already rule out
  a uniform multiplicative entropy contraction independent of frequencies.
- [Poonen, Union-closed families](https://doi.org/10.1016/0097-3165(92)90068-6):
  abstract only; the lattice-equivalence framework is prior, not invented here.
- DeepMind formal-conjectures commit
  `49ba26bac3212084999860c575fcc70af42b3128`, file 6a.lean blob
  `cc2fa401f4ef6f3a648fdacbf6f91a8f5ac59714`: statement file read. Its question
  about exceeding 0.38272 is already overtaken by the later primary claims
  above. The file's `sorry` declarations are not Lean proofs of those claims.
  No upstream change has been submitted.

This is a directed sweep, not an exhaustive literature review. New preprint
claims and source freshness are distinguished from independent proof checking.
The note contains original synthesis and arguments, not a third-party corpus.
