from pathlib import Path
import sympy as s,json
p=Path(__file__).parent;e=s.symbols('e',positive=True);theta,l,k,pv=s.symbols('theta lambda k p',real=True);z=s.Symbol('z');den=1+e*e
a=s.Matrix([1,0,0,0,e,0]);b=s.Matrix([0,e,0,0,0,1]);sig=(a*a.T+b*b.T)/(2*den);E=s.diag(1,2*e*e,1,1,2*e*e,1)/(4*den)
wh=s.diag(2*s.sqrt(den),s.sqrt(2*den)/e,2*s.sqrt(den),2*s.sqrt(den),s.sqrt(2*den)/e,2*s.sqrt(den));B=s.simplify(wh*sig*wh)
checks={'whitening_spectrum':s.factor(B.charpoly(z).as_expr()-z**4*(z-3)**2)==0,'mixed_whitening_spectrum':s.factor(((1-theta)*s.eye(6)+theta*B).charpoly(z).as_expr()-(z-1-2*theta)**2*(z-1+theta)**4)==0}
mixed=(1-theta)*E+theta*sig
pt=s.Matrix(6,6,lambda i,j:mixed[3*(j//3)+i%3,3*(i//3)+j%3])
for name,ind in [('first',[3,1]),('second',[4,2])]:checks['PPTdet_'+name]=s.factor(pt.extract(ind,ind).det()-e*e*(1-theta-2*theta*theta)/(8*den**2))==0
W=s.Matrix([[1+pv,2*pv*e],[2*pv*e,2*e*e]])/(4*den);D=s.Matrix([[0,1],[1,2*e]])
x,y,q=s.symbols('x y q');Y=s.Matrix([[x,y],[y,q]]);eq=W*Y+Y*W-2*D;sol=s.solve([eq[0,0],eq[0,1],eq[1,1]],[x,y,q]);G=s.factor(2*s.trace(D*Y.subs(sol)))
expected=16*den*(4*e*e*pv+2*e*e+3*pv+3)/((2*pv+1)*(2*e*e+pv+1))
checks['SLD_rational_identity']=s.factor(G-expected)==0
ratio=s.factor(l*l*G.subs(pv,l*theta)/G.subs(pv,theta));lim=s.factor(ratio.subs(e,0));target=l*l*(1+2*theta)/(1+2*l*theta)
checks['SLD_limit']=s.factor(lim-target)==0;checks['budget_substitution']=s.factor(target.subs(theta,(k-1)/2)-l*l*k/(1+l*(k-1)))==0
checks['SEP_threshold']=s.factor(target.subs(theta,s.Rational(1,2))-2*l*l/(1+l))==0
checks['full_threshold']=s.factor(target.subs(theta,1)-3*l*l/(1+2*l))==0
checks['kappa_monotone_derivative']=s.factor(s.diff(l*l*k/(1+l*(k-1)),k)-l*l*(1-l)/(1+l*(k-1))**2)==0
assert all(checks.values()),checks
out={'scope':'Parent exact whitening, PPTblock and2x2Sylvester checks for1011; no external audit or full universalproofcertificate','count':len(checks),'checks':checks,'failures':0,'SLD_ratio_at_finite_e':str(ratio),'SLD_limit':str(lim),'pair_endpoint_warning':'kappa1has no distinct equalRfinitepairs; main pair theoremonlykappa>1','new_score':None}
(p/'CHECK1011.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,indent=2))
