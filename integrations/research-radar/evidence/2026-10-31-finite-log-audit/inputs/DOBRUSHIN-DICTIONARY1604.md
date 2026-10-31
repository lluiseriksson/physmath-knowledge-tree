# Selected classical cluster criterion and the exact dictionary

Parent synthesis,31October2026, unreviewed and outside assessment1592. This uses a selected classical theorem as a literature premise, not a newly audited external proof or a novelty claim. The earlier1603finite induction remains a separate own argument; its limited conclusion is not retrospectively enlarged.

## Literature input and reading boundary

Roman Kotecky's [author-hosted Cluster Expansion exposition](https://www.cts.cuni.cz/~kotecky/publ/K-CE-EMP06.pdf), printed4–5, equation24 and the Cluster expansion Theorem(i)–(ii), states an abstract graph-polymer criterion: radii rho_gamma dominated by r_gamma product_(delta in N(gamma))(1-r_delta), with0<=r<1, give nonzero finite partition functions, their logarithmic cluster series and a cluster sum pinned to gamma bounded by -log(1-r_gamma). Here N uses other incompatible vertices. Selected definitions/formulas and this statement were read, not the full proof audited.

The author's [publication list](https://www.cts.cuni.cz/~kotecky/soubory/publications.htm) identifies the chapter with Encyclopedia of Mathematical Physics, volume1,531–536,2006. The11-page author PDF snapshot has SHA256 `2a56f2e4a3285aedf7934c6aa235e3da0dca3131b5ce52f4076e8c94819c6e5a`. The publicly accessible copy was read in memory and not retained. Original Kotecky–Preiss1986 is still abstract/bibliography only here. Earlier failed requests remain recorded; this successful author-copy reading does not erase them.

## Own dictionary from1603's self-including budget

Keep the exact finite activity gas1574, with type gamma=S a nonempty ORIGINAL label subset and compatibility meaning disjoint raw scalar supports. Let rho_S be a fixed activity majorant. Set a_S=eta|S| with eta>0, mu_S=rho_S exp(a_S), and assume the SELF-INCLUDING budget

    sum_(T incompatible with S) mu_T <= eta|S|.

Choose r_S=1-exp(-mu_S). It lies in[0,1). Excluding S from the neighbor product gives

    rho_S exp(sum_(T != S, T incompatible S) mu_T)
      <= mu_S exp(-mu_S) <= 1-exp(-mu_S)=r_S.

Equivalently rho_S<=r_S product_(T in N(S))(1-r_T), exactly the stated classical criterion. The self term has been paid once through r_S; it is not omitted or included a second time in N(S). The choice of r does not change the activities or the incompatibility graph.

For the assessed1592rooted bound, rho_S=|z(S)| and

    b_eta=lambda_eta-lambda_eta A log(1-lambda_eta A R),
    lambda_eta=lambda exp(eta), A=e sqrt(6),
    R=max(1,Delta+2BDmJ).

The report's union bound supplies the self-including budget when (Delta+1)b_eta<=eta and lambda_eta A R<1. All original uniform Gaussian, all-subsets mixed-factor, combined incidence and source-identification hypotheses remain. Thus a classical coefficient theorem, rather than the finite1603argument alone, conditionally supplies the ABSOLUTE logarithmic cluster sum for this exact abstract gas.

## Original-root interpretation, repeated types and separate weights

The logarithmic series uses multiindices X on POLYMER TYPES. Repeated types can occur in this series even though a compatible family in Z contains each type at most once. The geometric size relevant to an exponential cluster weight is sum_S X(S)|S|; it is not automatically the size of a union with repetitions erased. No component N! or original-factor factorial is inferred from that distinction.

A cluster containing an original root label i must contain at least one polymer type S with i in S. The union bound over these S and the pinned-type estimate give an original-root absolute cluster bound at most sum_(S contains i)mu_S<=b_eta. This overcounts clusters with several such types, which is harmless for an upper bound. It does not identify these abstract coefficients with a source counterterm or a field derivative.

To retain an ADDITIONAL requested cluster-size weight exp(theta sum_S X(S)|S|), theta>=0, apply the criterion at radii rho'_S=|z(S)|exp(theta|S|), still with a_S=eta|S|. The budget is now

    (Delta+1)b_(eta+theta) <= eta,
    lambda exp(eta+theta) A R < 1.

It is NOT enough to replace the right side by eta+theta: eta pays the criterion and theta is the requested extra weight. A sufficient explicit window is

    lambda exp(eta+theta) <= 1/(2 A R),
    lambda exp(eta+theta) <= eta/[(Delta+1)(1+A log2)].

Auxiliary original-label intensities |u_i|<=u0 add the factor u0 to lambda. They do not become the source's complex background/current coordinates. A theta-weighted root bound is then b_(eta+theta) evaluated with u0 lambda, under the two-budget condition above.

## What remains open

This is an application dictionary for known abstract mathematics. Actual source geometry, uniform scalar row sum J, selected/free carriers, combined multiplicity and lambda's scale/coupling/background dependence remain unverified as before. The correct finite source law and baseline/counterterm dictionary are not provided by an abstract cluster criterion. The source's complex moving domains, normalized marginal identities, spatial mass gap and continuum conclusions are not admitted.

An extensive |log Z| or reciprocal cost from1603 is retained. The new pinned-cluster estimate is local in ABSTRACT polymer types/original labels; it is not yet physical conditional independence, a source observable estimate or a spatial decay theorem. Such a spatial theorem needs an appropriate weighted covariance/geometry estimate and its separate budget. Neither this note nor the classical statement is assessed1592 or machine verified.

Mechanism: translate the self-including activity budget to a known graph criterion, then translate its pinned-type sum back to original labels without dropping repeated-type costs. Hypothesis reduction: conditional abstract absolute logarithmic cluster control, with the original-source and physical-normalization gates intact. Levels: literature—selected theorem statement and definitions in the pinned author exposition; formal—no Lean result/import/build; heuristic—actual source parameter dictionary; speculative—physical transfer. Falsifiers: incorrect reflexive/simple-graph convention, omitted self term, spending eta twice, or failure of an actual uniform input. No new paper, assessment or grade is created.
