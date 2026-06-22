# Deployment

## GitHub Pages

The repository deploys the static `dist/` directory through `.github/workflows/pages.yml`.

1. In **Settings → Pages**, select **GitHub Actions** as the source.
2. Push to `main` or run the Pages workflow manually.
3. The workflow installs locked Node metadata, executes the full quality gate, builds `dist/`, uploads the Pages artifact and deploys it.

The expected project URL is:

```text
https://lluiseriksson.github.io/physmath-knowledge-tree/
```

The application uses relative URLs and therefore works under the repository subpath.

## Local production preview

```bash
npm ci
# Set BROWSER_BIN only when Chrome/Chromium/Edge is not auto-detected.
npm run check
npm run dev
```

The development server serves the repository root with security headers. To inspect exactly what Pages receives, build first and serve `dist/` with any static server.

## Cache invalidation

`sw.js` uses a versioned cache name. Increment it whenever application-shell paths or caching behavior change. The service worker removes older caches during activation.

## Rollback

GitHub Pages deployments are tied to workflow runs. For a source rollback, revert the problematic commit on `main`; the next successful Pages run deploys the rebuilt prior state. Do not manually edit generated files in the Pages artifact.

## Other static hosts

`dist/_headers` is generated for hosts that support header files. GitHub Pages does not consume it, so security policy is also declared in HTML. Preserve `404.html`, `.nojekyll`, `manifest.webmanifest` and `sw.js` when moving the artifact.
