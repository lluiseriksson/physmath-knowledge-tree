from pathlib import Path
import json,time,hashlib,flint
from flint import arb,acb,ctx
import interval778 as engine
C=Path(__file__).parent;rows=[]
def positive_error(x):
 u=x.upper();return arb(u/2,u/2)
for bits in [128,160]:
 ctx.prec=bits;start=time.monotonic();js=[]
 for a,b in [(arb(0),arb(1)/2),(arb(1)/2,arb(2)),(arb(2),arb(6)),(arb(6),arb(20))]:
  v=engine.J(a,b);assert v.is_finite() and v.imag.contains(0),str(v)
  js.append(v.real);print(json.dumps({'bits':bits,'interval':[str(a),str(b)],'truncated_J':v.str(35)}),flush=True)
 ln2=arb(2).log();ztail=ln2*(-arb(20)).exp()
 # Markov at theta=1/2 for T=|Y-2sqrt(z)|^2/2, uniform z<=20.
 ttail=ln2/2*(-arb(100)).exp()*(arb(4)/3*(arb(20)/3).exp()+2*arb(40).exp())
 mass=[];moment=[]
 for a,b in [(arb(0),arb(1)/2),(arb(1)/2,arb(2)),(arb(2),arb(6))]:
  mass.append((-a).exp()-(-b).exp());moment.append((a+1)*(-a).exp()-(b+1)*(-b).exp())
 cross=[mass[1]*moment[2]-mass[2]*moment[1],mass[2]*moment[0]-mass[0]*moment[2],mass[0]*moment[1]-mass[1]*moment[0]]
 assert cross[2]>0 and cross[2]>abs(cross[0]) and cross[2]>abs(cross[1])
 h=[x/cross[2] for x in cross];norm=sum((p*x*x for p,x in zip(mass,h)),arb(0))
 fullj=[v+positive_error(ttail*p) for v,p in zip(js[:3],mass)]
 a0=sum((x*v for x,v in zip(h,fullj)),arb(0))
 G=sum(js,arb(0))+positive_error(ttail)+positive_error(ztail)-ln2/2
 C2=(1+arb(9757)/50000).log();eps=arb(1)/200;L=G+eps*a0-eps*eps*norm
 tests={'G_lower':G>arb('0.17825'),'G_upper':G<arb('0.17826'),'a0_lower':a0>arb('0.0078'),'a0_upper':a0<arb('0.0079'),'norm_lower':norm>arb('0.737'),'norm_upper':norm<arb('0.739'),'Gaussian_below_AWGN':G<C2,'feasible_W1_above_AWGN':L>C2}
 assert all(tests.values()),{k:str(v) for k,v in [('G',G),('a0',a0),('norm',norm),('L',L),('C2',C2)]}
 row={'precision_bits':bits,'seconds':time.monotonic()-start,'truncated_J':[x.str(35) for x in js],'z_tail_upper':ztail.str(35),'t_tail_upper_uniform_z_le20':ttail.str(35),'h':[x.str(35) for x in h],'norm2':norm.str(35),'a0':a0.str(35),'G1':G.str(35),'AWGN_capacity':C2.str(35),'feasible_W1_rate_lower_expression':L.str(35),'checks':tests,'counts':dict(engine.counts)};rows.append(row)
 print(json.dumps(row),flush=True)
out={'status':'Interval computations support reduced-integral premises; analytical reduction and oracle bound have no separate referee audit yet. No new manuscript/grade or numerical common-input gap.','parameters':{'k':1,'r':1,'lambda':'1/2','epsilon':'1/200','b_squared':'9757/50000'},'runtime':{'python_flint':flint.__version__},'rows':rows,'analytic_assumptions':['Radial sufficient statistic T=|Y-2sqrt(z)|^2/2 and Poisson/Gamma/Bessel identity','Coarse holomorphic oracle bound in |Im z|<1/4','Binary-entropy bound and noncentral-Gamma exponential tail estimate','Existing v3 perturbation inequality and compactness argument, not re-audited here'],'not_claimed':['independent review','Lean verification','certified worldwide novelty','computed compound learning gap Delta','finite energy threshold','new manuscript score'],'code_pins':[{'path':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [Path(__file__),C/'interval778.py']]}
(C/'CERTIFICATE779.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
