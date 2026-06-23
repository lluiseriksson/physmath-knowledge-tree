import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { assertTreeHasNoSymlinks, walkRegularFiles } from './lib/fs-safety.mjs';
import { BUILD_MANIFEST_FORMAT, computeArtifactSha256, derivePwaCacheRevision } from './lib/build-manifest.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const inputs = [
  'index.html',
  'learning.html',
  'offline.html',
  '404.html',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
  '.nojekyll',
  'assets',
  'src',
  'graph',
  'docs',
  'curation',
];

const resolvedInputs = inputs.map((item) => {
  const from = join(root, item);
  if (!existsSync(from)) throw new Error(`Missing build input: ${item}`);
  assertTreeHasNoSymlinks(from, item);
  return { item, from };
});

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const { item, from } of resolvedInputs) {
  cpSync(from, join(dist, item), { recursive: true });
}

// Useful on hosts that support static response-header files; harmless on GitHub Pages.
writeFileSync(join(dist, '_headers'), `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

/sw.js
  Cache-Control: no-cache
`);

function collectBuiltFiles() {
  return walkRegularFiles(dist)
    .filter((path) => !path.endsWith('build-manifest.json'))
    .map((path) => {
      const bytes = readFileSync(path);
      return {
        path: relative(dist, path).replaceAll('\\', '/'),
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      };
    })
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

const preliminaryFiles = collectBuiltFiles();
const pwaCacheRevision = derivePwaCacheRevision(preliminaryFiles);
const serviceWorkerPath = join(dist, 'sw.js');
const serviceWorker = readFileSync(serviceWorkerPath, 'utf8');
const revisedServiceWorker = serviceWorker.replace(
  /const CACHE_REVISION = '[^']+';/u,
  `const CACHE_REVISION = '${pwaCacheRevision}';`,
);
if (revisedServiceWorker === serviceWorker) throw new Error('Could not inject production PWA cache revision');
writeFileSync(serviceWorkerPath, revisedServiceWorker);

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const graphIndex = JSON.parse(readFileSync(join(root, 'graph/index.json'), 'utf8'));
const curationIndex = JSON.parse(readFileSync(join(root, 'curation/index.json'), 'utf8'));
const files = collectBuiltFiles();
const manifest = {
  format_version: BUILD_MANIFEST_FORMAT,
  package_version: packageJson.version,
  graph_schema_version: graphIndex.schema_version,
  curation_schema_version: curationIndex.schema_version,
  pwa_cache_revision: pwaCacheRevision,
  artifact_sha256: computeArtifactSha256(files),
  files,
};
writeFileSync(join(dist, 'build-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Static build created in dist/ with ${files.length} integrity entries and aggregate ${manifest.artifact_sha256}.`);
