from pathlib import Path
import json,hashlib,datetime
import numpy as np
from scipy.special import roots_hermite,roots_legendre,roots_laguerre
C=Path(__file__).parent;k=r=1.;lam=.5;q=1-lam;s=k+r
annuli=np.array([[0.,.5],[.5,2.],[2.,6.]])
p=np.exp(-annuli[:,0])-np.exp(-annuli[:,1]);m=(annuli[:,0]+1)*np.exp(-annuli[:,0])-(annuli[:,1]+1)*np.exp(-annuli[:,1]);h=np.cross(p,m);h/=np.max(np.abs(h));norm2=float(np.sum(p*h*h))
def entropy(z,n):
 nodes,weights=roots_hermite(n);uv=(nodes[:,None]+1j*nodes[None,:]).reshape(-1);ww=(weights[:,None]*weights[None,:]).reshape(-1)/np.pi
 out=[]
 for zz in np.atleast_1d(z):
  a=np.sqrt(k*zz);y=a+np.sqrt(r)*uv
  logr=np.log(q/lam)+np.log(r/s)-abs(y)**2/s+abs(y-a)**2/r
  y0=np.sqrt(s)*uv
  logs=np.log(lam/q)+np.log(s/r)-abs(y0-a)**2/r+abs(y0)**2/s
  out.append(lam*np.dot(ww,np.logaddexp(0,logr))+q*np.dot(ww,np.logaddexp(0,logs)))
 return np.array(out)
rows=[];sign=None
for n in [32,64,96,144,192]:
 nodes,w=roots_legendre(n);integrals=[]
 for aa,bb in annuli:
  z=aa+(nodes+1)*(bb-aa)/2
  integrals.append(float(np.dot(w,np.exp(-z)*entropy(z,n))*(bb-aa)/2))
 a0=float(np.dot(h,integrals))
 if sign is None:sign=1. if a0>=0 else -1.
 a0*=sign;eps=a0/(2*norm2);lower_proxy=eps*a0-eps*eps*norm2
 zz,lw=roots_laguerre(n);eh=float(np.dot(lw,entropy(zz,n)));g=lam*np.log(s/r)+lam*np.log(lam)+q*np.log(q)+eh
 rows.append({'order_hermite_legendre_laguerre':n,'a0_estimate':a0,'h2_exact_formula_numerically_evaluated':norm2,'epsilon_estimate':eps,'single_law_improvement_proxy':lower_proxy,'gaussian_mutual_information_estimate_nats':g,'H_at_zero':float(entropy([0],n)[0])})
h*=sign
result={'created_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'exploratory floating-point quadrature, not certified interval bounds or new paper','parameters':{'k':k,'r':r,'lambda':lam,'s':s},'annuli_squared_radius':annuli.tolist(),'h_values_diagnostic_only':h.tolist(),'exact_definition':'p_i=exp(-a_i)-exp(-b_i); m_i=(a_i+1)exp(-a_i)-(b_i+1)exp(-b_i); h=(p cross m)/maxabs(p cross m), sign chosen by first quadrature. Use this symbolic definition, not rounded displayed coefficients. h=0 outside the three annuli.','moment_residual_diagnostics':{'mass':float(np.dot(p,h)),'energy':float(np.dot(m,h))},'rows':rows,'uncertified_parts':['No integration remainder bound','a0 positivity is suggested by repeated quadrature, not certified','No C1, common-input optimum V, learning gap Delta or finite-energy threshold computed','Single-law non-Gaussian gain cannot be used as a lower bound on the feedback learning gap'],'analytic_scope':'If exact a0>0, epsilon<=1 and exact moment cancellation hold, the existing manuscript inequality yields feasible single-law improvement epsilon*a0-epsilon^2*||h||_2^2. No novelty claim for this prior inequality.','falsifier':'Reject numerical positivity if a certified enclosure for a0 reaches zero; reject any Delta lower-bound claim inferred only from this single-law gain.','code_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'environment':{'numpy':np.__version__}}
(C/'WITNESS771.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2))
