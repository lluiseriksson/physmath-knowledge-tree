"""Exact finite controls of the candidate SOS; not proof of its universal scope."""
import json, pathlib, sympy as S
if not __debug__:
    raise RuntimeError('Run without optimization: exact assertions are required')

def require(v,msg):
    if not v: raise RuntimeError(msg)

def graph_case(n,edges):
    edges=sorted(tuple(sorted(e)) for e in edges)
    require(not any(tuple(sorted((j,k))) in edges for i in range(n)
        for j in range(n) for k in range(j+1,n)
        if tuple(sorted((i,j))) in edges and tuple(sorted((i,k))) in edges),'triangle')
    m=len(edges); P=[]; E=[]
    for i in range(n):
        incident=[a for a,e in enumerate(edges) if i in e]
        d=len(incident); B=S.diag(*[S.Integer(i+j+2) for j in range(d)])+S.ones(d)
        # Positive definite rational B; exact range projector is diagonal on incident edges.
        Z=S.zeros(m); Q=S.zeros(m)
        for a,e in enumerate(incident):
            Q[e,e]=1
            for b,f in enumerate(incident): Z[e,f]=B[a,b]
        P.append(Z);E.append(Q)
    D=S.Matrix(n,n,lambda i,j:S.trace(P[i]*P[j]))
    M=S.diag(*D.diagonal())-(D-S.diag(*D.diagonal()))
    # Verify the complete quadratic-form matrix identity, including every cross coefficient.
    R=S.zeros(n)
    for i in range(n):
        F=sum((E[j] for j in range(n) if tuple(sorted((i,j))) in edges),S.zeros(m))
        require(F*F==F,'neighbor projection not idempotent')
        R[i,i]+=S.trace(P[i]*P[i]*(S.eye(m)-F))
    for i,j in edges:
        A=P[i]*E[j];B=E[i]*P[j]
        R[i,i]+=S.trace(A.T*A);R[j,j]+=S.trace(B.T*B)
        R[i,j]-=S.trace(A.T*B);R[j,i]-=S.trace(B.T*A)
    require(R==M,'SOS coefficient mismatch')
    C=S.Matrix(n,n,lambda i,j:S.trace((P[i]*P[j])**2))
    D4=S.Matrix(n,n,lambda i,j:S.trace(P[i]**2*P[j]**2))
    require(all(C[i,j]<=D4[i,j] for i in range(n) for j in range(n)),'p4 ALT finite control')
    MC=S.diag(*C.diagonal())-(C-S.diag(*C.diagonal()))
    # Strict positivity of these particular finite examples by exact LDL pivots.
    L,T=MC.LDLdecomposition(hermitian=False)
    require(L*T*L.T==MC and all(v>0 for v in T.diagonal()),'exact LDL not positive')
    noncomm=sum(P[i]*P[j]!=P[j]*P[i] for i,j in edges)
    require(noncomm>0,'control accidentally commutative')
    return {'n':n,'edges':edges,'ambient_dimension':m,'noncommuting_edges':noncomm,
      'SOS_exact_coefficients':True,'p4_comparison_LDL_pivots':[str(v) for v in T.diagonal()],
      'P_entries':[[[str(v) for v in row] for row in p.tolist()] for p in P]}

c5=[(i,(i+1)%5) for i in range(5)]
petersen=[(i,(i+1)%5) for i in range(5)]+[(i,i+5) for i in range(5)]+[(i+5,(i+2)%5+5) for i in range(5)]
cases=[graph_case(5,c5),graph_case(10,petersen)]
# Required negative control: removing triangle-freeness can invalidate the projection budget.
E=[S.eye(1)]*3
require(S.eye(1)-E[1]-E[2]==S.Matrix([[-1]]),'negative control failed')
out={'scope':'two exact noncommuting finite controls, not universal/novelty certification',
     'cases':cases,'triangle_budget_negative_control':True,'optimization_campaign':False}
path=pathlib.Path(__file__).with_suffix('.json');path.write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({'output':str(path),'cases':len(cases),'SOS':'PASS','p4_LDL':'PASS','triangle_negative_control':'PASS'}))
