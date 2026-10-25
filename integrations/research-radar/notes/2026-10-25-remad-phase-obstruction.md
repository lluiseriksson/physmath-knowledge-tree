# ReMAD: a tensor phase obstruction and a version-sensitive literature gate

25 October 2026. Directed research, not an exhaustive sweep. No new manuscript or score.

## Hypothesis tested and exact obstruction

For the known Chessa--Giovannetti [ReMAD family](https://arxiv.org/abs/2207.05646v2), use the slice with Kraus operators `K0=diag(1,r,r)` and `K1=sqrt(gamma)(|0><1|+|1><2|)`, where `r=sqrt(1-gamma)` and `0<gamma<1`. Its one-use aligned-phase reduction does **not** tensorize into a rule that replacing an arbitrary two-use vector by its entrywise absolute values minimizes output entropy.

Take `psi_plus=(|00>+|01>+|11>+|20>)/2` and `psi_minus=(|00>+|01>+|11>-|20>)/2`. They have identical populations. Their environment Gram matrices are

```text
G_plus/minus = 1/4 *
[(1+r²)², sqrt(gamma), r² sqrt(gamma), gamma;
 sqrt(gamma), gamma(1+r²), +/- gamma r, gamma sqrt(gamma);
 r² sqrt(gamma), +/- gamma r, gamma(1+r²), 0;
 gamma, gamma sqrt(gamma), 0, gamma²].
```

They have the same nonzero spectra as the receiver outputs. Writing `P_plus/minus(x)=det(xI-G_plus/minus)`, direct symbolic algebra gives

```text
P_plus(x)-P_minus(x) = -r³ gamma² x/16,
det(tI+G_plus)-det(tI+G_minus) = r³ gamma² t/16 > 0, t>0.
```

For equal-trace positive matrices, scalar integration eigenvalue by eigenvalue gives `S(A)-S(B)=integral_0^infinity log(det(tI+A)/det(tI+B)) dt`, in nats. The displayed determinant comparison therefore proves **strictly lower output entropy for the minus state at every interior noise parameter**. At gamma=3/4, an additional private rational-root/log-series enclosure gives a gap greater than 3/100 nats; numerical searches were used only to find the small support, not to justify the universal comparison.

The same identity gives, for every `1<p<2`,

```text
Tr(A^p)-Tr(B^p) = (p sin(pi p)/pi) * integral_0^infinity
 t^(p-1) log(det(tI+A)/det(tI+B)) dt.
```

Since the prefactor is negative, `Tr(G_plus^p)<Tr(G_minus^p)`. Traces and purities coincide. The log-determinant ratio is O(t^-3) at infinity, so the displayed fractional integral converges. Zero eigenvalues, if present, are handled by the usual continuous limit; they do not change the strict sign. The [own symbolic control](../checks/remad-phase-family.py) checks the Kraus completeness, Gram construction, equal trace/purity and characteristic identity with SymPy 1.14.0; its [result](../checks/remad-phase-family.json) is an algebraic check, not a Lean proof or independent referee report.

## Antecedents and scope

Failure of entrywise majorant reasoning for fractional Schatten orders has classical antecedents. Weissenhofer, [The positive minorant property on matrices](https://doi.org/10.1016/S0024-3795(96)00152-8), LAA258 (1997),81-94, was read at abstract level only. King, Nathanson and Ruskai, [quant-ph/0409181](https://arxiv.org/abs/quant-ph/0409181), was also read at abstract level: its EP-map multiplicativity statement uses integer orders. Our calculation is an explicit obstruction within a known channel, without a priority claim for the general matrix phenomenon.

This does **not** disprove Holevo additivity or sandwiched-radius additivity. In fact the unsandwiched channel has maximal output p-norm one because its ground state has a pure output. A sign-dependent output for a nonoptimal test input says nothing by itself about the global capacity optimum.

A subsequent bounded search tested diagonally sandwiched two-use maps at `(gamma,p)=(0.5,1.5),(0.75,1.1),(0.75,1.5),(0.9,1.5)`. The four runs completed 51,42,51,42 starts respectively, including overlapping product starts and the two signed controls. All best states were numerically product states; apparent excesses over twice the best sampled one-use log trace power were below 2e-12. Reference-state fits, finite cutting rounds and local optimization do not certify the one-use global maximum. These are negative exploratory diagnostics, not a proof of multiplicativity or an independently replicated campaign. Full local logs remain in the private research checkpoint; no ready Research Capsule is claimed.

## A discarded novelty target

Fang's [2609.14621v2, 6 October 2026](https://arxiv.org/abs/2609.14621v2) has a stronger title and scope than v1. Its Theorem1 already states an exact strong-converse exponent and all-order sandwiched Renyi Holevo additivity for generalized amplitude damping. We read its abstract, Theorems1/3/4 and the displayed proof of Theorem4, including the two triangular factors and common scalar Gram matrix. Appendix convexity dependencies and the full operational exponent theorem were not independently audited. Do not advertise the GAD strong-converse problem as a new target from the older v1 title. This does not establish a transfer to extra-dephasing Davies channels or coherent qutrit ladders.

Park--Kim [2601.18538v2](https://arxiv.org/abs/2601.18538v2), 12 July 2026, was inspected at abstract, definitions and Theorems1/2 statement/selected-proof level. Its zero-error independence-number additivity is a different operational quantity; no zero-error theorem for our ladder is inferred from it.

## Research disposition

Mechanism: a phase sign changes a Gram-cycle contribution while preserving populations and purity. Hypothesis eliminated: aligned two-use phases cannot be assumed in a population-only search. Remaining task: retain phase degrees of freedom and prove a global convex-roof/tensor-power estimate, or exhibit a certified capacity counterexample. Abandon any route whose proof silently replaces the signed state by its absolute values.

Small quantum-information subgraph context was retrieved before writing; canonical graph nodes, edges and confidence levels remain unchanged. `literature` covers the attributed source claims; `heuristic` covers finite exploratory searches; `speculative` covers any remaining capacity bridge; `formal` has no new Lean declaration. The analytic calculation is self-checked and has not received an independent full-manuscript assessment. These components are retained with the parent research, not split into minor standalone papers or presented as a ready computational campaign.
