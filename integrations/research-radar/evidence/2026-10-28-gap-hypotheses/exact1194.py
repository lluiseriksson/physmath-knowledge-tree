from pathlib import Path
import sympy as s,json
C=Path(__file__).parent;I=s.eye(2);ii=s.I
u=s.Matrix([1,1])/s.sqrt(2);v=s.Matrix([1,ii])/s.sqrt(2)
T=[u*u.H,v*v.H];omega=(T[0]+T[1])/2
V=s.Matrix.hstack(u,v);X=s.simplify(V*s.diag(1,-1)*V.inv())
def sm(a):return a.applyfunc(s.simplify)
def N(a):return a[0,0]*T[0]+a[1,1]*T[1]
def Phi(a):return s.diag(s.trace(T[0]*a),s.trace(T[1]*a))
def E(a):return s.trace(omega*a)*I
assert omega.det()==s.Rational(1,8) and s.trace(omega)==1
assert sm(N(omega)-omega)==s.zeros(2)
assert s.simplify(s.trace(omega*X))==0
assert s.simplify(s.trace(omega*X.H*X))==1
assert s.simplify(s.trace(omega*Phi(X).H*Phi(X)))==1
assert sm(Phi(X)-s.diag(1,-1))==s.zeros(2)
for a in [s.Matrix(2,2,lambda i,j:int(i==r and j==c)) for r in range(2) for c in range(2)]:
    assert sm(N(N(a))-s.trace(a)*omega)==s.zeros(2)
    assert sm(Phi(Phi(a))-E(a))==s.zeros(2)
H=s.Matrix([[s.Rational(1,2),1-ii],[1+ii,s.Rational(1,2)]]);cert=[]
assert s.trace(H)==1 and H.det()<0
for t in T:
    R=sm(t-H/4);assert s.trace(R)==s.Rational(3,4) and R.det()==s.Rational(1,64)
    cert.append({'trace':str(s.trace(R)),'determinant':str(R.det())})
r={'exact_symbolic':True,'omega':str(omega),'centered_nonHermitian_X':str(X),'norm2_GNS_X':'1','norm2_GNS_Phi_X':'1','one_step_centered_GNS_norm':'exactly1; lower witness plus unital-CP invariant-state contractivity','N_squared':'replacer_omega; checked on all four matrix units','complete_equal_reference_trace_upper':'3/4; exact Hermitian-replacer residuals','H':str(H),'residuals':cert,'scope':'Falsifies inference of strict one-step GNS coercivity from complete trace contraction, not Gao-Wang theorem; no new physics, manuscript, grade or formal Lean proof.'}
(C/'EXACT1194.json').write_text(json.dumps(r,indent=2)+'\n',encoding='utf-8');print(json.dumps(r))
