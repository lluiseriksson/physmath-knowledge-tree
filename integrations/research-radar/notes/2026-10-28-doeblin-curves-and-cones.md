# Classical Doeblin curves and the operator-cone boundary

28 October 2026. Directed follow-up, not an exhaustive priority search.

**Literature.** Lee, Lu, Makur and Singh's *Doeblin Curves*, v1 dated
18June2026, was already inspected in1134/1136. The same42-page PDF hash
is used here. Reading advances to the finite partition proof of Proposition2,
selected lattice/Theorem1 arguments and examples/weighted definitions.
The full paper and external measure-lattice dependencies remain unaudited.

The source optimizes classical complementary overlap over constrained input
kernels. Its Gaussian average-extremal example has
F(t)=t[1-2Phi(-sqrt(p/t)/sigma)]. For fixed p,sigma>0 it is strictly below
t at each positive t, while F(t)/t tends to1 as t tends to zero. Thus a
pointwise constrained improvement need not give a uniform linear coefficient
below1. This is already a source mechanism, not a new discovery.

## Own cone audit: what the classical partition formula does not transfer

Let tau_i be finite-dimensional density matrices and gamma_i>=0. Define

a_plus = max Tr(H), subject to0<=H<=gamma_i tau_i for every i.

Compare it with the normalized quantum exclusion problem

Q_excl = min sum_i gamma_i Tr(M_i tau_i),
         subject to M_i>=0 and sum_i M_i=I.

The equality-constraint multiplier gives the dual

Q_excl = max Tr(H), subject to H=H*, H<=gamma_i tau_i.

The multiplier H is Hermitian, with no positivity constraint. This follows
by writing the Lagrangian as Tr(H)+sum_i Tr[M_i(gamma_i tau_i-H)].
Finite-dimensional strict feasibility M_i=I/n supplies strong duality.

In contrast, retaining H>=0 gives the covering dual

a_plus = inf sum_i gamma_i Tr(M_i tau_i),
         subject to M_i>=0 and sum_i M_i>=I.

The inequality direction follows by maximizing
sum_i gamma_i Tr(M_i tau_i)+Tr[H(I-sum_i M_i)] over H>=0.
The covering problem is strictly feasible by large positive multiples of I;
write an infimum without assuming a particular optimizer is attained.
Consequently Q_excl>=a_plus; equality is not automatic.

For commuting densities, pointwise minima give a positive common component.
For noncommuting densities there is no corresponding pointwise repair:
discarding the negative spectral part of a feasible Hermitian H need not
preserve all upper inequalities H<=gamma_i tau_i. The positive/Hermitian
separation is already documented in the [CQ support analysis](2026-10-28-cq-support.md).
Do not repackage one of those examples as another theorem or paper.

## Preserved and missing structure

Research move: move.dualize. The dictionary maps a classical measurable
partition to normalized positive measurement effects and a common lower
component to a matrix-cone optimization. Preserved are the weighted linear
objective and normalization. Lost is the scalar lattice order; changing the
cone changes the operational task. The covering family above need not be a
normalized physical measurement.

Thus the classical partition and curve formulas alone do not establish a
complete paired Umegaki coefficient with arbitrary quantum reference, nor
identify normalized exclusion risk with a positive common-replacer weight.
A transfer must retain its information quantity, reference marginal,
denominator, constraint set and cone. Reject a claimed unchanged transfer
that silently makes H positive or exchanges a constrained pointwise curve
for an unrestricted strict linear coefficient.

These are finite duality/quantifier checks, not a refutation of the classical
source. Confidence: sourced facts are literature; the cross-domain transfer
map is heuristic; any new extension is speculative. The finite duality check
is an unreviewed analytical audit. Formal result added: none. No model grade
or whole-paper proof certification follows.

## Deduplication and the unresolved priority obligation

The noncommuting prepared-output common-range criterion is already present
in the [published v3 Working paper](https://airr.science/papers/ARR-2026-564FZ70CSN83KACD/versions/v3/),
exact PDF SHA2566d4f64b0b9423852ad2831e551edf467a6fbca14d30991b517084978573455c5.
Reconstructing that idea here does not create a new candidate or justify a
second submission. Existing manuscript reviews and scores are unchanged.

Lee–Makur's Allerton2024 full text remains unread. Its current official DOI
led to an IEEE JavaScript verification page rather than paper content. The
2026 curve paper cannot stand in for that missing comparison or clear O1.
Different domains do not certify worldwide originality. No login, payment,
author message or access workaround was used.

Primary links:
- https://arxiv.org/abs/2606.19859v1
- https://doi.org/10.1109/Allerton63246.2024.10735307


The [reading/deduplication ledger](../evidence/2026-10-28-doeblin-cones/READING1202.json), [mechanical locator](../evidence/2026-10-28-doeblin-cones/LOCATE1202.json) and [fresh directed inventory](../evidence/2026-10-28-doeblin-cones/SOURCES1202.json) preserve their different coverage. Original own bytes are in the evidence ZIP; no foreign PDF or page text is included. The finite duality comparison is analytical, with no claimed new solver run, Lean result or independent audit.

## Update30October2026: finite families close a prerequisite concern

A generic nonseparable random-spike process warns that a measurable pathwise supremum need not obey chaining. It does not establish a counterexample to the source kernel-level claim. The source works with a product/cylinder coupling convention. [The exact own reconstruction](../evidence/2026-10-30-doeblin-finite-subsets/ARGUMENT1386.input.md) keeps each family finite until its overlap bound is extracted, then takes a supremum of deterministic bounds.

For a fixed kernel, finite Dudley plus recentered covers gives E max_F Z_u <= p+24 sigma I_U, uniformly in finite F. Retain the global common Bernoulli branch on each restriction, which need not itself be maximal. Finite overlap, conditional Jensen and rho(WK)=sup_F rho(W_FK) recover the source bound with32. Neither an all-index sample supremum nor a measurable all-coordinate coincidence event is used. This reconstructs a known bound; constants are not claimed sharp or new. [The class guard](../evidence/2026-10-30-doeblin-finite-subsets/CLASS-GUARD1386.md) requires uniform parameters, especially sigma, for an entire class.

The alternative primary prerequisite is [vanHandel APC550](https://web.math.princeton.edu/~rvan/APC550.pdf), edition21December2016, selected finite proof of Theorem5.24/Corollary5.25 (constant12). Exact Wainwright5.22 remains unread. Selected Proposition8/13 reading of the already indexed [2606.19859v1](https://arxiv.org/html/2606.19859v1) advances coverage, not publication date or whole-paper certification. A minor centered-supremum sign error in the source example does not spoil measurability and is not a separate research result.

[The full unscored component report](../evidence/2026-10-30-doeblin-finite-subsets/report.txt) supports the reconstruction under declared hypotheses. [Context](../evidence/2026-10-30-doeblin-finite-subsets/context.json) records requested Astra xhigh, separate agent context, coordinator locator messages, shared filesystem and unattested effective model/effort/independence. Uniform-class, same-coupling, geometry/integration and endpoint reservations remain. This is an AI component inspection, not independent human peer review or a manuscript grade. Original input/report hashes and adverse observations are in the [packet](../evidence/2026-10-30-doeblin-finite-subsets/README.md).

Mechanism/dictionary: global kernel overlap maps to finite jointly measurable density minima; metric entropy controls finite cost maxima while retaining branch and cost before Jensen. No claim about a chosen nonseparable all-index supremum survives. Falsify the reconstruction by a failure of its finite-overlap, coupling, geometry or cover hypotheses. Retire the attempted kernel-refutation route based on spikes alone; no new paper or repeated review is warranted. Quantum/optical transfer still needs actual information/reference/cost assumptions. Lee-Makur2024O1 is unchanged.

Evidence: literature for primary prerequisites; heuristic for own reconstruction with targeted AI check; speculative for new operational transfer; formal:none. Source/candidate counts, canonical graph confidence, manuscript scores and editorial status are unchanged.
