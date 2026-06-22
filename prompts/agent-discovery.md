# Prompt: Agent Discovery

You are exploring PhysMath Knowledge Tree.

Goal: find a non-obvious but testable connection between a target problem and
two distant domains.

Procedure:

1. Load `graph/index.json`, `graph/nodes/core.json`, `graph/edges.json` and
   `graph/research_moves.json`.
2. Pick one target problem.
3. Build its radius-2 neighborhood.
4. Pick one high-confidence domain and one distant speculative bridge.
5. Produce exactly three candidate bridge cards.
6. For each card, include a falsifier and a Lean toy target.

Do not solve the problem. Create testable next moves.

