from fractions import Fraction as Q
from pathlib import Path
import json

# Exact guard against weakening full-carrier containment to axis-only containment.
# This is not a counterexample to the upstream theorem.
rho = delta = Q(1, 200)
A = Q(1)
ux, uy = Q(159999, 160001), Q(800, 160001)
assert ux * ux + uy * uy == 1
assert 0 < ux <= 1
assert 0 < uy / 2 < rho
assert rho <= 1 / (200 * A)
sharp_direction_rhs = 2 * (A * rho - delta)
assert sharp_direction_rhs == 0 < uy
# Both unit segments have midpoint0, parent direction(1,0,0).
# Every source-axis point t*u, |t|<=1/2, projects inside the parent segment
# and has transverse distance <=uy/2<rho. Thus its whole axis is contained.
# At source endpoint u/2 add delta*(0,1,0), a source-carrier point.
px, py = ux / 2, uy / 2 + delta
assert abs(px) <= Q(1, 2)
assert py > rho
out = {
    "scope": "Refutes only the axis-only weakening of the sharp direction bound; not the full-carrier source theorem or its final8A*rho containment conclusion",
    "exact": True,
    "delta": str(delta), "rho": str(rho), "A": str(A),
    "source_direction": [str(ux), str(uy), "0"],
    "parent_direction": ["1", "0", "0"],
    "both_segment_midpoints": ["0", "0", "0"],
    "axis_all_parameters_argument": "For every|t|<=1/2, |t*ux|<=1/2 and |t*uy|<=uy/2<rho; projection lies on parent unit segment",
    "axis_transverse_max": str(uy / 2),
    "source_direction_perpendicular_norm": str(uy),
    "sharp_direction_bound_rhs": str(sharp_direction_rhs),
    "outward_source_carrier_point": [str(px), str(py), "0"],
    "distance_outward_point_to_parent_segment": str(py),
    "full_carrier_containment": False,
    "new_source_counterexample": False,
    "formal_proof_or_novelty_claim": False,
}
Path(__file__).with_name("AXIS-BOUNDARY1268.json").write_text(
    json.dumps(out, indent=2) + "\n", encoding="utf-8", newline="\n")
print("Exact axis-only weakening rejected; original full-carrier theorem unaffected.")
