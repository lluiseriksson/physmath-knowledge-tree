from pathlib import Path
from fractions import Fraction
import argparse,hashlib,json,sys,types,datetime,platform

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--manifest-sha256',required=True);parser.add_argument('--preflight-only',action='store_true');args=parser.parse_args();root=Path(__file__).resolve().parent
 manifest_bytes=(root/'INPUT801.json').read_bytes()
 if hashlib.sha256(manifest_bytes).hexdigest()!=args.manifest_sha256:raise ValueError('Manifest hash mismatch before numerical import')
 manifest=json.loads(manifest_bytes);buffers={};bindings=[]
 for name,expected in manifest['files'].items():
  path=(root/name).resolve()
  if not path.is_relative_to(root):raise ValueError('Input path escapes package')
  data=path.read_bytes();actual=hashlib.sha256(data).hexdigest()
  if actual!=expected:raise ValueError('Input hash mismatch before execution: '+name)
  buffers[name]=data;bindings.append({'relative_path':name,'sha256':actual,'loaded_from_verified_buffer':True})
 if args.preflight_only:print(json.dumps({'status':'PREFLIGHT_PASS','files':len(buffers)}));return
 # Execute precisely the already-hashed own bytes; no sys.path insertion or live external import.
 engine=types.ModuleType('bound_interval801');engine.__file__=str(root/'inputs/interval778.py');exec(compile(buffers['inputs/interval778.py'],engine.__file__,'exec'),engine.__dict__)
 import flint
 from flint import arb,acb,fmpq,ctx
 ctx.prec=256;engine.T=600
 fit=json.loads(buffers['inputs/FIT794.json']);candidate=fit['rows'][0]
 if not (candidate['a']==1 and candidate['N']==32 and candidate['fmax']==4 and candidate['rcond']==1e-14):raise ValueError('Unexpected fixed candidate')
 out=root/'selected802';out.mkdir(exist_ok=True)
 source=buffers['inputs/SOURCE795.py'].decode();start=source.index('def A(x):');end=source.index('for j in range(160):segment');region=source[start:end]
 env={'Fraction':Fraction,'arb':arb,'acb':acb,'fmpq':fmpq,'ctx':ctx,'eng':engine,'C':out,'candidate':candidate,'json':json,'time':__import__('time'),'start':__import__('time').monotonic()}
 exec(compile(region,'<verified SOURCE795.py function region>','exec'),env)
 plan=[(Fraction(0),Fraction(1,2),64,True),(Fraction(159,2),Fraction(1,2),64,True),(Fraction(80),Fraction(2),96,False),(Fraction(398),Fraction(2),96,False)]
 for left,width,n,include_H in plan:env['segment'](left,width,n,include_H)
 a=env['a'];b2=env['b2'];coef=env['coef'];freq=env['freq'];alpha=env['alpha'];BH=env['BH'];eps=env['eps'];tail=(sum((abs(d) for d in coef),arb(0))*(-alpha*400).exp()+BH(arb(400)))/401;assert tail<eps
 M=sum(((1+a)*(f*f*(1+a)/(4*b2)).exp()*abs(d) for d,f in zip(coef,freq)),arb(0));assert M<arb('1.5e20')
 prior=json.loads(buffers['inputs/CERTIFICATE779.json']);assert all(arb(row['G1'])<arb('0.178254') for row in prior['rows']);assert (1+b2).log()>arb('0.178263333')
 d0=arb('0.178263333')-arb('0.178254')-4*eps;lower=2*d0*d0/((arb('1.5e20')**2+2*d0).sqrt()+arb('1.5e20'))**2;assert d0>0 and lower>arb('6e-52')
 # Observe runtime backend files, and verify package bytes have not changed during this run.
 runtime=[]
 for path in [Path(sys.executable),Path(flint.__file__),Path(sys.modules[arb.__module__].__file__)]:runtime.append({'file':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
 assert all(hashlib.sha256((root/n).read_bytes()).hexdigest()==h for n,h in manifest['files'].items())
 record={'status':'four selected segments and scalar/tail checks pass with manifest-bound loaded bytes; NOT full320 replay','utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'input_manifest_sha256':args.manifest_sha256,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'source_region_sha256':hashlib.sha256(region.encode()).hexdigest(),'binding_at_load':bindings,'bindings_unchanged_after_run':True,'loaded_engine_T':engine.T,'precision_bits':ctx.prec,'candidate_guard':True,'segments':env['rows'],'tail400':tail.str(45),'M':M.str(45),'stable_conditional_gap_expression':lower.str(45),'python':sys.version,'python_flint':flint.__version__,'runtime_file_hashes':runtime,'no_claims':['full320 replay','retroactive runtime attestation for795','independent AI or human review','Lean proof','new paper or score','Research Capsule readiness']}
 (out/'RUN802.json').write_bytes((json.dumps(record,indent=2)+'\n').encode());print(json.dumps({'status':record['status'],'segments':len(env['rows']),'precision_bits':ctx.prec}))
if __name__=='__main__':
 try:main()
 except Exception as exc:print(type(exc).__name__+': '+str(exc),file=sys.stderr);raise SystemExit(2)
