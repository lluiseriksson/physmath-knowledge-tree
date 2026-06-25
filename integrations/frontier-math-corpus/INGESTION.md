# License-aware mathematics corpus ingestion

This protocol turns an atlas decision into a reproducible external corpus artifact. It is intentionally stricter than “the page is public” or “the repository has a license.” It is not legal advice.

## 1. Resolve the exact source record

Use a stable registry ID and inspect the complete record:

```bash
npm run query:frontier-corpus -- source <source-id>
```

Stop immediately for `blocked`. For `metadata_only`, collect only the named metadata fields. A link to a book, paper or page in a catalog never transfers the rights of that underlying work.

## 2. Resolve origin-level rights

Before downloading content, preserve:

- source ID and family;
- canonical URL and acquisition URL;
- exact edition, release, commit, item version or dated snapshot;
- license expression and a local copy or hash of the license evidence;
- copyright and attribution notices;
- included and excluded components;
- reviewer, review date and decision rationale.

For per-item repositories, repeat the rights decision for every item. Dataset-level terms do not override the license or copyright of included works.

## 3. Acquire immutably

Never use an unpinned `latest` corpus. Store an acquisition manifest containing the final resolved URL, retrieval timestamp, upstream revision, byte size and SHA-256 for every artifact. Preserve source archives separately from normalized derivatives so that transformations are auditable.

Reject unexpected redirects, HTML error pages, mutable API responses without a dated export, files whose hashes change under the same identifier, and components absent from the reviewed scope.

## 4. Route into isolated shards

| Shard | Typical material | Required boundary |
| --- | --- | --- |
| `permissive` | MIT, BSD, Apache source | Retain license, copyright and NOTICE material. |
| `attribution` | CC BY content | Retain title, author, source, license and modification notice. |
| `public-domain` | CC0 or verified public-domain items | Preserve provenance and item-level status even when attribution is not mandatory. |
| `share-alike` | CC BY-SA text and data | Do not merge into a relicensed monolith; retain version-specific attribution and share-alike obligations. |
| `documentation-copyleft` | GFDL documents | Preserve transparent source, license, notices, history and any invariant-section/cover-text requirements. |
| `copyleft-code` | GPL/LGPL code and proof libraries | Keep source and derivative-code obligations separable from prose/data shards. |
| `per-item` | arXiv, Zenodo, NIST or mixed repositories | Admit only items whose individual rights and third-party components are resolved. |
| `metadata` | catalogs, DOI metadata and rights discovery | Never promote linked full text without a second source record and review. |
| `blocked` | restricted, noncommercial, no-derivatives, unclear or explicitly AI-restricted sources | Do not acquire content. |

No training pipeline may silently flatten these shards before a documented compatibility and release decision.

## 5. Normalize without destroying provenance

Each normalized record should carry a stable source pointer, source hash, transformation version, license class, shard, model-use label and exclusion flags. Keep theorem statements, proofs, exercises, solutions, code, diagrams and metadata distinguishable where the source permits that segmentation.

Do not infer authorship, licenses or solution correctness from formatting. Do not strip attribution from individual posts, images, figures, code blocks or contributed examples. Do not retain deleted/private content or unnecessary user identifiers.

## 6. Deduplicate and split safely

Deduplicate only after provenance is attached. Near-duplicate detection must not merge records with different licenses or authors into an untraceable synthetic item.

Split by source family before document-level splitting. Canonical benchmarks, competition archives and their near-duplicates remain outside training. Evaluation manifests should include hashes and match detectors so contaminated candidates can be excluded before training.

## 7. Validate mathematical balance

The atlas sets minimum family counts, not token quotas. A production corpus should additionally measure:

- level and language distribution;
- exposition versus exercises and worked solutions;
- theorem-proof, counterexample and formal-proof density;
- diagram, symbolic, numeric and code modalities;
- answer leakage and duplicated exercise/solution pairs;
- research recency, citation coverage and retraction/takedown state;
- representation across pure, applied, computational and formal mathematics.

Large volume in arithmetic or web discussions must not mask a thin PDE, statistics, geometry or proof corpus.

## 8. Produce a release bill of materials

Every external corpus release should ship a machine-readable bill of materials with:

- source and artifact hashes;
- decision and model-use labels;
- license texts and attribution ledger;
- transformations and filters;
- benchmark exclusion hashes;
- PII and takedown procedures;
- known unresolved rights and quarantined items;
- counts by area, modality, level, language, source family and shard.

Releases must be reproducible from the bill of materials without relying on floating URLs.

## 9. Revalidation and takedown

A license change, terms change, ownership dispute, upstream deletion, item correction or takedown request invalidates the affected artifact until review. Quarantine by source hash, propagate removal through normalized derivatives, regenerate manifests and rerun the complete quality gate.

The registry is designed to make conservative removal possible. It is not a one-time permission oracle.
