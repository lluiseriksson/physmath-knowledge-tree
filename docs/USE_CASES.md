# Reproducible research-route cases

Each case is defined in `evaluation/scenarios.json` and reconstructed with deterministic shortest-path search. Run `npm run usecase -- <scenario-id>` to reproduce one route.

## Spectral-arithmetic route to the Riemann Hypothesis

**Scenario:** `route.spectral_arithmetic_rh`

How can spectral theory and trace-formula mechanisms organize a bounded route toward the Riemann Hypothesis without treating the Hilbert-Pólya heuristic as a theorem?

| Step | Type | Identifier | Evidence | Reference scope |
| ---: | --- | --- | --- | --- |
| 1 | node | `domain.functional_analysis` | literature | claim |
| 1→2 | edge | `edge.functional.spectral` | literature | claim |
| 2 | node | `domain.spectral_theory` | literature | claim |
| 2→3 | edge | `edge.spectral.trace_bridge` | literature | claim |
| 3 | node | `bridge.trace_formula_spectral_arithmetic` | literature | claim |
| 3→4 | edge | `edge.trace.riemann` | literature | claim |
| 4 | node | `problem.riemann_hypothesis` | literature | claim |

**Bounded next target**

Formalize finite Euler-product and explicit-formula toy statements.

**Boundary**

This route is a reproducible navigation result. Its evidence labels and source scopes must be preserved when interpreting or extending it.

## Analysis route to Navier-Stokes

**Scenario:** `route.critical_pde_navier_stokes`

Which established analysis layers connect harmonic estimates to the Navier-Stokes problem before speculative renormalization analogies are introduced?

| Step | Type | Identifier | Evidence | Reference scope |
| ---: | --- | --- | --- | --- |
| 1 | node | `domain.analysis` | literature | claim |
| 1→2 | edge | `edge.analysis.harmonic` | literature | claim |
| 2 | node | `domain.harmonic_analysis` | literature | claim |
| 2→3 | edge | `edge.harmonic.pde` | literature | claim |
| 3 | node | `domain.pde` | literature | claim |
| 3→4 | edge | `edge.pde.navier` | literature | claim |
| 4 | node | `problem.navier_stokes` | literature | claim |

**Bounded next target**

Formalize a simplified energy inequality with explicit norms.

**Boundary**

This route is a reproducible navigation result. Its evidence labels and source scopes must be preserved when interpreting or extending it.

## Target-sensitive constructive Yang-Mills route

**Scenario:** `route.target_sensitive_yang_mills`

How can a target-preserving polymer expansion retain the marked observable through rooted-tree summation and the Appendix-F rate budget?

| Step | Type | Identifier | Evidence | Reference scope |
| ---: | --- | --- | --- | --- |
| 1 | node | `domain.polymer_cluster_expansions` | literature | claim |
| 1→2 | edge | `edge.polymer.target_erasure_diagnostic` | formal | claim |
| 2 | node | `bridge.target_erasure_diagnostic` | formal | claim |
| 2→3 | edge | `edge.target_erasure.target_preserving` | formal | claim |
| 3 | node | `bridge.target_preserving_ursell_summation` | formal | claim |
| 3→4 | edge | `edge.target_preserving.rooted_leaf` | formal | claim |
| 4 | node | `bridge.rooted_leaf_factorial_moments` | formal | claim |
| 4→5 | edge | `edge.rooted_leaf.catalan_closure` | formal | claim |
| 5 | node | `bridge.rooted_tree_catalan_closure` | formal | claim |
| 5→6 | edge | `edge.catalan.rate_budget` | formal | claim |
| 6 | node | `bridge.appendix_f_rate_budget_split` | formal | claim |
| 6→7 | edge | `edge.rate_budget.cluster_holes` | formal | claim |
| 7 | node | `bridge.cluster_expansion_with_holes` | literature | claim |
| 7→8 | edge | `edge.cluster_holes.ym_rg_activity` | literature | claim |
| 8 | node | `problem.uniform_yang_mills_rg_activity` | literature | claim |

**Bounded next target**

Define the one-step gauge fluctuation identity and concrete raw activity before stating its decay.

**Boundary**

This route is a reproducible navigation result. Its evidence labels and source scopes must be preserved when interpreting or extending it.

## AQFT locality to no-signalling

**Scenario:** `route.aqft_no_signalling`

What finite formal mechanism expresses that a local nonselective operation preserves spacelike statistics?

| Step | Type | Identifier | Evidence | Reference scope |
| ---: | --- | --- | --- | --- |
| 1 | node | `domain.algebraic_quantum_field_theory` | literature | claim |
| 1→2 | edge | `edge.aqft.no_signalling` | formal | claim |
| 2 | node | `bridge.local_operations_no_signalling` | formal | claim |

**Bounded next target**

Prove the finite matrix identity sum_i omega(K_i† Y K_i) = omega(Y) from commutation and sum_i K_i†K_i = 1.

**Boundary**

This route is a reproducible navigation result. Its evidence labels and source scopes must be preserved when interpreting or extending it.

## Quantum-information recovery route

**Scenario:** `route.qinfo_recovery`

Which literature-backed bridge turns small conditional mutual information into an explicit recovery target?

| Step | Type | Identifier | Evidence | Reference scope |
| ---: | --- | --- | --- | --- |
| 1 | node | `domain.quantum_information_theory` | literature | claim |
| 1→2 | edge | `edge.qinfo.cmi_recovery` | literature | claim |
| 2 | node | `bridge.conditional_mutual_information_recovery` | literature | claim |

**Bounded next target**

State a finite-dimensional recovery interface with an explicit reference system and uniform channel quantifiers.

**Boundary**

This route is a reproducible navigation result. Its evidence labels and source scopes must be preserved when interpreting or extending it.

