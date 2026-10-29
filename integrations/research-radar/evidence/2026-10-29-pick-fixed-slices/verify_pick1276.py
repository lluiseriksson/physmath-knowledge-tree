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

# Reuse only the recorded standard-library polynomial kernel, not earlier results.
c=t;D=1-r*r
Fnum=D*((x*x+y*y)**2+(c*c+1)**2-2*(c*c-1)*(x*x-y*y))-8*(1+r*r)*c*x*y
Pnum=16*c*x*y-D*((c*c-1-x*x+y*y)**2+(2*c+2*x*y)**2)
assert Fnum+Pnum==0
xx=c+r*a;yy=1+r*b
Fc=D*((xx*xx+yy*yy)**2+(c*c+1)**2-2*(c*c-1)*(xx*xx-yy*yy))-8*(1+r*r)*c*xx*yy
assert Fc.coeff(2,0)==0 and Fc.coeff(2,1)==0
assert Fc.coeff(2,2)==4*((c*c+1)*(a*a+b*b)-4*c*c)
# Arrow-matrix determinant, variables x=X,y=Y,r=alpha,a=C.
arrow=[[r*x,t,a,r*y],[t,x,0,0],[a,0,x,0],[r*y,0,0,r*x]]
assert det(arrow)==r*x*x*(r*x*x-t*t-a*a-r*y*y)
# c0=2,kappa=9/5 givesQ=[[6,72/5],[72/5,-6]],
# lambda=78/5 and positive eigenvector(3,2),alpha=6/5.
assert Q(6)*3+Q(72,5)*2==Q(78,5)*3
assert Q(72,5)*3-Q(6)*2==Q(78,5)*2
assert Q(6,5)*((3*x+2*y)**2-(-2*x+3*y)**2)==6*x*x+Q(144,5)*x*y-6*y*y
def psd(M):return all(det([[M[i][j] for j in I] for i in I])>=0 for n in range(1,len(M)+1) for I in combinations(range(len(M)),n))
rows=[]
for xx,yy,label in [(Q(2),Q(1),'valid_constant_interior'),(Q(-2),Q(-1),'wrong_sign_branch'),(Q(8),Q(1),'outside'),(Q(0),Q(1),'axis_excluded')]:
 cc=Q(2);kk=Q(9,5);alpha=Q(6,5);C=Q(5);X=3*xx+2*yy;Y=-2*xx+3*yy;tt=xx*xx+yy*yy
 ff=tt*tt+C*C-6*(xx*xx-yy*yy)-8*cc*kk*xx*yy
 M=[[tt,xx,yy],[xx,Q(1),Q(0)],[yy,Q(0),Q(1)]]
 A=[[alpha*X,tt,C,alpha*Y],[tt,X,Q(0),Q(0)],[C,Q(0),X,Q(0)],[alpha*Y,Q(0),Q(0),alpha*X]]
 ok=psd(M) and psd(A)
 assert ok == (xx>0 and yy>0 and ff<=0)
 rows.append({'x':str(xx),'y':str(yy),'c0':2,'r_squared':'2/7','quartic':str(ff),'LMIs_PSD':ok,'label':label})
# Both half-plane Pick tests pass, but the quadrant test fails.
aa=Q(5,2);rr=Q(3,5);D=1-rr*rr
halfdet=4*aa/D-((1+aa)**2+(1-aa)**2)
quad=4*aa**4+4-8*((1+rr*rr)/D)*aa*aa
assert halfdet==Q(9,8)>0 and quad==54>0
out={'scope':'Exact bounded symbolic identities and rational calibrations, not an independent review or variable-c SDP lift','general_Pick_determinant_identity':True,'general_confluent_coefficient':'4*((c0^2+1)*(a^2+b^2)-4*c0^2)','arrow_determinant_identity':True,'rational_eigenpair_and_quadratic_form':True,'rows':rows,'intersection_halfplanes_falsifier':{'c0':1,'r':'3/5','target':'5/2+5i/2','right_halfplane_Pick_determinant':str(halfdet),'upper_halfplane_Pick_determinant':str(halfdet),'quadrant_quartic':str(quad),'quadrant_interpolant_exists':False},'new_source_counterexample':False,'full_variable_c_lift':False}
Path(__file__).with_name('CONTROL1276.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print('General fixed-normalization identities, four rational controls and half-plane-intersection falsifier passed.')
