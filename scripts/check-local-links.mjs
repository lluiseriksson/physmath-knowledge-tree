import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, normalize, relative } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const errors = [];
const pages = ['index.html', 'learning.html', 'workbench.html', 'evidence.html', 'changes.html', 'offline.html', '404.html'];

function resolveLocal(source, value) {
  if (/^(?:https?:|data:|mailto:|tel:|#)/i.test(value)) return null;
  const clean = value.split('#')[0].split('?')[0].replace(/^<|>$/g, '');
  if (!clean) return null;
  const target = normalize(join(dirname(source), clean));
  const rel = relative(root, target);
  return { target, escaped: rel.startsWith('..') || isAbsolute(rel) };
}

function checkHtml(file) {
  const absolute = join(root, file);
  const text = readFileSync(absolute, 'utf8');
  for (const match of text.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const result = resolveLocal(absolute, match[1]);
    if (!result) continue;
    if (result.escaped || !existsSync(result.target)) errors.push(`${file}: missing or escaped local asset ${match[1]}`);
  }
  if (/<script(?![^>]*\bsrc=)/i.test(text)) errors.push(`${file}: inline script violates CSP`);
  if (/<style\b/i.test(text) || /\sstyle=["']/i.test(text)) errors.push(`${file}: inline style violates CSP`);
  if (!/http-equiv=["']Content-Security-Policy["']/i.test(text)) errors.push(`${file}: missing CSP meta policy`);
}

function walkMarkdown(dir, output = []) {
  for (const name of readdirSync(dir)) {
    if (['dist', '.git', 'node_modules'].includes(name)) continue;
    const absolute = join(dir, name);
    const stat = statSync(absolute);
    if (stat.isDirectory()) walkMarkdown(absolute, output);
    else if (extname(name) === '.md') output.push(absolute);
  }
  return output;
}

function checkMarkdown(absolute) {
  const text = readFileSync(absolute, 'utf8');
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    let value = match[1].trim();
    if (value.startsWith('<') && value.includes('>')) value = value.slice(1, value.indexOf('>'));
    else if (/\s+["']/.test(value)) value = value.split(/\s+["']/)[0];
    const result = resolveLocal(absolute, value);
    if (!result) continue;
    if (result.escaped || !existsSync(result.target)) errors.push(`${relative(root, absolute)}: missing or escaped Markdown target ${value}`);
  }
}

for (const page of pages) checkHtml(page);
for (const file of walkMarkdown(root)) checkMarkdown(file);

const sw = readFileSync(join(root, 'sw.js'), 'utf8');
for (const match of sw.matchAll(/["'](\.\/[^"']+)["']/g)) {
  const path = match[1];
  if (path === './') continue;
  if (!existsSync(join(root, path))) errors.push(`sw.js: missing cached asset ${path}`);
}

if (errors.length) throw new Error(errors.join('\n'));
console.log(`Local links, Markdown targets, CSP invariants and service-worker assets validated across ${pages.length} pages.`);
