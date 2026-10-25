"""Small exact controls for the union-entropy research note; no external corpus.

Integer counts are exact. Log identities are floating-point diagnostics only.
Run with Python 3. No proof assistant or ready Research Capsule is claimed.
"""
import itertools
import json
import math

def frequencies(family, ground):
    return [sum(bool(x & (1 << i)) for x in family) for i in range(ground)]

def optimal_threshold(family, ground):
    freq = frequencies(family, ground)
    for threshold in sorted(set(freq)):
        mask = sum(1 << i for i, count in enumerate(freq) if count <= threshold)
        if len({x & mask for x in family}) == len(family):
            return threshold
    raise AssertionError('Distinct sets must be separated by all coordinates')

def irreducible_threshold(family):
    required = []
    for z in family:
        above = [u for u in family if u != z and z | u == u]
        covers = [u for u in above if not any(w != u and w | u == u for w in above)]
        if len(covers) == 1:
            down = sum(x | z == z for x in family)
            required.append(len(family) - down)
    return max(required)

checked = 0
max_residual = 0.0
for mask in range(1, 1 << 8):
    family = [x for x in range(8) if mask & (1 << x)]
    N = len(family)
    if N < 2 or any(x | y not in family for x in family for y in family):
        continue
    assert optimal_threshold(family, 3) == irreducible_threshold(family)
    chain = all(x | y in (x, y) for x in family for y in family)
    for order in [2, 3]:
        counts = {x: 0 for x in family}
        for args in itertools.product(family, repeat=order):
            union = 0
            for x in args:
                union |= x
            counts[union] += 1
        total = N ** order
        sorted_counts = sorted(counts.values())
        assert all(sum(sorted_counts[:i]) <= i ** order for i in range(1, N + 1))
        benchmark = [i ** order - (i - 1) ** order for i in range(1, N + 1)]
        assert (sorted_counts == benchmark) == chain
        q = [counts[x] / total for x in family]
        b = [count / total for count in benchmark]
        H = lambda probs: -sum(p * math.log(p) for p in probs)
        kl = sum(p * math.log(p / ref) for p, ref in zip(q, b))
        slack = sum(((i ** order - sum(counts[x] for x in family[:i])) / total)
                    * math.log(b[i] / b[i - 1]) for i in range(1, N))
        residual = abs(H(b) - H(q) - kl - slack)
        max_residual = max(max_residual, residual)
        assert residual < 2e-13
        assert slack <= math.log(order) + 2e-13
    checked += 1

for dimension, length in [(2, 3), (3, 5), (4, 16)]:
    M = 2 ** dimension
    N = M + length
    counts = [0] * N
    for x, y in itertools.product(range(N), repeat=2):
        union = max(x, y) if max(x, y) >= M else x | y
        counts[union] += 1
    expected = [3 ** x.bit_count() for x in range(M)] + [2 * (M + j) - 1 for j in range(1, length + 1)]
    assert counts == expected and sum(counts) == N * N

print(json.dumps({'three_coordinate_families_checked': checked,
                  'projection_and_irreducible_thresholds_equal': True,
                  'pair_and_triple_majorization_exact': True,
                  'chain_equality_characterization_exact': True,
                  'ordinal_sum_multiplicities_exact': True,
                  'entropy_identity_max_float_residual': max_residual,
                  'quadratic_frequency_bound_proved': False,
                  'formal_verification': False}, sort_keys=True))
