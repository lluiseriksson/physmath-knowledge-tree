# Contributing

Thank you for improving PhysMath Knowledge Tree. Contributions may change application code, curriculum content, translations, accessibility, tests, or documentation.

## Before opening a change

1. Search existing issues and pull requests for related work.
2. Keep each pull request focused on one coherent improvement.
3. For a large curriculum redesign or architectural change, open a proposal issue first.
4. Never include secrets, personal progress exports, generated `dist/`, or dependency folders.

## Local workflow

```bash
npm ci
npm run dev
npm run check
```

All checks must pass on Node.js 22 and 24. Because the project intentionally has no third-party runtime dependencies, adding one requires a written justification covering bundle impact, maintenance, accessibility, and the security trade-off.

## Curriculum changes

Read `docs/CONTENT_GUIDE.md`. Every topic must:

- have a stable kebab-case ID;
- include English and Spanish titles, summaries, and at least three concepts;
- reference only existing prerequisites;
- preserve an acyclic graph;
- use an existing taxonomy value unless the taxonomy is deliberately extended;
- include a plausible positive study-time estimate;
- remain in topological source order.

Run `npm run validate:data` after every content edit.

## Code changes

- Use browser standards and small pure modules where possible.
- Construct user-visible dynamic content with DOM APIs rather than unsanitized HTML.
- Preserve the content security policy and avoid third-party network requests.
- Keep graph algorithms deterministic and covered by tests.
- Add or update tests for every bug fix and behavior change.
- Make the list view and keyboard experience equivalent to graphical interactions.
- Respect system theme and reduced-motion preferences.

## Commit and pull-request quality

Use an imperative summary, for example `Add prerequisite validation for new topics`. The pull request should explain the problem, the chosen solution, test evidence, and accessibility or content implications. Include screenshots for visible changes at desktop and mobile widths.

By contributing, you agree that your work is distributed under the repository's MIT License.
