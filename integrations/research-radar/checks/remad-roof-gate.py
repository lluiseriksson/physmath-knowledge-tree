"""Exact obstruction controls. Known channel; no new capacity result is claimed."""
import sympy as s
import json
from pathlib import Path
R=s.Rational
K=[s.diag(1,1/s.sqrt(2),1/s.sqrt(2)),s.Matrix([[0,1/s.sqrt(2),0],[0,0,1/s.sqrt(2)],[0,0,0]])]
D=[s.Matrix([[1,0,0],[0,1,0]]),s.Matrix([[0,0,1],[0,0,0]])]
def apply(ops,X):return s.simplify(sum((a*X*a.H for a in ops),s.zeros(ops[0].rows)))
def complement(X):return s.simplify(s.Matrix(2,2,lambda a,b:s.trace(K[a]*X*K[b].H)))
assert sum((a.H*a for a in K),s.zeros(3))==s.eye(3)
assert sum((a.H*a for a in D),s.zeros(3))==s.eye(3)
for i in range(3):
 for j in range(3):
  E=s.zeros(3);E[i,j]=1
  assert apply(D,apply(K,E))==complement(E)
env=complement(s.eye(3)/3);assert env==s.diag(R(2,3),R(1,3))
z=s.zeros(9,1);z[0]=1/s.sqrt(2);z[8]=1/s.sqrt(2)
ops=[s.kronecker_product(a,b) for a in K for b in K]
output=apply(ops,z*z.H)
assert output.eigenvals()=={R(5,8):1,R(1,8):3,s.Integer(0):5}
# At each marginal diagonal(1/2,0,1/2), the single-pure-orbit minimum is h2(1/4).
psi=s.Matrix([1,0,1])/s.sqrt(2);single=apply(K,psi*psi.H)
assert single.eigenvals()=={R(3,4):1,R(1,4):1,s.Integer(0):1}
# 2h2(1/4)-H(5/8,1/8,1/8,1/8)>0 iff 2^8*5^5>3^12.
assert 2**8*5**5==800000 and 3**12==531441 and 800000>531441
result={'status':'PASS_EXACT','scope':'Known half-noise ReMAD channel; exact failed proof shortcuts,not a capacity theorem or novelty certificate','degrader_basis_units_checked':9,'uniform_input_complement':['2/3','1/3'],'conditional_shortcut':'For a maximally entangled qutrit/reference input,S(output|reference)=h2(1/3)-log2(3)<0. A nonnegative single-pure-output entropy bound cannot simply be made conditional.','two_use_input':'(|00>+|22>)/sqrt2','two_use_output_nonzero_spectrum':['5/8','1/8','1/8','1/8'],'marginal_diagonal':['1/2','0','1/2'],'naive_unroofed_bound':'2h2(1/4)>actual_output_entropy','exact_comparison':[800000,531441],'roof_not_refuted':'co(e)(1/2,0,1/2)<=1/2 from the basis-state mixture','capacity_additivity_refuted':False,'global_capacity_proved':False}
Path(__file__).with_suffix('.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(result,indent=2))
