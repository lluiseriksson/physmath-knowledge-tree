# Agent Protocol

This repository is designed for agents searching for deep mathematical
connections, especially when a direct attack gets stuck.

## Operating Contract

1. Do not confuse speculation with truth.
2. Every proposal must declare its source nodes, bridge, evidence type,
   possible falsifier and next Lean target.
3. Prefer small, verifiable maps over huge narratives.
4. When using mathlib, cite candidate imports and declarations.
5. If an idea depends on non-rigorous physics, label it as `heuristic` or
   `speculative`.

## Recommended Cycle

1. Choose a problem or domain in `graph/nodes/core.json`.
2. Retrieve nodes at distance 1 and 2 using `graph/edges.json`.
3. Apply 2 or 3 moves from `graph/research_moves.json`.
4. Produce a bridge card:
   - problem
   - combined domains
   - transfer mechanism
   - why it might work
   - what could destroy it
   - minimal Lean target
5. If the idea survives, create a PR with:
   - new node or edge
   - evidence
   - reproducible prompt
   - partial formalization, if one exists

## Output Format for Ideas

```markdown
## Bridge Card: <title>

- Source nodes:
- Target problem:
- Move:
- Confidence: formal | literature | heuristic | speculative
- Mechanism:
- Possible payoff:
- Falsifier:
- Lean target:
- Next computation:
```

## Useful Prohibitions

- Do not use "it seems deep" as evidence.
- Do not mix notation from different domains without writing the translator.
- Do not propose a grand theory before you can formulate a micro-lemma.
- Do not erase uncertainty: name it.
