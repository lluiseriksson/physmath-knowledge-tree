"""Exact falsifier of a tempting conditional-order shortcut, not of conjecture971."""
from pathlib import Path
import json,sympy as s,hashlib,shutil
P=s.Matrix([[1,0,0,1],[0,0,0,0],[0,0,0,0],[1,0,0,1]])/2
K=s.Rational(3,2)*P+s.eye(4)/8
X=4*P-s.eye(4)
def trA(M):return s.Matrix(2,2,lambda i,j:M[i,j]+M[i+2,j+2])
assert trA(K)==s.eye(2) and trA(X)==s.zeros(2)
assert set(K.eigenvals())=={s.Rational(13,8),s.Rational(1,8)}
lhs=trA(X*K*X);rhs=trA(X*X)
assert lhs==s.Rational(15,2)*s.eye(2) and rhs==6*s.eye(2)
out=dict(scope='Exact2qubit conditional-order shortcut refutation; NOT a BKM or finite-pair falsifier',
 claim_refuted='Tr_A(X K X)<=Tr_A(X^2) for all K>0 with Tr_A K=I and Hermitian X with Tr_A X=0',
 K='(3/2)Phi_plus+I_4/8',X='4Phi_plus-I_4',K_eigenvalues=['13/8','1/8','1/8','1/8'],
 lhs='(15/2)I_2',rhs='6I_2',positive_violation='(3/2)I_2',
 implication='Cannot replace reference-weighted/noncommuting metric analysis by this naive conditional-order step. Main971 proposed complete-pair upper still unproved and unrefuted.',
 score=None,reviewed=False)
C=Path(__file__).parent;D=Path(r'D:\Proyectos\airr-investigacion')/C.name;D.mkdir(parents=True,exist_ok=True)
(C/'COUNTEREXAMPLE977.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
for f in C.iterdir():
 if f.is_file():shutil.copyfile(f,D/f.name);assert f.read_bytes()==(D/f.name).read_bytes()
print(json.dumps(out,indent=2))
