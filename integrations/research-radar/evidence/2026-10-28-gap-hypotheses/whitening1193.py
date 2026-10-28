from pathlib import Path
import json,hashlib
import numpy as np
import sympy as s
C=Path(__file__).parent
# Exact Hermitian-replacer certificate for the three prepared pure states.
v=[s.Matrix([1,0]),s.Matrix([s.sqrt(2+s.sqrt(2))/2,s.sqrt(2-s.sqrt(2))/2]),s.Matrix([1,1])/s.sqrt(2)]
tau=[x*x.T for x in v];H=s.Matrix([[s.Rational(3,2),1],[1,-s.Rational(1,2)]])
assert s.trace(H)==1 and s.det(H)<0
cert=[]
for t in tau:
    residual=t-H/4;tr=s.simplify(s.trace(residual));det=s.simplify(residual.det())
    assert tr==s.Rational(3,4) and det.is_positive
    cert.append({'trace':str(tr),'determinant':str(det)})
overlap=sum(s.trace(tau[i]*tau[j]) for i in range(3) for j in range(3) if i!=j)/6
limit=s.simplify(1-overlap);assert s.simplify(limit-(3-s.sqrt(2))/6)==0
def rel(a,b):
    p,U=np.linalg.eigh((a+a.T.conj())/2);q,V=np.linalg.eigh((b+b.T.conj())/2)
    assert min(p)>0 and min(q)>0
    return float(np.sum(p*np.log(p))-np.trace(a@((V*np.log(q))@V.T.conj())).real)
def blocks(items):
    n=len(items);d=items[0].shape[0];a=np.zeros((n*d,n*d),complex)
    for i,t in enumerate(items):a[i*d:(i+1)*d,i*d:(i+1)*d]=t
    return a
T=[np.array(t.evalf(30),dtype=complex) for t in tau];n=3;I=np.eye(n);f=np.ones((n,1))/np.sqrt(n);F=f@f.T;P=I-F
psi=[np.sqrt(n/(n-1))*(I[:,[i]]-f/np.sqrt(n)) for i in range(n)]
rows=[]
for k in [8,12,16,20]:
    beta=1/(4*n*k);delta=2.**(-k);eps=beta*delta;alpha=1/n-(n-2)*eps-beta;c=np.sqrt(alpha*beta*(1-delta))
    L=np.sqrt((n-1)/(n*(1-n*beta)))*P+F/(n*np.sqrt(beta))
    plus=[];minus=[]
    for x in psi:
        base=alpha*(x@x.T)+eps*(P-x@x.T)+beta*F;cross=c*(x@f.T+f@x.T)
        plus.append(L@(base+cross)@L);minus.append(L@(base-cross)@L)
    assert np.max(np.abs(sum(plus)-I/n))<1e-12 and np.max(np.abs(sum(minus)-I/n))<1e-12
    assert max(abs(np.trace(x)-1/n) for x in plus+minus)<1e-12
    di=rel(blocks(plus),blocks(minus));ap=sum(np.kron(x,t) for x,t in zip(plus,T));am=sum(np.kron(x,t) for x,t in zip(minus,T));do=rel(ap,am)
    assert 0<do<di
    rows.append({'k':k,'D_in':di,'D_out':do,'ratio':do/di,'minimum_input_eigenvalue':float(min(np.linalg.eigvalsh(blocks(minus))))})
r={'exact_certificate':{'lambda':'1/4','H_positive':False,'residuals':cert,'complete_equal_reference_trace_bound':'<=3/4 by cancellation of Hermitian replacer; not an Umegaki bound'},'proposed_whitening_limit':str(limit),'diagnostic_cases':rows,'scope':'Root proof sketch and exact2x2 certificate, with double-precision noncertified3-input diagnostics; not a general fixed-reference no-go or manuscript review.'}
(C/'WHITEN1193.json').write_text(json.dumps(r,indent=2)+'\n',encoding='utf-8');print(json.dumps(r))
