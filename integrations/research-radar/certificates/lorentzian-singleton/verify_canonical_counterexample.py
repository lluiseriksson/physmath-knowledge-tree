"""Direct exact certification of the canonical-degree Lorentzian example.
Reconstructs every quadratic derivative after a mean-preserving substitution.
"""
from pathlib import Path
from fractions import Fraction as Q
import sympy as s
import itertools,json
root=Path(__file__).resolve().parent
x,z,w=s.symbols('x z w');v=(x,z,w);one={x:1,z:1,w:1}
X=s.Rational(9999,10000)*x+s.Rational(1,10000)*w
W=s.Rational(1,34000)*x+s.Rational(33999,34000)*w
G=s.expand(W**3*(221*X**2+147*X*W+32*W**2+411*X*z+189*z*W)/1000)
assert G.subs(one)==1
assert [s.diff(G,a).subs(one) for a in v]==[1,s.Rational(3,5),s.Rational(17,5)]
P=s.expand(G.subs(w,1));assert s.Poly(P,x,z).total_degree()==5
assert s.Poly(P,x,z).coeff_monomial(x**5)>0
binary=s.expand((221*X**2+147*X*W+32*W**2).subs(w,1))
binary_discriminant=s.factor(s.discriminant(binary,x));assert binary_discriminant<0
pg=s.Poly(G,*v);supp=set(pg.monoms());assert all(c>0 for c in pg.coeffs())
exchanges=0
for a,b in itertools.product(supp,repeat=2):
 for i in range(3):
  if a[i]<=b[i]:continue
  good=False
  for j in range(3):
   if a[j]>=b[j]:continue
   aa=list(a);bb=list(b);aa[i]-=1;aa[j]+=1;bb[i]+=1;bb[j]-=1
   if tuple(aa) in supp and tuple(bb) in supp:good=True;break
  assert good,(a,b,i);exchanges+=1
derivs=[]
for i in range(4):
 for j in range(4-i):
  k=3-i-j;f=s.diff(G,x,i,z,j,w,k);M=s.hessian(f,v)/2
  if f==0:status='zero'
  elif j==0:
   # z-degree<=1: Mzz=0, while cross-entries withz are positive.
   assert M[1,1]==0
   assert M[0,1]>0 or M[1,2]>0
   assert M.det()>=0
   status='one_positive_by_negative_principal2minor_and_nonnegative_det'
  else:
   assert all(M[1,h]==0 and M[h,1]==0 for h in range(3))
   block=M.extract([0,2],[0,2]);assert block.det()<=0 and s.trace(block)>0
   status='one_positive_binary_block_and_zero_z_direction'
  derivs.append({'orders':[i,j,k],'status':status,'det':str(M.det())})
c=s.Poly(P,x,z).coeff_monomial(x)
expected=s.Rational(16699438774659436771855887,113588560000000000000000000)
assert c==expected and c<s.Rational(5,34) and c<s.Rational(31,200)
# A simple rational e bound suffices for 5/34<2/(5e).
ehi=sum(Q(1,s.factorial(k)) for k in range(7))+Q(1,s.factorial(7))*Q(8,7)
assert ehi<Q(68,25)
out={'status':'PASS_EXACT_CANONICAL_LORENTZIAN_COUNTEREXAMPLE',
 'substitution_X':str(X),'substitution_W':str(W),'normalization':1,'means':['1','3/5','17/5'],
 'P_exact_degree':5,'nonstable_binary_discriminant':str(binary_discriminant),'P_x5_positive':str(s.Poly(P,x,z).coeff_monomial(x**5)),
 'support':sorted(supp),'symmetric_exchange_checks':exchanges,
 'all_order3_derivatives':derivs,'probability':str(c),'upper5over34':True,
 'e_upper':str(ehi),'e_upper_below68over25':True,
 'strict_comparison':'probability<5/34<2/(5e), andprobability<31/200',
 'scope':'Canonicalhomogenizationofexactdegree5PGFPisG;GnonnegativeLorentzianbyMconvexsupportandallquadraticpartials. Notrealstable. Doesnotrefute140stabletheorem.',
 'mathematical_dependency':'BrandenHuhThm2.25characterization;positivechangeThm2.10alsoavailablebutnotneededforlistedexactHessianchecks',
 'score':None}
(root/'canonical-check-result.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({k:value for k,value in out.items() if k not in ['all_order3_derivatives','support']},indent=2))
