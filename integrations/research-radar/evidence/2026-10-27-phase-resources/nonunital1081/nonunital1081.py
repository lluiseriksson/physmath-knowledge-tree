from pathlib import Path
import sympy as s
import datetime,json,hashlib,shutil
P=Path(r'C:\Trabajo\airr\2026-10-27_nonunital1081-falsifier');assert not P.exists();P.mkdir()
r=s.Rational
J=s.diag(r(9,20),r(1,20),r(1,10),r(2,5));inverse=J.inv();S=s.diag(inverse[0,0]+inverse[2,2],inverse[1,1]+inverse[3,3])
assert s.diag(J[0,0]+J[1,1],J[2,2]+J[3,3])==s.eye(2)/2
assert all(x>0 for x in J.diagonal())
candidate=1-4*s.trace(S.inv());assert candidate==r(49,99)
def channel(A):return s.diag(r(9,10)*A[0,0]+r(1,5)*A[1,1],r(1,10)*A[0,0]+r(4,5)*A[1,1])
sigma=s.diag(r(4,7),r(3,7));z=s.diag(1,-1);step=r(1,100);rho=sigma+step*z
assert all(x>0 for x in sigma.diagonal()) and all(x>0 for x in rho.diagonal())
def chimin(A,B):return sum((A[i,i]-B[i,i])**2/B[i,i] for i in range(2))
def triangular(A,B):return sum((A[i,i]-B[i,i])**2/(A[i,i]+B[i,i]) for i in range(2))
ratio=s.factor(chimin(channel(rho),channel(sigma))/chimin(rho,sigma));tri=s.factor(triangular(channel(rho),channel(sigma))/triangular(rho,sigma));assert ratio==r(1,2)>candidate and tri>candidate
proof='''Barrier1081: a naive nonunital partial-trace-inverse Choi formula fails
27 October2026. Own exact rational falsifier, not externally audited or a manuscript assessment. Exploration beyond the unital qubit classification; not part of1060 or1077, and not a separate paper. No claim that anyone else proposed the false formula.

The established unital qubit expression1-16/Tr(J^-1) motivates the tempting extension
 eta_candidate(N)=1-4Tr[(Tr_A J^-1)^-1]
for full-rank normalized qubit Choi J (input A, output B). On a Pauli-diagonal channel, Tr_A J^-1=(TrJ^-1)/2 I, so this reduces to the established expression. On a replacer J=I_A/2 tensor tau_B, it gives zero. These two consistency checks do NOT validate the generalization.

Counterexample. Let the measure/prepare channel be
 N(X)=diag((9/10)X00+(1/5)X11,(1/10)X00+(4/5)X11).
It is CPTP: measure the computational basis and prepare probability vectors(.9,.1) or(.2,.8). Its normalized Choi matrix in input-output order00,01,10,11 is diag(9/20,1/20,1/10,2/5), positive definite, trace1, input marginalI/2. The channel is nonunital, since N(I/2)=diag(11/20,9/20).

Tr_A J^-1=diag(110/9,45/2), so the proposed expression equals49/99. Choose faithful sigma=diag(4/7,3/7), tangent Z=diag(1,-1), and rho=sigma+Z/100. Both are normalized and positive; reference R is trivial, so the equal-reference condition holds. Their output base is diag(3/5,2/5), and N(Z)=(7/10)Z. The SLD/minimal-chi-square ratio is exactly
 (7/10)^2 [1/(3/5)+1/(2/5)]/[1/(4/7)+1/(3/7)]=1/2,
with gap1/198 over49/99. For minimal chi-square the same ratio holds for this actual finite pair, because the divergence is exactly quadratic in rho-sigma. A direct rational finite triangular-Petz calculation at step1/100 also exceeds49/99 and is recorded in CONTROL1081. Thus even the unassisted coefficient exceeds the proposed complete upper. No optimization or numerical counterexample is needed.

Abandon this particular formula as a universal value or upper bound. This does not refute the unital theorem, its singular-Choi cases, a source-optimized modification, or any theorem from the literature. The evidence also does not establish the exact complete coefficient of this nonunital channel; it gives only a certified lower that refutes the guessed upper. Optimizing over the input reference/base remains essential; replacing it by a uniform-source expression loses that variable. No BKM, MI, capacity, priority or full nonunital classification is claimed.
'''
(P/'FALSIFIER1081.txt').write_text(proof,encoding='utf-8')
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='own exact rational finite counterexample to root proposed formula, no external review or new manuscript grade',normalized_Choi=[[str(x) for x in J.row(i)] for i in range(4)],partial_trace_inverse=[[str(x) for x in S.row(i)] for i in range(2)],candidate=str(candidate),sigma=[str(x) for x in sigma.diagonal()],rho=[str(x) for x in rho.diagonal()],step=str(step),chimin_ratio=str(ratio),chimin_gap=str(ratio-candidate),finite_triangular_ratio=str(tri),finite_triangular_gap=str(tri-candidate),CPTP=True,Choi_full_rank=True,nonunital=True,score=None)
(P/'CONTROL1081.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');shutil.copyfile(__file__,P/'nonunital1081.py');sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
(P/'MANIFEST1081.json').write_text(json.dumps(dict(utc=out['utc'],files=[dict(path=p.name,bytes=p.stat().st_size,sha256=sha(p)) for p in sorted(P.iterdir()) if p.is_file()]),indent=2)+'\n',encoding='utf-8')
D=Path(r'D:\Proyectos\airr-investigacion')/P.name;assert not D.exists();shutil.copytree(P,D);assert {p.name:sha(p) for p in P.iterdir()}=={p.name:sha(p) for p in D.iterdir()}
print(json.dumps(dict(path=str(D),candidate=str(candidate),actual_finite_chimin=str(ratio),exact_gap=str(ratio-candidate),triangular=str(tri),generalization_abandoned=True)))
