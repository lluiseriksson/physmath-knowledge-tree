# QSS: a Gamma-aware polynomial approximation budget,30October2026

Author derivation; unreviewed, not a sign certificate, manuscript or grade. Conditional on the exact1317/1318 conventions and the audited415 H-spectrum. The original all-pure-anchor inequality remains open. No numeric anchor campaign, new seed, solver or component review was run.

Let L=psi psi*, ||psi||=1, a=sum psi_j w_j, M=sum psi_j M_j, H=H(a), C=M bar(H)^(-1) M*, B=Gamma_INPUT(C), and A=product_i(I-F_i/2). Keep all physical indices/conjugations and all nine81-dimensional sectors. M and H are the UNNORMALIZED-anchor objects of1317; this must not be mixed with H(Vpsi). All formulas below retain the full complex pure logical domain.

From415/1317 each code block of H(a) has eigenvalues in[3/2,9/4]: the special block is3(I/2+L/8); the others are3(I/2+sum p_k P_k/4), with0<=p_k<=1. Hence ||I-(8/15)bar(H)||<=1/5. Define the real scalar polynomial

    p_m(h)=(8/15) sum_(k=0)^m (1-(8/15)h)^k.

The exact residual is1/h-p_m(h)=(1-(8/15)h)^(m+1)/h. Spectral functional calculus therefore gives

    ||bar(H)^(-1)-p_m(bar(H))||op <= delta_m=(2/3)5^(-(m+1)).

Do NOT apply Gamma to a PSD order. Instead put C_m=M p_m(bar(H)) M*, B_m=Gamma_INPUT(C_m), E=bar(H)^(-1)-p_m(bar(H)). Hermiticity and Schatten Holder give ||M E M*||1 <= ||M||F^2 ||E||op. For any Hermitian X, ||Gamma(X)||op <= ||X||1: spectrally decompose X into signed rank-one projectors; the partial transpose of each unit-vector projector has operator norm at most1 by its Schmidt spectrum. This argument is dimension-independent and does not assert positivity preservation.

The hash-verified integer coefficient tables give Tr(M_i* M_j)=(3993/64)delta_ij, so ||M||F^2=3993/64 for EVERY unit complex psi, not just a sampled anchor. Also A>=I/8, because each commuting local factor has eigenvalues1/2 and3/2. Consequently

    ||A^(-1/2)(B-B_m)A^(-1/2)||op
       <= r_m=8(3993/64)delta_m=1331/[4*5^(m+1)].

This bound explicitly handles the partial transpose and is uniform in L under the stated input hypotheses. It creates a SUFFICIENT new certificate target:

    (1-r_m)A + B_m(L) >=0 and (1-r_m)A - B_m(L) >=0
    for every Hermitian L with TrL=1 and L^2=L.

If this target were proved, adding the error reserve yields A±B>=0 on the same domain. No claim that this sufficient target holds is made. In particular numerical minima from1322 cannot be substituted for a universal polynomial margin.

H is linear in L and the outside M/M* pair contributes one L. Thus every entry of B_m is a polynomial of degree at most m+1 in the Hermitian logical coordinates, with the necessary transposes intact. It commutes with the same two-copy stabilizers as B, because functional calculus preserves the original covariance before Gamma. The target may therefore be tested in all nine81-dimensional blocks, retaining W* A W on the right. This is not an assertion of uniform positivity from covariance.

At m=4 the degree is at most5 and the reserved relative error is1331/12500=0.10648; at m=5 the degree is at most6 and reserve1331/62500=0.021296. These replace denominator-cleared degree-at-most14 by a lower-degree SUFFICIENT problem with a quantified cost. They are not equivalent sign problems and may fail even if the original comparison is true. No full polynomial matrices or SOS/quantifier-elimination campaign were expanded. Exact Gram entries, seven scalar residual identities and rational reserves are recorded in EXACT1377.json. These checks validate finite algebra, not the analytic sign claim or a reproducibility capsule.

Mechanism/dictionary: approximate the inverse by a uniformly controlled polynomial; turn inverse error into a trace-norm budget before Gamma, then into a relative-A operator error. Preserved: complex coherences, pure domain, full reference/physical space and Gamma. Lost: necessity of the new sufficient margin condition and any claim of optimal approximation. The proof is ordinary finite-dimensional matrix analysis applied to own fixed tables; no independent novelty or external hypothesis elimination is certified.

Falsifier/abandonment: an exact valid-pure-L violation refutes the chosen polynomial-margin target, not automatically A±B. Failure of the H interval, Gram normalization or Gamma trace-norm argument invalidates this budget mechanism. A valid covering antecedent defeats novelty. Next attempt an actual structural coefficient/SOS certificate exploiting the fixed code symmetries; do not replace it by more isolated anchors, repeat the parked numeric search or rename the missing PSD estimate as a theorem. If no concrete certificate structure is found, retain the bound as an unreviewed method note without another paper/review loop.

Literature: selected2608.02647v1 Theorem7.3/Lemma7.4 require a product reference; that assumption is not supplied by the encoded anchor. Existing QSS encoding and415 spectrum are prior inputs. Graph proximity supplies no proof. Evidence levels: literature for attributed inputs; heuristic for this unreviewed author deduction; speculative for completing its uniform polynomial certificate; formal:none. No new manuscript, score, publication or model independence claim.
