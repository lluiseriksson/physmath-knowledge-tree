from fractions import Fraction as F
from itertools import product
from pathlib import Path
import json,hashlib
class Q:
    __slots__=('a','b')
    def __init__(self,a=0,b=0):self.a,self.b=F(a),F(b)
    def __add__(self,o):
        o=o if isinstance(o,Q) else Q(o)
        return Q(self.a+o.a,self.b+o.b)
    __radd__=__add__
    def __neg__(self):return Q(-self.a,-self.b)
    def __sub__(self,o):return self+-cv(o)
    def __rsub__(self,o):return cv(o)+-self
    def __mul__(self,o):
        o=cv(o)
        return Q(self.a*o.a-self.b*o.b,self.a*o.b+self.b*o.a-self.b*o.b)
    __rmul__=__mul__
    def __truediv__(self,o):return Q(self.a/F(o),self.b/F(o))
    def conj(self):return Q(self.a-self.b,-self.b)
    def __bool__(self):return bool(self.a or self.b)
    def __eq__(self,o):o=cv(o);return self.a==o.a and self.b==o.b
    def serial(self):return [str(self.a),str(self.b)]
def cv(x):return x if isinstance(x,Q) else Q(x)
z=Q();one=Q(1);w=Q(0,1)
def phase(e):return [one,w,Q(-1,-1)][e%3]
def digs(n):return (n//9,(n//3)%3,n%3)
def enc(d):return 9*d[0]+3*d[1]+d[2]
def zero(n,m=None):return [[z for _ in range(m or n)]for _ in range(n)]
def mm(A,B):
    R=zero(len(A),len(B[0]))
    for i,row in enumerate(A):
        for k,x in enumerate(row):
            if x:
                for j,y in enumerate(B[k]):
                    if y:R[i][j]=R[i][j]+x*y
    return R
def conj(A):return [[x.conj() for x in row]for row in A]
def eye(n,s=1):return [[Q(s if i==j else 0)for j in range(n)]for i in range(n)]
def scaled(A,s):return [[x*s for x in row]for row in A]
def proj(q,k):
    if q=='Z':return [[Q(int(i==j==k))for j in range(3)]for i in range(3)]
    return [[phase(q*(i*(i-1)//2-j*(j-1)//2)-k*(i-j))/3 for j in range(3)]for i in range(3)]
def prob(P,L):
    v=sum((P[i][j]*L[j][i]for i in range(3)for j in range(3)),z)
    assert v.b==0 and 0<=v.a<=1
    return v.a

def phi_raw(x):
    a={enc((t,(t+j)%3,(t+2*j)%3)):x[j]for j in range(3)if x[j]for t in range(3)}
    H=zero(27)
    for u,au in a.items():
        for v,av in a.items():
            ud,vd=digs(u),digs(v);rho=au*av.conj()
            for mask in range(8):
                kept=[i for i in range(3)if mask&(1<<i)];traced=[i for i in range(3)if i not in kept]
                if any(ud[i]!=vd[i]for i in traced):continue
                factor=F((-1)**len(kept),2**len(kept))
                for ts in product(range(3),repeat=len(traced)):
                    rd=list(ud);sd=list(vd)
                    for i,t in zip(traced,ts):rd[i]=sd[i]=t
                    r,s=enc(rd),enc(sd);H[r][s]=H[r][s]+rho*factor
    return H

def proposed_inverse(x):
    norm=sum((v*v.conj() for v in x),z);assert norm.b==0 and norm.a>0
    s=norm.a;L=[[x[i]*x[j].conj()/s for j in range(3)]for i in range(3)]
    J=zero(27)
    for c in range(3):
        for p in range(3):
            if c==p==0:h=[[Q(2 if i==j else 0)-L[i][j]*F(2,5)for j in range(3)]for i in range(3)]
            else:
                h=zero(3);q='Z'if c==0 else (p*pow(c,-1,3))%3
                for k in range(3):
                    P=proj(q,k);Fin=proj(q,k if c==0 else (k+p)%3);weight=F(4)/(2+prob(Fin,L))
                    for i in range(3):
                        for j in range(3):h[i][j]=h[i][j]+P[i][j]*weight
            cols=[[(enc((t,(t+j)%3,(t+c-j)%3)),phase(-p*t))for t in range(3)]for j in range(3)]
            for i in range(3):
                for j in range(3):
                    for r,rt in cols[i]:
                        for t,tt in cols[j]:J[r][t]=J[r][t]+rt*h[i][j]*tt.conj()/9
    return J,s

reference=json.loads(Path(__file__).with_name('REFERENCE1318.json').read_text())
results=[];plusJ=None
for name,x in [('existing410_plus',[one,one,z]),('existing415_complex',[one,w,z])]:
    H=phi_raw(x);J,s=proposed_inverse(x)
    assert mm(H,J)==eye(27,s),'H_un * J must equal logical norm times I'
    assert mm(conj(H),scaled(conj(J),1/s))==eye(27),'conjugated inverse'
    wrong=mm(conj(H),scaled(J,1/s));defect=wrong[0][0]-one
    if name=='existing410_plus':
        plusJ=scaled(J,1/s)
    else:assert defect==Q(F(1,120),F(1,240))
    assert mm(H,scaled(J,3))==eye(27,3*s),'wrong1/3 instead1/9 must give3sI'
    results.append({'calibration':name,'logical_raw_norm':str(s),'all729_inverse_entries_identity':True,'conjugated_inverse_identity':True,'wrong_unconjugated_residual_000':defect.serial(),'factor1_over9_verified':True})

coeffpath=Path(__file__).with_name('M-COEFFICIENTS1317.json')
coeffbytes=coeffpath.read_bytes();mats=json.loads(coeffbytes)['matrices'];m={}
for entries in mats[:2]:
    for key,value in entries:m[key]=m.get(key,0)+value
m={k:v for k,v in m.items()if v};cols=[[]for _ in range(27)]
for key,value in m.items():row,t=divmod(key,27);cols[t].append((row,value))
C={}
for t in range(27):
    for u in range(27):
        h=plusJ[t][u];assert h.b==0
        if not h:continue
        for i,mi in cols[t]:
            for j,mj in cols[u]:
                key=i*729+j;C[key]=C.get(key,F(0))+F(mi*mj,64)*h.a
C={k:v for k,v in C.items()if v};B={}
for key,v in C.items():
    i,j=divmod(key,729);b,r=divmod(i,27);k,s=divmod(j,27)
    B[(k*27+r)*729+(b*27+s)]=v
rows=sorted([[r,c,str(v)] for key,v in B.items() for r,c in [divmod(key,729)]])
canonical=json.dumps(rows,separators=(',',':')).encode()
digest=hashlib.sha256(canonical).hexdigest()
assert digest==reference['B_canonical_sha256'] and len(B)==reference['B_nonzero']
result={'scope':'Inverse/conjugation/normalization and entire oldB transcription controls, not new anchor positivity or a proof for allL','calibrations':results,'old410_B_canonical_sha256_match':True,'B_canonical_sha256':digest,'reference_mode':'Portable canonical-table digest; original full-entry calibration is separately preserved in RESULT1318.json','old410_B_nonzero':len(B),'old410_artifact_sha256':reference['old410_artifact_sha256'],'M_coefficients1317_sha256':hashlib.sha256(coeffbytes).hexdigest(),'exact_arithmetic':'Python fractions over Q(omega); no floating eigensolver','sampled_PSD_campaign':False,'universal_signed_positivity_proved':False,'independent_reviewer':False,'formal_kernel':False}
Path('PORTABLE-RESULT1318.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(result,indent=2))
