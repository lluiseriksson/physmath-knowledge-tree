"""Exact diagnostic: scalar S4 isometry does not lift to this CP block factor.

Not a counterexample to norm compression. No formal-proof or novelty claim.
Requires SymPy; run python -B integrations/research-radar/checks/cp-block-lifting.py.
"""
import json
import sympy as s

x,y,a,b=s.symbols('x y a b',real=True)
X=s.Matrix([[0,1],[1,0]])
Y=s.diag(1,-1)
Z=s.zeros(2)
scalar_trace=s.expand(s.trace((a*X+b*Y)**4))
assert s.expand(scalar_trace-2*(a*a+b*b)**2)==0
M=(X.row_join(Y).row_join(Z)).col_join(Y.row_join(Z).row_join(X))
actual=s.trace((M*M.T)**2)
Q=s.Matrix([[x,y,0],[y,0,x]])
scalar_lift=s.expand(s.trace((Q*Q.T)**2))
points=[(1,0),(-1,0),(0,1),(0,-1)]+[(i/s.sqrt(2),j/s.sqrt(2)) for i in [-1,1] for j in [-1,1]]
def integrate(poly):
 return s.simplify(sum(s.Rational(2,3)*poly.subs({x:u,y:v},simultaneous=True) for u,v in points))
assert s.expand(integrate((a*x+b*y)**4)-scalar_trace)==0
lifted=integrate(scalar_lift)
assert actual==20 and lifted==12 and actual>lifted
# Desired block norm compression still holds, with equality in this example.
C=s.Matrix([[2,1],[1,2]])
compression_bound=2*s.trace(C*C)
assert compression_bound==actual
# The same shortcut fails inside the missing factor-order interval, at r=3.
# Uniform circle measure of mass 3*pi/2 is an exact scalar S3 isometry:
# average |cos(theta)|^3=4/(3*pi).
t=s.symbols('t',real=True)
assert s.integrate(s.cos(t)**3,(t,0,s.pi/2))==s.Rational(2,3)
assert sorted((M*M.T).eigenvals().items())==[(1,2),(3,2)]
# |xy|<=1/2 on the circle. Convexity/evenness bounds the scalar trace by
# (3*sqrt(6)+sqrt(2))/4. Its integral is <297/28<11, while actual >12.
assert s.Rational(25,9)<3 and 6<s.Rational(25,4) and 2<s.Rational(9,4)
assert s.simplify(s.integrate(t**4*(1-t)**4/(1+t*t),(t,0,1))-(s.Rational(22,7)-s.pi))==0
assert s.Rational(297,28)<11
alpha,beta,eta,delta,K,u,v=s.symbols('alpha beta eta delta K u v',real=True)
trT2=alpha**2+beta**2+eta**2+delta**2+2*(alpha*beta+eta*delta)*u+2*K*K*v
trC2=(alpha+beta)**2+(eta+delta)**2+2*K*K
assert s.expand(trC2-trT2-2*(alpha*beta+eta*delta)*(1-u)-2*K*K*(1-v))==0
print(json.dumps({'scalar_S4_isometry_exact':True,'matrix_amplification_actual_fourth_power':int(actual),'scalar_lift_fourth_power':int(lifted),'compression_bound_fourth_power':int(compression_bound),'factor_order3_actual_strict_lower_bound':12,'factor_order3_scalar_lift_strict_upper_bound':11,'lifting_shortcut_refuted':True,'norm_compression_refuted':False,'p2_gap_identity_exact':True,'formal_verification':False,'novelty_claimed':False},sort_keys=True))
