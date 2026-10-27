import sympy as s,numpy as np,scipy.linalg as la,json,pathlib,hashlib
P=pathlib.Path(__file__).parent;src=pathlib.Path(r'D:\Proyectos\airr-investigacion');checks={}
c=json.loads((src/'2026-10-27_envelope1003-certificate'/'CERTIFICATE1003.json').read_text());own=json.loads((P/'EXACT1012.json').read_text())['records'][0]
checks['certificate_input_exact_match']=s.sympify(c['input_SLD'])==s.sympify(own['Gin']);checks['certificate_output_exact_match']=s.sympify(c['output_SLD'])==s.sympify(own['Gout']);checks['certificate_ratio_exact_match']=s.Rational(c['ratio_numerator'])/s.Rational(c['ratio_denominator'])==s.sympify(own['ratio'])
e=s.symbols('e',positive=True);a=s.Matrix([1,0,0,0,e,0]);b=s.Matrix([0,e,0,0,0,1]);sig=(a*a.T+b*b.T)/(2*(1+e*e));proj=2*sig;d=s.zeros(6)
for i,j,z in [(0,4,1),(4,0,1),(4,4,2*e),(1,1,-2*e),(1,5,-1),(5,1,-1)]:d[i,j]=z
checks['singular_SLD_boundary_value']=s.simplify(4*s.trace(d*d)-2*s.trace((proj*d*proj)**2)-16*(1+e*e))==0
ps=[np.eye(2),np.array([[0,1],[1,0]]),np.array([[0,-1j],[1j,0]]),np.diag([1,-1])];us=[np.kron(p,np.eye(3)) for p in ps]
def metric(a,b):
 x,U=la.eigh(a);D=U.conj().T@b@U;return np.sum(2*abs(D)**2/(x[:,None]+x[None,:])).real
arrays=[]
for f in sorted((src/'2026-10-27_pauli997').glob('best997*.npz')):
 with np.load(f) as x:
  sig=x['sigma'];d=x['delta'];w=x['weights'];N=lambda z:sum(q*u@z@u.conj().T for q,u in zip(w,us));val=metric(N(sig),N(d))/metric(sig,d);h=1-16/sum(1/w);partial=d[:3,:3]+d[3:,3:]
  arrays.append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'trace_real':float(np.trace(sig).real),'min_eig':float(la.eigvalsh(sig)[0]),'hermitian_residual':float(la.norm(d-d.conj().T)),'partial_trace_norm':float(la.norm(partial)),'ratio':float(val),'h':float(h),'excess':float(val-h)})
run=json.loads((src/'2026-10-27_pauli997'/'RUNNING997.json').read_text());result=json.loads((src/'2026-10-27_pauli997'/'RESULT997.json').read_text());checks['running_result_rows_equal']=run['rows']==result['rows']
# Literal unnormalized Petz extension is false; normalization is essential.
rho=[s.Rational(3,4),s.Rational(1,4)];sigma=[s.Rational(1,2)]*2
tri=sum((a-b)**2/(a+b) for a,b in zip(rho,sigma));counter={'f':'(x-1)^2/(x+1)+1','lambda':'0','rho':'diag(3/4,1/4)','sigma':'I/2','kappa':'2','H_in':str(1+tri),'H_out':'1','ratio':str(1/(1+tri)),'purported_upper':'0','scope':'Rejects only unnormalized reading; f(1)=0 or subtract f(1) repairs the intended divergence statement.'}
out={'checks':checks,'all_passed':all(checks.values()),'optimizer_archived_arrays_recomputed':arrays,'inherited_optimizer_failure_count':sum(not r['success'] for r in result['rows']),'normalization_counterexample':counter};(P/'ADDITIONAL1012.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,indent=2));assert all(checks.values())
