import test from 'node:test';
import assert from 'node:assert/strict';
import {createEmptyProgress,exportProgress,importProgress,loadProgress,sanitizeProgress,saveProgress,STORAGE_KEY} from '../src/lib/storage.js';
class MemoryStorage{map=new Map();getItem(k){return this.map.get(k)??null}setItem(k,v){this.map.set(k,String(v))}removeItem(k){this.map.delete(k)}}
const ids=new Set(['arithmetic','vectors']);
test('sanitization drops unknown topics and statuses',()=>{const p=sanitizeProgress({statuses:{arithmetic:'mastered',ghost:'mastered',vectors:'invalid'},favorites:['vectors','ghost','vectors'],updatedAt:'2026-01-01T00:00:00Z'},ids);assert.deepEqual(p.statuses,{arithmetic:'mastered'});assert.deepEqual(p.favorites,['vectors']);});
test('save/load round trip works with a storage adapter',()=>{const storage=new MemoryStorage(),p=createEmptyProgress();p.statuses.arithmetic='learning';saveProgress(p,storage);assert.ok(storage.getItem(STORAGE_KEY));assert.equal(loadProgress(ids,storage).statuses.arithmetic,'learning');});
test('export/import accepts wrapped and bare data',()=>{const p=createEmptyProgress();p.favorites=['vectors'];assert.deepEqual(importProgress(exportProgress(p),ids).favorites,['vectors']);assert.equal(importProgress(JSON.stringify(p),ids).schemaVersion,1);});
test('malformed storage falls back safely',()=>{const storage=new MemoryStorage();storage.setItem(STORAGE_KEY,'{bad');assert.equal(loadProgress(ids,storage).schemaVersion,1);});
