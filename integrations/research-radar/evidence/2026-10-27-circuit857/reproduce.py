import argparse,json,hashlib,zipfile,subprocess,sys
from pathlib import Path
P=argparse.ArgumentParser(description="Reproduce the original own finite circuit controls without modifying frozen evidence.")
P.add_argument('--output',required=True,type=Path,help='A NEW output directory; it must not already exist.')
args=P.parse_args();root=Path(__file__).resolve().parent;out=args.output.resolve()
manifest=json.loads((root/'NATIVE-MANIFEST857.json').read_text(encoding='utf-8'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(root/'native-controls857.zip')==manifest['zip_sha256']
out.mkdir(parents=True,exist_ok=False)
with zipfile.ZipFile(root/'native-controls857.zip') as z:
 for item in manifest['files']:
  name=item['path'];assert '/' not in name and '\\' not in name
  data=z.read(name);assert hashlib.sha256(data).hexdigest()==item['sha256']
  (out/name).write_bytes(data)
expected839=json.loads((out/'CONTROLS839.json').read_text(encoding='utf-8'))
expected840=json.loads((out/'RESULTS840.json').read_text(encoding='utf-8'))
for name in ['controls839.py','independent840.py']:
 with (out/(name+'.stdout.txt')).open('wb') as log, (out/(name+'.stderr.txt')).open('wb') as err:
  subprocess.run([sys.executable,'-B',str(out/name)],cwd=out,stdout=log,stderr=err,check=True)
actual839=json.loads((out/'CONTROLS839.json').read_text(encoding='utf-8'))
actual840=json.loads((out/'independent/RESULTS840.json').read_text(encoding='utf-8'))
without=lambda d,keys:{k:v for k,v in d.items() if k not in keys}
assert without(actual839,{'utc'})==without(expected839,{'utc'})
assert without(actual840,{'utc','elapsed_seconds'})==without(expected840,{'utc','elapsed_seconds'})
assert sha(out/'independent/positive-witnesses.jsonl')==manifest['original_positive_witness_jsonl_sha256']
for item in manifest['files']:
 if item['path'].endswith('.py'):assert sha(out/item['path'])==item['sha256']
result={'status':'passed','original_script_bytes_preserved':True,'controls839_json_equal_except_utc':True,'independent840_json_equal_except_utc_elapsed':True,'all_positive_certificates_byte_exact':True,'finite_checks_are_not_a_general_proof':True,'importance_score':None,'statistics':actual840['stats']}
(out/'REPRODUCTION857.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,indent=2))
