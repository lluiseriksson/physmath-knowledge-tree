import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const pages = ['index.html', 'learning.html', 'workbench.html', 'evidence.html', '404.html', 'offline.html'];
const errors = [];

function attributes(source) {
  const result = new Map();
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = pattern.exec(source))) result.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  return result;
}

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  if (!/<html\b[^>]*\blang=(?:"[^"]+"|'[^']+')/i.test(html)) errors.push(`${page}: html lang attribute required`);
  if (!/<main\b/i.test(html)) errors.push(`${page}: main landmark required`);
  const ids = new Set();
  for (const match of html.matchAll(/\bid=(?:"([^"]+)"|'([^']+)')/gi)) {
    const id = match[1] ?? match[2];
    if (ids.has(id)) errors.push(`${page}: duplicate id ${id}`);
    ids.add(id);
  }
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = attributes(match[1]);
    if (!attrs.has('alt')) errors.push(`${page}: image missing alt attribute`);
  }
  for (const match of html.matchAll(/<button\b([^>]*)>/gi)) {
    const attrs = attributes(match[1]);
    if (!attrs.has('type')) errors.push(`${page}: button missing explicit type (${attrs.get('id') ?? 'unnamed'})`);
    if (attrs.get('tabindex') && Number(attrs.get('tabindex')) > 0) errors.push(`${page}: positive tabindex is not allowed`);
  }
  for (const match of html.matchAll(/<label\b([^>]*)>/gi)) {
    const attrs = attributes(match[1]);
    const target = attrs.get('for');
    if (target && !ids.has(target)) errors.push(`${page}: label references missing id ${target}`);
  }
  for (const match of html.matchAll(/<input\b([^>]*)>/gi)) {
    const attrs = attributes(match[1]);
    if (attrs.get('type') !== 'search') continue;
    const hasName = attrs.has('aria-label') || attrs.has('aria-labelledby') || attrs.has('data-i18n-aria');
    if (!hasName) errors.push(`${page}: search input needs an accessible name (${attrs.get('id') ?? 'unnamed'})`);
  }
  for (const match of html.matchAll(/<[^>]+\brole=(?:"progressbar"|'progressbar')[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    for (const required of ['aria-valuemin', 'aria-valuemax', 'aria-valuenow']) {
      if (!attrs.has(required)) errors.push(`${page}: progressbar missing ${required}`);
    }
  }
  for (const attrName of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
    const pattern = new RegExp(`${attrName}=(?:"([^"]+)"|'([^']+)')`, 'gi');
    for (const match of html.matchAll(pattern)) {
      for (const target of (match[1] ?? match[2]).split(/\s+/).filter(Boolean)) {
        if (!ids.has(target)) errors.push(`${page}: ${attrName} references missing id ${target}`);
      }
    }
  }
  for (const match of html.matchAll(/\btabindex=(?:"([^"]+)"|'([^']+)')/gi)) {
    if (Number(match[1] ?? match[2]) > 0) errors.push(`${page}: positive tabindex is not allowed`);
  }
  if (['index.html', 'learning.html', 'workbench.html', 'evidence.html'].includes(page) && !/<a\b[^>]*class=(?:"[^"]*skip-link| '[^']*skip-link)/i.test(html)) {
    errors.push(`${page}: skip link required`);
  }
}

if (errors.length) throw new Error(errors.slice(0, 80).join('\n'));
console.log(`Static accessibility invariants passed across ${pages.length} pages.`);
