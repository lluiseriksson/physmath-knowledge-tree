# Tensor-copy and time-normalization gate for a new Gibbs-sampler source

25 October2026. Directed reading, not an exhaustive literature review. No new manuscript, importance score or solved-problem claim.

## Literature and reading scope

Chen, Ding and Lu, [2610.31571v1](https://arxiv.org/abs/2610.31571v1), submitted22October2026, states size-independent functional inequalities for specified Gaussian KMS Gibbs samplers. We read the abstract, Theorem3.3 and Corollary7.1 with its short proof; the59-page proof was not fully audited. Theorem3.3 assumes contraction of sandwiched Renyi2 divergence for **all tensor powers and all states**, including correlated inputs. Corollary7.1 obtains that hypothesis from a class closed under independent copies, a tensor-sum generator with unchanged time normalization, and a common decay rate. These are sourced hypotheses, not new results here. Private HTML snapshot SHA256:06478b5e7c70b39309beceb61f4285ade24fef69b565b09e7780644cf1ca9df3; no source full text is redistributed.

## Small graph retrieved first

Target `domain.quantum_information_theory`, its directly connected recovery bridge and their incident edges were retrieved before this note. Graph proximity does not establish any channel-contraction theorem. Canonical nodes, edges, confidence labels and Lean declarations remain unchanged.

## Mechanism, hypotheses and rejected transfer

Dictionary: encoded reduction maps would supply a candidate map; a sampler time step would require a square CPTP map with a faithful fixed state. Those properties are not preserved by the analogy. Our two-reference encoding maps matrices of size d² to size d⁴. In its interesting d>=13 regime its Choi matrix has a negative direction, so the normalized map is not a channel. No tensor-power entropy statement follows from finite-order positivity. Even a square channel with a fixed state and spectral gap would still need the stated uniform Renyi2 contraction hypothesis.

An elementary control isolates that last gap. On dimension d, let L(X)=Tr(X)I/d-X. Its traceless eigenvalues are-1, independent of d. For a pure input, the time-log2 output is (rho+I/d)/2, and

`exp(D2(input||I/d))=d`, `exp(D2(output||I/d))=(d+3)/4`.

Their logarithmic ratio tends to1 as d grows. Equivalently, a contraction rate valid from time0 is at most `2(1-1/d)/log(d)`. Thus a constant spectral gap alone cannot supply a dimension-independent Renyi2 contraction rate. This is a standard elementary boundary example, not new science and not a counterexample to the cited theorem. Its global reset generator is not the source's local Gaussian sampler. The [own finite control](../checks/renyi466-depolarizing.py) uses exact fractions; displayed logarithms are numerical illustrations, while the limit follows analytically from the displayed formula.

## Next research gate and abandonment condition

`literature`: attributed tensor-copy theorem with its quantifiers. `heuristic`: compare our square GKLS maintenance models only after reading their exact generator definitions. `speculative`: a normalization-aware entropy/budget bridge. `formal`: no new Lean result in this update. Any useful bridge must prove a tensor-sum identity, faithful invariant state and copy-uniform rate in the **same** time/resource units. Abandon a claimed immediate transfer if any item is missing; do not replace these items by the phrase spectral gap or fast mixing. No novelty or rank threshold is inferred from finite tests.
