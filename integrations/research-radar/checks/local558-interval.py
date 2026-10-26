"""Exact rational interval certificate for two univariate weighted norms."""
from fractions import Fraction as F
from math import isqrt
import json,pathlib,sys
ROOT=pathlib.Path(__file__).parent
BITS=48
def require(b,m):
 if not b:raise RuntimeError(m)
def sqrt_bounds(x):
 require(x>0,'positive square-root argument')
 scale=1<<BITS;k=isqrt(x.numerator*scale*scale//x.denominator)
 lo=F(k,scale);hi=F(k+1,scale)
 require(lo*lo<=x<=hi*hi,'invalid square-root enclosure')
 return lo,hi
def bound(c,r,t,lo,hi):
 require(-1<=lo<hi<=1,'domain interval')
 A=c*c-r*r;z0=r*t/A
 def q(z):return c*c*(1-z*z)+(r*z+t)**2
 qlo=min(q(lo),q(hi));qhi=max(q(lo),q(hi))
 if lo<=z0<=hi:qhi=max(qhi,q(z0))
 require(0<qlo<=qhi<1,'Bloch interval')
 dlo=(1-qhi)/4;dhi=(1-qlo)/4
 sqrtlo,_=sqrt_bounds(dlo);_,sqrthi=sqrt_bounds(dhi)
 z2lo=F(0) if lo<=0<=hi else min(lo*lo,hi*hi);z2hi=max(lo*lo,hi*hi)
 hs_hi=(c*c+r*r+A*z2hi)/2
 ell_hi=(1-z2lo)*max((A*lo-r*t)**2,(A*hi-r*t)**2)/(4*qlo)
 coefficient_hi=1/dlo-2/sqrthi
 require(coefficient_hi>=0,'coefficient sign')
 upper=hs_hi/sqrtlo+ell_hi*coefficient_hi
 return upper
def build(name,c,r,t,target):
 todo=[(F(-1),F(1),0)];leaves=[]
 while todo:
  lo,hi,depth=todo.pop();u=bound(c,r,t,lo,hi)
  if u<=target:leaves.append({'lo':str(lo),'hi':str(hi),'upper':str(u)})
  else:
   require(depth<16,'certificate did not close within fixed subdivision cap')
   mid=(lo+hi)/2;todo.extend([(mid,hi,depth+1),(lo,mid,depth+1)])
 leaves.sort(key=lambda d:F(d['lo']))
 return {'name':name,'c':str(c),'r':str(r),'t':str(t),'target':str(target),'leaves':leaves}
def verify(doc):
 require(doc['sqrt_bits']==BITS,'sqrt mesh changed')
 expected=[('N','3/5','1/4','1/5','17/20'),('Q','11/20','1/5','1/10','7/10')]
 require(len(doc['cases'])==len(expected),'wrong case count')
 for case,spec in zip(doc['cases'],expected):
  require(tuple(case[k] for k in ['name','c','r','t','target'])==spec,'case identity/parameters/bound differ from theorem')
 for case in doc['cases']:
  c,r,t,target=map(F,[case['c'],case['r'],case['t'],case['target']]);last=F(-1)
  for cell in case['leaves']:
   lo,hi=F(cell['lo']),F(cell['hi']);require(lo==last,'gap/overlap/order in cover')
   u=bound(c,r,t,lo,hi);require(u==F(cell['upper']) and u<=target,'failed rational norm bound');last=hi
  require(last==1,'domain not covered')
 margin=2*(F(3,5)**2+F(11,20)**2)-2*F(17,20)*F(7,10)
 require(margin==F(27,200),'margin arithmetic')
 return {'status':'PASS','cells':[len(c['leaves']) for c in doc['cases']],'norm_bounds':[c['target'] for c in doc['cases']],'kappa_natural_lower_bound':str(margin),'scope':'weighted-norm interval bounds only; analytic Hessian link is a separate proof obligation'}
path=ROOT/'local558-interval-certificate.json'
if len(sys.argv)>1 and sys.argv[1]=='verify':
 print(json.dumps(verify(json.loads(path.read_text())),indent=2))
else:
 doc={'sqrt_bits':BITS,'cases':[build('N',F(3,5),F(1,4),F(1,5),F(17,20)),build('Q',F(11,20),F(1,5),F(1,10),F(7,10))]}
 result=verify(doc);path.write_text(json.dumps(doc,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2))
