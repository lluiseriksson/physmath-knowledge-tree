from pathlib import Path
from fractions import Fraction as Q
import json
C=Path(__file__).parent
f={(-1,-1):Q(6,5),(-1,0):Q(5,6),(-1,1):Q(1,10),(0,-1):Q(5,6),(0,0):Q(1),(0,1):Q(6,5),(1,-1):Q(1,10),(1,0):Q(6,5),(1,1):Q(5,6)}
def multiply(a,b):
 out=[Q(0)]*(len(a)+len(b)-1)
 for i,x in enumerate(a):
  for j,y in enumerate(b):out[i+j]+=x*y
 return out
cert=[]
for axis in [0,1]:
 slices=[[f[(i,j) if axis==0 else (j,i)] for j in [-1,0,1]] for i in [-1,0,1]]
 lhs=multiply(slices[1],slices[1]);rhs=multiply(slices[0],slices[2]);D=[a-b for a,b in zip(lhs,rhs)];assert all(c>0 for c in D)
 for j in [-1,0,1]:
  row=[f[(i,j) if axis==0 else (j,i)] for i in [-1,0,1]];assert row[1]**2>=row[0]*row[2]
 cert.append([str(x) for x in D])
assert cert==[['517/900','43/300','99/100','1427/900','407/300']]*2
co=[sum((v**4*Q(1,10)**b[1] for b,v in f.items() if b[0]==i),Q(0)) for i in [-1,0,1]];gap=co[1]**2-co[0]*co[2];assert gap==Q(-21099889384277,2430000000000)
midpoints=0
for a in f:
 for c in f:
  if a>=c or any((a[j]+c[j])%2 for j in range(2)):continue
  b=tuple((a[j]+c[j])//2 for j in range(2));assert f[b]**2>=f[a]*f[c];midpoints+=1
assert f[0,0]**3 < f[-1,-1]*f[1,0]*f[0,1]
print(json.dumps({'stdlib_fraction_only':True,'LC_certificates':cert,'fourth_power_failure':str(gap),'global_coeff_Jensen_fails':True,'TU_realization_claimed':False,'integer_midpoint_pairs_checked':midpoints},indent=2))
