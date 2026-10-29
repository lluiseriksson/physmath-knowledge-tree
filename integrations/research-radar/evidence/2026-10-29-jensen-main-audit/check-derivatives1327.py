"""Selected exact derivative-coefficient checks.
Uses immutable own chamber reconstruction; no sampled cone generators."""
from fractions import Fraction as F
from math import factorial
import pathlib,json,hashlib,traceback
P=pathlib.Path(__file__).resolve().parent
INPUT=(P/"RESULT1326.json")
EXPECTED="cc067bd12ea39cde9606ad6b6e06e4102555ad19b939ebf8d714cff6d687bea1"
pairs=[(i,j) for i in range(4) for j in range(4) if i!=j]
def prod_factorials(e):
 r=1
 for x in e:r*=factorial(x)
 return r
def main():
 b=INPUT.read_bytes();assert hashlib.sha256(b).hexdigest()==EXPECTED
 data=json.loads(b);assert data["status"]=="PASS_SELECTED_SIX_CHAMBER_FORMULA_RECONSTRUCTION"
 B=[[F((i==k)+(j==l)-4*((i,j)==(k,l)),2) for k,l in pairs] for i,j in pairs]
 records=[]
 for c in data["chambers"]:
  poly={tuple(t["exponents"]):F(t["coefficient"]) for t in c["polynomial"]}
  V={k:v for k,v in poly.items() if sum(k)==3}
  ell=[poly.get(tuple(int(i==j) for i in range(12)),F(0)) for j in range(12)]
  grad=[sum(v*k[j] for k,v in V.items()) for j in range(12)]
  assert grad==[1]*12
  matrices=[]
  for j in range(12):
   H=[]
   for i in range(12):
    row=[]
    for k in range(12):
     e=[0]*12
     for x in [j,i,k]:e[x]+=1
     row.append(V.get(tuple(e),F(0))*prod_factorials(e))
    H.append(row)
   assert all(H[i][k]==H[k][i] for i in range(12) for k in range(12))
   H1=[sum(r) for r in H]
   assert H1==[2*B[i][j] for i in range(12)] and sum(H1)==2
   # Raw units check algebra only; they need not be chamber generators.
   remainder=60*ell[j]-24
   lhs=[[3*H[i][k] for k in range(12)]+[12*B[i][j]] for i in range(12)]
   lhs.append([12*B[k][j] for k in range(12)]+[60*ell[j]])
   rhs=[[3*H[i][k] for k in range(12)]+[6*H1[i]] for i in range(12)]
   rhs.append([6*v for v in H1]+[12*sum(H1)+remainder])
   assert lhs==rhs
   matrices.append(dict(unit_direction=j,Hd_times_one=[str(x) for x in H1],
      one_Hd_one=str(sum(H1)),algebraic_remainder=str(remainder),
      remainder_sign_for_raw_unit_direction_not_assumed=True))
  records.append(dict(chamber=c["seed"],grad_V_at_K=[str(x) for x in grad],
    matrix_identities=matrices,identities_checked=12))
 expected=[
  [("Q",24,0),("L",120,1),("constant",360,2)],
  [("V",6,0),("Q",24,1),("L",60,2)],
  [("V",6,1),("Q",12,2)],
  [("V",3,2)],
  []]
 derived=[]
 for s in range(5):
  r=4-s;terms=[]
  for name,tdegree,adegree in [("V",3,3),("Q",4,2),("L",5,1),("constant",6,0)]:
   if tdegree>=r and adegree>=s:
    terms.append((name,factorial(tdegree)//factorial(tdegree-r),tdegree-r))
  assert terms==expected[s]
  derived.append(dict(shape_derivatives=s,t_derivatives=r,terms=terms))
 result=dict(status="PASS_SELECTED_LORENTZIAN_DERIVATIVE_ALGEBRA",
 input_sha256=EXPECTED,input_file=INPUT.name,script_sha256=hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),
 source_pdf_sha256="fefc3ad35c98e327cdabdf01b147393f561ba7d149f84c61c60f0e9304d11d9f",
 exact_arithmetic="Fraction; symbolic coefficient identities, no sampled cone directions",
 chambers=6,one_shape_three_t_13x13_identities=72,gradient_V_at_K_is_one_all_chambers=True,
 derivative_cases=derived,records=records,
 warning="Raw e_j check algebra only. Some raw-unit remainders are positive; chamber/gauge/sign constraints are indispensable for the actual negative-remainder argument.",
 not_checked_by_program=["all cone-generator signs","Lorentzian theorem hypotheses/analytic lifting","wall gluing","whole source theorem"],
 independent_referee=False,formal_proof=False,new_paper_or_score=False)
 with (P/"RESULT1327.json").open("w",encoding="utf-8",newline="\n") as f:json.dump(result,f,indent=2);f.write("\n")
 print(json.dumps({k:result[k] for k in ["status","chambers","one_shape_three_t_13x13_identities","gradient_V_at_K_is_one_all_chambers"]}))
if __name__=="__main__":
 try:main()
 except Exception:
  with (P/"FAILURE1327.json").open("w",encoding="utf-8",newline="\n") as f:json.dump(dict(status="FAILED_NO_RESULT_CLAIM",traceback=traceback.format_exc()),f,indent=2);f.write("\n")
  raise
