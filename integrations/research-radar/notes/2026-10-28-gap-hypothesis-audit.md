# Strict trace contraction does not supply one-step GNS coercivity

28 October 2026. Source-hypothesis audit and exact root algebra; no new manuscript or grade.

## Literature boundary

Gao–Wang, [arXiv:2610.35863v1](https://arxiv.org/html/2610.35863v1),26October2026, Theorem1.1 assumes conditional hyperboundedness and strict centered GNS contraction for a unital CP endomorphism with faithful invariant state and fixed-algebra expectation. Its conclusion contracts entropy relative to E_*rho, not arbitrary pairs with equal reference marginals. The selected opening theorems were read; their full proofs were not audited. The complete statement additionally needs completely bounded norm control, not just a finite-dimensional ordinary norm estimate. This source was an earlier abstract lead; this is new statement-level reading, not a claim of discovering its publication.

## Exact counterexample to a proposed transfer

Take a qubit CQ channel N that measures the computational basis and prepares |+> or |+i>. Let tau0,tau1 denote those pure states, omega=(tau0+tau1)/2, Phi=N^dagger and E(X)=Tr(omega X)I. Then det(omega)=1/8, so omega is faithful. Both preparations have computational populations1/2, hence N^2 is the replacer to omega. Phi^2=E and the fixed algebra is the scalars.

Set V=(|+>,|+i>) and X=V diag(1,-1)V^{-1}. Explicitly X=[[-i,1+i],[1-i,i]]. It is centered, Tr(omega X)=0, and Phi(X)=diag(1,-1). Exact arithmetic gives Tr(omega X^*X)=Tr(omega Phi(X)^*Phi(X))=1. Unital CP contractivity with the invariant state gives the reverse upper bound, so the one-step centered GNS operator norm is exactly1. The theorem's condition ranges over all operators, so this non-Hermitian witness is admissible.

Nevertheless the complete equal-reference trace coefficient is at most3/4. Choose the trace-one Hermitian H=[[1/2,1-i],[1+i,1/2]]. H is not positive, but tau_j-H/4 has trace3/4 and determinant1/64 for both j. Scaling those positive residuals by4/3 defines a CPTP CQ channel M. In N=(1/4)R_H+(3/4)M, the Hermitian replacer cancels on every equal-reference difference. Trace contractivity of M proves the stated bound. This is the established Hermitian-replacer mechanism, not a new quantum Doeblin theorem and not an Umegaki bound.

Thus strict complete trace contraction cannot replace strict one-step GNS coercivity. Two-step replacing or spectral radius zero on the centered subspace does not imply a strict one-step GNS singular-value bound either. This is not a counterexample to Gao–Wang and does not show that its entropy conclusion fails. It also says nothing against the continuous-time GNS-gap hypothesis in Theorem1.2. Nonnormal transient behavior and the earlier own reset/noise mechanisms remain prior context; no standalone novelty claim is made.

## Dictionary, falsifier and next step

Literature: Gao–Wang's actual hypotheses and the established trace decomposition. Root algebra: the explicit faithful2x2 example, checked symbolically on all four matrix units. Speculative target: a different, proved route to the required GNS coercivity or CB hyperboundedness with uniform constants. Formal: no Lean theorem, imported build, independent referee or score. The dictionary keeps Heisenberg versus predual maps, GNS versus KMS norms, one step versus a semigroup and arbitrary-pair versus expectation-reference divergences separate. Reject any proposed transfer that drops these distinctions. Minimal formal target: the four matrix-unit channel identities and the centered-norm witness; it was not formalized here.

Primary source hashes and actual reading limits are in READINGS1194.json. The current eighteen-endpoint sweep remains inventory unless separately marked. Third-party search summaries or automated reviews were not used as theorem evidence or grades. O1 of the exact published v3 remains open; no frozen manuscript or review report was changed.

The [exact symbolic checker](../evidence/2026-10-28-gap-hypotheses/exact1194.py) and [recorded identities](../evidence/2026-10-28-gap-hypotheses/EXACT1194.json) retain the precise root scope. [Primary reading ledger](../evidence/2026-10-28-gap-hypotheses/READINGS1194.json); [fresh metadata sweep](../evidence/2026-10-28-gap-hypotheses/SOURCES1195.json). No third-party automated review is adopted as a grade.
