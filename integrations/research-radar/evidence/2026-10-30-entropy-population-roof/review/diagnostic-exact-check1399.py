"""Exact dictionary checks on the already declared real diagnostic only."""
from pathlib import Path
import json
import hashlib
import sympy as s
assert __debug__
R=s.Rational
C=s.diag(1,2)
V=s.Matrix([[R(3,5),-R(4,5)],[R(4,5),R(3,5)]])
D=C*V
Z=s.trace(C.T*C+D.T*D)
A=C.T*C/Z; B=D.T*D/Z; F=C.T*D/Z; Sigma=A+B
Ar=C*C.T/Z; Br=D*D.T/Z; X=C*D.T/Z
rho=Ar.row_join(X).col_join(X.T.row_join(Br))
assert Z==10 and s.trace(B)==R(1,2)
assert V*V.T==s.eye(2) and Ar==Br
assert rho.rank()==2 and X*Br.inv()*X.T==Ar
assert Sigma.det()>0 and s.trace(Sigma)==1
assert Sigma*B!=B*Sigma
# Purification coordinates (a,r,k); trace the physical reference explicitly.
G=C.col_join(D)
rho_AK=s.Matrix(4,4,lambda i,j: sum(G[2*(i//2)+r,i%2]*G[2*(j//2)+r,j%2] for r in range(2))/Z)
assert rho_AK==A.row_join(F).col_join(F.T.row_join(B))
alpha=R(29,40); beta=R(19,40); eta=R(3,5)
O=(alpha*A+beta*B).row_join(eta*F).col_join((eta*F.T).row_join((1-alpha)*A+(1-beta)*B))
assert s.trace(O)==1
x=s.Symbol('x')
record={
 "status":"exact_dictionary_and_saturation_checks_passed",
 "scope":"Only the previously declared real diagnostic; no entropy sign certificate or new state sample",
 "normalization":str(Z),"physical_state_rank":rho.rank(),
 "physical_equal_diagonal_blocks":True,"saturated":True,
 "Sigma":[[str(v) for v in Sigma.row(i)] for i in range(2)],
 "complementary_state_dictionary_exact":True,
 "output_characteristic_polynomial":[str(v) for v in O.charpoly().all_coeffs()],
 "generalized_population_polynomial":[str(v) for v in s.Poly((B-x*Sigma).det(),x).all_coeffs()],
 "entropy_numerics_performed":False,
 "script_sha256":hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
}
Path(__file__).with_name('DIAGNOSTIC-EXACT-CHECK1399.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
print(json.dumps(record,indent=2))
