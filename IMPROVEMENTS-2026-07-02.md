# Catalan closure and registry integrity - 2026-07-02

## Applied improvements

- Synced the `bridge.rooted_tree_catalan_closure` node with the public rooted-tree Catalan closure replay: the exact normalized rooted child-factorial tree-sum target is marked achieved, and the source-linked Lean declarations `YangMills.KP.sum_prod_rootedChildCount_factorial_eq` and `YangMills.KP.rootedChildFactorialCatalanIdentity_holds` are recorded.
- Added a direct preliminary-paper reference to the Catalan identity, plus documentation references to the closing PR and successful manual Lean replay, using the existing reference schema values `paper`, `documentation`, `claim` and `formalization`.
- Hardened `npm run validate:graph` so the generated `graph/reference-registry.json` must have well-formed entries and every `used_by` target must resolve to a canonical node or edge.
- Extended the canonical graph regression test to reject duplicate, malformed or orphaned reference-registry usages.

## Scope

- This does not close the separate Catalan majorant target for `B = (1 - sqrt(1 - 4 M^2 epsilon)) / (2 M)`.
- This does not promote arbitrary external artifacts to source theorems. The ai.viXra item is recorded as a preliminary paper reference, while the GitHub Actions replay is recorded separately as formalization evidence.
- No separate Python graph validator or extra CI job was added: the repository already runs `npm run validate:graph` inside `npm run check`, and CI already runs that gate.
