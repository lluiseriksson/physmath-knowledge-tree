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


# Rational polynomial checks; no sampling of p,d.
def pa(a,b):
 n=max(len(a),len(b));return[(a[i]if i<len(a)else F(0))+(b[i]if i<len(b)else F(0))for i in range(n)]
def pm(a,b):
 c=[F(0)]*(len(a)+len(b)-1)
 for i,x in enumerate(a):
  for j,y in enumerate(b):c[i+j]+=x*y
 return c
def ps(a,t):return[t*x for x in a]
q=[F(81,400),F(99,100),-F(119,100)]
qp=[F(99,100),-F(119,50)]
assert pa(pm(qp,qp),ps(q,F(119,25)))==[F(243,125),F(0),F(0)]
vertex=pa([F(243,595)],ps(pm([-F(99,238),F(1)],[-F(99,238),F(1)]),-F(119,100)))
assert q==vertex
assert F(243,595)<F(1,2)
assert F(119,100)-F(243,500)==F(88,125)

# Multivariate exact polynomial identity for the determinant splitting.
# Coordinates are A,w,k2,L,v.
N=5
def const(x):return{(0,)*N:F(x)}if x else{}
def var(i):
 z=[0]*N;z[i]=1;return{tuple(z):F(1)}
def plus(a,b):
 c=a.copy()
 for m,x in b.items():
  c[m]=c.get(m,F(0))+x
  if not c[m]:del c[m]
 return c
def scale(a,t):return{m:x*t for m,x in a.items()if x*t}
def times(a,b):
 c={}
 for m,x in a.items():
  for n,y in b.items():
   z=tuple(i+j for i,j in zip(m,n));c[z]=c.get(z,F(0))+x*y
 return{m:x for m,x in c.items()if x}
def sub(a,b):return plus(a,scale(b,-1))
A,w,k2,L,v=[var(i)for i in range(N)]
a1=plus(sub(w,scale(A,2)),scale(times(k2,L),2))
a2mc=sub(sub(scale(A,2),scale(w,2)),scale(times(v,k2),F(1,2)))
raw=sub(scale(times(A,a2mc),2),times(a1,a1))
rhs=sub(times(times(k2,A),sub(scale(L,8),v)),times(plus(w,scale(times(k2,L),2)),plus(w,scale(times(k2,L),2))))
assert raw==rhs

# Exact rational bound constants.
lower_R_over_q=F(4,3);upper_L=F(8,3)
lower_V=4-F(9,10)*F(4,3);upper_V=2*upper_L
assert lower_V==F(14,5)>0
margin=8*lower_R_over_q-F(9,25)*upper_V**2
assert margin==F(32,75)>0
normalized=margin*F(9,25)
assert normalized==F(96,625)

# One consistency calibration, not a grid: p=1/2.
p=F(1,2);r=p*(1-p);qq=F(2,5);qprime=-F(1,5)
ss=isqrt(qq.numerator*S*S//qq.denominator);s=I(ss,ss+1)
la=(1+s)/2;lb=(1-s)/2;ll=(logi(la)-logi(lb))/s
kk=F(9,25)*r
ep=F(243,1000)/qq*ll-I.r(qprime*qprime/(4*qq*(1-qq)))
a0=r*r*(ep+1/r)
rr=2-(1-qq)*ll
vv=2*ll-(9-8*p)*(ll-2)/(10*qq)
coef=8*kk*a0*rr/qq-kk*kk*vv*vv
assert coef.l>0 and coef.l>int(normalized*r*r*S)
# Separate truncated-series propagation of the scalar kernel at p=1/2.
def jc(x):return[I.r(x)if not isinstance(x,I)else x,Z,Z]
def ja(a,b):return[a[i]+b[i]for i in range(3)]
def jn(a):return[-x for x in a]
def js(a,b):return ja(a,jn(b))
def jm(a,b):return[sum((a[j]*b[i-j]for j in range(i+1)),Z)for i in range(3)]
def ji(a):
 v0=1/a[0];v1=-a[1]/(a[0]*a[0]);v2=a[1]*a[1]/(a[0]*a[0]*a[0])-a[2]/(a[0]*a[0])
 return[v0,v1,v2]
def jd(a,b):return jm(a,ji(b))
def jl(a):return[logi(a[0]),a[1]/a[0],a[2]/a[0]-a[1]*a[1]/(2*a[0]*a[0])]
dj=[I.r(F(1,2)),ONE,Z];ej=[I.r(F(1,2)),-ONE,Z]
fj=[I.r(2),Z,I.r(F(8,3))]
kp=I.r(F(3,10));kap=kp*F(1,8)/s
m=(I.r(kk)-p*F(1,5)/40)/s
J=(p/2+m)*(p/2+m)/la+(p/2-m)*(p/2-m)/lb
def gjet(x,y):return jd(js(jl(x),jl(y)),js(x,y))
gj=gjet(jm(jc(la),dj),jm(jc(lb),ej));hj=gjet(jm(jc(lb),dj),jm(jc(la),ej))
base=jm(fj,jc(J))
t11=ja(ja(base,jm(gj,jc((kap-kp/2)*(kap-kp/2)))),jm(hj,jc((kap+kp/2)*(kap+kp/2))))
t22=ja(ja(base,jm(gj,jc((kap+kp/2)*(kap+kp/2)))),jm(hj,jc((kap-kp/2)*(kap-kp/2))))
t12=ja(base,jm(ja(gj,hj),jc(kap*kap-kk/4)))
aj=ja(jc(kk*ll),jm(ej,js(jm(jc(p),fj),t11)))
bj=ja(jc(kk*ll),jm(dj,js(jm(jc(p),fj),t22)))
cj=jm([I.r(F(1,2)),Z,I.r(-1)],js(jm(jc(p),fj),t12))
detjet=js(jm(aj,bj),jm(cj,cj))
assert detjet[0].l<=0<=detjet[0].h and detjet[1].l<=0<=detjet[1].h
assert max(detjet[2].l,coef.l)<=min(detjet[2].h,coef.h)

out={'scope':'Own analytic all-interior-latitude lower bound for the center determinant coefficient, not global M positivity or Q.',
 'q_polynomial':[str(x)for x in q],'q_max':'243/595','q_max_less_than_one_half':True,
 'qprime_identity':'(qprime)^2+(119/25)q=243/125',
 'coefficient_identity':'D2=k2*A0*(8L-v)-(w+2k2*L)^2, v=8(L-2)/q, w=-k2(L-2)(9-8p)/(10q)',
 'factorized_coefficient':'D2=8*k2*A0*R/q-k2^2*V^2, R=2-(1-q)L, V=2L-(9-8p)(L-2)/(10q)',
 'bounds':{'A0':'>=r, r=p(1-p)','R_over_q':'>=4/3','L':'2<=L<=8/3','V':'14/5<=V<=16/3',
 'normalized_coefficient':'D2>=96/625 * p^2*(1-p)^2 >0'},
 'symbolic_identity_verified_exactly':True,'separate_kernel_series_propagation':[x.out()for x in detjet],'calibration_p_half':{'D2':coef.out(),'rigorous_lower_bound':str(normalized*r*r)},
 'limitation':'Remainder is O((d-1/2)^4) at each fixed interior p. No explicit radius, no uniform joint p-endpoint limit, no full parameter-domain PSD, entropy witness or independent audit.'}
Path(__file__).with_name('CENTER1292.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8', newline='\n')
print('Exact coefficient identity and rational positive bound verified; one interval calibration agrees.')
