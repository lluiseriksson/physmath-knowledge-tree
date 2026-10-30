# Finite-subset repair of the selected continuum-curve bound

Iteration1386,30October2026. Own reconstruction of an already published classical bound, for targeted checking. No novelty, new paper, grade or full source-proof certification. This addresses the pending1385 prerequisite, not quantum-reference contraction or optical capacity. The random-spike warning remains valid for arbitrary pathwise suprema, but does not itself refute a kernel-level conclusion.

Inputs and hypotheses

Use the notation of Lee/Lu/Makur/Singh arXiv2606.19859v1, Definition1, maximal common-branch construction(68), Proposition8 and Theorem2's geometry. Let U be a nonempty totally bounded Polish metric space with diameter D and entropy integral I_U=integral_0^D sqrt(log N(U,d,epsilon))d epsilon<infinity. W:U->X is a Markov kernel; X is the source separable Banach space with cost z=M(||x||), M convex, strictly increasing,M(0)=0. Uniform average cost sup_u E Z_u<=p<infinity. On the source common-branch coupling let Z_u=M(||X_u||),Y_u=Z_u-E Z_u, with
E exp(lambda(Y_u-Y_v))<=exp(sigma^2*d(u,v)^2*lambda^2/2)
for every fixed u,v and real lambda. No separability or measurable all-index supremum is used below. Only the specified finite-dimensional distributions of the coupling are needed.

Let alpha=tau(W),s=1-alpha=rho(W), with common-branch I=1 of probability alpha, on which every finite family X_u equals a common X*. For s=0 all rows W are identical and rho(WK)=0. Assume s>0. K is the absolutely continuous Markov kernel required by the source, with a common dominating measure and measurable densities. The source geometry defines Theta(r)=sup_a rho_{ball(a,r)}(K), its nondecreasing concave majorant Theta_hat, Jung constant gamma, and
G(z)=Theta_hat(2*gamma*M^{-1}(z)),
which is nondecreasing,concave,nonnegative,at most1. Treat these already sourced geometric ingredients as assumptions here, not a new full audit of their dependencies.

1. Uniform finite-subset cost bound (the crucial change)

For every nonempty finite F subset U, apply the FINITE-index Dudley entropy-integral bound to the centered process Y restricted to F. VanHandel's official APC550 notes(21December2016),Corollary5.25, give constant12 with natural logarithms; finite processes are separable, so this application has no uncountable modification ambiguity:
E max_{u in F} Y_u <=12*sigma*integral_0^diam(F) sqrt(log N(F,d,epsilon))d epsilon.
For every epsilon>0 an ambient epsilon/2-cover of U can be converted to an epsilon-cover of F with centers in F: choose one F-point in each nonempty intersecting ball, and use the triangle inequality. Hence N(F,epsilon)<=N(U,epsilon/2), so the integral on F is at most2 I_U. Consequently
E max_F Z_u <=p+E max_F Y_u <=p+24*sigma*I_U=:C.
The bound is uniform in the finite set F. It does NOT imply E sup_U Z_u<=C on an arbitrary nonseparable realization. No such implication is needed. For F a singleton the centered expected maximum is0. Infinite I_U gives only the trivial outer bound rho(WK)<=rho(W)<=t; the finite case is the informative target.

2. Output overlap for a finite family

For F={u1,...,un}, let W_F be W restricted to F. By the finite overlap/partition formula (source Proposition2),
tau(W_F K)=integral min_i E[k(y|X_ui)]dmu(y)
 >=E[integral min_i k(y|X_ui)dmu(y)].
The inequality is concavity of the finite minimum, followed by Tonelli; all quantities are nonnegative. Put L_F=1-integral min_i k(y|X_ui)dmu(y), a measurable variable in[0,1]. On I=1 all X_ui coincide, so L_F=0. For any deterministic finite tuple x_i, the source radius/diameter bound yields
L_F<=G(max_i M(||x_i||)).
Indeed finite support is inside its Chebyshev ball of radius at most gamma times its diameter, diameter<=2 max_i||x_i||, and Theta_hat is nondecreasing. If the infimum center is not attained use epsilon>0 and interior continuity of the concave majorant; diameter0 gives L_F=0 directly. This is precisely the sourced geometric step, now on a finite tuple, not an uncountable random set.

It follows that
rho(W_F K)<=E L_F
 <=s*E[G(max_F Z_u)|I=0]
 <=s*G(E[max_F Z_u|I=0])
 <=s*G(C/s).
The last step uses nonnegative cost and Emax_F Z_u<=C, so E[max_F Z_u|I=0]<=C/s. IMPORTANT: the restricted common-branch coupling need NOT be a maximal coupling for W_F. We only use the global branch probability alpha and equality on that branch. No identification of rho(W_F) with s is made.

3. Return to the actual kernel and the source constant

The source Theorem1 gives tau(WK)=inf_{finite nonempty F subset U} tau(W_F K), equivalently rho(WK)=sup_F rho(W_F K). Therefore
rho(WK)<=s*G(C/s).
This passage takes a supremum of deterministic finite-family bounds; it never exchanges expectation with an uncountable pathwise supremum. If s<=t and t>0, nonnegative concavity gives perspective monotonicity:
G(C/t)>= (s/t)G(C/s)+(1-s/t)G(0),
so sG(C/s)<=tG(C/t). Thus
rho(WK)<=t*Theta_hat(2*gamma*M^{-1}((p+24*sigma*I_U)/t))
 <=t*Theta_hat(2*gamma*M^{-1}((p+32*sigma*I_U)/t)).
The second inequality uses monotonicity and24<=32. It recovers the advertised Proposition8 upper bound, conditionally on the already stated source geometric/finite-overlap ingredients, WITHOUT needing the questionable all-index-supremum inference. This is a known-bound reconstruction, not a claim to improve a sharp constant; the factor24 is a nonoptimized byproduct, with no priority claim.

Zero and endpoint guards

If s=0 use the identical-row argument. If t=0 then s=0. If p=0 every fixed X_u=0 almost surely since M strictly increasing with M(0)=0; all kernel rows equal delta0, regardless of nonseparable versions, and rho(WK)=0. If C=0 the same holds. Singleton U is immediate. Zero-cost finite tuples give L_F=0 without evaluating a possibly discontinuous geometric envelope at an unattained center. No assertion that a source all-index event is cylinder measurable is needed.

Interpretation and falsifier

The1385 generic spike is a standard warning about pathwise supremum versions; it is NOT a counterexample to this finite-family kernel bound. The source explicitly uses cylinder sigma-algebras in its Theorem2 proof. Its exact cited Wainwright5.22 remains unread here (normal primary search did not supply its statement; third-party full-book mirrors were not used). VanHandel's openly supplied primary finite theorem is an alternative prerequisite, not an attribution to Wainwright.

The checking task is specific: verify constants12->24->32, the global common branch retained on finite restrictions, the direction of finite overlap, and passage rho(WK)=sup_F rho(W_FK). A failure of any of these under the stated hypotheses would defeat THIS repair. Do not claim source-theorem refutation, novelty or a quantum/optical transfer. Preserve prior1385 concern as historical, but retire the proposed kernel-level counterexample route if this proof passes. No authors are contacted and no source content/corpus is redistributed.
