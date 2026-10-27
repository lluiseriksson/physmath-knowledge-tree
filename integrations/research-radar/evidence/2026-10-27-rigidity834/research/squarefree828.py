from itertools import combinations
from pathlib import Path
import json, hashlib, datetime
import sympy as s
C=Path(__file__).parent
x,y=s.symbols('x y')
grid=[(i,j) for i in range(3) for j in range(3)]
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def hull(points):
 p=sorted(points)
 if len(p)<=1:return p
 lower=[];upper=[]
 for a in p:
  while len(lower)>=2 and cross(lower[-2],lower[-1],a)<=0:lower.pop()
  lower.append(a)
 for a in reversed(p):
  while len(upper)>=2 and cross(upper[-2],upper[-1],a)<=0:upper.pop()
  upper.append(a)
 return lower[:-1]+upper[:-1]
def inside(h,p):
 if len(h)==1:return p==h[0]
 if len(h)==2:return cross(h[0],h[1],p)==0 and all(min(h[0][i],h[1][i])<=p[i]<=max(h[0][i],h[1][i]) for i in range(2))
 return all(cross(h[i],h[(i+1)%len(h)],p)>=0 for i in range(len(h)))
supports=set()
for k in range(1,10):
 for a in combinations(grid,k):
  h=hull(a);supports.add(tuple(p for p in grid if inside(h,p)))
rows=[]
for a in sorted(supports):
 shift=[min(p[i] for p in a) for i in range(2)]
 F=s.Poly(sum(x**(i-shift[0])*y**(j-shift[1]) for i,j in a),x,y)
 g=s.gcd(s.gcd(F,F.diff(x)),F.diff(y))
 assert g.total_degree()==0,(a,g)
 rows.append(dict(support=a,affine_dimension=0 if len(a)==1 else (1 if len(hull(a))==2 else 2),squarefree=True))
negative=1+x+x**3+x**4
g=s.gcd(s.Poly(negative,x),s.Poly(s.diff(negative,x),x))
assert g.as_expr()==x+1
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='All lattice polytopes with vertices in fixed3x3grid; exact rational polynomial gcds after clearing monomial units; finite controls only',squarefree_count=len(rows),failures=0,dimensions={str(k):sum(r['affine_dimension']==k for r in rows) for k in range(3)},negative_control=dict(polynomial=str(negative),gcd=str(g.as_expr()),missing_lattice_point=[2,0],purpose='Squarefree fails for nonsaturated0/1support'),rows=rows,script_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
(C/'SQUAREFREE828.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in out.items() if k!='rows'}))
