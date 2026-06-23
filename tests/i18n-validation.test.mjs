import assert from 'node:assert/strict';
import test from 'node:test';
import { learningMessages } from '../src/lib/i18n.js';
import { researchMessages } from '../src/lib/research-i18n.js';
import {
  htmlTranslationKeys,
  messageVariables,
  validateCatalog,
  validateHtmlKeys,
} from '../scripts/lib/i18n-validation.mjs';

test('translation catalogs retain bilingual key and interpolation parity', () => {
  assert.ok(validateCatalog('learning', learningMessages) > 50);
  assert.ok(validateCatalog('research', researchMessages) > 50);
  assert.deepEqual(messageVariables('{count} nodes · {count} total · {name}'), ['count', 'name']);
  assert.deepEqual(htmlTranslationKeys('<p data-i18n="a"></p><input data-i18n-placeholder="b"><button data-i18n-aria="c">'), ['a', 'b', 'c']);
  assert.equal(validateHtmlKeys('fixture', '<p data-i18n="key"></p>', {
    en: { key: 'Value' }, es: { key: 'Valor' },
  }), 1);
});

test('translation validation reports missing dictionaries, keys, text and variables', () => {
  assert.throws(() => validateCatalog('empty', {}), /missing en translation dictionary/);
  assert.throws(() => validateCatalog('array-base', { en: [] }), /missing en translation dictionary/);
  assert.throws(() => validateCatalog('missing-language', { en: { key: 'Value' } }), /missing es translation dictionary/);
  assert.throws(() => validateCatalog('missing-key', {
    en: { key: 'Value', other: 'Other' }, es: { key: 'Valor' },
  }), /missing key other/);
  assert.throws(() => validateCatalog('empty-text', {
    en: { key: 'Value' }, es: { key: '   ' },
  }), /non-empty text/);
  assert.throws(() => validateCatalog('non-text', {
    en: { key: 'Value' }, es: { key: 7 },
  }), /non-empty text/);
  assert.throws(() => validateCatalog('variables', {
    en: { key: '{count} values' }, es: { key: '{total} valores' },
  }), /interpolation variables differ/);
  assert.throws(() => validateCatalog('unexpected', {
    en: { key: 'Value' }, es: { key: 'Valor', extra: 'Extra' },
  }), /unexpected key extra/);
  assert.throws(() => validateHtmlKeys('page', '<p data-i18n="missing"></p>', {
    en: {}, es: {},
  }), /missing is missing from en/);
  assert.throws(() => validateHtmlKeys('page-missing-language', '<p data-i18n="missing"></p>', { en: {} }), /missing is missing from es/);
});

test('translation hooks reject whitespace-only keys', () => {
  assert.throws(
    () => validateHtmlKeys('page', '<p data-i18n="   "></p>', { en: {}, es: {} }),
    /cannot be empty/,
  );
});
