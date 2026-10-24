"""Solver-free exact polynomial identity check; no sympy and no grid."""
from pathlib import Path
from fractions import Fraction as F
from math import comb
import json,hashlib,copy
root=Path(__file__).resolve().parent
def add(*ps):
 out={}
 for p in ps:
  for key,value in p.items():out[key]=out.get(key,F(0))+value
 return {key:v for key,v in out.items() if v}
def scale(p,s):return {key:F(s)*v for key,v in p.items() if s*v}
def mul(p,q):
 out={}
 for (i,j),a in p.items():
  for (k,l),b in q.items():out[i+k,j+l]=out.get((i+k,j+l),F(0))+a*b
 return {key:v for key,v in out.items() if v}
def power(p,n):
 out={(0,0):F(1)}
 for _ in range(n):out=mul(out,p)
 return out
one={(0,0):F(1)};h={(1,0):F(1)};v={(0,1):F(1)};s=add(one,h)
dn=add(s,scale(mul(mul(add(one,scale(h,3)),h),v),-1),scale(mul(power(h,2),power(v,2)),3))
en=add(scale(mul(mul(h,v),s),2),mul(h,power(s,2)),scale(mul(power(h,3),power(v,2)),-1))
numerator=add(mul(dn,add(scale(power(s,4),8),scale(mul(en,power(s,2)),4),power(en,2))),scale(power(s,5),-8))
assert all(i>=1 for i,j in numerator)
expected={(i-1,j):c/F(2**(i-1)) for (i,j),c in numerator.items()}
def verify(cert):
 assert cert['degree_t']==7 and cert['degree_v']==6 and cert['leaf_count']==1
 assert len(cert['leaves'])==1
 leaf=cert['leaves'][0];assert list(map(F,leaf['box']))==[0,1,0,1]
 bs=[[F(c) for c in row] for row in leaf['bernstein']]
 assert len(bs)==8 and all(len(row)==7 for row in bs)
 assert all(c>=0 for row in bs for c in row)
 t=h;recon={}
 for i in range(8):
  bt=scale(mul(power(t,i),power(add(one,scale(t,-1)),7-i)),comb(7,i))
  for j in range(7):
   bv=scale(mul(power(v,j),power(add(one,scale(v,-1)),6-j)),comb(6,j))
   recon=add(recon,scale(mul(bt,bv),bs[i][j]))
 assert recon==expected
 return min(c for row in bs for c in row)
path=root/'capacity118-bernstein-certificate.json';cert=json.loads(path.read_text());minimum=verify(cert)
negative=copy.deepcopy(cert);negative['leaves'][0]['bernstein'][0][0]=str(F(negative['leaves'][0]['bernstein'][0][0])+1)
try:verify(negative)
except AssertionError:rejected=True
else:raise AssertionError('Altered positive coefficient was incorrectly accepted')
negative2=copy.deepcopy(cert);negative2['leaves'][0]['bernstein'].pop()
try:verify(negative2)
except AssertionError:rejected2=True
else:raise AssertionError('Truncated coefficient table was incorrectly accepted')
out={'status':'PASS_EXACT_POLYNOMIAL_IDENTITY_AND_POSITIVITY','degree':[7,6],'bernstein_coefficients_checked':56,'minimum_exact_coefficient':str(minimum),'identity_reconstructed_with':'Fraction polynomial arithmetic, independent of sympy generator','negative_controls_rejected':2,'certificate_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'scope':'H(t/2,v)>=51/40 onunitbox. Analytic application and extremaltheorem require separate mathematicalaudit.'}
(root/'capacity118-check-result.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps(out,indent=2))
