"""One fixed six-chamber exact reconstruction. Own implementation.
No foreign supplement, random search, interpolation, numeric hull or eigensolver.
Selected source pp4-5; not a complete Jensen/Lorentzian proof."""
from fractions import Fraction as F
from itertools import combinations,permutations,product
from math import gcd,factorial
from functools import reduce
import pathlib,json,hashlib,traceback,time
P=pathlib.Path(__file__).resolve().parent
pairs=[(i,j) for i in range(4) for j in range(4) if i!=j]
A=[tuple(int(i==k)-int(j==k) for k in range(3)) for i,j in pairs]
seeds=[
[29,20,11,19,21,20,20,11,29,21,20,19],
[42,32,22,22,32,42,32,32,32,42,22,32],
[50,36,24,26,36,48,48,24,34,36,36,34],
[77,60,43,77,43,60,60,43,77,43,60,77],
[78,60,44,60,44,78,78,44,60,44,60,78],
[78,62,44,78,44,62,44,62,78,62,44,78]]
def det(M):
 a,b,c=M
 return sum(a[i]*(b[(i+1)%3]*c[(i+2)%3]-b[(i+2)%3]*c[(i+1)%3]) for i in range(3))
def inv(M):
 d=det(M); assert d
 def minor(i,j):
  C=[[M[r][s] for s in range(3) if s!=j] for r in range(3) if r!=i]
  return C[0][0]*C[1][1]-C[0][1]*C[1][0]
 return [[F((-1)**(i+j)*minor(j,i),d) for j in range(3)] for i in range(3)]
def dot(a,b): return sum((x*y for x,y in zip(a,b)),F(0))
def norm(r):
 assert all(x.denominator==1 for x in r)
 t=tuple(int(x) for x in r); d=reduce(gcd,(abs(x) for x in t),0)
 return tuple(x//d for x in t) if d else None
def form(terms):
 r=[F(0)]*12
 for p,v in terms: r[pairs.index(p)]+=v
 return r
g=[
form([((0,2),1),((1,3),1),((0,3),-1),((1,2),-1)]),
form([((2,0),1),((3,1),1),((2,1),-1),((3,0),-1)]),
form([((0,1),1),((2,3),1),((0,3),-1),((2,1),-1)]),
form([((1,0),1),((3,2),1),((1,2),-1),((3,0),-1)]),
form([((0,1),1),((3,2),1),((0,2),-1),((3,1),-1)]),
form([((1,0),1),((2,3),1),((1,3),-1),((2,0),-1)])]
tri=[form([((i,j),1),((j,k),1),((i,k),-1)]) for i,j,k in permutations(range(4),3)]
def signs(s):
 v=[dot(x,s) for x in g]; assert all(v)
 return tuple(1 if x>0 else -1 for x in v)
ZERO=(0,)*12
def clean(p): return {k:v for k,v in p.items() if v}
def add(p,q):
 r=p.copy()
 for k,v in q.items(): r[k]=r.get(k,F(0))+v
 return clean(r)
def scale(p,s): return clean({k:v*s for k,v in p.items()})
def pmul(p,q):
 r={}
 for a,x in p.items():
  for b,y in q.items():
   k=tuple(u+v for u,v in zip(a,b));r[k]=r.get(k,F(0))+x*y
 return clean(r)
def linear(r):
 out={}
 for i,v in enumerate(r):
  if v: k=list(ZERO);k[i]=1;out[tuple(k)]=v
 return out
def power(p,n):
 r={ZERO:F(1)}
 for i in range(n): r=pmul(r,p)
 return r
def pdet(M):
 r={}
 for perm in permutations(range(3)):
  s=(-1)**sum(perm[i]>perm[j] for i in range(3) for j in range(i+1,3))
  r=add(r,scale(pmul(pmul(M[0][perm[0]],M[1][perm[1]]),M[2][perm[2]]),s))
 return r
def subvec(a,b): return [add(x,scale(y,-1)) for x,y in zip(a,b)]
def evaluate(p,s): return sum((v*reduce(lambda x,y:x*y,(F(s[i])**e for i,e in enumerate(k)),F(1)) for k,v in p.items()),F(0))
def brion(verts,xi):
 out={}
 for v in verts:
  invM=v["inverse"]
  directions=[tuple(-invM[k][j] for k in range(3)) for j in range(3)]
  vals=[dot(xi,d) for d in directions];assert all(vals)
  la=[sum(xi[k]*v["linear"][k][j] for k in range(3)) for j in range(12)]
  lp=linear(la)
  for powers in product((-1,0,1),repeat=3):
   q=sum(powers)
   if q>0: continue
   coeff=F(1)
   for w,t in zip(vals,powers):coeff*= {-1:-1/w,0:F(1,2),1:-w/12}[t]
   out=add(out,scale(power(lp,-q),coeff/factorial(-q)))
 return clean(out)
def main():
 started=time.monotonic()
 # Fixed root matrix TU, all square minors, not just six sample bases.
 for s in (1,2,3):
  for rows in combinations(A,s):
   for cols in combinations(range(3),s):
    M=[[r[c] for c in cols] for r in rows]
    d=M[0][0] if s==1 else M[0][0]*M[1][1]-M[0][1]*M[1][0] if s==2 else det(M)
    assert abs(d)<=1
 B=[[F((i==k)+(j==l)-4*((i,j)==(k,l)),2) for k,l in pairs] for i,j in pairs]
 Q={}
 for i in range(12):
  for j in range(12):
   Q=add(Q,scale(pmul(linear([F(k==i) for k in range(12)]),linear([F(k==j) for k in range(12)])),B[i][j]/2))
 bases=[I for I in combinations(range(12),3) if det([A[i] for i in I])]
 assert all(abs(det([A[i] for i in I]))==1 for I in bases)
 records=[];orbits=[]
 for seedno,seed in enumerate(seeds,1):
  sig=signs(seed);assert all(dot(r,seed)>0 for r in tri)
  verts=[]
  for I in bases:
   J=inv([A[i] for i in I])
   L=[[F(0)]*12 for k in range(3)]
   for k in range(3):
    for j,i in enumerate(I):L[k][i]=J[k][j]
   value=tuple(dot(r,seed) for r in L)
   if all(dot(r,value)<=seed[k] for k,r in enumerate(A)):
    active=tuple(k for k,r in enumerate(A) if dot(r,value)==seed[k])
    assert active==I
    verts.append(dict(basis=I,inverse=J,linear=L,value=value))
  assert len(verts)==20 and len({v["value"] for v in verts})==20
  rows=set()
  for v in verts:
   for k,ak in enumerate(A):
    r=[F(j==k)-sum(ak[t]*v["linear"][t][j] for t in range(3)) for j in range(12)]
    rr=norm(r)
    if rr: rows.add(rr)
  base={norm(r) for r in tri}|{norm([s*x for x in r]) for s,r in zip(sig,g)}
  extra=rows-base
  assert len(base)==30 and base<=rows and len(rows)==48 and len(extra)==18
  witnesses=[]
  for r in sorted(extra):
   w=next(((a,b) for a,b in combinations(sorted(base),2) if tuple(x+y for x,y in zip(a,b))==r),None)
   assert w is not None
   witnesses.append(dict(row=r,summands=w))
  orbit=set()
  for perm in permutations(range(4)):
   for trans in (False,True):
    ss=[seed[pairs.index((perm[j],perm[i]) if trans else (perm[i],perm[j]))] for i,j in pairs]
    orbit.add(signs(ss))
  assert len(orbit)==[12,8,24,6,6,6][seedno-1]
  assert all(not orbit.intersection(old) for old in orbits)
  orbits.append(orbit)
  # Fixed normal fan and exact simple vertex incidence give all face cycles.
  polys=[[linear(r) for r in v["linear"]] for v in verts]
  center=[scale(reduce(add,(v[k] for v in polys),{}),F(1,20)) for k in range(3)]
  volume={};face_records=[];tetrahedra=0
  for facet in range(12):
   ids=[i for i,v in enumerate(verts) if facet in v["basis"]]
   assert len(ids)>=3
   adj={i:[j for j in ids if j!=i and len(set(verts[i]["basis"])&set(verts[j]["basis"]))==2] for i in ids}
   assert all(len(v)==2 for v in adj.values())
   cycle=[min(ids)];prev=None;cur=cycle[0]
   while True:
    nxt=min(j for j in adj[cur] if j!=prev)
    if nxt==cycle[0]:break
    assert nxt not in cycle
    cycle.append(nxt);prev,cur=cur,nxt
   assert set(cycle)==set(ids)
   fc=[scale(reduce(add,(polys[i][k] for i in ids),{}),F(1,len(ids))) for k in range(3)]
   for a,b in zip(cycle,cycle[1:]+cycle[:1]):
    M=[subvec(fc,center),subvec(polys[a],center),subvec(polys[b],center)]
    tpoly=pdet(M);val=evaluate(tpoly,seed);assert val
    volume=add(volume,scale(tpoly,F(1 if val>0 else -1,6)));tetrahedra+=1
   face_records.append(dict(facet=facet,cycle=cycle))
  assert tetrahedra==60
  F1=brion(verts,(1,4,16));F2=brion(verts,(1,5,25))
  assert F1==F2
  leading={k:v for k,v in F1.items() if sum(k)==3}
  quadratic={k:v for k,v in F1.items() if sum(k)==2}
  lin={k:v for k,v in F1.items() if sum(k)==1}
  ell=[F(1,3)-sum(s*r[i] for s,r in zip(sig,g))/12 for i in range(12)]
  assert leading==volume
  assert quadratic==Q and lin==linear(ell) and F1.get(ZERO)==1
  # Check the directional derivative identity Q=(1/2) D_ones V coefficientwise.
  DV={}
  for k,v in leading.items():
   for i,e in enumerate(k):
    if e:
     kk=list(k);kk[i]-=1;DV=add(DV,{tuple(kk):v*e})
  assert scale(DV,F(1,2))==Q
  # The closed-chamber volume polynomial is evaluated at K, not raw count continuity.
  assert evaluate(volume,[1]*12)==4
  poly_serial=[dict(exponents=k,coefficient=str(v)) for k,v in sorted(F1.items())]
  records.append(dict(seed=seedno,signs=sig,vertices=verts,feasibility_rows=sorted(rows),extra_witnesses=witnesses,
   orbit=sorted(orbit),faces=face_records,tetrahedra=tetrahedra,polynomial=poly_serial,
   actual_volume_at_seed=str(evaluate(volume,seed)),polynomial_terms=len(F1),
   coefficient_comparison="exact volume via60signed tetrahedra equals Brion leading part; Q,L,constant and D_onesV identities exact",
   normal_cone_K_check=all(all(dot(r,tuple(sum(v["linear"][t]) for t in range(3)))<=1 for r in A) for v in verts)))
  assert records[-1]["normal_cone_K_check"]
 union=set().union(*orbits)
 assert len(union)==62
 remaining=set(product((-1,1),repeat=6))-union
 circuit=(-1,-1,1,1,-1,-1)
 assert remaining=={circuit,tuple(-x for x in circuit)}
 assert all(sum(c*g[j][i] for j,c in enumerate(circuit))==0 for i in range(12))
 try: signs([1]*12)
 except AssertionError: negative="non-generic all-one support correctly rejected by sign guard"
 else: raise AssertionError("negative control not rejected")
 result=dict(status="PASS_SELECTED_SIX_CHAMBER_FORMULA_RECONSTRUCTION",source_pdf_sha256="fefc3ad35c98e327cdabdf01b147393f561ba7d149f84c61c60f0e9304d11d9f",
  script_sha256=hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),
  arithmetic="standard-library Fraction; exact symbolic polynomials in12bounds",seed_count=6,
  nonsingular_root_bases=len(bases),sign_orbit_sizes=[len(x) for x in orbits],strict_sign_patterns=62,
  impossible_sign_patterns=sorted(remaining),negative_control=negative,
  source_supplement_downloaded=False,interpolation=False,numeric_hull=False,
  duration_seconds=time.monotonic()-started,chambers=records,
  limits="Selected finite chamber/formula reconstruction only. Generic-to-global coverage uses a separate analytic tree/square argument; Brion/count and volume meanings use classical geometric theorems. No complete Lorentzian proof, source Theorem1.1, independent referee, formal verification, novelty claim, score or new paper.")
 def enc(x):
  if isinstance(x,F):return str(x)
  raise TypeError(type(x).__name__)
 with (P/"RESULT1326.json").open("w",encoding="utf-8",newline="\n") as f:json.dump(result,f,indent=2,default=enc);f.write("\n")
 print(json.dumps({k:result[k] for k in ["status","seed_count","nonsingular_root_bases","sign_orbit_sizes","strict_sign_patterns","duration_seconds"]}))
if __name__=="__main__":
 try:main()
 except Exception:
  failure=dict(status="FAILED_NO_RESULT_CLAIM",traceback=traceback.format_exc(),script_sha256=hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest())
  with (P/"FAILURE1326.json").open("w",encoding="utf-8",newline="\n") as f:json.dump(failure,f,indent=2);f.write("\n")
  raise
