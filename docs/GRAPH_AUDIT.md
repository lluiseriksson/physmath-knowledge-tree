# Graph evidence and integrity audit

Generated deterministically from the canonical graph and curation ledger. This report exposes citation debt instead of silently treating every edge as independently sourced.

## Integrity

- Nodes: **58**; edges: **112**; moves: **23**; collections: **8**.
- Weakly connected components: **1**; nodes reachable from declared roots: **58/58**.
- Isolated nodes: **0**.

## Evidence coverage

- Nodes with direct references: **15/58**.
- Edges with direct references: **45/112**.
- Formal nodes with named Lean declarations: **8**.
- Open source-verification requests in the curation ledger: **18**.
- Curation records awaiting explicit user review: **3**.

> A `formal` label means the represented implication is elementary or formal under stated assumptions; it does not mean the entire surrounding research programme has been formalized.

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

## Node citation debt (40)

- `bridge.block_average_coercivity`
- `bridge.cluster_expansion_with_holes`
- `bridge.gaussian_covariance_collar`
- `bridge.gaussian_precision_markov_blanket`
- `bridge.geometric_langlands_transfer`
- `bridge.lattice_physical_scaling`
- `bridge.local_operations_no_signalling`
- `bridge.localized_homotopy_boundary_defect`
- `bridge.motives_periods_hodge`
- `bridge.proof_complexity_geometry`
- `bridge.rooted_tree_catalan_closure`
- `bridge.target_erasure_diagnostic`
- `bridge.trace_formula_spectral_arithmetic`
- `bridge.ward_defect_weight_variation`
- `bridge.yang_mills_critical_dimension`
- `domain.algebra`
- `domain.algebraic_geometry`
- `domain.analysis`
- `domain.arithmetic_geometry`
- `domain.automorphic_forms`
- `domain.category_theory`
- `domain.complexity_theory`
- `domain.constructive_quantum_field_theory`
- `domain.differential_geometry`
- `domain.foundation_logic`
- `domain.functional_analysis`
- `domain.gauge_theory`
- `domain.general_relativity`
- `domain.harmonic_analysis`
- `domain.noncommutative_geometry`
- `domain.number_theory`
- `domain.optimal_transport`
- `domain.pde`
- `domain.polymer_cluster_expansions`
- `domain.probability_stochastics`
- `domain.renormalization_group`
- `domain.representation_theory`
- `domain.spectral_theory`
- `domain.symplectic_geometry`
- `domain.topology`

## Edge citation debt (51)

Edges currently state mechanisms and evidence classes, but most inherit their source context from node references and curation records. Direct edge references should be added during primary-source verification.

- `edge.algebra.representation`
- `edge.algebra.ward_defect`
- `edge.algebraic.arithmetic`
- `edge.algebraic.langlands_bridge`
- `edge.algebraic.motives_bridge`
- `edge.analysis.constructive_qft`
- `edge.analysis.functional_analysis`
- `edge.analysis.harmonic`
- `edge.aqft.no_signalling`
- `edge.arithmetic.motives_bridge`
- `edge.automorphic.number`
- `edge.automorphic.trace_bridge`
- `edge.category.algebra`
- `edge.category.algebraic_geometry`
- `edge.cluster_holes.ym_rg_activity`
- `edge.complexity.proof_geometry_bridge`
- `edge.constructive_qft.ym_rg_activity`
- `edge.foundation.category`
- `edge.functional.block_coercivity`
- `edge.functional.spectral`
- `edge.gauge.qft`
- `edge.gauge.ym_rg_activity`
- `edge.gaussian_markov.collar`
- `edge.geometry.gauge`
- `edge.geometry.relativity`
- `edge.harmonic.pde`
- `edge.langlands.automorphic`
- `edge.lattice_scaling.yang_mills`
- `edge.ncg.qft`
- `edge.number.arithmetic`
- `edge.number.trace_bridge`
- `edge.optimal_transport.pde`
- `edge.pde.renormalization_bridge`
- `edge.polymer.target_erasure_diagnostic`
- `edge.probability.constructive_qft`
- `edge.probability.gaussian_collar`
- `edge.probability.gaussian_markov_blanket`
- `edge.probability.pde`
- `edge.probability.random_matrix_bridge`
- `edge.qft.constructive_qft`
- `edge.qinfo.no_signalling`
- `edge.representation.automorphic`
- `edge.representation.langlands_bridge`
- `edge.rg.lattice_scaling`
- `edge.rg.localized_homotopy_defect`
- `edge.rg.ym_rg_activity`
- `edge.spectral.random_matrix_bridge`
- `edge.spectral.trace_bridge`
- `edge.target_erasure.cluster_holes`
- `edge.target_erasure.target_preserving`
- `edge.topology.geometry`

