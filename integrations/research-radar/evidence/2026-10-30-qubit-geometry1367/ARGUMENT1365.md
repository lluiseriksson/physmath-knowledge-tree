# Qubit preparation: eliminate input dimension using Bloch geometry

2026-10-30. Author derivation, frozen for a possible single component inspection.
No numerical grade, manuscript, editorial claim, Lean theorem or novelty certification.
This is one continuation of the existing fixed-output preparation problem, not a new paper.

## Precise target and evidence layers

Fix positive integers d,N, qubit output k=2 and 0<=r<=1. Let Psi:M_d->M_d be CPTP with ordinary trace-norm contraction eta(Psi)<=r. Let E(X)=sum_y Tr(F_y X) sigma_y, where (F_y) is a POVM on C^d and each sigma_y is a qubit density matrix. Use input-first UNNORMALIZED Choi matrix J=sum_y (Psi*(F_y))^T tensor sigma_y. Define

    alpha_+(E Psi)=max{Tr W: W>=0, J>=I_d tensor W}.

For d=1 put eta=0. The prefix contraction is essential: a bound for an arbitrary EB composite in terms of the composite's contraction alone is NOT asserted.

Sourced fact / literature: finite measurement norms, Bloch coordinates and distinct positive versus Hermitian Doeblin optimizations already have antecedents. The prior own ARGUMENT1351 proves a dimension-dependent lower bound via a positive dual normalization; its one unscored inspection is context, not a review of this draft. Graph-supported inference: the retrieved quantum-information neighborhood only supplies channel/quantifier context, not this bound. New analytic hypothesis/result pending inspection: for all finite N,

    alpha_+(E Psi)>=max(0,1-2r),

and for N=4 the stronger dimension-independent bound

    alpha_+(E Psi)>=max(0,1-sqrt(3) r).

For precisely d=4,k=2,N=4, the proposed sharp envelope is

    inf_{eta(Psi)<=r} alpha_+(E Psi)=max(0,1-sqrt(3) r).

Confidence for new claims remains heuristic/pending analytic review; no graph upgrade to formal. Worldwide novelty and practical importance are speculative. The finite exact checker supports one witness and one polynomial identity, not the general theorem.

## 1. Qubit measurement geometry

Write any qubit POVM B_y=a_y I+v_y.sigma, with a_y>=|v_y|, sum a_y=1 and sum v_y=0. Let L=sum |v_y|. Then sum lambda_min(B_y)=1-L. For its classical-output measurement channel M,

    eta(M)=max_{|w|=1} sum_y |w.v_y|
          =2 max_{S subset [N]} |sum_{y in S} v_y|.

Indeed qubit state differences are (w.sigma)/2, input trace norm |w|, and output entries w.v_y. Every direction is realized by two antipodal pure states. The absolute-value sum maximizes over signs, and zero sum of vectors converts signs to twice subset sums.

Averaging over uniform directions on S^2 gives E|w.v|=|v|/2 (rotate v to the north pole and integrate |cos theta|). Thus eta(M)>=L/2 and

    sum lambda_min(B_y)>=1-2 eta(M).

This is a fixed three-dimensional Bloch-vector statement; no d appears.

For FOUR outcomes put M0=max_S |sum_{S}v_y|, x=v1+v2, y=v1+v3, z=v1+v4. Zero sum gives

    sum_i |v_i|^2=|x|^2+|y|^2+|z|^2<=3 M0^2.

By Cauchy-Schwarz, L<=2 sqrt(sum |v_i|^2)<=2 sqrt(3) M0=sqrt(3) eta(M). Consequently sum lambda_min>=1-sqrt(3) eta(M). The proof covers zero effects and degenerate configurations. For two outcomes the constant is 1; for three, complements of singletons give eta=2 max |v_i| and L<=3 eta/2. These last two cases are supporting context, not separate claimed discoveries.

## 2. Transfer through the positive-component dual

Set A_y=Psi*(F_y). The dual of the positive-W primal is

    inf Tr(J Z), Z>=0, Tr_A Z>=I_2.

It is strictly feasible at Z=t I_(2d), t>1/d. The primal is feasible at W=0 and bounded by Tr W<=1 (take partial trace over input in J>=I tensor W). Finite-dimensional SDP duality therefore applies, even when J is singular.

For an arbitrary feasible Z set S=Tr_A Z>=I_2, Z'=(I tensor S^-1/2)Z(I tensor S^-1/2). Then Z'>=0 and Tr_A Z'=I_2. The map Omega(X)=Tr_A[(X^T tensor I_2) Z'] is CP and unital. Its trace adjoint Lambda=Omega* is CPTP M_2->M_d. Thus

    B'_y=Omega(A_y)=(Psi Lambda)*(F_y)

is a qubit POVM. The channel Psi Lambda has ordinary contraction <=r because Lambda contracts trace distances. Terminal measurement also contracts, so the measurement channel of B'_y has eta<=r. This is the input/output distinction on which the dimension elimination depends.

Let B_y=Tr_A[(A_y^T tensor I_2)Z]=S^1/2 B'_y S^1/2. Since m_y=lambda_min(B'_y)>=0,

    B_y>=m_y S>=m_y I_2.

For every feasible Z, therefore,

    Tr(JZ)=sum Tr(sigma_y B_y)>=sum m_y
          >=1-2r,

and for four outcomes >=1-sqrt(3)r. Strong duality and alpha_+>=0 conclude the lower bounds. We do not assert Z'<=Z or B_y>=B'_y; those invalid shortcuts are unnecessary.

The previous d/2 bound can be combined by taking the best of valid coefficients; it is strictly improved by sqrt(3) for d>=4,N=4 and by 2 for d>=5 with arbitrary N. No improvement is asserted in regimes where the earlier minimum is already smaller.

## 3. An admissible four-dimensional tetrahedral equality family

Let n_y be the four vectors (1,1,1),(1,-1,-1),(-1,1,-1),(-1,-1,1), divided by sqrt(3). Put sigma_y=(I_2+n_y.sigma)/2. They are pure, sum sigma_y=2 I_2 and n_i.n_j=-1/3 for i!=j. For 0<=u<=1 use four input effects on C^4=C^2 direct-sum C^2:

    H_y(u)=[(1-u)I_2/4+u sigma_y^T/2] direct-sum I_2/4.

They are positive and sum to I_4. Define the square prefix Psi_u(X)=sum_y Tr(H_y X)|y><y| and final E with F_y=|y><y| preparing sigma_y. No coherent quantum output label or nonphysical preprocessing is assumed.

For a subset S the complementary input block is |S| I_2/4, while the logical block has eigenvalues |S|/4 +/- u |sum_S n_y|/4. Hence

    osc(sum_S H_y)=u |sum_S n_y|/2.

For singleton/triple subsets the value is u/2; for pairs it is u/sqrt(3); empty/full give zero. Therefore eta(Psi_u)=u/sqrt(3). The usual QC oscillation formula follows by Jordan decomposition of any traceless Hermitian input into two positive equal-trace parts; the upper bound is attained by extreme eigenstates of a maximizing subset effect.

Under the stated Choi convention the transpose in H_y is CRITICAL. The logical input-output block is

    J_u|logical=(1-u) I_4/2+u (I_4+Swap)/3,

and the complementary block is I_4/2. This follows from the tetrahedral second moment, or the exact direct matrix calculation. W0=(1-u)I_2/2 is primal feasible. Embed the logical singlet z=(|0,1>-|1,0>)/sqrt(2); its output marginal is I_2/2 and J_u z=(1-u)z/2. Every feasible W then satisfies

    0<=<z,(J_u-I tensor W)z>=(1-u-Tr W)/2.

Thus alpha_+=1-u. Equivalently Z=2|z><z| is dual feasible with objective 1-u. For 0<=r<=1/sqrt(3) choose u=sqrt(3)r; for larger r choose u=1. This proves the proposed restricted sharp envelope if the general lower-bound argument survives inspection. It does not solve every d,k,N envelope.

## 4. Exact checks, negative controls, falsifiers, scope

checker1365.py uses exact complex SymPy matrices, enumerates all16 subsets for this single witness and verifies Choi, primal slack, dual marginal/objective, singlet and four-vector norm identity. Its first execution stopped on an unsimplified symbolic trace equality; replacing syntactic equality by simplify(trace-1)==0 repaired the checker. This failed execution is retained in READING1365.json. The second execution passed. There was no numerical optimizer, stochastic campaign, parameter fit or benchmark/task download.

The deliberately WRONG construction without conjugating effects does not have the singlet kernel: its singlet expectation at u=1 is 1/3 instead of zero. That failed route is a useful transpose falsifier, not an admissible counterexample to the corrected construction.

Concrete falsifiers: an error in the positive dual normalization/ordinary contraction interface; a zero-sum four-vector configuration violating L<=sqrt(3) eta; a channel satisfying the exact factorization with alpha below the proposed bound; or an incorrect Choi/marginal calculation. The general geometric argument, not finite samples, is required to exclude them. Abandon a separate publication if the exact factorized statement is already present or is only a routine restatement of known results. Do not infer novelty from no string match for 'tetra'.

## 5. Primary antecedents and next decision

- Matthews, Wehner, Winter, arXiv:0810.2327v2 (first2008-10-13, v2 2008-10-26; CMP291(2009), DOI10.1007/s00220-009-0890-5): abstract and selected section2.1/Theorem9 statement, formula12 and local start of proof read. Uniform measurement norms and spherical averaging are established antecedents; no full source proof audit or novelty claim for that geometry.
- George, Hirche, Nuradha, Wilde, arXiv:2503.22823v3: selected introduction Hermitian-vs-positive distinction, section7.3 EB form/Proposition36 statement, section7.5 Proposition38 local proof and Theorem5 statement read. Its qubit-to-qubit faithful Hermitian coefficient does not by itself establish a bound for a square d-prefix followed by qubit preparation. Full theorem5 proof not audited this run. Exact positive/factorization overlap still requires targeted checking.
- Delsol, Fawzi, Kochanowski, Ramachandran, arXiv:2507.16737v3 (first2025-07-22, selectedv3 2026-10-14): Proposition28 local proof and Remark29 classical exclusion context revisited. This source already rules out broad untailored lower bounds; it is not the same fixed-output post-preparation class. No new publication inferred from current indexing or conference date.

Response dates/hashes in PRIMARY-PINS1365.json identify fetched responses, not proof audits. Whole foreign article bodies are not retained. This is a directed antecedent check, not exhaustive literature review. One substantive next move: finish the selected positive-coefficient/factorization antecedent check, then ONE unscored separate-context component inspection of this exact draft and checker, preserving actual identity limitations and all objections. Only after that decide whether to integrate as an extension of the existing note. No new manuscript or inherited grade.
