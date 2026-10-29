"""A known-method obstruction: five ternary differences with only two moments."""
from pathlib import Path
import json
import sympy as s

C = Path(__file__).parent
t = s.symbols("t", real=True)
denominator = t * t + 2
locators = [t * (t + 2) / denominator, t * (t - 2) / denominator, 2 / denominator, s.Integer(0), s.Integer(1)]
weights = [1, 1, 2, -2, -2]
identities = [s.factor(sum(c * x**k for c, x in zip(weights, locators))) for k in range(3)]
assert identities == [0, 0, 0]
assert s.diff(locators[0], t) != 0
third_moment = s.factor(sum(c * x**3 for c, x in zip(weights, locators)))
assert third_moment != 0
first_word, second_word = [1, 1, 2, 0, 0], [0, 0, 0, 2, 2]
assert sum(first_word) == sum(second_word) == 4
assert sum(a != b for a, b in zip(first_word, second_word)) == 5
examples = []
for parameter in range(3, 8):
    points = [s.cancel(x.subs(t, parameter)) for x in locators]
    assert len(set(points)) == 5
    finite_field = [int(s.numer(x)) * pow(int(s.denom(x)), -1, 101) % 101 for x in points]
    assert len(set(finite_field)) == 5
    assert all(sum(c * x**k for c, x in zip(weights, finite_field)) % 101 == 0 for k in range(3))
    examples.append({"parameter": parameter, "rational_locators": [str(x) for x in points], "locators_mod101": finite_field})
result = {
    "source": "arXiv2610.19960v1, selected Section6.4 second weight pattern and Section7.1 limitation",
    "reading_scope": "Selected equations/limitation read; not a full construction-proof audit",
    "symbolic_parameterization": [str(x) for x in locators],
    "weights": weights,
    "moments0to2_identically_zero": True,
    "third_moment_not_identically_zero": str(third_moment),
    "example_words": [first_word, second_word],
    "Hamming_distance": 5,
    "examples": examples,
    "rejected_route": "Delete one moment at target distance6 and reuse the finite exceptional-shape elimination unchanged",
    "boundary": "This is a rational one-parameter collision family, not a counterexample to the original three-moment construction, its geometric locator restrictions, or unrestricted distance6 codes. The paper already identifies positive-dimensional families as a method barrier.",
    "new_paper": False,
    "new_grade": False,
    "novelty_claim": False,
}
integer_locators = [15, 3, 2, 0, 11]
assert all(sum(c * x**k for c, x in zip(weights, integer_locators)) == 0 for k in range(3))
differences = [abs(a - b) for j, a in enumerate(integer_locators) for b in integer_locators[:j]]
exceptional_primes = sorted({11} | {int(p) for value in differences for p in s.factorint(value)})
assert exceptional_primes == [2, 3, 5, 11, 13]
third_integer_moment = sum(c * x**3 for c, x in zip(weights, integer_locators))
assert third_integer_moment == 756
result["uniform_prime_choice_obstruction"] = {
    "integer_locators": integer_locators,
    "exceptional_primes": exceptional_primes,
    "claim": "For every prime p>13 and every extension degree m>=1, these five base-field locators are distinct and give the same ternary collision under symbol sum and two moments. Prime selection alone cannot make the whole field a distance6 locator set for this checksum scheme.",
    "proof": "The first three weighted integer moments vanish exactly; pairwise differences have prime factors only2,3,5,11,13. Division by11 gives the displayed normalized rational family point. These identities survive reduction and base-field inclusion.",
    "third_moment": third_integer_moment,
    "third_check": "Its only prime factors are2,3,7, so the third moment excludes this collision for every p>13.",
    "scope": "Whole-field two-moment shortcut only; not a lower bound for restricted locator sets or all nonlinear codes. Known source obstruction mechanism, no new-paper claim.",
}
(C / "TWO-MOMENT1240.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8", newline="\n")
print("Symbolic collision family and five finite-field instances verified; known method barrier retained.")
