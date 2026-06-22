# Curated mathematical extract — `ideas(12).txt`

## Source disposition

The source is a large concatenation of research conversations rather than a coherent manuscript. It contains repeated roadmaps, changing repository-status claims, partial Lean files, source-shopping lists, speculative physics and several independent mathematical ideas. The raw text is therefore **not suitable for direct inclusion**.

Canonical record: [`curation/records/ideas-12.json`](../../curation/records/ideas-12.json).

## Promoted mathematical content

### 1. Cluster expansion with holes

The stable dependency chain is:

\[
H \longrightarrow e^H-1 \longrightarrow K(Y)
\longrightarrow K^\#(Y) \longrightarrow H^\#(Y).
\]

The reusable insight is the separation of support roles:

- the active skeleton determines overlap, connectedness and hard-core incompatibility;
- the full target determines the union label and locality domain.

The mathematical obligations remain distinct: finite target-family regrouping, modified-metric stitching, connected-cover entropy, ultralocal integration and the second Ursell expansion. This content is represented by `bridge.cluster_expansion_with_holes`.

### 2. Weighted Ward defect

Under the assumptions

\[
\operatorname{Ber}(QG)=0,
\qquad
Q(wF)=(Qw)F+wQF,
\]

the weighted functional satisfies

\[
\operatorname{Ber}_w(QF)
=-\operatorname{Ber}((Qw)F).
\]

This is an exact algebraic identity. Its application to Yang-Mills remains heuristic until a concrete differential, regulator, measure identity and pure-theory bridge are supplied. It is represented by `bridge.ward_defect_weight_variation` and the move `cancel before majorizing`.

### 3. Gaussian collar factorization

For local observables in separated regions, exponential covariance decay can control a Gaussian factorization defect through interpolation or integration by parts. This yields approximate rather than exact independence; the defect must be packaged as a new local activity. It is represented by `bridge.gaussian_covariance_collar`.

### 4. Block-average coercivity

If a nonnegative kinetic operator and block map satisfy

\[
\lVert x\rVert^2
\le C_P\bigl(\langle x,Kx\rangle+\lVert Qx\rVert^2\bigr),
\]

then, for \(a>0\),

\[
\langle x,(K+aQ^\dagger Q)x\rangle
\ge \frac{\min(1,a)}{C_P}\lVert x\rVert^2.
\]

The lemma is elementary once the block Poincare estimate is supplied. The gauge-theory work lies in proving that estimate with the correct slice and weighted inner products. It is represented by `bridge.block_average_coercivity`.

### 5. Lattice-to-physical scaling

Define

\[
d_{\mathrm{phys}}=a n,
\qquad
m_{\mathrm{phys}}=\frac{m_{\mathrm{lat}}}{a}.
\]

For \(a\ne0\), the exponent is exactly invariant:

\[
m_{\mathrm{lat}}n
=m_{\mathrm{phys}}d_{\mathrm{phys}}.
\]

This clarifies units but does not construct a continuum theory. A continuum result still needs a calibrated spacing, thermodynamic control and convergence of renormalized correlators. It is represented by `bridge.lattice_physical_scaling`.

### 6. Concrete Yang-Mills RG producer problem

The technically meaningful open target is not an arbitrary predicate named `activity_decay`. It is to define the activity produced by the actual gauge-fixed one-step fluctuation integral and prove its support, coupling-power and modified-metric bounds uniformly. This is represented by `problem.uniform_yang_mills_rg_activity`.

## Material deliberately not promoted

The following ideas remain in quarantine:

- uniform SUSY-to-pure-Yang-Mills decoupling;
- a localized nonperturbative Nicolai map;
- periodic-table or super-shell analogies as an RG mechanism;
- Petz recovery interpreted as a physical wormhole or material portal;
- RAP/projective-carrying proposals without a defined operator theorem;
- the proposed Hodge–Mayer–Ward theory beyond its elementary Ward identity.

They are not deleted from the record; they are excluded from the canonical graph until a finite theorem, primary-source basis or falsifiable model is supplied.

## Source-verification queue

Before literature claims receive references or exact constants, verify:

1. the complete Appendix-F theorem, metric convention and exponent losses in the primary Dimock sources;
2. the exact Balaban one-step gauge identity, scalar products, gauge projectors, Hessian and localized propagator bounds;
3. whether the localized fluctuation measure is genuinely ultralocal at the stage where exact factorization is invoked;
4. the distinction among raw, integrated and renormalized activities in every source adapter.

## Deletion status

The source is marked `delete-after-user-review`, not deleted. Its SHA-256 and all curation decisions are recorded. After review, the record can be changed to `reviewed` and `deleted-after-review` without storing the raw 26,014-line transcript in the repository.
