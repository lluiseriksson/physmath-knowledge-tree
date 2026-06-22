import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,topics} from '../src/data/topics.js';

test('catalog has broad bilingual coverage',()=>{assert.equal(topics.length,90);assert.equal(catalog.domains.length,3);for(const topic of topics){assert.ok(topic.title.en&&topic.title.es);assert.ok(topic.summary.en&&topic.summary.es);assert.equal(topic.concepts.en.length,3);assert.equal(topic.concepts.es.length,3);}});
test('all taxonomies are used',()=>{const domains=new Set(topics.map(x=>x.domain)),levels=new Set(topics.map(x=>x.level)),areas=new Set(topics.map(x=>x.area));for(const x of catalog.domains)assert.ok(domains.has(x.id));for(const x of catalog.levels)assert.ok(levels.has(x.id));for(const x of catalog.areas)assert.ok(areas.has(x.id));});
