# Recovery, trace contraction and a spectral-floor cutoff

28 October 2026. Root derivation, not a reviewed manuscript or a novelty claim.

**Literature.** Junge–Renner–Sutter–Wilde–Winter, [arXiv:1509.07127v3](https://arxiv.org/abs/1509.07127v3), first preprint23September2015, inspected v3 dated7August2018: Theorem2.1 and Remarks2.2–2.4 give a recovery map fixing sigma, with entropy loss at least minus twice the natural logarithm of root fidelity to the recovered rho. Only the stated sections were read; the full proof was not audited. On the channel output support the map is trace preserving; a CPTP extension outside that support can be chosen. This is prior mathematics, not a new frontier paper.

**Heuristic / root algebra.** Let T be a finite-dimensional channel, and suppose trace norm contracts by kappa<1 for the particular admissible pair rho,sigma. Assume sigma>=lambda I, lambda>0. A recovery map Q fixing sigma gives

    ||rho-QT(rho)||_1 >= (1-kappa)||rho-sigma||_1.

The triangle inequality and trace contractivity of Q prove this line; no locality or reference-marginal preservation by Q is needed. The recovery remainder, -log(x)>=1-x and the Fuchs–van de Graaf inequality then give

    D(rho||sigma)-D(T(rho)||T(sigma))
      >= (1-kappa)^2 ||rho-sigma||_1^2 / 4.

Spectral expansion and log(t)<=t-1 give

    D(rho||sigma) <= Tr((rho-sigma)^2 sigma^{-1})
                 <= ||rho-sigma||_1^2 / lambda.

Consequently the proposed conservative bound is

    D(T(rho)||T(sigma)) <= [1-lambda(1-kappa)^2/4] D(rho||sigma).

Logs are natural. A zero input divergence is treated separately by equality. No positive lower bound on input divergence is required. The floor is for the complete input sigma, not just its classical marginal or its reference marginal.

**Dictionary and limits.** For a complete equal-reference problem use T=id_R tensor N and the actual complete trace contraction bound, never the ordinary unassisted coefficient. For binary CQ preparation of two nonorthogonal pure outputs, pinching an equal-reference difference yields diagonal blocks A,-A; tensor-product trace norms give kappa=||tau0-tau1||_1/2. This supplies a concrete example. The resource dictionary maps faithfulness to the full smallest eigenvalue; it loses a dimension-free guarantee since lambda<=1/dim(input). A near-unit Umegaki ratio at fixed trace gap therefore requires the floor to shrink. This explains a resource obstruction, not capacity advantage or an operationally uniform protocol.

**Speculative target / falsifier.** Is a marginal-only, relative spectral floor sufficient for an analogous useful estimate? The displayed proof does not establish that replacement. Reject it if global conditioning escapes through correlations, or if an ordinary trace coefficient is substituted for the complete one. A sharp dependence on a weaker floor would need separate proof and antecedent comparison.

**Formal and computational status.** No Lean theorem, independent review or grade. Twelve deterministic noncommuting binary CQ checks with the same reference marginal passed floating-point tests of the bound and its auxiliary inequalities; these are diagnostics, not interval certification or a proof of the universal result. The map Q was not numerically constructed. No standalone paper is proposed for this consequence of established recovery results.

**Priority and reading.** A directed search again found Lee–Makur2024 on both authors' bibliographies. The publisher fetch returned418; an openly available full text was not located in this bounded search. O1 of the published v3 remains unresolved. No inference of absence or novelty follows. This later note is outside the graded PDF; no review score or historical report is changed. Source hashes, inventory reading levels, exact lock-availability evidence from1189 and the local checker accompany the archived dossier. Canonical graph confidence and topology remain unchanged.

## Exact marginal-floor obstruction

For epsilon in (0,1), sigma_epsilon=diag(2-epsilon,epsilon,epsilon,2-epsilon)/4 has both one-qubit marginals I/2 and smallest global eigenvalue epsilon/4. Thus fixed marginal floors do not imply the global floor used above. This only rejects that proof shortcut; it does not disprove every possible marginal-only contraction inequality. The three rational controls in [EXACT1191.json](../evidence/2026-10-28-recovery-contract/EXACT1191.json) check the identities.

The [diagnostic checker](../evidence/2026-10-28-recovery-contract/check1190.py), [12-case output](../evidence/2026-10-28-recovery-contract/CHECK1190.json), [small retrieved subgraph](../evidence/2026-10-28-recovery-contract/SUBGRAPH1190.json) and [current source observations](../evidence/2026-10-28-recovery-contract/SOURCES1191.json) retain their actual scopes. Minimal formal target: encode the scalar recovery-gap argument assuming its established quantum inequalities; no such Lean theorem is claimed.
