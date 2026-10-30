# Identity queries: order and domain boundaries

This is an elementary scope diagnostic for using matrix identity testing in an
operator-inequality problem. It is not a new paper, a counterexample to Lu's
ncABP theorem, or a counterexample to the actual QSS/Pick targets. The direct
transfer from an identity-hitting query to a uniform positivity certificate is
rejected; the missing positivity estimate is still needed.

## What a Hermitian replacement can preserve

Assume a fixed complex tuple `T` hits a class of polynomials of degree at most
`D`. Write `T_i = A_i + i B_i`, where both `A_i` and `B_i` are Hermitian. For
each nonzero polynomial `f` in the class, the matrix polynomial
`g(z) = f(A_1 + z B_1, ..., A_m + z B_m)` has degree at most `D` and is nonzero
at `z=i`. Hence at least one of its values at `0,1,...,D` is nonzero.

The block-diagonal tuple with these `D+1` Hermitian blocks therefore remains
an identity-hitting tuple. Its order is `(D+1)` times the original order; the
full description and returned entries must still be charged. This argument is
over complex matrices, not an assertion about arbitrary fields or scalar-only
oracles. For rational original entries the new entries are Gaussian rational.

If the promised polynomial class is closed under a common nonzero rescaling
of the variables, as bounded-vertex affine ncABPs are, a common norm bound can
scale this tuple to Hermitian contractions without losing identity detection.
This is a separate conditional hand argument, not a validation of Lu's
inaccessible formal artifact or of the rational-function appendices.

## Identity detection does not reflect the positive cone

Take the positive contraction `H = diag(0,1/2,1)`. It hits every nonzero
univariate polynomial of degree at most two: a quadratic cannot vanish at all
three distinct eigenvalues. Thus it hits every univariate affine ABP with at
most three vertices.

Nevertheless, for

```text
p(x) = x^2 - x/2 + 1/32,
```

`p(H) = diag(1/32,1/32,17/32)` is positive definite, whereas for the equally
admissible positive contraction `X=I_3/4`, `p(X)=-I_3/32` is negative definite.
The polynomial itself has a three-vertex affine ABP: edges `0→1: x`,
`1→2: x-1/2`, and `0→2: 1/32`.

This disproves only the generic implication from positivity of the evaluated
matrix to positivity at every admissible input. It is not an oracle lower
bound against arbitrary postprocessing: in this univariate example the full
answer even permits coefficient recovery. No negative witness for the
structured QSS inequality has been produced.

## Nilpotence also protects rational domains

The exact control starts from the three-dimensional nilpotent shift `N` and
forms `A=(N+N*)/2`, `B=(N-N*)/(2i)` and the Hermitian contraction
`K=diag(A,A+B,A+2B)/3`. Both `N` and `K` have linearly independent monomial
responses through degree two.

For the origin-defined expression `q(x)=(1-18x^2)^(-1)`, however,
`det(I-18N^2)=1`, while `det(I-18K^2)=0`. The `A/3` block already causes the
singularity. This optional Hermitian replacement has lost the original
nilpotent query's syntactic-domain protection. The example does not challenge
the source's unmodified nilpotent construction, establish a rational hitting
lower bound, or assert a size-optimal rational-query result.

## Evidence, limits and next decision

- **Formal:** no new Lean theorem or graph confidence promotion. The external
  PIT formal source, statement correspondence and dependencies remain unverified.
- **Literature:** [Lu's version-pinned preprint](https://arxiv.org/abs/2610.37677v1)
  concerns identity hitting; these stronger order/domain transfers are not
  attributed to it. Its first submission was 11 October 2026.
- **Heuristic:** the conditional lift argument is an unreviewed author
  derivation. The exact examples establish the stated finite obstructions,
  not a universal theorem by sampling.
- **Speculative:** abandon the direct PIT-to-uniform-PSD and automatic
  rational-domain transfers. Resume a positivity route only with a concrete
  factorization/order theorem and the required admissibility hypotheses.

The [control](scope-control.py) and its [actual exact result](exact-result.json)
use symbolic rational arithmetic over `Q(i)`, with no search or random fixtures.
The result binds the script by SHA-256. A negative target eigenvalue or a
singular denominator is the explicit falsifier for the respective transfer.
There is no ready Research Capsule campaign claim.

## Model assessments and review context

This own scope diagnostic has no model assessment or numerical grade. The
earlier unscored 1397 source audit examined Lu's star-construction proof; it
does not assess this new diagnostic, and its verdict is not transferred.
