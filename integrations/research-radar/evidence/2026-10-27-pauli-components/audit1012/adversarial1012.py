import numpy as np, scipy.linalg as la, json,pathlib,traceback
P=pathlib.Path(__file__).parent;rng=np.random.default_rng(1012001);rows=[];inc=[]
ps=[np.eye(2),np.array([[0,1],[1,0]]),np.array([[0,-1j],[1j,0]]),np.diag([1,-1])]
def ptr(x,r):return x.reshape(2,r,2,r).trace(axis1=0,axis2=2)
def E(x,r):return np.kron(np.eye(2)/2,ptr(x,r))
def basis(r):
 rb=[]
 for i in range(r):
  a=np.zeros((r,r),complex);a[i,i]=1;rb.append(a)
  for j in range(i):
   a=np.zeros((r,r),complex);a[i,j]=a[j,i]=1/np.sqrt(2);rb.append(a)
   a=np.zeros((r,r),complex);a[i,j]=1j/np.sqrt(2);a[j,i]=-1j/np.sqrt(2);rb.append(a)
 return np.array([np.kron(a/np.sqrt(2),b) for a in ps[1:] for b in rb])
def gram(sig,B):
 v,U=la.eigh(sig);z=U.conj().T@B@U
 return np.einsum('aij,bij,ij->ab',z.conj(),z,2/(v[:,None]+v[None,:])).real
def form(a,b,d,t):
 y=la.solve_sylvester(a,t*b,d)
 return np.vdot(d,y).real
def spectral(a,b,t):
 va,U=la.eigh(a);vb,V=la.eigh(b);over=abs(U.conj().T@V)**2
 return np.sum(over*(va[:,None]-vb[None,:])**2/(va[:,None]+t*vb[None,:]))
try:
 for r in [1,2,3,4]:
  n=2*r;B=basis(r);us=[np.kron(u,np.eye(r)) for u in ps]
  for j in range(24):
   w=rng.dirichlet(np.ones(4)*.55)
   if j%6==0:w[j%4]=0;w/=w.sum()
   if j==1:w=np.ones(4)/4
   h=1-16/np.sum(1/w) if min(w)>0 else 1.
   N=lambda x:sum(q*u@x@u.conj().T for q,u in zip(w,us))
   rank=1+j%n;z=rng.normal(size=(n,rank))+1j*rng.normal(size=(n,rank));sig=z@z.conj().T;sig/=np.trace(sig);xi=10**(-rng.uniform(1,5));sig=(1-xi)*sig+xi*np.eye(n)/n
   nb=np.array([N(b) for b in B]);os=N(sig);vals,V=la.eigh(gram(os,nb),gram(sig,B));best=float(vals[-1]);d=np.einsum('a,aij->ij',V[:,-1],B);v,U=la.eigh(sig);inv=U@np.diag(1/np.sqrt(v))@U.conj().T;d=d/(10*la.norm(inv@d@inv,2));rho=sig+d;orr=N(rho)
   kernels=[]
   for t in [0,.07,1,7,100]:
    fi=form(rho,sig,d,t);fo=form(orr,os,N(d),t);sp=spectral(rho,sig,t);err=abs(fi-sp)/max(fi,1e-30);q=fo/fi
    kernels.append({'t':t,'ratio':q,'spectral_relative_error':err})
    if q>h+1e-7:inc.append({'kind':'Petz_excess','r':r,'j':j,'t':t,'ratio':q,'upper':h})
    if err>1e-7:inc.append({'kind':'orientation_spectral_discrepancy','r':r,'j':j,'error':err})
   if best>h+1e-7:inc.append({'kind':'SLD_excess','r':r,'j':j,'ratio':best,'upper':h})
   # Profile test for independent isotropic map and actual recomputed marginal.
   l=[-1/3,-.2,0,.5,.9,1][j%6];dep=lambda x:l*x+(1-l)*E(x,r)
   marg=E(sig,r);ev,Q=la.eigh(marg);wh=Q@np.diag(1/np.sqrt(ev))@Q.conj().T;kap=float(la.eigvalsh(wh@sig@wh)[-1]);K=min(kap,3);bound=l*l*K/(1+l*(K-1));rat=float(la.eigvalsh(gram(dep(sig),l*B),gram(sig,B))[-1])
   if rat>bound+1e-7:inc.append({'kind':'profile_excess','r':r,'j':j,'ratio':rat,'upper':bound})
   rows.append({'r':r,'j':j,'weights':w.tolist(),'xi':xi,'upper':h,'SLD_max_all_tangents_at_base':best,'Petz_kernels':kernels,'profile':{'lambda':l,'kappa_actual':kap,'upper':bound,'local_max':rat},'partial_trace_tangent_norm':float(la.norm(ptr(d,r))),'min_rho_eig':float(la.eigvalsh(rho)[0])})
 # Conjugated channels: normalized Choi spectrum, unitary equivalence, trace scale.
 invariance=[]
 for j in range(8):
  w=rng.dirichlet(np.ones(4));A=la.qr(rng.normal(size=(2,2))+1j*rng.normal(size=(2,2)))[0];B0=la.qr(rng.normal(size=(2,2))+1j*rng.normal(size=(2,2)))[0];om=np.array([1,0,0,1])/np.sqrt(2);J=np.zeros((4,4),complex)
  for q,u in zip(w,ps):
   v=np.kron(np.eye(2),A@u@B0)@om;J+=q*np.outer(v,v.conj())
  h=1-16/sum(1/w);v=1-16/np.trace(la.inv(J)).real;wrong=1-16/np.trace(la.inv(2*J)).real
  invariance.append({'weights':w.tolist(),'choi_trace':float(np.trace(J).real),'h':h,'choi_formula':v,'error':abs(h-v),'wrong_unnormalized_formula':wrong})
 # A non-normalization shortcut must be visibly rejected by controls.
 out={'seed':1012001,'scope':'96 faithful bases; full zero-partial-trace tangent optimization at each base, 480 finite Petz tests; random search is not a global proof','rows':rows,'incidents':inc,'unitary_Choi_checks':invariance,'max_upper_excess':max(x['SLD_max_all_tangents_at_base']-x['upper'] for x in rows),'max_spectral_relative_error':max(y['spectral_relative_error'] for x in rows for y in x['Petz_kernels'])}
except Exception as ex:out={'rows':rows,'incidents':inc,'error':repr(ex),'traceback':traceback.format_exc()}
(P/'ADVERSARIAL1012.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in out.items() if k not in ['rows','unitary_Choi_checks']},indent=2))
