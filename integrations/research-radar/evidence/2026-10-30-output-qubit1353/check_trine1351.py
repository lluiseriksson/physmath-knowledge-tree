import sympy as s
import json,pathlib,hashlib
p=pathlib.Path(__file__).parent
u=s.symbols('u', real=True)
I2=s.eye(2);I3=s.eye(3)
X=s.Matrix([[0,1],[1,0]]);Z=s.diag(1,-1)
vectors=[(s.Integer(0),s.Integer(1)),(s.sqrt(3)/2,-s.Rational(1,2)),(-s.sqrt(3)/2,-s.Rational(1,2))]
states=[s.simplify((I2+x*X+z*Z)/2) for x,z in vectors]
assert s.simplify(sum(states,s.zeros(2))-s.Rational(3,2)*I2)==s.zeros(2)
effects=[]
for tau in states:
 E=s.zeros(3);E[:2,:2]=s.Rational(2,3)*tau;E[2,2]=s.Rational(1,3)
 effects.append(s.simplify((1-u)*I3/3+u*E))
assert s.simplify(sum(effects,s.zeros(3))-I3)==s.zeros(3)
J=s.zeros(6)
for i in range(3):
 for j in range(3):
  unit=s.zeros(3);unit[i,j]=1
  out=s.simplify(sum([(E*unit).trace()*tau for E,tau in zip(effects,states)],s.zeros(2)))
  for a in range(2):
   for b in range(2):J[2*i+a,2*j+b]=out[a,b]
J=s.simplify(J)
expected=s.Matrix([[s.Rational(1,2)+u/4,0,0,u/4,0,0],[0,s.Rational(1,2)-u/4,u/4,0,0,0],[0,u/4,s.Rational(1,2)-u/4,0,0,0],[u/4,0,0,s.Rational(1,2)+u/4,0,0],[0,0,0,0,s.Rational(1,2),0],[0,0,0,0,0,s.Rational(1,2)]])
assert s.simplify(J-expected)==s.zeros(6)
v=s.Matrix([0,1,-1,0,0,0])/s.sqrt(2)
assert s.simplify(J*v-(1-u)*v/2)==s.zeros(6,1)
W=(1-u)*I2/2
rem=s.simplify(J-s.kronecker_product(I3,W))
assert s.simplify(rem-u*J.subs(u,1))==s.zeros(6)
# All PSD claims on0<=u<=1 follow from exact affine eigenvalues below.
eigs={str(k):int(vv) for k,vv in J.eigenvals().items()}
reigs={str(k):int(vv) for k,vv in rem.eigenvals().items()}
Eeigs=[{str(k):int(vv) for k,vv in E.eigenvals().items()} for E in effects]
assert s.simplify((v.T*s.kronecker_product(I3,s.Matrix([[s.symbols('a'),s.symbols('b')],[s.symbols('c'),s.symbols('d')]]))*v)[0]-(s.symbols('a')+s.symbols('d'))/2)==0
out={'scope':'Exact own symbolic matrix identities for fixed d3,k2,N3 witness; does not certify the separate general SDP proof or novelty','sympy_version':s.__version__,'prefix_effect_eigenvalues':Eeigs,'prefix_contraction_exact':'2u/3 (analytic subset-oscillation proof in ARGUMENT1351.md)','Choi_matrix':str(J),'Choi_eigenvalues':eigs,'replacement_remainder_eigenvalues':reigs,'maximally_entangled_vector_eigenvalue':'(1-u)/2','positive_component_exact':'1-u for0<=u<=1','refuted_proposal':'alpha_plus>=1-r is false at u=1,r=2/3,alpha_plus=0','new_grade_or_model_review':False,'formal_Lean_result':False}
(p/'EXACT1351.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'all_exact_assertions_passed':True,'Choi_eigenvalues':eigs,'alpha_plus':'1-u','r':'2u/3'}))
