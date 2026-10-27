"""Independent high-precision evaluation of the saved double-precision witnesses."""
from pathlib import Path
import numpy as np,mpmath as mp,json
mp.mp.dps=70
p=Path(__file__).parent
def mat(a):return mp.matrix([[mp.mpc(float(z.real),float(z.imag)) for z in row] for row in a])
def tr(a):return sum(a[i,i] for i in range(a.rows))
def pt(a):return mp.matrix([[sum(a[k*2+i,k*2+j] for k in range(2)) for j in range(2)] for i in range(2)])
def kron_i(a):
    return mp.matrix([[a[i%2,j%2] if i//2==j//2 else 0 for j in range(4)] for i in range(4)])
def bkm(s,z):
    e,u=mp.eighe(s);x=u.H*z*u;v=mp.mpf(0)
    for i in range(len(e)):
        for j in range(len(e)):
            k=1/e[i] if i==j else (mp.log(e[i])-mp.log(e[j]))/(e[i]-e[j])
            v+=abs(x[i,j])**2*k
    return mp.re(v)
rows=[]
for kind in ('BKM','PetzQuadratic'):
    a=np.load(p/f'best983-{kind}.npz');s=mat(a['sigma']);z=mat(a['delta'])
    # Symmetrize only roundoff, then enforce trace/partial-trace constraints exactly.
    s=(s+s.H)/2;s/=tr(s);z=(z+z.H)/2;z-=kron_i(pt(z))/2
    ns=s/2+kron_i(pt(s))/4
    g=bkm if kind=='BKM' else lambda s,z:mp.re(tr(z*z*(s**-1)))
    ratio=g(ns,z)/(4*g(s,z))
    rows.append(dict(kind=kind,ratio=mp.nstr(ratio,65),gap_below_one_third=mp.nstr(mp.mpf(1)/3-ratio,65),base_min_eigenvalue=mp.nstr(mp.eighe(s,eigvals_only=True)[0],65),partial_trace_residual=mp.nstr(mp.norm(pt(z)),8),above_one_third=bool(ratio>mp.mpf(1)/3)))
result=json.loads((p/'RESULT983.json').read_text())
summary=dict(precision_decimal_digits=70,scope='Independent saved-direction evaluation only; no optimization or universal bound certified.',rows=rows,all32_starts_completed=len(result['records'])==32,optimizer_success_count=sum(r['success'] for r in result['records']),optimizer_non_success=[r for r in result['records'] if not r['success']])
(p/'VERIFY983.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8')
print(json.dumps(summary,indent=2))
