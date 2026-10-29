from fractions import Fraction as F
from math import factorial
from pathlib import Path
import json
p=Path(__file__).parent
def interval(r,c):
 assert sum(r)==sum(c)
 return max(0,r[0]+c[0]-sum(r)),min(r[0],c[0])
def table(r,c,t):
 return [[t,r[0]-t],[c[0]-t,r[1]-c[0]+t]]
def valid(x,r,c):
 return all(v>=0 for row in x for v in row) and [sum(row) for row in x]==r and [sum(x[i][j] for i in range(2)) for j in range(2)]==c
def omega(v):return F(v[0]**v[0],factorial(v[0]))*F(v[1]**v[1],factorial(v[1]))
r1=c1=[4,2];r2=c2=[2,4];r=c=[3,3]
i1=interval(r1,c1);i2=interval(r2,c2);ic=interval(r,c)
im=[F(i1[j]+i2[j],2) for j in range(2)]
assert i1==(2,4) and i2==(0,2) and ic==(0,3) and im==[F(1),F(3)]
x=[[0,3],[3,0]]
assert valid(x,r,c) and F(x[0][0])<im[0]
endpoint=[table(r1,c1,t) for t in range(i1[0],i1[1]+1)]
endpoint2=[table(r2,c2,t) for t in range(i2[0],i2[1]+1)]
central=[table(r,c,t) for t in range(ic[0],ic[1]+1)]
assert all(valid(v,r1,c1) for v in endpoint)
assert all(valid(v,r2,c2) for v in endpoint2)
assert all(valid(v,r,c) for v in central)
assert [len(endpoint),len(endpoint2),len(central)]==[3,3,4]
for a in endpoint:
 for b in endpoint2:
  z=[[F(a[i][j]+b[i][j],2) for j in range(2)] for i in range(2)]
  assert valid(z,r,c) and z[0][0]>=1
left=F(6**6,factorial(6))*4/(omega(r)*omega(c))
right=F(3)/omega(r1)
assert left==F(256,405) and right==F(9,64) and left>right
assert 4*4>=3*3
# Positive control: equal endpoint margins produce identical intervals.
assert interval(r1,c1)==tuple(F(2*t,2) for t in interval(r1,c1))
result={'scope':'Real transportation Minkowski equality fails for these fixed endpoint margins; no Jensen/theorem counterexample',
'row_margins':[r1,r2],'column_margins':[c1,c2],'weights':['1/2','1/2'],'common_total':6,
'central_rows':r,'central_columns':c,
'endpoint_x11_intervals':[list(i1),list(i2)],'midpoint_Minkowski_x11_interval':[str(x) for x in im],'central_x11_interval':list(ic),
'central_table_without_endpoint_decomposition':x,'integer_fiber_counts':[3,3,4],
'correct_inclusion':'(P1+P2)/2 is a strict subset of P(mean margins)',
'inequality_control':{'Barvinok_Theorem2_1_LHS':str(left),'RHS':str(right),'holds':True,'uncorrected_Jensen_4_ge_3':True},
'positive_control':'Identical endpoint margins have equal midpoint and central intervals',
'mechanism':'Endpoint lower bounds max(0,r1+c1-N) cross an affine chamber wall; averaging the maxima exceeds the maximum at the mean.',
'falsifier':'An endpoint decomposition of the displayed central table despite each first-endpoint x11>=2 and each second-endpoint x11>=0.',
'limits':['ArXivv1/linked author PDF selected geometric sentence only; journal PDF not inspected','Does not establish an error in the main inequality or its proof','No novelty, independent review, manuscript grade or formal verification']}
assert result==json.loads((p/'RESULT1333.json').read_text(encoding='utf-8'))
print(json.dumps({'strict_inclusion':True,'counts':[3,3,4],'approximate_bound_holds':True,'Jensen_holds':True}))
