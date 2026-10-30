# Fixed qubit output: an exact falsifier and a dimension-sensitive dual bound

Own analytic draft1351. No model review, manuscript assessment, novelty claim or Lean theorem. Finite-dimensional, finite-preparation setting only. Existing1211PDF/review and every earlier report remain unchanged.

##1. Definitions and question
Let Psi:M_d->M_d be CPTP with ordinary trace-distance contraction eta_tr(Psi)<=r in[0,1]. Let {F_y}_{y=1}^N be a POVM on its output, sigma_y states on C^k, and E(X)=sum_y Tr(F_y X)sigma_y. For N=E o Psi put A_y=Psi*(F_y) and J_N=sum_y A_y^T tensor sigma_y (unnormalized input-first Choi).
Define alpha_plus(N)=max{TrW: W>=0, J_N>=I_d tensor W}. Positivity of W is retained, unlike a Hermitian-only Doeblin relaxation. Target1350 proposed alpha_plus>=1-r for k=2. It is FALSE for genuinely noncommuting quantum prefixes, despite the24classical-prefix probes finding no violation.

##2. Exact d=3,k=2,N=3 witness
Let X,Z be qubit Pauli matrices. Take real trine vectors (x_y,z_y)=(0,1),(sqrt(3)/2,-1/2),(-sqrt(3)/2,-1/2), and sigma_y=(I+x_y X+z_y Z)/2. These are pure and sum_y sigma_y=3I/2.
For0<=u<=1 define qutrit effects
 H_y(u)=(1-u)I_3/3+u[(2/3)sigma_y directsum (1/3)].
Each has eigenvalues (1+u)/3,(1-u)/3,1/3; sum_y H_y=I_3. Thus Psi_u(rho)=sum_y Tr(H_y(u)rho)|y><y| is a square qutrit CPTP prefix. Its input effects do not commute when u>0.
Use terminal F_y=|y><y| and prepare sigma_y on a qubit. This preserves the actual contracting-prefix/final-preparation factorization.
For a finite measurement channel, eta_tr=max_B osc(sum_{y in B}H_y): total variation is the maximum subset probability difference, and the maximum over two states is the spectral oscillation. For three outcomes every proper nonempty subset is a singleton or its complement. Hence eta_tr(Psi_u)=2u/3 exactly, attained by extreme eigenstates of any H_y.
Let J_u be the resulting6-by6 Choi matrix. The exact all-matrix-unit checker establishes J_u=(1-u)(I_3 tensor I_2/2)+u J_1, with J_1>=0. Therefore W=(1-u)I_2/2 is feasible and alpha_plus>=1-u.
For z=(|0>_A|1>_B-|1>_A|0>_B)/sqrt(2), J_u z=(1-u)z/2 and Tr_A|z><z|=I_2/2. If any W>=0 satisfies the Choi constraint, taking its expectation on z gives TrW<=1-u. Thus alpha_plus(E o Psi_u)=1-u exactly.
At u=1, r=2/3 and alpha_plus=0, contradicting the proposed output-only1-r=1/3 bound. This refutes the own proposed extension, not the existing d-dependent theorem. The coefficient is a positive CP common component, not an optimal contraction coefficient. No numerical inference or new randomized campaign is needed.

##3. Rectangular spectral lemma: the lost dimension cannot be erased
For a CPTP Xi:M_k->M_d with eta_tr(Xi)<=r and a POVM {F_y} on C^d, put B_y=Xi*(F_y). Then
 sum_y lambda_min(B_y)>=1-[d(k-1)/k]r.
Indeed lambda_min(B)>=Tr(B)/k-[(k-1)/k]osc(B). Trace/oscillation duality gives osc(Xi*F)<=r osc(F). Sum_y Tr(B_y)=k, while sum_y osc(F_y)<=sum_y Tr(F_y)=d. This proves the bound. The stronger expression1-(k-1)r is NOT obtained unless the relevant output dimension is also k; blindly reusing the square lemma loses d. This was the essential failed shortcut in an initial output-only argument.

##4. Own dual-normalization extension for positive components
Claim, pending separate analytic audit: for the stated finite preparation class,
 alpha_plus(E o Psi)>=max(0,1-c r),
 c=min(d-1,N-1,d(k-1)/k).
The first two coefficients are the existing square-dimension and finite-outcome bounds. The third follows as below.
The positive-W primal has dual inf_{Z>=0,Tr_A Z>=I_k}Tr(J_N Z). Strict dual feasibility (Z=aI with ad>1) and feasible bounded primal give strong duality; no strict positivity of J_N is required.
For any dual-feasible Z set S=Tr_A Z>=I_k and Z'=(I tensor S^{-1/2})Z(I tensor S^{-1/2}). The Choi map Omega(X)=Tr_A[(X^T tensor I)Z'] is CP and unital because Omega(I)=I_k. Consequently Lambda=Omega* is CPTP from M_k to M_d. Define
 B_y=Tr_A[(A_y^T tensor I)Z], B'_y=Omega(A_y).
Then B_y=S^{1/2}B'_y S^{1/2}, B'_y=(Psi o Lambda)*(F_y), and both are positive. As S>=I, lambda_min(B_y)>=lambda_min(B'_y): use B'_y>=lambda_min(B'_y)I and congruence.
Since each sigma_y is a state,
 Tr(J_N Z)=sum_y Tr(sigma_y B_y)>=sum_y lambda_min(B_y)>=sum_y lambda_min(B'_y).
The channel Psi o Lambda:M_k->M_d contracts trace distance by at most r. The rectangular lemma therefore bounds every dual objective below by1-d(k-1)r/k. Strong duality gives the claimed third bound. Nonnegative alpha_plus and the earlier two valid bounds give the stated minimum coefficient.
All transpose and normalization conventions above are explicit. No arbitrary positive map is substituted for a CP map, no reference dimension is silently bounded, and no identification with the Hermitian-only source coefficient is made. This is an analytic argument, not something certified by the trine checker.

##5. Proposed sharp completion of the defined d3,k2,N3 problem
Subject to verification of section4, c=3/2 for d3,k2,N3. Hence the infimum over that whole class is max(0,1-3r/2): for r<=2/3 choose u=3r/2 in section2; for r>=2/3 use u=1 whose actual contraction is<=r. This is a complete witness for the restricted d3,k2,N3 envelope, not a formula for all d,k,N. Nonzero branch-label splitting extends the same witness to N>3 if needed; no separate result or paper is proposed for that relabeling.

##6. Antecedents, evidence and next step
The prior1211square-dimension argument is read from frozen own main.tex, not reassessed here. JOINT1212's N-1 bound and unrestricted-output witness were already integrated in public evidence1214; do not duplicate that work. George–Hirche–Nuradha–Wilde arXiv2503.22823v3 Sec3.1/7.1 provides the selected Hermitian-variable Choi dual/CQ context; its whole proofs were not audited and its coefficient is not silently identified with alpha_plus. This draft's positive-W inequality constraint and rectangular dimension argument are own derivations. https://arxiv.org/html/2503.22823v3
Confidence: literature for those selected antecedents; own unreviewed analytic inference for sections2–5; speculative worldwide novelty/application payoff; formal result none. Small canonical subgraph is context, not evidence of validity.
The exact SymPy checker verifies the trine effect normalization, Choi entries/eigenvalues, replacement remainder and maximally entangled upper witness for all symbolic u. It does not prove the general dual-normalization bound, strong-duality interface, novelty or a global theorem from24numerical points. All1350raw warnings/nonresults remain.
Falsifier: failure of the positive-W dual, Choi-map unital/adjoint-channel identification, rectangular oscillation inequality, or witness CPTP/contraction/Choi identities defeats the corresponding claim. A covering primary antecedent defeats novelty only. Next is one separate unscored component audit of this frozen argument, not a manuscript grade; do not restart it to improve a judgment. Then integrate as a supplement to the existing preparation candidate, with all objections. No newpaper, public version, deposit, score inheritance or acceptance claim.
