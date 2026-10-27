"""Own exact controls: full row-vectorized Sylvester systems, no supplied solvers."""
import sympy as s,json,pathlib,time,traceback
P=pathlib.Path(__file__).parent;R=s.Rational;I=s.eye(6)
records=[]
def save(): (P/'EXACT1012.json').write_text(json.dumps({'method':'Full 36x36 row-vectorized rational systems; exact residuals; bounded controls, not universal proof','records':records},indent=2)+'\n',encoding='utf-8')
def rec(name,**x): records.append(dict(name=name,**x));save();print(name,flush=True)
def pa(x):return s.Matrix(3,3,lambda i,j:x[i,j]+x[i+3,j+3])
def E(x):return s.kronecker_product(s.eye(2)/2,pa(x))
def N(x,l):return l*x+(1-l)*E(x)
def pt(x):return s.Matrix(6,6,lambda i,j:x[3*(j//3)+i%3,3*(i//3)+j%3])
def pd(x):
 minors=[s.factor(x[:j,:j].det()) for j in range(1,7)]
 return {'positive':all(v>0 for v in minors),'leading_minors':[str(v) for v in minors]}
def form(a,b,d):
 n=a.rows;Q=s.kronecker_product(a,s.eye(n))+s.kronecker_product(s.eye(n),b.T)
 z=s.Matrix(list(d));v=Q.inv()*z;Y=s.Matrix(n,n,list(v))
 assert a*Y+Y*b==d
 return s.factor((d.T*Y).trace())
def family(e):
 a=s.Matrix([1,0,0,0,e,0]);b=s.Matrix([0,e,0,0,0,1]);base=(a*a.T+b*b.T)/(2*(1+e*e))
 d=s.zeros(6)
 for i,j,v in [(0,4,1),(4,0,1),(4,4,2*e),(1,1,-2*e),(1,5,-1),(5,1,-1)]:d[i,j]=v
 assert pa(d)==s.zeros(3)
 return base,d
try:
 # A different implementation of the supplied finite certificate.
 e=R(1,1000);xi=R(1,10**18);base,d=family(e);sig=(1-xi)*base+xi*I/6
 gi=2*form(sig,sig,d);os=N(sig,-R(1,3));od=N(d,-R(1,3));go=2*form(os,os,od);q=s.factor(go/gi)
 supplied=json.loads(pathlib.Path(r'D:\Proyectos\airr-investigacion\2026-10-27_envelope1003-certificate\CERTIFICATE1003.json').read_text())
 Q=s.diag(1,0,0,0,1,0)
 rec('finite1003_reconstructed',Gin=str(gi),Gout=str(go),ratio=str(q),decimal=str(s.N(q,50)),ratio_gt_999997e_6=bool(q>R(999997,10**6)),ratio_lt_1=bool(q<1),enhancement=str(9*q),sigma=pd(sig),output=pd(os),NPT_minor=str(pt(sig).extract([1,3],[1,3]).det()),unitary_obstruction={'Q_commutes':Q*sig==sig*Q,'TrQD':str(s.trace(Q*d))})
 # Finite, nonzero Petz triangular pair, beyond the local certificate.
 t=R(1,10**24);rho=sig+t*d;orr=N(rho,-R(1,3))
 tri=s.factor(form(orr,os,orr-os)/form(rho,sig,rho-sig))
 rec('finite1003_nonzero_pair_own',t=str(t),rho=pd(rho),output_rho=pd(orr),equal_R=pa(rho)==pa(sig),ratio=str(tri),decimal=str(s.N(tri,40)),gt_999997e_6=bool(tri>R(999997,10**6)),lt_1=bool(tri<1))
 # All sixteen exact profile cases, full ambient superoperator each time.
 e=R(1,100);t=R(1,10**10);base,d=family(e)
 reference=json.loads(pathlib.Path(r'D:\Proyectos\airr-investigacion\2026-10-27_profile1011\FINITE1011.json').read_text())['rows'];idx=0
 for kap,th in [(R(3,2),R(6,25)),(s.Integer(2),R(49,100)),(s.Integer(3),R(99,100)),(s.Integer(4),R(99,100))]:
  sig=N(base,th);rho=sig+t*d;checks={'sigma':pd(sig),'rho':pd(rho),'slack_sigma':pd(kap*E(sig)-sig),'slack_rho':pd(kap*E(rho)-rho),'PPT_sigma':pd(pt(sig)),'PPT_rho':pd(pt(rho))}
  assert all(checks[k]['positive'] for k in ['sigma','rho','slack_sigma','slack_rho'])
  if th<R(1,2):assert checks['PPT_sigma']['positive'] and checks['PPT_rho']['positive']
  for l in [-R(1,3),-R(1,5),R(1,2),R(9,10)]:
   os=N(sig,l);orr=N(rho,l);local=s.factor(form(os,os,l*d)/form(sig,sig,d));tri=s.factor(form(orr,os,l*t*d)/form(rho,sig,t*d));K=min(kap,3);bound=l*l*K/(1+l*(K-1));r=reference[idx];idx+=1
   assert local==s.sympify(r['local_ratio_exact']) and tri==s.sympify(r['triangular_ratio_exact']) and local<=bound and tri<=bound
   rec('profile_pair',kappa=str(kap),theta=str(th),lambda_=str(l),local=str(local),triangular=str(tri),bound=str(bound),matches_supplied=True,checks=checks,output_sigma=pd(os),output_rho=pd(orr))
 # Negative lambda order shorthand has a genuine domain restriction.
 rec('order_bound_domain',lambda_='-1/3',kappa='5',c=str(-R(1,3)+(1+R(1,3))/5),raw_lambda_squared_over_c=str(R(1,9)/(-R(1,3)+(1+R(1,3))/5)),clamped_C='1',interpretation='Raw min with order formula is invalid here: c<0; use order only kappa<=3.')
 # Primal/dual Doeblin certificate, constructed directly from Kraus Choi.
 ps=[s.eye(2),s.Matrix([[0,1],[1,0]]),s.Matrix([[0,-s.I],[s.I,0]]),s.diag(1,-1)]
 om=s.Matrix([1,0,0,1]);gamma=sum(((s.kronecker_product(s.eye(2),u)*om)*(s.kronecker_product(s.eye(2),u)*om).conjugate().T/3 for u in ps[:3]),s.zeros(4));v=s.Matrix([1,0,0,-1]);dual=v*v.T
 partial=s.Matrix(2,2,lambda i,j:dual[i,j]+dual[i+2,j+2]);rec('doeblin',gamma=str(gamma),trace=str(s.trace(gamma)),eigenvalues={str(k):v for k,v in gamma.eigenvals().items()},dual_eigenvalues={str(k):v for k,v in dual.eigenvals().items()},dual_partial_trace=str(partial),dual_objective=str(s.trace(gamma*dual)),alpha='0',ordinary_trace_coefficient='1/3',valid=partial==s.eye(2) and s.trace(gamma*dual)==0)
 rec('complete',passed=True)
except Exception as ex:
 rec('ERROR',error=repr(ex),traceback=traceback.format_exc());raise
