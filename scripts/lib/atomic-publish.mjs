import { existsSync, renameSync, rmSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

/** Return a same-filesystem backup path for one target directory. */
export function defaultBackupPath(target, processId = process.pid) {
  return join(dirname(target), `.${basename(target)}-backup-${processId}`);
}

/**
 * Replace a target directory with a prepared staging directory without exposing
 * a partially-built artifact. If the publish rename fails, restore the prior
 * target before rethrowing.
 *
 * @param {string} staging
 * @param {string} target
 * @param {{backupPath?:string,exists?:(path:string)=>boolean,rename?:(from:string,to:string)=>void,remove?:(path:string)=>void}} [options]
 */
export function publishDirectoryAtomically(staging, target, options = {}) {
  const exists = options.exists ?? existsSync;
  const rename = options.rename ?? renameSync;
  const remove = options.remove ?? ((path) => rmSync(path, { recursive: true, force: true }));
  const backup = options.backupPath ?? defaultBackupPath(target);

  if (!exists(staging)) throw new Error(`Missing staged artifact: ${staging}`);
  if (staging === target || backup === staging || backup === target) {
    throw new Error('Atomic publish paths must be distinct');
  }
  if (exists(backup)) remove(backup);

  const replaced = exists(target);
  if (replaced) rename(target, backup);
  try {
    rename(staging, target);
  } catch (publishError) {
    if (replaced && !exists(target) && exists(backup)) {
      try {
        rename(backup, target);
      } catch (restoreError) {
        throw new AggregateError(
          [publishError, restoreError],
          `Failed to publish ${target} and restore the prior artifact`,
        );
      }
    }
    throw publishError;
  }

  if (replaced && exists(backup)) remove(backup);
  return { target, replaced };
}
