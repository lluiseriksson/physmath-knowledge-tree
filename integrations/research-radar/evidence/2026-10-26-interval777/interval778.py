from flint import acb,arb,ctx
from pathlib import Path
import json,time,hashlib
ctx.prec=128
T=200;start=time.monotonic();counts={'point_H':0,'rough_H':0}
def rough(z):
 Z=abs(z).upper();lo=z.real.lower()
 M=(4*Z-lo).exp()*(arb(4)/9+2*(Z+3)/3)+(4*Z-2*lo).exp()*(Z+5)
 M=M.upper();return acb(arb(0,M),arb(0,M))
def H(z,analytic_z=False):
 if not abs(z.imag)<arb(1)/4:return acb('nan')
 if z.real.rad()>arb('1e-18') or z.imag.rad()>arb('1e-18'):
  counts['rough_H']+=1;return rough(z)
 counts['point_H']+=1
 def f(t,analytic_t):
  if analytic_t and not abs(t.imag)<arb(1)/4:return acb('nan')
  analytic=analytic_t or analytic_z
  B=(2*z*t).hypgeom_0f1(1)
  one=(1+(t-z).exp()/2).log(analytic=analytic)
  two=(1+2*(z-t).exp()).log(analytic=analytic)
  return B*((-2*t-z).exp()*one+(-t-2*z).exp()*two/2)
 return acb.integral(f,0,T,abs_tol=arb('1e-12'),rel_tol=arb('1e-11'),eval_limit=20000,depth_limit=30)
def J(a,b):
 return acb.integral(lambda z,analytic: (-z).exp()*H(z,analytic),a,b,abs_tol=arb('1e-9'),rel_tol=arb('1e-9'),eval_limit=20000,depth_limit=30)
if __name__=='__main__':
 v=J(0,arb(1)/2)
 x={'rectangle':[0,.5,0,T],'truncated_J':v.str(35),'seconds':time.monotonic()-start,'counts':counts,'precision_bits':ctx.prec,'code_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'status':'reduced integral enclosure prototype; analytic reduction and bound require separate audit; no full capacity or learning-gap certificate'}
 Path(__file__).with_name('PROBE778.json').write_text(json.dumps(x,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps(x),flush=True)
