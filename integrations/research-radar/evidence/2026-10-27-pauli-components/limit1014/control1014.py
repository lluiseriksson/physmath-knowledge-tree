from pathlib import Path
import sympy as s,hashlib,json,shutil
P=Path(__file__).parent;D=Path(r'D:\Proyectos\airr-investigacion')/P.name
e=s.symbols('e',positive=True);th=s.symbols('theta',real=True)
a=s.Matrix([1,0,0,0,e,0]);b=s.Matrix([0,e,0,0,0,1]);sigma=(a*a.T+b*b.T)/(2*(1+e*e))
E=s.diag(1,2*e*e,1,1,2*e*e,1)/(4*(1+e*e));rho=(1-th)*E+th*sigma
d=s.zeros(6);d[0,4]=d[4,0]=1;d[4,4]=2*e;d[1,1]=-2*e;d[1,5]=d[5,1]=-1
Q=s.diag(1,0,0,0,1,0)
assert Q*rho-rho*Q==s.zeros(6)
assert s.trace(Q*d)==2*e
out=dict(scope='Exact limitation of displayed993/1011 lower family; not a refutation of complete-SLD/Petz contraction',commutes_with_base=True,block_projector_indices=[0,4],trace_Q_D=str(s.trace(Q*d)),reason='For any Hermitian H, Tr Q(-i[H,rho]) = -i Tr([rho,Q]H)=0. The displayed tangent has Tr QD=2e>0. Thus it cannot be a unitary-encoding tangent for any H, even a global one.',consequence='Do not claim the ladder supplies a fixed-Hamiltonian or phase-estimation protocol. The valid scope remains arbitrary differentiable state models with fixed reference marginal. The NPT retention implication requires a justified input-QFI upper bound; tomography alone does not establish practical advantage.',novelty_or_grade=None)
(P/'CONTROL1014.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
files=[dict(path=f.name,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),bytes=f.stat().st_size) for f in sorted(P.iterdir()) if f.is_file() and f.name!='MANIFEST1014.json']
(P/'MANIFEST1014.json').write_text(json.dumps(dict(files=files),indent=2)+'\n',encoding='utf-8')
D.mkdir(parents=True,exist_ok=True)
for f in P.iterdir():
 if f.is_file():
  q=D/f.name
  if q.exists():assert q.read_bytes()==f.read_bytes()
  else:shutil.copyfile(f,q)
print(json.dumps(out,indent=2))
