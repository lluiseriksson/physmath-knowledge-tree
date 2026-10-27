"""Fixed-budget adversarial search; no theorem and no grade selection."""
from pathlib import Path
import numpy as np,json,time
from scipy.linalg import eigh
from scipy.optimize import minimize

rng=np.random.default_rng(983);out=Path(__file__).parent
paulis=[np.array([[0,1],[1,0]],complex),np.array([[0,-1j],[1j,0]]),np.diag([1.,-1.])]
def rbasis(r):
    b=[]
    for i in range(r):
        e=np.zeros((r,r),complex);e[i,i]=1;b.append(e)
        for j in range(i):
            e=np.zeros((r,r),complex);e[i,j]=e[j,i]=1;b.append(e/np.sqrt(2))
            e=np.zeros((r,r),complex);e[i,j]=1j;e[j,i]=-1j;b.append(e/np.sqrt(2))
    return np.array(b)
def gram(a,b,kind):
    w,u=np.linalg.eigh(a);bb=u.conj().T@b@u
    if kind=='BKM':
        diff=w[:,None]-w[None,:];logs=np.log(w)
        k=np.divide(logs[:,None]-logs[None,:],diff,out=2/(w[:,None]+w[None,:]),where=abs(diff)>1e-12)
    elif kind=='PetzQuadratic':k=np.broadcast_to(1/w[None,:],(len(w),len(w)))
    else:raise ValueError(kind)
    return np.einsum('aij,ij,bij->ab',bb.conj(),k,bb).real
records=[];best={};start=time.time()
for r,starts in [(2,12),(3,4)]:
    n=2*r;b=np.array([np.kron(x,y) for x in paulis for y in rbasis(r)])
    for kind in ['BKM','PetzQuadratic']:
        for rep in range(starts):
            eps=1e-5;rank=2 if rep%2==0 else n
            def make(v):
                z=v[:n*rank].reshape(n,rank)+1j*v[n*rank:].reshape(n,rank)
                a=z@z.conj().T;a/=np.trace(a)
                return (1-eps)*a+eps*np.eye(n)/n
            def calc(v,vec=False):
                sigma=make(v);ref=np.trace(sigma.reshape(2,r,2,r),axis1=0,axis2=2)
                ns=.5*sigma+.25*np.kron(np.eye(2),ref)
                gi=gram(sigma,b,kind);go=.25*gram(ns,b,kind)
                if vec:
                    vals,vs=eigh(go,gi);return vals[-1],sigma,np.einsum('a,aij->ij',vs[:,-1],b)
                return float(eigh(go,gi,eigvals_only=True,subset_by_index=(len(b)-1,len(b)-1))[0])
            v=rng.normal(size=2*n*rank);initial=calc(v)
            res=minimize(lambda v:-calc(v),v,method='L-BFGS-B',options={'maxiter':160,'maxfun':12000,'ftol':1e-11,'gtol':1e-6})
            q,sigma,delta=calc(res.x,True)
            row=dict(r=r,kind=kind,rep=rep,rank=rank,regularization=eps,initial=initial,value=float(q),iterations=res.nit,evaluations=res.nfev,success=bool(res.success),termination=str(res.message),partial_trace_residual=float(np.linalg.norm(np.trace(delta.reshape(2,r,2,r),axis1=0,axis2=2))))
            records.append(row)
            if kind not in best or q>best[kind]['value']:
                best[kind]=row;np.savez(out/f'best983-{kind}.npz',sigma=sigma,delta=delta)
            (out/'RUNNING983.json').write_text(json.dumps(dict(completed=len(records),elapsed=time.time()-start,best=best,records=records),indent=2)+'\n',encoding='utf-8')
result=dict(seed=983,budget='32 fixed starts, max160iterations/max12000evaluations each; no restart based on score',elapsed=time.time()-start,best=best,records=records,scope='Local tangent optimization over bases with Tr_A delta=0, not actual-MI or finite-pair witness; approximate optimization cannot prove upper bounds.',potential_falsifiers=[x for x in records if x['value']>1/3+1e-7])
(out/'RESULT983.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k!='records'},indent=2))
