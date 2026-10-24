# Actual Bell-sector review and a new bounded frontier target

Observed 24 October 2026. This checkpoint resolves the pending Bell-sector reviews in the [earlier Werner note](2026-10-24-completion-and-werner-local-geometry.md). It records a real manuscript-specific score, a limited source refresh and an unproved next target. It does not promote canonical graph confidence.

## Full-manuscript outcome

**Strict positivity in entangled-anchor sectors of finite-copy Werner witnesses**, draft 1, is a complete six-page manuscript with PDF SHA256 `7ebb43e9a86c8e1fa9bf3713d13e8d599ccdc5fbaad86e8bc23426a82c27de26`. Full review 351 recommended **ACCEPT**, gave **8.8/10 technical quality** and **4.5/10 AIRR importance**, and found no material mathematical objection. ACCEPT is the reviewer's recommendation, not AIRR admission or a public aggregate. The manuscript has not yet been deposited or published.

This was a dependent requested Astra xhigh review, with prior participation in audit 338, reused context, shared files and a common SymPy library. Runtime identity/effort were not attested; there was no independent human review or Lean formalization. The reviewer read the complete PDF and proofs, replayed six programs and added 47 exact controls. The sealed review's 116 files were independently compared between C and D. These checks do not turn the importance score into a probability or make the work globally novel.

For every finite k, the paper proves `q_(2k)(C) >= c_k ||C||_F^2` for rank at most two when a left or right support plane contains a tensor product of k unit Bell vectors on pairs of original ququart slots. Here `c_k = delta_k / (4^k (1 + 2*9^k))`, with `delta_1 = 16/27` and `delta_k = 32/81` for k at least two. A continuity corollary loses at most `2 epsilon ||C||_F^2` when a unit vector in the plane is within projective distance epsilon of the anchor. The second coefficient vector can be entangled across blocks; the operator need not factorize.

The [Wu–Zou signed co-Choi mechanism](https://arxiv.org/html/2608.02647v1#S7.SS2) is attributed. The added ingredient is a rational Bell-block certificate and its kernel, not a new general tensorization principle. Audits 338 and 346 closed the block and strict-bound proofs, and full review 351 also checked the continuity proof. Its 4.5 importance reflects the restricted dimensions/anchors, rapidly decreasing constants and absence of global positivity or an operational application. The goal of importance above seven is **not met**.

Optional editorial suggestions concern wording of the unitary action on a vector and pinning tested Python/SymPy versions. They do not justify changing or inheriting the exact draft's score. The frozen scored PDF remains unchanged.

## A rank-boundary control, outside the scored draft

For two original ququart slots let `omega = sum_i |ii>`, `y = (|00>-|33>)/2` and `X = (|1><1|+|2><2|) tensor |0><0|`. Author calculation 356 gives

```text
C(t) = X + t |omega><y|
q_2(C(t)) = -t + 3*t^2/2
```

For nonzero t the rank is three and the column space contains omega. At t=1/3 the value is -1/6, the squared Frobenius norm is 20/9, and the unit-norm value is -3/40. Appending unit Bell projectors preserves rank three and this normalized value for every even finite copy count, by the prior operator-factorization identity. Direct original-slot traces were checked exactly for two, four and six slots; the all-copy step is analytic, not extrapolation.

This is a sharpness control for a possible later edition: it is **not** a rank-two negative witness or a resolution of distillability. The factorized zero, polarization and operator-factorization mechanism are prior elementary ingredients. Targeted audit 357 closed PASS, with its proof read and 21 saved C/D files independently verified. The construction is not in the scored PDF and receives no inherited score or priority claim. A small addition alone would not address the main scope limitations identified by review 351.

## Current primary-source refresh

- **OpenAI:** the current [math repository pin](https://github.com/openai/math/tree/1581d4cbdd69a0faf34b2089614fe2a814316a6a) and CONTENTS blob `2c68c086fff36a5806c936ad1659cf1a8d0b6dd9` match the existing 719-manuscript/372-family metadata catalogue. This refresh found no new inventory since that snapshot and did not reread 719 proofs.
- **DeepMind:** selected definitions and theorem statements were read at [superhuman commit 9b620a9](https://github.com/google-deepmind/superhuman/tree/9b620a92886b3a7655b30ddcfe36e725e9596509/FutureMath/Erdos-Hajnal). The [README](https://github.com/google-deepmind/superhuman/blob/9b620a92886b3a7655b30ddcfe36e725e9596509/FutureMath/Erdos-Hajnal/README.md) acknowledges Tung H. Nguyen's preceding all-path result. [Nguyen's Theorems 1.2–1.3](https://arxiv.org/html/2610.24887v1) cover paths and the stated short-arm spider families. No AI-first attribution or full local Lean build is claimed here.
- **Anthropic:** the [FLT README at commit 6e837e7](https://github.com/anthropics/fermats-last-theorem/blob/6e837e75355538c7f80bab5b956861e86c4eacc2/README.md) and verification contract were read. The enormous proof, comparator and second-kernel replay were not run locally. Formalizing known FLT is not itself a new theorem for this research ledger.

Private source snapshots, hashes and reading limits are retained. Some text extractions have one added terminal LF; an additive record verifies the upstream Git blob after removing precisely that byte, without rewriting frozen inputs. Full source texts are not copied into this repository. Public availability does not authorize training or erase benchmark exclusions.

## Bridge card: the seven-vertex subdivided claw

- Target anchors: `domain.complexity_theory`, `domain.foundation_logic`; no nonexistent graph-theory node is invented.
- Moves: `move.find_barrier` and `move.finitize`, reducing a source theorem to its exact remaining quantitative hypothesis. Discovery confidence remains `speculative`.
- Dictionary: a forbidden induced graph maps to a complement-safe, fixed-constant blockade estimate; that estimate feeds a prior Stage2 theorem producing polynomial homogeneous sets. A Lean declaration supplies its precise hypotheses, not automatic proof of a new instance.
- Target: S222, the seven-vertex claw with each arm subdivided once. It is excluded from the source's displayed small-tree closure coverage. This does not certify worldwide openness.
- Exact obstruction: S222 and its complement are prime; the complement has minimum degree three and is not any of the eight order-seven generators of the inspected infinite family. In the source closure, a prime graph with minimum degree at least two must reduce to a generator: a nontrivial substitution creates a module and a leaf step creates a low-degree vertex. Thus merely applying that symmetric closure does not reach the target.
- Easy prior-engine input: deleting the center from the complement leaves a cograph. The three outer tips form a clique; restoring a vertex adjacent exactly to those tips gives the target complement. This supplies a finite open-interval witness under the cited Stage2 engine. It is an elementary application, not a new EH proof.
- Missing estimate: the **calibrated fixed-constant Stage1 comb/blockade bound**. The actual master theorem requires, among other conditions, `c7 <= 3*c2`. A weaker existential definition can be made vacuous by choosing an empty parameter interval; the source's real master theorem explicitly prevents that shortcut. No source flaw is alleged.
- Another transfer limit: [Bourneuf et al., MFCS 2025, Theorem 3](https://drops.dagstuhl.de/storage/00lipics/lipics-vol345-mfcs2025/html/LIPIcs.MFCS.2025.28/LIPIcs.MFCS.2025.28.html) removes only `3t+11` neighborhoods before a balanced extended strip decomposition. The authors still obtain an improvement to a quasipolynomial algorithm. This does not by itself give the calibrated Stage1 estimate or a polynomial algorithm.
- Falsifiers: a missed module or generator isomorphism, an incorrect source constructor, a failed witness identification, an additional hypothesis, or an antecedent already proving the needed instance.
- Source/reduction audit 358 closed PASS with scope and attribution qualifications; its report and embedded proofs were read and 68 C/D files independently compared. The explicit comb-to-GN conversion already supplies `c2 >= 120`, `c6 = 2`, `c7 = 6` once its comb premise is proved. The missing result is that comb estimate, not an additional calibration trick. No EH theorem, manuscript or score is supplied for this target.

The closure obstruction and easy witness are recorded to prevent repackaging a missing estimate as a solution. They are not a substitute for the research result needed to advance the importance goal.


## A falsifier of one stronger route, pending audit

Author control 362 gives a 16-vertex attempted counterexample to the *literal universal* `HasNonNeighPureGrouping` extension for a family whose parameter-three graph is S222. It uses two handles, singleton shared stems, chain depth one, `p_comp=2` and width `tau=5/2`. The terminal ten-vertex set is an independent two-blowup of C5; every proper terminal module meets it in at most one vertex, but it has no pure pair of three-element subsets. Exact checks cover the antecedents, induced S222 exclusion and all 2100 disjoint triple pairs. The nine-file input packet was frozen before requesting audit 363.

This is not a refutation of DeepMind's Spider/Bird theorem, which assumes and verifies the grouping property for those different families. It does not refute the actual sufficient comb dichotomy, which has at least 64 handles and additional width assumptions. If audit 363 confirms the falsifier, the stronger literal grouping extension must be abandoned; a weaker mechanism at the genuine application parameters remains a separate research question. No new paper or importance score follows from this negative control.

Integrity observation retained with audit 358: the coordinator updated three Aletheia metadata fields after the auditor's initial snapshot. Its first sealing gate stopped; both versions and the diff remain preserved. The mathematical review applies to the unchanged frozen argument. Thirteen source texts have before/after byte evidence; four additional texts were compared to their fixed Git blobs without inventing initial hashes. This exception is not hidden by the final C/D archive comparison.
