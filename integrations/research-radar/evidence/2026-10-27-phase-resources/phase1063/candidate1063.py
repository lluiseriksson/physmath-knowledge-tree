from pathlib import Path
import datetime,hashlib,json,shutil
import mpmath as mp
P=Path(r'C:\Trabajo\airr\2026-10-27_polynomial-phase1063');assert not P.exists();P.mkdir()
proof='''Candidate1063: dimension-scaled finite local phase with polynomial conditioning
27 October2026. Own derivation after1054; not in1057/1058 or manuscript1060. No assessment score or external technical audit. Uses exactly the1051 family supported within scope by1054, not a new preparation state. The classical Bell benchmark is prior machinery. No optimality, practical advantage or priority claim.

For every integer d>=2 choose e=1/d, theta=1-1/d, phi=pi and lambda=-1/(d²-1). Let a=d-1, q=a+e², s=vv*/q, B=I_d/d tensor r and s_theta=(1-theta)B+theta s as in1051. H=diag(0,1,...,1) has fixed norm and spectral diameter1. Set rho=exp(-i pi H)s_theta exp(i pi H). These are explicit faithful equal-reference states for every d, with R=d; no within-d perturbation limit is used. Their exact actual order is K_d=1+(d²-1)theta=d²-d+1/d.

Proposed asymptotic conclusions, all as integers d->infinity:
  d * [D_U(Nrho||Ns_theta)/D_U(rho||s_theta)] -> 1/10;
  d³ D_U(rho||s_theta)/log(d) ->20;
  cond(s_theta)/d^5 ->1;
  d^(3/2) * (1/2)||rho-s_theta||_1 ->2.
The exact coefficient of the entire common-Bell-diagonal class is1/(d²-1), hence the ratio to that benchmark divided by d tends to1/10. Thus eventually these finite pairs beat that whole class by an unbounded dimension-dependent factor, while conditioning grows polynomially and information decays polynomially times log(d). This is still vanishing information, not a nonvanishing-information or laboratory robustness theorem. The earlier abstract coefficient lower does not alone prove these uniform dimension statements: its limits held d fixed and were ordered differently.

Derivation. Use the exact subnormalized W_p from1051 and its eigenvalues w_+(p)>=w_-(p)>0. At p=theta, the rational trace/determinant formulas give
 Tr W_theta ->1,  d^5 det W_theta ->1.
Therefore w_+(theta)->1 and d^5 w_-(theta)->1. It follows that ell(W_theta)/log(d)->5. At p=lambda theta, the same rational formulas give
 d³ Tr W_(lambda theta)->2,  d^7 det W_(lambda theta)->1.
Since det/(Tr W)^2=O(1/d), the larger eigenvalue obeys d³w_+->2, and the smaller obeys d^4w_-->1/2. Their logarithmic ratio is log(d)+log(4)+o(1), and their difference is (2+o(1))/d³. Thus ell(W_(lambda theta))/(d³ log(d))->1/2. Also d^4 lambda²->1. The exact finite-phase identity1054 now gives d*retention->(1/2)/5=1/10. All eigenvalue asymptotics use positive rational expressions and a simple separated-root limit, not a numerical spectral fit.

For input information, write c_theta=theta e sqrt(a)/q. Then d³ c_theta²->1. Exact phase-pi divergence is4c_theta²ell(W_theta), proving the constant20. Trace distance is exactly2|c_theta|. For conditioning, B has smallest eigenvalue e²/(dq), and s_theta>=(1-theta)B. Each |i,0> with i!=0 is orthogonal to v and is an eigenvector of that minimum replacement eigenvalue; hence lambda_min(s_theta)=(1-theta)e²/(dq) exactly and d^5lambda_min->1. Since theta<=lambda_max(s_theta)<=1, lambda_max->1, which proves the condition number limit. Unitary conjugation preserves it.

Scope: this is a quantitative diagonal-sequence refinement of the already-audited phase family. It eliminates dependence on arbitrarily tiny independent perturbation parameters for a growing-dimensional separation. It does not improve the known fixed-budget profile, prove reference minimality, bound all commuting/separable pairs, establish unrestricted BKM optimality or actual MI/capacity, or compare absolute estimation precision. States get closer as d grows. The dimension, reference size, order budget, condition number and absolute information all remain explicit.

Falsifiers/abandonment: a wrong rational scaling of the two traces/determinants, missing minimum eigenmode, failure of the exact1054 identity under the dimension-dependent substitutions, or covering prior work with these same quantifiers. The fixed diagnostic table is not a proof, interval certificate or computational campaign. A technical audit must reconstruct the limits and prior-art scope before manuscript incorporation. Preserve all finite d that fail to beat Bell; do not select a favorable subsequence or assign a target grade.
'''
(P/'PROOF1063.txt').write_text(proof,encoding='utf-8')
mp.mp.dps=100
rows=[]
for d in [2,3,4,8,16,32,64,128,256,1024,65536]:
 dd=mp.mpf(d);e=1/dd;th=1-1/dd;lam=-1/(dd*dd-1);a=dd-1;q=a+e*e
 def stats(p):
  A=1+(dd*a-1)*p;F=1+a*p
  tr=(A+F*e*e)/(dd*q)
  det=e*e*(1-p)*(1+(dd*dd-1)*p)/(dd*dd*q*q)
  gap=mp.sqrt(tr*tr-4*det);hi=(tr+gap)/2;lo=det/hi
  ell=mp.log(hi/lo)/(hi-lo)
  return tr,det,hi,lo,ell
 T=stats(th);O=stats(lam*th);ratio=lam*lam*O[4]/T[4];csq=th*th*e*e*a/(q*q)
 du=4*csq*T[4];minimum=(1-th)*e*e/(dd*q)
 # Full state max is active-block hi: other Schmidt modes have (1-th)/(dq), and other coordinates no larger.
 assert T[2] >= (1-th)/(dd*q)
 condition=T[2]/minimum;bell=1/(dd*dd-1)
 rows.append(dict(d=d,retention=str(ratio),bell=str(bell),beats_bell=bool(ratio>bell),d_times_retention=str(dd*ratio),scaled_input=str(dd**3*du/mp.log(dd)),scaled_condition=str(condition/dd**5),scaled_distance=str(dd**mp.mpf('1.5')*2*mp.sqrt(csq)),input_trace=str(T[0]),scaled_input_det=str(dd**5*T[1]),scaled_output_trace=str(dd**3*O[0]),scaled_output_det=str(dd**7*O[1])))
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='fixed high-precision scalar diagnostics, not interval/formal proof or reproducible campaign',precision=100,rows=rows,failures=[],score=None)
(P/'CHECK1063.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
shutil.copyfile(__file__,P/'candidate1063.py')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
(P/'MANIFEST1063.json').write_text(json.dumps(dict(utc=out['utc'],scope='candidate not externally audited; self excluded',files=[dict(path=p.name,sha256=sha(p),bytes=p.stat().st_size) for p in sorted(P.iterdir()) if p.is_file()]),indent=2)+'\n',encoding='utf-8')
D=Path(r'D:\Proyectos\airr-investigacion')/P.name;assert not D.exists();shutil.copytree(P,D)
assert {p.name:sha(p) for p in P.iterdir()}=={p.name:sha(p) for p in D.iterdir()}
print(json.dumps(dict(path=str(D),cases=len(rows),adverse_dimensions=[x['d'] for x in rows if not x['beats_bell']],last_scaled_retention=rows[-1]['d_times_retention'],last_scaled_input=rows[-1]['scaled_input'],last_scaled_condition=rows[-1]['scaled_condition'],audit_pending=True)))
