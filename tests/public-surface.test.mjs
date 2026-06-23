import assert from 'node:assert/strict';
import test from 'node:test';
import {
  GENERATED_PUBLIC_FILES,
  PUBLIC_BUILD_INPUTS,
  PUBLIC_SOURCE_DIRECTORIES,
  PUBLIC_SOURCE_FILES,
  isPublicArtifactPath,
} from '../scripts/lib/public-surface.mjs';

test('public surface constants are closed, unique and include licensing', () => {
  const all = [...PUBLIC_SOURCE_FILES, ...PUBLIC_SOURCE_DIRECTORIES, ...GENERATED_PUBLIC_FILES];
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual(PUBLIC_BUILD_INPUTS, [...PUBLIC_SOURCE_FILES, ...PUBLIC_SOURCE_DIRECTORIES]);
  assert.ok(PUBLIC_SOURCE_FILES.includes('LICENSE'));
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
