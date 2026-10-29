import numpy as np
import math,json,platform,hashlib
from pathlib import Path
p=3/7
P=np.diag([1.,2.,2.])/3
R=np.array([[3.,-4.,0.],[4.,3.,0.],[0.,0.,5.]])/5
Q0=R@np.diag([2.,3.,6.])
S=np.array([[0.,1.,0.],[0.,0.,2.],[3.,0.,0.]])
def ent(a):
 w=np.linalg.eigvalsh((a+a.conj().T)/2)
 assert w.min()>-2e-12
 w=w[w>1e-14]
 return float(-np.dot(w,np.log(w)))
def h(x):return -x*math.log(x)-(1-x)*math.log1p(-x)
z=1-2*p
e=h((1+math.sqrt(2/5+z/10-119*z*z/400))/2)
ks=[np.diag([math.sqrt(29/40),.6/math.sqrt(29/40)]),
np.diag([0,math.sqrt(33/1160)]),
np.array([[0,math.sqrt(19/40)],[0,0]]),
np.array([[0,0],[math.sqrt(11/40),0]])]
assert np.linalg.norm(sum(k.conj().T@k for k in ks)-np.eye(2))<1e-14
rows=[]
def evaluate(t):
 Q=(Q0+1j*t*S)/math.sqrt(49+14*t*t)
 X,Y=P.T,Q.T
 aa,bb=X@X.conj().T,Y@Y.conj().T
 T=np.block([[(29/40)*(1-p)*aa+(19/40)*p*bb,.6*math.sqrt(p*(1-p))*X@Y.conj().T],
 [.6*math.sqrt(p*(1-p))*Y@X.conj().T,(11/40)*(1-p)*aa+(21/40)*p*bb]])
 W=np.vstack([math.sqrt(1-p)*P,math.sqrt(p)*Q])
 rho=W@W.conj().T
 A,B=rho[:3,:3],rho[3:,3:]
 sigma=np.zeros((6,6),complex);sigma[:3,:3]=A;sigma[3:,3:]=B
 tau=np.zeros((12,12),complex)
 for a in range(2):
  for b in range(2):
   unit=np.zeros((2,2));unit[a,b]=1
   E=np.array([[np.trace(ki@unit@kj.conj().T) for kj in ks] for ki in ks])
   tau+=np.kron(E,rho[3*a:3*(a+1),3*b:3*(b+1)])
 gap=ent(T)-(1-p)*ent(aa)-p*ent(bb)-e
 direct=ent(tau)-ent(sigma)-e+h(p)
 assert abs(direct-gap)<2e-12
 assert abs(np.trace(rho)-1)<1e-12
 assert np.linalg.matrix_rank(rho,tol=1e-10)==3
 pt=rho.reshape(2,3,2,3).transpose(2,1,0,3).reshape(6,6)
 row={'t':float(t),'G_nats_diagnostic':gap,'dictionary_discrepancy':abs(direct-gap),
 'reference_commutator_norm':float(np.linalg.norm(A@B-B@A)),
 'partial_transpose_min_eigenvalue_diagnostic':float(np.linalg.eigvalsh(pt).min()),
 'rank':3,'p':'3/7'}
 rows.append(row)
 return gap
# One bounded golden-section attempt; no unimodality/global-optimality assumption.
lo,hi=-2.,2.
evaluate(lo);evaluate(0.);evaluate(hi)
ratio=(math.sqrt(5)-1)/2
a=hi-ratio*(hi-lo);b=lo+ratio*(hi-lo);fa=evaluate(a);fb=evaluate(b)
for _ in range(32):
 if fa<fb:
  hi=b;b=a;fb=fa;a=hi-ratio*(hi-lo);fa=evaluate(a)
 else:
  lo=a;a=b;fa=fb;b=lo+ratio*(hi-lo);fb=evaluate(b)
best=min(rows,key=lambda x:x['G_nats_diagnostic'])
out={'scope':'One bounded one-parameter mixed saturated dimR3 diagnostic, not global optimization, proof, certified entropy intervals or a reproducibility campaign',
'versions':{'python':platform.python_version(),'numpy':np.__version__},
'family':{'P':'diag(1,2,2)/3','Q':'(R diag(2,3,6)+i t S)/sqrt(49+14t^2)',
'R':'[[3,-4,0],[4,3,0],[0,0,5]]/5','S':'[[0,1,0],[0,0,2],[3,0,0]]','t_domain':[-2,2],
'population':'3/7','state':'rho=W W*, W=vertical(sqrt(1-p)P,sqrt(p)Q)','reference_dimension':3},
'method':'32 golden-section updates plus3 anchors, single run, no restarts or grid',
'bounded_attempt_found_negative_diagnostic':best['G_nats_diagnostic'] < -1e-9,
'best_observed':best,'samples':rows,
'certified_negative_G_witness':False,'universal_Q_proved':False,'global_minimum_certified':False,
'independent_review':False,'no_reference_dimension_bound':True}
Path(__file__).with_name('RESULT1297.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps({'evaluations':len(rows),'best':best,'negative':out['bounded_attempt_found_negative_diagnostic']}))
