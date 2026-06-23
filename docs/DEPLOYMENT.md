# Deployment

## GitHub Pages

The repository deploys the static `dist/` directory through `.github/workflows/pages.yml`.

1. In **Settings -> Pages**, select **GitHub Actions** as the source.
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

The dependency-free server exposes only the declared deployment surface, even when it serves the repository root. Repository metadata, scripts and tests are not web-readable through the development origin. To inspect exactly what Pages receives, run `npm run build` and serve `dist/`.

## Atomic build publication

The build is assembled in a same-filesystem staging directory. JSON-LD, response-header metadata, the content-derived PWA revision and build manifest are completed before the staging directory replaces `dist/`. A failed build removes its staging directory and preserves the previously valid artifact.

`dist/build-manifest.json` format 3 records every payload path, byte count and SHA-256, plus the total byte count, file count, JSON-LD entity count and one aggregate artifact digest. `npm run validate:dist` rejects extra keys, missing files, unmanifested files, symlinks, path escapes and stale cache identities.

## Agent entrypoint closure

`graph/index.json` is deployed discovery metadata, not merely a repository-local index. Every path advertised through `canonical_files`, `schemas`, `agent_entrypoints`, `generated_files` and `integrations` must belong to the declared public surface and appear in the build manifest. The artifact therefore includes `AGENTS.md`, `prompts/`, `evaluation/` and `integrations/`, while package metadata, implementation scripts and tests remain excluded. `npm run validate:graph` rejects malformed metadata, missing files, non-regular files and symlinks before the build begins; `npm run build` and `npm run validate:dist` additionally reject dangling or non-public artifact paths.

## Cache invalidation

The source service worker carries a bounded source revision. Production builds replace it with a `build-...` revision derived from every payload except `sw.js`, avoiding a self-referential hash. Each revision has a separate immutable shell cache and bounded runtime cache. Activation deletes only obsolete caches owned by this application.

Do not manually increment the semantic application version merely to invalidate static assets. A content change automatically produces a new production cache namespace.

## Rollback

GitHub Pages deployments are tied to workflow runs. For a source rollback, revert the problematic commit on `main`; the next successful Pages run atomically rebuilds and deploys the prior state. Do not manually edit generated files in the Pages artifact.

## Other static hosts

`dist/_headers` is generated for hosts that support header files. GitHub Pages does not consume it, so security policy is also declared in HTML. Preserve `404.html`, `.nojekyll`, `manifest.webmanifest`, `sw.js`, `graph/knowledge-graph.jsonld` and `build-manifest.json` when moving the artifact.
