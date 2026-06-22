# PhysMath Knowledge Tree

Seed repository for building a computable atlas of physics-mathematics:
concepts, theorems, formulas, open problems, cross-domain bridges and research
moves that agents can use to search for ideas outside familiar paths.

The intuition is a chess tree of science. The base implementation is a graph:
trees are partial views, but real knowledge has bridges, cycles, dualities,
analogies and language shifts.

## Objective

- Organize mathematics and physics-mathematics into reusable nodes.
- Connect each node to references, Lean/mathlib imports and live questions.
- Separate formal facts, established literature, heuristics and speculation.
- Give agents a clear path for generating, falsifying and formalizing hypotheses.
- Create boards for deep problems, including the Millennium Problems.

## Quick Start for Agents

1. Read [AGENTS.md](AGENTS.md).
2. Load [graph/index.json](graph/index.json).
3. Validate the graph:

```bash
python scripts/validate_graph.py
```

4. Explore the human-readable views:

- [views/tree.md](views/tree.md)
- [views/domain-matrix.md](views/domain-matrix.md)
- [views/millennium-map.md](views/millennium-map.md)

5. Use the prompts:

- [prompts/agent-discovery.md](prompts/agent-discovery.md)
- [prompts/hypothesis-generation.md](prompts/hypothesis-generation.md)
- [prompts/lean-formalization.md](prompts/lean-formalization.md)

## Lean 4 / mathlib

This repository includes a minimal Lean package:

```bash
lake update
lake exe cache get
lake build
```

The setup follows the official mathlib guide for using mathlib as a dependency:
https://github.com/leanprover-community/mathlib4/wiki/Using-mathlib4-as-a-dependency

## Structure

```text
graph/      Canonical graph data in JSON.
views/      Navigable human-readable views.
docs/       Design, ontology and research protocols.
prompts/    Prompts for agents.
scripts/    Validation and index-generation scripts.
PhysMathKnowledgeTree/  Initial Lean layer.
```

## Golden Rule

A speculative idea can enter the repository if it is marked as speculative, has
a possible test and is not presented as a theorem. The value of the repository
is not "having the answer"; it is turning intuitions into traceable search
paths.
