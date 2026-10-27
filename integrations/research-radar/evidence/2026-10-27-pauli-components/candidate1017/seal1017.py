from pathlib import Path
import datetime,hashlib,json,urllib.request,shutil
P=Path(__file__).parent;B=Path(r'D:\Proyectos\airr-investigacion');D=B/P.name
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
# Verify the newly completed audit before using it as evidence, including
# complete C/D payload lists, not just the self-reported verdict.
A=B/'2026-10-27_pauli1012-audit';AC=Path(r'C:\Trabajo\airr')/A.name
m=json.loads((A/'MANIFEST1012.json').read_text())
for x in m['files']:
 for root in [A,AC]:
  f=root/x['path'];assert f.stat().st_size==x['bytes'] and sha(f)==x['sha256']
names=lambda root:sorted(f.relative_to(root).as_posix() for f in root.rglob('*') if f.is_file())
assert names(A)==names(AC)
for rel in names(A):assert sha(A/rel)==sha(AC/rel)
assert sha(A/'AUDIT1012.txt')=='000a862f2fad520fb41135a44f0c06570e576859fe84c7982b951fecbf866797'
assert sha(A/'verdict1012.json')=='1a905f9673fe773a28cdc373f4fd5329121bf3fb65742fd1247e5aeffbdc39f5'
url='https://arxiv.org/html/2608.19685v1'
with urllib.request.urlopen(url,timeout=45) as r:b=r.read();etag=r.headers.get('ETag')
out=dict(utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='Directed primary comparison, not exhaustive; no foreign fulltext retained',source=dict(url=url,version='v1',sha256=hashlib.sha256(b).hexdigest(),bytes=len(b),etag=etag,depth='Abstract, introduction,Theorem1.2/Corollary1.3 and selected3.5Proposition3.11 statement/proof read; no full proof audit',comparison='Gao-Zhao relative-entropy-to-conditional-expectation and index-witness methods are prior. Our different candidate optimizes normalized SLD/chi_min/triangular ratios over two equal-reference states with individual actual-marginal order constraints. Selected passages do not alone prove or disprove covering prior art. No worldwide novelty certificate.'),reused_frontier_inventory=dict(file=str(B/'2026-10-27_profile1011/READINGS1011.json'),sha256=sha(B/'2026-10-27_profile1011/READINGS1011.json'),depth='Prior current-day8-endpoint inventory only; not newly read proofs'),audit1012=dict(status='terminal, read fully and all C/D payloads verified',files=len(names(A)),manifest_payloads=len(m['files']),manifest_sha256=sha(A/'MANIFEST1012.json'),report_sha256=sha(A/'AUDIT1012.txt'),does_not_cover1017=True),search_limits='Broad unqualified search produced irrelevant biology and secondary sites; none used as mathematical evidence. Primary arXiv restriction found already-known Gao-Zhao comparator. No absence-of-results novelty argument.',scores=None)
(P/'READINGS1017.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
entries=[dict(path=f.relative_to(P).as_posix(),bytes=f.stat().st_size,sha256=sha(f)) for f in sorted(P.rglob('*')) if f.is_file() and f.name!='MANIFEST1017.json']
(P/'MANIFEST1017.json').write_text(json.dumps(dict(scope='Unaudited parent general-d controlled-order candidate; no manuscript score or public release',files=entries),indent=2)+'\n',encoding='utf-8')
D.mkdir(exist_ok=True)
for f in P.rglob('*'):
 if f.is_file():
  q=D/f.relative_to(P);q.parent.mkdir(parents=True,exist_ok=True)
  if q.exists():assert q.read_bytes()==f.read_bytes(),'Do not overwrite a frozen archive'
  else:shutil.copyfile(f,q)
  assert sha(q)==sha(f)
print(json.dumps(dict(manifest_sha256=sha(P/'MANIFEST1017.json'),payloads=len(entries),C_D_identical=True,audit1012_C_D_verified=len(names(A)))))
