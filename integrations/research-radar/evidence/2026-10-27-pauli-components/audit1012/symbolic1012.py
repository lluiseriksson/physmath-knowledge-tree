import sympy as s,json,pathlib,itertools
P=pathlib.Path(__file__).parent;e=s.symbols('e',positive=True);z=s.Symbol('z');th,l=s.symbols('theta lambda',real=True);A,u,v=s.symbols('A u v',real=True);B=1-A
checks={};forms={}
def chk(k,expr):checks[k]=bool(s.simplify(expr)==0)
def ptr(x):return s.Matrix(3,3,lambda i,j:x[i,j]+x[i+3,j+3])
def E(x):return s.kronecker_product(s.eye(2)/2,ptr(x))
def pt(x):return s.Matrix(6,6,lambda i,j:x[3*(j//3)+i%3,3*(i//3)+j%3])
a=s.Matrix([1,0,0,0,e,0]);b=s.Matrix([0,e,0,0,0,1]);sig=(a*a.T+b*b.T)/(2*(1+e*e));base=E(sig);d=s.zeros(6)
for i,j,w in [(0,4,1),(4,0,1),(4,4,2*e),(1,1,-2*e),(1,5,-1),(5,1,-1)]:d[i,j]=w
p=2*sig;q=s.eye(6)-p
checks['projector']=s.simplify(p*p-p)==s.zeros(6);checks['partial_trace']=ptr(d)==s.zeros(3);checks['kernel_kernel_zero']=s.simplify(q*d*q)==s.zeros(6)
# Generalized characteristic polynomial avoids all square-root whitening conventions.
chk('whitening_generalized_characteristic',s.factor((sig-z*base).det()/base.det())-z**4*(z-3)**2)
mix=(1-th)*base+th*sig
chk('mixed_generalized_characteristic',s.factor((mix-z*base).det()/base.det())-(z-1-2*th)**2*(z-1+th)**4)
Q=s.diag(1,0,0,0,1,0);checks['unitary_obstruction_commutant']=s.simplify(Q*mix-mix*Q)==s.zeros(6);chk('unitary_obstruction_nonzero_trace',s.trace(Q*d)-2*e)
Y=s.kronecker_product(s.Matrix([[0,-s.I],[s.I,0]]),s.eye(3));checks['qubit_reduction_equals_transpose']=s.simplify(Y*pt(mix)*Y-(2*E(mix)-mix))==s.zeros(6)
for ix in [[1,3],[2,4]]:chk('PPT_block_'+str(ix),pt(mix).extract(ix,ix).det()-e*e*(1-th-2*th**2)/(8*(1+e*e)**2))
# Reconstruct channel blocks directly, rather than trust supplied block matrices.
ps=[s.eye(2),s.Matrix([[0,1],[1,0]]),s.Matrix([[0,-s.I],[s.I,0]]),s.diag(1,-1)];w=[(A+u)/2,(B+v)/2,(B-v)/2,(A-u)/2];us=[s.kronecker_product(x,s.eye(3)) for x in ps]
N=lambda x:s.simplify(sum((wi*ui*x*ui.conjugate().T for wi,ui in zip(w,us)),s.zeros(6)))
M=s.simplify(2*(1+e*e)*N(sig).extract([0,4,2],[0,4,2]));T=N(d).extract([0,4,2],[0,4,2]);forms['M']=str(M);forms['T']=str(T)
k=1-u*u/A-v*v/B;chk('M_determinant',M.det()-A*B*e*e*k)
# Solve leading six-entry Sylvester equations after scaling only Y22 by 1/e.
x,y,c,aa,bb,zz=s.symbols('x y c aa bb zz');H=s.Matrix([[aa,x,zz],[x,c/e,y],[zz,y,bb]]);res=M*H+H*M-4*(1+e*e)*T
sol=s.solve([res[0,0],res[2,2],res[0,2]],[aa,bb,zz]);rem=[s.factor(res[i,j].subs(sol)/(e if (i,j)==(1,1) else 1)) for i,j in [(0,1),(1,2),(1,1)]]
lead=[s.factor(vv.subs(e,0)) for vv in rem];solution=s.solve(lead,[x,y,c]);limit=s.factor((u*x-v*y+(2*A-1)*c).subs(solution)/4);h=1-16/sum(1/ww for ww in w);chk('Pauli_lower_harmonic',limit-h);forms['limiting_equations']=list(map(str,lead));forms['limit']=str(limit)
# Envelope vertices and endpoints, using all eight vertices explicitly.
t=s.symbols('t',positive=True);vertex=[]
for signs in itertools.product([-1,1],repeat=3):
 a1,b1,c1=[t*j for j in signs];ws=[(1+a1+b1+c1)/4,(1+a1-b1-c1)/4,(1-a1+b1-c1)/4,(1-a1-b1+c1)/4];vertex.append({'signs':signs,'S':str(s.factor(sum(1/ww for ww in ws)))})
Splus=16*(1+2*t)/((1+3*t)*(1-t));Sminus=16*(1-2*t)/((1-3*t)*(1+t));chk('envelope_vertex_difference',Sminus-Splus-192*t**3/((1-9*t*t)*(1-t*t)));chk('envelope_upper',1-16/Sminus-3*t*t/(1-2*t));forms['vertices']=vertex
out={'method':'Own exact generalized eigenvalue determinants, direct channel block construction and leading full Sylvester equations','checks':checks,'forms':forms,'all_passed':all(checks.values())};(P/'SYMBOLIC1012.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps({'all_passed':all(checks.values()),'checks':checks},indent=2));assert all(checks.values())
