# Exact-counting claim: selected two-adic kernel checks

This is a directed primary-source checkpoint, not an exhaustive sweep, a new paper or a validation of an ETH refutation. The OpenAI manuscript is pinned to commit `7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a`; its title is an upstream claim, not a conclusion of this graph. Canonical graph nodes, confidence labels and the status of P vs NP are unchanged.

## Evidence layers and reading scope

- **Literature:** the upstream abstract and main theorem explicitly claim deterministic *exact counting* of fixed-width CNF assignments in subexponential time and polynomial space. This is stronger than a decision-only statement. The appendix states a Boolean tensor contraction theorem with at most C s wires, maximum degree at most ceil(s^(9/10)), precision and polynomial truncation parameters at most C s, and a uniform local-entry evaluation bound. These are stated hypotheses, not optional implementation details. [Pinned source directory](https://github.com/openai/math/tree/7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a/preprints/The-Exponential-Time-Hypothesis-is-False-October-25-2026).
- **Graph-supported context:** the retrieved radius-one complexity subgraph contains3nodes and2edges about resource bounds, reductions and barriers. It supplies a research vocabulary, not evidence for the source theorem.
- **Heuristic / bounded computation:** independent exact arithmetic checks pass on5,220 active Hermite nodes,1,168 shifted Cauchy polynomials,17,472 rational coefficients and84 zero-value identities. The script uses integer arithmetic and Python Fraction; no floating tolerance or model score is involved. These are finite falsifiers for two selected lemmas, not an implementation or asymptotic analysis of the complete algorithm.
- **Speculative:** exploiting the contraction mechanism for a new problem would require a genuinely missing hypothesis reduction or a new theorem. No such result is established here. In particular, a generic weighted-tensor corollary is not treated as a new contribution: the source already states a ring-valued contraction interface.
- **Formal:** no new Lean declaration or replay was completed. Existing graph confidence is not promoted.

## Bridge card: precision budgets before downstream applications

- Target node: `domain.complexity_theory`.
- Source nodes: the3-node radius-one context in `SUBGRAPH875.json`; the pinned upstream manuscript is external literature, not a new canonical graph node.
- Research move: inspect the quantitative invariant before transferring an algorithm through a reduction.
- Translation dictionary: CNF occurrences map to Boolean tensor ports; equality gadgets preserve assignments; ring-valued contractions preserve the encoded count modulo the declared precision. Arbitrary coefficient bit length and arbitrary-degree oracle tensors are **not** supplied by this dictionary.
- Mechanism: a Cauchy deformation makes a selected node local; crossing terms expand into modes with two-adic divisibility. Tapered Hermite multiplicities control the precision needed to recover the original contraction. The source budgets the number of retained mode monomials using that precision bound.
- Hypotheses retained: wire count, degree bound, coefficient-ring precision/truncation bounds, local entry evaluation cost, and recursive description/canonical-lift conventions.
- Structure lost or uncertain: the remaining child-network construction and its full recursive cost proof have not been audited here. Replacing bounded precision by arbitrary input precision requires new analysis; no such extension is asserted.
- Potential payoff: determine whether a proposed application really eliminates an input restriction or merely renames a theorem already present upstream. No predicted AIRR grade follows.
- Falsifier / abandonment condition: reject the selected lemma if an exact valid-parameter identity fails; reject a downstream use if it drops the precision, degree or description-cost condition without proof; abandon a standalone corollary if the source already covers the same instance class.
- Minimal formal target: finite-grid two-adic valuation identity, with every nonzero node and its excluded factors specified. It is a prospective target, not a completed formal result.
- Next finite computation: reconstruct an entire small tensor contraction through the stated child-network recursion and compare it to direct enumeration, preserving entry creation precision. The current script tests only the local Cauchy and Hermite modules.

## Reproduction and provenance

The original checker is byte-preserved, including its native C:/D: archival paths, and is not presented as a portable runner. Review or run it only in its documented native workspace. It uses the Python standard library. CHECK875.json records the original script hash; UTC and elapsed time are observations. A portable replay wrapper has not been provided for this checkpoint. This is a bounded audit log, not a Research Capsule or complete reproducible algorithm campaign.

See [reading ledger](../evidence/2026-10-27-eth875/READING875.json), [native finite result](../evidence/2026-10-27-eth875/CHECK875.json), [source acquisition hashes and license evidence](../evidence/2026-10-27-eth875/SOURCE874.json) and [retrieved context](../evidence/2026-10-27-eth875/SUBGRAPH875.json). The six upstream source/license files remain in the separate local reading dossier; no foreign research bodies, credentials or corpus shards are copied into this repository. Manual reading does not authorize training ingestion or change source-governance decisions.

Public JSON text copies normalize CRLF to LF only. [Native archive and hashes](../evidence/2026-10-27-eth875/NATIVE-MANIFEST875.json) preserve original own-checker bytes and JSON bytes in native-json875.zip; parsed JSON values are unchanged. No source body is included.
