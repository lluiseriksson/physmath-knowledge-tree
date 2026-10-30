"""One exact complex matrix instance; not a proof of the general SDP bound."""
import json
from pathlib import Path
import sympy as s

def ptr_a(m, d, k):
    return s.simplify(sum((m[k*i:k*(i+1), k*i:k*(i+1)] for i in range(d)), s.zeros(k)))

def choi(phi, d, k):
    result = s.zeros(d*k)
    for i in range(d):
        for j in range(d):
            e = s.zeros(d)
            e[i,j] = 1
            result[k*i:k*(i+1), k*j:k*(j+1)] = phi(e)
    return s.simplify(result)

def equal(a, b):
    assert s.simplify(a-b) == s.zeros(a.rows, a.cols)

d, k = 3, 2
V = s.Matrix([[1/s.sqrt(2), 0], [s.I/s.sqrt(2), 0], [0, 1]])
equal(V.H*V, s.eye(k))
Omega = lambda x: s.simplify(V.H*x*V)
Zprime = choi(Omega, d, k)
equal(ptr_a(Zprime, d, k), s.eye(k))
assert Zprime.rank() == 1
assert s.simplify(s.trace(Zprime)) == 2
Sroot = s.diag(2, 3)
S = Sroot*Sroot
Z = s.kronecker_product(s.eye(d), Sroot)*Zprime*s.kronecker_product(s.eye(d), Sroot)
equal(ptr_a(Z, d, k), S)
R = s.Matrix([[1, s.I, 1], [0, 1, s.I], [s.I, 0, 1]])
A = s.simplify(R*R.H / 16)
Bprime = ptr_a(s.kronecker_product(A.T, s.eye(k))*Zprime, d, k)
equal(Bprime, Omega(A))
B = ptr_a(s.kronecker_product(A.T, s.eye(k))*Z, d, k)
equal(B, Sroot*Bprime*Sroot)
wrong_without_transpose = ptr_a(s.kronecker_product(A, s.eye(k))*Zprime, d, k)
assert s.simplify(wrong_without_transpose - Bprime) != s.zeros(k)
U = s.Matrix([[1,0,0],[0,0,s.I],[0,1,0]])
equal(U.H*U, s.eye(d))
q = s.Rational(2,5)
Psi = lambda x: s.simplify(q*U*x*U.H+(1-q)*s.trace(x)*s.eye(d)/d)
Psistar = lambda f: s.simplify(q*U.H*f*U+(1-q)*s.trace(f)*s.eye(d)/d)
F = A
equal(Omega(Psistar(F)), q*V.H*U.H*F*U*V+(1-q)*s.trace(F)*s.eye(k)/d)
for i in range(k):
    for j in range(k):
        e = s.zeros(k)
        e[i,j] = 1
        assert s.simplify(s.trace(F*Psi(V*e*V.H))-s.trace(Omega(Psistar(F))*e)) == 0
sigma = s.Matrix([[s.Rational(1,2), -s.I/4], [s.I/4,s.Rational(1,2)]])
assert s.simplify(s.trace(s.kronecker_product(A.T,sigma)*Z)-s.trace(sigma*B)) == 0
u = s.symbols('u', real=True)
sigmas = [s.diag(1,0),s.Matrix([[1,s.sqrt(3)],[s.sqrt(3),3]])/4,s.Matrix([[1,-s.sqrt(3)],[-s.sqrt(3),3]])/4]
effects = []
for sig in sigmas:
    h = (1-u)*s.eye(3)/3
    h[:2,:2] += 2*u*sig/3
    h[2,2] += u/3
    effects.append(h)
equal(effects[0]*effects[1]-effects[1]*effects[0], s.Matrix([[0,s.sqrt(3)*u*u/9,0],[-s.sqrt(3)*u*u/9,0,0],[0,0,0]]))
z = s.Matrix([0,1,-1,0,0,0])/s.sqrt(2)
dual_trine = 2*z*z.H
equal(ptr_a(dual_trine,3,2),s.eye(2))
J = sum((s.kronecker_product(h.T,sig) for h,sig in zip(effects,sigmas)),s.zeros(6))
assert s.simplify(s.trace(J*dual_trine)-(1-u)) == 0
out = {
    'all_assertions_passed': True,
    'sympy_version': s.__version__,
    'scope': 'One exact non-real CP/unital dual-normalization and composition identity instance, plus the symbolic trine commutator and explicit dual objective. These checks are not a proof of the general SDP statement.',
    'dimensions': {'d': d, 'k': k},
    'Zprime_rank': Zprime.rank(),
    'partial_trace_Z': str(S),
    'complex_transpose_is_necessary_in_this_instance': True,
    'dual_trine_partial_trace': 'I_2',
    'dual_trine_objective': '1-u',
    'trine_commutator_01': 'sqrt(3)*u**2/9'
}
path = Path(__file__).with_name('COMPLEX-INTERFACE.json')
with path.open('x', encoding='utf-8', newline='\n') as handle:
    json.dump(out, handle, indent=2)
    handle.write('\n')
print(json.dumps(out))
