# Frontier Mathematics Evaluation Holdouts

> Generated deterministically from the Frontier Mathematics Corpus Atlas 1.1.0; reviewed 2026-06-25. Do not edit by hand.

Evaluation holdouts are quarantined by exact content, normalized content, translations, formal equivalents and semantic near-duplicates. A permissive repository license does not make a benchmark suitable for candidate training.

| Group | Direct sources | Related sources | Aliases | Matchers | Quarantine scope |
| --- | --- | --- | --- | --- | --- |
| deepmind-synthetic-mathematics | deepmind-mathematics-dataset | none | mathematics_dataset, DeepMind mathematics dataset | exact-hash, normalized-text, generator-signature | All canonical and regenerated instances produced with evaluation seeds or templates. |
| gsm8k-grade-school-reasoning | gsm8k | none | GSM8K, grade school math 8k | exact-hash, normalized-text, semantic-near-duplicate, answer-signature | Questions, rationales, answers, paraphrases, translations and chain-of-thought derivatives. |
| hendrycks-math-competition | hendrycks-math | competition-archives, openwebmath-mixed, mathpile-mixed | MATH, Hendrycks MATH, competition mathematics dataset | exact-hash, normalized-text, semantic-near-duplicate, solution-outline | Canonical problems and solutions plus scraped, reformatted, translated or synthetic variants. |
| mini-f2f-formal-olympiad | mini-f2f | hendrycks-math, competition-archives | miniF2F, mini-F2F, formal olympiad benchmark | exact-hash, normalized-formal-statement, semantic-near-duplicate, cross-language-formalization | Formal statements, proofs, informal originals and equivalent translations across Lean, Metamath, Isabelle and HOL Light. |

## Global rules

1. Exclude every direct evaluation source from all candidate-training shards.
2. Run exact normalized hash matching before tokenization.
3. Run semantic and translation-aware matching against statements, solutions and formalizations.
4. Keep validation and test splits immutable; never use test feedback as supervised training data.
5. Record every removal by source ID, holdout group, matcher version and artifact hash.
