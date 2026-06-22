# Architecture

PhysMath Knowledge Tree has four layers.

## 1. Knowledge graph

The canonical data lives in `graph/`.

- `nodes/core.json`: concepts, domains, bridges and problems.
- `edges.json`: typed relations between nodes.
- `research_moves.json`: reusable operations for generating candidate ideas.
- `schemas/`: lightweight JSON schemas.

The graph is the source of truth. Trees, matrices and problem boards are views.

## 2. Human views

The files in `views/` make the graph readable:

- `tree.md`: a first navigational tree.
- `domain-matrix.md`: cross-domain move matrix.
- `millennium-map.md`: problem-oriented board.
- `generated-index.md`: generated from JSON by script.

## 3. Lean spine

The Lean files define a tiny vocabulary for nodes, edges and problem cards.
This is not meant to formalize all mathematics at once. It creates an anchor
where future work can attach precise mathlib imports and declarations.

## 4. Agent layer

Agents should use the graph as retrieval memory and the prompts as protocols.
Every generated idea should return to the graph as either:

- a new node,
- a new edge,
- a new research move,
- a rejected hypothesis with a useful falsifier,
- or a Lean target.

## Chess-tree metaphor

A position is a small subgraph. A legal move is an operation such as
`spectralize`, `categorify`, `dualize`, `local_to_global` or `renormalize`.
The output is not a theorem by default. It is a candidate path with evidence,
risk and a next test.

