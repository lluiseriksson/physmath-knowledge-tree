# Scientific Reference Upgrade

Date: **2026-06-22**

> **Status after release 2.5.0:** the reference phase described here is complete. The canonical graph now has scoped references on 58/58 nodes and 112/112 edges, with zero formal/literature claim-source debt. This document remains as the history of the first 45-edge pass. Current metrics are generated in `docs/GRAPH_AUDIT.md`.

This note records the targeted hardening pass made after the initial 2.4.0 integrity release. The aim is to raise the repository from a strong personal research graph toward a reusable scientific reference by improving the two weakest public signals: direct mathematical evidence and proof-bearing Lean content.

## Measurable changes

| Signal | Before | After |
| --- | ---: | ---: |
| Edges with direct references | 0/112 | 45/112 |
| Formal/literature edge citation debt | 95 | 51 |
| Formal nodes with named Lean declarations | 3 | 8 |
| Formal nodes without named Lean declarations | 8 | 3 |

The remaining debt is still listed in `docs/GRAPH_AUDIT.md`. The upgrade intentionally improves coverage without hiding unfinished verification work.

## Reference strategy

References were added first to edges that a scientific reviewer or research agent is most likely to inspect:

- Millennium-problem routes through the Clay Mathematics Institute problem pages and official problem-description PDFs;
- Perelman's Ricci-flow papers for the Poincare geometry route;
- Dimock's Balaban renormalization-group papers for constructive RG, polymer and target-preserving cluster mechanisms;
- Witten's AQFT entanglement notes for locality, Reeh-Schlieder and operator-algebraic QFT context;
- Fawzi-Renner and Sutter-Fawzi-Renner for conditional mutual information and uniform recovery.

Direct edge references are not a claim that the edge itself is a theorem. They identify the source context that justifies the edge's mechanism and evidence class.

## Lean strategy

`PhysMathKnowledgeTree/Formal/Microtheorems.lean` adds small theorems that can be checked independently:

- exact Appendix-F rate-budget bookkeeping;
- lattice/physical exponent conversion;
- coarse-budget equality after target erasure;
- finite nonselective-operation collapse after completeness;
- rooted child-factorial product congruence;
- ungraded localized-homotopy boundary identity.

These are deliberately finite or algebraic. They give agents concrete proof objects to inspect while preserving the boundary between formal facts, literature-supported claims and exploratory hypotheses.

## Remaining work after 2.5.0

Reference coverage is no longer the immediate bottleneck. The remaining priorities are:

- Lean declarations for `bridge.block_average_coercivity`, `bridge.gaussian_precision_markov_blanket` and `bridge.ward_defect_weight_variation`;
- independent review of reference-to-claim fit, especially for context-only exploratory edges;
- closing the 18 open curation verification requests and the 3 pending user-review gates;
- executing the user-evaluation protocol without fabricating outcomes;
- publishing signed GitHub releases after CI completes.
