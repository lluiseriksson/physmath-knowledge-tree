from pathlib import Path
import subprocess,hashlib,json,shutil,sys
root=Path(__file__).parent;expected=hashlib.sha256((root/'INPUT801.json').read_bytes()).hexdigest();cases=[]
for name,kind in [('tampered-engine','payload'),('wrong-manifest-anchor','anchor')]:
 c=root/'negative802'/name;c.mkdir(parents=True,exist_ok=True);shutil.copy2(root/'portable801.py',c/'portable801.py');shutil.copy2(root/'INPUT801.json',c/'INPUT801.json');shutil.copytree(root/'inputs',c/'inputs',dirs_exist_ok=True)
 if kind=='payload':
  q=c/'inputs/interval778.py';q.write_bytes(q.read_bytes()+b"\nraise RuntimeError('TAMPER_BODY_EXECUTED')\n")
 command=[sys.executable,'-X','utf8','-B',str(c/'portable801.py'),'--manifest-sha256',expected if kind=='payload' else '0'*64]
 run=subprocess.run(command,cwd=root.parent,capture_output=True,text=True,encoding='utf-8');assert run.returncode==2 and not (c/'selected802').exists();assert ('Input hash mismatch before execution' if kind=='payload' else 'Manifest hash mismatch before numerical import') in run.stderr;assert 'TAMPER_BODY_EXECUTED' not in run.stderr
 (c/'stdout.txt').write_bytes(run.stdout.encode());(c/'stderr.txt').write_bytes(run.stderr.encode());cases.append({'case':name,'exit_code':run.returncode,'stdout':run.stdout,'stderr':run.stderr,'no_result_directory':True,'engine_sha256':hashlib.sha256((c/'inputs/interval778.py').read_bytes()).hexdigest()})
(root/'NEGATIVE802.json').write_bytes((json.dumps({'scope':'Two fail-closed package checks only; no mathematical proof, score, full campaign or capsule claim','cases':cases,'test_code_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},indent=2)+'\n').encode());print(json.dumps({'rejected_before_execution':len(cases)}))
