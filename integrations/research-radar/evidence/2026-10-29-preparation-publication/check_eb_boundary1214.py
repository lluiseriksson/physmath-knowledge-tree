"""Exact rational calibration of a prior common-support obstruction; not new priority."""
from fractions import Fraction as F
from pathlib import Path
import json
rows=[]
for den in range(2,34):
 t=F(1,den);c=(1-t*t)/(1+t*t);s=2*t/(1+t*t)
 assert c*c+s*s==1 and 0<s<1
 # sigma0=diag(1,0), sigma1=[[c²,cs],[cs,s²]].
 # Delta=sigma1-sigma0 is traceless with determinant -s²,
 # hence its trace distance is s. Their support lines are distinct.
 a=c*c-1;b=c*s;e=s*s
 assert a+e==0 and a*e-b*b==-s*s
 assert c*c*e-b*b==0 and e>0
 rows.append({'t':str(t),'ordinary_trace_contraction':str(s),'delta_determinant':str(-s*s),'positive_common_component':'0','output_states_pure':True})
out={'cases':rows,'all_pass':True,'scope':'32 exact 2-by-2 pure-output calibrations; elementary common-support obstruction already covered by published CQ criterion; no new paper or formal certificate'}
(Path(__file__).parent/'EB-BOUNDARY1214.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'cases':len(rows),'all_pass':True}))
