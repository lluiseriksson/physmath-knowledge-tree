# Bridge card: reject a Gaussian shortcut for critical reset channels

Retrieved context: canonical graph/index.json, the literature-level node
domain.quantum_information_theory and its no-signalling/CMI edges. These
edges establish context only; graph proximity does not prove this proposal.

- Target: a defined critical-noise reset minimax problem, not an additional
  small paper or an assumed Gaussian saddle point.
- Move: vary the modulation while preserving exact normalization and cost.
- Confidence: **speculative** analytic combination, pending serial audit.
- Literature: established Gaussian signal/thermal formulas, cq entropy
  identities, Gibbs relative entropy and data processing.
- Formal: no Lean theorem or interval-certified numerical inequality.

For a physical phase-insensitive Gaussian signal of gain k>0 and vacuum
noise t, coherent input z yields a displaced thermal state sigma_z. At
energy E>0 set M=kE+t and fix the reset at tau=gamma_M. Circular Gaussian
modulation p0 has average output tau under the mixture
lambda sigma_z+(1-lambda)tau,0<lambda<1.

Let H(z) be the binary branch conditional entropy H(F|B,z). It is radial,
bounded, positive at finite z, and tends to zero for large displacement
by heterodyne discrimination and binary Fano. It therefore cannot be affine
in |z|^2. A bounded radial perturbation h can preserve both mass and energy
while a=integral p0 h H>0. For p_eps=p0(1+eps h), the proposed exact identity is

    chi(p_eps)-chi(p0)=eps*a-D(average_output_eps || tau).

The dictionary maps a classical modulation perturbation to a quantum
average-output perturbation, preserves mass and physical expected energy,
and contracts relative entropy. Data processing bounds the last term by
eps^2*integral p0 h^2. If justified in full, sufficiently small eps strictly
improves this circular Gaussian coherent modulation for the FIXED reset.
The new combination is not yet externally audited. It is consistent with
asymptotically vanishing improvement in the sublinear regime.

What is lost: this is not a comparison against all squeezed Gaussian
ensembles, an optimal-input theorem, additivity, the worst reset, a quantum
capacity calculation or a minimax solution. In particular a classical
receiver's improvement does not by itself improve unrestricted quantum
capacity; the analytic quantum identity needs its own proof.

A separate quantum finite-state diagnostic668 uses the identity signal,
E=1,lambda=.5 and a fixed thermal reset of mean1. Fock dimensions
64/96/128/160 and quadrature orders24/36/48/64 give a directional
derivative about0.01459081496447nat with the same annuli. The derived
candidate gain estimate is6.6171103193e-5nat. These normalized truncated
states support the sign test only: no interval arithmetic or fully bounded
infinite-tail entropy error was supplied. This is not a capacity computation
or an independent implementation, and no importance score is attached.

A supplied classical analogue W(y|x)=.5 CN(y;x,1)+.5 CN(y;0,2),X~CN(0,1),
uses three radial annuli with exact analytic moment cancellation. Four
floating quadratures32/48/72/96 suggest a derivative0.00869026174nat and
chi-square gain estimate2.34733454e-5nat. This is convergence evidence,
not an interval-certified positive bound or an independent implementation.
The archived program SHA256 is
2e6cbe8144d95e131892c9cfa93f1e1913552cb174a2dead9b9d3eb6f9b8979f;
output SHA256ea46df77f3d58c2c4ab2b5c985015e78708c3d749d12160fac7a5fe5dbf924d1.

Falsifiers: a sign error in the flag identity; failure of bounded
moment-correcting tests; absent Gibbs cancellation; unjustified continuum
preparation or entropy finiteness; or a prior equivalent theorem. The next
small proof target is the bounded-test annihilator lemma; audit all transfer
steps before using this as a quantum claim. Do not infer a nonvanishing
critical-regime gap without a separate scaling argument.

Primary frontier context:
[2610.22308v1](https://arxiv.org/abs/2610.22308v1), selected canonical-form,
Gaussian ensemble and dilation passages read, not full proof audited;
[2608.01909v3](https://arxiv.org/abs/2608.01909v3), abstract only;
[Zixuan He,Zenodo23479869v1](https://zenodo.org/records/23479869), description
only, PDF not read. Their Gaussian-channel statements do not establish
optimization for the reset mixture. Classical additive Gaussian-mixture
noise has an extensive non-Gaussian-modulation literature; replacement
noise is a different model, but that alone does not establish novelty.
No worldwide originality, priority or AIRR score is asserted.
