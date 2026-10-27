"""Bounded one-step child factorization audit; not the full ETH algorithm."""
from fractions import Fraction as Q
from itertools import product
from pathlib import Path
import hashlib, json, random, time
from datetime import datetime, timezone

def residue(x, p):
    x=Q(x); assert x.denominator%2
    return x.numerator*pow(x.denominator,-1,2**p)%(2**p)

def tuples(weights, budget):
    def visit(k, left, out):
        if k==len(weights):
            yield tuple(out); return
        for b in range(left//weights[k]+1):
            yield from visit(k+1,left-b*weights[k],out+[b])
    return list(visit(0,budget,[]))

def bits(n): return list(product((0,1),repeat=n))

def check(a,t,z,p,seed,slots):
    L=2**a; alpha=2*L; grid=range(-L,L); T=t+alpha*z
    i=(abs(t)&-abs(t)).bit_length()-1
    assert i<a
    cp=1
    for q in grid:
        if q: cp*=-q
    C=1
    for q in grid: C*=T-q
    W={}
    for x in slots:
        for y in slots:
            n=1
            for q in grid:
                if q!=y-x: n*=T-q
            W[x,y]=residue(Q(n,cp),p)
    # One packet with distinct symbols: row bit i labels group;
    # column bit i has opposite orientation, as specified upstream.
    rg={x:(x>>i)&1 for x in slots}
    cg={y:1-((y>>i)&1) for y in slots}
    modes=[(y0,b,1-((y0>>i)&1),((y0>>i)&1))
           for y0 in range(2**(i+1)) for b in range(p-1)]
    weights=[b+1 for _,b,_,_ in modes]
    betas=tuples(weights,p-1); zero=(0,)*len(modes); mod=2**p
    coeff={}
    for x in slots:
        for k,(y0,b,src,target) in enumerate(modes):
            if rg[x]!=target: continue
            den=T-y0+x
            assert den!=0
            q=Q(C,cp*den)*Q(2**(i+1),den)**b
            coeff[x,k]=residue(q,p)
            assert coeff[x,k]%(2**(b+1))==0
    # First test the geometric crossing expansion, not only its use.
    crossing=0
    for x in slots:
        for y in slots:
            if rg[x]==cg[y]: continue
            y0=y%(2**(i+1)); j=y//2**(i+1)
            got=sum(coeff.get((x,k),0)*j**b
                    for k,(q,b,_,_) in enumerate(modes) if q==y0)%mod
            assert got==W[x,y],('mode',a,t,z,p,x,y,got,W[x,y])
            crossing+=1
    rng=random.Random(seed)
    rows={g:[x for x in slots if rg[x]==g] for g in (0,1)}
    cols={g:[y for y in slots if cg[y]==g] for g in (0,1)}
    A={g:{v:rng.randrange(mod) for v in bits(len(rows[g]))} for g in (0,1)}
    B={g:{v:rng.randrange(mod) for v in bits(len(cols[g]))} for g in (0,1)}
    direct=0
    for ys in bits(len(slots)):
        Y=dict(zip(slots,ys))
        for xs in bits(len(slots)):
            X=dict(zip(slots,xs)); v=1
            for g in (0,1):
                v*=A[g][tuple(Y[x] for x in rows[g])]*B[g][tuple(X[y] for y in cols[g])]
            for x in slots:
                w=sum(W[x,y]*X[y] for y in slots)
                v*=w if Y[x] else 1-w
            direct=(direct+v)%mod
    child={g:{beta:0 for beta in betas} for g in (0,1)}
    for g in (0,1):
        for ys in bits(len(rows[g])):
            Y=dict(zip(rows[g],ys))
            for xs in bits(len(cols[g])):
                X=dict(zip(cols[g],xs)); poly={zero:1}
                for x in rows[g]:
                    w=sum(W[x,y]*X[y] for y in cols[g])
                    local=(w if Y[x] else 1-w)%mod
                    factor={zero:local}
                    for k,(_,_,_,target) in enumerate(modes):
                        if target==g:
                            e=list(zero);e[k]=1
                            factor[tuple(e)]=coeff[x,k]*(1 if Y[x] else -1)%mod
                    nxt={}
                    for b,v in poly.items():
                        for e,c in factor.items():
                            h=tuple(x+y for x,y in zip(b,e))
                            if sum(x*w for x,w in zip(h,weights))<p:
                                nxt[h]=(nxt.get(h,0)+v*c)%mod
                    poly=nxt
                orig=A[g][ys]*B[g][xs]
                for beta in betas:
                    target_exp=tuple(v if modes[k][3]==g else 0 for k,v in enumerate(beta))
                    val=poly.get(target_exp,0)*orig
                    for k,(y0,b,src,_) in enumerate(modes):
                        if src==g and beta[k]:
                            source=sum((y//2**(i+1))**b*X[y]
                                       for y in cols[g] if y%(2**(i+1))==y0)
                            val*=pow(source,beta[k],mod)
                    child[g][beta]=(child[g][beta]+val)%mod
    derived=sum(child[0][b]*child[1][b] for b in betas)%mod
    assert direct==derived,('child',a,t,z,p,seed,slots,direct,derived)
    return crossing,len(betas)

def main():
    start=time.perf_counter(); cases=0; crossing=0; maxbeta=0
    for a in (1,2):
        L=2**a
        masks=[tuple(range(L))]+([(0,L-1)] if L>2 else [])
        for t in range(-L+1,L):
            if not t: continue
            for z,p,seed,slots in product((0,1,2),range(2,6),(882,883),masks):
                c,b=check(a,t,z,p,seed,slots);cases+=1;crossing+=c;maxbeta=max(maxbeta,b)
    out={'utc':datetime.now(timezone.utc).isoformat(),'passed':True,'cases':cases,
         'crossing_entry_comparisons':crossing,'maximum_retained_exponent_tuples':maxbeta,
         'seconds':time.perf_counter()-start,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
         'source_commit':'7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a',
         'scope':'One packet, two groups, scalar integer interpolation values, a=1,2, p=2..5, arbitrary seeded group tensors, full and sparse ports; direct contraction compared to separately summed child contractions.',
         'not_verified':['full recursive algorithm','extension-field interpolation','tapered recovery composition','asymptotic parameter inequalities','full source theorem','novelty or AIRR importance'],
         'campaign_status':'bounded audit log, not Research Capsule or complete reproducible algorithm'}
    Path(__file__).with_name('CHECK882.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(out,indent=2))

if __name__=='__main__': main()
