from pathlib import Path
import sympy as s,json,hashlib
C=Path(__file__).parent;R=Path(r'C:\Trabajo\physmath-knowledge-tree\weyl-stability-20261024')
nodes=json.loads((R/'graph/nodes/core.json').read_bytes());edges=json.loads((R/'graph/edges.json').read_bytes());seed={'domain.pde','domain.analysis'}
es=[e for e in edges if e['source'] in seed or e['target'] in seed];ids=seed|{e[k] for e in es for k in ('source','target')}
(C/'SUBGRAPH1199.json').write_text(json.dumps({'seeds':sorted(seed),'nodes':[n for n in nodes if n['id'] in ids],'edges':es,'move':'move.spectralize'},indent=2)+'\n',encoding='utf-8')
a,b,c,d,e,f,g=s.symbols('a b c d e f g',real=True);I=s.I
Q=lambda w,x,y,z:s.Matrix([[w+I*x,y+I*z],[-y+I*z,w-I*x]])
N=s.eye(2).col_join(s.zeros(2));V=Q(0,a,b,c).col_join(Q(d,e,f,g))
A=V*N.conjugate().T-N*V.conjugate().T-N*(N.conjugate().T*V)*N.conjugate().T
zero=lambda M:all(s.simplify(x)==0 for x in M)
assert zero(N.conjugate().T*V+V.conjugate().T*N)
assert zero(A.conjugate().T+A) and zero(A*N-V)
record={'source':'Pinned OpenAI wave PDF p39-40 tangential rigid-motion construction','variables':'Seven free real symbols; quaternionic dimension2 with normalized normal e1','checks':{'real_normal_tangency':'N*V+V*N=0','skew_hermitian':'A*+A=0','normal_image':'AN=V'},'scope':'Exact polynomial matrix identities in the standard2x2 complex quaternion representation. Checks a source algebra step only; not an elliptic PDE proof, uniform estimate, external review or Lean theorem.','sympy_version':s.__version__}
(C/'EXACT1199.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps(record))
