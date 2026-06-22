# Security Policy

## Supported versions

Security fixes are applied to the latest commit on `main`. The project is a client-only static application and does not operate a backend service.

## Report a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's **Private vulnerability reporting** or **Security advisory** feature for this repository. Include:

- the affected file and behavior;
- reproduction steps or a minimal proof of concept;
- the security impact;
- suggested mitigation, when known.

Do not include real personal progress data or secrets in a report. A maintainer will acknowledge the report, investigate it, and coordinate disclosure after a fix is available.

## Security design

The application intentionally:

- has no runtime package dependencies;
- sends no analytics or application data to a server;
- constructs dynamic UI through DOM APIs rather than injecting HTML;
- applies a restrictive content security policy;
- validates imported progress against known topic IDs and statuses;
- scopes offline caching to same-origin static GET requests;
- runs automated CodeQL and repository validation workflows.

These measures reduce risk but do not replace review. Changes to storage, service-worker behavior, URL handling, CSP, or deployment permissions require explicit security consideration.
