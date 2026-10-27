from pathlib import Path
import urllib.request,hashlib,json,datetime,io
from pypdf import PdfReader
C=Path(__file__).parent
sources=[('FreyCollinsGerlach','https://arxiv.org/pdf/1008.1557v1','1008.1557v1','Selected first two pages: channel/noise-parameter identification and ancilla setting. This is not the local-phase retention ratio. No full-paper proof audit.'),('ChapeauBlondeau','https://arxiv.org/pdf/1904.01904v1','1904.01904v1','Selected first two pages: noisy-qubit parameter estimation and entanglement are established prior. No claim of first local-phase advantage; this source was already recorded in earlier manuscript context. No whole-paper proof audit.')]
rows=[]
for id,url,version,summary in sources:
 with urllib.request.urlopen(url,timeout=40) as r:b=r.read();status=r.status
 reader=PdfReader(io.BytesIO(b));extracted=[reader.pages[i].extract_text() for i in range(min(2,len(reader.pages)))]
 assert all(t.strip() for t in extracted)
 # No primary-paper body is persisted. Only own scope and content hashes.
 rows.append(dict(id=id,url=url,version=version,status=status,sha256=hashlib.sha256(b).hexdigest(),bytes=len(b),pages=len(reader.pages),selected_pages_1based=[1,2],read_level='selected_statement_scope, not proof_audit',own_summary=summary,selected_text_extraction_sha256=hashlib.sha256('\n'.join(extracted).encode()).hexdigest()))
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),sources=rows,deduplicated_prior=['1904.01904 already bibliographyCB1047','1008.1557 surfaced by directed primary search; no generalized novelty claim'],exhaustive=False,foreign_corpus_saved=False,limits='The exact candidate1051 identities are own derivations awaiting audit. A covering phase/entropy theorem could make them routine or already known. The ratio is not absolute output QFI maximization. No identified source establishes absence of covering literature.')
(C/'READINGS1051.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print('Two primary PDF scopes and hashes recorded; foreign bodies discarded.')
