# One exact d=3 source-certificate execution, 30 October 2026

The previously resource-held Tomar verifier has now actually run once, with
assertions enabled. At `d=3`, `k=3`, it returned zero nonzero identity residuals
among 4675 orbit sums and zero PSD failures among 715 multipliers. The process
exited successfully after 236.094 seconds without a restart or resource cutoff.
This closes the pending finite execution, not the paper's all-dimension proof
or our stronger signed operator comparison.

## Mechanism and assumptions

The source verifier constructs exact correction columns for a 2274-coordinate
system using three primes and its stated integer height bound, solves the
rational correction, and checks the completed dual identity on every orbit.
It then tests the rational symmetric multipliers using its exact
characteristic-polynomial PSD procedure. Its initial small floating residual
is only a diagnostic; the final exact identity and PSD checks determine PASS.

This execution uses the author's implementation, not an independent one. It
assumes the source reduction, type/basis conventions, equality constraints and
the verifier's implementation correctly encode the intended polynomial problem.
The earlier own 715-type admissibility guard is a separate structural check.
The new output-integrity check verifies square symmetric matrices and canonical
rational serialization; it is not a second identity or PSD implementation.

## Provenance and retained evidence

- Source: Tejasvi Singh Tomar, [*Undistillability of Werner states from three,
  four and five copies*](https://zenodo.org/records/23718035), pinned DOI
  `10.5281/zenodo.23718035`, version dated 28 October, first posted 23 October.
- The [execution record](execution-record.json) binds the input, original small
  source files, declared serial verifier adaptation, wrapper and exact completed
  coordinates by SHA-256. The input and 12,028,340-byte coordinate output are
  conserved privately; neither is vendored here.
- [Native execution evidence](native-execution1396.zip) preserves the exact
  runtime start/result/stdout/log bytes. The [readable output](execution-output.txt)
  changes CRLF to LF only; both hashes are declared in the execution record.
- [Output integrity](output-integrity.json) records the separate serialization
  check. The completed-coordinate SHA-256 is
  `dec5d3947b5b7cc108fdd48462b84c5ef8494c715b9d997d79c9a385b1f6f8ab`.

Only the parent wrapper's output directory changed for this activation; its
source directory still points at the frozen 1393 dependency. Source hashes,
arithmetic, final conditions, one-thread settings, 4 GiB launch gate and
emergency resource guard were retained. The old zero-run preflight remains
unchanged. Actual launch headroom was 4,732,164 KiB; the minimum observed was
3,465,004 KiB. No source package was downloaded again and no other dimension
was executed.

## Scope, falsifier and research decision

- **Formal:** no new Lean result or formal graph confidence is claimed. These
  are recorded exact finite checks from the source implementation.
- **Literature:** the author's broader all-dimension and higher-copy claims
  remain attributed claims. Selected paper/code reading and this d3 execution
  do not constitute a complete source-proof or external Lean dependency audit.
- **Heuristic:** the pending d3 arithmetic uncertainty is resolved for this
  pinned input and implementation. This supports keeping duplicate physical
  novelty claims parked while the broader prior-work scope is unresolved.
- **Speculative:** the stronger arbitrary-logical-anchor signed operator PSD,
  its kernel and a uniform quotient gap remain open. Physical rank-two
  nonnegativity does not itself supply those stronger operator conclusions.

A nonzero exact residual, a negative multiplier direction, or a demonstrated
mismatch between the source polynomial reduction and the physical expression
would invalidate the corresponding inference. Further dimension runs, repeated
guards and generic anchor/seed searches are not justified by this successful
control alone. Resume the stronger comparison only with a concrete new
mechanism and a falsifier over its full complex logical domain.

This is a single recorded execution, not a ready Research Capsule campaign,
independent implementation, new model assessment, manuscript score, peer
review, AIRR publication or all-copy undistillability result. The earlier
1393 factor review concerns another argument and is not transferred here.
