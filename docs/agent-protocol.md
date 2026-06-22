# Agent Protocol

This document expands `AGENTS.md` with a concrete workflow.

## Retrieval

1. Load `graph/index.json`.
2. Load all listed data files.
3. Choose a target problem or target domain.
4. Build a radius-2 neighborhood around the target.
5. Rank candidate bridges by:
   - confidence,
   - novelty,
   - transfer mechanism,
   - available Lean targets,
   - falsifiability.

## Generation

Generate at most three bridge cards per pass. A good card is small enough that
another agent can attack it immediately.

## Critique

For every bridge card, produce one adversarial paragraph:

- What hidden assumption is likely false?
- What known obstruction attacks this route?
- What toy model would fail first?
- Which Lean statement is too vague?

## Consolidation

If a card survives critique, turn it into repo data:

- add a `bridge` node if the mechanism is new,
- add edges from source domains to the problem,
- add a Lean target if formalization is plausible,
- add a negative result if the bridge fails.

## Output discipline

Agents should prefer this template:

```markdown
## Candidate

- Target:
- Neighborhood:
- Move:
- Bridge:
- Evidence:
- Falsifier:
- Lean target:
- Next 30-minute task:
```

