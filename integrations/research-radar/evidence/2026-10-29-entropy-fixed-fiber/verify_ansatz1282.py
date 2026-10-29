from fractions import Fraction as Q
from pathlib import Path
import json
h=Q(1,10);r=Q(3,5);k=(1+r*r)/(1-r*r)
def F(x,y):return (x*x+y*y)**2+4-8*k*x*y
xs=[1-h,Q(1),1+h]
vals=[F(x,Q(1)) for x in xs]
assert all(v<0 for v in vals)
# Pick off-diagonal realpart=2+2xy;imagpart=x^2-y^2-c^2+1.
real_gap=(2+2)-((2+2*xs[0])+(2+2*xs[2]))/2
imag_gap=0-((xs[0]**2-1)+(xs[2]**2-1))/2
assert real_gap==0 and imag_gap==-h*h
midpoint_gap_det=-(imag_gap**2)
assert midpoint_gap_det==-Q(1,10000)<0
c=Q(2);eps=Q(1,2)
assert 0<eps<min(c,Q(1))
anti=eps*(1/c-1)/2
assert anti==-Q(1,8)!=0
out={'scope':'Exact ansatz-specific falsifiers, not a fulljointlift impossibility ornewpaper','matrix_concavity_guard':{'r':'3/5','c':1,'y':1,'h':str(h),'x_values':list(map(str,xs)),'feasible_quartics':list(map(str,vals)),'offdiagonal_midpoint_gap_real':str(real_gap),'offdiagonal_midpoint_gap_imag':str(imag_gap),'gap_determinant':str(midpoint_gap_det),'PSD':False},'anisotropic_normalization_guard':{'c':str(c),'epsilon':str(eps),'antiholomorphic_coefficient':str(anti),'normalization_preserves_analyticity':False},'fulljointlift_impossibility':False,'decision':'Park pending a concrete new affine mechanism or exact applicable primary theorem'}
Path(__file__).with_name('CONTROL1282.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Feasible midpoint matrix-concavity and anisotropic-normalization guards passed.')
