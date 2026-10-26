from pathlib import Path
from fractions import Fraction
from flint import arb,fmpq,ctx
import numpy as np,scipy.special as sc
import json,hashlib
C=Path(__file__).parent;ctx.prec=192;fit=json.loads((C/'FIT788.json').read_bytes());rows=[]
def A(x):
 if isinstance(x,float):x=Fraction(*x.as_integer_ratio())
 elif not isinstance(x,Fraction):x=Fraction(x)
 return arb(fmpq(x.numerator,x.denominator))
for candidate in fit['selected_by_sampled_error_not_a_certification'][:2]:
 row=candidate['row'];a=A(row['a']);b2=A(Fraction(9757,50000));f=candidate['frequencies'];coef=[float.fromhex(h) for h in candidate['coefficient_hex']]
 grid=np.linspace(120,row['tail_envelope_z_for_1e-7'],501);vals=np.exp(-row['a']*float(b2)/(1+row['a'])*grid)*(sc.j0(np.sqrt(grid[:,None])*np.array(f)[None,:])@np.array(coef));idx=int(np.argmax(abs(vals)));zz=Fraction(float(grid[idx])).limit_denominator(1000000);z=A(zz)
 F=(-a*b2*z/(1+a)).exp()*sum((A(d)*(A(v)*z.sqrt()).bessel_j(0) for d,v in zip(coef,f)),arb(0))
 # Pe <= sqrt(2)/3 exp(-z/6); H <= h2(Pe) <= u(1-log u).
 u=arb(2).sqrt()/3*(-z/6).exp();BH=u*(1-u.log())
 residual_lower=abs(F).lower()-BH.upper();ceiling=A(Fraction(13334,2*10**9))
 assert residual_lower>ceiling and residual_lower>A(Fraction(1,10000))
 rows.append({'candidate':{k:row[k] for k in ['a','fmax','N','sampled_residual','M_triangle_estimate']},'z_exact':str(zz),'F_at_z':F.str(45),'H_upper_at_z':BH.str(45),'residual_lower':residual_lower.str(45),'epsilon_required_ceiling':str(Fraction(13334,2*10**9)),'proved_residual_exceeds_1e_minus4':True,'coefficients_exact_binary_hex':candidate['coefficient_hex'],'frequencies_exact_binary_hex':[float(x).hex() for x in f]})
out={'status':'Two specific globally-uniform observable candidates refuted by ball arithmetic and analytic entropy upper bound; no refutation of the general separator route or learning gap','precision_bits':ctx.prec,'proof':'At fixed x, binary Bayes error is <=one half of the Bhattacharyya coefficient. For CN(x,1) and CN(0,2), that coefficient is (2sqrt(2)/3)exp(-z/6). Binary entropy concavity gives H<=h2(Pe)<=u(1-log u), with u=sqrt(2)/3 exp(-z/6)<1/2. Thus |H-F|>=|F|-BH. Previous checked G1>0.17825 and C2<0.178263334 imply epsilon<(C2-G1)/2<0.000006667. The two exact finite F candidates violate this necessary condition at displayed rational z.','rows':rows,'not_claimed':['global impossibility of bounded observables','numerical Delta lower bound','energy threshold','new paper score','independent AI or human review','formal proof assistant verification'],'source_pins':[{'path':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [C/'FIT788.json',C/'fit788.py',Path(__file__)]]}
(C/'REFUTATION789.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps({'refuted':len(rows),'witnesses':[{'z':r['z_exact'],'F':r['F_at_z'],'residual_lower':r['residual_lower']} for r in rows]},indent=2))
