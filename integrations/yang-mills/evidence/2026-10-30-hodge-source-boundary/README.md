# Concrete flat Hodge comparison and the physical remainder boundary

This is a bounded source-to-binder audit for the existing Yang–Mills pack, not a paper or a new physical theorem. The programme advanced from a9937ee1dd5978bf372174500a2395cf259eb395 to [c454346d873385e3a03e38e0f85f4f1439a032c7](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/commit/c454346d873385e3a03e38e0f85f4f1439a032c7), merged30October2026 at13:00:53UTC. This repository update is new to this pack; it is not a newly published mathematical manuscript.

## What the new proof actually removes

The [new159-line Hodge source](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/c454346d873385e3a03e38e0f85f4f1439a032c7/YangMills/RG/ComponentwiseFlatHodge.lean) was read through its proof bodies, together with the [constructed gradient](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/c454346d873385e3a03e38e0f85f4f1439a032c7/YangMills/RG/ComponentwiseFlatGradient.lean) and the [source author's scope note](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/c454346d873385e3a03e38e0f85f4f1439a032c7/docs/COMPONENTWISE-GRADIENT-FRONTIER-20261030.md). In the finite periodic, trivial-background counting Hilbert space, G stacks the actual forward differences of every component. The identity

    <A,K0 A> = ||GA||^2

holds for every cochain. Its proof expands the unordered-pair curl and backward-divergence energies; periodic summation by parts and commuting shifts cancel all mixed terms. The result is not restricted to a Fourier witness or to divergence-free vectors. The source also proves, for the explicitly constructed V_w=G*WG,

    w(p)<=M for every p  ==>  <A,V_w A><=M<A,K0 A>.

Only the upper coefficient bound is required here. Nonnegativity of the repair requires the separate lower bound w>=0; it must not be inferred from the upper-comparison theorem. This removes an assumed gradient-to-Hodge comparison for this constructed flat repair family. It supplies neither an identification with the physical Wilson Hessian nor a bound for arbitrary repairs or interacting backgrounds.

The [source note](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/c454346d873385e3a03e38e0f85f4f1439a032c7/docs/COMPONENTWISE-GRADIENT-FRONTIER-20261030.md) separately derives an analytic subquadratic-envelope obstruction and a quadratic-strength escape. Those analytic claims are not upgraded by the checked quadratic-form endpoints. No new finite control, scan or independent proof of those asymptotic claims was run here.

## Source-to-binder audit of the actual remainder obligation

The selected source is [PhysicalGaugeCMP116RawM3.lean](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/c454346d873385e3a03e38e0f85f4f1439a032c7/YangMills/RG/PhysicalGaugeCMP116RawM3.lean), with exact binders and the final projection body inspected. The file itself explicitly labels its role as conditional endpoint plumbing. The following dictionary retains the physical variables instead of replacing them by a free scalar envelope.

| Object / source lines | Role and quantifiers | What remains to be supplied |
|---|---|---|
| Outer parameters, line27 | dPhys,N,Nc,d,L,lieDim fixed for a theorem application; N is the physical torus size and L belongs to the cube geometry | A family over volumes/backgrounds is an additional choice; scalar constants can depend on these fixed inputs |
| profile_bound, lines394–398; hprofile183–187 | One C,Hbar,c0,g,kappa0 per application, followed by forall t,k: 4 M_F amplitude(t,k) R_F <= C Hbar exp(-c0 t) g(k)^kappa0 | The physical activity estimate yielding that profile, with the intended dependencies |
| rooted_hsharp_remainder_identity, lines424–445; hR150–168 | forall t,k: Rsc(t,k) equals the rooted sum of real integrated Hsharp built from the same dictionary, source, support, positivity and measurability fields | Equality for the actual physical observable/remainder, not a fresh scalar Rsc defined to be that sum |
| nsc, line482 and record comment239–240 | Arbitrary time-dependent finite RG truncation schedule; the frontier has no nsc field | Uniformity over this schedule does not quantify over the physical torus size N |
| conclusion500–504 | At fixed data, exists gap>0, forall t: abs(covIR(t)+covUV_concrete(Rsc,nsc,t)) <= A_final exp(-gap t) | Identification of these scalar sequences with the desired physical correlations; uniform final amplitude and rate over a physical family |

Here M_F and R_F abbreviate exactly the source's appendixFSecondUrsellMomentConstant and appendixFHoleRootSumConstant, not new adjustable parameters. The displayed final amplitude is

    A_final = C1 + [(C Hbar)/(1-Q)] sum_k g(k)^kappa0,
    Q = (3^d)^2 exp(-kappa0) 2^(3^d+1) < 1.

The theorem provides a conditional scalar decay estimate. Its type has no Hamiltonian, transfer operator, continuum measure or spectral-gap conclusion. Calling the estimate a physical mass gap requires additional identifications and estimates.

The relevant uniform target has the order

    exists A_star<infinity, gap_star>0,
    forall physical-volume/cutoff/background data in the declared family,
    forall t, abs(physical_correlation(data,t)) <= A_star exp(-gap_star t).

Separate pointwise applications give forall data, exists A_data,gap_data; exchanging these quantifiers is invalid. A sufficient source theorem may use common positive lower rate bounds, bounded final amplitudes, and uniformly controlled summable scale profiles. Individual intermediate constants need not all be identical if their final combinations are uniformly controlled. No such theorem, physical remainder identity or physical profile estimate was proved by this audit. The exact existing fields remain open.

## Why the two routes cannot be conflated

The Hodge identity is for finite periodic differences and trivial background. Its constant1 is independent of the finite torus size, but any useful repair bound still needs control of the weight envelope M across the family. The raw-source M3 identity is a nonlinear physical activity/observable identification assembled from Gaussian, dictionary, support and integrated Hsharp fields. A quadratic-form identity alone provides none of those fields. Choosing Rsc definitionally equal to the rooted sum closes bookkeeping for a manufactured scalar sequence; it does not establish equality to a pre-existing physical observable. The actual new theorem removes one flat comparison premise, not hRpoly or the physical source obligations.

## Verification and provenance boundary

The [source reproduction record](https://github.com/lluiseriksson/THE-ERIKSSON-PROGRAMME/blob/c454346d873385e3a03e38e0f85f4f1439a032c7/reproducibility/component-gradient-20261030/global-hodge-reproduction.json) reports two fresh-clone focal runs at dfd49d0b0730a4d36f58a4cbb7a17d6a41fb60bc. Each reports12manifest entries,2sources,9exit-zero steps and4standard-axiom readouts. We retrieved the two Lean source files at both that source commit and current c454 HEAD and matched the declared SHA256 values. Thus the selected sources match; the raw run ZIPs, .olean bytes and raw oracle logs were not retrieved or independently replayed here. Matching self-reported hashes is not independent scientific review or repository-wide verification.

Lean is pinned to4.29.0-rc6 and mathlib to07642720480157414db592fa85b626dafb71355b. All9upstream manifest commit identities were checked against primary Git commit objects. This checks existence/identity, not checkout installation, transitive runtime trust or a new kernel build. The knowledge tree's own Lean4.31 build is a separate check and cannot validate this source.

YangMillsCore's direct imports contain RawM3 but not the new Hodge module. This merge adds new files and leaves the previous core importer graph unchanged; the old successful core/oracle anchor at a993 remains historical. Do not count the new Hodge result as a new core import or transfer the old8466job/oracle record to a changed whole source tree. Current-head core CI is tracked separately in OBSERVATION1400.json. The source-reported focal checks are the available verification claim for the new endpoints, within the limits above.

No manuscript PDF, model assessment, grade, alternate-model review, human peer review, editorial acceptance or new AIRR publication was produced. No score from another version transfers. This audit is own synthesis of primary source statements and proof bodies; it does not alter the programme or another chat.

## Evidence levels, falsifier and next task

Formal: source contains explicit Lean proof bodies; this turn supplies no independent kernel verification and makes no canonical confidence upgrade. Literature: pinned primary sources, declared focal records and inspected binders. Heuristic: the proposed application to an actual physical remainder still lacks its dictionary and uniform estimates. Speculative: hRpoly, physical interacting conclusions and continuum reconstruction remain open.

The import/verification claims are falsified by a mismatched source hash or pin, a changed importer graph, a failed corresponding raw build/oracle, or an unverified source target presented as independently checked. A proposed physical application fails if its remainder is not the rooted Hsharp expression for the same data, or if its final amplitude diverges/rate collapses over the intended family. The completed binder audit should not be repeated as another research result. Next substantive work needs an actual source estimate/identity for the declared physical family, not another adapter, norm identity or scalar-sequence relabeling. No separate minor paper is warranted.
