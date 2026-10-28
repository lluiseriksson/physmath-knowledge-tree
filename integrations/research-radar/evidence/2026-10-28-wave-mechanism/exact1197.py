from pathlib import Path
import json, sympy as s
C=Path(__file__).parent
repo=Path(r'C:\Trabajo\physmath-knowledge-tree\weyl-stability-20261024')
nodes=json.loads((repo/'graph/nodes/core.json').read_bytes())
edges=json.loads((repo/'graph/edges.json').read_bytes())
seeds={'domain.pde','domain.analysis','domain.harmonic_analysis'}
selected=[e for e in edges if e.get('source') in seeds or e.get('target') in seeds]
ids=seeds|{e[k] for e in selected for k in ('source','target')}
(C/'SUBGRAPH1197.json').write_text(json.dumps({'seeds':sorted(seeds),'nodes':[n for n in nodes if n['id'] in ids],'edges':selected},indent=2)+'\n',encoding='utf-8')
lam,rho,eps=s.symbols('lambda rho epsilon',positive=True)
R=s.diag(0,1,1); B=s.diag(0,lam,0); v=s.Matrix([1,0,0]); nu=s.Matrix([0,1,0])
M=B+rho*R
flux=(nu.T*M.adjugate()*nu)[0]
perturbed=M+eps*v*v.T
perturbed_flux=s.expand((nu.T*perturbed.adjugate()*nu)[0])
assert R*v==s.zeros(3,1) and B*v==s.zeros(3,1) and (nu.T*v)[0]==0
assert flux==0 and s.simplify(perturbed_flux-eps*rho)==0
record={'scope':'Exact real-symmetric 3x3 subcase; not a quaternionic PDE proof or Lean result','normal_cofactor':str(flux),'null_filling_perturbation_normal_cofactor':str(perturbed_flux),'conclusion':'Zero Dirichlet data alone does not force normal cofactor cancellation. This finite model tests the shared-null-line mechanism only. Nonzero flux may have favorable sign and does not refute a perturbed PDE method.','sympy_version':s.__version__}
(C/'EXACT1197.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
sources=json.loads((C/'SOURCES1197.json').read_bytes())
print(json.dumps({'exact':record,'subgraph_nodes':len([n for n in nodes if n['id'] in ids]),'subgraph_edges':len(selected),'sources':[{k:x[k] for k in ('source','status','head','error') if k in x} for x in sources]},indent=2))
