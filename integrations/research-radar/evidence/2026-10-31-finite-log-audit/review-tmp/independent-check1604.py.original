"""Exact finite audit checks; no imports from the supplied checker and no network."""
from fractions import Fraction as F
from itertools import combinations, product
from math import factorial
from pathlib import Path
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parent.parent
ZERO = (F(0), F(0))
ONE = (F(1), F(0))
PHASES = [ONE, (-F(1), F(0)), (F(0), F(1)), (F(0), -F(1))]

def add(x, y):
    return (x[0] + y[0], x[1] + y[1])

def sub(x, y):
    return (x[0] - y[0], x[1] - y[1])

def mul(x, y):
    return (x[0]*y[0] - x[1]*y[1], x[0]*y[1] + x[1]*y[0])

def norm2(x):
    return x[0]**2 + x[1]**2

def div(x, y):
    q = norm2(y)
    assert q > 0
    return mul(x, (y[0]/q, -y[1]/q))

def is_connected(n, edges):
    if n == 1:
        return True
    visited = {0}
    while True:
        old_size = len(visited)
        for i, j in edges:
            if i in visited or j in visited:
                visited.update((i, j))
        if len(visited) == old_size:
            return len(visited) == n

def formal_product(p, q, degree):
    result = {}
    for x, cx in p.items():
        for y, cy in q.items():
            z = tuple(a+b for a, b in zip(x, y))
            if sum(z) <= degree:
                result[z] = result.get(z, F(0)) + cx*cy
    return {x:c for x, c in result.items() if c}

def blowup_coefficient(x, graph_edges):
    types = [i for i, k in enumerate(x) for _ in range(k)]
    n = len(types)
    edges = [(i, j) for i, j in combinations(range(n), 2)
             if types[i] == types[j] or tuple(sorted((types[i], types[j]))) in graph_edges]
    connected_signed_sum = 0
    for bits in range(1 << len(edges)):
        chosen = [edge for k, edge in enumerate(edges) if bits >> k & 1]
        if is_connected(n, chosen):
            connected_signed_sum += (-1)**len(chosen)
    denominator = 1
    for k in x:
        denominator *= factorial(k)
    return F(connected_signed_sum, denominator)

n = 4
possible_edges = list(combinations(range(n), 2))
rho = [F(1, 32*2**i) for i in range(n)]
mu = [2*r for r in rho]  # a_i=log 2; log 2 >= 1/2 by its integral.
phase_vectors = list(dict.fromkeys(
    [tuple([p]*n) for p in PHASES] +
    [tuple(mul(PHASES[i], (F(s), F(0))) for i, s in enumerate(signs))
     for signs in product((-1, 1), repeat=n)]))
counts = {'simple_graphs': 0, 'phase_vectors_per_graph': len(phase_vectors),
          'complex_systems': 0, 'partition_values': 0, 'deletion_checks': 0,
          'coefficient_comparisons': 0, 'pinned_partial_sums': 0,
          'rational_dobrushin_checks': 0}
for graph_mask in range(1 << len(possible_edges)):
    edges = {edge for k, edge in enumerate(possible_edges) if graph_mask >> k & 1}
    neighbors = [(1 << i) | sum(1 << j for j in range(n)
                  if tuple(sorted((i, j))) in edges) for i in range(n)]
    independent = [s for s in range(1 << n)
                   if not any((s >> i & 1) and (s >> j & 1) for i, j in edges)]
    for i in range(n):
        assert sum(mu[j] for j in range(n) if neighbors[i] >> j & 1) <= F(1, 2)
        # A second sufficient radius, checked as a rational certificate.
        r_i = mu[i]/(1+mu[i])
        neighbor_product = F(1)
        for j in range(n):
            if j != i and neighbors[i] >> j & 1:
                neighbor_product /= 1+mu[j]
        assert rho[i] <= r_i*neighbor_product
        counts['rational_dobrushin_checks'] += 1
    for phases in phase_vectors:
        weights = [mul((rho[i], F(0)), phases[i]) for i in range(n)]
        monomials = {}
        for s in independent:
            term = ONE
            for i in range(n):
                if s >> i & 1:
                    term = mul(term, weights[i])
            monomials[s] = term
        # Direct independent-set sums, not the deletion recursion under test.
        values = {}
        for mask in range(1 << n):
            value = ZERO
            for s, term in monomials.items():
                if s & mask == s:
                    value = add(value, term)
            values[mask] = value
            assert norm2(value) > 0
            counts['partition_values'] += 1
        for mask, value in values.items():
            for i in range(n):
                if not mask >> i & 1:
                    continue
                rest = mask & ~(1 << i)
                assert value == add(values[rest], mul(weights[i], values[rest & ~neighbors[i]]))
                q = sub(div(value, values[rest]), ONE)
                assert norm2(q) <= (mu[i]/(1+mu[i]))**2
                counts['deletion_checks'] += 1
        counts['complex_systems'] += 1
    # Independent formal-log and connected-blowup-graph calculations, total degree <=4.
    p = {tuple(int(s >> i & 1) for i in range(n)): F(1) for s in independent if s}
    power = {(0,)*n: F(1)}
    log_coeff = {}
    for degree in range(1, 5):
        power = formal_product(power, p, 4)
        for x, coefficient in power.items():
            log_coeff[x] = log_coeff.get(x, F(0)) + F((-1)**(degree+1), degree)*coefficient
    pinned = [F(0)]*n
    for x in product(range(5), repeat=n):
        if not 1 <= sum(x) <= 4:
            continue
        coefficient = log_coeff.get(x, F(0))
        assert coefficient == blowup_coefficient(x, edges)
        assert (-1)**(sum(x)+1)*coefficient >= 0
        support = [i for i, k in enumerate(x) if k]
        if coefficient:
            local_edges = [(support.index(i), support.index(j)) for i, j in edges
                           if i in support and j in support]
            assert is_connected(len(support), local_edges)
        value = abs(coefficient)
        for i, k in enumerate(x):
            value *= rho[i]**k
        for i in support:
            pinned[i] += value
        counts['coefficient_comparisons'] += 1
    for i in range(n):
        assert pinned[i] <= mu[i]
        counts['pinned_partial_sums'] += 1
    counts['simple_graphs'] += 1

# Exact support dictionary: label equality is not the only source of incompatibility.
supports = [{0, 1}, {1, 2}, {3}, {2, 4}]
types = list(range(1, 1 << len(supports)))
label_sets = {s:{i for i in range(len(supports)) if s >> i & 1} for s in types}
raw = {s:set().union(*(supports[i] for i in label_sets[s])) for s in types}
closed_label_neighbors = [{j for j in range(len(supports)) if supports[i] & supports[j]}
                          for i in range(len(supports))]
delta = max(len(nb)-1 for nb in closed_label_neighbors)
type_mu = {s:F(1, 32)**len(label_sets[s]) for s in types}
root_sums = [sum(type_mu[s] for s in types if i in label_sets[s]) for i in range(len(supports))]
b_actual = max(root_sums)
for t in types:
    closed = set().union(*(closed_label_neighbors[i] for i in label_sets[t]))
    incompatible = {s for s in types if raw[s] & raw[t]}
    assert incompatible == {s for s in types if label_sets[s] & closed}
    assert t in incompatible
    cost = sum(type_mu[s] for s in incompatible)
    union_bound = sum(root_sums[i] for i in closed)
    assert cost <= union_bound <= len(closed)*b_actual <= (delta+1)*len(label_sets[t])*b_actual
    assert cost <= F(len(label_sets[t]), 2)
assert sum(type_mu.values()) <= len(supports)*b_actual
assert not (label_sets[1] & label_sets[2]) and raw[1] & raw[2]

# Zero-radius coordinates can be removed; they need not create a full-dimensional interior.
assert add(ONE, ZERO) == ONE
# Self omission really permits a zero.
assert add(ONE, (-F(1), F(0))) == ZERO

# A global branch example: a=log2, rho=1/8, mu=1/4; 32 independent types.
# atan x >= x-x^3/3 for 0<=x<=1; pi<22/7 and pi>3.
argument_lower = 32*(F(1, 8)-F(1, 8)**3/3)
argument_upper = F(32, 8)
assert argument_lower > F(22, 7)
assert argument_upper < 6

# Repetition costs already occur for one isolated type: log(1+w).
singleton_coefficients = {str(k):str(F((-1)**(k+1), k)) for k in range(1, 7)}
extensive = [{'types':m, 'Z':str(F(7, 8)**m), 'reciprocal':str(F(8, 7)**m)}
             for m in (1, 4, 16, 32)]
out = {
    'status': 'all_checks_passed', 'python_version': sys.version,
    'arithmetic': 'Exact integers and fractions; no floating point',
    'counts': counts, 'rho': [str(x) for x in rho], 'mu': [str(x) for x in mu],
    'self_including_budget_certificate': 'sum(mu_neighbors) <= 1/2 <= log(2)',
    'disk_certificate': '|q|^2 <= [mu/(1+mu)]^2, a bound implying the requested disk/log inequalities',
    'coefficient_degree_limit': 4,
    'support_dictionary': {'original_labels': len(supports), 'polymer_types': len(types),
                           'Delta': delta, 'actual_root_bound': str(b_actual),
                           'all_incompatibility_union_checks': True,
                           'disjoint_label_sets_can_have_overlapping_raw_supports': True},
    'global_branch_example': {'types':32, 'weight':'i/8', 'mu':'1/4',
                             'argument_lower':str(argument_lower), 'argument_upper':str(argument_upper),
                             'normalized_log_is_not_principal_log_of_Z':True},
    'self_term_omission_counterexample': {'one_weight':'-1', 'Z':'0'},
    'singleton_log_coefficients': singleton_coefficients,
    'extensive_negative_singletons': extensive,
    'eta_theta_misbudget_example': {
        'eta':'log(2)', 'theta':'log(8)', 'rho':'1/8',
        'inflated_radius':'1', 'mu_prime':'2', 'wrong_budget':'2 <= log(16)',
        'correct_budget_fails':'2 > log(2)',
        'scope':'Shows that the abstract criterion cannot spend theta as eta; not a counterexample to the stated two-budget condition or its separate b-convergence hypothesis',
    },
    'limits': ['Finite checks do not prove the universal induction or infinite cluster series',
               'No physical source hypothesis tested', 'No prior assessment inherited',
               'The supplied frozen checker was read, not executed'],
}
result_path = ROOT / 'review-tmp' / 'independent-check1604.json'
assert not result_path.exists()
result_path.write_text(json.dumps(out, indent=2)+'\n', encoding='utf-8')
print(json.dumps(out, indent=2))
