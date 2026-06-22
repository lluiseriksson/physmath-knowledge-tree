# Source curation records

This directory stores **provenance and decisions**, not raw private source dumps.

```text
curation/
├── index.json                 # Ordered list of indexed sources
├── REPORT.md                  # Generated deletion gate and verification queue
├── record.schema.json         # Contract for one review record
├── records/                   # One JSON record per source
└── inbox/                     # Local-only staging area; ignored by Git
```

A source may be deleted from the user's local archive only after `status` is `reviewed`, `review.status` is `approved`, every promoted destination validates, the source-verification queue is closed and the user has reviewed the human-readable extract and quarantine report.

Register a local TXT, Markdown or PNG without copying it into the repository:

```bash
npm run curation:register -- /absolute/path/to/source.png source_id
```

Verify that a retained local original still matches its record:

```bash
npm run curation:verify-source -- /absolute/path/to/original.png
# An explicit record id/path may be supplied first when needed:
npm run curation:verify-source -- curation.source_id /absolute/path/to/original.png
```

Regenerate the review/deletion report and validate every record and destination:

```bash
npm run curation:report
npm run validate:curation
```

See [`docs/CURATION_WORKFLOW.md`](../docs/CURATION_WORKFLOW.md) for the full protocol.
