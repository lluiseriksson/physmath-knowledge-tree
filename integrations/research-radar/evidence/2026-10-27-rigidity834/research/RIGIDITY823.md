# Candidate823 — exact rigidity of unimodular midpoint equality

Own proposed theorem for hostile audit, not a reviewed manuscript or importance claim. It relies on the source coefficientwise Theorem3.1 of Leake–Mohammadi Yekta2609.39917v1, not on a solution of their Question1.7. All fields below are positive real external weights on ORIGINAL input coordinates.

## Lemma A: squarefree lattice-point enumerators

For any nonempty lattice polytope P in R^n, E_P(z)=sum_{a in P intersect Z^n} z^a is squarefree in C[z_1^+-1,...,z_n^+-1]. A monomial is a unit and causes no exception.

Proposed proof. Suppose E_P=G^2 H with G a nonunit Laurent polynomial. Newton products give P=2Q+R, Q=Newt(G),R=Newt(H), and Q has an edge e. Choose a functional u in the relative interior of the normal cone of e, avoiding the finitely many normal cones of R-faces of dimension>=2 and the intersections with normal cones of R-edges not parallel to e. These avoided sets have dimension at most n-2 inside the n-1 dimensional edge cone. Therefore face_u(Q)=e and face_u(R) is a vertex or an edge parallel to e. The same statement holds in the affine span if P is lower dimensional, after quotienting its common normal lineality.

Thus face_u(P)=2e+face_u(R) is an edge. With v its primitive integer direction, its full lattice-point polynomial, up to a Laurent monomial, is1+t+...+t^m for t=z^v. Its roots in C* are simple in characteristic zero. Face products also give in_u(E_P)=in_u(G)^2 in_u(H). Since in_u(G) has at least two terms on e, after a monomial factor it is a nonconstant univariate polynomial in t with nonzero constant coefficient. It has a nonzero complex root which would be repeated in1+t+...+t^m, contradiction. The generic-face selection and lower-dimensional case require careful audit; no irreducibility is claimed.

## Theorem B: equality is exactly symmetric integral translation

Let M be an integer full-row-rank matrix whose nonzero maximal minors are+-1. Fix one integer coordinate box l<=x<=u (finite, or extended bounds provided the three fibers below are bounded). Let b_-,b_0,b_+ be integral and b_-+b_+=2b_0. Assume all three real box fibers P_s={x:Mx=b_s,l<=x<=u} are nonempty and bounded. Define F_s(w)=sum_{x in P_s intersect Z^n} w^x.

The following are equivalent:
(i) F_0(w0)^2=F_-(w0)F_+(w0) for at least one w0 in R_>0^n;
(ii) F_0(z)^2=F_-(z)F_+(z) as Laurent polynomials;
(iii) there exists h in Z^n with P_+=P_0+h and P_-=P_0-h.

Consequently equality either holds for EVERY positive field or the source inequality is strict for EVERY positive field. In the unweighted case equality forces all three counts to be equal; no nonconstant geometric-progression equality can occur.

Proof. By source Theorem3.1, D(z)=F_0(z)^2-F_-(z)F_+(z) has nonnegative coefficients. This statement applies to a common finite integer box containing the three fibers if original bounds are extended. Positive evaluation zero forces D identically zero, proving(i)->(ii). Vertices of each fiber are integral: a vertex fixes enough coordinates at integer bounds, and the remaining independent column basis of M has determinant+-1. Hence P_s is the convex hull of its integer points.

Apply Lemma A to each F_s. In the Laurent UFD, each nonunit irreducible factor of F_0 occurs with exponent2 on its square, and each F_- or F_+ is squarefree. Thus every factor occurs once in BOTH F_- and F_+, and no other factor occurs. Therefore F_+=c z^h F_0, F_-=c^-1 z^-h F_0. All enumerator coefficients are1, so c=1. Equality of exponent supports, then convex hulls, gives(iii). Conversely translations give exactly those monomial identities, hence(ii) and(i). Empty fibers and nonpositive weights are excluded.

## Algorithm C: equality decision without counting

Compute coordinate minima m_s,i and maxima U_s,i for the three fibers by6n linear optimizations. They are integral by the preceding integrality. Define h=m_+-m_0. Equality holds exactly when
M h=b_+-b_0,
U_+=U_0+h,
m_-=m_0-h,
U_-=U_0-h.

Reason: P_s equals {x:Mx=b_s,m_s<=x<=U_s}; replacing original bounds by its actual coordinate extrema changes nothing. The displayed tests therefore give exactly the symmetric translations. Conversely translations imply these tests. h is unique because a bounded nonempty polytope has no nonzero translation stabilizer. Under binary-encoded rational/integer input and the unimodularity/nonempty-bounded promises, these are polynomially many exact rational LPs, yielding a polynomial bit-complexity decision independent of w. No strongly-polynomial bound or general exact counting algorithm is claimed.

For binary boxes each translated point x and x+-h must all belong to{0,1}^n, which forces h=0. Therefore distinct feasible endpoints with integer mean have STRICT weighted midpoint inequality. The statement is vacuous when no distinct integer midpoint triple exists.

## Consequence D:820 has no such positive weighted unimodular realization

Suppose a common fixed-box unimodular family, with auxiliary RHS coordinates fixed and two affine output directions, realizes the nine coefficients of820 at one positive field, possibly after a common scalar and exponential/monomial output rescaling. Its three opposite pairs have exact midpoint equality because(6/5)(5/6)=1. By B, the three outer fibers corresponding to v1=(-1,-1),v2=(1,0),v3=(0,1) are P_0+h_i (and opposite fibers P_0-h_i). Since v1+v2+v3=0, convexity of the common box implies
(P_v1+P_v2+P_v3)/3 = P_0+(h1+h2+h3)/3 is contained in P_0.
A bounded nonempty polytope cannot contain its nonzero translate, so h1+h2+h3=0. Then product_i F_vi(w)=F_0(w)^3, contradicting the three endpoint coefficients(6/5)^3>1. Scalar/exponential output rescalings cancel at the specified barycenters.

Thus this EXACT array is not a weighted unimodular box-fiber realization, even though it satisfies VLC and midpoint/line inequalities. This consequence does not exclude nearby strictly perturbed arrays and does not answer Question1.7. The finite-source coefficientwise theorem, geometric lemma and UFD step must all be checked before claiming any of B-D. No score, independent review, formal proof or worldwide novelty is claimed. The squarefree lemma may be elementary/folklore; the actual added value and close antecedents need source comparison rather than a novelty inference from search failure.
