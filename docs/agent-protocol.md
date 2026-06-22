# Research-agent protocol

This document expands `AGENTS.md` into a reproducible workflow for humans and automated agents.

## 1. Retrieval

Load the canonical files declared by `graph/index.json`. Start from one target node and derive a radius-one or radius-two neighborhood from `graph/edges.json`. Use a curated collection only as a retrieval aid; collections do not add claims beyond their member nodes and canonical edges.

A retrieval record should contain:

```json
{
  "target": "problem.riemann_hypothesis",
  "radius": 2,
  "direction": "both",
  "node_ids": [],
  "edge_ids": [],
  "collection_ids": []
}
```

## 2. Epistemic separation

Keep these categories visibly separate:

- **Formal:** represented by a checked proof or definition in a stated formal environment.
- **Literature:** supported by established mathematical literature or an authoritative problem statement.
- **Heuristic:** useful structural guidance without a proof of the claimed transfer.
- **Speculative:** a new or weakly supported route that requires an explicit falsifier.

A node's confidence summarizes the status of the node description. An edge's confidence applies only to its stated mechanism. Neither label transfers automatically to downstream conclusions.

## 3. Bridge construction

For a proposed bridge, write a translation table.

| Source concept | Target concept | Preserved structure | Known loss |
| --- | --- | --- | --- |
| Example object | Candidate image | Invariant or law | Locality, positivity, computability, etc. |

Reject a bridge that only says two areas are “similar”. The mechanism must explain an operation, invariant, functor, transform, reduction, estimate, deformation or obstruction.

## 4. Falsification first

Before expansion, identify the cheapest test that could kill the idea:

- a finite counterexample;
- failure of self-adjointness, positivity or compactness;
- a functor forgetting the relevant invariant;
- a scaling mismatch;
- an already-known no-go theorem;
- a numerical signature inconsistent with the proposal;
- inability to state even a toy theorem without adding the conclusion as an assumption.

Negative results should be recorded as an `obstructs` edge, a note on an existing edge or a dated research log.

## 5. Formalization ladder

Prefer this order:

1. Specify finite data and invariants.
2. Prove a finite identity or monotonicity statement.
3. Generalize to algebraic or topological structure.
4. Introduce analytic limits only after assumptions are explicit.
5. Map the result to the original problem without overstating the transfer.

Lean targets in graph nodes are bounded entry points, not promises that the surrounding research problem is already formalized in mathlib.

## 6. Reproducible output

Every agent-generated proposal should include:

- exact node and edge IDs used;
- research move ID;
- confidence label and rationale;
- source URLs or citations requiring verification;
- falsifier;
- minimal Lean statement or finite experiment;
- deterministic prompt and tool/version notes when relevant.

The web app's bridge-card generator creates scaffolding only. Its output remains exploratory until reviewed.
