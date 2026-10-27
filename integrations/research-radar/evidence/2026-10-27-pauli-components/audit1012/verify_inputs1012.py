"""Read-only input verification; only writes this audit's own receipt."""
from pathlib import Path
import hashlib,json,datetime
P=Path(__file__).resolve().parent
base=Path(r'D:\Proyectos\airr-investigacion')
items=[('2026-10-27_pauli997','MANIFEST997.json',None),('2026-10-27_envelope1003','MANIFEST1003.json',None),
 ('2026-10-27_envelope1003-certificate','MANIFEST1003-CERTIFICATE.json',None),
 ('2026-10-27_profile1011','MANIFEST1011.json','160907b4aa5d0daf4fd8860eefb4df6b0f4cd11f38931833406f46b12498da52')]
out={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'phase':'before substantive audit','packages':[],'errors':[]}
for folder,mname,expected in items:
    root=base/folder;mp=root/mname;raw=mp.read_bytes();h=hashlib.sha256(raw).hexdigest();m=json.loads(raw)
    if expected and h!=expected:out['errors'].append({'manifest':str(mp),'expected':expected,'actual':h})
    rows=[]
    for x in m['files']:
        p=root/x['path'];assert p.resolve().is_relative_to(root.resolve())
        b=p.read_bytes();hh=hashlib.sha256(b).hexdigest();ok=hh==x['sha256'] and len(b)==x['bytes']
        row={'path':x['path'],'sha256':hh,'bytes':len(b),'match':ok};rows.append(row)
        if not ok:out['errors'].append({'package':folder,**row})
    unlisted=sorted(p.name for p in root.iterdir() if p.name!=mname and p.name not in {r['path'] for r in rows})
    out['packages'].append({'path':str(root),'manifest':mname,'manifest_sha256':h,'expected_manifest_supplied':expected,'files':rows,'unlisted':unlisted})
(P/'INPUT_VERIFICATION1012.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'packages':[{'path':x['path'],'manifest_sha256':x['manifest_sha256'],'files':len(x['files']),'unlisted':x['unlisted']} for x in out['packages']],'errors':out['errors']},indent=2))
assert not out['errors']
