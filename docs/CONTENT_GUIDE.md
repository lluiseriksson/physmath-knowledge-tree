# Curriculum Content Guide

The knowledge tree is a navigational model, not a claim that every learner must follow one universal sequence. Prerequisites should represent material that is genuinely needed to begin a topic, not every subject that could deepen it.

## Topic schema

Each entry in `src/data/topics.js` contains:

- `id`: stable lowercase kebab-case identifier;
- `title.en` and `title.es`: concise names;
- `domain`: `math`, `bridge`, or `physics`;
- `area`: an ID from `catalog.areas`;
- `level`: `foundation`, `intermediate`, or `advanced`;
- `prerequisites`: topic IDs needed before starting;
- `estimatedHours`: an approximate guided-study range represented by one positive number;
- `summary.en` and `summary.es`: one learner-focused sentence;
- `concepts.en` and `concepts.es`: at least three representative concepts;
- `keywords`: normalized search support in both languages.

## Choosing prerequisites

Use the smallest defensible set. Ask whether a learner without the candidate prerequisite would be unable to understand the first substantial lessons of the target topic. Avoid adding an edge merely because two subjects are historically related or often taught in that order.

Prerequisites must already appear earlier in the source file. This keeps the file readable as a topological sequence and lets validation catch accidental cycles immediately.

### Good edge

`ordinary-differential-equations → oscillations`: solving oscillator equations depends directly on differential equations.

### Edge to reconsider

`abstract-algebra → all advanced physics`: abstract algebra is valuable, but many advanced physics topics do not require it as an entry condition.

## Writing localized text

- Translate meaning, not word order.
- Prefer standard terminology used in university courses in each language.
- Keep titles short enough for graph nodes.
- Summaries should state what the learner will understand or do.
- Concept arrays should align semantically across languages, even when terminology is not word-for-word.
- Avoid unexplained abbreviations and promotional language.

## Levels and study time

Levels indicate expected mathematical maturity, not importance. Study hours are rough planning signals, not promises. They should be internally consistent and assume focused introductory study rather than complete mastery.

## Adding a topic

1. Choose a stable ID and existing taxonomy values.
2. Insert the entry after all of its prerequisites.
3. Add complete English and Spanish content.
4. Add enough search keywords for common names and terminology.
5. Run `npm run validate:data` and `npm test`.
6. Inspect both graph and list views at desktop and mobile widths.
7. Explain the prerequisite choices in the pull request.

## Changing or removing an ID

IDs are referenced by URLs and saved progress. Renaming or deleting one is a data migration, not a copy edit. Add a versioned migration in storage logic before changing an established ID.

## Scientific review

Content corrections should cite a reputable textbook, syllabus, standards document, or peer-reviewed source in the pull request discussion. Sources need not be shipped in the user interface unless the product deliberately introduces a resources field.
