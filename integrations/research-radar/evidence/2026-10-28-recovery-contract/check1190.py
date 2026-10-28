from pathlib import Path
import numpy as np,json
C=Path(__file__).parent
I=np.eye(2,dtype=complex); X=np.array([[0,1],[1,0]],complex);Y=np.array([[0,-1j],[1j,0]]);Z=np.diag([1.,-1.]).astype(complex)
T0=np.array([[1,0],[0,0]],complex);T1=np.ones((2,2),complex)/2
kappa=1/np.sqrt(2)
def block(a,b):return np.block([[a,np.zeros((2,2))],[np.zeros((2,2)),b]])
def ent(r,s):
    p,U=np.linalg.eigh(r);q,V=np.linalg.eigh(s)
    assert min(p)>0 and min(q)>0
    logs=(V*np.log(q))@V.conj().T
    return float(np.sum(p*np.log(p))-np.trace(r@logs).real)
def channel(a):return np.kron(a[:2,:2],T0)+np.kron(a[2:,2:],T1)
rows=[]
for j in range(1,13):
    A=(j%3+1)/80*X+(j%2+1)/90*Y+(j%4+1)/110*Z
    B=(j%2+1)/130*X-(j%3+1)/150*Y+(j%4+1)/170*Z
    r=block(I/4+A,I/4-A);s=block(I/4+B,I/4-B)
    assert np.allclose(r[:2,:2]+r[2:,2:],s[:2,:2]+s[2:,2:])
    assert abs(np.trace(r)-1)<1e-13 and abs(np.trace(s)-1)<1e-13
    lam=float(min(np.linalg.eigvalsh(s))); assert lam>0
    di=ent(r,s);do=ent(channel(r),channel(s));c=lam*(1-kappa)**2/4
    gap=(1-c)*di-do;assert di>0 and gap>1e-12
    delta=r-s;norm1=np.linalg.norm(delta,ord='nuc');outnorm=np.linalg.norm(channel(delta),ord='nuc')
    assert outnorm<=kappa*norm1+1e-13
    chi=float(np.trace(delta@delta@np.linalg.inv(s)).real)
    assert di<=chi+1e-12 and chi<=norm1**2/lam+1e-12
    rows.append({'case':j,'lambda_min_sigma':lam,'D_in':di,'D_out':do,'predicted_gap_fraction':c,'inequality_margin':gap,'trace_ratio':float(outnorm/norm1)})
r={'scope':'12 deterministic noncommuting binary CQ examples with equal reference marginal; NumPy floating point, not interval certified; no recovery map constructed, no universal theorem proved by samples','kappa':kappa,'cases':rows,'all_passed':True,'minimum_margin':min(x['inequality_margin'] for x in rows)}
(C/'CHECK1190.json').write_text(json.dumps(r,indent=2)+'\n',encoding='utf-8');print(json.dumps({'cases':len(rows),'all_passed':True,'minimum_margin':r['minimum_margin']}))
