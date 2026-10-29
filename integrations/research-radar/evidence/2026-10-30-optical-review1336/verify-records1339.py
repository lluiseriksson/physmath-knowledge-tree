"""Read-only checks of frozen optical records, using only the Python standard library.
Does not execute archived code, integrate, refit, attest a historical process,
or independently prove the analytic contract/Arb implementation.
"""
from pathlib import Path, PurePosixPath
from fractions import Fraction as Q
import argparse, copy, hashlib, json, re, sys, zipfile
ZIP_SHA='ab729762abdbc770b34b5ee98ba8b92cdaa8ce6ff999fcbc9b0194b1a00a6c93'
INPUT_SHA='7330dee63da9a4c9beba63764ab0a8f2638667c94c5a72964b09ce867d03b0e3'
SOURCE_SHA='a8092f18a95f6f6a1528295be7b224c1982e2738320cb5373fb74fda8f24d2ef'
REGION_SHA='0b438a21cf64d164da6e0b8267a89cf8fc62052639f94f047325680d1335bef5'
CONSTANTS_SHA='8e036bfafffc473ac0a849926191081ea4cdcca158dd472f7d304274c46573de'
PREFIX='.run-ledger/optical1334/'
EPS=Q(1,10**6)
DEC=r'[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?'
BALL=re.compile(r'\[\s*('+DEC+r')\s*\+/-\s*('+DEC+r')\s*\]')
def need(ok, message):
    if not ok: raise ValueError(message)
def sha(b): return hashlib.sha256(b).hexdigest()
def ball(s):
    need(isinstance(s,str),'ball must be text')
    m=BALL.fullmatch(s.strip())
    if m:
        mid,rad=map(Q,m.groups());need(rad>=0,'negative ball radius')
        return mid-rad,mid+rad
    need(re.fullmatch(DEC,s.strip()) is not None,'nonfinite or unsupported ball: '+s)
    x=Q(s);return x,x

def check_records(full, scalar, fit, source, constants):
    rows=full['segments']
    need(len(rows)==320 and [x['segment_id'] for x in rows]==list(range(320)), 'segment identities/coverage')
    maximum=(Q(0),-1)
    for i,r in enumerate(rows):
        left=Q(i,2) if i<160 else Q(80+2*(i-160))
        width=Q(1,2) if i<160 else Q(2)
        need((Q(r['left']),Q(r['width']),r['n'],r['H_interpolated'])==(left,width,64 if i<160 else 96,i<160),'fixed segment geometry')
        vals=[ball(r[k]) for k in ['polynomial_l1','analytic_remainder','tail']]
        need(all(lo>=0 for lo,hi in vals),'negative component lower endpoint')
        lo,hi=ball(r['bound'])
        need(lo>=0 and hi<EPS,'stored bound does not prove strict residual threshold')
        need(sum(v[1] for v in vals)<EPS,'sum of serialized component upper endpoints exceeds residual threshold')
        need(max(lo,sum(v[0] for v in vals))<=min(hi,sum(v[1] for v in vals)),'inconsistent serialized sum intervals')
        need(r['proved_below_eps'] is True,'missing per-segment result flag')
        maximum=max(maximum,(hi,i))
    for row in scalar['rows']:
        need(ball(row['G1'])[0]>Q('.17825') and ball(row['G1'])[1]<Q('.178254'),'strong G1 scalar threshold')
        need(ball(row['a0'])[0]>Q('.0078') and ball(row['a0'])[1]<Q('.0079'),'a0 scalar threshold')
        need(ball(row['norm2'])[0]>Q('.737') and ball(row['norm2'])[1]<Q('.739'),'norm2 scalar threshold')
        need(ball(row['AWGN_capacity'])[0]>Q('.178263333') and ball(row['AWGN_capacity'])[1]<Q('.178263334'),'stored C2 enclosure')
    need(len(scalar['rows'])==2,'both retained scalar precision rows required')
    sc=full['scalars']
    need(0<=ball(sc['tail400'])[0] and ball(sc['tail400'])[1]<EPS,'infinite-tail threshold')
    need(0<ball(sc['observable_M'])[0] and ball(sc['observable_M'])[1]<Q('1.5e20'),'observable norm threshold')
    need(ball(sc['stable_gap_expression'])[0]>Q('6e-52'),'stored gap expression threshold')
    chosen=fit['rows'][0]
    need((chosen['a'],chosen['N'],chosen['fmax'],chosen['rcond'])==(1,32,4,1e-14),'selected fixed fit')
    need(constants['derived_from_source_sha256']==SOURCE_SHA,'recorded manuscript source anchor')
    pairs=[(str(x['j']),x['frequency_hex'],x['coefficient_hex']) for x in constants['pairs']]
    need(len(pairs)==32,'dyadic table must contain all32 pairs')
    if source is not None:
        tab=re.search(r'\\begin\{longtable\}\{rll\}(.*?)\\end\{longtable\}',source,re.S)
        need(tab is not None,'manuscript table absent')
        printed=re.findall(r'(\d+)&\\texttt\{([^}]+)\}&\\texttt\{([^}]+)\}',tab.group(1))
        need(printed==pairs,'manuscript table/constant record mismatch')
    for i,(j,f,d) in enumerate(pairs):
        need(int(j)==i+1 and f==chosen['frequencies_hex'][i] and d==chosen['coefficient_hex'][i],'table coefficient mismatch')
        # Hex strings denote finite exact binary rationals; never used as decimal approximations.
        need(float.fromhex(f)>=0,'negative frequency')
        Q.from_float(float.fromhex(d))
    # Independent exact atanh-series bracket for log(1+b^2).
    b2=Q(9757,50000);t=b2/(2+b2);n=16
    lower=2*sum((t**(2*k+1)/Q(2*k+1) for k in range(n)),Q(0))
    upper=lower+2*t**(2*n+1)/(Q(2*n+1)*(1-t*t))
    need(lower>Q('.178263333') and upper<Q('.178263334'),'rational logarithm bracket')
    feasible=Q('.17825')+Q(1,200)*Q('.0078')-Q(1,200)**2*Q('.739')
    need(feasible==Q('.178270525') and feasible>Q('.178263334'),'single-law feasible sandwich')
    d0=Q('.178263333')-Q('.178254')-4*EPS;r0=Q('6e-52');M0=Q('1.5e20')
    need(d0==Q('5.333e-6') and d0>r0 and (d0-r0)**2>2*M0*M0*r0,'rational positive gap')
    need(r0*10**53==60 and 6+Q(1)<60,'sufficient energy comparison')
    return {'segments':320,'coverage':[0,400],'maximum_serialized_bound_upper':str(maximum[0]),'maximum_segment':maximum[1],'constant_pairs':32,'scalar_rows':2,'manuscript_source_table_checked':source is not None,'rational_log_bracket':True,'rational_gap':True}

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--packet',type=Path,required=True)
    ap.add_argument('--source',type=Path,help='Optional exact reviewed TeX, supplied separately; no source-table claim without it')
    ap.add_argument('--constants',type=Path,default=Path(__file__).with_name('CONSTANTS1339.json'))
    ap.add_argument('--self-test',action='store_true',help='negative in-memory record guards; no integration')
    args=ap.parse_args()
    sourcebytes=args.source.read_bytes() if args.source else None
    if sourcebytes is not None:need(sha(sourcebytes)==SOURCE_SHA,'reviewed source trust anchor mismatch')
    cb=args.constants.read_bytes();need(sha(cb)==CONSTANTS_SHA,'dyadic table trust anchor mismatch');constants=json.loads(cb)
    raw=(args.packet/'CAMPAIGN1334.zip').read_bytes();need(sha(raw)==ZIP_SHA,'campaign ZIP trust anchor mismatch')
    with zipfile.ZipFile(args.packet/'CAMPAIGN1334.zip') as z:
        manifest=json.loads(z.read('CAMPAIGN-MANIFEST1334.json'))
        need(len(manifest['files'])==49,'manifest payload count')
        for ent in manifest['files']:
            p=PurePosixPath(ent['path']);need(not p.is_absolute() and '..' not in p.parts,'unsafe archive member')
            b=z.read(ent['path']);need(len(b)==ent['bytes'] and sha(b)==ent['sha256'],'payload hash mismatch')
        def data(name):return z.read(PREFIX+name)
        def doc(name):return json.loads(data(name))
        inp=data('INPUT1334.json');need(sha(inp)==INPUT_SHA,'input manifest trust anchor')
        inputs=json.loads(inp)
        bindings=[]
        for name,h in inputs['files'].items():
            need(sha(data(name))==h,'bound input mismatch')
            bindings.append({'path':name,'sha256':h,'verified_buffer':True})
        full=doc('FULL1334.json');plan=doc('PLAN1334.json')
        need((plan['precision_bits'],plan['T'],plan['workers'])==(256,600,8),'plan settings')
        region=data('inputs/SOURCE795.py').decode()
        region=region[region.index('def A(x):'):region.index('for j in range(160):segment')]
        need(sha(region.encode())==REGION_SHA,'function-region hash')
        need(full['manifest_sha256']==INPUT_SHA and full['runner_sha256']==inputs['files']['full1334.py'] and full['function_region_sha256']==REGION_SHA,'aggregate source bindings')
        need(full['binding_at_load']==bindings and full['post_inputs_unchanged'] is True,'aggregate input bindings')
        need((full['precision_bits'],full['T'],full['worker_count'],full['segment_count'])==(256,600,8,320),'aggregate settings')
        gathered=[]
        for i,w in enumerate(full['workers']):
            wb=data(w['path']);need(len(wb)==w['bytes'] and sha(wb)==w['sha256'],'worker hash')
            worker=json.loads(wb)
            need(worker['worker']==i and worker['worker_count']==8,'worker identity')
            need(worker['input_manifest_sha256']==INPUT_SHA and worker['runner_sha256']==full['runner_sha256'] and worker['function_region_sha256']==REGION_SHA,'worker source bindings')
            need(worker['bindings']==bindings and worker['post_inputs_unchanged'] is True and worker['T']==600 and worker['precision_bits']==256,'worker input/settings')
            expected=[p['id'] for p in plan['segments'] if p['id']%8==i]
            need([r['segment_id'] for r in worker['segments']]==expected,'worker partition')
            gathered.extend(worker['segments'])
        need(len(full['workers'])==8,'worker cardinality')
        need(sorted(gathered,key=lambda r:r['segment_id'])==full['segments'],'worker/aggregate row mismatch')
        need(len(plan['segments'])==320,'plan cardinality')
        for r,p in zip(full['segments'],plan['segments']):
            need((r['segment_id'],r['left'],r['width'],r['n'],r['H_interpolated'])==(p['id'],p['left'],p['width'],p['n'],p['H_interpolated']),'plan/row mismatch')
        scalar=doc('inputs/CERTIFICATE779.json');fit=doc('inputs/FIT794.json');source=sourcebytes.decode() if sourcebytes is not None else None
        result=check_records(full,scalar,fit,source,constants)
        negative=[]
        if args.self_test:
            for name,kind in [('nonfinite','nan'),('strict_threshold','[1e-6 +/- 0]'),('missing_segment',None),('weak_G1',None),('table_mismatch',None)]:
                f=copy.deepcopy(full);s=copy.deepcopy(scalar);text=source;c=copy.deepcopy(constants)
                if name in ['nonfinite','strict_threshold']:f['segments'][0]['bound']=kind
                if name=='missing_segment':f['segments'].pop()
                if name=='weak_G1':s['rows'][0]['G1']='[.178255 +/- 0]'
                if name=='table_mismatch':c['pairs'][0]['coefficient_hex']='0x0.0p+0'
                try:check_records(f,s,fit,text,c)
                except ValueError:negative.append(name)
                else:raise ValueError('negative guard accepted '+name)
        result.update({'archive_payloads':49,'workers_linked':8,'recorded_manuscript_source_sha256':SOURCE_SHA,'negative_guards':negative,'numeric_campaign_rerun':False,'external_dependencies':[],'scope':'Stored-record inspection and exact rational consequences only; trusted historical balls and analytic contract remain premises, no retroactive binary/process attestation or new review score.'})
        print(json.dumps(result,sort_keys=True))
if __name__=='__main__':
    try: main()
    except (ValueError,KeyError,TypeError,IndexError,zipfile.BadZipFile) as e:
        print('FAIL: '+str(e),file=sys.stderr);raise SystemExit(2)
