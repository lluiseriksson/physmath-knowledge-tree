from pathlib import Path
from fractions import Fraction
import json,datetime,hashlib,shutil
import sympy as sp
P=Path(r'C:\Trabajo\airr\2026-10-27_phase-tradeoff1066');assert not P.exists();P.mkdir()
proof='''Candidate1066: critical scaling and an explicit information/conditioning tradeoff
27 October2026. Own refinement of1063, not externally audited and not part of1058 or manuscript1060. Same1051/1054 phase family, not a separate paper. The classical comparison is only the common-Bell-diagonal class at the negative CP endpoint. No new classical theorem, general quantum optimum, practical advantage or priority claim.

Fix t>0 and beta>1 independent of the integer dimension d. Set e²=t/d, theta=1-d^(-beta), phi=pi, lambda=-1/(d²-1). Let nu=beta+3>4. The norm-one H, states and actual marginal are exactly those of1051. All input/output states are faithful for every d>=2. For large d, e²<1. Proposed limits:
 d R_U -> alpha=(nu-4)/[(1+t)nu];
 d² D_U(input)/log(d) ->4t nu;
 condition(input)/d^nu ->1/t;
 d * trace_distance(input_pair) ->2sqrt(t).
Exact order K_d=d²-d^(2-beta)+d^(-beta), reference R=d, fixed phase pi. Thus R_U/(Bell benchmark) grows like alpha*d while the input information is polynomially, not exponentially, small and conditioning grows as a fixed power. This is not nonvanishing information or robustness to errors. At t=1,beta=2, alpha=1/10, condition~d^5 and inputDU~20log(d)/d², a factor-d improvement of input scale over1063 at the same leading ratio/conditioning cost but with a larger order budget. This does not dominate1063 at a fixed budget.

Derivation from exact traces/determinants, no numerical fit. With q=d-1+t/d and W_p from1054, at input p=theta, trace W->1 and d^nu det W->t. Hence w_+->1, d^nu w_-->t, ell(W_theta)/log(d)->nu. At output p=lambda theta, d³trace W->1+t and d^(nu+2)det W->t. Because det/trace²=O(d^(4-nu))->0, the roots separate: d³w_+->1+t, d^(nu-1)w_-->t/(1+t). Therefore log(w_+/w_-)/log(d)->nu-4 and ell(W_output)/(d³log(d))->(nu-4)/(1+t). The exact finite phase retention lambda²ell(output)/ell(input), with d^4lambda²->1, gives alpha.

The physical coherence c²=theta²e²(d-1)/q² satisfies d²c²->t. Since D_U at phasepi equals4c²ell(input), this proves the input information constant. The exact minimum eigenvalue is (1-theta)e²/(dq) for sufficiently large d with e²<=1; the rank-one addition is positive and an off-Schmidt coordinate |i,0>,i!=0 attains the replacement minimum. Thus d^nu lambda_min->t, while lambda_max->1. Trace distance is2|c|. For small dimensions with e²>1, that displayed exact minimum need not apply; the asymptotic conclusion does not claim otherwise.

For any desired fixed alpha0<1, choose t>0 small enough that alpha0(1+t)<1, and nu>4/[1-alpha0(1+t)], equivalently beta=nu-3>1. Then the limit alpha exceeds alpha0. This realizes an arbitrarily large fixed fraction of the known lower-bound coefficient scale1/d using fixed polynomial conditioning, with a higher exponent as alpha0 approaches1. It gives no upper or equality for unrestricted quantum contraction. The states become close, and dimensions/reference/order/cost all grow explicitly.

Falsifiers: wrong trace/determinant limits, missing spectral mode or physical coherence scaling, failure of1054 identity under varying dimension, or prior literature with the same tradeoff. Preserve adverse finite dimensions and all input resources. Fixed own controls are not external review, formal Lean proof or a computational campaign certificate. A single sequential technical audit should examine1063/1064/1066 jointly after1058 is terminal; no grade attaches.
'''
(P/'PROOF1066.txt').write_text(proof,encoding='utf-8')
src=Path(r'D:\Proyectos\airr-investigacion\2026-10-27_local-phase1054-audit\integer_intervals1054.py');prefix=src.read_text().split('rows=[]')[0]
(P/'reused_integer_prefix1054.py').write_text(prefix,encoding='utf-8');ns={'__file__':str(P/'reused_integer_prefix1054.py')};exec(prefix,ns)
iv,plane,saved=ns['iv'],ns['plane'],ns['saved'];rows=[]
# plane contains e only through e²; setting e=sqrt(t/d) symbolically is avoided by evaluating the rational formulas directly.
def rational_plane(d,p,x):
 a=d-1;q=a+x;A=1+(d*a-1)*p;F=1+a*p;tr=(A+F*x)/(d*q);det=x*(1-p)*(1+(d*d-1)*p)/(d*d*q*q)
 z=iv(tr*tr-4*det).sqrt();hi=(iv(tr)+z)/2;lo=iv(det)/hi;ell=(ns['log'](hi)-ns['log'](lo))/z
 return ell,hi,tr,det
for t in [Fraction(1),Fraction(1,4)]:
 for beta in [2,4]:
  for d in [2,3,4,8,16,32,64,128]:
   x=t/d;th=1-Fraction(1,d**beta);lam=-Fraction(1,d*d-1);a=d-1;q=a+x
   ei,hi,ti,di=rational_plane(d,th,x);eo,ho,to,do=rational_plane(d,lam*th,x)
   ratio=iv(lam*lam)*eo/ei;gap=ratio-iv(Fraction(1,d*d-1));ci=th*th*x*a/(q*q)
   rows.append(dict(d=d,t=str(t),beta=beta,ratio=saved(ratio),gap=saved(gap),positive=gap.l>0,negative=gap.h<0,input=saved(4*iv(ci)*ei),condition=saved(hi/iv((1-th)*x/(d*q)))))
d=sp.symbols('d',positive=True);limits=[]
for t in [sp.Integer(1),sp.Rational(1,4)]:
 for beta in [2,4]:
  x=t/d;theta=1-d**(-beta);lam=-1/(d*d-1);a=d-1;q=a+x;nu=beta+3
  def td(p):return sp.factor((1+(d*a-1)*p+(1+a*p)*x)/(d*q)),sp.factor(x*(1-p)*(1+(d*d-1)*p)/(d*d*q*q))
  ti,di=td(theta);to,do=td(lam*theta)
  expr=[ti,d**nu*di,d**3*to,d**(nu+2)*do,d**2*theta**2*x*a/q**2,d**nu*(1-theta)*x/(d*q)]
  vals=[sp.limit(v,d,sp.oo) for v in expr];assert vals==[1,t,1+t,t,t,t]
  limits.append(dict(t=str(t),beta=beta,limits=list(map(str,vals)),predicted_dR=str(sp.Rational(nu-4,nu)/(1+t)),input_constant=str(4*t*nu)))
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='own rational-limit and directed-integer controls; same interval implementation lineage1054, no external audit',source1054_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),limits=limits,cases=rows,adverse=[dict(d=r['d'],t=r['t'],beta=r['beta']) for r in rows if r['negative']],uncertain=[dict(d=r['d'],t=r['t'],beta=r['beta']) for r in rows if not r['negative'] and not r['positive']],score=None)
(P/'CONTROL1066.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');shutil.copyfile(__file__,P/'tradeoff1066.py')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();(P/'MANIFEST1066.json').write_text(json.dumps(dict(utc=out['utc'],files=[dict(path=p.name,sha256=sha(p),bytes=p.stat().st_size) for p in sorted(P.iterdir()) if p.is_file()]),indent=2)+'\n',encoding='utf-8')
D=Path(r'D:\Proyectos\airr-investigacion')/P.name;assert not D.exists();shutil.copytree(P,D);assert {p.name:sha(p) for p in P.iterdir()}=={p.name:sha(p) for p in D.iterdir()}
print(json.dumps(dict(path=str(D),cases=len(rows),limits=limits,adverse=len(out['adverse']),uncertain=len(out['uncertain']),audit_pending=True)))
