# Author response to the single unscored component inspection1365

2026-10-30. This response clarifies the claim; it does not replace the frozen draft or report and carries no grade or PDF assessment.

## F01 accepted: quantify the preparation

Let C_(4,4)(r) consist of triples (Psi,F,sigma), where Psi:M_4->M_4 is CPTP with ordinary trace-distance contraction eta(Psi)<=r, (F_y)_(y=1)^4 is a POVM on C^4, and (sigma_y)_(y=1)^4 are qubit density matrices. Write E_(F,sigma)(X)=sum_y Tr(F_y X)sigma_y. The precise statement supported by the lower-bound proof and the tetrahedral equality family is

    inf_{(Psi,F,sigma) in C_(4,4)(r)} alpha_+(E_(F,sigma) Psi)
      = max(0,1-sqrt(3)r),  0<=r<=1.

The terminal POVM AND the prepared states vary in this joint infimum. An additional valid statement fixes the particular E_tet of the witness, but we use the joint-class statement in the synthesis.

The equality for every arbitrary E fixed in advance is rejected. The reviewer's counterexample is accepted: choose F_y=|y><y| and all four sigma_y=tau. Every E Psi is then the same replacer Tr(X)tau, its Choi is I_4 tensor tau, and alpha_+=1 for every r. All four outcomes can be nonzero. This is an actual refutation of that reading, not a reason to erase the objection or restart the inspection.

The frozen display did not bind E explicitly. This response supplies the missing quantifier; the lower bound, which holds for each admissible pair, remains distinct from existence of an attaining pair. No exact profile for all fixed preparations or all d,k,N is asserted. The universal coefficient2 is valid by the argument, but its sharpness for the whole factorized class is not proved here.

## F02–F04 retained, without altering the report

The reviewer ran the checker once directly in its source folder. Its final output write rewrote EXACT1365.json with the same SHA256 before and after; metadata may have changed. This should have been run on a copy. The incident remains in the complete report and context. Future readers should copy the three own inputs into a temporary C: folder before running the checker.

The finite exact checker supports the tetrahedral witness and a zero-sum-vector polynomial identity. General positivity on0<=u<=1 follows analytically from the displayed spectra. The Bloch averaging, positive dual normalization and general SDP theorem were inspected analytically; the finite checker is not their proof and is not a Lean certificate.

The author's first earlier checker run failed on syntactic comparison of an unsimplified symbolic trace. Its correction was simplify(trace-1)==0; the second run passed. This history is separately documented by the author, not independently verified by the reviewer. The wrong-transpose construction is a retained negative control: at u=1 its singlet expectation is1/3 rather than0.

## Attribution and assessment boundary

The coefficient alpha_+ is the existing Definition7/equation3.25 of George–Hirche–Nuradha–Wilde2503.22823v3. The complete equal-reference hockey-stick consequence uses their existing Proposition31. Sphere averaging/measurement norms have established antecedents, including Matthews–Wehner–Winter0810.2327v2. The present scope is the factorized lower bound and restricted joint envelope, not a new definition, divergence theory or claim of worldwide novelty.

The reviewer did not consult external sources or the earlier1351 proof/report; their reconstruction is limited to this frozen component. The parent's primary antecedent reading and conditional comparison with the earlier bound are separately labeled. Requested GPT-6 Astra/xhigh, effective model/effort unattested, shared filesystem, independence unverified. One participating AI inspection, no restart, no target score, no human peer review or editorial decision. No earlier PDF score transfers to this component or response.
