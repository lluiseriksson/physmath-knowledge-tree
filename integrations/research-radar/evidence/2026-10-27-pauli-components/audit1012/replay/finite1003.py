from pathlib import Path
import mpmath as m,json
m.mp.dps=100;p=Path(__file__).parent
I=m.eye(6)
ps=[m.eye(2),m.matrix([[0,1],[1,0]]),m.matrix([[0,-1j],[1j,0]]),m.matrix([[1,0],[0,-1]])]
def kron3(q):
 z=m.zeros(6)
 for i in range(6):
  for j in range(6):z[i,j]=q[i//3,j//3] if i%3==j%3 else 0
 return z
us=list(map(kron3,ps));N=lambda a:sum((us[j]*a*us[j].H/3 for j in [1,2,3]),m.zeros(6))
def metric(s,d):
 es,U=m.eighe(s);b=U.H*d*U
 return m.re(sum(2*abs(b[i,j])**2/(es[i]+es[j]) for i in range(6) for j in range(6)))
rows=[]
for val in ['.1','.01','.001']:
 e=m.mpf(val);xi=e**6;a=m.matrix([1,0,0,0,e,0]);b=m.matrix([0,e,0,0,0,1])
 ss=(1-xi)*(a*a.H+b*b.H)/(2*(1+e*e))+xi*I/6;d=m.zeros(6)
 for i,j,z in [(0,4,1),(4,0,1),(4,4,2*e),(1,1,-2*e),(1,5,-1),(5,1,-1)]:d[i,j]=z
 gi=metric(ss,d);go=metric(N(ss),N(d));ratio=go/gi
 assert 0<ratio<1
 rows.append({'epsilon':val,'regularization_xi':m.nstr(xi,30),'reference_dimension':3,'input_SLD':m.nstr(gi,85),'output_SLD':m.nstr(go,85),'ratio':m.nstr(ratio,85),'relative_to_ordinary_1_over9':m.nstr(9*ratio,85)})
out={'scope':'Three explicit faithful qubit-qutrit SLD checks for the entanglement-breaking channel T=-I/3. Highprecision checks, not interval certificates or independent proof audit.','precision_digits':100,'weights':['0','1/3','1/3','1/3'],'ordinary_coefficient':'1/9','candidate_complete_coefficient':'1, conditional on997','rows':rows}
(p/'FINITE1003.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,indent=2))
