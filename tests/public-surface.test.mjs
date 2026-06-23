import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  assertGraphIndexArtifactClosure,
  collectGraphIndexArtifactPaths,
  GENERATED_PUBLIC_FILES,
  PUBLIC_BUILD_INPUTS,
  PUBLIC_SOURCE_DIRECTORIES,
  PUBLIC_SOURCE_FILES,
  isPublicArtifactPath,
} from '../scripts/lib/public-surface.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

test('public surface constants are closed, unique and include licensing', () => {
  const all = [...PUBLIC_SOURCE_FILES, ...PUBLIC_SOURCE_DIRECTORIES, ...GENERATED_PUBLIC_FILES];
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual(PUBLIC_BUILD_INPUTS, [...PUBLIC_SOURCE_FILES, ...PUBLIC_SOURCE_DIRECTORIES]);
  assert.ok(PUBLIC_SOURCE_FILES.includes('AGENTS.md'));
  assert.ok(PUBLIC_SOURCE_FILES.includes('LICENSE'));
  assert.ok(PUBLIC_SOURCE_DIRECTORIES.includes('evaluation'));
  assert.ok(PUBLIC_SOURCE_DIRECTORIES.includes('integrations'));
  assert.ok(PUBLIC_SOURCE_DIRECTORIES.includes('prompts'));
  assert.ok(GENERATED_PUBLIC_FILES.includes('build-manifest.json'));
  assert.equal(PUBLIC_BUILD_INPUTS.includes('_headers'), false);
});

test('public artifact path validation mirrors source and generated surfaces', () => {
  for (const file of [...PUBLIC_SOURCE_FILES, ...GENERATED_PUBLIC_FILES]) {
    assert.equal(isPublicArtifactPath(file), true, file);
    assert.equal(isPublicArtifactPath(`/${file}/`), true, file);
  }
  for (const directory of PUBLIC_SOURCE_DIRECTORIES) {
    assert.equal(isPublicArtifactPath(`${directory}/file.txt`), true, directory);
  }
  for (const path of [
    '', '/', 'package.json', 'scripts/serve.mjs', 'tests/test.mjs', '.git/config',
    'assets/.secret', 'docs//file.md', '../index.html', 'assets\\file.js', 'bad\0name',
  ]) {
    assert.equal(isPublicArtifactPath(path), false, path);
  }
  assert.equal(isPublicArtifactPath(null), false);
});

test('graph index discovery metadata is a closed public artifact contract', () => {
  const graphIndex = JSON.parse(readFileSync(join(root, 'graph/index.json'), 'utf8'));
  const advertised = collectGraphIndexArtifactPaths(graphIndex);
  assert.deepEqual(advertised, [...new Set(advertised)].sort());
  for (const path of advertised) assert.ok(existsSync(join(root, path)), path);
  assert.doesNotThrow(() => assertGraphIndexArtifactClosure(graphIndex, new Set(advertised)));

  const missing = new Set(advertised);
  missing.delete('integrations/yang-mills/manifest.json');
  assert.throws(
    () => assertGraphIndexArtifactClosure(graphIndex, missing),
    /missing from the public artifact: integrations\/yang-mills\/manifest\.json/,
  );

  const outside = {
    ...graphIndex,
    integrations: { ...graphIndex.integrations, private: 'scripts/private.mjs' },
  };
  assert.throws(
    () => assertGraphIndexArtifactClosure(outside, new Set(advertised)),
    /outside the public surface: scripts\/private\.mjs/,
  );
});
