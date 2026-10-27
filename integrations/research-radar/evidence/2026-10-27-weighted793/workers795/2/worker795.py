from pathlib import Path
from fractions import Fraction
import sys,json,time,hashlib
from flint import arb,acb,fmpq,ctx
sys.path.insert(0,r'C:\Trabajo\airr\2026-10-26_interval777');import interval778 as eng
C=Path(__file__).parent;ctx.prec=192;eng.T=600;start=time.monotonic();candidate=json.loads((C/'FIT794.json').read_bytes())['rows'][0]
def A(x):
 if isinstance(x,float):x=Fraction(*x.as_integer_ratio())
 elif not isinstance(x,Fraction):x=Fraction(x)
 return arb(fmpq(x.numerator,x.denominator))
a=A(candidate['a']);b2=arb(9757)/50000;alpha=a*b2/(1+a);coef=[A(float.fromhex(x)) for x in candidate['coefficient_hex']];freq=[A(float.fromhex(x)) for x in candidate['frequencies_hex']]
def F(z):return (-alpha*z).exp()*sum((d*(-f*f*z/4).hypgeom_0f1(1) for d,f in zip(coef,freq)),arb(0))
def BH(z):
 u=arb(2).sqrt()/3*(-z/6).exp();return u*(1-u.log())
def Hbound(Z,ell):return (Z-ell).exp()*(3*Z+7)/4+(2*Z-2*ell).exp()*(3*Z+4)/2
def Fbound(Z,ell):return (-alpha*ell).exp()*sum((abs(d)*(f*((Z-ell)/2).sqrt()).exp() for d,f in zip(coef,freq)),arb(0))
rows=[];eps=arb('0.000001');maxbound=arb(0)
def segment(left,width,n,include_H):
 global maxbound
 mid=A(left)+A(width)/2;half=A(width)/2
 # rho=2 ellipse, semiaxes1.25h and0.75h.
 ell=mid-5*half/4;Z=mid+5*half/4;assert not include_H or 3*half/4<arb(1)/4
 M=(Fbound(Z,ell)+(Hbound(Z,ell) if include_H else arb(0)))/(1+ell)
 angles=[arb.pi()*(2*j+1)/(2*n) for j in range(n)];samples=[]
 for angle in angles:
  z=mid+half*angle.cos();v=-F(z)
  if include_H:
   h=eng.H(acb(z));assert h.is_finite() and h.imag.contains(0);v+=h.real
  samples.append(v/(1+z))
 coeff=[]
 for k in range(n):
  v=sum((s*(k*t).cos() for s,t in zip(samples,angles)),arb(0))*2/n
  if k==0:v/=2
  coeff.append(v)
 sup=sum((abs(v).upper() for v in coeff),arb(0));remainder=8*M/arb(2)**(n-1)
 # For H_T interpolation append the positive t-tail. Otherwise bound all H by BH(left).
 if include_H:
  tail=arb(2).log()/2*(-arb(300)).exp()*(arb(4)/3*(arb(80)/3).exp()+2*arb(160).exp())/(1+A(left))
 else:tail=BH(A(left))/(1+A(left))
 bound=sup+remainder+tail
 row={'left':str(left),'width':str(width),'n':n,'H_interpolated':include_H,'polynomial_l1':sup.str(30),'analytic_remainder':remainder.str(30),'tail':tail.str(30),'bound':bound.str(30),'proved_below_eps':bool(bound<eps)};rows.append(row)
 (C/'PROGRESS795.json').write_bytes((json.dumps({'status':'partial, not a global certificate','segments':rows,'seconds':time.monotonic()-start},indent=2)+'\n').encode())
 print(json.dumps({'left':str(left),'bound':bound.str(12),'passed':row['proved_below_eps'],'seconds':time.monotonic()-start}),flush=True)
 assert bound<eps,row
 if bound>maxbound:maxbound=bound
for j in range(101,130):segment(Fraction(j,2),Fraction(1,2),64,True)
(C/'WORKER795.json').write_bytes((json.dumps({'status':'completed disjoint component only, not whole global certificate','segments':rows,'seconds':time.monotonic()-start,'code_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},indent=2)+'\n').encode())
