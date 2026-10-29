from pathlib import Path
from fractions import Fraction as F
import json, hashlib, urllib.request, datetime, shutil

C=Path(__file__).parent
R=Path(r'C:\Trabajo\physmath-knowledge-tree\weyl-stability-20261024')
I=R/'integrations/research-radar'
E=I/'evidence/2026-10-29-modular-preparation'
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
sha=lambda b:hashlib.sha256(b).hexdigest()
def dump(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')

# Retrieve before drafting. No canonical graph mutation is made.
index=json.loads((R/'graph/index.json').read_bytes())
nodes=json.loads((R/index['canonical_files']['nodes']).read_bytes())
edges=json.loads((R/index['canonical_files']['edges']).read_bytes())
seeds={'domain.algebraic_quantum_field_theory','domain.quantum_information_theory'}
incident=[e for e in edges if e.get('source') in seeds or e.get('target') in seeds]
ids=seeds|{e[k] for e in incident for k in ['source','target']}
dump(C/'SUBGRAPH1216.json',{'seeds':sorted(seeds),'nodes':[n for n in nodes if n['id'] in ids],'edges':incident,'canonical_graph_modified':False})

sources=[]
for sid,url,first,version,read in [
 ('modular-cost-2026','https://arxiv.org/html/2605.18640v1','2026-05-18','v1','Proposition1 proof, Corollary2 proof, geometry SecIV.2 eq22 and assumptions read; core algebraic step checked, not full paper audit'),
 ('chm-ball-2011','https://arxiv.org/html/1102.0440v2','2011-02-02','v2','Sec2.1 reduced-density setup and eq22 selected; not full holographic derivation'),
 ('casini-huerta-2022','https://inspirehep.net/files/19a199a6a26b5847549045339dba86ee','2022-01-31','arXiv2201.13310v2','Sec3.6 eq3.31-3.32 full versus reduced modular Hamiltonian selected; not full lecture audit'),
 ('witten-entanglement-2018','https://arxiv.org/html/1803.04993v3','2018-03-13','v3','Selected Reeh-Schlieder and finite-dimensional modular discussion'),
 ('ber-kenneth-reznik-2014','https://arxiv.org/html/1405.0063v5','2014-05-01','v5','Selected probability, infidelity and noise SecV-VI; not full proof audit')]:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'AIRR-Bounded-Audit/1.0'}),timeout=30) as response:b=response.read()
  sources.append({'id':sid,'url':url,'first_preprint':first,'version':version,'read_scope':read,'observed_at':now,'transport_sha256':sha(b),'transport_bytes':len(b),'redistributed_fulltext':False})
dump(C/'PRIMARY1216.json',sources)

# Exact calibration of a standard finite-dimensional distinction, not QFT certification.
cases=[]
for d in range(2,9):
  total=sum(range(1,d+1));lam=[F(k,total) for k in range(1,d+1)]
  defect=sum(x*(1-x)**2 for x in lam)
  assert defect>0 # (Delta - rho_A tensor I) Omega is nonzero; Delta Omega=Omega.
  for i in range(d):
    for j in range(d):
      p=lam[j]; delta_norm2=lam[i]/lam[j]
      assert p*delta_norm2==lam[i]<=1
      cases.append({'d':d,'i':i,'j':j,'success_probability':str(p),'modular_norm_squared_of_normalized_target':str(delta_norm2),'product':str(p*delta_norm2),'reduced_vs_full_defect_squared':str(defect)})
dump(C/'FINITE1216.json',{'scope':'Known finite-dimensional calibration; no novelty or continuum proof claimed','cases':cases,'count':len(cases),'all_pass':True})

text='''Resource-constrained preparation: prior-art and modular-generator boundary

Confidence: literature for cited statements; own elementary derivation for the finite control; speculative only for any remaining resource-constrained extension. No new paper or grade.

Mechanism and prior art. Reeh-Schlieder cyclicity is not efficient state preparation. Ber-Kenneth-Reznik already relate fidelity, separation and postselection probability through superoscillatory controls and discuss severe noise sensitivity. Blanco-Romero/Almenares Mendoza2605.18640v1 directly addresses modular lower bounds on local preparation. Thus the generic question from1215 is NOT a presently established originality gap. First preprint18May2026, not the24August HTML rendering dateline and not newly published today.

Core step checked. For bounded A in a standard local algebra and xi=A Omega, Tomita polar decomposition gives ||Delta^(1/2)xi||=||A*Omega||<=||A||. For a local contraction B and normalized conditional xi, p||Delta^(1/2)xi||^2<=1. With finite modular expectation, Jensen gives p<=exp(<K>xi), capped by1, where K=-log Delta. This is known modular structure repackaged as a cost; it is not ordinary positive Minkowski energy.

Geometric boundary requiring correction/clarification. The2026 note defines K=-log Delta on the full vacuum Hilbert space but its ball eq22 uses only the interior CHM integral and says it equals that full operator. The CHM setup concerns the reduced density operator. Casini-Huerta Sec3.6 eq3.31 explicitly distinguishes full Khat=K_A tensor I-I tensor K_Ac; Khat Omega=0. For a vacuum CFT ball the full generator needs the complementary contribution (equivalently the signed conformal weight extended over the full slice), not just the interior integral. Therefore do not transfer the note's interior-only two-pulse example to the abstract modular bound without restoring the complement and checking domains/renormalization. This is a scoped derivation objection, not a commissioned referee report and not a refutation of Proposition1.

Exact finite control. For Omega=sum sqrt(lambda_j)|j,j>, the modular operator for A acting on the first factor is Delta=rho_A tensor rho_B^-1. Thus Delta Omega=Omega. Replacing it by exp(-K_A tensor I)=rho_A tensor I fails: squared norm of its difference on Omega is sum_j lambda_j(1-lambda_j)^2>0. For A=|i><j|, p=lambda_j and normalized target has modular norm squared=lambda_i/lambda_j, so p times this norm=lambda_i<=1. Exhausted dimensions2..8, all matrix units, with exact rational spectra lambda_j=(j+1)/sum(1..d). This is a finite analogy only; continuum local algebras are not thereby tensor factored.

Dictionary. Spiritual stillness maps only to stationarity for this limited analogy; potential maps to approximability, excitation count or heralded reachability, which are distinct resources. Preserve local causality, postselection accounting and the target dependence. Lose any claim of infinite useful energy, divine ontology, arbitrary human imagination or proof by a geometric drawing.

Falsifier and abandonment. Abandon a generic preparation-cost paper: direct antecedents exist. A future candidate needs an explicit control class, target, full modular generator, finite-error metric and noise/resource budget, and a bound or attainable protocol not already implied by the cited works. Norm approximation alone does not control expectation of an unbounded generator; any robustness extension must supply spectral/energy control. Failure to state those assumptions, a known covering bound, or an explicit violating state defeats the candidate.

Minimal formal target: finite-dimensional diagonal standard form identity and matrix-unit calibration; no Lean proof claimed. No external formal dependency changed. No manuscript assessment, reviewer identity or score inferred.
'''
(C/'SYNTHESIS1216.txt').write_text(text,encoding='utf-8',newline='\n')
E.mkdir(parents=True,exist_ok=True)
names=['SUBGRAPH1216.json','SOURCES1216.json','RECONCILIATION1216.json','PRIMARY1216.json','FINITE1216.json','SYNTHESIS1216.txt','integrate1216.py']
rows=[]
for name in names:
 b=(C/name).read_bytes(); (E/name).write_bytes(b);rows.append({'name':name,'sha256':sha(b)})
dump(E/'MANIFEST1216.json',{'utc':now,'scope':'Own synthesis, exact finite calibration and primary-source metadata only; no foreign corpus','files':rows,'formal':False,'manuscript':False,'score':None})
reg=json.loads((I/'registry.json').read_bytes())
reg['observed_on']='2026-10-29'
assert not any(s['id']=='modular-preparation-2026-scoped' for s in reg['source_cards'])
reg['source_cards'].append({'id':'modular-preparation-2026-scoped','title':'Modular Lower Bounds on Reeh-Schlieder State Preparation: scoped cost and generator audit','url':sources[0]['url'],'kind':'preprint','published_on':'2026-05-18','observed_on':'2026-10-29','reading_status':'selected_sections_read','evidence':'literature','claim':'Core Tomita/Jensen preparation bound checked; direct antecedent blocks generic preparation-cost novelty. Own synthesis records full-versus-reduced modular-generator objection in ball geometry.','limits':'Not complete QFT or manuscript audit; Proposition1 retained. Interior-only CHM integral must not be silently identified with full -logDelta. 203 finite rational controls are calibration, not formal or continuum certification.','reuse':'Metadata and own derivation only; no source text or user video redistributed.','anchors':['domain.algebraic_quantum_field_theory','domain.quantum_information_theory']})
reg['source_refresh']['followup1216']={'evidence':'integrations/research-radar/evidence/2026-10-29-modular-preparation/MANIFEST1216.json','scope':'Directed primary refresh; general preparation-cost direction already has antecedents; no candidate score or new manuscript. Geometry convention objection retained. Canonical graph unchanged.'}
dump(I/'registry.json',reg)
p=I/'README.md'
p.write_text(p.read_text(encoding='utf-8').rstrip()+'\n\n- [Modular preparation cost: prior art and full/reduced generator boundary](evidence/2026-10-29-modular-preparation/SYNTHESIS1216.txt): direct antecedents defeat generic novelty; exact finite calibration retains the complement contribution; no new paper or grade.\n',encoding='utf-8',newline='\n')
print(json.dumps({'sources':len(sources),'finite_cases':len(cases),'graph_modified':False,'evidence_files':len(rows)+1}))
