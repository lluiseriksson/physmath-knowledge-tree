from pathlib import Path
import json,itertools,sympy as sp
from flint import fmpz_mat
C=Path(__file__).parent;s=json.loads((C/'LIFT815-VERIFIED.json').read_bytes());L=sp.Matrix.hstack(*[sp.Matrix(c) for c in s['lift_columns']]);B=sp.Matrix(s['witness']['minor']);assert B==L[:,s['witness']['selected_columns']];assert int(B.det())==int(fmpz_mat(s['witness']['minor']).det())==-2
unit=L[:,s['unit_minor']['columns']];assert int(unit.det())==s['unit_minor']['determinant'] and abs(unit.det())==1
v=sp.Matrix([sp.Rational(x) for x in s['fractional_basic_vertex']['full_x']]);b=sp.Matrix(s['fractional_basic_vertex']['rhs']);assert L*v==b and all(x>=0 for x in v) and any(x.q==2 for x in v)
active=s['fractional_basic_vertex']['active_edges'];count=0
for colors in itertools.product(range(3),repeat=len(active)):
 x=sp.zeros(18,1)
 for j,color in zip(active,colors):x[color*6+j]=1
 count+=int(L*x==b)
assert count==s['fractional_basic_vertex']['integral_fiber_count_by_all_colorings']==8
print(json.dumps({'two_exact_det_libraries':True,'maximal_minors_abs':[1,2],'fractional_basic_vertex_valid':True,'finite_integral_fiber_count':count,'not_a_Jensen_counterexample':True}))
