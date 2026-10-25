# ReMAD capacity gate: the convex roof cannot be skipped

25 October2026. Bounded research update, not a new discovery paper or a capacity theorem. Canonical graph confidence and Lean declarations are unchanged. Two canonical nodes and their recovery edge were retrieved before this sidecar; graph proximity is not evidence of channel additivity.

## Sources and scope

Chessa–Giovannetti, [2207.05646v2](https://arxiv.org/abs/2207.05646v2), Eq13, identifies the known ReMAD channel below at gamma10=gamma21=gamma, gamma20=0. This is not a new noise model. Kazachek's [2025 thesis](https://hdl.handle.net/10012/22124), printed pp77–79, supplies definitions and an analytical degradability discussion. These selected pages and the abstract were read; the entire thesis was not audited. Its quantum/coherent-information questions must not be substituted for unassisted classical Holevo additivity. No exhaustive2026 open-status search is claimed.

The symmetry/convex-roof method is established background; see Vollbrecht–Werner, [PhysRevA64,062307](https://doi.org/10.1103/PhysRevA.64.062307) (abstract checked here, not a new proof audit). The calculations below spell out the specialized elementary reduction rather than claim a new general method.

## Family and one-use reduction

For0<gamma<1, put a=1-gamma and

`K0=diag(1,sqrt(a),sqrt(a))`, `K1=sqrt(gamma)(|0><1|+|1><2|)`.

Let r=(r0,r1,r2) be a probability vector. For a pure input, the two Stinespring columns are `(c0,sqrt(a)c1,sqrt(a)c2)` and `sqrt(gamma)(c1,c2,0)`. Their Gram determinant is

`gamma*|c0*c2-sqrt(a)*c1^2|^2 + a*gamma*|c1*c2|^2 + a*gamma*|c2|^4`.

At fixed populations r, phases can minimize this determinant by aligning c0*c2 and c1². Therefore the minimum pure-output entropy is

`e_gamma(r)=h2((1+sqrt(1-4d_gamma(r)))/2)`,

`d_gamma(r)=gamma*((sqrt(r0*r2)-sqrt(a)*r1)^2+a*r1*r2+a*r2^2)`.

The population channel is `T_gamma*r=(r0+gamma*r1,a*r1+gamma*r2,a*r2)`. The channel is covariant under `diag(1,exp(it),exp(2it))`. Averaging three equally spaced phases dephases the average output and cannot lower its entropy. Replacing each pure signal by an aligned-phase orbit preserves its populations and can lower its conditional output entropy. Refining mixed signals to pure ones can only improve Holevo information by entropy concavity. Conversely, every mixture of those three-phase orbits is a valid ensemble. These steps give the exact **one-use variational reduction**

`chi1=max_R [H(T_gamma*R)-co(e_gamma)(R)]`,

where `co` is the lower convex envelope over the probability triangle. This is a reduction of the remaining optimization, not its solution, not a certified global numerical maximum and not removal of regularization over uses.

## Exact falsifier of an unroofed tensor shortcut

At gamma=1/2, use `(|00>+|22>)/sqrt2`. Its two-use output has nonzero eigenvalues `(5/8,1/8,1/8,1/8)`; both input marginal diagonals are `(1/2,0,1/2)`, for which e=h2(1/4). The proposed shortcut `S(output)>=sum_j e(diag rho_j)` is false:

`2h2(1/4)-H(5/8,1/8,1/8,1/8)>0`

is equivalent to `2^8*5^5>3^12`, namely `800000>531441`. The exact [matrix control](../checks/remad-roof-gate.py) checks these spectra and integer comparison. This does **not** refute a convex-roof inequality: the basis mixture already gives `co(e)(1/2,0,1/2)<=1/2`.

Another invalid shortcut would turn a nonnegative pure-output entropy bound directly into the same conditional bound with an arbitrary unchanged reference. For a maximally entangled qutrit/reference input, the conditional output entropy is `h2(1/3)-log2(3)<0`. The script checks the complementary output `(2/3,1/3)` for the uniform input. It also verifies a known half-noise degrading map on all nine matrix units: retain output levels0,1 and reset level2 to0. Neither check settles classical additivity.

## Exploratory numerics and limits

A local numerical search used the one-use reduction and Umegaki relative entropy against a candidate product reference. The initial gamma=1/2 run had57 starts; overlapping refinements are not counted as independent replications. An apparent positive excess of about7.98e-8 nats came from a product state and shrank to about7.33e-11 when the one-use approximation was refined. No nonadditivity witness resulted. Follow-ups at gamma=0.2,0.5,0.7,0.9 found negative numerical curvature in the tested purely entangling tangent blocks after stationarity refinement. Tiny full-tangent eigenvalues, finite-difference error, non-global optimization and an uncertified one-use upper bound remain limitations. These are local, floating-point observations, not global stability or tensor-power proofs. No ready Research Capsule or certified computational campaign is represented by this summary.

## Bridge and next gate

- Mechanism: coherent adjacent transitions create an interference term; scalar populations alone require convexification before use on mixed marginals.
- Preserved: known CPTP family, exact pure-output spectrum and phase covariance.
- Lost or unproved: a global one-use upper certificate and an entropy bound for all correlated tensor-power inputs.
- `literature`: attributed channel and symmetry tools. `heuristic`: numerical local-stability observations. `speculative`: removing regularization for this slice. `formal`: no new Lean result.
- Falsifier/abandonment: an existing theorem for the exact slice, or an explicit correlated-input violation of a proposed **roof-aware** inequality. The unroofed and naive conditional shortcuts are already rejected.
- Next mathematical work: either establish a valid operator/convex-roof inequality with all required quantifiers, or produce a checked counterexample. Do not present the preceding variational reformulation as that missing inequality, or publish these guardrails as a standalone major discovery.
