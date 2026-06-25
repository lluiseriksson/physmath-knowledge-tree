# Frontier Mathematics Corpus Atlas

The Frontier Mathematics Corpus Atlas is a machine-readable planning and governance layer for building broad mathematics corpora. It inventories source families from elementary arithmetic through research mathematics, records reuse evidence and exclusions, separates training/retrieval/evaluation/metadata uses, and validates both a hard coverage floor and a stricter frontier-readiness envelope.

It does **not** copy third-party books, papers, posts, benchmarks or software into this repository. It also does not claim that passing a source policy makes a model frontier-level. Its narrower guarantee is that source selection, license review, isolation, acquisition and benchmark quarantine are explicit and testable before external bytes enter a pipeline.

## Current envelope

Version 1.1.0 contains:

- **81 source records** across **47 independent families**;
- **28 mathematical areas**, including arithmetic, geometry, calculus, statistics, ODEs, PDEs, analysis, algebra, topology, optimization, numerical analysis, mathematical physics, formal verification and research mathematics;
- **18 modalities** and **14 target capabilities**;
- **59 knowledge-eligible** and **43 candidate-training** records;
- explicit `approved`, `conditional`, `metadata_only` and `blocked` decisions;
- explicit `candidate-training`, `retrieval-only`, `evaluation-only`, `metadata-only` and `blocked` model uses;
- isolated permissive, attribution, public-domain, share-alike, documentation-copyleft, code-copyleft, per-item and metadata shards;
- four named evaluation-holdout groups with exact, normalized, translated, formal-equivalence and semantic-near-duplicate quarantine rules;
- source-specific snapshot manifests with immutable revision, artifact hash, license-evidence hash, scope, notices, attribution, scans and human review;
- scheduled license re-review dates and risk-prioritized acquisition planning.

The hard governance and coverage floor currently passes. The stricter readiness report intentionally retains open density gaps, notably dedicated candidate-training depth in algebraic geometry and research mathematics, plus broader counterexample and multilingual coverage. Omnibus references and formal libraries are not counted as substitutes for dedicated pedagogy.

## Generated outputs

| Artifact | Purpose |
| --- | --- |
| [`generated/coverage-report.md`](generated/coverage-report.md) | Hard area, modality, capability, decision, shard and risk counts. |
| [`generated/frontier-readiness-report.md`](generated/frontier-readiness-report.md) | Advisory frontier dimensions, dedicated subject density and prioritized additions. |
| [`generated/evaluation-holdouts.md`](generated/evaluation-holdouts.md) | Benchmark identities, aliases, matchers and quarantine boundaries. |
| [`generated/attribution-ledger.md`](generated/attribution-ledger.md) | Minimum notice and attribution record for every nonblocked source. |
| [`generated/acquisition-plan.json`](generated/acquisition-plan.json) | Machine-readable acquisition priority, scope, risk and required checks. |
| [`generated/agent-context.md`](generated/agent-context.md) | Compact operating contract for an acquisition or research agent. |

Generated files are deterministic projections. Edit the canonical registry and policy, then regenerate them.

## Decisions are not synonyms for “free”

| Decision | Meaning |
| --- | --- |
| `approved` | Repository-level evidence supports the recorded rights and completed atlas review. Immutable snapshots and notices remain mandatory. |
| `conditional` | Potentially usable only after edition, item, component, provenance, attribution, copyleft or other recorded conditions are satisfied. |
| `metadata_only` | Only catalog, citation or rights-discovery fields may be used. Linked full text requires a separate source record and review. |
| `blocked` | Do not acquire content. Retain only enough metadata to explain and test the exclusion. |

`candidate-training` is an engineering eligibility label, not a jurisdiction-independent legal conclusion. Every downstream corpus and model release still requires its own legal, policy and licensing review.

## Commands

```bash
npm run validate:frontier-corpus
npm run generate:frontier-corpus
npm run query:frontier-corpus -- summary
npm run query:frontier-corpus -- gaps
npm run query:frontier-corpus -- priorities
npm run query:frontier-corpus -- frontier
npm run query:frontier-corpus -- area calculus
npm run query:frontier-corpus -- capability formalization
npm run query:frontier-corpus -- modality formal-proofs
npm run query:frontier-corpus -- risk high
npm run query:frontier-corpus -- holdouts
npm run query:frontier-corpus -- source statsmodels
npm run query:frontier-corpus -- snapshot-template statsmodels
npm run query:frontier-corpus -- snapshot-validate /path/to/snapshot.json
```

The validator runs ten gates covering manifest closure, registry shape, license-review horizons, controlled vocabularies, decision discipline, shard routing, immutable acquisition, attribution, benchmark/PII quarantine, required blocks, snapshot contracts, coverage honesty, risk prioritization and generated-artifact freshness.

## Canonical files

```text
integrations/frontier-math-corpus/
├── manifest.json
├── coverage-policy.json
├── data/
│   ├── sources.json
│   └── evaluation-holdouts.json
├── schemas/
│   └── snapshot-manifest.schema.json
├── templates/
│   └── snapshot-manifest.json
├── generated/
│   ├── coverage-report.md
│   ├── frontier-readiness-report.md
│   ├── evaluation-holdouts.md
│   ├── attribution-ledger.md
│   ├── acquisition-plan.json
│   └── agent-context.md
└── INGESTION.md
```

`data/sources.json`, `data/evaluation-holdouts.json`, `coverage-policy.json`, the schema and the template are canonical. The generated directory is derived.

## Source-selection boundary

The atlas deliberately favors diverse, independently governed source families over a giant scrape. Textbooks provide coherent curricula; exercises and worked solutions provide practice; formal libraries provide checked objects; software provides executable mathematics; license-resolved papers and metadata provide research retrieval; and canonical benchmarks remain quarantined for evaluation.

Coverage is counted by family, role, modality and capability—not by raw bytes. A formal library does not replace explanatory geometry, a software package does not replace a statistics curriculum, and a synthetic arithmetic generator does not supply research-level mathematical judgment.

## Updating the atlas

1. Add or revise one atomic source record.
2. Link exact license/terms evidence and set `reviewed_on` plus `next_review_on`.
3. State immutable pin policy, included scope, exclusions and attribution payload.
4. Choose the most conservative decision and model use supported by the evidence.
5. Route the source into the required isolation shard.
6. Add or update any benchmark holdout aliases and semantic matchers.
7. Regenerate all six artifacts and run the validator plus 100/100/100 tests.
8. Re-review after any license, terms, ownership, takedown or upstream-content change.

Read [INGESTION.md](INGESTION.md) before acquiring external content.
