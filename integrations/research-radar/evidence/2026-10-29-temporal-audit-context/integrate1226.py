from pathlib import Path
import json,hashlib,zipfile,datetime
C=Path(__file__).parent;R=Path(r'C:\Trabajo\physmath-knowledge-tree\weyl-stability-20261024');I=R/'integrations/research-radar';E=I/'evidence/2026-10-29-temporal-audit-context'
sha=lambda b:hashlib.sha256(b).hexdigest()
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
idx=json.loads((R/'graph/index.json').read_bytes());nodes=json.loads((R/idx['canonical_files']['nodes']).read_bytes());edges=json.loads((R/idx['canonical_files']['edges']).read_bytes());seeds={'domain.quantum_information_theory','domain.probability_stochastics'};incident=[e for e in edges if e.get('source') in seeds or e.get('target') in seeds];ids=seeds|{e[k] for e in incident for k in ['source','target']};save(C/'SUBGRAPH1226.json',{'seeds':sorted(seeds),'nodes':[n for n in nodes if n['id'] in ids],'edges':incident,'graph_modified':False})
review=Path(r'D:\Proyectos\airr-investigacion\2026-10-29_temporal1220\review');report=(review/'REVIEW1220.txt').read_bytes();verdict=(review/'verdict1220.json').read_bytes();assert sha(report)=='f059e7d612a72ef18d596d4307e716e01602d2afc551c4ff3003c7f897484545';assert sha(verdict)=='473aac9eae464c8be1b25abd0630bf9d8d0f39de15ef3908354b843256393c95'
E.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(E/'original-review1220.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
 z.writestr('REVIEW1220.txt',report);z.writestr('verdict1220.json',verdict)
rows=[]
def copy(p,name=None):
 b=p.read_bytes();normalized=b.replace(b'\r\n',b'\n');name=name or p.name;(E/name).write_bytes(normalized);rows.append({'name':name,'sha256':sha(normalized),'original_transport_sha256':sha(b)})
for name in ['REVIEW1220.txt','verdict1220.json']:copy(review/name)
for folder,names in [
 (C,['SUBGRAPH1226.json','SOURCES1226.json','RECONCILIATION1226.json','integrate1226.py']),
 (Path(r'D:\Proyectos\airr-investigacion\2026-10-29_followup1221'),['check_bistochastic1221.py','BISTOCHASTIC1221.json']),
 (Path(r'D:\Proyectos\airr-investigacion\2026-10-29_law1222'),['check_three_phase1222.py','THREE-PHASE1222.json']),
 (Path(r'D:\Proyectos\airr-investigacion\2026-10-29_reverse1223'),['check_reverse1223.py','REVERSE1223.json','STATEMENT1223.txt'])]:
 for name in names:copy(folder/name)
save(E/'MANIFEST1226.json',{'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'One unscored component audit and declared supplements, not an exact-PDF assessment of the later manuscript','original_report_sha256':sha(report),'original_verdict_sha256':sha(verdict),'original_zip_sha256':sha((E/'original-review1220.zip').read_bytes()),'zip_contents':'Exact original bytes; adjacent text projections normalize only CRLF to LF for repository formatting','files':rows,'requested_model':'gpt-6-astra','requested_effort':'xhigh','effective_model_effort_independence':'unverified/unattested; shared filesystem; supplements declared','input_source_pdf_sha256':'005628bd018d9850f79e26f6371995f8b9bd20c1e40205ccef7e588beb10f9dd','foreign_PDF_or_images_redistributed':False,'new_score':None,'formal_proof':False})
reg=json.loads((I/'registry.json').read_bytes());card=next(x for x in reg['source_cards'] if x['id']=='ergodic-mps-gap-2026-scoped');card['limits']='One scoped component audit1220 completed, with full report and declared supplements retained. Two-phase bistochastic control refutes same-point length equality; three-phase control also changes forward-pointwise-adjoint onset laws. RequestedAstraxhigh, effectiveidentity/effort/independenceunattested. No full source-paper judgment, full new-manuscript grade, parent-gap counterexample, novelty certificate or Lean proof. Later full PDF1225 is separately under review; no score inherited.'
reg['source_refresh']['followup1226']={'evidence':'integrations/research-radar/evidence/2026-10-29-temporal-audit-context/MANIFEST1226.json','scope':'Original full unscored component audit plus declared bistochastic and three-phase controls. Corrected inverse-base quantifiers retained. No new source-card count, candidate, grade or canonical graph change.'};save(I/'registry.json',reg)
p=I/'README.md';p.write_text(p.read_text(encoding='utf-8').rstrip()+'\n\n- [Temporal-adjoint component audit and declared supplements](evidence/2026-10-29-temporal-audit-context/MANIFEST1226.json): exact original report/verdict retained in ZIP with LF reading projections, no numerical component score or claim of verified reviewer independence; the later whole PDF is a distinct assessment.\n',encoding='utf-8',newline='\n')
print(json.dumps({'component_report_original_sha256':sha(report),'evidence_files':len(rows)+2,'source_cards':len(reg['source_cards']),'candidates':len(reg['candidates']),'no_graph_or_score_promotion':True}))
