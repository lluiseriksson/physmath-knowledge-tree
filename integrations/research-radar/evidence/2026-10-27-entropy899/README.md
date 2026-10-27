# Scope and reading order

These are bounded audit logs and own analytical working notes. They do not
constitute a Research Capsule, a new paper or proof of universal additivity.
The canonical graph and its confidence labels are unchanged.

- `PROOF899.txt` is the exact original for component audit901; read the FULL
  `AUDIT901.txt` and `verdict901.json`, including all nine objections.
- `PROOF903.txt` separately corrects null-row and P5 support wording, adds
  derivative regularity and clarifies fixed-channel quantifiers. It does
  not replace the audited bytes. `ERRATA903.json` binds the versions.
- `OBSTRUCTION903.txt` proves failure of both convexity and concavity on a
  fixed-marginal slice. It does not refute the target entropy inequality.
- `PROOF904.txt` proves a conditional reference-information budget; exact
  controls are in `CHECK904.json` and the safe stdout-only `check905.py`.
  `INPUT905.json` binds its native input. All reference dimensions remain
  arbitrary, but the conditional-entropy restriction is NOT eliminated.
- Terminology correction: the two pure reference branch supports in904
  are **nonorthogonal** lines with zero vector-space intersection. The word
  "overlapping" means nonzero overlap of vectors/fidelity only; it must not
  be interpreted as a nonzero intersection of their support subspaces.
  N is explicitly the Bloch map `(x,y,z)->(3x/5,3y/5,z/4+1/5)`, and
  e_N(p)=h((1+sqrt((9/25)(1-z^2)+(z/4+1/5)^2))/2), z=1-2p,
  with natural logarithms. Proof904 predates the following review.
- `POST907.txt` is a separate, unreviewed conditional-entropy/formation
  bound. It proves the target for separable inputs and recovers the pure
  subclass; it does not establish its balance condition for all mixed states.
- `PROOF908.txt` and stdout-only `check908.py` supply an analytical uniform
  margin for a standard isotropic line. This is not a grid search, no
  independent frontier-paper novelty is claimed, and older restricted
  partner coverage has not been excluded.

Component audit906 is complete: read the full `AUDIT906.txt`,
`verdict906.json` and `READINGS906.json`. It supports the scoped904 bound
with seven retained objections and reconstructs missing definitions and
dependencies. It supplies no manuscript grade. `CONTROLS906.json` and
`RUNLOG906.txt` retain diagnostic tolerances and the corrected initial
arithmetic-harness incident; those samples are not universal certificates.
The scope is exact input905/PROOF904; POST907 and908/910 were not reviewed.

`PROOF910.txt` shows that v=4/5 on the isotropic line has both earlier
sufficient bounds negative, yet the separate908 argument certifies a
positive gap. `check910.py` checks its exact arithmetic. It uses the standard
Wootters formula, whose displayed statement was read, not whose complete
proof was replayed. This establishes a distinction between working bounds,
not worldwide novelty or importance. The original pure-branch example904
is also covered by907, because E_F<=S(R)=I(Z:R) for those pure branches;
it is not advertised as a new distinction from907.

Requested reviewer configuration was Astra xhigh, with fresh conversational
context and shared filesystem. Effective runtime identity/effort and
independence were not attested. These are component audits without a grade,
not human peer review, editorial acceptance or an assessment of a new PDF.
Adverse objections and original inputs are preserved.

The manifest maps native/public hashes; only CRLF-to-LF is normalized in
loose files, and the zip retains native bytes. Foreign source bodies, private
credentials and operational state-writing scripts are excluded. Primary
metadata hashes and reading depths do not imply proof coverage or corpus
reuse permission. The scripts control finite algebra; the universal scoped
statements rely on the written entropy arguments, not sample extrapolation.
