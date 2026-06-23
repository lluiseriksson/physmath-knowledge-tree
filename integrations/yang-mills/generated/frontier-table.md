# Yang–Mills analytic frontier

| ID | Obligation | Status | Lean shape | Source anchor | Uniformity |
|---|---|---|---|---|---|
| obl.gaussian-pushforward | Gaussian pushforward | carried | map dmu0 (D.gaussianRootMap root) = physicalGaussian | CMP116 (2.5)-(2.6) | volume, scale, background |
| obl.root-localization | Covariance-root localization | carried | PhysicalLocalizedCovarianceRootCertificate ... | Balaban Green/random-walk estimates | volume, scale, background, cutoff |
| obl.wilson-hessian | Wilson Hessian identification | placeholder-prop | typed equality between the concrete gauge-fixed Hessian and precision | quadratic expansion at the minimizer | volume, scale, background |
| obl.local-activity | Local activity construction | placeholder-prop | physicalActivity equals the localized fluctuation-integral component | CMP116 (2.4)-(2.11) | volume, scale, background, holes |
| obl.raw-decay | Raw pointwise modified-metric decay | carried | norm(globalEval) <= amplitude * appendixFHoleExpWeight | CMP116 Lemma 3 / (2.38)-(2.41) | volume, scale, background, holes |
| obl.support-localization | Separated support localization | carried | spectator/fluctuation support -> active support -> Omega/skeleton | CMP116 component localization and random-walk expansion | volume, scale, background, holes |
| obl.measurability | Strong measurability and integrability | carried | StronglyMeasurable globalEval plus probability/integrability consumers | finite-dimensional continuity and Gaussian domination | volume, scale, background |
| obl.hole-geometry | Appendix-F hole geometry | explicit-formal-hypotheses | disjoint holes, no edges, nonempty holes, Omega/skeleton relation | Dimock II Appendix F | volume, holes |
| obl.hsharp-half-budget | Second-Ursell half budget | carried-numerical | leafConstant * (2 * amplitude * rootSumConstant) <= 1/2 | Dimock smallness window plus formal leaf summation | scale, background, holes |
| obl.hsharp-profile | Closed H# spatial/coupling profile | carried-analytic | momentConstant * amplitude * rootSum <= C Hbar exp(-c0 t) g_k^kappa0 | CMP116 constants plus Dimock II Appendix F | volume, scale, background, holes |
| obl.hsharp-remainder-identity | Physical remainder identity | open | Rsc t k = rooted tsum of real Hsharp | localized R/B/R' decomposition and source insertion | volume, scale, background |
| obl.geometric-profile | Geometric scale profile | branch-specific | g k <= C * r^k with 0 < r < 1 | irrelevant contraction mechanism | scale |
| obl.marginal-recursion | Marginal asymptotically-free recursion | branch-specific | g(k+1) = g(k) * (1 - beta*g(k)), kappa0 > 1 | Balaban CMP109 / marginal flow | scale |
| obl.ir-input | IR clustering input | theorem-fed | abs(covIR k) <= C1 exp(-epsilon k) | gibbs_truncated_correlation_bound / sun_two_plaquette_correlator_bound | volume, distance |
| obl.uniform-constants | Finite-volume and scale-uniform constants | open-quantifier-audit | exists constants, forall volume cutoff background holes t k | uniform estimates throughout Balaban/Dimock | volume, cutoff, scale, background, holes, root-position |
