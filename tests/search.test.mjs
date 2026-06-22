import test from 'node:test';
import assert from 'node:assert/strict';
import {topics} from '../src/data/topics.js';
import {normalizeText,searchTopics} from '../src/lib/search.js';

test('normalization removes accents and punctuation',()=>assert.equal(normalizeText('Álgebra — Lineal!'),'algebra lineal'));
test('English title search ranks exact subject first',()=>assert.equal(searchTopics(topics,'linear algebra','en')[0]?.topic.id,'linear-algebra'));
test('Spanish search finds translated content',()=>assert.equal(searchTopics(topics,'relatividad general','es')[0]?.topic.id,'general-relativity'));
test('concept search finds topic',()=>assert.equal(searchTopics(topics,'Feynman diagrams','en')[0]?.topic.id,'quantum-field-theory'));
test('unknown query returns no results',()=>assert.deepEqual(searchTopics(topics,'zzzz-unfindable','en'),[]));

test('topic search covers empty queries, alternate-language matches and deterministic ties', () => {
  assert.deepEqual(searchTopics(topics, '   ', 'en'), []);
  const fixture = [
    {
      id: 'b', title: { en: 'Zulu', es: 'Aguja' },
      summary: { en: 'plain', es: 'plain' },
      concepts: { en: ['other'], es: [] }, keywords: [], area: 'x', domain: 'math', level: 'foundation',
    },
    {
      id: 'a', title: { en: 'Able', es: 'Needle' },
      summary: { en: 'plain', es: 'plain' },
      concepts: { en: [], es: [] }, keywords: [], area: 'x', domain: 'math', level: 'foundation',
    },
    {
      id: 'c', title: { en: 'Middle needle phrase', es: 'Otro' },
      summary: { en: 'needle', es: 'plain' },
      concepts: { en: [], es: [] }, keywords: [], area: 'x', domain: 'math', level: 'foundation',
    },
  ];
  assert.equal(searchTopics(/** @type {any} */ (fixture), 'aguja', 'en')[0].topic.id, 'b');
  const tied = searchTopics(/** @type {any} */ (fixture.slice(0, 2)), 'plain', 'en');
  assert.deepEqual(tied.map((item) => item.topic.id), ['a', 'b']);
});
