import test from 'node:test';
import assert from 'node:assert/strict';
import {topics} from '../src/data/topics.js';
import {computeDepths,createEdgePath,createLayout,getAncestors,getDescendants,getLearningPath,getProgressStats,getRecommendedTopics,indexTopics,isUnlocked,topologicalSort} from '../src/lib/graph.js';

test('catalog is a valid DAG',()=>{
 const ordered=topologicalSort(topics);
 assert.equal(ordered.length,topics.length);
 const seen=new Set();
 for(const topic of ordered){for(const prerequisite of topic.prerequisites)assert.ok(seen.has(prerequisite));seen.add(topic.id);}
});

test('depth and layout cover every topic',()=>{
 const depths=computeDepths(topics),layout=createLayout(topics);
 assert.equal(depths.size,topics.length);
 assert.equal(layout.positions.size,topics.length);
 assert.ok(layout.width>1000);
 assert.ok(layout.height>500);
 for(const point of layout.positions.values()){assert.ok(Number.isFinite(point.x));assert.ok(Number.isFinite(point.y));}
});

test('learning path contains target and all ancestors in order',()=>{
 const path=getLearningPath('quantum-field-theory',topics),ids=new Set(path.map(x=>x.id));
 assert.equal(path.at(-1)?.id,'quantum-field-theory');
 assert.ok(ids.has('arithmetic'));
 assert.ok(ids.has('special-relativity'));
 assert.ok(ids.has('fourier-analysis'));
 for(const topic of path)for(const prerequisite of topic.prerequisites)assert.ok(ids.has(prerequisite));
});

test('ancestor and descendant traversal is directional',()=>{
 const byId=indexTopics(topics),ancestors=getAncestors('general-relativity',byId),descendants=getDescendants('arithmetic',topics);
 assert.ok(ancestors.has('differential-geometry'));
 assert.ok(ancestors.has('special-relativity'));
 assert.ok(!ancestors.has('cosmology'));
 assert.ok(descendants.has('cosmology'));
 assert.ok(!descendants.has('arithmetic'));
});

test('unlock and recommendation logic respects mastered prerequisites',()=>{
 const arithmetic=topics.find(x=>x.id==='arithmetic'),algebra=topics.find(x=>x.id==='elementary-algebra');
 assert.ok(arithmetic&&algebra);
 assert.equal(isUnlocked(arithmetic,{}),true);
 assert.equal(isUnlocked(algebra,{}),false);
 assert.equal(isUnlocked(algebra,{arithmetic:'mastered'}),true);
 const recommendations=getRecommendedTopics(topics,{arithmetic:'mastered'},20);
 assert.ok(recommendations.some(x=>x.id==='elementary-algebra'));
});

test('progress stats and edge paths are deterministic',()=>{
 const stats=getProgressStats(topics,{arithmetic:'mastered','elementary-algebra':'learning'});
 assert.equal(stats.mastered,1);assert.equal(stats.learning,1);assert.equal(stats.total,topics.length);
 assert.match(createEdgePath({x:0,y:0,depth:0,order:0},{x:300,y:100,depth:1,order:0}),/^M /);
});
