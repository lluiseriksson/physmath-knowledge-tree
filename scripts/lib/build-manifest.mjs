import { createHash } from 'node:crypto';

export const BUILD_MANIFEST_FORMAT = 2;

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
