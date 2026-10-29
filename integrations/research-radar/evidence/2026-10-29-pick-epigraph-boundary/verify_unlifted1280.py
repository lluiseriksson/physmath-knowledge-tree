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

def deriv(q,i):
 d={}
 for k,v in q.d.items():
  if k[i]:
   j=list(k);j[i]-=1;d[tuple(j)]=v*k[i]
 return P.terms(d)
def ev(q,values):
 return sum(v*__import__('functools').reduce(lambda a,j:a*values[j]**k[j],range(N),Q(1)) for k,v in q.d.items())
F=(x*x+y*y)**2+4-17*x*y
Fx=deriv(F,0);Fy=deriv(F,1)
assert ev(F,[Q(1),Q(1),0,0,0,0])==-9
assert ev(F,[Q(2),Q(2),0,0,0,0])==0
assert ev(Fx,[Q(2),Q(2),0,0,0,0])==30
assert ev(Fy,[Q(2),Q(2),0,0,0,0])==30
# Exact specialization at y=1 and derivatives.
Pline=x**4+2*x*x-17*x+5
assert deriv(deriv(Pline,0),0)==12*x*x+4
vals=[ev(Pline,[Q(i),0,0,0,0,0]) for i in [0,1,3]]
assert vals==[5,-9,53]
# Nonzero linear part in a possible real quadratic factorization forces C=D.
# C=-2 contradicts l^2=m^2=2C; C=2 forces xy coefficient +/-8,not-17.
possible=[-2*l*m for l in [-2,2] for m in [-2,2]]
assert sorted(set(possible))==[-8,8] and -17 not in possible
# General positive-gap and rotated-line identities. Herea=c0,b=kappa,t=lambda,r=C.
assert 4*((a*a-1)**2+4*a*a*b*b)-4*(a*a+1)**2==16*a*a*(b*b-1)
# SetX^2=lambda/2; the line polynomial isY^4+2lambdaY^2+C^2-lambda^2/4.
# Clear denominators to avoid rational coefficient division in the polynomial kernel.
assert (t+2*y*y)**2+4*r*r-2*t*t+4*t*y*y==4*(y**4+2*t*y*y+r*r)-t*t
out={'scope':'Exact arithmetic checks supporting a separately written analytical irreducibility/real-zero argument. No independent review, formal kernel proof or obstruction to lifted SDP representation.','interior':{'point':[1,1],'F':-9},'nonsingular_boundary':{'point':[2,2],'F':0,'gradient':[30,30]},'line_y1_polynomial':'x^4+2*x^2-17*x+5','second_derivative':'12*x^2+4>0 for every realx','bracket_values':dict(zip(['0','1','3'],map(int,vals))),'root_count_basis':'Strict convexity plus positive/negative/positive brackets gives exactlytwo realroots; other two quarticroots nonreal. This is analytical,not sampling as proof.','quadratic_factor_possible_cross_coefficients':sorted(set(possible)),'required_cross_coefficient':-17,'direct_affine_LMI_without_auxiliaries':'excluded by analytical real-zero argument','lifted_affine_LMI':'not excluded; fixedslice has explicit lift1275/1277'}
Path(__file__).with_name('CONTROL1280.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Boundary, gradient, convex line polynomial and irreducibility coefficient guards passed.')
