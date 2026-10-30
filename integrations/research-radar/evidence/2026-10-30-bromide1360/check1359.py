import json
import sympy as S

# Reparametrized irreversible equations(Ia-Ic), not a new chemical model.
a,b,c,d,e,h,X,Y,Z=S.symbols('a b c d e h X Y Z',positive=True)
F=a*Y-b*X*Y+c*X-d*X**2
G=-a*Y-b*X*Y+e*Z
H=c*X-h*Z
flow=S.Matrix([F,G,H])
J=flow.jacobian([X,Y,Z])
secondY=S.expand(sum(S.diff(G,v)*q for v,q in zip([X,Y,Z],flow)))
boundary=S.simplify(secondY.subs({Y:0,Z:0}))
assert boundary==c*e*X
assert G.subs({Y:0,Z:0})==0
assert S.diff(F,Y)==a-b*X
assert S.simplify(S.diff(F,Y).subs({a:1,b:1,X:S.Rational(1,2)}))==S.Rational(1,2)
assert S.simplify(S.diff(F,Y).subs({a:1,b:1,X:2}))==-1
assert list(flow.subs({X:0,Y:0,Z:0}))==[0,0,0]
assert F.subs(X,0)==a*Y and G.subs(Y,0)==e*Z and H.subs(Z,0)==c*X
print(json.dumps({'status':'passed','sympy':S.__version__,'parameter_dictionary':{'a':'kM1*A','b':'kM2','c':'kM3*B','d':'2*kM4','e':'f*kM5','h':'kM5'},'sign_of_bromide_response':'dF/dY=a-bX; no globally fixed inhibitor sign','finite_normalized_sign_witnesses':['X=1/2: +1/2','X=2: -1'],'zero_Y_Z_boundary':{'Y_prime':'0','Y_second':'c*e*X > 0 for X>0','local_taylor':'Y(t)=c*e*X0*t^2/2+O(t^3)'},'zero_all_states':'equilibrium; no generation from all-zero state','jacobian':str(J),'scope':'Exact identities and local boundary argument in the stated deterministic constant-reservoir model; not empirical validation, novel theorem, full source proof audit or a new manuscript.'}))
