"""Exact finite classical witnesses; not a quantum proof or novelty audit."""
from fractions import Fraction as F
from pathlib import Path
import json
cases=[]
for d in range(1,9):
 for N in range(1,12):
  m=min(d,N)
  for r in (F(0),F(1,10),F(1,3),F(1,2),F(1)):
   if m==1:
    # Constant channel, split its sole outcome into N labels.
    P=[[F(1,N) for i in range(d)] for a in range(N)]
   else:
    s=min(F(1),(m-1)*r)
    # d input basis labels are sent surjectively to m effective classes.
    # Split class zero into N-m+1 identical prepared-state labels.
    P=[]
    for a in range(m):
     copies=N-m+1 if a==0 else 1
     row=[((1-s)/m+s*F(int(a!=i%m),m-1))/copies for i in range(d)]
     P.extend([row[:] for _ in range(copies)])
   assert len(P)==N
   assert all(sum(P[a][i] for a in range(N))==1 for i in range(d))
   eta=max(sum(abs(P[a][i]-P[a][j]) for a in range(N))/2 for i in range(d) for j in range(d))
   b=sum(min(row) for row in P)
   target=max(F(0),1-(m-1)*r)
   assert eta<=r and b==target,(d,N,r,eta,b,target)
   cases.append({'d':d,'N':N,'r':str(r),'eta':str(eta),'b':str(b),'target':str(target)})
out={'scope':'440 exact classical witness cases; constructive finite calibration only, not full quantum theorem certification','cases':cases,'all_pass':True}
(Path(__file__).parent/'JOINT1212.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'cases':len(cases),'all_pass':True}))
