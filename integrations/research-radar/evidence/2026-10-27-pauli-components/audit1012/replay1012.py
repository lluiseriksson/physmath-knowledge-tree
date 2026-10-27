from pathlib import Path
import shutil,subprocess,json,hashlib
P=Path(__file__).parent;src=Path(r'D:\Proyectos\airr-investigacion');out=P/'replay';out.mkdir(exist_ok=True)
jobs={'2026-10-27_pauli997':['verify997.py','algebra997.py','doeblin997.py','finite997.py'],'2026-10-27_envelope1003':['check1003.py','finite1003.py'],'2026-10-27_envelope1003-certificate':['certificate1003.py'],'2026-10-27_profile1011':['check1011.py','finite1011.py']}
rows=[]
for folder,names in jobs.items():
 for name in names:
  data=(src/folder/name).read_bytes();dest=out/name;dest.write_bytes(data)
  p=subprocess.run([r'C:\Python312\python.exe',str(dest)],cwd=out,capture_output=True,text=True,encoding='utf-8',timeout=120)
  (out/(name+'.stdout.txt')).write_text(p.stdout,encoding='utf-8');(out/(name+'.stderr.txt')).write_text(p.stderr,encoding='utf-8')
  rows.append({'source':str(src/folder/name),'script_sha256':hashlib.sha256(data).hexdigest(),'exit_code':p.returncode});print(name,p.returncode,flush=True)
(P/'REPLAY1012.json').write_text(json.dumps({'scope':'Supplied scripts copied unchanged into own folder; outputs only here; optimization and sealing/copy scripts deliberately not executed','jobs':rows},indent=2)+'\n',encoding='utf-8')
