"""Read primary PDFs in memory; retain metadata only, never source bodies."""
import sys,json,hashlib,datetime,pathlib,requests,fitz
sys.stdout.reconfigure(encoding='utf-8')
P=pathlib.Path(__file__).parent
sources={
 'pla2017':'https://perso-laris.univ-angers.fr/~chapeau/papers/pla2017.pdf',
 'ijqi2018':'https://perso-laris.univ-angers.fr/~chapeau/papers/ijqi2018.pdf',
 'ijqi_arxiv':'https://arxiv.org/pdf/1904.01904v1',
 'horodecki':'https://arxiv.org/pdf/quant-ph/9605038v2',
 'hiai':'https://arxiv.org/pdf/1508.03551v1',
 'doeblin_v3':'https://arxiv.org/pdf/2503.22823v3',
 'doeblin_journal':'https://quantum-journal.org/papers/q-2026-05-22-2115/pdf/',
 'normalform':'https://arxiv.org/pdf/quant-ph/0101003v2',
 'george':'https://arxiv.org/pdf/2505.15281v3'}
key=sys.argv[1]; url=sources[key]
meta={'key':key,'url':url,'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'foreign_corpus_saved':False}
try:
 r=requests.get(url,timeout=45);meta.update(status=r.status_code,resolved_url=r.url,bytes=len(r.content),sha256=hashlib.sha256(r.content).hexdigest());r.raise_for_status()
 doc=fitz.open(stream=r.content,filetype='pdf');meta['pages']=len(doc)
 if len(sys.argv)>2:
  pages=[int(x)-1 for x in sys.argv[2].split(',')];meta['pages_read_1based']=[p+1 for p in pages]
  for p in pages: print('\nPAGE',p+1,doc[p].get_text())
 else:
  needles=['theorem 3','theorem 5','theorem 6.1','definition 4','ancilla','phase','depolarizing','lemma 11']
  for i,p in enumerate(doc):
   text=p.get_text().lower()
   hits=[n for n in needles if n in text]
   if hits:print(i+1,hits)
except Exception as ex:meta['error']=repr(ex);print(meta['error'])
name=f'PRIMARY_{key}_{datetime.datetime.now().strftime("%H%M%S%f")}.json'
(P/name).write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
print('METADATA',json.dumps(meta))
