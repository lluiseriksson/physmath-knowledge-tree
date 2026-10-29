from pathlib import Path
from fractions import Fraction as F
import sympy as s,json
C=Path(__file__).parent
r,k,M=s.symbols('r k M',integer=True,positive=True)
p=4/(k*(k+1)*(k+2));pi=lambda x:1/(x*(x+1))
identities={
 'gap_telescoping':s.simplify(p-(2/(k*(k+1))-2/((k+1)*(k+2)))),
 'mean_gap_telescoping':s.simplify(k*p-4*(1/(k+1)-1/(k+2))),
 'stationary_balance':s.simplify(pi(r+1)+s.Rational(1,2)*p.subs(k,r)-pi(r)),
 'stationary_telescoping':s.simplify(pi(r)-(1/r-1/(r+1))),
 'truncated_onset_mean':s.simplify(r*pi(r)-1/(r+1))}
assert all(x==0 for x in identities.values())
finite=[]
for n in [1,2,3,8,32,128]:
    gap=sum(F(4,j*(j+1)*(j+2)) for j in range(1,n+1))
    mean=sum(F(4,(j+1)*(j+2)) for j in range(1,n+1))
    residual=sum(F(1,j*(j+1)) for j in range(1,n+1))
    assert gap==1-F(2,(n+1)*(n+2))
    assert mean==2-F(4,n+2)
    assert residual==1-F(1,n+1)
    finite.append({'cutoff':n,'gap_mass':str(gap),'gap_first_moment':str(mean),'residual_mass':str(residual)})
I=s.eye(4);L=s.Matrix([[s.Rational(1,2),0,0,s.Rational(1,2)],[0,0,0,0],[0,0,0,0],[s.Rational(1,2),0,0,s.Rational(1,2)]])
assert L*L==L and I*L==L and L*I==L
iv=s.Matrix([1,0,0,1]); assert L*iv==iv and L.T*iv==iv
Jid=iv*iv.T;Jreset=s.eye(4)/2
assert Jid.rank()==1 and Jreset.rank()==4
for initial in range(1,17):
    product=I
    for length in range(1,initial+4):
        # Channel at time j is reset when countdown is1. After first reset,
        # arbitrary later identity/reset choices cannot change the product.
        channel=L if length==initial else I
        product=channel*product
        assert product==(I if length<initial else L)

out={'symbolic_identities':{a:str(b) for a,b in identities.items()},'finite_truncations':finite,'choi_ranks':[Jid.rank(),Jreset.rank()],'countdown_cases':16,'network_required':False,'formal_proof':False}
(C/'REPLAY1261.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print('Exact symbolic, truncation, Choi and countdown controls passed; not a formal proof.')
