# Exact singleton-avoidance polynomial certificate

This is a deterministic finite algebraic check, not a proof of novelty or an assessment score. The [research note](../../notes/2026-10-24-stable-singleton-boundary.md) states the accompanying analytic scope and audit limits.

Run from this directory with Python3; no third-party packages are needed:

```bash
python -X utf8 -B capacity118-check.py
```

The checker reconstructs the polynomial from all56 rational Bernstein coefficients using `fractions.Fraction`, verifies the exact identity and nonnegativity, and rejects both an altered positive coefficient and a truncated table. Its output file `capacity118-check-result.json` is generated locally and should not be committed.

The certificate covers the entire unit square. Its minimum Bernstein coefficient is51/40. It supports the all-block-size analytic inequality in the note; it does not check the determinant representation theorem, the extremal reduction or all relevant literature.

Certificate SHA256: `bc05bf0195e2a771f78bdc27ef1ca276b9d851d081b6a4f7741e8acab983bd34`.

Checker SHA256: `5fae09c4dc033a69c7b6a3f113cba83648f528f46c181538ae34a0a482d0fdab`.

Repository text uses LF line endings. The original audited Windows certificate hash was `1699582f2dbfe21682ad2739e5777e1d39ad92d7abb489b555c595d2a4ca9452`; its parsed rational data are identical. The original checker hash was `abc0970c795e7f0e3a7623543d2d647729834f199bbf787925fde6477481f71d`; this copy also writes its generated result as UTF-8 with LF on every platform. The original frozen manuscript and audit inputs remain unchanged.

The code and rational table are author-directed research artifacts. No source-paper full text or training corpus is redistributed here.
