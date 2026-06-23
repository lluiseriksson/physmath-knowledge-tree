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
  const jsonLdPath = graph.generated_files?.jsonld;

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
    graphApplicationVersion: graph.application_version,
    curationSchemaVersion: curation.schema_version,
    leanApplicationVersion: parseLeanString(lean, 'applicationVersion'),
    leanGraphSchemaVersion: parseLeanString(lean, 'graphSchemaVersion'),
    leanCurationSchemaVersion: parseLeanString(lean, 'curationSchemaVersion'),
    releaseValidationCommand: pkg.scripts?.['validate:release'],
    i18nValidationCommand: pkg.scripts?.['validate:i18n'],
    jsonLdGenerationCommand: pkg.scripts?.['generate:jsonld'],
    jsonLdValidationCommand: pkg.scripts?.['validate:jsonld'],
    routePlannerCommand: pkg.scripts?.['route:plan'],
    jsonLdExportCommand: pkg.scripts?.['export:jsonld'],
    qualityGate: pkg.scripts?.check,
    jsonLdPath,
    jsonLdExists: typeof jsonLdPath === 'string' && existsSync(join(repositoryRoot, jsonLdPath)),
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
  expect(metadata.graphApplicationVersion, metadata.packageVersion, 'graph/index.json application_version');
  expect(metadata.leanGraphSchemaVersion, metadata.graphSchemaVersion, 'Lean graphSchemaVersion');
  expect(metadata.leanCurationSchemaVersion, metadata.curationSchemaVersion, 'Lean curationSchemaVersion');
  expect(metadata.lockRootName, metadata.packageName, 'package-lock root package name');
  expect(metadata.releaseValidationCommand, 'node scripts/check-release-metadata.mjs', 'validate:release command');
  expect(metadata.i18nValidationCommand, 'node scripts/check-i18n.mjs', 'validate:i18n command');
  expect(metadata.jsonLdGenerationCommand, 'node scripts/export-jsonld.mjs --output graph/knowledge-graph.jsonld', 'generate:jsonld command');
  expect(metadata.jsonLdValidationCommand, 'node scripts/export-jsonld.mjs --check', 'validate:jsonld command');
  expect(metadata.routePlannerCommand, 'node scripts/plan-route.mjs', 'route:plan command');
  expect(metadata.jsonLdExportCommand, 'node scripts/export-jsonld.mjs', 'export:jsonld command');

  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/iu.test(metadata.serviceWorkerCacheRevision ?? '')) {
    errors.push('Service-worker CACHE_REVISION must be a bounded identifier');
  }
  for (const command of ['validate:release', 'validate:i18n', 'validate:jsonld']) {
    if (!String(metadata.qualityGate ?? '').includes(`npm run ${command}`)) {
      errors.push(`npm run check must execute ${command}`);
    }
  }

  const changelogPattern = new RegExp(`^## \\[${escapeRegExp(metadata.packageVersion)}\\]`, 'mu');
  if (!changelogPattern.test(metadata.changelogText)) {
    errors.push(`CHANGELOG.md is missing an entry for ${metadata.packageVersion}`);
  }
  if (metadata.jsonLdPath !== 'graph/knowledge-graph.jsonld' || !metadata.jsonLdExists) {
    errors.push('Missing canonical graph/knowledge-graph.jsonld generated projection');
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
