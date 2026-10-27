"""Independent exact finite falsifiers for two selected lemmas, not full ETH audit."""
from fractions import Fraction as Q
from pathlib import Path
import json,hashlib,time,shutil
from datetime import datetime,timezone
C=Path(__file__).parent;D=Path('D:/Proyectos/airr-investigacion/2026-10-27_eth874-reading')
start=time.monotonic()
def v2int(n):
    assert n
    n=abs(n);return (n&-n).bit_length()-1
def v2q(n):return v2int(n.numerator)-v2int(n.denominator)
hermite=0;poly_cases=0;coefficients=0;identities=0
for a in range(1,7):
    L=1<<a;S=range(-L,L)
    for u in range(1,a+1):
        for M in range(u,u+5):
            h=(3*M+u-1)//u
            q=lambda i:h*max(0,u-i)
            for t in S:
                if not t:continue
                i=v2int(t)
                if not q(i):continue
                actual=sum(q(v2int(w))*(v2int(w)-v2int(t-w)) for w in S if w and w!=t)
                Di=L//(1<<i)
                predicted=Di*sum((Q(j,1<<j)*(q(i+j)-q(i)) for j in range(1,a-i+1)),Q(0))
                assert actual==predicted,(a,u,M,t,actual,predicted)
                assert actual>=-6*Di*h
                hermite+=1
def multiply_linear(p,c,d):
    out=[0]*(len(p)+1)
    for j,x in enumerate(p):out[j]+=x*c;out[j+1]+=x*d
    return out
for a in range(1,4):
    L=1<<a;alpha=1<<(a+1);S=list(range(-L,L));den=1
    for q in S:
        if q:den*=-q
    for x in range(L):
        for y in range(L):
            gap=y-x
            constant=1
            for q in S:
                if q!=gap:constant*=-q
            assert Q(constant,den)==int(x==y)
            identities+=1
            for t in S:
                p=[1]
                for q in S:
                    if q!=gap:p=multiply_linear(p,t-q,alpha)
                vals=[v2q(Q(c,den)) for c in p if c]
                assert vals and min(vals)>=0,(a,x,y,t,min(vals))
                if gap!=t:assert min(vals)>=1,(a,x,y,t)
                coefficients+=len(p);poly_cases+=1
result={'utc':datetime.now(timezone.utc).isoformat(),'status':'all selected finite exact checks passed',
 'source_commit':'7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a',
 'tapered_hermite_valuation_identity':{'a_range':[1,6],'u':'1..a','M':'u..u+4','active_nodes_checked':hermite,'arithmetic':'exact integers and Fraction','claim_checked':'displayed valuation identity and lower bound -6 D h'},
 'cauchy_local_integrality':{'a_range':[1,3],'all_row_column_and_grid_nodes':True,'polynomial_cases':poly_cases,'rational_coefficients_checked':coefficients,'identity_at_zero_cases':identities,'claim_checked':'each shifted polynomial Wxy(t+alpha*z) has 2-integral rational coefficients, and is coefficientwise even if y-x differs from t'},
 'not_checked':['full tensor recursion correctness','recursive entry descriptions and cost accounting','mode coefficient construction in all generality','full main polynomial/parity-test reduction','claimed ETH refutation or originality'],
 'new_theorem':False,'manuscript_score':None,'elapsed_seconds':time.monotonic()-start,
 'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
for p in [C/'CHECK875.json',D/'CHECK875.json']:p.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
shutil.copy2(__file__,D/Path(__file__).name)
print(json.dumps(result,indent=2))
