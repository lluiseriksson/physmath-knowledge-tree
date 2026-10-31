import itertools,json,pathlib
W=pathlib.Path(__file__).parent
def reduce(word):
    out=[]
    for g,s in word:
        if out and out[-1]==(g,-s):out.pop()
        else:out.append((g,s))
    return out
def add(x,i,n):return tuple(t+n if j==i else t for j,t in enumerate(x))
def coarse(x,L,phase):return tuple((a-b)//L for a,b in zip(x,phase))
def edge(x,i,s,L,phase):
    if s<0:return [(g,-v) for g,v in reversed(edge(add(x,i,-1),i,1,L,phase))]
    y=coarse(x,L,phase); z=coarse(add(x,i,1),L,phase)
    return [] if y==z else [((y,i),1)]
def plaquette(x,i,j,L,phase):
    return reduce(edge(x,i,1,L,phase)+edge(add(x,i,1),j,1,L,phase)+edge(add(x,j,1),i,-1,L,phase)+edge(add(x,j,1),j,-1,L,phase))
count=0; straight=0
for L in [3,5,13]:
 for d in [2,3,4]:
  for centered in [False,True]:
   phase=tuple([-(L//2) if centered else 0]*d)
   coords=sorted(set([-1,0,1,L-2,L-1,L,L+1]))
   for local in itertools.product(coords,repeat=d):
    x=tuple(a+b for a,b in zip(local,phase)); y=coarse(x,L,phase)
    for i,j in itertools.combinations(range(d),2):
     both=coarse(add(x,i,1),L,phase)!=y and coarse(add(x,j,1),L,phase)!=y
     expected=plaquette(y,i,j,1,tuple([0]*d)) if both else []
     assert plaquette(x,i,j,L,phase)==expected
     count+=1
   # Every translated longitudinal path stays within its endpoint blocks,
   # meets exactly the selected interface for its coarse direction.
   for transverse in itertools.product(range(L),repeat=d-1):
    for i in range(d):
     it=iter(transverse); x=tuple(phase[j] if j==i else phase[j]+next(it) for j in range(d))
     word=[]
     for n in range(L):word+=edge(add(x,i,n),i,1,L,phase)
     assert reduce(word)==[((tuple([0]*d),i),1)]
     straight+=1
out={'plaquette_word_checks':count,'parallel_path_word_checks':straight,'failures':0,'group':'Exact free-group words, no commutativity/numerics','scope':'Finite stencil/orientation/phase sanity check. General identity is the separate three-case proof. L3/L5 test geometry only; not source-admissible physical L. L13 also checked. No general source hierarchy/averaging regularity/proof audit or formal promotion.'}
(W/'STEP-WORD-CHECK1624.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8'); print(json.dumps(out))
