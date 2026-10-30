"""Own finite q=2 control for the general weighted-pure-frame construction.
Not a numerical campaign, not a proof of asymptotic quadrature or universal SDP bound.
Writes only a new result beside this copied checker; replay in a temporary folder.
"""
import hashlib,itertools,json
from pathlib import Path
import sympy as s
here=Path(__file__).parent
I2=s.eye(2);d=8;u=s.symbols('u',real=True)
pauli=[s.Matrix([[0,1],[1,0]]),s.Matrix([[0,-s.I],[s.I,0]]),s.diag(1,-1)]
q=2;directions=[];weights=[]
for j in range(q):
    theta=(s.Rational(j)+s.Rational(1,2))*s.pi/q
    for ell in range(2*q):
        phi=(s.Rational(ell)+s.Rational(1,2))*s.pi/q
        directions.append(s.simplify(s.Matrix([s.sin(theta)*s.cos(phi),s.sin(theta)*s.sin(phi),s.cos(theta)])))
        weights.append(s.simplify((s.cos(j*s.pi/q)-s.cos((j+1)*s.pi/q))/(4*q)))
simp=lambda m:m.applyfunc(s.simplify)
zero=lambda m:all(s.simplify(a)==0 for a in m)
assert sum(weights)==1 and all(w>0 for w in weights)
assert zero(sum((w*n for w,n in zip(weights,directions)),s.zeros(3,1)))
assert all(s.simplify(n.dot(n)-1)==0 for n in directions)
states=[simp((I2+sum((n[a]*pauli[a] for a in range(3)),s.zeros(2)))/2) for n in directions]
assert all(zero(v*v-v) and s.trace(v)==1 for v in states)
assert zero(sum((w*v for w,v in zip(weights,states)),s.zeros(2))-I2/2)
second=sum((w*n*n.T for w,n in zip(weights,directions)),s.zeros(3))
assert not zero(second-s.eye(3)/3), 'Control should not accidentally be a spherical2design'
H=[s.diag((1-u)*w*I2+2*u*w*v.T,w*s.eye(d-2)) for w,v in zip(weights,states)]
assert zero(sum(H,s.zeros(d))-s.eye(d))
J=simp(sum((s.kronecker_product(h.T,v) for h,v in zip(H,states)),s.zeros(2*d)))
J1=J.subs(u,1);J0=s.eye(2*d)/2
assert zero(J-(1-u)*J0-u*J1)
z=s.zeros(2*d,1);z[1]=1/s.sqrt(2);z[2]=-1/s.sqrt(2)
assert zero(J1*z) and zero(J*z-(1-u)*z/2)
Z=2*z*z.H
assert zero(s.Matrix(2,2,lambda a,b:sum(Z[2*i+a,2*i+b] for i in range(d)))-I2)
assert s.simplify(s.trace(J*Z)-(1-u))==0
assert zero(J-s.kronecker_product(s.eye(d),(1-u)*I2/2)-u*J1)
squares=[]
for bits in itertools.product([0,1],repeat=d):
    v=sum((weights[i]*directions[i] for i,b in enumerate(bits) if b),s.zeros(3,1))
    sq=s.simplify(v.dot(v));assert sq.is_Rational
    squares.append(sq)
t=s.simplify(2*s.sqrt(max(squares)))
assert t==s.sqrt(2)/2
wrong=sum((w*n for w,n in zip(weights[1:],directions[1:])),s.zeros(3,1))/(1-weights[0])
assert not zero(wrong),'Deleting one atom without balancing should fail exact barycenter'
out=dict(status='all_exact_assertions_passed',q=2,N=8,d=8,k=2,weighted_barycenter='I_2/2',second_moment=str(second),
  not_a_2design=True,eta_prefix='u/sqrt(2)',alpha_positive='1-u',subsets_examined=256,
  choi_at_u1_eigenvalues={str(a):int(m) for a,m in J1.eigenvals().items()},
  negative_control='Deleting one atom and renormalizing weights loses the exact zero first moment; it does not define the same normalized POVM.',
  scope='Finite exact anisotropic-frame/control only. No asymptotic integral, general SDP theorem, optimal finite N, Lean proof, novelty or manuscript assessment certified.',
  sympy_version=s.__version__,checker_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
with (here/'EXACT1368.json').open('x',encoding='utf-8',newline='\n') as f:json.dump(out,f,indent=2);f.write('\n')
print(json.dumps({k:out[k] for k in ['status','eta_prefix','alpha_positive','not_a_2design','choi_at_u1_eigenvalues']}))
