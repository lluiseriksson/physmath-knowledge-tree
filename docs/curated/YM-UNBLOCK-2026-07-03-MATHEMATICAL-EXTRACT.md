# Curated mathematical extract - Yang-Mills unblock batch 2026-07-03

This extract summarizes `PATCH-YM-UNBLOCK-2026-07-03.md`, a curation dossier produced from eleven source files. The raw originals are not copied into the repository. The dossier is treated as the curated source for this batch, with SHA-256 provenance recorded in `curation/records/ym-unblock-2026-07-03.json`.

## Boundary

The batch does not prove `hRpoly`, the continuum limit, Osterwalder-Schrader reconstruction, Wightman reconstruction or the Clay Yang-Mills mass-gap statement. It is an inbox for graph candidates, Lean targets and source-verification work. Candidate graph objects are staged in `YM-UNBLOCK-2026-07-03-CANDIDATES.json`; they are not canonical graph data.

## 1. Gaussian Collar Ladder

The most direct Yang-Mills-facing idea is a finite Gaussian collar ladder:

- G0: prove an exact joint-Gaussian moment-generating factorization and an explicit covariance-defect bound.
- G1: use Gaussian interpolation to bound interior/exterior correlation by collar kernel tails and local Lipschitz budgets.
- G2: transport that defect bound to localized activities and Mayer components.
- G3: identify the resulting term with the concrete `Rsc` or a direct producer for `SingleScaleUVDecay`.

This can only help `hRpoly` if the constants are uniform in volume, scale and admissible backgrounds. If G0 is not volume-uniform, the route should stop early.

## 2. P4 Activity Contract

The batch sharpens the P4 target into a quantifier discipline: first define the raw gauge-fluctuation activity from the actual gauge integral, then prove a uniform decay estimate with constants chosen before volume, lattice spacing, scale, background, hole geometry and polymer target. Any package that stores the desired decay estimate as a hypothesis field should be rejected as a wrapper.

The suggested toy witness is the combinatorial shape of a four-dimensional estimate with auxiliary constants such as `kappa0 = 66` and `kappa = 267`. These are not physical constants; they are stress tests for the statement shape.

## 3. Schur-Catalan Multiscale Closure

The proposed abstract theorem is:

If a self-adjoint base operator satisfies `A_base >= c_base I`, and each scale contributes a positive self-adjoint self-energy with a Catalan-weighted tree expansion bounded by

```text
||Sigma_{k,n}|| <= Catalan_{n-1} M_k^(2n-1) eps_k^n,
4 M_k^2 eps_k < 1,
```

then the Catalan generating function yields

```text
||Sigma_k|| <= (1 - sqrt(1 - 4 M_k^2 eps_k)) / (2 M_k).
```

If the sum of these scale budgets stays below `c_base`, coercivity remains positive. This is an abstract closure template only; it does not instantiate the Yang-Mills gauge Hessian or a Weil-form operator.

## 4. Three-Infinities Rooted Closure

The batch proposes a single rooted observable

```text
I_t(r) = sum_k sum_n sum_{Y contains r} |H#_{t,k,n}(Y)|.
```

Under a rooted child-factorial budget, a geometric target entropy bound and a summable marginal scale profile, Tonelli and a geometric series give

```text
I_t(r) <= M A K_root G0 exp(-c0 t) / (1 - q).
```

This is convergence bookkeeping across cluster order, geometry and RG scale. It is useful only if it consumes already named repository consequences rather than duplicating them.

## 5. Spectral Compactification And Moment Certificates

The Penrose-Stieltjes bridge compactifies an unbounded positive spectrum by the resolvent map

```text
lambda |-> (lambda + x0)^(-1).
```

The proposed shared library would expose finite-dimensional Stieltjes transforms, complete monotonicity and Hausdorff/Hankel moment certificates. On the Riemann side this is staged as a single-point resolvent criterion for `Xi`; on the Yang-Mills side it becomes a cheap finite coercivity test for candidate precision operators.

The dossier explicitly warns that RH moment criteria already exist. Any novelty claim about the single-point `Xi` formulation must wait for literature verification.

## 6. Limit-Corner And RG-Time Language

The limit-corner idea says that joint limits such as `(a, 1/n) -> (0, 0)` should be blown up into directions, because the physical quantity is often the ratio. The RG-time idea treats the scale index as a parameterization, with an intrinsic time obtained from `integral dg / beta(g)`.

Both are currently conceptual. They should remain heuristic or speculative unless they rewrite an existing bound in a way that changes a formal target.

## 7. Local-To-Global Obstruction Taxonomy

The batch proposes a taxonomy: local structure plus integrability yields global order; obstruction has a local witness. Examples include closed timelike curves for global time, forbidden poles for positive Stieltjes representations, and nonpositive modes for coercive covariance. This is an essay-level organizing bridge until it yields a reusable formal lemma.

## Immediate Priority

For Yang-Mills, the highest-leverage path is:

```text
Gaussian collar G0/G1
-> concrete P4 raw activity producer
-> rooted Appendix-F bookkeeping
-> hRpoly consumer
```

The RH and Penrose/Stieltjes material is valuable as a shared formal-method library, but it must not be framed as an implication between RH and Yang-Mills.
