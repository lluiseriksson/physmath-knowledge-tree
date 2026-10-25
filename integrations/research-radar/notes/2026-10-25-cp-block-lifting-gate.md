# CP block compression: the missing interval and a failed scalar lift

This is a directed research checkpoint, not a new paper or a solution of the
general compression problem. The canonical graph is unchanged. No score is
assigned. Retrieved context: `domain.functional_analysis` and
`domain.quantum_information_theory`, their incident edges and the spectral,
coercivity, no-signalling and recovery neighbors. Those links supply context,
not a norm-compression proof.

## Target and mechanism

For nonnegative alpha, beta, eta, delta, K, with alpha*delta >= K^2, consider

    T = [[alpha XX* + beta YY*, KXY*],
         [KYX*, eta XX* + delta YY*]],
    C = [[alpha+beta,K],[K,eta+delta]],
    ||X||_(2p) = ||Y||_(2p) = 1.

The speculative target is `||T||_p <= ||C||_p` for 1<p<2, without the stronger
Davies condition alpha*delta-beta*eta >= K^2. An explicit Gram factor is

    M = [[sqrt(alpha)X, sqrt(beta)Y, 0, 0],
         [K/sqrt(alpha)Y, 0, sqrt(eta)X,
                                sqrt(delta-K^2/alpha)Y]],   T=MM*.

The alpha=0 endpoint has K=0 and is separate. On the CP boundary the last
column vanishes. Audenaert compression at factor order 2p would give the
target, since its scalar compression has Gram C. This dictionary preserves
positivity and the exact comparator; it does not preserve a proved theorem in
the unresolved factor-order interval 2<2p<4. A solution would remove a material
restriction in the channel argument; it is not currently established.

## Exact checks, not a new theorem claim

At p=1 trace gives equality. At p=2 expansion gives the exact gap

    Tr(C^2)-Tr(T^2)
      = (alpha beta+eta delta)||XX*-YY*||_2^2
                         +K^2||X*X-Y*Y||_2^2.

At infinity the block Rayleigh bound follows from ||X||=||Y||=1. The p>=2
range also follows from the known two-row compression theorem at factor
order >=4. These facts do not interpolate to a sharp bound in 1<p<2.
Equal left Gram matrices are covered by the controlled-factor ALT argument;
that special case cannot justify general X,Y.

Numerical exploration included 24 local fits across six unbalanced tuples,
dimensions 2 and 3 and orders 1.05--1.7, on the CP boundary and interior.
No violation was found. This is a bounded diagnostic, not a certified global
campaign, proof, priority check or ready Research Capsule. The earlier balanced
alpha=delta=K=1 screen is not general: arbitrary output congruence does not
preserve a Schatten comparison. Private run manifests retain all fit statuses.

## Refuted route: scalar isometry does not lift to matrix coefficients

Heinavaara's two-dimensional scalar Lp embedding suggests reducing a matrix
pencil to scalar functions. The automatic matrix-coefficient lift is false,
even for the sparse CP factor above. Let X and Y be the Pauli x and z matrices.
Then `Tr(aX+bY)^4=2(a^2+b^2)^2`. Any real scalar S4 representation f,g must have

    integral f^4 = integral g^4 = 2,
    integral f^2 g^2 = 2/3,
    integral f^3 g = integral f g^3 = 0.

For `M=[[X,Y,0],[Y,0,X]]`, exact matrix multiplication gives
`Tr(MM*)^2=20`. But replacing X,Y by f,g and integrating the scalar matrix
fourth power gives `integral(2f^4+2g^4+6f^2g^2)=12`. Thus even the proposed
upper domination 20<=12 fails. This is not a counterexample to compression:
the genuine comparator gives equality, 20=20. It rejects an automatic
amplification of scalar isometry, not Heinavaara's theorem.

The obstruction also occurs inside the missing factor-order interval, at
order 3 (output order p=3/2). Uniform circle measure of total mass 3*pi/2
realizes the scalar S3 isometry, since the average of |cos(theta)|^3 is
4/(3*pi). For the same M, `Tr|M|^3=6sqrt(3)+2>12`. On the circle, |xy|<=1/2,
so the scalar trace is at most `(3sqrt(6)+sqrt(2))/4`. Its integral is
less than 297/28<11, using sqrt(6)<5/2, sqrt(2)<3/2 and pi<22/7.
The last inequality follows from the strictly positive integral
`integral_0^1 t^4(1-t)^4/(1+t^2) dt =22/7-pi`. Thus this particular valid
scalar S3 embedding cannot give even upper domination after amplification.
The actual Schatten compression still holds with equality. This example
does not exclude a separately proved, restricted transfer theorem.

The [symbolic diagnostic](../checks/cp-block-lifting.py) checks these exact
identities and supplies an explicit eight-point positive measure realizing
the scalar S4 isometry. It uses SymPy, not Lean. The observation is an original
derivation in this checkpoint; worldwide novelty is not claimed and it does
not justify a standalone manuscript.

## Evidence layers and continuation gate

- `literature`: attributed compression ranges and scalar embedding, at the
  reading scopes below; their original proofs are not all audited here.
- Graph-supported inference: the functional-analysis/channel interface is
  relevant; graph adjacency establishes no inequality.
- `heuristic`: the bounded numerical screen found no violation.
- `speculative`: the full CP comparison in 1<p<2. Falsifier: one admissible
  tuple with a certified positive norm excess. Abandon the scalar-lift route
  unless a separate matrix-amplification theorem supplies the missing control.
- Formal result: none added. Exact algebraic checks are not a checked Lean
  theorem. A minimal later formal target is the Pauli moment obstruction;
  the next substantive mathematical task is a direct sparse-factor estimate
  retaining noncommutative Gram information.

## Primary-source scope and immutable pins

- [Audenaert, math/0702186v2](https://arxiv.org/html/math/0702186v2),
  26 March 2007: conjecture, reformulation and special-case statements read;
  not all proofs audited. The generated HTML's 2026 display date is not the
  preprint version date.
- [Zhang, 2410.21961v4](https://arxiv.org/html/2410.21961v4), 28 March 2026:
  selected introduction, Theorem 1.3, Conjecture 1.14, Theorem 1.15 and
  Corollary 1.16 statements read. Its rank-dependent factor does not prove
  constant-one compression.
- [Heinavaara, 2310.03227v1](https://arxiv.org/abs/2310.03227v1),
  5 October 2023: abstract read; not a full proof audit.
- [Schmitt, 2609.12547v1](https://arxiv.org/abs/2609.12547v1),
  11 September 2026: abstract only, inventoried as a relative-entropy lead;
  no tensor-power consequence inferred.
- OpenAI/math overview blob `8f3b8cb6d5c4f5f7f0ac216b2c6db52b4b34b2fd`:
  catalogue keyword screening only; the GAD entry is an antecedent, not
  evidence that all listed manuscripts were read.
- DeepMind/formal-conjectures commit
  `49ba26bac3212084999860c575fcc70af42b3128`, 25 October 2026, and
  OptimizationConstants/6a.lean blob
  `cc2fa401f4ef6f3a648fdacbf6f91a8f5ac59714`: statement file read. Its
  union-closed-set declarations contain `sorry`; no solved theorem is
  inferred from an inventory or a research-solved label.
- Anthropic FLT announcement (4 September 2026) and ai.viXra author index
  were checked at announcement/catalogue level only. No new technical
  consequence for this compression target was established from them.

This sweep is directed. No exhaustive corpus coverage or worldwide open-status
certification is claimed. No third-party full-text corpus is redistributed.
