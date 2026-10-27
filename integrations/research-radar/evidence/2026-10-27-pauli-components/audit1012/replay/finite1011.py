from pathlib import Path
import sympy as s,json
P=Path(__file__).parent
def ptr(x):return s.Matrix(3,3,lambda i,j:x[i,j]+x[i+3,j+3])
def E(x):return s.diag(ptr(x),ptr(x))/2
def N(x,l):return l*x+(1-l)*E(x)
def positive(x):return all(x[:i,:i].det()>0 for i in range(1,7))
def ppt(x):return s.Matrix(6,6,lambda i,j:x[3*(j//3)+i%3,3*(i//3)+j%3])
def form(left,right,d):
 # Matrices share two2x2 blocks and two singleton blocks. Solve exact,
 # unsymmetrized Sylvester equations independently on each invariant block.
 val=0
 for ix in [[0,4],[1,5],[2],[3]]:
  a=left.extract(ix,ix);b=right.extract(ix,ix);z=d.extract(ix,ix);n=len(ix)
  ys=s.symbols('y:'+str(n*n));Y=s.Matrix(n,n,ys)
  sol=s.linsolve(list(a*Y+Y*b-z),ys);r=next(iter(sol));Y=s.Matrix(n,n,r)
  assert a*Y+Y*b==z
  val+=s.trace(z*Y)
 return s.factor(val)
e=s.Rational(1,100);t=s.Rational(1,10**10)
a=s.Matrix([1,0,0,0,e,0]);b=s.Matrix([0,e,0,0,0,1]);sig=(a*a.T+b*b.T)/(2*(1+e*e))
d=s.zeros(6);d[0,4]=d[4,0]=1;d[4,4]=2*e;d[1,1]=-2*e;d[1,5]=d[5,1]=-1
assert ptr(d)==s.zeros(3)
rows=[]
for k,theta in [(s.Rational(3,2),s.Rational(24,100)),(s.Integer(2),s.Rational(49,100)),(s.Integer(3),s.Rational(99,100)),(s.Integer(4),s.Rational(99,100))]:
 sigma=N(sig,theta);rho=sigma+t*d
 assert ptr(rho)==ptr(sigma) and positive(rho) and positive(sigma)
 assert positive(k*E(sigma)-sigma) and positive(k*E(rho)-rho)
 sep=bool(theta<s.Rational(1,2))
 if sep:assert positive(ppt(rho)) and positive(ppt(sigma))
 for l in [-s.Rational(1,3),-s.Rational(1,5),s.Rational(1,2),s.Rational(9,10)]:
  os=N(sigma,l);orr=N(rho,l)
  assert positive(os) and positive(orr)
  local=s.factor(l*l*form(os,os,d)/form(sigma,sigma,d))
  triangular=s.factor(form(orr,os,l*t*d)/form(rho,sigma,t*d))
  K=min(k,3);bound=l*l*K/(1+l*(K-1))
  assert local<=bound and triangular<=bound
  sepbound=2*l*l/(1+l)
  if sep:assert local<=sepbound and triangular<=sepbound
  rows.append(dict(kappa=str(k),theta=str(theta),lambda_=str(l),PPT_both=sep,local_ratio_exact=str(local),triangular_ratio_exact=str(triangular),bound_exact=str(bound),local_ratio_decimal=str(s.N(local,24)),triangular_ratio_decimal=str(s.N(triangular,24)),passed=True))
out=dict(scope='16 exact rational faithful finite pairs and local SLD controls, including negative CP boundary; bounded evidence, not a universal proof or novelty certification',e=str(e),t=str(t),count=len(rows),all_passed=True,rows=rows,new_grade=None)
(P/'FINITE1011.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(count=len(rows),all_passed=True,negative_boundary_included=True,finite_pair_order_slack_verified=True)))
