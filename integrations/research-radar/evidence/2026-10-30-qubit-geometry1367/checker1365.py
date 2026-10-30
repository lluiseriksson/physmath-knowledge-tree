"""Exact tetrahedral preparation witness, SymPy only; not a general SDP proof."""
import hashlib, itertools, json
from pathlib import Path
import sympy as s

here=Path(__file__).parent
I2=s.eye(2); I4=s.eye(4)
pauli=[s.Matrix([[0,1],[1,0]]),s.Matrix([[0,-s.I],[s.I,0]]),s.diag(1,-1)]
directions=[s.Matrix(v)/s.sqrt(3) for v in [(1,1,1),(1,-1,-1),(-1,1,-1),(-1,-1,1)]]
sigma=[(I2+sum((n[j]*pauli[j] for j in range(3)),s.zeros(2)))/2 for n in directions]
u=s.symbols('u', real=True)
simp=lambda M:M.applyfunc(s.simplify)
zero=lambda M:all(s.simplify(x)==0 for x in M)
H=[s.diag((1-u)*I2/4+u*q.T/2,I2/4) for q in sigma]
assert zero(sum(H,s.zeros(4))-I4)
assert all(zero(q*q-q) and s.trace(q)==1 and zero(q-q.H) for q in sigma)
assert all(zero(h-h.H) and s.simplify(s.trace(h)-1)==0 for h in H)
assert all(s.simplify(directions[i].dot(directions[j])+s.Rational(1,3))==0 for i in range(4) for j in range(i))
J=simp(sum((s.kronecker_product(h.T,q) for h,q in zip(H,sigma)),s.zeros(8)))
swap=s.zeros(4)
for a,b in itertools.product(range(2),repeat=2):swap[2*b+a,2*a+b]=1
expected=s.diag((1-u)*s.eye(4)/2+u*(s.eye(4)+swap)/3,s.eye(4)/2)
assert zero(J-expected)
singlet=s.Matrix([0,1,-1,0,0,0,0,0])/s.sqrt(2)
assert zero(J*singlet-(1-u)*singlet/2)
Z=2*singlet*singlet.H
partial=s.Matrix(2,2,lambda a,b:sum(Z[2*i+a,2*i+b] for i in range(4)))
assert zero(partial-I2)
assert s.simplify(s.trace(J*Z)-(1-u))==0
W=(1-u)*I2/2
slack=simp(J-s.kronecker_product(I4,W))
assert zero(slack-s.diag(u*(s.eye(4)+swap)/3,u*s.eye(4)/2))
eigs={str(e):int(m) for e,m in J.eigenvals().items()}
slack_eigs={str(e):int(m) for e,m in slack.eigenvals().items()}
# Exact QC contraction: max subset oscillation; complement input eigenvalue
# |S|/4 lies between the two logical input eigenvalues.
subsets=[]
for bits in itertools.product([0,1],repeat=4):
    inds=[i for i,b in enumerate(bits) if b]
    nsum=sum((directions[i] for i in inds),s.zeros(3,1))
    norm=s.sqrt(s.simplify(nsum.dot(nsum)))
    width=s.simplify(u*norm/2)
    subsets.append(dict(indices=inds,oscillation=str(width)))
assert {a['oscillation'] for a in subsets}=={'0','u/2','sqrt(3)*u/3'}
# Omitting the transpose is a REAL failure for this complex example.
wrong_H=[s.diag((1-u)*I2/4+u*q/2,I2/4) for q in sigma]
wrong_J=simp(sum((s.kronecker_product(h.T,q) for h,q in zip(wrong_H,sigma)),s.zeros(8)))
assert not zero(wrong_J-J)
assert s.simplify((singlet.H*wrong_J*singlet)[0].subs(u,1))==s.Rational(1,3)
# Geometric four-outcome identity for arbitrary zero-sum R^3 vectors.
vv=[s.Matrix(s.symbols(f'v{i}x v{i}y v{i}z',real=True)) for i in range(3)]
vv.append(-sum(vv,s.zeros(3,1)))
x,y,z=[vv[0]+vv[j] for j in [1,2,3]]
assert s.expand(sum(v.dot(v) for v in vv)-x.dot(x)-y.dot(y)-z.dot(z))==0
result=dict(status='all_exact_assertions_passed',parameter='0<=u<=1',dimensions=dict(d=4,k=2,N=4),
    eta='u/sqrt(3)',alpha_positive='1-u',choi_eigenvalues=eigs,primal_slack_eigenvalues=slack_eigs,
    normalized_dual_partial_trace='I_2',subsets=subsets,transpose_negative_control='without conjugating effects, singlet value at u=1 is 1/3 instead of 0',
    four_vector_squared_norm_identity=True,
    scope='Finite exact witness and polynomial identity only. General Bloch/dual bound is analytic, not established by these checks. No Lean proof, manuscript assessment, score or novelty certification.',
    checker_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),sympy_version=s.__version__)
(here/'EXACT1365.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:result[k] for k in ['status','eta','alpha_positive','choi_eigenvalues','primal_slack_eigenvalues','transpose_negative_control']}))
