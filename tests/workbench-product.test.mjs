import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));
const html = readFileSync(join(root, 'workbench.html'), 'utf8');
const app = readFileSync(join(root, 'src/workbench-app.js'), 'utf8');
const css = readFileSync(join(root, 'src/workbench.css'), 'utf8');

function attributes(source) {
  const result = new Map();
  for (const match of source.matchAll(/([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu)) {
    result.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}

test('workbench is a CSP-safe, local-first third application surface', () => {
  assert.match(html, /http-equiv="Content-Security-Policy"/u);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/iu);
  assert.doesNotMatch(html, /<style\b|\sstyle=["']/iu);
  assert.match(html, /href="\.\/"[^>]*data-i18n="nav\.research"/u);
  assert.match(html, /href="\.\/learning\.html"/u);
  assert.match(html, /href="\.\/workbench\.html"[^>]*aria-current="page"/u);
  assert.match(app, /physmath\.workbench\./u);
  assert.match(app, /loadWorkspaceLibrary\(state\.storage/u);
  assert.match(app, /function browserStorage\(\)/u);
  assert.doesNotMatch(app, /\binnerHTML\b/u);
  assert.doesNotMatch(app, /fetch\(['"]https?:/u);
});

test('new local workbench assets resolve and upstream module dependencies stay repository-relative', () => {
  for (const relative of ['workbench.html', 'src/workbench-app.js', 'src/workbench.css', 'src/lib/workspace.js']) {
    assert.equal(existsSync(join(root, relative)), true, relative);
  }
  const appPath = join(root, 'src/workbench-app.js');
  const imports = [...app.matchAll(/import\s+(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/gu)].map((match) => match[1]);
  assert.deepEqual(new Set(imports), new Set([
    './lib/research-graph.js', './lib/route-planner.js', './lib/workspace.js', './lib/text.js',
  ]));
  for (const specifier of imports) {
    assert.equal(specifier.startsWith('./lib/') && !specifier.includes('..'), true, specifier);
  }
  assert.equal(existsSync(normalize(join(dirname(appPath), './lib/workspace.js'))), true);
});

test('static accessibility invariants cover labels, unique IDs and explicit buttons', () => {
  const ids = new Set();
  for (const match of html.matchAll(/\bid="([^"]+)"/gu)) {
    assert.equal(ids.has(match[1]), false, `duplicate id ${match[1]}`);
    ids.add(match[1]);
  }
  assert.match(html, /class="skip-link"/u);
  assert.match(html, /<main\b/u);
  for (const match of html.matchAll(/<button\b([^>]*)>/gu)) {
    assert.equal(attributes(match[1]).has('type'), true, match[0]);
  }
  for (const match of html.matchAll(/<label\b([^>]*)>/gu)) {
    const target = attributes(match[1]).get('for');
    if (target) assert.equal(ids.has(target), true, `missing labelled target ${target}`);
  }
  for (const required of [
    'workspace-select', 'node-search', 'neighborhood-left', 'neighborhood-right',
    'route-source', 'route-target', 'workspace-notes', 'draft-markdown',
    'negative-observation', 'export-workspaces', 'import-workspaces',
  ]) assert.equal(ids.has(required), true, required);
});

test('workbench exposes comparisons, drafts and a structured negative-results ledger', () => {
  assert.match(app, /connectedNeighborhood\(/u);
  assert.match(app, /compareNodeSets\(/u);
  assert.match(app, /planResearchRoute\(/u);
  assert.match(app, /summarizeRouteEvidence\(/u);
  assert.match(app, /bridge_cards/u);
  assert.match(app, /negative_results/u);
  assert.match(app, /challenged_mechanism/u);
  assert.match(app, /next_test/u);
  assert.match(html, /value="observed"/u);
  assert.match(html, /value="inconclusive"/u);
  assert.match(html, /value="falsified"/u);
});

test('responsive styling includes focus, reduced motion and mobile layouts', () => {
  assert.match(css, /:focus-visible/u);
  assert.match(css, /prefers-reduced-motion/u);
  assert.match(css, /@media \(max-width: 720px\)/u);
  assert.match(css, /color-scheme: light dark/u);
});

test('every declarative workbench label is present in both language dictionaries', () => {
  const keys = new Set([...html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/gu)].map((match) => match[1]));
  const englishStart = app.indexOf('  en: {');
  const spanishStart = app.indexOf('  es: {');
  const dictionariesEnd = app.indexOf('\n};', spanishStart);
  assert.notEqual(englishStart, -1);
  assert.notEqual(spanishStart, -1);
  assert.notEqual(dictionariesEnd, -1);
  const english = app.slice(englishStart, spanishStart);
  const spanish = app.slice(spanishStart, dictionariesEnd);
  for (const key of keys) {
    const quoted = `'${key}':`;
    const bare = `${key}:`;
    assert.equal(english.includes(quoted) || english.includes(bare), true, `English ${key}`);
    assert.equal(spanish.includes(quoted) || spanish.includes(bare), true, `Spanish ${key}`);
  }
});
