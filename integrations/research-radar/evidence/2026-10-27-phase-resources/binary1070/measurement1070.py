from pathlib import Path
from fractions import Fraction
import datetime,json,hashlib,shutil
P=Path(r'C:\Trabajo\airr\2026-10-27_binary-measurement1070');assert not P.exists();P.mkdir()
proof='''Candidate1070: an explicit binary measurement preserving the leading output divergence
27 October2026. Own post-start extension of1066; NOT an input to ongoing1068. No manuscript grade or external technical audit. Uses1051/1054 exact phase identity and1066 proposed dimension-scaled limits. Same evolving paper, not a separate publication. No experimental, sample-complexity, efficiency or global optimality claim.

Use t>0,beta>1,nu=beta+3, e²=t/d,theta=1-d^-beta,lambda=-1/(d²-1),phasepi from1066. Let W=W_(lambda theta) be the subnormalized output block in the orthonormal basis (uniform principal Schmidt vector,|0,0>). Write its positive eigenvalues h>l and off-diagonal b=lambda theta e sqrt(d-1)/q. Define an ambient rank-one projector Pi_-=(h I_2-W)/(h-l) on this active plane and zero on its orthogonal complement. This is the exact spectral projector of the output BASE block, not an optimizer restarted or chosen from observed data. The two-outcome joint measurement is{Pi_-,I-Pi_-}; it acts on A and R jointly and depends on the known d,t,beta and channel. It is not asserted to be local or LOCC, fixed across dimensions, easy to implement or tolerant of a fixed precision.

Under the output base sigma_out=N(s_theta), the rare-event probability is q0=l. Under rho_out=N(U_pi s_theta U_pi*), conjugation flips the block coherence. Thus
 p0=q0+4b²/(h-l),  exactly.
This follows by writing the off-diagonal entries of Pi_- as -b/(h-l) and taking the trace with the difference of the two blocks. Positivity and p0<1 follow from the ambient faithful density states/projector, not arbitrary normalization of W. The common complementary modes are included in outcomeI-Pi_-; renormalizing the active block would change the problem.

The measured divergence is the Bernoulli relative entropy
 D_bin=p0 log(p0/q0)+(1-p0)log[(1-p0)/(1-q0)].
From1066, d³h->1+t, d^(nu-1)l->t/(1+t), d6b²->t. Therefore d³p0->4t/(1+t), and log(p0/q0)/log(d)->nu-4. Since p0,q0->0 and q0/p0->0, the complementary logarithm is q0-p0+O(p0²+q0²); it is smaller than p0 log(d). Hence
 d³D_bin/log(d) ->4t(nu-4)/(1+t).
The exact quantum phase identity and1066 give the SAME leading constant for D_U(rho_out||sigma_out). Consequently D_bin/D_U(output)->1, and
 d * D_bin / D_U(input) -> (nu-4)/[(1+t)nu].

Comparison: every pair in a common orthonormal maximally entangled basis obeys the quantum Bell coefficient1/(d²-1); data processing makes this an upper also after ANY output measurement on those pairs. Therefore the proposed measured-output/quantum-input ratio for this specified phase family exceeds that entire benchmark by an asymptotically linear factor. The denominator here is QUANTUM input relative entropy. This does NOT claim a larger classical input-to-output coefficient for a common input/output measurement, or a free measurement advantage, or all commuting/separable states. It is a scoped observation that the output separation need not be erased by a particular two-outcome measurement.

Operational limits: the informative outcome is rare, p0=Theta(d^-3),q0=Theta(d^-(nu-1)); information per copy vanishes. The projector is joint, parameter-dependent and spectrally precise. Polynomial in d can be exponential in the number of qubits log(d). A hypothesis-testing interpretation of a specified Bernoulli experiment does not establish feasible laboratory resources, a noncircular entanglement witness, capacity or maximal absolute phase Fisher information. No sample-complexity theorem is asserted here. The use of the EXACT projector matters: replacing it by its limiting eigenvector can introduce errors dominating the rare probability at large nu.

Falsifiers/abandonment: wrong p0-q0 coefficient, orientation, projector positivity, missing complement mass, failure of1066 limits or covering prior work. Controls below keep cases where measured separation fails and distinguish shared integer arithmetic from independent verification. A later sequential audit must validate this candidate; do not silently add it to the frozen inputs of1068.
'''
(P/'PROOF1070.txt').write_text(proof,encoding='utf-8')
src=Path(r'D:\Proyectos\airr-investigacion\2026-10-27_local-phase1054-audit\integer_intervals1054.py');prefix=src.read_text().split('rows=[]')[0]
(P/'reused_integer_prefix1054.py').write_text(prefix,encoding='utf-8');ns={'__file__':str(P/'reused_integer_prefix1054.py')};exec(prefix,ns)
iv,saved,log=ns['iv'],ns['saved'],ns['log'];rows=[]
for t in [Fraction(1),Fraction(1,4)]:
 for beta in [2,4]:
  for d in [2,3,4,8,16,32,64,128,1024]:
   x=t/d;theta=1-Fraction(1,d**beta);lam=-Fraction(1,d*d-1);a=d-1;q=a+x;csq=theta*theta*x*a/(q*q)
   def plane(p):
    A=1+(d*a-1)*p;F=1+a*p;tr=(A+F*x)/(d*q);det=x*(1-p)*(1+(d*d-1)*p)/(d*d*q*q)
    delta=iv(tr*tr-4*det).sqrt();hi=(iv(tr)+delta)/2;lo=iv(det)/hi;ell=(log(hi)-log(lo))/delta
    return hi,lo,delta,ell
   hi,lo,delta,ell=plane(lam*theta);_,_,_,ellin=plane(theta)
   b2=iv(lam*lam*csq);p0=lo+4*b2/delta;q0=lo
   assert q0.l>0 and p0.l>q0.h and p0.h<ns['S']
   db=p0*log(p0/q0)+(1-p0)*log((1-p0)/(1-q0));duout=4*b2*ell;duin=4*iv(csq)*ellin
   gain=db/duin;gap=gain-iv(Fraction(1,d*d-1));fraction=db/duout
   # A directed interval may overlap1; reject only a proved DPI violation.
   assert db.l>0 and fraction.l<=ns['S']
   rows.append(dict(d=d,t=str(t),beta=beta,p0=saved(p0),q0=saved(q0),binary_D=saved(db),fraction_of_quantum_output=saved(fraction),measured_output_over_quantum_input=saved(gain),gap_over_Bell=saved(gap),positive=gap.l>0,negative=gap.h<0))
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='own fixed scalar certificates linked to analytic ambient projector; no actual experiment, external audit or sample-complexity theorem',method='768bit directed integer arithmetic reused1054, not independent implementation',source1054_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),cases=rows,adverse=[dict(d=r['d'],t=r['t'],beta=r['beta']) for r in rows if r['negative']],score=None)
(P/'CONTROL1070.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');shutil.copyfile(__file__,P/'measurement1070.py')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();(P/'MANIFEST1070.json').write_text(json.dumps(dict(utc=out['utc'],files=[dict(path=p.name,sha256=sha(p),bytes=p.stat().st_size) for p in sorted(P.iterdir()) if p.is_file()]),indent=2)+'\n',encoding='utf-8')
D=Path(r'D:\Proyectos\airr-investigacion')/P.name;assert not D.exists();shutil.copytree(P,D);assert {p.name:sha(p) for p in P.iterdir()}=={p.name:sha(p) for p in D.iterdir()}
print(json.dumps(dict(path=str(D),cases=len(rows),positive=sum(r['positive'] for r in rows),adverse=len(out['adverse']),audit_pending=True,not_part_of1068=True)))
