# AQFT locality, nonfactorization and recovery

## Purpose

Keep four logically distinct claims separate:

1. local algebras commute at spacelike separation;
2. the vacuum need not factor across them;
3. complete local operations do not signal;
4. recovery of a code requires one channel with uniform quantifiers.

## Finite prototype

Use two commuting matrix subalgebras acting on one Hilbert space and a vector state. Do not assume a tensor product unless it is part of the theorem.

### Nonfactorization test

Assume the vector is cyclic for the first algebra and separating for the second. Product factorization forces every centered distant operator to annihilate the vector; cyclicity and separation then force the distant algebra to be scalar.

### No-signalling test

For local Kraus operators `K i` and a distant observable `Y`, prove

\[
\sum_i\omega(K_i^\dagger YK_i)=\omega(Y)
\]

from commutation and Kraus completeness. Keep conditioned branches outside this theorem.

### Recovery test

Introduce a reference system and demand one recovery channel for every encoded state. Reject statements of the form `for every state there exists a preparation operator` as a substitute for coherent code recovery.

## Operator-algebraic caution

Local AQFT algebras are generally not supplied as finite tensor factors. Any type-III or split extension must state the representation, entropy or relative-entropy object, channel class and continuity assumptions explicitly.

## Minimal falsifiers

- A commuting nontrivial algebra pair with a cyclic/separating vector for which the proposed factorization proof fails.
- A noncomplete or outcome-conditioned operation incorrectly used in a no-signalling calculation.
- Two code states that admit separate preparation maps but no common coherent recovery channel.
