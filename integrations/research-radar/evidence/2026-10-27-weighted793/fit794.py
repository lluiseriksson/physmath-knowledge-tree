from pathlib import Path
import numpy as np,scipy,scipy.special as sc,json,time,hashlib
C=Path(__file__).parent;prior=Path(r'D:\Proyectos\airr-investigacion\2026-10-27_separador787');data=np.load(prior/'samples788.npz');b2=9757/50000;start=time.monotonic()
z=np.r_[data['z'],np.linspace(122,400,180)];H=np.r_[data['H192'],np.zeros(180)];zv=np.r_[data['z_validation'],np.linspace(120,800,6801)];Hv=np.r_[data['H256'],np.zeros(6801)];rows=[]
for a in [.2,.5,1.,1.5]:
 for fm in [3.,3.5,4.]:
  for n in [24,32,40]:
   for rc in [1e-12,1e-14]:
    f=np.linspace(0,fm,n);B=np.exp(-a*b2*z[:,None]/(1+a))*sc.j0(np.sqrt(z[:,None])*f)
    d,_,rank,sv=np.linalg.lstsq(B/(1+z[:,None]),H/(1+z),rcond=rc)
    pred=np.exp(-a*b2*zv/(1+a))*(sc.j0(np.sqrt(zv[:,None])*f)@d);errors=abs(pred-Hv)/(1+zv)
    u=np.sqrt(2)/3*np.exp(-zv/6);BH=u*(1-np.log(u));errors[len(data['z_validation']):]+=BH[len(data['z_validation']):]/(1+zv[len(data['z_validation']):])
    idx=int(np.argmax(errors));M=float(np.sum(abs(d)*(1+a)*np.exp(f*f*(1+a)/(4*b2))))
    rows.append({'a':a,'fmax':fm,'N':n,'rcond':rc,'rank':int(rank),'mesh_weighted_error_not_certificate':float(errors[idx]),'worst_mesh_z':float(zv[idx]),'M_estimate_not_certificate':M,'coefficient_hex':[float(x).hex() for x in d],'frequencies_hex':[float(x).hex() for x in f]})
rows.sort(key=lambda x:x['mesh_weighted_error_not_certificate'])
out={'status':'Heuristic weighted search; no certified global residual, gap, score or paper','count':len(rows),'all_coefficients_retained':True,'prior_samples_sha256':hashlib.sha256((prior/'samples788.npz').read_bytes()).hexdigest(),'weighted_conditional_identity':'If |H-F|<=eps*(1+z), per-law P<=1 yields d=C2-G1-4eps and the previous conditional Pinsker bound. Not certified here.','rows':rows,'seconds':time.monotonic()-start,'numpy':np.__version__,'scipy':scipy.__version__,'code_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'limitations':['GH target values nonrigorous','mesh is not global','tail H set to zero in training, bounded analytically only in validation mesh','all norms floating estimates','no ready Research Capsule','no reviewer or independent audit']}
(C/'FIT794.json').write_bytes((json.dumps(out,indent=2)+'\n').encode());print(json.dumps({'count':len(rows),'seconds':out['seconds'],'best':[{k:v for k,v in x.items() if 'hex' not in k} for x in rows[:3]]}))
