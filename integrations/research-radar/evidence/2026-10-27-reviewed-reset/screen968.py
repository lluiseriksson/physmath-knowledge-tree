"""Bounded finite-information screen within one explicitly PPT two-qubit family.
Not a global optimization, novelty claim, proof, paper or new assessment.
"""
from pathlib import Path
import json,math
def f(z):return z*math.log(z) if z>0 else 0.
def info(x,r,e,l=1.):
 u=l*(1-x)+(1-l)/2;v=l*x+(1-l)/2
 a,b=u*(1-r),v*r
 a1,b1=a,b
 disc=math.sqrt((a-b)**2+4*l*l*e*e)
 plus=(a+b+disc)/2
 minus=(a*b-l*l*e*e)/plus
 return f(plus)+f(max(0.,minus))-f(a1)-f(b1)
rows=[]
for ix in range(1,50):
 x=ix/100
 for ir in range(1,100):
  r=ir/200
  limit=math.sqrt(x*(1-x)*r*(1-r))
  for scale in [.2,.5,.8,1.]:
   e=scale*limit
   mi=info(x,r,e)
   if mi<=0:continue
   q=info(x,r,e,.5)/mi
   if q>.25+1e-8:
    rows.append(dict(x=x,r=r,e=e,scale=scale,input_MI=mi,ratio=q))
out=dict(scope='19404 finite cases in one X-state family; double precision screening, not proof or global bound',
 admissibility='PPT and positivity iff e^2<=x(1-x)r(1-r); two qubits imply separable',
 passing=len(rows),largest_MI=max(rows,key=lambda z:z['input_MI']) if rows else None,
 largest_ratio=max(rows,key=lambda z:z['ratio']) if rows else None,
 best_by_floor={str(floor):max((z for z in rows if z['input_MI']>=floor),key=lambda z:z['ratio'],default=None) for floor in [.0001,.001,.01,.02,.05,.1]},
 no_global_optimization=True,no_score=True)
Path(__file__).with_name('SCREEN968.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,indent=2))
