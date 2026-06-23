/** Return the named interpolation variables used by one message. */
export function messageVariables(message) {
  return [...new Set(
    [...String(message).matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/gu)].map((match) => match[1]),
  )].sort();
}

/** Collect translation keys declared through static data-i18n hooks. */
export function htmlTranslationKeys(html) {
  return [...String(html).matchAll(/\bdata-i18n(?:-placeholder|-aria)?="([^"]+)"/gu)]
    .map((match) => match[1]);
}

/** Validate language parity, message text and interpolation variables. */
export function validateCatalog(name, catalog, languages = ['en', 'es']) {
  const errors = [];
  const baseLanguage = languages[0];
  const base = catalog?.[baseLanguage];
  if (!base || typeof base !== 'object' || Array.isArray(base)) {
    throw new Error(`${name}: missing ${baseLanguage} translation dictionary`);
  }
  const baseKeys = Object.keys(base).sort();
  for (const language of languages) {
    const dictionary = catalog?.[language];
    if (!dictionary || typeof dictionary !== 'object' || Array.isArray(dictionary)) {
      errors.push(`${name}: missing ${language} translation dictionary`);
      continue;
    }
    const keys = Object.keys(dictionary).sort();
    for (const key of baseKeys) {
      if (!Object.hasOwn(dictionary, key)) {
        errors.push(`${name}.${language}: missing key ${key}`);
        continue;
      }
      if (typeof dictionary[key] !== 'string' || !dictionary[key].trim()) {
        errors.push(`${name}.${language}.${key}: translation must be non-empty text`);
        continue;
      }
      const expectedVariables = messageVariables(base[key]);
      const actualVariables = messageVariables(dictionary[key]);
      if (expectedVariables.join('\0') !== actualVariables.join('\0')) {
        errors.push(`${name}.${language}.${key}: interpolation variables differ from ${baseLanguage}`);
      }
    }
    for (const key of keys) {
      if (!Object.hasOwn(base, key)) errors.push(`${name}.${language}: unexpected key ${key}`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return baseKeys.length;
}

/** Ensure every static HTML translation hook exists in the catalog. */
export function validateHtmlKeys(name, html, catalog, languages = ['en', 'es']) {
  const keys = [...new Set(htmlTranslationKeys(html))].sort();
  const errors = [];
  for (const key of keys) {
    if (!key.trim()) {
      errors.push(`${name}: translation hooks cannot be empty`);
      continue;
    }
    for (const language of languages) {
      if (!Object.hasOwn(catalog?.[language] ?? {}, key)) {
        errors.push(`${name}: ${key} is missing from ${language}`);
      }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return keys.length;
}
