from fractions import Fraction as F
from pathlib import Path
import json

record=json.loads((Path(__file__).parent/'EXACT1191.json').read_bytes())
assert len(record['cases'])==3
for row in record['cases']:
    eps=F(row['epsilon'])
    diagonal=[(2-eps)/4,eps/4,eps/4,(2-eps)/4]
    assert 0<eps<1 and sum(diagonal)==1
    assert diagonal[0]+diagonal[1]==diagonal[2]+diagonal[3]==F(1,2)
    assert diagonal[0]+diagonal[2]==diagonal[1]+diagonal[3]==F(1,2)
    assert min(diagonal)==eps/4==F(row['global_floor'])
    assert diagonal==list(map(F,row['diagonal']))
print('3 exact rational marginal/global-floor identities verified; no general contraction counterexample claimed.')
