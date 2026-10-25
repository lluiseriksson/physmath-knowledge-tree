"""Exact finite controls for an elementary normalization obstruction, not a new theorem."""
from fractions import Fraction as F
import json,math
rows=[]
for d in [2,3,4,7,13,64,256,1024]:
    # Global depolarization at t=log2: lambda=1/2, stationary sigma=I/d.
    diagonal=[F(d+1,2*d)]+[F(1,2*d)]*(d-1)
    assert sum(diagonal)==1 and min(diagonal)>0
    purity=sum(x*x for x in diagonal)
    assert d*purity==F(d+3,4)
    # Generator L(X)=Tr(X)I/d-X has eigenvalue-1 on each traceless X.
    x=[F(1),F(-1)]+[F(0)]*(d-2)
    lx=[sum(x)/d-v for v in x]
    assert lx==[-v for v in x]
    ratio=math.log(float(d*purity))/math.log(d)
    rows.append(dict(d=d,exp_D2_out=str(d*purity),exp_D2_in=d,
                     displayed_log_ratio=ratio,decay_rate_upper_at_zero=2*(1-1/d)/math.log(d)))
print(json.dumps(dict(scope='Exact diagonal and generator checks; logarithmic decimals illustrative; asymptotic proof in note',rows=rows),indent=2))
