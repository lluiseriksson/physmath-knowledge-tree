# Ontology

The ontology is intentionally small. It should be easy for humans to maintain
and easy for agents to parse.

## Node kinds

- `domain`: broad area such as PDE, algebraic geometry or complexity theory.
- `theory`: coherent framework inside a domain.
- `concept`: reusable mathematical object or idea.
- `theorem`: established result.
- `formula`: equation, identity, transform or variational principle.
- `method`: proof technique or computational method.
- `problem`: open, solved or calibration problem.
- `bridge`: explicit cross-domain transfer mechanism.

## Confidence levels

- `formal`: formalized or directly formalizable with current proof artifacts.
- `literature`: accepted in standard mathematical or physical literature.
- `heuristic`: useful and disciplined, but not a theorem.
- `speculative`: possible research direction; must include a falsifier.

## Edge relations

- `depends_on`: target needs source.
- `generalizes`: source generalizes target.
- `specializes`: source is a special case of target.
- `analogy`: structural similarity, not necessarily a theorem.
- `dual`: duality or contravariant translation.
- `formalizes_as`: maps informal math to formal Lean targets.
- `transfers_via`: source knowledge transfers through a named bridge.
- `obstructs`: source explains a difficulty or barrier.
- `suggests`: source inspires a possible route.
- `tests`: source supplies a test case or falsifier.
- `uses`: target uses source as standard machinery.
- `bridge`: source acts as an explicit bridge to target.

## Required node fields

- `id`
- `kind`
- `title`
- `summary`
- `confidence`
- `tags`
- `lean`
- `questions`

## Required edge fields

- `id`
- `source`
- `target`
- `relation`
- `confidence`
- `mechanism`

## ID conventions

Use lowercase dotted IDs:

```text
domain.spectral_theory
problem.riemann_hypothesis
bridge.trace_formula_spectral_arithmetic
```

Do not rename IDs casually. Add aliases if a term changes.

