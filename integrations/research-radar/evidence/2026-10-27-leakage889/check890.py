"""Exact partial-trace controls for an analytic absolute-modulus obstruction."""
from fractions import Fraction as F
from itertools import product
from pathlib import Path
from decimal import Decimal,localcontext
from datetime import datetime,timezone
import hashlib,json,shutil

assign=list(product((0,1),repeat=3))
def marginal(v,keep):
    basis=list(product((0,1),repeat=len(keep)));out=[[F(0) for _ in basis] for _ in basis]
    lost=[j for j in range(3) if j not in keep]
    for x,a in v.items():
        for y,b in v.items():
            if all(x[j]==y[j] for j in lost):
                ix=basis.index(tuple(x[j] for j in keep));iy=basis.index(tuple(y[j] for j in keep));out[ix][iy]+=a*b
    n=sum(a*a for a in v.values())
    return [[x/n for x in row] for row in out]
def h(x):
    if x==0 or x==1:return Decimal(0)
    return -(x*x.ln()+(1-x)*(1-x).ln())/Decimal(2).ln()
def e(c):return h((1+(1-c*c).sqrt())/2)
cases=[]
for t in [F(0)]+[F(1,2**k) for k in range(1,25)]:
    v={(0,0,0):F(1),(0,1,0):F(1),(1,0,1):F(1),(1,1,1):t};N=3+t*t
    ab=marginal(v,(0,1));b=marginal(v,(1,))
    expected=[[F(1)/N,F(1)/N,0,0],[F(1)/N,F(1)/N,0,0],[0,0,F(1)/N,t/N],[0,0,t/N,t*t/N]]
    assert ab==expected
    assert ab[0][0]*ab[1][1]-ab[0][1]*ab[1][0]==0
    assert ab[2][2]*ab[3][3]-ab[2][3]*ab[3][2]==0
    assert sum(ab[j][j] for j in range(4))==1
    assert b==[[F(2)/N,(1+t)/N],[(1+t)/N,(1+t*t)/N]]
    det=b[0][0]*b[1][1]-b[0][1]*b[1][0]
    assert det==(1-t)**2/N**2
    eps=ab[3][3];assert eps==t*t/N
    cases.append({'t':str(t),'leakage':str(eps),'det_B':str(det)})
with localcontext() as ctx:
    ctx.prec=70;c=Decimal(2)/3;s=(1-c*c).sqrt()
    slope=(Decimal(2)/3)*(c/(2*s))*(((1+s)/(1-s)).ln()/Decimal(2).ln())
    data=[]
    for k in (4,8,12,20,32):
        t=Decimal(2)**(-k);eps=t*t/(3+t*t);diff=e(c)-e(2*(1-t)/(3+t*t))
        data.append({'k':k,'difference_over_t':str(diff/t),'difference_over_sqrt_leakage':str(diff/eps.sqrt())})
out={'utc':datetime.now(timezone.utc).isoformat(),'passed':True,'exact_rational_instances':len(cases),'cases':cases,'analytic_coefficient':'(2/3) e_prime(2/3)>0; this analytic sign and nonzero derivative prove the order obstruction.','decimal_slope_diagnostic':str(slope),'decimal_controls_not_certified':data,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'scope':'Generic exact partial traces independently match separable AB blocks, B determinant and leakage identities. Decimal entropy values only illustrate the analytic derivative; no floating comparison proves a universal inequality.','not_a_counterexample_to':['strong superadditivity','the original support theorem','a one-sided sharper leakage lower bound'],'new_paper':False,'new_grade':False}
C=Path(__file__).parent;D=Path('D:/Proyectos/airr-investigacion/2026-10-27_leakage889')
for p in (C/'CHECK890.json',D/'CHECK890.json'):p.write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
shutil.copy2(__file__,D/Path(__file__).name)
print(json.dumps({k:out[k] for k in ('passed','exact_rational_instances','analytic_coefficient','decimal_slope_diagnostic','new_paper','new_grade')},indent=2))
