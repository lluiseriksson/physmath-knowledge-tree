# Uniform local Gaussian control from the actual first free precision

Participating-parent derivation, unreviewed. This supplies an operator lemma for the first-step precision of1539 under its explicit actual-map hypotheses; it does not claim the full source cluster theorem, second-step admission or a global physical result.

Dictionary: coordinates are the source FREE Lie blocks after elimination of selected bonds; Q(U) is the Hessian at x=0 of the complete leading bare action in the actual transported relative frames, not the global divergence-only formal family. Principal submatrices Q_D describe Gaussian conditioning on fixed exterior free variables. Background dependence includes every selected-map and frame coefficient. The source conditioning/localization target is CMP1162.5–2.26, DOI10.1007/BF01239022, cached SHA256 ee39523a0f7b83af958513c7bd6f9c7731934b40355ef5d6b0f7a68ee6d022fc. Selected formulas were read1537/1539; no new full source proof audit.

## Actual antecedents retained

1533 gives the parent flat gap a>0 for Qflat from the source contour/average constraint geometry; no numerical a or formal proof was certified.1534/1539 give fixed-L finite local carriers, bounded overlap and fixed-chart analytic selected maps for the bare first integral. Consequently Q(U) has a fixed finite interaction range and is holomorphic in a smaller fixed chart after complexification of the ORIGINAL local maps. Inverse group elements, not complex conjugation of independent complex coordinates, define that extension. At I it equals Qflat.

These finite maps yield BOTH row and column block-norm sums

    ||E(U)||_row, ||E(U)||_col <= C_Q rho,
    E(U)=Q(U)-Qflat,

when every local background chart coordinate has size <=rho. Range R_E and C_Q depend on fixed L, finite prototype sizes and norm conventions, not total volume. This is the same finite-prototype derivative mechanism as1534, applied to the Hessian at x=0; there is no sum over a volume-growing chart. An off-shell extension must still agree with the actual physical precision on the admitted critical branch. The false gauge-return identification1489 is not used.

Let ||Qflat||_2<=B and Qflat>=a I. The free graph, with fixed block multiplicity, has ball bound |Ball(x,r)|<=C_ball(1+r)^d on source-admissible periodic lifts, uniformly in volume. Local graph distance must retain the source/fine metric dictionary. This polynomial growth is needed below; l2 control alone is not a uniform row-sum bound.

## Flat inverses on arbitrary conditional domains

Take B0>=2B and set theta=1-a/B0, so 0<theta<1. For ANY subset D of free blocks, Qflat,D is its principal submatrix. Extending a vector by zero gives a I<=Qflat,D<=B I. If the precision range is R>=1, then T_D=I-Qflat,D/B0 has range R and ||T_D||_2<=theta. Therefore

    Qflat,D^-1=B0^-1 sum_(n>=0) T_D^n.

A row of T_D^n is supported in Ball(x,nR). Block Cauchy-Schwarz gives its row sum <=C_ball^1/2 (1+nR)^(d/2) theta^n, with fixed block-dimension conversion included. The same holds for columns. It is invalid to replace this argument by a volume-dependent l2-to-linfinity estimate.

Choose alpha=-log(theta)/(2R). Define the weighted Schur norm ||K||_alpha as the maximum of row and column sums of exp(alpha dist(x,y)) ||K_xy||. The triangle inequality for distance makes this norm submultiplicative. Uniformly in D,

    ||Qflat,D^-1||_alpha <= M_alpha,
    M_alpha=(C_ball^1/2/B0)
       sum_(n>=0)(1+nR)^(d/2) theta^(n/2) < infinity.

Empty D is trivial. A range-zero precision can be treated as diagonal or by taking R=1. Periodic distance is allowed only with the same admitted finite geometry; deleting blocks cannot enlarge the original ball-count bound when propagation is measured in the ambient metric.

## Complex perturbations and conditional means

The actual finite-range perturbation satisfies ||E_D||_alpha<=exp(alpha R_E) C_Q rho. Choose a FIXED rho small enough that M_alpha exp(alpha R_E) C_Q rho<=1/2. Then, for every D,

    C_D(U)=Q_D(U)^-1
      =sum_(n>=0)(-Qflat,D^-1 E_D)^n Qflat,D^-1,
    ||C_D(U)||_alpha<=2 M_alpha.

The series is locally uniformly holomorphic, uniformly over D and volume. Real positivity also follows after imposing C_Q rho<=a/2. In the complex chart Hermitian real part is bounded below by a/2 as well, since the unweighted operator perturbation is <=C_Q rho by the two Schur bounds. No eigenvalue or determinant crosses zero on this chart.

The conditional mean is -C_D Q_(D,Dc) A_Dc. Finite range of the cross precision and the weighted Schur bound give an exponentially decaying kernel with a uniform row/column constant. It is not zero beyond a collar. This mean retains the exterior variable; it cannot be replaced by vacuum in a marked covariance.

For D contained in Dprime, the exact boundary resolvent identity, for x,y in D, is

    C_Dprime(x,y)-C_D(x,y)
      =-sum_(u in D,v in Dprime minus D)
           C_D(x,u) Q(u,v) C_Dprime(v,y).

The sign is negative; for a real nearest-neighbor precision the two off-diagonal factors can give a positive diagonal correction. The identity follows by applying Q_D to the restricted Dprime inverse. Weighted Schur bounds and the finite-range crossing imply decay with distance to the removed boundary, and with the total path length x-u-v-y. They supply quantitative locality rather than literal finite support for C_D.

## Determinants: local bound, not a hidden volume constant

On each D, the branch fixed at Qflat,D has

    log det Q_D(U)-log det Qflat,D
       =sum_(n>=1)(-1)^(n+1)/n
           Tr[(Qflat,D^-1 E_D)^n].

Each trace is a sum of rooted closed matrix walks. Absolute rooted sums are bounded by the weighted Schur products, with ratio at most1/2; the total bound is C |D|, not C independent of volume. The background-independent flat inverse carries the long steps and E carries the actual finite local background dependence. Derivatives use C_D dot Q_D and, for second derivatives, C_D ddot Q_D-C_D dot Q_D C_D dot Q_D, retaining all selected/frame derivatives. This provides a uniform local derivative mechanism when those finite derivative norms are bounded; it is not yet a complete connected polymer resummation or a proof of the source's specific decoupling-parameter domains.

No new determinant is added to the law: use the exact normalization accounting1513. The above is a method for bounding its existing local/background-dependent contribution.

## Consequence and next finite target

Under the ACTUAL fixed-chart finite-map hypotheses and the earlier parent flat gap, uniform Gaussian conditional inverse/mean/boundary locality need not be assumed separately: the explicit weighted construction derives it. This does not certify the numerical constants, the source's full interpolation family, the flat gap independently, or the first-law parameter ambiguity. All these antecedents remain visible.

Next connect the bare interaction bound1539 to a complete interpolation used for connected activities: verify that the Gaussian conditioning/localization interpolation preserves the required positive/complex Schur margins, rather than assuming every decoupled operator is an admitted precision. A convex principal/block-diagonal interpolation has a direct real gap, but its exact relation to the source expansion and determinant normalization must be established before importing116Lemma3. Do not create another minor paper or score for this operator lemma.

Levels: literature—actual source conditioning dictionary and previously read statements; heuristic—participating-parent operator derivation and application to fixed analytic prototypes, unreviewed; formal—none new; speculative/open—complete decoupling/activity transfer and physical/history/global target. Falsifiers: absent flat gap, wrong free coordinates, volume-growing derivative/carrier sums, nonpolynomial graph growth without another row-sum proof, lost complex branch or interpolation outside the admitted operator chart.
