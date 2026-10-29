from pathlib import Path
from fractions import Fraction
import hashlib,json,zipfile
p=Path(__file__).resolve().parent
archive=p/'CAMPAIGN1334.zip'
assert hashlib.sha256(archive.read_bytes()).hexdigest()=='ab729762abdbc770b34b5ee98ba8b92cdaa8ce6ff999fcbc9b0194b1a00a6c93'
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 manifest=json.loads(z.read('CAMPAIGN-MANIFEST1334.json'))
 assert len(manifest['files'])==49
 for e in manifest['files']:
  assert not Path(e['path']).is_absolute() and '..' not in Path(e['path']).parts
  b=z.read(e['path']);assert len(b)==e['bytes'] and hashlib.sha256(b).hexdigest()==e['sha256']
 for name in ['CAPSULE1334.json','DOSSIER1334.json','RUN-MANIFEST1334.json','FULL1334.json']:
  assert (p/name).read_bytes()==z.read('.run-ledger/optical1334/'+name)
 assert (p/'CAPSULE1334.md').read_text(encoding='utf-8').rstrip('\r\n')==z.read('.run-ledger/optical1334/CAPSULE1334.md').decode().rstrip('\r\n')
full=json.loads((p/'FULL1334.json').read_bytes());rows=full['segments']
assert full['segment_count']==320 and full['all_bounds_below_eps'] and full['worker_count']==8
assert [r['segment_id'] for r in rows]==list(range(320))
assert all(Fraction(rows[i]['left'])+Fraction(rows[i]['width'])==Fraction(rows[i+1]['left']) for i in range(319))
assert Fraction(rows[0]['left'])==0 and Fraction(rows[-1]['left'])+Fraction(rows[-1]['width'])==400
cap=json.loads((p/'CAPSULE1334.json').read_bytes())
assert cap['content_fingerprint']=='b0e85e43608587f97c3228799ce22083f1edf124b3324bcd65365bb41dc0a066' and cap['readiness']['overall']=='ready'
print(json.dumps({'archive_members_verified':49,'direct_json_copies_identical':4,'markdown_projection_content_equal':True,'coverage':[0,400],'segments':320,'numeric_rerun':False,'scope':'Integrity and exact coverage; repository capsule verifier separately checks fingerprints and19actual artifacts, not a floating-point substitute proof.'}))
