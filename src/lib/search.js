// @ts-check
import { compareNormalizedText, compareText, normalizeText } from './text.js';
export { normalizeText } from './text.js';
/** @typedef {import('./types.js').Topic} Topic */
/** @typedef {import('./types.js').Language} Language */

/** @param {Topic} topic @param {Language} language */
export function topicSearchText(topic, language) {
  const alternateLanguage = language === 'en' ? 'es' : 'en';
  return normalizeText([
    topic.title[language], topic.title[alternateLanguage],
    topic.summary[language], topic.summary[alternateLanguage],
    ...topic.concepts.en, ...topic.concepts.es, ...topic.keywords,
    topic.area, topic.domain, topic.level,
  ].join(' '));
}

/** @param {Topic[]} topics @param {string} query @param {Language} language @param {number} [limit] */
export function searchTopics(topics, query, language, limit = 12) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(/\s+/);
  return topics
    .map((topic) => {
      const title = normalizeText(topic.title[language]);
      const alternateTitle = normalizeText(topic.title[language === 'en' ? 'es' : 'en']);
      const haystack = topicSearchText(topic, language);
      if (!terms.every((term) => haystack.includes(term))) return { topic, score: -1 };
      let score = 0;
      if (title === normalizedQuery) score += 100;
      if (title.startsWith(normalizedQuery)) score += 50;
      if (title.includes(normalizedQuery)) score += 30;
      if (alternateTitle.includes(normalizedQuery)) score += 15;
      for (const term of terms) score += title.startsWith(term) ? 8 : title.includes(term) ? 5 : 1;
      return { topic, score: score - title.length / 1000 };
    })
    .filter((result) => result.score >= 0)
    .sort((left, right) =>
      right.score - left.score
      || compareNormalizedText(left.topic.title[language], right.topic.title[language])
      || compareText(left.topic.id, right.topic.id))
    .slice(0, Math.max(0, Math.floor(limit)));
}
