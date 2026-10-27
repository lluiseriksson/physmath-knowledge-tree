"""Analytical isotropic-line certificate; exact identities, no sampling."""
from pathlib import Path
import sympy as s
import json,hashlib,shutil
C=Path(__file__).resolve().parent;D=Path('D:/Proyectos/airr-investigacion')/C.name
F=s.Rational
ks=[s.diag(s.sqrt(F(29,40)),F(3,5)/s.sqrt(F(29,40))),s.diag(0,s.sqrt(F(33,1160))),
 s.Matrix([[0,s.sqrt(F(19,40))],[0,0]]),s.Matrix([[0,0],[s.sqrt(F(11,40)),0]])]
comp=lambda x:s.simplify(s.Matrix(4,4,lambda i,j:s.trace(ks[i]*x*ks[j].H)))
E=comp(s.eye(2)/2)
eigs=[(25+4*s.sqrt(37))/80,F(19,80),F(11,80),(25-4*s.sqrt(37))/80]
x=s.symbols('x')
assert s.simplify(E.charpoly(x).as_expr()-s.prod(x-e for e in eigs))==0
q=[F(5,8),F(19,80),F(11,80),0]
assert sum(q)==sum(eigs)==1
for k in [1,2,3]:assert s.simplify(sum(q[:k])-sum(eigs[:k]))>0
# H(q)>log(12/5), after multiplying by80 and exponentiating.
ratio=F(8,5)**50*F(80,19)**19*F(80,11)**11/F(12,5)**80
assert ratio>1
aexp=F(12,5);bexp=F(47,48)
rr=bexp/(1+(bexp/aexp)**2)
margin=s.simplify(F(6,5)-1/rr)
assert margin==F(14179,1624320)>0
assert (F(1,5)**2)/(2*(1-F(1,5)**2))==F(1,48)
v=s.symbols('v',real=True)
phi=s.Matrix([1,0,0,1])/s.sqrt(2)
rho=v*phi*phi.H+(1-v)*s.eye(4)/4
sig=s.diag(*[rho[j,j] for j in range(4)])
assert sig==s.diag((1+v)/4,(1-v)/4,(1-v)/4,(1+v)/4)
record={'passed':True,'sympy':s.__version__,'entropy_exchange_spectrum':[str(z) for z in eigs],
 'majorization_q':[str(z) for z in q],'H_q_greater_log12over5_exact_integer_comparison':True,
 'uniform_isotropic_gap_lower_bound_nats':str(margin),'mixing_parameter':'every v in[0,1]',
 'sampling':False,'universal_Q_proved':False,'model_review':False}

print(json.dumps(record,indent=2))
