# Graph evidence and integrity audit

Generated deterministically from the canonical graph and curation ledger. Reference coverage is reported separately from evidence strength: a contextual source never upgrades a heuristic or speculative claim.

## Integrity

- Nodes: **58**; edges: **112**; moves: **23**; collections: **8**.
- Weakly connected components: **1**; nodes reachable from declared roots: **58/58**.
- Isolated nodes: **0**.

## Reference coverage

- Nodes with at least one reference: **58/58**.
- Edges with at least one reference: **112/112**.
- Formal/literature nodes with a claim or formalization source: **55/55**.
- Formal/literature edges with a claim or formalization source: **95/95**.
- Unique normalized reference URLs: **56**.
- Context-only nodes: **3**; context-only edges: **17**.
- Formal nodes with named Lean declarations: **8**.

Reference scopes are defined in [`REFERENCE_POLICY.md`](./REFERENCE_POLICY.md): `claim` directly supports the represented statement, `context` is background only, and `formalization` points to proof-bearing code or a named declaration.

> Complete reference coverage is a traceability property, not a certification that every graph mechanism is a theorem. Evidence labels and falsifiers remain authoritative.

## Curation state

- Open source-verification requests: **18**.
- Records awaiting explicit user review: **3**.

The two values above are deliberately not forced to zero: only the user can approve source deletion, and unresolved verification requests remain visible.

## Highest-degree nodes

| Node | Degree |
| --- | ---: |
| `problem.uniform_yang_mills_rg_activity` | 10 |
| `domain.renormalization_group` | 9 |
| `domain.quantum_field_theory` | 8 |
| `problem.yang_mills_mass_gap` | 8 |
| `bridge.cluster_expansion_with_holes` | 7 |
| `domain.algebraic_geometry` | 6 |
| `domain.automorphic_forms` | 6 |
| `domain.constructive_quantum_field_theory` | 6 |
| `domain.polymer_cluster_expansions` | 6 |
| `domain.probability_stochastics` | 6 |

## Formal/literature node citation debt (0)

No formal/literature node lacks a claim or formalization reference.

## Formal/literature edge citation debt (0)

No formal/literature edge lacks a claim or formalization reference.

## Context-only exploratory items

These items deliberately remain heuristic or speculative and use references only to define their surrounding literature:

- node `bridge.random_matrix_zeta_spectra`
- node `bridge.renormalization_scaling_pde`
- node `domain.quantum_field_theory`
- edge `edge.algebraic.proof_geometry_bridge`
- edge `edge.aqft.cmi_recovery`
- edge `edge.block_coercivity.ym_rg_activity`
- edge `edge.category.pnp`
- edge `edge.gaussian_collar.ym_rg_activity`
- edge `edge.langlands.hodge`
- edge `edge.localized_homotopy.ym_activity`
- edge `edge.ncg.riemann`
- edge `edge.poincare.navier`
- edge `edge.probability.navier`
- edge `edge.qft.renormalization_bridge`
- edge `edge.random_matrix.riemann`
- edge `edge.renormalization.navier`
- edge `edge.spectral.riemann`
- edge `edge.symplectic.qft`
- edge `edge.ward_defect.ym_rg_activity`
- edge `edge.ym_rg_activity.yang_mills`

