import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = [];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (['dist', '.git', 'node_modules'].includes(name)) continue;
    const file = join(directory, name);
    const stat = statSync(file);
    if (stat.isDirectory()) walk(file);
    else if (/\.(?:js|mjs)$/u.test(name)) files.push(file);
  }
}

walk(root);
files.sort();
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${relative(root, file)}\n${result.stderr}`);
}
console.log(`Syntax checked ${files.length} JavaScript files.`);
