# Analytic Wick intake: a direct Wilson-symbol obstruction

Observed 2 November 2026. This is a source-intake disposition and own unreviewed analytical reasoning, not a paper, model assessment or formal-system proof.

## Source and reading boundary

Julien Malartre, [An Egorov-type Theorem for Analytic Wick Observables in Quantum Field Theory](https://arxiv.org/abs/2610.39806v1), arXiv:2610.39806v1, first submitted 29 October 2026 at 10:50:38 UTC. It is newly indexed here, not a new 2 November publication. The [primary HTML](https://arxiv.org/html/2610.39806v1) was read at Section 2.2, Eq. (2.9), hypothesis (H1) and Theorem 2.1; the proof was not audited. The returned HTML observed at 2026-11-02T00:05:23.975124+00:00 had SHA256 `50b30baac452255e89af4c2497f229283502fa4b9c9089a751f508f9f201a66e`. This pins HTML response bytes, not a PDF. No source body is redistributed. The source's journal-acceptance notice was not independently checked.

The theorem concerns time-dependent quadratic Hamiltonian propagation of analytic Wick observables subject to (H1). In the source normalization,

```text
F_V(z) = sum_j < (z + conjugate(z))^(tensor j) / sqrt(j!), V^(j) >,
(H1): sum_j exp(2 gamma lambda^j) ||V^(j)||^2 < infinity,
       for some gamma > 0 and lambda > 1.
```

## Dictionary and exact hypothesis test

Test only the direct one-mode embedding `x = z + conjugate(z)` of the normalized SU(2) Wilson trace on the link curve with three links equal to the identity and the fourth `exp(i c x T)`, where `T = diag(1,-1)` and real `c != 0`. Its mark is `cos(c x)`. This curve is a test of the exact observable; it is not a replacement probability law or a claim of a uniformly admitted physical chart.

Matching the source normalization fixes

```text
V^(2m) = (-1)^m c^(2m) / sqrt((2m)!),  V^(2m+1) = 0.
a_m = exp(2 gamma lambda^(2m)) |c|^(4m) / (2m)!,
log(a_(m+1)/a_m)
  = 2 gamma (lambda^2 - 1) lambda^(2m)
    + 4 log|c| - log[(2m+2)(2m+1)] -> +infinity.
```

Thus the even summands do not tend to zero for any nonzero `c`: the exact direct cosine symbol fails (H1). Restricting to an open real interval does not change its analytic coefficients. An arbitrarily small positive coupling cannot repair this infinite-order failure. Polynomial truncation changes the observable and needs a separately justified remainder bound.

The mechanism is an explicit coefficient comparison. Entire analyticity and factorial decay are preserved by this dictionary; the source's much stronger weighted summability is lost. Independently, quadratic unitary propagation does not identify a nonlinear selected Wilson renormalization map. A retained sharp cutoff also cannot simply be included in an analytic Wick symbol. This last observation does not exclude holomorphy in external parameters at fixed real integration coordinates.

## Disposition, limits and reopening condition

Reject direct use of this theorem to discharge the missing complex marked Wilson RG estimate. This rejects one proposed import, not the source theorem, Yang-Mills theory, every embedding or every weaker Wick theorem. No physical hypothesis has been eliminated. Localization, connected summation, normalization, backgrounds, sectors and history remain open.

A route could be reopened by an explicit alternative representation and a proved theorem covering the same exact observable, cutoff, measure, nonlinear map and norm domain. Entire analyticity, a title match or an uncontrolled polynomial approximation does not meet that condition. The source's suggestion that (H1) may be suboptimal is not such a theorem.

Evidence levels: **literature** for the selected source statement; **heuristic** for this own unreviewed analytical source-application test; **speculative** for an indirect bridge; no **formal** promotion. The divergent-ratio calculation is exact reasoning but has not been checked in a proof assistant. No review, manuscript/PDF score or independent assessment is claimed.

The small retrieved graph context contained `domain.quantum_field_theory`, `domain.gauge_theory`, `bridge.renormalization_scaling_pde` and the unsolved `problem.yang_mills_mass_gap`. No canonical node, edge or confidence was changed. The radar now has 121 source cards and 19 candidates; literature indexing does not admit the source into the active physical proof chain. Previously indexed parabolic Yang-Mills preprints arXiv:2610.38124 and arXiv:2610.38134 were deduplicated.

## Directed primary refresh

The accompanying 2 November refresh was directed, not exhaustive. The metadata ledger below records HTTP response hashes and statuses at inventory depth; those are not abstract reading, theorem reading, proof audit or a global build. It covers the configured frontier-lab perimeter as well as arXiv, AIRR, ai.viXra and selected public author repositories. This Wick card alone received the selected-statement reading described above. First-preprint dates are kept distinct from index dates, conference dates and product announcements.

See [refresh metadata](REFRESH.json) for response metadata and four observed repository heads. Nine locally cached formal dependency heads matched their existing pins; this is revision resolution only, not a dependency source/build audit. No corpus or benchmark tasks were downloaded.
