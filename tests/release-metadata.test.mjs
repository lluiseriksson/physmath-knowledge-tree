import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCitationVersion,
  parseLeanString,
  parseServiceWorkerConstant,
  validateReleaseMetadata,
} from '../scripts/check-release-metadata.mjs';

function validMetadata(overrides = {}) {
  return {
    packageName: 'physmath-knowledge-tree',
    packageVersion: '2.6.0',
    lockVersion: '2.6.0',
    lockRootName: 'physmath-knowledge-tree',
    lockRootVersion: '2.6.0',
    citationVersion: '2.6.0',
    serviceWorkerVersion: '2.6.0',
    serviceWorkerCacheRevision: 'source-2026-06-23.2',
    graphSchemaVersion: '0.6.0',
    graphApplicationVersion: '2.6.0',
    curationSchemaVersion: '1.2.0',
    leanApplicationVersion: '2.6.0',
    leanGraphSchemaVersion: '0.6.0',
    leanCurationSchemaVersion: '1.2.0',
    releaseValidationCommand: 'node scripts/check-release-metadata.mjs',
    i18nValidationCommand: 'node scripts/check-i18n.mjs',
    jsonLdGenerationCommand: 'node scripts/export-jsonld.mjs --output graph/knowledge-graph.jsonld',
    jsonLdValidationCommand: 'node scripts/export-jsonld.mjs --check',
    routePlannerCommand: 'node scripts/plan-route.mjs',
    jsonLdExportCommand: 'node scripts/export-jsonld.mjs',
    jsonLdPath: 'graph/knowledge-graph.jsonld',
    jsonLdExists: true,
    qualityGate: 'npm run validate:pwa && npm run validate:release && npm run validate:i18n && npm run validate:jsonld && npm run build',
    releaseNotesPath: 'docs/RELEASE_2_6_0.md',
    releaseNotesExists: true,
    changelogText: '## [2.6.0] — 2026-06-22\n',
    ...overrides,
  };
}

test('release parsers read application, cache and Lean declarations', () => {
  assert.equal(parseCitationVersion('version: 2.6.0\n'), '2.6.0');
  assert.equal(parseServiceWorkerConstant("const CACHE_REVISION = 'source-2026-06-23.2';", 'CACHE_REVISION'), 'source-2026-06-23.2');
  assert.equal(parseLeanString('def applicationVersion : String := "2.6.0"', 'applicationVersion'), '2.6.0');
});

test('release validator accepts synchronized metadata and rejects drift', () => {
  assert.equal(validateReleaseMetadata(validMetadata()), true);
  assert.throws(() => validateReleaseMetadata(validMetadata({ serviceWorkerVersion: '2.6.1' })), /APP_VERSION/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ graphApplicationVersion: '2.5.0' })), /application_version/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ serviceWorkerCacheRevision: 'bad revision!' })), /CACHE_REVISION/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ qualityGate: 'npm run build' })), /must execute validate:release/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ releaseValidationCommand: 'node other.mjs' })), /validate:release command/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ routePlannerCommand: 'node other.mjs' })), /route:plan command/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ jsonLdGenerationCommand: 'node other.mjs' })), /generate:jsonld command/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ jsonLdValidationCommand: 'node other.mjs' })), /validate:jsonld command/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ jsonLdExists: false })), /knowledge-graph\.jsonld/);
  assert.throws(() => validateReleaseMetadata(validMetadata({ releaseNotesExists: false })), /Missing release notes/);
});
