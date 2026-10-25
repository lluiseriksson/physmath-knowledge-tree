# Union-closed sets: a rejected stability bridge

Observed 25 October 2026. This is a hypothesis-loss audit and a recorded abandoned route, not a new paper, a Frankl counterexample, or a solution of the union-closed sets conjecture.

## New statement inventory, not a proof

The current `google-deepmind/formal-conjectures` head was `49ba26bac3212084999860c575fcc70af42b3128`, committed 25 October 2026 at 11:42:28 UTC. Its new [OptimizationConstants/6a.lean](https://github.com/google-deepmind/formal-conjectures/blob/49ba26bac3212084999860c575fcc70af42b3128/FormalConjectures/OptimizationConstants/6a.lean), blob `cc2fa401f4ef6f3a648fdacbf6f91a8f5ac59714`, formalizes a union-closed-set optimization constant and states conjectural and attributed bounds. The selected file was read completely; its declarations contain `sorry`. No Lean proof was built here, and a `research solved` annotation is not a checked proof artifact.

OpenAI's manuscript map was refreshed at commit `1581d4cbdd69a0faf34b2089614fe2a814316a6a`, with CONTENTS blob `2c68c086fff36a5806c936ad1659cf1a8d0b6dd9`. A keyword scan returned the strongly Rayleigh process statement in family 231, concerning factors of IID. That selected text supplies no union-closed conclusion. This scan is not a review of 719 proofs, nor proof that no related result occurs anywhere in the collection.

## Classical mechanism and restricted consequence

The [author's survey by Wagner](https://www.math.uwaterloo.ca/~dgwagner/ceb_wagner.pdf), page 29, Theorem 9.10, attributes Boolean-interval-convexity of the support of a multiaffine nonnegative Rayleigh polynomial to his earlier [Mason paper](https://arxiv.org/abs/math/0602648). Real stability implies the Rayleigh condition. The selected theorem statement, definitions and attribution were read, not the full proof. Survey snapshot SHA256: `ab72551b3407480e08185ce2b0a9527c8cea385b95ef93dcf904ec90a46170c1`.

Here is the immediate deduction, with its additional hypothesis visible. Suppose a finite nonempty union-closed family F has a real-stable uniform generating polynomial. Its union U belongs to F. Interval-convexity gives every intermediate set between A and U whenever A belongs to F, so F is upward closed within U. For each active element i, sending a set A missing i to `A union {i}` injects the sets missing i into the sets containing i. Under the uniform law, each active marginal is at least one half.

This restricted conclusion follows from the classical support theorem. It is not offered as new mathematical novelty or a standalone discovery.

## Exact falsifier of the proposed general transfer

The union-closed family

`F = {empty, {1}, {1,2}}`

has unnormalized generating polynomial `p(x,y)=1+x+xy`. At `x=i` and `y=-1+i`, both variables have positive imaginary part, but p is zero. Thus a general union-closed family need not have a real-stable uniform polynomial. The Rayleigh difference `p_x p_y - p p_xy` is also exactly -1.

Its uniform marginals are `(2/3,1/3)`. This is not a counterexample to Frankl, which asks for at least one element in at least half the sets. It refutes only the unjustified stability premise and the stronger claim about every active element.

Replacing this law by a stable product law with the same marginals does not repair the argument. The product polynomial

`q=(1/3+2x/3)(2/3+y/3)`

has weights `(2,4,1,2)/9` on its full Boolean support. It preserves the means but loses uniformity. Consequently the uniform counting injection cannot be applied to its unequal weights. A target-preserving replacement theorem would have to preserve all the features used in the conclusion; none has been supplied.

## Bridge card and evidence layers

- **Target and source anchors:** `domain.probability_stochastics` and `domain.algebra`; the retrieved local graph context supplies no direct edge between them. Graph proximity proves no stability property.
- **Research move:** eliminate a missing hypothesis before pursuing a prominent conjecture.
- **Dictionary:** sets become monomials, a uniform family becomes equal nonzero coefficients, union closure becomes closure of supports under Boolean union, and element frequencies become polynomial marginals.
- **Preserved structure:** the original polynomial records all four features. Marginal-only productization preserves the frequencies but loses the equal coefficients needed for the argument.
- **Literature layer:** the attributed support theorem and stability-to-Rayleigh implication. The selected statement reading does not certify the full source proof.
- **Graph-supported inference:** only a route for checking compatibility between probabilistic and algebraic assumptions, not a theorem inferred from graph edges.
- **Speculative route:** transferring the author's stable-polynomial machinery to arbitrary union-closed uniform measures; rejected by the explicit falsifier.
- **Formal layer:** no new Lean declaration or kernel-checked theorem. Canonical graph confidence labels remain unchanged.
- **Abandonment decision:** do not pursue this direct route or write a paper from the classical restricted corollary. Reconsider only with a genuinely new bound for nonstable uniform measures or a replacement preserving the missing features.
- **Minimal verification target:** exact evaluation of p at the displayed upper-half-plane pair, and the rational coefficients and marginals of q; these are finite identities, not a route to the full conjecture.

No new source or candidate card is registered by this dated synthesis; the registry remains at 28 source cards and 10 candidate cards. No canonical node or edge is added. Private source snapshots remain outside this repository. Retrieval establishes no permission for model training, and no Research Capsule readiness or manuscript assessment is implied.
