"""Bounded exact algebra; requires SymPy. This is not a theorem/novelty audit."""
import json
import sympy as s

K = [s.Matrix([[1, 0, 0], [0, s.Rational(3, 5), 0]]),
     s.Matrix([[0, s.Rational(4, 5), 0], [0, 0, 0]]),
     s.Matrix([[0, 0, 1], [0, 0, 0]])]
a0, a1 = s.eye(3)[:, 1], s.eye(3)[:, 0]
V0 = s.Matrix.hstack(*(k * a0 for k in K))
V1 = s.Matrix.hstack(*(k * a1 for k in K))
assert sum((k.H * k for k in K), s.zeros(3)) == s.eye(3)
G = s.Matrix(3, 3, lambda i, j: s.trace(K[i].H * K[j]))
assert G.det() == s.Rational(544, 625)
assert all(V1 * v == s.zeros(2, 1) for v in V0.nullspace())
assert any(V0 * v != s.zeros(2, 1) for v in V1.nullspace())
t0, t1, Z = V0 * V0.H, V1 * V1.H, V0 * V1.H
assert Z.H * t0.inv() * Z == t1
reverse_defect = s.simplify(t0 - Z * t1.pinv() * Z.H)
assert reverse_defect != s.zeros(2)
# Restrict the input to span(a0,a1), then remove the zero Kraus column.
J = a0.row_join(a1)
L = [k * J for k in K]
assert L[2] == s.zeros(2)
assert sum((k.H * k for k in L[:2]), s.zeros(2)) == s.eye(2)
W0 = s.Matrix.hstack(*(k * s.Matrix([1, 0]) for k in L[:2]))
assert W0.det() != 0
assert s.Matrix.hstack(*(k.reshape(4, 1) for k in L[:2])).rank() == 2
print(json.dumps({
    "status": "pass", "sympy_version": s.__version__,
    "exact_rational": True, "full_minimal_Kraus_rank": 3,
    "output_dimension": 2, "restricted_minimal_Kraus_rank": 2,
    "full_faithful_environment_hypothesis_impossible": True,
    "ordered_kernel_inclusion": True, "reverse_inclusion": False,
    "schur_identity": True, "restriction_has_faithful_environment_input": True,
    "scope": "one exact example; no universal asymptotic theorem, novelty or model grade"
}, indent=2))
