from fractions import Fraction as F
from math import isqrt
import json
# Exact finite checks support the written all-n proof, not a new optical theorem.
rows=[]
for n in [1,2,3,10,100]:
    partial=sum((F(k*k,2**k) for k in range(1,n+1)),F(0))
    tail=F(n*n+4*n+6,2**n)
    assert partial+tail==6
    rows.append({'N':n,'second_moment_partial':str(partial),'exact_tail':str(tail)})
witnesses=[]
for energy in [F(0),F(1,3),F(1),F(10),F(10**6),F(10**30)]:
    n=isqrt((energy.numerator+energy.denominator)//energy.denominator)+1
    assert n*n>energy+1
    witnesses.append({'E':str(energy),'positive_mass_branch_n':n,'weight': '2^(-'+str(n)+')','physicality_margin_E_minus_n2_plus1':str(energy-n*n+1)})
# A separate weak compactness shortcut also fails even with bounded second moments.
weak=[]
for n in [2,10,100]:
    eps=F(1,n*n)
    moment=1-eps+eps*n*n
    w2square=eps*(n-1)**2
    assert moment==2-eps
    weak.append({'n':n,'TV_to_delta1':str(eps),'second_moment':str(moment),'W2_to_delta1_squared':str(w2square)})
print(json.dumps({'status':'exact rational spot checks passed; general proofs are in NOTE1348.md','geometric_second_moment':6,'geometric_tail_checks':rows,'physicality_counterexamples':witnesses,'weak_compactness_shortcut':weak,'formal_proof':False,'new_capacity_or_nonCP_mixture_theorem':False},indent=2))
