"""Read-only check of one exact native producer-owned CI artifact; no source execution."""
import collections,hashlib,json,re,sys,zipfile
from pathlib import Path

def require(condition, message):
    if not condition: raise ValueError(message)

p=Path(sys.argv[1]); b=p.read_bytes()
require(hashlib.sha256(b).hexdigest()=='da739a78d7f94076f5ea14a6250ace985e91000d7b798839cc1f355234d84956','Native artifact digest mismatch')
with zipfile.ZipFile(p) as z:
    require(set(z.namelist())=={'core-build.log','oracle-imports-build.log','oracle-output.txt','oracle-stats.json'},'Member set mismatch')
    raw={n:z.read(n) for n in z.namelist()}
s=raw['oracle-output.txt'].decode('utf8')
rows=[(m.group(1),[a.strip() for a in (m.group(2) or '').split(',') if a.strip()]) for m in re.finditer(r"^'(.+)' (?:depends on axioms:\s*\[([^\]]*)\]|does not depend on any axioms)",s,re.M)]
counts=collections.Counter(n for n,a in rows);allowed={'propext','Classical.choice','Quot.sound'}
require(len(rows)==2854,'Readout count mismatch')
require(all(set(a)<=allowed for n,a in rows),'Nonstandard axiom')
require(sum(not a for n,a in rows)==26,'Axiom-free count mismatch')
stats=json.loads(raw['oracle-stats.json'])
require(stats=={'requested':2854,'readouts':2854,'standard_axioms_only':2828,'axiom_free':26,'nonstandard':0,'errors':0},'Producer-statistics mismatch')
want=['YangMills.RG.lattice_mass_gap_of_singleScaleUVDecay_marginal','YangMills.RG.lattice_mass_gap_of_cmp116RawSource_hsharp_marginal']
require(all(n in counts for n in want),'Missing selected marginal endpoint')
hodge=['YangMills.RG.componentwiseFlatGradient_eq_hodge','YangMills.RG.componentwiseWeightedRepair_le_hodge']
require(all(n not in counts for n in hodge),'Unexpected focal target; reassess scope')
require(b'Build completed successfully (8466 jobs).' in raw['core-build.log'],'Core build marker absent')
require(b'Build completed successfully (8313 jobs).' in raw['oracle-imports-build.log'],'Separate import-build marker absent')
print(json.dumps({'status':'exact_native_artifact_checked','readouts':len(rows),'unique_names':len(counts),'standard_or_subset':2828,'axiom_free':26,'nonstandard':0,'repeated_names':{n:c for n,c in sorted(counts.items()) if c>1},'selected_marginal_endpoints_present':True,'new_Hodge_focal_endpoints_absent':True,'core_jobs':8466,'separate_oracle_import_jobs':8313,'scope':'Producer-owned remote kernel evidence with separate local parsing; no independent rebuild or mathematical/physical proof audit.'},indent=2))
