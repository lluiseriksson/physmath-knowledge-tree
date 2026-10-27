from pathlib import Path
from itertools import product, combinations
from collections import defaultdict, Counter
from fractions import Fraction
import json, hashlib, datetime
from sympy import Matrix

C=Path(__file__).parent
matrices={
 'sum3': [[1,1,1]],
 'signed3': [[1,-1,1]],
 'blocks4': [[1,1,0,0],[0,0,1,1]],
 'triangle3': [[1,0,-1],[0,1,-1]],
 'parallel4': [[1,0,-1,1],[0,1,-1,0]],
 'identity2': [[1,0],[0,1]],
}
rows=[]
for name,M in matrices.items():
 n=len(M[0]);r=len(M)
 minors=[int(Matrix(M)[:,list(cols)].det()) for cols in combinations(range(n),r)]
 assert any(minors) and all(abs(d)<=1 for d in minors)
 for width in [1,2,3]:
  fibers=defaultdict(list)
  for x in product(range(width+1),repeat=n):
   b=tuple(sum(a*t for a,t in zip(row,x)) for row in M)
   fibers[b].append(x)
  sums={b:Counter(tuple(xi+yi for xi,yi in zip(x,y)) for x in X for y in X) for b,X in fibers.items()}
  extrema={b:([min(x[i] for x in X) for i in range(n)],[max(x[i] for x in X) for i in range(n)]) for b,X in fibers.items()}
  tested=equal=translated=0
  for bm,bp in combinations(fibers,2):
   if any((a+b)%2 for a,b in zip(bm,bp)): continue
   b0=tuple((a+b)//2 for a,b in zip(bm,bp))
   assert b0 in fibers
   cross=Counter(tuple(a+b for a,b in zip(x,y)) for x in fibers[bm] for y in fibers[bp])
   D={a:sums[b0][a]-cross[a] for a in sums[b0].keys()|cross.keys()}
   assert all(v>=0 for v in D.values()),(name,width,bm,bp,'coefficientwise failure')
   eq=not any(D.values())
   m0,U0=extrema[b0];mp,Up=extrema[bp];mm,Um=extrema[bm]
   h=[a-b for a,b in zip(mp,m0)]
   alg=(all(sum(a*t for a,t in zip(row,h))==p-b for row,p,b in zip(M,bp,b0))
        and Up==[a+b for a,b in zip(U0,h)]
        and mm==[a-b for a,b in zip(m0,h)]
        and Um==[a-b for a,b in zip(U0,h)])
   direct=(set(fibers[bp])=={tuple(a+b for a,b in zip(x,h)) for x in fibers[b0]}
       and set(fibers[bm])=={tuple(a-b for a,b in zip(x,h)) for x in fibers[b0]})
   assert eq==alg==direct,(name,width,bm,bp,eq,alg,direct)
   if width==1: assert not eq
   tested+=1;equal+=eq;translated+=direct
  rows.append(dict(matrix=name,M=M,width=width,fibers=len(fibers),midpoint_triples=tested,equalities=equal,translations=translated,maximal_minors=minors))
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='Exact finite controls, not a general proof, LP implementation or research capsule',rows=rows,total_triples=sum(z['midpoint_triples'] for z in rows),equalities=sum(z['equalities'] for z in rows),failures=0,script_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
(C/'CONTROLS823.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in out.items() if k!='rows'}))
