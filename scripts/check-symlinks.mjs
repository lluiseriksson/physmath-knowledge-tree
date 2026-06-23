import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assertTreeHasNoSymlinks } from './lib/fs-safety.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
export const GENERATED_TOP_LEVEL = new Set(['.git', '.lake', 'coverage', 'dist', 'node_modules']);

/** Reject symbolic links in repository-controlled source trees. */
export function validateRepositorySymlinks(repositoryRoot = root, ignored = GENERATED_TOP_LEVEL) {
  let checkedEntries = 0;
  for (const name of readdirSync(repositoryRoot).sort()) {
    if (ignored.has(name)) continue;
    assertTreeHasNoSymlinks(join(repositoryRoot, name), name);
    checkedEntries += 1;
  }
  return checkedEntries;
}

const invokedAsScript = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  const checkedEntries = validateRepositorySymlinks();
  console.log(`Repository symlink preflight passed across ${checkedEntries} top-level entries.`);
}
