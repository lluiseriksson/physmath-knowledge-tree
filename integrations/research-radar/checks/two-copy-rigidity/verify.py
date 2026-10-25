"""Portable exact certificate replay. Python 3.10+, standard library only.

Classical real Horn/hive realization is an external mathematical dependency.
This program checks the finite identities, not the universal symbolic theorem.
"""
from pathlib import Path
from fractions import Fraction as Q
import json
import hashlib

if not __debug__:
    raise SystemExit('Refusing optimized Python: exact certificate assertions must remain enabled.')

def model(lam, cost=None):
    n=len(lam)
    idx={(i,j):k for k,(i,j) in enumerate((i,j) for i in range(n+1) for j in range(n+1-i))}
    H=len(idx);nv=H+n
    def row(terms):
        d={}
        for j,v in terms:d[j]=d.get(j,0)+v
        return {j:v for j,v in d.items() if v}
    ub=[]
    valid=lambda p:min(p)>=0 and sum(p)<=n
    for i in range(n+1):
        for j in range(n+1):
            if i+j>n-1:continue
            for a,b,c,d in [((i+1,j),(i,j+1),(i,j),(i+1,j+1)),
              ((i,j),(i+1,j),(i,j+1),(i+1,j-1)),
              ((i,j),(i,j+1),(i+1,j),(i-1,j+1))]:
                if all(valid(p) for p in [a,b,c,d]):
                    ub.append(row([(idx[a],-1),(idx[b],-1),(idx[c],1),(idx[d],1)]))
    ub += [{H+k:-1,H+k+1:1} for k in range(n-1)]
    eq=[{idx[0,0]:1}];rhs=[Q(0)]
    for i in range(1,n+1):
        eq.append(row([(idx[i,0],1),(idx[i-1,0],-1),(H+i-1,-1)]));rhs.append(Q(0))
    for k in range(1,n+1):
        eq.append(row([(idx[n-k,k],1),(idx[n-k+1,k-1],-1),(H+n-k,1)]));rhs.append(Q(0))
    for j in range(1,n+1):
        eq.append(row([(idx[0,j],1),(idx[0,j-1],-1)]));rhs.append(Q(lam[j-1]))
    if cost is not None:
        eq.append({H+j:1 for j in range(n)});rhs.append(Q(cost))
    return H,nv,ub,eq,rhs

def primal(x, rows):
    H,nv,ub,eq,rhs=rows
    assert len(x)==nv
    dot=lambda r:sum((v*x[j] for j,v in r.items()),Q(0))
    assert all(dot(r)<=0 for r in ub),'rhombus/order violation'
    assert [dot(r) for r in eq]==rhs,'boundary/cost violation'
    assert all(v>=0 for v in x[H:]),'negative singular variable'

def certificate(cert,lam,cost=None,coordinate=None):
    rows=model(lam,cost);H,nv,ub,eq,rhs=rows
    x=list(map(Q,cert['x']));y=list(map(Q,cert['dual_ub']));z=list(map(Q,cert['dual_eq']))
    lo=list(map(Q,cert['dual_lower']));up=list(map(Q,cert.get('dual_upper',['0']*nv)))
    assert len(y)==len(ub) and len(z)==len(eq) and len(lo)==len(up)==nv
    primal(x,rows)
    assert all(v<=0 for v in y) and all(v>=0 for v in lo)
    assert not any(up) and not any(lo[:H])
    station=lo[:]
    for rs,ms in [(ub,y),(eq,z)]:
        for r,m in zip(rs,ms):
            for j,v in r.items():station[j]+=v*m
    obj=[Q(0)]*nv
    if coordinate is None:obj[H:]=[Q(1)]*len(lam)
    else:
        i,sign=coordinate;obj[H+i-1]=Q(sign)
    assert station==obj,'dual coefficient identity failed'
    pv=sum((a*b for a,b in zip(obj,x)),Q(0))
    dv=sum((a*b for a,b in zip(rhs,z)),Q(0))
    assert pv==dv==Q(cert['objective']),'objectives differ'
    return pv

def main():
    p=Path(__file__).parent
    lam=[5]*4+[-4]*5
    base=json.loads((p/'base-cost-certificate.json').read_text())
    assert certificate(base,lam)==29
    cs=json.loads((p/'full-seed-certificates.json').read_text())
    assert len(cs)==36
    assert {(c['index_one_based'],c['sign']) for c in cs}=={(i,s) for i in range(1,19) for s in [1,-1]}
    target=[8]*2+[6]*2+[5]*4+[4]*2+[1]*2+[0]*6
    for c in cs:
        i,s=c['index_one_based'],c['sign']
        assert certificate(c,[v for v in lam for _ in range(2)],58,(i,s))==s*target[i-1]
    L=sum((max(abs(Q(c['dual_eq'][-1])) for c in cs if c['index_one_based']==i) for i in range(1,19)),Q(0))
    assert L==Q(833,90)
    nr=json.loads((p/'nonrigidity-certificate.json').read_text())
    expected_base=[6,5,4,0,-7,-8]
    assert nr['base_lambda']==expected_base,'nonrigidity base differs from manuscript'
    assert nr['lambda']==[v for v in expected_base for _ in range(2)],'nonrigidity target differs from manuscript'
    dual={k:nr[k] for k in ['dual_ub','dual_eq','dual_lower']}
    dual.update(x=nr['x_witnesses'][0],objective='40')
    assert certificate(dual,nr['lambda'])==40
    nr_rows=model(nr['lambda']);H=nr_rows[0]
    xs=[list(map(Q,x)) for x in nr['x_witnesses']]
    assert len(xs)==2
    for x in xs:
        primal(x,nr_rows);assert sum(x[H:])==40
    assert xs[0][H:]!=xs[1][H:]
    expected_spectra=[[8,8,7,7,4,4,1,1,0,0,0,0],
                      [9,8,7,7,4,4,1,0,0,0,0,0]]
    assert [x[H:] for x in xs]==expected_spectra,'witness spectra differ from manuscript'
    assert [list(map(Q,s)) for s in nr['spectra']]==expected_spectra,'stored spectral summaries differ'
    assert [sum(v>0 for v in x[H:]) for x in xs]==[8,7],'ranks differ from manuscript'
    print(json.dumps({'status':'PASS','base_cost':'29','seed_coordinate_certificates':36,
      'seed_L':str(L),'conditional_uniform_constant':str(3*L),
      'nonrigidity_cost':'40','distinct_optimum_witnesses':2,
      'scope':'finite exact arithmetic only; universal arguments are in the manuscript',
      'inputs':{name:hashlib.sha256((p/name).read_bytes()).hexdigest() for name in
       ['base-cost-certificate.json','full-seed-certificates.json','nonrigidity-certificate.json']}},indent=2))

if __name__=='__main__':main()
