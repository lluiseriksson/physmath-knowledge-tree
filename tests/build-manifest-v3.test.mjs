import test from 'node:test';
import assert from 'node:assert/strict';
import { BUILD_MANIFEST_FORMAT, computeArtifactSha256, derivePwaCacheRevision, injectPwaCacheRevision } from '../scripts/lib/build-manifest.mjs';

const files = [
  { path: 'a.txt', bytes: 1, sha256: 'a'.repeat(64) },
  { path: 'nested/b.txt', bytes: 2, sha256: 'b'.repeat(64) },
];

test('build manifest v3 exposes one deterministic aggregate artifact digest', () => {
  assert.equal(BUILD_MANIFEST_FORMAT, 3);
  const digest = computeArtifactSha256(files);
  assert.match(digest, /^[a-f0-9]{64}$/u);
  assert.equal(computeArtifactSha256(structuredClone(files)), digest);
  assert.notEqual(computeArtifactSha256([...files].reverse()), digest);
  assert.notEqual(computeArtifactSha256([{ ...files[0], bytes: 9 }, files[1]]), digest);
  assert.match(derivePwaCacheRevision([...files, { path: 'sw.js', bytes: 3, sha256: 'c'.repeat(64) }]), /^build-[a-f0-9]{16}$/u);
  assert.equal(
    derivePwaCacheRevision([...files, { path: 'sw.js', bytes: 3, sha256: 'c'.repeat(64) }]),
    derivePwaCacheRevision([...files, { path: 'sw.js', bytes: 99, sha256: 'd'.repeat(64) }]),
  );
});


test('production cache revision injection is exact and rejects malformed input', () => {
  const source = "const CACHE_REVISION = 'source-2026-06-23.3';\n";
  assert.equal(
    injectPwaCacheRevision(source, 'build-0123456789abcdef'),
    "const CACHE_REVISION = 'build-0123456789abcdef';\n",
  );
  assert.throws(() => injectPwaCacheRevision(source, 'invalid'), /Invalid production/);
  assert.throws(() => injectPwaCacheRevision('const OTHER = 1;\n', 'build-0123456789abcdef'), /found 0/);
  assert.throws(() => injectPwaCacheRevision(`${source}${source}`, 'build-0123456789abcdef'), /found 2/);
});
