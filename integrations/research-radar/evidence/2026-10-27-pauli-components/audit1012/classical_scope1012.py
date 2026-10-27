import sympy as s,json,pathlib
P=pathlib.Path(__file__).parent;R=s.Rational
sig=s.diag(R(9,20),R(1,20),R(1,20),R(9,20));d=s.zeros(4);d[0,3]=d[3,0]=1;l=-R(1,3);t=R(1,100);rho=sig+t*d;E=lambda x:s.kronecker_product(s.eye(2)/2,s.Matrix(2,2,lambda i,j:x[i,j]+x[i+2,j+2]));N=lambda x:l*x+(1-l)*E(x);pt=lambda x:s.Matrix(4,4,lambda i,j:x[2*(j//2)+i%2,2*(i//2)+j%2])
g=lambda a,b:s.factor((s.Matrix(list(b)).T*(s.kronecker_product(a,s.eye(4))+s.kronecker_product(s.eye(4),a.T)).inv()*s.Matrix(list(b)))[0]*2)
q=g(N(sig),N(d))/g(sig,d)
checks={'zero_R_tangent':E(d)==s.zeros(4),'sigma_classical':sig.is_diagonal(),'rho_faithful':all(x>0 for x in rho.eigenvals()),'rho_PPT':all(x>0 for x in pt(rho).eigenvals()),'ratio_gt_ordinary':bool(q>l*l),'ratio_lt_PPT_upper':bool(q<2*l*l/(1+l))}
(P/'CLASSICAL_SCOPE1012.json').write_text(json.dumps({'sigma':str(sig),'D':str(d),'t':str(t),'lambda':str(l),'ratio':str(q),'ordinary':str(l*l),'PPT_upper':str(2*l*l/(1+l)),'checks':checks,'scope':'Exact counterexample to claiming that a classical base alone enforces the classical-family bound; consistent with1011 fixed reference-basis family restriction.'},indent=2)+'\n',encoding='utf-8');print(checks,str(q));assert all(checks.values())
