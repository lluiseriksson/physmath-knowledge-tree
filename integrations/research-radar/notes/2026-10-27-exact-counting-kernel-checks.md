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

## Follow-up: one-step child factorization, checkpoint882

The remainder of the pinned contraction module has now been read, including the child network descriptions and claimed cost recurrence. Reading that argument is not a verification of the full recursive algorithm. The source fixes tensor representatives at creation precision; each call deforms those fixed lifts, rather than assuming canonical lifting is a ring homomorphism. Its claimed branching estimate uses both the inherited-precision bound and the shrinking wire count. Those uniform asymptotic and description-cost invariants still require a complete audit before adopting the theorem.

A new own exact-arithmetic check compares direct contraction with the product of separately summed child contractions for336 small instances. It also checks1,536 crossing matrix entries against the source's truncated mode expansion. The largest enumerated weighted-mode budget has164 retained exponent tuples. Two deterministic seeds supply arbitrary tensors coupling ports within each group; full and sparse real-port patterns are tested. The test retains the Cauchy kernel, affine row factors, mode divisibility, source/target orientation and coefficient-extraction coupling, rather than substituting an unrelated matrix factorization.

The tested scope is one packet, two groups, slot parameters a=1,2, residue precision p=2..5, scalar integer interpolation values z=0,1,2 and every nonzero grid node with valuation below a. These are **small algebraic instances outside the full theorem's asymptotic packing regime**. They test the child-factorization identity, not the full parameter system, extension-field interpolation, Hermite recovery composed with recursion, creation-precision transitions across several depths or the claimed running time. No counterexample occurred in this finite scope; no new theorem, novel application, paper, model assessment or graph confidence upgrade follows.

The smallest useful complexity subgraph was retrieved again before this addition:3nodes and2edges; canonical graph files are unchanged. The next falsifier is a composition test that binds recovery precision, entry creation precision and at least two recursion depths, followed by a source-level accounting of description costs. An application that merely repeats the source's exact-counting or ring-valued contraction corollaries remains an abandoned publication route.

See [own checker](../evidence/2026-10-27-eth882/check882.py), [finite outcome](../evidence/2026-10-27-eth882/CHECK882.json), [retrieved subgraph](../evidence/2026-10-27-eth882/SUBGRAPH882.json), [directed primary refresh](../evidence/2026-10-27-eth882/REFRESH881.json) and [native/public byte mapping](../evidence/2026-10-27-eth882/MANIFEST882.json). Native bytes remain conserved in the private reading dossier; public text copies use LF. The eight-endpoint refresh is inventory, not an exhaustive reading or new proof coverage. No upstream manuscript body is redistributed.


## Abandoned shortcut: changing only level multiplicities

This is an elementary method limitation derived during this audit, with no claim of worldwide novelty or AIRR importance. It eliminates one proposed route to improving the source's precision order, rather than supplying a separate paper. No graph label is changed; it is an analytical argument, not a checked Lean result.

Take integers \(a\ge 2u\ge2\), nonnegative level multiplicities \(q_0,\ldots,q_{u-1}\), and set later \(q_i=0\). Define the normalized loss from the source's valuation identity by

\[
 \ell_i=\sum_{j=1}^{a-i}\frac{j}{2^j}(q_i-q_{i+j}),
 \qquad S=\sum_{k=0}^{u-1}\frac{q_k}{2^k}.
\]

Reordering the finite sum gives the exact identity

\[
 \sum_{i=0}^{u-1}\ell_i
 =\sum_{k=0}^{u-1}q_k\left(\frac{k+2}{2^k}
             -\frac{a-k+2}{2^{a-k}}\right)\ge S.
\]

For the inequality, multiply the coefficient of \(q_k\) by \(2^k\). Since \(a\ge2k+2\), the subtracted term is at most \((k+4)/4\); the resulting coefficient is at least \((3k+4)/4\ge1\). If \(q_i=0\), then \(\ell_i\le0\). Thus some active level has \(\ell_i\ge S/u\). No monotonicity of the multiplicities is needed.

In the source's grid, \(L=2^a\) and a level \(i<u\) has \(L/2^i\) nodes. Covering degree \(M(2L-1)\) requires \(LS>M(2L-1)\), hence some active level incurs normalized loss greater than \(M(2-1/L)/u\). Consequently, while retaining this grid, support range and degree-coverage requirement, changing only the level multiplicities cannot make every normalized loss \(o(M/u)\). This is **not** a lower bound on the full algorithm's running time: changing the deformation, interpolation scheme, degree requirement, recursive interface or using a nonuniform cost argument is outside the conclusion.

[An exact finite falsifier](../evidence/2026-10-27-eth882/check884.py) passed all4,077 nonzero profiles with u=1..5, a=2u..2u+2 and q_i=0..3, covering14,337 active levels. [Its result](../evidence/2026-10-27-eth882/CHECK884.json) corroborates the written identity on that scope; the finite test is not the proof of the general inequality. The abandoned route is a uniform precision improvement obtained solely by replacing the taper profile, not every possible improvement of the source method.
