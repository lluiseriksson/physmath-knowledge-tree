from pathlib import Path
import json,datetime
from fractions import Fraction as F
import sympy as S
X,Y,beta=S.symbols('X Y beta',positive=True)
tau2=(1-X**2)*(1-beta**2/X**2)
plus=S.factor(X**2*((1+beta)**2-tau2-(X+Y)**2)-(beta-X*Y)*(beta+X*Y+2*X**2))
minus=S.factor(X**2*((1-beta)**2-tau2-(X-Y)**2)-(beta-X*Y)*(beta+X*Y-2*X**2))
vertex=S.factor(X**2*((X**2-beta**2)**2-beta**2*tau2)-(X**2-beta**2)*(X**2-beta)*(X**2+beta))
assert plus==minus==vertex==0
a,b,c=F(3,5),F(1,4),F(1,5);s=b+c;up=b*(1+s)**2/(4*s);gap=a*a-up
assert up==F(841,2880) and gap==F(979,14400)>0
rec={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'symbolic_identities':{'plus_choi':str(plus),'minus_choi':str(minus),'interior_vertex':str(vertex)},'upper_bound':str(up),'positive_contradiction_gap':str(gap),'sympy':S.__version__,'scope':'Exact algebraic identities/constants for own analytic proof only. No parameter sampling, entropy/globalQ proof, external verifier execution, review or formal Lean result.'}
Path('C:/Trabajo/airr/2026-10-30_aligned-review1393/ALIGNED-CONTROL1393-review.json').write_bytes((json.dumps(rec,indent=2)+'\n').encode());print(json.dumps(rec))
