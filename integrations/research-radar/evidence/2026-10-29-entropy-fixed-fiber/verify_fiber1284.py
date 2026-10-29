from fractions import Fraction as Q
from itertools import product
from pathlib import Path
import json

def add(A,B):return [[a+b for a,b in zip(x,y)] for x,y in zip(A,B)]
def scale(A,s):return [[s*x for x in row] for row in A]
def tr(A):return sum(A[i][i] for i in range(len(A)))
def T(A):return list(map(list,zip(*A)))
def mul(A,B):return [[sum(a*b for a,b in zip(row,col)) for col in zip(*B)] for row in A]
def block(A,C,B):return [a+c for a,c in zip(A,C)]+[c+b for c,b in zip(T(C),B)]
def rank(A):
 M=[row[:] for row in A];k=0
 for j in range(len(M[0])):
  p=next((i for i in range(k,len(M)) if M[i][j]),None)
  if p is None:continue
  M[k],M[p]=M[p],M[k];v=M[k][j];M[k]=[x/v for x in M[k]]
  for i in range(len(M)):
   if i!=k:
    v=M[i][j];M[i]=[x-v*y for x,y in zip(M[i],M[k])]
  k+=1
 return k
P=[[Q(3,5),Q(0)],[Q(0),Q(4,5)]]
R=[[Q(3,13),Q(4,13)],[Q(0),Q(12,13)]]
A=scale(mul(P,T(P)),Q(1,2));B=scale(mul(R,T(R)),Q(1,2))
assert tr(A)==tr(B)==Q(1,2)
assert mul(A,B)!=mul(B,A)
def rho(K):return block(A,scale(mul(mul(P,K),T(R)),Q(1,2)),B)
s=[Q(3,5),Q(-1,3)];K=[[s[0],Q(0)],[Q(0),s[1]]]
r0=rho(K);assert rank(r0)==4
mix=[[Q(0) for _ in range(4)] for _ in range(4)];rows=[];total=Q(0)
for e in product([-1,1],repeat=2):
 w=(1+e[0]*s[0])*(1+e[1]*s[1])/4
 U=[[Q(e[0]),Q(0)],[Q(0),Q(e[1])]]
 assert mul(U,T(U))==[[Q(1),Q(0)],[Q(0),Q(1)]]
 re=rho(U);W=mul(P,U)+R
 assert re==scale(mul(W,T(W)),Q(1,2))
 assert rank(re)==2 and tr(re)==1
 mix=add(mix,scale(re,w));total+=w
 rows.append({'signs':e,'weight':str(w),'input_rank':2,'Gram_factor_verified':True})
assert total==1 and mix==r0
# A saturated coisometry can remain mixed and entangled.
D=Q(1,25);v=[Q(1),Q(0),Q(0),Q(1)];e=[Q(0),Q(0),Q(1),Q(0)]
outer=lambda z:[[a*b for b in z] for a in z]
r=add(scale(outer(v),9*D),scale(outer(e),7*D))
assert tr(r)==1 and rank(r)==2
Ad=[row[:2] for row in r[:2]];Bd=[row[2:] for row in r[2:]]
assert rank(Ad)==1 and rank(Bd)==2 and tr(Bd)==Q(16,25)
pt=[[Q(0) for _ in range(4)] for _ in range(4)]
for i,a in product(range(2),repeat=2):
 for j,b in product(range(2),repeat=2):pt[2*i+b][2*j+a]=r[2*i+a][2*j+b]
minor=pt[1][1]*pt[2][2]-pt[1][2]*pt[2][1]
assert minor==-Q(81,625)<0
out={'scope':'Exact finite algebra calibrations of a separately written universal convex-fiber argument; no entropy inequality tested or certified','sign_mixture':{'fixed_diagonal_traces':['1/2','1/2'],'diagonals_noncommuting':True,'original_rank':4,'endpoint_ranks':2,'weights_sum':str(total),'mixture_equal_original':mix==r0,'rows':rows},'mixed_saturated_endpoint':{'diagonal_support_ranks':[1,2],'input_rank':2,'population_p':'16/25','partial_transpose_principal_minor':str(minor),'entangled':True,'pure':False,'entropy_gap_evaluated':False},'universal_Q_proved':False,'uniform_reference_dimension_bound':False,'new_paper_or_score':False}
Path(__file__).with_name('CONTROL1284.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Exact fixed-diagonal sign mixture, endpoint ranks and mixed-entangled coisometry guard passed.')
