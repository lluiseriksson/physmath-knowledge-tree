# Finite pure-frame approximation closes the universal qubit constant

Author continuation, 2026-10-30. Same preparation research candidate; not a separate paper, score, formal theorem or novelty certification. This draft is frozen for one possible component inspection. It does not alter1365 or its completed inspection.

## Target, quantifiers and known inputs

For each finite d>=2 and N>=1, let C_(d,N)(r) contain all (Psi,F,sigma) with Psi:M_d->M_d CPTP and ordinary trace-distance contraction eta(Psi)<=r, F an N-outcome POVM on C^d, sigma_y qubit density matrices, and E(X)=sum_y Tr(F_y X)sigma_y. Use input-first unnormalized Choi J=sum_y (Psi*(F_y))^T tensor sigma_y and the existing positive coefficient

    alpha_+(E Psi)=max{Tr W: W>=0, J>=I_d tensor W}.

The previous1365 component supplies the universal lower bound alpha_+>=max(0,1-2r) for each such finite factorization. That lower bound is an INPUT to the present closure, not newly audited here or inferred from the finite check. No historical numeric assessment transfers.

The proposed conclusion concerns the union over dimensions AND outcome counts:

    F_union(r):=inf_{d>=2,N finite} inf_{(Psi,F,sigma) in C_(d,N)(r)} alpha_+(E Psi)
              =max(0,1-2r),  0<=r<=1.

Equivalently2 is the best coefficient valid uniformly over all finite d,N. This is NOT a formula for each fixed d,N or each fixed E. The fixed d4/N4 joint envelope from1365 is different: at r=1/2 it is1-sqrt(3)/2>0, while F_union(1/2)=0 as an infimum. No finite optimizer at the boundary r=1/2 is asserted.

Known antecedents: sphere-averaged measurement norms are established. Matthews–Wehner–Winter0810.2327v2 distinguish full-Hermitian domination (upper constant1) from traceless-Hermitian domination; the uniform POVM has the latter upper constant1/2. Aubrun–Lancien1309.6003v3 Proposition2.1 and Corollary2.2 already give finite POVM approximation preserving the barycenter and pure support. The geometry/finite approximation is not new. Below is an explicit antipodal quadrature plus a factorization/Choi-kernel transfer. Exact covering prior art for that transfer/envelope is unresolved. Treat this as closure of an existing constant question, not another corollary manuscript.

## 1. Any balanced finite pure frame has the required kernel

Let w_y>0, sum w_y=1, n_y in S^2, sum w_y n_y=0. Put sigma_y=(I_2+n_y.sigma)/2, so sum w_y sigma_y=I_2/2. Choose d=N>=2 and identify C^d=C^2 direct-sum C^(d-2). For0<=u<=1 define

    H_y(u)=[(1-u)w_y I_2+2u w_y sigma_y^T] direct-sum w_y I_(d-2).

They are positive and sum to I_d. Logical eigenvalues are w_y(1+u),w_y(1-u), complementary eigenvalues w_y. Define the square CPTP prefix Psi_u(X)=sum_y Tr(H_y(u)X)|y><y| and terminal F_y=|y><y| preparing sigma_y. Every finite frame gives an admissible actual factorization, with no continuum label encoded into a finite output.

Set

    t_frame=max_{|a|=1} sum_y w_y |a.n_y|
           =2 max_{S subset[N]} |sum_{y in S} w_y n_y|.

For H_S the logical eigenvalues are w_S +/- u|sum_S w_y n_y| and the complementary eigenvalue is w_S. The QC contraction formula (Jordan decomposition and extreme eigenstates) gives eta(Psi_u)=u t_frame over all d-dimensional inputs, including coherences between blocks. Transposing the qubit effects reflects the Bloch Y coordinate and leaves this maximum unchanged.

The composite Choi matrix at u=1 has logical block

    J_1|logical=2 sum_y w_y sigma_y tensor sigma_y,

and complementary block I_(d-2) tensor I_2/2. Each pure sigma_y tensor sigma_y annihilates the logical singlet z=(|0,1>-|1,0>)/sqrt(2). Only purity and the first moment are used; a spherical2design is NOT required. Moreover

    J_u=(1-u) I_d tensor I_2/2+u J_1.

Thus W0=(1-u)I_2/2 is primal feasible. The singlet marginal is I_2/2 and J_u z=(1-u)z/2. Every feasible W satisfies Tr W<=1-u. Equivalently Z=2|z><z| is dual feasible with marginal I_2 and objective1-u. Hence alpha_+(E Psi_u)=1-u, exactly, for any balanced finite pure frame.

## 2. Explicit finite antipodal approximations, with a uniform error

For each integer q>=2 use N_q=2q^2 points indexed by0<=j<q and0<=ell<2q:

    theta_j=(j+1/2) pi/q,
    phi_ell=(ell+1/2) pi/q,
    n_(j,ell)=(sin theta_j cos phi_ell, sin theta_j sin phi_ell, cos theta_j),
    w_(j,ell)=[cos(j pi/q)-cos((j+1)pi/q)]/(4q).

These are positive cell-area weights for the normalized spherical area measure. Summing over ell and telescoping over j gives sum w=1. The antipodal partner is (q-1-j,ell+q modulo2q); it has the same weight and opposite n. Therefore sum w n=0 EXACTLY, not approximately. This exact first moment is essential for a POVM and the replacer state I_2/2.

Partition the sphere into latitude-longitude cells [j pi/q,(j+1)pi/q] times [ell pi/q,(ell+1)pi/q]. A point in a cell has Euclidean distance at most pi/q from its center: travel along a meridian and then the latitude, of total length at most pi/(2q)+sin(theta)pi/(2q)<=pi/q. The Euclidean chord is no larger than that path. Boundary/pole conventions only affect measure-zero sets.

For every unit a, n -> |a.n| is1-Lipschitz. Its exact normalized spherical average is1/2. Therefore the quadrature obeys, UNIFORMLY in a,

    |sum_y w_y |a.n_y|-1/2|<=pi/q.

Taking a maximum gives t_q<=1/2+pi/q. Conversely averaging the finite expression over a gives exactly1/2, so t_q>=1/2. Also t_q<=1. Thus

    1/2<=t_q<=min(1,1/2+pi/q),  t_q -> 1/2.

No random samples, numerical grid maximization, giant matrix download or fixed finite-N optimality is involved. Each q specifies finite algebraic weights/states and a square prefix of dimension d_q=N_q. The dimension cost grows and is not suppressed in the sharpness claim. This explicit construction is an elementary approximation control, not a new sparsification theorem.

## 3. Joint-union envelope and best uniform coefficient

For fixed r in[0,1], choose u_q=min(1,r/t_q). Then eta(Psi_(q,u_q))=min(t_q,r)<=r, and

    alpha_+(E_q Psi_(q,u_q))=max(0,1-r/t_q) -> max(0,1-2r).

Every member of this sequence is in a finite-dimensional, finite-outcome class included in F_union(r), so it gives the upper bound on that infimum. The previous lower bound gives the reverse inequality. At r=0, u=0 attains1. At r>1/2, choose q with pi/q<r-1/2 and u=1 to attain0 in a finite (possibly large) dimension. At r=1/2 the limiting argument gives infimum0; attainment is not concluded. At r<1/2 the same argument only concerns an infimum, not a fixed-resource optimizer.

For any candidate universal coefficient0<=c<2, choose q large enough that c t_q<1 (for c=0 any q works). At u=1, alpha_+=0 but1-c eta(Psi)>0, so the bound alpha_+>=max(0,1-c eta(Psi)) fails. This proves optimality of2 as a uniform coefficient, conditional only on the already established lower bound, and preserves all dimensions until the explicit union infimum is taken.

## 4. Exact finite control and limits

checker1368.py checks q=2, N=d=8 with exact complex SymPy matrices. Its weighted second moment is diag(1/4,1/4,1/2), so this control deliberately is not a2design. All256subset sums give t_2=1/sqrt(2), J_1 has eigenvalues3/4(multiplicity2),1/2(multiplicity13),0(multiplicity1), and the explicit primal/dual pair gives alpha_+=1-u. Deleting one atom and renormalizing loses the zero barycenter; that tempting naive approximation does not define the required normalized frame. The checker ran once successfully under Python3.12/SymPy1.14.0. It creates its result with exclusive mode to avoid silently rewriting frozen outputs; replay a COPY of the checker in a fresh C: folder, then compare its new output to the frozen JSON.

This finite test is not the proof of the quadrature estimate, its uniformity, convergence, general kernel argument or universal lower bound. Those are analytic statements. No ready research-campaign capsule, Lean proof, numeric grade, manuscript assessment or empirical performance claim is made.

Sourced facts/literature: known measurement norms and barycenter/pure-support finite approximation. Graph-supported inference: none beyond channel context from the retrieved small quantum-information subgraph. New author inference pending inspection: the weighted-frame factorization/kernel transfer and conditional union-envelope closure. Its novelty/importance is speculative and unassessed. Canonical graph confidence remains unchanged.

Falsifiers/abandonment conditions: incorrect normalization or loss of exact first moment; a larger contraction caused by the complementary block; failure of the pure-state singlet kernel; a nonuniform quadrature bound; mistaking an infimum over growing resources for a fixed-resource result; or a covering antecedent. A covering source removes a novelty claim, and known finite approximation must not be repackaged as an own new theorem. Even if the algebra survives, integrate only as closure of the same existing note, not a separate paper.
