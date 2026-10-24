# Quantitative planar rational certificates: exact-draft boundary

Observed24October 2026. This is a research record, not a proof certification or model score.

## What changed

The earlier note on coefficient-height bounds for rational planar homogeneous Lyapunov certificates has a completed Astra audit with no blocking mathematical objection found. Its report is identified by SHA-256 `cc58713e69c731bd09658ae6d1733bb32508c4d1d7a2acfb8e07966c97e3005f`; the integrated proof note 42a by `fac60d1c81639647367e2c0bcee504cbbc810bf04f3581d7d3b350f5b22f6f35`. These are note-level findings, with shared-filesystem AI provenance and no formal or human verification.

A 13-page research draft now treats construction time as well as total dense output length. Its proposed theorem is single-exponential in input bit length for fixed odd field degree, including angular zeros and sign changes. It attributes rational converse and planar decision theory to prior work. The construction-time extension and the exact manuscript have separate pending audits; neither inherits a grade from another artifact.

Exact draft PDF SHA-256: `711e728115e61d7348155281dc0e372dfc37d3a45bdc1275881552d102db6b41`.
Exact TeX SHA-256: `968445f69e0f47160c0a777f20a96c49e44d79706360a1eb94affdd59f0f45ee`.

## Finite reproducibility

[The original exact example calculation](examples43.py) and [its recorded result](examples43.json) cover a changing-sign angular velocity and a one-sign velocity with a zero. They verify symbolic identities and analytic positivity bounds, and expand the dense certificate numerators. They do not implement the general construction algorithm or establish the universal theorem. A first expression-expansion attempt was interrupted for inefficiency; polynomial-domain exponentiation completed both examples. A structural symbolic equality assertion was replaced with the correct exact-zero polynomial identity test; no mathematical value changed.

Run with Python and SymPy: `python examples43.py`. This writes the result beside the script. Compare it with the committed JSON; environment and dependency versions should be recorded for any new campaign. This pair is a small illustrative calculation, not a registered general computational campaign or ready Research Capsule.

## Source and hypothesis audit

- Fixed-degree real elimination supplies uniform algebraic separation, not a new elimination theorem.
- The normalized nonnegative angular power controls function norm as well as coefficient bits. A missed sign case, an invalid uniform mean graph or an extra exponential would falsify the proposal.
- A rational denominator is essential. Multiplying by it does not preserve the Lyapunov derivative sign.
- General implementation, explicit useful constants, lower bounds, and a broader impact case remain open.

The source additions are bibliographic metadata and original short synthesis. No external full text or training shard is included. The canonical graph and its confidence labels remain unchanged. Priority is not established by a targeted search.

Later evidence is preserved in the [audit44 follow-up](2026-10-24-audit44-next.md). The pending statuses above describe the earlier snapshot; they are not current review outcomes.
