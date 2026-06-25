# Reproducible Run Ledger

The Reproducible Run Ledger closes the gap between a research plan and an actual computation. It records commands, environment metadata, artifacts, logs and outcomes without promoting a graph claim or pretending that successful software execution is a mathematical proof.

Open `runs.html` from the deployed site or local development server.

## Boundary

The browser application is a local-first ledger and verifier. It does **not** execute commands, invoke a shell, modify canonical graph JSON or upload artifacts. Execution is an explicit CLI operation:

```bash
npm run run:record -- -- --id run.example --title "Example" --kind node -- node -e "console.log('ok')"
```

The extra separator is intentional: it is robust across npm and PowerShell configurations that otherwise consume one `--` layer.

## Run model

Each run contains:

```text
run
├── stable ID, title, kind and bounded status
├── canonical graph node IDs
├── command argument vector
├── repository-relative working directory
├── opt-in environment metadata
├── git/package/toolchain/platform provenance
├── start/end timestamps, duration, exit code, signal and timeout flag
├── input/output/log/report artifacts
│   ├── repository-relative path
│   ├── SHA-256
│   ├── byte count
│   └── media type
├── notes
└── SHA-256 fingerprint over the normalized record
```

Statuses are `planned`, `running`, `passed`, `failed`, `inconclusive` and `cancelled`. Kinds are `lean`, `node`, `python`, `shell`, `browser`, `simulation`, `symbolic` and `manual`.

A run is counted as reproducible by the UI only when it has a command vector, a run fingerprint and at least one artifact whose hash and size are recorded. That is a transport and replay-readiness criterion, not a validity score.

## Safe CLI execution

The CLI uses `child_process.spawn` with `shell: false`. Everything after the final `--` is passed as an argument vector. This avoids platform-dependent shell quoting and prevents the recorder from silently interpreting metacharacters.

The recorder also enforces:

- a default ten-minute timeout, bounded to at most 24 hours;
- a working directory inside the repository;
- repository-relative manifest, log and artifact paths;
- rejection of path traversal, absolute paths and symlink traversal;
- required existence and hashing of declared input artifacts before execution;
- post-run hashing of outputs and logs;
- atomic manifest publication;
- SIGTERM followed by SIGKILL escalation when a timed-out child does not exit;
- refusal to overwrite an existing manifest or log directory;
- explicit propagation of the child exit code unless `--no-propagate` is supplied.

The default `.run-ledger/` output directory is ignored by Git so logs and local manifests are not committed accidentally. Pass explicit `--manifest` and `--logs-dir` paths, or copy an exported packet, when a reviewed record should become a deliberate repository artifact.

A failing command still produces a `failed` manifest before the CLI exits with the child code. `--no-propagate` exists for exploratory campaigns that must retain the record while continuing an outer orchestration script.

## Environment privacy

Environment capture is opt-in:

```bash
npm run run:record -- -- \
  --id run.lean-build \
  --title "Lean build" \
  --kind lean \
  --env CI \
  --env LEAN_ABORT_ON_PANIC \
  -- lake build
```

Only named variables are recorded. Names suggesting passwords, tokens, credentials, cookies, authorization values, secrets or API keys are rejected. This is a defense-in-depth rule, not a guarantee that arbitrary non-sensitive-looking values are safe to publish. Review every manifest before sharing it.

## Artifacts

Inputs are hashed before the command. Outputs are hashed after the command when present. Missing declared outputs are retained with `sha256: null` and `bytes: null`, which makes partial or failed runs auditable instead of pretending they produced an artifact.

Example:

```bash
npm run run:record -- -- \
  --id run.graph-audit \
  --title "Regenerate graph audit" \
  --kind node \
  --node domain.foundation_logic \
  --artifact-in graph/nodes/core.json \
  --artifact-in graph/edges.json \
  --artifact-out graph/audit.json \
  --manifest .run-ledger/manifests/graph-audit.json \
  -- npm run generate:audit
```

Standard output and standard error are written as separate log artifacts and hashed after the process closes.

## Dry-run plans

A planned manifest can be created without running anything:

```bash
npm run run:record -- -- \
  --id run.future-proof \
  --title "Future bounded proof" \
  --kind lean \
  --node bridge.appendix_f_target_sensitive \
  --dry-run \
  -- lake env lean Experiments/FutureProof.lean
```

Dry runs have status `planned`, no start/end execution timestamps and no log artifacts. The plan itself is fingerprinted.

## Browser workflow

The browser surface supports:

- creating and editing plans or imported outcomes;
- linking runs to canonical node IDs;
- filtering by text, status, kind and graph node;
- marking selected runs inconclusive without deleting them;
- fingerprinting a normalized local record;
- verifying a stored fingerprint;
- importing a single CLI manifest or a complete ledger;
- merging by stable run ID and newest `updated_at` value;
- exporting a selected fingerprinted run packet.

Changing a fingerprinted record clears its fingerprint. The next export therefore exposes that the record needs to be signed again.

## Portable formats

A ledger uses:

```json
{
  "application": "PhysMath Knowledge Tree",
  "schema_version": 1,
  "updated_at": "2026-06-25T12:00:00.000Z",
  "runs": []
}
```

A CLI manifest uses `kind: "reproducible-research-run"` and contains one normalized run. A selected browser export uses `kind: "research-run-packet"` and adds a packet-level SHA-256.

Imports are limited to 2 MB and 500 runs. Unknown canonical node IDs are discarded when a ledger is normalized against a newer graph, preventing stale IDs from being presented as current scope.

## Relationship to other surfaces

- **Workbench:** defines the research scope, mechanism, drafts and negative results.
- **Evidence Review:** records whether cited sources were actually checked.
- **Change Review:** governs risky canonical graph changes.
- **Lean Target Audit:** checks imports and declaration names against a toolchain.
- **Dossiers:** assemble the current research handoff.
- **Run Ledger:** records the concrete computations and artifacts produced while pursuing that handoff.

A future dossier revision can consume exported run packets as another readiness gate. This initial release keeps the ledger independent so it cannot silently mutate existing workspaces or dossiers.

## Verification

The pure model is covered at 100% line, branch and function coverage. CLI tests execute success and failure commands, verify exit propagation, hashes, logs, dry runs and unsafe-input rejection. A real Chromium-family smoke creates, fingerprints, verifies and bulk-classifies a run in English and Spanish.
