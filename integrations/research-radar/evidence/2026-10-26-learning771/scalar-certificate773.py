from fractions import Fraction as F
from pathlib import Path
import json,hashlib
b2=F(9757,50000);q=b2/(2+b2);terms=12
lower=2*sum((q**(2*j+1)/F(2*j+1) for j in range(terms)),F(0))
tail=2*q**(2*terms+1)/(F(2*terms+1)*(1-q*q));upper=lower+tail
lo=F(178263333,10**9);hi=F(178263334,10**9)
assert lo<lower and upper<hi
epsilon=F(1,200);glo=F(17825,100000);ghi=F(17826,100000);a0lo=F(78,10000);normhi=F(739,1000)
feasible_lower=glo+epsilon*a0lo-epsilon*epsilon*normhi
assert ghi<lo and hi<feasible_lower
x={'status':'Exact rational scalar-log enclosure and conditional arithmetic ONLY; no certified channel integral or learning gap','gain_squared':str(b2),'AWGN_capacity':'log(1+b^2), nats','identity':'log(1+b2)=2*atanh(b2/(2+b2)); positive series; remainder at most2*q^(2N+1)/((2N+1)*(1-q^2))','terms':terms,'series_lower_exact':str(lower),'tail_upper_exact':str(tail),'certified_capacity_interval':[str(lo),str(hi)],'conditional_only':{'unproved_integral_enclosures':{'G1':['0.17825','0.17826'],'a0':['0.0078','0.0079'],'h_norm2':['0.737','0.739']},'epsilon':str(epsilon),'resulting_feasible_W1_rate_lower':str(feasible_lower),'strict_margins':{'C2_above_G1_upper':str(lo-ghi),'feasible_W1_above_C2_upper':str(feasible_lower-hi)}},'remaining_obligations':['Rigorous Gaussian/binary-entropy integral enclosures, including tails and quadrature remainders','Quantitative upper bound on common-input optimum V if a numerical learning gap or energy threshold is desired'],'no_new_paper_score_or_Lean_proof':True,'code_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
Path(__file__).with_name('SCALAR-CERTIFICATE773.json').write_text(json.dumps(x,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps({'log_interval':[str(lo),str(hi)],'conditional_W1_lower':str(feasible_lower),'integral_bounds_proved':False}))
