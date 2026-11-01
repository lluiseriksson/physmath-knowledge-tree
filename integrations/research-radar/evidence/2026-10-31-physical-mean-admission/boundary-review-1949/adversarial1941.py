"""Deterministic mathematical tests for assessment1941, not physical witnesses."""
import hashlib, itertools, json, platform, random
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent
SEED = 1941
rng = random.Random(SEED)

def neighbors(c, n):
    return [tuple((c[j]+v[j]) % n for j in range(len(c)))
            for v in itertools.product((-1,0,1), repeat=len(c))]

def erode(a, universe, n):
    return {c for c in universe if all(t in a for t in neighbors(c,n))}

def dilate(a, n):
    return {t for c in a for t in neighbors(c,n)}

def cell_gap(a, b, n, h):
    if not a or not b:
        return None
    return min(h * max(max(min(abs(x-y),n-abs(x-y))-1,0)
                        for x,y in zip(c,d)) for c in a for d in b)

def fine_incident_endpoints(a, n, h):
    p = n*h
    sites = {(c[0]*h+j)%p for c in a for j in range(-(h//2),h//2+1)}
    bonds = {x for x in range(p) if x in sites or (x+1)%p in sites}
    return {v for x in bonds for v in (x,(x+1)%p)}

def fine_gap(a,b,n,h):
    aa,bb=fine_incident_endpoints(a,n,h),fine_incident_endpoints(b,n,h)
    if not aa or not bb: return None
    return min(min(abs(x-y),n*h-abs(x-y)) for x in aa for y in bb)

records=[]
u={(i,) for i in range(7)}
cases=nonvacuous=0; min_cont=None; min_fine=None; violations=[]
for mask in range(1<<7):
    omega={c for c in u if mask & (1<<c[0])}
    e1=erode(omega,u,7); e2=erode(e1,u,7)
    ordered=sorted(e1)
    for rmask in range(1<<len(ordered)):
        raw={c for j,c in enumerate(ordered) if rmask & (1<<j)}
        d=e2-dilate(raw,7); s=(omega-e1)|raw
        cg=cell_gap(d,s,7,13); fg=fine_gap(d,s,7,13)
        cases+=1
        if cg is not None:
            nonvacuous+=1; min_cont=cg if min_cont is None else min(min_cont,cg)
            min_fine=fg if min_fine is None else min(min_fine,fg)
            if cg<13 or fg<9: violations.append([mask,rmask,cg,fg])
records.append(dict(id='G1',kind='exhaustive_1d_toy_geometry',n=7,h=13,
    cases=cases,nonvacuous=nonvacuous,min_continuous_gap=min_cont,
    min_incident_endpoint_gap=min_fine,claimed_conservative_gap=9,violations=violations,
    limit='Toy 1D periodic h-cell masks. Raw bad set is h-cell-aligned. Does not instantiate the physical source hierarchy or its indicators.'))

n=9; u2=set(itertools.product(range(n),repeat=2)); nonvac=0; violations=[]; vals=[]
for trial in range(384):
    if trial%2:
        sx,sy=rng.randrange(n),rng.randrange(n)
        omega={((sx+i)%n,(sy+j)%n) for i in range(7) for j in range(7)}
    else:
        omega={c for c in u2 if rng.random()<.94}
    e1=erode(omega,u2,n); e2=erode(e1,u2,n)
    raw={c for c in sorted(e1) if rng.random()<.035}
    d=e2-dilate(raw,n); s=(omega-e1)|raw
    gap=cell_gap(d,s,n,13)
    if gap is not None:
        nonvac+=1; vals.append(gap)
        if gap<13: violations.append(dict(trial=trial,gap=gap))
records.append(dict(id='G2',kind='seeded_2d_periodic_geometry',seed=SEED,n=n,h=13,
    trials=384,nonvacuous=nonvac,min_continuous_gap=min(vals) if vals else None,
    violations=violations,limit='Tests periodic wrapping, corners, and irregular masks; not a physical d=4 witness.'))

u9={(i,) for i in range(9)}; omega={(i,) for i in range(1,6)}
e1=erode(omega,u9,9); e2=erode(e1,u9,9); s=omega-e1
records.append(dict(id='G3',kind='insufficient_depth_counterexample',n=9,h=13,
    omega=sorted(omega),s=sorted(s),one_erosion=sorted(e1),two_erosions=sorted(e2),
    gap_one=cell_gap(e1,s,9,13),gap_two=cell_gap(e2,s,9,13),
    limit='Counterexample to weakening the two source erosions, not to Eq1.20.'))
records.append(dict(id='G4',kind='missing_tilde_counterexample',n=9,h=13,
    raw=[0],d_without_tilde=[1],continuous_gap=cell_gap({(1,)},{(0,)},9,13),
    limit='Counterexample to deleting the enlargement of R1 prime, not to Eq1.20.'))

q=np.array([[2.,-1.,0.],[-1.,2.,-1.],[0.,-1.,2.]])
keep=[0,2]; drop=[1]
schur=q[np.ix_(keep,keep)]-q[np.ix_(keep,drop)]@np.linalg.inv(q[np.ix_(drop,drop)])@q[np.ix_(drop,keep)]
records.append(dict(id='A1',kind='schur_complement_adversary',precision=q.tolist(),
    direct_far_coupling=float(q[0,2]),schur_after_eliminating_middle=schur.tolist(),
    limit='Positive definite finite matrix showing why bare support does not extend to eliminated/history precision.'))

kappa=.25; perm=np.roll(np.eye(4),1,axis=1); inverse=np.linalg.inv(np.eye(4)-kappa*perm)
records.append(dict(id='A2',kind='nonlocal_selected_solve_adversary',kappa=kappa,
    equation='s=a+kappa*P*s',inverse=inverse.tolist(),min_abs_entry=float(np.min(np.abs(inverse))),
    limit='Hypothetical coupled selection. Source corridor equation has no such off-diagonal selected variables.'))

records.extend([
 dict(id='A3',kind='bridge_primitive_counterexample',L='x*e',transport='e -> e+t',
      difference='t*x',at_t_1_x_0=0,at_t_1_x_1=1,
      limit='Fails exactly when a complete primitive bridges D and changed S.'),
 dict(id='A4',kind='hidden_inner_background_counterexample',L='-e^2',transport='e -> e+H(x), H(x)=x',
      difference='-2*e*x-x^2',at_e_0_x_0=0,at_e_0_x_1=-1,
      limit='Hypothetical inner-dependent H. In the checked source step U1,V,V0,sector are fixed.'),
 dict(id='A5',kind='long_mark_counterexample',mark='x*e_far',transport='e_far -> e_far+t',
      mark_difference='t*x',limit='Long complete carrier fails even when mark label/center is near D; original separated four-link carrier does not.'),
 dict(id='A6',kind='indicator_halo_counterexample',indicator='1{max(abs(x),abs(e))>=1}',
      fixed_e=0,at_x_0=0,at_x_2=1,
      limit='A bad-event indicator with an inner halo is not exterior merely because its cell label is exterior. If an existing inner good cutoff enforces abs(x)<1, its effective dependence can reduce to e; that reduction must be justified.'),
 dict(id='A7',kind='outer_weight_cancellation_counterexample',outer_points=[-1,1],base_mass=[.5,.5],
      W=[1,3],p='e',q='e',Z=[2,1,1,2],connected_with_W=.75,connected_without_W=1.,
      limit='Exact two-point algebra, not a physical sector, proving that a common conditional weight cannot be dropped before outer integration.'),
 dict(id='A8',kind='near_boundary_survives',precision=q.tolist(),inner_index=0,near_exterior=1,changed_far_exterior=2,
      conditional_cross_term='x*e_near',far_transport='e_far -> e_far+t',
      far_increment='t*e_near-2*t*e_far-t^2',
      limit='With exponent -a^T Q a/2, exterior increment coexists with nonzero inner/near-boundary interaction.')
])

m=json.loads((ROOT/'FROZEN-MANIFEST1941.json').read_text(encoding='utf-8-sig'))
integrity=[]
for f in m['inputs']+m['source_hashes']:
    path=Path(f['path']); body=path.read_bytes(); actual=hashlib.sha256(body).hexdigest()
    integrity.append(dict(path=str(path),expected=f['sha256'],actual=actual,match=actual==f['sha256'],bytes=len(body)))
result=dict(seed=SEED,python=platform.python_version(),numpy=np.__version__,
    physical_witness=False,tests=records,integrity_recheck=integrity,
    manifest_sha256=hashlib.sha256((ROOT/'FROZEN-MANIFEST1941.json').read_bytes()).hexdigest())
(ROOT/'adversarial-results1941.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
