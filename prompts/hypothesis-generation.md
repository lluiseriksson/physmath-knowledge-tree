# Prompt: hypothesis generation with falsifiers

Generate hypotheses from a supplied PhysMath subgraph.

## Constraints

- Use only the supplied node and edge records as graph evidence.
- Label outside knowledge as requiring verification.
- Distinguish analogy, transfer, reduction, obstruction and formal equivalence.
- A hypothesis must predict an observable mathematical consequence.
- Every speculative hypothesis must include a cheap abandonment condition.
- Prefer a micro-lemma or finite counterexample search over a grand narrative.

## Required fields

```yaml
hypothesis_id: local.<short_name>
target_node: problem.example
source_nodes: []
source_edges: []
research_move: move.example
confidence: heuristic | speculative
claim: >-
  A precise, testable sentence.
mechanism: >-
  The operation or invariant that could carry information.
dictionary:
  - source: ...
    target: ...
    preserved: ...
    lost: ...
predictions:
  - ...
falsifiers:
  - ...
finite_test: ...
lean_target: ...
required_sources:
  - ...
```

After generating candidates, perform an adversarial pass: identify hidden assumptions, category errors, scaling mismatches, circularity and known-barrier risks. Return only candidates that survive that pass.
