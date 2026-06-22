import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const inputs = [
  'index.html',
  'learning.html',
  '404.html',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
  '.nojekyll',
  'assets',
  'src',
  'graph',
  'docs',
  'curation',
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const item of inputs) {
  const from = join(root, item);
  if (!existsSync(from)) throw new Error(`Missing build input: ${item}`);
  cpSync(from, join(dist, item), { recursive: true });
}

// Useful on hosts that support static response-header files; harmless on GitHub Pages.
writeFileSync(join(dist, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin

/sw.js
  Cache-Control: no-cache
`);
console.log('Static build created in dist/.');
