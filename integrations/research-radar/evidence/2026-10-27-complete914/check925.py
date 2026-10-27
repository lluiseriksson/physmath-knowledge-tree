"""Bounded diagnostic controls for PROOF925; samples are not a proof.
No network; stdout default, explicit --output only.
"""
import numpy as np
import json, argparse
from pathlib import Path
rng=np.random.default_rng(925)

def superop(fn,d):
    units=np.eye(d*d).reshape(d*d,d,d)
    return np.stack([fn(e).reshape(-1) for e in units],axis=1)
def choi(s,d):
    z=np.zeros((d*d,d*d),complex)
    for i in range(d):
        for j in range(d):
            z[i*d:(i+1)*d,j*d:(j+1)*d]=s[:,i*d+j].reshape(d,d)
    return z
def act(s,z,d,r):
    z=z.reshape(d,r,d,r);out=np.empty_like(z,dtype=complex)
    for i in range(r):
        for j in range(r):out[:,i,:,j]=(s@z[:,i,:,j].reshape(-1)).reshape(d,d)
    return out.reshape(d*r,d*r)
def basis(n):
    out=[]
    for i in range(n):
        q=np.zeros((n,n),complex);q[i,i]=1;out.append(q)
    for i in range(n):
        for j in range(i+1,n):
            q=np.zeros((n,n),complex);q[i,j]=q[j,i]=1/np.sqrt(2);out.append(q)
            q=np.zeros((n,n),complex);q[i,j]=1j/np.sqrt(2);q[j,i]=-1j/np.sqrt(2);out.append(q)
    return out
def gram(s,ys):
    w,u=np.linalg.eigh(s);assert min(w)>0
    ell=np.empty((len(w),len(w)))
    for i,a in enumerate(w):
        for j,b in enumerate(w):ell[i,j]=1/a if abs(a-b)<1e-12*max(a,b) else (np.log(a)-np.log(b))/(a-b)
    v=np.stack([(u.conj().T@y@u).reshape(-1) for y in ys],axis=1)
    return np.real(v.conj().T@(ell.reshape(-1,1)*v))
def mineig(g):return float(np.linalg.eigvalsh((g+g.T)/2)[0])
def depol(z):return np.trace(z)*np.eye(len(z))/len(z)
def ad(z):
    k=np.diag([1,np.sqrt(.4)]);j=np.array([[0,np.sqrt(.6)],[0,0]])
    return k@z@k+j@z@j.T
def dephase(z):return np.diag(np.diag(z))
cases=[('AD_N_fullChoiM',2,lambda z:.7*z+.3*depol(z),ad),
       ('shared_nontrivial_kernel',2,lambda z:.7*dephase(z)+.3*depol(z),dephase),
       ('qutrit',3,lambda z:.4*z+.6*depol(z),lambda z:.8*z+.2*np.diag([1,np.exp(.4j),np.exp(.9j)])@z@np.diag([1,np.exp(-.4j),np.exp(-.9j)]))]
rows=[]
for name,d,m,n in cases:
    M=superop(m,d);N=superop(n,d);L=M@np.linalg.pinv(N)
    err=float(np.linalg.norm(L@N-M));assert err<1e-12
    alpha=float(np.linalg.eigvalsh(choi(M,d))[0]);beta=float(np.linalg.eigvalsh(choi(N,d))[-1]);K=float(np.linalg.norm(L,2));lam=alpha/(beta*K*K)
    assert alpha>0 and beta>0 and lam>0
    for r in [2,3]:
        for sample in range(2):
            q=rng.normal(size=(d*r,d*r))+1j*rng.normal(size=(d*r,d*r));sig=q@q.conj().T+np.eye(d*r)*.03;sig/=np.trace(sig)
            marginal=np.trace(sig.reshape(d,r,d,r),axis1=0,axis2=2);V=np.kron(np.eye(d),marginal)
            ms=act(M,sig,d,r);ns=act(N,sig,d,r);bs=basis(d*r)
            my=[act(M,x,d,r) for x in bs];ny=[act(N,x,d,r) for x in bs]
            gm=gram(ms,my);gn=gram(ns,ny);gvm=gram(V,my);gvn=gram(V,ny)
            vals={'M_base':mineig(gvm/alpha-gm),'N_base':mineig(gn-gvn/beta),
                  'weighted_L':mineig(K*K*gvn-gvm),'combined':mineig(gn-lam*gm)}
            assert all(v>-1e-8 for v in vals.values()),(name,r,sample,vals)
            rows.append(dict(case=name,r=r,sample=sample,alpha=alpha,beta=beta,K=K,lam=lam,
                             identity_residual=err,whole_hermitian_dimension=(d*r)**2,minimum_eigenvalues=vals))
# Exact rational counterexample to dropping kernel inclusion.
import sympy as sp
H=sp.Matrix([[0,1],[1,0]]);rho=sp.eye(2)/2+H/10;sig=sp.eye(2)/2
assert sp.diag(*rho.diagonal())==sig and sp.Rational(7,10)*H!=sp.zeros(2)
out={'scope':'12 selected correlated bases; whole Hermitian tangent spaces, nontraceless included; not universal proof or interval certification',
     'results':rows,'mismatched_kernel_falsifier':'N dephasing; M=.7id+.3depolarizing; rho=I/2+sigma_x/10, sigma=I/2 gives D_N=0<D_M. Exact matrices checked.',
     'theorem_status':'proposed and not independently audited; no score; source coverage unresolved'}
a=argparse.ArgumentParser();a.add_argument('--output');args=a.parse_args();s=json.dumps(out,indent=2)+'\n'
if args.output:Path(args.output).write_text(s)
print(s)
