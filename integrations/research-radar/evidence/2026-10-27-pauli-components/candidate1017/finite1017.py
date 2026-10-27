from pathlib import Path
import sympy as s,json
P=Path(__file__).parent;e=s.Rational(1,100);t=s.Rational(1,10**10)
def sylv(a,b,z):
 ys=s.symbols('y:4');Y=s.Matrix(2,2,ys);sol=next(iter(s.linsolve(list(a*Y+Y*b-z),ys)));Y=s.Matrix(2,2,sol)
 assert a*Y+Y*b==z
 return s.trace(z*Y)
def positive(a):return all(a[:i,:i].det()>0 for i in range(1,a.rows+1))
rows=[]
for d,kappa in [(3,s.Rational(3,2)),(3,3),(3,4),(4,4),(4,5),(5,5),(5,6)]:
 kappa=s.Rational(kappa);r=d+1;n=d*r;theta=(kappa-1)/d-s.Rational(1,100)
 sig=s.zeros(n);D=s.zeros(n);blocks=[]
 for i in range(d):
  ix=[i*r+i,((i+1)%d)*r+d];blocks.append(ix);a=s.zeros(n,1);a[ix[0]]=1;a[ix[1]]=e
  sig+=a*a.T/(d*(1+e*e))
  c=1 if i==0 else -1 if i==1 else 0
  D[ix[0],ix[1]]=D[ix[1],ix[0]]=c;D[ix[1],ix[1]]=2*e*c
 ptr=lambda a:s.Matrix(r,r,lambda i,j:sum(a[h*r+i,h*r+j] for h in range(d)))
 B=s.diag(*[ptr(sig) for _ in range(d)])/d;N=lambda a,p:p*a+(1-p)*s.diag(*[ptr(a) for _ in range(d)])/d
 sigma=N(sig,theta);rho=sigma+t*D
 assert ptr(D)==s.zeros(r) and ptr(rho)==ptr(sigma)
 assert positive(sigma) and positive(rho) and positive(kappa*B-sigma) and positive(kappa*B-rho)
 for l in [-s.Rational(1,d*d-1),s.Rational(1,2)]:
  out_sigma=N(sigma,l);out_rho=N(rho,l)
  assert positive(out_sigma) and positive(out_rho)
  local_in=local_out=tri_in=tri_out=0
  for ix in blocks:
   a=sigma.extract(ix,ix);b=rho.extract(ix,ix);z=D.extract(ix,ix)
   aa=out_sigma.extract(ix,ix);bb=out_rho.extract(ix,ix)
   local_in+=sylv(a,a,z);local_out+=sylv(aa,aa,l*z)
   tri_in+=sylv(b,a,t*z);tri_out+=sylv(bb,aa,l*t*z)
  local=s.factor(local_out/local_in);tri=s.factor(tri_out/tri_in);bound=l*l*kappa/(1+l*(kappa-1))
  assert local<=bound and tri<=bound
  rows.append(dict(d=d,R=r,kappa=str(kappa),theta=str(theta),lambda_=str(l),ratio_SLD=str(local),ratio_triangular=str(tri),bound=str(bound),ratio_SLD_decimal=str(s.N(local,20)),faithful_and_both_order_slacks=True,passed=True))
out=dict(scope='14 exact rational finite equal-reference pairs and SLD controls in d3,4,5; no universal computational certificate or manuscript grade',e=str(e),t=str(t),rows=rows,all_passed=True)
(P/'FINITE1017.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(count=len(rows),dimensions=[3,4,5],all_passed=True)))
