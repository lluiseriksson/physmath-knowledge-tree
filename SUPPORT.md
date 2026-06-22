# Support

Use the repository's issue forms for reproducible bugs, learner-focused feature proposals, and curriculum corrections. Include the browser, operating system, input method, and exact topic IDs when relevant.

For security vulnerabilities, follow `SECURITY.md` and report privately. Do not attach personal progress exports to public issues.

Before requesting help with a local checkout, run:

```bash
node --version
npm ci
npm run check
```

Include the failing command and complete non-sensitive output. The supported baseline is the latest `main` branch on Node.js 22 or 24 and a current evergreen browser.
