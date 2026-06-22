## Problem

Describe the research-graph, formalization, learner, content, engineering,
accessibility, or maintenance problem.

## Solution

Explain the chosen change, affected canonical files, confidence/evidence decisions,
and important trade-offs.

## Validation

- [ ] `npm run check` passes locally.
- [ ] New or changed behavior has automated test coverage.
- [ ] Generated views were refreshed with `npm run generate:views` when `graph/` changed.
- [ ] `lake build --wfail` passes when Lean sources or Lean metadata changed, or the PR explains why CI is the first available Lean environment.
- [ ] Research graph and list views were checked when applicable.
- [ ] Learning graph and list views were checked when applicable.
- [ ] Keyboard navigation, visible focus, and reduced-motion behavior were checked for UI changes.
- [ ] English and Spanish learner-visible content remain complete.
- [ ] New research claims name evidence, confidence, mechanism, and a falsifier where appropriate.
- [ ] No secrets, personal exports, `.lake/`, or generated dependency folders are included.

## Visual evidence

Add desktop and mobile screenshots for user-interface changes.

## Knowledge rationale

For graph or curriculum changes, explain why each node or edge belongs, identify
what structure is preserved, and cite reviewable sources in the discussion.

## Lean impact

List changed imports/declarations, the smallest proved target, and any known
formalization gap. Write “none” when the change has no Lean impact.
