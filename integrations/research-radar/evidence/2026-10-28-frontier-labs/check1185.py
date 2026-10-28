"""Exact finite controls for the known variance-to-entropy obstruction."""
from fractions import Fraction as F
import json

rows = []
for k in (4, 8, 16):
    p = F(1, 2**k)
    # Refresh transition matrix: both rows equal the stationary law.
    P = ((p, 1-p), (p, 1-p))
    assert P[0][0] + P[1][1] == 1
    assert P[0][0] * P[1][1] - P[0][1] * P[1][0] == 0
    # Spectrum {1,0}: the centered gap is exactly one.
    mean_f_squared = p  # (E indicator/sqrt(p))^2
    variance = 1 - mean_f_squared
    assert p * (1/p) == 1 and 0 < variance < 1
    # Ent(f^2)=log(1/p)=k log2; log2>=1/2 by its integral.
    assert F(k, 2) / variance > F(k, 2)
    rows.append({"k": k, "p": str(p), "spectral_gap": "1",
                 "variance": str(variance), "entropy": f"{k}*log(2)",
                 "entropy_to_variance_lower_bound": str(F(k, 2)/variance)})
print(json.dumps({"status": "pass", "arithmetic": "exact rational",
                  "cases": rows, "scope": "known-type finite obstruction; not KLS refutation or new theorem"}, indent=2))
