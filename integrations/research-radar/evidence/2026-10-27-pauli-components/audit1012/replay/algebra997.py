from pathlib import Path
import sympy as s,json
p=Path(__file__).parent;A,u,v=s.symbols('A u v',real=True);B=1-A;z=2*A-1
U=u*u/A;V=v*v/B;k=1-U-V
candidate=s.factor(U+V+(z-U+V)**2/k)
weights=[(A+u)/2,(B+v)/2,(B-v)/2,(A-u)/2]
h=s.factor(1-16/sum(1/w for w in weights))
diff=s.factor(candidate-h)
print(json.dumps(dict(candidate=str(candidate),harmonic=str(h),difference=str(diff))))
assert diff==0
(p/'ALGEBRA997.json').write_text(json.dumps(dict(scope='Exact scalar identity for a proposed ladder limit; full asymptotic operator derivation remains to be checked',candidate=str(candidate),harmonic=str(h),difference=str(diff),verified=True),indent=2)+'\n',encoding='utf-8')
