"""Replay the small modular-sphere counterexample; no source theorem is refuted."""
import json
from pathlib import Path

record = json.loads(Path(__file__).with_name("FALSIFIER1238.json").read_text())
prime = record["prime"]
points = record["sphere_points"]
assert prime == 5 and len({tuple(point) for point in points}) == 5
assert all(sum(value * value for value in point) % prime == 1 for point in points)
assert all((points[0][i] - 2 * points[1][i] + points[2][i]) % prime == 0 for i in range(3))
first, second = record["ternary_words"]
assert all(0 <= value < 3 for word in (first, second) for value in word)
assert sum(first) == sum(second) == 2
assert sum(a != b for a, b in zip(first, second)) == 3
for coordinate in range(3):
    assert sum((a - b) * points[j][coordinate] for j, (a, b) in enumerate(zip(first, second))) % prime == 0
print("Exact modular-sphere shortcut counterexample verified; source real-lift hypotheses retained.")
