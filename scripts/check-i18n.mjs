import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { learningMessages } from '../src/lib/i18n.js';
import { researchMessages } from '../src/lib/research-i18n.js';
import { validateCatalog, validateHtmlKeys } from './lib/i18n-validation.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const checks = [
  ['learning', learningMessages, 'learning.html'],
  ['research', researchMessages, 'index.html'],
];
let messages = 0;
let hooks = 0;
for (const [name, catalog, page] of checks) {
  messages += validateCatalog(name, catalog);
  hooks += validateHtmlKeys(page, readFileSync(join(root, page), 'utf8'), catalog);
}
console.log(`Validated ${messages} bilingual messages and ${hooks} static translation hooks.`);
