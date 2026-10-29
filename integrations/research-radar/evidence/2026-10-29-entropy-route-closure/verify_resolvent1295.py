from fractions import Fraction as F
from pathlib import Path
import json
def add(A,B):return[[a+b for a,b in zip(r,s)]for r,s in zip(A,B)]
def sub(A,B):return add(A,scale(B,F(-1)))
def scale(A,t):return[[t*a for a in r]for r in A]
def mul(A,B):return[[sum(a*b for a,b in zip(r,c))for c in zip(*B)]for r in A]
def transpose(A):return list(map(list,zip(*A)))
def trace(A):return sum(A[i][i]for i in range(2))
def determinant(A):return A[0][0]*A[1][1]-A[0][1]*A[1][0]
def inv(A):
 q=determinant(A);assert q
 return scale([[A[1][1],-A[0][1]],[-A[1][0],A[0][0]]],1/q)
E=[[F(1),F(0)],[F(0),F(1)]]
p=F(1,2);d=F(9,25);e=1-d;k=F(3,10);sd=F(12,25)
Q=[[F(3,5),k],[k,F(2,5)]]
A=[[F(19,80),F(0)],[k,F(21,80)]]
assert determinant(Q)==F(3,20)
def density(t):
 Rd=inv(add(scale(Q,d),scale(E,t)))
 Re=inv(add(scale(Q,e),scale(E,t)))
 t11=trace(mul(mul(mul(Rd,A),Re),transpose(A)))
 t22=trace(mul(mul(mul(Rd,transpose(A)),Re),A))
 t12=trace(mul(mul(mul(Rd,A),Re),A))
 t21=trace(mul(mul(mul(Rd,transpose(A)),Re),transpose(A)))
 assert t12==t21
 f0=1/((d+t)*(e+t))
 l0=1/determinant(add(Q,scale(E,t)))
 return [[k*k*l0+e*(p*f0-t11),sd*(p*f0-t12)],
         [sd*(p*f0-t12),k*k*l0+d*(p*f0-t22)]]
t=F(1,100)
W=density(t)
assert W[0][0]<0
out={'scope':'Exact rational falsifier of one common-unscaled-resolvent pointwise-PSD proof ansatz, NOT of the integrated local kernel M or entropy Q.',
 'p':str(p),'d':str(d),'t':str(t),'Q':[[str(x)for x in row]for row in Q],
 'A':[[str(x)for x in row]for row in A],
 'density_W':[[str(x)for x in row]for row in W],
 'negative_rayleigh_vector':['1','0'],'negative_rayleigh_value':str(W[0][0]),
 'determinant':str(determinant(W)),
 'continuous_interval':'All denominators are strictly positive at t=1/100, so the negative entry persists on some positive-length t-neighborhood.',
 'no_entropy_or_global_sign_inferred':True,
 'disposition':'Pointwise positivity of this unscaled density is false. Other decompositions/reparameterizations/cancellations remain possible. Stop this bounded product-base local-instability route rather than start another minor ansatz cycle.'}
Path(__file__).with_name('OBSTRUCTION1295.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8',newline='\n')
print('Common-resolvent density has a strictly negative rational Rayleigh value at p=1/2,d=9/25,t=1/100.')
print('Negative entry:',W[0][0])
