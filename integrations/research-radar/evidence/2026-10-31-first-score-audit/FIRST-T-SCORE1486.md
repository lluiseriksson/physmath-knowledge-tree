# Coarse-field derivative of the actual first retained insertion

30 October2026. Same source-specific supporting manuscript, not a new paper or review. The1482 audit does not assess this follow-up.

Primary: CMP119 printed248-253, especially the FIRST Lebesgue-integral line of Eq1.26 on printed253, visually checked here. Exact PDF4172827bytes,SHA256db1deec2f1cfedfc5210b023a4cc07fe9a3363a3b5bf59e4cac8fac871ffac7a. The source's raw cutoff is chi^(0)(Lambda1); remaining characteristic functions in Eq1.25 are assigned to the surrounding history/large-field factors. CMP116 printed11-13 selected text was checked to distinguish the later signed/localized representation; it is not used as the positive measure below. No full-proof audit.

## What is fixed while differentiating

Freeze the discrete domains, gauge/constraint choices, the coupling g0, exterior raw coordinates and original exterior field parameters of the chosen first-step history chart. V(theta) is a smooth REAL coarse-field path staying within that chart's strict admissible class. The selected coordinate set and retained raw cutoff K do not change along this path: chi^(0)(Lambda1) in the first Eq1.26 line restricts those same raw coordinates with the same fixed thresholds.

This is a derivative of the inner conditional integral with respect to the coarse field. It is not a derivative of the outer history indicators or a variation of g0. Crossing a history/domain boundary, changing the chart, or differentiating a cutoff threshold requires its own boundary analysis. Also, a fixed domain under theta does NOT eliminate the cutoff surface terms in an integration by parts with respect to raw A. The earlier raw-IBP surface objections remain valid.

## The source's actual score, before introducing a parameter-dependent Gaussian measure

Write x=A|Lambda1, z=A|Lambda1-complement, and let

    Q_theta=C_theta^* Delta1_theta C_theta,
    F_theta(x;z)=-1/2<x,Q_theta,II x>
                 -<z,Q_theta,OI x>
                 +v_theta(g0 C_theta A)
                 -g0^-2 V_theta(g0 C_theta A).

This is the first exponent of Eq1.26 in the actual raw Lebesgue coordinates. All source factors belonging to the conditional integral, including the nonlinear constraint/Haar Jacobian, remain in v_theta and V_theta with their original meaning; no additional Gaussian determinant is silently dropped. An A-independent factor can be retained in F; its derivative cancels from a normalized covariance.

The parameter score is exactly

    S_theta=partial_theta F_theta
      =-1/2<x,(partial_theta Q_theta,II)x>
       -<z,(partial_theta Q_theta,OI)x>
       +partial_theta[v_theta(g0 C_theta A)]
       -g0^-2 partial_theta[V_theta(g0 C_theta A)].

The derivatives include BOTH explicit parameter dependence and the argument C_theta A. Likewise partial_theta Q includes derivatives of C, Delta1 and their adjoints. The physical path also moves U1 and J=J(U1), so J must not be held as an unrelated independent reference. The exterior raw z is fixed in this coordinate derivative; that does not mean every reconstructed physical exterior link is fixed.

For mu_theta(dx)=1_K exp(F_theta)dx/Z_theta and the actual O_i^h(x,V(theta)) from1485, finite-volume differentiation gives

    partial_theta a_i
       =E_theta(partial_theta O_i)
        +Cov_theta(O_i,S_theta).

The direct observable derivative includes the changing background AND the changing constraint lift/remainder in its actual preimage. It is not simply the derivative of a bare coarse plaquette. Compact K, the strict smooth real chart and nonzero finite Z justify differentiation locally in theta; no uniform volume estimate is asserted by that elementary justification.

For the carried joint cumulant k_pq=Cov_theta(O_p,O_q),

    partial_theta k_pq
       =Cov_theta(partial_theta O_p,O_q)
        +Cov_theta(O_p,partial_theta O_q)
        +Cum3_theta(O_p,O_q,S_theta).

Here Cum3 is the joint centered third moment. This is the actual coarse-field response of the inserted coefficients in the positive retained integral. No inner moving-boundary term occurs on the stated fixed raw K. Any response of the OUTER coarse/history cutoffs belongs to the remaining outer-law problem.

## Consequence for a usable bound

The displayed identity retains the local raw carrier of O, the conditional correlations with the actual score, and the background-response dependence. It does not by itself bound any of them. In particular:

- The explicit factor g0^-2 is not a proof that the normalized response blows up: constants in x cancel from the covariance, and a usable estimate concerns the score's RAW gradients/localized fluctuations.
- Conversely that cancellation alone does not prove a uniform response. Derivatives of C, the physical Delta1/J term, the background and the Jacobian must actually be bounded.
- The direct response and the score contribution both carry coarse-field dependence; one cannot keep only the first term.
- A single quadratic covariance Q^-1 is not automatically the derivative of the constrained background U1(V). The correct source reconstruction response operator must be identified, with its actual gauge/averaging constraints.
- Later signed/polymer decompositions are not positive conditional probability measures term by term. The joint numerator and its score must be localized with the source construction before using positive-fiber bounds there.

The next finite source calculation is therefore specific: identify partial_theta U1 and partial_theta C from the constrained variational/background map on this same real history chart, then insert those derivatives into the ACTUAL S_theta above. Test the mixed raw/coarse derivatives and their carrier/tail sums; do not introduce a new abstract localized-score hypothesis as a replacement for that calculation. This targets the uniform/local coarse response of a_i(V), which the prior conditional covariance estimate did not supply.

Falsifiers: a hidden V-dependent inner cutoff, an omitted parameter derivative of the lift/Jacobian/physical J, or use of the wrong background derivative invalidates the corresponding formula/application. Levels: literature for selected source coordinates/exponent; heuristic for participating-agent fixed-domain score calculus; speculative for uniform/local response and physical connected decay; formal:none new. No novelty, independent review, grade or global physical result.
