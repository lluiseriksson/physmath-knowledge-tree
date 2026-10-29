"""Bounded exact check of Lemma 3.1 (Schubr edition4, PDF p8-9).
Own implementation; no supplement downloaded; no audit of other claims."""
import itertools,json,hashlib,pathlib
P=pathlib.Path(__file__).resolve().parent
I=[(1,0,0),(0,1,0),(0,0,1)]
D=[(0,1,-1),(0,1,1),(1,-1,-1),(1,-1,0),(1,-1,1),(1,0,-1),(1,0,1),(1,1,-1),(1,1,0),(1,1,1)]
def det2(a,b,i,j): return a[i]*b[j]-a[j]*b[i]
def det3(a,b,c): return sum(a[i]*(b[(i+1)%3]*c[(i+2)%3]-b[(i+2)%3]*c[(i+1)%3]) for i in range(3))
def tu(rows):
    return all(abs(x)<=1 for r in rows for x in r) and all(abs(det2(a,b,i,j))<=1 for a,b in itertools.combinations(rows,2) for i,j in itertools.combinations(range(3),2)) and all(abs(det3(*r))<=1 for r in itertools.combinations(rows,3))
V=[frozenset(i for i in range(10) if mask>>i&1) for mask in range(1024) if tu(I+[D[i] for i in range(10) if mask>>i&1])]
maximal=[s for s in V if not any(s<t for t in V)]
table=[
((1,2,3),[(-1,0,0),(0,-1,0),(0,1,-1)]),
((0,3,4),[(-1,0,0),(0,-1,0),(0,-1,1)]),
((1,2,5),[(-1,0,0),(0,1,-1),(0,-1,0)]),
((0,3,5),[(-1,0,0),(0,-1,0),(0,0,-1)]),
((2,3,5),[(-1,0,0),(0,-1,0),(-1,0,1)]),
((1,3,6),[(-1,0,0),(0,-1,0),(0,0,1)]),
((0,4,6),[(-1,0,0),(0,1,-1),(0,1,0)]),
((3,4,6),[(-1,0,0),(0,-1,0),(1,0,-1)]),
((0,5,7),[(-1,0,0),(0,-1,1),(0,-1,0)]),
((1,5,8),[(-1,0,0),(0,1,0),(0,0,-1)]),
((0,6,8),[(-1,0,0),(0,1,0),(0,0,1)]),
((0,7,8),[(-1,0,0),(0,1,0),(0,1,-1)]),
((5,7,8),[(-1,0,0),(0,1,0),(-1,0,1)]),
((1,6,9),[(-1,0,0),(0,-1,1),(0,1,0)]),
((1,8,9),[(-1,0,0),(0,1,0),(0,-1,1)]),
((6,8,9),[(-1,0,0),(0,1,0),(1,0,-1)])]
roots=set(I+[(1,-1,0),(1,0,-1),(0,1,-1)])
roots|={tuple(-v for v in r) for r in list(roots)}
def mult(r,T): return tuple(sum(r[i]*T[i][j] for i in range(3)) for j in range(3))
assert len(V)==51 and len(maximal)==16
assert {frozenset(k) for k,T in table}==set(maximal)
checks=[]
for k,T in table:
    assert abs(det3(*T))==1
    images=[mult(r,T) for r in I+[D[i] for i in k]]
    assert all(x in roots for x in images)
    checks.append(dict(extras=k,T=T,det=det3(*T),images=images))
assert all(any(s<=t for t in maximal) for s in V)
# Completeness of the normalized candidate directions is enumerated separately.
directions={r for r in itertools.product((-1,0,1),repeat=3) if any(r) and next(x for x in r if x)!=-1}
assert directions==set(I+D)
negative=[(1,1,0),(1,-1,0)]
assert not tu(I+negative) and abs(det2(*negative,0,1))==2
result=dict(status="PASS_SELECTED_FINITE_LEMMA_ONLY",arithmetic="Python arbitrary precision integers",
 masks_checked=1024,valid_systems=len(V),maximal_systems=len(maximal),normalized_nonzero_directions=len(directions),
 transformations=checks,negative_control="I3 plus rows(1,1,0),(1,-1,0) rejected by minor -2",
 source_pdf_sha256="fefc3ad35c98e327cdabdf01b147393f561ba7d149f84c61c60f0e9304d11d9f",
 script_sha256=hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),
 scope="Lemma3.1 finite classification and displayed transformations only. Not Theorem1.1/2.1, Lorentzian certificate, wall/boundary gluing, countable transfer or full-paper proof audit; not formal verification or a model assessment.",
 foreign_supplement_used=False,independent_implementation="Own checker reconstructed from the displayed statement/table; not an independent referee or independent source verification.")
with (P/"RESULT1323.json").open("w",encoding="utf-8",newline="\n") as f: json.dump(result,f,indent=2); f.write("\n")
print(json.dumps({k:result[k] for k in ["status","masks_checked","valid_systems","maximal_systems"]}))
