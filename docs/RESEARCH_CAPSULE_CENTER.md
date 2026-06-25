# Research Capsule Center

The Research Capsule Center combines one fingerprinted research dossier with selected reproducible-run manifests. It creates a portable handoff whose dossier, execution records, artifact metadata and readiness decisions share one deterministic SHA-256 fingerprint.

Open `capsules.html` from GitHub Pages or the local development server.

## Why a capsule is separate from a dossier

A dossier records the intended campaign: canonical scope, working mechanism, evidence review, Lean-name audit and canonical-change governance. A run manifest records what actually executed. The capsule binds those layers without rewriting either source.

The capsule answers bounded questions:

- Did the imported dossier fingerprint verify?
- Which run manifests are linked to its canonical node scope?
- Do the selected run fingerprints verify?
- Are terminal artifacts content-addressed with SHA-256 and byte counts?
- Did selected executions pass, fail, time out or remain inconclusive?
- Which dossier nodes have execution coverage?
- Are git-commit and toolchain identifiers present?

A ready capsule is a reproducibility handoff. It is not a proof, novelty judgment, scientific validation or automatic graph-confidence promotion.

## Capsule model

```text
research capsule
├── verified source dossier
├── selected run wrappers
│   ├── complete run manifest
│   ├── scope-linked canonical node IDs
│   ├── fingerprint presence and verification
│   └── artifact-completeness result
├── verification summary
│   ├── dossier fingerprint
│   ├── selected run IDs
│   ├── artifact count and path variants
│   └── commit/toolchain/platform sets
├── readiness gates
└── capsule content fingerprint
```

The generated timestamp is excluded from the content fingerprint. Rebuilding from the same dossier and run records therefore produces the same fingerprint.

## Readiness gates

Seven bounded gates are evaluated:

1. **Dossier readiness** — carries forward ready, attention or blocked state.
2. **Run selection** — requires at least one selected run and reports unlinked supplemental runs.
3. **Run fingerprints** — blocks invalid fingerprints and flags missing ones.
4. **Artifact integrity** — checks terminal-run hashes, byte counts and path variants.
5. **Execution outcome** — blocks failed or timed-out runs and flags unresolved outcomes.
6. **Scope coverage** — reports which dossier nodes have selected execution evidence.
7. **Execution provenance** — checks git-commit and toolchain metadata.

The overall state is blocked when any gate is blocked, attention when no gate is blocked but at least one needs attention, and ready otherwise.

## Browser workflow

1. Export a dossier from `dossiers.html`.
2. Record or import runs in `runs.html`.
3. Open `capsules.html` and import the dossier.
4. Reload the local run ledger or import portable run JSON.
5. Select scope-linked runs and build the capsule.
6. Export JSON or Markdown.

The browser verifies metadata and fingerprints. It never executes commands or reads arbitrary local artifact paths.

## CLI build

```bash
npm run capsule:build -- -- \
  --dossier-file exports/dossier.json \
  --run-file .run-ledger/manifests/run-a.json \
  --run-file .run-ledger/manifests/run-b.json \
  --output .run-ledger/capsules/campaign.json
```

Use repeated `--run <id>` arguments to select explicit runs. Without them, every run linked to the dossier scope is selected.

## CLI verification

Metadata and fingerprints only:

```bash
npm run capsule:verify -- -- \
  --capsule-file .run-ledger/capsules/campaign.json \
  --metadata-only
```

Verify repository-relative artifact files too:

```bash
npm run capsule:verify -- -- \
  --capsule-file .run-ledger/capsules/campaign.json \
  --artifact-root .
```

The verifier rejects path traversal and symbolic-link traversal, mismatched byte counts, mismatched SHA-256 hashes and capsule/dossier fingerprint drift. `--allow-missing` is available for metadata-only archives where artifact bytes are intentionally external.

## Artifact variants

Two selected runs may refer to the same repository-relative path with different hashes. The capsule preserves both records and reports the path as a variant. This is not automatically an error: different commits may intentionally produce different outputs. Before file-level verification against one artifact root, archive run-specific copies under distinct paths.

## Privacy and mutation boundary

The page reads a user-selected dossier file and the local run ledger. It does not modify:

- canonical graph JSON;
- the source dossier;
- run manifests or the run ledger;
- evidence, change-review or Lean-audit stores;
- graph confidence labels.

No analytics, account or remote synchronization is introduced.
