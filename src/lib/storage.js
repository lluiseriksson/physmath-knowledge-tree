// @ts-check
/** @typedef {import('./types.js').AppProgress} AppProgress */
/** @typedef {import('./types.js').ProgressStatus} ProgressStatus */
export const STORAGE_KEY='physmath-knowledge-tree:progress:v1';
export const PREFERENCE_KEY='physmath-knowledge-tree:preferences:v1';
/** @returns {AppProgress} */
export function createEmptyProgress(){return {schemaVersion:1,statuses:{},favorites:[],updatedAt:new Date().toISOString()};}
/** @param {unknown} input @param {Set<string>} validIds @returns {AppProgress} */
export function sanitizeProgress(input,validIds){const empty=createEmptyProgress();if(!input||typeof input!=='object')return empty;const c=/** @type {Record<string,unknown>} */(input),raw=c.statuses&&typeof c.statuses==='object'?/** @type {Record<string,unknown>} */(c.statuses):{},statuses={};for(const [id,s]of Object.entries(raw))if(validIds.has(id)&&['not-started','learning','mastered'].includes(String(s)))statuses[id]=/** @type {ProgressStatus} */(s);const favorites=Array.isArray(c.favorites)?c.favorites.filter(id=>typeof id==='string'&&validIds.has(id)):[];const updatedAt=typeof c.updatedAt==='string'&&!Number.isNaN(Date.parse(c.updatedAt))?c.updatedAt:empty.updatedAt;return {schemaVersion:1,statuses,favorites:[...new Set(favorites)],updatedAt};}
/** @param {Set<string>} validIds @param {Storage} [storage] */
export function loadProgress(validIds,storage=localStorage){try{const raw=storage.getItem(STORAGE_KEY);return raw?sanitizeProgress(JSON.parse(raw),validIds):createEmptyProgress();}catch{return createEmptyProgress();}}
/** @param {AppProgress} progress @param {Storage} [storage] */
export function saveProgress(progress,storage=localStorage){const next={...progress,updatedAt:new Date().toISOString()};storage.setItem(STORAGE_KEY,JSON.stringify(next));return next;}
/** @param {AppProgress} progress */
export function exportProgress(progress){return JSON.stringify({application:'PhysMath Knowledge Tree',exportedAt:new Date().toISOString(),progress},null,2);}
/** @param {string} text @param {Set<string>} validIds */
export function importProgress(text,validIds){const parsed=JSON.parse(text),payload=parsed&&typeof parsed==='object'&&'progress'in parsed?parsed.progress:parsed;return sanitizeProgress(payload,validIds);}
export function loadPreference(key,fallback){try{const raw=localStorage.getItem(PREFERENCE_KEY),x=raw?JSON.parse(raw):{};return typeof x?.[key]==='string'?x[key]:fallback;}catch{return fallback;}}
export function savePreference(key,value){try{const raw=localStorage.getItem(PREFERENCE_KEY),x=raw?JSON.parse(raw):{};localStorage.setItem(PREFERENCE_KEY,JSON.stringify({...x,[key]:value}));}catch{}}
