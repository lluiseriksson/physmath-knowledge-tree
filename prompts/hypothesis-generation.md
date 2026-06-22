# Prompt: Hypothesis Generation

Generate hypotheses using the chess-tree metaphor.

Input:

- target problem:
- current subgraph:
- allowed moves:
- maximum speculation level:

Output:

```markdown
## Hypothesis

- Claim shape:
- Source domains:
- Research move:
- Mechanism:
- Why this is not obviously impossible:
- First falsifier:
- Lean toy statement:
- Computation or search task:
- Confidence:
```

Rules:

- If confidence is `speculative`, say what would make you abandon it.
- If the move is an analogy, identify the dictionary.
- If the move is a duality, state what reverses.
- If the move is a formalization target, name likely mathlib imports.

