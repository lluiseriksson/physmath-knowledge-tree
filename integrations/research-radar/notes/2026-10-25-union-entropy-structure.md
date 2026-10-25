# Union entropy conditional structure and finite size

This checkpoint separates a restricted theorem from the still unproved global
quadratic estimate. It also extracts a finite-size consequence of existing
entropy certificates. It is research knowledge, not a new manuscript, a model
score or a resolution of Frankl's conjecture. All logarithms are natural.

## Context and evidence

- Small subgraph retrieved: `domain.probability_stochastics`, `domain.algebra`
  and their incident representation/stochastic bridges; move `move.find_barrier`.
  These nodes supply context, not a union-closed theorem.
- Dictionary: union is the semilattice join; a level is an explicit measurable
  partition; absence probability is one minus inclusion frequency. Product
  reference laws must not be inferred from closure alone.
- `literature`: the stated primary-source results, with scopes below.
- Derived arguments: elementary proofs below; the layered and ordinal/product
  proofs have completed audits510 and513. No proof-assistant result is added.
- `heuristic`: bounded counting and numerical diagnostics, which do not prove
  universal inequalities. No ready Research Capsule is claimed.
- `speculative`: for every nontrivial finite union-closed family F,
  `Q(F): ln|F|-H(X union Y) >= kappa*(1-p)^2*ln|F|`, where X,Y are iid
  uniform, p is maximum coordinate frequency and
  `kappa=3 ln(3)/ln(2)-4`. One certified violating family falsifies Q.
- Formal graph promotion: none; the canonical graph remains unchanged.

## Why conditioning matters

Let B have m>=1 coordinates. Level zero is all subsets of B. At level j>=1,
take every old subset containing an arbitrary mask A_j, and attach the first
j of L distinct new marker coordinates. The masks need not be nested. Union
takes the larger input level and stays in that level's upper subcube.

Put M_j=2^(m-|A_j|), A_0 empty, N=sum M_j, w_j=M_j/N and a=1-p.
For independent input levels J,K let R=max(J,K), with law v. Write
`Delta=ln(2)-h(1/4)` and `B(w)=D(Ber(w^2)||Ber(w))`.
The relative entropy chain rule and data processing give

```text
ln(N)-H(X union Y)
  = D(v||w)+sum_j v_j D(law(U_old|R=j)||uniform level j)
  >= B(w_0)+Delta*E[m-|A_R|].
```

Indeed, conditional on both input levels, a free output coordinate has zero
probability either zero or 1/4. Mixing keeps it at most 1/4. Entropy
subadditivity is enough; output coordinates need not remain independent.
For each old coordinate i let f_i be its input probability of being free.
Free at both levels implies free at their maximum, even for nonnested masks.
Thus `E[m-|A_R|]>=sum_i f_i^2>=4ma^2`.

The elementary binary bound
`B(w)>=kappa*min(w,1/2)^2*ln(1/w)` completes the proof: a<=1/2, and for
L>=1 the first new marker gives a<=w_0. Since `w_0=2^m/N`, the two terms
supply `kappa*a^2*ln(N)`. L=0 is Boolean-cube equality.

For completeness, put `ell=-ln(w)` and
`A(w)=(w^(-2)-1)*ln(1+w)/ell`. Then

```text
w*(ln A)' = -2/(1-w^2)+w/((1+w)*ln(1+w))+1/ell < 0.
```

Use `ln(1+w)>w/(1+w)` and `ell>=tanh(ell)=(1-w^2)/(1+w^2)`.
On w<=1/2 this bounds `B/(w^2 ell)=A-1` by its value kappa at 1/2.
On w>=1/2, B is concave with endpoints (1/2,Delta),(1,0), whereas
`-ln(w)<=2 ln(2)*(1-w)`. Their chord bounds give the other branch.

Audit510 found no fatal objections to this exact restricted theorem. It read
the proof and controls, replayed 685 original cases, and added 157 family
controls plus 303 binary diagnostics at 110 digits. Those diagnostics do not
replace the proof. Requested configuration was GPT-6 Astra xhigh; runtime and
independence were not attested. Context and filesystem were shared, with
preparatory participation disclosed. No manuscript grade was assigned.
Frozen proof SHA256:
`96a67fce8231671a817d8fd30c8d2d0a176aef26d73a3246338acad78884fec1`.
Audit manifest SHA256:
`6255a555e99415b2061338a56bad2b20054891f1c8823959c0ce56d32ea8252c`.

This does not improve a universal frequency constant: every old coordinate
already has frequency at least 1/2 in the specified class.

## A failed replacement for the conditional argument

For `F={0,1,2,3,7}` in three bits the ordered union counts are `(1,3,3,9,9)`.
Input marginals are `(3/5,3/5,1/5)`, union marginals `(21/25,21/25,9/25)`.
Direct expansion gives

```text
25*(D(law U||uniform F)-sum_i D(law U_i||law X_i))
  = ln(5^50*3^24/(7^42*2^40)) < 0.
```

The sign is an integer comparison. Pairs (0,1), (0,2), (3,7) show that each
coordinate is essential. Removing redundant coordinates cannot repair this
global tensorization shortcut. Audit510 verified the calculation exactly.
This is not a counterexample to Q; it refutes an attempted proof step.

## Operations that preserve the quadratic target

The derivative argument for A actually works throughout (0,1). Its limiting
value at 1 gives the stronger global binary estimate
`B(w)>=(2 ln(2)-1)*w^2*ln(1/w)`.

Let F on B have N>=2 members and let G on a disjoint ground C have M>=1.
Both are union-closed; let e be a new marker. Form the tagged ordinal extension

```text
E = F union {B union {e} union T : T in G},    w=N/(N+M).
```

Cross unions equal their upper member. Old coordinates dominate all new
coordinate frequencies, so `a_E=w*a_F`. For the iid-union law nu_G and uniform
law mu_G, put `rho_G=(2w*mu_G+(1-w)*nu_G)/(1+w)`. The exact chain rule is

```text
d_E = B(w)+w^2*d_F+(1-w^2)*D(rho_G||mu_G).
```

The known Chase-Lovett abundance theorem gives
`a_F<=(sqrt(5)-1)/2`. Hence
`kappa*a_F^2<(4/5)*(2/5)=8/25<1/3<2 ln(2)-1`:
use `3^15<2^24`, `sqrt(5)>11/5` and `ln(2)>2/3`.
If Q(F) holds, the displayed identity and binary bound prove Q(E).
No Q(G) or product law inside G is needed. This removes a restriction on the
upper family, without proving Q for arbitrary lower families.

For disjoint Cartesian products, `d_(F x G)=d_F+d_G`,
`ln|F x G|=ln|F|+ln|G|` and `a_(F x G)=min(a_F,a_G)`. Thus Q for both
factors implies Q for the product. A violating product forces a violating
factor; a violating tagged ordinal extension forces a violating lower family.
Not every family has one of these decompositions.

Separate targeted audit513 found this ordinal/product argument valid under
its stated hypotheses and the external Chase-Lovett dependency; no fatal
algebraic objections. It clarified the exact-case citation as stated below.
It reproduced 1469 ordinal and 1017 product instances, added 79 extensions
and 64 products, and checked 303 binary points at 180 digits. Counts, mixture
weights and absence identities use exact fractions; entropy diagnostics do
not replace the proof. The same context/runtime/independence limits as audit510
apply. No grade or novelty conclusion was assigned. Audit manifest SHA256:
`825175ffecf3bfce3966bff439032420b77e78aa21281a41c3ca69a0f8e87be2`.

## A finite-size consequence to check separately

The [previous note](2026-10-25-union-entropy-gates.md) gives sharp majorization:
the iid-union law majorizes `b_i=(2i-1)/N^2`. Therefore

```text
H(X union Y)<=ln(N)-delta_N,
delta_N=sum_i [(2i-1)/N^2]*ln[(2i-1)/N] > 0.
```

For a linear extension of inclusion, a union in a prefix of size j requires
both samples in that prefix, giving mass at most j^2/N^2. The sum of the j
smallest probabilities is no greater than this prefix mass. These are exactly
the partial sums for b; Shannon Schur concavity gives the entropy bound.
Chains attain it.

Any valid certificate of the form
`w_0 H(U)+(1-w_0)H(Z)>=(1-p)ln(N)/m`, with Z supported in F, now yields

```text
p >= 1-m + m*w_0*delta_N/ln(N).
```

This is immediate by bounding H(Z)<=ln(N). Jiang's Section3.5 supplies that
certificate; Section10.6 specifies `1-m=0.38288525` and
`m*w_0=0.500000008685975`. Its external interval verification is an explicit
dependency, not independently reproduced here. A separate analytic option
uses Chase-Lovett Claim4.1 and gives
`p>=1-phi+phi*delta_N/ln(N)`, `phi=(sqrt(5)-1)/2`.

The total variation of b from uniform is `floor(N^2/4)/N^2>=2/9`.
Pinsker gives `delta_N>=8/81`; Riemann sums give
`delta_N -> ln(2)-1/2`. This supplies a correction of order 1/ln(N) to the
chosen baseline certificate, not an improvement of its asymptotic constant.
Separate targeted audit515 found the algebraic deduction valid, conditional
on the stated external certificates. It checked the exact Jiang parameters
`m=2468459/4000000`, `w_0=8102221/10000000` and
`m*w_0=20000000347439/40000000000000`. It reproduced the original 113-family
control and ten sizes, added 73 generated families, and checked the exact TV
formula through N=512. Floating/high-precision entropy diagnostics are not
interval certificates or formal proofs. Audit manifest SHA256:
`5302d9e37994eabfc164a376e3583a05565f8530e8cf163df75a2d3d07a9c764`.
The same preparation, reused-context and unattested-independence disclosures
as the other audits apply. No grade or worldwide-priority conclusion follows.

Independence is essential: on the two-member chain, the diagonal coupling
X=Y uniform has a uniform union and deficit zero, while delta_2>0. Apply the
sharp deficit to the independent component Z_0, not the arbitrary coupling
Z_4. Also, delta_N is the exact chain-reference deficit and sharp universal
lower bound; an arbitrary family's deficit need not equal delta_N. These
limits and the external certificate dependency survive any abbreviated use.

## Primary sources and next falsifier

- [Chase-Lovett2211.11689v1](https://arxiv.org/html/2211.11689v1), 21Nov2022:
  Claim3.1 proof, Corollary3.2 and Claim4.1 proof read. The diagonal entropy
  inequality is an external dependency. The exact-case abundance result can
  be read from Claim4.1 plus H(U)<=ln(N), without a literal epsilon=0
  substitution into an epsilon*ln(1/epsilon) expression.
- [Jiang2609.08291v1](https://arxiv.org/html/2609.08291v1), 8Sep2026:
  Sections3.5 and10.6 read for the displayed weights and support. No full
  reproduction of the external interval certificate is claimed.
- [Bhattacharjee-Bhattacharya](https://github.com/creelie/eUUR/blob/aa658666fd48f92983778946f6c538dbbc270e17/paper/main.tex):
  current README and introduction read, blob `0b70c8c1fba2ca80136a7d1cdf567f9b03b41cb3`.
  Commit `aa658666fd48f92983778946f6c538dbbc270e17`, 25Oct2026, now claims
  the small-family result through 54 members, beyond the older 52-member
  description. This is an inventoried claim, not an audited SAT certificate.
  It is not needed for the reductions above.
- OpenAI/math inventoried at `1581d4cbdd69a0faf34b2089614fe2a814316a6a`
  (12Oct2026); DeepMind/formal-conjectures at
  `49ba26bac3212084999860c575fcc70af42b3128` (25Oct2026). Repository heads
  and catalogue access do not mean their proofs were read.
- [Anthropic Science](https://www.anthropic.com/science), the
  [AIRR author catalogue](https://airr.science/authors/lluis-eriksson/) and
  [ai.viXra author catalogue](https://www.ai.vixra.org/author/lluis_eriksson)
  were refreshed at catalogue level on 25Oct2026. This directed refresh is
  not an exhaustive sweep or a novelty determination.

The main missing step remains correlation control in an arbitrary family.
Test decompositions and the exact KL identity first; abandon any proposed
global proof that silently substitutes a product reference. The smallest
formal target is the finite prefix-majorization lemma, not Q itself.
