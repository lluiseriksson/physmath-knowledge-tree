# Exact block Gaussian matching: the compensator uses the same conditional covariance

Participating-parent audit/derivation, unreviewed. Source CMP116 printed12/15/17 Eq2.5/2.14–2.25 visually checked in this activation; DOI10.1007/BF01239022, cached SHA256 ee39523a0f7b83af958513c7bd6f9c7731934b40355ef5d6b0f7a68ee6d022fc. Selected statements, not full proof audit. This matches the finite bare FIRST precision dictionary, not all projected multiscale operators in the source.

## Exact physical endpoint

Write the actual free positive real precision, partitioned into root D and exterior E, as

    Q=[[P,T],[T^t,W]], C=P^-1, Sigma=Q^-1,
    H=W-T^t C T.

The exterior marginal is the centered Gaussian with covariance H^-1=Sigma_EE. Conditional on exterior y, the root has mean -C T y and covariance C. Thus for any integrable root function F,

    E_Sigma F(B_D)
       = integral dnu_(Sigma_EE)(y) integral dnu_C(B)
           exp[-B^t T y -(1/2)(T y)^t C(T y)] F(B).

This is the Gaussian density ratio relative to the CENTERED root Gaussian. It is not a conditioning on a vacuum exterior. Source2.5 writes the exterior marginal by integrating a full Gaussian Bprime and using only its exterior coordinates. Equivalently set Bprime=S X with S=Sigma^(1/2) and X standard in the FULL free space. Then

    Gamma=T projection_E S,
    E_Sigma F(B_D)
       = integral dnu_I(X) exp[-(1/2) X^t Gamma^t C Gamma X]
           integral dnu_C(B) exp[-B^t Gamma X] F(B).

The unused whitened coordinates cause no extra factor. Gamma is root-by-full-space; transposes are bilinear transposes in its analytic extension, not conjugate transposes. The root covariance C is the inverse of the root PRECISION block P, not the root restriction Sigma_DD of the full covariance.

The original determinant identity is det Q=det P det H. Its factors are exactly those already in the normalized full/root/exterior Gaussians. Rewriting the integral introduces no new Schur determinant multiplying the law. Preserve1513's full normalization dictionary and do not charge another Jacobian here.

## Which identities are actually required between tags

Source2.14 uses the SAME conditional covariance C_s in its Gaussian dnu_(C_s)(B) and compensating quadratic Gamma_s^t C_s Gamma_s. Consequently

    integral dnu_(C_s)(B) exp[-B^t Gamma_s X]
        =exp[(1/2) X^t Gamma_s^t C_s Gamma_s X]

on the admitted complex Gaussian branch. Its cancellation is valid for ANY Gamma_s; it does not require a square-root identity S_s^2=Sigma_s. It also does not require C_s to be the inverse of a separately tagged precision appearing elsewhere. The Gaussian dnu_(C_s) uses C_s^-1 BY DEFINITION. Invertibility, positive integration real part and determinant branch must first be established, as in1543.

Thus the missing interpolation compatibility can be narrowed: build the conditional covariance representation C_s from patch inverses of the ROOT PRINCIPAL precision, use that SAME C_s in the compensator, and build Gamma_s from the finite root/exterior cross matrix and the tagged full square-root representation. At all tags1 these are the actual objects above. At other tags no invented equality between independently tagged nonlinear functions is used. If a different construction uses different covariances in the measure and compensator, the cancellation is lost and must not be imported from this argument.

## Protected perturbation and finite-volume cost

Take a real reference (C0,Gamma0) at the reference tags/background, with 1/B<=C0<=1/a, and ||Gamma0||<=G. Enlarge the protected root to include the finite support of the cross precision T.1543's protected row/column estimates for conditional inverse and full square root, plus the actual finite T derivative bound, give

    ||C_s-C0||<=epsilon, ||Gamma_s-Gamma0||<=C epsilon,
    epsilon=C[rho+exp(-alpha h/2)].

All constants depend on the fixed admitted operator chart, not volume. At a finite localized expansion term all Gamma input columns are supported in its actual localization region Z; the corresponding factor-dependence domains must be retained. This is exact support of the TAGGED term, not a finite support assertion for the original full covariance.

Comparing complex Gaussian density and compensator to the real reference, use the root inverse/logdet estimates1543. Quadratic differences obey

    |X^t(Gamma_s^t C_s Gamma_s-Gamma0^t C0 Gamma0)X|
        <=C epsilon ||X_Z||^2,
    |B^t(Gamma_s-Gamma0)X|
        <=C epsilon (||B_D||^2+||X_Z||^2).

The density determinant costs exp(C epsilon dim D). The real-part inverse difference costs C epsilon ||B_D||^2. Thus, after the already recorded bare interaction bound1539 and any excluded-bond quadratic absorption, the needed Gaussian majorant has the reference form

    exp(C t0 dim D) integral dnu_I(X)
       exp[-(1/2) gamma^t C0 gamma +(u/2)||X_Z||^2]
       integral dnu_(C0)(B)
          exp[-B^t gamma +(u/2)||B_D||^2],
    gamma=Gamma0 X,
    u=C(epsilon+t0)+gamma_2,
    t0=C(delta0+g0^2+g0^2/delta0).

Here gamma_2 is the fixed small tail-absorption parameter1537, not a coupling or field cutoff. Fixed interpolation/contour radii multiply constants and must be included before choosing u small. Potential derivatives/products and their subsequent polymer counting are not certified by this Gaussian majorant alone.

## Actual cancellation, including its quantitative remainder

If u<=a/2, integrate B exactly. The result has determinant det(I-u C0)^-1/2 and quadratic

    (1/2) gamma^t[(C0^-1-u I)^-1-C0]gamma.

The zeroth-order gamma term cancels the compensator. The remaining inverse difference has norm <=2u/a^2, so it is bounded by u G^2/a^2 ||X_Z||^2. The first determinant is <=exp((u/a) dim D). Set v=u(1+2G^2/a^2); if v<=1/2, integrating the remaining standard X gives at most exp(v dim Z). Unused coordinates outside Z integrate to1. The combined bound is

    exp[C(t0+u)(dim D+dim Z)],

with explicit local VOLUME cost. This reproduces the mechanism of source2.23–2.25 without deleting the exterior variables or demanding S_s^2=Sigma_s. The smallness conditions can be met by a sufficiently small fixed inner complex radius, a sufficiently thick admitted collar, small fixed gamma_2, and then small coupling, conditional on the earlier map/gap hypotheses. The original first cutoff is unchanged.

A finite real SPD block check verifies the reconstructed root covariance C+C Gamma Gamma^t C=Sigma_DD. A separate exact complex symmetric example verifies the determinant cancellation for arbitrary Gamma. These are dictionary/sign checks, not certificates for actual lattice constants or a substitute for the analytical proof.

## What remains

This closes the finite block-Gaussian identity/compensator matching gate for the stated bare-first operator construction. It does NOT certify source116's full connected activity sum, its product/contour derivative bounds, every source projected operator, the earlier flat-gap/map hypotheses independently, or the second step's old E1. Before any public theorem promotion, consolidate1533–1544 and audit the actual first-law/map hypotheses and remaining activity/marginal conditions as ONE scoped packet, preserving the adverse1524 context. Do not proliferate minor papers or assign manuscript scores to these notes.

Levels: literature—selected exact source conditioning/compensator formulas; heuristic—participating-parent block identity, interpolation dictionary and absorption proof, unreviewed; formal—none new; speculative/open—complete activity/marginal/global transfer. Falsifiers: confusing C with Sigma_DD, different covariance in measure/compensator, omitted exterior mean/Schur normalization, unprotected cross support, or hiding the local dimension factors.
