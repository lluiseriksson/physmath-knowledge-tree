from pathlib import Path
import sympy as s
import json,datetime,hashlib,shutil
P=Path(r'C:\Trabajo\airr\2026-10-27_imbalance1075-barrier');assert not P.exists();P.mkdir()
d,w,l=s.symbols('d w l');a=d-1;K=d*(a+w);J=d*(a+1-w);M=d*(a+s.Rational(1,2));F=lambda k:k/(1+l*(k-1))
R=l*l*((1-w)*F(K)+w*F(J));CM=l*l*F(M)
factor=d*l*l*(1-l)*(2*w-1)**2*(1+(d*d-1)*l)/(2*(1+(M-1)*l)*(1+(K-1)*l)*(1+(J-1)*l))
assert s.factor(CM-R-factor)==0
x,e,p,z=s.symbols('x e p z',positive=True);aa=x*x;q=aa+e*e;A=1+(d*aa-1)*p
W=s.Matrix([[z*A,d*p*z*e*x],[d*p*z*e*x,(1-p+d*p*z)*e*e]])/(d*q);T=s.Matrix([[0,x],[x,2*e]])
g=s.factor((s.trace(T*T)+W.det()*s.trace(T*W.inv()*T*W.inv()))/s.trace(W))
lim=s.factor(s.limit(g,e,0));expected=4*d*aa*(aa+z)/(z*(1+(d*(aa+z)-1)*p));assert s.factor(lim-expected)==0
proof='''Barrier1075: unequal preparation weights do not improve the selected SLD ladder limit
27 October2026. Own analytic barrier and exact controls; not externally audited, graded or incorporated in1060. One evolving contraction problem, not a separate paper.

Tempting route: in the principal-rich two-support construction1033 replace equal preparation weights by w and1-w,0<w<1, while preserving the same real tangent T,-T. The actual center marginal is still e²/q and the two principal groups have masses w/q,(1-w)/q. The marginal of the tangent still vanishes. The two nonzero whitened preparation eigenvalues become K=d(d-1+w) and J=d(d-w), so max(K,J) can exceed M=d(d-1/2). A larger whitening index alone might suggest a larger exact SLD range. That inference is false for the ordered limiting family below.

At p fixed, the support with preparation weight z has subnormalized block
 W_z(p)=(1/(dq))[[z A_p,dpz e sqrt(a)],[dpz e sqrt(a),(1-p+dpz)e²]],
 a=d-1,q=a+e²,A_p=1+(da-1)p, and tangent T=[[0,sqrt(a)],[sqrt(a),2e]].
Solving its Sylvester equation, or using Cayley-Hamilton inverse-quadratic identity, gives
 lim_(e->0) g_Wz(T)=4a K_z/[z(1+(K_z-1)p)], K_z=d(a+z).
Both blocks must be retained: the tangent's reference-marginal cancellation needs both, so dropping the smaller-weight support is invalid. Summing z=w and1-w, then theta->1, yields retention
 R_w(lambda)=lambda²[(1-w)K/(1+(K-1)lambda)+w J/(1+(J-1)lambda)].
These are ordered limits at each fixed0<w<1, not a universal finite-e optimum or an exchange of w and e limits.

The exact difference from the balanced coefficient C_M is
 C_M-R_w = d lambda²(1-lambda)(2w-1)²[1+(d²-1)lambda]
           /{2[1+(M-1)lambda][1+(K-1)lambda][1+(J-1)lambda]}.
For every integer d>=2, physical -1/(d²-1)<=lambda<=1 and0<w<1, the denominators are positive. All numerator factors are nonnegative. Thus R_w<=C_M throughout the physical range; equality occurs at w=1/2,lambda=0,1 and the negative CP endpoint (possibly overlapping cases). At the endpoint the retention equals(2d-1)/(d²-1) independently of fixed w. A higher largest index therefore does not give an improvement of this limit or establish sharpness beyond M.

This closes only the unequal-weight, equal-e, real-tangent ordered-limit route. It is not a bound for every finite-e member, unequal center amplitudes, arbitrary tangent or channel, or a proof of unrestricted Weyl/qudit exactness. The harmonic upper C_(d²-1) remains unmatched in general dimensions. Root's speculative general-Weyl/Choi-harmonic equality route was not promoted to a theorem.

Falsifiers: wrong actual marginal/whitening spectrum, missing second support, erroneous Sylvester limit or factorization, or a different admissible scaling not covered by these ordered limits. The exact symbolic identities and60 rational controls are bounded verification, not an external audit, Lean formal proof, exhaustive search or priority claim. Preserve this negative route rather than treating index growth as solved sharpness.
'''
(P/'BARRIER1075.txt').write_text(proof,encoding='utf-8')
rows=[]
for dd in [2,3,4]:
 for ww in [s.Rational(1,10),s.Rational(1,3),s.Rational(1,2),s.Rational(9,10)]:
  for ll in [-1/s.Integer(dd*dd-1),-1/s.Integer(2*(dd*dd-1)),s.Integer(0),s.Rational(1,2),s.Integer(1)]:
   val=s.factor((CM-R).subs({d:dd,w:ww,l:ll}));assert val>=0
   rows.append(dict(d=dd,w=str(ww),lambda_parameter=str(ll),exact_balanced_minus_imbalanced=str(val)))
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='own exact symbolic and fixed-rational controls; no external audit or global finite-e upper',general_sylvester_limit=str(lim),factorization=str(s.factor(CM-R)),factorization_residue='0',cases=rows,score=None)
(P/'CONTROL1075.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');shutil.copyfile(__file__,P/'imbalance1075.py');sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
(P/'MANIFEST1075.json').write_text(json.dumps(dict(utc=out['utc'],files=[dict(path=p.name,sha256=sha(p),bytes=p.stat().st_size) for p in sorted(P.iterdir()) if p.is_file()]),indent=2)+'\n',encoding='utf-8')
D=Path(r'D:\Proyectos\airr-investigacion')/P.name;assert not D.exists();shutil.copytree(P,D);assert {p.name:sha(p) for p in P.iterdir()}=={p.name:sha(p) for p in D.iterdir()}
print(json.dumps(dict(path=str(D),general_factorization_exact=True,rational_controls=len(rows),route='unequal weights do not improve this ordered SLD limit',no_global_upper_claim=True)))
