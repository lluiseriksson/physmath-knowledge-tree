# The source's constrained-background response, with its gauge and scale limits

30 October2026. Same supporting investigation; no new paper, assessment or score. This follow-up is outside the1482 technical audit.

Primary source: Bałaban, *The Variational Problem and Background Fields in Renormalization Group Method for Lattice Gauge Theories*, CMP102(2),277-309(1985), DOI10.1007/BF01229381. Existing held PDF3355501bytes,SHA256838056b5c578f81d058deb3d394c66d934690e3b94c6cf2956534ec6d211b541. The file has34 PDF pages, including an additional page beyond the33 printed article pages; no different article length is inferred. Institutional Rutgers metadata verifies title/year/pages/DOI; it is old literature, not a new2026 publication.

Selected reading: abstract, Theorem1 and initial gauge setting, then Sect.G printed305-309. Printed307-309/PDF31-33 were visually inspected. This is selected statement/equation reading, not a full-proof audit or a new source-inventory case. The existing cache and earlier renders were reused read-only.

## The actual map is a constrained minimizer

The source minimizes the Wilson action with prescribed averages on its determining set and regularity restrictions. The minimum is unique up to the allowed gauge transformations. Theorem1 has explicit smallness and regularity hypotheses; an arbitrary coarse configuration is not covered.

Sect.G fixes V0, takes U0=Uk(V0), perturbs the average data as V'V0, and studies the relative field Uk(V'V0)U0^-1 in the chosen Landau gauge. The relative field is exp(i eta Hcal(B)) in Proposition9. The source then transforms back to its axial-gauge representative. This is the reconstruction response needed for the background chain in1486-1487, rather than the free inner covariance alone.

The alternative representation Eq179-180 introduces the nonlinear solution a0(B), the source response H0 and the corrected propagator Gtilde. Differentiating it gives the actual linear equation Eq184:

    (I+Gtilde V''(a0+H0 B)) a0_dot
       =Gtilde Delta^(2) H0
        -Gtilde V''(a0+H0 B) H0.

Here the dot is the source derivative with respect to its prescribed average-field argument; H0 on the right is applied to that direction. V'' is the source nonlinear-action Hessian, not the full inner precision. Gtilde includes the Delta^(2) perturbation specified around Eq180. The full derivative of Hcal also contains the nonlinear reconstruction chain in Eq182 acting on a0_dot+H0. It is not simply H0, an arbitrary unconstrained inverse, or C_inside Q_boundary.

The source bounds the perturbation norm in Eq187, solves by a Neumann series in Eq188, and states the spatial kernel estimate Eq189 leading to Eq190/Proposition9. At printed308 the lengthy second-derivative kernel calculations needed for Eq189 are not displayed; only the final estimate is formulated there. Therefore this investigation may use the stated result as an identified literature input, but cannot call its underlying kernel calculation independently audited or reproduced.

## What the decay statement does and does not yet give our score

Eq190 gives exponential decay with rate delta0/8 in the SOURCE distance d(y,y'), for the listed functional derivative and regularity operators. It retains distinct output-scale factors such as (L^j eta)^-1 and an input factor L^j' eta. These factors, the source pairing/functional-derivative normalization, and the definition of B must be matched before converting it into an ordinary single-coarse-bond theta derivative in1486. No dimensionless unit-rate kernel is extracted merely by suppressing them.

The first-step use must also retain the source regularity class, determining domains, physical J and strict analytic margins. It is not a result for independent complex J, arbitrary histories, a later effective-action Hessian, or a different choice of background map. The existence/uniqueness statement identifies the same physical branch only after its original boundary/average/gauge conventions match.

## Gauge return is part of the derivative dictionary

Eq190 concerns Hcal in the relative Landau-gauge representation described by Proposition9. The original first conditional integral uses its stated background and raw chart. Returning to the axial representative introduces an analytic, parameter-dependent gauge transformation. A closed plaquette trace is invariant under vertex gauge conjugation, but that fact alone does not remove gauge-connection terms from a FIXED-RAW-coordinate parameter derivative of the conditional measure.

To change gauge in the inserted integral, transform the raw fluctuation coordinates, lift, nonlinear correction and exterior data consistently as the source prescribes. The raw norm cutoffs may be invariant under the corresponding real adjoint action, but a theta-dependent transformation of exterior raw coordinates changes the path along which the conditional derivative is being taken. It must not silently be called the same fixed-z derivative. This is precisely a measure/coordinate issue, distinct from the elementary gauge-invariant trace bound accepted in1482.

Thus there are two legitimate next choices to verify, not two established interchangeable formulas: derive the original-gauge tangent including the gauge return, or pull back the FULL conditional integral to the Landau chart and differentiate with the induced raw/exterior paths. In either case the1486 direct-observable and score terms must be taken in the same connection. No cancellation of connection terms is asserted here without that check.

## Route consequence

The missing background derivative is now tied to the actual variational source, a specific linear response equation and its stated decay estimate. This removes the ambiguity about which reconstruction operator is relevant. It does not yet bound the actual score's mixed raw/coarse derivatives or prove quasilocality of the effective insertion.

Next finite task: match the source average-field normalization and gauge return to the fixed-raw first-step derivative, recording the resulting Dtheta U1 and any raw/exterior coordinate connection. Then combine it with the explicit selected-lift derivative from1487 inside the actual1486 score. Stop if that map cannot preserve the original mark and history/domain conventions; do not replace it by a generic localized-background hypothesis or write a paper from the chain rules.

Falsifiers: using H0 alone as the full response, deleting scale/pairing factors, treating the unshown kernel calculation as audited, or using gauge invariance of one trace to ignore a changing measure/path. Levels: literature for the selected source statements/operators; heuristic for this participating-agent response/score dictionary; speculative for its complete gauge/scale match and physical connected estimate; formal:none new. No novelty, independent review, grade or global physical result.
