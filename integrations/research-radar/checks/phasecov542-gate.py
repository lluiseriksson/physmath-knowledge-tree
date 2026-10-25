"""Exact guardrail, not an additivity theorem or a new noise model."""
from fractions import Fraction as Q
from pathlib import Path
import json

if not __debug__:
    raise SystemExit('Refusing optimized Python: exact assertions are required.')

c,r,t=Q(3,5),Q(1,4),Q(1,5)
a,b=(1+r+t)/2,(1-r-t)/2
v,d=(1-r+t)/2,(1+r-t)/2
assert a+b==v+d==1
choi_det=a*d-c*c
pt_minor=b*v-c*c
assert min(a,b,v,d)>0 and choi_det>0
assert pt_minor<0
gap=r-c*c
assert gap<0 and t!=0
# Pure Bloch input: output radius squared = c^2(1-z^2)+(rz+t)^2.
# Its negative quadratic coefficient gives this exact global maximum.
zstar=r*t/(c*c-r*r)
assert -1<zstar<1
radius2=c*c+t*t+(r*t)**2/(c*c-r*r)
assert radius2==Q(243,595)<1
assert c*c*(1-zstar*zstar)+(r*zstar+t)**2==radius2
# X covariance fails already on maximally mixed input. The output difference
# is diag(t,-t), of trace distance |t|. This does not disprove all LOCC protocols.
assert t==Q(1,5)
report={'status':'PASS','convention':'Bloch (x,y,z)->(c*x,c*y,r*z+t)',
 'parameters':dict(c=str(c),r=str(r),t=str(t)),
 'unnormalized_choi_diagonal':list(map(str,[a,b,v,d])),
 'choi_2x2_block_determinant':str(choi_det),
 'partial_transpose_negative_minor':str(pt_minor),
 'davies_r_minus_c_squared':str(gap),
 'maximum_output_bloch_radius_squared':str(radius2),
 'maximizing_z':str(zstar),
 'X_covariance_trace_distance_witness':str(t),
 'conclusions':['CPTP with full-rank Choi','nonunital','not entanglement-breaking (NPT Choi)',
 'no pure output','outside Davies c^2<=r','fails usual X Pauli covariance'],
 'not_conclusions':['nonadditivity','failure of every teleportation simulation','sequential entanglement cost formula','novel channel'],
 'next_target':'A valid arbitrary-partner convex-roof entropy inequality for this explicit channel, or a certified violation. A single-use reduction and finite product tests do not settle this.'}
print(json.dumps(report,indent=2))
