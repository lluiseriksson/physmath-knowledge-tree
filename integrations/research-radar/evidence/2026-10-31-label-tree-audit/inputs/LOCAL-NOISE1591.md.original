# Local Gaussian convolution retains the original cutoff and endpoint incidence

Parent unreviewed conditional finite-factor deduction,31October2026. Outside assessment1575. This returns to the fixed-cutoff density response, rather than assuming the independent leaves rejected1590. It supplies an exact response representation, not rooted summability or a source admission certificate. No novelty claim is made for Gaussian convolution or the heat identity.

## Fixed original factors and a removable auxiliary Gaussian

Use the finite factor model1566/1574: original interaction factors and original signed cutoff-tail factors, selected once, merged into overlap components with disjoint raw coordinate unions U_j. Put G_j=product of the selected factors in component j, and G=product_j G_j. No threshold or component support is changed. Assume the actual REAL forest covariance satisfies B^(-1) I <= C_F <= a^(-1) I uniformly, as in1567/1569. These are conditional source hypotheses, not newly verified physical constants.

Choose c=1/(2B), fixed across all forest parameters and volumes. Split, exactly in distribution,

    X=Y+Z,  Y~N(0,C_F-c I), Z~N(0,c I), Y independent of Z.

The residual covariance remains at least c I. Its leaf-leaf blocks need not vanish. Because the U_j are disjoint, the Z coordinates for different components are independent, giving the exact conditional integration identity

    E_(C_F) G(X) = E_(C_F-c I) product_j g_j(Y_Uj),
    g_j(y)=E_(c I on U_j) G_j(y+Z_Uj).

This is an auxiliary integration of precisely the same finite law; it does not replace a hard cutoff by a chosen smooth cutoff. The original measurable factor remains inside the convolution and its threshold stays fixed. Marginalizing Y,Z recovers the original X law exactly. It is unrelated to creating an independent-leaf approximation.

For a coordinate multiindex alpha on U_j, differentiating the Gaussian convolution KERNEL gives

    partial^alpha g_j(y)
      = c^(-|alpha|/2) E_Z[G_j(y+Z) He_alpha(Z/sqrt(c))].

He_alpha is the product of probabilists' scalar Hermite polynomials. Original indicator functions are never differentiated, so no distributional cutoff-boundary term is discarded. This is distinct from the invalid zero-extension field differentiation rejected1586. Gaussian convolution is smooth; the local interaction growth bounds and sufficiently small t0 ensure the required polynomial-weighted Gaussian integrals exist. For applying derivatives under the residual Gaussian integral, retain this growth condition and a positive spectral neighborhood, not just formal smoothness. Bounded measurable original factors automatically meet the integrability requirement; actual unbounded interaction factors require the already declared smallness bound.

## Distinct forest-edge response with coordinate occupancies retained

Let T be a forest with k distinct edges on the component vertices. Each affine edge direction H_ij has original covariance entries C^orig_uv for u in U_i,v in U_j, plus its transpose. These entries are fixed when differentiating. Apply the Gaussian heat identity to Y and differentiate the smoothed factors g_j. For each edge choose its two endpoint scalar coordinates (u_e,v_e). Let alpha_x count how often scalar coordinate x is chosen among all endpoints. Then the EXACT mixed response is

    D_T E_C G |_(C=C_F)
      = c^(-k) sum_(endpoint assignments)
          [product_e C^orig_(u_e,v_e)]
          E_(Y,Z)[G(Y+Z) product_x He_(alpha_x)(Z_x/sqrt(c))].

There is no 1/2 per edge: the two symmetric off-diagonal directions cancel the 1/2 in the heat operator. There is no k! for differentiating k distinct affine edge variables once. The c^(-k) is from 2k endpoint field derivatives. D_T here denotes derivatives in AFFINE covariance entries evaluated at the forest point, not derivatives of the path-minimum parameter map. The independent noise and its variance c are held fixed. The local spectral gap permits differentiating in an open neighborhood of each such point.

Cauchy-Schwarz on the joint Y,Z law and scalar Hermite orthogonality now give the incidence-preserving bound

    |D_T E_C G|_(C_F)
      <= c^(-k) ||G||_(L2(C_F))
          sum_(endpoint assignments)
             product_e |C^orig_(u_e,v_e)| sqrt(product_x alpha_x!).

The full G norm is the ORIGINAL marginal X norm under C_F. Although G and the noise polynomials are correlated, Cauchy-Schwarz does not require their independence. Only the noise coordinates are independent when evaluating the second norm. This is why retaining all path-minimum leaf correlations in Y causes no omission.

For n interaction insertions and h distinct original cutoff tails, the previously conditional estimate1569 yields ||G||_2 <= (K4 t0)^n q^(h/4), at t0<=a/(32m). Thus the auxiliary convolution can be eliminated completely from the final bound. It contributes no chosen cutoff approximation, normalization ratio, extra determinant baseline or altered coupling.

## What is and is not paid

The factorial is now attached to repeated use of the SAME original scalar coordinate. If every endpoint coordinate is distinct, its occupancy factor is1, even when one component has many different ports. At vertex j, sum_(x in U_j) alpha_x=d_j, so sqrt(product_x alpha_x!) <= sqrt(d_j!). Collapsing all occupancies immediately recovers a coarse degree bound and can destroy the point of the representation.

The endpoint sum is NOT certified summable. Replacing it by product_e sum_(u,v)|C^orig_uv| and sqrt(product_j d_j!) can still incur component-size and translation costs; it does not evade the adverse star majorant1575 or the n^2 placement witness. Nor has the missing first-stage enumeration factorial, normalizer/logarithm estimate, original source geometry or complex-background measure been proved. This is a conditional response formula for actual fixed measurable factor products, rather than a completed polymer theorem.

Next bounded target: try to sum these endpoint assignments jointly with the overlap-component label structure, charging repeated-coordinate occupancies and translations exactly once. Do not posit a summable port tensor as a new input. If the original per-label bounded support/overlap cannot control this retained occupancy sum, park the route; another fixed-component degree inequality will not close it.

## Check and provenance

The attached exact rational check verifies a positive residual Gaussian split and the normalization for two fixed half-space indicators: their convolution derivatives give E[phi(Y1/sqrt(c)) phi(Y2/sqrt(c))]/c = 1/[2 pi sqrt(1-rho^2)], the derivative of the exact centered Gaussian orthant probability. This is a finite normalization check, not identification of half-spaces with the original source cutoff. A separate exact integer check distinguishes distinct-port occupancy1 from a repeated-port factorial. The analytic argument above, rather than those finite checks alone, establishes the conditional formula.

Inputs: own fixed-factor1566, density/Hermite1569, overlap grouping1574 and adverse independent-leaf gate1590; no new external theorem or formal package imported. Current primary-source sweep remains inventory_only, directed rather than exhaustive. Mechanism: integrate an independent local Gaussian slice before differentiating its smooth kernel; preserve original coordinate incidence. Hypotheses: genuine real symmetric uniform spectral bounds, fixed measurable factors on disjoint component supports, finite polynomial-weighted Gaussian moments, distinct affine edge directions. Levels: literature—existing Gaussian/forest context; heuristic—port-incidence rooted sum; formal—none new, no Lean proof/build; speculative—source-wide uniform activity bound. Falsifiers: nonuniform gap, moving cutoff/selected support, omitted path-minimum correlations, or superexponential unsummed occupancy/translation cost. No new manuscript assessment, numeric grade, paper or change to the original law.
