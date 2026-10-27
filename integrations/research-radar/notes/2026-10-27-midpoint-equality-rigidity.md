# Midpoint equality: algebraic rigidity and a counting decision

This is a component-audited analytic research result, not a full-manuscript assessment, a formal proof or a certified novelty claim. The new six-page manuscript is frozen for one separate full review. No score is inferred here. The global Jensen question remains open in this work.

## Mechanism and exact assumptions

For a lattice polytope P, its complete lattice-point enumerator E_P has coefficient one at EVERY integer point of P. The proposed squarefreeness proof is geometric: if E_P=G^2H with G a nonunit, select a generic normal functional exposing an edge of Newt(G) and a parallel edge or vertex of Newt(H). The resulting edge of P has enumerator 1+t+...+t^m, up to a monomial. It cannot contain the repeated nonzero root supplied by the squared edge factor. Lower-dimensional polytopes and monomial units are included. This is squarefreeness in a Laurent UFD over C, not multiaffinity, irreducibility, or squarefreeness of an Ehrhart polynomial.

The full support hypothesis matters: 1+x+x^3+x^4=(1+x)^2(1-x+x^2) is a nonsaturated zero-one counterexample. Coefficient one also matters: (1+x)^2 has a repeated factor despite saturated support.

Leake--Mohammadi Yekta's coefficientwise Theorem3.1 is an essential input, not a result replaced here. Let M have full row rank and all nonzero maximal minors equal to +-1. Take ONE fixed integer coordinate box, three nonempty fibers with integral RHSs b_-+b_+=2b_0, and common positive external weights on the original input coordinates. The source makes D=F_0^2-F_-F_+ coefficientwise nonnegative. Consequently D(w)=0 at one positive field forces a Laurent identity. Fiber integrality and squarefreeness then force

P_+=P_0+h and P_-=P_0-h, for one integral h.

Conversely these translations give equality at every positive field. Otherwise the source inequality is strict at every positive field. In particular, equality of unweighted midpoint counts forces all three counts to coincide. A product of k complete lattice enumerators equal to E_Q^k similarly forces k integral translates of Q with shifts summing to zero. This last statement is a polynomial identity, not a general Jensen inequality at a numerical field.

## An algorithm, with a real correction retained

Compute coordinate minima m_s and maxima U_s by6n LPs. Set h=m_+-m_0 and test Mh=b_+-b_0, U_+=U_0+h, m_-=m_0-h, U_-=U_0-h. These are exact translation tests because the same row equations together with each effective coordinate box describe the original fiber exactly. No lattice-point count or field evaluation is required.

For integer-box input, choose a nonsingular column basis B. Cramer's rule gives B^-1 M with entries0,+1,-1. Tardos's existing LP theorem then yields a strongly polynomial number of rational arithmetic operations; bit lengths still depend polynomially on total input encoding. This is neither a new LP algorithm nor a general counting algorithm. Our controls enumerate small fibers; they do not implement Tardos.

Audit824 found a mandatory correction to the original memo's ambiguous rational/integer-input wording. The corresponding extension to the original rational REAL fibers is false: M=[1,1], box[0,1/2]x[0,2], RHS0,1,2 has enumerators1,y,y^2 but real fiber dimensions0,1,1, so no translations. This falsifier is preserved. The reviewed theorem and strong-polynomial reduction retain integer bounds. A separate interface that first rounds rational bounds changes the real fibers; it is outside824 and is being checked in full-manuscript review. It must not erase this counterexample.

## A superclass shortcut is refuted; the actual Jensen problem is not

The exact rational3x3 array820 is VLC under the source's Definition2.1, but fails three-point Jensen; its coefficientwise fourth power also fails VLC. Audit822 independently reproduced its arithmetic with Fraction and integer calculations, without certifying model independence. Thus VLC alone does not provide the proposed Hadamard closure shortcut. The source already distinguishes line concavity from global concavity; that distinction is prior knowledge.

The new rigidity argument excludes a realization of this EXACT array by common positive-weight unimodular fibers in one integer box with RHSs affine in the output indices: its three opposite midpoint equalities would force translations whose shifts sum to zero, contradicting its three-point coefficient product. This does not exclude other representation mechanisms or nearby strictly perturbed arrays. It does not refute the source theorem or Question1.7.

## Evidence, layers and next decision

- Literature: the source's coefficientwise midpoint inequality and integrality lemma; classical Newton/UFD tools; Tardos's LP theorem. Selected proofs/statements are read, not an entire corpus audited.
- Own analytic evidence: audit824 supports the squarefreeness/equality/precise nonrealization arguments and separate827 extensions, with the integer-box correction mandatory. It is an involved component audit, not peer review or a manuscript score.
- Finite controls:1160 midpoint triples with72 equalities, all agreeing with translations and extrema; an auditor added39 non-TU unimodular triples with6 equalities. Root separately checked213 small lattice polytopes, including lower-dimensional cases, and retained nonsaturated/nonunit negative controls. These do not prove the general statements or LP complexity.
- Formal: no new Lean result or canonical graph confidence upgrade.
- Speculative: novelty and broader significance of the combined manuscript. Falsifiers include a lattice polytope with a repeated enumerator factor, or an integer-box unimodular midpoint equality without the stated translations. A close prior theorem or low full-review significance is an abandonment condition for treating this as a major discovery.

Audit824 reused745/781/798/822 history and a shared filesystem. GPT-6 Astra xhigh was requested; effective model identity, effort and independence are unverified. The new full manuscript review uses a fresh conversation without inherited task history or other reports in its input; this still does not attest statistical independence. All original objections and reports remain conserved. Full-paper importance remains unassigned at this checkpoint.

The [evidence manifest](../evidence/2026-10-27-rigidity834/PUBLIC-MANIFEST834.json) binds byte-exact native own artifacts in its archive and labels normalized convenience views separately. No third-party bodies are redistributed. No whole-campaign Research Capsule or complete reproducibility certification is claimed. A small algebra radius-one subgraph was retrieved before this synthesis; no canonical graph was changed.

Primary sources: [Leake--Mohammadi Yekta v1](https://arxiv.org/html/2609.39917v1), [Tardos1986](https://doi.org/10.1287/opre.34.2.250), [Csikvari--Imolay v5](https://arxiv.org/abs/1905.06678v5). The latter studies equality for a different graph-count comparison and is background, not the same theorem. Directed13-endpoint refresh825 has dated hashes and unchanged OpenAI/DeepMind pins; inventory metadata is not proof coverage and this is not an exhaustive sweep.
