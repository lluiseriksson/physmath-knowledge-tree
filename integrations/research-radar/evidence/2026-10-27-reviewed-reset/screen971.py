"""Bounded attempt to falsify a proposed complete-pair upper bound.
No manuscript result and no claim of an exhaustive search or proof.
"""
from pathlib import Path
import json,numpy as np
from scipy.linalg import eigh
rng=np.random.default_rng(971)
X=np.array([[0,1],[1,0]],complex);Y=np.array([[0,-1j],[1j,0]]);Z=np.diag([1.,-1.])
def basisR(r):
 b=[]
 for i in range(r):
  m=np.zeros((r,r),complex);m[i,i]=1;b.append(m)
  for j in range(i):
   m=np.zeros((r,r),complex);m[i,j]=m[j,i]=1;b.append(m/np.sqrt(2))
   m=np.zeros((r,r),complex);m[i,j]=1j;m[j,i]=-1j;b.append(m/np.sqrt(2))
 return np.array(b)
def gram(sigma,basis):
 w,U=np.linalg.eigh(sigma);assert min(w)>0
 z=(w[:,None]-w[None,:]);logs=np.log(w)
 K=np.empty_like(z)
 for i in range(len(w)):
  for j in range(len(w)):
   K[i,j]=1/w[i] if abs(z[i,j])<1e-12*max(w[i],w[j]) else (logs[i]-logs[j])/z[i,j]
 B=np.array([U.conj().T@b@U for b in basis])
 return np.einsum('aij,ij,bij->ab',B.conj(),K,B).real
rows=[];best=None
for r in [2,3,4]:
 n=2*r;b=np.array([np.kron(a,c) for a in [X,Y,Z] for c in basisR(r)])
 for rank in [1,2,n]:
  for eps in [1e-5,.02,.2]:
   for rep in range(8):
    G=rng.normal(size=(n,rank))+1j*rng.normal(size=(n,rank));sigma=G@G.conj().T;sigma/=np.trace(sigma)
    sigma=(1-eps)*sigma+eps*np.eye(n)/n
    marginal=np.trace(sigma.reshape(2,r,2,r),axis1=0,axis2=2)
    output=.5*sigma+.25*np.kron(np.eye(2),marginal)
    gi=gram(sigma,b);go=gram(output,b)
    eig,vec=eigh(.25*go,gi)
    value=float(eig[-1]);direction=np.einsum('a,aij->ij',vec[:,-1],b)
    row=dict(r=r,rank=rank,epsilon=eps,rep=rep,local_complete_pair_ratio=value,
             input_min_eigenvalue=float(np.linalg.eigvalsh(sigma)[0]),
             reference_tangent_residual=float(np.linalg.norm(np.trace(direction.reshape(2,r,2,r),axis1=0,axis2=2))))
    rows.append(row)
    if best is None or value>best['local_complete_pair_ratio']:
     best=row;np.savez(Path(__file__).with_name('best971.npz'),sigma=sigma,direction=direction)
out=dict(seed=971,scope='216 finite BKM generalized-eigenvalue diagnostics with equal-reference tangents; not a universal upper bound or a MI witness',
 conjectural_upper=1/3,actual_known_order_upper=.4,largest=best,
 potential_falsifiers=sum(z['local_complete_pair_ratio']>1/3+1e-8 for z in rows),cases=rows,
 boundaries='arbitrary states, not restricted SEP; pair tangent coefficient differs from actual-product MI; no claim that a tangent result has been converted to finite relative entropy')
Path(__file__).with_name('SCREEN971.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in out.items() if k!='cases'},indent=2))
