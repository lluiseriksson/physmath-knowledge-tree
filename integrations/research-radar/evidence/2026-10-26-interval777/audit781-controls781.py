import importlib.util
import json
import math
import pathlib
import sys
import time
from fractions import Fraction
import numpy as np
from scipy.special import roots_hermite
from flint import acb, arb, ctx

ROOT = pathlib.Path(__file__).parent
spec = importlib.util.spec_from_file_location('frozen_interval778', ROOT / 'input' / 'interval778.py')
engine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(engine)
ctx.prec = 160
start = time.monotonic()
out = {'scope': 'Bounded falsification controls. Sampling and Gauss-Hermite comparisons are nonrigorous cross-checks, not the proof of enclosure.',
       'exact_checks': {}, 'oracle_probes': [], 'cartesian_quadrature': []}

# An independent exact rational series for the chosen AWGN logarithm.
x = Fraction(9757, 50000)
t = x / (2 + x)
n = 16
lo = 2 * sum((t ** (2*j+1) / (2*j+1) for j in range(n)), Fraction(0))
rem = 2 * t ** (2*n+1) / ((2*n+1)*(1-t*t))
hi = lo + rem
out['rational_log_certificate'] = {
    'terms': n, 'transform_t': str(t), 'lower_rational': str(lo),
    'upper_rational': str(hi), 'remainder_upper_rational': str(rem),
    'strict_decimal_lower': '0.178263333', 'strict_decimal_upper': '0.178263334',
}
out['exact_checks']['AWGN_rational_log_bracket'] = Fraction('0.178263333') < lo < hi < Fraction('0.178263334')
coarse = Fraction('0.17825') + Fraction(1, 200)*Fraction('0.0078') - Fraction(1, 200)**2*Fraction('0.739')
out['coarse_rate'] = str(coarse)
out['exact_checks']['coarse_rate_is_178270525'] = coarse == Fraction('0.178270525')
out['exact_checks']['coarse_rate_above_AWGN_upper'] = coarse > hi

cases = [
    ('valid_broad', acb(arb(1, '0.1'), arb(0, '0.1')), True, True),
    ('valid_negative_real', acb(-1, '0.24'), True, True),
    ('valid_near_upper_strip', acb(2, '0.249'), True, True),
    ('valid_narrow_complex_box', acb(arb(3, '1e-22'), arb('0.12', '1e-22')), True, True),
    ('boundary_imag_quarter', acb(2, arb(1)/4), True, False),
    ('crosses_strip_boundary', acb(arb(2, '0.1'), arb('0.24', '0.02')), True, False),
    ('outside_strip_nonanalytic_flag', acb(2, '0.3'), False, False),
]
for name, z, analytic, expected_finite in cases:
    value = engine.H(z, analytic)
    finite = bool(value.is_finite())
    row = {'name': name, 'z': z.str(25), 'analytic_flag': analytic,
           'result': value.str(25), 'expected_finite': expected_finite, 'finite': finite}
    if finite:
        broad = engine.rough(z)
        row['rough_encloses_returned_ball'] = bool(broad.contains(value))
    out['oracle_probes'].append(row)
    out['exact_checks']['oracle_' + name] = finite == expected_finite

def cartesian_H(z, nodes):
    grid, weights = roots_hermite(nodes)
    noise = grid[:, None] + 1j * grid[None, :]
    w2 = weights[:, None] * weights[None, :] / math.pi
    x = math.sqrt(z)
    signal_y = x + noise
    reset_y = math.sqrt(2) * noise
    signal_L = math.log(2) + z - abs(signal_y - 2*x)**2/2
    reset_L = math.log(2) + z - abs(reset_y - 2*x)**2/2
    return float(np.sum(w2 * (np.logaddexp(0, -signal_L) + np.logaddexp(0, reset_L)))/2)

for z in [0, 1, 4, 20]:
    ball = engine.H(acb(z), False)
    vals = [{'nodes_per_coordinate': n, 'value': cartesian_H(z, n)} for n in [96, 192, 256]]
    midpoint = float(ball.real.mid())
    out['cartesian_quadrature'].append({'z': z, 'radial_Arb_H_T': ball.str(30),
        'H_infinite_minus_H_T_upper_for_z_le20': '6.1e-27', 'cartesian_values': vals,
        'last_minus_Arb_midpoint': vals[-1]['value']-midpoint,
        'last_two_difference': vals[-1]['value']-vals[-2]['value'],
        'last_float_lies_in_Arb_ball': bool(ball.real.contains(arb(vals[-1]['value']))),
        'status': 'nonrigorous falsification cross-check; agreement is not an interval proof'})

ln2 = arb(2).log()
tau = ln2/2 * (-arb(100)).exp() * (arb(4)/3*(arb(20)/3).exp()+2*arb(40).exp())
ztail = ln2*(-arb(20)).exp()
u = tau.upper()
positive_ball = arb(u/2, u/2)
out['exact_checks']['positive_error_contains_zero'] = bool(positive_ball.contains(0))
out['exact_checks']['positive_error_contains_upper_endpoint'] = bool(positive_ball.contains(u))
out['exact_checks']['tau_below_stated_bound'] = bool(tau < arb('6.1e-27'))
out['exact_checks']['ztail_below_stated_bound'] = bool(ztail < arb('1.43e-9'))
out['tail_balls'] = {'tau': tau.str(35), 'z_tail': ztail.str(35), 'positive_tau_ball': positive_ball.str(35)}
out['seconds'] = time.monotonic()-start
out['all_exact_checks_passed'] = all(out['exact_checks'].values())
(ROOT / 'CONTROLS781.json').write_text(json.dumps(out, indent=2)+'\n', encoding='utf-8')
print(json.dumps(out, indent=2), flush=True)
if not out['all_exact_checks_passed']:
    sys.exit(1)
