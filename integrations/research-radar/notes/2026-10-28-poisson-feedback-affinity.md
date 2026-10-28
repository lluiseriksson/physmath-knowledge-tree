# Nonlocal entropy feedback is a different dynamical contract

28 October 2026; directed source reading and one defined finite falsifier.

**Literature.** Cai, Gan, Miao and Shi, arXiv2610.35892v1, couple a
target-weighted Poisson solve to density-dependent transport. Theorem1
assumes a bounded smooth domain, positive smooth target and compatible
smooth logarithmic initial data. Theorem11/Corollary12 derive Fisher-plus-
Jeffreys dissipation and fixed-target entropy decay for that modified flow.
The short entropy proof was read; global well-posedness and regularity
proofs were not audited. This is not an estimate for unchanged Langevin
dynamics or arbitrary quantum state pairs with a reference system.

The abstract, HTML and one-record Atom metadata report12September2026;
the current index lists it on28October. Record the reported date separately
from new-to-index status. The timing difference is not a mathematical defect.

## Own finite analogue: specify the rule before testing its transfer

Use the three-state path with uniform reference pi=(1/3,1/3,1/3) and
L=[[-1,1,0],[1,-2,1],[0,1,-1]]. For a strictly positive probability vector q,
let r_i=log(3q_i), g=r-(sum_i r_i)/3, and solve L phi=g up to a constant.
Give edge ij the logarithmic-mean mobility
theta_ij=(q_i-q_j)/(log(q_i)-log(q_j)), with its continuous diagonal value.
Define F_i(q)=-sum_[j adjacent i] theta_ij(phi_j-phi_i).

This is our specified graph analogue, not a discretization asserted by the
source. Pairwise cancellation gives sum_i F_i=0. Its exact edge chain rule
theta_ij(r_i-r_j)=q_i-q_j implies

sum_i r_i F_i = -sum_i q_i(L phi)_i
                 = -D(q||pi)-D(pi||q).

Thus it reproduces the feedback entropy identity at the vector-field level.
Adding the linear diffusion Lq contributes the nonnegative discrete Fisher
term I=sum_edges(q_i-q_j)(log q_i-log q_j) with a minus sign. No global
positivity or well-posedness theorem for this graph ODE is claimed here.

## Exact affinity obstruction

Take q=(1,2,4)/7 and v=(4,2,1)/7. The exact calculations give

- F(q)=(1,1,-2)/7 and F(v)=(-2,1,1)/7;
- F((q+v)/2)=(-1,2,-1)/42;
- F((q+v)/2)-(F(q)+F(v))/2=(1,-2,1)/21, which is nonzero.

The Poisson equation, mass balance and entropy identity were checked with
exact logarithmic arithmetic at all three full-support witnesses. Adding
the linear diffusion Lq leaves the same affinity defect. SymPy1.14.0 checks
these identities; this is neither an independent referee nor a Lean proof.

Consequently a state-independent differentiable family of linear quantum
maps cannot reproduce this specified population vector field for every
diagonal full-support input: the population map would be affine, and its
derivative at time zero would be affine too. This excludes that exact
single-input linear transfer, not all quantum extensions, adaptive feedback,
collective-copy models, or the continuum source theorem. State dependence
alone would not have been a sufficient proof of non-affinity; the witness
tests the actual defined rule and its possible cancellations.

## A different affine quantum rule already has this entropy law

For full-rank density matrices rho,sigma, the reset generator
G_sigma(rho)=sigma-rho gives

d/dt D(rho||sigma)
 = Tr[(sigma-rho)(log rho-log sigma)]
 = -D(rho||sigma)-D(sigma||rho).

The first equality uses the trace derivative of Tr(rho log rho) and
Tr(G_sigma(rho))=0; it does not require rho and sigma to commute.
Its channel is T_t(rho)=exp(-t)rho+(1-exp(-t))sigma. This is a separate
affine construction, not our non-affine path rule. It shows why neither
a general impossibility of quantum Jeffreys dissipation nor novelty from
a fixed-target rate alone follows. Preparing sigma is a substantive resource
assumption; an entropy clock alone does not supply a target-state sampler.
This is an elementary analytical comparison, not a new theorem or assessment.

## Heuristic, speculative and formal boundaries

Dictionary: the reference-weighted inverse Laplacian reconstructs feedback
from a log-density error; current-density mobility turns its edge pairing
into Jeffreys dissipation. Preserved are a finite mass balance and entropy
calculation. Lost are continuum regularity, boundary conditions, numerical
oracle costs, measurement resources and a complete quantum pair contraction.

A future adaptive quantum proposal must specify its resource model and
prove robustness to an implementable oracle error. Merely assuming the
desired entropy-residual bound would rename the missing estimate. Abandon
the direct fixed-channel identification on the affinity witness above;
do not claim that a universal entropy rate makes the elliptic solve uniformly
well-conditioned or computationally cheap. No such cost bound was proved.

Confidence: the source card is literature; the transfer dictionary is
heuristic; adaptive extensions are speculative. Formal result added: none.
No novelty clearance, new manuscript, assessment score or graph-confidence
upgrade follows from this elementary finite check.

Primary source: https://arxiv.org/html/2610.35892v1


The [defined finite checker](../evidence/2026-10-28-poisson-feedback/exact1201.py), [exact rational defect](../evidence/2026-10-28-poisson-feedback/EXACT1201.json), [primary reading/date ledger](../evidence/2026-10-28-poisson-feedback/READING1201.json) and [fresh directed inventory](../evidence/2026-10-28-poisson-feedback/SOURCES1201.json) preserve scope and provenance. The helper retrieves its original local graph context and is environment-coupled; no portable package or independent replay is claimed.
