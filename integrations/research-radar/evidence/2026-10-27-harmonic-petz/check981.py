"""Bounded noncommuting controls; not a universal proof or novelty certificate."""
from pathlib import Path
import numpy as np
import json, hashlib, shutil, datetime

rng=np.random.default_rng(981)
def state(n):
    g=rng.normal(size=(n,n))+1j*rng.normal(size=(n,n))
    a=g@g.conj().T;a/=np.trace(a)
    return .7*a+.3*np.eye(n)/n
def petz(a,b,f):
    x,u=np.linalg.eigh(a);y,v=np.linalg.eigh(b)
    return float(np.sum(y[None,:]*f(x[:,None]/y[None,:])*abs(u.conj().T@v)**2).real)
def resolvent(a,b,t):
    n=len(a);delta=(a-b).reshape(-1,order='F')
    q=np.kron(np.eye(n),a)+t*np.kron(b.T,np.eye(n))
    return float(np.vdot(delta,np.linalg.solve(q,delta)).real)
rows=[];maxerr=0.;mincomm=1.
for d in (2,3):
    shift=np.roll(np.eye(d),1,axis=0);phase=np.diag(np.exp(2j*np.pi*np.arange(d)/d))
    for r in (2,3):
        n=d*r
        us=[np.kron(np.linalg.matrix_power(shift,j)@np.linalg.matrix_power(phase,k),np.eye(r)) for j in range(d) for k in range(d)]
        for mode in ('uniform','lambda.2','lambda.5','lambda.8','nonuniform'):
            for rep in range(3):
                w=np.ones(d*d)/(d*d)
                if mode.startswith('lambda'):
                    lam=float(mode[6:]);w*=1-lam;w[0]+=lam
                elif mode=='nonuniform':
                    w=rng.random(d*d)+.1;w/=sum(w)
                h=1-(d*d)**2/sum(1/w)
                sigma=state(n);z=state(n)-state(n)
                marginal=np.trace(z.reshape(d,r,d,r),axis1=0,axis2=2)
                z-=np.kron(np.eye(d)/d,marginal)
                z/=np.linalg.norm(z,2)
                rho=sigma+.45*np.linalg.eigvalsh(sigma)[0]*z
                assert np.linalg.eigvalsh(rho)[0]>0
                comm=float(np.linalg.norm(rho@sigma-sigma@rho));assert comm>1e-7
                mincomm=min(mincomm,comm)
                channel=lambda a:sum(p*u@a@u.conj().T for p,u in zip(w,us))
                ar,bs=channel(rho),channel(sigma)
                eqres=float(np.linalg.norm(np.trace((rho-sigma).reshape(d,r,d,r),axis1=0,axis2=2)))
                assert eqres<1e-13
                fs=[('KL',lambda x:x*np.log(x)),('reverseKL',lambda x:-np.log(x)),('quadratic',lambda x:(x-1)**2),('hellinger',lambda x:(np.sqrt(x)-1)**2)]
                for t in (0.,.01,.2,1.,7.,100.):
                    f=lambda x,t=t:(x-1)**2/(x+t)
                    val=petz(rho,sigma,f);direct=resolvent(rho,sigma,t)
                    err=abs(val-direct);maxerr=max(maxerr,err)
                    assert err<1e-11*max(1,abs(direct))
                    fs.append((f'resolvent{t}',f))
                for name,f in fs:
                    vin=petz(rho,sigma,f);vout=petz(ar,bs,f)
                    assert vin>0 and vout<=h*vin+1e-11
                    rows.append(dict(d=d,r=r,mode=mode,rep=rep,generator=name,input=vin,output=vout,ratio=vout/vin,bound=float(h)))
result=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),seed=981,pairs=60,divergence_checks=len(rows),resolvent_identity_checks=360,max_identity_absolute_error=maxerr,minimum_commutator_norm=mincomm,failures=0,scope='Faithful equal-marginal pairs only; finite controls are not proof, priority audit or independent review.',rows=rows)
p=Path(__file__).parent
(p/'CHECK981.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k!='rows'}))
