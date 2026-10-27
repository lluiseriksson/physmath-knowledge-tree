from pathlib import Path
import mpmath as m,json
m.mp.dps=100;p=Path(__file__).parent
I=m.eye(6);ix=[[0,1],[1,0]];iy=[[0,-1j],[1j,0]];iz=[[1,0],[0,-1]]
def kron3(q):return m.matrix(6,6,lambda i,j:q[i//3][j//3] if i%3==j%3 else 0)
# Explicit loop avoids mpmath constructor callback ambiguity.
def pauli(q):
 out=m.zeros(6)
 for i in range(6):
  for j in range(6):out[i,j]=q[i//3][j//3] if i%3==j%3 else 0
 return out
us=[I,pauli(ix),pauli(iy),pauli(iz)]
def metric(s,d):
 es,U=m.eighe(s);b=U.H*d*U
 return m.re(sum(2*abs(b[i,j])**2/(es[i]+es[j]) for i in range(6) for j in range(6)))
def petz(r,s):
 er,U=m.eighe(r);es,V=m.eighe(s);b=U.H*V
 return m.re(sum((er[i]-es[j])**2/(er[i]+es[j])*abs(b[i,j])**2 for i in range(6) for j in range(6)))
ws=[['.625','.125','.125','.125'],['.4','.3','.2','.1'],['.35','.15','.15','.35'],['.7','.1','.15','.05'],['.45','.25','.25','.05']]
rows=[]
for ww in ws:
 w=list(map(m.mpf,ww));h=1-16/sum(1/x for x in w)
 def N(a):return sum((wi*ui*a*ui.H for wi,ui in zip(w,us)),m.zeros(6))
 for ee in ['.1','.01','.001']:
  e=m.mpf(ee);xi=e**6;t=xi**2
  a=m.matrix([1,0,0,0,e,0]);b=m.matrix([0,e,0,0,0,1])
  s0=(a*a.H+b*b.H)/(2*(1+e*e));ss=(1-xi)*s0+xi*I/6
  d=m.zeros(6)
  for i,j,val in [(0,4,1),(4,0,1),(4,4,2*e),(1,1,-2*e),(1,5,-1),(5,1,-1)]:d[i,j]=val
  rr=ss+t*d
  assert min(m.eighe(rr,eigvals_only=True))>0
  ns=N(ss);nd=N(d)
  q=metric(ns,nd)/metric(ss,d);f=petz(N(rr),ns)/petz(rr,ss)
  assert q<=h+m.mpf('1e-65') and f<=h+m.mpf('1e-60')
  rows.append({'weights':ww,'epsilon':ee,'xi':m.nstr(xi,30),'t':m.nstr(t,30),'harmonic':m.nstr(h,85),'SLD_ratio':m.nstr(q,85),'finite_Petz_ratio':m.nstr(f,85),'SLD_gap':m.nstr(h-q,50),'Petz_gap':m.nstr(h-f,50)})
result={'precision_digits':100,'scope':'15 explicit faithful A2R3 pairs, fixed positive Pauli weights, xi=e^6 and t=xi^2; high-precision consistency checks, not interval certificates or universal proof','rows':rows,'failures':0}
(p/'FINITE997.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'pairs':len(rows),'failures':0,'last_per_channel':[{'weights':r['weights'],'h':r['harmonic'],'ratio':r['finite_Petz_ratio']} for r in rows[2::3]]},indent=2))
