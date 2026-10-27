from pathlib import Path
import sympy as q,json,itertools
p=Path(__file__).parent;s=q.symbols('s',real=True)
def weights(t):
 a,b,c=t
 return [(1+a+b+c)/4,(1+a-b-c)/4,(1-a+b-c)/4,(1-a-b+c)/4]
def h(w):return q.factor(1-16/sum(1/x for x in w))
plus=16*(1+2*s)/((1+3*s)*(1-s));minus=16*(1-2*s)/((1-3*s)*(1+s))
checks={'plus':q.factor(sum(1/w for w in weights((s,s,s)))-plus)==0,
 'minus':q.factor(sum(1/w for w in weights((-s,-s,-s)))-minus)==0,
 'difference':q.factor(minus-plus-192*s**3/((1-9*s*s)*(1-s*s)))==0,
 'negative_isotropic':q.factor(h(weights((-s,-s,-s)))-3*s*s/(1-2*s))==0,
 'axis':q.factor(h(weights((-s,0,0)))-s*s)==0,
 'boundary_weights':weights((-s,-(1-s)/2,-(1-s)/2))==[0,(1-s)/2,(1+s)/4,(1+s)/4],
 'meet':q.factor((3*s*s/(1-2*s)).subs(s,q.Rational(1,3))-1)==0}
for signs in itertools.product([-1,1],repeat=3):
 val=q.factor(sum(1/w for w in weights(tuple(sign*s for sign in signs))))
 checks['vertex'+str(signs)]=q.factor(val-plus)==0 or q.factor(val-minus)==0
assert all(checks.values()),checks
out={'scope':'Parent exact scalar/endpoint checks for candidate envelope, CONDITIONAL on997; not a complete proof audit or new manuscript score','checks':checks,'count':len(checks),'failures':0,'bound':'s^2 <= completeSLD <= 3s^2/(1-2s) for s<=1/3; upper1 above1/3; all intermediate values attained','max_stabilization_factor':9,'independence_claimed':False}
(p/'CHECK1003.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,indent=2))
