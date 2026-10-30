# Complex kernel identity and a projected sufficient target,30October2026

Own unreviewed algebra, not a new paper, novelty claim, model assessment or universal signed positivity result. This checks the missing equality-subspace mechanism before proposing another certificate. The all-m full-space target1377remains abandoned by1378.

Use first physical index b as INPUT, second r as OUTPUT, and Gamma on the FIRST index. A is the real symmetric positive matrix product_i(I-F_i/2). Let J_a=I tensor|a>, H=J_a* A J_a, and M=Gamma(A)J_a. The latter is a reshuffling identity, not the incorrect M=A J_a: explicitly

    M[(b,r),t]=sum_s A[(t,r),(b,s)] a_s.

Expanding the8swap subsets gives precisely the1317coefficient formula. EXACT1380compares all entries of all three linear encoded coefficients with the hash-pinned old tables, not sampled anchors. Nine cross-coefficient checks verify J_i* M_j=H_ij^T with H_ij=J_i* A J_j. Since A is real and Hermitian, for arbitrary complex a this yields J_a* M=H^T=bar(H). H>0 for nonzero a because A>0 and J_a is injective.

Set C=M bar(H)^(-1) M*, B=Gamma(C). The required kernel identity follows directly, without positivity through Gamma. In indices,

 (B J_a)[(b,r),q]
  = sum_(s,t,u) M[(q,r),t] bar(H)^(-1)[t,u]
                  bar(M[(b,s),u]) a_s.

The last sum over s is bar((J_a* M)[b,u])=H[b,u]. Since H^T=bar(H), summing u gives delta_(t,b), so the expression is M[(q,r),b]=(A J_a)[(b,r),q]. Thus

    B J_a=A J_a for every nonzero complex a.

This is a direct identity behind the known Schur mechanism, not a global sign theorem or a claim of a newly discovered kernel. In particular it proves inclusion of ran(J_a) in ker(A-B), not equality of those spaces or a uniform quotient gap. It supplies the complex convention omitted by any inference solely from the real1378control. It does not permit replacing bar(H)^(-1) by H^(-1).

For encoded unit psi, let a=sum psi_j w_j (norm squared3), J0=J_a/sqrt3, K=J0 J0*=I tensor(aa*/3), Q=I-K. K is an orthogonal projector on the pure logical domain. Write B_m=Gamma(M p_m(bar(H)) M*) as in1377and define

    Bhat_m=Q B_m Q + A K + K A - K A K.

This is Hermitian, Bhat_m K=A K, and the proved identity gives

    B-Bhat_m=Q(B-B_m)Q.

The1377trace-norm error bound before relative-A normalization is

    ||B-B_m||op <= e_m=1331/[32*5^(m+1)].

Hence -e_m Q <= B-Bhat_m <= e_m Q, now an ordinary Hermitian order bound AFTER controlling Gamma. A new sufficient target is

    A+Bhat_m-e_m Q >=0 and A-Bhat_m-e_m Q >=0

for every Hermitian pure L of trace1. If proved, it implies A±B>=0. Unlike the refuted full-space reserve, the minus target vanishes on K exactly and does not penalize the known equality directions. This consistency does NOT prove its feasibility or positivity.

K is linear in L, B_m has degree at most m+1, so Bhat_m has degree at most m+3 in Hermitian logical coordinates. At m4 this is degree at most7 with e4=1331/100000=.01331; at m5 degree at most8 with e5=1331/500000=.002662. All complex coherences and transposes remain. The encoded stabilizers commute with K, so the original nine81-dimensional sectors still apply. No full polynomial expansion, SOS solver, numerical anchor or repeated1322campaign was run; no coefficient sign certificate has been found.

Mechanism: exact kernel interpolation of the approximate signed operator, then a quotient-supported error budget. Preserved: original physical/input order, pure domain, Gamma, exact equality directions and full729-dimensional space. Lost: necessity and optimality of the sufficient margin condition. Falsifier: an exact valid-domain counterexample refutes this chosen projected target, not automatically the original signed comparison. Before a costly campaign, seek an actual factorization exploiting the fixed code and nine-sector structure; do not label the remaining PSD condition as established or infer it from finite margins.

Prior inputs: old410contains the real fixed-member kernel check;1322uses numerical deflation;1317/1318fix the all-complex coefficient conventions. They are not new reviews. Selected Wu–Zou2608.02647v1product-reference premises remain distinct from encoded anchors. Evidence labels: literature for attributed inputs, heuristic for this unreviewed author deduction, speculative for its unresolved all-L sign certificate, formal:none. All objections and the1378adverse result remain.
