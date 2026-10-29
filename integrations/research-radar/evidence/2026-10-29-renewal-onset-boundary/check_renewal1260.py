from pathlib import Path
from fractions import Fraction as F
import sympy as s,json,hashlib,urllib.request,datetime
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
url='https://galton.uchicago.edu/~lalley/Courses/313/RenewalTheory.pdf'
with urllib.request.urlopen(url,timeout=35) as response:primary=response.read()
out={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'confidence':'heuristic; exact symbolic identities and analytic argument supplied, not formal verification or independent review','general_symbolic_identities':{a:str(b) for a,b in identities.items()},'finite_controls':finite,'channel_convention':'Superoperator row-vectorization basis (00,01,10,11); output-first unnormalized Choi J(Id)=vec(I)vec(I)^T, J(reset)=I4/2','choi_ranks':{'identity':1,'complete_depolarizing':4},'stationary_law':'pi(r)=1/[r(r+1)], r>=1','gap_law':'P(G=k)=4/[k(k+1)(k+2)], E G=2','onset_convention':'Length n includes local channels at times0,...,n-1; channel at time0 reset iff R0=1. First and eventual full-Choi onset N=R0.','tail':'P(N>n)=1/(n+1), n>=0','mean_onset':'infinite, by harmonic sum; N finite almost surely','reset_frequency':'pi(1)=1/2 under stationary ergodic path law','uniform_limit':'I2/2, smallest eigenvalue1/2; product exactly reset once n>=N','exponential_prefactor':'For any fixed q in(0,1), ||Phi^(n)-Delta||_(1->1)<=2*q^(-N)*q^n. Prefactor finite almost surely; its mean is infinite. This is a construction-specific bound, not an arbitrary-rate assertion for the imported theorem.','prior_art':{'url':url,'transport_sha256':hashlib.sha256(primary).hexdigest(),'bytes':len(primary),'reading':'Selected Section1.4/1.7 stationary countdown equations and Section2 Example4 residual distribution read through web; no full proof audit. Standard renewal mechanism, no novelty claim.','PDF_redistributed':False},'not_claimed':['new manuscript','new model grade','full imported theorem proof audit','Lean theorem','new renewal theorem','global novelty','universal quantitative bound']}
(C/'CONTROL1260.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print('Five general rational identities, six truncations, exact Choi ranks and sixteen countdown controls passed; standard renewal boundary, no new paper.')
