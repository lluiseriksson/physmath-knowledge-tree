import { lstatSync, readdirSync, realpathSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

/** Return true only when candidate is a descendant of root. */
export function isPathInside(root, candidate) {
  const rel = relative(resolve(root), resolve(candidate));
  if (rel === '' || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) return false;
  return true;
}

/** Resolve an existing path and reject targets that escape through symlinks or junctions. */
export function resolveRealPathInside(root, candidate) {
  const realRoot = realpathSync(root);
  const realCandidate = realpathSync(candidate);
  return isPathInside(realRoot, realCandidate) ? realCandidate : null;
}

/** Reject symbolic links anywhere in a build input tree. */
export function assertTreeHasNoSymlinks(path, displayPath = path) {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error(`Symbolic links are not allowed in build inputs: ${displayPath}`);
  if (!stat.isDirectory()) return;
  for (const name of readdirSync(path).sort()) {
    assertTreeHasNoSymlinks(join(path, name), `${displayPath}/${name}`);
  }
}

/** Return all non-directory, non-symlink entries under a directory. */
export function walkRegularFiles(directory) {
  const files = [];
  const visit = (path) => {
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) throw new Error(`Symbolic link found in closed artifact: ${path}`);
    if (stat.isDirectory()) {
      for (const name of readdirSync(path).sort()) visit(join(path, name));
      return;
    }
    files.push(path);
  };
  visit(directory);
  return files;
}
