# Compact uncertainty without exact channel identification

Author working argument 1340, 29 October 2026 UTC. Private continuation of the existing optical paper, not a new paper, model assessment, formal proof or modification of frozen v4. Status: analytic proposal requiring a dedicated audit of the coding interfaces and prior art before manuscript integration. No importance score.

## Question and hypothesis removed

The lower feedback bound (25) in the exact v4 candidate is restricted to finite Gamma. Can compactness, finite payoff classification and robust common payload codes replace that restriction? The proposed extension keeps compact parameter space, positive noise floor, bounded gains, one unknown law fixed throughout an iid block, fixed E before the block limit, and additive per-law photon cost. It would remove only finiteness of Gamma. It supplies no useful code length or efficient classifier.

Frozen premises: main-final1336.tex SHA256 a8092f18a95f6f6a1528295be7b224c1982e2738320cb5373fb74fda8f24d2ef; exact assessed PDF SHA256 1285a454550aaaac58d583d26f15dd05175f6112606aa8530b4f06a9f829bed0. This text changes neither artifact. The existing full report and every objection remain attached to those exact bytes. No rating transfers to this argument.

## Literature boundary and abandoned novelty claim

Shrader and Permuter, arXiv:0711.0705v1 (5 November 2007), Section VII-B, Theorem 10, already treat arbitrary families of discrete memoryless classical channels with feedback. Their discussion includes channel learning and a universal-decoder alternative. Selected statements and Lemma 11's proof were read; Appendix E and the whole paper were not audited. Therefore a new general learning/minimax principle is not a defensible novelty claim and that standalone route is abandoned. Their finite-alphabet theorem does not by itself discharge the optical alphabet and photon-cost reductions below.

Berta, Gharibyan and Walter, arXiv:1603.02282v1 (7 March 2016), distinguish arbitrary finite-dimensional compound families in their no-feedback result from finite-family feedback achievability in Section VI. Selected Lemma 18 proof and Proposition 19 statement were read. Their conclusion describes an arbitrary-family feedback extension as open at that historical date. Current open status has NOT been established; no resolution is claimed here.

Boche, Janssen and Kaltenstadler, arXiv:1606.09314v3 (25 January 2017): abstract/introduction refreshed only. Its entanglement-assisted classical compound result is context, not a feedback proof used here.

Versioned primary links:
- https://arxiv.org/html/0711.0705v1
- https://arxiv.org/html/1603.02282v1
- https://arxiv.org/html/1606.09314v3

READING1340.json binds fetched response metadata; foreign full text is not redistributed. A narrowly restricted current arXiv search for arbitrary compound entanglement-assisted feedback returned no results; this is not evidence of absence or a novelty audit. An earlier search output was truncated and is not counted as read.

## Abstract finite-observation selector: author derivation

Let G be a nonempty compact Hausdorff space. Let f_1,...,f_s be continuous real payoffs, with max_i f_i(g)>R for every g. Let p_j:G->[0,1] be continuous probabilities, indexed by an arbitrary set J0. Assume equality of every p_j at two points implies equality of all f_i at those points. Exact parameter identification is not required.

Claim: finitely many observation coordinates and finitely many closed good cells suffice. Each cell has one fixed payoff strictly above R uniformly on the cell. A sufficiently accurate observation vector chooses a cell containing the true point.

Proof. At a center g choose i with f_i(g)>R. The bad set F_g={h:f_i(h)<=R} is compact. For each h in F_g, at least one p_j separates h from g, by the fiber assumption. The open sets {h:|p_j(h)-p_j(g)|>d}, for suitable positive d depending initially on h, cover F_g. A finite subcover gives a finite coordinate set J_g and a common delta_g>0 such that max over J_g of |p_j(h)-p_j(g)|<=delta_g excludes F_g. Take r_g=delta_g/4. If F_g is empty the payoff is globally good and no observations are necessary.

The open sets U_g={h:max over J_g |p_j(h)-p_j(g)|<r_g} cover G. Select finitely many centers g_l whose U_g_l cover G. Set J=union_l J_g_l and epsilon=min_l r_g_l>0. The closed sets H_l={h:max over J_g_l |p_j(h)-p_j(g_l)|<=3r_g_l} are compact, nonempty and avoid F_g_l, since 3r_g_l<delta_g_l. Hence min over H_l f_i_l>R; the finite minimum over l retains a strictly positive margin.

Given estimates q_j with max over J |q_j-p_j(h)|<=epsilon, select the first l with max over J_g_l |q_j-p_j(g_l)|<2r_g_l. Such l exists: choose an open cover member containing h, use strict <r_g_l and epsilon<=r_g_l. For any selected l the triangle inequality gives max over J_g_l |p_j(h)-p_j(g_l)|<3r_g_l, so h belongs to H_l. The first-success rule is Borel measurable. On observation failure a default index is allowed.

If each coordinate is a Bernoulli experiment repeated k independent times, a union bound and Hoeffding give uniform selection failure at most 2|J| exp(-2k epsilon^2). Only the index l needs feedback: ceil(log2 L) bits for fixed rate and model. Neither L nor epsilon is claimed uniform as the rate approaches capacity or E varies.

This is an ordinary compactness argument written by the author. No Lean declaration or independent verification is claimed.

## Optical instantiation: conditional hypothesis reduction

Fix admissible finite E. Write W_nu for the coherent-modulation heterodyne plus kernel at this E and c=inf_nu C_nu,plus(1), with cost |x|^2. If c=0 the proposed lower bound C_FB>=c is trivial. Otherwise fix 0<=R<c, choose 0<P0<P1<1 with P0*c>R. Concavity in the input cost, including mixing with the zero symbol, gives C_nu,plus(P0)>=P0*C_nu,plus(1)>R.

For each nu choose an input of cost <=P0 and information >R. The finite-input approximation with strict cost slack in Proposition 4 of the frozen source gives a finite input law mu_nu of cost <P1 still having information >R. For each fixed finite law, nu -> I_mu(W_nu) is continuous on compact Gamma by the Gaussian bounds and entropy argument already in that proposition. Its >R neighborhoods form an open cover; choose a finite subcover, giving finitely many candidate laws mu_i. Let S be the union of their finite supports.

For x in S and rational rectangles B in the complex output plane use p_(x,B)(nu)=W_nu(B|x). At fixed E, continuity of the Gaussian kernels in L1 on the compact branch domain makes these cell probabilities continuous under weak mixing-law convergence. Equal probabilities for a rectangle generating class imply equal conditional output laws on S, hence equal information for every selected mu_i. These observations satisfy the selector's payoff-fiber condition even when different mixing laws induce the same channel on S.

Apply the selector to f_i(nu)=I_mu_i(W_nu). It produces finite closed cells H_l, each with one fixed mu_i_l satisfying inf_H_l I_mu_i_l(W_nu)>R and cost <P1. Choose a single R1 strictly between R and the finite minimum of those cell information values.

Crucial interface: payload codes must work uniformly over the WHOLE selected closed cell, not only at its center. Proposition 4 supplies this: finite input, a finite output partition chosen uniformly on H_l, constant-composition random coding with one common decoder, and a length-dependent n^-2 channel net used only to choose one deterministic book. Every codeword has cost <nP1. Select all finitely many cell books with the same message count ceil(exp(nR1)); the maximum of their uniform average errors tends to zero.

Pilot phase: for each of the finitely many observation coordinates, transmit its fixed probe x and record whether the output belongs to B, repeated k=ceil(sqrt(m)) times. Thus t=|J|k=o(m). Let Q=max over probe symbols |x|^2, finite because S is finite. Pilot inputs do not depend on the message. Bob selects l and returns that finite index over the existing noiseless backward classical link. Alice and Bob use the corresponding length n=m-t robust payload book and decoder.

On successful classification the actual nu belongs to H_l. Conditioning on the pilot transcript leaves the payload message uniform and the future channel iid with the same fixed nu. Therefore total average error is at most 2|J| exp(-2k epsilon^2)+max_l e_(l,m-t), uniformly in nu, and tends to zero. Even a wrong selected index uses a feasible codeword: total normalized cost is bounded per message by tQ+(m-t)P1<=m eventually, since P1<1 and t/m->0. Multiplying by E enforces the photon budget for every law. Achieved total-block rate tends to R1>R. All model-dependent approximations are fixed before m->infinity.

Subject to the stated interfaces, this establishes C_FB>=inf_nu C_nu,plus(1) for compact Gamma. The existing comparison C_nu,plus(1)>=C_nu(1)-B/E and existing arbitrary-Gamma feedback upper bound would then remove the finite-family restriction from (25). This last integration is an AUTHOR PROPOSAL pending audit, not an assessed theorem or published correction. It does not use a new quantum entanglement-assisted achievability theorem.

## Failure search and scope limits

1. Exact law identification is unnecessary. A counterexample with indistinguishable laws matters only if their selected payoffs differ.
2. A fixed epsilon net and a center-only payload code leave a block total-variation error proportional to n epsilon. That route is rejected. Use robust codes on compact closed cells.
3. Zero-photon pilots cannot universally identify an optical channel: the normalized Gaussian kernels W0(y|x)=CN(0,1) and W1(y|x)=CN(x,1) agree at x=0 but differ at nonzero x. Unit-cost capacities are respectively 0 and log(2) in natural units. This refutes universal vacuum identifiability, not the proposed rate formula. Cost slack pays for nonzero probes.
4. If the pilot depended on the message, conditioning could spoil the average-error payload bound. The proposed pilot is deterministic and message-free.
5. A book feasible only in expectation under its intended cell could violate a per-law budget when selected incorrectly. Constant-composition words have a uniform deterministic cost bound instead.
6. Compactness, strict information margin, positive noise floor, finite probe cost and fixed iid law are indispensable premises of this proof. Changing law during a block, noncompact families or loss of entropy continuity is outside scope.
7. No effective bound on the number of cells, pilot length at a specified error, photon scale or computational cost is obtained. No practical improvement claim follows.

Minimal formal target: the compact finite-observation selector lemma, with continuous finite payoffs and the payoff-fiber assumption. It would not formalize optical coding or capacity.

## Broader quantum analogy: parked

Dictionary: unknown classical kernel maps to a finite-dimensional quantum channel; input law payoff maps to mutual information for a chosen input state; probe event probabilities map to process-tomography experiments; robust cell code maps to a compound entanglement-assisted code. Compactness and finite-classifier logic are preserved. Resource preparation, entanglement accounting, fidelity/error conventions and the applicable uniform coding theorem are NOT discharged here. The 2016 historical open remark and the apparent simplicity of the analogy require special caution. No arbitrary-quantum-family feedback theorem, current open status or novelty is claimed. Do not create a separate paper or announce a solution from this analogy.

## Evidence layers and next bounded action

Literature: the specifically read versioned classical/quantum statements above, with exact reading levels in READING1340.json. Graph context: SUBGRAPH1340.json retrieves three existing quantum-information nodes and two edges; graph proximity is not a proof. Heuristic/speculative: the proposed optical hypothesis reduction and parked quantum analogy. Formal: no new result. The elementary selector and cost/error inequalities have been checked in author reasoning only, with no model review or machine proof.

Next: audit each interface of this proof against exact Proposition 4 and Theorem 12, check relevant current primary prior art, and attempt a genuine counterexample before any public theorem claim. Integrate at most as a substantive revision to the existing paper after a finished artifact and actual assessment. No new numerical campaign or grade-seeking restart. Editor-message authorization from 1339 remains pending independently; no message has been sent or asked again.
