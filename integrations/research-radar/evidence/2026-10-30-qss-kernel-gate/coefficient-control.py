from pathlib import Path
from collections import defaultdict
from fractions import Fraction as F
import json,hashlib,urllib.request,datetime
W=Path(__file__).resolve().parent
sha=lambda b:hashlib.sha256(b).hexdigest()
p=W.parent/'2026-10-29-qss-uniform-sector'/'M-COEFFICIENTS1317.json';b=p.read_bytes();input_sha=sha(b);assert input_sha=='6545a2ea350b92892fc83ae6af2f426bd6dbff9fb5e039507d7b3b38511dc82b';old=[dict(x) for x in json.loads(b)['matrices']]
digs=lambda x:(x//9,(x//3)%3,x%3);enc=lambda t:9*t[0]+3*t[1]+t[2]
A=defaultdict(int)
for bp in range(27):
 for rp in range(27):
  bd,rd=digs(bp),digs(rp)
  for mask in range(8):
   bb=enc(tuple(rd[i] if mask&(1<<i) else bd[i] for i in range(3)))
   rr=enc(tuple(bd[i] if mask&(1<<i) else rd[i] for i in range(3)))
   A[(bb*27+rr,bp*27+rp)]+=(-1)**mask.bit_count()*2**(3-mask.bit_count())
A={k:v for k,v in A.items() if v}
supports=[{enc((t,(t+j)%3,(t+2*j)%3)) for t in range(3)} for j in range(3)]
assert [[len(x&y) for y in supports] for x in supports]==[[3 if i==j else 0 for j in range(3)] for i in range(3)]
M=[defaultdict(int) for _ in range(3)];H=[[defaultdict(int) for _ in range(3)] for _ in range(3)]
for (row,col),z in A.items():
 b,r=divmod(row,27);t,s=divmod(col,27)
 for j,sup in enumerate(supports):
  if s in sup:M[j][(t*27+r)*27+b]+=z # Gamma_FIRST(A) J_j
 for i,si in enumerate(supports):
  if r not in si:continue
  for j,sj in enumerate(supports):
   if s in sj:H[i][j][(b,t)]+=z
for j in range(3):
 M[j]={k:v for k,v in M[j].items() if v};assert M[j]==old[j]
checks=[]
for i,si in enumerate(supports):
 for j in range(3):
  T=defaultdict(int)
  for key,z in M[j].items():
   row,t=divmod(key,27);b,r=divmod(row,27)
   if r in si:T[(b,t)]+=z
  T={k:v for k,v in T.items() if v};target={(t,b):z for (b,t),z in H[i][j].items() if z}
  assert T==target
  checks.append({'i':i,'j':j,'J_i_star_M_j_equals_H_ij_transpose':True})

print(json.dumps({"A_nonzero":len(A),"A_scale":8,"M_nonzero":[len(x) for x in M],"input_sha256":input_sha,"M_equals_Gamma_FIRST_A_times_J_all_three_coefficients":True,"nine_cross_coefficient_checks":checks,"W_star_W":"3I3"},indent=2))
