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
const revision = sw.match(/const CACHE_REVISION = '([^']+)'/)?.[1];
ensure(version === pkg.version, `Service-worker version ${version} does not match package ${pkg.version}`);
ensure(/^[a-z0-9][a-z0-9._-]{0,63}$/iu.test(revision ?? ''), 'Source service worker needs a bounded cache revision');
ensure(!String(revision).startsWith('build-'), 'Source service worker must not commit a generated build revision');
ensure(sw.includes('`${CACHE_PREFIX}${APP_VERSION}-${CACHE_REVISION}`'), 'Service-worker cache namespace must include app and build revisions');
ensure(sw.includes('canonicalCacheRequest'), 'Service worker must canonicalize runtime cache keys');
ensure(sw.includes('ignoreSearch: true'), 'Service worker must ignore query strings when matching canonical assets');
ensure(sw.includes("'./offline.html'"), 'Service worker needs a dedicated offline fallback');
ensure(sw.includes('key.startsWith(CACHE_PREFIX)'), 'Service worker must delete only its own historical caches');
ensure(sw.includes('SHELL_CACHE') && sw.includes('RUNTIME_CACHE'), 'Service worker must separate shell and runtime caches');
ensure(sw.includes('CURRENT_CACHES.has(key)'), 'Service worker must preserve both current cache partitions');
const runtimeLimit = Number(sw.match(/const MAX_RUNTIME_ENTRIES = (\d+);/u)?.[1]);
ensure(Number.isInteger(runtimeLimit) && runtimeLimit >= 16 && runtimeLimit <= 256, 'Runtime cache needs a bounded entry limit between 16 and 256');
ensure(sw.includes('trimRuntimeCache(cache)'), 'Runtime cache must be trimmed after successful writes');
ensure(sw.includes('await cache.delete(key)') && sw.includes('await cache.put(key'), 'Runtime writes must refresh cache recency deterministically');
ensure(sw.indexOf('caches.open(RUNTIME_CACHE)') < sw.lastIndexOf('caches.open(SHELL_CACHE)'), 'Runtime matches must be considered before shell matches');
ensure(sw.includes('shellFallback(fallbackFor(url))'), 'Navigation fallbacks must be resolved from the current shell cache only');
ensure(sw.includes('response.status === 200'), 'Runtime caching must admit exact HTTP 200 responses only');
ensure(sw.includes("response.type === 'basic' || response.type === 'default'"), 'Runtime caching must reject opaque and partial responses');
ensure(sw.includes('!response.redirected'), 'Redirected responses must not enter the runtime cache');
ensure(sw.includes('Runtime cache update failed; returning the network response.'), 'Cache-write failures must not hide successful network responses');
ensure(sw.includes('if (!isCacheableRequest(request))'), 'Non-cacheable requests must bypass cache lookup and writes');
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
function readPngMetadata(src, label) {
  const path = join(root, String(src).replace(/^\.\//u, ''));
  ensure(existsSync(path), `Missing ${label}: ${src}`);
  const bytes = readFileSync(path);
  ensure(bytes.length >= 24 && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', `${label} is not a PNG: ${src}`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const iconPurposes = new Set();
for (const icon of manifest.icons ?? []) {
  const declared = /^(\d+)x(\d+)$/u.exec(icon.sizes ?? '');
  ensure(declared, `Manifest icon needs an explicit square size: ${icon.src}`);
  const { width, height } = readPngMetadata(icon.src, 'Manifest icon');
  ensure(width === Number(declared[1]) && height === Number(declared[2]), `Manifest icon size mismatch: ${icon.src}`);
  ensure(width === height, `Manifest icon must be square: ${icon.src}`);
  for (const purpose of String(icon.purpose ?? 'any').split(/\s+/u)) iconPurposes.add(`${width}:${purpose}`);
}
ensure(iconPurposes.has('192:any'), 'Manifest needs a 192px any-purpose icon');
ensure(iconPurposes.has('512:any'), 'Manifest needs a 512px any-purpose icon');
ensure(iconPurposes.has('512:maskable'), 'Manifest needs a 512px maskable icon');

let wideScreenshots = 0;
for (const screenshot of manifest.screenshots ?? []) {
  const declared = /^(\d+)x(\d+)$/u.exec(screenshot.sizes ?? '');
  ensure(declared, `Manifest screenshot needs an explicit size: ${screenshot.src}`);
  const { width, height } = readPngMetadata(screenshot.src, 'Manifest screenshot');
  ensure(width === Number(declared[1]) && height === Number(declared[2]), `Manifest screenshot size mismatch: ${screenshot.src}`);
  ensure(typeof screenshot.label === 'string' && screenshot.label.trim(), `Manifest screenshot needs a label: ${screenshot.src}`);
  ensure(['wide', 'narrow'].includes(screenshot.form_factor), `Invalid screenshot form_factor: ${screenshot.src}`);
  if (screenshot.form_factor === 'wide') wideScreenshots += 1;
}
ensure(wideScreenshots >= 2, 'Manifest needs wide screenshots for both application surfaces');
ensure(['standalone', 'minimal-ui'].includes(manifest.display), 'Manifest display mode must be standalone or minimal-ui');
const shortcutUrls = new Set();
for (const shortcut of manifest.shortcuts ?? []) {
  ensure(typeof shortcut.name === 'string' && shortcut.name.trim(), 'Manifest shortcuts need non-empty names');
  ensure(typeof shortcut.url === 'string' && shortcut.url.startsWith('./'), `Manifest shortcut must be subpath safe: ${shortcut.url}`);
  ensure(!shortcutUrls.has(shortcut.url), `Duplicate manifest shortcut URL: ${shortcut.url}`);
  shortcutUrls.add(shortcut.url);
  const canonical = shortcut.url === './' ? './' : shortcut.url.split(/[?#]/u)[0];
  ensure(shell.includes(canonical), `Manifest shortcut is missing from the offline shell: ${shortcut.url}`);
}
ensure(shortcutUrls.has('./') && shortcutUrls.has('./learning.html'), 'Manifest needs shortcuts for research and learning surfaces');
ensure(manifest.start_url === './' && manifest.scope === './', 'Manifest must remain repository-subpath safe');
ensure(manifest.id === './', 'Manifest app id must be stable and subpath safe');

for (const page of ['index.html', 'learning.html', 'offline.html']) {
  const html = readFileSync(join(root, page), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="(\.\/[^\"]+)"/g)) {
    const asset = match[1].split(/[?#]/)[0];
    if (asset === './' || asset.endsWith('.md') || asset.startsWith('./docs/') || asset.startsWith('./graph/index.json')) continue;
    ensure(shell.includes(asset), `${page}: critical local asset missing from service-worker shell: ${asset}`);
  }
}
console.log(`PWA source validated for version ${pkg.version}, cache revision ${revision}, with ${shell.length} cached entries and ${wideScreenshots} install screenshots.`);
