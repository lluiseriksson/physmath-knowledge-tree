// @ts-check
/** @typedef {import('./types.js').Topic} Topic */
/** @typedef {import('./types.js').Language} Language */
export function normalizeText(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
/** @param {Topic} topic @param {Language} language */
export function topicSearchText(topic,language){const alt=language==='en'?'es':'en';return normalizeText([topic.title[language],topic.title[alt],topic.summary[language],topic.summary[alt],...topic.concepts.en,...topic.concepts.es,...topic.keywords,topic.area,topic.domain,topic.level].join(' '));}
/** @param {Topic[]} topics @param {string} query @param {Language} language @param {number} [limit] */
export function searchTopics(topics,query,language,limit=12){const q=normalizeText(query);if(!q)return [];const terms=q.split(/\s+/);return topics.map(topic=>{const title=normalizeText(topic.title[language]),alt=normalizeText(topic.title[language==='en'?'es':'en']),hay=topicSearchText(topic,language);if(!terms.every(x=>hay.includes(x)))return {topic,score:-1};let score=0;if(title===q)score+=100;if(title.startsWith(q))score+=50;if(title.includes(q))score+=30;if(alt.includes(q))score+=15;for(const x of terms)score+=title.startsWith(x)?8:title.includes(x)?5:1;return {topic,score:score-title.length/1000};}).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score||a.topic.title[language].localeCompare(b.topic.title[language])).slice(0,limit);}
