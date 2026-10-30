"""One predeclared fixed-population weighted-Jensen scope witness.
Exact rational premises plus outward Arb enclosures, not a global-Q witness.
"""
from pathlib import Path
import json,hashlib,sys
import sympy as s
import flint
from flint import arb,ctx
assert __debug__
ctx.prec=256
R=s.Rational
center=R(99,238);t=R(1,10);epsilon=R(1,10);delta=R(1,1000000);step=R(1,1000)
u=s.Matrix([1,epsilon]);v=s.Matrix([-epsilon,1]);n=(u.T*u)[0]
weight=delta/n
Sigma=weight*(u*u.T/n)+(1-weight)*(v*v.T/n)
direction=u*u.T-delta*s.eye(2)
base=s.diag(center,center+t)
plus=base+step*direction;minus=base-step*direction
def pd(M):return M[0,0]>0 and M.det()>0
assert pd(Sigma) and s.trace(Sigma)==1 and s.trace(Sigma*direction)==0
population=s.trace(Sigma*base)
assert s.trace(Sigma*plus)==population==s.trace(Sigma*minus)
for P in [base,plus,minus]:assert P==P.T and pd(P) and pd(s.eye(2)-P)
assert Sigma*base!=base*Sigma and plus*minus!=minus*plus
def aq(q):return arb(str(q))
def entropy_roof(p):
 q=aq(R(243,595))-aq(R(119,100))*(p-aq(center))**2
 assert q>0 and q<1
 a=(1+q.sqrt())/2;b=1-a
 return -a*a.log()-b*b.log()
def functional(P):
 a=aq(P[0,0]);b=aq(P[0,1]);d=aq(P[1,1]);mu=(a+d)/2
 radius=(((a-d)/2)**2+b*b).sqrt()
 lo=mu-radius;hi=mu+radius
 assert lo>0 and hi<1 and radius>0
 low=entropy_roof(lo);high=entropy_roof(hi)
 mean=(high+low)/2;slope=(high-low)/(2*radius)
 return [[mean+slope*(a-mu),slope*b],[slope*b,mean+slope*(d-mu)]]
E0=functional(base);Ep=functional(plus);Em=functional(minus)
J=[[(Ep[i][j]+Em[i][j])/2-E0[i][j] for j in range(2)] for i in range(2)]
gap=sum(aq(Sigma[j,i])*J[i][j] for i in range(2) for j in range(2))
lower=-R(1,10**10);upper=-R(1,10**12)
certified=bool(gap>aq(lower) and gap<aq(upper))
record={'status':'certified_proxy_counterexample' if certified else 'proxy_sign_not_certified','python':sys.version,'sympy':s.__version__,'python_flint':flint.__version__,'arb_precision_bits':ctx.prec,'assertions_enabled':__debug__,'parameter_selection':'One predeclared rational tuple, no search, optimization, precision loop or discarded run.','channel':'N(x,y,z)=(3x/5,3y/5,z/4+1/5)','profile':'e_N(p)=h((1+sqrt(243/595-(119/100)*(p-99/238)^2))/2), nats','parameters':{'center':str(center),'t':str(t),'epsilon':str(epsilon),'delta':str(delta),'step':str(step)},'reference_weight':[[str(x) for x in Sigma.row(i)] for i in range(2)],'reference_weight_eigenvalues':[str(weight),str(1-weight)],'direction':[[str(x) for x in direction.row(i)] for i in range(2)],'base':[[str(x) for x in base.row(i)] for i in range(2)],'plus':[[str(x) for x in plus.row(i)] for i in range(2)],'minus':[[str(x) for x in minus.row(i)] for i in range(2)],'all_inputs_positive_contractions':True,'same_faithful_reference_weight':True,'fixed_population':str(population),'trace_sigma_direction':'0','noncommuting_population_operators':True,'weighted_jensen_gap_enclosure':gap.str(60),'certified_rational_lower':str(lower),'certified_rational_upper':str(upper),'strict_rational_interval_verified':certified,'matrix_jensen_gap':[[x.str(45) for x in row] for row in J],'scope':'Counterexample only to weighted operator-Jensen convexity of the scalar roof at fixed mean population. It does not refute the stronger physical entropy-perspective estimate, global G, or channel additivity; the ordinary scalar spectral Jensen bound remains valid.','new_model_review':False,'new_grade':None,'new_paper':False,'formal_lean_claim':False,'trusted_runtime_boundary':'Exact SymPy rational premises and python-flint Arb outward ball arithmetic; neither interpreter nor native library formally verified.','script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
(Path(__file__).parent/'JENSEN-BALL1399.json').write_bytes((json.dumps(record,indent=2)+'\n').encode())
print(json.dumps({k:record[k] for k in ['status','fixed_population','reference_weight_eigenvalues','weighted_jensen_gap_enclosure','certified_rational_lower','certified_rational_upper']}))
if not certified:sys.exit(2)
