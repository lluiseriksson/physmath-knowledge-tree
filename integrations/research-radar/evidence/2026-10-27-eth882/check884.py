"""Finite falsifier for an elementary limitation of level-only multiplicity profiles."""
from fractions import Fraction as F
from itertools import product
from pathlib import Path
import json,hashlib,time
from datetime import datetime,timezone
start=time.perf_counter();profiles=0;active=0
for u in range(1,6):
    for a in range(2*u,2*u+3):
        for q in product(range(4),repeat=u):
            if not any(q):continue
            ell=[sum(F(j,2**j)*(q[i]-(q[i+j] if i+j<u else 0))
                     for j in range(1,a-i+1)) for i in range(u)]
            S=sum(F(q[k],2**k) for k in range(u))
            identity=sum(q[k]*(F(k+2,2**k)-F(a-k+2,2**(a-k))) for k in range(u))
            assert sum(ell)==identity
            assert identity>=S
            assert max(ell[i] for i in range(u) if q[i])>=S/u
            profiles+=1;active+=sum(bool(x) for x in q)
out={'utc':datetime.now(timezone.utc).isoformat(),'passed':True,'nonzero_profiles':profiles,'active_levels':active,
     'parameters':'u=1..5; a=2u..2u+2; each q_i=0..3, excluding all zero',
     'seconds':time.perf_counter()-start,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
     'scope':'Exact finite checks of a separately written elementary algebraic identity and lower bound; not a new frontier result, full algorithm bound or formal proof.'}
Path(__file__).with_name('CHECK884.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,indent=2))
