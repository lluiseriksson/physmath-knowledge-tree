# Graph ontology

The ontology is deliberately small so that data remains auditable by humans, scripts and agents.

## Stable identifiers

Identifiers are lowercase, dotted and immutable once published:

```text
domain.spectral_theory
bridge.trace_formula_spectral_arithmetic
problem.riemann_hypothesis
edge.trace.riemann
move.spectralize
collection.millennium
```

Rename presentation titles freely when accuracy improves, but preserve IDs. For a genuine concept split, add new nodes and explicit edges rather than silently changing the meaning of an old ID.

## Node kinds

- `domain`: a reusable mathematical or physical area.
- `bridge`: an explicit transfer mechanism between areas.
- `problem`: a named open, solved or calibration problem.

Every node contains a title, operational summary, evidence confidence, tags, live questions and bounded Lean metadata. Problem nodes additionally carry `status`. Every node also carries at least one scoped reference. `claim` sources directly support the represented statement, `context` sources only define the surrounding literature, and `formalization` sources identify proof-bearing code or declarations.

## Edge semantics

An edge is a directed claim with a mechanism. Supported relations are:

| Relation | Intended reading |
| --- | --- |
| `depends_on` | The target requires the source prerequisite. |
| `generalizes` | The target extends or abstracts the source. |
| `specializes` | The target is a constrained instance of the source. |
| `analogy` | A stated dictionary compares structures without asserting equivalence. |
| `dual` | The target reverses or dualizes a specified structure. |
| `formalizes_as` | The target is encoded by the source formal object or language. |
| `transfers_via` | A named operation transports information. |
| `obstructs` | The source blocks or limits the target route. |
| `suggests` | The source motivates a testable target direction. |
| `tests` | The source acts as a calibration or falsification case. |
| `uses` | The target directly uses tools or objects from the source. |
| `bridge` | A broad but explicit cross-domain mechanism. |

Do not infer a converse edge. Do not infer transitivity unless the relation and preserved structure justify it.

## Confidence

- `formal`: checked in an identified formal system or mechanically verified artifact.
- `literature`: established and traceable to reliable literature.
- `heuristic`: plausible and useful, but the transfer is not established.
- `speculative`: exploratory and paired with a falsifier.

Confidence is local to one record. A literature-grade source feeding a heuristic edge does not make the edge literature-grade.

## Lean metadata

Each node's `lean` object has:

- `imports`: candidate or verified mathlib modules;
- `declarations`: relevant declaration names;
- `targets`: small formalization tasks.

These fields are navigation metadata. The repository's Lean package formalizes the graph ontology and a few typed cards, not the full mathematical content of every node.

## Collections and research moves

Collections are curated node sets for retrieval and UI filtering. They add no new mathematical claims.

Research moves are reusable operations such as spectralization, categorification, dualization, finitzation and barrier finding. A move generates a question or experiment, never a theorem by itself.

## Reference scopes

Reference coverage and confidence are independent dimensions. Every node and edge must have a reference; `formal` and `literature` items require at least one `claim` or `formalization` source. Heuristic and speculative items may remain context-only, and adding a source does not promote their confidence. See `docs/REFERENCE_POLICY.md`.
