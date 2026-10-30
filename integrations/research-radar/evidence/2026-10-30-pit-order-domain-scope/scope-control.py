"""One exact algebraic scope control; no source implementation or search."""
from pathlib import Path
import argparse,json,hashlib,sys
import sympy as s
assert __debug__
R=s.Rational
N=s.Matrix([[0,1,0],[0,0,1],[0,0,0]])
A=(N+N.H)/2;B=(N-N.H)/(2*s.I)
grid=[0,1,2]
lift=s.diag(*[A+t*B for t in grid])/3
assert lift==lift.H and N==A+s.I*B and N**3==s.zeros(3)
def flatten(M):return s.Matrix(list(M))
old_rank=s.Matrix.hstack(*[flatten(N**k) for k in range(3)]).rank()
lift_rank=s.Matrix.hstack(*[flatten(lift**k) for k in range(3)]).rank()
assert old_rank==lift_rank==3
row_bounds=[sum(abs(s.re(v))+abs(s.im(v)) for v in lift.row(i)) for i in range(lift.rows)]
assert max(row_bounds)<=1
H=s.diag(0,R(1,2),1);X=R(1,4)*s.eye(3)
def p(M):return M*M-R(1,2)*M+R(1,32)*s.eye(M.rows)
query=p(H);negative=p(X)
assert list(query.diagonal())==[R(1,32),R(1,32),R(17,32)]
assert negative==-R(1,32)*s.eye(3)
assert s.Matrix.hstack(*[flatten(H**k) for k in range(3)]).rank()==3
old_den=s.eye(3)-18*N*N;new_den=s.eye(lift.rows)-18*lift*lift
old_det=s.factor(old_den.det());new_det=s.factor(new_den.det())
assert old_det==1 and new_det==0
assert (s.eye(3)-18*(A/3)**2).det()==0
record={'status':'all_exact_scope_controls_passed','python':sys.version,'sympy':s.__version__,'assertions_enabled':__debug__,'field':'Q(i), exact symbolic arithmetic; no floating arithmetic or random fixtures','degree_bound':2,'old_nilpotent_query':[[str(v) for v in N.row(i)] for i in range(3)],'hermitian_lift':{'formula':'diag(A+t*B for t=0,1,2)/3; A=(N+N*)/2; B=(N-N*)/(2i)','order':lift.rows,'hermitian':lift==lift.H,'max_exact_row_absolute_upper_bound':str(max(row_bounds)),'old_monomial_rank':old_rank,'lift_monomial_rank':lift_rank},'positive_contraction_query':{'eigenvalues':['0','1/2','1'],'degree_le_2_monomial_rank':3,'polynomial':'x^2-x/2+1/32','affine_abp_edges':[['0','1','x'],['1','2','x-1/2'],['0','2','1/32']],'p_at_query_eigenvalues':[str(v) for v in query.diagonal()],'negative_target':'X=I_3/4','p_at_target_eigenvalues':[str(v) for v in negative.diagonal()]},'origin_domain_control':{'rational_expression':'(1-18*x^2)^(-1)','denominator_at_zero':'1','determinant_at_original_N':str(old_det),'determinant_at_hermitian_lift':str(new_det),'singular_block':'t=0, A/3'},'scope':'Refutes only generic direct order-reflection and automatic origin-domain preservation by this optional Hermitian lift. Not a counterexample to Lu, an oracle lower bound with arbitrary postprocessing, or a counterexample to the actual QSS inequality. The general polynomial lift is a separate unreviewed hand derivation, not proved by these finite controls.','source_script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'new_model_review':False,'new_grade':None,'new_paper':False,'formal_lean_claim':False}
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,required=True);args=parser.parse_args()
args.output.write_bytes((json.dumps(record,indent=2)+'\n').encode())
print(json.dumps({'status':record['status'],'identity_ranks':[old_rank,lift_rank],'positive_at_query':[str(v) for v in query.diagonal()],'negative_at_admissible_target':[str(v) for v in negative.diagonal()],'denominator_determinants':[str(old_det),str(new_det)]}))
