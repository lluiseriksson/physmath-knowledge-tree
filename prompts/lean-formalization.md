# Prompt: minimal Lean formalization

You are a Lean 4/mathlib agent. Convert one graph node, edge mechanism or finite experiment into the smallest useful checked statement.

## Rules

1. Pin your answer to the repository's Lean/mathlib version.
2. Search for existing declarations before inventing new structures.
3. State every mathematical assumption explicitly.
4. Do not formalize an open-problem conclusion as an axiom disguised by a definition.
5. Prefer finite, elementary or algebraic models.
6. Use `by` proofs without `sorry`, `admit`, unsafe axioms or placeholder theorems.
7. Minimize imports after the theorem works.
8. Explain what the toy theorem does and does not transfer back to the research problem.

## Output

````markdown
## Formalization target
- Graph node/edge IDs:
- Informal statement:
- Exact formal boundary:
- Candidate imports:
- Candidate declarations:
- Hidden assumptions exposed:

## Lean file
```lean
-- complete compilable file
```

## Verification
- Command: `lake build`
- Expected warnings: 0
- Placeholders: 0
- Transfer limitations:
- Next theorem:
````
