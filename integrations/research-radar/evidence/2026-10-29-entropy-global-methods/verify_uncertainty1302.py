from fractions import Fraction as F
from pathlib import Path
import json
N=lambda A:[[F(29,40)*A[0][0]+F(19,40)*A[1][1],F(3,5)*A[0][1]],[F(3,5)*A[1][0],F(11,40)*A[0][0]+F(21,40)*A[1][1]]]
U=[[F(0),F(1)],[F(-1),F(0)]]
mul=lambda A,B:[[sum(a*b for a,b in zip(row,col)) for col in zip(*B)] for row in A]
T=lambda A:list(map(list,zip(*A)))
cross=[[F(1,2),F(-1,2)],[F(1,2),F(-1,2)]]
M=N(cross)
assert M==[[F(1,8),F(-3,10)],[F(3,10),F(-1,8)]]
assert mul(T(U),U)==[[1,0],[0,1]]
UM=mul(U,M);overlap=UM[0][0]+UM[1][1]
assert overlap==F(3,5)
a0,a1=F(29,40),F(19,40)
lower_product=min(a0*(1-a0),a1*(1-a1))
assert lower_product==F(319,1600)
chi_upper=(a0-a1)**2/(8*lower_product)
pinsker_gap=F(1,2)*F(3,5)**2
bound=chi_upper-pinsker_gap
assert chi_upper==F(25,638) and bound==F(-1123,7975)<0
out={'scope':'Exact finite algebra for a separately argued insufficiency of the unstrengthened uncertainty plug-in; not a source or global entropy proof',
'N_plus_minus':[[str(x) for x in row] for row in M],
'purification_overlap':str(overlap),'chi_XE_upper':'h(4/5)',
'chi_ZD_upper':str(chi_upper),'ln2_minus_h4_5_lower':str(pinsker_gap),
'uncertainty_lower_bound_upper_at_known_Q_equality':str(bound),
'actual_G_at_control':'0 exactly by complementary pure-output entropy',
'global_Q_proved':False,'global_Q_refuted':False,'independent_review':False,'floating_search':False}
Path(__file__).with_name('CONTROL1302.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps(out))
