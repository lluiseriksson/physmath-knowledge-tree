# Statement of need

Researchers moving between mathematical physics, pure mathematics and formal proof face a recurring navigation problem. Literature databases organize papers; theorem search tools organize formal declarations; network packages visualize arbitrary graphs. None of those layers alone records a small, inspectable chain from a research question to:

- the mathematical domains it depends on;
- the precise mechanism proposed at each bridge;
- the strength of the evidence;
- an explicit way the proposal could fail;
- a bounded computational or Lean target.

PhysMath Knowledge Tree addresses that gap with a dependency-free, evidence-labelled graph whose JSON is canonical and whose web interfaces are derived views. It is intended for researchers, students and agents who need to explore cross-domain routes without silently collapsing literature, heuristic analogy and formal proof into one category.

## Intended uses

1. Retrieve a small subgraph around a problem instead of producing an unbounded literature narrative.
2. Compare multiple routes while preserving edge direction, evidence class and source scope.
3. Turn a promising bridge into a finite calculation, verification request or Lean micro-target.
4. Record negative results, broken analogies and unresolved source questions as first-class data.
5. Build reproducible teaching paths from prerequisites to advanced topics.

## Design requirements

The repository therefore prioritizes:

- stable identifiers and versioned schemas;
- mechanism-bearing edges rather than generic “related to” links;
- scoped references and visible citation debt;
- deterministic generation, evaluation and build artifacts;
- offline operation without third-party runtime scripts;
- accessible graph alternatives;
- a modest Lean spine that does not overstate formalization depth.

## Non-goals

The project is not a proof of any open problem, a substitute for primary literature, an automated novelty detector or a claim that graph proximity implies mathematical validity. Its evaluation measures retrieval, traceability and reproducibility—not the truth of speculative research programmes.
