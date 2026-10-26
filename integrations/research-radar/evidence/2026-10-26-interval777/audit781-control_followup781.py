import hashlib
import json
import math
import pathlib
import time
import numpy as np
from scipy.special import roots_hermite

ROOT = pathlib.Path(__file__).parent
initial = ROOT / 'CONTROLS781.json'
initial_hash = hashlib.sha256(initial.read_bytes()).hexdigest()
def cartesian_H(z, nodes):
    grid, weights = roots_hermite(nodes)
    noise = grid[:, None] + 1j * grid[None, :]
    w2 = weights[:, None] * weights[None, :] / math.pi
    x = math.sqrt(z)
    signal_L = math.log(2) + z - abs(x + noise - 2*x)**2/2
    reset_L = math.log(2) + z - abs(math.sqrt(2)*noise - 2*x)**2/2
    return float(np.sum(w2 * (np.logaddexp(0, -signal_L) + np.logaddexp(0, reset_L)))/2)
rows = []
for n in [384, 512, 768, 1024]:
    start = time.monotonic()
    value = cartesian_H(20, n)
    rows.append({'nodes_per_coordinate': n, 'value': value, 'seconds': time.monotonic()-start})
record = {'reason': 'Initial nonrigorous Cartesian 256-node estimate at z=20 lay outside the narrow Arb ball, with a 2.58e-9 change from 192 nodes. Refine this falsification check rather than suppress it.',
          'status': 'Nonrigorous Gauss-Hermite convergence check only; cannot certify an integral enclosure.',
          'z': 20, 'rows': rows, 'initial_controls_sha256': initial_hash}
assert hashlib.sha256(initial.read_bytes()).hexdigest() == initial_hash
(ROOT / 'CONTROL_FOLLOWUP781.json').write_text(json.dumps(record, indent=2)+'\n', encoding='utf-8')
print(json.dumps(record, indent=2))
