from fractions import Fraction as F
import itertools,json,pathlib
W=pathlib.Path(__file__).parent
def determinant(A):
 n=len(A); total=F(0)
 for p in itertools.permutations(range(n)):
  inversions=sum(p[i]>p[j] for i in range(n) for j in range(i+1,n)); term=F((-1)**inversions)
  for i in range(n):term*=A[i][p[i]]
  total+=term
 return total
def all_minors(A):
 return [determinant([[A[i][j] for j in subset] for i in subset]) for n in range(1,len(A)+1) for subset in itertools.combinations(range(len(A)),n)]
def q(A,v):return sum(v[i]*A[i][j]*v[j] for i in range(len(v)) for j in range(len(v)))
def shift(A,b,sign=1):return [[sign*A[i][j]+(b if i==j else 0) for j in range(3)] for i in range(3)]
C=[[F(1) if i==j else F(4,5) for j in range(3)] for i in range(3)]; bad=[row[:] for row in C]; bad[0][1]=bad[1][0]=F(0)
assert min(all_minors(C))>0 and determinant(C)==F(13,125)
assert determinant(bad)==F(-7,25) and q(bad,[1,1,-1])==F(-1,5)
assert all(abs(bad[i][j])<=abs(C[i][j]) for i in range(3) for j in range(3))
assert max(sum(abs(x) for x in row) for row in C)==max(sum(abs(x) for x in row) for row in bad)==F(13,5)
count=0
for center in range(3):
 leaves=[i for i in range(3) if i!=center]
 for t,u in itertools.product([F(0),F(1,4),F(1,2),F(3,4),F(1)],repeat=2):
  M=[[F(1) if i==j else F(0) for j in range(3)] for i in range(3)]
  M[center][leaves[0]]=M[leaves[0]][center]=t; M[center][leaves[1]]=M[leaves[1]][center]=u
  M[leaves[0]][leaves[1]]=M[leaves[1]][leaves[0]]=min(t,u)
  A=[[C[i][j]*M[i][j] for j in range(3)] for i in range(3)]
  assert min(all_minors(M))>=0
  assert min(all_minors(shift(A,F(-1,5))))>=0
  assert min(all_minors(shift(A,F(13,5),-1)))>=0
  count+=1
out={'initial_covariance':[[str(x) for x in row] for row in C],'entrywise_contracted_matrix':[[str(x) for x in row] for row in bad],'initial_all_principal_minors':[str(x) for x in all_minors(C)],'initial_determinant':str(determinant(C)),'contracted_determinant':str(determinant(bad)),'negative_quadratic_witness':{'vector':[1,1,-1],'value':str(q(bad,[1,1,-1]))},'absolute_scalar_row_sum_both':'13/5','real_min_path_forest_patterns_checked':count,'method':'Exact rational arithmetic;3node finite sanity grid for valid forest patterns, exact counterexample for invalid generic implication','refuted_claim':'Entrywise contraction with unchanged diagonal and bounded row sum automatically preserves covariance positivity','not_refuted':'The actual published CMP116 construction, whose tags have separate operator/analytic bounds, or real PSD min-path forest interpolation. No source construction is identified with this bad matrix.'}
(W/'INTERPOLATION-WITNESS1630.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n'); print(json.dumps({'det_before':out['initial_determinant'],'det_after':out['contracted_determinant'],'negative_quadratic':out['negative_quadratic_witness'],'forest_grid_passed':count}))
