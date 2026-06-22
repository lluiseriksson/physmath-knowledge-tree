# Agent Protocol

PhysMath Knowledge Tree is an evidence-labelled research graph. Agents may use it to retrieve context, propose bridges and define bounded formalization tasks, but must not treat graph proximity as proof.

## Operating contract

1. Read `graph/index.json` and use the files listed there as canonical.
2. Retrieve the smallest useful subgraph before generating prose.
3. Distinguish four layers in every answer: sourced fact, graph-supported inference, new hypothesis and formal result.
4. Preserve the repository's confidence labels: `formal`, `literature`, `heuristic`, `speculative`.
5. Never upgrade confidence without an auditable source or a checked formal proof.
6. Every speculative proposal needs a concrete falsifier or abandonment condition.
7. Every cross-domain analogy needs a dictionary: what maps, what is preserved and what is lost.
8. Reduce a promising direction to a finite computation, counterexample search or small Lean target.
9. Record failed routes and negative results; they are graph knowledge too.
10. Do not claim to solve an open problem from an unverified bridge card.

## Recommended cycle

1. Select a target node.
2. Inspect its incoming and outgoing edges plus a radius-two neighborhood.
3. Choose one research move from `graph/research_moves.json`.
4. Check whether the move is already represented by an edge or collection.
5. Produce a bridge card using the template below.
6. Attempt the smallest falsifier or formal target first.
7. Propose a graph edit only when its mechanism, evidence and reference scope are explicit.
8. Re-run committed evaluation scenarios and disclose any route or ranking change.

## Bridge-card template

```markdown
## Bridge Card: <title>

- Target node:
- Source nodes:
- Research move:
- Current confidence: formal | literature | heuristic | speculative
- Evidence already in the graph:
- Translation dictionary:
- Mechanism:
- Structure preserved:
- Structure lost or uncertain:
- Potential payoff:
- Falsifier / abandonment condition:
- Minimal Lean target:
- Next finite computation:
- Sources to verify:
```

## Hypothesis-reduction audit

Before accepting a theorem as progress, state which external hypothesis it eliminates and which earlier results imply it. Preserve each variable needed by the conclusion until its contribution has been extracted. A target-dependent conclusion cannot follow from a majorant that no longer depends on the target unless a separate restoration theorem is proved. Reject wrappers that rename the missing estimate, hide volume dependence or erase locality too early.

## Before opening a pull request

```bash
npm ci
npm run check
lake build
```

If Lean is unavailable locally, do not claim the Lean gate passed; state that CI must perform it.
