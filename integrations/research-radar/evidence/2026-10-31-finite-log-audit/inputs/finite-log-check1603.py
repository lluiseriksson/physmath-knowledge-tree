from pathlib import Path
from fractions import Fraction as F
from functools import lru_cache
import json
W=Path('C:/Trabajo/airr/2026-10-31_execution1603')
def add(a,b):return(a[0]+b[0],a[1]+b[1])
def mul(a,b):return(a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0])
def neg(a):return(-a[0],-a[1])
def norm2(a):return a[0]**2+a[1]**2
def div(a,b):
 d=norm2(b);assert d>0
 return mul(a,(b[0]/d,-b[1]/d))
one=(F(1),F(0));zero=(F(0),F(0))
types=[{0},{1},{2},{0,1},{1,2},{0,1,2}];n=len(types);epsilon=F(1,64)
rho=[epsilon**len(x) for x in types];mu=[rho[i]*2**len(types[i]) for i in range(n)]
phases=[one,neg(one),(F(0),F(1)),(F(0),F(-1)),one,(F(0),F(1))]
w=[mul((rho[i],F(0)),phases[i]) for i in range(n)]
incompatible=[sum(1<<j for j in range(n) if types[i]&types[j]) for i in range(n)]
# a_i=|type_i| log2 and exp(a_i)=2^|type_i|. Integral_1^2 dt/t>=1/2 certifies log2>=1/2.
for i in range(n):assert sum(mu[j] for j in range(n) if incompatible[i]>>j&1)<=F(1,2)<=F(len(types[i]),2)
@lru_cache(None)
def partition(mask):
 if mask==0:return one
 low=mask&-mask;i=low.bit_length()-1;rest=mask^low
 return add(partition(rest),mul(w[i],partition(rest&~incompatible[i])))
ratios=0
for mask in range(1<<n):
 assert norm2(partition(mask))>0
 for i in range(n):
  if not mask>>i&1:continue
  rest=mask&~(1<<i);ratio=div(partition(mask),partition(rest));q=add(ratio,neg(one))
  rec=div(mul(w[i],partition(rest&~incompatible[i])),partition(rest))
  assert q==rec
  # Stronger rational disk bound for THESE cases: |q|<=mu/(1+mu), which implies |Log ratio|<=log(1+mu)<=mu.
  assert norm2(q)<=(mu[i]/(1+mu[i]))**2
  ratios+=1
assert add(one,neg(one))==zero
extensive=[]
for M in [1,2,4,8,16,32]:extensive.append({'sites':M,'Z':str((1-epsilon)**M),'reciprocal':str((1-epsilon)**(-M))})
out={'scope':'Exact finite rational-complex checks, not source admission, source theorem audit or universal proof',
 'polymer_types':[sorted(x) for x in types],'epsilon':str(epsilon),'complex_phases':['1','-1','i','-i','1','i'],'a_i':'|type_i| log2','mu':[str(x) for x in mu],
 'polydisc_majorant_criterion_certified_by_rational_upper_bound':True,'type_subsets_checked':64,'nonzero_partitions':64,'exact_deletion_ratio_checks':ratios,
 'stronger_rational_disk_checks_passed':True,'self_term_omission_counterexample':{'one_activity':'-1','Z':'0','without_self_incompatibility_budget':'0'},
 'independent_negative_singleton_weights_extensive_normalizer':extensive,'actual_source_hypotheses_verified':False,'new_assessment':False}
(W/'FINITE-LOG-CHECK1603.json').write_bytes((json.dumps(out,indent=2)+'\n').encode());print(json.dumps({'subsets':64,'deletion_ratio_checks':ratios,'all_exact':True}))
