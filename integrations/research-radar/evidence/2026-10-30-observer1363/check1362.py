import json
import sympy as S

a,b,c,d,e,h,X,Y,Z,t,q=S.symbols('a b c d e h X Y Z t q',positive=True)
state=[X,Y,Z]
F=a*Y-b*X*Y+c*X-d*X**2
G=-(a+b*X)*Y+e*Z
H=c*X-h*Z
flow=[F,G,H]
def lie(expr):return S.expand(sum(S.diff(expr,v)*f for v,f in zip(state,flow)))
L0=Z;L1=H;L2=lie(L1);L3=lie(L2)
det2=S.factor(S.Matrix([L0,L1,L2]).jacobian(state).det())
det3critical=S.factor(S.Matrix([L0,L1,L3]).jacobian(state).det().subs(X,a/b))
assert S.simplify(det2-c**2*(a-b*X))==0
assert S.simplify(det3critical-a*c**2*(a*d-b*c)/b)==0
assert S.simplify((L1+h*Z)/c-X)==0
assert S.simplify((L2+h*L1)/c-F)==0
assert S.simplify((L3+h*L2)/c-lie(F))==0
regular=S.cancel((F-c*X+d*X**2)/(a-b*X)-Y)
assert regular==0
critical=S.factor(((c-2*d*X-lie(F)/F)/b-Y).subs(X,a/b))
assert critical==0  # rational identity only: F != 0, i.e. ad != bc here
degF=S.factor(F.subs(c,a*d/b))
assert S.simplify(degF-(a/b-X)*(b*Y+d*X))==0
assert S.simplify(degF.subs(X,a/b))==0
assert S.simplify(G.subs(X,a/b)-(-2*a*Y+e*Z))==0
assert S.diff(H.subs(X,a/b),Y)==0
# Explicit normalized indistinguishable trajectories: X=Z=1, all coefficients1.
coeff={a:1,b:1,c:1,d:1,e:1,h:1}
for initial in [S.Integer(0),S.Integer(2)]:
    yt=S.Rational(1,2)+(initial-S.Rational(1,2))*S.exp(-2*t)
    vals={X:1,Y:yt,Z:1}
    assert S.simplify(F.subs(coeff).subs(vals))==0
    assert S.simplify(H.subs(coeff).subs(vals))==0
    assert S.simplify(S.diff(yt,t)-G.subs(coeff).subs(vals))==0
print(json.dumps({'status':'passed','sympy':S.__version__,'second_jet_determinant':str(det2),'third_jet_minor_at_X_a_over_b':str(det3critical),'regular_reconstruction':'X=(z_prime+h*z)/c; Y=(X_prime-c*X+d*X^2)/(a-b*X), a-bX!=0','critical_reconstruction':'At X=a/b and ad!=bc: X_prime=X*(c-dX)!=0; Y=(c-2dX-X_second/X_prime)/b; needs z derivatives through order3','generic_scope':'Known positive coefficients with ad!=bc: exact output derivatives through order3 distinguish the state pointwise; no noise/robustness assertion','exception':'At ad=bc, X=a/b is invariant. Z_prime=c*a/b-hZ is independent of Y; Y_prime=-2aY+eZ. Different Y0 have identical future Z.','finite_exception_witness':'All coefficients1, X=Z=1, Y0 in {0,2}; Y=1/2+(Y0-1/2)exp(-2t)','scope':'Own exact algebra and explicit special trajectories in a known deterministic model. Not empirical validation, general source-proof audit, novelty certificate, observer implementation, noisy forecast guarantee, manuscript grade or Lean theorem.'}))
