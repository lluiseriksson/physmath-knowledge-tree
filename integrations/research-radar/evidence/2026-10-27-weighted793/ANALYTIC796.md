# Weighted observable route: analytic contract and pending ball certificate

Own component derivation dated2026-10-27. Requested future review is unscored; no new manuscript, formalization, novelty or independence claim. Prior v3/report754 and component781 remain unchanged. Numerical conclusions below are conditional until the entire certificate795 output and an explicit root conclusion check exist. A finite progress file is not a global certificate.

## Hypothesis removed if the run completes
The previous uniform residual approach required |H(x)-F(|x|^2)|<=epsilon for all x. The two failed trials787 remain refuted. Instead seek |H(x)-F(|x|^2)|<=epsilon*(1+|x|^2). This envelope preserves the actual per-law expected input cost P<=1. Its integrated errors are at most2epsilon for both mu and mu0, so the previous entropy-deficit/Pinsker argument gives

I1(mu)<=G1+4epsilon+M*sqrt(2D(mu W2||Q2)),
d=C2-G1-4epsilon>0,
Delta>=2*d^2/(sqrt(M^2+2*d)+M)^2.

Definitions, fixed channels, Gaussian gain b^2=9757/50000, output observable dictionary and nats/L1 conventions are those of DERIVATION790. This does not eliminate finite-family, cost, feedback, reset or high-energy scaling hypotheses of v3. The underlying entropy and approximation tools are established, not a new general information principle.

## Trial selection and failure retention
FIT794 records all72 weighted least-squares fits and all72 coefficient/frequency vectors, using previous GH192 targets and GH256 validation; 48 earlier attempts remain in787. Tail training targets above120 are zero, with the analytic positive binary entropy upper bound added on the validation mesh. Mesh errors, ranks and norm estimates are heuristic. The chosen first row has a=1, fmax=4, N=32, rcond=1e-14. Its coefficient and frequency float.hex values define exact binary rational numbers. Selection preceded interval certification and is not a model-review restart or grade search.

## Tighter holomorphic majorant
For H_T(z), the prior radial integral truncated at t=T, take ell<=Re z, |z|<=Z, and |Im z|<1/4. The modulus of 0F1(;1;2zt) is at most0F1(;1;2Zt) by its positive series. Both logarithms have modulus at most t+Z+3 on the branch-safe strip, as in analytic780. Integrating the positive series exactly gives

integral_0^infinity exp(-k*t)*0F1(;1;2Zt) dt = exp(2Z/k)/k,
integral_0^infinity t*exp(-k*t)*0F1(;1;2Zt) dt = exp(2Z/k)*(1/k^2+2Z/k^3).

Therefore |H_T(z)|<=exp(Z-ell)*(3Z+7)/4+exp(2Z-2ell)*(3Z+4)/2. This replaces the earlier unnecessarily exponential-in-Re-z coarse bound with a much smaller bound on short positive-axis ellipses. The identity follows by Tonelli for Z>=0 and differentiation of the convergent positive series; it holds for every finite T by majorization. It is an own derivation requiring audit, not a theorem already audited in781.

## Global interpolation contract, not a grid substitution
On each interval [left,left+width], midpoint m and halfwidth h, the rho=2 Bernstein ellipse has real semiaxis5h/4 and imaginary semiaxis3h/4. Set ell=m-5h/4, Z=m+5h/4. Then |z|<=Z and Re z>=ell. On width1/2 intervals the entire ellipse stays within |Im z|<1/4, including at the first interval where ell=-1/16. The pole z=-1 of division by1+z lies outside all ellipses.

For F(z)=exp(-alpha*z)*sum d_j*J0(f_j*sqrt(z)), alpha=a*b^2/(1+a), the whole function is defined by 0F1 to avoid a square-root branch. Angular averaging gives |J0(f*sqrt(z))|<=exp(f*sqrt((Z-ell)/2)) for nonnegative real f. Hence M_F<=exp(-alpha*ell)*sum |d_j|*exp(f_j*sqrt((Z-ell)/2)). Divide M_H+M_F by1+ell to bound R_T=(H_T-F)/(1+z) in the ellipse.

Use n first-kind roots cos((2j+1)*pi/(2n)), NOT the extrema grid of a differently parameterized interpolation theorem. Discrete cosine sums with the constant term halved give the unique interpolant of degree n-1. Its real supremum is at most the sum of absolute Chebyshev coefficients, computed with balls. For an analytic function bounded by M in the rho ellipse, established coefficient decay is |a_k|<=2M*rho^(-k). Root-grid aliasing sends each T_k to zero or a signed T_j with j<n, hence its interpolant has supremum at most1. The interpolation error is consequently at most2*sum_{k>=n}|a_k|<=4M*rho^(-(n-1))/(rho-1). certificate795 uses the deliberately larger8M*2^(-(n-1)). This proof specifies the roots-grid convention explicitly.

Primary method source: Trefethen ATAP chapter8, selected Theorem8.1 proof and Theorem8.2; source commit96e888be8c3f8bde8488f42eb3ed96321a2416d1. The roots aliasing argument above is stated separately; no whole-book audit or foreign full text redistribution.

## Three regions and tails
1. z in[0,80]:160 intervals of width1/2, n=64, H_T with T=600 and prior branch-safe interval778 inner integration at Arb192. The nonnegative omitted tail is at most (log2)/2*exp(-300)*[(4/3)*exp(80/3)+2*exp(160)], divided by1+left. Numerical integrator tolerances alone are not certificates: the actual returned balls must be finite and satisfy the final inequality.
2. z in[80,400]:160 intervals of width2, n=96, interpolate only -F/(1+z); no H analyticity outside its strip is asserted. Add BH(left)/(1+left), where u(z)=sqrt(2)/3*exp(-z/6), BH(z)=u(z)*(1-log u(z)). This is decreasing on the positive axis and upper bounds true H by Bayes error/Bhattacharyya plus binary entropy concavity.
3. z>=400: the decreasing envelopes [sum|d_j|*exp(-alpha*z)+BH(z)]/(1+z) reduce the entire tail to its left endpoint.

Every one of320 segments AND the final infinite tail must prove a bound strictly below epsilon=1e-6. The exact bounded observable g(y)=sum c_j*exp(-a|y|^2)*J0(omega_j|y|), omega_j=f_j*(1+a)/b, c_j=(1+a)*exp(f_j^2*(1+a)/(4b^2))*d_j, obeys M<=sum|c_j|. This norm is evaluated with balls, not inherited from the fit.

## Required conclusion checks and limits
If all segments pass, root must separately parse the prior certified G1 ball and prove G1<0.178254 (the earlier coarse published inequality G1<0.17826 would be too loose here), C2>0.178263333, M<1.5e20, and apply the weighted lemma with epsilon1e-6. A stable interval expression can then test a conservative Delta lower bound. Do not claim that bound before this check and audit. Any ensuing enormous high-energy threshold would be an existence certificate, not practical performance or a new manuscript rating.

- literature: selected primary coefficient decay, existing Pinsker/Gaussian identities; narrow reading recorded in METHOD-SOURCE796.
- graph-supported inference: small quantum-information neighborhood retrieved before synthesis; not a proof.
- heuristic:72-fit search and choice of observable; GH targets not certified.
- speculative/unreviewed synthesis: weighted separator and global certificate contract until checked/audited.
- formal: no new Lean theorem; repository Lean checks concern the existing spine only.

Falsifiers: any non-finite inner ball; invalid complex branch or ellipse bound; missing root-grid aliasing factor; a single segment or tail exceeding its envelope; incorrect moment quantifier or observable norm. Preserve all failed/partial runs and original reports. No ready Research Capsule or whole-manuscript assessment is claimed. The purpose is a same-paper component improvement, not a separate minor paper.
