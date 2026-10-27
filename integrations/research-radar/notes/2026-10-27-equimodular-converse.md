# Equimodularity and an explicit positive midpoint obstruction

The new result has a completed **unscored component audit**, not a full-paper assessment, formal verification or priority certificate. The [full audit840](../evidence/2026-10-27-classification843/AUDIT840.md) supports the analytic classification below conditional on Leake--Mohammadi Yekta's coefficientwise Theorem3.1. The separate earlier PDF received importance4.0 and technical8.5; those grades do not transfer here.

## Mechanism, hypotheses and boundary

Let M be a full-row-rank integer r by n matrix. Boxes are finite, integral coordinate boxes; some coordinates may be fixed. For every such fixed box and every midpoint triple of integral right-hand sides whose three INTEGER fibers are nonempty, midpoint log-concavity of counts holds universally if and only if all nonzero maximal minors of M have the same absolute value D. This is classical equimodularity. The equivalent universal properties are coefficientwise nonnegativity of F0^2-Fminus Fplus and numerical log-concavity for all positive original-coordinate fields. A single numerical inequality does not imply coefficientwise nonnegativity.

If empty fibers are allowed for arbitrary ambient integral right-hand sides, the corresponding universal property holds exactly when M is equimodular and D is odd. This distinguishes integer feasibility from real feasibility and the column lattice from the ambient lattice.

The sufficiency is a reduction to an external theorem: choose a column basis B and use C=B^-1 M. Classical equimodularity makes C integral with maximal minors0,+1,-1 and M Z^n=B Z^r. Nonempty integer fibers therefore have integral transformed right-hand sides. No new normalization or recognition algorithm is claimed.

The possible additional observation is a converse with all three counts positive. A nonequimodular M has a primitive minimal kernel circuit c with a coefficient c_i=a>=2 after orientation. Fix all coordinates outside its support to zero and take the common box0<=x<=|c|. Write p=c-positive, q=c-negative and R_k=Mp-k M_i for k=0,1,2. Primitivity makes every integer solution equal p-k e_i+t c with integer t. The coordinate i and any other circuit coordinate force t in[-1+k/a,0]. The resulting counts at R2,R1,R0 are exactly(1,1,2). More strongly, their enumerators satisfy

`F(R1)^2-F(R2)F(R0) = -z^(|c|-2e_i)`.

This is negative at every positive field. It covers a=2, uniform signs, circuits with no coefficient of magnitude1, zero columns outside the fixed support and all full row ranks. At most r+1 coordinates need vary. The assertion is proved analytically; a finite search alone would not establish it.

For even D, a basis singular modulo2 supplies a binary box with counts(1,0,1). For odd D, the column-lattice membership of both endpoints and an ambient integral midpoint imply membership of the midpoint by Bezout for2 and D. The parity-halving formulation is also correct, but its sufficiency follows with little adaptation from LMY Lemma3.3 and should be described as such.

This does not solve global rational Jensen inequalities. M=[3], box[0,1], and endpoint weights2/3,1/3 give an integral mean right-hand side1 whose fiber is empty, despite odd equimodularity.

## Literature, evidence and falsifiers

- **Literature:** [Heller1957](https://msp.org/pjm/1957/7-3/pjm-v7-n3-p07-p.pdf), conditions1.5--1.7; [Bernstein--Sullivant v2](https://arxiv.org/pdf/1502.06131v2), Definition1.1(2)--(3); [Chervet--Grappe--Robert](https://www.lamsade.dauphine.fr/~rgrappe/papers/box-tdi.pdf), Theorems3 and5 and Corollary4; [Leake--Mohammadi Yekta v1](https://arxiv.org/html/2609.39917v1#S3.SS1), the complete selected section3.1. These absorb circuit equivalence, normalization and underlying geometry. CGR appeared online2020 and in volume188 in2021.
- **Own analytic inference:** combining that classical structure with the explicit positive circuit witness gives necessity under the three-nonempty-integer-fibers promise. Audit840 found no invalidating defect. No close prior formulation was found within the scoped reading; worldwide priority remains unverified.
- **Finite evidence:** audit840 independently checked16828 positive certificates,127608 coefficientwise nonempty triples and46362 binary centers, with no failures. It also reproduced controls839 except its UTC. These are control counts, not independent scientific replications or a complete campaign capsule.
- **Formal:** no new Lean result and no canonical graph confidence change.
- **Speculative:** research significance and priority. A qualifying counterexample invalidates the corresponding theorem; an earlier positive-converse theorem abandons the novelty claim. Another elementary route subsuming the entire converse would reduce its claimed contribution. The criterion does not remove the regular kernel geometry under another name.

The minimal formal target is the one-dimensional primitive-circuit integer-parameter lemma and its three-fiber enumeration. A next finite task is a standalone checker of the explicit monomial certificate from a supplied primitive circuit, rather than further undirected tables. The related [Lancini--Pisanu v1 abstract](https://arxiv.org/abs/2610.13244v1) was read only as a box-TDI lead; no proof or counting-preserving transfer is claimed.

The [reproduction supplement857](../evidence/2026-10-27-circuit857/README.md) now publishes the original own checkers839/840 and expected outputs in a native byte-preserving archive. Its wrapper reproduced every expected mathematical JSON field and the complete16,828-line positive-certificate file hash. UTC/elapsed fields differ as declared; this is a new reproduction of the same finite controls, not an additional model review or a general proof.

## Context and provenance

One fresh requested GPT-6 Astra xhigh audit was run, without previous reports or numeric targets in its packet, and with shared filesystem access. Actual runtime, effective effort and independence lack attestation. Original objections, reading depths and source hashes remain in the [reading ledger](../evidence/2026-10-27-classification843/READING_LEDGER840.json). The evaluated frozen input manifest is43db16e85a680bc6e9c49d5546a0d9201f78811cf8a86fb9a8a8546da5fd7769; the final audit manifest is658e6609f5cd457ef83bd9ebca6fb96c9d45ccbdb1c64b51b67b5a8a827127fa.

A small canonical algebra subgraph was retrieved before this synthesis. No analogy or graph proximity is used as proof. [Refresh843](../evidence/2026-10-27-classification843/REFRESH843.json) records a directed seven-endpoint primary-source refresh with dates, response hashes and repository commits. OpenAI and DeepMind pins are unchanged. Inventory refresh is not an exhaustive reading of papers. Foreign paper bodies are not redistributed.
