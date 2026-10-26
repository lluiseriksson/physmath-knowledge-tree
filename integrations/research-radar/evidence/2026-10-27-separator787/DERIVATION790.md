# Conditional observable separator and two rejected global fits

Own research note, 2026-10-27 local date. This is an unscored component investigation, not a manuscript, independent review or novelty certificate. The earlier interval777/781 component remains conditional on its stated model and trusted interval implementation. No numerical lower bound on the common-input gap has been obtained here.

## Model and conditional certificate
Use natural logarithms and complex Gaussian density phi_v of variance v. Let W1(y|x)=phi_1(y-x)/2+phi_2(y)/2, W2(y|x)=phi_1(y-bx), b^2=9757/50000, and E|X|^2<=1 for each common input law mu. Write H(x) for the entropy of the equal-prior signal/reset flag given output and fixed x, mu0=CN(0,1), G1=E_mu0 H-(log 2)/2, C2=log(1+b^2), V=sup_mu min(I1,I2).

For Q2=CN(0,1+b^2) and input power P, the Gaussian entropy identity gives C2-I2=D(mu W2||Q2)+b^2(1-P)/(1+b^2)>=D. The W1 output second moment is (P+3)/2<=2. Maximum Gaussian entropy and the flag identity give I1(mu)<=G1+E_mu H-E_mu0 H.

Suppose a bounded real output observable g satisfies |H(x)-E[g(Y2)|x]|<=epsilon for EVERY complex x and |g|<=M. With L1 distance convention, Pinsker in nats gives ||P-Q||_1<=sqrt(2D(P||Q)). Therefore I1(mu)<=G1+2epsilon+M sqrt(2D). Set R=min(I1,I2), delta=C2-R and d=C2-G1-2epsilon. If d>0, then d<=delta+M sqrt(2delta), hence

Delta=C2-V >= (sqrt(M^2+2d)-M)^2/2 = 2d^2/(sqrt(M^2+2d)+M)^2.

This is CONDITIONAL: no globally valid g/epsilon with d>0 has been certified. The derivation uses standard entropy and Pinsker tools, not a claim of a new inequality. It has no new AI or human referee audit and no Lean formalization.

## Exact observable dictionary
For a>0, real frequencies f_j and coefficients d_j, define F(z)=exp(-a*b^2*z/(1+a))*sum_j d_j*J0(f_j*sqrt(z)). Let omega_j=f_j*(1+a)/b and c_j=(1+a)*exp(f_j^2*(1+a)/(4*b^2))*d_j. Then g(y)=sum_j c_j*exp(-a*|y|^2)*J0(omega_j*|y|) has conditional expectation F(|x|^2).

To check this identity, write J0 as the angular average of a plane wave. For each unit direction u the Gaussian integral is (1+a)^(-1)*exp(-a*b^2*|x|^2/(1+a)-omega^2/(4*(1+a))+i*omega*b*u.dot(x)/(1+a)). Angular averaging gives the displayed formula. NIST DLMF10.9.1 also implies |J0(t)|<=1 for real t, so ||g||infty<=sum|c_j|. Fitted floating estimates of that sum are not certified bounds.

## Experiment, falsifier and exact point checks
fit788.py tried 48 fixed configurations on a finite training interval ending at z=120. All 48 summary outcomes are preserved; only the best eight coefficient vectors were retained. Cartesian Gauss-Hermite training/validation, ranks and residuals are heuristic. In particular, the JSON field conditional_gap_proxy_NOT_CERTIFIED is NOT a bound on Delta. The original samples and failed results are retained without a ready Research Capsule or campaign reproducibility claim.

The two leading sampled fits (a=1, fmax=4, N=32 or24) fail the required GLOBAL uniform bound. refute789.py interprets saved floating frequencies/coefficients as exact binary rationals and reevaluates F at rational points with Arb192-bit balls.

For z=|x|^2, the Bhattacharyya coefficient between CN(x,1) and CN(0,2) is (2*sqrt(2)/3)*exp(-z/6). Equal-prior Bayes error Pe is at most half this coefficient. Entropy concavity gives H(z)<=h2(Pe)<=h2(u)<=u*(1-log u), u=(sqrt(2)/3)*exp(-z/6)<1/2. Consequently |H-F|>=|F|-u*(1-log u). The earlier component bounds G1>0.17825 and C2<0.178263334 require epsilon<0.000006667 for d>0.

- N=32, z=23488613/143983: rigorous residual lower bound exceeds0.0007989266027580860188.
- N=24, z=124896557/773621: rigorous residual lower bound exceeds0.0005308322825116529029.

Both exceed0.0001 and refute these two specific candidates for the required uniform certificate. This does not refute all bounded observables, the conditional lemma, cost-weighted/one-sided approximations or the previously qualitative Delta>0. The other46 configurations have no global certification. Ball arithmetic trusts python-flint/Arb and the analytic argument; it is not a formal proof assistant check.

## Evidence layers and next finite task
- Literature: selected Pinsker Eq1 in Sason and Verdu, arXiv1508.00335v7 (2016-12-04); NIST DLMF10.9.1. Full papers/proofs were not audited.
- Graph-supported context: small quantum-information subgraph saved before synthesis; proximity is not proof.
- Heuristic: all finite-mesh fits and their large observable norm estimates.
- Speculative: a useful global or cost-weighted observable certificate. Abandon any trial as soon as one rigorous point violates its claimed envelope.
- Formal: no new formal result or upgraded graph confidence.

Next attempt should derive a cost-weighted or one-sided global residual envelope before numerical optimization, retaining every moment and finite-family quantifier. Do not publish these unsuccessful fits as a separate paper or transfer a grade from v3.

Primary sources: https://dlmf.nist.gov/10.9.E1 ; https://arxiv.org/abs/1508.00335v7 . Source response hashes, dates and exact reading scope are in METHOD-SOURCES790.json; the directed refresh787 covers primary AI, arXiv, AIRR, aiViXra and owner repositories and is not exhaustive. No external full text is redistributed.
