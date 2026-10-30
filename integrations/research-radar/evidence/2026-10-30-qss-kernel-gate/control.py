import pathlib,json,hashlib,shutil
from fractions import Fraction as F
W=pathlib.Path(__file__).resolve().parent
p=W.parent/'2026-10-29-qss-uniform-sector'/'M-COEFFICIENTS1317.json';b=p.read_bytes();sha=lambda x:hashlib.sha256(x).hexdigest();assert sha(b)=='6545a2ea350b92892fc83ae6af2f426bd6dbff9fb5e039507d7b3b38511dc82b'
ms=json.loads(b)['matrices'];sup={0,13,26};a=[F(int(i in sup)) for i in range(27)];v={i*27+j for i in sup for j in sup}
u=[F(0) for _ in range(27)]
for k,z in ms[0]:
    if k//27 in v:u[k%27]+=F(z,8)
digs=lambda x:(x//9,(x//3)%3,x%3)
enc=lambda x:9*x[0]+3*x[1]+x[2]
H=[[F(0) for _ in range(27)] for _ in range(27)]
for bp in range(27):
 for rp in sup:
  bd,rd=digs(bp),digs(rp)
  for mask in range(8):
   bb=enc(tuple(rd[i] if mask&(1<<i) else bd[i] for i in range(3)))
   rr=enc(tuple(bd[i] if mask&(1<<i) else rd[i] for i in range(3)))
   if rr in sup:H[bb][bp]+=F(-1,2)**mask.bit_count()
Ha=[sum(H[i][j]*a[j] for j in range(27)) for i in range(27)]
mu=F(15,8);assert u==Ha==[mu*x for x in a]
assert [sum(H[i][j]*u[j] for j in range(27)) for i in range(27)]==[mu*x for x in u]
aq=sum(a[i]*Ha[i] for i in range(27));bq=F(8,15)*sum(x*x for x in u);assert aq==bq==F(45,8)
rows=[]
for m in range(7):
 r=F(1331,4*5**(m+1));q=-r*aq;assert q<0
 rows.append({'m':m,'r_m':str(r),'raw_quadratic':str(q),'unit_vector_quadratic':str(q/9),'sign':'strictly_negative'})
out={'producer':'Own root exact rational control, no independent review','anchor':'psi=(1,0,0), a=w0=|000>+|111>+|222>, v=a tensor a; this is the existing known member, not a new anchor search','M_input_sha256':sha(b),'A_construction':'Exact8swap-subset expansion; H=J*AJ unnormalized anchor, no numerical eigensolver','norm_a_squared':'3','norm_v_squared':'9','nonzero_Mstar_v':[[i,str(x)] for i,x in enumerate(u) if x],'Ha_equals_Mstar_v':True,'H_eigenvalue_on_u':str(mu),'v_A_v':str(aq),'v_Bm_v_all_m':str(bq),'all_m_proof':'(I-8H/15)u=0 and p_m(H)u=8u/15 for every m>=0. Since v is a real product vector across the transposed cut, its expectation is invariant under Gamma. Thus v*((1-r_m)A-B_m)v=-(45/8)r_m<0 for EVERY m>=0.','display_controls':rows,'refutes':'Only the proposed FULL-SPACE polynomial-margin sufficient target1377, all truncation degrees.','does_not_refute':'The original A±B signed comparison, the inverse approximation error bound, or the Gram identity. No universal positivity/gap result.','scientific_replays':'No old optimizer or1322campaign; one predeclared exact known-anchor diagnostic for a new method target.','new_review':False,'new_grade':None}
print(json.dumps(out,indent=2))
