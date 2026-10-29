from pathlib import Path
import json,hashlib
C=Path(__file__).parent;R=Path(r'C:\Trabajo\physmath-knowledge-tree\weyl-stability-20261024');I=R/'integrations/research-radar';E=I/'evidence/2026-10-29-mps-hypothesis-boundaries'
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
manifest=json.loads((E/'MANIFEST1218.json').read_bytes())
for name in ['check_time_order1218.py','TIME-ORDER1218.json','TIME-ORDER1218.txt','augment1218.py']:
 b=(C/name).read_bytes();(E/name).write_bytes(b);manifest['files'].append({'name':name,'sha256':hashlib.sha256(b).hexdigest()})
save(E/'MANIFEST1218.json',manifest)
p=I/'registry.json';reg=json.loads(p.read_bytes());card=next(x for x in reg['source_cards'] if x['id']=='ergodic-mps-gap-2026-scoped')
card['limits']='Selected sections only. PDFp34 LemmaA.1 pointwise-adjoint time-order equality has an exact2-phase CP/TP counterexample, with an all-length reset argument and8finite rank controls. AppendixA.9 common-right-kernel step separately flagged with conditional Choi repair. Neither parent-gap theorems nor eventual equivalence are refuted here; no full-paper judgment, independent model review or solved classification.'
card['claim']+=' A selected helper-lemma time-order error is recorded separately from these source-level claims; do not rely on it downstream without repair.'
save(p,reg)
p=I/'README.md';text=p.read_text(encoding='utf-8');text=text.replace('conditional AppendixA.9 repair, and retained finite-error limits','an exact periodic counterexample to the PDFp34 adjoint-order helper lemma, conditional AppendixA.9 repair, and retained finite-error limits');p.write_text(text,encoding='utf-8',newline='\n')
print('Added scoped time-order refutation with its assumptions and whole-paper boundary')
