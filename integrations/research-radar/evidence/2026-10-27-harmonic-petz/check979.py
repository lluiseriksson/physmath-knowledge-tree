"""Finite consistency checks and exact scalar algebra for unreviewed979.
Samples do not establish the universal metric or relative-entropy theorem.
"""
from pathlib import Path
import json,numpy as np,sympy as sp,hashlib,shutil
rng=np.random.default_rng(979)
m,l=sp.symbols('m l',positive=True)
a=(1+(m-1)*l)/m;b=(1-l)/m
c=1-m*m/(1/a+(m-1)/b)
target=(m-1)*l*l/(1+(m-2)*l)
assert sp.simplify(c-target)==0
old=m*l*l/(1+(m-1)*l)
assert sp.simplify(old-target-l*l*(1-l)/((1+(m-1)*l)*(1+(m-2)*l)))==0
def g(sigma,Z):
 w,U=np.linalg.eigh(sigma);A=U.conj().T@Z@U;total=0.
 for i in range(len(w)):
  for j in range(len(w)):
   k=1/w[i] if abs(w[i]-w[j])<1e-12*max(w[i],w[j]) else (np.log(w[i])-np.log(w[j]))/(w[i]-w[j])
   total+=abs(A[i,j])**2*k
 return float(total)
def logM(sigma):
 w,U=np.linalg.eigh(sigma);assert min(w)>0
 return (U*np.log(w))@U.conj().T
def D(rho,sigma):return float(np.trace(rho@(logM(rho)-logM(sigma))).real)
rows=[]
for d in [2,3]:
 X=np.roll(np.eye(d),1,axis=0);Z=np.diag(np.exp(2j*np.pi*np.arange(d)/d))
 basis=[np.linalg.matrix_power(X,a)@np.linalg.matrix_power(Z,b) for a in range(d) for b in range(d)]
 for r in [2,3]:
  n=d*r;us=[np.kron(U,np.eye(r)) for U in basis]
  for mode in ['lambda.2','lambda.5','lambda.8','nonuniform']:
   for rep in range(3):
    if mode=='nonuniform':weights=rng.random(d*d)+.2;weights/=sum(weights)
    else:
     lam=float(mode.removeprefix('lambda'));weights=np.full(d*d,(1-lam)/(d*d));weights[0]+=lam
    h=1-(d*d)**2/sum(1/weights)
    G=rng.normal(size=(n,n))+1j*rng.normal(size=(n,n));sigma=G@G.conj().T;sigma/=np.trace(sigma);sigma=.8*sigma+.2*np.eye(n)/n
    Q=rng.normal(size=(n,n))+1j*rng.normal(size=(n,n));T=(Q+Q.conj().T)/2
    tr=np.trace(T.reshape(d,r,d,r),axis1=0,axis2=2);T-=np.kron(np.eye(d)/d,tr);T/=np.linalg.norm(T)
    apply=lambda W:sum(w*U@W@U.conj().T for w,U in zip(weights,us))
    output=apply(sigma);delta=apply(T)
    q=g(output,delta)/g(sigma,T)
    t=(d*d)/sum(1/weights)
    repDelta=sum((w-t)*U@T@U.conj().T for w,U in zip(weights,us))
    residual=float(np.linalg.norm(repDelta-delta))
    assert residual<1e-12 and q<=h+1e-10
    step=.1*np.linalg.eigvalsh(sigma)[0]/np.linalg.norm(T,2);rho=sigma+step*T
    din=D(rho,sigma);dout=D(apply(rho),output)
    assert din>0 and dout<=h*din+1e-12
    rows.append(dict(d=d,r=r,mode=mode,rep=rep,metric_ratio=q,bound=float(h),finite_pair_ratio=dout/din,input_divergence=din,representation_residual=residual))
result=dict(scope='48 finite metric/pair consistency cases plus2 exact scalar identities, not universal proof or literature novelty validation',seed=979,metric_cases=len(rows),finite_pair_cases=len(rows),exact_scalar_identities=2,failures=0,cases=rows,claim_status='unreviewed derivation; not part of published957 or its grade')
C=Path(__file__).parent;Ddir=Path(r'D:\Proyectos\airr-investigacion')/C.name;Ddir.mkdir(parents=True,exist_ok=True)
(C/'CHECK979.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
files=[]
for f in C.iterdir():
 if f.is_file():
  shutil.copyfile(f,Ddir/f.name);assert f.read_bytes()==(Ddir/f.name).read_bytes()
  files.append(dict(path=f.name,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest()))
for p in(C,Ddir):(p/'MANIFEST979.json').write_text(json.dumps(dict(files=files,scope='Own unreviewed proof and bounded finite checks, no claimed campaign certificate or manuscript score'),indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(metric_cases=len(rows),finite_pair_cases=len(rows),exact_scalar_identities=2,failures=0,qubit_lambda_half_upper='3/8, derived not yet audited',C_D_exact=True)))
