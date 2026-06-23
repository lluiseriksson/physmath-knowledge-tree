import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPathInside, walkRegularFiles } from './lib/fs-safety.mjs';
import { BUILD_MANIFEST_FORMAT, computeArtifactSha256, derivePwaCacheRevision } from './lib/build-manifest.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const manifestPath = join(dist, 'build-manifest.json');
if (!existsSync(manifestPath)) throw new Error('Missing dist/build-manifest.json; run npm run build');
// Reject symlinks, including a linked manifest, before reading artifact contents.
const actualPaths = walkRegularFiles(dist)
  .map((file) => relative(dist, file).replaceAll('\\', '/'))
  .filter((file) => file !== 'build-manifest.json')
  .sort();

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const graph = JSON.parse(readFileSync(join(root, 'graph/index.json'), 'utf8'));
const curation = JSON.parse(readFileSync(join(root, 'curation/index.json'), 'utf8'));

if (manifest.format_version !== BUILD_MANIFEST_FORMAT) throw new Error('Unsupported build-manifest format');
if (manifest.package_version !== pkg.version) throw new Error('Build manifest package version is stale');
if (manifest.graph_schema_version !== graph.schema_version) throw new Error('Build manifest graph schema is stale');
if (manifest.curation_schema_version !== curation.schema_version) throw new Error('Build manifest curation schema is stale');
if (!/^build-[a-f0-9]{16}$/u.test(manifest.pwa_cache_revision ?? '')) throw new Error('Invalid PWA cache revision');
if (!/^[a-f0-9]{64}$/u.test(manifest.artifact_sha256 ?? '')) throw new Error('Invalid aggregate artifact SHA-256');
if (!Array.isArray(manifest.files) || manifest.files.length < 20) throw new Error('Build manifest has too few entries');

const paths = new Set();
let previous = '';
for (const entry of manifest.files) {
  if (!entry || typeof entry.path !== 'string' || !entry.path || entry.path.includes('\\')) throw new Error('Invalid build-manifest path');
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
}

const aggregateDigest = computeArtifactSha256(manifest.files);
if (aggregateDigest !== manifest.artifact_sha256) throw new Error('Aggregate artifact SHA-256 mismatch');
const expectedPwaRevision = derivePwaCacheRevision(manifest.files);
if (expectedPwaRevision !== manifest.pwa_cache_revision) throw new Error('PWA cache revision does not match built payload');
const builtServiceWorker = readFileSync(join(dist, 'sw.js'), 'utf8');
const workerRevision = /const CACHE_REVISION = '([^']+)'/u.exec(builtServiceWorker)?.[1];
if (workerRevision !== manifest.pwa_cache_revision) throw new Error('Built service-worker cache revision is stale');

if (actualPaths.length !== paths.size) throw new Error('Built-file count differs from manifest');
for (const file of actualPaths) if (!paths.has(file)) throw new Error(`Unmanifested built file: ${file}`);

for (const required of ['index.html', 'learning.html', 'offline.html', '404.html', 'sw.js', 'graph/index.json', 'graph/audit.json', 'curation/REPORT.md']) {
  if (!paths.has(required)) throw new Error(`Required build entry missing: ${required}`);
}
console.log(`Verified ${manifest.files.length} built files and aggregate ${manifest.artifact_sha256}.`);
