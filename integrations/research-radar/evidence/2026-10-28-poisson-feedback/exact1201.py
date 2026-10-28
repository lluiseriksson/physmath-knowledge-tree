from pathlib import Path
import json,sympy as s
C=Path(__file__).parent;R=Path(r'C:\Trabajo\physmath-knowledge-tree\weyl-stability-20261024')
idx=json.loads((R/'graph/index.json').read_bytes())['canonical_files'];nodes=json.loads((R/idx['nodes']).read_bytes());edges=json.loads((R/idx['edges']).read_bytes());seeds={'domain.pde','domain.analysis','domain.quantum_information_theory'}
es=[e for e in edges if e['source'] in seeds or e['target'] in seeds];ids=seeds|{e[k] for e in es for k in ('source','target')}
(C/'SUBGRAPH1201.json').write_text(json.dumps({'nodes':[n for n in nodes if n['id'] in ids],'edges':es,'move':'move.spectralize','limits':'Context only, no graph-confidence promotion'},indent=2)+'\n',encoding='utf-8')
simple=lambda x:s.simplify(s.expand_log(x,force=True))
L=s.Matrix([[-1,1,0],[1,-2,1],[0,1,-1]])
def feedback(q):
    assert all(x>0 for x in q) and sum(q)==1
    r=s.Matrix([s.log(3*x) for x in q]);mean=sum(r)/3;g=r-s.ones(3,1)*mean
    phi=s.Matrix([g[2]-g[0],g[2],0]);assert all(simple(x)==0 for x in L*phi-g)
    theta12=(q[0]-q[1])/(r[0]-r[1]);theta23=(q[1]-q[2])/(r[1]-r[2])
    F=s.Matrix([-theta12*g[0],theta12*g[0]+theta23*g[2],-theta23*g[2]]).applyfunc(simple)
    assert simple(sum(F))==0
    D=sum(q[i]*r[i] for i in range(3));reverse=-sum(r)/3
    assert simple((r.T*F)[0]+D+reverse)==0
    return F
q=s.Matrix([s.Rational(1,7),s.Rational(2,7),s.Rational(4,7)]);v=s.Matrix(list(reversed(list(q))));mid=(q+v)/2
fq,fv,fm=feedback(q),feedback(v),feedback(mid)
defect=(fm-(fq+fv)/2).applyfunc(simple)
assert fq==s.Matrix([1,1,-2])/7 and fm==s.Matrix([-1,2,-1])/42
assert defect==s.Matrix([1,-2,1])/21
assert L*mid-(L*q+L*v)/2==s.zeros(3,1)
assert (L*mid+fm-(L*q+fq+L*v+fv)/2).applyfunc(simple)==defect
record={'model':'Three-state path, uniform reference pi=(1/3,1/3,1/3), target generator L, current-density logarithmic-mean edge mobility; full-support rational witnesses','states':{'q':[str(x) for x in q],'v':[str(x) for x in v],'midpoint':[str(x) for x in mid]},'F_q':[str(x) for x in fq],'F_v':[str(x) for x in fv],'F_mid':[str(x) for x in fm],'affinity_defect_F_mid_minus_average':[str(x) for x in defect],'checks':'Mass conservation, Poisson equation and exact entropy derivative -Jeffreys checked at all3witnesses. Generic edge chain-rule derivation recorded separately.','scope':'Own specified finite analogue, not the continuum source theorem or every discretization/quantum extension. No global ODE positivity/well-posedness proof, novelty clearance, new paper, model grade or Lean result.','sympy_version':s.__version__}
(C/'EXACT1201.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps(record))
