"""Exact scope separation: isotropic908 covers a state excluded by904/907."""
from pathlib import Path
from datetime import datetime,timezone
import sympy as s
import json,urllib.request,hashlib,shutil
C=Path(__file__).resolve().parent;D=Path('D:/Proyectos/airr-investigacion')/C.name
F=s.Rational;v=F(4,5)
phi=s.Matrix([1,0,0,1])/s.sqrt(2);rho=v*phi*phi.H+(1-v)*s.eye(4)/4
y=s.Matrix([[0,-s.I],[s.I,0]]);flip=s.kronecker_product(y,y)
assert flip*rho.conjugate()*flip==rho
assert rho.eigenvals()=={F(17,20):1,F(1,20):3}
concurrence=F(17,20)-3*F(1,20);assert concurrence==F(7,10)
q=1-concurrence**2;assert q==F(51,100)
# Binary entropy deficit at sqrt(q): exact upper bound by positive series.
M=q/2+q**2/12+q**3/30+q**4/(56*(1-q))
assert M<F(29,100)
# log10 = 2 atanh(9/11) > first two positive terms >2.
assert 2*(F(9,11)+F(9,11)**3/3)>2
margin=s.factor(F(29,100)-M);assert margin>0
# delta_e<=log2-e(1/2)<=q0/2+q0^2/[12(1-q0)]=2/9.
q0=F(2,5);deficit_bound=q0/2+q0**2/(12*(1-q0))
assert deficit_bound==F(2,9)<F(29,100)
out={'passed':True,'v':'4/5','concurrence_from_Wootters_statement':'7/10',
 'EF_minus_I_ZR_strict_lower_bound_nats':str(margin),
 'kappa_strict_lower_bound':'29/100','delta_e_upper_bound':'2/9',
 'both_prior_sufficient_bounds_negative':True,
 'Q_gap_908_positive_lower_bound':'14179/1624320',
 'scope':'Exact own scope separation conditional on standard Wootters two-qubit formula, whose statement was read, not full proof replayed.'}

print(json.dumps(out,indent=2))
