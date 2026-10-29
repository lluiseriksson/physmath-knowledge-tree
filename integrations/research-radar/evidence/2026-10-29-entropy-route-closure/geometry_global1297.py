from fractions import Fraction as F
from pathlib import Path
import json
P=[[F(1,3),0,0],[0,F(2,3),0],[0,0,F(2,3)]]
Q=[[F(6,35),F(-12,35),0],[F(8,35),F(9,35),0],[0,0,F(6,7)]]
def tr(a):return [list(x) for x in zip(*a)]
def mul(a,b):return [[sum(x*y for x,y in zip(row,col)) for col in zip(*b)] for row in a]
a,b,c=mul(P,tr(P)),mul(Q,tr(Q)),mul(Q,tr(P))
ab,ba=mul(a,b),mul(b,a)
assert ab!=ba
minors=[]
for i in range(3):
 for j in range(3):
  m=F(12,49)*(a[i][i]*b[j][j]-c[i][j]**2)
  if m<0:minors.append({'indices':[i,3+j],'determinant':str(m)})
assert minors
assert sum(a[i][i] for i in range(3))==1
assert sum(b[i][i] for i in range(3))==1
# P and Q are invertible; W has3 columns and rank3.
assert F(6,35)*F(9,35)-F(-12,35)*F(8,35)==F(6,49)
out={'scope':'Exact t=0 geometry, not entropy-sign certification',
'trace_one':True,'population':'3/7','rank':3,'mixed':True,
'diagonal_blocks_noncommuting':True,'partial_transpose_negative_principal_minors':minors,
'entangled':True,'saturated_support_coupling':True,'global_Q_proved':False,
'G_evaluated_exactly':False}
Path(__file__).with_name('EXACT1297.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps(out))
