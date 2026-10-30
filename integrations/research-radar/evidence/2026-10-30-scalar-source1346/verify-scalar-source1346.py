"""Read-only source-availability binding. Never imports or executes archived generators."""
from pathlib import Path
from fractions import Fraction
import argparse,ast,hashlib,json,zipfile
ARCHIVE_SHA='35b58032822963106bfea8e5f00ef48201bca754dc260c6233aa365ab8409dc2'
CAMPAIGN_SHA='ab729762abdbc770b34b5ee98ba8b92cdaa8ce6ff999fcbc9b0194b1a00a6c93'
EXPECTED={'certificate779.py':'bf0255c5ec751622bf92a28e5e61cb8939f5c6ba859155c0d436a4f0b969cfbb','interval778.py':'4fa44ba0a03659707abc68a9ec0391c7375967aec7b69d0ebae533d1e38235d2','CERTIFICATE779.json':'9b7374901ac3ec6a2d4870d3dcaaab8e07c61a718ef9fe8be287e3f8d209362b'}
def sha(b):return hashlib.sha256(b).hexdigest()
def need(ok,msg):
 if not ok:raise ValueError(msg)
def rational(node):
 if isinstance(node,ast.Constant) and isinstance(node.value,int):return Fraction(node.value)
 if isinstance(node,ast.Call) and isinstance(node.func,ast.Name) and node.func.id=='arb' and len(node.args)==1 and not node.keywords:return rational(node.args[0])
 if isinstance(node,ast.BinOp) and isinstance(node.op,ast.Div):return rational(node.left)/rational(node.right)
 raise ValueError('unrecognized fixed endpoint syntax')
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--original-archive',type=Path,required=True);ap.add_argument('--campaign',type=Path);args=ap.parse_args()
 raw=args.original_archive.read_bytes();need(sha(raw)==ARCHIVE_SHA,'original archive trust anchor')
 with zipfile.ZipFile(args.original_archive) as z:
  need(len(z.namelist())==len(set(z.namelist()))==12,'archive members')
  manifest=json.loads(z.read('MANIFEST780.json'));need(len(manifest['files'])==11,'manifest payload count')
  for f in manifest['files']:
   b=z.read(f['path']);need(len(b)==f['bytes'] and sha(b)==f['sha256'],'manifest payload binding')
  source={n:z.read(n) for n in EXPECTED}
  for n,h in EXPECTED.items():need(sha(source[n])==h,'source/certificate hash '+n)
 cert=json.loads(source['CERTIFICATE779.json']);pins={p['path']:p['sha256'] for p in cert['code_pins']}
 need(all(pins[n]==EXPECTED[n] for n in ['certificate779.py','interval778.py']),'certificate code pins')
 tree=ast.parse(source['certificate779.py'].decode());outer=next(n for n in tree.body if isinstance(n,ast.For) and isinstance(n.target,ast.Name) and n.target.id=='bits')
 bits=ast.literal_eval(outer.iter);need(bits==[128,160],'generator precision list')
 inner=next(n for n in outer.body if isinstance(n,ast.For) and isinstance(n.target,ast.Tuple));need(isinstance(inner.iter,ast.List),'fixed cell list')
 cells=[[str(rational(x)) for x in pair.elts] for pair in inner.iter.elts];need(cells==[['0','1/2'],['1/2','2'],['2','6'],['6','20']],'source cell endpoints')
 need([r['precision_bits'] for r in cert['rows']]==bits and all(len(r['truncated_J'])==4 for r in cert['rows']),'record/source row layout')
 engine=ast.parse(source['interval778.py'].decode());T=next(ast.literal_eval(n.value) for n in engine.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='T' for t in n.targets));need(T==200,'scalar engine cutoff')
 campaign_bound=False
 if args.campaign:
  b=args.campaign.read_bytes();need(sha(b)==CAMPAIGN_SHA,'campaign trust anchor')
  with zipfile.ZipFile(args.campaign) as z:need(z.read('.run-ledger/optical1334/inputs/CERTIFICATE779.json')==source['CERTIFICATE779.json'],'campaign retained certificate is identical')
  campaign_bound=True
 print(json.dumps({'status':'source availability and recorded bindings verified','original_archive_sha256':ARCHIVE_SHA,'native_archive_payloads':12,'manifest_files_checked':11,'source_pins':EXPECTED,'recorded_python_flint_version':cert['runtime']['python_flint'],'precision_bits':bits,'J_cells_from_source_AST':cells,'scalar_engine_T':T,'campaign_certificate_bound':campaign_bound,'generator_executed':False,'integrations_rerun':False,'new_model_assessment':False,'historical_backend_closure_attested':False,'scope':'Provenance/source-location closure only; no historical execution, ball correctness, environment closure, theorem or score certification'},sort_keys=True))
if __name__=='__main__':main()
