"""Own small structural guard, not the external numerical/dual certificate verifier."""
from pathlib import Path
import hashlib,io,lzma,pickle,pickletools,json,math,collections,datetime
W=Path('C:/Trabajo/airr/2026-10-30_werner-static1392');T=W/'temporary-source'
h=lambda b:hashlib.sha256(b).hexdigest()
raw=(T/'ep3_perd_d3.pkl.xz').read_bytes();assert h(raw)=='8409f87ef6670971efdec513dc28341e32e5b4f72536eca6e7b4222636ccfc5c'
dec=lzma.LZMADecompressor();body=dec.decompress(raw,max_length=32*1024*1024);assert dec.eof and not dec.unused_data
for op,arg,pos in pickletools.genops(body):assert op.name not in {'GLOBAL','STACK_GLOBAL','REDUCE','BUILD','INST','OBJ','NEWOBJ','NEWOBJ_EX','PERSID','BINPERSID','EXT1','EXT2','EXT4'}
class Primitive(pickle.Unpickler):
 def find_class(self,*args):raise ValueError('No globals')
 def persistent_load(self,*args):raise ValueError('No persistent data')
p=Primitive(io.BytesIO(body)).load();assert (p['k'],p['d'],p['nrow'])==(3,3,4675)
letters={'31':'aaab','22':'aabb','13':'bbba'}
def matrix(a,nrows=None):
 assert isinstance(a,list) and a and isinstance(a[0],list) and a[0]
 assert all(len(r)==len(a[0]) and all(type(x)is int for x in r) for r in a)
 if nrows is not None:assert len(a)==nrows
 return len(a[0])
diagram_checks={};aux_checks={}
def label(key):
 pref,cs,lab=key.split('|');cuts=tuple(int(x) for x in cs.split(',')) if cs else ();f,a,b=lab.split('_')
 return pref,cuts,(int(f[1:]),() if a=='e' else tuple(map(int,a)),() if b=='e' else tuple(map(int,b)))
def diagram(key,m=4):
 pref,cut,lab=label(key);assert pref=='S' or m==3
 keys,C=p['diagrams'][(m,cut)][lab];dim=matrix(C,len(keys));d=3
 for pairs,top,bottom in keys:
  used=[]
  assert len(pairs)==lab[0]
  for a,b in pairs:
   assert (a in cut)!=(b in cut);used.extend((a,b))
  for slot,v in top:
   assert slot not in cut and type(v)is int and 0<=v<d;used.append(slot)
  for slot,v in bottom:
   assert slot in cut and type(v)is int and 0<=d+v<d;used.append(slot)
  assert sorted(used)==list(range(m)),('Invalid basis diagram',key)
 diagram_checks[(m,key)]={'dimension':dim,'keys':len(keys),'fixed_values_in_qutrit_range':True}
 return dim
def aux(key,m=4):
 dim=matrix(p['aux'][key],2**m);aux_checks[(m,key)]={'dimension':dim,'rows':2**m};return dim
kind_counts=collections.Counter();pair_counts=collections.Counter()
for ti,t in enumerate(p['types']):
 rows=[s.split() for s in t['rows']];assert all(len(r)==4 and all(z in {'a','b','a*','b*'} for z in r) for r in rows)
 cuts=[tuple(i for i,z in enumerate(r) if z.endswith('*')) for r in rows];assert len(set(cuts))==1
 cut=cuts[0];mods=t['modules'];assert len(mods)==4 and all(label(x)[1]==cut for x in mods)
 assert mods[-1].startswith('A|') and all(x.startswith('S|') for x in mods[:3])
 dims=[diagram(x) for x in mods[:3]]+[aux(mods[-1])]
 q=[sum((1 if not z.endswith('*') else -1) for z in r if z[0]=='a') for r in rows]
 assert len(set(q))==1,'Gram rows have unequal phase charge'
 for r in rows:
  for s in rows:
   ket=[s[i][0] if i in cut else r[i][0] for i in range(4)]
   bra=[r[i][0] if i in cut else s[i][0] for i in range(4)]
   assert sorted(ket)==sorted(bra)
   fam=next((f for f,L in letters.items() if sorted(L)==sorted(ket)),None);assert fam
   if len(rows)==1:assert fam==t['family']
   pair_counts[fam]+=1
 nn=math.prod(dims);rr=matrix(t['W'],len(rows)*nn);assert rr==t['r'] and len(t['Znum'])==rr*rr
 assert all(type(v)is int for v in t['Znum']) and type(t['Zexp'])is int and t['Zexp']>=0
 assert all(t['Znum'][a*rr+b]==t['Znum'][b*rr+a] for a in range(rr) for b in range(rr))
 kind_counts[t['kind']]+=1
equalities={}
for name,g in p['eq_groups'].items():
 parts=g['parts'];triplets=[]
 for part in parts:
  specs=part['local'];assert len(specs)==4
  slots={x[1] for x in specs};orders={tuple(x[2]) for x in specs};assert len(slots)==len(orders)==1
  slot=next(iter(slots));order=next(iter(orders));assert sorted(order)==[x for x in range(4) if x!=slot]
  for l,spec in enumerate(specs):
   pref,sl,ordr,kind,mkeys=spec;assert pref==('S' if l<3 else 'A')
   if l<3:
    assert kind=='del'
    for mk in mkeys:
     lab=mk.split('|')[-1];assert label('S||'+lab)[2][0]==0;diagram('S||'+lab,m=3)
   else:
    assert kind in {'del','stiefel_aux'}
    for mk in mkeys:aux(mk,3 if kind=='del' else 4)
  L=letters[part['family']]
  if len(parts)==1:
   assert L[slot]=='a' and specs[-1][3]=='stiefel_aux' and part['sign']==1
   equalities[name]={'kind':'Stiefel at an a replica','slot':slot}
  else:
   assert specs[-1][3]=='del';triplets.append((''.join(L[i] for i in order),part['sign']))
 if len(parts)>1:
  assert len(parts)==2 and triplets[0][0]==triplets[1][0] and sum(x[1] for x in triplets)==0
  assert all(parts[0]['local'][l][4]==parts[1]['local'][l][4] for l in range(4)), 'Paired marginal compressions differ'
  equalities[name]={'kind':'Common whole-replica marginal','surviving_letters':triplets[0][0]}
assert len(equalities)==5
r={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kind':'own_structural_admissibility_guard','data_sha256':h(raw),'types_checked':len(p['types']),'kind_counts':dict(kind_counts),'row_pair_family_counts':dict(pair_counts),'diagram_modules_checked':[{'m':m,'key':key,**v} for (m,key),v in sorted(diagram_checks.items())],'auxiliary_modules_checked':len(aux_checks),'equality_groups':equalities,'result':'PASS for declared row-charge/cut, qutrit basis-range/shape and equality-letter admissibility only','scope':'No foreign executable code imported or executed. No coefficient-map, orbit enumeration, exact correction, final dual identity, actual multiplier PSD or Lean audit. Same coordinating producer; not independent model review.'}
(W/'ADMISSIBILITY1392.json').write_bytes((json.dumps(r,indent=2)+'\n').encode());print(json.dumps({k:r[k] for k in ('types_checked','kind_counts','auxiliary_modules_checked','equality_groups','result')}))
