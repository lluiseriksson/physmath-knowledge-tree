"""Exact small examples for the angular construction, not a general solver."""
from pathlib import Path
import json, hashlib
import sympy as s
x,y,t,z=s.symbols('x y t z',real=True)
rho=x*x+y*y
out=[]
for name,g,F,U,m,J,delta in [
    ('changing_sign',2*x*y/rho,8*x*x*y*y/rho**2-s.Rational(1,2),2*(x*x-y*y)/rho,16,1,s.Rational(1,2)),
    ('one_sign_zero',y*y/rho,2*y**4/rho**2-s.Rational(1,2),s.Rational(14,3)*x*y/rho+s.Rational(2,3)*x*y*(x*x-y*y)/rho**2,128,2,s.Rational(17,162)),
]:
    X1=s.cancel(rho**2*(F*x-g*y));X2=s.cancel(rho**2*(F*y+g*x))
    assert s.denom(X1)==1 or s.denom(X1)==2
    Uh=s.cancel(U*rho**J)
    A=s.expand(rho**J+Uh/m)
    v=s.cancel((-y*s.diff(U,x)+x*s.diff(U,y))/2)
    if name=='changing_sign':
        assert s.cancel(v+2*g)==0
        assert s.cancel(F+g*v+s.Rational(1,2))==0
        # |F U/m| <= (3/2)*2/16=3/16, hence factor <=-5/16.
        factor_margin=s.Rational(5,16)
    else:
        psi=(1-g)**2
        assert s.cancel(v+2*g-s.Rational(8,3)*psi)==0
        assert s.cancel(F+g*v-(-s.Rational(1,2)+s.Rational(8,3)*g*(1-g)**2))==0
        # g(1-g)^2<=4/27 for0<=g<=1; |F U/m|<=15/512.
        assert s.expand(s.Rational(4,27)-z*(1-z)**2+(z-s.Rational(1,3))**2*(z-s.Rational(4,3)))==0
        factor_margin=delta-s.Rational(15,512)
        assert factor_margin>0
    r=J*m-1
    LA=s.diff(A,x)*X1+s.diff(A,y)*X2
    Lrho=2*x*X1+2*y*X2
    target=s.cancel(2*rho**(J+3)*(F*(1+U/m)+g*v))
    assert s.cancel(m*rho*LA-r*A*Lrho-target)==0
    # Expand the actual dense numerator; no huge generic symbolic Lie expansion.
    poly=s.Poly(A,x,y,domain=s.QQ)**m
    dense=[poly.coeff_monomial(x**i*y**(2*J*m-i)) for i in range(2*J*m+1)]
    encoded=json.dumps([str(c) for c in dense],separators=(',',':')).encode()
    count=0
    for c in dense:
        n,d=c.as_numer_denom();count+=abs(int(n)).bit_length()+int(d).bit_length()+2
    out.append({'name':name,'X':[str(X1),str(X2)],'A':str(A),'power':m,'denominator_exponent':r,
      'numerator_degree':2*J*m,'denominator_degree':2*r,'angular_target_margin':str(delta),
      'power_factor_margin':str(factor_margin),'dense_coefficient_proxy_bits':count,
      'dense_coefficient_json_sha256':hashlib.sha256(encoded).hexdigest(),
      'exact_symbolic_identities':True,'positivity_method':'analytic bounds plus exact identities, not a grid',
      'general_solver_implemented':False})
dest=Path(__file__).with_name('examples43.json')
dest.write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(dest.read_text(encoding='utf-8'))
