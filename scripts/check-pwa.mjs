import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, normalize, relative } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const fail = (message) => { throw new Error(message); };
const ensure = (condition, message) => { if (!condition) fail(message); };
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'manifest.webmanifest'), 'utf8'));
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const version = sw.match(/const APP_VERSION = '([^']+)'/)?.[1];
ensure(version === pkg.version, `Service-worker version ${version} does not match package ${pkg.version}`);
ensure(sw.includes('ignoreSearch: true'), 'Service worker must ignore query strings for cached navigation/assets');
ensure(sw.includes("'./offline.html'"), 'Service worker needs a dedicated offline fallback');
ensure(sw.includes('key.startsWith(CACHE_PREFIX)'), 'Service worker must delete only its own historical caches');
ensure(/await self\.skipWaiting\(\)/u.test(sw), 'Service-worker activation handoff must be awaited');

const shellBlock = sw.match(/const SHELL = \[([\s\S]*?)\];/)?.[1];
ensure(shellBlock, 'Could not parse service-worker shell');
const shell = Function(`"use strict"; return [${shellBlock}];`)();
ensure(new Set(shell).size === shell.length, 'Service-worker shell contains duplicates');
for (const item of shell) {
  if (item === './') continue;
  ensure(item.startsWith('./'), `Invalid shell path: ${item}`);
  ensure(existsSync(join(root, item.slice(2))), `Missing service-worker asset: ${item}`);
}

const shellSet = new Set(shell);
for (const item of shell.filter((value) => value.endsWith('.js'))) {
  const sourcePath = join(root, item.slice(2));
  const source = readFileSync(sourcePath, 'utf8');
  const imports = [...source.matchAll(/(?:import\s+(?:[^'"]+?\s+from\s+)?|export\s+[^'"]+?\s+from\s+)["']([^"']+)["']/gu)];
  for (const match of imports) {
    if (!match[1].startsWith('.')) continue;
    const dependency = normalize(join(dirname(sourcePath), match[1]));
    const dependencyRelative = relative(root, dependency);
    ensure(!dependencyRelative.startsWith('..') && !isAbsolute(dependencyRelative), `${item}: module import escapes repository root: ${match[1]}`);
    const shellPath = `./${relative(root, dependency).replaceAll('\\', '/')}`;
    ensure(existsSync(dependency), `${item}: missing module dependency ${match[1]}`);
    ensure(shellSet.has(shellPath), `${item}: module dependency missing from offline shell: ${shellPath}`);
  }
}
const iconPurposes = new Set();
for (const icon of manifest.icons ?? []) {
  const iconPath = join(root, icon.src.replace(/^\.\//, ''));
  ensure(existsSync(iconPath), `Missing manifest icon: ${icon.src}`);
  const declared = /^(\d+)x(\d+)$/u.exec(icon.sizes ?? '');
  ensure(declared, `Manifest icon needs an explicit square size: ${icon.src}`);
  const bytes = readFileSync(iconPath);
  ensure(bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', `Manifest icon is not a PNG: ${icon.src}`);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  ensure(width === Number(declared[1]) && height === Number(declared[2]), `Manifest icon size mismatch: ${icon.src}`);
  ensure(width === height, `Manifest icon must be square: ${icon.src}`);
  for (const purpose of String(icon.purpose ?? 'any').split(/\s+/u)) iconPurposes.add(`${width}:${purpose}`);
}
ensure(iconPurposes.has('192:any'), 'Manifest needs a 192px any-purpose icon');
ensure(iconPurposes.has('512:any'), 'Manifest needs a 512px any-purpose icon');
ensure(iconPurposes.has('512:maskable'), 'Manifest needs a 512px maskable icon');
ensure(manifest.start_url === './' && manifest.scope === './', 'Manifest must remain repository-subpath safe');
ensure(manifest.id === './', 'Manifest app id must be stable and subpath safe');

for (const page of ['index.html', 'learning.html', 'offline.html']) {
  const html = readFileSync(join(root, page), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)) {
    const asset = match[1].split(/[?#]/)[0];
    if (asset === './' || asset.endsWith('.md') || asset.startsWith('./docs/') || asset.startsWith('./graph/index.json')) continue;
    ensure(shell.includes(asset), `${page}: critical local asset missing from service-worker shell: ${asset}`);
  }
}
console.log(`PWA shell validated for version ${pkg.version} with ${shell.length} cached entries.`);
