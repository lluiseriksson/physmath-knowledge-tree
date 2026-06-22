# Source curation records

This directory stores **provenance and decisions**, not raw private source dumps.

```text
curation/
├── index.json                 # Ordered list of reviewed sources
├── record.schema.json         # Contract for one review record
├── records/                   # One JSON record per source
└── inbox/                     # Local-only staging area; ignored by Git
```

A source may be deleted from the user's local archive only after its record is marked
`curated`, all promoted claims have valid destinations, and the user has reviewed the
human-readable extract and quarantine report.

Register a local TXT, Markdown or PNG without copying it into the repository:

```bash
npm run curation:register -- /absolute/path/to/source.png source_id
```

Validate every record and destination:

```bash
npm run validate:curation
```

See [`docs/CURATION_WORKFLOW.md`](../docs/CURATION_WORKFLOW.md) for the full protocol.
