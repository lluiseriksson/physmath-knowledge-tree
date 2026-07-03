# Catalan closure and registry integrity - 2026-07-02

## Applied improvements

- Synced the `bridge.rooted_tree_catalan_closure` node with the public rooted-tree Catalan closure replay: the exact normalized rooted child-factorial tree-sum target is marked achieved, and the source-linked Lean declarations `YangMills.KP.sum_prod_rootedChildCount_factorial_eq` and `YangMills.KP.rootedChildFactorialCatalanIdentity_holds` are recorded.
- Added a direct preliminary-paper reference to the Catalan identity, plus documentation references to the closing PR and successful manual Lean replay, using the existing reference schema values `paper`, `documentation`, `claim` and `formalization`.
- Hardened `npm run validate:graph` so the generated `graph/reference-registry.json` must have well-formed entries and every `used_by` target must resolve to a canonical node or edge.
- Extended the canonical graph regression test to reject duplicate, malformed or orphaned reference-registry usages.
- Added `scripts/validate_graph_integrity.py` as an independent Python graph-integrity validator and wired it into CI as a dedicated graph-integrity job.
- Added the heuristic bridge `bridge.semicircle_cluster_edge`, connecting exact Catalan closure, Fernandez-Procacci tree-counting refinements and random-matrix spectral-edge language without promoting the bridge to formal status.

## Scope

- This does not close the separate Catalan majorant target for `B = (1 - sqrt(1 - 4 M^2 epsilon)) / (2 M)`.
- This does not promote arbitrary external artifacts to source theorems. The ai.viXra item is recorded as a preliminary paper reference, while the GitHub Actions replay is recorded separately as formalization evidence.
- The Python graph validator complements the existing Node validator; the Node validator remains part of `npm run check`, and the Python job supplies an independent CI guard over JSON parsing, schema shape, edge endpoints, collection membership and reference-registry closure.
- The semicircle bridge remains heuristic until the truncated Catalan majorant recursion and finite-Stieltjes moment identity are formalized.
