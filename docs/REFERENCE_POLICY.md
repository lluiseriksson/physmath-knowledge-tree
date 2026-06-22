# Reference and evidence policy

The graph separates **traceability** from **epistemic strength**. Every canonical node and edge carries at least one reference, but a reference does not automatically turn an exploratory mechanism into an established theorem.

## Reference scopes

Each reference has one of three machine-readable scopes:

- `claim`: the source directly supports the represented definition, theorem, mechanism or problem statement.
- `context`: the source establishes the surrounding field or motivation, but does not directly prove the graph claim.
- `formalization`: the target is proof-bearing Lean code, a named declaration, or formal documentation for the encoded result.

The validators enforce the following rules:

1. Every node and edge has at least one reference.
2. Every `formal` or `literature` node and edge has at least one `claim` or `formalization` reference.
3. A `heuristic` or `speculative` item may intentionally be context-only.
4. Adding a reference never changes `confidence`; evidence promotion requires a separate, reviewable edit.
5. Speculative edges still require a falsifier, even when their surrounding literature is well sourced.

## Source selection

Prefer, in order:

1. a proof-bearing formalization or official declaration;
2. the primary paper establishing the result;
3. an authoritative monograph, survey or official problem statement;
4. a stable institutional source when the original is not openly accessible.

Avoid search-result pages, unsourced encyclopedic summaries and links whose relationship to the exact graph claim is unclear.

## Registry and audit

`graph/reference-registry.json` is generated from canonical data and deduplicates references by URL. `docs/GRAPH_AUDIT.md` reports both complete traceability and any source-bearing citation debt. Run:

```bash
npm run generate:audit
npm run validate:audit
```

## Interpretation boundary

A graph with 100% scoped reference coverage can still contain uncertain research directions. The authoritative indicators remain:

- `confidence` on nodes and edges;
- the explicit transfer `mechanism`;
- `notes` and falsifiers;
- bounded Lean targets;
- the distinction between `claim`, `context` and `formalization`.
