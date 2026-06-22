import {catalog,topics} from '../src/data/topics.js';
import {computeDepths,topologicalSort} from '../src/lib/graph.js';
const fail=message=>{throw new Error(message)};
if(topics.length<60)fail(`Expected a substantial catalog; found ${topics.length} topics.`);
const ids=new Set(),domainIds=new Set(catalog.domains.map(x=>x.id)),levelIds=new Set(catalog.levels.map(x=>x.id)),areaIds=new Set(catalog.areas.map(x=>x.id)),titles={en:new Set(),es:new Set()};
for(const topic of topics){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.id))fail(`Invalid id: ${topic.id}`);
 if(ids.has(topic.id))fail(`Duplicate id: ${topic.id}`);
 if(!domainIds.has(topic.domain))fail(`${topic.id}: unknown domain ${topic.domain}`);
 if(!levelIds.has(topic.level))fail(`${topic.id}: unknown level ${topic.level}`);
 if(!areaIds.has(topic.area))fail(`${topic.id}: unknown area ${topic.area}`);
 if(!Number.isFinite(topic.estimatedHours)||topic.estimatedHours<=0)fail(`${topic.id}: invalid estimatedHours`);
 for(const language of ['en','es']){
  if(!topic.title?.[language]?.trim())fail(`${topic.id}: missing ${language} title`);
  if(!topic.summary?.[language]?.trim())fail(`${topic.id}: missing ${language} summary`);
  if(!Array.isArray(topic.concepts?.[language])||topic.concepts[language].length<3)fail(`${topic.id}: needs at least 3 ${language} concepts`);
  const normalized=topic.title[language].trim().toLowerCase();if(titles[language].has(normalized))fail(`Duplicate ${language} title: ${topic.title[language]}`);titles[language].add(normalized);
 }
 if(new Set(topic.prerequisites).size!==topic.prerequisites.length)fail(`${topic.id}: duplicate prerequisite`);
 for(const prerequisite of topic.prerequisites){if(prerequisite===topic.id)fail(`${topic.id}: self prerequisite`);if(!ids.has(prerequisite))fail(`${topic.id}: prerequisite ${prerequisite} must exist earlier in topological source order`);}
 if(!Array.isArray(topic.keywords)||topic.keywords.length<4)fail(`${topic.id}: insufficient search keywords`);
 ids.add(topic.id);
}
const ordered=topologicalSort(topics),depths=computeDepths(topics),roots=topics.filter(x=>x.prerequisites.length===0);
if(ordered.length!==topics.length)fail('Topological sort lost topics.');
if(roots.length===0)fail('Graph has no roots.');
if(Math.max(...depths.values())<8)fail('Graph is unexpectedly shallow.');
console.log(`Validated ${topics.length} topics, ${topics.reduce((n,t)=>n+t.prerequisites.length,0)} prerequisite edges, ${roots.length} roots, maximum depth ${Math.max(...depths.values())}.`);
