"""Exploratory float falsifier for a non-GAD rectangular entropy extension."""
import numpy as np,json,hashlib,time
from pathlib import Path
from datetime import datetime,timezone
rng=np.random.default_rng(892);start=time.perf_counter()
c,r,t=.6,.25,.2
J=np.array([[(1+r+t)/2,0,0,c],[0,(1-r-t)/2,0,0],[0,0,(1-r+t)/2,0],[c,0,0,(1+r-t)/2]],complex)
lam,U=np.linalg.eigh(J);NK=[np.sqrt(lam[j])*U[:,j].reshape(2,2,order='F') for j in range(4)]
assert min(lam)>0
assert np.linalg.norm(sum(K.conj().T@K for K in NK)-np.eye(2))<1e-12
def S(a):
    a=(a+a.conj().T)/2;w=np.linalg.eigvalsh(a)
    assert min(w)>-1e-11
    w=w[w>1e-15];return float(-sum(w*np.log(w)))
def channel(ks,x):return sum(np.outer(K@x,(K@x).conj()) for K in ks)
def encode(x):return [[float(z.real),float(z.imag)] for z in x.ravel()]
best=None;cases=0;maxerr=0
for dout,env in [(2,2),(2,3),(2,4),(3,2),(3,3),(4,3)]:
    for trial in range(80):
        raw=rng.normal(size=(dout*env,2))+1j*rng.normal(size=(dout*env,2));V,_=np.linalg.qr(raw)
        MK=[V[j*dout:(j+1)*dout] for j in range(env)]
        err=float(np.linalg.norm(sum(K.conj().T@K for K in MK)-np.eye(2)));maxerr=max(maxerr,err)
        x=rng.normal(size=2)+1j*rng.normal(size=2);x/=np.linalg.norm(x)
        y=rng.normal(size=2)+1j*rng.normal(size=2);y/=np.linalg.norm(y)
        p=float(rng.uniform(.02,.98));psi=np.concatenate([np.sqrt(1-p)*x,np.sqrt(p)*y])
        out=np.zeros((2*dout,2*dout),complex)
        for A in NK:
            for B in MK:
                v=np.kron(A,B)@psi;out+=np.outer(v,v.conj())
        z=1-2*p;q=c*c*(1-z*z)+(r*z+t)**2;w=(1+np.sqrt(q))/2
        roof=-w*np.log(w)-(1-w)*np.log(1-w)
        gap=S(out)-roof-(1-p)*S(channel(MK,x))-p*S(channel(MK,y))
        cases+=1
        if best is None or gap<best['gap_nats']:
            best={'gap_nats':float(gap),'p':p,'partner_output_dim':dout,'partner_env_dim':env,'trial':trial,'x':encode(x),'y':encode(y),'partner_isometry_shape':list(V.shape),'partner_isometry':encode(V)}
out={'utc':datetime.now(timezone.utc).isoformat(),'seed':892,'instances':cases,'minimum':best,'TP_residual_max':maxerr,'seconds':time.perf_counter()-start,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'candidate':'For N=(c,r,t)=(3/5,1/4,1/5), test S((N tensor M)(psi)) >= axial_roof_N(p)+(1-p)S(M(x))+p S(M(y)) for arbitrary partner M.','scope':'480 seeded finite floating probes with qubit partner input, output dimensions2..4 and environment2..4; not interval/exact certificate, universal theorem, full random campaign or Research Capsule.','not_implied':['arbitrary-partner additivity','tensor-power capacity formula','novelty or manuscript score'],'new_paper':False,'new_grade':False}
C=Path(__file__).parent;D=Path('D:/Proyectos/airr-investigacion/2026-10-27_leakage889')
for q in [C/'PROBE892.json',D/'PROBE892.json']:q.write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'instances':cases,'minimum_gap_nats':best['gap_nats'],'TP_residual_max':maxerr,'universal_claim_proved':False},indent=2))
