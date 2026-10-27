from pathlib import Path
import sympy as s,json
P=Path(__file__).parent
d=s.symbols('d',integer=True,positive=True);e=s.symbols('e',positive=True);p,l,th,k=s.symbols('p lambda theta kappa',real=True)
W=s.Matrix([[1+(d-1)*p,d*p*e],[d*p*e,d*e*e]])/(d*d*(1+e*e));D=s.Matrix([[0,1],[1,2*e]])
x,y,z=s.symbols('x y z');Y=s.Matrix([[x,y],[y,z]]);eq=W*Y+Y*W-2*D
sol=s.solve([eq[0,0],eq[0,1],eq[1,1]],[x,y,z]);G=s.factor(s.trace(D*Y.subs(sol)))
limit=s.factor(G.subs(e,0));expected=4*d*(d+1)/(1+d*p)
checks={'generic_SLD_limit':s.factor(limit-expected)==0,'positive_block_determinant':s.factor(W.det()-e*e*(1-p)*(1+d*p)/(d**3*(1+e*e)**2))==0,'budget_ratio':s.factor((l*l*limit.subs(p,l*th)/limit.subs(p,th)).subs(th,(k-1)/d)-l*l*k/(1+l*(k-1)))==0}
rows=[]
for n in [2,3,4,5]:
 r=n+1;N=n*r;vecs=[]
 for i in range(n):
  a=s.zeros(N,1);a[i*r+i]=1;a[((i+1)%n)*r+n]=e;vecs.append(a)
 sigma=sum((a*a.T for a in vecs),s.zeros(N))/(n*(1+e*e))
 tangent=s.zeros(N)
 # Only two edges are varied; their equal and opposite coefficients keep R fixed.
 for i,c in [(0,1),(1,-1)]:
  da=s.zeros(N,1);da[((i+1)%n)*r+n]=c
  tangent+=da*vecs[i].T+vecs[i]*da.T
 partial=lambda a:s.Matrix(r,r,lambda i,j:sum(a[t*r+i,t*r+j] for t in range(n)))
 br=partial(sigma);B=s.diag(*[br for _ in range(n)])/n
 invsqrt=s.diag(*[1/s.sqrt(B[i,i]) for i in range(N)])
 F=s.simplify(invsqrt*sigma*invsqrt)
 cols=invsqrt*s.Matrix.hstack(*vecs)/s.sqrt(n*(1+e*e))
 support=2*0*s.eye(N)+sum((a*a.T/(1+e*e) for a in vecs),s.zeros(N))
 facts=dict(d=n,R=r,partial_trace_zero=partial(tangent)==s.zeros(r),whitened_gram=s.simplify(cols.T*cols)==(n+1)*s.eye(n),whitened_nonzero_spectrum=str(n+1)+' with multiplicity '+str(n),kernel_tangent_zero=s.simplify((s.eye(N)-support)*tangent*(s.eye(N)-support))==s.zeros(N),trace_one=s.factor(s.trace(sigma)-1)==0)
 assert all(facts[x] for x in ['partial_trace_zero','whitened_gram','kernel_tangent_zero','trace_one'])
 rows.append(facts)
assert all(checks.values())
out=dict(scope='Parent candidate general-d ladder; symbolic2x2 identity for symbolic dimension and explicit full-matrix controls d2,3,4,5. No external review or novelty claim.',checks=checks,SLD_block_exact=str(G),SLD_block_limit=str(limit),construction=rows,range='d>=2,1<kappa<=d+1,-1/(d²-1)<=lambda<=1; no exact coefficient claim beyond this order range',grade=None)
(P/'CHECK1017.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(generic_checks=checks,full_matrix_dimensions=[x['d'] for x in rows],all_passed=True)))
