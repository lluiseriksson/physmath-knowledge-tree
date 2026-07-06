# Mother-facing digest - 2602.0032 conditional Witten-lattice package

This digest records issue
https://github.com/lluiseriksson/physmath-knowledge-tree/issues/32 as an
internal mother-package handoff for THE-ERIKSSON-PROGRAMME. It is a
conditional lattice-reduction package, not theorem progress. It does not claim
source construction, `hRpoly`, a continuum Yang-Mills construction, a mass gap,
Osterwalder-Schrader reconstruction, Wightman reconstruction or Clay progress.

## Entry status

- Package id: `2602.0032`
- Corrected status: conditional Witten-Laplacian lattice-reduction package
- Repo anchor: issue #32, `Record 2602.0032 conditional Witten-lattice package`
- Consumption mode: use as a hypothesis checklist and errata capsule before
  any formal or mother-repo transfer
- Companion packages: `2602.0020` and `2602.0021`; keep their claims separate
  from this package

## Explicit hypotheses

These four hypotheses must stay visible as assumptions:

- `(H-BAL)`: Balaban-side input package for the relevant lattice RG objects.
- `(H-CONST)`: uniform constant window for the intended lattice reduction.
- `(H-MB)`: Morse-Bott regularity and nondegeneracy input for the
  Witten-Laplacian reduction.
- `(H-HAM)`: Hamiltonian or transfer-matrix input needed by the finite-window
  extraction step.

## Honesty findings

The package should be read with these negative or conditional findings attached:

- Morse-Bott fails at the orbifold point; do not use the package as a global
  regularity statement.
- The literal v1 Born-Oppenheimer potential is not positive; do not use it as
  a coercive potential without repair.
- The transfer-matrix extraction is finite-window only; do not treat it as a
  continuum or infinite-volume construction.
- For typical constants, the compatibility window is empty; any usable branch
  must display the constants that reopen the window.
- The Ricci correction is favorable, but it is a correction term inside the
  conditional package rather than an independent construction theorem.

## Companion boundary

Use `2602.0032` next to `2602.0020` and `2602.0021` only as a companion
diagnostic. It can name a Witten-Laplacian route, the four explicit hypotheses
and the errata above, but it must not merge claims across the three package
ids. A consumer should cite which package id supplies which hypothesis or
failure mode before editing THE-ERIKSSON-PROGRAMME.

## Possible consumption

A safe next consumer step is to create a small assumption ledger with fields:

- package id: `2602.0032`
- hypothesis name: one of `(H-BAL)`, `(H-CONST)`, `(H-MB)`, `(H-HAM)`
- source status: `internal-package`, `needs-primary-source` or `blocked`
- failure mode: one of the honesty findings above, when relevant
- target file or declaration in the consuming repo, if and only if it is known

If any consumer cannot name the exact hypothesis, file and declaration/API it
needs, leave `2602.0032` as a digest-only package.
