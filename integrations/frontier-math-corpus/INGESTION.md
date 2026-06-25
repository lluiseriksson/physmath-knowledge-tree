# License-aware mathematics corpus ingestion

This protocol turns an atlas decision into a reproducible external corpus artifact. It is deliberately stricter than “publicly accessible” or “the repository has a license.” It is not legal advice.

## 1. Resolve the exact source record

```bash
npm run query:frontier-corpus -- source <source-id>
```

Stop for `blocked`. For `metadata_only`, collect only the named metadata fields. A catalog entry, DOI or link never transfers the rights of the underlying work.

Check the source’s decision, model use, license evidence, exclusions, shard, risk band, contamination risk, PII risk and re-review deadline before downloading anything.

## 2. Generate a source-specific snapshot manifest

```bash
npm run query:frontier-corpus -- snapshot-template <source-id> > snapshot.json
```

Complete the manifest rather than inventing an ad hoc log. It must identify:

- the source and atlas versions used for the decision;
- retrieval timestamp and immutable upstream revision;
- SHA-256 of acquired bytes and of the exact license/terms evidence;
- included and excluded paths or components;
- file count and byte count;
- decision, model use, license expression and isolation shard;
- notice and attribution payload locations;
- deduplication, PII, malware, benchmark and language scan results;
- reviewer, decision time and notes.

Validate it before admission:

```bash
npm run query:frontier-corpus -- snapshot-validate snapshot.json
```

A draft or placeholder manifest is not acquisition approval.

## 3. Resolve origin-level rights

Dataset-level or repository-level terms do not override item-level rights. Preserve the exact edition, release, commit, item version or dated export and review third-party figures, contributed examples, bundled packages and linked works separately.

For per-item repositories, repeat the rights decision for every admitted item. For mixed repositories, use only the reviewed component set. A source marked `conditional` remains quarantined until every recorded condition is resolved.

## 4. Acquire immutably

Never use an unpinned `latest` corpus. Preserve source archives separately from normalized derivatives. Reject:

- unexpected redirects or HTML error pages;
- mutable API responses without a dated export;
- an identifier whose bytes change without a version change;
- components outside the reviewed scope;
- license evidence that no longer matches the registry decision;
- a source whose `next_review_on` date has passed.

Hash before normalization and after every transformation stage.

## 5. Route into isolated shards

| Shard | Typical material | Required boundary |
| --- | --- | --- |
| `permissive` | MIT, BSD, Apache code or data | Retain license, copyright and NOTICE material; respect component exceptions. |
| `attribution` | CC BY content | Retain title, creator, source, license and modification notice. |
| `public-domain` | CC0 or verified public-domain items | Preserve provenance and item-level status. |
| `share-alike` | CC BY-SA text or data | Keep version-specific attribution and share-alike obligations separable. |
| `documentation-copyleft` | GFDL documents | Preserve transparent source, license, notices, history and any special sections/texts. |
| `copyleft-code` | GPL/LGPL code and proof libraries | Keep source and derivative-code obligations separable from prose/data shards. |
| `per-item` | arXiv, Zenodo, NIST and mixed repositories | Admit only individually resolved items and components. |
| `metadata` | catalogs, DOI metadata and rights discovery | Never promote linked full text without another reviewed record. |
| `blocked` | restricted, noncommercial, no-derivatives, unclear or explicitly AI-restricted sources | Do not acquire content. |

No pipeline may flatten these shards before a documented compatibility and release decision.

## 6. Attach provenance before normalization

Every normalized record should retain source ID, source family, source hash, transformation version, license class, shard, model use, exclusions and record type. Keep theorem statements, proofs, exercises, solutions, code, diagrams and bibliographic metadata distinguishable where the source permits segmentation.

Do not infer authorship, license or correctness from formatting. Do not strip attribution from individual posts, figures, code blocks or contributed examples. Do not retain deleted/private material or unnecessary user identifiers.

## 7. Apply evaluation quarantine before deduplication

Read the committed holdout registry:

```bash
npm run query:frontier-corpus -- holdouts
```

Canonical evaluation material is excluded not only by exact hash. Apply every configured matcher to:

- normalized text and mathematical notation;
- translated statements and solutions;
- formal encodings or equivalent theorem statements;
- paraphrases and semantic near-duplicates;
- upstream mirrors, forks and derived datasets.

Deduplication must never merge records with different rights into an untraceable synthetic item. Evaluation contamination checks run before training-set admission and again after transformations.

## 8. Validate mathematical balance

The hard atlas policy is only a floor. Also measure:

- level, language and source-family distribution;
- dedicated versus omnibus subject coverage;
- exposition, exercises and worked solutions;
- theorem-proof, counterexample and formal-proof density;
- diagram, symbolic, numeric, code and tool-use modalities;
- answer leakage and duplicated exercise/solution pairs;
- research recency, citation coverage, corrections and retractions;
- pure, applied, computational and formal mathematics balance.

Use `npm run query:frontier-corpus -- priorities` and the frontier-readiness report to prevent large general sources from masking thin dedicated areas.

## 9. Produce a release bill of materials

Every corpus release should include:

- source, license-evidence and artifact hashes;
- snapshot manifests and transformation lineage;
- decisions, model uses, risk bands and shards;
- license texts, NOTICE files and attribution ledger;
- benchmark exclusion hashes and semantic matcher versions;
- PII, malware, language and quality scan results;
- takedown procedure and unresolved quarantines;
- counts by area, role, modality, capability, level, language, family and shard.

The release must be reproducible without floating URLs.

## 10. Revalidation and takedown

A license or terms change, ownership dispute, upstream deletion, correction, retraction or takedown request invalidates the affected snapshot until review. Quarantine by source and artifact hash, propagate removal through derivatives, regenerate manifests and rerun the complete quality gate.

The atlas supports conservative removal and audit. It is not a one-time permission oracle.
