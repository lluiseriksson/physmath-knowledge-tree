// @ts-check
/** @typedef {import('./types.js').Topic} Topic */
/** @typedef {import('./types.js').ProgressStatus} ProgressStatus */
/** @typedef {import('./types.js').GraphPoint} GraphPoint */
export const NODE_WIDTH=218;
export const NODE_HEIGHT=68;
/** @param {Topic[]} topics */
export function indexTopics(topics){return new Map(topics.map(t=>[t.id,t]));}
/** @param {Topic[]} topics @returns {Topic[]} */
export function topologicalSort(topics){
 const byId=indexTopics(topics), indegree=new Map(topics.map(t=>[t.id,0])), children=new Map(topics.map(t=>[t.id,[]]));
 for(const t of topics)for(const p of t.prerequisites){if(!byId.has(p))throw new Error(`Topic "${t.id}" references missing prerequisite "${p}".`);indegree.set(t.id,(indegree.get(t.id)||0)+1);children.get(p)?.push(t.id);}
 const order=new Map(topics.map((t,i)=>[t.id,i]));const queue=topics.filter(t=>indegree.get(t.id)===0),sorted=[];
 while(queue.length){queue.sort((a,b)=>(order.get(a.id)||0)-(order.get(b.id)||0));const cur=queue.shift();if(!cur)break;sorted.push(cur);for(const id of children.get(cur.id)||[]){const n=(indegree.get(id)||1)-1;indegree.set(id,n);if(n===0){const child=byId.get(id);if(child)queue.push(child);}}}
 if(sorted.length!==topics.length){const unresolved=topics.filter(t=>!sorted.some(x=>x.id===t.id));throw new Error(`Cycle detected: ${unresolved.map(x=>x.id).join(', ')}`);}return sorted;
}
/** @param {Topic[]} topics */
export function computeDepths(topics){const d=new Map();for(const t of topologicalSort(topics)){d.set(t.id,t.prerequisites.length?Math.max(...t.prerequisites.map(id=>d.get(id)||0))+1:0);}return d;}
/** @param {Topic[]} topics @param {{horizontalGap?:number,verticalGap?:number,margin?:number}} [options] */
export function createLayout(topics,options={}){
 const hg=options.horizontalGap??96,vg=options.verticalGap??30,m=options.margin??72,d=computeDepths(topics),max=Math.max(0,...d.values()),layers=Array.from({length:max+1},()=>[]),domainOrder=new Map([['math',0],['bridge',1],['physics',2]]);
 for(const t of topics)layers[d.get(t.id)||0].push(t);
 for(const layer of layers)layer.sort((a,b)=>(domainOrder.get(a.domain)||0)-(domainOrder.get(b.domain)||0)||a.area.localeCompare(b.area)||a.id.localeCompare(b.id));
 const maxSize=Math.max(1,...layers.map(x=>x.length)),width=m*2+(max+1)*NODE_WIDTH+max*hg,height=m*2+maxSize*NODE_HEIGHT+Math.max(0,maxSize-1)*vg,positions=new Map();
 layers.forEach((layer,depth)=>{const lh=layer.length*NODE_HEIGHT+Math.max(0,layer.length-1)*vg,off=m+(height-m*2-lh)/2;layer.forEach((t,order)=>positions.set(t.id,{x:m+depth*(NODE_WIDTH+hg),y:off+order*(NODE_HEIGHT+vg),depth,order}));});
 return {positions,width,height,maxDepth:max};
}
/** @param {string} id @param {Map<string,Topic>} byId */
export function getAncestors(id,byId){const out=new Set();const visit=x=>{const t=byId.get(x);if(!t)return;for(const p of t.prerequisites)if(!out.has(p)){out.add(p);visit(p);}};visit(id);return out;}
/** @param {string} id @param {Topic[]} topics */
export function getDescendants(id,topics){const out=new Set(),children=new Map(topics.map(t=>[t.id,[]]));for(const t of topics)for(const p of t.prerequisites)children.get(p)?.push(t.id);const visit=x=>{for(const c of children.get(x)||[])if(!out.has(c)){out.add(c);visit(c);}};visit(id);return out;}
/** @param {string} id @param {Topic[]} topics */
export function getLearningPath(id,topics){const byId=indexTopics(topics);if(!byId.has(id))return [];const ids=getAncestors(id,byId);ids.add(id);return topologicalSort(topics.filter(t=>ids.has(t.id)));}
/** @param {Topic} topic @param {Record<string,ProgressStatus>} statuses */
export function isUnlocked(topic,statuses){return topic.prerequisites.every(id=>statuses[id]==='mastered');}
/** @param {Topic[]} topics @param {Record<string,ProgressStatus>} statuses @param {number} [limit] */
export function getRecommendedTopics(topics,statuses,limit=6){const levels=new Map([['foundation',0],['intermediate',1],['advanced',2]]);return topics.filter(t=>statuses[t.id]!=='mastered'&&isUnlocked(t,statuses)).sort((a,b)=>(statuses[a.id]==='learning'?0:1)-(statuses[b.id]==='learning'?0:1)||(levels.get(a.level)||0)-(levels.get(b.level)||0)||a.estimatedHours-b.estimatedHours||a.id.localeCompare(b.id)).slice(0,limit);}
/** @param {Topic[]} topics @param {Record<string,ProgressStatus>} statuses */
export function getProgressStats(topics,statuses){const c={mastered:0,learning:0,notStarted:0,total:topics.length};for(const t of topics){const s=statuses[t.id]||'not-started';if(s==='mastered')c.mastered++;else if(s==='learning')c.learning++;else c.notStarted++;}return {...c,percent:topics.length?Math.round(c.mastered/topics.length*100):0};}
/** @param {GraphPoint} source @param {GraphPoint} target */
export function createEdgePath(source,target){const sx=source.x+NODE_WIDTH,sy=source.y+NODE_HEIGHT/2,ex=target.x,ey=target.y+NODE_HEIGHT/2,c=Math.max(44,(ex-sx)*.48);return `M ${sx} ${sy} C ${sx+c} ${sy}, ${ex-c} ${ey}, ${ex} ${ey}`;}
