"""One declared rational-input diagnostic for a new stronger roof estimate.
High-precision signs here are diagnostic only, not an entropy certificate.
"""
from pathlib import Path
import json,hashlib,sys
import sympy as s
import mpmath as mp
assert __debug__
mp.mp.dps=90
R=s.Rational
C=s.diag(1,2);V=s.Matrix([[R(3,5),-R(4,5)],[R(4,5),R(3,5)]]);D=C*V
Z=s.trace(C.T*C+D.T*D)
A=C.T*C/Z;B=D.T*D/Z;F=C.T*D/Z;Sigma=A+B
p=s.trace(B)
rho=A.row_join(F).col_join(F.T.row_join(B))
a0=R(29,40);a1=R(19,40);c=R(3,5)
O=(a0*A+a1*B).row_join(c*F).col_join((c*F.T).row_join((1-a0)*A+(1-a1)*B))
def scalar(q):return mp.mpf(int(s.numer(q)))/int(s.denom(q))
def mat(M):return mp.matrix([[scalar(M[i,j]) for j in range(M.cols)] for i in range(M.rows)])
def entropy(M):return -sum(x*mp.log(x) for x in mp.eigsy(mat(M),eigvals_only=True) if x>0)
def h(x):return -x*mp.log(x)-(1-x)*mp.log(1-x)
def roof(x):
 z=1-2*x;q=R(9,25)*4*x*(1-x)+(z/R(4)+R(1,5))**2
 u=(1+mp.sqrt(q))/2
 return h(u)
poly=s.Poly((B-s.Symbol('x')*Sigma).det(),s.Symbol('x'))
roots=sorted(mp.polyroots([scalar(x) for x in poly.all_coeffs()]))
lo,hi=roots;w_hi=(scalar(p)-lo)/(hi-lo)
weighted_roof=(1-w_hi)*roof(lo)+w_hi*roof(hi)
branch=(1-scalar(p))*entropy(A/(1-p))+scalar(p)*entropy(B/p)
out_entropy=entropy(O)
target_G=out_entropy-branch-roof(scalar(p))
strong=out_entropy-branch-weighted_roof
record={'status':'diagnostic_not_interval_certified','python':sys.version,'mpmath_dps':mp.mp.dps,'hypothesis':'S((Nhat tensor id)rho_AR)-sum_i p_i S(rho_R^i) >= Tr Sigma e_N(P), P=Sigma^(-1/2)B Sigma^(-1/2), for saturated endpoints','scope':'New stronger population/reference-dependent estimate, not the original G inequality. No inference from finite positive probes.','C':[[str(v) for v in C.row(i)] for i in range(2)],'D':[[str(v) for v in D.row(i)] for i in range(2)],'normalization':str(Z),'population':str(p),'sigma':[[str(v) for v in Sigma.row(i)] for i in range(2)],'commutator_sigma_B':[[str(v) for v in (Sigma*B-B*Sigma).row(i)] for i in range(2)],'rho_AB_rank':rho.rank(),'output_characteristic_polynomial':[str(v) for v in O.charpoly().all_coeffs()],'generalized_population_polynomial':[str(v) for v in poly.all_coeffs()],'population_roots':[mp.nstr(x,70) for x in roots],'weighted_roof':mp.nstr(weighted_roof,70),'branch_entropy':mp.nstr(branch,70),'output_entropy':mp.nstr(out_entropy,70),'G_diagnostic':mp.nstr(target_G,70),'stronger_gap_diagnostic':mp.nstr(strong,70),'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'runs':1,'new_review':False,'new_grade':None,'new_paper':False}
(Path(__file__).parent/'PERSPECTIVE-PROBE1399.json').write_bytes((json.dumps(record,indent=2)+'\n').encode())
print(json.dumps({k:record[k] for k in ['status','population','G_diagnostic','stronger_gap_diagnostic','output_characteristic_polynomial','generalized_population_polynomial']}))
