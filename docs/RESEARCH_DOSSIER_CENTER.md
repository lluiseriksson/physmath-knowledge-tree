# Research Dossier Center

The Research Dossier Center is a local-first integration layer for the four
review tools that accompany the canonical research graph. It combines one
Research Workbench campaign with the evidence, canonical-change and Lean-target
records that apply to its selected nodes.

Open `dossiers.html` from the deployed site or the local development server.

## Purpose

The repository intentionally keeps working notes and human review decisions
outside canonical graph JSON. That separation prevents a browser-local note from
silently becoming a scientific claim. The dossier center preserves the boundary
while producing one portable handoff that answers:

- which canonical nodes and induced edges define the campaign;
- which source-bearing references still need review;
- which Lean imports and declaration names remain unaudited or broken;
- which high-risk canonical changes touch the scope;
- which falsifiers, negative results and next tests have been recorded;
- what must happen before the campaign is ready for deliberate repository review.

## Inputs

The browser reads canonical graph files plus four existing local stores:

```text
graph/nodes/core.json                 canonical nodes
graph/edges.json                      canonical edges
graph/reference-registry.json         URL-level evidence registry
Research Workbench                    campaign scope, notes and results
Evidence Review Center                source-review ledger
Canonical Change Review               baseline, changes and decisions
Lean Target Audit                     import/declaration audit ledger
```

The center reads those stores but never writes them. Its only persistent browser
settings are the selected workspace and interface preferences.

## Scope rules

A dossier starts from the selected workspace's stable node IDs. Its graph scope
contains those nodes and only edges whose two endpoints are selected. Evidence is
included when the canonical reference registry says that a URL is used by one of
those nodes or induced edges. Lean items are included when they belong to a
selected node. Change-review entries are included when they modify a selected
node, an induced edge, a collection or research move that names a selected node,
or a high/critical graph-contract field.

These are retrieval rules. Inclusion does not imply relevance, correctness or
approval.

## Readiness gates

The generated dossier reports six bounded gates:

1. **Scope** — at least one canonical node is selected.
2. **Mechanism** — notes or a bridge-card draft state the intended transfer.
3. **Falsifiability** — a falsifier or next discriminating test is recorded.
4. **Evidence** — source-bearing references are locally reviewed and none is
   marked superseded.
5. **Lean names** — imports and declaration candidates are verified or have an
   explicit replacement.
6. **Canonical changes** — relevant high/critical changes have terminal review
   decisions.

Gate states are `ready`, `attention`, `blocked` or `not-applicable`. They measure
local handoff completeness, not scientific truth or theorem status.

## Portable dossier

JSON export contains:

```text
research dossier
├── graph identity
├── complete normalized workspace
├── selected nodes and induced edges
├── references with local evidence reviews
├── Lean items with local audit records
├── relevant canonical changes with decisions
├── readiness gates and prioritized open actions
└── SHA-256 content fingerprint
```

The fingerprint covers the graph identity, workspace, scoped canonical content,
review material and readiness result. It deliberately excludes the export time,
so the same content generates the same fingerprint. Import verifies the
fingerprint and rejects tampering.

Markdown export is intended for issues, pull requests and agent handoffs. It
contains the same safety boundary and never substitutes for the JSON artifact
when machine verification is required.

## Command-line generation

Export the workspace library from the Workbench, then run:

```bash
npm run dossier:build -- -- --workspace-file workspaces.json \
  --evidence-file evidence-ledger.json \
  --lean-file lean-audit.json \
  --changes-file change-review.json \
  --output research-dossier.json \
  --markdown-output research-dossier.md
```

On npm/PowerShell setups that preserve an additional separator, the robust form
shown above includes both `--` tokens. `--generated-at` can fix the display date
for reproducible fixtures; it does not affect the content fingerprint.

The CLI reads canonical files and portable exports. It never modifies the graph
or any local ledger.

## Interpretation boundary

A dossier marked `ready` means only that the configured local gates are
satisfied. It does not:

- promote a graph confidence level;
- verify that a publication proves a graph claim;
- prove a Lean target or the mathematical statement around it;
- accept a canonical change;
- publish workspace material into the repository.

Every promotion remains an explicit, reviewable repository change.

## Verification

`tests/research-dossier.test.mjs` covers the model and fingerprint boundary with
100% line, branch and function coverage. Product and CLI tests check the CSP,
read-only architecture, deterministic outputs and command validation. A focused
Chromium smoke exercises workspace selection, integrated rendering, bilingual
controls, persistence boundaries and JSON/Markdown export behavior.
