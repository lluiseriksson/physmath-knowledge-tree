from pathlib import Path
from fractions import Fraction
from flint import arb,ctx
import json,hashlib,datetime
C=Path(__file__).parent;ctx.prec=192;rows=json.loads((C/'PARTIAL-SERIAL795.json').read_bytes())['segments'];dependencies=[C/'PARTIAL-SERIAL795.json',C/'certificate795.py']
for i in range(5):
 w=C/'workers795'/str(i);out=json.loads((w/'WORKER795.json').read_bytes());rows+=out['segments'];assert out['code_sha256']==hashlib.sha256((w/'worker795.py').read_bytes()).hexdigest();dependencies += [w/'WORKER795.json',w/'worker795.py']
keys=[(Fraction(x['left']),Fraction(x['width']),x['H_interpolated']) for x in rows];expected=[(Fraction(j,2),Fraction(1,2),True) for j in range(160)]+[(Fraction(80+2*j),Fraction(2),False) for j in range(160)];assert sorted(keys)==sorted(expected) and len(set(keys))==320
assert all(arb(x['bound'])<arb('0.000001') and x['proved_below_eps'] for x in rows)
fit=json.loads((C/'FIT794.json').read_bytes())['rows'][0]
def rational_hex(s):
 f=Fraction(*float.fromhex(s).as_integer_ratio());from flint import fmpq;return arb(fmpq(f.numerator,f.denominator))
d=[rational_hex(s) for s in fit['coefficient_hex']];f=[rational_hex(s) for s in fit['frequencies_hex']];b2=arb(9757)/50000;a=arb(1);alpha=a*b2/(1+a)
u=arb(2).sqrt()/3*(-arb(400)/6).exp();tail=(sum((abs(x) for x in d),arb(0))*(-alpha*400).exp()+u*(1-u.log()))/401;assert tail<arb('0.000001')
M=sum(((1+a)*(v*v*(1+a)/(4*b2)).exp()*abs(x) for v,x in zip(f,d)),arb(0));assert M<arb('1.5e20')
prior=Path(r'D:\Proyectos\airr-investigacion\2026-10-26_interval777\CERTIFICATE779.json');p=json.loads(prior.read_bytes());G=[arb(x['G1']) for x in p['rows']];assert all(g<arb('0.178254') for g in G);C2=(1+b2).log();assert C2>arb('0.178263333')
d0=arb('0.178263333')-arb('0.178254')-4*arb('0.000001');assert d0>0;M0=arb('1.5e20');lower=2*d0*d0/((M0*M0+2*d0).sqrt()+M0)**2;assert lower>arb('6e-52')
# Conditional v3 threshold, extremely loose and not a practical claim.
assert arb('1e53')>(6+arb(2).log())/arb('6e-52') and arb('1e53')>=2
record={'status':'Completed ball computations support the weighted analytic contract; no AI/human component audit yet','utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'precision_bits':192,'segments_verified':320,'tail400':tail.str(40),'epsilon':'1e-6','M':M.str(40),'M_upper':'1.5e20','prior_G1_balls':[str(g) for g in G],'G1_upper':'0.178254','C2_lower':'0.178263333','d_lower':d0.str(40),'stable_gap_expression':lower.str(40),'conditional_Delta_lower':'6e-52','conditional_existing_v3_threshold_sufficient_E':'1e53','limitations':['Requires the entire own analytic796 contract, root-grid interpolation/majorants and previous v3 entropy identities','Very loose dimensionless existence threshold, not practical quantum performance','No formal proof, worldwide novelty, independent review or new manuscript/score','Initial serial run interrupted after42 completed segments; remaining disjoint regions computed in5 processes; no failure erased','No ready Research Capsule claimed'],'code_pins':[{'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in dependencies+[prior,C/'FIT794.json',Path(__file__)]]}
(C/'CONCLUSION797.json').write_bytes((json.dumps(record,indent=2)+'\n').encode());(C/'CERTIFICATE795.json').write_bytes((json.dumps({'status':record['status'],'segments':rows,'conclusion':'CONCLUSION797.json','scope':'Global residual bounded by interpolation plus analytic tails, not mesh sampling; conditional on analytic796 correctness'},indent=2)+'\n').encode());print(json.dumps({k:v for k,v in record.items() if k!='code_pins'},indent=2))
