from pathlib import Path
import numpy as np
import scipy,scipy.special as sc
import json,time,hashlib,datetime
C=Path(__file__).parent;start=time.monotonic();b2=9757/50000;b=np.sqrt(b2)
def H(z,n):
 u,w=sc.roots_hermite(n);uv=(u[:,None]+1j*u[None,:]).ravel();ww=(w[:,None]*w[None,:]).ravel()/np.pi;out=[]
 for zz in z:
  x=np.sqrt(zz);y=x+uv;y0=np.sqrt(2)*uv
  ls=-np.log(2)-abs(y)**2/2+abs(y-x)**2
  lr=np.log(2)-abs(y0-x)**2+abs(y0)**2/2
  out.append(.5*np.dot(ww,np.logaddexp(0,ls))+.5*np.dot(ww,np.logaddexp(0,lr)))
 return np.asarray(out)
def basis(z,a,f):return np.exp(-a*b2/(1+a)*z[:,None])*sc.j0(np.sqrt(z[:,None])*f[None,:])
z=np.unique(np.r_[np.linspace(0,6,121),np.linspace(6,40,137),np.linspace(40,120,81)])
target=H(z,192);zv=np.unique(np.r_[np.linspace(0,6,181),np.linspace(6,40,171),np.linspace(40,120,81)])
validation=H(zv,256);rows=[];saved=[]
for a in [.1,.2,.5,1.]:
 for fmax in [2.5,3.,3.5,4.]:
  for N in [16,24,32]:
   f=np.linspace(0,fmax,N);B=basis(z,a,f);coef,resid,rank,sv=np.linalg.lstsq(B,target,rcond=1e-12)
   pred=basis(zv,a,f)@coef;err=float(np.max(abs(validation-pred)))
   amplification=(1+a)*np.exp(f*f*(1+a)/(4*b2));M=float(np.sum(abs(coef)*amplification))
   d=np.log1p(b2)-.17825399094179-2*err
   proxy=float(2*d*d/(np.hypot(M,np.sqrt(2*d))+M)**2) if d>0 else None
   tailz=max(120.,float(np.log(max(np.sum(abs(coef)),1)/1e-7)/(a*b2/(1+a))))
   tailgrid=np.linspace(120,tailz,501);predtail=basis(tailgrid,a,f)@coef
   row={'a':a,'fmax':fmax,'N':N,'rank':int(rank),'smallest_retained_singular_value':float(sv[rank-1]),'sampled_residual':err,'M_triangle_estimate':M,'conditional_gap_proxy_NOT_CERTIFIED':proxy,'tail_envelope_z_for_1e-7':tailz,'sampled_approx_tail_amplitude':float(np.max(abs(predtail))),'max_training_residual':float(np.max(abs(B@coef-target)))}
   rows.append(row);saved.append({'row':row,'coefficient_hex':[float(x).hex() for x in coef],'frequencies':f.tolist()})
best=sorted(saved,key=lambda x:(x['row']['sampled_residual'],x['row']['M_triangle_estimate']))[:8]
out={'created_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'Bounded exploratory fit only; no global residual certificate or numerical learning-gap lower bound','basis':'Input F(z)=exp(-a*b²*z/(1+a)) sum d_j J0(f_j sqrt(z)). Output g(y)=sum c_j exp(-a|y|²)J0(f_j(1+a)|y|/b); c_j=(1+a)exp(f_j²(1+a)/(4b²))*d_j.','input_parameters':{'b_squared':'9757/50000'},'all_attempts':rows,'selected_by_sampled_error_not_a_certification':best,'training_points':len(z),'validation_points':len(zv),'conditional_formula_assumptions':['Exact bounded observable heat identity','A GLOBAL rigorous residual bound, not a finite grid','A rigorous bound on M','Correct entropy-deficit and Pinsker derivation'], 'not_claimed':['global approximation','positive numerical Delta','energy threshold','new paper or score','worldwide novelty','Research Capsule readiness'],'elapsed_seconds':time.monotonic()-start,'environment':{'numpy':np.__version__,'scipy':scipy.__version__},'code_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
(C/'FIT788.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n');np.savez_compressed(C/'samples788.npz',z=z,H192=target,z_validation=zv,H256=validation)
print(json.dumps({'attempts':len(rows),'elapsed_seconds':out['elapsed_seconds'],'best':[x['row'] for x in best[:3]]}),flush=True)
