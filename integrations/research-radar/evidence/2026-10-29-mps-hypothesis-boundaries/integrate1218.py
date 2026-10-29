from pathlib import Path
from fractions import Fraction as F
import json,hashlib,datetime,urllib.request
import sympy as sp
C=Path(__file__).parent;R=Path(r'C:\Trabajo\physmath-knowledge-tree\weyl-stability-20261024');I=R/'integrations/research-radar'
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
sha=lambda b:hashlib.sha256(b).hexdigest()
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
idx=json.loads((R/'graph/index.json').read_bytes());nodes=json.loads((R/idx['canonical_files']['nodes']).read_bytes());edges=json.loads((R/idx['canonical_files']['edges']).read_bytes())
seeds={'domain.quantum_information_theory','domain.probability_stochastics','domain.functional_analysis'}
incident=[e for e in edges if e.get('source') in seeds or e.get('target') in seeds];ids=seeds|{e[k] for e in incident for k in ['source','target']}
save(C/'SUBGRAPH1218.json',{'seeds':sorted(seeds),'nodes':[n for n in nodes if n['id'] in ids],'edges':incident,'graph_modified':False})

eye=sp.eye(2);X=sp.Matrix([[0,1],[1,0]]);Z=sp.diag(1,-1)
def vec(a):return sp.Matrix([a[i,j] for j in range(2) for i in range(2)])
us=[eye,X,Z]
J=sum((vec(u)*vec(u).T/3 for u in us),sp.zeros(4))
v=sp.Matrix([0,1,-1,0])
assert J*v==sp.zeros(4,1) and J.rank()==3
assert sum((u.T*u/3 for u in us),sp.zeros(2))==eye
stack=sp.Matrix.vstack(*us)
assert stack.rank()==2 # no nonzero common right kernel, despite singular Choi
products=[u*w for u in us for w in us]
J2=sum((vec(u)*vec(u).T/9 for u in products),sp.zeros(4))
assert J2.rank()==4 and min(J2.eigenvals())==sp.Rational(4,9)
assert sp.Matrix.hstack(*(vec(u) for u in products)).rank()==4
save(C/'PAULI1218.json',{'scope':'Exact known Pauli-channel control; not a new theorem or counterexample to eventual ergodic equivalence','kraus':'I/sqrt3,X/sqrt3,Z/sqrt3','choi_rank_one_step':3,'common_right_kernel_dimension':int(2-stack.rank()),'choi_kernel_vector':[int(a) for a in v],'choi_rank_two_steps':4,'smallest_unnormalized_choi_eigenvalue_two_steps':str(min(J2.eigenvals())),'ordinary_Bloch_contraction':'1/3','minimum_pure_output_eigenvalue':'1/3','positive_CP_replacer_coefficient_one_step':'0','positive_CP_replacer_coefficient_two_steps':'8/9','all_assertions_pass':True})

primary=[]
for sid,url,first,version,scope in [
 ('ekblad-wielandt-2025-scoped','https://arxiv.org/html/2504.21638v3','2025-04-30','v3, revised2025-12-11','Abstract, main statements and definitions read; no complete proof audit. Journal issue2026-02-15 is not first preprint.'),
 ('ergodic-mps-gap-2026-scoped','https://arxiv.org/html/2607.01446v1','2026-07-01','v1','Selected Sec1.1,1.3 Problem1.1 and AppendixA.9 argument read. Full40page proof not audited; a specific Choi-kernel step requires clarification.')]:
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'AIRR-Bounded-Audit/1.0'}),timeout=30) as response:b=response.read()
 primary.append({'id':sid,'url':url,'first_preprint':first,'version':version,'scope_read':scope,'transport_sha256':sha(b),'transport_bytes':len(b),'observed_at':now,'fulltext_redistributed':False})
save(C/'PRIMARY1218.json',primary)

note='''Injectivity, strict positivity and uniform disorder: a hypothesis audit

Layers: literature for cited statements; own exact algebraic calibration and conditional Choi repair; speculative for any gap-classification extension. No new manuscript, review score or formal proof.

New-to-index, not newly published: Ekblad2504.21638 first30April2025, selectedv3 revised11December2025, journal issue15February2026. Its index bound2(D-1)^2 for primitive unital Schwarz maps does not need trace preservation; its2-positive corollary also drops unitality. Main statements/definitions only read, not a full proof audit.

Ekblad-Moreno-Nadales-Roon-Schenker2607.01446v1 first1July2026 investigates disordered matrix-product-state parent Hamiltonians. Selected results retain the worst-case onset length and the smallest stationary-state eigenvalues in a gap lower bound. Sec1.3 Problem1.1 asks to classify gapped injective ergodic MPS and, with stationary states uniformly away from zero, whether unbounded onset is the only obstruction. This is an explicit source problem, not a new conjecture or a solved problem here.

Dictionary: transfer apparatus -> local CP maps; injectivity -> full span of Kraus words/strictly positive Choi matrix for the corresponding block; ordinary strict positivity -> each nonzero positive input has positive-definite output; uniform onset -> a common scale after which mixing is visible at every site. Preserve the distinction between existence of a finite block and a bound uniform in site, realization and target. No channel trace contraction alone is substituted for a parent-Hamiltonian gap or trajectory-law mixing.

Exact control. Let Phi(a)=(a+XaX+ZaZ)/3. This unital TP channel maps the Bloch vector to(x,-y,z)/3, so every pure output has eigenvalues1/3 and2/3: it is already strictly positive. But its unnormalized Choi matrix has rank3, with antisymmetric maximally entangled kernel vector. Its Kraus span is only3 dimensional and Gamma for the one-site3-letter tensor cannot be injective from M2. No common right kernel exists because sum K* K=I. At two steps the Kraus span and Choi matrix have rank4; the smallest Choi eigenvalue is4/9 and the positive CP-replacer coefficient is8/9, while the coefficient at one step is zero. This is a known calibration; it does not refute eventual injectivity under the paper's ergodic hypotheses.

Scoped proof concern. In AppendixA.9, the inference from non-full Kraus-word span to a nonzero projection p annihilated on the right by every Kraus word is not justified by Choi singularity. Indeed any TP Kraus family has no nonzero common right kernel. The Pauli control demonstrates the distinction. This does not refute PropositionA.9: the later mixing and recurrence assumptions supply a direct possible repair, below. No whole-manuscript referee judgment is asserted.

Conditional repair using a general entangled Choi kernel vector. Suppose the cited channel-cocycle mixing estimate ||Phi_n-R_Zn||_(1->1)<=C(omega) gamma^n holds, with gamma<1 and stationary faithful Z_n. For the unnormalized Choi convention J(Phi)=sum_ij |i><j| tensor Phi(|i><j|), the elementary block estimate gives ||J(Phi_n)-I tensor Z_n||_op<=d^2 C(omega) gamma^n. If J(Phi_n) is singular choose any normalized v_n in its kernel. Then lambda_min(Z_n)<=<v_n|(I tensor Z_n)|v_n><=d^2 C(omega) gamma^n. Faithfulness and ergodic recurrence provide some delta>0 with lambda_min(Z_n)>=delta recurrently on a set of positive probability, contradicting singularity for every n. This retains the full Choi witness instead of forcing a product/common-kernel witness. It relies on the source's quoted mixing/faithfulness/recurrence hypotheses and does not audit those antecedents or prove a deterministic uniform block length.

Falsifier/abandonment: reject any proposed same-block equality between strict positivity and injectivity (Pauli control), any uniform parent gap inferred solely from a typical mixing exponent (source already has gapless examples), or any claimed new theorem already contained in Wielandt/EMPS results. A remaining candidate must distinguish bounded injectivity length, bounded onset and stationary conditioning; solve or refute a specified implication in an explicit stationary model. Audit the actual local parent projectors and rare-region statistics before numerical finite-chain gaps are treated as evidence of an infinite-volume gap.

Minimal formal target: finite Pauli ranks and no-common-right-kernel implication; no Lean declaration added. The29-case finite-error modular boundary from1217 is batched alongside this note as another known warning against dropping an unbounded target variable. Neither calibration is a standalone paper. No formal dependency changed.
'''
(C/'SYNTHESIS1218.txt').write_text(note,encoding='utf-8',newline='\n')
E=I/'evidence/2026-10-29-mps-hypothesis-boundaries';E.mkdir(parents=True,exist_ok=True)
names=['SUBGRAPH1218.json','SOURCES1218.json','RECONCILIATION1218.json','PRIMARY1218.json','PAULI1218.json','SYNTHESIS1218.txt','integrate1218.py']
rows=[]
for name in names:
 b=(C/name).read_bytes();normalized=b.replace(b'\r\n',b'\n');(E/name).write_bytes(normalized);rows.append({'name':name,'sha256':sha(normalized),'transport_sha256':sha(b)})
old=Path(r'D:\Proyectos\airr-investigacion\2026-10-29_robustness1217')
for name in ['DERIVATION1217.txt','ROBUSTNESS1217.json','PRIMARY1217.json','check1217.py']:
 b=(old/name).read_bytes();(E/name).write_bytes(b);rows.append({'name':name,'sha256':sha(b)})
save(E/'MANIFEST1218.json',{'utc':now,'scope':'Own synthesis and exact calibration plus primary metadata only; no foreign corpus','files':rows,'new_paper':False,'new_score':False,'formal':False})
reg=json.loads((I/'registry.json').read_bytes());reg['observed_on']='2026-10-29'
for row,title,claim,limits in [
 (primary[0],'A note on the quantum Wielandt inequality','Primitive unital Schwarz maps admit index at most2(D-1)^2 without trace preservation; selected2-positive corollary also drops unitality.','Selected statements/definitions only; positivity index is not identical to same-block Choi full rank, uniform random onset or a many-body spectral gap.'),
 (primary[1],'Parent Hamiltonians of Ergodic Matrix Product States','Selected gap criterion retains worst-case onset and stationary conditioning; Problem1.1 explicitly asks for classification of gapped injective EMPS.','Selected sections and AppendixA.9 only; common-right-kernel inference flagged, with conditional Choi repair. The eventual equivalence is not refuted; no full-paper judgment or solved classification.')]:
  assert not any(s['id']==row['id'] for s in reg['source_cards'])
  reg['source_cards'].append({'id':row['id'],'title':title,'url':row['url'],'kind':'preprint','published_on':row['first_preprint'],'observed_on':'2026-10-29','reading_status':'selected_sections_read','evidence':'literature','claim':claim,'limits':limits,'reuse':'Metadata and own derivation only; no redistributed source full text, evaluation tasks or inferred training permission.','anchors':['domain.quantum_information_theory','domain.functional_analysis']})
reg['source_refresh']['followup1218']={'evidence':'integrations/research-radar/evidence/2026-10-29-mps-hypothesis-boundaries/MANIFEST1218.json','scope':'Directed refresh plus new-to-index 2025Wielandt/2026EMPS sources; same-block and uniformity shortcuts rejected; formal graph unchanged, no new manuscript or score.'}
save(I/'registry.json',reg)
p=I/'README.md';p.write_text(p.read_text(encoding='utf-8').rstrip()+'\n\n- [MPS injectivity and uniform-disorder boundaries](evidence/2026-10-29-mps-hypothesis-boundaries/SYNTHESIS1218.txt): source-defined gap-classification problem, strict positivity versus Choi injectivity control, conditional AppendixA.9 repair, and retained finite-error limits; no new paper or grade.\n',encoding='utf-8',newline='\n')
p=R/'tests/research-radar.test.mjs';s=p.read_text(encoding='utf-8');assert 'sources: 75,' in s;p.write_text(s.replace('sources: 75,','sources: 77,'),encoding='utf-8',newline='\n')
print(json.dumps({'source_cards':len(reg['source_cards']),'candidates':len(reg['candidates']),'canonical_graph_unchanged':True,'exact_pauli_control':'pass','new_manuscript':False}))
