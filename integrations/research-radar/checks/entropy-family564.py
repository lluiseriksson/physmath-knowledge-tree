"""Bounded exact interval certificate for a fixed-pair metric majorant."""
from fractions import Fraction as F
from math import isqrt
import pathlib,json,time,sys
ROOT=pathlib.Path(__file__).parent;BITS=32;TARGET=F(27,100)
def require(b,m):
 if not b:raise RuntimeError(m)
class I:
 def __init__(self,lo,hi=None):self.lo=F(lo);self.hi=F(lo if hi is None else hi)
 def __add__(x,y):
  if not isinstance(y,I):y=I(y)
  return I(x.lo+y.lo,x.hi+y.hi)
 __radd__=__add__
 def __neg__(x):return I(-x.hi,-x.lo)
 def __sub__(x,y):return x+-I(y) if not isinstance(y,I) else x+-y
 def __rsub__(x,y):return I(y)+-x
 def __mul__(x,y):
  if not isinstance(y,I):y=I(y)
  a=[x.lo*y.lo,x.lo*y.hi,x.hi*y.lo,x.hi*y.hi];return I(min(a),max(a))
 __rmul__=__mul__
 def square(x):return I(0 if x.lo<=0<=x.hi else min(x.lo*x.lo,x.hi*x.hi),max(x.lo*x.lo,x.hi*x.hi))
 def inv(x):
  require(x.lo>0,'division through zero');return I(1/x.hi,1/x.lo)
 def sqrt(x):
  require(x.lo>=0,'negative root range');scale=1<<BITS
  k=isqrt(x.lo.numerator*scale*scale//x.lo.denominator);j=isqrt(x.hi.numerator*scale*scale//x.hi.denominator)+1
  lo,hi=F(k,scale),F(j,scale)
  require(lo*lo<=x.lo and hi*hi>=x.hi,'root enclosure failed');return I(lo,hi)
def metric(R,z,c,r,t,Qmax):
 u2=1-z.square();A=c*c-r*r
 q=R.square()*c*c*u2+(R*r*z+t).square()
 q=I(max(0,q.lo),min(Qmax,q.hi));d=(1-q)*F(1,4);s=d.sqrt();si=s.inv()
 gamma=(d*(1+2*s)).inv()
 normal=c*c*u2+r*r*z.square();dot=R*normal+r*t*z
 a=2*(c*c*z.square()+r*r*u2)*si+gamma*u2*(R*A*z-r*t).square()
 b=2*c*c*si;k=2*normal*si+gamma*dot.square()
 h2=u2*(2*A*z*si+gamma*(R*A*z-r*t)*dot).square()
 return a.hi,b.hi,k.hi,h2.hi
def bound(box):
 R,z,w=[I(*p) for p in box]
 an,bn,kn,hn=metric(R,z,I(F(11,20),F(3,5)),F(1,4),F(1,5),F(243,595))
 aq,bq,kq,hq=metric(R,w,I(F(1,2),F(11,20)),F(1,5),F(1,10),F(13189,42000))
 C2=1-R.lo*R.lo;cross=I(C2*hn*hq).sqrt().hi
 return (an*aq+bn*bq+2*cross+C2*kn*kq)/16
def verify(doc):
 require(doc['bits']==BITS and doc['target']==str(TARGET),'fixed theorem settings')
 # A complete binary partition is replayed from its root; the path identifies
 # each exact box, making gaps, overlaps and invented covers inadmissible.
 leaves={x['path']:x['upper'] for x in doc['leaves']};require(len(leaves)==len(doc['leaves']),'duplicate paths')
 visited=set();stack=[('',((F(0),F(1)),(F(-1),F(1)),(F(-1),F(1))))]
 while stack:
  path,box=stack.pop()
  if path in leaves:
   u=bound(box);require(u==F(leaves[path]) and u<=TARGET,'failed cell bound');visited.add(path);continue
  require(len(path)<36,'missing leaf or depth exceeded')
  axis=len(path)%3;lo,hi=box[axis];mid=(lo+hi)/2
  for digit,pair in [('0',(lo,mid)),('1',(mid,hi))]:
   child=list(box);child[axis]=pair;stack.append((path+digit,tuple(child)))
 require(visited==set(leaves),'unreachable leaf')
 return dict(status='PASS',cells=len(leaves),uniform_metric_bound=str(TARGET),scope='rational arithmetic of global metric majorant only; analytic entropy implication is a separate proof obligation')
beg=time.time();p=ROOT/'entropy-family564.json'
if len(sys.argv)>1 and sys.argv[1]=='verify':
 print(json.dumps(verify(json.loads(p.read_text())),indent=2))
else:
 leaves=[];stack=[('',((F(0),F(1)),(F(-1),F(1)),(F(-1),F(1))))];tested=0
 while stack:
  path,box=stack.pop();u=bound(box);tested+=1
  require(tested<=60000 and time.time()-beg<120,'fixed computation cap reached')
  if u<=TARGET:leaves.append(dict(path=path,upper=str(u)))
  else:
   require(len(path)<36,'depth cap reached')
   axis=len(path)%3;lo,hi=box[axis];mid=(lo+hi)/2
   for digit,pair in [('1',(mid,hi)),('0',(lo,mid))]:
    child=list(box);child[axis]=pair;stack.append((path+digit,tuple(child)))
 doc=dict(bits=BITS,target=str(TARGET),leaves=leaves)
 result=verify(doc);p.write_text(json.dumps(doc,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(dict(result=result,tested=tested,seconds=time.time()-beg),indent=2))
