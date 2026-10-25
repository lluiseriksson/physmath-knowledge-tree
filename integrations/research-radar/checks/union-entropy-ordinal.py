"""Exact finite controls of the ordinal/product identities, not universal proofs."""
from fractions import Fraction as F
import itertools,json,math

def families(n):
    return [tuple(i for i in range(1<<n) if mask>>i&1)
            for mask in range(1,1<<(1<<n))
            if all((x|y) in [i for i in range(1<<n) if mask>>i&1]
                   for x in range(1<<n) if mask>>x&1
                   for y in range(1<<n) if mask>>y&1)]

def law(fam):
    counts={x:0 for x in fam}
    for x,y in itertools.product(fam,repeat=2):counts[x|y]+=1
    return {x:F(v,len(fam)**2) for x,v in counts.items()}

def deficit(fam):
    return math.log(len(fam))+sum(float(v)*math.log(float(v)) for v in law(fam).values())

def absent(fam):
    ground=0
    for x in fam:ground|=x
    assert ground
    return 1-max(F(sum(bool(x&(1<<i)) for x in fam),len(fam))
                 for i in range(ground.bit_length()) if ground&(1<<i))

k=3*math.log(3)/math.log(2)-4
assert 3**15<2**24 and F(8,25)<F(1,3)
base=[f for f in families(3) if len(f)>=2]
upper=families(2)
ordinal_cases=0; product_cases=0; residual=0.; target_margin=float('inf')
for f,g in itertools.product(base,upper):
    B=0
    for x in f:B|=x
    e=1<<3
    E=tuple(f)+tuple(B|e|(x<<4) for x in g)
    N,M=len(f),len(g);w=F(N,N+M)
    assert len(set(E))==N+M
    nu=law(E);ng=law(g)
    assert sum(nu[x] for x in f)==w*w
    for x in f:assert nu[x]==w*w*law(f)[x]
    rho={x:(2*w*F(1,M)+(1-w)*ng[x])/(1+w) for x in g}
    for x in g:assert nu[B|e|(x<<4)]==(1-w*w)*rho[x]
    assert absent(E)==w*absent(f)
    wf=float(w)
    binary=wf*wf*math.log(wf)+(1-wf*wf)*math.log1p(wf)
    conditional=sum(float(v)*math.log(float(v)*M) for v in rho.values())
    predicted=binary+wf*wf*deficit(f)+(1-wf*wf)*conditional
    err=abs(deficit(E)-predicted);residual=max(residual,err);assert err<2e-13
    target_margin=min(target_margin,deficit(E)-k*float(absent(E))**2*math.log(N+M))
    ordinal_cases+=1
    if M>=2 and any(g):
        P=tuple(x|(y<<3) for x in f for y in g)
        assert absent(P)==min(absent(f),absent(g))
        err=abs(deficit(P)-deficit(f)-deficit(g));residual=max(residual,err);assert err<2e-13
        product_cases+=1
out={'ordinal_cases':ordinal_cases,'product_cases':product_cases,
     'level_probabilities_and_mixture_identity':'exact Fractions',
     'absence_frequency_identity':'exact Fractions',
     'max_entropy_identity_float_residual':residual,
     'minimum_ordinal_target_margin_float':target_margin,
     'general_quadratic_target_proved':False,'formal_verification':False}
print(json.dumps(out))
