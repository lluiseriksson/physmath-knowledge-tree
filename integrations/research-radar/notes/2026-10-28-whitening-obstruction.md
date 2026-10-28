# Root obstruction: reference whitening of the simplex family

28 October 2026. This is an unreviewed derivation about one existing ansatz, outside every graded manuscript. No priority or new-paper claim.

## Hypotheses and mechanism

Fix n>=2, a finite output space, and prepared density matrices tau_i. Let f be the normalized all-ones vector, F=ff*, P=I-F, and psi_i=sqrt(n/(n-1))(e_i-f/sqrt(n)). Use the existing own witness blocks

    S_i^+/- = alpha psi_i psi_i* + epsilon(P-psi_i psi_i*) + beta F
              +/- sqrt(alpha beta (1-delta))(psi_i f*+f psi_i*),
    beta=1/(4nk), delta=2^-k, epsilon=beta delta,
    alpha=1/n-(n-2)epsilon-beta.

Their shared reference marginal is M_k=(1-n beta)P/(n-1)+n beta F. Set L_k=M_k^{-1/2}/sqrt(n), and whiten every block by L_k. Both reference marginals become I/n; the classical marginal stays uniform. Direct substitution gives limiting plus blocks |e_i><e_i|/n and minus blocks |Ue_i><Ue_i|/n, where U=I-2F.

The pointwise dictionary replaces the shrinking reference marginal by exact I/n but changes the relative-entropy denominator and output states. Relative entropy is not invariant under this nonunitary local filtering. The original near-unit retention therefore cannot simply be transported.

## Proposed general limit and proof obligations

Write Pi_j for the support projector of tau_j on the fixed span of all prepared supports. Root calculation predicts

    lim_k D(output_plus||output_minus)/D(input_plus||input_minus)
      = 1 - sum_{i!=j} Tr(tau_i Pi_j)/(n(n-1)).

Proof sketch: in fixed dimension, the whitened input and output minus states converge in operator norm at O(delta) to their limiting states. Their positive eigenvalues on the limiting supports stay bounded below; their vanishing eigenvalues lie between c delta/k and C delta, with channel-dependent positive constants. The lower bound follows from the input block eigenvalues and positivity of sum_i tau_i on the fixed output support. Thus -log(sigma_k)/(k log2) tends in norm to the kernel projector of sigma_0: split the spectrum at a fixed gap and use continuity of its spectral projector. The entropy Tr(rho_k log rho_k) is bounded in fixed dimension. Hence each divergence divided by k log2 tends to Tr(rho_0 Pi_ker(sigma_0)).

For the input this weight is 4(n-1)/n^2. For the output, the orthogonal reference basis Ue_j gives kernel projector sum_j |Ue_j><Ue_j| tensor (I-Pi_j). Off-diagonal entries of U have squared modulus4/n^2 and diagonal terms contribute zero. The output weight is therefore 4/n^3 sum_{i!=j}(1-Tr(tau_i Pi_j)), giving the displayed quotient. Fixed n, fixed prepared states and the spectral lower bound are essential; this is not a uniform changing-channel statement. The complete spectral argument has not received external or formal review.

If any directed support overlap is positive, this limit is below1; orthogonal outputs are the exceptional value1. This rejects reference whitening of this family as a way to retain its original asymptotic activation. It does not exclude other fixed-reference constructions.

## Exact certificate and diagnostic example

For three real pure qubit preparations at angles0,pi/8,pi/4, take H=(I+2X+2Z)/2 and lambda=1/4. H has trace1 and is not positive. The three residuals tau_i-H/4 have trace3/4 and exact determinants1/64, (16sqrt2-15)/64,1/64. They are positive, so they define a residual CPTP CQ channel after scaling by4/3. The established Hermitian-replacer cancellation gives complete equal-reference trace contraction at most3/4. This trace mechanism is prior: George–Hirche–Nuradha–Wilde, arXiv:2503.22823v3, Proposition30; its short proof was read, not the full article.

The proposed whitening limit is (3-sqrt2)/6. Four NumPy diagnostics at k8,12,16,20 give approximately0.29712,0.28841,0.28326,0.27991. These are ordinary floating point, with no interval certification; they support but do not prove the limit. The symbolic2x2 certificate and these four diagnostics are separately labelled. No recovery map, upstream Lean proof or independent model assessment was executed.

## Research boundary

Literature: the original witness construction and Hermitian-replacer trace bound are prior. Heuristic/root result: the proposed fixed-channel spectral-limit argument above. Speculative target: an alternative fixed-reference witness that avoids this normalization failure. Formal: none added. Falsifier: a failure of the spectral window or of either kernel-weight calculation invalidates the proposed limit; a different witness is outside this obstruction. Minimal formal target: the finite-dimensional logarithmic spectral-window lemma, with explicit bounds. Do not generate a standalone minor paper from this note.

The current directed sweep fetched18primary endpoints and metadata only. The own Connes-Kreimer repo illustrates a freshness trap: a recent pushed_at observation did not imply a new default-branch result; the observed HEAD remains dc81326cd426f8805b1712bafb88abb00899076d, committed9September2026. Selected README reading still describes an M0 scaffold with no direct mother-repo consumer. No Yang-Mills mass-gap or new formal theorem is inferred. Existing public v3, all reports, priority reservations and grades stay unchanged; old Claude pending-case status is superseded by the reconciled public case, so no deposit was repeated.


# Explicit spectral-window audit of root1193

Root analytical check only; no external referee or formalization. Fixed n>=2 and fixed finite prepared states are essential. This closes the stated window obligation for the particular whitened simplex ansatz; it is not a general fixed-reference impossibility theorem.

For k>=n, beta=1/(4nk), delta=2^-k and epsilon=beta delta. The original alpha is at least1/(2n), while alpha+beta<=1/n. On span(psi_i,f), the minus block has determinant alpha beta delta and maximum eigenvalue at most alpha+beta. Its minimum eigenvalue is at least beta delta/2. On the remaining orthogonal complement the eigenvalue is epsilon. Thus every unwhitened block is at least beta delta I/2.

The shared M_k is a density matrix, hence M_k<=I. Whitening by L_k=M_k^{-1/2}/sqrt(n) gives each block at least delta I/(8n^2 k). The block-diagonal input has this same floor. The output is at least delta/(8n^2 k) times I_R tensor S, where S=sum_i tau_i; restrict to its fixed support so that lambda_min(S)>0.

For the norm-convergence upper bound, write A0=(n-1)/n^2, d0=sqrt(n-1)/n^2 and r=(n-2)epsilon/(1/n-beta). For k>=n, 0<=r<=delta/3. Whitened coefficients are A=A0(1-r), B<=A0 delta/3, F coefficient1/n^2 and cross coefficient d=d0 sqrt((1-r)(1-delta)). Since 1-sqrt((1-r)(1-delta))<=r+delta, the block difference from its limiting rank-one matrix has norm at most2delta. Thus the input difference is at most2delta and the output difference at most2n delta.

General finite-dimensional lemma: suppose A_k tends to A0 with ||A_k-A0||<=C2^-k, and A_k>=c2^-k I/k for c>0. Split the eigenvalues at half the smallest positive eigenvalue of A0. Weyl's inequality bounds each small eigenvalue between c2^-k/k and C2^-k. Its negative logarithm divided by k log2 tends uniformly to1; the normalized logarithms of the large eigenvalues tend to0. The small spectral projectors converge to ker(A0): choose a fixed contour inside the spectral gap and use the Neumann-series resolvent identity on that contour. Consequently -log(A_k)/(k log2) tends in operator norm to the kernel projector.

For density matrices rho_k tending to rho0 in fixed dimension, Tr(rho_k log rho_k) is bounded, so D(rho_k||A_k)/(k log2) tends to Tr(rho0 Pi_ker(A0)). Applying the lemma to the established input and output windows gives the two kernel weights in1193 and their quotient, since the input weight4(n-1)/n^2 is positive. Full-rank limiting outputs give zero output weight, consistently. The constants can depend on fixed n and fixed prepared states; no uniform growing-dimension or changing-channel result follows.

The root derivation therefore rejects naive whitening for this ansatz whenever the average directed support overlap is positive. Park this route rather than producing additional finite tables or a separate minor paper. An external audit would still be needed before using the general statement as a manuscript theorem.

The [symbolic certificate and floating-point diagnostic script](../evidence/2026-10-28-gap-hypotheses/whitening1193.py), [output](../evidence/2026-10-28-gap-hypotheses/WHITEN1193.json), [prior reading ledger](../evidence/2026-10-28-gap-hypotheses/READINGS1193.json) and [small fresh subgraph](../evidence/2026-10-28-gap-hypotheses/SUBGRAPH1195.json) accompany this root-only argument. The route is parked; no further finite table or standalone paper is proposed.
