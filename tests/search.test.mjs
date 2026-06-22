import test from 'node:test';
import assert from 'node:assert/strict';
import {topics} from '../src/data/topics.js';
import {normalizeText,searchTopics} from '../src/lib/search.js';

test('normalization removes accents and punctuation',()=>assert.equal(normalizeText('Álgebra — Lineal!'),'algebra lineal'));
test('English title search ranks exact subject first',()=>assert.equal(searchTopics(topics,'linear algebra','en')[0]?.topic.id,'linear-algebra'));
test('Spanish search finds translated content',()=>assert.equal(searchTopics(topics,'relatividad general','es')[0]?.topic.id,'general-relativity'));
test('concept search finds topic',()=>assert.equal(searchTopics(topics,'Feynman diagrams','en')[0]?.topic.id,'quantum-field-theory'));
test('unknown query returns no results',()=>assert.deepEqual(searchTopics(topics,'zzzz-unfindable','en'),[]));
