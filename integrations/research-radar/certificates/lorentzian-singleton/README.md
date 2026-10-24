# Exact Lorentzian singleton counterexample

This author-directed checker reconstructs a finite degree-five PGF with Lorentzian canonical homogenization and exact means `(1,3/5)`, whose singleton-avoidance probability is below the sharp real-stable envelope. It checks this counterexample, not a general Lorentzian envelope, novelty, importance or a theorem in a formal proof assistant.

See the [research note](../../notes/2026-10-24-two-mean-law-and-lorentzian-barrier.md) for the analytical scope, dependencies and preserved failures. The relevant primary characterization is [Brändén–Huh, Theorem 2.25](https://arxiv.org/html/1902.03719v8); its mathematical content is cited, not reproved by this script.

## Replay

Use Python 3 and SymPy. The recorded replay used SymPy 1.14.0. The checker needs no network, credentials, model service or unpublished input.

```bash
python -X utf8 -B verify_canonical_counterexample.py
```

The generated `canonical-check-result.json` is ignored by Git. The committed [certificate record](certificate.json) retains the observed exact values; it is a record of a run, not an input trusted in place of reconstruction.

The checker reconstructs the polynomial from rational coefficients, verifies normalization and means, establishes its actual degree, checks all 130 symmetric-exchange conditions and every order-three quadratic derivative signature, and proves the strict probability comparisons with a rational exponential-series bound. It also checks that the binary factor has negative discriminant, excluding real stability. Integer/rational signs are used throughout; no floating eigenvalue or optimization result establishes the claim.

The original untransformed lead had an artificial excess homogenization degree. The displayed mean-preserving substitution fixes that limitation; the checker explicitly verifies actual degree five before asserting canonical homogenization. The example does not refute the stable theorem or value-at-a-positive-point capacity productization.

## Provenance

Public checker SHA256: `bd8e2595930fea6de96a2f4a9cf4322d48f5d273f45c1c188b45975ffea885a0`.

The original root checker SHA256 was `556c9cc596a6a2fdf1c9fd73d0d8bc908552cfa244eaa53cfc8e75e77492e79e`. This public copy uses UTF-8/LF, a local generated-result filename, updated status metadata, and an added exact check of the transformed binary discriminant. The polynomial, means, degree, exchange tests, Hessian tests and probability comparisons are unchanged.

A separate dependent research reconstruction developed the mean-preserving substitution and verified the base Hessians and the linear-change theorem. Its 23-file research manifest SHA256 is `f9633694289e125088dccece6310aa66a9fba86a53942324565510ccc7bbd8f3`. Shared context and filesystem do not establish independence or formal verification. No score is assigned to this checker or conjecture.

Only own verification code and rational outputs are included. No primary-source full text or training corpus is redistributed.
