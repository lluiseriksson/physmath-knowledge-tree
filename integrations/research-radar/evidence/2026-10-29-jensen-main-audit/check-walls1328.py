"""Fixed exact C1 wall-gluing check on all62 transformed source chambers.
No random probes, polynomial interpolation or stronger regularity assumption."""
from fractions import Fraction as F
from itertools import permutations,product
import json,pathlib,hashlib,traceback,time
P=pathlib.Path(__file__).resolve().parent
INPUT=(P/"RESULT1326.json")
EXPECTED="cc067bd12ea39cde9606ad6b6e06e4102555ad19b939ebf8d714cff6d687bea1"
pairs=[(i,j) for i in range(4) for j in range(4) if i!=j]
ZERO=(0,)*12
def form(ts):
 r=[F(0)]*12
 for p,v in ts:r[pairs.index(p)]+=v
 return tuple(r)
g=[
form([((0,2),1),((1,3),1),((0,3),-1),((1,2),-1)]),
form([((2,0),1),((3,1),1),((2,1),-1),((3,0),-1)]),
form([((0,1),1),((2,3),1),((0,3),-1),((2,1),-1)]),
form([((1,0),1),((3,2),1),((1,2),-1),((3,0),-1)]),
form([((0,1),1),((3,2),1),((0,2),-1),((3,1),-1)]),
form([((1,0),1),((2,3),1),((1,3),-1),((2,0),-1)])]
tri=[form([((i,j),1),((j,k),1),((i,k),-1)]) for i,j,k in permutations(range(4),3)]
circuit=(-1,-1,1,1,-1,-1)
def dot(a,b):return sum((x*y for x,y in zip(a,b)),F(0))
def clean(p):return {k:v for k,v in p.items() if v}
def add(p,q):
 r=p.copy()
 for k,v in q.items():r[k]=r.get(k,F(0))+v
 return clean(r)
def scale(p,s):return clean({k:v*s for k,v in p.items()})
def linear(r):
 d={}
 for i,v in enumerate(r):
  if v:k=list(ZERO);k[i]=1;d[tuple(k)]=v
 return d
def derivative(p,j):
 d={}
 for k,v in p.items():
  if k[j]:
   kk=list(k);kk[j]-=1;d[tuple(kk)]=v*k[j]
 return d
def divide_linear(p,row):
 pivot=next(i for i,v in enumerate(row) if v)
 r=p.copy();q={}
 while any(k[pivot] for k in r):
  k=max((k for k in r if k[pivot]),key=lambda k:(k[pivot],k))
  kk=list(k);kk[pivot]-=1;kk=tuple(kk);coeff=r[k]/row[pivot]
  q[kk]=q.get(kk,F(0))+coeff
  for j,v in enumerate(row):
   if v:
    e=list(kk);e[j]+=1;e=tuple(e)
    r[e]=r.get(e,F(0))-coeff*v
  r=clean(r)
 return clean(q),clean(r)
def det(M):
 a,b,c=M
 return sum(a[i]*(b[(i+1)%3]*c[(i+2)%3]-b[(i+2)%3]*c[(i+1)%3]) for i in range(3))
def solve(b):
 R=[list(row)+[v] for row,v in zip(g,b)];piv=[];r=0
 for j in range(12):
  k=next((k for k in range(r,6) if R[k][j]),None)
  if k is None:continue
  R[r],R[k]=R[k],R[r];v=R[r][j];R[r]=[x/v for x in R[r]]
  for k in range(6):
   if k!=r:
    v=R[k][j];R[k]=[x-v*y for x,y in zip(R[k],R[r])]
  piv.append(j);r+=1
  if r==6:break
 assert r==5
 assert all(any(row[:12]) or row[-1]==0 for row in R)
 a=[F(0)]*12
 for i,j in enumerate(piv):a[j]=R[i][-1]
 assert [dot(row,a) for row in g]==list(b)
 return a
def serial(p):return [dict(exponents=k,coefficient=str(v)) for k,v in sorted(p.items())]
def main():
 start=time.monotonic();b=INPUT.read_bytes();assert hashlib.sha256(b).hexdigest()==EXPECTED
 old=json.loads(b);assert old["status"]=="PASS_SELECTED_SIX_CHAMBER_FORMULA_RECONSTRUCTION"
 allc={};representations=0
 for ch in old["chambers"]:
  seed=[F(x) for x in ch["vertices"][0]["linear"][0]] if False else list(ch["signs"])
  # Recover the displayed actual seed, not a sign vector.
  S=[
 [29,20,11,19,21,20,20,11,29,21,20,19],
 [42,32,22,22,32,42,32,32,32,42,22,32],
 [50,36,24,26,36,48,48,24,34,36,36,34],
 [77,60,43,77,43,60,60,43,77,43,60,77],
 [78,60,44,60,44,78,78,44,60,44,60,78],
 [78,62,44,78,44,62,44,62,78,62,44,78]]
  seed=S[ch["seed"]-1]
  poly={tuple(x["exponents"]):F(x["coefficient"]) for x in ch["polynomial"]}
  for perm in permutations(range(4)):
   for trans in (False,True):
    mapping=[pairs.index((perm[j],perm[i]) if trans else (perm[i],perm[j])) for i,j in pairs]
    ss=[seed[k] for k in mapping];vals=[dot(r,ss) for r in g];assert all(vals)
    sig=tuple(1 if x>0 else -1 for x in vals)
    pp={tuple(k[mapping[q]] for q in range(12)):v for k,v in poly.items()}
    # Reanchored coordinate transform preserves both lattice and Euclidean volume.
    T=[[((-1 if trans else 1)*(int(perm[i]==j)-int(perm[3]==j))) for j in range(3)] for i in range(3)]
    assert abs(det(T))==1
    # The group permutes triangle rows and signed square-wall forms exactly.
    def transform_row(row):
     rr=[F(0)]*12
     for q,v in enumerate(row):rr[mapping[q]]+=v
     return tuple(rr)
    assert {transform_row(r) for r in tri}==set(tri)
    assert all(transform_row(r) in set(g)|{tuple(-v for v in x) for x in g} for r in g)
    representations+=1
    if sig in allc:assert allc[sig]["poly"]==pp
    else:allc[sig]=dict(poly=pp,representative=ch["seed"],perm=perm,transpose=trans)
 assert representations==288 and len(allc)==62
 assert set(product((-1,1),repeat=6))-set(allc)=={circuit,tuple(-v for v in circuit)}
 edges=[]
 for minus in sorted(allc):
  for j in range(6):
   if minus[j]!=-1:continue
   plus=list(minus);plus[j]=1;plus=tuple(plus)
   if plus not in allc:continue
   Vm={k:v for k,v in allc[minus]["poly"].items() if sum(k)==3}
   Vp={k:v for k,v in allc[plus]["poly"].items() if sum(k)==3}
   delta=add(Vp,scale(Vm,-1))
   q,rem=divide_linear(delta,g[j]);assert not rem
   qq,rem2=divide_linear(q,g[j]);assert not rem2
   for k in range(12):assert not divide_linear(derivative(delta,k),g[j])[1]
   df=add(allc[plus]["poly"],scale(allc[minus]["poly"],-1))
   assert add(df,scale(linear(g[j]),F(1,6)))==delta
   fq,frem=divide_linear(df,g[j]);assert not frem
   assert not divide_linear(add(fq,{ZERO:F(1,6)}),g[j])[1]
   # Witness strict triangles and exactly this one square wall.
   pos=[k for k in range(6) if k!=j and circuit[k]*minus[k]>0]
   neg=[k for k in range(6) if k!=j and circuit[k]*minus[k]<0]
   assert pos and neg
   target=[F(0)]*6
   for k in pos:target[k]=F(minus[k]*len(neg))
   for k in neg:target[k]=F(minus[k]*len(pos))
   assert dot(circuit,target)==0
   witness=solve(target)
   shift=max(F(1),1-min(dot(r,witness) for r in tri))
   witness=[x+shift for x in witness]
   assert all(dot(r,witness)>0 for r in tri) and dot(g[j],witness)==0
   assert all(dot(g[k],witness)*minus[k]>0 for k in range(6) if k!=j)
   edges.append(dict(minus=minus,plus=plus,wall=j,volume_double_factor_quotient=serial(qq),
      all12_volume_gradient_remainders_zero=True,F_normal_jump_coefficient="-1/6",
      strict_metric_wall_witness=[str(x) for x in witness]))
 assert len(edges)==180
 # Guard: modifying the constant destroys wall continuity and is detected.
 corrupted=add(add(allc[edges[0]["plus"]]["poly"],scale(allc[edges[0]["minus"]]["poly"],-1)),{ZERO:F(1)})
 assert divide_linear(corrupted,g[edges[0]["wall"]])[1]
 result=dict(status="PASS_EXACT_C1_VOLUME_WALL_GLUING_AND_DOWNWARD_COUNT_JUMPS",
 input_sha256=EXPECTED,script_sha256=hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),
 source_pdf_sha256="fefc3ad35c98e327cdabdf01b147393f561ba7d149f84c61c60f0e9304d11d9f",
 exact_arithmetic="Fraction; all12bound variables, polynomial quotient certificates",
 chamber_count=62,symmetry_representations=288,adjacent_feasible_walls=180,
 volume_gradient_remainder_checks=2160,
 all_wall_value_and_first_derivative_remainders_zero=True,
 F_directional_derivative_jump="minus to plus: -(d/ds)g_j /6; root factor positive when F>0",
 negative_control="altered constant detected as nonzero wall remainder",
 stronger_regularity_claimed=False,numeric_probe=False,
 duration_seconds=time.monotonic()-start,wall_certificates=edges,
 chambers=[dict(signs=sig,representative=c["representative"],perm=c["perm"],transpose=c["transpose"],polynomial=serial(c["poly"])) for sig,c in sorted(allc.items())],
 limits="Selected exact wall identities only. Global root concavity also uses prior chamber concavity, F>=1, finite-wall segment approximation; not executed by a theorem prover. Full source Theorem1.1, novelty, independent referee and score are not certified.",
 new_paper=False,formal_proof=False,model_assessment=False)
 with (P/"RESULT1328.json").open("w",encoding="utf-8",newline="\n") as f:json.dump(result,f,indent=2);f.write("\n")
 print(json.dumps({k:result[k] for k in ["status","chamber_count","adjacent_feasible_walls","volume_gradient_remainder_checks","duration_seconds"]}))
if __name__=="__main__":
 try:main()
 except Exception:
  with (P/"FAILURE1328.json").open("w",encoding="utf-8",newline="\n") as f:json.dump(dict(status="FAILED_NO_RESULT_CLAIM",traceback=traceback.format_exc()),f,indent=2);f.write("\n")
  raise
