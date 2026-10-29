from fractions import Fraction as F
from pathlib import Path
import json
def mm(A,B):return[[sum(a*b for a,b in zip(row,col))for col in zip(*B)]for row in A]
def tr(A):return list(map(list,zip(*A)))
def sc(A,q):return[[q*x for x in row]for row in A]
def det(A):
 M=[r[:]for r in A];d=F(1)
 for j in range(len(M)):
  k=next((k for k in range(j,len(M))if M[k][j]),None)
  if k is None:return F(0)
  if k!=j:M[k],M[j]=M[j],M[k];d=-d
  p=M[j][j];d*=p
  for k in range(j+1,len(M)):
   z=M[k][j]/p
   for l in range(j,len(M)):M[k][l]-=z*M[j][l]
 return d
X=[[F(3,5),F(0)],[F(0),F(4,5)]]
co=F(9999,10001);si=F(200,10001)
Y=sc(X,co);Y[0][1]=si
assert co*co+si*si==1
A=sc(mm(tr(X),X),F(1,2));B=sc(mm(tr(Y),Y),F(1,2));C=sc(mm(tr(X),Y),F(1,2))
rho=[a+c for a,c in zip(A,C)]+[c+b for c,b in zip(tr(C),B)]
pt=[a+c for a,c in zip(A,tr(C))]+[c+b for c,b in zip(C,B)]
comm=[[a-b for a,b in zip(r,s)]for r,s in zip(mm(A,B),mm(B,A))]
pd=det(pt)
assert pd<0
assert det(A)>0 and det(B)>0 and any(x for row in comm for x in row)
assert sum(rho[i][i]for i in range(4))==1
out={'X':[[str(x)for x in row]for row in X],'Y':[[str(x)for x in row]for row in Y],
't':'200/9999','norm_factors':{'cos':str(co),'sin':str(si)},
'rho_AR':[[str(x)for x in row]for row in rho],
'A_B_full_rank':True,'commutator_A_B':[[str(x)for x in row]for row in comm],
'partial_transpose_determinant':str(pd),'mixed_rank_two':'rho=1/2 [X,Y]^T[X,Y], two independent Gram rows; trace1',
'entangled':True,'saturated_support_coupling':'rank2, A/B invertible => unitary K from polar factors',
'limitation':'Entropy gap at this finite t is not evaluated or certified; this is a support/entanglement guard for the perturbation path only.'}
Path(__file__).with_name('ENTANGLED1290.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8', newline='\n')
print('Full-rank noncommuting A/B, mixed saturated rank2 and negative PT determinant verified exactly.')
