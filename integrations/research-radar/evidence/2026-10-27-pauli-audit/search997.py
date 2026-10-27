"""Bounded future-direction search, outside frozen manuscript995."""
from pathlib import Path
import numpy as np,json
from scipy.linalg import eigh
from scipy.optimize import minimize
p=Path(__file__).parent;rng=np.random.default_rng(997);r=3;n=6
ps=[np.array([[0,1],[1,0]],complex),np.array([[0,-1j],[1j,0]]),np.diag([1.,-1.])];rb=[]
for i in range(r):
    z=np.zeros((r,r),complex);z[i,i]=1;rb.append(z)
    for j in range(i):
        z=np.zeros((r,r),complex);z[i,j]=z[j,i]=1;rb.append(z)
        z=np.zeros((r,r),complex);z[i,j]=1j;z[j,i]=-1j;rb.append(z)
basis=np.array([np.kron(x,y) for x in ps for y in rb]);us=[np.eye(n),*[np.kron(x,np.eye(r)) for x in ps]]
def gram(s,b):
    e,u=np.linalg.eigh(s);z=u.conj().T@b@u
    return np.einsum('aij,ij,bij->ab',z.conj(),2/(e[:,None]+e[None,:]),z).real
weights=[[.625,.125,.125,.125],[.4,.3,.2,.1],[.35,.15,.15,.35],[.7,.1,.15,.05],[.45,.25,.25,.05]]
rows=[]
for wi,w0 in enumerate(weights):
    w=np.array(w0);h=1-16/sum(1/w)
    nb=np.array([sum(q*u@b@u.conj().T for q,u in zip(w,us)) for b in basis])
    def calc(v,full=False):
        z=v[:12].reshape(n,2)+1j*v[12:].reshape(n,2);s=z@z.conj().T;s/=np.trace(s);s=(1-1e-5)*s+1e-5*np.eye(n)/n
        ns=sum(q*u@s@u.conj().T for q,u in zip(w,us))
        vals,vs=eigh(gram(ns,nb),gram(s,basis));value=float(vals[-1])
        if full:return value,s,np.einsum('a,aij->ij',vs[:,-1],basis)
        return value
    best=None
    for rep in range(4):
        v=rng.normal(size=24);initial=calc(v)
        sol=minimize(lambda x:-calc(x),v,method='L-BFGS-B',options={'maxiter':100,'maxfun':8000,'ftol':1e-10,'gtol':1e-6})
        q,s,d=calc(sol.x,True);item=dict(rep=rep,value=q,initial=initial,success=bool(sol.success),iterations=sol.nit,evaluations=sol.nfev,termination=str(sol.message))
        if best is None or q>best['value']:best=item;np.savez(p/f'best997-{wi}.npz',sigma=s,delta=d,weights=w)
        rows.append(dict(weights=w0,harmonic_upper=float(h),**item))
        (p/'RUNNING997.json').write_text(json.dumps(dict(completed=len(rows),rows=rows),indent=2)+'\n',encoding='utf-8')
result=dict(seed=997,scope='20fixed budgetrank2qubit-qutrit SLD optimizations across5Pauli channels, outside995. No sharpness or universal maximum is proved.',regularization=1e-5,rows=rows)
(p/'RESULT997.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps([dict(weights=w,best=max(z['value'] for z in rows if z['weights']==w),upper=next(z['harmonic_upper'] for z in rows if z['weights']==w)) for w in weights],indent=2))
