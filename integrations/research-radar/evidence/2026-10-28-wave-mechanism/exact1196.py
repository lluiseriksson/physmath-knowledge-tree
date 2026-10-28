from pathlib import Path
import sympy as s,json
C=Path(__file__).parent
r,b,D=s.symbols('r b D',positive=True);T=s.symbols('T',real=True)
p=s.log(3/r)/D;g=r*r*(1+s.log(3/r))/(4*D)
gb=g.subs(r,b);g3=g.subs(r,3);L=p*gb+(1-p)*g3
E=(1-s.cos(T))*p+L-g
rad=lambda h:s.simplify(s.diff(h,r,2)+s.diff(h,r)/r)
assert rad(p)==0 and s.simplify(rad(g)-p)==0 and rad(L)==0
assert s.simplify(s.diff(E,T,2)+rad(E)-(s.cos(T)-1)*p)==0
assert s.simplify((E.subs(r,b)-(1-s.cos(T))).subs(D,s.log(3/b)))==0
assert s.simplify(E.subs(r,3))==0
rank_n,rank_r=s.symbols('n r_rank',integer=True,positive=True)
lam,alpha,mu=s.symbols('lambda alpha mu',positive=True)
# An exact toy, not the manuscript's PDE: rank-two background in dimension three.
A=s.diag(lam+alpha,lam+alpha,alpha);det=s.expand(A.det())
assert s.simplify(det-alpha*(lam+alpha)**2)==0
assert s.expand(det-alpha*lam**2)==2*alpha**2*lam+alpha**3
record={'scalar_identities':{'radial_laplacian_p':'0','radial_laplacian_g':'p','radial_laplacian_L':'0','full_laplacian_E':'(cos(T)-1)p','inner_boundary_E':'1-cos(T)','outer_boundary_E':'0'},'analytic_positivity_scope':'For0<b<r<3 and D=log(3/b): p>=0; g increasing, subharmonic; harmonic interpolant L>=g by maximum principle. Exact symbolic identities do not audit the entire manuscript PDE.','scalar_loss_obstruction':'At r=2b, E(0,2b)<=9 log2/(4D^2), while the observed-time weighted mass has a positive b-independent lower bound. Known Remark6.2 mechanism, not a new result.','rank_toy':{'matrix':str(A),'determinant':str(det),'positive_remainder_after_alpha_lambda_squared':str(s.expand(det-alpha*lam**2)),'consequence':'If determinant=lambda and alpha>0, then alpha<=1/lambda. A lambda-uniform positive lower depth scale cannot follow from this unchanged-RHS rank-two toy.'},'no_new_paper_grade_or_formal_result':True}
(C/'EXACT1196.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps(record))
