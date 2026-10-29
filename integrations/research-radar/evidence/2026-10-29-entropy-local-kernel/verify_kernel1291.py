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

def sqrtf(x):
 x=F(x);k=isqrt(x.numerator*S*S//x.denominator)
 return I(k,k+1)
def sq(x):return x*x
def kernel(p,d):
 p=F(p);d=F(d);e=1-d
 k2=F(9,25)*p*(1-p);K=sqrtf(k2);z=F(9,20)-p/2;s=sqrtf(4*k2+z*z)
 la=(1+s)/2;lb=(1-s)/2
 ll=(logi(la)-logi(lb))/s
 fi=I.r(1/d)if d==e else(logi(I.r(d))-logi(I.r(e)))/(d-e)
 def div(x,y):
  assert not(x.l<=y.h and y.l<=x.h),'Coincident or unresolved arguments: use continuous divided difference.'
  return(logi(x)-logi(y))/(x-y)
 g1=div(la*d,lb*e);g2=div(lb*d,la*e)
 m=(I.r(k2)-p*z/F(40))/s
 kap=K*(9-8*p)/(40*s)
 aa=I.r(p/2)+m;bb=I.r(p/2)-m
 base=fi*(aa*aa/la+bb*bb/lb)
 t11=base+g1*sq(kap-K/2)+g2*sq(kap+K/2)
 t22=base+g1*sq(kap+K/2)+g2*sq(kap-K/2)
 t12=base+(g1+g2)*(kap*kap-I.r(k2)/4)
 a=k2*ll+e*(p*fi-t11)
 b=k2*ll+d*(p*fi-t22)
 c0=sqrtf(d*e)*(p*fi-t12)
 return a,b,c0
a,b,c0=kernel(F(1,2),F(9,25))
prior=json.loads(Path(__file__).with_name('REFERENCE1290.json').read_text(encoding='utf8'))
for actual,ij in [(a,(1,1)),(b,(2,2)),(c0,(1,2))]:
 old=prior['matrix'][ij[0]][ij[1]]
 # Both enclosures must overlap. Exact identity is justified in ARGUMENT1291.
 assert max(actual.l,int(old['lo']))<=min(actual.h,int(old['hi']))
assert a.l>0 and b.l>0 and (a*b-c0*c0).l>0

# Exact polynomial identity for p-Tr[A Q^{-1} A*].
def add(a,b):
 n=max(len(a),len(b));return[(a[i]if i<len(a)else F(0))+(b[i]if i<len(b)else F(0))for i in range(n)]
def neg(a):return[-x for x in a]
def mul(a,b):
 c=[F(0)]*(len(a)+len(b)-1)
 for i,x in enumerate(a):
  for j,y in enumerate(b):c[i+j]+=x*y
 return c
def sc(a,t):return[t*x for x in a]
q0=[F(29,40),-F(1,4)];q1=[F(11,40),F(1,4)]
k2=[F(0),F(9,25),-F(9,25)]
be=[F(0),F(19,40)];de=[F(0),F(21,40)]
dq=add(mul(q0,q1),neg(k2))
num=add(add(mul(q1,add(mul(be,be),k2)),mul(q0,mul(de,de))),sc(mul(k2,de),F(-2)))
actual=add(mul([F(0),F(1)],dq),neg(num))
factor=sc(mul(mul([F(0),F(1)],[F(1),F(-1)]),[F(803),F(-176)]),F(1,8000))
assert actual==factor,(actual,factor)
# detQ=119/400*(p-99/238)^2+88/595
vertex=add(sc(mul([-F(99,238),F(1)],[-F(99,238),F(1)]),F(119,400)),[F(88,595)])
assert dq==vertex
out={'scope':'General local 2x2 sign criterion derived analytically; one prior calibration only, not a parameter grid or universal entropy proof.',
 'kernel_reference_check':{'p':'1/2','d':'9/25','a':a.out(),'b':b.out(),'c':c0.out(),'det':(a*b-c0*c0).out(),'overlaps_full_spectral_metric1290':True},
 'exact_polynomial_identity':{'detQ':[str(x)for x in dq],'p_detQ_minus_trace_numerator':[str(x)for x in actual],
 'factor':'p(1-p)(803-176p)/8000','positive_coefficient':'C(p)=p(1-p)(803-176p)/(8000 detQ)>0 for0<p<1',
 'detQ_completed_square':'119/400*(p-99/238)^2+88/595'},
 'limitation':'No proof that a>=0,b>=0,ab>=c^2 throughout0<p,d<1. Boundary stability is only for fixed interior p, not uniform joint p,d limits. Entropy/core Q remains unproved.'}
Path(__file__).with_name('KERNEL1291.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8', newline='\n')
print('Algebraically separate scalar expression matches1290; exact boundary-coefficient polynomial factor verified.')
