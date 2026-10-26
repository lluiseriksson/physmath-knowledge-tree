from pathlib import Path
import json,datetime,hashlib,urllib.request,concurrent.futures,shutil
C=Path(__file__).parent;old=json.loads(Path('D:/Proyectos/airr-investigacion/2026-10-26_interval777/SOURCES776.json').read_bytes())
def fetch(s):
 z={'name':s['name'],'url':s['url'],'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'depth':'inventoried/metadata refreshed only; no new abstract, theorem or proof audit'}
 try:
  with urllib.request.urlopen(urllib.request.Request(s['url'],headers={'User-Agent':'AIRR-primary-radar/1.0'}),timeout=25) as r:b=r.read();z.update(http=r.status,bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
  if 'commits/HEAD' in s['url']:j=json.loads(b);z.update(commit=j['sha'],commit_date=j['commit']['committer']['date'],same_commit=j['sha']==s.get('commit'))
  if s['name']=='owner_public_repos':z['repositories']=[{'name':x['name'],'pushed_at':x['pushed_at'],'default_branch':x['default_branch']} for x in json.loads(b)]
  z['same_response_bytes']=z['sha256']==s.get('sha256')
 except Exception as e:z['error']=str(e)
 return z
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as p:rows=list(p.map(fetch,old['sources']))
x={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Directed13-endpoint primary-source inventory refresh, never exhaustive. No foreign corpus saved; metadata is not proof coverage.','sources':rows}
(C/'SOURCES787.json').write_text(json.dumps(x,indent=2)+'\n',encoding='utf-8');print(json.dumps({'sources':[(r['name'],r.get('http'),r.get('commit'),r.get('error')) for r in rows]}))
