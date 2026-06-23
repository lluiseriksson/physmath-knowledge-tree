import { createHash } from 'node:crypto';

export const BUILD_MANIFEST_FORMAT = 3;

/** Compute one aggregate digest over an ordered closed artifact file table. */
export function computeArtifactSha256(files) {
  const canonical = files.map(({ path, bytes, sha256 }) => [path, bytes, sha256]);
  return createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
}

/** Derive a production cache revision from every built payload except the worker itself. */
export function derivePwaCacheRevision(files) {
  const payload = files.filter(({ path }) => path !== 'sw.js');
  return `build-${computeArtifactSha256(payload).slice(0, 16)}`;
}

/** Replace exactly one source cache revision with a content-derived build revision. */
export function injectPwaCacheRevision(source, revision) {
  if (!/^build-[a-f0-9]{16}$/u.test(revision)) throw new Error(`Invalid production PWA cache revision: ${revision}`);
  const pattern = /const CACHE_REVISION = '[^']+';/gu;
  const matches = [...String(source).matchAll(pattern)];
  if (matches.length !== 1) throw new Error(`Expected one service-worker CACHE_REVISION declaration, found ${matches.length}`);
  return String(source).replace(pattern, `const CACHE_REVISION = '${revision}';`);
}
