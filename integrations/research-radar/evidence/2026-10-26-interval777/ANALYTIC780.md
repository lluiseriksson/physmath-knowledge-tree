# Explicit-gain candidate: analytic reduction and interval-oracle contract

Unscored working derivation for component audit. Not a revised manuscript,
independent review, formal proof, worldwide-novelty certificate or new score.
Existing public v3 and review754 remain unchanged. All logs are retained.

Fix k=r=1, lambda=q=1/2, s=2. Write phi_v(y)=exp(-|y|^2/v)/(pi*v).
The matched-reset channel is W1(y|x)=phi_1(y-x)/2+phi_2(y)/2.
For z=|x|^2 rotate x=sqrt(z) real. Set T=|Y-2sqrt(z)|^2/2.
The signal/reset likelihood ratio is exp(L), where L=log(2)+z-T.
It depends only on T, so T is sufficient for the binary flag at fixed x.

## Radial distributions

Under the signal flag, T has density
f_s(t,z)=2 exp(-2t-z) 0F1(;1;2zt), t>=0.
Under reset it has density
f_r(t,z)=exp(-t-2z) 0F1(;1;2zt).
These follow by polar integration of a shifted complex Gaussian. Equivalently,
the first is a Poisson(z) mixture of Gamma(j+1,scale1/2), and the second
a Poisson(2z) mixture of Gamma(j+1,scale1). The nonnegative power series
0F1(;1;u)=sum_{j>=0}u^j/(j!)^2 permits Tonelli for real t,z>=0.
The first moments are (1+z)/2 and1+2z; variances are (1+2z)/4 and1+4z,
matching the shifted-Gaussian calculation. All variables are dimensionless.

Thus H(z)=H(F|Y,X=x) is the integral over t>=0 of

F(t,z)=0F1(;1;2zt)[exp(-2t-z)log(1+exp(t-z)/2)
                       +exp(-t-2z)log(1+2exp(z-t))/2].

Define J(a,b)=integral_a^b exp(-z) H(z) dz. With circular unit-cost
Gaussian input, G1=J(0,infinity)-log(2)/2. This uses the existing v3
binary-flag identity and the exactly Gaussian average output phi_2.
It is not a newly optimized capacity formula.

## Holomorphic oracle bound used by interval778.py

The finite-t integral H_T(z), T=200, is holomorphic for |Im z|<1/4.
For real t>=0 its logarithm arguments have positive real parts. Principal
logs consequently agree with the real logs and have no branch cut in this
strip. The 0F1 factor is entire; no square-root branch is introduced.

For a complex input box z in this strip take Z>=sup|z| and ell<=inf Re z.
The positive series and the real I0 bound give
|0F1(;1;2zt)| <= exp(2sqrt(2Zt)) <= exp(t/2+4Z).
Each log magnitude is at most t+Z+3. For example log(1+exp(t-z)/2)
has real part in[0,log(1+exp(t-Re z)/2)] and argument magnitude<1/4;
the other log obeys the analogous bound. Therefore

|H_T(z)| <= M(Z,ell)
 =exp(4Z-ell)[4/9+2(Z+3)/3]+exp(4Z-2ell)(Z+5).

This integrates the bounds for exp(-3t/2)(t+Z+3) and
exp(-t/2)(t+Z+3)/2 over[0,infinity], hence also bounds[0,T].
For broad boxes the callback returns the rectangular enclosure[-M,M]+i[-M,M].
It encloses the actual holomorphic function, rather than a midpoint estimate.
For narrow boxes it uses Arb integration in t. All log calls propagate the
analytic flags; non-admissible analytic boxes return non-finite values.
The inner analytic t boxes are restricted to |Im t|<1/4; together with the
z strip, the log-argument angles remain less than1/2, safely away from cuts.
The outer integral multiplies the H_T enclosure by exp(-z).
The actual returned balls, not requested tolerances, decide every check.

## Tail bounds

At fixed real z, posterior binary entropy is at most log2. Consequently
the t>T tail is bounded by log2/2 times the two conditional tail probabilities.
At theta=1/2, their MGFs are
M_s(theta)=(4/3)exp(z/3), M_r(theta)=2exp(2z).
For0<=z<=20 this gives the uniform bound
tau=log2/2 exp(-100)[(4/3)exp(20/3)+2exp(40)] <6.1e-27.
For z>20 the Gaussian average tail is at most log2*exp(-20)<1.43e-9.
Both tails are nonnegative; the code adds enclosing positive error balls.
For J on an annulus its t-tail is at most tau times its exact Gaussian mass.
No tail contribution is discarded merely because it is small.

## Feasible perturbation and explicit channel

Use squared-radius annuli[0,1/2],[1/2,2],[2,6], h=0 outside. Their masses
are p_i=exp(-a_i)-exp(-b_i), and moments
m_i=(a_i+1)exp(-a_i)-(b_i+1)exp(-b_i).
Let c=p cross m. Ball checks prove c_2>0 and c_2>|c_0|,|c_1|.
Define exact h_i=c_i/c_2. Determinant identities give both moment
cancellations symbolically, and |h|<=1. Printed rounded coefficients are
not the definition of the feasible input. Set epsilon=1/200.

At128 and160bits the computed balls prove
G1 in(.17825,.17826), a0=sum h_i J_i in(.0078,.0079),
N=sum p_i h_i^2 in(.737,.739). The original v3 inequality11 gives
I_{(1+epsilon h)mu0}(W1)>=G1+epsilon*a0-epsilon^2*N >.178270525.

Now take b^2=9757/50000 and W2=phi_1(y-bx). Its known unit-cost AWGN
capacity C2=log(1+b^2) lies in(.178263333,.178263334).
The existing exact scalar-series check773 independently supplies this
logarithm enclosure. Thus G1<C2<C1, using a feasible W1 rate below C1.
No unknown capacity appears in b. Both laws fit K=1,v_*=1,v^*=2.

Conditional on the existing compactness/continuity and comparison proofs
of v3, this yields a strict qualitative learning separation for this
explicit two-law family: V=max_mu min(I_mu(W1),I_mu(W2)) is attained;
if V=C2 the unique AWGN maximizing input must be mu0, contradicting
I_mu0(W1)=G1<C2. Therefore Delta=C2-V>0. Its numerical value is still
NOT bounded below. The original high-energy comparison only gives an
existential threshold E>(6+log2)/Delta, with E>=2. No numerical threshold,
new importance score, optimality for arbitrary Gaussian protocols,
independent human review, or new general resource principle follows.

## Required audit / falsifiers

Check the radial Jacobian/scales, log branches, broad-box oracle M,
tail MGFs, interval additions, exact moment definition, and every
capacity/limit quantifier. Reject the certificate if the analytic oracle
is not an enclosure on every box used by Arb. Reject explicit separation
if any certified interval overlaps its comparison rate. Never use the
single-law gain as a numerical lower bound on Delta. The official
python-flint0.9.0 documentation and installed API documentation were read;
no new library was installed. This packet is not a ready Research Capsule.
