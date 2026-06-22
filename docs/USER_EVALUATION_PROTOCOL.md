# User-evaluation protocol

No user-study results are claimed in this repository. This protocol defines a reproducible future study and keeps the absence of external evidence explicit.

## Research questions

1. Does the graph reduce the time required to identify a defensible cross-domain route?
2. Do evidence labels and scoped references reduce overstatement of heuristic links?
3. Do bounded Lean targets help users formulate a next formal task?
4. Can another user reproduce the same route from a shared scenario identifier?

## Participants

Recruit at least three groups and report them separately:

- graduate students in mathematics or mathematical physics;
- researchers with relevant domain experience;
- Lean users with theorem-proving experience.

Record only coarse experience bands unless a participant explicitly consents to richer demographic data.

## Tasks

Use the five scenarios in `evaluation/scenarios.json`. For each participant, randomize whether the first task is completed with the repository or with their usual search workflow. Ask them to:

1. identify a route from the stated question to a bounded next step;
2. mark every step as established, heuristic or speculative;
3. identify at least one source for each established mechanism;
4. state one possible failure mode;
5. formulate a computation or Lean target that could be attempted next.

## Measures

Collect:

- completion time;
- number of unsupported claims;
- number of correctly classified evidence labels;
- route reproducibility by a second participant;
- task completion on a predefined rubric;
- 1–5 ratings for usefulness, clarity, trust and cognitive load;
- free-text comments and observed failure modes.

Report medians and distributions, not only means. Keep pilot data separate from confirmatory results.

## Success criteria

The protocol treats the repository as useful when it improves at least one operational measure without degrading evidence classification. A shorter route is not automatically better if it introduces unsupported claims.

## Privacy and transparency

- Do not collect names in the evaluation dataset.
- Obtain informed consent appropriate to the institution and study setting.
- Publish the task script, anonymized aggregate data, analysis code and deviations from this protocol.
- Record negative and null findings.
- Do not retroactively redefine success criteria after inspecting results.
