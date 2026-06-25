# Frontier Mathematics Corpus Agent Context

> Generated deterministically from the Frontier Mathematics Corpus Atlas 1.0.0; reviewed 2026-06-25. Do not edit by hand.

## Operating status

- Coverage gate: **PASS**.
- Registry: 71 sources across 38 families.
- Knowledge-eligible: 50; candidate-training: 35.
- Approved IDs: deepmind-mathematics-dataset, gsm8k, hendrycks-math, julia-language, lean4, leandojo-tooling, mathlib4, metamath-set-mm, numpy, open-logic-project, openalex-snapshot, scipy, sympy, unpaywall-snapshot.
- Blocked guardrails: art-of-problem-solving, book-of-proof, common-crawl-raw, competition-archives, internet-archive-mixed, mathpile-mixed, mit-opencourseware, nlab, openstax-current-textbooks, openwebmath-mixed, pauls-online-math-notes, project-euler.

## Critical-area envelope

| Area | Eligible families | Training families | Proof sources | Practice sources |
| --- | --- | --- | --- | --- |
| arithmetic | 14 | 10 | 11 | 7 |
| elementary-algebra | 11 | 7 | 8 | 8 |
| geometry | 15 | 12 | 12 | 7 |
| calculus | 16 | 12 | 14 | 9 |
| linear-algebra | 14 | 11 | 12 | 10 |
| ordinary-differential-equations | 10 | 8 | 9 | 7 |
| partial-differential-equations | 7 | 4 | 8 | 6 |
| probability | 12 | 8 | 8 | 8 |
| statistics | 10 | 8 | 8 | 7 |
| real-analysis | 15 | 12 | 16 | 7 |
| logic-foundations | 13 | 10 | 19 | 7 |
| formal-verification | 11 | 8 | 17 | 5 |

## Non-negotiable rules

1. Do not copy source content into this repository; the registry stores metadata, decisions and generated summaries only.
2. Free access, open access or dataset-level licensing never substitutes for origin-level rights.
3. Approved and conditional decisions do not by themselves establish universal legality of model training or output licensing.
4. Every acquired artifact must be immutable, hash-addressed and tied to the exact license evidence reviewed for that snapshot.
5. Share-alike, documentation-copyleft, code-copyleft and per-item sources remain in isolated shards with separate manifests.
6. Canonical benchmarks and competition problems default to evaluation-only or blocked to prevent contamination.
7. OpenStax current textbooks are blocked because the current pages explicitly prohibit LLM training/ingestion without permission.
8. No personal profiles, private data, deleted posts or unnecessary user identifiers may enter a corpus.
9. Any license change, takedown or upstream deletion invalidates the source decision until re-reviewed.
10. This atlas measures source coverage and governance readiness, not whether a resulting model is mathematically frontier-level.

## Decision order

1. Resolve a source by stable ID with `npm run query:frontier-corpus -- source <id>`.
2. Reject `blocked`; use `metadata_only` solely for metadata fields.
3. For `conditional`, satisfy per-source exclusions and legal review before acquisition.
4. Pin an immutable release, commit, edition or dated snapshot; record SHA-256 and license evidence.
5. Keep share-alike, documentation-copyleft, code-copyleft and per-item material in separate shards.
6. Keep benchmark and canonical competition material outside candidate-training corpora.
7. Re-run `npm run validate:frontier-corpus` after every registry or policy change.
