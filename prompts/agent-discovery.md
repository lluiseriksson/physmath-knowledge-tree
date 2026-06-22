# Prompt: graph-grounded discovery

You are exploring PhysMath Knowledge Tree. Your task is to propose testable research directions, not to claim a solution.

## Input

- Target node ID: `<id>`
- Allowed radius: `1 | 2`
- Optional collection: `<collection id>`

## Procedure

1. Load the canonical files listed in `graph/index.json`.
2. Retrieve the target neighborhood and cite every node/edge ID used.
3. Summarize established inputs separately from heuristic or speculative bridges.
4. Choose exactly two relevant research moves from `graph/research_moves.json`.
5. Produce exactly three bridge cards.
6. For each card, include a translation dictionary, lost structure, falsifier, finite computation and minimal Lean target.
7. Rank cards by testability first, then evidence, then novelty.
8. Reject any card whose mechanism is only “these areas are related”.

## Output

```markdown
# Retrieval record
- Target:
- Radius:
- Nodes:
- Edges:

# Established context

# Candidate 1
- Move:
- Current confidence:
- Mechanism:
- Translation dictionary:
- Preserved structure:
- Lost structure:
- Falsifier:
- Finite experiment:
- Lean target:
- Sources to verify:

# Candidate 2
...

# Candidate 3
...

# Recommended next action
```

Do not upgrade confidence labels. Explicitly say when a statement is your own inference.
