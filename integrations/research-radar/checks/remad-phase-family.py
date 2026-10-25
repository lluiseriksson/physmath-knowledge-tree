import json
from pathlib import Path
import sympy as s
r=s.Symbol('r',positive=True)
x=s.Symbol('x')
g=1-r*r
polys=[];grams=[]
K=[s.diag(1,r,r),s.sqrt(g)*s.Matrix([[0,1,0],[0,0,1],[0,0,0]])]
assert s.simplify(sum((k.T*k for k in K),s.zeros(3))-s.eye(3))==s.zeros(3)
for sign in [1,-1]:
 G=s.Matrix([[(1+r*r)**2,s.sqrt(g),r*r*s.sqrt(g),g],
  [s.sqrt(g),g*(1+r*r),sign*g*r,g*s.sqrt(g)],
  [r*r*s.sqrt(g),sign*g*r,g*(1+r*r),0],
  [g,g*s.sqrt(g),0,g*g]])/4
 z=s.zeros(9,1)
 for j in [0,1,4]:z[j]=s.Rational(1,2)
 z[6]=sign*s.Rational(1,2)
 V=s.Matrix.hstack(*[s.kronecker_product(k,l)*z for k in K for l in K])
 assert s.simplify(V.T*V-G)==s.zeros(4)
 assert s.simplify(s.trace(G)-1)==0
 polys.append(s.factor(G.charpoly(x).as_expr()));grams.append(G)
diff=s.factor(polys[0]-polys[1])
assert s.simplify(diff+r**3*g*g*x/16)==0
assert s.simplify(s.trace(grams[0]**2)-s.trace(grams[1]**2))==0
out={'status':'exact_symbolic_identity_pass','sympy':s.__version__,
 'parameter':'r=sqrt(1-gamma), 0<r<1',
 'states':'(|00>+|01>+|11> +/- |20>)/2',
 'characteristic_difference_plus_minus':str(diff),
 'determinant_tI_difference_plus_minus':'r^3*(1-r^2)^2*t/16 > 0 for t>0',
 'trace_and_purity_equal':True,
 'scope':'polynomial identity exact; analytic entropy and fractional-power implications in companion note; not a capacity counterexample'}
Path(__file__).with_suffix('.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(out))
