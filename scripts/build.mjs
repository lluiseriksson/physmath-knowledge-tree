import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalJsonLd, CANONICAL_JSONLD_PATH } from './export-jsonld.mjs';
import { publishDirectoryAtomically } from './lib/atomic-publish.mjs';
import {
  BUILD_MANIFEST_FORMAT,
  computeArtifactSha256,
  derivePwaCacheRevision,
  injectPwaCacheRevision,
} from './lib/build-manifest.mjs';
import { assertTreeHasNoSymlinks, walkRegularFiles } from './lib/fs-safety.mjs';
import { isPublicArtifactPath, PUBLIC_BUILD_INPUTS } from './lib/public-surface.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

const resolvedInputs = PUBLIC_BUILD_INPUTS.map((item) => {
  const from = join(root, item);
  if (!existsSync(from)) throw new Error(`Missing build input: ${item}`);
  assertTreeHasNoSymlinks(from, item);
  return { item, from };
});

function collectBuiltFiles(directory) {
  return walkRegularFiles(directory)
    .filter((path) => !path.endsWith('build-manifest.json'))
    .map((path) => {
      const relativePath = relative(directory, path).replaceAll('\\', '/');
      if (!isPublicArtifactPath(relativePath)) throw new Error(`Built path is outside the declared public surface: ${relativePath}`);
      const bytes = readFileSync(path);
      return {
        path: relativePath,
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      };
    })
    .sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}

const staging = mkdtempSync(join(root, '.dist-staging-'));
try {
for (const { item, from } of resolvedInputs) {
    const destination = join(staging, item);
    if (item.includes('/')) mkdirSync(join(destination, '..'), { recursive: true });
    cpSync(from, destination, {
      recursive: true,
      filter(source) {
        const nestedPath = relative(from, source).replaceAll('\\', '/');
        const artifactPath = nestedPath ? `${item}/${nestedPath}` : item;
        return artifactPath === item || isPublicArtifactPath(artifactPath);
      },
    });
  }

  const jsonLdDocument = buildCanonicalJsonLd(root);
  writeFileSync(join(staging, CANONICAL_JSONLD_PATH), `${JSON.stringify(jsonLdDocument, null, 2)}\n`);

  // Useful on hosts that support static response-header files; harmless on GitHub Pages.
  writeFileSync(join(staging, '_headers'), `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Origin-Agent-Cluster: ?1
  X-Permitted-Cross-Domain-Policies: none

/sw.js
  Cache-Control: no-cache
`);

  const preliminaryFiles = collectBuiltFiles(staging);
  const pwaCacheRevision = derivePwaCacheRevision(preliminaryFiles);
  const serviceWorkerPath = join(staging, 'sw.js');
  writeFileSync(
    serviceWorkerPath,
    injectPwaCacheRevision(readFileSync(serviceWorkerPath, 'utf8'), pwaCacheRevision),
  );

  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const graphIndex = JSON.parse(readFileSync(join(root, 'graph/index.json'), 'utf8'));
  const curationIndex = JSON.parse(readFileSync(join(root, 'curation/index.json'), 'utf8'));
  if (graphIndex.application_version !== packageJson.version) {
    throw new Error(`Graph application version ${graphIndex.application_version} does not match package ${packageJson.version}`);
  }

  const files = collectBuiltFiles(staging);
  const manifest = {
    format_version: BUILD_MANIFEST_FORMAT,
    package_version: packageJson.version,
    application_version: graphIndex.application_version,
    graph_schema_version: graphIndex.schema_version,
    curation_schema_version: curationIndex.schema_version,
    pwa_cache_revision: pwaCacheRevision,
    artifact_sha256: computeArtifactSha256(files),
    file_count: files.length,
    total_bytes: files.reduce((sum, entry) => sum + entry.bytes, 0),
    jsonld_entities: jsonLdDocument['@graph'].length,
    files,
  };
  writeFileSync(join(staging, 'build-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  publishDirectoryAtomically(staging, dist);
  console.log(`Static build created atomically in dist/ with ${files.length} integrity entries and aggregate ${manifest.artifact_sha256}.`);
} catch (error) {
  rmSync(staging, { recursive: true, force: true });
  throw error;
}
