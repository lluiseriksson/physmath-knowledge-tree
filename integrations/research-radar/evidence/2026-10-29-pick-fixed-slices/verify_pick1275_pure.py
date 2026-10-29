from fractions import Fraction as Q
from itertools import permutations, combinations
from pathlib import Path
import json
N=6
Z=(0,)*N
class P:
 def __init__(self,v=0):self.d={Z:Q(v)} if v else {}
 @classmethod
 def terms(cls,d):
  z=cls();z.d={k:v for k,v in d.items() if v};return z
 def __add__(self,o):
  o=o if isinstance(o,P) else P(o);d=self.d.copy()
  for k,v in o.d.items():d[k]=d.get(k,0)+v
  return P.terms(d)
 __radd__=__add__
 def __neg__(self):return P.terms({k:-v for k,v in self.d.items()})
 def __sub__(self,o):return self+-o if isinstance(o,P) else self+P(-o)
 def __rsub__(self,o):return P(o)+-self
 def __mul__(self,o):
  o=o if isinstance(o,P) else P(o);d={}
  for a,v in self.d.items():
   for b,w in o.d.items():
    k=tuple(i+j for i,j in zip(a,b));d[k]=d.get(k,0)+v*w
  return P.terms(d)
 __rmul__=__mul__
 def __pow__(self,n):
  z=P(1)
  for _ in range(n):z=z*self
  return z
 def __eq__(self,o):return self.d==(o if isinstance(o,P) else P(o)).d
 def coeff(self,i,n):return P.terms({tuple(0 if j==i else a for j,a in enumerate(k)):v for k,v in self.d.items() if k[i]==n})
def var(i):
 k=list(Z);k[i]=1;return P.terms({tuple(k):Q(1)})
x,y,r,t,a,b=[var(i) for i in range(N)]
def det(M):
 out=0
 for p in permutations(range(len(M))):
  term=(-1)**sum(p[i]>p[j] for i in range(len(p)) for j in range(i+1,len(p)))
  for i,j in enumerate(p):term=term*M[i][j]
  out=out+term
 return out
D=1-r*r
F=D*((x*x+y*y)**2+4)-8*(1+r*r)*x*y
PN=16*x*y-D*((2+2*x*y)**2+(x*x-y*y)**2)
assert PN+F==0
assert det([[t,x,y],[x,1,0],[y,0,1]])==t-x*x-y*y
M2scaled=[[4*(1+r*r)*x,D*t,2*D],[t,2*y,0],[2,0,2*y]]
assert det(M2scaled)==2*y*(8*(1+r*r)*x*y-D*(t*t+4))
assert F.coeff(2,0)==(x*x-y*y)**2+4*(x*y-1)**2
xx=1+r*a;yy=1+r*b
Fc=D*((xx*xx+yy*yy)**2+4)-8*(1+r*r)*xx*yy
assert Fc.coeff(2,0)==0 and Fc.coeff(2,1)==0
assert Fc.coeff(2,2)==8*(a*a+b*b-2)
def psd(M):return all(det([[M[i][j] for j in I] for i in I])>=0 for n in range(1,len(M)+1) for I in combinations(range(len(M)),n))
def rank(M):
 M=[list(row) for row in M];k=0
 for j in range(len(M[0])):
  p=next((i for i in range(k,len(M)) if M[i][j]),None)
  if p is None:continue
  M[k],M[p]=M[p],M[k];z=M[k][j];M[k]=[v/z for v in M[k]]
  for i in range(len(M)):
   if i!=k:
    z=M[i][j];M[i]=[v-z*w for v,w in zip(M[i],M[k])]
  k+=1
 return k
rows=[]
for xx,yy,label in [(Q(1),Q(1),'interior'),(Q(2),Q(2),'rank_one_boundary'),(Q(1,2),Q(1,2),'rank_one_boundary'),(Q(3),Q(3),'exterior')]:
 rr=Q(3,5);kk=(1+rr*rr)/(1-rr*rr);tt=xx*xx+yy*yy
 ff=tt*tt+4-8*kk*xx*yy
 A=[[tt,xx,yy],[xx,Q(1),Q(0)],[yy,Q(0),Q(1)]]
 B=[[4*kk*xx,tt,Q(2)],[tt,2*yy,Q(0)],[Q(2),Q(0),2*yy]]
 ok=psd(A) and psd(B)
 assert ok==(ff<=0)
 if label=='rank_one_boundary':assert ff==0
 if label=='exterior':assert not ok
 rows.append({'x':str(xx),'y':str(yy),'r':str(rr),'quartic':str(ff),'both_LMIs_PSD':ok,'label':label,'M1_rank':rank(A),'M2_rank':rank(B)})
rr=Q(1,5);kk=(1+rr*rr)/(1-rr*rr);wrong=Q(29)-16*kk
assert wrong>0
out={'scope':'Exact standard-library polynomial coefficient identities and selected rational controls; not an independent review, novelty claim or full variable-c lift','symbolic_identities':5,'coalescence_quartic_over_r_squared':'8*(a^2+b^2-2)','rows':rows,'variable_c_guard':{'valid_constant_f':'2+i','normalization_c':2,'r':'1/5','c1_quartic_positive':str(wrong),'claimed_general_extension':False},'confluent_first_derivative':'|fprime(0)|^2<=2, attained by sqrt(2i*(1+eta*z)/(1-eta*z)), |eta|=1'}
Path(__file__).with_name('CONTROL1275.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Five exact polynomial identities, four rational controls and variable-normalization guard passed.')
