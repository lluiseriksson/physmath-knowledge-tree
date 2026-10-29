from fractions import Fraction as F
import json
from pathlib import Path
c,r,t=F(3,5),F(1,4),F(1,5)
A=c*c-r*r
z0=r*t/A
Q=c*c+t*t+(r*t)**2/A
assert (A,z0,Q)==(F(119,400),F(20,119),F(243,595))
upper=F(2,3)
# If N=Delta_lambda o M and M has a pure output, lambda^2=Q.
# Negative depolarizing lambda in [-1/3,0) cannot carry x radius3/5.
assert Q < upper**2
f_upper=(upper+r)**2-t*t-4*c*c
assert f_upper==F(-2303,3600)
assert (1+r)**2-t*t-4*c*c==F(33,400)
assert c*c-r*(r+t)==F(99,400)
out={"scope":"Exact necessary-condition rejection of depolarizing-postcomposition with pure-output M only; not global entropy proof/counterexample",
"qmax":str(Q),"vertex":str(z0),"lambda_upper_strict":str(upper),
"CP_polynomial":"lambda^2+lambda/2-567/400",
"CP_polynomial_upper_bound":str(f_upper),
"source_eq24_defect":str(c*c-r*(r+t)),
"global_Q_proved":False,"global_Q_refuted":False,"independent_review":False,
"method":"Fraction algebra plus analytic monotonicity and pure-output radius argument; no entropy sampling, no formal certification"}
Path(__file__).with_name("CONTROL1296.json").write_text(json.dumps(out,indent=2)+"\n",encoding="utf8",newline="\n")
print(json.dumps(out))
