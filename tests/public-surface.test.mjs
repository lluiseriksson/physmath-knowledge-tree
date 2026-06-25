import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  assertGraphIndexArtifactClosure,
  collectGraphIndexArtifactPaths,
  collectPublicGraphIndexArtifactPaths,
  GENERATED_PUBLIC_FILES,
  PUBLIC_BUILD_INPUTS,
  PUBLIC_SOURCE_DIRECTORIES,
  PUBLIC_SOURCE_FILES,
  isPublicArtifactPath,
} from '../scripts/lib/public-surface.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

function graphIndexFixture() {
  return JSON.parse(readFileSync(join(root, 'graph/index.json'), 'utf8'));
}

test('public surface constants are closed, unique and include licensing', () => {
  const all = [...PUBLIC_SOURCE_FILES, ...PUBLIC_SOURCE_DIRECTORIES, ...GENERATED_PUBLIC_FILES];
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual(PUBLIC_BUILD_INPUTS, [...PUBLIC_SOURCE_FILES, ...PUBLIC_SOURCE_DIRECTORIES]);
  assert.ok(PUBLIC_SOURCE_FILES.includes('AGENTS.md'));
  assert.ok(PUBLIC_SOURCE_FILES.includes('LICENSE'));
  assert.ok(PUBLIC_SOURCE_FILES.includes('workbench.html'));
  assert.ok(PUBLIC_SOURCE_FILES.includes('evidence.html'));
  assert.ok(PUBLIC_SOURCE_FILES.includes('changes.html'));
  assert.ok(PUBLIC_SOURCE_FILES.includes('formalization.html'));
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
  const graphIndex = graphIndexFixture();
  const advertised = collectGraphIndexArtifactPaths(graphIndex);
  assert.deepEqual(advertised, [...advertised].sort());
  assert.ok(graphIndex.agent_entrypoints.includes(graphIndex.generated_files.jsonld));
  assert.equal(advertised.filter((path) => path === graphIndex.generated_files.jsonld).length, 1);
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
    () => collectPublicGraphIndexArtifactPaths(outside),
    /outside the public surface: scripts\/private\.mjs/,
  );
});

test('graph index discovery rejects duplicate and malformed path metadata', () => {
  const graphIndex = graphIndexFixture();

  assert.throws(
    () => collectGraphIndexArtifactPaths({
      ...graphIndex,
      agent_entrypoints: [...graphIndex.agent_entrypoints, graphIndex.agent_entrypoints[0]],
    }),
    /agent_entrypoints advertises a path more than once: AGENTS\.md/,
  );

  assert.throws(
    () => collectGraphIndexArtifactPaths({ ...graphIndex, schemas: { ...graphIndex.schemas, bad: null } }),
    /schemas\.bad must be a string path/,
  );

  assert.throws(
    () => collectGraphIndexArtifactPaths({
      ...graphIndex,
      schemas: { ...graphIndex.schemas, duplicate: graphIndex.schemas.nodes },
    }),
    /schemas advertises a path more than once: graph\/schemas\/node\.schema\.json/,
  );

  assert.throws(
    () => collectGraphIndexArtifactPaths({ ...graphIndex, integrations: undefined }),
    /integrations must be an object/,
  );

  assert.throws(
    () => collectGraphIndexArtifactPaths({ ...graphIndex, agent_entrypoints: 'AGENTS.md' }),
    /agent_entrypoints must be an array/,
  );

  assert.throws(
    () => collectGraphIndexArtifactPaths({
      ...graphIndex,
      agent_entrypoints: graphIndex.agent_entrypoints.map((path, index) => index === 0 ? '/AGENTS.md' : path),
    }),
    /agent_entrypoints\[0\] must be a normalized repository-relative path/,
  );
});
