from fractions import Fraction as F
import pathlib,json
cases=[]
for name,lo,hi,r,t,Qmax in [('N',F(11,20),F(3,5),F(1,4),F(1,5),F(243,595)),('Q',F(1,2),F(11,20),F(1,5),F(1,10),F(13189,42000))]:
 amin,amax=lo*lo-r*r,hi*hi-r*r
 lhs=(amax+abs(r*t))**2;rhs=amin*(1-Qmax)
 corner=((1+r)**2-t*t)/4-hi*hi
 pt=((1-r)**2-t*t)/4-lo*lo
 if not (amin>0 and corner>0 and pt<0 and lhs<=rhs and lo*lo>r):raise RuntimeError('family hypothesis failed')
 cases.append(dict(name=name,transverse_interval=[str(lo),str(hi)],r=str(r),t=str(t),Amin=str(amin),Amax=str(amax),Qmax=str(Qmax),Choi_corner_lower=str(corner),PT_minor_upper=str(pt),phase_order_slack=str(rhs-lhs)))
margin=(F(11,20)**2+F(1,2)**2)/2-F(27,100)
if margin!=F(1,160):raise RuntimeError('margin failed')
out=dict(status='PASS',cases=cases,margin_nats=str(margin),scope='Uniform rational hypotheses and margin only; full metric certificate and analytic chain separate.')
pathlib.Path(__file__).with_suffix('.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,indent=2))
