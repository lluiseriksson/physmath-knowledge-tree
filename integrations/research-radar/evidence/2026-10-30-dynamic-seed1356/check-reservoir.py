import json, platform
import sympy as S
A,B,x,y,p,c=S.symbols('A B x y p c', positive=True)
f=A-(B+1)*x+x*x*y
g=B*x-x*x*y
J=S.Matrix([f,g]).jacobian([x,y]).subs({x:A,y:B/A})
pdot=S.factor(((f*(x+y)-x*(f+g))/(x+y)**2).subs({x:p*c,y:(1-p)*c}))
expected=A*(1-p)/c-(B+1)*p+p*p+p*p*(1-p)*c*c
assert S.simplify(f+g-(A-x))==0
assert S.simplify(pdot-expected)==0
assert S.simplify(J.trace()-(B-1-A*A))==0
assert S.simplify(J.det()-A*A)==0
assert S.simplify(f.subs({x:A,y:B/A}))==0 and S.simplify(g.subs({x:A,y:B/A}))==0
w=[S.simplify(pdot.subs({A:1,B:3,p:S.Rational(1,2),c:v})) for v in (2,4)]
assert w==[-1,S.Rational(3,8)]
assert f.subs(x,0)==A and g.subs(y,0)==B*x
print(json.dumps({'status':'passed','python':platform.python_version(),'sympy':S.__version__,'equilibrium':['A','B/A'],'jacobian':str(J),'trace':str(J.trace()),'determinant':str(J.det()),'total_derivative':'A-x','fraction_derivative':str(pdot),'same_fraction_opposite_derivatives':list(map(str,w)),'scope':'exact algebra and finite witnesses only; no nonlinear Hopf proof, formal Lean proof or empirical test'}))
