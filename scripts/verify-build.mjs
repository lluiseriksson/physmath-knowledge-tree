import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BUILD_MANIFEST_FORMAT, computeArtifactSha256, derivePwaCacheRevision } from './lib/build-manifest.mjs';
import { isPathInside, walkRegularFiles } from './lib/fs-safety.mjs';
import { isPublicArtifactPath } from './lib/public-surface.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const manifestPath = join(dist, 'build-manifest.json');
if (!existsSync(manifestPath)) throw new Error('Missing dist/build-manifest.json; run npm run build');

const allArtifactPaths = walkRegularFiles(dist)
  .map((file) => relative(dist, file).replaceAll('\\', '/'))
  .sort();
const actualPaths = allArtifactPaths.filter((file) => file !== 'build-manifest.json');
for (const path of allArtifactPaths) {
  if (!isPublicArtifactPath(path)) throw new Error(`Built path is outside public surface: ${path}`);
}

const manifestBytes = readFileSync(manifestPath);
if (manifestBytes.length > 5_000_000) throw new Error('Build manifest exceeds the size limit');
const manifest = JSON.parse(manifestBytes.toString('utf8'));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const graph = JSON.parse(readFileSync(join(root, 'graph/index.json'), 'utf8'));
const curation = JSON.parse(readFileSync(join(root, 'curation/index.json'), 'utf8'));

const expectedManifestKeys = [
  'application_version', 'artifact_sha256', 'curation_schema_version', 'file_count', 'files',
  'format_version', 'graph_schema_version', 'jsonld_entities', 'package_version',
  'pwa_cache_revision', 'total_bytes',
];
if (JSON.stringify(Object.keys(manifest).sort()) !== JSON.stringify(expectedManifestKeys)) {
  throw new Error('Build manifest has an unexpected schema');
}
if (manifest.format_version !== BUILD_MANIFEST_FORMAT) throw new Error('Unsupported build-manifest format');
if (manifest.package_version !== pkg.version) throw new Error('Build manifest package version is stale');
if (manifest.application_version !== pkg.version || graph.application_version !== pkg.version) {
  throw new Error('Build manifest application version is stale');
}
if (manifest.graph_schema_version !== graph.schema_version) throw new Error('Build manifest graph schema is stale');
if (manifest.curation_schema_version !== curation.schema_version) throw new Error('Build manifest curation schema is stale');
if (!/^build-[a-f0-9]{16}$/u.test(manifest.pwa_cache_revision ?? '')) throw new Error('Invalid PWA cache revision');
if (!/^[a-f0-9]{64}$/u.test(manifest.artifact_sha256 ?? '')) throw new Error('Invalid aggregate artifact SHA-256');
if (!Number.isInteger(manifest.file_count) || manifest.file_count < 20) throw new Error('Invalid build-manifest file count');
if (!Number.isSafeInteger(manifest.total_bytes) || manifest.total_bytes < 1) throw new Error('Invalid build-manifest byte total');
if (!Number.isInteger(manifest.jsonld_entities) || manifest.jsonld_entities < 1) throw new Error('Invalid JSON-LD entity count');
if (!Array.isArray(manifest.files) || manifest.files.length !== manifest.file_count) throw new Error('Build manifest file table does not match file_count');

const paths = new Set();
let previous = '';
let totalBytes = 0;
for (const entry of manifest.files) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error('Invalid build-manifest entry');
  if (JSON.stringify(Object.keys(entry).sort()) !== JSON.stringify(['bytes', 'path', 'sha256'])) {
    throw new Error('Build-manifest entry has an unexpected schema');
  }
  if (typeof entry.path !== 'string' || !entry.path || entry.path.includes('\\')) throw new Error('Invalid build-manifest path');
  if (!isPublicArtifactPath(entry.path)) throw new Error(`Build-manifest path is outside public surface: ${entry.path}`);
  const file = join(dist, entry.path);
  if (!isPathInside(dist, file)) throw new Error(`Build-manifest path escapes dist: ${entry.path}`);
  if (paths.has(entry.path)) throw new Error(`Duplicate build-manifest path: ${entry.path}`);
  if (previous && previous >= entry.path) throw new Error('Build-manifest paths must be strictly sorted');
  previous = entry.path;
  paths.add(entry.path);
  if (!Number.isInteger(entry.bytes) || entry.bytes < 0) throw new Error(`Invalid byte count: ${entry.path}`);
  if (!/^[a-f0-9]{64}$/u.test(entry.sha256)) throw new Error(`Invalid SHA-256: ${entry.path}`);
  if (!existsSync(file) || !statSync(file).isFile()) throw new Error(`Missing built file: ${entry.path}`);
  const bytes = readFileSync(file);
  if (bytes.length !== entry.bytes) throw new Error(`Byte-count mismatch: ${entry.path}`);
  const digest = createHash('sha256').update(bytes).digest('hex');
  if (digest !== entry.sha256) throw new Error(`SHA-256 mismatch: ${entry.path}`);
  totalBytes += entry.bytes;
}

if (totalBytes !== manifest.total_bytes) throw new Error('Build-manifest byte total mismatch');
if (computeArtifactSha256(manifest.files) !== manifest.artifact_sha256) throw new Error('Aggregate artifact SHA-256 mismatch');
if (derivePwaCacheRevision(manifest.files) !== manifest.pwa_cache_revision) throw new Error('PWA cache revision does not match built payload');
const builtServiceWorker = readFileSync(join(dist, 'sw.js'), 'utf8');
const workerRevision = /const CACHE_REVISION = '([^']+)'/u.exec(builtServiceWorker)?.[1];
if (workerRevision !== manifest.pwa_cache_revision) throw new Error('Built service-worker cache revision is stale');

if (actualPaths.length !== paths.size) throw new Error('Built-file count differs from manifest');
for (const file of actualPaths) if (!paths.has(file)) throw new Error(`Unmanifested built file: ${file}`);

const jsonLdPath = graph.generated_files?.jsonld;
const required = [
  '.nojekyll', 'LICENSE', 'index.html', 'learning.html', 'offline.html', '404.html', 'sw.js',
  'graph/index.json', 'graph/audit.json', jsonLdPath, 'curation/REPORT.md',
];
for (const path of required) {
  if (!path || !paths.has(path)) throw new Error(`Required build entry missing: ${path}`);
}
const jsonLd = JSON.parse(readFileSync(join(dist, jsonLdPath), 'utf8'));
if (!Array.isArray(jsonLd['@graph']) || jsonLd['@graph'].length !== manifest.jsonld_entities) {
  throw new Error('JSON-LD entity count differs from build manifest');
}
console.log(`Verified ${manifest.files.length} built files, ${manifest.total_bytes} bytes, ${manifest.jsonld_entities} JSON-LD entities and aggregate ${manifest.artifact_sha256}.`);
