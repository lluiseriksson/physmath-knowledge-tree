# Fresh frontier metadata and a bounded learning-gap computation

Observed26October2026. The existing v3 is already public, with its actual
importance4.5/10 and technical8.5/10, full report/context and unchanged bytes:
[public v3](https://airr.science/papers/ARR-2026-2WNM69XY548JHVMC/versions/v3/#model-assessments).
This closes the publication-pending snapshot in the earlier assisted note.
No new manuscript, grade, formal result or independent reviewer is claimed here.

## A genuinely new source revision, with narrow reading scope

OpenAI/math advanced from1581d4cbdd69a0faf34b2089614fe2a814316a6a to
[7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a](https://github.com/openai/math/commit/7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a),
dated2026-10-26T21:18:03Z. The [catalogue delta](../evidence/2026-10-26-learning771/OPENAI-CATALOGUE-DELTA770.json)
contains two added PDF links, none removed,721 manuscripts/373 families.
The719/372 snapshot and three withdrawals stay intact. Its old CAT(0) URL
was truncated by the earlier generic Markdown parser; only the new snapshot
repairs this bibliographic link, with the correction explicitly recorded. Family079 gains
the wave paper; new family378 contains the exact-counting paper. Only the
first300 changed paths were observed in commit metadata; this is explicitly
not a complete formalization-file inventory.

The [primary pins and reading depth](../evidence/2026-10-26-learning771/PRIMARY-PINS770.json)
bind the59-page wave PDF and67-page ETH PDF. First3pages were read as text,
and firstpages visually inspected. The wave Theorem1.1 states a Euclidean
half-wave smoothing bound above its Sobolev threshold, with epsilon loss;
its listed consequences are author claims. The ETH Theorem1.1 states
deterministic exact counting for fixed-width CNF in polynomial space, with
subexponential time and a stronger fixed-density exponent. No full proof,
algorithm or upstream Lean build was checked. Do not mark these problems solved
on this evidence. A challenge file ending in sorry is a target placeholder:
its JSON points to a different solution module. The inspected Main imports
dependent execution/space modules, whose proofs were not audited here.

Bounded bridge card: original-instance size N maps to a CNF variable count n.
The reduction must preserve the intended decision/counting property and its
size dependence. A polynomial blow-up n=N^d, d>1, does not convert the stated
SAT bound into subexponential time in N; this boundary is expressly noted
in the source itself. Do not infer P=NP or universal subexponential NP algorithms.
The next finite task is a reduction-size audit, including auxiliary variables,
clause width, counting multiplicity and bit encoding. Falsify a transfer if
those parameters exceed its declared budget. This is an attributed scope
check, not a new complexity theorem.

The [13-endpoint refresh](../evidence/2026-10-26-learning771/SOURCES770.json)
also covers Anthropic, DeepMind, arXiv, AIRR, ai.viXra and selected public owner
repositories. All returned200; DeepMind remains atf153efa8fdc078131e214547781d631e2d257daf.
The existing Anthropic circuit paper is deduplicated against the24October
source card and branch-lab comparisons; it is not a fresh candidate. No foreign
paper bodies or rendered pages are redistributed. The separately retrieved
[small subgraph](../evidence/2026-10-26-learning771/SUBGRAPH772.json) is context only.

## A feasible perturbation structure, not a certified capacity gap

The [original computation](../evidence/2026-10-26-learning771/witness771.py)
and [all five quadrature resolutions](../evidence/2026-10-26-learning771/WITNESS771.json)
use k=r=1 and lambda=1/2. On squared-radius annuli[0,1/2],[1/2,2],[2,6],
let p_i and m_i be exact Gaussian mass and second moment. Taking h proportional
to p cross m preserves both moments symbolically; use that exact definition,
not rounded printed coefficients. The values are approximately(.746203,-.905070,1).
This gives an explicit bounded perturbation family rather than an unspecified
existence witness. The formula is an application of existing v3 inequality11,
not a new principle or a separate paper.

Hermite/Legendre/Laguerre orders32,64,96,144,192 give a0 about.007821103874,
||h||_2^2 about.737927837 and Gaussian information G1 about.178253990942 nats.
The optimized single-law improvement proxy is about2.07235e-5 nats. These are
floating-point quadrature observations, without interval remainder bounds.
They are not certified lower bounds, a learning-gap computation, or an energy
threshold. Repeated numerical agreement cannot replace a rigorous enclosure.

Candidate hypothesis reduction: choose epsilon=1/200 and the explicit AWGN
gain squared b^2=9757/50000 instead of defining b through an unknown capacity.
Its known AWGN capacity is log(1+b^2), about.178263333333 nats. Conditional
on certified enclosures for G1,a0 and||h||_2^2, the existing perturbation bound
could place that rate strictly between G1 and a feasible W1 rate. This would
remove the implicit capacity-matching parameter for this example. Such enclosures
have NOT been supplied; no unconditional explicit numerical separation follows.

The [exact rational scalar check](../evidence/2026-10-26-learning771/SCALAR-CERTIFICATE773.json)
and [its code](../evidence/2026-10-26-learning771/scalar-certificate773.py)
bound log(1+b^2) in[.178263333,.178263334] by the positive atanh series
and its rational remainder bound. This scalar enclosure is checked exactly;
it certifies no channel integral. Sufficient future integral targets are
G1 in[.17825,.17826], a0 in[.0078,.0079] and||h||_2^2 in[.737,.739].
If these unproved targets hold, the existing single-law bound gives a feasible
W1 rate at least.178270525, strictly above that AWGN capacity, while the
Gaussian W1 rate is strictly below it. The conditional arithmetic is exact;
its integral premises and any numerical common-input gap remain open.
This bounded computation is not a ready Research Capsule, novel theorem or paper.


Do not substitute this single-law improvement for Delta. In the original
capacity-matched pair, the Gaussian input gives common value at least G1,
so Delta=C1-V is at most C1-G1, not bounded below by it. A quantitative
common-input upper certificate is still needed. Falsifiers: reject positivity
if a certified a0 interval reaches zero; reject an explicit-gain claim if the
certified rate intervals overlap; reject a claimed Delta lower bound inferred
only from the single-law improvement. Stop if the result is just another
existential restatement of known minimax/training arguments.

Evidence levels: formal:none checked here; literature:version-pinned statements
and scoped antecedents; heuristic:uncertified numerical perturbation witness;
speculative:certified explicit resource separation and any larger impact.
Canonical graph, confidence labels and all published grades remain unchanged.
