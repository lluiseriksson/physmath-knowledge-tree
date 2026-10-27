from pathlib import Path
import hashlib,json,datetime,shutil
P=Path(__file__).resolve().parent;D=Path(r'D:\Proyectos\airr-investigacion\2026-10-27_pauli1012-audit').resolve()
assert str(P)==r'C:\Trabajo\airr\2026-10-27_pauli1012-audit'
assert D.parent==Path(r'D:\Proyectos\airr-investigacion').resolve()
exclude={'MANIFEST1012.json','SHA256SUMS1012.txt','DELIVERY1012.json'}
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for f in P.rglob('*.json'):json.loads(f.read_text(encoding='utf-8'))
assert json.loads((P/'INPUT_FINAL1012.json').read_text())['all_43_payloads_and_4_manifests_unchanged']
assert all(x['exit_code']==0 for x in json.loads((P/'REPLAY1012.json').read_text())['jobs'])
assert json.loads((P/'SYMBOLIC1012.json').read_text())['all_passed']
assert not json.loads((P/'ADVERSARIAL1012.json').read_text())['incidents']
assert json.loads((P/'EXACT1012.json').read_text())['records'][-1]=={'name':'complete','passed':True}
files=[{'path':p.relative_to(P).as_posix(),'bytes':p.stat().st_size,'sha256':digest(p)} for p in sorted(P.rglob('*')) if p.is_file() and p.name not in exclude]
manifest={'audit':'1012','utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Own audit files and unchanged copies of user-supplied controls only; no foreign source corpus','excluded_from_self_manifest':sorted(exclude),'files':files,'payload_count':len(files),'payload_bytes':sum(f['bytes'] for f in files)}
(P/'MANIFEST1012.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
sumfiles=files+[{'path':'MANIFEST1012.json','sha256':digest(P/'MANIFEST1012.json')}]
(P/'SHA256SUMS1012.txt').write_text(''.join(x['sha256']+'  '+x['path']+'\n' for x in sumfiles),encoding='utf-8')
D.mkdir(exist_ok=True)
for src in sorted(P.rglob('*')):
 if not src.is_file() or src.name=='DELIVERY1012.json':continue
 target=D/src.relative_to(P);assert target.resolve().is_relative_to(D)
 target.parent.mkdir(exist_ok=True)
 if target.exists():assert digest(target)==digest(src),f'Refusing to replace different existing file: {target}'
 else:shutil.copy2(src,target)
receipt={'audit':'1012','utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'C':str(P),'D':str(D),'verified_payload_files':len(files),'verified_payload_bytes':sum(f['bytes'] for f in files),'manifest_sha256':digest(P/'MANIFEST1012.json'),'sha256sums_sha256':digest(P/'SHA256SUMS1012.txt'),'report_sha256':digest(P/'AUDIT1012.txt'),'verdict_sha256':digest(P/'verdict1012.json'),'all_inputs_unchanged':True,'note':'Receipt excluded from manifest to avoid self-reference; final complete trees compared after writing identical receipt.'}
raw=json.dumps(receipt,indent=2,ensure_ascii=False)+'\n'
for root in [P,D]:(root/'DELIVERY1012.json').write_text(raw,encoding='utf-8')
cf={p.relative_to(P).as_posix():digest(p) for p in P.rglob('*') if p.is_file()};df={p.relative_to(D).as_posix():digest(p) for p in D.rglob('*') if p.is_file()};assert cf==df
print(json.dumps({'identical_trees':True,'total_files':len(cf),'total_bytes':sum(p.stat().st_size for p in P.rglob('*') if p.is_file()),**receipt,'delivery_sha256':digest(P/'DELIVERY1012.json')},indent=2))
