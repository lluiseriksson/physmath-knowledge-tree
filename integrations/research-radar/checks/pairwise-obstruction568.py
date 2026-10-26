"""Exact known-case guard against replacing total correlation by pairwise MI."""
from fractions import Fraction as F
from itertools import combinations
import pathlib,json,datetime
N=5
bits=lambda x:[(x>>(N-1-i))&1 for i in range(N)]
sign=[]
for x in range(1<<N):
 b=bits(x);sign.append((-1)**sum(b[i]*b[(i+1)%N] for i in range(N)))
def require(b,m):
 if not b:raise RuntimeError(m)
require(sum(v*v for v in sign)==32,'normalization')
pairs=[]
for i,j in combinations(range(N),2):
 m=[[F(0) for _ in range(4)] for _ in range(4)]
 for x in range(32):
  bx=bits(x)
  for y in range(32):
   by=bits(y)
   if all(bx[k]==by[k] for k in range(N) if k not in(i,j)):
    m[2*bx[i]+bx[j]][2*by[i]+by[j]]+=F(sign[x]*sign[y],32)
 require(m==[[F(int(a==b),4) for b in range(4)] for a in range(4)],'nonmaximal pair marginal')
 pairs.append([i,j])
def expect(xsite,zsites):
 return sum((F(sign[x]*sign[x^(1<<(N-1-xsite))]*(-1)**sum(bits(x)[i] for i in zsites),32) for x in range(32)),F(0))
checks={str(z):str(expect(0,z)) for z in [[],[1],[4],[1,4]]}
require(expect(0,[1,4])==1 and all(expect(0,z)==0 for z in [[],[1],[4]]),'graph-state stabilizer')
channels=[(F(3,5),F(1,4),F(1,5)),(F(11,20),F(1,5),F(1,10))]*2+[(F(3,5),F(1,4),F(1,5))]
c0=channels[0][0];r1,t1=channels[1][1:];r4,t4=channels[4][1:]
witness=c0*(r1*r4*expect(0,[1,4])+r1*t4*expect(0,[1])+t1*r4*expect(0,[4])+t1*t4*expect(0,[]))
require(witness==F(3,100),'output witness')
out=dict(status='PASS',observed_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),input='pure5cycle graph state, amplitudes sign/sqrt32; exact rank1 outer product',signs=sign,verified_pair_marginals_I4_over4=pairs,input_expectations=checks,channels=[[str(v) for v in p] for p in channels],output_pairwise_mutual_information='all10 exactly0, since every pair output is product of local Phi_i(I/2)',output_X0Z1Z4_expectation=str(witness),product_of_output_marginals_expectation='0',total_output_correlation_lower_nats=str(witness*witness/2),
 refuted_route='D(T||tensor_i T_i) <= sum_{i<j} I(i:j)_T cannot hold even for these channel outputs of a pure state',
 scope='Known graph-state mechanism, not novel; not a counterexample to the2channel entropy theorem, all-copy entropy bound or capacity conjecture. No score or paper.')
pathlib.Path(__file__).with_suffix('.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,indent=2))
