"""Exact finite recovery + parent/child precision composition, not full algorithm."""
from fractions import Fraction as F
from math import comb,ceil
from pathlib import Path
from itertools import product
from datetime import datetime,timezone
import hashlib,json,random,time

def add(a,b):
    out=[F(0)]*max(len(a),len(b))
    for i,v in enumerate(a):out[i]+=v
    for i,v in enumerate(b):out[i]+=v
    return out
def scale(a,s):return [v*s for v in a]
def mul(a,b):
    out=[F(0)]*(len(a)+len(b)-1)
    for i,v in enumerate(a):
        for j,w in enumerate(b):out[i+j]+=v*w
    return out
def shift(a,t,alpha,n=None):
    n=len(a) if n is None else n
    return [sum(a[k]*comb(k,j)*t**(k-j)*alpha**j for k in range(j,len(a))) for j in range(n)]
def mod(x,p):
    x=F(x);assert x.denominator%2==1
    return x.numerator*pow(x.denominator,-1,2**p)%(2**p)
def kernel(a):
    L=2**a;cp=1
    for q in range(-L,L):
        if q:cp*=-q
    W={}
    for x in range(L):
        for y in range(L):
            w=[F(1)]
            for q in range(-L,L):
                if q!=y-x:w=mul(w,[F(-q),F(1)])
            W[x,y]=scale(w,F(1,cp))
    return W
def contraction(A,B,W,L):
    out=[F(0)];assign=list(product((0,1),repeat=L))
    for Y in assign:
        for X in assign:
            term=[F(A[Y]*B[X])]
            for x in range(L):
                w=[F(0)]
                for y in range(L):w=add(w,scale(W[x,y],X[y]))
                term=mul(term,w if Y[x] else add([F(1)],scale(w,-1)))
            out=add(out,term)
    return out
def recover(poly,a,u,M,p,adversarial=False):
    L=2**a;alpha=2*L;h=ceil(3*M/u)
    nodes={t:h*max(0,u-((abs(t)&-abs(t)).bit_length()-1)) for t in range(-L,L) if t}
    nodes={t:q for t,q in nodes.items() if q}
    assert sum(nodes.values())>M*(2*L-1)
    result=F(0);maxprecision=0
    for t,q in nodes.items():
        i=(abs(t)&-abs(t)).bit_length()-1;D=L//2**i
        pt=p+8*h*D+8*M*(a+1);maxprecision=max(maxprecision,pt)
        E=[F(1)]
        for v,m in nodes.items():
            if v!=t:
                for _ in range(m):E=mul(E,[F(-v,t-v),F(1,t-v)])
        ep=shift(E,t,alpha,q);fp=shift(poly,t,alpha,q)
        em=[mod(x,pt) for x in ep];fm=[mod(x,pt) for x in fp]
        assert em[0]==1
        quot=[]
        for j in range(q):
            value=(fm[j]-sum(em[k]*quot[j-k] for k in range(1,j+1)))%(2**pt)
            if adversarial:value+=(2**pt)*((-1)**j)*(j+1)
            quot.append(value)
        result+=E[0]*sum(F(v)*F(-t,alpha)**j for j,v in enumerate(quot))
    answer=mod(result,p)
    assert answer==mod(poly[0],p)
    return answer,maxprecision

def main():
    start=time.perf_counter();cases=0;coupled=0;maxp=0
    for a in (1,2):
        L=2**a;W=kernel(a);assign=list(product((0,1),repeat=L))
        for seed in (886,887):
            rng=random.Random(seed);A={v:rng.randrange(16) for v in assign};B={v:rng.randrange(16) for v in assign}
            f=contraction(A,B,W,L)
            assert f[0]==sum(A[v]*B[v] for v in assign)
            for u,p,adversarial in product(range(1,a+1),(1,4,9),(False,True)):
                _,mp=recover(f,a,u,L,p,adversarial);maxp=max(maxp,mp);cases+=1
    # Parent F(t+alpha*z) has two groups, each child has two retained
    # one-port tensors and a new two-port packet tensor, frozen at pt.
    # Recover each actual child's contraction at its creation precision
    # from a second Cauchy/Hermite stage with still higher precision.
    W=kernel(1);assign=list(product((0,1),repeat=2))
    for seed,p,z in product((886,887),(1,4),(1,2)):
        rng=random.Random(seed);av={g:[rng.randrange(8) for _ in range(2)] for g in (0,1)};bv={g:[rng.randrange(8) for _ in range(2)] for g in (0,1)}
        A={v:av[0][v[0]]*av[1][v[1]] for v in assign}
        B={v:bv[1][v[0]]*bv[0][v[1]] for v in assign}
        f=contraction(A,B,W,2);T=1+4*z;pt=p+128
        vals={k:mod(sum(v*T**j for j,v in enumerate(poly)),pt) for k,poly in W.items()}
        total=0
        for beta0,beta1 in product((0,1),repeat=2):
            children=[]
            for g in (0,1):
                bt=(beta0,beta1)[g];bs=(beta1,beta0)[g]
                K={}
                for Y,X in assign:
                    local=vals[g,1-g]*X
                    v=(local if Y else 1-local) if bt==0 else (1 if Y else -1)*vals[g,g]
                    K[Y,X]=v*X**bs%(2**pt)
                retained={v:av[g][v[0]]*bv[g][v[1]] for v in assign}
                # K is evaluated from fixed creation representatives;
                # it is never recomputed modulo the larger child precision.
                fc=contraction(retained,K,W,2)
                value,mp=recover(fc,1,1,2,pt,adversarial=True)
                assert value==sum(retained[v]*K[v] for v in assign)%(2**pt)
                maxp=max(maxp,mp);children.append(value);coupled+=1
            total=(total+children[0]*children[1])%(2**pt)
        expected=mod(sum(v*T**j for j,v in enumerate(f)),pt)
        assert total==expected
    out={'utc':datetime.now(timezone.utc).isoformat(),'passed':True,'direct_recovery_cases':cases,'composed_child_recoveries':coupled,'parent_evaluation_cases':8,'maximum_precision_bits':maxp,'seconds':time.perf_counter()-start,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'source_commit':'7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a','scope':'Exact rational Cauchy polynomials, all active Hermite nodes, canonical quotient representatives plus adversarial 2^pt perturbations; actual parent packet tensors frozen at creation precision before child recovery at higher precision.','not_verified':['full recursive algorithm','extension-field evaluation/interpolation','asymptotic packing or runtime','source theorem','novelty or AIRR importance'],'campaign_status':'bounded audit log, not full-algorithm Research Capsule'}
    Path(__file__).with_name('CHECK886.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,indent=2))
if __name__=='__main__':main()
