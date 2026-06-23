# Evidence-aware route planner

The canonical research graph has a dependency-free command-line planner that can optimize for evidence quality as well as raw hop count.

```bash
npm run route:plan -- domain.number_theory problem.riemann_hypothesis
npm run route:plan -- domain.quantum_field_theory problem.yang_mills_mass_gap \
  --policy strongest --allow formal,literature --directed
npm run route:plan -- domain.analysis problem.navier_stokes \
  --compare --format json --output route-comparison.json
```

## Policies

- `shortest` minimizes edge count, then uses evidence strength as a deterministic tie-breaker.
- `balanced` minimizes cumulative evidence risk plus route length.
- `strongest` minimizes the weakest evidence class first, then cumulative risk and route length.

The evidence order is `formal`, `literature`, `heuristic`, `speculative`. It is a navigation policy, not a theorem and not an automatic promotion of any edge. Markdown output carries that warning explicitly and retains edge IDs, mechanisms, confidence labels and deduplicated references.

`--compare` evaluates all three policies against the same constraints and emits the alternatives side by side. JSON results include the direction flag, hard confidence gate and edge ceiling so a route can be reproduced without reconstructing command-line state.

## Reproducibility and safety controls

- `--directed` respects source-to-target orientation.
- `--allow` is a hard evidence gate rather than a score preference.
- `--max-edges` sets a finite route budget.
- Cycles are pruned by a Pareto frontier over hop count, maximum evidence risk and cumulative risk; an oversized budget is clamped to the maximum useful simple-path length.
- Invalid policy, confidence and numeric limit options fail explicitly instead of silently changing the objective.
- Equal-scoring paths are resolved by stable node and edge IDs, never by host locale.
- `--max-states` provides a deterministic safety ceiling for non-canonical fixtures.

The browser interface uses the same planner and stores source, target, policy, evidence gate and direction in canonical URL state. Unrelated campaign parameters and URL fragments are preserved.

Alternate JSON fixtures can be supplied with `--nodes` and `--edges`. This supports tests and downstream research-agent workflows without mutating canonical graph data. Committed evaluation scenarios remain a separate regression layer and are not silently rewritten by ad-hoc planner output.
