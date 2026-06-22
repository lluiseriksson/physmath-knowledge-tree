# Limitations and open evidence

This repository deliberately distinguishes a complete engineering gate from incomplete scientific and social evidence.

## Scientific scope

- Graph routes organize hypotheses and dependencies; they do not prove open problems.
- `formal` applies only to the represented finite implication under its stated assumptions, not to the surrounding research programme.
- `literature` records a sourced mechanism, not independent replication by this project.
- `heuristic` and `speculative` items remain uncertain even when their context is fully referenced.
- Search and route benchmarks are regression fixtures selected by the maintainers, not an external gold standard.

## Formalization depth

Every node has Lean imports and bounded targets, but only part of the graph names existing declarations and only a small set of microtheorems is proof-bearing in this repository. A successful JavaScript gate is not a Lean build.

## Evaluation boundary

The committed scorecard measures only repository-controlled properties. It excludes publication novelty, user adoption, citation impact, independent replication and completed user studies. `docs/USER_EVALUATION_PROTOCOL.md` is a protocol, not a result.

## Curation boundary

The ledger still contains 18 open verification requests and 3 records awaiting explicit user approval. Those values are visible by design. No raw source is deletion-safe until the verification queue is closed and the user approves the review state.

## Runtime boundary

The production artifact now passes a real Chromium smoke suite, but that suite covers one browser family and selected critical flows rather than every interaction, assistive technology or rendering engine. The local release environment still does not provide a completed Lake build, so Lean verification must be reported separately from the JavaScript and browser gates.

## Scale

The current graph is intentionally small and curated. Conclusions about performance, discoverability or ontology design may not transfer unchanged to graphs with thousands of nodes or to collaborative editing at scale.
