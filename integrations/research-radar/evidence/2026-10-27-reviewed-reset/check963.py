"""High-precision finite consistency checks for a prior Gramian asymptotic.
No universal numerical certificate or novelty evidence.
"""
import json, math
from pathlib import Path
import mpmath as mp
import sympy as sp

mp.mp.dps = 120
rows = []
for d in range(2, 7):
    energies = [mp.mpf(j*j+j) / 3 for j in range(d)]
    v = mp.matrix([j+1 for j in range(d)])
    v /= mp.norm(v)
    frame = []
    heights = []
    for j in range(d):
        w = mp.matrix([energies[k]**j * v[k] for k in range(d)])
        for q in frame:
            w -= q * (q.H*w)[0]
        height = mp.norm(w)
        assert height > 0
        heights.append(height)
        frame.append(w/height)
    g = mp.mpf(7)/10
    m = d-1
    coefficient = g*heights[m]**2/(math.factorial(m)**2*(2*m+1)*math.comb(2*m,m)**2)
    for exponent in (2, 3, 4, 5):
        t = mp.mpf(10)**(-exponent)
        S = mp.matrix(d)
        for i in range(d):
            for j in range(d):
                z = g + 1j*(energies[i]-energies[j])
                S[i,j] = g*(-mp.expm1(-z*t))/z*v[i]*v[j]
        eig = mp.eighe(S, eigvals_only=True)
        mu = eig[0]
        assert mu > 0
        ratio = mu/(coefficient*t**(2*d-1))
        # Prior Theorem1 also predicts relative first correction -g*t/2.
        corrected_residual = (ratio-1+g*t/2)/t**2
        lam = mp.exp(-g*t)
        eta = lam**2/(lam+mu)
        gap_ratio = ((lam-eta)/(coefficient*t**(2*d-1)))
        rate = -mp.log(eta)/t
        rows.append(dict(d=d,t=str(t),mu=mp.nstr(mu,40),coefficient=mp.nstr(coefficient,40),
                         normalized_mu=mp.nstr(ratio,40),
                         corrected_residual=mp.nstr(corrected_residual,40),
                         normalized_information_gap=mp.nstr(gap_ratio,40),
                         finite_time_rate=mp.nstr(rate,40)))
        if exponent == 5:
            assert abs(ratio-1) < mp.mpf('0.00001')
            assert abs(gap_ratio-1) < mp.mpf('0.00001')
            assert abs(rate-g) < mp.mpf('0.000001')
hilbert=[]
for d in range(1,11):
    J=sp.Matrix(d,d,lambda i,j:sp.Rational(1,i+j+1))
    actual=J.inv()[d-1,d-1]
    expected=(2*d-1)*math.comb(2*d-2,d-1)**2
    assert actual==expected
    hilbert.append(dict(d=d,inverse_bottom=int(actual)))
out=dict(scope='20 high-precision finite diagnostics and10 exact Hilbert identities; not proof or review',
         decimal_precision=120,gramian_cases=rows,hilbert_exact=hilbert,failures=0,
         frozen957_modified=False)
Path(__file__).with_name('CHECK963.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(gramian_cases=len(rows),hilbert_exact=len(hilbert),failures=0)))
