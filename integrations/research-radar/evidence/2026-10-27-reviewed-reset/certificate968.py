"""Exact rational interval certificate, not floating-point evidence.
Natural logs via positive atanh series after dyadic range reduction.
"""
from fractions import Fraction as F
from math import isqrt
from pathlib import Path
import json
def add(a,b):return a[0]+b[0],a[1]+b[1]
def neg(a):return -a[1],-a[0]
def mul(a,b):
 z=[x*y for x in a for y in b]
 return min(z),max(z)
def scale(a,c):return mul(a,(c,c))
def sqrt_bounds(x,digits=28):
 s=10**digits;n=isqrt(x.numerator*s*s//x.denominator)
 lo=F(n,s)
 return lo,lo if lo*lo==x else F(n+1,s)
def log_unit(x,N=40):
 assert 1<=x<=2
 z=(x-1)/(x+1);p=z;total=F(0)
 for j in range(N):
  total+=2*p/(2*j+1);p*=z*z
 remainder=2*p/((2*N+1)*(1-z*z))
 return total,total+remainder
LOG2=log_unit(F(2))
def log_exact(x):
 assert x>0
 k=0;y=x
 while y<1:y*=2;k-=1
 while y>=2:y/=2;k+=1
 return add(log_unit(y),scale(LOG2,F(k)))
def entropy_term(interval):
 lo,hi=interval
 return mul((lo,hi),(log_exact(lo)[0],log_exact(hi)[1]))
def info(lam):
 x,r,e=F(3,10),F(3,100),F(1,25)
 u=lam*(1-x)+(1-lam)/2;v=1-u
 a,b=u*(1-r),v*r
 delta=sqrt_bounds((a-b)**2+4*lam*lam*e*e)
 plus=scale(add((a+b,a+b),delta),F(1,2))
 minus=scale(add((a+b,a+b),neg(delta)),F(1,2))
 assert minus[0]>0
 out=add(entropy_term(plus),entropy_term(minus))
 out=add(out,neg(entropy_term((a,a))))
 return add(out,neg(entropy_term((b,b))))
mi=info(F(1));out=info(F(1,2))
margin=add(out,neg(scale(mi,F(257,1000))))
assert mi[0]>F(1,100)
assert margin[0]>F(1,200000)
assert F(1,25)**2<F(3,10)*F(7,10)*F(3,100)*F(97,100)
def outward(a,den=10**15):
 lo=(a[0]*den).__floor__();hi=-(-a[1]*den).__floor__()
 return dict(lower=str(F(lo,den)),upper=str(F(hi,den)))
result=dict(status='exact rational certificate passed',parameters=dict(x='3/10',r='3/100',coherence='1/25',lambda_='1/2'),
 input_MI=outward(mi),output_MI=outward(out),margin_above_257_1000=outward(margin),
 claims=['I_input>1/100 nats','I_output/I_input>257/1000>1/4','input is explicitly separable; all entries rational'],
 method=dict(sqrt_decimal_enclosure_digits=28,atanh_terms=40,dyadic_log_range='[1,2]',tail='2 z^(2N+1)/[(2N+1)(1-z^2)]'),
 limits=['one finite witness, not optimum under an information floor','no estimation protocol or sample-complexity theorem','not reviewed, no novelty/importance score','not part of frozen957 or review958'])
Path(__file__).with_name('CERTIFICATE968.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,indent=2))
