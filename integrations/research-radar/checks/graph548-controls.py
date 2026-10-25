"""Exact finite witnesses; does not audit the all-p graph classification."""
from fractions import Fraction as Q
from pathlib import Path
import json
if not __debug__:raise SystemExit('Refusing optimized Python: assertions required')
def mm(A,B):return [[sum(x*y for x,y in zip(row,col)) for col in zip(*B)] for row in A]
def tr(A):return sum(A[i][i] for i in range(len(A)))
def quad(A,w):return sum(w[i]*A[i][j]*w[j] for i in range(len(w)) for j in range(len(w)))
V=[[Q(1),Q(0),Q(1),Q(1)],[Q(0),Q(1),Q(1),Q(-1)]]
H=mm(list(map(list,zip(*V))),V)
assert H==[[1,0,1,1],[0,1,1,-1],[1,1,2,0],[1,-1,0,2]]
# At p=1 the compressed C4 witness is rational and already fails.
C1=[[abs(x) for x in row] for row in H]
assert quad(C1,[-2,-2,1,1])==-4
# For all real1<=p<2 the same expression is2^(p+1)-8<0, analytically.
P=[[[Q(1),Q(0)],[Q(0),Q(0)]],
   [[Q(1,2),Q(1,2)],[Q(1,2),Q(1,2)]],
   [[Q(11,10),Q(1,10)],[Q(1,10),Q(9,10)]]]
assert P[2][0][0]*P[2][1][1]-P[2][0][1]**2==Q(49,50)
K=[[tr(mm(mm(A,B),mm(A,B))) for B in P] for A in P]
expected=[[Q(1),Q(1,4),Q(121,100)],
          [Q(1,4),Q(1),Q(121,100)],
          [Q(121,100),Q(121,100),Q(2801,1250)]]
assert K==expected
w=[Q(-121,125),Q(-121,125),Q(1)]
value=quad(K,w);assert value==Q(-318,3125)<0
report={'status':'PASS','C4_gram':[[str(x) for x in row] for row in H],
 'C4_p1_witness_value':'-4','C4_analytic_all_p_below2':'2^(p+1)-8<0',
 'triangle_p4_kernel':[[str(x) for x in row] for row in K],
 'triangle_p4_witness':list(map(str,w)),'triangle_p4_quadratic':str(value),
 'triangle_positive_block_input':'H_ij=sqrt(P_i)sqrt(P_j), a positive Gram matrix; compression entries exactlyTr(P_i P_j)^2',
 'scope':'finite witness verification only; all-p positive statements, gluing and external metric theorem are not audited by this script'}
(Path(__file__).parent/'graph548-controls.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps(report,indent=2))
