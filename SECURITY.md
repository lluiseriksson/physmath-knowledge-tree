# Security policy

## Supported version

Security fixes are applied to the latest `main` branch. The deployed product is a client-only static site with no project-operated backend.

## Report a vulnerability

Do not open a public issue for a suspected vulnerability. Use GitHub private vulnerability reporting or a repository security advisory. Include the affected file/route, reproducible steps, impact and a suggested mitigation when available.

Do not attach real progress exports, secrets or personal data.

## Security design

The project intentionally:

- has no third-party runtime or development package dependencies;
- performs no analytics and sends no application data to a project server;
- loads no remote fonts or runtime scripts;
- renders canonical graph content through safe DOM APIs rather than HTML injection;
- validates imported learning progress against known IDs and statuses;
- validates URL state before applying identifiers or filters;
- limits service-worker caching to same-origin static GET requests;
- declares a restrictive Content Security Policy;
- builds from an explicit file allowlist;
- uses least-privilege GitHub Actions permissions;
- runs CodeQL, data validation, tests and build checks in CI.

## Sensitive areas

Changes to CSP, service-worker scope, storage/import parsing, URL handling, external links, workflow permissions, Pages deployment or dependency policy require explicit security review.

The bridge-card export contains graph context selected by the user but no account data. Learning progress stays in the browser unless the user explicitly exports it.
