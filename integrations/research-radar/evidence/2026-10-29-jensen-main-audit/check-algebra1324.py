"""Own bounded rational check of selected algebra, source PDF pp5-7.
Not a whole-paper audit, formal proof, or independent model assessment."""
from fractions import Fraction as F
from itertools import product
import json, pathlib, hashlib
P=pathlib.Path(__file__).resolve().parent
pairs=[(i,j) for i in range(4) for j in range(4) if i!=j]
N=12
def zero(n,m): return [[F(0) for j in range(m)] for i in range(n)]
def eye(n): return [[F(i==j) for j in range(n)] for i in range(n)]
def mul(A,B): return [[sum((a*b for a,b in zip(r,c)),F(0)) for c in zip(*B)] for r in A]
def shifted(A,k): return [[v+(k if i==j else 0) for j,v in enumerate(r)] for i,r in enumerate(A)]
def rank(A):
    A=[r[:] for r in A]; q=0
    for j in range(len(A[0])):
        k=next((k for k in range(q,len(A)) if A[k][j]),None)
        if k is None: continue
        A[q],A[k]=A[k],A[q]; v=A[q][j]; A[q]=[x/v for x in A[q]]
        for k in range(len(A)):
            if k!=q:
                v=A[k][j]; A[k]=[x-v*y for x,y in zip(A[k],A[q])]
        q+=1
        if q==len(A): break
    return q
def vec(d): return [F(d.get(p,0)) for p in pairs]
def dot(x,y): return sum((a*b for a,b in zip(x,y)),F(0))
def mv(A,x): return [dot(r,x) for r in A]
B=[[F((i==k)+(j==l)-4*((i,j)==(k,l)),2) for k,l in pairs] for i,j in pairs]
assert all(B[i][j]==B[j][i] for i in range(N) for j in range(N))
one=[F(1)]*N
assert mv(B,one)==one
# A square-free annihilating polynomial and exact eigenspace dimensions,
# together with symmetry, certify all eigenvalues and inertia.
poly=mul(mul(B,shifted(B,-1)),mul(shifted(B,1),shifted(B,2)))
assert poly==zero(N,N)
dims={str(v):N-rank(shifted(B,-v)) for v in [F(1),F(-1),F(-2),F(0)]}
assert dims=={"1":1,"-1":3,"-2":5,"0":3} and sum(dims.values())==N
g=[
vec({(0,2):1,(1,3):1,(0,3):-1,(1,2):-1}),
vec({(2,0):1,(3,1):1,(2,1):-1,(3,0):-1}),
vec({(0,1):1,(2,3):1,(0,3):-1,(2,1):-1}),
vec({(1,0):1,(3,2):1,(1,2):-1,(3,0):-1}),
vec({(0,1):1,(3,2):1,(0,2):-1,(3,1):-1}),
vec({(1,0):1,(2,3):1,(1,3):-1,(2,0):-1})]
assert all(mv(B,x)==[-2*v for v in x] for x in g)
assert all(sum(x[k] for k,(i,j) in enumerate(pairs) if i==r)==0 and
           sum(x[k] for k,(i,j) in enumerate(pairs) if j==r)==0 for x in g for r in range(4))
assert all(sum(abs(x[k]) for x in g)==2 for k in range(N))
# Verify each gradient of Q is half a sum of its two triangle slacks.
for q,(i,j) in enumerate(pairs):
    slack=[F(0)]*N
    for k in range(4):
        if k in (i,j): continue
        for p,v in [((i,k),1),((k,j),1),((i,j),-1)]: slack[pairs.index(p)]+=F(v,2)
    assert slack==B[q]
records=[]
for sig in product((-1,1),repeat=6):
    R=[sum(sig[s]*g[s][i] for s in range(6)) for i in range(N)]
    norm=dot(R,R); U=sig[0]+sig[1]; W=sig[2]+sig[3]; T=sig[4]+sig[5]
    assert norm==24+2*(U*W-U*T+W*T) and norm<=32
    ell=[F(1,3)-v/12 for v in R]
    u=[F(1,3)+v/24 for v in R]
    assert mv(B,u)==ell and min(ell)>=F(1,6)
    rho=dot(ell,u)
    assert rho==F(4,3)-norm/288 and rho>=F(11,9)>F(6,5)
    remainder=360-300*rho
    assert remainder<0
    # Compare every coefficient of the homogeneous quadratic completion,
    # without sampling a or t. Matrix convention is x^T C x.
    lhs=[ [12*B[i][j] for j in range(N)]+[60*ell[i]] for i in range(N)]
    lhs.append([60*v for v in ell]+[F(360)])
    Bu=mv(B,u)
    rhs=[ [12*B[i][j] for j in range(N)]+[60*Bu[i]] for i in range(N)]
    rhs.append([60*v for v in Bu]+[300*dot(u,Bu)+remainder])
    assert lhs==rhs
    records.append(dict(signs=sig,R_norm_squared=str(norm),rho=str(rho),remainder=str(remainder),min_L_coefficient=str(min(ell))))
# Boundary sign values are also convex combinations of +/-1 choices;
# quadratic norm is convex so the cube bound persists, but chamber gluing
# and exact boundary lattice values still require separate arguments.
result=dict(status="PASS_SELECTED_ALGEBRA_ONLY",source_pdf_sha256="fefc3ad35c98e327cdabdf01b147393f561ba7d149f84c61c60f0e9304d11d9f",
 script_sha256=hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),
 exact_arithmetic="fractions.Fraction, no numeric eigensolver",eigenspace_dimensions=dims,
 quotient_inertia=dict(positive=1,negative=8),sign_patterns_checked=64,
 min_rho=str(min(F(x["rho"]) for x in records)),max_R_norm_squared=str(max(F(x["R_norm_squared"]) for x in records)),
 least_negative_remainder=str(max(F(x["remainder"]) for x in records)),
 quadratic_identity="13x13 coefficient matrices equal for every sign vector; all12 gradient/triangle-slack identities exact",
 records=records,
 not_checked=["volume/count chamber polynomial identities","Minkowski generator and normal-fan hypotheses","Lorentzian support comparison and all other derivative cases","external Alexandrov-Fenchel/Lorentzian theorems","wall gluing and degenerate exact values","Theorem1.1 complete proof"],
 conclusion="No algebraic obstruction found in this selected block. Its negative remainder controls only the fourth-t-derivative block, conditional on the source representation. No global Jensen theorem or new result certified.",
 new_paper=False,formal_proof=False,model_assessment=False,foreign_supplement_downloaded=False)
with (P/"RESULT1324.json").open("w",encoding="utf-8",newline="\n") as f: json.dump(result,f,indent=2); f.write("\n")
print(json.dumps({k:result[k] for k in ["status","min_rho","max_R_norm_squared","least_negative_remainder","eigenspace_dimensions"]}))
