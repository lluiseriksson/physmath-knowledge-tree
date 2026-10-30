# A stronger population-operator entropy bound fails at a rank boundary

This closes one proposed mechanism for the existing fixed-channel entropy target. It is a negative result about an auxiliary estimate, with no new paper or priority claim. The original arbitrary-reference inequality G and channel additivity remain open.

## Exact mechanism and counterexample

For N(x,y,z)=(3x/5,3y/5,z/4+1/5), write rho_AR=[C;D][C;D]*, Sigma=C*C+D*D and P=Sigma^(-1/2)D*D Sigma^(-1/2) on support(Sigma). Set p=Tr Sigma P. The proposal replaced the scalar roof e_N(p) in G by Tr Sigma e_N(P), retaining the same complementary-channel output entropy and the same weighted physical-branch entropies. Call the stronger residual T. Ordinary spectral scalar Jensen proves T>=0 would imply G>=0; it does not prove T.

The original [proposal](PROPOSAL1399.txt) is preserved, including its initially positive, uncertified, separable diagnostic. That diagnostic supplies no universal evidence. A single analytic counterexample suffices:

C=[[100,1],[0,1]]/sqrt(20004), D=[[100,-1],[0,1]]/sqrt(20004).

The physical state has reference dimension2 and rank2; both physical diagonal blocks are positive definite. Its Schur complement is exactly saturated. It is therefore within the proposed saturated-endpoint restriction. Here Sigma=diag(5000/5001,1/5001), p=1/2 and P=[[1/2,-sqrt(2)/4],[-sqrt(2)/4,1/2]]. The two eigenvalues (1 +/-1/sqrt(2))/2 have spectral weights1/2. The scalar bound e_N''>=88/125 from [audit906, Section7](../2026-10-27-entropy899/AUDIT906.txt) implies

Tr Sigma e_N(P)-e_N(1/2) >= (44/125) Tr Sigma(P-I/2)^2 =11/250.

Yet rho=(1-epsilon)|+0><+0|+epsilon|chi><chi|, epsilon=1/5001, chi=(1,1,-1,1)/2. Entropy of a mixture and pure-state complementarity give S((Nhat tensor id)rho) <=e_N(1/2)+h(epsilon)+epsilon ln2. Dropping nonnegative branch entropies, and using ln5001<9, ln2<1, yields

T <11/5001-11/250 =-52261/1250250 <-1/25 nats.

The [exact premise checker](review/counterexample-check1399.py) verifies normalization, support, saturation, decomposition, spectral weights and the rational constants. It does not estimate entropy numerically or scan states. The universal entropy reasoning is in the full report; this is not a Lean proof or independently implemented certificate.

## Why the strengthening fails

In the analogous family C=[[1,t],[0,t]]/sqrt(2+4t^2), D=[[1,-t],[0,t]]/sqrt(2+4t^2), t>0, the state approaches the product equality |+0>, while the proposed population-operator spectral variance stays1/8. At t=0 the support compresses to rank1 and P becomes the scalar1/2. The lifted roof retains a fixed Jensen excess along the faithful approach, whereas the physical entropy residual approaches the scalar equality. Rank restriction and faithful finite examples do not cure this obstruction.

A separate [256-bit outward-ball control](JENSEN-BALL1399.json) already refutes weighted operator-Jensen convexity of this roof at a fixed faithful Sigma and fixed mean population. Its negative interval is about -2.07284615e-11. This auxiliary tool obstruction is distinct from the analytic negative T witness. Ordinary scalar spectral Jensen remains valid.

## Scope and stopping rule

The proposed universal T is refuted and retired, including its saturated full-rank-branch restriction. Do not continue scans, small parameter variants or a paper built from this strengthening. A further entropy mechanism must preserve the population/reference geometry and remain compatible with the product-state rank boundary. The concrete falsifier was negative T, and it has been met. No negative G witness, arbitrary-partner theorem, tensor-power result or capacity conclusion follows. No novelty claim or exhaustive literature search is made.

Evidence labels: formal: none; literature: existing scalar bound and standard entropy properties; heuristic: own analytic reduction/counterexample with exact finite premises; speculative: original G/additivity remain open. Graph confidence and source/candidate counts stay unchanged.

## Model assessments and review context

ONE actual participating AI component review was requested with GPT-6 Astra, xhigh, in a separate assigned context with shared filesystem. Effective backend identity, effort, isolation and independence are unattested. No score, target score, restart, PDF assessment, human peer review or editorial decision is involved. Full report, original request/context, all objections, controls and execution records are preserved with original bytes and readable transport hashes. No901/906 or other manuscript score is inherited. Read the [full adverse report](review/REPORT1399.txt), [actual request/context](review/REQUEST1399.txt), [run log](review/RUN-LOG1399.txt), [native originals](original-review1399.zip) and [transport hash map](TRANSPORT1399.json). All18 reviewer artifacts match their D: copies. The initially incorrect human-argument label is superseded by the recorded AI-provenance correction; historical bytes remain explicitly marked. No mathematics was rerun for that metadata correction. No previous901/906 objections are closed by this review.
