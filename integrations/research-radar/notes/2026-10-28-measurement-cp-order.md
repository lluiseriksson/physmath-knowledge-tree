# Measurement coefficients, positive Choi remainders and side information

Sourced fact (`literature`). [George–Hirche–Nuradha–Wilde2503.22823v3, Proposition35 and Corollary11](https://arxiv.org/html/2503.22823v3#S7.SS2) already identify the finite measurement-channel coefficient as the sum of minimum effect eigenvalues; its positive and relaxed variants coincide for measurement output. [Hirche2405.00105v2, PropositionIII.3 and CorollaryIII.4](https://arxiv.org/html/2405.00105v2#S3) give the positive CP-replacer decomposition and Choi SDP. The measurement formula and the ordinary contraction consequence of such a decomposition are prior. The2024 paper was first submitted30April and revised23May; indexing it now does not make it a new publication. Selected proofs were read, not the entire papers. Earlier adverse diagnostics are retained.

Graph-supported inference (`heuristic`). The quantity b from [1206](2026-10-28-continuum-preparation.md) is therefore a known finite measurement common-component coefficient when the outcome space is finite. Its dimension-only lower bound is a separate own derivation whose novelty is unresolved. A measurement followed by preparation permits converting positive scalar effect remainders into CP channel remainders. This conversion is available for a stated preparation representation, not an arbitrary postprocessor or an arbitrary observed unraveling.

Own analytic extension (unreviewed; `heuristic`). Let Psi be CPTP on d-dimensional states, with ordinary trace-contraction factor at most r, and let E be an entanglement-breaking postprocessor with measurable representation

    E(X) = integral Tr(F_a X) tau_a dnu,
    F_a >= 0, integral F_a dnu = I, tau_a >= 0, Tr(tau_a)=1.

Outputs tau_a live in a fixed finite-dimensional output space. Retain the normalization and joint measurability needed for these integrals. Put G_a=Psi*(F_a), c_a=lambda_min(G_a), b=integral c_a and Omega=integral c_a tau_a. The unreviewed1206 spectral argument gives b>=max(0,1-(d-1)r), and 0<=b<=1.

Using the unnormalized input-first Choi convention J(N)=sum Eij tensor N(Eij), the remainder is

    J(E o Psi - R_Omega)
      = integral (G_a^T-c_a I) tensor tau_a dnu >= 0,
    R_Omega(X)=Tr(X)Omega.

The Choi integral is well-defined: G_a>=0 and integral G_a=I, so integral Tr(G_a)=d; also0<=c_a<=Tr(G_a)/d. The positive integrand has integrable trace Tr(G_a)-d*c_a and hence integrable entries and norm in finite dimension. Its integral is positive. Thus E o Psi-R_Omega is CP and has trace(1-b)Tr(X). For b<1 it normalizes to a channel Q; for b=1 its positive Choi matrix has trace0 and vanishes. This supplies the positive decomposition

    E o Psi = b R_(Omega/b) + (1-b) Q  (when 0<b<1); at b=1 use E o Psi=R_Omega separately.

The chosen positive component is not the optimization over an arbitrary Hermitian common operator. In the2026 coefficient conventions this is a lower bound on the positive version alpha_+, and hence also a feasible bound for the relaxed versions; they are not identified for a general entanglement-breaking output channel.

Conditional consequence, also unreviewed. For states rho_AR and sigma_AR with rho_R=sigma_R, the replacer part cancels in their difference. Complete trace contraction is therefore at most1-b, uniformly over finite reference dimension. Joint convexity and data processing give the same upper factor for Umegaki relative entropy: both mixtures share the common state (Omega/b) tensor rho_R, and Q tensor id is a channel. Consequently the candidate upper bound is min(1,(d-1)r). This does not compute the optimal complete coefficient, prove a capacity formula or say that Psi itself has such a CP component.

Exact finite calibration. The four-point planar preparation channel from1206 has Bloch singular values(1/2,0,1/2). Use it both as Psi and E. Its dual effects have minimum eigenvalue1/8; Omega=I/4 and b=1/2. The [portable rational checker](../evidence/2026-10-28-measurement-cp/check_exact1207.py) verifies the Choi identity, a nonnegative Bell-basis spectrum for the remainder, and an SDP dual positive witness with the required partial trace and objective1/2. Primal and dual therefore establish the optimal positive CP common-component weight1/2 for this example. That equality is not an equality claim for either complete trace or complete Umegaki contraction, nor a global sharpness or novelty claim.

Falsifier and next task (`speculative`). Reject the extension if positivity/integrability of the Choi remainder or the retained preparation identity fails. Compare the dimension-only step with prior induced/coefficient comparison results before a priority claim. The CP channel decomposition permits an alternative implementation with a recorded reset; it does not supply that reset to an already observed instrument. The Pauli counterexample from1206 remains valid. Keep the actual record, posterior-law TV, trace-Wasserstein metric, positive CP order and Hermitian relaxation separate.

Formal result. No new Lean declaration, upstream replay, model assessment, manuscript or score. [Reading identities](../evidence/2026-10-28-measurement-cp/READINGS1207.json), the prior-to-synthesis [subgraph](../evidence/2026-10-28-measurement-cp/SUBGRAPH1207.json), and [exact finite controls](../evidence/2026-10-28-measurement-cp/EXACT1207.json) delimit the evidence. The current directed laboratory/arXiv/AIRR/aiViXra/public-repository refresh is inventory only. The general analytic implication remains under audit; do not turn the finite calibration into a separate paper or transfer a predecessor's grade.

Component audit1208 is now terminal and supports the stated hypotheses, with no grade or novelty certification. The endpoint display above was clarified after the audit; frozen original proofs and the full report remain in the [audit context](2026-10-29-component-audit.md).
