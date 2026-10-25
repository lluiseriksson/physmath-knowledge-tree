from pathlib import Path
import json
from fractions import Fraction as Q

# Sakar, Appendix B, printed p51 / PDF p59, visually checked 2026-10-25.
sakar = [(-1,0,1,2,-2),(2,-2,-1,0,1),(0,1,1,0,-1),
 (1,1,-1,0,0),(1,0,1,-1,0),(2,0,-1,0,1),(0,1,2,-1,0),
 (0,1,2,1,-1),(1,2,-1,0,1),(2,1,0,0,1),(1,2,0,1,0),(1,1,2,0,0)]
# Eriksson Table 2, PDF p3: six representatives and negative reversals.
own = [(2,-2,-1,0,1),(1,0,-1,-1,0),(0,1,-2,-1,0),
 (2,0,-1,0,1),(1,1,-1,0,0),(1,0,1,-1,0)]
own += [tuple(-v for v in reversed(a)) for a in own[:]]
def canonical(a):
    return tuple(Q(x)-Q(sum(a),len(a)) for x in a)
assert len({canonical(a) for a in sakar}) == 12
assert {canonical(a) for a in sakar} == {canonical(a) for a in own}
matches = []
for i,a in enumerate(own):
    j,b = next((j,b) for j,b in enumerate(sakar) if canonical(a)==canonical(b))
    delta = [a[k]-b[k] for k in range(5)]
    assert len(set(delta)) == 1
    matches.append(dict(own_index=i+1,sakar_index=j+1,own=a,sakar=b,
                        all_ones_offset=delta[0]))
out = {'status':'exact rational equality of all twelve rows modulo trace',
       'scope':'comparison of published tables, not reproduction of thesis facet completeness or manuscript rank claims',
       'matches':matches}
Path(__file__).with_suffix('.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps(out,indent=2))
