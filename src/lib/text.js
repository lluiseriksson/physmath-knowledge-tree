// @ts-check

const SYMBOL_WORDS = new Map([
  ['α', 'alpha'], ['Α', 'alpha'], ['β', 'beta'], ['Β', 'beta'], ['γ', 'gamma'], ['Γ', 'gamma'],
  ['δ', 'delta'], ['Δ', 'delta'], ['ε', 'epsilon'], ['ϵ', 'epsilon'], ['Ε', 'epsilon'],
  ['ζ', 'zeta'], ['Ζ', 'zeta'], ['η', 'eta'], ['Η', 'eta'], ['θ', 'theta'], ['ϑ', 'theta'], ['Θ', 'theta'],
  ['ι', 'iota'], ['Ι', 'iota'], ['κ', 'kappa'], ['ϰ', 'kappa'], ['Κ', 'kappa'],
  ['λ', 'lambda'], ['Λ', 'lambda'], ['μ', 'mu'], ['Μ', 'mu'], ['ν', 'nu'], ['Ν', 'nu'],
  ['ξ', 'xi'], ['Ξ', 'xi'], ['ο', 'omicron'], ['Ο', 'omicron'], ['π', 'pi'], ['ϖ', 'pi'], ['Π', 'pi'],
  ['ρ', 'rho'], ['ϱ', 'rho'], ['Ρ', 'rho'], ['σ', 'sigma'], ['ς', 'sigma'], ['Σ', 'sigma'],
  ['τ', 'tau'], ['Τ', 'tau'], ['υ', 'upsilon'], ['Υ', 'upsilon'], ['φ', 'phi'], ['ϕ', 'phi'], ['Φ', 'phi'],
  ['χ', 'chi'], ['Χ', 'chi'], ['ψ', 'psi'], ['Ψ', 'psi'], ['ω', 'omega'], ['Ω', 'omega'],
  ['∂', 'partial'], ['∇', 'nabla'], ['∞', 'infinity'], ['∫', 'integral'], ['∑', 'sum'],
  ['∏', 'product'], ['√', 'sqrt'], ['ℏ', 'hbar'], ['ħ', 'hbar'], ['±', 'plus minus'],
  ['→', 'arrow'], ['↔', 'equivalence'], ['≈', 'approximately'], ['≠', 'not equal'], ['≤', 'less equal'], ['≥', 'greater equal'],
]);

const SYMBOL_PATTERN = new RegExp(`[${[...SYMBOL_WORDS.keys()].join('')}]`, 'gu');

/** Locale-independent lexical comparison suitable for deterministic generated artifacts. */
export function compareText(left, right) {
  const first = String(left ?? '');
  const second = String(right ?? '');
  return first < second ? -1 : first > second ? 1 : 0;
}

/** Normalize Latin text, Greek symbols and common mathematical notation for search. */
export function normalizeText(value) {
  return String(value ?? '')
    .replace(SYMBOL_PATTERN, (symbol) => ` ${SYMBOL_WORDS.get(symbol)} `)
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Compare display strings by normalized content, then by raw code-point order. */
export function compareNormalizedText(left, right) {
  return compareText(normalizeText(left), normalizeText(right))
    || compareText(left, right);
}
