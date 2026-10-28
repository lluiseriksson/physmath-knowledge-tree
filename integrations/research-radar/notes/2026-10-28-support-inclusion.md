# Complementary support: a hypothesis reduction and its restriction boundary

28 October 2026. Directed follow-up to the [CQ support note](2026-10-28-cq-support.md). This is an unreviewed root argument with a bounded exact check, not another paper or assessment. The earlier note remains a historical snapshot; no manuscript, score or native publication status is changed here.

## Evidence layers

- **literature:** Kraus/Stinespring factorization, support compression and data processing are existing tools. The [Smith–Wu v4 definition](https://arxiv.org/html/2409.03927v4#S4.SS2.SSS2), Eq71, uses mutual information. It must not be exchanged for an arbitrary paired Umegaki coefficient.
- **heuristic:** the proposed graph argument can use one ordered orthogonal input pair with nested complementary supports, rather than a pure input faithful on the entire minimal environment. Its universal asymptotic conclusion and novelty have not received a separate model or human audit.
- **speculative:** any operational advantage, optimal reference cost, or worldwide priority. No grade is assigned.
- **formal:** none. [The exact SymPy check](../evidence/2026-10-28-support-inclusion/check1183.py) verifies one rational example and its restricted channel; it is not a Lean proof or a formal certification of the general theorem.

The [retrieved radius-two context](../evidence/2026-10-28-support-inclusion/SUBGRAPH1183.json) contains four nodes and four edges. Canonical graph confidence, topology and route rankings remain unchanged.

## Bridge card

- Target: `domain.quantum_information_theory`.
- Source context: `bridge.conditional_mutual_information_recovery`, `bridge.local_operations_no_signalling`.
- Research move: `move.spectralize`.
- Current confidence: `heuristic` for the proposed asymptotic extension; exact finite algebra as separately labelled evidence.
- Dictionary: for Kraus operators K_j and orthogonal input vectors a0,a1, let V_i have columns K_j a_i. The complementary output is the Gram V_i*V_i, up to a common transpose convention. Its support is the orthogonal complement of ker(V_i). Set tau_i=V_i V_i* and Z=V0 V1*.
- Mechanism: `Z* tau0^+ Z = tau1 - V1 P_ker(V0) V1*`. Therefore the zero-defect identity holds iff `ker(V0) subset ker(V1)`, equivalently the complementary support at a1 is contained in that at a0. The direction is essential. This identity supplies the Schur-complement step in the earlier proposed graph argument; it does not replace its remaining estimates.
- Hypothesis removed: faithfulness of a0 on the *full* minimal environment is stronger than this ordered-pair condition. A rank-deficient environment can suffice.
- Structure preserved: finite dimension, one fixed channel, orthogonal input pair, equal reference marginal and channel-dependent joint binary readout in the proposed limit.
- Structure lost or uncertain: no channel-uniform convergence, separable input claim, LOCC realization, necessity criterion or capacity theorem. The generally entangled construction has a varying nearly singular reference marginal.
- Falsifier / abandonment: a nonzero kernel defect under the exact inclusion refutes the algebra; failure of the normalized graph estimates defeats the asymptotic extension. A covering earlier theorem defeats novelty. Do not publish the finite example as a new amplitude-damping discovery.
- Minimal Lean target: prove the kernel/projector identity for finite complex matrices and characterize when the defect vanishes. No declaration is implemented here.
- Next finite computation: [replay the exact example](../evidence/2026-10-28-support-inclusion/EXACT1183.json), including the reverse-order failure and input restriction.

## Exact witness, and why it is not a separate discovery

Take a qutrit input and qubit output with

```text
K1 = [[1,0,0], [0,3/5,0]]
K2 = [[0,4/5,0], [0,0,0]]
K3 = [[0,0,1], [0,0,0]].
```

The trace-preserving identity holds exactly. The Kraus Hilbert–Schmidt Gram determinant is544/625, so the minimal Kraus rank is3. No pure-input complementary output can be faithful on this three-dimensional environment because the system output has dimension2. Nevertheless a0=e1 and a1=e0 satisfy the ordered kernel inclusion and the exact zero-defect identity. Reversing the order fails.

There is an important deduplication: restrict the input to span(a0,a1). The third Kraus operator becomes zero, the remaining two are independent, and a0 has faithful complementary output on the restricted minimal environment. In general, under the inclusion, the stacked map `[V0;V1]` has kernel equal to ker(V0), so the restricted channel's minimal environment has dimension rank(V0); V0 becomes injective there. Thus this apparent extension is already a restriction consequence of the earlier proposed faithful-environment mechanism. It should be integrated as a scope clarification, not promoted as a new independent theorem or fragmented paper.

For faithful-only optimization domains, embedding a restricted witness creates zero eigenvalues on the unused input subspace. One must still justify the full-space regularization. The proposed earlier construction supplies an identity admixture, but the exact finite check here does not by itself audit that limit. This limitation is retained rather than treating isometric embedding alone as a faithful-state proof.

The example contains an amplitude-damping restriction. The [already published nilpotent-noise paper](https://airr.science/papers/ARR-2026-5A13QJ5MZ98GWVFB/versions/v1/) already gives the amplitude-damping mutual-information obstruction. No earlier grade is inherited and no new AD-only manuscript is warranted.

## Reading boundary and reproducibility

The [directed refresh ledger](../evidence/2026-10-28-support-inclusion/SOURCES1183.json) pins actual commits, versions and transport hashes across OpenAI/math, Anthropic, DeepMind/formal-conjectures, arXiv, AIRR, ai.viXra and this research repository. Catalogue inventory is distinguished from selected statement reading. It is not an exhaustive sweep or proof audit.

The [author's publication listing](https://www.cs.purdue.edu/homes/amakur/publications.html) identifies Lee–Makur's *Contraction coefficients of product symmetric channels*, Allerton2024, pp1–8, through its publisher link. This directed search still did not obtain and read its full text. That bibliographic gap remains open; no abstract, catalogue match or failed search resolves the priority objection.

Run `python check1183.py` with SymPy installed from the evidence directory. The output records the actual SymPy version. No new package installation is needed for the recorded replay. Hashes of the checker, output, subgraph, ledger and this own synthesis are preserved in MANIFEST1183.json. No third-party full text, credentials or private account material is copied.
