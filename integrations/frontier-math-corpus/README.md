# Frontier Mathematics Corpus Atlas

The Frontier Mathematics Corpus Atlas is a machine-readable planning layer for a broad mathematics corpus. It inventories source families across elementary through research mathematics, records the evidence needed to reuse them, separates model uses, and fails when the declared coverage floor is not met.

It does **not** copy third-party books, papers, forum posts or datasets into this repository. It also does not claim that passing the atlas makes a model frontier-level. The atlas makes a narrower promise: source selection is explicit, license-aware, coverage-tested and contamination-aware before any external acquisition begins.

## Current envelope

The committed registry contains:

- 71 source records across 38 independent families;
- 28 mathematical areas, including elementary algebra, geometry, calculus, statistics, ODEs, PDEs, analysis, algebra, topology, logic, numerical methods, mathematical physics and research mathematics;
- 18 content modalities and 14 target capabilities;
- separate decisions for approved, conditional, metadata-only and blocked sources;
- separate model uses for candidate training, retrieval, evaluation, metadata and blocked material;
- isolated shards for permissive, attribution, public-domain, share-alike, documentation-copyleft, code-copyleft, per-item and metadata sources;
- explicit benchmark-contamination and personal-data controls.

The generated [coverage report](generated/coverage-report.md) is the compact source of current counts. The [attribution ledger](generated/attribution-ledger.md) records the minimum notice payload for every nonblocked source. The [agent context](generated/agent-context.md) is the bounded handoff for an automated acquisition or research agent.

## Decisions are not synonyms for “free”

| Decision | Meaning |
| --- | --- |
| `approved` | Repository-level evidence supports the recorded rights and the source passed this atlas review. Exact immutable snapshots and notices remain mandatory. |
| `conditional` | Potentially usable only after edition, item, component, provenance or share-alike conditions are resolved. |
| `metadata_only` | Only bibliographic, catalog or rights-discovery fields may be used under this record. It does not authorize ingesting the underlying work. |
| `blocked` | Do not acquire content. Retain only enough metadata to explain and test the exclusion. |

`candidate-training` is likewise an engineering status, not a jurisdiction-independent legal conclusion. A downstream corpus release must still decide how each isolated shard is distributed and how model artifacts interact with the relevant licenses.

## Commands

```bash
npm run validate:frontier-corpus
npm run generate:frontier-corpus
npm run query:frontier-corpus -- summary
npm run query:frontier-corpus -- gaps
npm run query:frontier-corpus -- area calculus
npm run query:frontier-corpus -- source active-calculus
npm run query:frontier-corpus -- training
```

The validator checks registry shape, controlled vocabularies, decision discipline, license-to-shard routing, immutable acquisition policy, attribution records, benchmark separation, PII exclusions, required blocked guardrails, coverage targets and generated artifacts.

## Canonical files

```text
integrations/frontier-math-corpus/
├── manifest.json
├── coverage-policy.json
├── data/sources.json
├── generated/coverage-report.md
├── generated/attribution-ledger.md
├── generated/agent-context.md
└── INGESTION.md
```

`data/sources.json` and `coverage-policy.json` are canonical. Files in `generated/` are deterministic projections and must be regenerated rather than edited.

## Source-selection boundary

The atlas deliberately prefers source diversity over a single giant web scrape. Textbooks supply coherent curricula; exercises and solutions supply practice; formal libraries supply checked proof objects; software supplies executable mathematics; research metadata and license-resolved papers supply current retrieval; and benchmark sets remain evaluation-only.

A source can cover an area without being suitable for every capability. Formal libraries are not substitutes for pedagogical exposition, web discussions are not substitutes for reviewed proofs, and synthetic arithmetic does not cover research mathematics. Coverage is therefore counted by independent families, modalities and intended capabilities rather than by raw bytes alone.

## Updating the atlas

1. Add or revise one atomic source record.
2. Link to exact license or terms evidence and set `reviewed_on`.
3. State inclusions, exclusions, immutable pin and attribution payload.
4. Choose the most conservative decision and model use supported by the evidence.
5. Route the source to its required isolation shard.
6. Regenerate reports and run the validator.
7. Re-review any record after a license, terms, ownership, takedown or upstream-content change.

See [INGESTION.md](INGESTION.md) before acquiring any external bytes.
