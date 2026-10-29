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

from math import isqrt
p=x;c=t;k=b;xx=c+p
F=(xx*xx+y*y)**2+(c*c+1)**2-2*(c*c-1)*(xx*xx-y*y)-8*c*k*xx*y
SS=p*p+y*y+1;HH=2*k*y-SS;BB=SS*SS-4*y*y
assert F==BB-4*c*(c+p)*HH
assert BB==(p*p+(y-1)**2)*(p*p+(y+1)**2)
assert HH==(k*k-1)-(p*p+(y-k)**2)
def sqrtq(z):
 n=isqrt(z.numerator);d=isqrt(z.denominator)
 assert n*n==z.numerator and d*d==z.denominator
 return Q(n,d)
kk=Q(17,8);rows=[]
for pp,yy,label in [(Q(1),Q(2),'upper_boundary_c1'),(Q(-1,2),Q(1,2),'lower_boundary_c1'),(Q(0),Q(1),'constant_vertex')]:
 S0=pp*pp+yy*yy+1;H0=2*kk*yy-S0;B0=S0*S0-4*yy*yy
 assert H0>0 and B0>=0
 psi=(-pp+sqrtq(pp*pp+B0/H0))/2
 if label!='constant_vertex':assert psi==1 and psi>max(0,-pp)
 else:assert psi==0 and B0==0
 tests=[]
 for cc in ([Q(1,2),Q(1),Q(2)] if psi else [Q(1,2),Q(1),Q(2)]):
  f0=B0-4*cc*(cc+pp)*H0
  ok=cc>0 and cc+pp>0 and yy>0 and f0<=0
  assert ok==(cc>=psi)
  tests.append({'c':str(cc),'F':str(f0),'feasible':ok})
 rows.append({'p':str(pp),'y':str(yy),'H':str(H0),'B':str(B0),'psi':str(psi),'label':label,'tests':tests})
pp=Q(0);yy=Q(4);S0=pp*pp+yy*yy+1;H0=2*kk*yy-S0;B0=S0*S0-4*yy*yy
assert H0==0 and B0==225>0
out={'scope':'Exact polynomial reduction and rational boundary guards, not a full SDP lift, novelty claim or independent assessment','polynomial_identities':3,'rows':rows,'H_zero_guard':{'p':'0','y':'4','r':'3/5','H':'0','B':str(B0),'finite_c_feasible':False},'r_zero':'Excluded from division formula and treated as colliding value constraints in1275/1276','full_variable_c_SDP_lift':False}
Path(__file__).with_name('CONTROL1278.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Three exact polynomial identities, nine rational feasibility controls and H-zero guard passed.')
