"""Exact interval rejection of a naive four-argument extension of Fang's lemma.

No statement about failure of norm compression or channel additivity follows.
"""
from fractions import Fraction as Q
from math import isqrt
import json
from pathlib import Path
if not __debug__:raise SystemExit('Refusing optimized Python: assertions required')
BITS=100
def sqrt_bounds(x):
    assert x>=0
    den=1<<BITS;k=isqrt((x.numerator<<(2*BITS))//x.denominator)
    lo=Q(k,den);hi=Q(k+1,den)
    if lo*lo==x:hi=lo
    assert lo*lo<=x<=hi*hi
    return lo,hi
def power32_bounds(lo,hi):
    a,_=sqrt_bounds(lo);_,b=sqrt_bounds(hi)
    return lo*a,hi*b
def F_bounds(r):
    # P=Q=1, R=S=r; Z=[[2,sqrt(r)],[sqrt(r),2r]].
    a,b=sqrt_bounds(Q(r*r-r+1))
    plus=power32_bounds(Q(1+r)+a,Q(1+r)+b)
    minus=power32_bounds(Q(1+r)-b,Q(1+r)-a)
    rr=power32_bounds(Q(r),Q(r))
    return Q(2)+2*rr[0]-plus[1]-minus[1],Q(2)+2*rr[1]-plus[0]-minus[0]
f1,f2,f3=[F_bounds(r) for r in [1,2,3]]
lo=f2[0]-(f1[1]+f3[1])/2
hi=f2[1]-(f1[0]+f3[0])/2
assert lo>Q(19,100) and hi<Q(1,5)
# At s=2 the same midpoint gap is exactly two; this is only a control.
f_sq=lambda r:Q(-2-2*r*r-2*r)
assert f_sq(2)-(f_sq(1)+f_sq(3))/2==2
result={'status':'EXACT_COUNTEREXAMPLE_TO_NAIVE_JOINT_CONVEXITY',
 'functional':'F_s(P,Q,R,S)=Tr(P^s+Q^s+R^s+S^s)-Tr([[P+Q,sqrtQ sqrtR],[sqrtR sqrtQ,R+S]]^s)',
 'fixed_argument':'Q=1; also P=1 along this line','power':'s=3/2',
 'endpoints':[[1,1,1,1],[1,1,3,3]],'midpoint':[1,1,2,2],
 'midpoint_minus_average_interval':{'lower':str(lo),'upper':str(hi)},
 'coarse_exact_bound':'19/100 < midpoint gap < 1/5',
 'bits':BITS,'numeric_illustration':[float(lo),float(hi)],
 'scope':'rejects joint convexity in(P,R,S) for fixedQ; Fang original S=0 lemma is not contradicted; neither norm compression nor additivity refuted'}
(Path(__file__).parent/'convexity546-obstruction.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps(result,indent=2))
