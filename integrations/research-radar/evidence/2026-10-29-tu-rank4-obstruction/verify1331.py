import json,itertools,hashlib
from fractions import Fraction as F
from pathlib import Path
p=Path(__file__).parent
K=[[1,0,0,0],[0,1,0,0],[-1,-1,0,0],[0,0,1,0],[0,0,0,1],[0,0,-1,-1],[-1,0,-1,0],[0,-1,0,-1],[1,1,1,1]]
M=[[int(i//3==j) for i in range(9)] for j in range(3)]+[[int(i%3==j) for i in range(9)] for j in range(2)]
D=[[0]*5 for _ in range(9)]
D[2][0]=D[5][1]=D[6][3]=D[7][4]=D[8][2]=1
D[8][3]=D[8][4]=-1
def mul(a,b):return [[sum(x*y for x,y in zip(row,col)) for col in zip(*b)] for row in a]
def rank(a):
 a=[list(map(F,r)) for r in a];s=0
 for j in range(len(a[0])):
  pivot=next((i for i in range(s,len(a)) if a[i][j]),None)
  if pivot is None:continue
  a[s],a[pivot]=a[pivot],a[s];v=a[s][j];a[s]=[x/v for x in a[s]]
  for i in range(len(a)):
   if i!=s:
    v=a[i][j];a[i]=[x-v*y for x,y in zip(a[i],a[s])]
  s+=1
  if s==len(a):break
 return s
def triples(a):return [list(c) for c in itertools.combinations(range(len(a)),3) if rank([a[i] for i in c])<3]
assert mul(M,K)==[[0]*4 for _ in range(5)]
assert mul(M,D)==[[int(i==j) for j in range(5)] for i in range(5)]
assert rank(M)==5 and rank(K)==4
assert [K[i] for i in [0,1,3,4]]==[[int(i==j) for j in range(4)] for i in range(4)]
assert mul(M,[[F(1,3)] for _ in range(9)])==[[1] for _ in range(5)]
assert all(rank([K[i],K[j]])==2 for i,j in itertools.combinations(range(9),2))
roots=[[int(i==j) for i in range(4)] for j in range(4)]
roots += [[int(k==i)-int(k==j) for k in range(4)] for i,j in itertools.combinations(range(4),2)]
kt=triples(K);assert len(kt)==6
checks=[]
for omit in range(10):
 a=[r for i,r in enumerate(roots) if i!=omit]
 t=triples(a);assert len(t)==7
 assert all(rank([a[i],a[j]])==2 for i,j in itertools.combinations(range(9),2))
 checks.append(dict(omitted_root=omit,dependent_triples=t))
old=json.loads((p/'PREVIOUS-MATRIX1331.json').read_text())
# Explicitly verify archived selected matrix rather than relying on source edge ordering.
previous=old['matrix']
perm=[5,6,3,7,8,4,1,2,0]
assert [previous[i] for i in perm]==K
out=dict(scope='Exact direct A4 root-normal embedding obstruction; not a Jensen counterexample or novel theorem',
M=M,D=D,K=K,rank_M=5,rank_K=4,central_margins=[1]*5,positive_central_table=['1/3']*9,
kernel_free_coordinates=[0,1,3,4],lattice_index=1,dependent_triples_K=kt,
A4_roots=roots,A4_nine_direction_checks=checks,
positive_control={'configuration':'A4 roots with last direction omitted','dependent_triples':len(triples(roots[:-1])),'identity_embedding_exists':True},
previous_matrix={'source_sha256':old['source_file_sha256'],'record':24,'permutation':perm,
'TU_control_reused':'MINORS814.json: 714 nonempty square minors, all absolute determinants <=1; no repeat campaign'},
conclusion='No invertible real coordinate transformation and individual nonzero rescaling embeds all nine K directions in A4. Six versus seven dependent triples is invariant.',
limits=['Classical cographic K3,3 obstruction; no novelty claim','Does not exclude chamber subdivisions, lifts, nonlinear methods or other rank4 proofs','No independent review, Lean certificate, manuscript or grade'])
assert out==json.loads((p/'RESULT1331.json').read_text(encoding='utf-8'))
print(json.dumps({'rank':4,'K_dependent_triples':len(kt),'A4_counts':[len(c['dependent_triples']) for c in checks],'archived_matrix_equal':True,'positive_control':True}))
