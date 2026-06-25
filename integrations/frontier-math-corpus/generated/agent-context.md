# Frontier Mathematics Corpus Agent Context

> Generated deterministically from the Frontier Mathematics Corpus Atlas 1.1.0; reviewed 2026-06-25. Do not edit by hand.

## Operating status

- Hard coverage/governance gate: **PASS**.
- Frontier dimensions: **GAPS**; dedicated density: **INCOMPLETE**.
- Registry: 81 sources across 47 families.
- Knowledge-eligible: 59; candidate-training: 43.
- Approved IDs: agda-standard-library, cvxpy, deepmind-mathematics-dataset, gsm8k, hendrycks-math, julia-language, lean4, leandojo-tooling, mathlib4, metamath-set-mm, mpmath, networkx, numpy, open-logic-project, openalex-snapshot, petsc, py-pde, scipy, statsmodels, sympy, unpaywall-snapshot.
- Blocked guardrails: apex-calculus, art-of-problem-solving, book-of-proof, common-crawl-raw, competition-archives, internet-archive-mixed, mathpile-mixed, mit-opencourseware, nlab, openstax-current-textbooks, openwebmath-mixed, pauls-online-math-notes, project-euler.
- Priority dimensions: counterexample-discipline, multilingual-mathematics.
- Priority areas: algebraic-geometry, research-mathematics.

## Critical-area envelope

| Area | Eligible families | Training families | Proof sources | Practice sources | Density |
| --- | --- | --- | --- | --- | --- |
| arithmetic | 16 | 11 | 13 | 7 | dense-enough |
| elementary-algebra | 12 | 7 | 9 | 8 | dense-enough |
| geometry | 16 | 12 | 14 | 7 | dense-enough |
| calculus | 17 | 13 | 15 | 10 | dense-enough |
| linear-algebra | 18 | 15 | 13 | 13 | dense-enough |
| ordinary-differential-equations | 10 | 8 | 9 | 7 | dense-enough |
| partial-differential-equations | 9 | 6 | 8 | 8 | dense-enough |
| probability | 14 | 10 | 9 | 9 | dense-enough |
| statistics | 11 | 9 | 8 | 8 | dense-enough |
| real-analysis | 15 | 12 | 17 | 7 | dense-enough |
| logic-foundations | 15 | 11 | 22 | 7 | dense-enough |
| formal-verification | 13 | 9 | 20 | 5 | dense-enough |

## Non-negotiable rules

1. Do not copy source content into this repository; the registry stores metadata, decisions and generated summaries only.
2. Free access, open access or dataset-level licensing never substitutes for origin-level rights.
3. Approved and conditional decisions do not by themselves establish universal legality of model training or output licensing.
4. Every acquired artifact must be immutable, hash-addressed and tied to the exact license evidence reviewed for that snapshot.
5. Share-alike, documentation-copyleft, code-copyleft and per-item sources remain in isolated shards with separate manifests.
6. Canonical benchmarks, their aliases, translations and semantic near-duplicates remain outside candidate-training corpora.
7. OpenStax current textbooks are blocked because the current pages explicitly prohibit LLM training or ingestion without permission.
8. Noncommercial-only and no-derivatives sources remain blocked from the general-purpose corpus unless a separately reviewed use case changes the policy.
9. No personal profiles, private data, deleted posts or unnecessary user identifiers may enter a corpus.
10. Derived or synthetic records must preserve parent source IDs, licenses, transformations and contamination-family membership.
11. Any license change, takedown, upstream deletion or expired review invalidates the source decision until re-reviewed.
12. This atlas measures source coverage and governance readiness, not whether a resulting model is mathematically frontier-level.

## Decision order

1. Resolve a source by stable ID with `npm run query:frontier-corpus -- source <id>`.
2. Reject `blocked`; use `metadata_only` solely for metadata fields.
3. For `conditional`, satisfy per-source exclusions and legal review before acquisition.
4. Generate a source-specific manifest with `npm run query:frontier-corpus -- snapshot-template <id>`.
5. Pin an immutable release, commit, edition or dated snapshot; record content and license-evidence SHA-256 values.
6. Keep share-alike, documentation-copyleft, code-copyleft and per-item material in separate shards.
7. Apply every holdout matcher to benchmarks, translations, formal equivalents and semantic near-duplicates.
8. Validate the completed manifest and re-run `npm run validate:frontier-corpus` after every source or policy edit.
