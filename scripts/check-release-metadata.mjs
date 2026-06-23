import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

/** @param {string} text @param {RegExp} pattern @param {string} label */
function matchOne(text, pattern, label) {
  const match = pattern.exec(text);
  if (!match) throw new Error(`Could not find ${label}`);
  return match[1];
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

/** @param {string} text */
export function parseCitationVersion(text) {
  return matchOne(text, /^version:\s*([^\s]+)\s*$/mu, 'CITATION.cff version');
}

/** @param {string} text @param {string} declaration */
export function parseLeanString(text, declaration) {
  const pattern = new RegExp(`def\\s+${declaration}\\s*:\\s*String\\s*:=\\s*"([^"]+)"`, 'u');
  return matchOne(text, pattern, `Lean ${declaration}`);
}

/** @param {string} text @param {string} constant */
export function parseServiceWorkerConstant(text, constant) {
  const pattern = new RegExp(`const\\s+${constant}\\s*=\\s*'([^']+)'`, 'u');
  return matchOne(text, pattern, `service-worker ${constant}`);
}

export function collectReleaseMetadata(repositoryRoot = root) {
  const read = (path) => readFileSync(join(repositoryRoot, path), 'utf8');
  const pkg = JSON.parse(read('package.json'));
  const lock = JSON.parse(read('package-lock.json'));
  const graph = JSON.parse(read('graph/index.json'));
  const curation = JSON.parse(read('curation/index.json'));
  const lean = read('PhysMathKnowledgeTree/Metadata.lean');
  const serviceWorker = read('sw.js');
  const releaseNotesPath = `docs/RELEASE_${String(pkg.version).replaceAll('.', '_')}.md`;

  return {
    packageName: pkg.name,
    packageVersion: pkg.version,
    lockVersion: lock.version,
    lockRootName: lock.packages?.['']?.name,
    lockRootVersion: lock.packages?.['']?.version,
    citationVersion: parseCitationVersion(read('CITATION.cff')),
    serviceWorkerVersion: parseServiceWorkerConstant(serviceWorker, 'APP_VERSION'),
    serviceWorkerCacheRevision: parseServiceWorkerConstant(serviceWorker, 'CACHE_REVISION'),
    graphSchemaVersion: graph.schema_version,
    curationSchemaVersion: curation.schema_version,
    leanApplicationVersion: parseLeanString(lean, 'applicationVersion'),
    leanGraphSchemaVersion: parseLeanString(lean, 'graphSchemaVersion'),
    leanCurationSchemaVersion: parseLeanString(lean, 'curationSchemaVersion'),
    releaseValidationCommand: pkg.scripts?.['validate:release'],
    qualityGate: pkg.scripts?.check,
    releaseNotesPath,
    releaseNotesExists: existsSync(join(repositoryRoot, releaseNotesPath)),
    changelogText: read('CHANGELOG.md'),
  };
}

export function validateReleaseMetadata(metadata) {
  const errors = [];
  const expect = (actual, expected, label) => {
    if (actual !== expected) errors.push(`${label}: expected ${expected}, found ${actual}`);
  };

  expect(metadata.lockVersion, metadata.packageVersion, 'package-lock top-level version');
  expect(metadata.lockRootVersion, metadata.packageVersion, 'package-lock root package version');
  expect(metadata.citationVersion, metadata.packageVersion, 'CITATION.cff version');
  expect(metadata.serviceWorkerVersion, metadata.packageVersion, 'Service-worker APP_VERSION');
  expect(metadata.leanApplicationVersion, metadata.packageVersion, 'Lean applicationVersion');
  expect(metadata.leanGraphSchemaVersion, metadata.graphSchemaVersion, 'Lean graphSchemaVersion');
  expect(metadata.leanCurationSchemaVersion, metadata.curationSchemaVersion, 'Lean curationSchemaVersion');
  expect(metadata.lockRootName, metadata.packageName, 'package-lock root package name');
  expect(metadata.releaseValidationCommand, 'node scripts/check-release-metadata.mjs', 'validate:release command');

  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/iu.test(metadata.serviceWorkerCacheRevision ?? '')) {
    errors.push('Service-worker CACHE_REVISION must be a bounded identifier');
  }
  if (!String(metadata.qualityGate ?? '').includes('npm run validate:release')) {
    errors.push('npm run check must execute validate:release');
  }

  const changelogPattern = new RegExp(`^## \\[${escapeRegExp(metadata.packageVersion)}\\]`, 'mu');
  if (!changelogPattern.test(metadata.changelogText)) {
    errors.push(`CHANGELOG.md is missing an entry for ${metadata.packageVersion}`);
  }
  if (!metadata.releaseNotesExists) {
    errors.push(`Missing release notes file: ${metadata.releaseNotesPath}`);
  }

  if (errors.length) throw new Error(errors.join('\n'));
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const metadata = collectReleaseMetadata();
  validateReleaseMetadata(metadata);
  console.log(`Release metadata validated for ${metadata.packageName} ${metadata.packageVersion}; PWA cache ${metadata.serviceWorkerCacheRevision}.`);
}
