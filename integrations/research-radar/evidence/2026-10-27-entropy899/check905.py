import sympy as s
import json
F=s.Rational;c=F(3,5);A=F(119,400);Q=F(243,595)
assert 4*A*(1-Q)==F(88,125)
assert F(11,125)-F(1,30)==F(41,750)
ks=[s.diag(s.sqrt(F(29,40)),c/s.sqrt(F(29,40))),s.diag(0,s.sqrt(F(33,1160))),
    s.Matrix([[0,s.sqrt(F(19,40))],[0,0]]),s.Matrix([[0,0],[s.sqrt(F(11,40)),0]])]
assert s.simplify(sum((k.H*k for k in ks),s.zeros(2)))==s.eye(2)
def comp(x):return s.simplify(s.Matrix(4,4,lambda i,j:s.trace(ks[i]*x*ks[j].H)))
z=s.diag(1,-1);w=s.diag(1,1,-1,-1)
for i in range(2):
 for j in range(2):
    unit=s.zeros(2);unit[i,j]=1
    assert s.simplify(comp(z*unit*z)-w*comp(unit)*w)==s.zeros(4)
Eavg=comp(s.eye(2)/2)
assert s.simplify(s.trace(Eavg**2))==F(729,1600)<F(1,2)
r0=s.Matrix([1,0]);r1=s.Matrix([1,s.sqrt(15)])/4
v0=s.kronecker_product(s.Matrix([1,0]),r0);v1=s.kronecker_product(s.Matrix([0,1]),r1)
plus=(v0+v1)/s.sqrt(2);minus=(v0-v1)/s.sqrt(2)
rho=F(3,4)*plus*plus.H+F(1,4)*minus*minus.H
assert rho.rank()==2 and s.trace(rho)==1
pt=s.Matrix(4,4,lambda i,j:rho[2*(i//2)+(j%2),2*(j//2)+(i%2)])
det=s.simplify(pt.det());assert det<0
rhoR=s.Matrix(2,2,lambda i,j:sum(rho[2*a+i,2*a+j] for a in range(2)))
assert set(rhoR.eigenvals())=={F(5,8),F(3,8)}
# Noncommuting branch states: genuinely overlapping supports.
assert r0*r0.H*r1*r1.H != r1*r1.H*r0*r0.H
check={'passed':True,'sympy':s.__version__,'partial_transpose_determinant':str(det),
 'example_rank':2,'reference_spectrum':['5/8','3/8'],'complement_purity':'729/1600',
 'phase_covariance_all_four_matrix_units':True,'curvature_lower_bound':'88/125',
 'example_gap_lower_bound_nats':'41/750','scope':'Finite exact algebra plus written entropy proof; no universal Q proof or model assessment.'}

print(json.dumps(check,indent=2))
