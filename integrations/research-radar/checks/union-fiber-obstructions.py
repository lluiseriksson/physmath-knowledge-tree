"""Exact structural refutation of F1, after the bounded census passed."""
import itertools,json,math
P=3;Q=12;j=16;a=P|Q|j;u=32;v=64
subsets=lambda mask:[x for x in range(mask+1) if x&mask==x]
Gb=[u|P|x for x in subsets(Q)]+[u|a]
Gc=[v|Q|x for x in subsets(P)]+[v|a]
G=Gb+Gc+[u|v|P|Q,u|v|a]
assert len(G)==len(set(G))==12
assert all(x|y in G for x in G for y in G)
assert all(x|a in G for x in G)
r={x:0 for x in G}
for x,y in itertools.product(G,repeat=2):r[x|y]+=1
top=u|v|a;fiber=[x for x in G if x|a==top]
assert fiber==[111,127] and [r[x] for x in fiber]==[49,45]
assert sum(r[x] for x in fiber)==94>2*r[top]==90
f={y:sum(x|a==y for x in G) for y in G}
actual=[r[x]+2*f[x] for x in G];base=[r[x]+2 for x in G]
assert math.prod(x**x for x in actual)>math.prod(x**x for x in base)
H=lambda c:math.log(sum(c))-sum(x*math.log(x) for x in c)/sum(c)
F=[a]+G
assert all(x|y in F for x in F for y in F)
out={'G':G,'a':a,'output':top,'fiber':fiber,'fiber_union_counts':[r[x] for x in fiber],
     'sum':94,'size_times_output_count':90,'F1_refuted_exactly':True,
     'G_union_counts':[r[x] for x in G],'actual_cross_counts':actual,'uniform_cross_counts':base,
     'E1_entropy_gap_float':H(actual)-H(base),
     'scope':'refutes arithmetic fiber hypothesis F1; does not by itself refute E1 or Q'}
def counts(fam):
    result={x:0 for x in fam}
    for x,y in itertools.product(fam,repeat=2):result[x|y]+=1
    return result

family=[0,31]+list(range(32,48))+[63]
upper=list(range(32,48))+[63]
full_counts=counts(family);upper_counts=counts(upper)
actual=[full_counts[x] for x in upper]
benchmark=[upper_counts[x]+4 for x in upper]
assert sum(actual)==sum(benchmark)==357
assert max(actual)==83<85==max(benchmark)
assert math.prod(x**x for x in actual)>math.prod(x**x for x in benchmark)

def deficit(fam):
    return math.log(len(fam))-H(list(counts(fam).values()))
def delta(n):
    return math.log(n)-H([2*i-1 for i in range(1,n+1)])

checked=0;minimum=1.
for mask in range(1,256):
    fam=[x for x in range(8) if mask>>x&1];N=len(fam)
    if N<2 or any(x|y not in fam for x in fam for y in fam):continue
    c=counts(fam)
    for z in fam:
        ideal=[x for x in fam if x|z==z];M=len(ideal)
        if M==N:continue
        rest=[x for x in fam if x not in ideal]
        values=sorted(c[x] for x in rest)
        assert all(sum(values[:j])<=j*j+2*M*j for j in range(1,len(rest)+1))
        margin=deficit(fam)-delta(N)-(M/N)**2*(deficit(ideal)-delta(M))
        minimum=min(minimum,margin);assert margin>-2e-13;checked+=1
out.update({'majorization_refuted_exactly':True,'principal_ideal_cases':checked,
            'ideal_prefix_counts_exact':True,'ideal_margin_float_minimum':minimum,
            'both_entropy_gap_signs_certified_by_integer_products':True})
print(json.dumps(out))
