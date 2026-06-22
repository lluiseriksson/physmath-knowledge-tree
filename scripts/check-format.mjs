import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const errors = [];
const textExtensions = new Set([
  '.cff', '.css', '.editorconfig', '.gitattributes', '.gitignore', '.html', '.js',
  '.json', '.lean', '.md', '.mjs', '.npmrc', '.nvmrc', '.svg', '.toml', '.txt',
  '.webmanifest', '.yaml', '.yml',
]);
const extensionlessText = new Set(['LICENSE']);

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (['dist', '.git', 'node_modules'].includes(name)) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (!textExtensions.has(extname(name)) && !extensionlessText.has(name) && !name.startsWith('.')) continue;
    let text;
    try { text = readFileSync(path, 'utf8'); } catch { continue; }
    const rel = relative(root, path);
    if (text.includes('\r')) errors.push(`${rel}: CRLF line endings`);
    if (text && !text.endsWith('\n')) errors.push(`${rel}: missing final newline`);
    text.split('\n').forEach((line, index) => {
      if (/[ \t]+$/.test(line)) errors.push(`${rel}:${index + 1}: trailing whitespace`);
    });
  }
}

walk(root);
if (errors.length) throw new Error(errors.slice(0, 50).join('\n'));
console.log('Formatting invariants passed.');
