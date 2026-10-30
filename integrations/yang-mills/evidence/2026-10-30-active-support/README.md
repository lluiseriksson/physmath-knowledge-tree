# Active supports, modified distance and scale direction

Own research synthesis, 30 October 2026, execution 1402. Integrated research note for the existing Yang–Mills knowledge pack, not a new paper. No model assessment or grade. Programme reference: `c454346d873385e3a03e38e0f85f4f1439a032c7`. The kernel/binder/Hodge audit closed in 1401 is not repeated.

## Evidence and confidence

- **literature:** selected statements and proof steps in the primary papers below were read; this is not an audit of their full proofs.
- **heuristic:** the proposed correspondence between an actual observable insertion and two active polymer supports remains unproved. The elementary conditional argument and auxiliary countermodel below have explicit proofs, but were not formalized in Lean.
- **formal:** existing programme definitions and declarations are cited at their fixed commit; no new formal theorem, independent rebuild or physical activity producer is claimed.
- **speculative:** obtaining a uniform physical-time decay rate from the actual CMP116/CMP119 observable family remains a research target. Stop if the insertion identity, two-active-support localization or uniform metric dictionary cannot be established.

The radius-one subgraph around `problem.uniform_yang_mills_rg_activity` was retrieved before this synthesis. It connects active-skeleton cluster expansions, RG, covariance collars and constructive QFT; its heuristic edges do not prove the missing estimate. No graph confidence is changed.

## Conditional distance extraction

Let G be the programme's cube graph and H a fixed hole family. For a connected respectful carrier X with nonempty active skeleton, use the **actual discrete definition**

    m_H(X) = min { |S|-1 : skeleton_H(X) subset S subset X, S connected }.

This is not a quotient metric giving free transport through holes. If r and s belong to the active skeleton, every admissible S contains a simple G-path from r to s. Consequently

    dist_G(r,s) <= m_H(X).

Let A and B be finite nonempty sets of active cube locations. Suppose every nonzero contribution a_k(X) has skeleton intersecting **both** A and B, and suppose

    |a_k(X)| <= C g_k^p exp(-kappa m_H(X)),
    sum_{X: r in skeleton_H(X)} exp(-kappa_s m_H(X)) <= K_s,
    lambda := kappa-kappa_s > 0.

Then m_H(X) >= dist_G(A,B). Split the exponential into the summable part and the residual distance part. Bound the indicator of skeleton intersecting A by the sum of its rooted indicators. This gives

    sum_X |a_k(X)|
      <= C |A| K_s g_k^p exp(-lambda dist_G(A,B)).

No factor |B| is needed in this union bound. A connected carrier containing both complete targets is insufficient: both contacts must lie in the **active** skeleton. The existing singleton-skeleton hole example already shows why; it is reused, not a new discovery.

The existing `rootedHolePolymerSum_bound` supplies a discrete rooted count under its disjointness, nonempty-hole and no-edge-between-distinct-holes assumptions. With q=exp(-kappa_s)>0, a sufficient condition is

    (3^d)^2 q 2^(3^d+1) < 1,

and one safe rooted-count constant is

    K_s = q^(-1) / (1-(3^d)^2 q 2^(3^d+1)).

This is a sufficient, nonoptimal count. Do not apply it to arbitrary HoleFamily values without its hypotheses or identify it with source continuum-tree constants without a comparison theorem. Cube adjacency is the king-move/Chebyshev graph, not nearest-neighbor L1 adjacency.

## The physical dictionary is still necessary

For physical separation t, prove for the actual scale-dependent insertion supports

    dist_G(A_(t,k), B_(t,k)) >= a_k t - b_k.

Uniform M3 decay requires a positive uniform lower bound on lambda_k a_k and control of C_k |A_(t,k)| K_(s,k) exp(lambda_k b_k). With these bounds and the required marginal sum of g_k^p, the displayed estimate produces a uniform physical factor. It does not manufacture the insertion identity or a raw activity bound.

The scale index must be translated explicitly. Increasing UV depth can mean decreasing physical block size. Forward coarsening means increasing physical block size. A source coarsening index j may need a mapping such as N-j to the M3 UV index; no such map is supplied here. Neither source error nor programme error follows from their using different indices.

## Exact falsifier of a weaker replacement

Per-scale exponential locality with rates tending to zero, even together with a valid summable marginal flow, does **not** imply uniform physical exponential decay.

Take g_0=1/4 and g_(k+1)=g_k(1-g_k). By induction 0<g_k<=1/4. The decreasing sequence tends to zero: any limit ell satisfies ell=ell(1-ell). Hence telescoping gives

    sum_(k>=0) g_k^2 = g_0 = 1/4.

Moreover

    1/g_(k+1)-1/g_k = 1/(1-g_k) <= 4/3,
    g_k >= 1/(4+4k/3) = 3/(12+4k).

Define R(t,k)=g_k^2 exp(-t/2^k) and, for t>=1, nsc(t)=floor(log_2 t)+1. At t_m=2^m the truncated sum includes k=m, so

    sum_(k<nsc(t_m)) R(t_m,k)
      >= exp(-1) g_m^2
      >= 9 exp(-1)/(12+4m)^2.

For any A,c>0 this exceeds A exp(-c 2^m) for sufficiently large m, since c 2^m-2 log(12+4m) tends to infinity. Thus no uniform positive exponential rate exists. The two recurrence identities were checked symbolically in `ALGEBRA-CHECK1402.json`; the inequalities and asymptotic argument are given here, not certified by those two checks.

This rejects only the auxiliary implication “summable marginal amplitudes plus scale-dependent locality implies a uniform physical rate.” It does not refute the actual M3 assumption with its already uniform c0, any gauge model, or any Balaban/Dimock theorem. R here is a transparent mathematical countermodel, not a source-derived physical remainder. Do not turn it into another adapter or claim an eliminated physical hypothesis.

## Primary-source anchors and boundaries

1. T. Balaban, *Renormalization Group Approach to Lattice Gauge Field Theories II. Cluster Expansions*, CMP 116 (1988), 1–22, [DOI](https://doi.org/10.1007/BF01239022). Existing cached PDF SHA256 `ee39523a0f7b83af958513c7bd6f9c7731934b40355ef5d6b0f7a68ee6d022fc`. Selected pp20–21 read, Eq2.38 visually checked: the rate is `sqrt(1-8 delta) L kappa d_(k+1)(Z)`. The source fixed blocking factor L must not be silently identified with the programme's torus modulus. The C3 amplitude and all smallness restrictions remain part of the estimate. This is an activity theorem, not a two-point observable identity. An older programme prose transcription has `(1-8delta)*(1/2)` instead of the square root; preserve the source formula and treat this only as a transcription correction, not a new result.
2. T. Balaban, *Convergent Renormalization Expansions for Lattice Gauge Theories*, CMP 119 (1988), 243–285, [DOI](https://doi.org/10.1007/BF01217741). Existing PDF SHA256 `db1deec2f1cfedfc5210b023a4cc07fe9a3363a3b5bf59e4cac8fac871ffac7a`. PDF pp1–2,18–19 read; PDF18/printed260 Eq2.31 visually checked. It bounds a localized R term by `g_j^kappa0 exp(-kappa d_j(X))`. Source J is not automatically an independent external observable-insertion parameter. No physical mixed-derivative/localization identity is inferred.
3. J. Dimock, *The Renormalization Group According to Balaban II. Large Fields*, [arXiv1212.5562v2](https://arxiv.org/abs/1212.5562v2), arXiv version date 2 April 2013; PDF printed date 25 August 2018. PDF SHA256 `9b5216ec475c98c1acaaf82f7ac82e19567b9ab099a17a08f142162adac7589c`. Selected pp20–21,68,90 read;21,68,90 visually inspected. Eq150 defines the modified continuum-tree distance; Eq151 is the rooted sum. Around Eq491, separated **active** pieces force a long tree and allow an extra small exponential factor: a primary example of the distance-extraction mechanism, not a new method introduced here. Appendix E Lemma E.3, Eq627–631, proves the fixed-hole-family rooted count combinatorially by active skeletons and adjacent-hole choices. It does not require Gaussian suppression in that counting proof. Gaussian large-field control is a separate obligation when varying/summing physical large-field regions. Old broad header prose about full modified-metric summability must be read in light of this distinction and the programme's later fixed-H theorem. Dimock's analytical model is scalar phi4_3; its analytical constants do not prove the four-dimensional gauge estimate. Only selected proof steps were checked, not the complete RG proof.

Primary PDFs were reused in their existing private cache. No primary PDF/corpus was downloaded, redistributed or copied into the knowledge repository. Selected private reading extracts/renders are evidence, not public content for publication.

## Retired concern and next bounded step

The fixed-torus periodicity concern is inapplicable to the actual `wilsonRayCorrelator`: it chooses a pair with touch-distance at least 2t and returns zero if no such pair exists. No periodic unwrapped correlator was substituted. Do not reopen this as an alleged programme flaw.

This synthesis is kept in the existing Yang–Mills pack. No new graph node, source count, candidate, paper or review is warranted. Next select an actual source observable/insertion family and prove its two-active-support property and physical scale dictionary. Abandon a proposed source family if these cannot be derived; do not repeat kernel/binder/Hodge metadata audits or generate artificial R sequences as physical progress. The actual raw Rsc/rooted-H-sharp identity, activity/profile estimate, uniform physical constants and continuum conclusion remain open.

## Integration provenance

Integrated in execution1403 from the conserved execution1402 reading dossier. See [source reading and pin ledger](SOURCE-READING.json) and [two symbolic identity checks](ALGEBRA-CHECK1402.json). The later observed programme HEAD `7a69e8127a73a0be495af94c5cfcaafca25768a4` changes two nonlinear-observation documentation files only; the five cited implementation files are unchanged in that compare. The new nonlinear note is inventoried, not audited here. Existing source CI anchors retain their exact scope; no programme build or model review was repeated.
