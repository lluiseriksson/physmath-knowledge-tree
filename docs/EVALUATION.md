# Automated repository evaluation

This report is generated deterministically from canonical graph data and committed scenarios. It evaluates retrieval, route reproducibility, traceability and repository-controlled quality; it does not evaluate scientific novelty or prove exploratory mechanisms.

## Summary

- Controlled quality score: **100/100**.
- Search top-1 accuracy: **100.00%** (14 cases).
- Search recall@3: **100.00%**.
- Mean reciprocal rank: **1.0000**.
- Route scenarios passing: **5/5**.
- Nodes with references: **58/58**.
- Edges with references: **112/112**.
- Formal/literature node claim coverage: **55/55**.
- Formal/literature edge claim coverage: **95/95**.
- Nodes with bounded Lean targets: **58/58**.

## Search regressions

| Case | Query | Expected | Rank | Pass |
| --- | --- | --- | ---: | :---: |
| `search.riemann_hypothesis` | Riemann Hypothesis | `problem.riemann_hypothesis` | 1 | yes |
| `search.mass_gap` | mass gap | `problem.yang_mills_mass_gap` | 1 | yes |
| `search.navier_stokes` | Navier Stokes | `problem.navier_stokes` | 1 | yes |
| `search.hodge_conjecture` | Hodge Conjecture | `problem.hodge_conjecture` | 1 | yes |
| `search.polymer_expansions` | polymer cluster expansions | `domain.polymer_cluster_expansions` | 1 | yes |
| `search.cmi_recovery` | conditional mutual information | `bridge.conditional_mutual_information_recovery` | 1 | yes |
| `search.no_signalling` | no signalling | `bridge.local_operations_no_signalling` | 1 | yes |
| `search.catalan_closure` | Catalan closure | `bridge.rooted_tree_catalan_closure` | 1 | yes |
| `search.renormalization_group` | renormalization group | `domain.renormalization_group` | 1 | yes |
| `search.geometric_langlands` | geometric Langlands | `bridge.geometric_langlands_transfer` | 1 | yes |
| `search.optimal_transport` | optimal transport | `domain.optimal_transport` | 1 | yes |
| `search.aqft` | algebraic quantum field theory | `domain.algebraic_quantum_field_theory` | 1 | yes |
| `search.proof_complexity` | proof complexity geometry | `bridge.proof_complexity_geometry` | 1 | yes |
| `search.block_coercivity` | block average coercivity | `bridge.block_average_coercivity` | 1 | yes |

## Route regressions

| Scenario | Edges | Evidence gate | References | Terminal | Pass |
| --- | ---: | :---: | :---: | :---: | :---: |
| `route.spectral_arithmetic_rh` | 3 | yes | yes | yes | yes |
| `route.critical_pde_navier_stokes` | 3 | yes | yes | yes | yes |
| `route.target_sensitive_yang_mills` | 7 | yes | yes | yes | yes |
| `route.aqft_no_signalling` | 1 | yes | yes | yes | yes |
| `route.qinfo_recovery` | 1 | yes | yes | yes | yes |

## Interpretation

Passing scenarios are regression fixtures: they show that the declared route is still retrievable under the stated direction, evidence and length constraints. They do not establish that the terminal research problem is solved or that the route is novel.

