from pathlib import Path
import json,sympy as s
C=Path(__file__).parent;R=Path(r'C:\Trabajo\physmath-knowledge-tree\weyl-stability-20261024')
idx=json.loads((R/'graph/index.json').read_bytes())['canonical_files'];nodes=json.loads((R/idx['nodes']).read_bytes());edges=json.loads((R/idx['edges']).read_bytes());seeds={'domain.pde','domain.analysis','domain.harmonic_analysis'}
es=[e for e in edges if e['source'] in seeds or e['target'] in seeds];ids=seeds|{e[k] for e in es for k in ('source','target')}
(C/'SUBGRAPH1200.json').write_text(json.dumps({'nodes':[n for n in nodes if n['id'] in ids],'edges':es,'move':'move.spectralize'},indent=2)+'\n',encoding='utf-8')
t,L=s.symbols('t L',positive=True)
anti=s.log(t)**2/2
assert s.simplify(s.diff(anti,t)-s.log(t)/t)==0 and anti.subs(t,1)==0
T=s.symbols('T',real=True);p,v=s.symbols('p v',real=True)
E=(1-s.cos(T))*p+v
assert s.simplify(s.diff(E,T,3)+s.diff(E,T))==0
record={'scale_integral_primitive':'Integral_1^L log(t)/t dt = (log L)^2/2 for L>=1','uniform_original_scale':'For V(s)=C s^-2 exp(-c s/h), B=b/h fixed: weighted potential integral <= C exp(-cB)/(cB), using log(t/B)<=t/B. Positive C,c,h; b<3.','shrinking_inner_scale':'For 0<b<h<=3 the same integral >= C exp(-c) (log(h/b))^2/2, by restricting s to[b,h]. This rejects an h-uniform use of condition6.1 when b/h tends to0 for this upper-bound model potential, not the wave theorem or every better actual potential.','temporal_spectral_scope':'Known Remark6.2 scalar E has only temporal frequencies0,+1,-1; E_TTT+E_T=0 exactly. Adding temporal band limitation alone to the scalar assumptions does not exclude that existing obstruction. Actual nonlinear wave energy need not be bandlimited.','sympy_version':s.__version__,'scope':'Two elementary symbolic identities and analytic inequalities; source mechanism/inference, no new PDE result, grade, independent review or Lean proof.'}
(C/'EXACT1200.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps(record))
