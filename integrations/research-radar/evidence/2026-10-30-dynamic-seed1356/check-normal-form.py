import json
import pathlib
import sympy as S

d, s, mu, omega = S.symbols('d s mu omega', real=True)
r2 = d*d+s*s
fd = (mu-r2)*d-omega*s
fs = omega*d+(mu-r2)*s
assert S.expand(d*fd+s*fs-(mu*r2-r2*r2)) == 0
assert S.expand(d*fs-s*fd-omega*r2) == 0
assert S.expand(fd.subs({d:-d,s:-s}, simultaneous=True)+fd) == 0
assert S.expand(fs.subs({d:-d,s:-s}, simultaneous=True)+fs) == 0
a,b,t,p0 = S.symbols('a b t p0', positive=True)
star = a/(a+b)
p = star+(p0-star)*S.exp(-(a+b)*t)
assert S.simplify(S.diff(p,t)-(a*(1-p)-b*p)) == 0
out = {
    'sympy_version':S.__version__,
    'all_exact_algebraic_assertions_passed':True,
    'radial_squared_derivative':'2*mu*r^2-2*r^4',
    'phase_derivative':'omega when r>0',
    'half_turn_equivariance':True,
    'positive_conversion_markov_solution':'p*=a/(a+b); p(t)=p*+(p0-p*)exp(-(a+b)t)',
    'scope':'Known-model identities only. No natural-system fit, novel theorem, manuscript score or formal Lean proof.'
}
pathlib.Path(__file__).with_name('CHECK1354.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(out))
