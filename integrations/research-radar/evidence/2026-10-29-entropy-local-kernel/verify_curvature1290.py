from fractions import Fraction as F
from math import isqrt
from pathlib import Path
import json
S=10**40
def ce(a,b):return -((-a)//b)
class I:
 def __init__(a,l,h=None):a.l=l;a.h=l if h is None else h
 @staticmethod
 def r(x):
  x=F(x);return I(x.numerator*S//x.denominator,ce(x.numerator*S,x.denominator))
 def __add__(a,b):
  if not isinstance(b,I):b=I.r(b)
  return I(a.l+b.l,a.h+b.h)
 __radd__=__add__
 def __neg__(a):return I(-a.h,-a.l)
 def __sub__(a,b):return a+-(b if isinstance(b,I)else I.r(b))
 def __rsub__(a,b):return I.r(b)+-a
 def __mul__(a,b):
  if not isinstance(b,I):b=I.r(b)
  v=[a.l*b.l,a.l*b.h,a.h*b.l,a.h*b.h];return I(min(v)//S,ce(max(v),S))
 __rmul__=__mul__
 def inv(a):
  assert a.l>0 or a.h<0
  return I(S*S//a.h,ce(S*S,a.l))
 def __truediv__(a,b):return a*(b if isinstance(b,I)else I.r(b)).inv()
 def __rtruediv__(a,b):return I.r(b)*a.inv()
 def out(a):return {'lo':str(a.l),'hi':str(a.h),'denominator':str(S),'approx_mid':(a.l+a.h)/(2*S)}
Z=I.r(0);ONE=I.r(1)
def logunit(y):
 z=(y-1)/(y+1);z2=z*z;t=z;v=Z
 for k in range(60):v=v+t/(2*k+1);t=t*z2
 tail=2*t/(121*(ONE-z2))
 return 2*v+I(0,tail.h)
LOG2=logunit(I.r(2))
def logpoint(n):
 assert n>0
 x=F(n,S);k=0
 while x<1:x*=2;k-=1
 while x>2:x/=2;k+=1
 return logunit(I.r(x))+k*LOG2
def logi(x):return I(logpoint(x.l).l,logpoint(x.h).h)
def c(a=0,b=0):return(a if isinstance(a,I)else I.r(a),b if isinstance(b,I)else I.r(b))
def ca(x,y):return(x[0]+y[0],x[1]+y[1])
def cm(x,y):return(x[0]*y[0]-x[1]*y[1],x[0]*y[1]+x[1]*y[0])
def cj(x):return(x[0],-x[1])
def ma(A,B):return[[ca(a,b)for a,b in zip(x,y)]for x,y in zip(A,B)]
def ms(A,v):return[[cm(a,c(v))for a in x]for x in A]
def md(A):return[[cj(A[j][i])for j in range(2)]for i in range(2)]
def mm(A,B):return[[ca(cm(A[i][0],B[0][j]),cm(A[i][1],B[1][j]))for j in range(2)]for i in range(2)]
def tr(A):return ca(A[0][0],A[1][1])
def zero():return[[c(),c()],[c(),c()]]
X=[[c(F(3,5)),c()],[c(),c(F(4,5))]]
d=[I.r(F(9,25)),I.r(F(16,25))]
sq=isqrt(2*S*S//5);s=I(sq,sq+1)
Q=[[I.r(F(3,5)),I.r(F(3,10))],[I.r(F(3,10)),I.r(F(2,5))]]
P=[]
for sign in [1,-1]:
 P.append([[c(((1 if i==j else 0)+sign*(2*Q[i][j]-(1 if i==j else 0))/s)/2)for j in range(2)]for i in range(2)])
lam=[(1+s)/2,(1-s)/2]
eig=[lam[i]*d[r]for i in range(2)for r in range(2)]
le=[logi(x)for x in eig]
def fd(x,y,lx,ly,same):return 1/x if same else(lx-ly)/(x-y)
ff=[[fd(eig[a],eig[b],le[a],le[b],a==b)for b in range(4)]for a in range(4)]
ld=[logi(x)for x in d]
dd=[[fd(d[r],d[t],ld[r],ld[t],r==t)for t in range(2)]for r in range(2)]
L=(logi(lam[0])-logi(lam[1]))/s
def q(H):
 E=ma(mm(X,md(H)),mm(H,md(X)));b=tr(mm(H,md(H)))[0]
 A01=ms(mm(X,md(H)),F(3,10))
 blocks=[[ms(E,F(19,80)),A01],[md(A01),ms(E,F(21,80))]]
 def rt(r,t):return[[blocks[i][j][r][t]for j in range(2)]for i in range(2)]
 bt=Z
 for i in range(2):
  for j in range(2):
   for r in range(2):
    for t in range(2):
     w=tr(mm(mm(mm(P[i],rt(r,t)),P[j]),rt(t,r)))
     assert w[1].l<=0<=w[1].h
     bt=bt+ff[2*i+r][2*j+t]*w[0]
 bd=Z
 for r in range(2):
  for t in range(2):bd=bd+dd[r][t]*cm(E[r][t],E[t][r])[0]
 return F(9,100)*b*L-bt/2+bd/4
H=[]
for imag in [False,True]:
 h=zero();h[0][0]=c(0,F(4,5))if imag else c(F(4,5));h[1][1]=c(0,-F(3,5))if imag else c(-F(3,5));H.append(h)
 for r,t in[(0,1),(1,0)]:
  h=zero();h[r][t]=c(0,1)if imag else c(1);H.append(h)
flat=H[3]
flatq=q(flat)
assert flatq.l<=0<=flatq.h
for hh in H:
 cross=(q(ma(flat,hh))-q(flat)-q(hh))/2
 assert cross.l<=0<=cross.h
H=[h for i,h in enumerate(H) if i!=3]
v=[q(h)for h in H]
M=[[v[i]if i==j else(q(ma(H[i],H[j]))-v[i]-v[j])/2 for j in range(5)]for i in range(5)]
closed=I.r(F(95,192))+F(243,3200)*L
check=M[0][0]-closed
assert check.l<=0<=check.h
D=[];LL=[[Z for j in range(5)]for i in range(5)]
for i in range(5):
 LL[i][i]=ONE;z=M[i][i]
 for k in range(i):z=z-LL[i][k]*LL[i][k]*D[k]
 assert z.l>0,('uncertified pivot',i,z.out())
 D.append(z)
 for j in range(i+1,5):
  z=M[j][i]
  for k in range(i):z=z-LL[j][k]*LL[i][k]*D[k]
  LL[j][i]=z/D[i]
out={'scope':'One analytic local Hessian at X=diag(3/5,4/5),p=1/2. No grid, global bound, independent audit or Research Capsule campaign.',
 'closed_scalar_diagonal_check':closed.out(),'flat_direction_interval_check':flatq.out(),'scale':str(S),'log_series_terms':60,'remainder':'Explicit atanh tail, all arithmetic outward rounded.',
 'basis':['real diagonal(4/5,-3/5)','real E01','real E10','imag E01','imag E10'],
 'quadratic_coefficient':'9/100 ||H||F^2 log(lam+/lam-)/sqrt(2/5) - BKM_T0(T1,T1)/2+BKM_D(E,E)/4',
 'matrix':[[x.out()for x in row]for row in M],'LDL_pivots':[x.out()for x in D],
 'certified_positive_definite_on_five_transverse_tangent_directions':True,
 'excluded_phase':'Global phase removed by complex Tr(X*H)=0; imaginary diagonal(4/5,-3/5) is an additional exactly flat classical-reference phase direction, excluded analytically.',
 'conclusion':'Five transverse tangent directions have positive curvature; the remaining projective tangent is an exactly flat classical-reference phase direction. No explicit finite-radius bound or universal inequality certified.'}
Path(__file__).with_name('CURVATURE1290.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8', newline='\n')
print('Five positive interval LDL pivots: single-base local quadratic form certified.')
